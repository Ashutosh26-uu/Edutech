import { z } from "zod";
import { requireUser } from "@/server/auth";
import { reportDoubt } from "@/server/doubts";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

/** Report a post (once per user); enough reports hide it until an admin reviews it. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`discuss-report:${user.id}`, 30, 60 * 60_000);
  const { id } = await parseBody(req, z.object({ id: z.uuid() }));
  await reportDoubt(user, id);
  return json({ ok: true });
});
