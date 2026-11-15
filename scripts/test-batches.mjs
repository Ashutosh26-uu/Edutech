// Trainer mode end to end against a real Postgres (never production): create a batch, join it,
// assign a paper, take it, submit it and read the results and CSV. Needs DATABASE_URL pointing at
// a local or throwaway database with migrations applied (npm run db:dev, then npm run db:migrate).
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5433/studyclip npm run test:batches
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}

const { db, schema, sql } = await import("../src/db/index.ts");
const B = await import("../src/server/batches.ts");
const { submitTest, answersOpenAt } = await import("../src/server/tests.ts");
const { windowOf, istWeek } = await import("../src/lib/weekly.ts");
const { getStanding } = await import("../src/server/quality.ts");
const { getProgress } = await import("../src/server/progress.ts");
const { eq } = await import("drizzle-orm");

const mkUser = async (name) => {
  const id = randomUUID();
  const email = `${id.slice(0, 8)}@test.local`;
  await db.insert(schema.users).values({ id, email, name });
  return { id, email, name, credits: 0, emailVerified: true };
};
const expectHttp = async (p, status) => {
  await assert.rejects(p, (e) => e.status === status || (console.error(e), false));
};

const trainer = await mkUser("Trainer T");
const s1 = await mkUser("Asha");
const s2 = await mkUser("Ravi");
const outsider = await mkUser("Outsider");
let batchId;
try {
  // Create and join
  const batch = await B.createBatch(trainer, { name: "  Placement 2027 ", institution: "Test College" });
  batchId = batch.id;
  assert.equal(batch.name, "Placement 2027");
  assert.match(batch.joinCode, /^[A-HJ-NP-Z2-9]{6}$/);
  await B.joinBatch(s1, batch.joinCode.toLowerCase());
  await B.joinBatch(s2, ` ${batch.joinCode.slice(0, 3)}-${batch.joinCode.slice(3)} `); // forgiving input
  await B.joinBatch(s2, batch.joinCode); // joining twice is a no-op
  await expectHttp(B.joinBatch(trainer, batch.joinCode), 409);
  await expectHttp(B.joinBatch(s1, "ZZZZZ2"), 404);

  // Only the trainer sees the batch
  const detail = await B.batchDetail(trainer, batch.id);
  assert.equal(detail.members.length, 2);
  await expectHttp(B.batchDetail(s1, batch.id), 404);

  // Assign a paper from a company track, and one from chosen topics
  await expectHttp(B.createBatchTest(s1, batch.id, { title: "x", examId: "tcs-nqt", count: 10, minutes: 10 }), 404);
  const test = await B.createBatchTest(trainer, batch.id, { title: "Aptitude test 1", examId: "tcs-nqt", count: 12, minutes: 15, dueAt: Date.now() + 86_400_000 });
  assert.equal(test.questions, 12);
  const custom = await B.createBatchTest(trainer, batch.id, { title: "Accounts", examId: "custom", topicIds: ["mgmt-accounting", "nope"], count: 8, minutes: 10 });
  assert.equal(custom.questions, 8);
  await expectHttp(B.createBatchTest(trainer, batch.id, { title: "bad", examId: "custom", topicIds: ["nope"], count: 8, minutes: 10 }), 400);
  await expectHttp(B.createBatchTest(trainer, batch.id, { title: "late", examId: "tcs-nqt", count: 8, minutes: 10, dueAt: Date.now() + 60_000 }), 400);

  // Students see it; outsiders can't start it
  const mine = await B.myBatches(s1);
  assert.equal(mine.joined.length, 1);
  assert.equal(mine.joined[0].tests.length, 2);
  assert.ok(mine.joined[0].tests.every((t) => t.status === "open"));
  await expectHttp(B.startBatchTest(outsider, test.id), 403);
  await expectHttp(B.batchTestInfo(outsider, test.id), 404);

  // Take it: questions arrive without answers; a second start resumes the same attempt
  const a1 = await B.startBatchTest(s1, test.id);
  assert.equal(a1.questions.length, 12);
  assert.ok(a1.questions.every((q) => !("answer" in q) && !("explanation" in q)));
  const again = await B.startBatchTest(s1, test.id);
  assert.equal(again.attemptId, a1.attemptId);
  assert.equal((await B.batchTestInfo(s1, test.id)).attempt.inProgress, true);

  // Answer: s1 answers all correctly (read from the stored attempt), s2 answers option 0 for all
  const [row] = await db.select().from(schema.testAttempts).where(eq(schema.testAttempts.id, a1.attemptId));
  const r1 = await submitTest(s1, a1.attemptId, row.questions.map((q) => q.answer), row.questions.map(() => 20));
  assert.equal(r1.correct, 12);
  await expectHttp(B.startBatchTest(s1, test.id), 409); // one attempt only
  const a2 = await B.startBatchTest(s2, test.id);
  const r2 = await submitTest(s2, a2.attemptId, a2.questions.map(() => 0));
  assert.equal(r2.correct + r2.wrong + r2.skipped, 12);

  // Answers stay hidden while the test is open (it is due tomorrow): right/wrong only, no keys for
  // wrong answers, no explanations, and the mistakes wait out of the notebook.
  assert.equal(r2.answersLocked, true);
  assert.ok(r2.answersOpenAt > Date.now());
  assert.ok(r2.questions.every((q, i) => q.explanation === "" && (q.answer === -1 || q.answer === r2.answers[i])));
  assert.equal(r2.questions.filter((q) => q.answer >= 0).length, r2.correct);
  assert.equal(r1.answersLocked, true);
  const hidden = await getProgress(s2);
  assert.equal(hidden.mistakes.length, 0);
  await expectHttp(B.releaseBatchAnswers(s1, test.id), 404);
  await B.releaseBatchAnswers(trainer, test.id);
  const open = await submitTest(s2, a2.attemptId, a2.questions.map(() => 0)); // already submitted: returns the stored review
  assert.equal(open.answersLocked, false);
  assert.ok(open.questions.every((q) => q.answer >= 0));
  if (r2.wrong) assert.ok((await getProgress(s2)).mistakes.length > 0);
  assert.equal((await B.batchTestResults(trainer, test.id)).test.answersAt <= Date.now(), true);

  // Sunday mock: hidden until the window closes (plus the 2-minute grace), open afterwards
  const w = windowOf(istWeek(Date.now()));
  const sunday = { kind: "weekly", startedAt: new Date(w.opensAt + 60_000), batchTestId: null };
  assert.equal(await answersOpenAt(sunday, w.opensAt + 90_000), w.closesAt + 120_000);
  assert.equal(await answersOpenAt(sunday, w.closesAt + 121_000), null);
  assert.equal(await answersOpenAt({ kind: "full", startedAt: new Date(), batchTestId: null }), null);

  // No due time: answers right after submitting, unless the trainer holds them
  const c1 = await B.startBatchTest(s1, custom.id);
  assert.equal((await submitTest(s1, c1.attemptId, c1.questions.map(() => 1))).answersLocked, false);
  const held = await B.createBatchTest(trainer, batch.id, { title: "Held", examId: "tcs-nqt", count: 8, minutes: 10, holdAnswers: true });
  const h1 = await B.startBatchTest(s1, held.id);
  const hr = await submitTest(s1, h1.attemptId, h1.questions.map(() => 1));
  assert.equal(hr.answersLocked, true);
  assert.equal(hr.answersOpenAt, null);
  await B.deleteBatchTest(trainer, held.id);

  // Counts on the trainer's pages (correlated subqueries must use the outer row's id)
  const det = await B.batchDetail(trainer, batch.id);
  assert.equal(det.tests.find((t) => t.id === test.id).submitted, 2);
  assert.equal(det.tests.find((t) => t.id === custom.id).submitted, 1);
  assert.equal((await B.myBatches(trainer)).teaching.find((t) => t.id === batch.id).tests, 2);
  assert.equal((await B.myBatches(trainer)).teaching.find((t) => t.id === batch.id).members, 2);

  // Standing ranks within this assignment only (this used to crash: the topic list was bound as a SQL list)
  const st1 = await getStanding(s1, a1.attemptId);
  assert.equal(st1.rank, 1);
  assert.equal(st1.takers, 2);

  // Results: both rows, s1 first, topic breakdown, CSV
  const res = await B.batchTestResults(trainer, test.id);
  assert.equal(res.summary.submitted, 2);
  assert.equal(res.rows[0].name, "Asha");
  assert.equal(res.rows[0].correct, 12);
  assert.equal(res.rows[0].accuracy, 100);
  assert.ok(res.topics.length > 0 && res.topics.every((t) => t.asked > 0));
  await expectHttp(B.batchTestResults(s1, test.id), 404);
  const csv = B.resultsCsv(res);
  const lines = csv.trim().split("\r\n");
  assert.equal(lines.length, 3);
  assert.match(lines[0], /^Rank,Name,Email,Status/);
  assert.match(lines[1], /^1,Asha,/);
  assert.equal(B.resultsCsv({ ...res, rows: [{ ...res.rows[0], name: '=HYPERLINK("x")' }] }).split("\r\n")[1].split(",")[1], `"'=HYPERLINK(""x"")"`);

  // Student view after submitting
  const after = await B.myBatches(s1);
  const t1 = after.joined[0].tests.find((t) => t.id === test.id);
  assert.equal(t1.status, "done");
  assert.ok(t1.attemptId);

  // Housekeeping: remove a member, delete a test (attempts keep their history), delete the batch
  await B.removeMember(trainer, batch.id, s2.id);
  assert.equal((await B.batchDetail(trainer, batch.id)).members.length, 1);
  await B.deleteBatchTest(trainer, custom.id);
  await B.deleteBatch(trainer, batch.id);
  batchId = null;
  const [kept] = await db.select().from(schema.testAttempts).where(eq(schema.testAttempts.id, a1.attemptId));
  assert.equal(kept.batchTestId, null);
  assert.equal(kept.correct, 12);

  console.log("✓ trainer mode: create, join, assign, take, submit, results, CSV and clean-up all pass");
} finally {
  if (batchId) await db.delete(schema.batches).where(eq(schema.batches.id, batchId));
  for (const u of [trainer, s1, s2, outsider]) await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await sql.end();
}
