import "server-only";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { findQuestions } from "@/lib/bank";
import { shuffleOptions } from "@/lib/ai/local";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";

/**
 * Account progress: per-topic accuracy and the mistake notebook. Timed tests write here from
 * tests.ts; untimed practice posts its answers to /api/progress.
 */

export interface Outcome {
  questionId: string;
  topicId: string;
  correct: boolean;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Wrong answers go into the notebook (or bump their count); a right answer to a question that is
 * already in it marks it resolved. Only bank questions are kept: generated Quant questions have
 * one-off ids and cannot be replayed.
 */
export async function recordMistakes(tx: Tx, userId: string, outcomes: Outcome[]) {
  const known = await findQuestions(outcomes.map((o) => o.questionId));
  const bank = outcomes.filter((o) => known.has(o.questionId));
  const wrong = bank.filter((o) => !o.correct);
  const right = bank.filter((o) => o.correct).map((o) => o.questionId);
  if (wrong.length) {
    await tx
      .insert(schema.mistakes)
      .values(wrong.map((o) => ({ userId, questionId: o.questionId, topicId: o.topicId })))
      .onConflictDoUpdate({
        target: [schema.mistakes.userId, schema.mistakes.questionId],
        set: { timesWrong: sql`${schema.mistakes.timesWrong} + 1`, lastWrongAt: sql`now()`, resolvedAt: null },
      });
  }
  if (right.length) {
    await tx
      .update(schema.mistakes)
      .set({ resolvedAt: new Date() })
      .where(and(eq(schema.mistakes.userId, userId), inArray(schema.mistakes.questionId, right), isNull(schema.mistakes.resolvedAt)));
  }
}

/** Untimed practice: updates topic accuracy and the mistake notebook. */
export async function recordPractice(user: SessionUser, outcomes: Outcome[]) {
  const perTopic = new Map<string, { attempted: number; correct: number }>();
  for (const o of outcomes) {
    const s = perTopic.get(o.topicId) ?? { attempted: 0, correct: 0 };
    s.attempted++;
    if (o.correct) s.correct++;
    perTopic.set(o.topicId, s);
  }
  if (!perTopic.size) return;
  await db.transaction(async (tx) => {
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
  });
}

export async function getProgress(user: SessionUser) {
  const [topics, open] = await Promise.all([
    db.select().from(schema.topicStats).where(eq(schema.topicStats.userId, user.id)),
    db
      .select({ questionId: schema.mistakes.questionId, topicId: schema.mistakes.topicId, timesWrong: schema.mistakes.timesWrong, lastWrongAt: schema.mistakes.lastWrongAt })
      .from(schema.mistakes)
      .where(and(eq(schema.mistakes.userId, user.id), isNull(schema.mistakes.resolvedAt)))
      .orderBy(desc(schema.mistakes.lastWrongAt))
      .limit(500),
  ]);
  return {
    topics: Object.fromEntries(topics.map((t) => [t.topicId, { attempted: t.attempted, correct: t.correct, lastPracticed: t.lastPracticed.getTime() }])),
    mistakes: open.map((m) => ({ ...m, lastWrongAt: m.lastWrongAt.getTime() })),
  };
}

/** The user's open mistakes as a practice set, most recent first, with options shuffled. */
export async function mistakesSet(user: SessionUser, topicId?: string, limit = 20): Promise<MCQ[]> {
  const rows = await db
    .select({ questionId: schema.mistakes.questionId })
    .from(schema.mistakes)
    .where(and(eq(schema.mistakes.userId, user.id), isNull(schema.mistakes.resolvedAt), ...(topicId ? [eq(schema.mistakes.topicId, topicId)] : [])))
    .orderBy(desc(schema.mistakes.lastWrongAt))
    .limit(limit);
  const bank = await findQuestions(rows.map((r) => r.questionId));
  return rows.flatMap((r) => {
    const q = bank.get(r.questionId);
    return q ? [shuffleOptions(q)] : [];
  });
}
