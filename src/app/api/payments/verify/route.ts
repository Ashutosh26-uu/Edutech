import { z } from "zod";
import { getAccount } from "@/server/account";
import { requireUser } from "@/server/auth";
import { verifyCheckout } from "@/server/billing";
import { json, parseBody, route } from "@/server/http";

const Body = z.object({ razorpay_order_id: z.string().max(64), razorpay_payment_id: z.string().max(64), razorpay_signature: z.string().max(256) });

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const b = await parseBody(req, Body);
  await verifyCheckout(user, b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature);
  return json(await getAccount(user));
});
