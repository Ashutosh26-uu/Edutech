// Load test for the backend, followed by database integrity checks.
//
//   DATABASE_URL=... node scripts/load-test.mjs [users=1000] [seconds=30] [urls=http://localhost:3000]
//
// urls may be a comma-separated list of server instances (traffic is split evenly, like a load
// balancer). Three phases:
//   1. Spike: every user starts a timed test at the same instant, then all submit at once.
//   2. Sustained: N open connections sending a realistic mix of requests for the duration.
//   3. Integrity: no credit lost, double-spent or negative; at most one free test per user per exam.
import autocannon from "autocannon";
import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";

const N = +(process.argv[2] ?? 1000);
const SECONDS = +(process.argv[3] ?? 30);
const URLS = (process.argv[4] ?? "http://localhost:3000").split(",");
const CREDITS = 5;
const sql = postgres(process.env.DATABASE_URL, { max: 5 });

// ---------- Seed ----------
await sql`delete from users where email like 'load-%@test.in'`;
const rows = Array.from({ length: N }, (_, i) => ({ email: `load-${i}@test.in`, password_hash: "x", credits: CREDITS }));
const ids = [];
for (let i = 0; i < N; i += 500) ids.push(...(await sql`insert into users ${sql(rows.slice(i, i + 500))} returning id`));
const cookies = [];
const sessions = ids.map(({ id }) => {
  const token = randomBytes(32).toString("base64url");
  cookies.push(`sc_session=${token}`);
  return { id: createHash("sha256").update(token).digest("hex"), user_id: id, expires_at: new Date(Date.now() + 86_400_000) };
});
for (let i = 0; i < N; i += 500) await sql`insert into sessions ${sql(sessions.slice(i, i + 500))}`;
console.log(`Seeded ${N} logged-in users with ${CREDITS} credits each. Server instances: ${URLS.length}\n`);

const pct = (arr, p) => arr.sort((a, b) => a - b)[Math.min(arr.length - 1, Math.floor((p / 100) * arr.length))];
const ip = () => `10.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}`;

async function burst(label, makeRequest) {
  const times = [];
  const statuses = {};
  const started = Date.now();
  const out = await Promise.all(
    cookies.map(async (cookie, i) => {
      const t = Date.now();
      const { path, body } = makeRequest(i);
      try {
        const res = await fetch(URLS[i % URLS.length] + path, { method: "POST", headers: { "content-type": "application/json", cookie, "x-forwarded-for": ip() }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => null);
        statuses[res.status] = (statuses[res.status] ?? 0) + 1;
        times.push(Date.now() - t);
        return { status: res.status, data };
      } catch (e) {
        statuses[e.cause?.code ?? "network-error"] = (statuses[e.cause?.code ?? "network-error"] ?? 0) + 1;
        return { status: 0 };
      }
    }),
  );
  console.log(`${label}: ${N} requests at once → finished in ${((Date.now() - started) / 1000).toFixed(1)}s | p50 ${pct(times, 50)}ms p99 ${pct(times, 99)}ms | status ${JSON.stringify(statuses)}`);
  return out;
}

// ---------- 1. Spike ----------
console.log("Phase 1 — spike");
const starts = await burst("  All users start a full mock", () => ({ path: "/api/tests/start", body: { examId: "ssc-cgl" } }));
const started = starts.map((r) => (r.status === 201 ? r.data : null));
const subs = await burst("  All users submit at once   ", (i) => {
  const t = started[i];
  return t ? { path: "/api/tests/submit", body: { attemptId: t.attemptId, answers: t.questions.map(() => (Math.random() < 0.8 ? (Math.random() * 4) | 0 : null)) } } : { path: "/api/health", body: {} };
});
const scored = subs.filter((r, i) => started[i] && r.status === 200 && typeof r.data?.score === "number").length;
console.log(`  Tests started: ${started.filter(Boolean).length}/${N}, scored: ${scored}/${started.filter(Boolean).length}\n`);

// ---------- 2. Sustained ----------
console.log(`Phase 2 — sustained: ${N} open connections for ${SECONDS}s`);
const MIX = [
  [0.3, () => ({ method: "GET", path: "/api/me" })],
  [0.2, () => ({ method: "POST", path: "/api/tests/start", body: JSON.stringify({ examId: "ibps-po" }) })],
  [0.2, () => ({ method: "POST", path: "/api/practice", body: JSON.stringify({ topicIds: ["quant-percentage", "polity-preamble"], count: 10 }) })],
  [0.15, () => ({ method: "GET", path: "/api/revision/ssc-cgl" })],
  [0.1, () => ({ method: "POST", path: "/api/topic", body: JSON.stringify({ query: "fundamental rights" }) })],
  [0.05, () => ({ method: "GET", path: "/api/health" })],
];
const pick = () => {
  let r = Math.random();
  for (const [w, make] of MIX) if ((r -= w) <= 0) return make();
  return MIX[0][1]();
};
const statusCounts = {};
const runs = await Promise.all(
  URLS.map((url) =>
    autocannon({
      url,
      connections: Math.ceil(N / URLS.length),
      duration: SECONDS,
      timeout: 30,
      requests: [
        {
          setupRequest: (req) => ({ ...req, ...pick(), headers: { "content-type": "application/json", cookie: cookies[(Math.random() * N) | 0], "x-forwarded-for": ip() } }),
          onResponse: (status) => (statusCounts[status] = (statusCounts[status] ?? 0) + 1),
        },
      ],
    }),
  ),
);
const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
const server5xx = Object.entries(statusCounts).filter(([s]) => +s >= 500 && +s !== 503).reduce((a, [, n]) => a + n, 0);
console.log(`  Requests: ${total} (${Math.round(total / SECONDS)}/s)`);
console.log(`  Latency p50/p90/p99 (ms): ${runs.map((r) => `${r.latency.p50}/${r.latency.p90}/${r.latency.p99}`).join("  |  ")}`);
console.log(`  Status codes: ${JSON.stringify(statusCounts)}`);
console.log(`  Connection errors / timeouts: ${runs.reduce((a, r) => a + r.errors, 0)} / ${runs.reduce((a, r) => a + r.timeouts, 0)}`);
console.log(`  Server errors (5xx other than 503 load-shedding): ${server5xx}\n`);

// ---------- 3. Integrity ----------
const [c] = await sql`
  with u as (select id, credits from users where email like 'load-%@test.in')
  select
    (select coalesce(sum(credits), 0) from u)::int                                                       as credits_left,
    (select count(*) from u where credits < 0)::int                                                      as negative,
    (select count(*) from test_attempts t join u on u.id = t.user_id where t.paid_with = 'credit')::int as credit_attempts,
    (select count(*) from test_attempts t join u on u.id = t.user_id where t.paid_with = 'free')::int   as free_attempts,
    (select count(*) from free_tests f join u on u.id = f.user_id)::int                                 as free_claims,
    (select count(*) from test_attempts t join u on u.id = t.user_id where t.submitted_at is not null)::int as submitted`;
const spentOk = c.credits_left + c.credit_attempts === N * CREDITS;
const freeOk = c.free_attempts === c.free_claims;
console.log("Phase 3 — integrity");
console.log(`  credits left ${c.credits_left} + credit-paid tests ${c.credit_attempts} = ${c.credits_left + c.credit_attempts} (expected ${N * CREDITS})  ${spentOk ? "OK" : "MISMATCH"}`);
console.log(`  negative balances: ${c.negative}  ${c.negative === 0 ? "OK" : "PROBLEM"}`);
console.log(`  free tests used ${c.free_attempts} = free claims ${c.free_claims} (one per user per exam)  ${freeOk ? "OK" : "MISMATCH"}`);
console.log(`  tests submitted and scored: ${c.submitted}`);

await sql`delete from users where email like 'load-%@test.in'`;
await sql.end();
process.exit(spentOk && freeOk && c.negative === 0 && server5xx === 0 ? 0 : 1);
