import "server-only";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { getProvider } from "@/lib/ai";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

const FULL_SIZE = 25;
const TOPIC_SIZE = 15;
/** Late submissions within this window still count (slow networks, auto-submit at 0:00). */
const GRACE_MS = 2 * 60_000;

export type PublicQuestion = Pick<MCQ, "id" | "question" | "options" | "topicId">;

export async function startTest(user: SessionUser, examId: string, requestedTopics: string[] = []) {
  const exam = EXAM_BY_ID.get(examId);
  if (!exam) throw new HttpError(400, "Unknown exam.");
  const allowed = examTopicIds(exam);
  const topicIds = requestedTopics.length ? requestedTopics.filter((t) => allowed.includes(t)) : allowed;
  if (!topicIds.length) throw new HttpError(400, "This exam has no practice topics yet.");
  const kind = requestedTopics.length ? "topic" : "full";
  const size = kind === "topic" ? TOPIC_SIZE : FULL_SIZE;

  // Build the paper before taking the credit, so a failure here never costs the user anything.
  const questions = await getProvider().practiceQuestions({ topicIds, count: size });
  if (!questions.length) throw new HttpError(500, "Could not prepare questions. Please try again.");

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

    const deadlineAt = new Date(Date.now() + questions.length * 60_000);
    const [attempt] = await tx
      .insert(schema.testAttempts)
      .values({ userId: user.id, examId, kind, topicIds, questions, paidWith, deadlineAt })
      .returning({ id: schema.testAttempts.id });

    return {
      attemptId: attempt.id,
      kind,
      paidWith,
      credits,
      deadline: deadlineAt.getTime(),
      negativeMarking: exam.negativeMarking ?? 0,
      questions: questions.map(({ id, question, options, topicId }): PublicQuestion => ({ id, question, options, topicId })),
    };
  });
}

export async function submitTest(user: SessionUser, attemptId: string, answers: (number | null)[]) {
  const [attempt] = await db
    .select()
    .from(schema.testAttempts)
    .where(and(eq(schema.testAttempts.id, attemptId), eq(schema.testAttempts.userId, user.id)))
    .limit(1);
  if (!attempt) throw new HttpError(404, "Test not found.");

  const exam = EXAM_BY_ID.get(attempt.examId);
  const negative = exam?.negativeMarking ?? 0;
  const review = (stored: (number | null)[]) => ({
    attemptId,
    negativeMarking: negative,
    correct: attempt.correct ?? 0,
    wrong: attempt.wrong ?? 0,
    skipped: attempt.skipped ?? 0,
    score: attempt.score ?? 0,
    questions: attempt.questions,
    answers: stored,
  });

  // Submitting twice (double click, retry after a network error) returns the first result.
  if (attempt.submittedAt) return review(attempt.answers ?? []);

  const qs = attempt.questions;
  if (answers.length !== qs.length) throw new HttpError(400, "Answer count doesn’t match the test.");
  const clean = answers.map((a, i) => (a === null || !Number.isInteger(a) || a < 0 || a >= qs[i].options.length ? null : a));
  const late = Date.now() > attempt.deadlineAt.getTime() + GRACE_MS;

  let correct = 0;
  let wrong = 0;
  const perTopic = new Map<string, { attempted: number; correct: number }>();
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
    }
  });
  const skipped = qs.length - correct - wrong;
  const score = Math.round((correct - wrong * negative) * 100) / 100;

  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .update(schema.testAttempts)
      .set({ submittedAt: new Date(), answers: clean, correct, wrong, skipped, score })
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
    }
    return rows.length > 0;
  });

  if (!updated) return submitTest(user, attemptId, answers); // a concurrent submit won; return its result
  return { ...review(clean), correct, wrong, skipped, score, late };
}
