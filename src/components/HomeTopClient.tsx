"use client";

import { ArrowLeft, ArrowRight, CalendarCheck, CalendarDays, Flame, Layers, Search, Sparkles, Target, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { VideoLinkForm } from "@/components/VideoLinkForm";
import { focusTopics } from "@/lib/adaptive";
import { dayKey, daysUntilExam, dueCards, setExam, setExamDate, streak, today } from "@/lib/storage";
import { useStore, type StoreData } from "@/lib/useStore";

const DAILY_QUESTIONS = 10; // matches the "Smart practice: 10 questions" task on /today

/** The little an exam needs to be shown on the home page; the full list (~50 KB) loads only when needed. */
export interface ExamLite {
  id: string;
  name: string;
  fullName: string;
}

type ExamsModule = typeof import("@/data/exams");
let examsPromise: Promise<ExamsModule> | null = null;
/** Loads the exam list once, on demand (a returning visitor's dashboard, or a search in the picker). */
function loadExams() {
  return (examsPromise ??= import("@/data/exams"));
}

function useExams(needed: boolean): ExamsModule | null {
  const [mod, setMod] = useState<ExamsModule | null>(null);
  useEffect(() => {
    if (!needed || mod) return;
    let live = true;
    loadExams().then((m) => live && setMod(m), () => {});
    return () => {
      live = false;
    };
  }, [needed, mod]);
  return mod;
}

/**
 * The personal top of the home page. The server renders the exam picker above the generic hero,
 * so first-time visitors (and browsers without JavaScript) see real content straight away. A
 * returning visitor with a saved exam is marked before first paint (see HomeTop), which swaps the
 * picker and hero for a placeholder until the dashboard is ready.
 */
export function HomeTopClient({ children, featured, examCount }: { children: ReactNode; featured: ExamLite[]; examCount: number }) {
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const [justPlanned, setJustPlanned] = useState(false);
  const examId = store?.examId;
  const exams = useExams(!!examId);
  const exam = examId && exams ? exams.EXAM_BY_ID.get(examId) : undefined;
  // Waiting for this browser's progress, or for the exam list a saved exam needs.
  const pending = !store || (!!examId && !exams);

  // Keep the before-paint marker in step with the saved exam for the next visit to this page.
  useEffect(() => {
    if (!store) return;
    if (store.examId) document.documentElement.dataset.homeExam = "1";
    else delete document.documentElement.dataset.homeExam;
  }, [store]);

  if (pending || !exam || editing) {
    return (
      <div className={pending ? "home-pending" : undefined}>
        <div className="home-wait pt-10" aria-hidden>
          <div className="skeleton h-[17rem] rounded-2xl sm:h-[15rem]" />
        </div>
        <div className="home-fresh">
          <div className="pt-10">
            <Onboarding
              featured={featured}
              examCount={examCount}
              initialDate={store?.examDate}
              currentExamId={exam?.id}
              onCancel={exam ? () => setEditing(false) : undefined}
              onDone={() => {
                setEditing(false);
                setJustPlanned(true);
              }}
            />
          </div>
          {exam ? <CompactLecture /> : children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 pt-10">
        <Dashboard store={store} exam={exam} onChangeExam={() => setEditing(true)} />
        {justPlanned && <YourPlan store={store} exam={exam} onClose={() => setJustPlanned(false)} />}
      </div>
      <CompactLecture />
    </div>
  );
}

// ---------- First visit: pick an exam, then a date ----------

function Onboarding({ featured, examCount, initialDate, currentExamId, onCancel, onDone }: { featured: ExamLite[]; examCount: number; initialDate?: string; currentExamId?: string; onCancel?: () => void; onDone: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [picked, setPicked] = useState<ExamLite | null>(null);
  const [q, setQ] = useState("");
  const [wantList, setWantList] = useState(false);
  const [date, setDate] = useState(initialDate ?? "");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const exams = useExams(wantList || !!q.trim());

  // Move focus to the new step's heading after the user moves between steps (not on first render).
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  const results: ExamLite[] = q.trim() && exams ? exams.searchExams(q).slice(0, 8) : [];

  function choose(e: ExamLite) {
    setPicked(e);
    moved.current = true;
    setStep(2);
  }

  function finish(withDate: boolean) {
    if (!picked) return;
    onDone();
    setExam(picked.id);
    setExamDate(withDate ? date : undefined);
  }

  const todayIso = dayKey();

  return (
    <section className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:p-7" aria-labelledby="onboarding-heading">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">
          {currentExamId ? "Change exam" : "Get started"} · Step {step} of 2
        </p>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Cancel
          </button>
        )}
      </div>

      {step === 1 ? (
        <>
          <h2 id="onboarding-heading" ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold outline-none sm:text-3xl">
            Which exam are you preparing for?
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">We’ll set up practice questions, mock tests and a daily plan for it. Saved in this browser only.</p>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input py-2.5 pl-9 text-base"
              placeholder={`Search ${examCount} exams, e.g. SSC CGL, IBPS PO, NEET…`}
              value={q}
              onFocus={() => setWantList(true)}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) {
                  e.preventDefault();
                  choose(results[0]);
                }
              }}
              aria-label="Search exams"
              aria-describedby="onboarding-results"
            />
          </div>

          <div id="onboarding-results" aria-live="polite" className="mt-4">
            {q.trim() ? (
              !exams ? (
                <p className="text-sm text-slate-500">Searching…</p>
              ) : results.length ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {results.map((e) => (
                    <li key={e.id}>
                      <button type="button" onClick={() => choose(e)} className="card-link flex w-full min-w-0 items-center justify-between gap-3 p-3 text-left sm:p-3">
                        <span className="min-w-0">
                          <span className="block font-medium text-slate-900">{e.name}</span>
                          <span className="block truncate text-xs text-slate-500">{e.fullName}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  No exams match “{q}”. Try a shorter search, or{" "}
                  <Link href="/exams" className="font-medium text-slate-900 underline underline-offset-2">
                    browse all exams
                  </Link>
                  .
                </p>
              )
            ) : (
              <>
                <p className="text-xs text-slate-500">Popular</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {featured.slice(0, 8).map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => choose(e)}
                        className={`pill ${e.id === currentExamId ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`}
                      >
                        {e.name}
                      </button>
                    </li>
                  ))}
                  <li>
                    <Link href="/exams" className="pill border-transparent bg-transparent text-slate-500 hover:border-slate-200">
                      All exams →
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 id="onboarding-heading" ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold outline-none sm:text-3xl">
            When is your {picked?.name} exam?
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">We use it to count down and to switch to revision mode in the last month.</p>
          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              finish(!!date);
            }}
          >
            <label className="block text-sm text-slate-600 sm:w-56">
              Exam date
              <input type="date" className="input mt-1 py-2.5 text-base" min={todayIso} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <button type="submit" className="btn-primary px-5 py-2.5" disabled={!date}>
              Build my plan <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" className="btn-ghost px-5 py-2.5" onClick={() => finish(false)}>
              Not sure yet
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              moved.current = true;
              setStep(1);
            }}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Pick a different exam
          </button>
        </>
      )}
    </section>
  );
}

// ---------- Returning visitor ----------

function daysLabel(days: number | null): string | null {
  if (days === null) return null;
  if (days > 1) return `${days} days left`;
  if (days === 1) return "1 day left";
  if (days === 0) return "Exam day. Good luck!";
  return "Exam date has passed";
}

function Dashboard({ store, exam, onChangeExam }: { store: StoreData; exam: ExamLite; onChangeExam: () => void }) {
  const days = daysUntilExam(store.examDate);
  const label = daysLabel(days);
  const t = today(store);
  const due = dueCards(store).length;
  const hasCards = Object.keys(store.cards).length > 0;
  const s = streak(store);

  const stats = [
    { icon: Layers, value: hasCards ? String(due) : "–", label: hasCards ? (due === 1 ? "flashcard due" : "flashcards due") : "no flashcards yet" },
    { icon: Target, value: `${Math.min(t.questions, 999)}/${DAILY_QUESTIONS}`, label: "questions today" },
    { icon: Flame, value: String(s), label: "day streak" },
  ];

  const actions = [
    { href: `/practice?exam=${exam.id}&smart=1`, icon: Sparkles, title: "Smart practice", text: "Questions from your weakest topics" },
    { href: `/practice?exam=${exam.id}&mock=1`, icon: Timer, title: "Take a mock test", text: "Full timed paper with negative marking" },
    { href: "/today", icon: CalendarCheck, title: "Today’s plan", text: "Your checklist for today" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:p-7" aria-labelledby="dashboard-heading">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="eyebrow">Preparing for</p>
          <h1 id="dashboard-heading" className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
            {exam.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{exam.fullName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {label ? (
            <span className={`chip px-2.5 py-1 text-sm ${days !== null && days >= 0 && days <= 30 ? "bg-red-50 text-red-700" : days !== null && days < 0 ? "bg-slate-100 text-slate-600" : "bg-brand-50 text-brand-700"}`}>
              <CalendarDays className="h-4 w-4" /> {label}
            </span>
          ) : (
            <Link href="/today" className="chip bg-slate-100 px-2.5 py-1 text-sm text-slate-600 hover:text-slate-900">
              <CalendarDays className="h-4 w-4" /> Set exam date
            </Link>
          )}
          <button type="button" onClick={onChangeExam} className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline">
            Change exam
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((st) => (
          <div key={st.label} className="rounded-xl border border-slate-200 p-3">
            <dt className="flex items-center gap-1.5 text-xs text-slate-500">
              <st.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{st.label}</span>
            </dt>
            <dd className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">{st.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
        {actions.map((a, i) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group flex items-center gap-3 rounded-xl p-4 transition-[opacity,border-color,background-color] ${i === 0 ? "bg-ink text-on-ink hover:opacity-90" : "border border-slate-200 bg-surface text-slate-900 hover:border-slate-300 hover:bg-slate-50"}`}
          >
            <a.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{a.title}</span>
              <span className={`block text-xs ${i === 0 ? "text-on-ink/70" : "text-slate-500"}`}>{a.text}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

type TopicsModule = typeof import("@/data/topics");

function YourPlan({ store, exam, onClose }: { store: StoreData; exam: ExamLite; onClose: () => void }) {
  const days = daysUntilExam(store.examDate);
  const revision = days !== null && days <= 30;
  const exams = useExams(true);
  // Topic names are only needed for the "Start with" line, so the topic list loads just for it.
  const [topics, setTopics] = useState<TopicsModule | null>(null);
  useEffect(() => {
    let live = true;
    import("@/data/topics").then((m) => live && setTopics(m), () => {});
    return () => {
      live = false;
    };
  }, []);
  const full = exams?.EXAM_BY_ID.get(exam.id);
  const focus =
    full && topics
      ? focusTopics(exams!.examTopicIds(full), store.topics, 3)
          .map((f) => topics.TOPIC_BY_ID.get(f.id)?.name)
          .filter(Boolean)
      : [];

  const items = [
    days !== null && days > 0 ? `${days} days to ${exam.name}. ${revision ? "Revision mode: more mock tests, fewer new topics." : "Enough time to build strong foundations topic by topic."}` : `No date yet: you can add it any time on the Today page.`,
    `Every day: ${DAILY_QUESTIONS} smart-practice questions and your due flashcards, about 20 minutes.`,
    revision ? "A full mock test every 2 days." : "A full mock test once a week.",
    ...(focus.length ? [`Start with: ${focus.join(", ")}.`] : []),
  ];

  // The button that finished onboarding is gone; bring keyboard and screen-reader users here.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6" aria-labelledby="plan-heading">
      <div className="flex items-start justify-between gap-3">
        <h2 id="plan-heading" ref={headingRef} tabIndex={-1} className="font-semibold text-brand-900 outline-none">
          Your plan for {exam.name}
        </h2>
        <button type="button" onClick={onClose} className="text-sm font-medium text-brand-700 hover:underline">
          Got it
        </button>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-brand-900">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The lecture breakdown, kept within reach once the hero has given way to the dashboard. */
function CompactLecture() {
  return (
    <section className="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-surface p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="lg:max-w-sm">
        <h2 className="font-semibold">Break down a YouTube lecture</h2>
        <p className="mt-1 text-sm text-slate-600">Chapters marked by importance, notes, a quiz and flashcards.</p>
      </div>
      <div className="w-full lg:max-w-lg">
        <VideoLinkForm />
      </div>
    </section>
  );
}
