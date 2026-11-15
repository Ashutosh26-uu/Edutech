import { z } from "zod";
import { requireUser } from "@/server/auth";
import { joinBatch } from "@/server/batches";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ code: z.string().max(20) });

/** Join a batch with the code the trainer shared. */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  // Codes are short, so guessing is rate-limited.
  await rateLimit(`batch-join:${user.id}`, 20, 60 * 60_000);
  const { code } = await parseBody(req, Body);
  return json(await joinBatch(user, code));
});
