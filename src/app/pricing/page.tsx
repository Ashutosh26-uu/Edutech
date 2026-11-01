"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { DemoNotice } from "@/components/Paywall";
import { EXAM_BY_ID } from "@/data/exams";
import { FREE_PERKS, PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/useStore";

const FAQ = [
  ["Is there a subscription?", "No. You pay ₹19 only when you need a pack. Test credits never expire; a revision pack lasts 7 days for the exam you choose."],
  ["Which exams are covered?", "All exams that have practice topics on StudyClip, from SSC, banking and railways to state PSCs, teaching, defence, JEE, NEET and more."],
  ["What do I get for free?", "Topic practice with explanations, one free timed test per exam, video breakdown, flashcards, the daily plan and progress tracking."],
  ["How do I pay?", "UPI, cards, net banking and wallets through Razorpay, once payments are switched on."],
];

export default function PricingPage() {
  const store = useStore();
  return (
    <div className="space-y-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-2 text-3xl font-semibold">Free to study. ₹19 when the exam is close.</h1>
        <p className="mt-3 text-slate-600">No subscription. Buy a pack only when you need it, like the night before your paper.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Plan name="Free" price="₹0" tagline="Everything you need to prepare." perks={FREE_PERKS} cta={<Link href="/today" className="btn-ghost w-full">Start studying</Link>} />
        {Object.values(PRODUCTS).map((p) => (
          <Plan
            key={p.id}
            highlight={p.id === "tests-3"}
            name={p.name}
            price={`₹${p.price}`}
            tagline={p.tagline}
            perks={p.perks}
            cta={
              <Link href="/last-minute" className="btn-primary w-full">
                Choose exam
              </Link>
            }
          />
        ))}
      </div>
      <DemoNotice className="text-center" />

      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        {FAQ.map(([q, a]) => (
          <div key={q}>
            <h3 className="font-medium">{q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a}</p>
          </div>
        ))}
      </div>

      {store && store.purchases.length > 0 && (
        <section className="card mx-auto max-w-2xl">
          <h2 className="font-semibold">Your purchases</h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {store.purchases.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                <span>
                  {PRODUCTS[p.productId as keyof typeof PRODUCTS]?.name ?? p.productId}
                  {p.examId && <span className="text-slate-500"> · {EXAM_BY_ID.get(p.examId)?.name}</span>}
                </span>
                <span className="text-slate-500">
                  ₹{p.amount} · {new Date(p.at).toLocaleDateString()}
                  {p.mode === "demo" && " · demo"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            Test credits left: <b className="text-slate-900">{store.credits}</b>
          </p>
        </section>
      )}
    </div>
  );
}

function Plan({ name, price, tagline, perks, cta, highlight = false }: { name: string; price: string; tagline: string; perks: string[]; cta: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`card flex flex-col gap-5 ${highlight ? "border-ink ring-1 ring-ink" : ""}`}>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{name}</h2>
          {highlight && <span className="chip bg-ink text-on-ink">Most popular</span>}
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{price}</p>
        <p className="mt-1 text-sm text-slate-600">{tagline}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-600">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-auto">{cta}</div>
    </div>
  );
}
