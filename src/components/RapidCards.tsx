"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cardsForTopic } from "@/lib/cards";
import { addCards } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

/** Fast flip-through of question cards for last-minute revision. Missed cards can go to the spaced-repetition deck. */
export function RapidCards({ questions, onClose }: { questions: MCQ[]; onClose: () => void }) {
  const deck = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [missed, setMissed] = useState<MCQ[]>([]);
  const [saved, setSaved] = useState<number | null>(null);
  const done = i >= deck.length;

  const mark = (knew: boolean) => {
    if (!knew) setMissed((m) => [...m, deck[i]]);
    setShown(false);
    setI((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!shown) setShown(true);
      } else if (shown && (e.key === "ArrowRight" || e.key === "k")) mark(true);
      else if (shown && (e.key === "ArrowLeft" || e.key === "j")) mark(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (done) {
    const missedTopics = [...new Set(missed.map((q) => q.topicId).filter(Boolean))] as string[];
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">
          {deck.length - missed.length} of {deck.length} recalled
        </h3>
        {missed.length ? (
          <>
            <p className="text-sm text-slate-600">Revise these {missed.length} once more before the exam.</p>
            <ul className="space-y-2 text-left text-sm">
              {missed.map((q) => (
                <li key={q.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{q.question}</p>
                  <p className="mt-1 text-emerald-700">{q.options[q.answer]}</p>
                </li>
              ))}
            </ul>
            <button
              className="btn-ghost"
              onClick={() => {
                const ids = new Set(missed.map((q) => `q:${q.id}`));
                setSaved(addCards(missedTopics.flatMap(cardsForTopic).filter((c) => ids.has(c.id))));
              }}
            >
              {saved === null ? "Add missed cards to my flashcards" : `Added ${saved} cards`}
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-600">You recalled every card. You’re ready.</p>
        )}
        <div className="flex justify-center gap-2">
          <button
            className="btn-ghost"
            onClick={() => {
              setI(0);
              setMissed([]);
              setSaved(null);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Go again
          </button>
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const q = deck[i];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Card {i + 1} of {deck.length}
        </span>
        <button className="hover:text-slate-900" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-ink transition-all" style={{ width: `${(i / deck.length) * 100}%` }} />
      </div>
      <div className="min-h-44 rounded-xl border border-slate-200 p-5">
        <p className="text-lg font-medium leading-snug text-slate-900">{q.question}</p>
        {shown && (
          <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
            <p className="font-medium text-emerald-700">{q.options[q.answer]}</p>
            <p className="mt-1 text-slate-600">{q.explanation}</p>
          </div>
        )}
      </div>
      {shown ? (
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost py-2.5" onClick={() => mark(false)}>
            <X className="h-4 w-4 text-red-600" /> Didn’t know <span className="text-xs text-slate-400">←</span>
          </button>
          <button className="btn-ghost py-2.5" onClick={() => mark(true)}>
            <Check className="h-4 w-4 text-emerald-600" /> Knew it <span className="text-xs text-slate-400">→</span>
          </button>
        </div>
      ) : (
        <button className="btn-primary w-full py-2.5" onClick={() => setShown(true)}>
          Show answer (Space)
        </button>
      )}
    </div>
  );
}
