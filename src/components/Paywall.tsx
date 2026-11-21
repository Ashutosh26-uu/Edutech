"use client";

import { Check, Loader2, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { EXAM_BY_ID } from "@/data/exams";
import { useAccount } from "@/lib/account";
import { buy } from "@/lib/checkout";
import { PRODUCTS, type ProductId } from "@/lib/products";

export function DemoNotice({ className = "" }: { className?: string }) {
  const { payments, mode } = useAccount();
  if (payments === "live") return null;
  const text =
    payments === "off"
      ? "Payments aren’t switched on yet."
      : mode === "local"
        ? "Demo mode: payments aren’t switched on on this site, so purchases are free and no money is taken."
        : "Demo mode: purchases are free and no money is taken.";
  return <p className={`text-xs text-slate-500 ${className}`}>{text}</p>;
}

export function BuyButton({ productId, examId, onDone, className = "btn-primary", label }: { productId: ProductId; examId?: string; onDone?: () => void; className?: string; label?: string }) {
  const account = useAccount();
  const router = useRouter();
  const path = usePathname();
  const p = PRODUCTS[productId];
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const click = async () => {
    if (account.mode === "server" && !account.user) {
      router.push(`/login?next=${encodeURIComponent(path + location.search)}`);
      return;
    }
    setState("busy");
    const r = await buy(account, productId, examId);
    if (r.ok) {
      setState("done");
      onDone?.();
    } else if ("needsLogin" in r && r.needsLogin) {
      router.push(`/login?next=${encodeURIComponent(path + location.search)}`);
    } else {
      setState("error");
      setError(r.error);
    }
  };

  return (
    <div className="space-y-1.5">
      <button className={className} disabled={state === "busy" || account.payments === "off"} onClick={click}>
        {state === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "done" ? <Check className="h-4 w-4" /> : null}
        {state === "done" ? "Unlocked" : account.mode === "server" && !account.user ? `Log in to buy · ₹${p.price}` : (label ?? `Get it for ₹${p.price}`)}
      </button>
      {state === "error" && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Shown when a timed test needs a credit and the user has none. With an exam, the Exam Pass
 * (unlimited tests for that exam) is offered first and the small pack of credits second.
 */
export function TestPaywall({ onUnlocked, used, examId }: { onUnlocked: () => void; used: "free-used" | "no-credits"; examId?: string }) {
  const pack = PRODUCTS["tests-3"];
  const pass = PRODUCTS["exam-pass-90d"];
  const exam = examId ? EXAM_BY_ID.get(examId) : undefined;
  const why = used === "free-used" ? "You’ve used the free test for this exam." : "You’re out of test credits.";
  const perks = (list: string[]) => (
    <ul className="space-y-1.5 text-left text-sm text-slate-600">
      {list.map((perk) => (
        <li key={perk} className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          {perk}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mx-auto max-w-md space-y-5 py-4 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-600">
        <Lock className="h-5 w-5" />
      </span>
      {exam ? (
        <>
          <div>
            <h2 className="text-xl font-semibold">Keep testing for {exam.name}</h2>
            <p className="mt-1.5 text-sm text-slate-600">{why} Untimed practice stays free.</p>
          </div>
          <div className="space-y-4 rounded-xl border border-ink p-4 ring-1 ring-ink">
            <div className="flex items-center justify-between gap-3 text-left">
              <div>
                <h3 className="font-semibold">
                  {pass.name} · ₹{pass.price}
                </h3>
                <p className="mt-0.5 text-sm text-slate-600">Unlimited timed tests for {exam.name} for {pass.examPassDays} days.</p>
              </div>
              <span className="chip shrink-0 bg-ink text-on-ink">Best value</span>
            </div>
            {perks(pass.perks)}
            <BuyButton productId="exam-pass-90d" examId={exam.id} onDone={onUnlocked} className="btn-primary w-full py-2.5" label={`Get the Exam Pass for ₹${pass.price}`} />
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="text-left">
              <h3 className="font-semibold">
                {pack.name} · ₹{pack.price}
              </h3>
              <p className="mt-0.5 text-sm text-slate-600">{pack.tagline} Credits never expire.</p>
            </div>
            <BuyButton productId="tests-3" onDone={onUnlocked} className="btn-ghost w-full py-2.5" label={`Get 3 tests for ₹${pack.price}`} />
          </div>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold">Paper coming up? Take 3 more tests for ₹{pack.price}</h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {why} {pack.tagline}
            </p>
          </div>
          {perks(pack.perks)}
          <BuyButton productId="tests-3" onDone={onUnlocked} className="btn-primary w-full py-2.5" />
        </>
      )}
      <DemoNotice />
    </div>
  );
}
