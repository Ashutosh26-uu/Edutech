// Security checks that need no database: CSRF and body limits in the API wrapper, the client-IP
// header, sync tombstone bounds, the analytics path allowlist and the login redirect guard.
// Usage: npm run test:security
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.NEON_AUTH_BASE_URL ??= "https://auth.invalid/neondb/auth";
process.env.NEON_AUTH_COOKIE_SECRET ??= "0123456789abcdef0123456789abcdef";
process.env.DATABASE_URL ??= "postgres://nobody:nobody@127.0.0.1:1/none";

const { NextRequest } = await import("next/server");
const { route, json, readJson, clientIp } = await import("../src/server/http.ts");
const { mergeSync } = await import("../src/lib/sync.ts");
const { cleanPath } = await import("../src/server/events.ts");

const ok = route(async () => json({ ok: true }));
const call = (headers, body = "{}") => ok(new NextRequest("https://studyclip.test/api/x", { method: "POST", headers: { host: "studyclip.test", ...headers }, body }), { params: Promise.resolve({}) });

// CSRF
assert.equal((await call({ origin: "https://studyclip.test" })).status, 200);
assert.equal((await call({ origin: "https://evil.example" })).status, 403);
assert.equal((await call({ origin: "null" })).status, 403);
assert.equal((await call({ "sec-fetch-site": "cross-site" })).status, 403);
assert.equal((await call({ "sec-fetch-site": "same-origin" })).status, 200);
assert.equal((await call({})).status, 200); // server-to-server

// Body size: refused before parsing, whatever Content-Length says
const big = JSON.stringify({ q: "x".repeat(30_000) });
await assert.rejects(readJson(new NextRequest("https://studyclip.test/api/solve", { method: "POST", body: big }), 20_000), (e) => e.status === 413);
assert.deepEqual(await readJson(new NextRequest("https://studyclip.test/api/solve", { method: "POST", body: '{"a":1}' }), 20_000), { a: 1 });

// Client IP: with IP_HEADER set, only that header counts
const ipReq = new NextRequest("https://studyclip.test/", { headers: { "x-nf-client-connection-ip": "6.6.6.6", "x-real-ip": "1.2.3.4" } });
process.env.IP_HEADER = "x-real-ip";
assert.equal(clientIp(ipReq), "1.2.3.4");
delete process.env.IP_HEADER;
assert.equal(clientIp(ipReq), "6.6.6.6");

// Sync: future-dated deletions are clamped (so they expire) and the list is capped
const now = Date.now();
const deleted = Object.fromEntries(Array.from({ length: 12_000 }, (_, i) => [`card:k${i}`, 9e15]));
const merged = mergeSync({ cards: {}, bookmarks: {}, deleted }, { cards: {}, bookmarks: {}, deleted: {} }, now);
assert.ok(Object.keys(merged.deleted).length < 12_000);
assert.ok(Object.values(merged.deleted).every((t) => t <= now));

// Analytics: only real pages are counted
assert.equal(cleanPath("/exams/ssc-cgl"), "/exams/ssc-cgl");
assert.equal(cleanPath("/"), "/");
assert.equal(cleanPath("/made-up-page-123"), null);

// Login redirect guard (the function is read from the page so the test follows the real code)
const src = readFileSync("src/app/login/page.tsx", "utf8");
const at = src.indexOf("function safeNext");
const safeNext = new Function(src.slice(at, src.indexOf("\n}", at) + 2).replace("(raw: string | null): string", "(raw)") + "; return safeNext;")();
for (const bad of ["//evil.com", "/\t/evil.com", "/\n/evil.com", "/\\evil.com", "https://evil.com", null]) assert.equal(safeNext(bad), "/today", JSON.stringify(bad));
assert.equal(safeNext("/batches?id=1#x"), "/batches?id=1#x");

console.log("✓ security: CSRF, body limits, client IP, sync bounds, analytics paths and login redirects all pass");
