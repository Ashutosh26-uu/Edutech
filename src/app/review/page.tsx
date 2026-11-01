"use client";

import { Check, CheckCircle2, Play, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Stat } from "@/components/Quiz";
import { SpeakButton } from "@/components/Speak";
import { TOPICS } from "@/data/topics";
import { customCard, cardsForTopic } from "@/lib/cards";
import { previewIntervals, retrievability, type Grade } from "@/lib/fsrs";
import { addCards, deleteCard, dueCards, gradeCard, type Flashcard } from "@/lib/storage";
import { useStore } from "@/lib/useStore";
import { formatTime } from "@/lib/youtube";

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 1, label: "Again", cls: "bg-red-50 text-red-700 hover:bg-red-100" },
  { g: 2, label: "Hard", cls: "bg-amber-50 text-amber-800 hover:bg-amber-100" },
  { g: 3, label: "Good", cls: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { g: 4, label: "Easy", cls: "bg-brand-50 text-brand-700 hover:bg-brand-100" },
];

export default function ReviewPage() {
  const store = useStore();
  const [session, setSession] = useState(false);

  const cards = useMemo(() => Object.values(store?.cards ?? {}), [store]);
  if (!store) return null;

  const due = dueCards(store);
  const now = Date.now();
  const learned = cards.filter((c) => c.reps > 0);
  const avgRecall = learned.length ? Math.round((learned.reduce((s, c) => s + retrievability((now - (c.lastReview ?? now)) / 86_400_000, c.stability), 0) / learned.length) * 100) : null;
  const tomorrow = cards.filter((c) => c.due > now && c.due <= now + 86_400_000).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Flashcard review</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Spaced repetition with the <b>FSRS</b> scheduler: each card comes back just before you are likely to forget it, so you review less and remember more.
        </p>
      </div>

      {session && due.length ? (
        <ReviewSession onExit={() => setSession(false)} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Due now" value={due.length} tone="brand" />
            <Stat label="Due in next 24h" value={tomorrow} tone="slate" />
            <Stat label="Cards learned" value={`${learned.length} / ${cards.length}`} tone="green" />
            <Stat label="Predicted recall" value={avgRecall === null ? "–" : `${avgRecall}%`} tone="slate" />
          </div>
          {session && !due.length && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" /> You’re all caught up. New reviews will appear here when they’re due.</div>}
          <button className="btn-primary" disabled={!due.length} onClick={() => setSession(true)}>
            {due.length ? `Start review (${due.length} cards)` : "Nothing due right now"}
          </button>
          <div className="grid gap-5 lg:grid-cols-2">
            <AddTopicDecks have={new Set(cards.map((c) => c.id))} />
            <CustomCardForm />
          </div>
          <CardList cards={cards} />
        </>
      )}
    </div>
  );
}

function ReviewSession({ onExit }: { onExit: () => void }) {
  const store = useStore();
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(0);
  const card = store ? dueCards(store)[0] : undefined;

  const grade = (g: Grade) => {
    if (!card) return;
    gradeCard(card.id, g);
    setShown(false);
    setDone((d) => d + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "INPUT") return;
      if (!shown && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setShown(true);
      } else if (shown && ["1", "2", "3", "4"].includes(e.key)) grade(Number(e.key) as Grade);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!store) return null;
  if (!card) {
    return (
      <div className="card space-y-3 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" strokeWidth={1.75} />
        <p className="font-semibold text-slate-900">Session complete: {done} cards reviewed.</p>
        <button className="btn-primary" onClick={onExit}>
          Back to deck
        </button>
      </div>
    );
  }

  const intervals = previewIntervals(card);
  const remaining = dueCards(store).length;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {remaining} left · {done} done
        </span>
        <button className="font-medium text-brand-700" onClick={onExit}>
          End session
        </button>
      </div>
      <div className="card min-h-64 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="chip bg-slate-100 text-slate-600">{card.source}</span>
          <span className="chip bg-slate-100 text-slate-500">{card.reps === 0 ? "New" : `Reviewed ${card.reps}×`}</span>
        </div>
        <p className="whitespace-pre-line text-lg font-semibold leading-snug text-slate-900">{card.front}</p>
        {shown ? (
          <div className="border-t border-slate-200 pt-4">
            <p className="whitespace-pre-line text-slate-700">{card.back}</p>
            <div className="mt-2 flex gap-2">
              <SpeakButton text={`${card.front}. Answer: ${card.back}`} />
              {card.videoId && (
                <Link className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900" href={`/video?v=${card.videoId}${card.timestamp !== undefined ? `&t=${Math.floor(card.timestamp)}` : ""}`}>
                  <Play className="h-3 w-3" /> Watch at {formatTime(card.timestamp ?? 0)}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Try to recall the answer before revealing it.</p>
        )}
      </div>
      {shown ? (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map(({ g, label, cls }) => (
            <button key={g} onClick={() => grade(g)} className={`btn flex-col gap-0 py-3 ${cls}`}>
              <span>{label}</span>
              <span className="text-xs font-normal opacity-75">
                {intervals[g]} · key {g}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <button className="btn-primary w-full py-3" onClick={() => setShown(true)}>
          Show answer (Space)
        </button>
      )}
    </div>
  );
}

function AddTopicDecks({ have }: { have: Set<string> }) {
  const [msg, setMsg] = useState("");
  return (
    <section className="card">
      <h2 className="font-semibold text-slate-900">Add topic decks</h2>
      <p className="mt-1 text-sm text-slate-600">Turn a topic’s question bank into flashcards.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((t) => {
          const cards = cardsForTopic(t.id);
          if (!cards.length) return null;
          const added = cards.every((c) => have.has(c.id));
          return (
            <button
              key={t.id}
              disabled={added}
              onClick={() => setMsg(`Added ${addCards(cards)} cards from ${t.name}.`)}
              className={`chip px-3 py-1.5 text-sm ring-1 ${added ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-surface text-slate-700 ring-slate-200 hover:ring-brand-300"}`}
            >
              {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {t.name}
            </button>
          );
        })}
      </div>
      {msg && <p className="mt-3 text-sm font-medium text-emerald-700">{msg}</p>}
    </section>
  );
}

function CustomCardForm() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  return (
    <section className="card">
      <h2 className="font-semibold text-slate-900">Create your own card</h2>
      <form
        className="mt-3 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          addCards([customCard(front.trim(), back.trim())]);
          setFront("");
          setBack("");
        }}
      >
        <textarea className="input h-20" placeholder="Front: a question or prompt" value={front} onChange={(e) => setFront(e.target.value)} />
        <textarea className="input h-20" placeholder="Back: the answer" value={back} onChange={(e) => setBack(e.target.value)} />
        <button className="btn-primary" disabled={!front.trim() || !back.trim()}>
          Add card
        </button>
      </form>
    </section>
  );
}

function CardList({ cards }: { cards: Flashcard[] }) {
  const [open, setOpen] = useState(false);
  if (!cards.length) return null;
  const sorted = [...cards].sort((a, b) => a.due - b.due);
  return (
    <section className="card">
      <button className="flex w-full items-center justify-between font-semibold text-slate-900" onClick={() => setOpen(!open)}>
        All cards ({cards.length}) <span className="text-sm text-brand-700">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {sorted.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{c.front}</p>
                <p className="text-xs text-slate-500">
                  {c.source} · {c.reps === 0 ? "new" : `due ${new Date(c.due).toLocaleDateString()} · stability ${c.stability.toFixed(1)}d`}
                </p>
              </div>
              <button className="text-xs text-slate-400 hover:text-red-600" onClick={() => deleteCard(c.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
