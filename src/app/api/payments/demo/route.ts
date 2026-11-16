import { z } from "zod";
import { getAccount } from "@/server/account";
import { requireUser } from "@/server/auth";
import { demoPurchase } from "@/server/billing";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ productId: z.string().max(32), examId: z.string().max(64).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`demo-buy:${user.id}`, 20, 60 * 60_000);
  const { productId, examId } = await parseBody(req, Body);
  await demoPurchase(user, productId, examId, req.nextUrl.hostname);
  return json(await getAccount(user));
});
