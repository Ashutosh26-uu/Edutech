import { ArrowRight, CalendarCheck, Check, Clock, Target, Timer, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HomeTop } from "@/components/HomeTop";
import { StartChecklist } from "@/components/StartChecklist";
import { PracticePreview } from "@/components/home/PracticePreview";
import { BANK_SIZES } from "@/data/bank";
import { EXAMS } from "@/data/exams";

export const metadata: Metadata = {
  title: { absolute: "StudyClip – Free exam practice for SSC, Banking, Railways, UPSC, JEE & NEET" },
  description:
    "Choose your exam and start 10 practice questions, with an explanation after every answer. See your weak topics, take timed mock tests with negative marking and follow a daily plan. Practice is free, no sign-up needed.",
};

const HOME_CATEGORIES = ["SSC", "Banking", "Railways", "UPSC", "State PSC", "Teaching", "Defence", "Engineering & Medical", "Law & Management", "Campus Placement"];

const QUESTION_COUNT = Object.values(BANK_SIZES).reduce((a, b) => a + b, 0);

const STEPS = [
  { title: "Choose your exam", text: "Tap your exam at the top of this page, or search for it." },
  { title: "Answer 10 questions", text: "They go from easy to hard. You see the right answer and a short explanation after each one." },
  { title: "See your weak topics", text: "StudyClip notes the topics you get wrong and asks you more questions from them next time." },
];

const FEATURES = [
  {
    icon: Target,
    title: "Practice with an explanation every time",
    text: "After every answer you see what was right and why. Sets are short: 10 questions, about ten minutes. Untimed practice is always free.",
    href: "/exams",
    cta: "Choose an exam",
  },
  {
    icon: TrendingUp,
    title: "Know your weak topics",
    text: "Your accuracy is tracked topic by topic. Questions come more often from the topics you get wrong, so you fix them first.",
    href: "/progress",
    cta: "See my progress",
  },
  {
    icon: Timer,
    title: "Timed mock tests",
    text: "Mocks follow the exam pattern, with sections, a timer and negative marking. Your first timed test for each exam is free. Every Sunday there is a free all-India mock for selected exams, with a rank.",
    href: "/mock-sunday",
    cta: "Sunday all-India mock",
  },
  {
    icon: CalendarCheck,
    title: "A daily plan and a streak",
    text: "Set your exam date and get a short list of what to do today. Study every day to keep your streak going.",
    href: "/today",
    cta: "Open today’s plan",
  },
];

export default function Home() {
  return (
    <div className="-mt-10 space-y-24">
      {/* Personal top (exam picker or dashboard). New visitors also see how it works, below the picker. */}
      <HomeTop>
        <section className="pb-4 pt-16 sm:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">Three steps. The first one takes ten minutes.</h2>
              <ol className="mt-6 space-y-5">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-surface font-mono text-sm text-slate-600">{i + 1}</span>
                    <div>
                      <h3 className="font-medium text-slate-900">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                {[`${QUESTION_COUNT.toLocaleString("en-IN")} questions`, `${EXAMS.length} exams`, "Practice is free", "No sign-up needed"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-slate-600">
                Want more detail?{" "}
                <Link href="/start" className="font-medium text-brand-700 underline-offset-2 hover:underline">
                  Read the simple step-by-step guide →
                </Link>
              </p>
            </div>
            <PracticePreview />
          </div>
        </section>
      </HomeTop>

      {/* First steps for new students; hides itself once done or dismissed */}
      <StartChecklist className="-mt-12" />

      {/* Last-minute offer */}
      <section className="-mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Exam tomorrow?</h2>
            <p className="text-sm text-slate-600">Full-syllabus revision sheet and rapid flashcards for ₹19, or 3 timed tests for ₹19. No subscription.</p>
          </div>
        </div>
        <Link href="/last-minute" className="btn-primary shrink-0">
          Revise tonight <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Exams by category: one short row instead of a wall of names */}
      <section className="border-y border-slate-200 py-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-slate-500">{EXAMS.length} exams, by category</p>
          <Link href="/exams" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
            All exams <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {HOME_CATEGORIES.map((c) => (
            <Link key={c} href={`/exams?cat=${encodeURIComponent(c)}`} className="pill shrink-0">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* The core loop: practise, find weak topics, take mocks, follow the plan */}
      <section>
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Practise, find your weak topics, fix them</h2>
          <p className="mt-3 text-slate-600">Everything on StudyClip is built around this one loop, for your exam and its syllabus.</p>
        </div>
        <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="card flex flex-col">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3 font-medium text-slate-900">{f.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{f.text}</p>
              <Link href={f.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                {f.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="rounded-2xl bg-ink px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-semibold text-on-ink">Start with 10 questions</h2>
        <p className="mx-auto mt-3 max-w-md text-on-ink/70">Choose your exam and answer your first set now. It is free and you do not need an account.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/exams" className="btn bg-on-ink px-5 text-ink hover:opacity-90">
            Choose your exam <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/today" className="btn border border-on-ink/20 px-5 text-on-ink hover:bg-on-ink/10">
            See today’s plan
          </Link>
        </div>
      </section>

      {/* The side tools get one short line */}
      <p className="-mt-14 text-center text-sm text-slate-500">
        More tools: video breakdown, typing test, audio revision and more.{" "}
        <Link href="/tools" className="font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
          See all tools →
        </Link>
      </p>
    </div>
  );
}
