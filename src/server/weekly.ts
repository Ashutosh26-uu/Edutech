import "server-only";
import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { shuffleOptions } from "@/lib/ai/local";
import { weeklyPaper, type WeeklyPaper } from "@/lib/weekly-paper";
import { WEEKLY_EXAMS, isWeeklyExam, istDateTime, lastClosedWindow, nextWindow, statusAt, windowOf, istWeek, type WeekWindow } from "@/lib/weekly";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";
import { rankAgainst, weeklyRankFilter } from "./quality";
import { markingFor, type PublicQuestion } from "./tests";

/**
 * The Sunday All-India Mock (see lib/weekly.ts for the schedule and lib/weekly-paper.ts for the
 * paper). It is free: it never touches the free test or credits. Each user gets one attempt per
 * exam per week.
 */

const TOP = 10;

// A week's paper is the same for everyone, so each server instance builds it once.
const papers = new Map<string, Promise<WeeklyPaper>>();
function paperFor(examId: string, week: string) {
  const key = `${week}:${examId}`;
  let p = papers.get(key);
  if (!p) {
    if (papers.size > 32) papers.clear();
    p = weeklyPaper(examId, week).catch((e) => {
      papers.delete(key);
      throw e;
    });
    papers.set(key, p);
  }
  return p;
}

const publicQuestions = (qs: WeeklyPaper["questions"]) =>
  qs.map(({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }): PublicQuestion => ({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }));

/** The user's attempt in a week's window, if any. */
function attemptIn(userId: string, examId: string, w: WeekWindow) {
  const t = schema.testAttempts;
  return and(eq(t.userId, userId), eq(t.examId, examId), eq(t.kind, "weekly"), gte(t.startedAt, new Date(w.opensAt)), lt(t.startedAt, new Date(w.closesAt)));
}

export async function startWeekly(user: SessionUser, examId: string) {
  if (!isWeeklyExam(examId)) throw new HttpError(400, "There is no Sunday mock for this exam.");
  const now = Date.now();
  const w = windowOf(istWeek(now));
  const status = statusAt(w, now);
  if (status === "upcoming") throw new HttpError(409, `This week’s mock opens ${istDateTime(w.opensAt)} (India time).`, "weekly_not_open");
  if (status === "closed" || w.closesAt - now < 60_000) throw new HttpError(409, "This week’s mock has closed. See the results on the Sunday mock page.", "weekly_closed");

  // Build the paper before the transaction, so it holds no connection while questions load.
  const paper = await paperFor(examId, w.week);
  if (!paper.questions.length) throw new HttpError(500, "Could not prepare questions. Please try again.");
  const { marks, negative } = markingFor(examId);
  const t = schema.testAttempts;

  return db.transaction(async (tx) => {
    // Locking the user's row queues two simultaneous starts, so the second sees the first attempt.
    await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, user.id)).for("update");
    const [taken] = await tx.select().from(t).where(attemptIn(user.id, examId, w)).limit(1);
    if (taken) {
      // A start that was cut off (closed tab, lost network) resumes the same attempt until its deadline.
      if (!taken.submittedAt && taken.deadlineAt.getTime() > now + 30_000) return started(taken, marks, negative, user.credits);
      throw new HttpError(409, "You’ve already taken this week’s mock for this exam. Your rank is on the Sunday mock page.", "weekly_taken");
    }
    // Each student gets their own option order; answers are stored per attempt, so scoring is unaffected.
    const questions = paper.questions.map((q) => shuffleOptions(q));
    // The paper closes with the window: a late start gets the time that is left.
    const deadlineAt = new Date(Math.min(now + paper.minutes * 60_000, w.closesAt));
    const [attempt] = await tx
      .insert(t)
      .values({ userId: user.id, examId, kind: "weekly", topicIds: paper.topicIds, questions, sections: paper.sections, sectional: paper.sectional, paidWith: "weekly", deadlineAt })
      .returning();
    return started(attempt, marks, negative, user.credits);
  });
}

function started(a: typeof schema.testAttempts.$inferSelect, marks: number, negative: number, credits: number) {
  return {
    attemptId: a.id,
    kind: "weekly" as const,
    paidWith: "weekly" as const,
    credits,
    deadline: a.deadlineAt.getTime(),
    negativeMarking: negative,
    marks,
    sections: a.sections,
    sectional: a.sectional,
    questions: publicQuestions(a.questions),
  };
}

/** Public name on the leaderboard: a first-name initial when the user set a name, never an email. */
const displayName = (name: string | null, position: number) => {
  const initial = name?.trim().charAt(0).toUpperCase();
  return initial && /\p{L}/u.test(initial) ? `${initial}.` : `Student #${position}`;
};

// Closed weeks never change, so their leaderboards are kept once read.
const boards = new Map<string, Promise<{ takers: number; top: { position: number; rank: number; name: string; score: number; userId: string }[] }>>();

async function leaderboard(examId: string, w: WeekWindow, final: boolean) {
  const key = `${w.week}:${examId}`;
  const hit = final ? boards.get(key) : undefined;
  if (hit) return hit;
  const t = schema.testAttempts;
  const p = (async () => {
    const where = weeklyRankFilter(examId, w);
    const [{ takers }] = await db.select({ takers: sql<number>`count(distinct ${t.userId})::int` }).from(t).where(where);
    const rows = await db
      .select({ userId: t.userId, score: t.score, name: schema.users.name })
      .from(t)
      .innerJoin(schema.users, eq(schema.users.id, t.userId))
      .where(where)
      // Equal scores: the faster paper goes first on the board (both keep the same rank).
      .orderBy(desc(t.score), asc(sql`${t.submittedAt} - ${t.startedAt}`))
      .limit(TOP);
    const top = rows.map((r, i) => ({
      position: i + 1,
      // Every higher score is above this row on the board, so the rank is exact.
      rank: rows.filter((x) => (x.score ?? 0) > (r.score ?? 0)).length + 1,
      name: displayName(r.name, i + 1),
      score: r.score ?? 0,
      userId: r.userId,
    }));
    return { takers, top };
  })();
  if (final) {
    if (boards.size > 64) boards.clear();
    boards.set(key, p.catch((e) => (boards.delete(key), Promise.reject(e))));
  }
  return p;
}

async function myResult(user: SessionUser, examId: string, w: WeekWindow) {
  const t = schema.testAttempts;
  const [a] = await db
    .select({ id: t.id, score: t.score, submittedAt: t.submittedAt, deadlineAt: t.deadlineAt, n: sql<number>`jsonb_array_length(${t.questions})` })
    .from(t)
    .where(attemptIn(user.id, examId, w))
    .limit(1);
  if (!a) return null;
  if (!a.submittedAt || a.score === null) return { attemptId: a.id, submitted: false as const, inProgress: a.deadlineAt.getTime() > Date.now(), total: a.n };
  const standing = await rankAgainst(weeklyRankFilter(examId, w), a.score, user.id);
  return { attemptId: a.id, submitted: true as const, score: a.score, total: a.n, ...standing };
}

/** Everything /mock-sunday shows: each exam's next window, the user's attempt, and the last closed week's leaderboard. */
export async function weeklyOverview(user: SessionUser | null) {
  const now = Date.now();
  const next = nextWindow(now);
  const last = lastClosedWindow(now);
  const exams = await Promise.all(
    WEEKLY_EXAMS.map(async (exam) => {
      const { marks } = markingFor(exam.id);
      const status = statusAt(next, now);
      const [current, mine, board, mineLast] = await Promise.all([
        status === "live" ? leaderboard(exam.id, next, false).then((b) => ({ takers: b.takers })) : Promise.resolve({ takers: 0 }),
        user && status === "live" ? myResult(user, exam.id, next) : Promise.resolve(null),
        leaderboard(exam.id, last, true),
        user ? myResult(user, exam.id, last) : Promise.resolve(null),
      ]);
      return {
        examId: exam.id,
        marks,
        current: { ...next, status, takers: current.takers, mine },
        last: { ...last, takers: board.takers, top: board.top.map(({ userId, ...r }) => ({ ...r, you: !!user && userId === user.id })), mine: mineLast },
      };
    }),
  );
  return { now, exams };
}
