// Exam Pass end to end against a throwaway Postgres (never production): a paid order grants a
// 90-day pass for one exam, timed tests for that exam start without using credits or the free
// test, other exams stay limited, an expired pass stops working, buying again extends, and
// fulfilment happens exactly once however many times the webhook and the browser report it.
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip npm run test:pass
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}

const { db, schema, sql } = await import("../src/db/index.ts");
const { fulfilOrder, createOrder, demoPurchase, PAYMENTS_MODE } = await import("../src/server/billing.ts");
const { startTest } = await import("../src/server/tests.ts");
const { getAccount } = await import("../src/server/account.ts");
const { getRevision } = await import("../src/server/revision.ts");
const { PRODUCTS, PRODUCT_ORDER } = await import("../src/lib/products.ts");
const { EXAMS, examTopicIds } = await import("../src/data/exams.ts");
const { mockPlan } = await import("../src/data/patterns.ts");
const { and, eq, isNull, like } = await import("drizzle-orm");

const DAY = 86_400_000;
const PASS = PRODUCTS["exam-pass-90d"];
const near = (a, b, slack = 60_000) => Math.abs(a - b) <= slack;
const expectHttp = async (p, status) => {
  await assert.rejects(p, (e) => e.status === status || (console.error(e), false));
};

// The catalogue: one exam, 90 days, ₹299, shown first.
assert.equal(PASS.price, 299);
assert.equal(PASS.examPassDays, 90);
assert.equal(PASS.needsExam, true);
assert.ok(!PASS.credits && !PASS.revisionDays);
assert.deepEqual(PRODUCT_ORDER, ["exam-pass-90d", "tests-3", "revision-7d"]);

// Two exams with practice topics; the first has a paper pattern so a section test can be tried.
const practisable = EXAMS.filter((e) => examTopicIds(e).length > 0);
const examA = practisable.find((e) => mockPlan(e)) ?? practisable[0];
const examB = practisable.find((e) => e.id !== examA.id);
assert.ok(examA && examB, "needs two exams with practice topics");
const A = examA.id;
const B = examB.id;

const id = randomUUID();
const email = `${id.slice(0, 8)}@test.local`;
const user = { id, email, name: "Pass Buyer", credits: 0, emailVerified: true };
await db.insert(schema.users).values({ id, email, name: user.name });

/** What createOrder stores for a live order, without calling Razorpay. */
const order = async (productId, examId, amountPaise = PRODUCTS[productId].price * 100) => {
  const orderId = `order_test_${randomUUID()}`;
  await db.insert(schema.payments).values({ userId: id, orderId, productId, examId: examId ?? null, amountPaise, mode: "live" });
  return orderId;
};
const passRow = async (examId) => (await db.select().from(schema.examPasses).where(and(eq(schema.examPasses.userId, id), eq(schema.examPasses.examId, examId))))[0];
const credits = async () => (await db.select({ credits: schema.users.credits }).from(schema.users).where(eq(schema.users.id, id)))[0].credits;
const freeUsed = async (examId) => (await db.select().from(schema.freeTests).where(and(eq(schema.freeTests.userId, id), eq(schema.freeTests.examId, examId)))).length === 1;
const attempts = async (examId) => db.select({ paidWith: schema.testAttempts.paidWith, kind: schema.testAttempts.kind }).from(schema.testAttempts).where(and(eq(schema.testAttempts.userId, id), eq(schema.testAttempts.examId, examId)));

try {
  // Payments are off in this run (no keys, no demo flag): the pass degrades like every product.
  assert.equal(PAYMENTS_MODE, "off");
  await expectHttp(createOrder(user, "exam-pass-90d", A), 503);
  await expectHttp(demoPurchase(user, "exam-pass-90d", A, "localhost"), 403);
  console.log("✓ payments off: no order and no demo purchase for the pass");

  // Nothing is granted for an order that was never paid, or paid with the wrong amount.
  const unpaid = await order("exam-pass-90d", A);
  assert.equal(await fulfilOrder(unpaid, `pay_${randomUUID()}`, 1900), false); // ₹19 paid for a ₹299 pass
  assert.equal(await fulfilOrder(`order_missing_${randomUUID()}`, `pay_${randomUUID()}`), false);
  assert.equal(await passRow(A), undefined);
  assert.deepEqual((await getAccount(user)).examPasses, {});
  console.log("✓ wrong amount or unknown order grants nothing");

  // Buy: the webhook (with the amount) and the browser verification both report the same payment.
  const first = await order("exam-pass-90d", A);
  const payId = `pay_${randomUUID()}`;
  assert.equal(await fulfilOrder(first, payId, 29900), true);
  const bought = await passRow(A);
  assert.ok(near(bought.expiresAt.getTime(), Date.now() + 90 * DAY), "a new pass runs 90 days from now");
  assert.equal(await fulfilOrder(first, payId), false);
  assert.equal(await fulfilOrder(first, payId, 29900), false);
  assert.deepEqual(await Promise.all([fulfilOrder(first, payId), fulfilOrder(first, payId, 29900), fulfilOrder(first, payId)]), [false, false, false]);
  assert.equal((await passRow(A)).expiresAt.getTime(), bought.expiresAt.getTime(), "a repeated fulfilment must not extend the pass");
  assert.equal(await credits(), 0, "the pass grants no credits");
  console.log("✓ a paid order grants 90 days once, however often it is reported");

  // Two reports of a fresh payment arriving at the same moment still grant it once.
  const raced = await order("exam-pass-90d", B);
  const racedPay = `pay_${randomUUID()}`;
  const outcome = await Promise.all([fulfilOrder(raced, racedPay), fulfilOrder(raced, racedPay, 29900)]);
  assert.equal(outcome.filter(Boolean).length, 1);
  assert.ok(near((await passRow(B)).expiresAt.getTime(), Date.now() + 90 * DAY));
  await db.delete(schema.examPasses).where(and(eq(schema.examPasses.userId, id), eq(schema.examPasses.examId, B))); // exam B is the "no pass" exam below
  console.log("✓ simultaneous webhook and browser verification grant one pass");

  // /api/me payload and the revision pack
  const account = await getAccount(user);
  assert.deepEqual(Object.keys(account.examPasses), [A]);
  assert.equal(account.examPasses[A], bought.expiresAt.getTime());
  assert.equal(account.revisionPasses[A], bought.expiresAt.getTime(), "the pass includes the revision pack");
  assert.equal(account.revisionPasses[B], undefined);
  const sheet = await getRevision(user, A);
  assert.equal(sheet.unlocked, true);
  assert.equal(sheet.expiresAt, bought.expiresAt.getTime());
  assert.ok(sheet.subjects.every((s) => s.topics.every((t) => !t.locked)));
  assert.equal((await getRevision(user, B)).unlocked, false);
  assert.equal((await getRevision(null, A)).unlocked, false);
  console.log("✓ account shows the pass; revision pack unlocked for that exam only");

  // Timed tests for the exam: full mock, topic test, section test, and more: no credit, no free test.
  const full = await startTest(user, A);
  assert.equal(full.paidWith, "pass");
  assert.equal(full.passUntil, bought.expiresAt.getTime());
  assert.equal(full.credits, 0);
  const topic = await startTest(user, A, { topicIds: [examTopicIds(examA)[0]] });
  assert.equal(topic.paidWith, "pass");
  assert.equal(topic.kind, "topic");
  const plan = mockPlan(examA);
  if (plan) {
    const section = await startTest(user, A, { section: plan.sections[0].subject });
    assert.equal(section.paidWith, "pass");
    assert.equal(section.kind, "section");
  }
  for (let i = 0; i < 3; i++) assert.equal((await startTest(user, A)).paidWith, "pass");
  assert.equal(await freeUsed(A), false, "the free test is kept for after the pass");
  assert.equal(await credits(), 0);
  assert.ok((await attempts(A)).every((a) => a.paidWith === "pass"));
  // Credits the user already holds are not touched either.
  await db.update(schema.users).set({ credits: 2 }).where(eq(schema.users.id, id));
  assert.equal((await startTest(user, A)).credits, 2);
  assert.equal(await credits(), 2);
  await db.update(schema.users).set({ credits: 0 }).where(eq(schema.users.id, id));
  console.log(`✓ ${(await attempts(A)).length} timed tests on the pass: no credits used, free test untouched`);

  // Another exam is still limited: one free test, then the paywall.
  assert.equal((await startTest(user, B)).paidWith, "free");
  assert.equal(await freeUsed(B), true);
  await expectHttp(startTest(user, B), 402);
  await db.update(schema.users).set({ credits: 1 }).where(eq(schema.users.id, id));
  const paid = await startTest(user, B);
  assert.equal(paid.paidWith, "credit");
  assert.equal(paid.credits, 0);
  await expectHttp(startTest(user, B), 402);
  console.log("✓ another exam still needs its free test or a credit");

  // Buying again while active adds 90 days to the current expiry.
  const second = await order("exam-pass-90d", A);
  assert.equal(await fulfilOrder(second, `pay_${randomUUID()}`, 29900), true);
  const extended = await passRow(A);
  assert.equal(extended.expiresAt.getTime(), bought.expiresAt.getTime() + 90 * DAY);
  assert.equal((await getAccount(user)).examPasses[A], extended.expiresAt.getTime());
  console.log("✓ buying again extends from the current expiry (180 days)");

  // Expiry ends access: the kept free test is used next, then the paywall.
  await db.update(schema.examPasses).set({ expiresAt: new Date(Date.now() - 60_000) }).where(and(eq(schema.examPasses.userId, id), eq(schema.examPasses.examId, A)));
  const lapsed = await getAccount(user);
  assert.deepEqual(lapsed.examPasses, {});
  assert.equal(lapsed.revisionPasses[A], undefined);
  assert.equal((await getRevision(user, A)).unlocked, false);
  const afterExpiry = await startTest(user, A);
  assert.equal(afterExpiry.paidWith, "free");
  assert.equal(afterExpiry.passUntil, null);
  await expectHttp(startTest(user, A), 402);
  console.log("✓ an expired pass gives no tests and no revision pack");

  // Buying after it lapsed starts a fresh 90 days from now, not from the old date.
  const third = await order("exam-pass-90d", A);
  assert.equal(await fulfilOrder(third, `pay_${randomUUID()}`), true);
  assert.ok(near((await passRow(A)).expiresAt.getTime(), Date.now() + 90 * DAY));
  assert.equal((await startTest(user, A)).paidWith, "pass");
  console.log("✓ buying after expiry starts 90 days from today");

  // The ₹19 products are unchanged: a revision pack alone unlocks revision but not timed tests.
  const rev = await order("revision-7d", B);
  assert.equal(await fulfilOrder(rev, `pay_${randomUUID()}`, 1900), true);
  const withPack = await getAccount(user);
  assert.ok(near(withPack.revisionPasses[B], Date.now() + 7 * DAY));
  assert.equal(withPack.examPasses[B], undefined);
  await expectHttp(startTest(user, B), 402);
  const pack = await order("tests-3");
  assert.equal(await fulfilOrder(pack, `pay_${randomUUID()}`, 1900), true);
  assert.equal(await credits(), 3);
  console.log("✓ ₹19 packs behave as before");

  // An account deleted before its payment arrives: the payment is kept paid, nothing is granted, nothing throws.
  const late = await order("exam-pass-90d", A);
  await db.delete(schema.users).where(eq(schema.users.id, id));
  assert.equal(await fulfilOrder(late, `pay_${randomUUID()}`, 29900), true);
  assert.equal(await passRow(A), undefined);
  console.log("✓ passes go with a deleted account; a late payment is recorded without a grant");
} finally {
  await db.delete(schema.users).where(eq(schema.users.id, id));
  await db.delete(schema.payments).where(and(like(schema.payments.orderId, "order_test_%"), isNull(schema.payments.userId)));
  await sql.end();
}
