// Doubts under questions end to end against a throwaway Postgres (never production): post, reply,
// report (three reports hide a post), admin hide/restore, delete with replies.
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip ADMIN_EMAILS=… npm run test:doubts
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}
const ADMIN = "mod-test@test.local";
process.env.ADMIN_EMAILS = ADMIN;

const { db, schema, sql } = await import("../src/db/index.ts");
const D = await import("../src/server/doubts.ts");
const { eq } = await import("drizzle-orm");

const mkUser = async (name, email = `${randomUUID().slice(0, 8)}@test.local`, emailVerified = true) => {
  const id = randomUUID();
  await db.insert(schema.users).values({ id, email, name });
  return { id, email, name, credits: 0, emailVerified };
};
const expectHttp = (p, status) => assert.rejects(p, (e) => e.status === status || (console.error(e), false));

const Q = "quant-percentage-1";
const users = [await mkUser("Asha"), await mkUser("Ravi"), await mkUser("Meena"), await mkUser("Kabir"), await mkUser("Admin", ADMIN), await mkUser("New", undefined, false)];
const [asha, ravi, meena, kabir, admin, unverified] = users;
try {
  await expectHttp(D.postDoubt(asha, { questionId: "no-such-question", body: "Why is it B?" }), 404);
  await expectHttp(D.postDoubt(unverified, { questionId: Q, body: "Why is it B?" }), 403);
  await expectHttp(D.postDoubt(asha, { questionId: Q, body: "  " }), 400);

  const { id: doubt } = await D.postDoubt(asha, { questionId: Q, body: "Why not 0%?\n\n\n\nThe rise and fall are equal." });
  const again = await D.postDoubt(asha, { questionId: Q, body: "Why not 0%?\n\n\n\nThe rise and fall are equal." });
  assert.equal(again.id, doubt); // a double tap posts once
  const { id: reply } = await D.postDoubt(ravi, { questionId: Q, parentId: doubt, body: "The 20% fall is on the bigger price, so it is not equal." });
  await expectHttp(D.postDoubt(meena, { questionId: Q, parentId: reply, body: "nested reply" }), 400);
  await expectHttp(D.postDoubt(meena, { questionId: "quant-percentage-2", parentId: doubt, body: "wrong question" }), 404);

  let list = await D.listDoubts(null, Q);
  assert.equal(list.canModerate, false);
  assert.equal(list.threads.length, 1);
  assert.equal(list.threads[0].body, "Why not 0%?\n\nThe rise and fall are equal.");
  assert.equal(list.threads[0].replies[0].name, "Ravi");
  assert.equal((await D.listDoubts(asha, Q)).threads[0].mine, true);

  // Reports: own post can't be reported; one report per user; the third hides the post
  await expectHttp(D.reportDoubt(asha, doubt), 400);
  await D.reportDoubt(ravi, doubt);
  await D.reportDoubt(ravi, doubt);
  await D.reportDoubt(meena, doubt);
  assert.equal((await D.listDoubts(null, Q)).threads.length, 1);
  await D.reportDoubt(kabir, doubt);
  assert.equal((await D.listDoubts(null, Q)).threads.length, 0);
  await expectHttp(D.postDoubt(meena, { questionId: Q, parentId: doubt, body: "reply to hidden" }), 404);

  // Admin sees hidden posts, restores (reports reset), hides again, and sees the queue
  list = await D.listDoubts(admin, Q);
  assert.equal(list.canModerate, true);
  assert.equal(list.threads[0].hidden, true);
  assert.equal(list.threads[0].reports, 3);
  assert.equal((await D.reportedDoubts(admin))[0].id, doubt);
  await expectHttp(D.reportedDoubts(asha), 403);
  await expectHttp(D.moderateDoubt(asha, doubt, false), 403);
  await D.moderateDoubt(admin, doubt, false);
  assert.equal((await D.listDoubts(null, Q)).threads.length, 1);
  await D.reportDoubt(meena, doubt); // reports were cleared, so this counts again
  assert.equal((await D.listDoubts(admin, Q)).threads[0].reports, 1);
  await D.moderateDoubt(admin, doubt, true);
  assert.equal((await D.listDoubts(null, Q)).threads.length, 0);
  await D.moderateDoubt(admin, doubt, false);

  // Delete: only the author or an admin; replies go with the post
  await expectHttp(D.deleteDoubt(ravi, doubt), 403);
  await D.deleteDoubt(asha, doubt);
  assert.equal((await D.listDoubts(admin, Q)).threads.length, 0);
  assert.equal((await db.select().from(schema.doubts).where(eq(schema.doubts.id, reply))).length, 0);

  console.log("✓ doubts: post, reply, double-tap, reports auto-hide, admin hide/restore, queue and delete all pass");
} finally {
  for (const u of users) await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await sql.end();
}
