"use client";

import { ArrowLeft, BookmarkPlus, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookmarkButton, DifficultyChip, Stat } from "@/components/Quiz";
import { NoteBox, NoteButton } from "@/components/StudyNotes";
import { TOPIC_BY_ID } from "@/data/topics";
import { useAccount } from "@/lib/account";
import { cardsForQuestions } from "@/lib/cards";
import { inLang, useLang } from "@/lib/lang";
import { addCards } from "@/lib/storage";
import { useStore } from "@/lib/useStore";

/** Questions starred during practice or in a test review, grouped by topic. */
export default function SavedPage() {
  const store = useStore();
  const account = useAccount();
  const [lang] = useLang();
  const [added, setAdded] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  if (!store) return null;

  const saved = Object.values(store.bookmarks).sort((a, b) => b.savedAt - a.savedAt);
  const byTopic = new Map<string, typeof saved>();
  for (const b of saved) {
    const k = b.question.topicId ?? "other";
    byTopic.set(k, [...(byTopic.get(k) ?? []), b]);
  }
  const synced = account.mode === "server" && !!account.user;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/progress" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> My progress
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">Saved questions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tap <Star className="inline h-3.5 w-3.5" /> Save on any answered question to keep it here.{" "}
            {synced ? "Saved to your account." : account.mode === "server" ? <><Link href="/login?next=/saved" className="font-medium text-brand-700">Log in</Link> to keep them on every device.</> : "Saved in this browser."}
          </p>
        </div>
        {saved.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => setAdded(addCards(cardsForQuestions(saved.map((b) => b.question))))} disabled={added !== null}>
              <BookmarkPlus className="h-4 w-4" /> {added === null ? "Add all to flashcards" : added ? `${added} added` : "Already in flashcards"}
            </button>
            <Link href="/practice?saved=1" className="btn-primary">
              Practise saved questions
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Saved" value={saved.length} tone="brand" />
        <Stat label="Topics" value={byTopic.size} tone="slate" />
      </div>

      {saved.length === 0 ? (
        <div className="card text-sm text-slate-600">
          Nothing saved yet. Start a <Link href="/exams" className="font-medium text-brand-700">practice set</Link> and star the questions worth another look.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {[...byTopic].map(([topicId, items]) => (
            <section key={topicId} className="card">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-semibold">
                  {TOPIC_BY_ID.get(topicId)?.name ?? "Other questions"} <span className="ml-1 text-sm font-normal text-slate-500">{items.length}</span>
                </h2>
                {TOPIC_BY_ID.has(topicId) && (
                  <Link href={`/practice?saved=1&topics=${topicId}`} className="btn-ghost px-3 py-1.5 text-xs">
                    Practise
                  </Link>
                )}
              </div>
              <ul className="divide-y divide-slate-100 text-sm">
                {items.map((b) => {
                  const t = inLang(b.question, lang);
                  const shown = open === b.id;
                  return (
                    <li key={b.id} className="space-y-1 py-2.5">
                      <button className="text-left text-slate-800 hover:text-slate-950" onClick={() => setOpen(shown ? null : b.id)}>
                        {t.question}
                      </button>
                      {shown && (
                        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-900">
                          <b>{t.options[b.question.answer]}</b>
                          <p className="mt-0.5 text-emerald-800">{t.explanation}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <DifficultyChip difficulty={b.question.difficulty} />
                        <span>{new Date(b.savedAt).toLocaleDateString()}</span>
                        <button className="font-medium text-brand-700" onClick={() => setOpen(shown ? null : b.id)}>
                          {shown ? "Hide answer" : "Show answer"}
                        </button>
                        <span className="ml-auto flex gap-1">
                          <NoteButton question={b.question} />
                          <BookmarkButton question={b.question} />
                        </span>
                      </div>
                      <NoteBox question={b.question} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
