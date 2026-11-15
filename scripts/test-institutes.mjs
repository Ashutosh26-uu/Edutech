// Institute pages against a throwaway local Postgres (never production): create, staff, sets,
// public vs members-only practice, join codes, directory, renaming and admin verification.
// Usage: node scripts/test-db.mjs <folder>, then DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5434/studyclip npm run test:institutes
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "";
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error("Refusing to run: DATABASE_URL must point at a local database.");
  process.exit(1);
}
const { db, schema, sql } = await import("../src/db/index.ts");
const I = await import("../src/server/institutions.ts");
const { eq } = await import("drizzle-orm");

const expectHttp = (p, status) => assert.rejects(p, (e) => e.status === status || (console.error(e), false));
const mkUser = async (name) => {
  const u = { id: randomUUID(), email: `${randomUUID().slice(0, 8)}@college.test`, name, credits: 0, emailVerified: true };
  await db.insert(schema.users).values({ id: u.id, email: u.email, name });
  return u;
};
const owner = await mkUser("Owner");
const staff = await mkUser("Staff");
const student = await mkUser("Student");
const outsider = await mkUser("Outsider");
const q = (n) => Array.from({ length: n }, (_, i) => ({ question: `Q${i + 1}?`, options: ["A", "B", "C", "D"], answer: i % 4, explanation: "Why." }));
let slug;

try {
  const name = `Test College ${randomUUID().slice(0, 4)}`;
  ({ slug } = await I.createInstitution(owner, { name, city: "Prayagraj" }));
  assert.match(slug, /^test-college-/);
  await expectHttp(I.createInstitution(owner, { name: "Bad site", website: "http://x" }), 400);

  // Staff
  await expectHttp(I.manageInstitution(staff, slug), 404);
  await I.addStaff(owner, slug, staff.email.toUpperCase());
  await expectHttp(I.addStaff(staff, slug, "x@y.z"), 403);
  const m = await I.manageInstitution(staff, slug);
  assert.equal(m.role, "staff");
  assert.equal(m.institute.verified, false);
  assert.match(m.institute.joinCode, /^[A-HJ-NP-Z2-9]{6}$/);

  // Sets: one public, one members-only, one draft
  const pub = await I.upsertSet(staff, slug, { title: "Aptitude basics", visibility: "public", published: true, questions: q(5) });
  const mem = await I.upsertSet(staff, slug, { title: "Internal mock", visibility: "members", published: true, questions: q(4) });
  const draft = await I.upsertSet(owner, slug, { title: "Draft", visibility: "public", published: false, questions: q(3) });
  await expectHttp(I.upsertSet(staff, slug, { title: "Too few", visibility: "public", published: true, questions: q(2) }), 400);
  await expectHttp(I.upsertSet(outsider, slug, { title: "Nope", visibility: "public", published: true, questions: q(3) }), 404);

  // Public page and practice access
  const page = await I.institutionPage(null, slug);
  assert.equal(page.sets.length, 2, "drafts are hidden");
  assert.equal(page.sets.find((s) => s.id === mem.id).locked, true);
  assert.equal((await I.practiceSet(null, pub.id)).set.questions.length, 5);
  await expectHttp(I.practiceSet(null, mem.id), 401);
  await expectHttp(I.practiceSet(student, mem.id), 403);
  await expectHttp(I.practiceSet(student, draft.id), 404);
  assert.equal((await I.practiceSet(staff, draft.id)).set.questions.length, 3, "staff can preview drafts");

  // Joining unlocks members-only sets
  await I.joinInstitution(student, ` ${m.institute.joinCode.toLowerCase()} `);
  assert.equal((await I.practiceSet(student, mem.id)).set.questions.length, 4);
  const sp = await I.institutionPage(student, slug);
  assert.equal(sp.member, true);
  assert.equal(sp.sets.find((s) => s.id === mem.id).locked, false);
  assert.deepEqual((await I.myInstitutions(student)).joined.map((j) => j.slug), [slug]);

  // Directory lists it (with public question count), verified first
  const dir = await I.directory();
  const row = dir.find((d) => d.slug === slug);
  assert.equal(row.questions, 5);
  assert.equal(row.verified, false);

  // Admin verifies; renaming sends it back for review
  const admin = (await I.adminInstitutions()).find((x) => x.slug === slug);
  await I.setVerified(admin.id, true);
  assert.equal((await I.institutionPage(null, slug)).institute.verified, true);
  await expectHttp(I.updateInstitution(staff, slug, { name: "Renamed" }), 403);
  await I.updateInstitution(owner, slug, { name: `${name} (Main campus)` });
  assert.equal((await I.institutionPage(null, slug)).institute.verified, false);

  // Edit and delete sets, remove staff, remove the page
  await I.upsertSet(staff, slug, { id: pub.id, title: "Aptitude basics v2", visibility: "public", published: true, questions: q(6) });
  assert.equal((await I.practiceSet(null, pub.id)).set.questions.length, 6);
  await I.deleteSet(staff, slug, draft.id);
  await I.removeStaff(owner, slug, staff.email);
  await expectHttp(I.manageInstitution(staff, slug), 404);
  await I.removeInstitution(admin.id);
  slug = null;
  await expectHttp(I.institutionPage(null, row.slug), 404);

  console.log("✓ institutes: create, staff, sets, public vs members-only, join, directory, verify, rename and removal all pass");
} finally {
  if (slug) await db.delete(schema.institutions).where(eq(schema.institutions.slug, slug));
  for (const u of [owner, staff, student, outsider]) await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await sql.end();
}
