import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { and, eq, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import { PRODUCTS, type ProductId } from "@/lib/products";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

/** "live" with Razorpay keys; "demo" only when explicitly enabled (grants access without payment); otherwise "off". */
export const PAYMENTS_MODE: "live" | "demo" | "off" = KEY_ID && KEY_SECRET ? "live" : process.env.PAYMENTS_DEMO === "1" ? "demo" : "off";

function product(productId: string, examId?: string) {
  const p = PRODUCTS[productId as ProductId];
  if (!p) throw new HttpError(400, "Unknown product.");
  if (p.needsExam && !(examId && EXAM_BY_ID.has(examId))) throw new HttpError(400, "Choose a valid exam.");
  return p;
}

export async function createOrder(user: SessionUser, productId: string, examId?: string) {
  if (PAYMENTS_MODE !== "live") throw new HttpError(503, "Payments are not switched on yet.");
  const p = product(productId, examId);
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}` },
    body: JSON.stringify({ amount: p.price * 100, currency: "INR", receipt: `${p.id}-${Date.now()}`.slice(0, 40), notes: { userId: user.id, productId: p.id, examId: examId ?? "" } }),
    cache: "no-store",
  });
  const order = await res.json();
  if (!res.ok) throw new HttpError(502, order?.error?.description ?? "Could not create the payment order.");
  await db.insert(schema.payments).values({ userId: user.id, orderId: order.id, productId: p.id, examId: examId ?? null, amountPaise: p.price * 100, mode: "live" });
  return { orderId: order.id as string, amount: order.amount as number, keyId: KEY_ID };
}

/**
 * Marks an order paid and grants what it bought, exactly once. Safe to call from both the
 * browser verification and the webhook, in any order, any number of times.
 */
export async function fulfilOrder(orderId: string, paymentId: string, amountPaise?: number): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [pay] = await tx
      .update(schema.payments)
      .set({ status: "paid", paymentId, paidAt: new Date() })
      .where(and(eq(schema.payments.orderId, orderId), ne(schema.payments.status, "paid"), amountPaise === undefined ? sql`true` : eq(schema.payments.amountPaise, amountPaise)))
      .returning();
    if (!pay) return false; // already fulfilled, unknown order, or amount mismatch
    const p = PRODUCTS[pay.productId as ProductId];
    if (p.credits) {
      await tx.update(schema.users).set({ credits: sql`${schema.users.credits} + ${p.credits}` }).where(eq(schema.users.id, pay.userId));
    }
    if (p.revisionDays && pay.examId) {
      // New passes start now; buying again extends from the current expiry.
      const interval = sql.raw(`interval '${p.revisionDays} days'`);
      await tx
        .insert(schema.revisionPasses)
        .values({ userId: pay.userId, examId: pay.examId, expiresAt: sql`now() + ${interval}` })
        .onConflictDoUpdate({
          target: [schema.revisionPasses.userId, schema.revisionPasses.examId],
          set: { expiresAt: sql`greatest(${schema.revisionPasses.expiresAt}, now()) + ${interval}` },
        });
    }
    return true;
  });
}

const hmac = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("hex");
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Checks the signature Razorpay Checkout returns to the browser, then fulfils the order. */
export async function verifyCheckout(user: SessionUser, orderId: string, paymentId: string, signature: string) {
  if (PAYMENTS_MODE !== "live") throw new HttpError(503, "Payments are not switched on yet.");
  if (!safeEqual(hmac(KEY_SECRET!, `${orderId}|${paymentId}`), signature)) throw new HttpError(400, "Invalid payment signature.");
  const [pay] = await db.select({ userId: schema.payments.userId }).from(schema.payments).where(eq(schema.payments.orderId, orderId)).limit(1);
  if (!pay || pay.userId !== user.id) throw new HttpError(404, "Order not found.");
  await fulfilOrder(orderId, paymentId);
}

/** Razorpay webhook: the source of truth if the browser closes before verification. */
export async function handleWebhook(rawBody: string, signature: string | null) {
  if (!WEBHOOK_SECRET) throw new HttpError(503, "Webhook secret not configured.");
  if (!signature || !safeEqual(hmac(WEBHOOK_SECRET, rawBody), signature)) throw new HttpError(400, "Invalid webhook signature.");
  const event = JSON.parse(rawBody) as { event: string; payload?: { payment?: { entity?: { id: string; order_id: string; amount: number } } } };
  const payment = event.payload?.payment?.entity;
  if ((event.event === "payment.captured" || event.event === "order.paid") && payment?.order_id) {
    await fulfilOrder(payment.order_id, payment.id, payment.amount);
  }
}

/** Demo purchases: only when PAYMENTS_DEMO=1 and no live keys. Recorded as mode "demo". */
export async function demoPurchase(user: SessionUser, productId: string, examId?: string) {
  if (PAYMENTS_MODE !== "demo") throw new HttpError(403, "Demo purchases are disabled.");
  const p = product(productId, examId);
  const orderId = `demo_${randomUUID()}`;
  await db.insert(schema.payments).values({ userId: user.id, orderId, productId: p.id, examId: examId ?? null, amountPaise: p.price * 100, mode: "demo" });
  await fulfilOrder(orderId, `demo_pay_${randomUUID()}`);
}
