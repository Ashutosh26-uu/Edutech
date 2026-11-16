import "server-only";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { istWeek, windowOf } from "@/lib/weekly";

/** Late submissions within this window still count (slow networks, auto-submit at 0:00). */
export const GRACE_MS = 2 * 60_000;

type AttemptLike = { kind: string; startedAt: Date; batchTestId: string | null };

/**
 * Shared papers (the Sunday mock, batch tests) are the same for every taker, so their answers and
 * explanations stay hidden until the paper closes: the Sunday window's close (plus the grace for
 * late submissions), or the batch test's answer time (its due time, or when the trainer releases
 * them). Returns when the answers open (Infinity = held by the trainer), or null if they are open.
 */
export async function answersOpenAt(attempt: AttemptLike, now = Date.now()): Promise<number | null> {
  let at = 0;
  if (attempt.kind === "weekly") at = windowOf(istWeek(attempt.startedAt.getTime())).closesAt + GRACE_MS;
  else if (attempt.kind === "batch" && attempt.batchTestId) {
    const [t] = await db.select({ answersAt: schema.batchTests.answersAt }).from(schema.batchTests).where(eq(schema.batchTests.id, attempt.batchTestId)).limit(1);
    if (t) at = t.answersAt?.getTime() ?? Infinity;
  }
  return at > now ? at : null;
}

/**
 * Bank question ids whose answers the user must not see yet: papers they are still taking (any
 * timed test before its deadline), shared papers they submitted whose answers are still hidden,
 * and challenges they opened but have not played. Practice and the mistake notebook skip these,
 * so a paper's key can't be pulled out through them while it is open.
 */
export async function lockedQuestionIds(userId: string, now = Date.now()): Promise<Set<string>> {
  const ta = schema.testAttempts;
  const [attempts, challenges] = await Promise.all([
    db
      .select({ kind: ta.kind, startedAt: ta.startedAt, batchTestId: ta.batchTestId, submittedAt: ta.submittedAt, questions: ta.questions })
      .from(ta)
      .where(
        and(
          eq(ta.userId, userId),
          or(
            and(isNull(ta.submittedAt), gt(ta.deadlineAt, new Date(now - GRACE_MS))),
            and(sql`${ta.kind} in ('weekly', 'batch')`, gt(ta.startedAt, new Date(now - 60 * 86_400_000))),
          ),
        ),
      ),
    db
      .select({ questions: schema.challenges.questions })
      .from(schema.challengeStarts)
      .innerJoin(schema.challenges, eq(schema.challenges.id, schema.challengeStarts.challengeId))
      .leftJoin(schema.challengePlays, and(eq(schema.challengePlays.challengeId, schema.challengeStarts.challengeId), eq(schema.challengePlays.userId, userId)))
      .where(and(eq(schema.challengeStarts.userId, userId), isNull(schema.challengePlays.userId), gt(schema.challenges.expiresAt, new Date(now)))),
  ]);
  const ids = new Set<string>();
  for (const a of attempts) {
    const open = a.submittedAt === null || (await answersOpenAt(a, now)) !== null;
    if (open) a.questions.forEach((q) => ids.add(q.id));
  }
  for (const c of challenges) c.questions.forEach((q) => ids.add(q.id));
  return ids;
}
