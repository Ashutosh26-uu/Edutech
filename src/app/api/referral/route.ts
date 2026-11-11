import { z } from "zod";
import { requireUser } from "@/server/auth";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { claimInvite, CODE_RE, getInvites } from "@/server/referral";

export const dynamic = "force-dynamic";

/** The signed-in user's invite code and how many friends joined and were rewarded. */
export const GET = route(async (req) => {
  const user = await requireUser(req);
  return json(await getInvites(user), { headers: { "Cache-Control": "no-store" } });
});

const Body = z.object({ code: z.string().trim().toUpperCase().regex(CODE_RE, "That invite code is not valid.") });

/** Records the invite code a new account signed up with (sent once, right after sign-up). */
export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`referral-claim:${user.id}`, 5, 60 * 60_000);
  const { code } = await parseBody(req, Body);
  return json({ result: await claimInvite(user, code) });
});
