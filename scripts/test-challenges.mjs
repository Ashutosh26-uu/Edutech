// 1-vs-1 challenges end to end against a throwaway Postgres (never production): make one, open it
// logged out and in, play it twice, and check the key is only shown to players who have finished.
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip npm run test:challenges
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}

const { db, schema, sql } = await import("../src/db/index.ts");
const C = await import("../src/server/challenges.ts");
const { eq } = await import("drizzle-orm");

const mkUser = async (name) => {
  const id = randomUUID();
  await db.insert(schema.users).values({ id, email: `${id.slice(0, 8)}@test.local`, name });
  return { id, email: `${id.slice(0, 8)}@test.local`, name, credits: 0, emailVerified: true };
};
const expectHttp = (p, status) => assert.rejects(p, (e) => e.status === status || (console.error(e), false));

const asha = await mkUser("Asha");
const ravi = await mkUser("Ravi");
try {
  await expectHttp(C.createChallenge(asha, "no-such-exam"), 400);
  const { id } = await C.createChallenge(asha, "ssc-cgl");
  assert.match(id, /^[A-HJ-NP-Z2-9]{6}$/);

  // Logged out: who challenged you, but no questions
  const anon = await C.getChallenge(null, id);
  assert.equal(anon.creator, "Asha");
  assert.equal(anon.total, 10);
  assert.equal(anon.questions.length, 0);

  // Before playing: questions without answers or explanations; codes are case-insensitive
  const before = await C.getChallenge(ravi, id.toLowerCase());
  assert.equal(before.questions.length, 10);
  assert.ok(before.questions.every((q) => !("answer" in q) && !("explanation" in q)));
  assert.equal(before.answers, null);
  assert.equal(before.isCreator, false);

  // Asha plays all right; Ravi gets some wrong and is slower
  const [row] = await db.select().from(schema.challenges).where(eq(schema.challenges.id, id));
  const key = row.questions.map((q) => q.answer);
  const a = await C.playChallenge(asha, id, key, 120);
  assert.equal(a.players[0].correct, 10);
  assert.ok(a.questions.every((q) => q.answer >= 0 && typeof q.explanation === "string"));
  await expectHttp(C.playChallenge(ravi, id, [0, 1], 10), 400);
  const r = await C.playChallenge(ravi, id, key.map((k, i) => (i < 6 ? k : (k + 1) % 4)), 200);
  assert.deepEqual(r.players.map((p) => [p.name, p.correct, p.me]), [["Asha", 10, false], ["Ravi", 6, true]]);
  // A second go keeps the first result
  const again = await C.playChallenge(ravi, id, key, 30);
  assert.equal(again.players.find((p) => p.me).correct, 6);

  // Lists and expiry
  assert.equal((await C.myChallenges(asha))[0].players, 2);
  assert.equal((await C.myChallenges(ravi))[0].mine, false);
  await db.update(schema.challenges).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(schema.challenges.id, id));
  await expectHttp(C.getChallenge(ravi, id), 404);
  assert.equal((await C.myChallenges(asha)).length, 0);

  console.log("✓ challenges: create, open, play, key hidden until played, ranking, one go each and expiry all pass");
} finally {
  for (const u of [asha, ravi]) await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await sql.end();
}
