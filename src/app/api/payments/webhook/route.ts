import type { NextRequest } from "next/server";
import { handleWebhook } from "@/server/billing";
import { json, route } from "@/server/http";

/** Configure in Razorpay Dashboard → Webhooks with events payment.captured and order.paid. */
export const POST = route(
  async (req: NextRequest) => {
    await handleWebhook(await req.text(), req.headers.get("x-razorpay-signature"));
    return json({ ok: true });
  },
  { csrf: false },
);
