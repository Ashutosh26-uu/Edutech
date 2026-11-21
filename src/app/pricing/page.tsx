"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BuyButton, DemoNotice } from "@/components/Paywall";
import { CATEGORIES, EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { useAccount } from "@/lib/account";
import { examPassUntil, passDate, useExamPasses } from "@/lib/pass";
import { FREE_PERKS, PRODUCTS, PRODUCT_ORDER } from "@/lib/products";
import { useStore } from "@/lib/useStore";
import { PageHeader } from "@/components/PageHeader";
import { InfoTip } from "@/components/InfoTip";

const FAQ: [string, string][] = [
  [
    "Is there a subscription?",
    "No. Everything is a one-time payment and nothing renews by itself. A ₹19 pack gives 3 test credits that never expire, or 7 days of the revision pack for one exam. The ₹299 Exam Pass gives unlimited timed tests and the revision pack for one exam for 90 days, then it simply ends. You are charged again only if you choose to buy again.",
  ],
  ["What happens if I buy an Exam Pass twice?", "The days add up. Buying again for the same exam while a pass is active adds 90 days to its current end date. A pass covers one exam; another exam needs its own pass or test credits."],
  ["Which exams are covered?", "All exams that have practice topics on StudyClip, from SSC, banking and railways to state PSCs, teaching, defence, JEE, NEET and more."],
  ["What do I get for free?", "Topic practice with explanations, one free timed test per exam, video breakdown, flashcards, the daily plan and progress tracking."],
  ["How do I pay?", "UPI, cards, net banking and wallets through Razorpay, once payments are switched on."],
];

const PRACTISABLE = EXAMS.filter((e) => examTopicIds(e).length > 0);

/** The Exam Pass is bought for one exam, so its card asks which one. */
function PassCta() {
  const store = useStore();
  const passes = useExamPasses();
  const [picked, setPicked] = useState<string | null>(null);
  const saved = store?.examId && PRACTISABLE.some((e) => e.id === store.examId) ? store.examId : "";
  const examId = picked ?? saved;
  const until = examPassUntil(passes, examId);
  return (
    <div className="space-y-2">
      <select className="input w-full" value={examId} onChange={(e) => setPicked(e.target.value)} aria-label="Exam for the Exam Pass">
        <option value="">Choose your exam…</option>
        {CATEGORIES.map((c) => {
          const list = PRACTISABLE.filter((e) => e.category === c);
          return list.length ? (
            <optgroup key={c} label={c}>
              {list.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </optgroup>
          ) : null;
        })}
      </select>
      {until && <p className="text-sm font-medium text-emerald-700">Exam Pass active until {passDate(until)}. Buying again adds 90 days.</p>}
      {examId ? (
        // Keyed by exam so "Unlocked" on the button never carries over to another exam.
        <BuyButton key={examId} productId="exam-pass-90d" examId={examId} className="btn-primary w-full" label={until ? `Add 90 days · ₹${PRODUCTS["exam-pass-90d"].price}` : undefined} />
      ) : (
        <button className="btn-primary w-full" disabled>
          Choose your exam first
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  const store = useStore();
  const account = useAccount();
  return (
    <div className="space-y-14">
      <PageHeader
        path="/pricing"
        title="Free to study. Pay once, only when you want more tests."
        intro={
          <>
            Practice, notes and flashcards are free. Each exam also gets one free mock test <InfoTip id="free-test" />. For more timed tests, take the ₹299 Exam Pass (unlimited tests for one exam for 90 days) or a ₹19 pack of credits <InfoTip id="credits" />. There is no subscription and nothing renews by itself.
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Plan name="Free" price="₹0" tagline="Everything you need to prepare." perks={FREE_PERKS} cta={<Link href="/today" className="btn-ghost w-full">Start studying</Link>} />
        {PRODUCT_ORDER.map((id) => {
          const p = PRODUCTS[id];
          const isPass = id === "exam-pass-90d";
          return (
            <Plan
              key={p.id}
              badge={isPass ? "Best value" : undefined}
              name={p.name}
              price={`₹${p.price}`}
              tagline={p.tagline}
              perks={p.perks}
              cta={
                isPass ? (
                  <PassCta />
                ) : (
                  <Link href="/last-minute" className="btn-ghost w-full">
                    Choose exam
                  </Link>
                )
              }
            />
          );
        })}
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

      {account.mode === "server" && account.user && (
        <p className="text-center text-sm text-slate-600">
          Signed in as {account.user.email} · Test credits: <b className="text-slate-900">{account.credits}</b>
        </p>
      )}

      {account.mode === "local" && store && store.purchases.length > 0 && (
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

function Plan({ name, price, tagline, perks, cta, badge }: { name: string; price: string; tagline: string; perks: string[]; cta: React.ReactNode; badge?: string }) {
  return (
    <div className={`card flex flex-col gap-5 ${badge ? "border-ink ring-1 ring-ink" : ""}`}>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{name}</h2>
          {badge && <span className="chip bg-ink text-on-ink">{badge}</span>}
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
