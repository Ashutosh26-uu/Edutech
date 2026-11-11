"use client";

import { ChevronLeft, LayoutGrid, Maximize2, Timer, UserRound, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { RichText } from "@/components/RichText";
import type { QuizSection } from "@/components/Quiz";
import { inLang, type Lang } from "@/lib/lang";
import { PALETTE_LABEL, PALETTE_STATES, paletteCounts, paletteState, type PaletteState } from "@/lib/mockAnalysis";
import { EXAM_MODE_KEY, readExamModePref, writeExamModePref } from "@/lib/questionNotes";
import type { MCQ } from "@/lib/types";
import { formatTime } from "@/lib/youtube";

/**
 * Exam mode: a full-screen layout like a government computer-based test (generic, no vendor
 * branding). Top bar with the paper, candidate and clock; section tabs; the question with
 * radio options; a question palette with the standard five states (a drawer on phones); and the
 * usual "Mark for Review & Next / Clear Response / Save & Next / Submit" buttons.
 */

const LETTERS = ["A", "B", "C", "D", "E"];

/** Shapes and colours of the five palette states, as on CBT exams. */
const SHAPE: Record<PaletteState, string> = {
  "not-visited": "rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-300",
  "not-answered": "rounded-t-md rounded-b-[45%] bg-red-500 text-white",
  answered: "rounded-b-md rounded-t-[45%] bg-emerald-600 text-white",
  marked: "rounded-full bg-violet-600 text-white",
  "answered-marked": "rounded-full bg-violet-600 text-white",
};

function Swatch({ state, children, className = "" }: { state: PaletteState; children?: ReactNode; className?: string }) {
  return (
    <span className={`relative grid place-items-center font-semibold tabular-nums ${SHAPE[state]} ${className}`}>
      {children}
      {state === "answered-marked" && <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" aria-hidden />}
    </span>
  );
}

export interface ExamViewProps {
  title: string;
  candidate?: string;
  questions: MCQ[];
  idx: number;
  chosen: (number | null)[];
  marked: boolean[];
  visited: boolean[];
  lang: Lang;
  langToggle?: ReactNode;
  sections?: QuizSection[];
  /** Sectional papers: only the open section can be visited. */
  sectional: boolean;
  openSection: number;
  first: number;
  last: number;
  secondsLeft: number;
  timerLabel: string;
  submitting: boolean;
  submitLabel: string;
  error?: string;
  onChoose: (i: number) => void;
  onGoTo: (i: number) => void;
  onMarkNext: () => void;
  onClear: () => void;
  onSaveNext: () => void;
  onSubmit: () => void;
}

export function ExamView(p: ExamViewProps) {
  const [drawer, setDrawer] = useState(false);
  const q = p.questions[p.idx];
  const text = inLang(q, p.lang);
  const sectionAt = (i: number) => p.sections?.findIndex((s) => i >= s.from && i < s.from + s.count) ?? -1;
  const tab = sectionAt(p.idx);
  // The palette shows the section on screen (all questions when the paper has no sections).
  const range = p.sections && tab >= 0 ? { from: p.sections[tab].from, to: p.sections[tab].from + p.sections[tab].count - 1 } : { from: p.first, to: p.last };
  const ids = Array.from({ length: range.to - range.from + 1 }, (_, k) => range.from + k);
  const stateOf = (i: number) => paletteState(p.visited[i], p.chosen[i] !== null, p.marked[i]);
  const counts = paletteCounts(ids.map(stateOf));

  // The page behind stays still while the exam covers it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const palette = (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-sm">
        <UserRound className="h-8 w-8 shrink-0 rounded-full bg-surface p-1.5 text-slate-500" />
        <span className="min-w-0 truncate font-medium">{p.candidate || "Candidate"}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-slate-600">
        {PALETTE_STATES.map((s) => (
          <li key={s} className={`flex items-center gap-2 ${s === "answered-marked" ? "col-span-2" : ""}`}>
            <Swatch state={s} className="h-7 w-7 shrink-0 text-xs">
              {counts[s]}
            </Swatch>
            {PALETTE_LABEL[s]}
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="mb-2 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{tab >= 0 ? p.sections![tab].name : "Questions"}</p>
        <div className="grid grid-cols-5 gap-2 p-1">
          {ids.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                p.onGoTo(i);
                setDrawer(false);
              }}
              aria-label={`Question ${i + 1}: ${PALETTE_LABEL[stateOf(i)]}`}
              aria-current={i === p.idx ? "step" : undefined}
              className={`h-10 w-full ${i === p.idx ? "outline-2 outline-offset-2 outline-brand-500" : ""}`}
            >
              <Swatch state={stateOf(i)} className="h-10 w-full text-sm">
                {i + 1}
              </Swatch>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-surface text-slate-900" role="dialog" aria-modal="true" aria-label={`${p.title}: exam mode`}>
      {/* Top bar: paper, candidate and the clock. */}
      <header className="flex items-center gap-3 bg-ink px-3 py-2 text-on-ink sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">{p.title}</p>
          <p className="truncate text-xs opacity-75">Candidate: {p.candidate || "Candidate"}</p>
        </div>
        <div className={`text-right ${p.secondsLeft < 300 ? "text-red-400" : ""}`} role="timer" aria-live="off">
          <p className="text-[10px] uppercase tracking-wide opacity-75">{p.timerLabel}</p>
          <p className="flex items-center gap-1 font-mono text-xl font-bold tabular-nums sm:text-2xl">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
            {formatTime(p.secondsLeft)}
          </p>
        </div>
      </header>

      {/* Section tabs. */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-2 sm:px-4">
        <nav className="-mb-px flex min-w-0 flex-1 gap-1 overflow-x-auto py-1.5" aria-label="Sections">
          {(p.sections?.length ? p.sections : [{ name: "All questions", from: p.first, count: p.last - p.first + 1, minutes: 0 }]).map((s, k) => {
            const locked = p.sectional && k !== p.openSection;
            const active = p.sections?.length ? k === tab : true;
            return (
              <button
                key={s.from}
                type="button"
                disabled={locked}
                onClick={() => p.onGoTo(s.from)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap sm:text-sm ${active ? "bg-brand-600 text-white" : locked ? "text-slate-400" : "bg-surface text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"}`}
                title={locked ? "Sections open one at a time" : undefined}
              >
                {s.name}
              </button>
            );
          })}
        </nav>
        {p.langToggle}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Question area. */}
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-base font-semibold">Question No. {p.idx + 1}</h2>
            <span className="flex items-center gap-1">
              <button type="button" className="btn-ghost px-2 py-1 text-xs" disabled={p.idx === p.first} onClick={() => p.onGoTo(p.idx - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button type="button" className="btn-ghost px-2 py-1 text-xs md:hidden" onClick={() => setDrawer(true)} aria-label="Open question palette">
                <LayoutGrid className="h-3.5 w-3.5" /> {counts.answered + counts["answered-marked"]}/{ids.length}
              </button>
            </span>
          </div>
          <div className="text-base leading-relaxed whitespace-pre-line" lang={p.lang === "hi" && q.questionHi ? "hi" : undefined}>
            <RichText text={text.question} />
          </div>
          <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`Options for question ${p.idx + 1}`}>
            {text.options.map((opt, i) => {
              const on = p.chosen[p.idx] === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  data-quiz-option
                  onClick={() => p.onChoose(i)}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm ${on ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${on ? "border-brand-600" : "border-slate-400"}`}>{on && <span className="h-2 w-2 rounded-full bg-brand-600" />}</span>
                  <span className="min-w-0 whitespace-pre-wrap break-words">
                    <span className="mr-1 font-medium text-slate-500">{LETTERS[i]}.</span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 hidden text-xs text-slate-500 sm:block">Keys: 1–4 or A–D to answer · ← → to move</p>
        </main>

        {/* Palette: a side panel on wide screens, a drawer on phones. */}
        <aside className="hidden w-72 shrink-0 border-l border-slate-200 p-3 md:block lg:w-80" aria-label="Question palette">
          {palette}
        </aside>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} aria-hidden />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col bg-surface p-3 shadow-2xl" role="dialog" aria-label="Question palette">
            <button type="button" className="mb-2 self-end rounded-md p-1 text-slate-500 hover:bg-slate-100" onClick={() => setDrawer(false)} aria-label="Close palette">
              <X className="h-5 w-5" />
            </button>
            <div className="min-h-0 flex-1">{palette}</div>
          </div>
        </div>
      )}

      {/* Bottom buttons. */}
      <footer className="border-t border-slate-200 bg-slate-50 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
        {p.error && <p className="mb-1 text-right text-xs text-red-600">{p.error}</p>}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button type="button" className="btn-ghost px-2 text-xs sm:px-3 sm:text-sm" onClick={p.onMarkNext}>
            Mark for Review &amp; Next
          </button>
          <button type="button" className="btn-ghost px-2 text-xs sm:px-3 sm:text-sm" onClick={p.onClear} disabled={p.chosen[p.idx] === null}>
            Clear Response
          </button>
          <button type="button" className="btn-primary px-2 text-xs sm:ml-auto sm:px-4 sm:text-sm" onClick={p.onSaveNext}>
            Save &amp; Next
          </button>
          <button type="button" className="btn rounded-lg bg-emerald-600 px-2 text-xs text-white hover:opacity-90 sm:px-4 sm:text-sm" onClick={p.onSubmit} disabled={p.submitting}>
            {p.submitting ? "Submitting…" : p.submitLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}

/** Start-screen switch for exam mode; the choice is remembered in this browser. */
export function ExamModeSwitch({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm">
      <span>
        <span className="flex items-center gap-1.5 font-medium">
          <Maximize2 className="h-3.5 w-3.5" /> Exam mode
        </span>
        <span className="block text-xs text-slate-500">Full-screen layout like the real computer-based test</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={on}
        onChange={(e) => {
          writeExamModePref(e.target.checked);
          onChange(e.target.checked);
        }}
      />
      <span aria-hidden className={`relative h-6 w-10 shrink-0 rounded-full transition peer-focus-visible:outline-2 peer-focus-visible:outline-brand-500 ${on ? "bg-brand-600" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </label>
  );
}

/** The remembered exam-mode choice (false until read in the browser). */
export function useExamModePref(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(readExamModePref());
    const onStorage = (e: StorageEvent) => e.key === EXAM_MODE_KEY && setOn(readExamModePref());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return [on, setOn];
}
