"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RichText } from "@/components/RichText";
import { PageSkeleton } from "@/components/Skeleton";
import { TOPIC_BY_ID } from "@/data/topics";
import { useAccount } from "@/lib/account";
import type { MCQ } from "@/lib/types";

interface Group {
  questionId: string;
  question: MCQ | null;
  reports: { id: string; reason: string; note: string | null; createdAt: number }[];
}
interface Suspect {
  questionId: string;
  question: MCQ;
  answered: number;
  picks: number[];
  topPick: number;
}

const STATUSES = ["open", "resolved", "dismissed"] as const;
const LETTERS = ["A", "B", "C", "D"];
const REASON_LABEL: Record<string, string> = {
  "wrong-answer": "Wrong answer",
  "wrong-question": "Mistake in question/options",
  "wrong-explanation": "Wrong explanation",
  duplicate: "Repeated",
  other: "Other",
};

/** File a question lives in, so an admin knows where to fix it: data/bank/<topic>.ts. */
const fileOf = (q: MCQ | null, id: string) => `src/data/bank/${q?.topicId ?? id.replace(/-\d+$/, "")}.ts`;

function QuestionBox({ q, id, picks }: { q: MCQ | null; id: string; picks?: number[] }) {
  if (!q) return <p className="text-sm text-slate-500">Question {id} is no longer in the bank.</p>;
  const total = picks?.reduce((a, b) => a + b, 0) ?? 0;
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="chip bg-slate-100">{id}</span>
        {q.topicId && <span>{TOPIC_BY_ID.get(q.topicId)?.name}</span>}
        <span className="font-mono">{fileOf(q, id)}</span>
      </div>
      <div className="font-medium whitespace-pre-line text-slate-900">
        <RichText text={q.question} />
      </div>
      <ol className="space-y-1">
        {q.options.map((o, i) => (
          <li key={i} className={`flex gap-2 rounded-md px-2 py-1 ${i === q.answer ? "bg-emerald-50 text-emerald-900" : ""}`}>
            <b>{LETTERS[i]}</b> <span className="min-w-0 flex-1 whitespace-pre-wrap">{o}</span>
            {picks && <span className="text-xs text-slate-500 tabular-nums">{total ? Math.round((picks[i] / total) * 100) : 0}%</span>}
            {i === q.answer && <span className="text-xs font-medium">key</span>}
          </li>
        ))}
      </ol>
      <div className="whitespace-pre-line text-slate-600">
        <RichText text={q.explanation} />
      </div>
    </div>
  );
}

/** Reported questions and suspect answer keys, for the accounts listed in ADMIN_EMAILS. */
export default function AdminReportsPage() {
  const account = useAccount();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("open");
  const [data, setData] = useState<{ reports: Group[]; suspects: Suspect[] } | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/reports?status=${status}`, { cache: "no-store" });
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Could not load reports.");
    setError("");
    setData(await res.json());
  }, [status]);

  useEffect(() => {
    if (account.ready && account.user) load();
  }, [account.ready, account.user, load]);

  const setGroup = async (questionId: string, next: (typeof STATUSES)[number]) => {
    await fetch("/api/admin/reports", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ questionId, status: next }) });
    load();
  };

  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user) return <div className="card text-sm">Log in with an admin account to see question reports.</div>;
  if (error) return <div className="card text-sm text-red-600">{error}</div>;
  if (!data) return <PageSkeleton tiles={0} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex gap-4">
          <Link href="/admin/messages" className="text-sm text-brand-700 hover:underline">Contact messages →</Link>
          <Link href="/admin/stats" className="text-sm text-brand-700 hover:underline">Visitor stats →</Link>
        </div>
        <h1 className="text-2xl font-semibold">Question reports</h1>
        <p className="text-sm text-slate-600">Fix a question in its bank file, deploy, then mark its reports resolved.</p>
      </div>
      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button key={s} className={s === status ? "btn-primary px-3 py-1 text-xs" : "btn-ghost px-3 py-1 text-xs"} onClick={() => setStatus(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Reported by users ({data.reports.length})</h2>
        {!data.reports.length && <p className="text-sm text-slate-500">Nothing here.</p>}
        {data.reports.map((g) => (
          <div key={g.questionId} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="chip bg-red-50 text-red-700">
                {g.reports.length} report{g.reports.length > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                {status !== "resolved" && (
                  <button className="btn-primary px-2.5 py-1 text-xs" onClick={() => setGroup(g.questionId, "resolved")}>
                    Mark fixed
                  </button>
                )}
                {status !== "dismissed" && (
                  <button className="btn-ghost px-2.5 py-1 text-xs" onClick={() => setGroup(g.questionId, "dismissed")}>
                    Dismiss
                  </button>
                )}
                {status !== "open" && (
                  <button className="btn-ghost px-2.5 py-1 text-xs" onClick={() => setGroup(g.questionId, "open")}>
                    Reopen
                  </button>
                )}
              </div>
            </div>
            <ul className="space-y-1 text-sm">
              {g.reports.map((r) => (
                <li key={r.id} className="text-slate-700">
                  <b>{REASON_LABEL[r.reason] ?? r.reason}</b>
                  {r.note && <> — {r.note}</>} <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
            <QuestionBox q={g.question} id={g.questionId} />
          </div>
        ))}
      </section>

      {status === "open" && (
        <section className="space-y-3">
          <h2 className="font-semibold">Suspect answer keys ({data.suspects.length})</h2>
          <p className="text-sm text-slate-600">Questions with at least 15 answers where another option is picked more often than the key.</p>
          {!data.suspects.length && <p className="text-sm text-slate-500">None yet.</p>}
          {data.suspects.map((s) => (
            <div key={s.questionId} className="card space-y-2">
              <p className="text-xs text-slate-500">
                {s.answered} answers · most picked: {LETTERS[s.topPick]}
              </p>
              <QuestionBox q={s.question} id={s.questionId} picks={s.picks} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
