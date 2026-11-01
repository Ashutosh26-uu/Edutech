import { z } from "zod";
import { requireUser } from "@/server/auth";
import { createOrder } from "@/server/billing";
import { json, parseBody, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";

const Body = z.object({ productId: z.string().max(32), examId: z.string().max(64).optional() });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  await rateLimit(`order:${user.id}`, 10, 60_000);
  const { productId, examId } = await parseBody(req, Body);
  return json(await createOrder(user, productId, examId), 201);
});
