"use client";

import { Flag, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { IS_STATIC } from "@/lib/api";
import type { MCQ } from "@/lib/types";

const REASONS = [
  ["wrong-answer", "The marked answer is wrong"],
  ["wrong-question", "Mistake in the question or options"],
  ["wrong-explanation", "The explanation is wrong or unclear"],
  ["duplicate", "Repeated question"],
  ["other", "Something else"],
] as const;

/** Bank questions can be reported; generated Quant questions (ids ending in -g…) and video quizzes cannot. */
const reportable = (q: MCQ) => !IS_STATIC && !!q.topicId && !/-g[0-9a-z]+$/.test(q.id) && q.answer >= 0;

/** "Report" chip that opens a small form: reason, optional note, send. */
export function ReportButton({ question }: { question: MCQ }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number][0]>("wrong-answer");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  if (!reportable(question)) return null;

  if (state === "sent") return <span className="chip bg-emerald-50 text-emerald-700">Thanks, we’ll check it</span>;

  const send = async () => {
    setState("sending");
    const res = await fetch("/api/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ questionId: question.id, reason, note: note || undefined }) }).catch(() => null);
    if (res?.ok) return setState("sent");
    setError(res ? ((await res.json().catch(() => ({}))).error ?? "Could not send the report.") : "Could not send the report.");
    setState("error");
  };

  return (
    <span className="relative inline-flex">
      <button type="button" onClick={() => setOpen((o) => !o)} className="chip bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700" aria-expanded={open} title="Report a problem with this question">
        <Flag className="h-3.5 w-3.5" /> Report
      </button>
      {open && (
        <span className="absolute top-full right-0 z-20 mt-1 block w-72 max-w-[calc(100vw-2rem)] space-y-2 rounded-xl border border-slate-200 bg-surface p-3 text-left text-sm font-normal text-slate-700 shadow-lg">
          <span className="block font-medium text-slate-900">What’s wrong with this question?</span>
          {REASONS.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input type="radio" name={`reason-${question.id}`} checked={reason === value} onChange={() => setReason(value)} />
              {label}
            </label>
          ))}
          <textarea className="input min-h-16 text-sm" maxLength={1000} placeholder="Optional: what should it say?" value={note} onChange={(e) => setNote(e.target.value)} />
          {state === "error" && <span className="block text-xs text-red-600">{error}</span>}
          <span className="flex justify-end gap-2">
            <button type="button" className="btn-ghost px-2.5 py-1 text-xs" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn-primary px-2.5 py-1 text-xs" onClick={send} disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send report"}
            </button>
          </span>
        </span>
      )}
    </span>
  );
}

export interface Standing {
  rank: number;
  takers: number;
  percentile: number | null;
  enough: boolean;
}

/** Rank and percentile of a server-scored test, shown on its result screen. */
export function StandingCard({ attemptId, onLoad }: { attemptId: string; onLoad?: (s: Standing) => void }) {
  const [standing, setStanding] = useState<Standing | null>(null);
  useEffect(() => {
    let on = true;
    fetch(`/api/tests/${attemptId}/standing`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!on || !d) return;
        setStanding(d);
        onLoad?.(d);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
    // onLoad is a state setter from the results screen; refetching when it changes is not wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);
  if (!standing) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
        <Trophy className="h-5 w-5" />
      </span>
      <div className="min-w-0 text-sm">
        <div className="text-base font-semibold text-slate-900 tabular-nums">
          Rank {standing.rank.toLocaleString("en-IN")} of {standing.takers.toLocaleString("en-IN")}
          {standing.enough && standing.percentile !== null && <span className="font-normal text-slate-600"> · {standing.percentile} percentile</span>}
        </div>
        <p className="text-slate-600">
          {standing.enough
            ? `Your score beats ${standing.percentile}% of the students who took this test (each student’s best attempt counts).`
            : "You’re among the first to take this test. Your rank will settle as more students take it."}
        </p>
      </div>
    </div>
  );
}
