// Phase 1 content and access against a real local Postgres (never production): editor access,
// the daily current-affairs quiz, the exam calendar and batch co-trainers.
// Usage: npm run db:dev, then DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5433/studyclip npm run test:content
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}
const admin = { id: randomUUID(), email: "boss@test.local", name: "Admin", credits: 0, emailVerified: true };
process.env.ADMIN_EMAILS = admin.email;

const { db, schema, sql } = await import("../src/db/index.ts");
const C = await import("../src/server/content.ts");
const B = await import("../src/server/batches.ts");
const { eq, inArray } = await import("drizzle-orm");

const expectHttp = (p, status) => assert.rejects(p, (e) => e.status === status || (console.error(e), false));
const mkUser = async (name, email = `${randomUUID().slice(0, 8)}@test.local`) => {
  const u = { id: randomUUID(), email, name, credits: 0, emailVerified: true };
  await db.insert(schema.users).values({ id: u.id, email: u.email, name });
  return u;
};
await db.insert(schema.users).values({ id: admin.id, email: admin.email, name: admin.name });
const editor = await mkUser("Uni Editor", `editor-${randomUUID().slice(0, 6)}@uni.test`);
const nobody = await mkUser("Nobody");
const owner = await mkUser("Owner");
const colleague = await mkUser("Colleague", `colleague-${randomUUID().slice(0, 6)}@uni.test`);
const student = await mkUser("Student");
const today = C.istDay();
const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
const days = [];
const eventIds = [];
let batchId;
const q = (n) => Array.from({ length: n }, (_, i) => ({ question: `Q${i + 1}?`, options: ["A", "B", "C", "D"], answer: i % 4, explanation: "Because." }));

try {
  // Roles: admin from env, editors by email (before or after signup), nobody else
  assert.equal((await C.roleOf(admin)).role, "admin");
  assert.equal((await C.roleOf(nobody)).role, null);
  await C.grantEditor(admin, ` ${editor.email.toUpperCase()} `, "Test University");
  const r = await C.roleOf(editor);
  assert.equal(r.role, "editor");
  assert.equal(r.organisation, "Test University");
  assert.ok((await C.listEditors()).some((e) => e.email === editor.email));

  // Quiz: validation, drafts hidden, future hidden, today shown
  await expectHttp(C.upsertQuiz(editor, { day: today, title: "Bad", published: true, questions: q(2) }), 400);
  await expectHttp(C.upsertQuiz(editor, { day: today, title: "Bad", published: true, questions: [...q(2), { question: "x", options: ["A", "a", "B", "C"], answer: 0 }] }), 400);
  await C.upsertQuiz(editor, { day: today, title: "Today draft", published: false, questions: q(5) });
  days.push(today);
  assert.equal((await C.publicQuiz()).quiz?.day === today, false, "draft must stay hidden");
  await C.upsertQuiz(editor, { day: today, title: "Today", published: true, questions: q(5) });
  await C.upsertQuiz(editor, { day: tomorrow, title: "Tomorrow", published: true, questions: q(4) });
  days.push(tomorrow);
  const pub = await C.publicQuiz();
  assert.equal(pub.quiz.day, today);
  assert.equal(pub.quiz.isToday, true);
  assert.equal(pub.quiz.questions.length, 5);
  assert.ok(!pub.days.some((d) => d.day === tomorrow), "future quiz must stay hidden");
  assert.equal((await C.publicQuiz(tomorrow)).quiz.day, today, "asking for a future day falls back");
  assert.ok((await C.editorQuizzes()).some((x) => x.day === tomorrow));

  // Calendar: validation, upcoming filter, per exam, edit, delete
  await expectHttp(C.upsertEvent(editor, { examId: "nope", kind: "exam", title: "x", day: today }), 400);
  await expectHttp(C.upsertEvent(editor, { examId: null, kind: "exam", title: "x", day: today, link: "javascript:alert(1)" }), 400);
  await expectHttp(C.upsertEvent(editor, { examId: null, kind: "exam", title: "x", day: tomorrow, endDay: today }), 400);
  const e1 = await C.upsertEvent(editor, { examId: "ssc-cgl", kind: "apply-end", title: "SSC CGL last date to apply", day: tomorrow, link: "https://ssc.gov.in" });
  const e2 = await C.upsertEvent(editor, { examId: "ibps-po", kind: "exam", title: "IBPS PO prelims", day: tomorrow, endDay: tomorrow });
  const old = await C.upsertEvent(editor, { examId: "ssc-cgl", kind: "result", title: "Old result", day: "2020-01-01" });
  eventIds.push(e1.id, e2.id, old.id);
  const up = await C.upcomingEvents();
  assert.ok(up.events.some((e) => e.id === e1.id) && !up.events.some((e) => e.id === old.id));
  const ssc = await C.upcomingEvents({ examId: "ssc-cgl" });
  assert.ok(ssc.events.every((e) => e.examId === "ssc-cgl"));
  assert.equal(ssc.events.find((e) => e.id === e1.id).examName, "SSC CGL");
  await C.upsertEvent(editor, { id: e1.id, examId: "ssc-cgl", kind: "apply-end", title: "SSC CGL apply by (extended)", day: tomorrow });
  assert.equal((await C.upcomingEvents({ examId: "ssc-cgl" })).events.find((e) => e.id === e1.id).title, "SSC CGL apply by (extended)");
  await C.deleteEvent(e2.id);
  assert.ok(!(await C.upcomingEvents()).events.some((e) => e.id === e2.id));

  // Revoking access works
  await C.revokeEditor(editor.email);
  assert.equal((await C.roleOf(editor)).role, null);

  // Co-trainers: the owner adds a colleague by email; the colleague runs the batch but can't delete it
  const batch = await B.createBatch(owner, { name: "Uni batch" });
  batchId = batch.id;
  await expectHttp(B.batchDetail(colleague, batch.id), 404);
  await B.addTrainer(owner, batch.id, colleague.email.toUpperCase());
  await expectHttp(B.addTrainer(colleague, batch.id, "x@y.z"), 403);
  const d = await B.batchDetail(colleague, batch.id);
  assert.equal(d.owner, false);
  assert.deepEqual(d.trainers, [colleague.email]);
  assert.equal((await B.batchDetail(owner, batch.id)).owner, true);
  const mine = await B.myBatches(colleague);
  assert.equal(mine.teaching.find((t) => t.id === batch.id)?.owner, false);
  await expectHttp(B.joinBatch(colleague, batch.joinCode), 409);
  await B.joinBatch(student, batch.joinCode);
  const t = await B.createBatchTest(colleague, batch.id, { title: "By colleague", examId: "tcs-nqt", count: 6, minutes: 10 });
  assert.equal((await B.batchTestInfo(colleague, t.id)).isTrainer, true);
  assert.equal((await B.batchTestResults(colleague, t.id)).summary.members, 1);
  await expectHttp(B.deleteBatch(colleague, batch.id), 403);
  await B.removeTrainer(owner, batch.id, colleague.email);
  await expectHttp(B.batchDetail(colleague, batch.id), 404);

  console.log("✓ content and access: roles, quiz (drafts/future hidden), calendar, revoke and co-trainers all pass");
} finally {
  if (batchId) await db.delete(schema.batches).where(eq(schema.batches.id, batchId));
  if (days.length) await db.delete(schema.dailyQuizzes).where(inArray(schema.dailyQuizzes.day, days));
  if (eventIds.length) await db.delete(schema.examEvents).where(inArray(schema.examEvents.id, eventIds));
  await db.delete(schema.contentEditors).where(eq(schema.contentEditors.email, editor.email));
  for (const u of [admin, editor, nobody, owner, colleague, student]) await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await sql.end();
}
