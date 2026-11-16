import "server-only";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { findQuestions } from "@/lib/bank";
import { isAdmin } from "./admin";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/**
 * Doubts under a question: logged-in students ask, others reply. Moderation: anyone can report a
 * post once; three reports hide it until an admin looks. Admins see hidden posts and can hide or
 * restore any post; authors can delete their own.
 */

const d = schema.doubts;
const r = schema.doubtReports;
export const MAX_BODY = 1000;
const HIDE_AFTER_REPORTS = 3;
const MAX_POSTS_PER_QUESTION = 300;

// Never derived from the email: these names are shown to anyone, logged in or not.
const nameOf = (u: { name: string | null }) => u.name?.trim() || "Student";

export async function listDoubts(user: SessionUser | null, questionId: string) {
  const mod = isAdmin(user);
  const rows = await db
    .select({ id: d.id, parentId: d.parentId, userId: d.userId, body: d.body, hidden: d.hidden, reports: d.reports, createdAt: d.createdAt, name: schema.users.name, email: schema.users.email })
    .from(d)
    .innerJoin(schema.users, eq(schema.users.id, d.userId))
    .where(and(eq(d.questionId, questionId), mod ? undefined : eq(d.hidden, false)))
    .orderBy(asc(d.createdAt))
    .limit(MAX_POSTS_PER_QUESTION);
  const out = rows.map((x) => ({
    id: x.id,
    parentId: x.parentId,
    name: nameOf(x),
    body: x.body,
    createdAt: x.createdAt.getTime(),
    mine: x.userId === user?.id,
    ...(mod ? { hidden: x.hidden, reports: x.reports } : {}),
  }));
  // Threads: top-level posts, newest first, each with its replies in order. Replies to a hidden
  // post stay hidden with it.
  const top = out.filter((x) => !x.parentId).reverse();
  return {
    canModerate: mod,
    threads: top.map((t) => ({ ...t, replies: out.filter((x) => x.parentId === t.id) })),
  };
}

export async function postDoubt(user: SessionUser, input: { questionId: string; parentId?: string | null; body: string }) {
  if (!user.emailVerified) throw new HttpError(403, "Verify your email to post doubts.", "email_unverified");
  const body = input.body.trim().replace(/\n{3,}/g, "\n\n");
  if (body.length < 3) throw new HttpError(400, "Write a little more.");
  if (body.length > MAX_BODY) throw new HttpError(400, `Keep it under ${MAX_BODY} characters.`);
  // Only real bank questions have threads, so nobody can open threads on made-up ids.
  if (!(await findQuestions([input.questionId])).has(input.questionId)) throw new HttpError(404, "Question not found.");
  if (input.parentId) {
    const [parent] = await db.select({ questionId: d.questionId, parentId: d.parentId, hidden: d.hidden }).from(d).where(eq(d.id, input.parentId)).limit(1);
    if (!parent || parent.questionId !== input.questionId || parent.hidden) throw new HttpError(404, "That doubt is no longer there.");
    if (parent.parentId) throw new HttpError(400, "Reply to the doubt itself.");
  }
  // The same text twice in a row (a double tap) is posted once.
  const [dupe] = await db
    .select({ id: d.id })
    .from(d)
    .where(and(eq(d.userId, user.id), eq(d.questionId, input.questionId), eq(d.body, body), gte(d.createdAt, new Date(Date.now() - 10 * 60_000))))
    .limit(1);
  if (dupe) return { id: dupe.id };
  const [row] = await db.insert(d).values({ questionId: input.questionId, parentId: input.parentId ?? null, userId: user.id, body }).returning({ id: d.id });
  return { id: row.id };
}

export async function reportDoubt(user: SessionUser, id: string) {
  const [post] = await db.select({ userId: d.userId }).from(d).where(eq(d.id, id)).limit(1);
  if (!post) throw new HttpError(404, "That doubt is no longer there.");
  if (post.userId === user.id) throw new HttpError(400, "You can delete your own post instead.");
  await db.transaction(async (tx) => {
    const added = await tx.insert(r).values({ doubtId: id, userId: user.id }).onConflictDoNothing().returning({ id: r.doubtId });
    if (!added.length) return;
    await tx
      .update(d)
      .set({ reports: sql`${d.reports} + 1`, hidden: sql`${d.hidden} or ${d.reports} + 1 >= ${HIDE_AFTER_REPORTS}` })
      .where(eq(d.id, id));
  });
}

export async function moderateDoubt(user: SessionUser, id: string, hidden: boolean) {
  if (!isAdmin(user)) throw new HttpError(403, "Only admins can hide or restore posts.", "forbidden");
  const rows = await db
    .update(d)
    .set(hidden ? { hidden: true } : { hidden: false, reports: 0 })
    .where(eq(d.id, id))
    .returning({ id: d.id });
  if (!rows.length) throw new HttpError(404, "That doubt is no longer there.");
  if (!hidden) await db.delete(r).where(eq(r.doubtId, id));
}

export async function deleteDoubt(user: SessionUser, id: string) {
  const [post] = await db.select({ userId: d.userId }).from(d).where(eq(d.id, id)).limit(1);
  if (!post) return;
  if (post.userId !== user.id && !isAdmin(user)) throw new HttpError(403, "You can only delete your own posts.", "forbidden");
  await db.delete(d).where(eq(d.id, id)); // replies go with it (ON DELETE CASCADE)
}

/** Admins: the most-reported posts, for a quick review queue. */
export async function reportedDoubts(user: SessionUser) {
  if (!isAdmin(user)) throw new HttpError(403, "Admins only.", "forbidden");
  const rows = await db
    .select({ id: d.id, questionId: d.questionId, body: d.body, hidden: d.hidden, reports: d.reports, createdAt: d.createdAt, name: schema.users.name, email: schema.users.email })
    .from(d)
    .innerJoin(schema.users, eq(schema.users.id, d.userId))
    .where(gte(d.reports, 1))
    .orderBy(desc(d.reports), desc(d.createdAt))
    .limit(100);
  return rows.map((x) => ({ id: x.id, questionId: x.questionId, body: x.body, hidden: x.hidden, reports: x.reports, createdAt: x.createdAt.getTime(), name: nameOf(x) }));
}
