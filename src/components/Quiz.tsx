"use client";

import { AlertTriangle, ArrowRight, BookmarkPlus, ChevronDown, Languages, Play, Star, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOPIC_BY_ID } from "@/data/topics";
import { RichText } from "@/components/RichText";
import { ReportButton, StandingCard, type Standing } from "@/components/QualityWidgets";
import { ScoreCardButton } from "@/components/ScoreCard";
import { ExamView } from "@/components/ExamMode";
import { MistakePatternCard, MistakeTagPicker, NoteBox, NoteButton } from "@/components/StudyNotes";
import { cardsForQuestions } from "@/lib/cards";
import { attemptStrategy, guessCost, paletteCounts, paletteState, sectionTimes, type AnalysisItem } from "@/lib/mockAnalysis";
import { exitFullscreen } from "@/lib/questionNotes";
import { DIFFICULTIES, DIFFICULTY_LABEL } from "@/lib/difficulty";
import { hasHindi, inLang, useLang, type Lang } from "@/lib/lang";
import { addCards, toggleBookmark } from "@/lib/storage";
import { useLeaveGuard } from "@/lib/leaveGuard";
import type { QuizProgress } from "@/lib/practiceResume";
import { useMarkTimedTest } from "@/lib/timedTest";
import { useStore } from "@/lib/useStore";
import type { Difficulty, MCQ } from "@/lib/types";
import { formatTime } from "@/lib/youtube";

export interface AnswerResult {
  question: MCQ;
  chosen: number | null;
  correct: boolean;
  /** Seconds spent on the question, when timed. */
  seconds?: number;
}

/** A section of a mock on an exam pattern: questions [from, from + count) with their own minutes. */
export interface QuizSection {
  name: string;
  from: number;
  count: number;
  minutes: number;
}

interface Props {
  questions: MCQ[];
  /** practice: instant feedback after each answer. mock: timed, answers revealed after submitting. */
  mode: "practice" | "mock";
  negativeMarking?: number;
  /** Marks per correct answer; scores are shown in marks when this is set. */
  marks?: number;
  timeLimitSec?: number;
  /** Paper sections of a mock. With `sectional`, each one has its own timer and closes for good when it ends. */
  sections?: QuizSection[];
  sectional?: boolean;
  /** The user's previous score on the same kind of test, for the comparison line. */
  previous?: { score: number; total: number } | null;
  onFinish?: (results: AnswerResult[]) => void;
  onTimestamp?: (secs: number) => void;
  onRestart?: () => void;
  /** Server-scored tests: the attempt id, for the rank and percentile on the result screen. */
  attemptId?: string;
  /**
   * Server-scored tests: questions arrive without answers, and this sends the chosen options and
   * per-question seconds to the server and resolves with the full questions (with answers).
   */
  submit?: (chosen: (number | null)[], times: number[]) => Promise<MCQ[]>;
  /** What the shareable score card names (exam or topic) and the exam its link points to. */
  share?: ShareInfo;
  /** Timed mocks: the full-screen layout of a computer-based test (see ExamMode). */
  examMode?: boolean;
  /** Name shown as the candidate in exam mode. */
  candidate?: string;
  /** Untimed practice: progress to pick up from (a resumed set), and a callback on every change. */
  initial?: QuizProgress | null;
  onProgress?: (p: QuizProgress) => void;
}

/** Title and exam for the shareable score card on the results screen. */
export interface ShareInfo {
  title: string;
  examId?: string;
}

const LETTERS = ["A", "B", "C", "D", "E"];

const DIFFICULTY_TONE: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700",
  moderate: "bg-sky-50 text-sky-700",
  hard: "bg-amber-50 text-amber-700",
  "very-hard": "bg-red-50 text-red-700",
};

export function DifficultyChip({ difficulty }: { difficulty?: Difficulty }) {
  if (!difficulty) return null;
  return <span className={`chip ${DIFFICULTY_TONE[difficulty]}`}>{DIFFICULTY_LABEL[difficulty]}</span>;
}

/** Saves a question (with its answer) to come back to; saved questions live at /saved. */
export function BookmarkButton({ question }: { question: MCQ }) {
  const store = useStore();
  if (!store || question.answer < 0) return null;
  const on = !!store.bookmarks[question.id];
  return (
    <button
      type="button"
      onClick={() => toggleBookmark(question)}
      className={`chip pointer-coarse:min-h-10 pointer-coarse:px-3 ${on ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600 hover:bg-amber-50"}`}
      title={on ? "Remove from saved questions" : "Save this question to revise later"}
      aria-pressed={on}
    >
      <Star className={`h-3.5 w-3.5 ${on ? "fill-current" : ""}`} /> {on ? "Saved" : "Save"}
    </button>
  );
}

/** English / Hindi switch, shown when some questions have a Hindi version. */
export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs" role="group" aria-label="Question language">
      <Languages className="ml-1 h-3.5 w-3.5 text-slate-500" />
      {(["en", "hi"] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-md px-2 py-0.5 font-medium pointer-coarse:min-h-10 pointer-coarse:px-3 ${lang === l ? "bg-surface text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500"}`}>
          {l === "en" ? "English" : "हिंदी"}
        </button>
      ))}
    </span>
  );
}

/** Marks a question on a point that previous-year papers of the named exams keep testing. */
export function SourceChip({ source, pyq }: { source?: string; pyq?: boolean }) {
  if (!source) return null;
  if (pyq) return <span className="chip bg-violet-100 text-violet-800" title="Previous-year question">PYQ · {source}</span>;
  return <span className="chip bg-violet-50 text-violet-700" title="Asked repeatedly in previous-year papers">Exam favourite · {source}</span>;
}

export function Quiz({ questions, mode, negativeMarking = 0, marks = 1, timeLimitSec, sections, sectional = false, previous, onFinish, onTimestamp, onRestart, submit, attemptId, share, examMode = false, candidate, initial, onProgress }: Props) {
  // A resumed set only counts when it was saved for this many questions.
  const start = initial && initial.chosen.length === questions.length ? initial : null;
  const [idx, setIdx] = useState(start?.idx ?? 0);
  // Questions opened at least once, for "Not visited" vs "Not answered" in exam mode.
  const [visited, setVisited] = useState<boolean[]>(() => start?.visited ?? questions.map((_, i) => i === 0));
  const [chosen, setChosen] = useState<(number | null)[]>(() => start?.chosen ?? questions.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(() => start?.revealed ?? questions.map(() => false));
  // Mock tests: questions the user flagged to come back to, as in the real exam's "Mark for review".
  const [marked, setMarked] = useState<boolean[]>(() => questions.map(() => false));
  const [done, setDone] = useState(false);
  const [scored, setScored] = useState<MCQ[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Sectional papers: the open section, and the deadline of each (set when it opens).
  const [section, setSection] = useState(0);
  const [lang, setLang] = useLang();
  const bilingual = useMemo(() => hasHindi(questions), [questions]);
  const sectionEnds = useRef<number[]>(sectional && sections?.length ? [Date.now() + sections[0].minutes * 60_000] : []);
  const [now, setNow] = useState(() => Date.now());
  const endsAt = useRef(timeLimitSec ? Date.now() + timeLimitSec * 1000 : 0);
  // Seconds per question: the clock for the current question restarts on every move.
  const times = useRef<number[]>(questions.map(() => 0));
  const since = useRef(Date.now());

  const timed = mode === "mock" && !!timeLimitSec;
  // Hides the help chat button while the clock runs.
  useMarkTimedTest(timed && !done);
  const cur =sectional && sections ? sections[section] : null;
  const first = cur ? cur.from : 0;
  const last = cur ? cur.from + cur.count - 1 : questions.length - 1;

  const tick = () => {
    const t = Date.now();
    times.current[idx] += (t - since.current) / 1000;
    since.current = t;
  };
  const goTo = (i: number) => {
    tick();
    setIdx(i);
    setVisited((v) => (v[i] ? v : v.map((x, k) => x || k === i)));
  };
  const exam = examMode && mode === "mock" && timed;

  const results: AnswerResult[] = useMemo(
    () => (scored ?? questions).map((q, i) => ({ question: q, chosen: chosen[i], correct: chosen[i] === q.answer, seconds: timed ? Math.round(times.current[i]) : undefined })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, scored, chosen, timed, done],
  );

  const finish = async () => {
    if (done || submitting) return;
    tick();
    const secs = times.current.map((t) => Math.round(t));
    if (submit) {
      setSubmitting(true);
      setSubmitError("");
      try {
        const full = await submit(chosen, secs);
        setScored(full);
        setDone(true);
        onFinish?.(full.map((q, i) => ({ question: q, chosen: chosen[i], correct: chosen[i] === q.answer, seconds: secs[i] })));
      } catch (e) {
        setSubmitError((e as Error).message || "Could not submit. Check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setDone(true);
    onFinish?.(results);
  };

  /** Closes the open section and opens the next one; the last section's end submits the paper. */
  const nextSection = () => {
    if (!sections || section >= sections.length - 1) return finish();
    const n = section + 1;
    sectionEnds.current[n] = Date.now() + sections[n].minutes * 60_000;
    setSection(n);
    goTo(sections[n].from);
  };

  // One clock for the whole paper, plus the open section's own clock on sectional papers.
  const left = timed ? Math.max(0, Math.ceil((endsAt.current - now) / 1000)) : 0;
  const sectionLeft = cur ? Math.max(0, Math.ceil(((sectionEnds.current[section] ?? now) - now) / 1000)) : null;
  useEffect(() => {
    if (!timed || done) return;
    if (left <= 0) {
      finish();
      return;
    }
    if (cur && sectionLeft !== null && sectionLeft <= 0) {
      nextSection();
      return;
    }
    const t = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, left, sectionLeft, done, timed]);

  // Exam mode leaves full screen once the paper is submitted (or the test is left).
  useEffect(() => {
    if (!exam) return;
    if (done) exitFullscreen();
    return () => exitFullscreen();
  }, [exam, done]);

  // Ask before leaving a running timed test, or a practice set that is part-way through (its
  // answers are recorded only when it is finished). Never once the set is done.
  const midway = mode === "practice" && chosen.some((c) => c !== null);
  useLeaveGuard(!done && (timed || midway), timed ? "Leave the test? The timer keeps running and your answers so far may be lost." : "Leave this practice set? Your answers so far haven’t been saved yet.");

  // Untimed practice: report progress so the set can be picked up again after a refresh.
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  useEffect(() => {
    if (!done) progressRef.current?.({ idx, chosen, revealed, visited });
  }, [idx, chosen, revealed, visited, done]);

  // Keyboard: 1–4 or A–D pick an option, ← / → move between questions (not while typing).
  useEffect(() => {
    if (done || !questions.length) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el?.closest?.("input, textarea, select, [contenteditable=true]") || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const pick = ["1", "2", "3", "4"].indexOf(k) >= 0 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
      if (pick >= 0 && pick < questions[idx].options.length) {
        e.preventDefault();
        document.querySelectorAll<HTMLButtonElement>("[data-quiz-option]")[pick]?.click();
      } else if (e.key === "ArrowRight" && idx < last) {
        e.preventDefault();
        goTo(idx + 1);
      } else if (e.key === "ArrowLeft" && idx > first) {
        e.preventDefault();
        goTo(idx - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!questions.length) return <p className="text-sm text-slate-500">No questions available.</p>;

  if (done) return <Results results={results} negativeMarking={negativeMarking} marks={marks} sections={sections} previous={previous} onTimestamp={onTimestamp} onRestart={onRestart} restartLabel={mode === "mock" ? "Take another test" : "Practise new questions"} attemptId={attemptId} share={share} />;

  const q = questions[idx];
  const text = inLang(q, lang);
  const isRevealed = mode === "practice" && revealed[idx];
  const answeredCount = chosen.filter((c) => c !== null).length;
  const sectionAnswered = cur ? chosen.slice(first, last + 1).filter((c) => c !== null).length : 0;
  const sectionOf = (i: number) => sections?.find((s) => i >= s.from && i < s.from + s.count);

  const choose = (i: number) => {
    if (isRevealed) return;
    setChosen((c) => c.map((v, k) => (k === idx ? i : v)));
    if (mode === "practice") setRevealed((r) => r.map((v, k) => (k === idx ? true : v)));
  };

  const clock = (secs: number, warn: number) => (
    <span className={`chip text-sm ${secs < warn ? "bg-red-100 text-red-700" : "bg-brand-50 text-brand-700"}`}>
      <Timer className="h-3.5 w-3.5" /> <span className="font-mono tabular-nums">{formatTime(secs)}</span>
    </span>
  );

  if (exam) {
    const setMark = (on: boolean) => setMarked((m) => (m[idx] === on ? m : m.map((v, k) => (k === idx ? on : v))));
    const next = () => idx < last && goTo(idx + 1);
    const moreSections = !!cur && section < (sections?.length ?? 0) - 1;
    const submitExam = () => {
      if (moreSections) {
        if (confirm(`Submit ${cur!.name} and go to the next section?\n\n${sectionAnswered} of ${cur!.count} answered. You can’t come back to this section.\n\nTap Cancel to keep working on it.`)) nextSection();
        return;
      }
      const c = paletteCounts(questions.map((_, i) => paletteState(visited[i], chosen[i] !== null, marked[i])));
      const msg = `Submit the test?\n\nAnswered: ${c.answered + c["answered-marked"]}\nNot answered: ${c["not-answered"]}\nNot visited: ${c["not-visited"]}\nMarked for review: ${c.marked + c["answered-marked"]}\n\nYou can’t change answers after submitting. Tap Cancel to keep going.`;
      if (confirm(msg)) finish();
    };
    return (
      <ExamView
        title={share?.title || "Mock test"}
        candidate={candidate}
        questions={questions}
        idx={idx}
        chosen={chosen}
        marked={marked}
        visited={visited}
        lang={lang}
        langToggle={bilingual ? <LangToggle lang={lang} setLang={setLang} /> : undefined}
        sections={sections}
        sectional={!!cur}
        openSection={section}
        first={first}
        last={last}
        secondsLeft={cur && sectionLeft !== null ? sectionLeft : left}
        timerLabel={cur ? `${cur.name} · time left` : "Time left"}
        submitting={submitting}
        submitLabel={moreSections ? "Submit section" : "Submit"}
        error={submitError}
        onChoose={choose}
        onGoTo={goTo}
        onMarkNext={() => {
          setMark(true);
          next();
        }}
        onClear={() => setChosen((c) => c.map((v, k) => (k === idx ? null : v)))}
        onSaveNext={() => {
          setMark(false);
          next();
        }}
        onSubmit={submitExam}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* On timed tests the counter and clock stay in view while the question scrolls. */}
      <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm ${timed ? "sticky top-14 z-10 -mx-4 -mt-4 rounded-t-xl bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:-mt-5 sm:px-5 [@media(max-height:560px)]:static" : ""}`}>
        <span className="font-medium text-slate-600">
          Question {idx + 1} of {questions.length}
          {q.topicId && TOPIC_BY_ID.get(q.topicId) && <span className="ml-2 chip bg-slate-100 text-slate-600">{TOPIC_BY_ID.get(q.topicId)!.name}</span>}
          <span className="ml-2 inline-flex gap-1"><DifficultyChip difficulty={q.difficulty} /><SourceChip source={q.source} pyq={q.pyq} /></span>
        </span>
        {bilingual && <LangToggle lang={lang} setLang={setLang} />}
        {timed && (
          <span className="flex items-center gap-2">
            {cur && sectionLeft !== null && (
              <span className="text-xs text-slate-500">
                {cur.name}: {clock(sectionLeft, 60)}
              </span>
            )}
            {!cur && clock(left, 60)}
          </span>
        )}
      </div>
      {sections && !cur && sectionOf(idx) && <p className="text-xs font-medium text-slate-500">{sectionOf(idx)!.name}</p>}
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
      </div>

      {/* A div, not h3: a code block (pre) is not allowed inside a heading. */}
      <div role="heading" aria-level={3} className="text-lg font-semibold leading-snug whitespace-pre-line text-slate-900" lang={lang === "hi" && q.questionHi ? "hi" : undefined}><RichText text={text.question} /></div>
      <div className="grid gap-2">
        {text.options.map((opt, i) => {
          const picked = chosen[idx] === i;
          let cls = "border-slate-200 hover:border-brand-300 hover:bg-brand-50";
          if (isRevealed && i === q.answer) cls = "border-emerald-400 bg-emerald-50";
          else if (isRevealed && picked) cls = "border-red-300 bg-red-50";
          else if (picked) cls = "border-brand-500 bg-brand-50";
          return (
            <button key={i} data-quiz-option onClick={() => choose(i)} className={`flex min-h-12 touch-manipulation items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${cls}`}>
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{LETTERS[i]}</span>
              <span className="min-w-0 whitespace-pre-wrap break-words">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Practice: the learner's own note on this question, whenever it comes up. */}
      {mode === "practice" && <NoteBox question={q} />}

      {isRevealed && (
        <div className={`rounded-xl p-4 text-sm ${chosen[idx] === q.answer ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold">{chosen[idx] === q.answer ? "Correct!" : `Not quite. The answer is ${LETTERS[q.answer]}: ${text.options[q.answer]}.`}</p>
            <span className="flex shrink-0 gap-1">
              <ReportButton question={q} />
              <NoteButton question={q} />
              <BookmarkButton question={q} />
            </span>
          </div>
          <div className="mt-1 whitespace-pre-line"><RichText text={text.explanation} /></div>
          {q.timestamp !== undefined && onTimestamp && (
            <button className="mt-2 font-medium text-brand-700 underline" onClick={() => onTimestamp(q.timestamp!)}>
              <Play className="mr-1 inline h-3 w-3" />Watch this part ({formatTime(q.timestamp)})
            </button>
          )}
        </div>
      )}

      {/* Question palette: jump to any question. Mock: answered / marked for review; practice: right / wrong. */}
      <div className="space-y-2">
        {(sections && !cur ? sections : [{ name: cur?.name ?? "", from: first, count: last - first + 1, minutes: 0 }]).map((s) => (
          <div key={s.from} className="flex flex-wrap items-center gap-1.5">
            {sections && !cur && <span className="mr-1 w-full text-xs text-slate-500 sm:w-auto">{s.name}</span>}
            {Array.from({ length: s.count }, (_, k) => s.from + k).map((i) => {
              const state =
                mode === "practice"
                  ? revealed[i]
                    ? chosen[i] === questions[i].answer
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-600"
                  : marked[i]
                    ? chosen[i] !== null
                      ? "bg-violet-600 text-white"
                      : "bg-violet-100 text-violet-800 ring-1 ring-violet-400"
                    : chosen[i] !== null
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600";
              return (
                <button key={i} onClick={() => goTo(i)} aria-label={`Question ${i + 1}`} aria-current={i === idx ? "step" : undefined} className={`relative h-8 w-8 rounded-lg text-xs font-semibold pointer-coarse:h-10 pointer-coarse:w-10 ${state} ${i === idx ? "outline-2 outline-offset-2 outline-brand-500" : ""}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        ))}
        {mode === "mock" ? (
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-brand-600 align-middle" />Answered</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-slate-200 align-middle" />Not answered</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-violet-100 ring-1 ring-violet-400 align-middle" />Marked for review</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-violet-600 align-middle" />Answered &amp; marked</span>
          </p>
        ) : (
          <p className="text-[11px] text-slate-500">Tap a number to jump · keys 1–4 to answer · ← → to move</p>
        )}
      </div>

      {mode === "mock" && (
        <div className="flex flex-wrap gap-2">
          <button className={`btn-ghost ${marked[idx] ? "border-violet-400 text-violet-700" : ""}`} aria-pressed={marked[idx]} onClick={() => setMarked((m) => m.map((v, k) => (k === idx ? !v : v)))}>
            {marked[idx] ? "Marked ✓" : "Mark for review"}
          </button>
          {chosen[idx] !== null && (
            <button className="btn-ghost" onClick={() => setChosen((c) => c.map((v, k) => (k === idx ? null : v)))}>
              Clear answer
            </button>
          )}
        </div>
      )}

      {/* On phones Previous / Next stay pinned above the tab bar, so a long explanation never hides them. */}
      <div className="sticky bottom-[var(--bottom-nav-h,0px)] z-10 -mx-4 flex items-center justify-between gap-2 border-t border-slate-200 bg-surface/95 px-4 py-2.5 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-2 sm:pb-0 sm:backdrop-blur-none print:static">
        <button className="btn-ghost" disabled={idx === first} onClick={() => goTo(idx - 1)} aria-label="Previous question">
          ← <span className="hidden min-[400px]:inline">Previous</span>
        </button>
        <div className="flex min-w-0 gap-2">
          {idx < last ? (
            <button className={mode === "practice" && !isRevealed ? "btn-ghost" : "btn-primary"} onClick={() => goTo(idx + 1)}>
              {mode === "practice" && !isRevealed ? "Skip →" : mode === "mock" ? "Save & next →" : "Next →"}
            </button>
          ) : cur && section < (sections?.length ?? 0) - 1 ? (
            <button
              className="btn-primary"
              onClick={() => {
                if (confirm(`Submit ${cur.name} and go to the next section?\n\n${sectionAnswered} of ${cur.count} answered. You can’t come back to this section.\n\nTap Cancel to keep working on it.`)) nextSection();
              }}
            >
              Next section →
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={submitting}
              onClick={() => {
                const unanswered = questions.length - answeredCount;
                const flagged = marked.filter(Boolean).length;
                if (mode === "mock" && (unanswered || flagged) && !confirm(`Submit the test?\n\n${answeredCount} answered · ${unanswered} not answered · ${flagged} marked for review.\n\nYou can’t change answers after submitting. Tap Cancel to keep going.`)) return;
                if (mode === "practice" && unanswered && !confirm(`You skipped ${unanswered} question${unanswered === 1 ? "" : "s"}. Finish and see your results?\n\nTap Cancel to go back and answer ${unanswered === 1 ? "it" : "them"}.`)) return;
                finish();
              }}
            >
              {submitting ? "Submitting…" : mode === "mock" ? `Submit test (${answeredCount}/${questions.length} answered)` : "Finish & see results"}
            </button>
          )}
        </div>
      </div>
      {cur && (
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <AlertTriangle className="h-3.5 w-3.5" /> Sectional timing: {cur.name} closes when its {cur.minutes} minutes end, and unused time doesn’t carry over.
        </p>
      )}
      {submitError && <p className="text-right text-sm text-red-600">{submitError}</p>}
    </div>
  );
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const pctOf = (c: number, n: number) => (n ? Math.round((c / n) * 100) : 0);
const label = (p: number) => (p >= 70 ? { text: "Strong", cls: "bg-emerald-50 text-emerald-700" } : p >= 40 ? { text: "Average", cls: "bg-amber-50 text-amber-700" } : { text: "Weak", cls: "bg-red-50 text-red-700" });

interface ResultsProps {
  results: AnswerResult[];
  negativeMarking: number;
  marks?: number;
  sections?: QuizSection[];
  previous?: { score: number; total: number } | null;
  onTimestamp?: (s: number) => void;
  onRestart?: () => void;
  /** Words on the restart button: "Practise new questions" or "Take another test". */
  restartLabel?: string;
  attemptId?: string;
  share?: ShareInfo;
}

/** Score, time analysis, section and topic breakdown, and the answer review. Also used by /tests?id=…. */
export function Results({ results, negativeMarking, marks = 1, sections, previous, onTimestamp, onRestart, restartLabel = "Practise new questions", attemptId, share }: ResultsProps) {
  const [saved, setSaved] = useState<number | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  // Answer review filter: long mocks are easier to review one kind of answer at a time.
  const [show, setShow] = useState<"all" | "wrong" | "skipped" | "correct">("all");
  const [lang, setLang] = useLang();
  const bilingual = useMemo(() => hasHindi(results.map((r) => r.question)), [results]);
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
  const skipped = results.length - correct - wrong;
  const score = (correct - wrong * negativeMarking) * marks;
  const total = results.length * marks;
  const pct = pctOf(correct, correct + wrong);
  const timed = results.some((r) => r.seconds !== undefined);
  const secs = (f: (r: AnswerResult) => boolean) => sum(results.filter(f).map((r) => r.seconds ?? 0));
  const timeAll = secs(() => true);
  const slowest = [...results].filter((r) => (r.seconds ?? 0) > 0).sort((a, b) => (b.seconds ?? 0) - (a.seconds ?? 0)).slice(0, 3);
  // Generated Quant questions (ids ending in -g…) cannot be replayed, so they make no cards.
  const wrongBank = results.filter((r) => r.chosen !== null && !r.correct && !/-g[0-9a-z]+$/.test(r.question.id));
  const wrongIds = results.filter((r) => r.chosen !== null && !r.correct && r.question.topicId).map((r) => r.question.id);

  // Deeper mock analysis from the per-question seconds (timed tests only).
  const items: AnalysisItem[] = results.map((r) => ({ chosen: r.chosen, correct: r.correct, seconds: r.seconds, difficulty: r.question.difficulty }));
  const strategy = timed && timeAll > 0 ? attemptStrategy(items) : null;
  const guesses = timed && negativeMarking > 0 ? guessCost(items, negativeMarking, marks) : null;
  const secTimes = timed && sections && sections.length > 1 ? sectionTimes(items, sections, negativeMarking, marks) : null;
  // Jump from a question number in the analysis to its answer in the review.
  const jump = (i: number) => {
    setShow("all");
    requestAnimationFrame(() => document.getElementById(`review-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const qChips = (ids: number[]) => (
    <span className="mt-1.5 flex flex-wrap gap-1">
      {ids.slice(0, 20).map((i) => (
        <button key={i} type="button" onClick={() => jump(i)} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
          Q{i + 1}
          {results[i].seconds ? <span className="text-slate-500"> · {results[i].seconds}s</span> : null}
        </button>
      ))}
      {ids.length > 20 && <span className="text-xs text-slate-500">+{ids.length - 20} more</span>}
    </span>
  );

  const byTopic = new Map<string, { c: number; n: number; s: number }>();
  const byTier = new Map<Difficulty, { c: number; n: number }>();
  for (const r of results) {
    if (r.question.difficulty) {
      const d = byTier.get(r.question.difficulty) ?? { c: 0, n: 0 };
      d.n++;
      if (r.correct) d.c++;
      byTier.set(r.question.difficulty, d);
    }
    if (!r.question.topicId) continue;
    const t = byTopic.get(r.question.topicId) ?? { c: 0, n: 0, s: 0 };
    t.n++;
    t.s += r.seconds ?? 0;
    if (r.correct) t.c++;
    byTopic.set(r.question.topicId, t);
  }
  // The five weakest topics with at least two questions, worst first.
  const weak = [...byTopic]
    .filter(([, t]) => t.n >= 2 && pctOf(t.c, t.n) < 40)
    .sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n || b[1].n - a[1].n)
    .slice(0, 5)
    .map(([id]) => TOPIC_BY_ID.get(id)?.name ?? id);
  // Topics below 50% in this set, for a one-tap practice set on them.
  const weakIds = [...byTopic].filter(([id, t]) => TOPIC_BY_ID.has(id) && pctOf(t.c, t.n) < 50).map(([id]) => id).slice(0, 8);

  // A card with nothing attempted has nothing to show off, so the share button needs one answer.
  const shareCard = correct + wrong > 0 && (
    <ScoreCardButton
      summary={{
        title: share?.title || "Practice set",
        examId: share?.examId,
        score: +score.toFixed(2),
        total,
        scoreLabel: marks > 1 || negativeMarking > 0 ? "Marks" : "Score",
        correct,
        wrong,
        skipped,
        accuracy: pct,
        rank: standing,
      }}
    />
  );

  const saveMistakes = () => {
    setSaved(addCards(cardsForQuestions(wrongBank.map((r) => r.question))));
  };

  // One clear verdict and one next step lead the screen; the detailed analysis sits below, folded.
  const attempted = correct + wrong;
  const overall = pctOf(correct, results.length);
  const verdict =
    attempted === 0
      ? { title: "You didn’t answer any questions", text: "No problem. Look through the answers below, then try a fresh set." }
      : overall >= 70
        ? { title: "Great work!", text: `You got ${correct} of ${results.length} right.` }
        : overall >= 40
          ? { title: "Good effort", text: `You got ${correct} of ${results.length} right. A little more practice on your weak topics will lift this fast.` }
          : { title: "Keep going: this is how you learn", text: `You got ${correct} of ${results.length} right. Read the explanations below, then practise the topics you missed.` };
  const weakHref = `/practice?topics=${weakIds.join(",")}${share?.examId ? `&exam=${encodeURIComponent(share.examId)}` : ""}`;
  const weakLabel = weakIds.length === 1 ? `Practise ${TOPIC_BY_ID.get(weakIds[0])?.name ?? "this topic"} again` : `Practise your ${weakIds.length} weakest topics`;
  const next: { label: string; href?: string; onClick?: () => void; why: string } | null =
    weakIds.length > 0
      ? { label: weakLabel, href: weakHref, why: "A short set on the topics where you scored under 50%." }
      : onRestart
        ? { label: restartLabel, onClick: onRestart, why: overall >= 70 ? "You’re doing well. Keep the streak going with a new set." : "A new set of questions to keep improving." }
        : { label: "See my progress", href: "/progress", why: "Your scores and weak topics over time." };
  const toReview = () => document.getElementById("review-answers")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-5">
      <section aria-labelledby="result-heading" className="space-y-4">
        <div>
          <p className="eyebrow">Your result</p>
          <h3 id="result-heading" className="mt-1 text-xl font-semibold text-slate-900">
            {verdict.title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">{verdict.text}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={marks > 1 ? "Marks" : "Score"} value={`${+score.toFixed(2)} / ${total}`} tone="brand" />
          <Stat label="Correct" value={correct} tone="green" />
          <Stat label="Wrong" value={wrong} tone="red" />
          <Stat label="Skipped" value={skipped} tone="slate" />
        </div>
        {next && (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
            <p className="text-sm font-semibold text-brand-900">Your next step</p>
            <p className="mt-0.5 text-sm text-brand-900/80">{next.why}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {next.href ? (
                <Link href={next.href} className="btn-primary w-full py-2.5 sm:w-auto">
                  {next.label} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button type="button" onClick={next.onClick} className="btn-primary w-full py-2.5 sm:w-auto">
                  {next.label} <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={toReview} className="btn-ghost w-full py-2.5 sm:w-auto">
                Review answers
              </button>
            </div>
          </div>
        )}
      </section>
      {attemptId && <StandingCard attemptId={attemptId} onLoad={setStanding} />}
      <p className="text-sm text-slate-600">
        Accuracy <b>{pct}%</b> of attempted
        {negativeMarking > 0 && <> · Negative marking: −{+(negativeMarking * marks).toFixed(2)} mark{negativeMarking * marks === 1 ? "" : "s"} per wrong answer</>}
        {previous && previous.total > 0 && (
          <>
            {" "}· vs your last test:{" "}
            <b className={score - previous.score >= 0 ? "text-emerald-700" : "text-red-600"}>
              {score - previous.score >= 0 ? "+" : ""}
              {+(score - previous.score).toFixed(2)}
            </b>{" "}
            ({+previous.score.toFixed(2)} / {previous.total})
          </>
        )}
      </p>
      {(timed && timeAll > 0) || strategy || (sections && sections.length > 1) || byTier.size > 1 || byTopic.size > 1 ? (
        <h4 className="pt-1 font-semibold text-slate-900">
          Detailed analysis <span className="text-sm font-normal text-slate-500">· tap a heading to open it</span>
        </h4>
      ) : null}

      {timed && timeAll > 0 && (
        <Fold title="Time analysis" hint={`${formatTime(timeAll)} in all`}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Total time" value={formatTime(timeAll)} tone="slate" />
            <Stat label="On correct" value={formatTime(secs((r) => r.correct))} tone="green" />
            <Stat label="On wrong" value={formatTime(secs((r) => r.chosen !== null && !r.correct))} tone="red" />
            <Stat label="On skipped" value={formatTime(secs((r) => r.chosen === null))} tone="slate" />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Average <b>{Math.round(timeAll / results.length)}s</b> per question
            {wrong > 0 && <> · {Math.round((secs((r) => r.chosen !== null && !r.correct) / timeAll) * 100)}% of your time went to wrong answers</>}
            {slowest.length > 0 && (
              <>
                {" "}· Slowest: {slowest.map((r) => `Q${results.indexOf(r) + 1} (${r.seconds}s${r.correct ? "" : ", wrong"})`).join(", ")}
              </>
            )}
          </p>
        </Fold>
      )}

      {strategy && (
        <Fold title="Attempt strategy" hint="what to skip next time">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-sm">
              <p className="font-medium text-red-700">Should have skipped · {strategy.shouldSkip.length}</p>
              <p className="text-xs text-slate-500">
                Over 2× your average ({Math.round(strategy.avg)}s) and still wrong{strategy.shouldSkip.length > 0 && <>: {formatTime(Math.round(strategy.wastedSeconds))} spent for no marks</>}.
              </p>
              {strategy.shouldSkip.length > 0 ? qChips(strategy.shouldSkip) : <p className="mt-1.5 text-xs text-emerald-700">None. You let go of the hard ones in time.</p>}
            </div>
            <div className="text-sm">
              <p className="font-medium text-amber-700">Missed easy marks · {strategy.missedEasy.length}</p>
              <p className="text-xs text-slate-500">Easy or moderate questions you left blank.</p>
              {strategy.missedEasy.length > 0 ? qChips(strategy.missedEasy) : <p className="mt-1.5 text-xs text-emerald-700">None skipped.</p>}
            </div>
          </div>
          {guesses && (
            <p className={`mt-4 rounded-lg p-3 text-sm ${guesses.fastWrong.length ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700"}`}>
              {guesses.fastWrong.length ? (
                <>
                  <b>If you had skipped the wrong guesses:</b> {guesses.fastWrong.length} wrong answer{guesses.fastWrong.length === 1 ? " was" : "s were"} given in under 15 s and cost{guesses.fastWrong.length === 1 ? "s" : ""} you {guesses.cost} mark{guesses.cost === 1 ? "" : "s"} of negative marking. Your score would be <b>{guesses.scoreWithout}</b> instead of {guesses.score}.
                </>
              ) : (
                <>No quick wrong guesses: none of your wrong answers took under 15 s.</>
              )}
            </p>
          )}
        </Fold>
      )}

      {sections && sections.length > 1 && (
        <Fold title={secTimes ? "Section-wise: time vs marks" : "Section-wise"}>
          {/* Four columns do not fit a phone: the table scrolls sideways inside the card. */}
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
            <table className="min-w-[28rem]">
            <thead>
              <tr>
                <th className="pb-2 font-medium">Section</th>
                <th className="pb-2 font-medium">{marks > 1 ? "Marks" : "Score"}</th>
                <th className="pb-2 font-medium">Correct / Wrong / Skipped</th>
                {timed && <th className="pb-2 font-medium">Time</th>}
                {secTimes && <th className="pb-2 font-medium">Marks/min</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.map((s, k) => {
                const rs = results.slice(s.from, s.from + s.count);
                const c = rs.filter((r) => r.correct).length;
                const w = rs.filter((r) => r.chosen !== null && !r.correct).length;
                return (
                  <tr key={s.from}>
                    <td className="py-2 font-medium text-slate-800">{s.name}</td>
                    <td className="py-2">
                      {+((c - w * negativeMarking) * marks).toFixed(2)} / {rs.length * marks}
                    </td>
                    <td className="py-2 text-slate-600">
                      {c} / {w} / {rs.length - c - w}
                    </td>
                    {timed && <td className="py-2 text-slate-600">{formatTime(sum(rs.map((r) => r.seconds ?? 0)))}</td>}
                    {secTimes && <td className="py-2 text-slate-600 tabular-nums">{secTimes.rows[k].seconds > 0 ? secTimes.rows[k].perMin : "–"}</td>}
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
          {secTimes?.suggestion && <p className="mt-3 text-sm text-slate-700">{secTimes.suggestion}</p>}
        </Fold>
      )}

      {byTier.size > 1 && (
        <Fold title="By difficulty">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DIFFICULTIES.filter((d) => byTier.has(d)).map((d) => {
              const t = byTier.get(d)!;
              return (
                <div key={d} className={`rounded-xl p-3 text-sm ${DIFFICULTY_TONE[d]}`}>
                  <div className="text-xs font-medium opacity-80">{DIFFICULTY_LABEL[d]}</div>
                  <div className="text-lg font-semibold">
                    {t.c}/{t.n}
                  </div>
                </div>
              );
            })}
          </div>
        </Fold>
      )}

      {byTopic.size > 1 && (
        <Fold title="Topic-wise performance" hint={weak.length ? `${weak.length} weak` : undefined}>
          {weak.length > 0 && <p className="mb-3 text-sm text-red-700">Focus next on: {weak.join(", ")}.</p>}
          <div className="space-y-2">
            {[...byTopic].sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).map(([id, t]) => {
              const p = pctOf(t.c, t.n);
              const l = label(p);
              return (
                <div key={id} className="flex items-center gap-3 text-sm">
                  <span className="w-44 shrink-0 truncate sm:w-56">{TOPIC_BY_ID.get(id)?.name ?? id}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${p >= 70 ? "bg-emerald-500" : p >= 40 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-600">
                    {t.c}/{t.n}
                  </span>
                  <span className={`chip hidden sm:inline-flex ${l.cls}`}>{l.text}</span>
                  {timed && t.s > 0 && <span className="hidden w-12 text-right text-xs text-slate-500 sm:inline">{Math.round(t.s / t.n)}s/q</span>}
                </div>
              );
            })}
          </div>
        </Fold>
      )}

      <MistakePatternCard questionIds={wrongIds} />

      <div id="review-answers" className="scroll-mt-20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="flex items-center gap-2 font-semibold">Review answers {bilingual && <LangToggle lang={lang} setLang={setLang} />}</h4>
          <div className="flex gap-1 text-xs" role="group" aria-label="Show answers">
            {(
              [
                ["all", `All ${results.length}`],
                ["wrong", `Wrong ${wrong}`],
                ["skipped", `Skipped ${skipped}`],
                ["correct", `Correct ${correct}`],
              ] as const
            ).map(([k, label]) => (
              <button key={k} onClick={() => setShow(k)} aria-pressed={show === k} className={`rounded-md px-2 py-1 ${show === k ? "bg-ink text-on-ink" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {label}
              </button>
            ))}
          </div>
          {wrongBank.length > 0 && (
            <button className="btn-ghost text-xs" onClick={saveMistakes} disabled={saved !== null}>
              <BookmarkPlus className="h-3.5 w-3.5" /> {saved === null ? `Add ${wrongBank.length} wrong answer${wrongBank.length === 1 ? "" : "s"} to flashcards` : saved ? `${saved} added to flashcards` : "Already in your flashcards"}
            </button>
          )}
        </div>
        {results.map((r, i) => {
          if (show === "wrong" && !(r.chosen !== null && !r.correct)) return null;
          if (show === "skipped" && r.chosen !== null) return null;
          if (show === "correct" && !r.correct) return null;
          const t = inLang(r.question, lang);
          return (
          <div key={r.question.id} id={`review-${i}`} className={`scroll-mt-20 rounded-xl border p-4 text-sm ${r.correct ? "border-emerald-200 bg-emerald-50/40" : r.chosen === null ? "border-slate-200 bg-surface" : "border-red-200 bg-red-50/40"}`}>
            <div className="font-medium whitespace-pre-line text-slate-900">
              {i + 1}. <RichText text={t.question} /> <DifficultyChip difficulty={r.question.difficulty} /> <SourceChip source={r.question.source} pyq={r.question.pyq} /> <BookmarkButton question={r.question} /> <NoteButton question={r.question} /> <ReportButton question={r.question} />
            </div>
            <p className="mt-1">
              Your answer: <b>{r.chosen === null ? "Skipped" : t.options[r.chosen]}</b>
              {!r.correct && (
                <>
                  {" "}· Correct: <b className="text-emerald-700">{t.options[r.question.answer]}</b>
                </>
              )}
              {r.seconds !== undefined && <span className="text-slate-500"> · {r.seconds}s</span>}
            </p>
            <div className="mt-1 whitespace-pre-line text-slate-600"><RichText text={t.explanation} /></div>
            {r.question.timestamp !== undefined && onTimestamp && (
              <button className="mt-1 font-medium text-brand-700 underline" onClick={() => onTimestamp(r.question.timestamp!)}>
                <Play className="mr-1 inline h-3 w-3" />{formatTime(r.question.timestamp)}
              </button>
            )}
            {r.chosen !== null && !r.correct && <MistakeTagPicker question={r.question} />}
            <NoteBox question={r.question} className="mt-2" />
          </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {weakIds.length > 0 && (
          <Link href={weakHref} className="btn-primary">
            {weakLabel}
          </Link>
        )}
        {onRestart && (
          <button className={weakIds.length ? "btn-ghost" : "btn-primary"} onClick={onRestart}>
            {restartLabel}
          </button>
        )}
        {wrong > 0 && (
          <Link href="/mistakes" className="btn-ghost">
            Open my mistake notebook
          </Link>
        )}
        <Link href="/progress" className="btn-ghost">
          My progress
        </Link>
        {shareCard}
      </div>
    </div>
  );
}

/** A folded section of the detailed analysis: the heading is the tap target. */
function Fold({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <details className="group card">
      <summary className="-my-1 flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {hint && <span className="ml-2 text-sm font-normal text-slate-500">{hint}</span>}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

const TONES = { brand: "bg-brand-50 text-brand-700", green: "bg-emerald-50 text-emerald-700", red: "bg-red-50 text-red-700", slate: "bg-slate-100 text-slate-700" };

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone: keyof typeof TONES }) {
  return (
    <div className={`rounded-xl p-3 ${TONES[tone]}`}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
