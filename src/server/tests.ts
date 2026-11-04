import "server-only";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { db, schema, type AttemptSection } from "@/db";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { mockPlan } from "@/data/patterns";
import { getProvider } from "@/lib/ai";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";
import { recordMistakes } from "./progress";

const FULL_SIZE = 25;
const TOPIC_SIZE = 15;
/** Late submissions within this window still count (slow networks, auto-submit at 0:00). */
const GRACE_MS = 2 * 60_000;

export type PublicQuestion = Pick<MCQ, "id" | "question" | "options" | "topicId" | "difficulty" | "source" | "pyq">;

export interface StartOptions {
  topicIds?: string[];
  /** A single section of the exam's paper pattern, by its subject name. */
  section?: string;
}

/** Marking for an attempt: marks per question and the fraction lost per wrong answer. */
export function markingFor(examId: string) {
  const exam = EXAM_BY_ID.get(examId);
  const plan = exam ? mockPlan(exam) : null;
  return { marks: plan?.pattern.marks ?? 1, negative: plan?.pattern.negative ?? exam?.negativeMarking ?? 0 };
}

/**
 * Builds the paper. A full mock follows the exam's pattern (see data/patterns.ts) section by
 * section; a section test is one of those sections on its own; a topic test is 15 questions on
 * the chosen topics; exams without a pattern get the generic 25-question mock.
 */
async function buildPaper(examId: string, opts: StartOptions) {
  const exam = EXAM_BY_ID.get(examId);
  if (!exam) throw new HttpError(400, "Unknown exam.");
  const allowed = examTopicIds(exam);
  const provider = getProvider();
  const plan = mockPlan(exam);

  if (opts.section) {
    const s = plan?.sections.find((x) => x.subject === opts.section);
    if (!s) throw new HttpError(400, "This exam has no such section.");
    const questions = await provider.practiceQuestions({ topicIds: s.topicIds, count: s.questions });
    const minutes = scaledMinutes(s.minutes, questions.length, s.questions);
    return { kind: "section" as const, topicIds: s.topicIds, questions, minutes, sections: [{ name: s.subject, from: 0, count: questions.length, minutes }], sectional: false };
  }

  if (opts.topicIds?.length) {
    const topicIds = opts.topicIds.filter((t) => allowed.includes(t));
    if (!topicIds.length) throw new HttpError(400, "This exam has no practice topics yet.");
    const questions = await provider.practiceQuestions({ topicIds, count: TOPIC_SIZE });
    return { kind: "topic" as const, topicIds, questions, minutes: questions.length, sections: null, sectional: false };
  }

  if (!plan) {
    if (!allowed.length) throw new HttpError(400, "This exam has no practice topics yet.");
    const questions = await provider.practiceQuestions({ topicIds: allowed, count: FULL_SIZE });
    return { kind: "full" as const, topicIds: allowed, questions, minutes: questions.length, sections: null, sectional: false };
  }

  const questions: MCQ[] = [];
  const sections: AttemptSection[] = [];
  const seen = new Set<string>();
  for (const s of plan.sections) {
    const qs = (await provider.practiceQuestions({ topicIds: s.topicIds, count: s.questions })).filter((q) => !seen.has(q.question));
    qs.forEach((q) => seen.add(q.question));
    if (!qs.length) continue;
    sections.push({ name: s.subject, from: questions.length, count: qs.length, minutes: scaledMinutes(s.minutes, qs.length, s.questions) });
    questions.push(...qs);
  }
  return { kind: "full" as const, topicIds: allowed, questions, minutes: sections.reduce((n, s) => n + s.minutes, 0), sections, sectional: !!plan.pattern.sectional };
}

/** Keeps the pace of the real paper when a section has fewer questions than the pattern asks for. */
const scaledMinutes = (minutes: number, got: number, wanted: number) => (got >= wanted ? minutes : Math.max(1, Math.round((minutes * got) / wanted)));

export async function startTest(user: SessionUser, examId: string, opts: StartOptions = {}) {
  // Build the paper before taking the credit, so a failure here never costs the user anything.
  const paper = await buildPaper(examId, opts);
  if (!paper.questions.length) throw new HttpError(500, "Could not prepare questions. Please try again.");
  const { marks, negative } = markingFor(examId);

  return db.transaction(async (tx) => {
    // Claim the exam's free test; the composite primary key makes this race-free.
    const free = await tx.insert(schema.freeTests).values({ userId: user.id, examId }).onConflictDoNothing().returning({ examId: schema.freeTests.examId });
    let paidWith: "free" | "credit" = "free";
    let credits: number;
    if (free.length) {
      const [u] = await tx.select({ credits: schema.users.credits }).from(schema.users).where(eq(schema.users.id, user.id));
      credits = u.credits;
    } else {
      // Atomic decrement: two simultaneous starts can never spend the same credit.
      const [u] = await tx
        .update(schema.users)
        .set({ credits: sql`${schema.users.credits} - 1` })
        .where(and(eq(schema.users.id, user.id), sql`${schema.users.credits} > 0`))
        .returning({ credits: schema.users.credits });
      if (!u) throw new HttpError(402, "You’ve used your free test and have no credits left.", "no_credits");
      paidWith = "credit";
      credits = u.credits;
    }

    const deadlineAt = new Date(Date.now() + paper.minutes * 60_000);
    const [attempt] = await tx
      .insert(schema.testAttempts)
      .values({ userId: user.id, examId, kind: paper.kind, topicIds: paper.topicIds, questions: paper.questions, sections: paper.sections, sectional: paper.sectional, paidWith, deadlineAt })
      .returning({ id: schema.testAttempts.id });

    return {
      attemptId: attempt.id,
      kind: paper.kind,
      paidWith,
      credits,
      deadline: deadlineAt.getTime(),
      negativeMarking: negative,
      marks,
      sections: paper.sections,
      sectional: paper.sectional,
      questions: paper.questions.map(({ id, question, options, topicId, difficulty, source, pyq }): PublicQuestion => ({ id, question, options, topicId, difficulty, source, pyq })),
    };
  });
}

type Attempt = typeof schema.testAttempts.$inferSelect;

/** Everything the review and analysis screens need for a submitted attempt. */
function review(attempt: Attempt, answers: (number | null)[], times: number[] | null, late = false) {
  const { marks, negative } = markingFor(attempt.examId);
  return {
    attemptId: attempt.id,
    examId: attempt.examId,
    kind: attempt.kind,
    negativeMarking: negative,
    marks,
    correct: attempt.correct ?? 0,
    wrong: attempt.wrong ?? 0,
    skipped: attempt.skipped ?? 0,
    score: attempt.score ?? 0,
    questions: attempt.questions,
    answers,
    times,
    sections: attempt.sections,
    sectional: attempt.sectional,
    startedAt: attempt.startedAt.getTime(),
    submittedAt: attempt.submittedAt?.getTime() ?? null,
    late,
  };
}

export async function submitTest(user: SessionUser, attemptId: string, answers: (number | null)[], times?: number[]) {
  const [attempt] = await db
    .select()
    .from(schema.testAttempts)
    .where(and(eq(schema.testAttempts.id, attemptId), eq(schema.testAttempts.userId, user.id)))
    .limit(1);
  if (!attempt) throw new HttpError(404, "Test not found.");

  // Submitting twice (double click, retry after a network error) returns the first result.
  if (attempt.submittedAt) return review(attempt, attempt.answers ?? [], attempt.times);

  const qs = attempt.questions;
  if (answers.length !== qs.length) throw new HttpError(400, "Answer count doesn’t match the test.");
  const clean = answers.map((a, i) => (a === null || !Number.isInteger(a) || a < 0 || a >= qs[i].options.length ? null : a));
  // Per-question seconds come from the browser; they are capped so a stalled tab cannot report hours.
  const span = Math.ceil((attempt.deadlineAt.getTime() - attempt.startedAt.getTime()) / 1000) + GRACE_MS / 1000;
  const cleanTimes = times && times.length === qs.length ? times.map((t) => (Number.isFinite(t) && t > 0 ? Math.min(Math.round(t), span) : 0)) : null;
  const late = Date.now() > attempt.deadlineAt.getTime() + GRACE_MS;

  let correct = 0;
  let wrong = 0;
  const perTopic = new Map<string, { attempted: number; correct: number }>();
  const outcomes: { questionId: string; topicId: string; correct: boolean }[] = [];
  clean.forEach((a, i) => {
    if (a === null) return;
    const ok = a === qs[i].answer;
    ok ? correct++ : wrong++;
    const t = qs[i].topicId;
    if (t) {
      const s = perTopic.get(t) ?? { attempted: 0, correct: 0 };
      s.attempted++;
      if (ok) s.correct++;
      perTopic.set(t, s);
      outcomes.push({ questionId: qs[i].id, topicId: t, correct: ok });
    }
  });
  const skipped = qs.length - correct - wrong;
  const { negative } = markingFor(attempt.examId);
  const score = Math.round((correct - wrong * negative) * 100) / 100;

  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .update(schema.testAttempts)
      .set({ submittedAt: new Date(), answers: clean, times: cleanTimes, correct, wrong, skipped, score })
      .where(and(eq(schema.testAttempts.id, attemptId), isNull(schema.testAttempts.submittedAt)))
      .returning({ id: schema.testAttempts.id });
    if (rows.length && perTopic.size) {
      await tx
        .insert(schema.topicStats)
        .values([...perTopic].map(([topicId, s]) => ({ userId: user.id, topicId, attempted: s.attempted, correct: s.correct })))
        .onConflictDoUpdate({
          target: [schema.topicStats.userId, schema.topicStats.topicId],
          set: {
            attempted: sql`${schema.topicStats.attempted} + excluded.attempted`,
            correct: sql`${schema.topicStats.correct} + excluded.correct`,
            lastPracticed: sql`now()`,
          },
        });
      await recordMistakes(tx, user.id, outcomes);
    }
    return rows.length > 0;
  });

  if (!updated) return submitTest(user, attemptId, answers, times); // a concurrent submit won; return its result
  return { ...review({ ...attempt, correct, wrong, skipped, score, submittedAt: new Date() }, clean, cleanTimes, late) };
}

/** A submitted attempt, for the analysis screen. */
export async function getAttempt(user: SessionUser, attemptId: string) {
  const [attempt] = await db
    .select()
    .from(schema.testAttempts)
    .where(and(eq(schema.testAttempts.id, attemptId), eq(schema.testAttempts.userId, user.id)))
    .limit(1);
  if (!attempt?.submittedAt) throw new HttpError(404, "Test not found.");
  return review(attempt, attempt.answers ?? [], attempt.times);
}

/** The user's submitted tests, newest first, without the questions. */
export async function listAttempts(user: SessionUser, limit = 30) {
  const rows = await db
    .select({
      id: schema.testAttempts.id,
      examId: schema.testAttempts.examId,
      kind: schema.testAttempts.kind,
      topicIds: schema.testAttempts.topicIds,
      correct: schema.testAttempts.correct,
      wrong: schema.testAttempts.wrong,
      skipped: schema.testAttempts.skipped,
      score: schema.testAttempts.score,
      submittedAt: schema.testAttempts.submittedAt,
      total: sql<number>`jsonb_array_length(${schema.testAttempts.questions})`,
    })
    .from(schema.testAttempts)
    .where(and(eq(schema.testAttempts.userId, user.id), isNotNull(schema.testAttempts.submittedAt)))
    .orderBy(desc(schema.testAttempts.submittedAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, ...markingFor(r.examId), submittedAt: r.submittedAt!.getTime() }));
}
