import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db, schema } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import type { MCQ } from "@/lib/types";
import { isAdmin } from "./admin";
import { requireUser, type SessionUser } from "./auth";
import { HttpError } from "./http";

/**
 * Site content that changes every day: the current-affairs quiz and the exam calendar. Admins
 * (ADMIN_EMAILS) publish it and can give publishing access to others (a university, a coaching
 * centre, a teacher) by email; those editors publish too but cannot grant access.
 */

const ce = schema.contentEditors;
const dq = schema.dailyQuizzes;
const ev = schema.examEvents;

/** Today's date in India (the quiz day), as YYYY-MM-DD. */
export const istDay = (t = Date.now()) => new Date(t + 5.5 * 3600_000).toISOString().slice(0, 10);
const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export type Role = "admin" | "editor" | null;

export async function roleOf(user: SessionUser | null): Promise<{ role: Role; organisation: string | null }> {
  if (!user) return { role: null, organisation: null };
  if (isAdmin(user)) return { role: "admin", organisation: null };
  const [row] = await db.select().from(ce).where(eq(ce.email, user.email.toLowerCase())).limit(1);
  return row ? { role: "editor", organisation: row.organisation } : { role: null, organisation: null };
}

export async function requireEditor(req: NextRequest): Promise<SessionUser> {
  const user = await requireUser(req);
  if (!(await roleOf(user)).role) throw new HttpError(403, "You don’t have publishing access. Ask the site admin to add your email.", "forbidden");
  return user;
}

export async function requireContentAdmin(req: NextRequest): Promise<SessionUser> {
  const user = await requireUser(req);
  if (!isAdmin(user)) throw new HttpError(403, "Only the site admin can change access.", "forbidden");
  return user;
}

// ---------- Access ----------

export async function listEditors() {
  const rows = await db.select().from(ce).orderBy(asc(ce.email));
  return rows.map((r) => ({ email: r.email, organisation: r.organisation, createdAt: r.createdAt.getTime() }));
}

export async function grantEditor(admin: SessionUser, email: string, organisation?: string) {
  const clean = email.trim().toLowerCase();
  await db
    .insert(ce)
    .values({ email: clean, organisation: organisation?.trim() || null, grantedBy: admin.id })
    .onConflictDoUpdate({ target: ce.email, set: { organisation: organisation?.trim() || null } });
}

export async function revokeEditor(email: string) {
  await db.delete(ce).where(eq(ce.email, email.trim().toLowerCase()));
}

// ---------- Daily current-affairs quiz ----------

export interface QuizInput {
  day: string;
  title: string;
  published: boolean;
  questions: { question: string; options: string[]; answer: number; explanation?: string }[];
}

/** Checks hand-written questions (four distinct options, one marked answer) and gives them stable ids. */
export function cleanMcqs(idPrefix: string, qs: QuizInput["questions"], max = 25): MCQ[] {
  if (qs.length < 3 || qs.length > max) throw new HttpError(400, `Add 3 to ${max} questions.`);
  return qs.map((q, i) => {
    const options = q.options.map((o) => o.trim());
    if (!q.question.trim()) throw new HttpError(400, `Question ${i + 1} is empty.`);
    if (options.length !== 4 || options.some((o) => !o)) throw new HttpError(400, `Question ${i + 1} needs four filled options.`);
    if (new Set(options.map((o) => o.toLowerCase())).size !== 4) throw new HttpError(400, `Question ${i + 1} has two identical options.`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw new HttpError(400, `Question ${i + 1} has no correct answer marked.`);
    return { id: `${idPrefix}-${i + 1}`, question: q.question.trim(), options, answer: q.answer, explanation: q.explanation?.trim() || "", topicId: undefined, difficulty: "moderate" };
  });
}

export async function upsertQuiz(user: SessionUser, input: QuizInput) {
  const questions = cleanMcqs(`ca-${input.day}`, input.questions);
  const [row] = await db
    .insert(dq)
    .values({ day: input.day, title: input.title.trim(), questions, published: input.published, createdBy: user.id })
    .onConflictDoUpdate({ target: dq.day, set: { title: input.title.trim(), questions, published: input.published, updatedAt: new Date() } })
    .returning({ id: dq.id, day: dq.day });
  return row;
}

export async function deleteQuiz(day: string) {
  await db.delete(dq).where(eq(dq.day, day));
}

/** Editors: every quiz, drafts included, newest first. */
export async function editorQuizzes() {
  const rows = await db.select().from(dq).orderBy(desc(dq.day)).limit(120);
  return rows.map((r) => ({ day: r.day, title: r.title, published: r.published, questions: r.questions, updatedAt: r.updatedAt.getTime() }));
}

/**
 * The public quiz page: one published quiz (today's, a chosen day's, or the latest one), plus the
 * list of recent published days. Future-dated quizzes stay hidden until their day.
 */
export async function publicQuiz(day?: string) {
  const today = istDay();
  const list = await db
    .select({ day: dq.day, title: dq.title, n: sql<number>`jsonb_array_length(${dq.questions})` })
    .from(dq)
    .where(and(eq(dq.published, true), lte(dq.day, today)))
    .orderBy(desc(dq.day))
    .limit(60);
  const pick = day && day <= today ? day : list[0]?.day;
  const [quiz] = pick ? await db.select().from(dq).where(and(eq(dq.day, pick), eq(dq.published, true))).limit(1) : [];
  return {
    today,
    quiz: quiz ? { day: quiz.day, title: quiz.title, questions: quiz.questions, isToday: quiz.day === today } : null,
    days: list.map((l) => ({ day: l.day, title: l.title, count: l.n })),
  };
}

// ---------- Exam calendar ----------

export interface EventInput {
  id?: string;
  examId: string | null;
  kind: (typeof schema.examEvents.$inferInsert)["kind"];
  title: string;
  day: string;
  endDay?: string | null;
  link?: string | null;
  note?: string | null;
}

export async function upsertEvent(user: SessionUser, input: EventInput) {
  if (input.examId && !EXAM_BY_ID.has(input.examId)) throw new HttpError(400, "Unknown exam.");
  if (input.endDay && input.endDay < input.day) throw new HttpError(400, "The end date is before the start date.");
  if (input.link && !/^https:\/\/[^\s]+$/i.test(input.link)) throw new HttpError(400, "The link must start with https://");
  const values = { examId: input.examId, kind: input.kind, title: input.title.trim(), day: input.day, endDay: input.endDay || null, link: input.link?.trim() || null, note: input.note?.trim() || null };
  if (input.id) {
    const rows = await db.update(ev).set({ ...values, updatedAt: new Date() }).where(eq(ev.id, input.id)).returning({ id: ev.id });
    if (!rows.length) throw new HttpError(404, "Event not found.");
    return rows[0];
  }
  const [row] = await db
    .insert(ev)
    .values({ id: randomUUID(), ...values, createdBy: user.id })
    .returning({ id: ev.id });
  return row;
}

export async function deleteEvent(id: string) {
  await db.delete(ev).where(eq(ev.id, id));
}

const eventOut = (r: typeof ev.$inferSelect) => ({
  id: r.id,
  examId: r.examId,
  examName: r.examId ? (EXAM_BY_ID.get(r.examId)?.name ?? r.examId) : null,
  kind: r.kind,
  title: r.title,
  day: r.day,
  endDay: r.endDay,
  link: r.link,
  note: r.note,
});

/** Upcoming events (from a week ago, so just-closed windows still show), optionally for one exam. */
export async function upcomingEvents(opts: { examId?: string; limit?: number } = {}) {
  const from = addDays(istDay(), -7);
  const rows = await db
    .select()
    .from(ev)
    .where(and(or(gte(ev.day, from), gte(ev.endDay, from)), opts.examId ? eq(ev.examId, opts.examId) : undefined))
    .orderBy(asc(ev.day))
    .limit(opts.limit ?? 300);
  return { today: istDay(), events: rows.map(eventOut) };
}

/** Editors: everything, including past events, newest first. */
export async function editorEvents() {
  const rows = await db.select().from(ev).orderBy(desc(ev.day)).limit(500);
  return rows.map(eventOut);
}
