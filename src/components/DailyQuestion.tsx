"use client";

import { Check, ChevronDown, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { RichText } from "@/components/RichText";
import { TOPIC_BY_ID } from "@/data/topics";
import { findQuestions } from "@/lib/bank";
import { questionOfTheDay } from "@/lib/daily";
import { recordDailyAnswer, type DailyAnswer, type Store } from "@/lib/storage";
import { addDays, istDayKey } from "@/lib/streak";
import type { MCQ } from "@/lib/types";

const LETTERS = "ABCDEFGH";
const SHARE_TEXT = "Today's question on StudyClip — can you solve it?";

/** The question a day's card shows: the one answered that day if any (the exam may have changed since), else the day's pick. */
async function questionFor(date: string, examId: string | undefined, answeredId: string | undefined): Promise<MCQ | null> {
  if (answeredId) {
    const hit = (await findQuestions([answeredId])).get(answeredId);
    if (hit) return hit;
  }
  return questionOfTheDay(date, examId);
}

export function DailyQuestion({ store }: { store: Store }) {
  // Fixed for the life of the page so the card does not swap questions at midnight mid-answer.
  const [date] = useState(() => istDayKey());
  const yesterday = addDays(date, -1);
  const answer = store.dailyQuestions?.[date];
  const pastAnswer = store.dailyQuestions?.[yesterday];
  const [q, setQ] = useState<MCQ | null | undefined>(undefined);
  const [yq, setYq] = useState<MCQ | null | undefined>(undefined);
  const [shared, setShared] = useState(false);

  const answeredId = answer?.questionId;
  const pastId = pastAnswer?.questionId;
  useEffect(() => {
    let alive = true;
    questionFor(date, store.examId, answeredId).then((x) => alive && setQ(x));
    return () => {
      alive = false;
    };
  }, [date, store.examId, answeredId]);
  useEffect(() => {
    let alive = true;
    questionFor(yesterday, store.examId, pastId).then((x) => alive && setYq(x));
    return () => {
      alive = false;
    };
  }, [yesterday, store.examId, pastId]);

  const share = async () => {
    const link = new URL("/today", location.origin).toString();
    if (navigator.share) {
      await navigator.share({ title: "StudyClip question of the day", text: `${SHARE_TEXT} ${link}` }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${link}`)}`, "_blank", "noopener");
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <section className="card space-y-4" aria-labelledby="qotd-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="eyebrow flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Question of the day
          </div>
          <h2 id="qotd-title" className="mt-0.5 font-semibold text-slate-900">
            One hard question, the same for everyone today
          </h2>
        </div>
      </div>

      {q === undefined ? (
        <div className="space-y-2" aria-hidden>
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-11" />
          <div className="skeleton h-11" />
        </div>
      ) : q === null ? (
        <p className="text-sm text-slate-600">No question today. Check back tomorrow.</p>
      ) : (
        <QuestionBody q={q} answer={answer} onChoose={(i) => recordDailyAnswer(date, q, i)} />
      )}

      {q && (
        <div className="flex flex-wrap items-center gap-2">
          <button className={answer ? "btn-primary" : "btn-ghost"} onClick={share}>
            {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} Share
          </button>
          <span className="text-xs text-slate-500">{answer ? "Challenge a friend to solve it too." : "Answer once: your first pick counts."}</span>
        </div>
      )}

      {yq && (
        <details className="group rounded-xl border border-slate-200 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 font-medium text-slate-700 [&::-webkit-details-marker]:hidden">
            <span>
              Yesterday’s question
              {pastAnswer && pastAnswer.questionId === yq.id && <span className={`ml-2 chip ${pastAnswer.correct ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{pastAnswer.correct ? "You got it" : "You missed it"}</span>}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
          </summary>
          <div className="space-y-2 border-t border-slate-200 px-3 py-3">
            <div className="font-medium whitespace-pre-line text-slate-900">
              <RichText text={yq.question} />
            </div>
            <p className="text-emerald-700">
              <b>Answer {LETTERS[yq.answer]}:</b> <span className="whitespace-pre-wrap">{yq.options[yq.answer]}</span>
            </p>
            <div className="whitespace-pre-line text-slate-600">
              <RichText text={yq.explanation} />
            </div>
          </div>
        </details>
      )}
    </section>
  );
}

function QuestionBody({ q, answer, onChoose }: { q: MCQ; answer: DailyAnswer | undefined; onChoose: (i: number) => void }) {
  // An answer recorded for a different question (exam switched mid-day) is not shown against this one.
  const mine = answer && answer.questionId === q.id ? answer : undefined;
  const topic = q.topicId ? TOPIC_BY_ID.get(q.topicId)?.name : undefined;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {topic && <span className="chip bg-slate-100 text-slate-600">{topic}</span>}
        <span className="chip bg-red-50 text-red-700">{q.difficulty === "very-hard" ? "Very hard" : "Hard"}</span>
      </div>
      {/* A div, not a heading: a code block (pre) is not allowed inside a heading. */}
      <div className="text-base font-semibold leading-snug whitespace-pre-line text-slate-900 sm:text-lg">
        <RichText text={q.question} />
      </div>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          let cls = "border-slate-200 hover:border-brand-300 hover:bg-brand-50";
          if (mine && i === q.answer) cls = "border-emerald-400 bg-emerald-50";
          else if (mine && i === mine.chosen) cls = "border-red-300 bg-red-50";
          else if (mine) cls = "border-slate-200 opacity-70";
          return (
            <button key={i} disabled={!!answer} onClick={() => onChoose(i)} className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition disabled:cursor-default ${cls}`}>
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{LETTERS[i]}</span>
              <span className="min-w-0 whitespace-pre-wrap break-words">{opt}</span>
            </button>
          );
        })}
      </div>
      {mine && (
        <div className={`rounded-xl p-4 text-sm ${mine.correct ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`} role="status">
          <p className="font-semibold">{mine.correct ? "Correct! Nicely done." : `Not quite. The answer is ${LETTERS[q.answer]}: ${q.options[q.answer]}.`}</p>
          <div className="mt-1 whitespace-pre-line">
            <RichText text={q.explanation} />
          </div>
          <p className="mt-2 text-xs opacity-80">A new question arrives at midnight (India time).</p>
        </div>
      )}
    </div>
  );
}
