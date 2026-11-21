"use client";

import { ArrowLeft, ArrowRight, ArrowRightLeft, CalendarCheck, CalendarDays, Flame, Newspaper, Layers, Search, Sparkles, Target, Timer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { focusTopics } from "@/lib/adaptive";
import { IS_STATIC, request } from "@/lib/api";
import { KIND, fmtDay, whenLabel, type ExamEvent } from "@/lib/calendar";
import { DAILY_QUESTION_GOAL, dayKey, daysUntilExam, dueCards, setExam, setExamDate, streak, today } from "@/lib/storage";
import { useStore, type StoreData } from "@/lib/useStore";

const DAILY_QUESTIONS = DAILY_QUESTION_GOAL; // matches the "Smart practice: 10 questions" task on /today

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
export function HomeTopClient({ children, featured, examCount, questionCount }: { children: ReactNode; featured: ExamLite[]; examCount: number; questionCount: number }) {
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
              questionCount={questionCount}
              initialDate={store?.examDate}
              currentExamId={exam?.id}
              onCancel={exam ? () => setEditing(false) : undefined}
              onDone={() => {
                setEditing(false);
                setJustPlanned(true);
              }}
            />
          </div>
          {!exam && children}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-10">
      <Dashboard store={store} exam={exam} onChangeExam={() => setEditing(true)} />
      {justPlanned && <YourPlan store={store} exam={exam} onClose={() => setJustPlanned(false)} />}
    </div>
  );
}

// ---------- First visit: pick an exam, then a date ----------

function Onboarding({ featured, examCount, questionCount, initialDate, currentExamId, onCancel, onDone }: { featured: ExamLite[]; examCount: number; questionCount: number; initialDate?: string; currentExamId?: string; onCancel?: () => void; onDone: () => void }) {
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

  const router = useRouter();
  function finish(withDate: boolean) {
    if (!picked) return;
    onDone();
    setExam(picked.id);
    setExamDate(withDate ? date : undefined);
  }
  /** The fastest way to value: save the choice and go straight into a first short set. */
  function startNow() {
    if (!picked) return;
    finish(!!date);
    router.push(`/practice?exam=${picked.id}&smart=1`);
  }
  /** One tap from the hero: save the exam and open its first 10 questions. The date can wait. */
  function startWith(e: ExamLite) {
    setExam(e.id);
    router.push(`/practice?exam=${e.id}&smart=1`);
  }

  const todayIso = dayKey();

  const hero = !currentExamId && step === 1;
  const Heading = hero ? "h1" : "h2";

  return (
    <section
      className={hero ? "relative pb-2 pt-6 sm:pt-12" : "rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:p-7"}
      aria-labelledby="onboarding-heading"
    >
      {hero && <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-[-1rem] -top-10 bottom-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_65%)]" />}
      <div className="flex items-center justify-between gap-3">
        {hero ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3 py-1 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {questionCount.toLocaleString("en-IN")} practice questions · {examCount} exams · Free
          </p>
        ) : (
          <p className="eyebrow">
            {currentExamId ? "Change exam" : "Get started"} · Step {step} of 2
          </p>
        )}
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Cancel
          </button>
        )}
      </div>

      {step === 1 ? (
        <>
          <Heading
            id="onboarding-heading"
            ref={headingRef}
            tabIndex={-1}
            className={hero ? "mt-5 max-w-3xl text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] outline-none sm:text-6xl" : "mt-2 text-2xl font-semibold outline-none sm:text-3xl"}
          >
            {hero ? "Prepare for your exam with practice that adapts to you." : "Which exam are you preparing for?"}
          </Heading>
          <p className={hero ? "mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg" : "mt-1.5 text-sm text-slate-600"}>
            {hero
              ? "Pick your exam and start with 10 questions. You see the answer and a short explanation after each one. Free, no sign-up needed."
              : "We’ll set up practice questions, mock tests and a daily plan for it. Saved in this browser only."}
          </p>

          <div className={`relative ${hero ? "mt-7 max-w-xl" : "mt-5"}`}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={`input pl-9 text-base ${hero ? "rounded-xl py-3 shadow-sm sm:py-3.5" : "py-2.5"}`}
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
                {hero ? (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                    <Sparkles className="h-4 w-4 text-brand-600" /> Tap your exam to start 10 free questions
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Popular</p>
                )}
                <ul className="mt-2 flex flex-wrap gap-2">
                  {featured.slice(0, 8).map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => (hero ? startWith(e) : choose(e))}
                        aria-label={hero ? `${e.name}: start 10 free questions` : undefined}
                        className={`pill ${hero ? "gap-1.5 px-4 py-2 font-medium text-slate-900" : ""} ${e.id === currentExamId ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`}
                      >
                        {e.name}
                        {hero && <ArrowRight className="h-3.5 w-3.5 text-slate-400" />}
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
            Let’s start with {picked?.name}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">Ten questions, from easy to hard, with the answer after each one. About ten minutes, and it shows us where you stand.</p>
          <button type="button" onClick={startNow} className="btn-primary mt-5 w-full px-5 py-3 text-base sm:w-auto">
            <Sparkles className="h-4 w-4" /> Start my first 10 questions <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-7 text-sm font-medium text-slate-700">
            When is the exam? <span className="font-normal text-slate-500">Optional: we count down and switch to revision mode in the last month.</span>
          </p>
          <form
            className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              finish(!!date);
            }}
          >
            <label className="block text-sm text-slate-600 sm:w-56">
              Exam date
              <input type="date" className="input mt-1 py-2.5 text-base" min={todayIso} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <button type="submit" className="btn-ghost px-5 py-2.5" disabled={!date}>
              Save date and see my plan
            </button>
            <button type="button" className="btn-quiet px-5 py-2.5" onClick={() => finish(false)}>
              Skip for now
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

  // One clear next step leads: today's questions, then due flashcards, then this week's mock.
  const left = Math.max(DAILY_QUESTIONS - t.questions, 0);
  const mockThisWeek = store.mocks.some((m) => m.examId === exam.id && Date.now() - m.takenAt < 7 * 86_400_000);
  const practice = { href: `/practice?exam=${exam.id}&smart=1`, icon: Sparkles, title: left ? (t.questions ? `Finish today’s set: ${left} left` : "Start today’s 10 questions") : "Bonus set: 10 more", text: left ? "From your weakest topics, about 10 minutes" : "Goal done. Extra practice lifts your weak topics" };
  const review = { href: "/review", icon: Layers, title: `Review ${due} flashcard${due === 1 ? "" : "s"}`, text: "Two minutes, so you don’t forget" };
  const mock = { href: `/practice?exam=${exam.id}&mock=1`, icon: Timer, title: mockThisWeek ? "Take another mock test" : "Take this week’s mock test", text: "Full timed paper with negative marking" };
  const plan = { href: "/today", icon: CalendarCheck, title: "Today’s plan", text: "Your checklist for today" };
  const actions = left ? [practice, ...(due ? [review] : [mock]), plan] : due ? [review, practice, mock] : !mockThisWeek ? [mock, practice, plan] : [practice, mock, plan];

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
          <button type="button" onClick={onChangeExam} className="btn-ghost px-3 py-1.5">
            <ArrowRightLeft className="h-4 w-4" /> Switch exam
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-3">
        <GoalRing done={t.questions} goal={DAILY_QUESTIONS} href={`/practice?exam=${exam.id}&smart=1`} />
        <WeekStrip store={store} streakDays={s} />
        <Link href="/review" className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Layers className="h-3.5 w-3.5" /> Flashcards
          </span>
          <span className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{stats[0].value}</span>
          <span className="flex items-center justify-between text-xs text-slate-500">
            {stats[0].label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
        {actions.map((a, i) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group flex items-center gap-3 rounded-xl p-4 transition-[opacity,border-color,background-color] ${i === 0 ? "bg-ink text-on-ink hover:opacity-90" : "border border-slate-200 bg-surface text-slate-900 hover:border-slate-300 hover:bg-slate-50"}`}
          >
            <a.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              {i === 0 && <span className="block text-[10px] font-semibold uppercase tracking-wider text-on-ink/60">Next up</span>}
              <span className="block font-semibold">{a.title}</span>
              <span className={`block text-xs ${i === 0 ? "text-on-ink/70" : "text-slate-500"}`}>{a.text}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <FocusNext store={store} examId={exam.id} />
      <TodayStrip examId={exam.id} examName={exam.name} />
    </section>
  );
}

/** Today's question goal as a ring that fills as questions are answered. */
function GoalRing({ done, goal, href }: { done: number; goal: number; href: string }) {
  const p = Math.min(done / goal, 1);
  const r = 22;
  const c = 2 * Math.PI * r;
  const complete = done >= goal;
  return (
    <Link href={href} className="group col-span-2 flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:col-span-1">
      <svg viewBox="0 0 56 56" className="h-14 w-14 shrink-0 -rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="5" className="stroke-slate-200" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${complete ? "stroke-emerald-500" : "stroke-brand-600"}`}
        />
      </svg>
      <span className="min-w-0">
        <span className="block text-xs text-slate-500">Daily goal</span>
        <span className="block text-2xl font-semibold tabular-nums text-slate-900">
          {Math.min(done, 999)}
          <span className="text-base font-normal text-slate-400">/{goal}</span>
        </span>
        <span className={`block text-xs ${complete ? "font-medium text-emerald-700" : "text-slate-500"}`}>
          {complete ? "Goal done. Nice work!" : done ? `${goal - done} more to go` : "Start today’s questions"}
        </span>
      </span>
    </Link>
  );
}

/** Streak with the last seven days as dots: filled where the student practised. */
function WeekStrip({ store, streakDays }: { store: StoreData; streakDays: number }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const c = store.counts[dayKey(d)];
    return { key: dayKey(d), label: d.toLocaleDateString("en-IN", { weekday: "narrow" }), active: !!c && c.questions + c.reviews + c.mocks + c.videos > 0, today: i === 6 };
  });
  return (
    <Link href="/today" className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <Flame className={`h-3.5 w-3.5 ${streakDays ? "text-orange-500" : ""}`} /> {streakDays === 1 ? "1-day streak" : `${streakDays}-day streak`}
      </span>
      <span className="mt-3 flex items-end justify-between gap-1" aria-label={`Practised on ${days.filter((d) => d.active).length} of the last 7 days`}>
        {days.map((d) => (
          <span key={d.key} className="flex flex-col items-center gap-1">
            <span className={`h-2.5 w-2.5 rounded-full transition-colors ${d.active ? "bg-orange-500" : "bg-slate-200"} ${d.today ? "ring-2 ring-orange-500/30 ring-offset-1 ring-offset-surface" : ""}`} />
            <span className={`text-[10px] ${d.today ? "font-semibold text-slate-700" : "text-slate-400"}`}>{d.label}</span>
          </span>
        ))}
      </span>
    </Link>
  );
}

/** Two daily reasons to come back: today's current-affairs quiz and the next date for the exam. */
function TodayStrip({ examId, examName }: { examId: string; examName: string }) {
  const [quiz, setQuiz] = useState<{ title: string; count: number } | null>(null);
  const [next, setNext] = useState<{ today: string; event: ExamEvent } | null>(null);
  useEffect(() => {
    if (IS_STATIC) return;
    let live = true;
    request("/api/current-affairs")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && d?.quiz?.isToday && setQuiz({ title: d.quiz.title, count: d.quiz.questions.length }))
      .catch(() => {});
    request(`/api/calendar?exam=${encodeURIComponent(examId)}&limit=5`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { today: string; events: ExamEvent[] } | null) => {
        const e = d?.events.find((x) => whenLabel(d.today, x) !== "Passed");
        if (live && d && e) setNext({ today: d.today, event: e });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [examId]);
  if (!quiz && !next) return null;
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {quiz && (
        <Link href="/current-affairs" className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700">
            <Newspaper className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-slate-500">Today’s current affairs · {quiz.count} questions</span>
            <span className="block truncate text-sm font-medium text-slate-900">{quiz.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
      {next && (
        <Link href="/calendar" className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-700">
            <CalendarDays className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-slate-500">
              {examName} · {KIND[next.event.kind].label} · {whenLabel(next.today, next.event)}
            </span>
            <span className="block truncate text-sm font-medium text-slate-900">
              {next.event.title} <span className="font-normal text-slate-500">({fmtDay(next.event.day)})</span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** The three topics that need work most, each one tap from practice. */
function FocusNext({ store, examId }: { store: StoreData; examId: string }) {
  const exams = useExams(true);
  const [topics, setTopics] = useState<TopicsModule | null>(null);
  useEffect(() => {
    let live = true;
    import("@/data/topics").then((m) => live && setTopics(m), () => {});
    return () => {
      live = false;
    };
  }, []);
  const exam = exams?.EXAM_BY_ID.get(examId);
  if (!exam || !topics) return <div className="mt-5 h-[7.5rem]" aria-hidden />;
  const focus = focusTopics(exams!.examTopicIds(exam), store.topics, 3);
  if (!focus.length) return null;
  return (
    <div className="mt-5">
      <p className="text-xs font-medium text-slate-500">Focus next</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-3">
        {focus.map((f) => {
          const st = store.topics[f.id];
          const acc = st?.attempted ? Math.round((st.correct / st.attempted) * 100) : null;
          return (
            <li key={f.id}>
              <Link href={`/practice?topics=${f.id}`} className="group block rounded-xl border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-slate-900">{topics.TOPIC_BY_ID.get(f.id)?.name ?? f.id}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className={`block h-full rounded-full transition-[width] duration-700 ${acc === null ? "w-0" : acc < 60 ? "bg-red-500" : acc < 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={acc === null ? undefined : { width: `${Math.max(acc, 4)}%` }}
                  />
                </span>
                <span className="mt-1.5 block text-xs text-slate-500">{f.reason}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
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
