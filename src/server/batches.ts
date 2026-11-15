import "server-only";
import { randomInt } from "node:crypto";
import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { BANK_SIZES } from "@/data/bank";
import { getProvider } from "@/lib/ai";
import { shuffleOptions } from "@/lib/ai/local";
import { roleEmail, type SessionUser } from "./auth";
import { HttpError } from "./http";
import { markingFor, type PublicQuestion } from "./tests";

/**
 * Trainer mode. A trainer creates batches; students join with a code; the trainer assigns fixed
 * papers and reads every member's result. Taking an assigned paper is free and allowed once.
 * Submission and scoring reuse the normal timed-test path (tests.ts → submitTest).
 */

export const LIMITS = { batchesPerTrainer: 30, testsPerBatch: 200, membersPerBatch: 1000, minQuestions: 5, maxQuestions: 100, minMinutes: 5, maxMinutes: 180 };

// No 0/O or 1/I, so codes read cleanly off a projector or a WhatsApp message.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
export const normaliseCode = (code: string) => code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

const b = schema.batches;
const m = schema.batchMembers;
const bt = schema.batchTests;
const ta = schema.testAttempts;
const tr = schema.batchTrainers;

/** The batch, if the user runs it: as its owner, or as a co-trainer the owner added by email. */
async function trainerAccess(user: SessionUser, batchId: string) {
  const [batch] = await db.select().from(b).where(eq(b.id, batchId)).limit(1);
  if (!batch) throw new HttpError(404, "Batch not found.");
  if (batch.trainerId === user.id) return { batch, owner: true };
  const email = roleEmail(user);
  const [co] = email ? await db.select({ e: tr.email }).from(tr).where(and(eq(tr.batchId, batchId), eq(tr.email, email))).limit(1) : [];
  if (co) return { batch, owner: false };
  throw new HttpError(404, "Batch not found.");
}

/** Owner or co-trainer: assign tests, read results, manage students. */
async function ownBatch(user: SessionUser, batchId: string) {
  return (await trainerAccess(user, batchId)).batch;
}

/** Owner only: delete the batch and decide who else trains it. */
async function ownerBatch(user: SessionUser, batchId: string) {
  const a = await trainerAccess(user, batchId);
  if (!a.owner) throw new HttpError(403, "Only the batch owner can do this.");
  return a.batch;
}

// Correlated subqueries name the outer column in full: drizzle drops the table name in a
// single-table select, and inside the subquery a bare "id" would mean the inner table's id.
const BATCH_ID = sql.raw(`"batches"."id"`);
const BATCH_TEST_ID = sql.raw(`"batch_tests"."id"`);

// Unverified accounts match no co-trainer row (an email can't be claimed before it is verified).
const coTrained = (user: SessionUser) => sql`${BATCH_ID} in (select ${tr.batchId} from ${tr} where ${tr.email} = ${roleEmail(user) ?? ""})`;

export async function listTrainers(user: SessionUser, batchId: string) {
  await ownBatch(user, batchId);
  const rows = await db.select().from(tr).where(eq(tr.batchId, batchId)).orderBy(asc(tr.createdAt));
  return rows.map((r) => ({ email: r.email, createdAt: r.createdAt.getTime() }));
}

export async function addTrainer(user: SessionUser, batchId: string, email: string) {
  const batch = await ownerBatch(user, batchId);
  const clean = email.trim().toLowerCase();
  if (clean === user.email.toLowerCase()) throw new HttpError(400, "You already own this batch.");
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(tr).where(eq(tr.batchId, batch.id));
  if (n >= 20) throw new HttpError(409, "A batch can have up to 20 co-trainers.");
  await db.insert(tr).values({ batchId: batch.id, email: clean, addedBy: user.id }).onConflictDoNothing();
}

export async function removeTrainer(user: SessionUser, batchId: string, email: string) {
  await ownerBatch(user, batchId);
  await db.delete(tr).where(and(eq(tr.batchId, batchId), eq(tr.email, email.trim().toLowerCase())));
}

export async function createBatch(user: SessionUser, input: { name: string; institution?: string }) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(b).where(eq(b.trainerId, user.id));
  if (n >= LIMITS.batchesPerTrainer) throw new HttpError(409, `You can run up to ${LIMITS.batchesPerTrainer} batches.`);
  for (let tries = 0; tries < 5; tries++) {
    const rows = await db
      .insert(b)
      .values({ trainerId: user.id, name: input.name.trim(), institution: input.institution?.trim() || null, joinCode: newCode() })
      .onConflictDoNothing({ target: b.joinCode })
      .returning();
    if (rows.length) return rows[0];
  }
  throw new HttpError(500, "Could not create the batch. Please try again.");
}

export async function joinBatch(user: SessionUser, code: string) {
  const joinCode = normaliseCode(code);
  if (joinCode.length !== 6) throw new HttpError(400, "Batch codes have 6 letters and numbers.");
  const [batch] = await db.select().from(b).where(eq(b.joinCode, joinCode)).limit(1);
  if (!batch) throw new HttpError(404, "No batch has this code. Check it with your trainer.");
  if (batch.trainerId === user.id) throw new HttpError(409, "This is your own batch.");
  const [co] = await db.select({ e: tr.email }).from(tr).where(and(eq(tr.batchId, batch.id), eq(tr.email, user.email.toLowerCase()))).limit(1);
  if (co) throw new HttpError(409, "You’re a trainer of this batch.");
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(m).where(eq(m.batchId, batch.id));
  if (n >= LIMITS.membersPerBatch) throw new HttpError(409, "This batch is full.");
  await db.insert(m).values({ batchId: batch.id, userId: user.id }).onConflictDoNothing();
  return { id: batch.id, name: batch.name, institution: batch.institution };
}

export async function leaveBatch(user: SessionUser, batchId: string) {
  await db.delete(m).where(and(eq(m.batchId, batchId), eq(m.userId, user.id)));
}

/** Everything /batches shows: batches the user runs, and batches they joined with their assigned papers. */
export async function myBatches(user: SessionUser) {
  const teaching = await db
    .select({
      id: b.id,
      name: b.name,
      institution: b.institution,
      joinCode: b.joinCode,
      createdAt: b.createdAt,
      owner: sql<boolean>`${b.trainerId} = ${user.id}`,
      members: sql<number>`(select count(*)::int from ${m} where ${m.batchId} = ${BATCH_ID})`,
      tests: sql<number>`(select count(*)::int from ${bt} where ${bt.batchId} = ${BATCH_ID})`,
    })
    .from(b)
    .where(or(eq(b.trainerId, user.id), coTrained(user)))
    .orderBy(desc(b.createdAt));

  const joined = await db
    .select({ id: b.id, name: b.name, institution: b.institution, trainer: schema.users.name })
    .from(m)
    .innerJoin(b, eq(b.id, m.batchId))
    .innerJoin(schema.users, eq(schema.users.id, b.trainerId))
    .where(eq(m.userId, user.id))
    .orderBy(desc(m.joinedAt));

  const ids = joined.map((j) => j.id);
  const tests = ids.length
    ? await db
        .select({
          id: bt.id,
          batchId: bt.batchId,
          title: bt.title,
          minutes: bt.minutes,
          dueAt: bt.dueAt,
          createdAt: bt.createdAt,
          total: sql<number>`jsonb_array_length(${bt.questions})`,
          attemptId: ta.id,
          submittedAt: ta.submittedAt,
          deadlineAt: ta.deadlineAt,
          score: ta.score,
          correct: ta.correct,
        })
        .from(bt)
        .leftJoin(ta, and(eq(ta.batchTestId, bt.id), eq(ta.userId, user.id)))
        .where(inArray(bt.batchId, ids))
        .orderBy(desc(bt.createdAt))
    : [];

  const now = Date.now();
  return {
    teaching: teaching.map((t) => ({ ...t, createdAt: t.createdAt.getTime() })),
    joined: joined.map((j) => ({
      ...j,
      trainer: j.trainer ?? "Your trainer",
      tests: tests
        .filter((t) => t.batchId === j.id)
        .map((t) => ({
          id: t.id,
          title: t.title,
          minutes: t.minutes,
          total: t.total,
          dueAt: t.dueAt?.getTime() ?? null,
          status: t.submittedAt ? ("done" as const) : t.attemptId && t.deadlineAt && t.deadlineAt.getTime() > now ? ("in-progress" as const) : t.attemptId ? ("expired" as const) : t.dueAt && t.dueAt.getTime() < now ? ("missed" as const) : ("open" as const),
          score: t.submittedAt ? t.score : null,
          attemptId: t.submittedAt ? t.attemptId : null,
        })),
    })),
  };
}

/** The trainer's view of one batch: members and assigned papers with how many have submitted. */
export async function batchDetail(user: SessionUser, batchId: string) {
  const { batch, owner } = await trainerAccess(user, batchId);
  const trainers = await db.select({ email: tr.email }).from(tr).where(eq(tr.batchId, batchId)).orderBy(asc(tr.createdAt));
  const members = await db
    .select({ userId: m.userId, joinedAt: m.joinedAt, name: schema.users.name, email: schema.users.email })
    .from(m)
    .innerJoin(schema.users, eq(schema.users.id, m.userId))
    .where(eq(m.batchId, batchId))
    .orderBy(asc(m.joinedAt));
  const tests = await db
    .select({
      id: bt.id,
      title: bt.title,
      examId: bt.examId,
      minutes: bt.minutes,
      dueAt: bt.dueAt,
      createdAt: bt.createdAt,
      total: sql<number>`jsonb_array_length(${bt.questions})`,
      submitted: sql<number>`(select count(*)::int from ${ta} where ${ta.batchTestId} = ${BATCH_TEST_ID} and ${ta.submittedAt} is not null)`,
      average: sql<number | null>`(select avg(${ta.score})::float from ${ta} where ${ta.batchTestId} = ${BATCH_TEST_ID} and ${ta.submittedAt} is not null)`,
    })
    .from(bt)
    .where(eq(bt.batchId, batchId))
    .orderBy(desc(bt.createdAt));
  return {
    batch: { id: batch.id, name: batch.name, institution: batch.institution, joinCode: batch.joinCode, createdAt: batch.createdAt.getTime() },
    owner,
    trainers: trainers.map((t) => t.email),
    members: members.map((x) => ({ ...x, name: x.name ?? x.email.split("@")[0], joinedAt: x.joinedAt.getTime() })),
    tests: tests.map((t) => ({ ...t, dueAt: t.dueAt?.getTime() ?? null, createdAt: t.createdAt.getTime() })),
  };
}

export async function removeMember(user: SessionUser, batchId: string, userId: string) {
  await ownBatch(user, batchId);
  await db.delete(m).where(and(eq(m.batchId, batchId), eq(m.userId, userId)));
}

export async function deleteBatch(user: SessionUser, batchId: string) {
  await ownerBatch(user, batchId);
  await db.delete(b).where(eq(b.id, batchId));
}

/** Topics that have questions, from an exam track or a chosen list. */
function usableTopics(examId: string, topicIds?: string[]) {
  if (examId !== "custom") {
    const exam = EXAM_BY_ID.get(examId);
    if (!exam) throw new HttpError(400, "Unknown exam track.");
    const all = examTopicIds(exam).filter((t) => (BANK_SIZES[t] ?? 0) > 0);
    const picked = topicIds?.length ? all.filter((t) => topicIds.includes(t)) : all;
    if (!picked.length) throw new HttpError(400, "This exam track has no practice questions for the chosen topics.");
    return picked;
  }
  const picked = (topicIds ?? []).filter((t) => TOPIC_BY_ID.has(t) && (BANK_SIZES[t] ?? 0) > 0);
  if (!picked.length) throw new HttpError(400, "Pick at least one topic that has questions.");
  return picked;
}

export async function createBatchTest(
  user: SessionUser,
  batchId: string,
  input: { title: string; examId: string; topicIds?: string[]; count: number; minutes: number; dueAt?: number | null },
) {
  await ownBatch(user, batchId);
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(bt).where(eq(bt.batchId, batchId));
  if (n >= LIMITS.testsPerBatch) throw new HttpError(409, `A batch can have up to ${LIMITS.testsPerBatch} tests.`);
  if (input.dueAt && input.dueAt < Date.now() + 10 * 60_000) throw new HttpError(400, "Set the due time at least 10 minutes from now.");
  const topicIds = usableTopics(input.examId, input.topicIds);
  // The provider may pad a small set up to its minimum; the trainer gets exactly what they asked for.
  const questions = (await getProvider().practiceQuestions({ topicIds, count: input.count })).slice(0, input.count);
  if (questions.length < LIMITS.minQuestions) throw new HttpError(500, "Could not prepare enough questions. Try more topics or fewer questions.");
  const [row] = await db
    .insert(bt)
    .values({ batchId, title: input.title.trim(), examId: input.examId, topicIds, questions, minutes: input.minutes, dueAt: input.dueAt ? new Date(input.dueAt) : null })
    .returning({ id: bt.id });
  return { id: row.id, questions: questions.length };
}

export async function deleteBatchTest(user: SessionUser, testId: string) {
  const [t] = await db.select({ batchId: bt.batchId }).from(bt).where(eq(bt.id, testId)).limit(1);
  if (!t) throw new HttpError(404, "Test not found.");
  await ownBatch(user, t.batchId);
  await db.delete(bt).where(eq(bt.id, testId));
}

const publicQuestions = (qs: { id: string; question: string; options: string[]; questionHi?: string; optionsHi?: string[]; topicId?: string; difficulty?: PublicQuestion["difficulty"]; source?: string; pyq?: boolean }[]) =>
  qs.map(({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }): PublicQuestion => ({ id, question, options, questionHi, optionsHi, topicId, difficulty, source, pyq }));

/** What the test page shows before starting: title, size, time, due date and whether it can be taken. */
export async function batchTestInfo(user: SessionUser, testId: string) {
  const [t] = await db
    .select({ id: bt.id, batchId: bt.batchId, title: bt.title, examId: bt.examId, minutes: bt.minutes, dueAt: bt.dueAt, total: sql<number>`jsonb_array_length(${bt.questions})`, batch: b.name, trainerId: b.trainerId })
    .from(bt)
    .innerJoin(b, eq(b.id, bt.batchId))
    .where(eq(bt.id, testId))
    .limit(1);
  if (!t) throw new HttpError(404, "Test not found.");
  const [member] = await db.select({ u: m.userId }).from(m).where(and(eq(m.batchId, t.batchId), eq(m.userId, user.id))).limit(1);
  const email = roleEmail(user);
  const isTrainer = t.trainerId === user.id || (!!email && (await db.select({ e: tr.email }).from(tr).where(and(eq(tr.batchId, t.batchId), eq(tr.email, email))).limit(1)).length > 0);
  if (!member && !isTrainer) throw new HttpError(404, "Test not found.");
  const [attempt] = await db.select({ id: ta.id, submittedAt: ta.submittedAt, deadlineAt: ta.deadlineAt }).from(ta).where(and(eq(ta.batchTestId, testId), eq(ta.userId, user.id))).limit(1);
  const { marks, negative } = markingFor(t.examId);
  return {
    id: t.id,
    title: t.title,
    batch: t.batch,
    total: t.total,
    minutes: t.minutes,
    dueAt: t.dueAt?.getTime() ?? null,
    marks,
    negativeMarking: negative,
    isTrainer,
    attempt: attempt ? { id: attempt.id, submitted: !!attempt.submittedAt, inProgress: !attempt.submittedAt && attempt.deadlineAt.getTime() > Date.now() } : null,
  };
}

export async function startBatchTest(user: SessionUser, testId: string) {
  const [t] = await db.select().from(bt).where(eq(bt.id, testId)).limit(1);
  if (!t) throw new HttpError(404, "Test not found.");
  const now = Date.now();
  if (t.dueAt && t.dueAt.getTime() < now + 60_000) throw new HttpError(409, "This test has closed.", "batch_closed");
  const { marks, negative } = markingFor(t.examId);

  return db.transaction(async (tx) => {
    const [member] = await tx.select({ u: m.userId }).from(m).where(and(eq(m.batchId, t.batchId), eq(m.userId, user.id))).limit(1);
    if (!member) throw new HttpError(403, "Join the batch to take this test.");
    // Locking the user's row queues two simultaneous starts, so the second sees the first attempt.
    await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, user.id)).for("update");
    const [taken] = await tx.select().from(ta).where(and(eq(ta.batchTestId, testId), eq(ta.userId, user.id))).limit(1);
    if (taken) {
      if (!taken.submittedAt && taken.deadlineAt.getTime() > now + 30_000) return started(taken, marks, negative);
      throw new HttpError(409, "You’ve already taken this test.", "batch_taken");
    }
    const questions = t.questions.map((q) => shuffleOptions(q));
    const deadlineAt = new Date(Math.min(now + t.minutes * 60_000, t.dueAt?.getTime() ?? Infinity));
    const [attempt] = await tx
      .insert(ta)
      .values({ userId: user.id, examId: t.examId, kind: "batch", topicIds: t.topicIds, questions, sections: null, sectional: false, paidWith: "batch", batchTestId: t.id, deadlineAt })
      .returning();
    return started(attempt, marks, negative);
  });
}

function started(a: typeof ta.$inferSelect, marks: number, negative: number) {
  return { attemptId: a.id, kind: "batch" as const, deadline: a.deadlineAt.getTime(), negativeMarking: negative, marks, sections: null, sectional: false, questions: publicQuestions(a.questions) };
}

/** The trainer's results for one paper: every member's row and accuracy per topic across the batch. */
export async function batchTestResults(user: SessionUser, testId: string) {
  const [t] = await db.select().from(bt).where(eq(bt.id, testId)).limit(1);
  if (!t) throw new HttpError(404, "Test not found.");
  const batch = await ownBatch(user, t.batchId);
  const members = await db
    .select({ userId: m.userId, name: schema.users.name, email: schema.users.email })
    .from(m)
    .innerJoin(schema.users, eq(schema.users.id, m.userId))
    .where(eq(m.batchId, t.batchId));
  const attempts = await db.select().from(ta).where(eq(ta.batchTestId, testId));
  const { marks, negative } = markingFor(t.examId);
  const total = t.questions.length;

  const topicTotals = new Map<string, { attempted: number; correct: number; asked: number }>();
  const rows = members.map((mem) => {
    const a = attempts.find((x) => x.userId === mem.userId);
    // Submitted after the time limit (plus the usual 2-minute grace): shown, but not ranked or averaged.
    const late = !!a?.submittedAt && a.submittedAt.getTime() > a.deadlineAt.getTime() + 2 * 60_000;
    const done = !!a?.submittedAt && !late;
    if (done && a) {
      a.questions.forEach((q, i) => {
        const topic = q.topicId ?? "other";
        const s = topicTotals.get(topic) ?? { attempted: 0, correct: 0, asked: 0 };
        s.asked++;
        const ans = a.answers?.[i];
        if (ans !== null && ans !== undefined) {
          s.attempted++;
          if (ans === q.answer) s.correct++;
        }
        topicTotals.set(topic, s);
      });
    }
    const seconds = done && a ? Math.round((a.submittedAt!.getTime() - a.startedAt.getTime()) / 1000) : null;
    return {
      userId: mem.userId,
      name: mem.name ?? mem.email.split("@")[0],
      email: mem.email,
      status: done ? ("submitted" as const) : late ? ("late" as const) : a ? ("in-progress" as const) : ("not-started" as const),
      score: done ? (a!.score ?? 0) * marks : null,
      correct: done ? a!.correct : null,
      wrong: done ? a!.wrong : null,
      skipped: done ? a!.skipped : null,
      accuracy: done && a!.correct !== null && a!.wrong !== null && a!.correct + a!.wrong > 0 ? Math.round((a!.correct / (a!.correct + a!.wrong)) * 100) : null,
      seconds,
      submittedAt: done ? a!.submittedAt!.getTime() : null,
    };
  });
  rows.sort((x, y) => (y.score ?? -Infinity) - (x.score ?? -Infinity) || x.name.localeCompare(y.name));
  const submitted = rows.filter((r) => r.status === "submitted");
  const topics = [...topicTotals]
    .map(([id, s]) => ({ id, name: TOPIC_BY_ID.get(id)?.name ?? id, asked: s.asked, attempted: s.attempted, accuracy: s.attempted ? Math.round((s.correct / s.attempted) * 100) : null }))
    .sort((x, y) => (x.accuracy ?? 101) - (y.accuracy ?? 101));
  return {
    test: { id: t.id, title: t.title, total, maxScore: total * marks, marks, negativeMarking: negative, minutes: t.minutes, dueAt: t.dueAt?.getTime() ?? null, createdAt: t.createdAt.getTime() },
    batch: { id: batch.id, name: batch.name },
    summary: {
      members: rows.length,
      submitted: submitted.length,
      average: submitted.length ? Math.round((submitted.reduce((n, r) => n + (r.score ?? 0), 0) / submitted.length) * 100) / 100 : null,
      highest: submitted.length ? Math.max(...submitted.map((r) => r.score ?? 0)) : null,
    },
    rows,
    topics,
  };
}

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Quote everything that could break a row, and defuse spreadsheet formulas.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function resultsCsv(r: Awaited<ReturnType<typeof batchTestResults>>): string {
  const head = ["Rank", "Name", "Email", "Status", `Score (out of ${r.test.maxScore})`, "Correct", "Wrong", "Skipped", "Accuracy %", "Time (min)", "Submitted at"];
  let rank = 0;
  const lines = r.rows.map((x) => {
    if (x.status === "submitted") rank++;
    return [x.status === "submitted" ? rank : "", x.name, x.email, x.status, x.score, x.correct, x.wrong, x.skipped, x.accuracy, x.seconds === null ? "" : Math.round(x.seconds / 6) / 10, x.submittedAt ? new Date(x.submittedAt).toISOString() : ""];
  });
  return [head, ...lines].map((l) => l.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
