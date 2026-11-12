"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, type StoreData } from "@/lib/useStore";

/** Its own key, so dismissing never touches saved progress. */
const DISMISSED_KEY = "studyclip:start-checklist-dismissed";

interface Item {
  id: string;
  label: string;
  cta: string;
  href: string;
  done: boolean;
}

/** The five first steps, ticked from what this browser has already saved (read-only). */
export function checklistItems(s: StoreData): Item[] {
  const counts = Object.values(s.counts ?? {});
  const sum = (k: "questions" | "reviews" | "mocks") => counts.reduce((n, c) => n + (c?.[k] ?? 0), 0);
  const attempted = Object.values(s.topics ?? {}).reduce((n, t) => n + (t?.attempted ?? 0), 0);
  const reviewed = sum("reviews") > 0 || Object.values(s.cards ?? {}).some((c) => c.reps > 0);
  const mocked = s.mocks.length > 0 || sum("mocks") > 0 || Object.values(s.freeMockUsed ?? {}).some(Boolean);
  const exam = s.examId;
  return [
    { id: "exam", label: "Choose your exam", cta: "Choose", href: "/exams", done: !!exam },
    { id: "practice", label: "Finish a practice set (10 questions)", cta: "Practise", href: exam ? `/practice?exam=${exam}&smart=1` : "/exams", done: attempted >= 10 || sum("questions") >= 10 },
    { id: "card", label: "Review a flashcard", cta: "Review", href: "/review", done: reviewed },
    { id: "mock", label: "Take your free mock test", cta: "Start test", href: exam ? `/practice?exam=${exam}&mock=1` : "/exams", done: mocked },
    { id: "date", label: "Set your exam date", cta: "Set date", href: "/today#exam-date", done: !!s.examDate },
  ];
}

/**
 * "Getting started" checklist for new students, at the top of Today and the home page.
 * Disappears once every step is done or the student hides it.
 */
export function StartChecklist({ className = "" }: { className?: string }) {
  const store = useStore();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!store || dismissed) return null;
  const items = checklistItems(store);
  const done = items.filter((i) => i.done).length;
  if (done === items.length) return null;

  const hide = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* private mode: hidden for this visit only */
    }
  };

  return (
    <section aria-labelledby="start-checklist-title" className={`card space-y-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="start-checklist-title" className="font-semibold text-slate-900">
            Getting started <span className="ml-1 text-sm font-normal text-slate-500">{done}/{items.length} done</span>
          </h2>
          <p className="text-xs text-slate-500">
            Five small steps to learn how StudyClip works.{" "}
            <Link href="/start" className="font-medium text-brand-700 hover:underline">
              Read the guide
            </Link>
          </p>
        </div>
        <button type="button" onClick={hide} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Hide the getting started checklist">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100" role="progressbar" aria-label="Getting started progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={done}>
        <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.id} className="flex min-h-11 items-center gap-3 text-sm">
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${it.done ? "bg-emerald-500 text-white" : "border-2 border-slate-300"}`} aria-hidden>
              {it.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={`min-w-0 flex-1 ${it.done ? "text-slate-500 line-through" : "text-slate-800"}`}>
              {it.label}
              <span className="sr-only">{it.done ? " (done)" : " (not done yet)"}</span>
            </span>
            {!it.done && (
              <Link href={it.href} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                {it.cta}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
