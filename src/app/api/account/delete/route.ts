import { z } from "zod";
import { deleteAccount } from "@/server/account";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

/** Deletes the signed-in account. The body must say DELETE, so a stray request can't do it. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`account-delete:${user.id}`, 5, 60 * 60_000);
  await parseBody(req, z.object({ confirm: z.literal("DELETE") }));
  return json(await deleteAccount(user));
});
