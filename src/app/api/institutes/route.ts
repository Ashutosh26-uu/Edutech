import { z } from "zod";
import { getUser, requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { createInstitution, directory, myInstitutions } from "@/server/institutions";
import { rateLimit } from "@/server/rate-limit";

/** Directory of institutes with published sets, plus the viewer's own when logged in. */
export const GET = route(async (req) => {
  const user = await getUser(req);
  const [list, mine] = await Promise.all([directory(), user ? myInstitutions(user) : Promise.resolve(null)]);
  return json({ institutes: list, mine }, { headers: { "Cache-Control": "no-store" } });
});

const Body = z.object({
  name: z.string().trim().min(3, "Enter the full name of the institute.").max(120),
  city: z.string().trim().max(80).optional(),
  about: z.string().trim().max(600).optional(),
  website: z.string().trim().max(200).optional(),
});

/** Create an institute page (live at once, marked unverified until an admin verifies it). */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`institute-create:${user.id}`, 5, 24 * 60 * 60_000);
  return json(await createInstitution(user, await parseBody(req, Body)), 201);
});
