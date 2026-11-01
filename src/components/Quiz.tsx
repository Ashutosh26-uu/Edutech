"use client";

import { Play, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TOPIC_BY_ID } from "@/data/topics";
import type { MCQ } from "@/lib/types";
import { formatTime } from "@/lib/youtube";

export interface AnswerResult {
  question: MCQ;
  chosen: number | null;
  correct: boolean;
}

interface Props {
  questions: MCQ[];
  /** practice: instant feedback after each answer. mock: timed, answers revealed after submitting. */
  mode: "practice" | "mock";
  negativeMarking?: number;
  timeLimitSec?: number;
  onFinish?: (results: AnswerResult[]) => void;
  onTimestamp?: (secs: number) => void;
  onRestart?: () => void;
  /**
   * Server-scored tests: questions arrive without answers, and this sends the chosen options to
   * the server and resolves with the full questions (with answers) for the review.
   */
  submit?: (chosen: (number | null)[]) => Promise<MCQ[]>;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function Quiz({ questions, mode, negativeMarking = 0, timeLimitSec, onFinish, onTimestamp, onRestart, submit }: Props) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() => questions.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(timeLimitSec ?? 0);
  const [scored, setScored] = useState<MCQ[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const results: AnswerResult[] = useMemo(
    () => (scored ?? questions).map((q, i) => ({ question: q, chosen: chosen[i], correct: chosen[i] === q.answer })),
    [questions, scored, chosen],
  );

  const finish = async () => {
    if (done || submitting) return;
    if (submit) {
      setSubmitting(true);
      setSubmitError("");
      try {
        const full = await submit(chosen);
        setScored(full);
        setDone(true);
        onFinish?.(full.map((q, i) => ({ question: q, chosen: chosen[i], correct: chosen[i] === q.answer })));
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

  useEffect(() => {
    if (mode !== "mock" || !timeLimitSec || done) return;
    if (left <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, done, mode, timeLimitSec]);

  if (!questions.length) return <p className="text-sm text-slate-500">No questions available.</p>;

  if (done) return <Results results={results} negativeMarking={negativeMarking} onTimestamp={onTimestamp} onRestart={onRestart} />;

  const q = questions[idx];
  const isRevealed = mode === "practice" && revealed[idx];
  const answeredCount = chosen.filter((c) => c !== null).length;

  const choose = (i: number) => {
    if (isRevealed) return;
    setChosen((c) => c.map((v, k) => (k === idx ? i : v)));
    if (mode === "practice") setRevealed((r) => r.map((v, k) => (k === idx ? true : v)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-600">
          Question {idx + 1} of {questions.length}
          {q.topicId && TOPIC_BY_ID.get(q.topicId) && <span className="ml-2 chip bg-slate-100 text-slate-600">{TOPIC_BY_ID.get(q.topicId)!.name}</span>}
        </span>
        {mode === "mock" && timeLimitSec ? (
          <span className={`chip text-sm ${left < 60 ? "bg-red-100 text-red-700" : "bg-brand-50 text-brand-700"}`}><Timer className="h-3.5 w-3.5" /> <span className="font-mono tabular-nums">{formatTime(left)}</span></span>
        ) : null}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
      </div>

      <h3 className="text-lg font-semibold leading-snug text-slate-900">{q.question}</h3>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
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
          <p className="font-semibold">{chosen[idx] === q.answer ? "Correct!" : `Not quite. The answer is ${LETTERS[q.answer]}: ${q.options[q.answer]}.`}</p>
          <p className="mt-1">{q.explanation}</p>
          {q.timestamp !== undefined && onTimestamp && (
            <button className="mt-2 font-medium text-brand-700 underline" onClick={() => onTimestamp(q.timestamp!)}>
              <Play className="mr-1 inline h-3 w-3" />Watch this part ({formatTime(q.timestamp)})
            </button>
          )}
        </div>
      )}

      {mode === "mock" && (
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold ${i === idx ? "ring-2 ring-brand-500" : ""} ${chosen[i] !== null ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button className="btn-ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          ← Previous
        </button>
        <div className="flex gap-2">
          {mode === "mock" && chosen[idx] !== null && (
            <button className="btn-ghost" onClick={() => setChosen((c) => c.map((v, k) => (k === idx ? null : v)))}>
              Clear
            </button>
          )}
          {idx < questions.length - 1 ? (
            <button className="btn-primary" disabled={mode === "practice" && !isRevealed} onClick={() => setIdx(idx + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" disabled={(mode === "practice" && !isRevealed) || submitting} onClick={finish}>
              {submitting ? "Submitting…" : mode === "mock" ? `Submit test (${answeredCount}/${questions.length} answered)` : "See results"}
            </button>
          )}
        </div>
      </div>
      {submitError && <p className="text-right text-sm text-red-600">{submitError}</p>}
    </div>
  );
}

function Results({ results, negativeMarking, onTimestamp, onRestart }: { results: AnswerResult[]; negativeMarking: number; onTimestamp?: (s: number) => void; onRestart?: () => void }) {
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => r.chosen !== null && !r.correct).length;
  const skipped = results.length - correct - wrong;
  const score = correct - wrong * negativeMarking;
  const pct = Math.round((correct / results.length) * 100);

  const byTopic = new Map<string, { c: number; n: number }>();
  for (const r of results) {
    if (!r.question.topicId) continue;
    const t = byTopic.get(r.question.topicId) ?? { c: 0, n: 0 };
    t.n++;
    if (r.correct) t.c++;
    byTopic.set(r.question.topicId, t);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Score" value={`${+score.toFixed(2)} / ${results.length}`} tone="brand" />
        <Stat label="Correct" value={correct} tone="green" />
        <Stat label="Wrong" value={wrong} tone="red" />
        <Stat label="Skipped" value={skipped} tone="slate" />
      </div>
      <p className="text-sm text-slate-600">
        Accuracy <b>{pct}%</b>
        {negativeMarking > 0 && <> · Negative marking: −{+negativeMarking.toFixed(2)} per wrong answer</>}
      </p>

      {byTopic.size > 1 && (
        <div className="card">
          <h4 className="mb-3 font-semibold">Topic-wise performance</h4>
          <div className="space-y-2">
            {[...byTopic].sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).map(([id, t]) => {
              const p = Math.round((t.c / t.n) * 100);
              return (
                <div key={id} className="flex items-center gap-3 text-sm">
                  <span className="w-56 shrink-0 truncate">{TOPIC_BY_ID.get(id)?.name ?? id}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${p >= 70 ? "bg-emerald-500" : p >= 40 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-16 text-right text-slate-600">{t.c}/{t.n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold">Review answers</h4>
        {results.map((r, i) => (
          <div key={r.question.id} className={`rounded-xl border p-4 text-sm ${r.correct ? "border-emerald-200 bg-emerald-50/40" : r.chosen === null ? "border-slate-200 bg-surface" : "border-red-200 bg-red-50/40"}`}>
            <p className="font-medium text-slate-900">
              {i + 1}. {r.question.question}
            </p>
            <p className="mt-1">
              Your answer: <b>{r.chosen === null ? "Skipped" : r.question.options[r.chosen]}</b>
              {!r.correct && (
                <>
                  {" "}· Correct: <b className="text-emerald-700">{r.question.options[r.question.answer]}</b>
                </>
              )}
            </p>
            <p className="mt-1 text-slate-600">{r.question.explanation}</p>
            {r.question.timestamp !== undefined && onTimestamp && (
              <button className="mt-1 font-medium text-brand-700 underline" onClick={() => onTimestamp(r.question.timestamp!)}>
                <Play className="mr-1 inline h-3 w-3" />{formatTime(r.question.timestamp)}
              </button>
            )}
          </div>
        ))}
      </div>
      {onRestart && (
        <button className="btn-primary" onClick={onRestart}>
          Try new questions
        </button>
      )}
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
