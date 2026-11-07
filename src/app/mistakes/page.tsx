"use client";

import { BookmarkPlus, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { Stat } from "@/components/Quiz";
import { TOPIC_BY_ID } from "@/data/topics";
import { findQuestions } from "@/lib/bank";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { cardsForQuestions } from "@/lib/cards";
import { addCards } from "@/lib/storage";
import type { MCQ } from "@/lib/types";

interface Mistake {
  questionId: string;
  topicId: string;
  timesWrong: number;
  lastWrongAt: number;
}

/** The mistake notebook: every question the account has got wrong and not yet got right again. */
export default function MistakesPage() {
  const account = useAccount();
  const [mistakes, setMistakes] = useState<Mistake[] | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  // The questions behind the notebook entries, loaded for just the topics they belong to.
  const [bank, setBank] = useState<Map<string, MCQ>>(new Map());

  useEffect(() => {
    if (!account.ready || !account.user) return;
    fetch("/api/progress", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { mistakes: [] }))
      .then(async (d) => {
        setBank(await findQuestions((d.mistakes as Mistake[]).map((m) => m.questionId)));
        setMistakes(d.mistakes);
      })
      .catch(() => setMistakes([]));
  }, [account.ready, account.user]);

  if (IS_STATIC || (account.ready && account.mode === "local")) {
    return <div className="card text-sm">The mistake notebook needs an account and runs on the full site, not this demo build.</div>;
  }
  if (!account.ready) return <PageSkeleton />;
  if (!account.user) {
    return (
      <div className="card mx-auto max-w-md space-y-3 py-8 text-center">
        <NotebookPen className="mx-auto h-8 w-8 text-slate-400" />
        <h1 className="text-lg font-semibold">Your mistake notebook</h1>
        <p className="text-sm text-slate-600">Every question you get wrong in practice or a test is kept here until you get it right. Log in to see yours.</p>
        <Link href="/login?next=/mistakes" className="btn-primary">
          Log in or sign up
        </Link>
      </div>
    );
  }
  if (!mistakes) return <PageSkeleton />;

  const byTopic = new Map<string, Mistake[]>();
  for (const m of mistakes) byTopic.set(m.topicId, [...(byTopic.get(m.topicId) ?? []), m]);
  const topics = [...byTopic].sort((a, b) => b[1].length - a[1].length);
  const repeat = mistakes.filter((m) => m.timesWrong > 1).length;
  const questions = mistakes.flatMap((m) => bank.get(m.questionId) ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mistake notebook</h1>
          <p className="mt-1 text-sm text-slate-600">
            Questions you got wrong, saved to your account. Answer one correctly in a mistakes set and it leaves the notebook. Questions you starred are in{" "}
            <Link href="/saved" className="font-medium text-brand-700">Saved questions</Link>.
          </p>
        </div>
        {mistakes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => setSaved(addCards(cardsForQuestions(questions)))} disabled={saved !== null}>
              <BookmarkPlus className="h-4 w-4" /> {saved === null ? "Add all to flashcards" : saved ? `${saved} added` : "Already in flashcards"}
            </button>
            <Link href="/practice?mistakes=1" className="btn-primary">
              Practise my mistakes
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Open mistakes" value={mistakes.length} tone="red" />
        <Stat label="Wrong more than once" value={repeat} tone="brand" />
        <Stat label="Topics" value={byTopic.size} tone="slate" />
        <Stat label="Oldest" value={mistakes.length ? new Date(Math.min(...mistakes.map((m) => m.lastWrongAt))).toLocaleDateString() : "–"} tone="slate" />
      </div>

      {mistakes.length === 0 ? (
        <div className="card text-sm text-slate-600">
          Nothing here yet. Wrong answers in <Link href="/exams" className="font-medium text-brand-700">practice and timed tests</Link> land in this notebook.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {topics.map(([topicId, ms]) => (
            <section key={topicId} className="card">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-semibold">
                  {TOPIC_BY_ID.get(topicId)?.name ?? topicId} <span className="ml-1 text-sm font-normal text-slate-500">{ms.length}</span>
                </h2>
                <Link href={`/practice?mistakes=1&topics=${topicId}`} className="btn-ghost px-3 py-1.5 text-xs">
                  Practise
                </Link>
              </div>
              <ul className="divide-y divide-slate-100 text-sm">
                {ms.slice(0, 8).map((m) => {
                  const q = bank.get(m.questionId);
                  return (
                    <li key={m.questionId} className="py-2">
                      <p className="line-clamp-2 text-slate-800">{q?.question ?? m.questionId}</p>
                      <p className="text-xs text-slate-500">
                        {m.timesWrong > 1 ? `Wrong ${m.timesWrong} times` : "Wrong once"} · {new Date(m.lastWrongAt).toLocaleDateString()}
                      </p>
                    </li>
                  );
                })}
                {ms.length > 8 && <li className="py-2 text-xs text-slate-500">and {ms.length - 8} more</li>}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
