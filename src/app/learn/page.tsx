"use client";

import { Check, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Quiz } from "@/components/Quiz";
import { MicButton, SpeakButton } from "@/components/Speak";
import { TopicNotesView } from "@/components/TopicNotesView";
import { TOPICS } from "@/data/topics";
import { useAccount } from "@/lib/account";
import { api, IS_STATIC } from "@/lib/api";
import { cardsForTopic, type NewCard } from "@/lib/cards";
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
  const params = useSearchParams();
  const initialTopic = params.get("topic") ?? "";
  const [tab, setTab] = useState<"topic" | "question">(params.get("tab") === "question" ? "question" : "topic");

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
    setData((await api("topic", { query: q })).json);
    setLoading(false);
  }, []);

  // The topic lives in the URL (?topic=…), so the browser's back button returns to the previous topic.
  const router = useRouter();
  useEffect(() => {
    setQuery(initial);
    if (initial) search(initial);
  }, [initial, search]);

  const go = (q: string) => {
    if (!q.trim()) return;
    if (q === initial) search(q);
    else router.push(`/learn?topic=${encodeURIComponent(q)}`, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={(e) => (e.preventDefault(), go(query))} className="flex max-w-2xl gap-2">
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

/** Previous / next topic in the same subject, so a subject can be studied start to finish. */
function TopicSteps({ topic, onPick }: { topic: Topic; onPick: (q: string) => void }) {
  const list = TOPICS.filter((t) => t.subject === topic.subject);
  const i = list.findIndex((t) => t.id === topic.id);
  const prev = i > 0 ? list[i - 1] : null;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  if (!prev && !next) return null;
  const go = (t: Topic) => {
    onPick(t.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <nav className="grid grid-cols-2 gap-3" aria-label={`More ${topic.subject} topics`}>
      {prev ? (
        <button onClick={() => go(prev)} className="card-link p-3 text-left">
          <span className="text-xs text-slate-500">← Previous in {topic.subject}</span>
          <span className="mt-0.5 block text-sm font-medium text-slate-900">{prev.name}</span>
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button onClick={() => go(next)} className="card-link p-3 text-right">
          <span className="text-xs text-slate-500">
            Next in {topic.subject} ({i + 2}/{list.length}) →
          </span>
          <span className="mt-0.5 block text-sm font-medium text-slate-900">{next.name}</span>
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}

function TopicView({ result, related, onPick }: { result: TopicResult; related: Topic[]; onPick: (q: string) => void }) {
  const { topic, exams, questions } = result;
  const [practising, setPractising] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const [deck, setDeck] = useState<NewCard[]>([]);
  useEffect(() => {
    let on = true;
    cardsForTopic(topic.id).then((d) => on && setDeck(d));
    return () => {
      on = false;
    };
  }, [topic.id]);
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
          <Link href={`/topics/${topic.id}`} className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline">
            Open topic page →
          </Link>
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
        <TopicNotesView topicId={topic.id} />
        <TopicSteps topic={topic} onPick={onPick} />
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Practice questions ({questions.length})</h3>
            {!practising && (
              <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setPractising(true)}>
                Start
              </button>
            )}
          </div>
          {practising ? <Quiz key={topic.id} questions={questions} mode="practice" share={{ title: topic.name }} /> : <p className="text-sm text-slate-600">Answer one question at a time with instant explanations.</p>}
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
  const [asked, setAsked] = useState("");

  const solve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAsked(question);
    setData((await api("solve", { question })).json);
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
          <AiDoubt key={asked} question={asked} prominent={!data.matched} />
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

interface Doubt {
  answer: string;
  steps: string[];
  concept: string;
  tip: string;
  confident: boolean;
}

/** Step-by-step answer from Claude, when the site has the AI solver switched on. */
function AiDoubt({ question, prominent }: { question: string; prominent: boolean }) {
  const account = useAccount();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ loading?: boolean; error?: string; result?: Doubt; left?: number }>({});

  useEffect(() => {
    if (IS_STATIC) return;
    fetch("/api/doubt", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  if (!enabled) return null;
  const ask = async () => {
    setState({ loading: true });
    const res = await fetch("/api/doubt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) }).catch(() => null);
    const d = await res?.json().catch(() => null);
    if (!res?.ok || !d) return setState({ error: d?.error ?? "Could not reach the doubt solver. Check your connection." });
    setState({ result: d.result, left: d.left });
  };

  const r = state.result;
  return (
    <div className={`card space-y-3 ${prominent ? "border-brand-200" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-semibold text-slate-900">
          <Sparkles className="h-4 w-4 text-brand-600" /> AI step-by-step solution
        </h3>
        {!r &&
          (account.user ? (
            <button className={prominent ? "btn-primary" : "btn-ghost"} onClick={ask} disabled={state.loading}>
              {state.loading ? "Thinking…" : "Solve with AI"}
            </button>
          ) : (
            <Link href={`/login?next=${encodeURIComponent("/learn?tab=question")}`} className="btn-ghost">
              Log in to ask AI
            </Link>
          ))}
      </div>
      {!r && !state.error && <p className="text-sm text-slate-600">For questions that are not in the bank, or when you want the full working. A few free AI doubts every day.</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {r && (
        <div className="space-y-3 text-sm">
          <p className="rounded-xl bg-emerald-50 p-3 text-emerald-900">
            <b>Answer:</b> {r.answer}
          </p>
          {r.steps.length > 0 && (
            <ol className="list-decimal space-y-1 pl-5 text-slate-800">
              {r.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          {r.concept && (
            <p className="text-slate-700">
              <b>Concept:</b> {r.concept}
            </p>
          )}
          {r.tip && (
            <p className="text-slate-700">
              <b>Exam tip:</b> {r.tip}
            </p>
          )}
          <p className="text-xs text-slate-500">
            {r.confident ? "AI answers can be wrong; check with your book when it matters." : "The AI was not fully sure about this one. Check it against your book or a teacher."}
            {state.left !== undefined && ` · ${state.left} AI doubt${state.left === 1 ? "" : "s"} left today`}
          </p>
        </div>
      )}
    </div>
  );
}
