"use client";

import { AlertTriangle, BookmarkPlus, Languages, Play, Star, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOPIC_BY_ID } from "@/data/topics";
import { cardsForQuestions } from "@/lib/cards";
import { DIFFICULTIES, DIFFICULTY_LABEL } from "@/lib/difficulty";
import { hasHindi, inLang, useLang, type Lang } from "@/lib/lang";
import { addCards, toggleBookmark } from "@/lib/storage";
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
  /**
   * Server-scored tests: questions arrive without answers, and this sends the chosen options and
   * per-question seconds to the server and resolves with the full questions (with answers).
   */
  submit?: (chosen: (number | null)[], times: number[]) => Promise<MCQ[]>;
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
      className={`chip ${on ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600 hover:bg-amber-50"}`}
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
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-md px-2 py-0.5 font-medium ${lang === l ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
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

export function Quiz({ questions, mode, negativeMarking = 0, marks = 1, timeLimitSec, sections, sectional = false, previous, onFinish, onTimestamp, onRestart, submit }: Props) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() => questions.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
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
  const cur = sectional && sections ? sections[section] : null;
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
  };

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

  if (!questions.length) return <p className="text-sm text-slate-500">No questions available.</p>;

  if (done) return <Results results={results} negativeMarking={negativeMarking} marks={marks} sections={sections} previous={previous} onTimestamp={onTimestamp} onRestart={onRestart} />;

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
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

      <h3 className="text-lg font-semibold leading-snug text-slate-900" lang={lang === "hi" && q.questionHi ? "hi" : undefined}>{text.question}</h3>
      <div className="grid gap-2">
        {text.options.map((opt, i) => {
          const picked = chosen[idx] === i;
          let cls = "border-slate-200 hover:border-brand-300 hover:bg-brand-50";
          if (isRevealed && i === q.answer) cls = "border-emerald-400 bg-emerald-50";
          else if (isRevealed && picked) cls = "border-red-300 bg-red-50";
          else if (picked) cls = "border-brand-500 bg-brand-50";
          return (
            <button key={i} onClick={() => choose(i)} className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${cls}`}>
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {isRevealed && (
        <div className={`rounded-xl p-4 text-sm ${chosen[idx] === q.answer ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold">{chosen[idx] === q.answer ? "Correct!" : `Not quite. The answer is ${LETTERS[q.answer]}: ${text.options[q.answer]}.`}</p>
            <BookmarkButton question={q} />
          </div>
          <p className="mt-1">{text.explanation}</p>
          {q.timestamp !== undefined && onTimestamp && (
            <button className="mt-2 font-medium text-brand-700 underline" onClick={() => onTimestamp(q.timestamp!)}>
              <Play className="mr-1 inline h-3 w-3" />Watch this part ({formatTime(q.timestamp)})
            </button>
          )}
        </div>
      )}

      {mode === "mock" && (
        <div className="space-y-2">
          {(sections && !cur ? sections : [{ name: cur?.name ?? "", from: first, count: last - first + 1, minutes: 0 }]).map((s) => (
            <div key={s.from} className="flex flex-wrap items-center gap-1.5">
              {sections && !cur && <span className="mr-1 w-full text-xs text-slate-500 sm:w-auto">{s.name}</span>}
              {Array.from({ length: s.count }, (_, k) => s.from + k).map((i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold ${i === idx ? "ring-2 ring-brand-500" : ""} ${chosen[i] !== null ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button className="btn-ghost" disabled={idx === first} onClick={() => goTo(idx - 1)}>
          ← Previous
        </button>
        <div className="flex gap-2">
          {mode === "mock" && chosen[idx] !== null && (
            <button className="btn-ghost" onClick={() => setChosen((c) => c.map((v, k) => (k === idx ? null : v)))}>
              Clear
            </button>
          )}
          {idx < last ? (
            <button className="btn-primary" disabled={mode === "practice" && !isRevealed} onClick={() => goTo(idx + 1)}>
              Next →
            </button>
          ) : cur && section < (sections?.length ?? 0) - 1 ? (
            <button
              className="btn-primary"
              onClick={() => {
                if (confirm(`Close ${cur.name}? You can’t come back to it. ${sectionAnswered}/${cur.count} answered.`)) nextSection();
              }}
            >
              Next section →
            </button>
          ) : (
            <button className="btn-primary" disabled={(mode === "practice" && !isRevealed) || submitting} onClick={finish}>
              {submitting ? "Submitting…" : mode === "mock" ? `Submit test (${answeredCount}/${questions.length} answered)` : "See results"}
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
}

/** Score, time analysis, section and topic breakdown, and the answer review. Also used by /tests?id=…. */
export function Results({ results, negativeMarking, marks = 1, sections, previous, onTimestamp, onRestart }: ResultsProps) {
  const [saved, setSaved] = useState<number | null>(null);
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

  const saveMistakes = () => {
    setSaved(addCards(cardsForQuestions(wrongBank.map((r) => r.question))));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={marks > 1 ? "Marks" : "Score"} value={`${+score.toFixed(2)} / ${total}`} tone="brand" />
        <Stat label="Correct" value={correct} tone="green" />
        <Stat label="Wrong" value={wrong} tone="red" />
        <Stat label="Skipped" value={skipped} tone="slate" />
      </div>
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

      {timed && timeAll > 0 && (
        <div className="card">
          <h4 className="mb-3 font-semibold">Time analysis</h4>
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
        </div>
      )}

      {sections && sections.length > 1 && (
        <div className="card">
          <h4 className="mb-3 font-semibold">Section-wise</h4>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="pb-2 font-medium">Section</th>
                <th className="pb-2 font-medium">{marks > 1 ? "Marks" : "Score"}</th>
                <th className="pb-2 font-medium">Correct / Wrong / Skipped</th>
                {timed && <th className="pb-2 font-medium">Time</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.map((s) => {
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {byTier.size > 1 && (
        <div className="card">
          <h4 className="mb-3 font-semibold">By difficulty</h4>
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
        </div>
      )}

      {byTopic.size > 1 && (
        <div className="card">
          <h4 className="mb-1 font-semibold">Topic-wise performance</h4>
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
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="flex items-center gap-2 font-semibold">Review answers {bilingual && <LangToggle lang={lang} setLang={setLang} />}</h4>
          {wrongBank.length > 0 && (
            <button className="btn-ghost text-xs" onClick={saveMistakes} disabled={saved !== null}>
              <BookmarkPlus className="h-3.5 w-3.5" /> {saved === null ? `Add ${wrongBank.length} wrong answer${wrongBank.length === 1 ? "" : "s"} to flashcards` : saved ? `${saved} added to flashcards` : "Already in your flashcards"}
            </button>
          )}
        </div>
        {results.map((r, i) => {
          const t = inLang(r.question, lang);
          return (
          <div key={r.question.id} className={`rounded-xl border p-4 text-sm ${r.correct ? "border-emerald-200 bg-emerald-50/40" : r.chosen === null ? "border-slate-200 bg-surface" : "border-red-200 bg-red-50/40"}`}>
            <p className="font-medium text-slate-900">
              {i + 1}. {t.question} <DifficultyChip difficulty={r.question.difficulty} /> <SourceChip source={r.question.source} pyq={r.question.pyq} /> <BookmarkButton question={r.question} />
            </p>
            <p className="mt-1">
              Your answer: <b>{r.chosen === null ? "Skipped" : t.options[r.chosen]}</b>
              {!r.correct && (
                <>
                  {" "}· Correct: <b className="text-emerald-700">{t.options[r.question.answer]}</b>
                </>
              )}
              {r.seconds !== undefined && <span className="text-slate-500"> · {r.seconds}s</span>}
            </p>
            <p className="mt-1 text-slate-600">{t.explanation}</p>
            {r.question.timestamp !== undefined && onTimestamp && (
              <button className="mt-1 font-medium text-brand-700 underline" onClick={() => onTimestamp(r.question.timestamp!)}>
                <Play className="mr-1 inline h-3 w-3" />{formatTime(r.question.timestamp)}
              </button>
            )}
          </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {onRestart && (
          <button className="btn-primary" onClick={onRestart}>
            Try new questions
          </button>
        )}
        {wrong > 0 && (
          <Link href="/mistakes" className="btn-ghost">
            Open my mistake notebook
          </Link>
        )}
      </div>
    </div>
  );
}

const TONES = { brand: "bg-brand-50 text-brand-700", green: "bg-emerald-50 text-emerald-700", red: "bg-red-50 text-red-700", slate: "bg-slate-100 text-slate-700" };

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone: keyof typeof TONES }) {
  return (
    <div className={`rounded-xl p-3 ${TONES[tone]}`}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
