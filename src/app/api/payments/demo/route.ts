import { z } from "zod";
import { getAccount } from "@/server/account";
import { requireUser } from "@/server/auth";
import { demoPurchase } from "@/server/billing";
import { json, parseBody, route } from "@/server/http";

const Body = z.object({ productId: z.string().max(32), examId: z.string().max(64).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const { productId, examId } = await parseBody(req, Body);
  await demoPurchase(user, productId, examId);
  return json(await getAccount(user));
});
