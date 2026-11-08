import "server-only";
import { and, desc, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { findQuestions } from "@/lib/bank";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/**
 * Question quality and standing: user reports of faulty questions, per-question answer statistics
 * (to catch a wrong key), and a test's rank among everyone who took the same kind of test.
 */

export const REPORT_REASONS = ["wrong-answer", "wrong-question", "wrong-explanation", "duplicate", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export async function createReport(user: SessionUser | null, questionId: string, reason: ReportReason, note?: string) {
  const known = await findQuestions([questionId]);
  const q = known.get(questionId);
  // Generated Quant questions have one-off ids; a report on one cannot be acted on, so it is refused.
  if (!q) throw new HttpError(400, "This question can't be reported. Use the Contact page instead.");
  await db.insert(schema.questionReports).values({ userId: user?.id ?? null, questionId, topicId: q.topicId ?? null, reason, note: note?.trim() || null });
}

/** One answer to a bank question: the option the user picked, as its text (option order is shuffled per user). */
export interface Pick {
  questionId: string;
  chosenText: string | null;
}

/** Adds answers to question_stats. Picks are stored by the option's position in the bank, so they add up across users. */
export async function recordPicks(picks: Pick[]) {
  const bank = await findQuestions(picks.map((p) => p.questionId));
  const rows = new Map<string, { topicId: string; answered: number; correct: number; p: [number, number, number, number] }>();
  for (const { questionId, chosenText } of picks) {
    const q = bank.get(questionId);
    if (!q?.topicId || chosenText === null) continue;
    const idx = q.options.indexOf(chosenText);
    if (idx < 0 || idx > 3) continue;
    const r = rows.get(questionId) ?? { topicId: q.topicId, answered: 0, correct: 0, p: [0, 0, 0, 0] };
    r.answered++;
    if (idx === q.answer) r.correct++;
    r.p[idx]++;
    rows.set(questionId, r);
  }
  if (!rows.size) return;
  const t = schema.questionStats;
  await db
    .insert(t)
    .values([...rows].map(([questionId, r]) => ({ questionId, topicId: r.topicId, answered: r.answered, correct: r.correct, pick0: r.p[0], pick1: r.p[1], pick2: r.p[2], pick3: r.p[3] })))
    .onConflictDoUpdate({
      target: t.questionId,
      set: {
        answered: sql`${t.answered} + excluded.answered`,
        correct: sql`${t.correct} + excluded.correct`,
        pick0: sql`${t.pick0} + excluded.pick0`,
        pick1: sql`${t.pick1} + excluded.pick1`,
        pick2: sql`${t.pick2} + excluded.pick2`,
        pick3: sql`${t.pick3} + excluded.pick3`,
        updatedAt: sql`now()`,
      },
    });
}

/** Picks from a submitted test, whose questions carry their (shuffled) options. */
export const picksFromTest = (questions: MCQ[], answers: (number | null)[]): Pick[] =>
  questions.map((q, i) => ({ questionId: q.id, chosenText: answers[i] === null || answers[i] === undefined ? null : (q.options[answers[i]!] ?? null) }));

/** Below this many takers a rank says little, so the result screen shows a gentler message. */
export const MIN_FOR_PERCENTILE = 5;

/**
 * Where a submitted test stands: its score against every other user's best score on the same
 * exam and kind of test (same number of questions; for topic and section tests, the same topics).
 */
export async function getStanding(user: SessionUser, attemptId: string) {
  const t = schema.testAttempts;
  const [mine] = await db
    .select({ examId: t.examId, kind: t.kind, topicIds: t.topicIds, score: t.score, submittedAt: t.submittedAt, n: sql<number>`jsonb_array_length(${t.questions})` })
    .from(t)
    .where(and(eq(t.id, attemptId), eq(t.userId, user.id)))
    .limit(1);
  if (!mine) throw new HttpError(404, "Test not found.");
  if (!mine.submittedAt || mine.score === null) throw new HttpError(409, "Submit the test to see your rank.");
  const sameTopics = mine.kind === "full" ? sql`true` : sql`${t.topicIds} = ${mine.topicIds}`;
  const [row] = await db
    .select({ others: sql<number>`count(*)::int`, above: sql<number>`count(*) filter (where best > ${mine.score})::int`, below: sql<number>`count(*) filter (where best < ${mine.score})::int` })
    .from(
      db
        .select({ userId: t.userId, best: sql<number>`max(${t.score})`.as("best") })
        .from(t)
        .where(and(eq(t.examId, mine.examId), eq(t.kind, mine.kind), isNotNull(t.submittedAt), ne(t.userId, user.id), sql`jsonb_array_length(${t.questions}) = ${mine.n}`, sameTopics))
        .groupBy(t.userId)
        .as("b"),
    );
  const takers = row.others + 1;
  return {
    rank: row.above + 1,
    takers,
    // Share of the other takers this score beats, with ties counted as half.
    percentile: row.others ? Math.round(((row.below + (row.others - row.above - row.below) / 2) / row.others) * 1000) / 10 : null,
    enough: takers >= MIN_FOR_PERCENTILE,
  };
}

// ---------- Admin ----------

/** Open reports grouped by question, most-reported first, with the question as it stands in the bank. */
export async function listReports(status: "open" | "resolved" | "dismissed" = "open") {
  const r = schema.questionReports;
  const rows = await db.select().from(r).where(eq(r.status, status)).orderBy(desc(r.createdAt)).limit(500);
  const bank = await findQuestions(rows.map((x) => x.questionId));
  const groups = new Map<string, { question: MCQ | null; reports: { id: string; reason: ReportReason; note: string | null; createdAt: number }[] }>();
  for (const x of rows) {
    const g = groups.get(x.questionId) ?? { question: bank.get(x.questionId) ?? null, reports: [] };
    g.reports.push({ id: x.id, reason: x.reason, note: x.note, createdAt: x.createdAt.getTime() });
    groups.set(x.questionId, g);
  }
  return [...groups].map(([questionId, g]) => ({ questionId, ...g })).sort((a, b) => b.reports.length - a.reports.length);
}

/** Closes (or reopens) every report on a question at once: one fix answers them all. */
export async function setReportStatus(questionId: string, status: "open" | "resolved" | "dismissed") {
  const r = schema.questionReports;
  const from = status === "open" ? (["resolved", "dismissed"] as const) : (["open"] as const);
  const rows = await db.update(r).set({ status }).where(and(eq(r.questionId, questionId), inArray(r.status, [...from]))).returning({ id: r.id });
  return rows.length;
}

/** A key looks wrong when, after enough answers, another option is picked more often than the keyed one. */
export const SUSPECT_MIN_ANSWERS = 15;

export async function suspectKeys(limit = 100) {
  const s = schema.questionStats;
  const rows = await db.select().from(s).where(sql`${s.answered} >= ${SUSPECT_MIN_ANSWERS}`).orderBy(sql`${s.correct}::float / ${s.answered}`).limit(1000);
  const bank = await findQuestions(rows.map((x) => x.questionId));
  const out = [];
  for (const x of rows) {
    const q = bank.get(x.questionId);
    if (!q) continue;
    const picks = [x.pick0, x.pick1, x.pick2, x.pick3];
    const top = picks.indexOf(Math.max(...picks));
    if (top === q.answer) continue;
    out.push({ questionId: x.questionId, question: q, answered: x.answered, picks, topPick: top });
    if (out.length >= limit) break;
  }
  return out;
}
