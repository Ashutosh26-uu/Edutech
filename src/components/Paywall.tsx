"use client";

import { Check, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { buy, PAYMENTS_LIVE } from "@/lib/checkout";
import { PRODUCTS, type ProductId } from "@/lib/products";

export function DemoNotice({ className = "" }: { className?: string }) {
  if (PAYMENTS_LIVE) return null;
  return <p className={`text-xs text-slate-500 ${className}`}>Demo mode: payments aren’t switched on yet, so purchases are free and no money is taken.</p>;
}

export function BuyButton({ productId, examId, onDone, className = "btn-primary", label }: { productId: ProductId; examId?: string; onDone?: () => void; className?: string; label?: string }) {
  const p = PRODUCTS[productId];
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const click = async () => {
    setState("busy");
    const r = await buy(productId, examId);
    if (r.ok) {
      setState("done");
      onDone?.();
    } else {
      setState("error");
      setError(r.error);
    }
  };

  return (
    <div className="space-y-1.5">
      <button className={className} disabled={state === "busy"} onClick={click}>
        {state === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "done" ? <Check className="h-4 w-4" /> : null}
        {state === "done" ? "Unlocked" : (label ?? `Get it for ₹${p.price}`)}
      </button>
      {state === "error" && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Shown when a timed test needs a credit and the user has none. */
export function TestPaywall({ onUnlocked, used }: { onUnlocked: () => void; used: "free-used" | "no-credits" }) {
  const p = PRODUCTS["tests-3"];
  return (
    <div className="mx-auto max-w-md space-y-5 py-4 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-600">
        <Lock className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">Paper coming up? Take 3 more tests for ₹{p.price}</h2>
        <p className="mt-1.5 text-sm text-slate-600">{used === "free-used" ? "You’ve used the free mock test for this exam." : "You’re out of test credits."} {p.tagline}</p>
      </div>
      <ul className="space-y-1.5 text-left text-sm text-slate-600">
        {p.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {perk}
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-2">
        <BuyButton productId="tests-3" onDone={onUnlocked} className="btn-primary w-full py-2.5" />
        <DemoNotice />
      </div>
    </div>
  );
}
