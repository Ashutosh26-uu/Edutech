// End-to-end check of the running app (BASE) on Neon: Neon Auth login through the app's
// /api/auth proxy, then credits, tests and payments in Neon Postgres. Cleans up its own rows.
import postgres from "postgres";
const BASE = process.env.BASE ?? "http://localhost:3100"; // localhost: Neon Auth trusts it by default
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`); };

const jar = new Map();
async function call(method, path, body) {
  const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  const res = await fetch(BASE + path, { method, headers: { "Content-Type": "application/json", Origin: BASE, Cookie: cookie }, body: body ? JSON.stringify(body) : undefined });
  for (const c of res.headers.getSetCookie()) {
    const [pair, ...attrs] = c.split(";");
    const i = pair.indexOf("=");
    const k = pair.slice(0, i).trim(), v = pair.slice(i + 1);
    if (!v || attrs.some((a) => /max-age=0\b/i.test(a))) jar.delete(k); else jar.set(k, v);
  }
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

const email = `neon-e2e-${Date.now()}@example.com`;
const password = "test-pass-1234";
const h = await call("GET", "/api/health");
check("health: Neon Postgres reachable", h.data.db === "up", `latency ${h.data.dbLatencyMs}ms`);
const anon = await call("POST", "/api/tests/start", { examId: "ssc-cgl" });
check("signed out: protected API denied", anon.status === 401);
const su = await call("POST", "/api/auth/sign-up/email", { email, password, name: "E2E" });
check("Neon Auth sign-up via app proxy", su.status === 200 && su.data.user?.email === email);
const me0 = await call("GET", "/api/me");
check("app account created for new user", me0.data?.user?.email === email && me0.data.user.id === su.data.user?.id, `id ${me0.data?.user?.id}`);
await call("POST", "/api/auth/sign-out", {});
const me1 = await call("GET", "/api/me");
check("sign-out ends session", !me1.data?.user);
const bad = await call("POST", "/api/auth/sign-in/email", { email, password: "wrong-password" });
check("wrong password rejected", bad.status === 401 && bad.data.code === "INVALID_EMAIL_OR_PASSWORD", `HTTP ${bad.status} ${bad.data.code}`);
const li = await call("POST", "/api/auth/sign-in/email", { email, password });
check("sign-in", li.status === 200);
const me = await call("GET", "/api/me");
check("session restored on a new request", me.data?.user?.email === email);
const st = await call("POST", "/api/tests/start", { examId: "ssc-cgl" });
check("free test start", st.status === 201 && st.data.paidWith === "free", `${st.data.questions?.length} questions`);
const sub = await call("POST", "/api/tests/submit", { attemptId: st.data.attemptId, answers: st.data.questions.map(() => 0) });
check("server scoring", sub.status === 200 && typeof sub.data.score === "number", `score ${sub.data.score}`);
const st2 = await call("POST", "/api/tests/start", { examId: "ssc-cgl" });
check("second test blocked without credits", st2.status === 402);
const buy = await call("POST", "/api/payments/demo", { productId: "tests-3" });
const me2 = await call("GET", "/api/me");
check("demo purchase adds 3 credits", buy.status === 200 && me2.data.credits === 3);
const race = await Promise.all(Array.from({ length: 5 }, () => call("POST", "/api/tests/start", { examId: "ssc-cgl" })));
check("credit race: 5 parallel starts with 3 credits", race.filter((r) => r.status === 201).length === 3);

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const [au] = await sql`select id from neon_auth."user" where email = ${email}`;
const [u] = await sql`select id, credits from users where email = ${email}`;
const [{ n }] = await sql`select count(*)::int n from test_attempts where user_id = ${u.id}`;
check("Neon Auth user and app user share one id", au?.id === u?.id);
check("rows in Neon (users, test_attempts)", u.credits === 0 && n === 4, `credits ${u.credits}, attempts ${n}`);

await sql`delete from users where id = ${u.id}`;
await sql`delete from neon_auth."user" where id = ${au.id}`;
await sql.end();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
