"use client";

import { Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { EXAM_BY_ID, EXAMS, examTopicIds } from "@/data/exams";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { load } from "@/lib/storage";

interface Entry {
  rank: number;
  name: string;
  points: number;
  tests: number;
  me: boolean;
}
interface Board {
  weekStart: number;
  weekEnd: number;
  bestOf: number;
  board: Entry[];
  me: Entry | null;
}

const PRACTICE_EXAMS = EXAMS.filter((e) => examTopicIds(e).length > 0);
const HAS_BOARD = new Set(PRACTICE_EXAMS.map((e) => e.id));

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={0} />}>
      <Leaderboard />
    </Suspense>
  );
}

/** Weekly leaderboard per exam, for users who opted in with a public display name. */
function Leaderboard() {
  const account = useAccount();
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("exam");
  const [examId, setExamId] = useState<string>(requested && HAS_BOARD.has(requested) ? requested : "");
  const [data, setData] = useState<Board | null>(null);
  const [error, setError] = useState("");

  // No exam in the link: use the exam this browser last opened, else the first one.
  useEffect(() => {
    if (examId) return;
    const saved = load().examId;
    setExamId(saved && HAS_BOARD.has(saved) ? saved : (PRACTICE_EXAMS[0]?.id ?? ""));
  }, [examId]);

  const loadBoard = useCallback(async () => {
    if (!examId || IS_STATIC) return;
    setData(null);
    setError("");
    const res = await fetch(`/api/leaderboard?exam=${encodeURIComponent(examId)}`, { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return setError((await res?.json().catch(() => ({})))?.error ?? "Could not load the leaderboard.");
    setData(await res.json());
  }, [examId]);

  useEffect(() => {
    if (account.ready) loadBoard();
  }, [account.ready, account.user, loadBoard]);

  if (IS_STATIC || (account.ready && account.mode === "local")) {
    return <div className="card text-sm">Leaderboards need accounts and run on the full site, not this demo build.</div>;
  }

  const exam = EXAM_BY_ID.get(examId);
  const fmt = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Trophy className="h-6 w-6 text-amber-500" /> Weekly leaderboard
        </h1>
        <p className="text-sm text-slate-600">
          Points are the sum of your score percentages in your best {data?.bestOf ?? 5} timed tests on the exam this week (Monday to Sunday, India time). Late submissions don’t count.
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">Exam</span>
        <select
          className="input"
          value={examId}
          onChange={(e) => {
            setExamId(e.target.value);
            router.replace(`/leaderboard?exam=${e.target.value}`, { scroll: false });
          }}
        >
          {PRACTICE_EXAMS.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>

      {account.ready && account.user && <ProfileForm onSaved={loadBoard} />}
      {account.ready && !account.user && (
        <div className="card text-sm text-slate-600">
          <Link href={`/login?next=${encodeURIComponent(`/leaderboard?exam=${examId}`)}`} className="font-medium text-brand-700">
            Log in
          </Link>{" "}
          and choose a display name to appear on the leaderboard.
        </div>
      )}

      {error ? (
        <div className="card text-sm text-red-600">{error}</div>
      ) : !data ? (
        <PageSkeleton tiles={0} />
      ) : (
        <section className="card space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-semibold">{exam?.name ?? "Exam"}</h2>
            <span className="text-xs text-slate-500">
              {fmt(data.weekStart)} – {fmt(data.weekEnd - 1)}
            </span>
          </div>
          {data.me && !data.board.some((e) => e.me) && (
            <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
              You are <b>#{data.me.rank}</b> with {data.me.points} points from {data.me.tests} test{data.me.tests === 1 ? "" : "s"}.
            </p>
          )}
          {!data.board.length ? (
            <p className="text-sm text-slate-500">
              No one is on this week’s board yet.{" "}
              {exam && (
                <Link href={`/practice?exam=${exam.id}&mock=1`} className="font-medium text-brand-700">
                  Take a timed test
                </Link>
              )}{" "}
              to be the first.
            </p>
          ) : (
            <ol className="divide-y divide-slate-100">
              {data.board.map((e, i) => (
                <li key={`${e.rank}-${e.name}-${i}`} className={`flex items-center gap-3 py-2 text-sm ${e.me ? "rounded-lg bg-brand-50 px-2 font-medium" : ""}`}>
                  <span className={`w-8 shrink-0 text-right tabular-nums ${e.rank <= 3 ? "font-semibold text-amber-600" : "text-slate-500"}`}>#{e.rank}</span>
                  <span className="min-w-0 flex-1 truncate text-slate-900">
                    {e.name}
                    {e.me && <span className="ml-1 text-xs text-slate-500">(you)</span>}
                  </span>
                  <span className="shrink-0 text-xs text-slate-500 tabular-nums">
                    {e.tests} test{e.tests === 1 ? "" : "s"}
                  </span>
                  <span className="w-16 shrink-0 text-right font-semibold text-slate-900 tabular-nums">{e.points}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  );
}

/** Display name and the "Show me on leaderboards" switch (off by default). */
function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((p: { displayName: string | null; leaderboard: boolean } | null) => {
        if (p) {
          setName(p.displayName ?? "");
          setShow(p.leaderboard);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: name.trim() || null, leaderboard: show }) }).catch(() => null);
    setBusy(false);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) return setMsg({ ok: false, text: data?.error ?? "Could not save. Please try again." });
    setMsg({ ok: true, text: data.leaderboard ? "Saved. You’re on the leaderboard." : "Saved. You’re hidden from leaderboards." });
    onSaved();
  };

  if (!loaded) return null;
  return (
    <form onSubmit={save} className="card space-y-3">
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">Display name (shown publicly, never your email)</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="3–20 letters, numbers or spaces" />
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4" checked={show} onChange={(e) => setShow(e.target.checked)} />
        Show me on leaderboards
      </label>
      {msg && <p className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</p>}
      <button className="btn-primary" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
      </button>
    </form>
  );
}
