"use client";

import { IS_STATIC } from "./api";
import { PRODUCTS, type ProductId } from "./products";
import { recordPurchase } from "./storage";

/**
 * Checkout. With NEXT_PUBLIC_RAZORPAY_KEY_ID set on a server deployment, payments go through
 * Razorpay (order created and signature verified on the server). Otherwise the app runs in
 * demo mode: access is granted without taking any money, and the UI says so.
 *
 * Before going live, grant access from the server after verification and store it against a
 * logged-in account; browser storage alone can be edited by the user.
 */

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
export const PAYMENTS_LIVE = !!RAZORPAY_KEY && !IS_STATIC;

export type CheckoutResult = { ok: true; mode: "demo" | "live" } | { ok: false; error: string };

declare global {
  interface Window {
    Razorpay?: new (opts: object) => { open(): void; on(event: string, cb: (r: unknown) => void): void };
  }
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the payment window. Check your connection."));
    document.head.appendChild(s);
  });
}

function grant(productId: ProductId, examId: string | undefined, mode: "demo" | "live", paymentId?: string) {
  const p = PRODUCTS[productId];
  recordPurchase(
    { id: Math.random().toString(36).slice(2), productId, examId, amount: p.price, at: Date.now(), mode, paymentId },
    { credits: p.credits, revisionExamId: p.revisionDays ? examId : undefined, revisionDays: p.revisionDays },
  );
}

export async function buy(productId: ProductId, examId?: string): Promise<CheckoutResult> {
  const product = PRODUCTS[productId];
  if (product.needsExam && !examId) return { ok: false, error: "Choose your exam first." };

  if (!PAYMENTS_LIVE) {
    grant(productId, examId, "demo");
    return { ok: true, mode: "demo" };
  }

  try {
    const orderRes = await fetch("/api/payments/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, examId }) });
    const order = await orderRes.json();
    if (!orderRes.ok) return { ok: false, error: order.error ?? "Could not start the payment." };
    await loadRazorpay();

    return await new Promise<CheckoutResult>((resolve) => {
      const rzp = new window.Razorpay!({
        key: RAZORPAY_KEY,
        order_id: order.id,
        amount: order.amount,
        currency: "INR",
        name: "StudyClip",
        description: product.name,
        theme: { color: "#18181b" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
          if (!v.ok) return resolve({ ok: false, error: "Payment could not be verified. If money was deducted, it will be refunded automatically." });
          grant(productId, examId, "live", r.razorpay_payment_id);
          resolve({ ok: true, mode: "live" });
        },
        modal: { ondismiss: () => resolve({ ok: false, error: "Payment cancelled." }) },
      });
      rzp.on("payment.failed", () => resolve({ ok: false, error: "Payment failed. No money was taken." }));
      rzp.open();
    });
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
