import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { MCQ } from "@/lib/types";
import type { SessionUser } from "./auth";
import { newCode, normaliseCode } from "./batches";
import { cleanMcqs, type QuizInput } from "./content";
import { HttpError } from "./http";

/**
 * Institution pages (see schema.institutions). Staff publish question sets; students practise
 * public sets freely and members-only sets after joining with the institution's code.
 */

const it = schema.institutions;
const st = schema.institutionStaff;
const im = schema.institutionMembers;
const is = schema.institutionSets;

export const LIMITS = { perOwner: 5, staff: 30, sets: 300, questions: 200 };

// The outer column in correlated subqueries, in full (see batches.ts for why).
const INST_ID = sql.raw(`"institutions"."id"`);

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "institute";

async function access(user: SessionUser | null, institutionId: string): Promise<"owner" | "staff" | null> {
  if (!user) return null;
  const [row] = await db.select({ role: st.role }).from(st).where(and(eq(st.institutionId, institutionId), eq(st.email, user.email.toLowerCase()))).limit(1);
  return row?.role ?? null;
}

async function bySlug(slug: string) {
  const [row] = await db.select().from(it).where(eq(it.slug, slug)).limit(1);
  if (!row) throw new HttpError(404, "Institute not found.");
  return row;
}

async function staffOnly(user: SessionUser, slug: string) {
  const inst = await bySlug(slug);
  const role = await access(user, inst.id);
  if (!role) throw new HttpError(404, "Institute not found.");
  return { inst, role };
}

export async function createInstitution(user: SessionUser, input: { name: string; city?: string; about?: string; website?: string }) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(st).where(and(eq(st.email, user.email.toLowerCase()), eq(st.role, "owner")));
  if (n >= LIMITS.perOwner) throw new HttpError(409, `You can create up to ${LIMITS.perOwner} institute pages.`);
  if (input.website && !/^https:\/\/[^\s]+$/i.test(input.website)) throw new HttpError(400, "The website must start with https://");
  const base = slugify(input.name);
  for (let i = 0; i < 6; i++) {
    const slug = i === 0 ? base : `${base}-${newCode().toLowerCase().slice(0, 4)}`;
    const created = await db.transaction(async (tx) => {
      const rows = await tx
        .insert(it)
        .values({ slug, name: input.name.trim(), city: input.city?.trim() || null, about: input.about?.trim() || null, website: input.website?.trim() || null, joinCode: newCode(), createdBy: user.id })
        .onConflictDoNothing()
        .returning();
      if (!rows.length) return null;
      await tx.insert(st).values({ institutionId: rows[0].id, email: user.email.toLowerCase(), role: "owner" });
      return rows[0];
    });
    if (created) return { slug: created.slug };
  }
  throw new HttpError(500, "Could not create the page. Try a slightly different name.");
}

/** Everything the public page shows, plus what the viewer may do there. */
export async function institutionPage(user: SessionUser | null, slug: string) {
  const inst = await bySlug(slug);
  const role = await access(user, inst.id);
  const member = user ? (await db.select({ u: im.userId }).from(im).where(and(eq(im.institutionId, inst.id), eq(im.userId, user.id))).limit(1)).length > 0 : false;
  const sets = await db
    .select({ id: is.id, title: is.title, description: is.description, visibility: is.visibility, updatedAt: is.updatedAt, count: sql<number>`jsonb_array_length(${is.questions})` })
    .from(is)
    .where(and(eq(is.institutionId, inst.id), eq(is.published, true)))
    .orderBy(desc(is.updatedAt));
  const [{ members }] = await db.select({ members: sql<number>`count(*)::int` }).from(im).where(eq(im.institutionId, inst.id));
  return {
    institute: { slug: inst.slug, name: inst.name, city: inst.city, about: inst.about, website: inst.website, verified: inst.verified },
    role,
    member,
    members,
    sets: sets.map((s) => ({ ...s, updatedAt: s.updatedAt.getTime(), locked: s.visibility === "members" && !member && !role })),
  };
}

/** Directory: institutes with at least one published set, verified first. */
export async function directory() {
  const rows = await db
    .select({
      slug: it.slug,
      name: it.name,
      city: it.city,
      verified: it.verified,
      sets: sql<number>`(select count(*)::int from ${is} where ${is.institutionId} = ${INST_ID} and ${is.published})`,
      questions: sql<number>`(select coalesce(sum(jsonb_array_length(${is.questions})), 0)::int from ${is} where ${is.institutionId} = ${INST_ID} and ${is.published} and ${is.visibility} = 'public')`,
    })
    .from(it)
    .orderBy(desc(it.verified), asc(it.name));
  return rows.filter((r) => r.sets > 0);
}

export async function joinInstitution(user: SessionUser, code: string) {
  const joinCode = normaliseCode(code);
  if (joinCode.length !== 6) throw new HttpError(400, "Institute codes have 6 letters and numbers.");
  const [inst] = await db.select().from(it).where(eq(it.joinCode, joinCode)).limit(1);
  if (!inst) throw new HttpError(404, "No institute has this code. Check it with your college.");
  await db.insert(im).values({ institutionId: inst.id, userId: user.id }).onConflictDoNothing();
  return { slug: inst.slug, name: inst.name };
}

/** A set to practise: public sets for anyone, members-only sets for members and staff. */
export async function practiceSet(user: SessionUser | null, setId: string) {
  const [row] = await db
    .select({ set: is, slug: it.slug, name: it.name, verified: it.verified })
    .from(is)
    .innerJoin(it, eq(it.id, is.institutionId))
    .where(eq(is.id, setId))
    .limit(1);
  if (!row) throw new HttpError(404, "Set not found.");
  const role = await access(user, row.set.institutionId);
  if (!row.set.published && !role) throw new HttpError(404, "Set not found.");
  if (row.set.visibility === "members" && !role) {
    if (!user) throw new HttpError(401, "Log in and join this institute to practise this set.", "unauthenticated");
    const [m] = await db.select({ u: im.userId }).from(im).where(and(eq(im.institutionId, row.set.institutionId), eq(im.userId, user.id))).limit(1);
    if (!m) throw new HttpError(403, "This set is for the institute’s students. Join with the institute’s code to practise it.", "members_only");
  }
  return { institute: { slug: row.slug, name: row.name, verified: row.verified }, set: { id: row.set.id, title: row.set.title, description: row.set.description, questions: row.set.questions } };
}

// ---------- Staff ----------

export async function manageInstitution(user: SessionUser, slug: string) {
  const { inst, role } = await staffOnly(user, slug);
  const staff = await db.select().from(st).where(eq(st.institutionId, inst.id)).orderBy(asc(st.createdAt));
  const sets = await db.select().from(is).where(eq(is.institutionId, inst.id)).orderBy(desc(is.updatedAt));
  const [{ members }] = await db.select({ members: sql<number>`count(*)::int` }).from(im).where(eq(im.institutionId, inst.id));
  return {
    institute: { id: inst.id, slug: inst.slug, name: inst.name, city: inst.city, about: inst.about, website: inst.website, verified: inst.verified, joinCode: inst.joinCode },
    role,
    members,
    staff: staff.map((s) => ({ email: s.email, role: s.role })),
    sets: sets.map((s) => ({ id: s.id, title: s.title, description: s.description, visibility: s.visibility, published: s.published, questions: s.questions, updatedAt: s.updatedAt.getTime() })),
  };
}

export async function updateInstitution(user: SessionUser, slug: string, input: { name: string; city?: string; about?: string; website?: string }) {
  const { inst, role } = await staffOnly(user, slug);
  if (role !== "owner") throw new HttpError(403, "Only the page owner can edit its details.");
  if (input.website && !/^https:\/\/[^\s]+$/i.test(input.website)) throw new HttpError(400, "The website must start with https://");
  // Renaming a verified page sends it back for review, so a verified badge can't be reused for another name.
  const renamed = input.name.trim() !== inst.name;
  await db
    .update(it)
    .set({ name: input.name.trim(), city: input.city?.trim() || null, about: input.about?.trim() || null, website: input.website?.trim() || null, ...(renamed ? { verified: false } : {}) })
    .where(eq(it.id, inst.id));
}

export async function addStaff(user: SessionUser, slug: string, email: string) {
  const { inst, role } = await staffOnly(user, slug);
  if (role !== "owner") throw new HttpError(403, "Only the page owner can add staff.");
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(st).where(eq(st.institutionId, inst.id));
  if (n >= LIMITS.staff) throw new HttpError(409, `An institute can have up to ${LIMITS.staff} staff.`);
  await db.insert(st).values({ institutionId: inst.id, email: email.trim().toLowerCase(), role: "staff" }).onConflictDoNothing();
}

export async function removeStaff(user: SessionUser, slug: string, email: string) {
  const { inst, role } = await staffOnly(user, slug);
  if (role !== "owner") throw new HttpError(403, "Only the page owner can remove staff.");
  await db.delete(st).where(and(eq(st.institutionId, inst.id), eq(st.email, email.trim().toLowerCase()), eq(st.role, "staff")));
}

export interface SetInput {
  id?: string;
  title: string;
  description?: string;
  visibility: "public" | "members";
  published: boolean;
  questions: QuizInput["questions"];
}

export async function upsertSet(user: SessionUser, slug: string, input: SetInput) {
  const { inst } = await staffOnly(user, slug);
  const id = input.id ?? randomUUID();
  const questions: MCQ[] = cleanMcqs(`inst-${id.slice(0, 8)}`, input.questions, LIMITS.questions);
  const values = { title: input.title.trim(), description: input.description?.trim() || null, visibility: input.visibility, published: input.published, questions };
  if (input.id) {
    const rows = await db
      .update(is)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(is.id, input.id), eq(is.institutionId, inst.id)))
      .returning({ id: is.id });
    if (!rows.length) throw new HttpError(404, "Set not found.");
    return rows[0];
  }
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(is).where(eq(is.institutionId, inst.id));
  if (n >= LIMITS.sets) throw new HttpError(409, `An institute can have up to ${LIMITS.sets} sets.`);
  const [row] = await db
    .insert(is)
    .values({ id, institutionId: inst.id, ...values, createdBy: user.id })
    .returning({ id: is.id });
  return row;
}

export async function deleteSet(user: SessionUser, slug: string, setId: string) {
  const { inst } = await staffOnly(user, slug);
  await db.delete(is).where(and(eq(is.id, setId), eq(is.institutionId, inst.id)));
}

/** The institute pages the user runs, for /institutes. */
export async function myInstitutions(user: SessionUser) {
  const rows = await db
    .select({ slug: it.slug, name: it.name, verified: it.verified, role: st.role })
    .from(st)
    .innerJoin(it, eq(it.id, st.institutionId))
    .where(eq(st.email, user.email.toLowerCase()))
    .orderBy(asc(it.name));
  const joined = await db
    .select({ slug: it.slug, name: it.name, verified: it.verified })
    .from(im)
    .innerJoin(it, eq(it.id, im.institutionId))
    .where(eq(im.userId, user.id))
    .orderBy(asc(it.name));
  return { running: rows, joined };
}

// ---------- Site admin ----------

export async function adminInstitutions() {
  const rows = await db
    .select({ id: it.id, slug: it.slug, name: it.name, city: it.city, verified: it.verified, createdAt: it.createdAt, sets: sql<number>`(select count(*)::int from ${is} where ${is.institutionId} = ${INST_ID})` })
    .from(it)
    .orderBy(asc(it.verified), desc(it.createdAt));
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.getTime() }));
}

export async function setVerified(id: string, verified: boolean) {
  await db.update(it).set({ verified }).where(eq(it.id, id));
}

export async function removeInstitution(id: string) {
  await db.delete(it).where(eq(it.id, id));
}
