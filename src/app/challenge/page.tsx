"use client";

import { Check, Copy, Crown, Loader2, Share2, Swords, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Quiz, Results, type AnswerResult } from "@/components/Quiz";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { BANK_SIZES } from "@/data/bank";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { SITE_URL } from "@/data/site";
import { useAccount } from "@/lib/account";
import { IS_STATIC, postJson, request } from "@/lib/api";
import { recordAnswers } from "@/lib/storage";
import { track } from "@/lib/track";
import type { MCQ } from "@/lib/types";
import { useStore } from "@/lib/useStore";

interface Player {
  name: string;
  correct: number;
  wrong: number;
  seconds: number;
  playedAt: number;
  me: boolean;
}
interface Challenge {
  id: string;
  examId: string;
  examName: string;
  creator: string;
  isCreator: boolean;
  total: number;
  expiresAt: number;
  full: boolean;
  players: Player[];
  questions: MCQ[];
  answers: (number | null)[] | null;
}
interface Mine {
  id: string;
  examName: string;
  createdAt: number;
  players: number;
  mine: boolean;
}

/** About a minute a question: quick enough to feel like a duel. */
const SECONDS_PER_QUESTION = 60;

const TRACKS = EXAMS.filter((e) => examTopicIds(e).some((t) => (BANK_SIZES[t] ?? 0) > 0)).sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name));

const linkFor = (id: string) => `${SITE_URL}/challenge?id=${id}`;
const fmtSecs = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

export default function ChallengePage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={1} />}>
      <ChallengeRoot />
    </Suspense>
  );
}

function ChallengeRoot() {
  const id = useSearchParams().get("id");
  if (IS_STATIC) return <StaticNotice>Challenges compare scores between friends, so they work on the full site only.</StaticNotice>;
  return id ? <Play key={id} id={id} /> : <Create />;
}

function LoginPrompt({ title, text }: { title: string; text: string }) {
  const path = usePathname();
  const params = useSearchParams();
  const next = encodeURIComponent(`${path}${params.size ? `?${params}` : ""}`);
  return (
    <div className="card mx-auto max-w-xl space-y-3">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-600">{text}</p>
      <div className="flex flex-wrap gap-2">
        <Link href={`/login?tab=signup&next=${next}`} className="btn-primary">
          Create a free account
        </Link>
        <Link href={`/login?next=${next}`} className="btn-ghost">
          Log in
        </Link>
      </div>
    </div>
  );
}

/** /challenge: pick an exam, make a 10-question set, and get a link to send to a friend. */
function Create() {
  const account = useAccount();
  const store = useStore();
  const router = useRouter();
  const [examId, setExamId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mine, setMine] = useState<Mine[] | null>(null);

  useEffect(() => {
    if (!examId && store) setExamId(store.examId && EXAM_BY_ID.has(store.examId) ? store.examId : (TRACKS[0]?.id ?? ""));
  }, [store, examId]);
  useEffect(() => {
    if (!account.user) return;
    request("/api/challenge?mine=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { challenges: [] }))
      .then((d) => setMine(d.challenges ?? []))
      .catch(() => setMine([]));
  }, [account.user]);

  if (!account.ready) return <PageSkeleton tiles={1} />;
  if (!account.user) return <LoginPrompt title="Challenge a friend" text="Make a set of 10 questions, send the link on WhatsApp, and see who scores more. Both of you need a free account so the scores have names." />;

  async function create() {
    setBusy(true);
    setError("");
    const { status, data } = await postJson<{ id: string }>("/api/challenge", { examId });
    setBusy(false);
    if (status !== 201) return setError(data.error ?? "Could not make the challenge.");
    track("challenge_create");
    router.push(`/challenge?id=${data.id}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader path="/challenge" title="Challenge a friend" intro="Ten questions, one link. You both answer the same set, and the higher score wins (a tie goes to the faster one)." />
      <div className="card space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Exam</span>
          <select className="input" value={examId} onChange={(e) => setExamId(e.target.value)}>
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary" onClick={create} disabled={busy || !examId}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />} Make my challenge
        </button>
        <p className="text-xs text-slate-500">You play first, then share the link. Links work for 14 days.</p>
      </div>
      {mine && mine.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">Your recent challenges</h2>
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {mine.map((m) => (
              <li key={m.id}>
                <Link href={`/challenge?id=${m.id}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50">
                  <span>
                    <span className="font-medium text-slate-900">{m.examName}</span>
                    <span className="text-slate-500"> · {m.mine ? "made by you" : "you played"}</span>
                  </span>
                  <span className="pill">
                    {m.players} player{m.players === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** /challenge?id=…: play the set once, then see the scoreboard and the full review. */
function Play({ id }: { id: string }) {
  const account = useAccount();
  const [ch, setCh] = useState<Challenge | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const started = useRef(0);

  useEffect(() => {
    if (!account.ready) return;
    request(`/api/challenge?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (r.ok) setCh(d);
        else setError(d.error ?? "Could not open this challenge.");
      })
      .catch(() => setError("You seem to be offline. Check your connection and try again."));
  }, [id, account.ready, account.user]);

  if (error) return <p className="card mx-auto max-w-xl text-sm text-red-700">{error}</p>;
  if (!ch) return <PageSkeleton tiles={1} />;

  const top = ch.players[0];
  if (!account.user)
    return (
      <LoginPrompt
        title={`${ch.creator} challenged you on ${ch.examName}`}
        text={`${ch.total} questions${top ? `; the best score so far is ${top.correct}/${ch.total}` : ""}. Create a free account (or log in) to play. It takes a minute, and your score shows next to theirs.`}
      />
    );

  if (playing && !ch.answers)
    return (
      <div className="card">
        <Quiz
          questions={ch.questions.map((q) => ({ ...q, answer: -1, explanation: "" }))}
          mode="mock"
          timeLimitSec={ch.total * SECONDS_PER_QUESTION}
          submit={async (chosen) => {
            const seconds = Math.round((Date.now() - started.current) / 1000);
            const { status, data } = await postJson<Challenge>("/api/challenge/play", { id: ch.id, answers: chosen, seconds });
            if (status !== 200) throw new Error(data.error ?? "Could not submit. Try again.");
            track("challenge_play");
            setCh(data);
            return data.questions;
          }}
          onFinish={(results: AnswerResult[]) => recordAnswers(results.filter((r) => r.chosen !== null).map((r) => ({ topicId: r.question.topicId, correct: r.correct })))}
        />
      </div>
    );

  if (!ch.answers)
    return (
      <div className="mx-auto max-w-xl space-y-5">
        <div className="card space-y-4">
          <div>
            <p className="eyebrow">{ch.isCreator ? "Your challenge" : `${ch.creator} challenged you`}</p>
            <h1 className="mt-1 text-2xl font-semibold">{ch.examName} · {ch.total} questions</h1>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Timer className="h-4 w-4 text-slate-400" /> {Math.round((ch.total * SECONDS_PER_QUESTION) / 60)} minutes · one go · higher score wins, a tie goes to the faster player
          </p>
          {ch.players.length > 0 && <Board ch={ch} />}
          {ch.full ? (
            <p className="text-sm text-slate-600">This challenge is full. <Link href="/challenge" className="underline">Start your own</Link>.</p>
          ) : (
            <button
              className="btn-primary"
              onClick={() => {
                started.current = Date.now();
                setPlaying(true);
              }}
            >
              <Swords className="h-4 w-4" /> {ch.isCreator ? "Play first, then share" : "Accept the challenge"}
            </button>
          )}
        </div>
      </div>
    );

  return <Done ch={ch} />;
}

function Board({ ch }: { ch: Challenge }) {
  return (
    <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 text-sm">
      {ch.players.map((p, i) => (
        <li key={`${p.name}-${p.playedAt}`} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${p.me ? "bg-slate-50" : ""}`}>
          <span className="flex min-w-0 items-center gap-2">
            <span className="w-5 shrink-0 text-slate-400 tabular-nums">{i === 0 ? <Crown className="h-4 w-4 text-amber-500" aria-label="Leading" /> : i + 1}</span>
            <span className="truncate font-medium text-slate-900">
              {p.name}
              {p.me && <span className="font-normal text-slate-500"> (you)</span>}
            </span>
          </span>
          <span className="shrink-0 tabular-nums text-slate-600">
            <b className="text-slate-900">
              {p.correct}/{ch.total}
            </b>{" "}
            · {fmtSecs(p.seconds)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Done({ ch }: { ch: Challenge }) {
  const [copied, setCopied] = useState(false);
  const me = ch.players.find((p) => p.me);
  const rank = ch.players.findIndex((p) => p.me);
  const others = ch.players.length - 1;
  const link = linkFor(ch.id);
  const text = `I scored ${me?.correct ?? 0}/${ch.total} on a ${ch.examName} challenge on StudyClip. Can you beat me? ${link}`;
  const results: AnswerResult[] = useMemo(() => ch.questions.map((q, i) => ({ question: q, chosen: ch.answers?.[i] ?? null, correct: ch.answers?.[i] === q.answer })), [ch]);
  const verdict = others === 0 ? "Now send the link: your friend answers the same 10 questions." : rank === 0 ? "You’re ahead! 🎉" : `You’re #${rank + 1} of ${ch.players.length}.`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "StudyClip challenge", text });
        return;
      } catch {
        /* cancelled: fall through to copy */
      }
    }
    copy();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Copy this link", link);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4">
        <div>
          <p className="eyebrow">{ch.examName} challenge</p>
          <h1 className="mt-1 text-2xl font-semibold">
            You scored {me?.correct ?? 0}/{ch.total}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{verdict}</p>
        </div>
        <Board ch={ch} />
        <div className="flex flex-wrap gap-2">
          <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Share2 className="h-4 w-4" /> Send on WhatsApp
          </a>
          <button className="btn-ghost" onClick={share}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Link copied" : "Share link"}
          </button>
          <Link href="/challenge" className="btn-quiet">
            New challenge
          </Link>
        </div>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your answers</h2>
        <Results results={results} negativeMarking={0} />
      </section>
    </div>
  );
}
