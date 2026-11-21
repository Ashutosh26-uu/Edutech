// The founder's stats (/admin/stats) against a throwaway Postgres (never production): a small
// known set of events, users, tests and payments, then the funnel, a retention cell, daily
// actives, revenue and the admins-only rule are checked.
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip npm run test:stats
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}
const run = randomUUID().slice(0, 8);
const adminEmail = `boss-${run}@test.local`;
process.env.ADMIN_EMAILS = `someone@else.test, ${adminEmail.toUpperCase()}`;

const { db, schema, sql } = await import("../src/db/index.ts");
const { adminStats } = await import("../src/server/stats.ts");
const { isAdmin } = await import("../src/server/admin.ts");
const { and, gte, inArray, lte } = await import("drizzle-orm");

// The test lives in 2090 so rows other tests leave in the same database can never be counted.
const at = (day, time = "10:00") => new Date(`${day}T${time}:00+05:30`);
const NOW = at("2090-06-15", "12:00").getTime();
const monday = (day) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};

const users = {};
const mkUser = async (key, createdAt) => {
  const id = randomUUID();
  await db.insert(schema.users).values({ id, email: `${key}-${run}@test.local`, name: key, createdAt });
  users[key] = id;
  return id;
};
const exam = `zz-stats-${run}`;
const topic = `zz-topic-${run}`;
const attempt = (userId, startedAt, submittedAt = null) =>
  db.insert(schema.testAttempts).values({ userId, examId: exam, kind: "topic", topicIds: [topic], questions: [], paidWith: "free", startedAt, deadlineAt: new Date(startedAt.getTime() + 600_000), submittedAt });
const orders = [`order_live_${run}`, `order_demo_${run}`, `order_failed_${run}`];
const e = schema.eventCounts;
const in2090 = and(gte(e.day, "2090-01-01"), lte(e.day, "2090-12-31"));

await db.delete(e).where(in2090);
try {
  // Anonymous counters. In the 7 days to 15 June: 120 page views, 40 sets started, 10 finished.
  await db.insert(e).values([
    { day: "2090-06-14", name: "page_view", path: "/practice", count: 100 },
    { day: "2090-06-10", name: "page_view", path: "/", count: 20 },
    { day: "2090-06-14", name: "practice_start", path: "/practice", count: 40 },
    { day: "2090-06-14", name: "practice_finish", path: "/practice", count: 10 },
    { day: "2090-06-01", name: "page_view", path: "/", count: 500 }, // only in the 30-day view
    { day: "2090-06-16", name: "page_view", path: "/", count: 999 }, // after "now": never counted
  ]);

  // A: signs up, practises two days later, takes and submits a test, pays.
  const a = await mkUser("a", at("2090-06-12"));
  await db.insert(schema.topicStats).values({ userId: a, topicId: topic, attempted: 10, correct: 7, lastPracticed: at("2090-06-14") });
  await attempt(a, at("2090-06-13"), at("2090-06-13", "10:20"));
  await db.insert(schema.payments).values({ userId: a, orderId: orders[0], productId: "tests-3", amountPaise: 1900, status: "paid", mode: "live", createdAt: at("2090-06-14"), paidAt: at("2090-06-14", "10:01") });
  // B: signs up and never returns.
  await mkUser("b", at("2090-06-12", "11:00"));
  // C: signed up 16 hours ago (too early for day 1); a demo payment and a failed one are not revenue.
  const c = await mkUser("c", at("2090-06-14", "20:00"));
  await db.insert(schema.payments).values([
    { userId: c, orderId: orders[1], productId: "tests-3", amountPaise: 1900, status: "paid", mode: "demo", createdAt: at("2090-06-14", "21:00"), paidAt: at("2090-06-14", "21:00") },
    { userId: c, orderId: orders[2], productId: "revision-7d", amountPaise: 1900, status: "failed", mode: "live", createdAt: at("2090-06-14", "21:05") },
  ]);
  // D and E signed up 45 days ago; D came back for a test this week, E never did.
  const d = await mkUser("d", at("2090-05-01"));
  await attempt(d, at("2090-06-13", "15:00"));
  await mkUser("e", at("2090-05-01", "11:00"));

  const s = await adminStats(7, NOW);
  const step = (list, key) => list.find((x) => x.key === key);

  // Funnel: count and share of the step before
  assert.deepEqual(s.funnel.map((x) => [x.key, x.count]), [["visits", 120], ["practice_start", 40], ["practice_finish", 10], ["signup", 3], ["timed_test", 2], ["paid", 1]]);
  assert.equal(step(s.funnel, "visits").ofPrevious, null);
  assert.equal(step(s.funnel, "practice_start").ofPrevious, 40 / 120);
  assert.equal(step(s.funnel, "practice_finish").ofPrevious, 0.25);
  assert.equal(step(s.funnel, "paid").ofPrevious, 0.5);
  assert.ok(s.funnel.every((x) => x.definition.length > 20), "every funnel number says what it counts");
  assert.equal(s.testsSubmittedBy, 1);
  console.log("✓ funnel: 120 views → 40 started → 10 finished → 3 signed up → 2 took a test → 1 paid");

  // The same accounts all the way down
  assert.deepEqual(s.signupFunnel.map((x) => x.count), [3, 1, 1, 1, 1]);

  // Retention: A and B could have returned on day 1, only A did; C signed up too recently
  const week = (day) => s.retention.cohorts.find((x) => x.week === monday(day));
  assert.deepEqual(week("2090-06-12").day1, { eligible: 2, returned: 1 });
  assert.equal(week("2090-06-12").day7.eligible, 0);
  assert.equal(week("2090-06-14").size + (monday("2090-06-14") === monday("2090-06-12") ? 0 : 2), 3);
  assert.deepEqual(week("2090-05-01").day7, { eligible: 2, returned: 1 });
  assert.deepEqual(week("2090-05-01").day30, { eligible: 2, returned: 1 });
  console.log("✓ retention: day 1 is 1 of 2 for this week's sign-ups, day 30 is 1 of 2 for the May cohort");

  // Daily actives: always 30 days, one row per day
  assert.equal(s.daily.days.length, 30);
  assert.equal(s.daily.days.at(-1).day, "2090-06-15");
  const day = (x) => s.daily.days.find((r) => r.day === x);
  assert.equal(day("2090-06-13").activeUsers, 2); // A and D took tests
  assert.equal(day("2090-06-12").activeUsers, 2); // A and B signed up
  assert.equal(day("2090-06-14").practiceStarts, 40);
  assert.equal(day("2090-06-01").views, 500);

  // Top exams and topics, revenue by product
  assert.deepEqual(s.topExams.rows.find((x) => x.examId === exam), { examId: exam, name: exam, tests: 2, users: 2 });
  assert.equal(s.topTopics.rows.find((x) => x.topicId === topic).users, 1);
  assert.deepEqual(s.revenue.rows.find((x) => x.mode === "live"), { productId: "tests-3", name: "3 last-minute tests", mode: "live", orders: 1, payers: 1, rupees: 19 });
  assert.equal(s.revenue.rows.filter((x) => x.mode === "live").length, 1); // the failed order is not revenue
  assert.equal(s.revenue.rows.find((x) => x.mode === "demo").orders, 1);
  assert.ok(s.notMeasured.some((x) => /unique visitors/i.test(x)));
  console.log("✓ daily actives, top exams and topics, and revenue by product (demo and failed payments kept out)");

  // The 30-day period reaches further back for counters, but D and E signed up before it
  const m = await adminStats(30, NOW);
  assert.equal(step(m.funnel, "visits").count, 620);
  assert.equal(step(m.funnel, "signup").count, 3);

  // Nothing personal leaves the server
  assert.ok(!/@test\.local/.test(JSON.stringify(s)) && !Object.values(users).some((id) => JSON.stringify(s).includes(id)), "no emails or user ids in the stats");

  // Access: only verified accounts listed in ADMIN_EMAILS; the API refuses everyone else
  const boss = { id: randomUUID(), email: adminEmail, name: "Boss", credits: 0, emailVerified: true };
  assert.equal(isAdmin(boss), true);
  assert.equal(isAdmin({ ...boss, emailVerified: false }), false);
  assert.equal(isAdmin({ ...boss, email: `a-${run}@test.local` }), false);
  assert.equal(isAdmin(null), false);
  // The API route checks the admin rule before it reads any stats (a route cannot run outside Next).
  const route = readFileSync(new URL("../src/app/api/admin/stats/route.ts", import.meta.url), "utf8");
  const guard = route.indexOf("await requireAdmin(req)");
  assert.ok(guard > 0 && guard < route.indexOf("adminStats(days)"), "the stats route must call requireAdmin first");
  console.log("✓ access: verified accounts in ADMIN_EMAILS only; the API checks it before reading stats");
} finally {
  await db.delete(schema.payments).where(inArray(schema.payments.orderId, orders));
  const ids = Object.values(users);
  if (ids.length) await db.delete(schema.users).where(inArray(schema.users.id, ids));
  await db.delete(e).where(in2090);
  await sql.end();
}
