import { z } from "zod";
import { requireUser } from "@/server/auth";
import { HttpError, json, parseBody, route } from "@/server/http";
import { deleteSet, LIMITS, upsertSet } from "@/server/institutions";
import { rateLimit } from "@/server/rate-limit";

const Slug = z.string().regex(/^[a-z0-9-]{1,60}$/);
const Body = z.object({
  slug: Slug,
  id: z.uuid().optional(),
  title: z.string().trim().min(3, "Give the set a title.").max(120),
  description: z.string().trim().max(400).optional(),
  visibility: z.enum(["public", "members"]),
  published: z.boolean(),
  questions: z
    .array(z.object({ question: z.string().max(1500), options: z.array(z.string().max(400)).length(4), answer: z.number().int(), explanation: z.string().max(2000).optional() }))
    .min(3)
    .max(LIMITS.questions),
});

/** Staff create or edit a question set. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`institute-sets:${user.id}`, 200, 60 * 60_000);
  const { slug, ...input } = await parseBody(req, Body);
  return json(await upsertSet(user, slug, input));
});

export const DELETE = route(async (req) => {
  const user = await requireUser(req);
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!Slug.safeParse(slug).success || !z.uuid().safeParse(id).success) throw new HttpError(404, "Set not found.");
  await deleteSet(user, slug, id);
  return json({ ok: true });
});
