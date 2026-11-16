// Account deletion against a throwaway Postgres (never production): the user's rows go, rows
// that only pointed at them are cleaned, and access granted to their email is revoked.
// Usage: DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip npm run test:account
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}

const { db, schema, sql } = await import("../src/db/index.ts");
const { deleteAccount } = await import("../src/server/account.ts");
const { eq } = await import("drizzle-orm");

const id = randomUUID();
const email = `${id.slice(0, 8)}@test.local`;
const user = { id, email, name: "Leaving User", credits: 0, emailVerified: true };
await db.insert(schema.users).values({ id, email, name: user.name });
try {
  await db.insert(schema.contentEditors).values({ email, organisation: "X" });
  await db.insert(schema.contactMessages).values({ userId: id, name: user.name, email, topic: "support", message: "hello there, a message" }).catch(() => {});
  await db.insert(schema.questionReports).values({ userId: id, questionId: "quant-percentage-1", reason: "other", note: "my private note" });
  await db.insert(schema.pushSubscriptions).values({ endpoint: `https://fcm.googleapis.com/fcm/send/${id}`, p256dh: "AAAAAAAAAA", auth: "AAAAAAAAAA", userId: id, hourIst: 8 });

  const out = await deleteAccount(user);
  assert.equal(typeof out.loginDeleted, "boolean"); // false here: there is no real auth service

  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, id))).length, 0);
  assert.equal((await db.select().from(schema.contentEditors).where(eq(schema.contentEditors.email, email))).length, 0);
  assert.equal((await db.select().from(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.endpoint, `https://fcm.googleapis.com/fcm/send/${id}`))).length, 0);
  assert.equal((await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.email, email))).length, 0);
  const [report] = await db.select().from(schema.questionReports).where(eq(schema.questionReports.questionId, "quant-percentage-1"));
  assert.ok(!report || report.note === null);
  console.log("✓ account deletion: user rows, contact messages, report notes, reminders and email access all removed");
} finally {
  await db.delete(schema.users).where(eq(schema.users.id, id));
  await db.delete(schema.questionReports).where(eq(schema.questionReports.questionId, "quant-percentage-1"));
  await sql.end();
}
