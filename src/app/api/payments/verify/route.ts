import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/** Verifies the signature Razorpay returns after a successful payment. */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "Payments are not configured on this server." }, { status: 503 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return NextResponse.json({ error: "Missing payment details." }, { status: 400 });

  const expected = createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });

  // TODO before launch: record the payment and grant access against the user's account in a database.
  return NextResponse.json({ verified: true });
}
