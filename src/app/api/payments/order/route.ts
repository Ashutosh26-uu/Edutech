import { NextResponse } from "next/server";
import { EXAM_BY_ID } from "@/data/exams";
import { PRODUCTS, type ProductId } from "@/lib/products";

/** Creates a Razorpay order. The amount always comes from the server-side product list. */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return NextResponse.json({ error: "Payments are not configured on this server." }, { status: 503 });

  const { productId, examId } = (await req.json().catch(() => ({}))) as { productId?: ProductId; examId?: string };
  const product = productId && PRODUCTS[productId];
  if (!product) return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  if (product.needsExam && !(examId && EXAM_BY_ID.has(examId))) return NextResponse.json({ error: "Choose a valid exam." }, { status: 400 });

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}` },
    body: JSON.stringify({
      amount: product.price * 100, // paise
      currency: "INR",
      receipt: `${product.id}-${Date.now()}`.slice(0, 40),
      notes: { productId: product.id, examId: examId ?? "" },
    }),
  });
  const order = await res.json();
  if (!res.ok) return NextResponse.json({ error: order?.error?.description ?? "Could not create the payment order." }, { status: 502 });
  return NextResponse.json({ id: order.id, amount: order.amount });
}
