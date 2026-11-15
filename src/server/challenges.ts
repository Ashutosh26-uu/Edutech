import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { getProvider } from "@/lib/ai";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";
import { newCode, normaliseCode } from "./batches";
import { HttpError } from "./http";
import type { PublicQuestion } from "./tests";

/**
 * 1-vs-1 challenges: a student makes a set of 10 questions from their exam, shares the link, and
 * everyone who opens it answers the same set. Each player can play once; answers and explanations
 * are shown only to players who have finished, so the link never carries the key.
 */

export const CHALLENGE_SIZE = 10;
const LIFETIME_MS = 14 * 86_400_000;
/** At most this many players on one challenge (it is a head-to-head, not a contest). */
const MAX_PLAYERS = 50;

const c = schema.challenges;
const p = schema.challengePlays;

const publicQs = (qs: MCQ[]) =>
  qs.map(({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }): PublicQuestion => ({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }));

export async function createChallenge(user: SessionUser, examId: string, topicIds?: string[]) {
  const exam = EXAM_BY_ID.get(examId);
  if (!exam) throw new HttpError(400, "Unknown exam.");
  const allowed = examTopicIds(exam);
  const picked = topicIds?.length ? topicIds.filter((t) => allowed.includes(t)) : allowed;
  if (!picked.length) throw new HttpError(400, "This exam has no practice topics yet.");
  const questions = (await getProvider().practiceQuestions({ topicIds: picked, count: CHALLENGE_SIZE })).slice(0, CHALLENGE_SIZE);
  if (questions.length < 5) throw new HttpError(500, "Could not prepare questions. Please try again.");
  for (let i = 0; i < 5; i++) {
    const rows = await db
      .insert(c)
      .values({ id: newCode(), creatorId: user.id, examId, topicIds: picked, questions, expiresAt: new Date(Date.now() + LIFETIME_MS) })
      .onConflictDoNothing({ target: c.id })
      .returning({ id: c.id });
    if (rows.length) return { id: rows[0].id };
  }
  throw new HttpError(500, "Could not create the challenge. Please try again.");
}

async function load(id: string) {
  const code = normaliseCode(id);
  const [row] = code.length === 6 ? await db.select().from(c).where(eq(c.id, code)).limit(1) : [];
  if (!row || row.expiresAt.getTime() < Date.now()) throw new HttpError(404, "This challenge link has expired or doesn’t exist.");
  return row;
}

async function board(challengeId: string) {
  const rows = await db
    .select({ userId: p.userId, name: schema.users.name, email: schema.users.email, correct: p.correct, wrong: p.wrong, seconds: p.seconds, playedAt: p.playedAt })
    .from(p)
    .innerJoin(schema.users, eq(schema.users.id, p.userId))
    .where(eq(p.challengeId, challengeId))
    .orderBy(asc(p.playedAt));
  // Higher score first; a tie goes to the faster player.
  return rows
    .map((r) => ({ userId: r.userId, name: r.name?.trim() || r.email.split("@")[0], correct: r.correct, wrong: r.wrong, seconds: r.seconds, playedAt: r.playedAt.getTime() }))
    .sort((a, b) => b.correct - a.correct || a.seconds - b.seconds);
}

/** What the challenge page shows: who made it, the players' scores, and the questions (keys only after playing). */
export async function getChallenge(user: SessionUser | null, id: string) {
  const ch = await load(id);
  const players = await board(ch.id);
  const [creator] = await db.select({ name: schema.users.name, email: schema.users.email }).from(schema.users).where(eq(schema.users.id, ch.creatorId)).limit(1);
  const mine = user ? await db.select().from(p).where(and(eq(p.challengeId, ch.id), eq(p.userId, user.id))).limit(1) : [];
  const played = mine[0] ?? null;
  return {
    id: ch.id,
    examId: ch.examId,
    examName: EXAM_BY_ID.get(ch.examId)?.name ?? ch.examId,
    creator: creator?.name?.trim() || creator?.email.split("@")[0] || "A friend",
    isCreator: user?.id === ch.creatorId,
    total: ch.questions.length,
    expiresAt: ch.expiresAt.getTime(),
    full: players.length >= MAX_PLAYERS,
    players: players.map(({ userId, ...r }) => ({ ...r, me: userId === user?.id })),
    // Unplayed: questions without answers (to play). Played: the full set with the player's answers.
    questions: played ? ch.questions : user ? publicQs(ch.questions) : [],
    answers: played?.answers ?? null,
  };
}

export async function playChallenge(user: SessionUser, id: string, answers: (number | null)[], seconds: number) {
  const ch = await load(id);
  if (answers.length !== ch.questions.length) throw new HttpError(400, "Answer count doesn’t match the challenge.");
  const clean = answers.map((a, i) => (a === null || !Number.isInteger(a) || a < 0 || a >= ch.questions[i].options.length ? null : a));
  const correct = clean.filter((a, i) => a !== null && a === ch.questions[i].answer).length;
  const wrong = clean.filter((a) => a !== null).length - correct;
  const secs = Number.isFinite(seconds) ? Math.max(1, Math.min(Math.round(seconds), 3600)) : 3600;
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(p).where(eq(p.challengeId, ch.id));
  if (n >= MAX_PLAYERS) throw new HttpError(409, "This challenge is full. Start your own and share it.", "challenge_full");
  // One go each: a second submit keeps the first result.
  await db.insert(p).values({ challengeId: ch.id, userId: user.id, answers: clean, correct, wrong, seconds: secs }).onConflictDoNothing();
  return getChallenge(user, ch.id);
}

/** The user's recent challenges (made or played), newest first, for the challenge page. */
export async function myChallenges(user: SessionUser) {
  const rows = await db.execute<{ id: string; exam_id: string; created_at: string; players: number; mine: boolean }>(sql`
    select ${c.id} as id, ${c.examId} as exam_id, ${c.createdAt} as created_at,
      (select count(*)::int from ${p} where ${p.challengeId} = ${sql.raw('"challenges"."id"')}) as players,
      ${c.creatorId} = ${user.id} as mine
    from ${c}
    where ${c.expiresAt} > now() and (${c.creatorId} = ${user.id} or exists (select 1 from ${p} where ${p.challengeId} = ${sql.raw('"challenges"."id"')} and ${p.userId} = ${user.id}))
    order by ${c.createdAt} desc
    limit 20`);
  return rows.map((r) => ({ id: r.id, examName: EXAM_BY_ID.get(r.exam_id)?.name ?? r.exam_id, createdAt: new Date(r.created_at).getTime(), players: Number(r.players), mine: r.mine }));
}
