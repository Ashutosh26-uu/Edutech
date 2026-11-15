import { z } from "zod";
import { getUser, requireUser } from "@/server/auth";
import { MAX_BODY, deleteDoubt, listDoubts, moderateDoubt, postDoubt, reportedDoubts } from "@/server/doubts";
import { HttpError, json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const QuestionId = z.string().min(1).max(120);
const Post = z.object({ questionId: QuestionId, parentId: z.uuid().nullable().optional(), body: z.string().max(MAX_BODY + 200) });
const Moderate = z.object({ id: z.uuid(), hidden: z.boolean() });
const noStore = { headers: { "Cache-Control": "no-store" } };

/** ?q=<question id>: the doubts under a question (login optional). ?reported=1: the admin review queue. */
export const GET = route(async (req) => {
  const params = req.nextUrl.searchParams;
  if (params.get("reported")) return json({ posts: await reportedDoubts(await requireUser(req)) }, noStore);
  const q = QuestionId.safeParse(params.get("q"));
  if (!q.success) throw new HttpError(400, "Missing question.");
  return json(await listDoubts(await getUser(req), q.data), noStore);
});

/** Ask a doubt, or reply to one. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`discuss:${user.id}`, 30, 60 * 60_000);
  return json(await postDoubt(user, await parseBody(req, Post)), 201);
});

/** Admins: hide or restore a post. */
export const PATCH = route(async (req) => {
  const user = await requireUser(req);
  const { id, hidden } = await parseBody(req, Moderate);
  await moderateDoubt(user, id, hidden);
  return json({ ok: true });
});

/** Delete your own post (admins: any post), with its replies. */
export const DELETE = route(async (req) => {
  const user = await requireUser(req);
  const id = z.uuid().safeParse(req.nextUrl.searchParams.get("id"));
  if (!id.success) throw new HttpError(400, "Missing post.");
  await deleteDoubt(user, id.data);
  return json({ ok: true });
});
