import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { joinInstitution } from "@/server/institutions";
import { rateLimit } from "@/server/rate-limit";

/** Join an institute with its code, to practise its members-only sets. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`institute-join:${user.id}`, 20, 60 * 60_000);
  const { code } = await parseBody(req, z.object({ code: z.string().max(20) }));
  return json(await joinInstitution(user, code));
});
