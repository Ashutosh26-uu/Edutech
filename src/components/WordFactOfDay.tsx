"use client";

import { BookA, Check, Headphones, Lightbulb, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/Speak";
import type { DailyFact } from "@/data/daily-facts";
import type { DailyWord } from "@/data/daily-words";
import { TOPIC_BY_ID } from "@/data/topics";
import { dailyIndex, meaningQuiz, pickForDay } from "@/lib/dailyLearn";
import { addCards, type Store } from "@/lib/storage";
import { istDayKey } from "@/lib/streak";

const LEARNED_KEY = "studyclip:words-learned";
const LETTERS = "ABC";

function readLearned(): string[] {
  try {
    const raw = localStorage.getItem(LEARNED_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveLearned(list: string[]) {
  try {
    localStorage.setItem(LEARNED_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: the counter just isn't kept */
  }
}

interface Data {
  words: DailyWord[];
  facts: DailyFact[];
}

/** Word of the day and GK fact of the day: one card, two tabs, the same picks for everyone on an India date. */
export function WordFactOfDay({ store }: { store: Store }) {
  // Fixed for the life of the page so the card does not change at midnight mid-read.
  const [date] = useState(() => istDayKey());
  const [tab, setTab] = useState<"word" | "fact">("word");
  const [data, setData] = useState<Data | null>(null);
  const [learned, setLearned] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    // Loaded on demand so the Today page itself stays light.
    Promise.all([import("@/data/daily-words"), import("@/data/daily-facts")]).then(([w, f]) => {
      if (alive) setData({ words: w.DAILY_WORDS, facts: f.DAILY_FACTS });
    });
    setLearned(readLearned());
    return () => {
      alive = false;
    };
  }, []);

  const markLearned = (word: string) => {
    const next = readLearned();
    if (!next.includes(word)) next.push(word);
    saveLearned(next);
    setLearned(next);
  };

  return (
    <section className="card space-y-4" aria-labelledby="wotd-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="eyebrow flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Learn one thing today
          </div>
          <h2 id="wotd-title" className="mt-0.5 font-semibold text-slate-900">
            Word and fact of the day
          </h2>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm" role="tablist" aria-label="Word or fact">
          {(
            [
              ["word", "Word", BookA],
              ["fact", "GK fact", Lightbulb],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${tab === id ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <div className="space-y-2" aria-hidden>
          <div className="skeleton h-7 w-1/3" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-5 w-2/3" />
        </div>
      ) : tab === "word" ? (
        <WordPanel key={date} words={data.words} date={date} store={store} learned={learned} onLearned={markLearned} />
      ) : (
        <FactPanel fact={pickForDay(data.facts, date, "fact")} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>New picks at midnight (India time), the same for everyone.</span>
        <Link href="/listen" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
          <Headphones className="h-3.5 w-3.5" /> Listen to revision
        </Link>
      </div>
    </section>
  );
}

function WordPanel({ words, date, store, learned, onLearned }: { words: DailyWord[]; date: string; store: Store; learned: string[]; onLearned: (w: string) => void }) {
  const index = dailyIndex(date, words.length, "word");
  const w = words[index];
  const [quizOpen, setQuizOpen] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const quiz = meaningQuiz(words, index, date);
  const cardId = `w:${w.word}`;
  const inDeck = added || !!store.cards[cardId];
  const isLearned = learned.includes(w.word);

  const choose = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === quiz.answer) onLearned(w.word);
  };

  const addToDeck = () => {
    addCards([
      {
        id: cardId,
        front: `${w.word} (${w.pos})`,
        back: `${w.meaning}\nHindi: ${w.hindi}\nSynonym: ${w.synonym} · Antonym: ${w.antonym}\n\n${w.example}`,
        topicId: "eng-vocabulary",
        source: "Word of the day",
      },
    ]);
    setAdded(true);
  };

  const spoken = `${w.word}. ${w.pos}. Meaning: ${w.meaning}. For example: ${w.example}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold text-slate-900">{w.word}</span>
        <span className="text-sm italic text-slate-500">{w.pos}</span>
        <SpeakButton text={spoken} />
      </div>
      <p className="text-slate-800">{w.meaning}</p>
      <p className="flex flex-wrap items-center gap-2 text-sm text-slate-700" lang="hi">
        <span className="font-medium">हिंदी: {w.hindi}</span>
        <SpeakButton text={w.hindi} label="सुनें" />
      </p>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="chip bg-emerald-50 text-emerald-700">Synonym: {w.synonym}</span>
        <span className="chip bg-red-50 text-red-700">Antonym: {w.antonym}</span>
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm italic text-slate-700">“{w.example}”</p>

      {quizOpen && (
        <div className="space-y-2" role="group" aria-label={`What does ${w.word} mean?`}>
          <p className="text-sm font-semibold text-slate-900">What does “{w.word}” mean?</p>
          {quiz.options.map((opt, i) => {
            let cls = "border-slate-200 hover:border-brand-300 hover:bg-brand-50";
            if (chosen !== null && i === quiz.answer) cls = "border-emerald-400 bg-emerald-50";
            else if (chosen === i) cls = "border-red-300 bg-red-50";
            else if (chosen !== null) cls = "border-slate-200 opacity-70";
            return (
              <button key={i} type="button" disabled={chosen !== null} onClick={() => choose(i)} className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition disabled:cursor-default ${cls}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{LETTERS[i]}</span>
                <span className="min-w-0">{opt}</span>
              </button>
            );
          })}
          {chosen !== null && (
            <p className={`text-sm font-medium ${chosen === quiz.answer ? "text-emerald-700" : "text-amber-800"}`} role="status">
              {chosen === quiz.answer ? "Correct! Added to your words learned." : "Not quite. Read it once more and try it in a sentence of your own."}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!quizOpen && (
          <button type="button" className="btn-primary" onClick={() => setQuizOpen(true)}>
            Quiz me
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={addToDeck} disabled={inDeck}>
          {inDeck ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {inDeck ? "In your flashcards" : "Add to flashcards"}
        </button>
        <span className="chip bg-amber-50 text-amber-800" title="Words whose meaning you picked correctly in Quiz me">
          {isLearned && <Check className="h-3.5 w-3.5" />} {learned.length} word{learned.length === 1 ? "" : "s"} learned
        </span>
      </div>
    </div>
  );
}

function FactPanel({ fact }: { fact: DailyFact }) {
  const topic = TOPIC_BY_ID.get(fact.topicId);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {topic && (
          <Link href={`/topics/${topic.id}`} className="chip bg-slate-100 text-slate-600 hover:bg-brand-50">
            {topic.name}
          </Link>
        )}
        <SpeakButton text={`${fact.fact} ${fact.hook}`} />
      </div>
      <p className="text-base font-medium leading-snug text-slate-900 sm:text-lg">{fact.fact}</p>
      <p className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{fact.hook}</span>
      </p>
      {topic && (
        <Link href={`/practice?topics=${topic.id}`} className="btn-ghost">
          Practise {topic.name}
        </Link>
      )}
    </div>
  );
}
