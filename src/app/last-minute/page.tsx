"use client";

import { BookOpenCheck, Check, Clock, Layers, Lock, Printer, Timer } from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BuyButton, DemoNotice } from "@/components/Paywall";
import { RapidCards } from "@/components/RapidCards";
import { CATEGORIES, EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { QUESTION_BANK, TOPIC_BY_ID } from "@/data/topics";
import { PRODUCTS } from "@/lib/products";
import { hasRevisionPass, setExam, testAccess } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

export default function LastMinutePage() {
  return (
    <Suspense>
      <LastMinute />
    </Suspense>
  );
}

const PRACTISABLE = EXAMS.filter((e) => examTopicIds(e).length > 0);

function LastMinute() {
  const store = useStore();
  const param = useSearchParams().get("exam");
  const [picked, setPicked] = useState<string | null>(null);
  const examId = picked ?? param ?? store?.examId ?? "";
  const exam = EXAM_BY_ID.get(examId);
  const topics = exam ? examTopicIds(exam) : [];

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Last-minute revision</p>
        <h1 className="mt-2 text-3xl font-semibold">Exam tomorrow? Revise the whole syllabus tonight.</h1>
        <p className="mt-3 text-slate-600">Everything you need for the final evening: one-page notes for every topic, rapid flashcards and timed tests. ₹19 each, no subscription.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600" htmlFor="exam-pick">
            Your exam
          </label>
          <select
            id="exam-pick"
            className="input w-auto min-w-64"
            value={exam ? examId : ""}
            onChange={(e) => {
              setPicked(e.target.value);
              if (e.target.value) setExam(e.target.value);
            }}
          >
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
        </div>
      </div>

      {!store ? null : !exam || !topics.length ? (
        <div className="card text-sm text-slate-600">Choose your exam to see its revision pack and tests.</div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ProductCard
              icon={<BookOpenCheck className="h-5 w-5" />}
              productId="revision-7d"
              examId={exam.id}
              active={hasRevisionPass(exam.id, store)}
              activeText={`Unlocked until ${new Date(store.revisionPasses[exam.id] ?? 0).toLocaleDateString()}`}
            />
            <ProductCard
              icon={<Timer className="h-5 w-5" />}
              productId="tests-3"
              examId={exam.id}
              active={false}
              extra={
                <p className="text-sm text-slate-600">
                  You have <b className="text-slate-900">{store.credits}</b> test credit{store.credits === 1 ? "" : "s"}
                  {testAccess(exam.id, store) === "free" ? ", plus one free test for this exam" : ""}.
                </p>
              }
            />
          </div>
          <TestLauncher examId={exam.id} topics={topics} />
          <RevisionSheet examId={exam.id} unlocked={hasRevisionPass(exam.id, store)} />
        </>
      )}
    </div>
  );
}

function ProductCard({ icon, productId, examId, active, activeText, extra }: { icon: React.ReactNode; productId: "tests-3" | "revision-7d"; examId: string; active: boolean; activeText?: string; extra?: React.ReactNode }) {
  const p = PRODUCTS[productId];
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700">{icon}</span>
        <span className="text-2xl font-semibold tracking-tight text-slate-900">₹{p.price}</span>
      </div>
      <div>
        <h2 className="font-semibold">{p.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{p.tagline}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-600">
        {p.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {perk}
          </li>
        ))}
      </ul>
      {extra}
      <div className="mt-auto space-y-1.5">
        {active ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" /> {activeText}
          </p>
        ) : (
          <BuyButton productId={productId} examId={examId} className="btn-primary w-full py-2.5" />
        )}
        <DemoNotice />
      </div>
    </div>
  );
}

function TestLauncher({ examId, topics }: { examId: string; topics: string[] }) {
  const [topic, setTopic] = useState(topics[0]);
  return (
    <section className="card">
      <h2 className="flex items-center gap-2 font-semibold">
        <Clock className="h-4 w-4 text-slate-500" /> Take a timed test
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium">Full-syllabus mock</h3>
          <p className="mt-1 text-xs text-slate-500">25 questions · 25 minutes · all topics</p>
          <Link href={`/practice?exam=${examId}&mock=1`} className="btn-primary mt-3 w-full">
            Start full mock
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium">Single-topic test</h3>
          <p className="mt-1 text-xs text-slate-500">15 questions · 15 minutes · one topic</p>
          <div className="mt-3 flex gap-2">
            <select className="input min-w-0 flex-1" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
              {topics.map((t) => (
                <option key={t} value={t}>
                  {TOPIC_BY_ID.get(t)?.name}
                </option>
              ))}
            </select>
            <Link href={`/practice?exam=${examId}&mock=1&topics=${topic}`} className="btn-primary shrink-0">
              Start
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Each test uses one credit. Your first test for each exam is free.</p>
    </section>
  );
}

function RevisionSheet({ examId, unlocked }: { examId: string; unlocked: boolean }) {
  const exam = EXAM_BY_ID.get(examId)!;
  const [rapid, setRapid] = useState(false);
  const subjects = exam.subjects.filter((s) => s.topicIds.length);
  const allTopics = examTopicIds(exam);
  const questions = useMemo(() => QUESTION_BANK.filter((q) => q.topicId && allTopics.includes(q.topicId)), [allTopics]);
  const totalPoints = allTopics.reduce((n, t) => n + (TOPIC_BY_ID.get(t)?.keyPoints.length ?? 0), 0);

  if (rapid && unlocked) {
    return (
      <section className="card mx-auto max-w-2xl">
        <RapidCards questions={questions} onClose={() => setRapid(false)} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{exam.name} revision sheet</h2>
          <p className="text-sm text-slate-500">
            {allTopics.length} topics · {totalPoints} key points · {questions.length} flashcards
          </p>
        </div>
        {unlocked && (
          <div className="flex gap-2 print:hidden">
            <button className="btn-ghost" onClick={() => setRapid(true)} disabled={!questions.length}>
              <Layers className="h-4 w-4" /> Rapid flashcards
            </button>
            <button className="btn-ghost" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {subjects.map((s, si) => (
          <div key={s.name} className="card break-inside-avoid">
            <h3 className="text-sm font-semibold">{s.name}</h3>
            <div className="mt-3 space-y-4">
              {s.topicIds.map((tid, ti) => {
                const t = TOPIC_BY_ID.get(tid)!;
                const free = si === 0 && ti === 0; // first topic is a free preview
                const open = unlocked || free;
                return (
                  <div key={tid}>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium text-slate-900">{t.name}</h4>
                      {free && !unlocked && <span className="chip bg-emerald-50 text-emerald-700">Free preview</span>}
                      {!open && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                    {open ? (
                      <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                        {t.keyPoints.map((k) => (
                          <li key={k} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                            {k}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div aria-hidden className="mt-1.5 select-none space-y-1.5 blur-[3px]">
                        {t.keyPoints.slice(0, 2).map((k) => (
                          <p key={k} className="text-sm text-slate-400">
                            {k}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!unlocked && (
        <div className="card flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-slate-600">
            Unlock all {allTopics.length} topics, rapid flashcards and the printable sheet for <b className="text-slate-900">₹{PRODUCTS["revision-7d"].price}</b>.
          </p>
          <BuyButton productId="revision-7d" examId={examId} className="btn-primary" />
        </div>
      )}
    </section>
  );
}
