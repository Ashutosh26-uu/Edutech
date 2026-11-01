import { PAYMENTS_MODE } from "@/server/billing";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async () => json({ payments: PAYMENTS_MODE, razorpayKeyId: PAYMENTS_MODE === "live" ? process.env.RAZORPAY_KEY_ID : null }));
