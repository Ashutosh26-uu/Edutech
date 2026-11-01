"use client";

import { Check, Layers } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { MicButton, SpeakButton } from "@/components/Speak";
import { TOPICS } from "@/data/topics";
import { cardsForTopic } from "@/lib/cards";
import { addCards } from "@/lib/storage";
import type { MCQ, SolveResult, Topic, TopicResult } from "@/lib/types";

export default function LearnPage() {
  return (
    <Suspense>
      <LearnView />
    </Suspense>
  );
}

function LearnView() {
  const initialTopic = useSearchParams().get("topic") ?? "";
  const [tab, setTab] = useState<"topic" | "question">("topic");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Learn</h1>
        <p className="mt-1 text-sm text-slate-600">Study any topic or get help with a specific question.</p>
      </div>
      <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
        {(["topic", "question"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-1.5 font-semibold ${tab === t ? "bg-surface text-brand-700 shadow-sm" : "text-slate-600"}`}>
            {t === "topic" ? "Study a topic" : "Solve a question"}
          </button>
        ))}
      </div>
      {tab === "topic" ? <TopicSearch initial={initialTopic} /> : <QuestionSolver />}
    </div>
  );
}

function TopicSearch({ initial }: { initial: string }) {
  const [query, setQuery] = useState(initial);
  const [data, setData] = useState<{ result: TopicResult | null; suggestions: Topic[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch("/api/topic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
    setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initial) search(initial);
  }, [initial, search]);

  const go = (q: string) => {
    setQuery(q);
    search(q);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={(e) => (e.preventDefault(), search(query))} className="flex max-w-2xl gap-2">
        <input className="input" placeholder="e.g. Fundamental Rights, Profit and Loss, Piaget…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <MicButton onText={go} />
        <button className="btn-primary" disabled={loading}>
          Search
        </button>
      </form>

      {!data && (
        <div>
          <p className="mb-2 text-sm text-slate-500">Popular topics</p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.slice(0, 14).map((t) => (
              <button key={t.id} onClick={() => go(t.name)} className="chip bg-surface px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300">
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {data && !data.result && (
        <div className="card text-sm">
          <p className="font-medium text-slate-800">No notes for “{query}” yet.</p>
          <p className="mt-1 text-slate-600">Notes for any topic will be generated once an AI model is connected. Until then, try one of these:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.suggestions.length ? data.suggestions : TOPICS.slice(0, 8)).map((t) => (
              <button key={t.id} onClick={() => go(t.name)} className="chip bg-brand-50 px-3 py-1.5 text-sm text-brand-700">
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {data?.result && <TopicView result={data.result} related={data.suggestions} onPick={go} />}
    </div>
  );
}

function TopicView({ result, related, onPick }: { result: TopicResult; related: Topic[]; onPick: (q: string) => void }) {
  const { topic, exams, questions } = result;
  const [practising, setPractising] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const deck = cardsForTopic(topic.id);
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="chip bg-brand-50 text-brand-700">{topic.subject}</span>
            <div className="flex items-center gap-1">
              <SpeakButton text={[topic.name, topic.summary, ...topic.keyPoints].join(". ")} />
              {deck.length > 0 && (
                <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900" onClick={() => setAdded(addCards(deck))}>
                  {added === null ? <><Layers className="h-3.5 w-3.5" /> Add {deck.length} flashcards</> : <><Check className="h-3.5 w-3.5" /> {added ? `Added ${added}` : "Already in deck"}</>}
                </button>
              )}
            </div>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{topic.name}</h2>
          <p className="mt-2 text-slate-700">{topic.summary}</p>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Key points</h3>
          <ul className="mt-2 space-y-2">
            {topic.keyPoints.map((k) => (
              <li key={k} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                {k}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Practice questions ({questions.length})</h3>
            {!practising && (
              <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setPractising(true)}>
                Start
              </button>
            )}
          </div>
          {practising ? <Quiz key={topic.id} questions={questions} mode="practice" /> : <p className="text-sm text-slate-600">Answer one question at a time with instant explanations.</p>}
        </div>
      </div>
      <aside className="space-y-5">
        <div className="card">
          <h3 className="font-semibold text-slate-900">Asked in these exams</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {exams.map((e) => (
              <Link key={e.id} href={`/exams/${e.id}`} className="chip bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-brand-50">
                {e.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-900">Learn it from a video</h3>
          <p className="mt-1 text-sm text-slate-600">Find a lecture on this topic and break it into clips.</p>
          <a className="btn-ghost mt-3 w-full" target="_blank" rel="noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.name + " lecture")}`}>
            Search YouTube ↗
          </a>
          <Link href="/video" className="btn-primary mt-2 w-full">
            Paste a lecture link
          </Link>
        </div>
        {related.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-slate-900">Related topics</h3>
            <div className="mt-3 flex flex-col items-start gap-1.5">
              {related.map((t) => (
                <button key={t.id} onClick={() => onPick(t.name)} className="text-sm font-medium text-brand-700 hover:underline">
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function QuestionSolver() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<SolveResult | null>(null);
  const [loading, setLoading] = useState(false);

  const solve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch("/api/solve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
    setData(await res.json());
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <form onSubmit={solve} className="space-y-2">
        <textarea className="input h-28" placeholder="Type or paste a question, e.g. “Which Article abolishes untouchability?”" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <div className="flex items-center gap-2">
          <button className="btn-primary" disabled={loading || !question.trim()}>
            {loading ? "Solving…" : "Get answer"}
          </button>
          <MicButton onText={(t) => setQuestion(t)} />
        </div>
      </form>

      {data && (
        <div className="space-y-4">
          {data.matched && data.question ? (
            <AnswerCard q={data.question} />
          ) : (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{data.message}</div>
          )}
          {data.relatedTopics.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-slate-900">Study the concept</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.relatedTopics.map((t) => (
                  <Link key={t.id} href={`/learn?topic=${encodeURIComponent(t.name)}`} className="chip bg-brand-50 px-3 py-1.5 text-sm text-brand-700">
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {data.similar.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Similar questions</h3>
              {data.similar.map((q) => (
                <AnswerCard key={q.id} q={q} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnswerCard({ q, compact = false }: { q: MCQ; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);
  return (
    <div className="card">
      <p className="font-semibold text-slate-900">{q.question}</p>
      <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        {q.options.map((o, i) => (
          <li key={i} className={open && i === q.answer ? "font-semibold text-emerald-700" : "text-slate-700"}>
            {"ABCD"[i]}. {o}
          </li>
        ))}
      </ol>
      {open ? (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <b>Answer: {q.options[q.answer]}</b>
          <p className="mt-1">{q.explanation}</p>
        </div>
      ) : (
        <button className="mt-2 text-sm font-medium text-brand-700" onClick={() => setOpen(true)}>
          Show answer
        </button>
      )}
    </div>
  );
}
