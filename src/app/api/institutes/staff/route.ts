import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { addStaff, removeStaff } from "@/server/institutions";
import { rateLimit } from "@/server/rate-limit";

const Slug = z.string().regex(/^[a-z0-9-]{1,60}$/);

/** The page owner adds or removes staff by email. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`institute-staff:${user.id}`, 60, 60 * 60_000);
  const { slug, email } = await parseBody(req, z.object({ slug: Slug, email: z.email("Enter a valid email.") }));
  await addStaff(user, slug, email);
  return json({ ok: true });
});

export const DELETE = route(async (req) => {
  const user = await requireUser(req);
  const { slug, email } = await parseBody(req, z.object({ slug: Slug, email: z.string().max(200) }));
  await removeStaff(user, slug, email);
  return json({ ok: true });
});
