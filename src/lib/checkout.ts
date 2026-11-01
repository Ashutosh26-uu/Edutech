"use client";

import type { AccountState } from "./account";
import { PRODUCTS, type ProductId } from "./products";
import { recordPurchase } from "./storage";

/**
 * Checkout. On a server deployment the backend decides the mode (see /api/config):
 *  - live: Razorpay order created on the server, payment signature verified on the server,
 *    and access granted by the server (also by the Razorpay webhook if the tab closes);
 *  - demo: the server grants access without payment (only when PAYMENTS_DEMO=1);
 *  - off: purchases are unavailable.
 * The static GitHub Pages build has no backend and grants demo access in browser storage.
 */

export type CheckoutResult = { ok: true; mode: "demo" | "live" } | { ok: false; error: string; needsLogin?: boolean };

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

async function post(path: string, body: object) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

export async function buy(account: AccountState, productId: ProductId, examId?: string): Promise<CheckoutResult> {
  const product = PRODUCTS[productId];
  if (product.needsExam && !examId) return { ok: false, error: "Choose your exam first." };

  if (account.mode === "local") {
    recordPurchase(
      { id: Math.random().toString(36).slice(2), productId, examId, amount: product.price, at: Date.now(), mode: "demo" },
      { credits: product.credits, revisionExamId: product.revisionDays ? examId : undefined, revisionDays: product.revisionDays },
    );
    return { ok: true, mode: "demo" };
  }

  if (!account.user) return { ok: false, error: "Log in to buy.", needsLogin: true };
  if (account.payments === "off") return { ok: false, error: "Payments are not switched on yet." };

  if (account.payments === "demo") {
    const r = await post("/api/payments/demo", { productId, examId });
    if (!r.ok) return { ok: false, error: r.data.error ?? "Purchase failed." };
    await account.refresh();
    return { ok: true, mode: "demo" };
  }

  try {
    const order = await post("/api/payments/order", { productId, examId });
    if (!order.ok) return { ok: false, error: order.data.error ?? "Could not start the payment.", needsLogin: order.status === 401 };
    await loadRazorpay();
    return await new Promise<CheckoutResult>((resolve) => {
      const rzp = new window.Razorpay!({
        key: order.data.keyId,
        order_id: order.data.orderId,
        amount: order.data.amount,
        currency: "INR",
        name: "StudyClip",
        description: product.name,
        prefill: { email: account.user?.email },
        theme: { color: "#18181b" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await post("/api/payments/verify", r);
          await account.refresh();
          if (!v.ok) return resolve({ ok: false, error: "We couldn’t confirm the payment yet. If money was deducted, access will be added automatically within a few minutes." });
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
