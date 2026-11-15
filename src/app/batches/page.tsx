"use client";

import { ArrowRight, CheckCircle2, Clock, Copy, Loader2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BatchGate } from "@/components/BatchGate";
import { PageHeader } from "@/components/PageHeader";
import { PageSkeleton } from "@/components/Skeleton";
import { batchApi, fmtDate, joinLink } from "@/lib/batches";

interface Mine {
  teaching: { id: string; name: string; institution: string | null; joinCode: string; owner: boolean; members: number; tests: number; createdAt: number }[];
  joined: {
    id: string;
    name: string;
    institution: string | null;
    trainer: string;
    tests: { id: string; title: string; minutes: number; total: number; dueAt: number | null; status: "open" | "in-progress" | "done" | "missed" | "expired"; score: number | null; attemptId: string | null }[];
  }[];
}

export default function BatchesPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={2} />}>
      <BatchGate>
        <Batches />
      </BatchGate>
    </Suspense>
  );
}

function Batches() {
  const params = useSearchParams();
  const [data, setData] = useState<Mine | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const r = await batchApi<Mine>("");
    if (r.data) setData(r.data);
    else setError(r.error ?? "");
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const pending = data ? data.joined.flatMap((j) => j.tests.filter((t) => t.status === "open" || t.status === "in-progress")).length : 0;

  return (
    <div className="space-y-8">
      <PageHeader path="/batches" title="Batches" intro="Join your trainer’s batch to take assigned tests, or run your own batch as a trainer." />
      {error && (
        <div className="card flex flex-wrap items-center justify-between gap-2 text-sm text-red-700">
          {error}
          <button className="btn-ghost" onClick={() => (setError(""), load())}>
            Try again
          </button>
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="space-y-3" aria-labelledby="my-tests">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="my-tests" className="font-semibold">
              My tests
            </h2>
            {pending > 0 && <span className="chip bg-brand-50 text-brand-700">{pending} to take</span>}
          </div>
          {!data && error ? null : !data ? (
            <div className="skeleton h-40" />
          ) : data.joined.length === 0 ? (
            <p className="card text-sm text-slate-600">You haven’t joined a batch yet. Ask your trainer for the batch code and enter it on the right.</p>
          ) : (
            data.joined.map((j) => (
              <div key={j.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{j.name}</p>
                    <p className="text-xs text-slate-500">
                      {j.institution ? `${j.institution} · ` : ""}Trainer: {j.trainer}
                    </p>
                  </div>
                </div>
                {j.tests.length === 0 ? (
                  <p className="text-sm text-slate-500">No tests assigned yet.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {j.tests.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900">{t.title}</span>
                          <span className="block text-xs text-slate-500">
                            {t.total} questions · {t.minutes} min{t.dueAt ? ` · due ${fmtDate(t.dueAt)}` : ""}
                          </span>
                        </span>
                        <TestAction t={t} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>

        <div className="space-y-5">
          <JoinForm initial={params.get("join") ?? ""} onJoined={load} />
          <TrainerBox data={data} onCreated={load} />
        </div>
      </div>
    </div>
  );
}

function TestAction({ t }: { t: Mine["joined"][number]["tests"][number] }) {
  if (t.status === "done")
    return (
      <Link href={t.attemptId ? `/tests?id=${t.attemptId}` : "#"} className="btn-quiet shrink-0 text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> {t.score ?? 0} · Review
      </Link>
    );
  if (t.status === "missed" || t.status === "expired") return <span className="shrink-0 text-xs text-slate-500">{t.status === "missed" ? "Closed" : "Time ran out"}</span>;
  return (
    <Link href={`/batches/test?id=${t.id}`} className={`shrink-0 ${t.status === "in-progress" ? "btn-ghost" : "btn-primary"}`}>
      {t.status === "in-progress" ? (
        <>
          <Clock className="h-4 w-4" /> Resume
        </>
      ) : (
        <>
          Start <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Link>
  );
}

function JoinForm({ initial, onJoined }: { initial: string; onJoined: () => void }) {
  const [code, setCode] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await batchApi<{ name: string }>("/join", { method: "POST", body: { code } });
    setBusy(false);
    setMsg(r.data ? { ok: true, text: `You joined ${r.data.name}.` } : { ok: false, text: r.error ?? "" });
    if (r.data) {
      setCode("");
      onJoined();
    }
  }
  return (
    <form onSubmit={join} className="card space-y-3">
      <h2 className="font-semibold">Join a batch</h2>
      <div className="flex gap-2">
        <input className="input font-mono uppercase tracking-widest" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABC123" maxLength={12} aria-label="Batch code" />
        <button className="btn-primary shrink-0" disabled={busy || code.trim().length < 6}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
        </button>
      </div>
      {msg && <p className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</p>}
      <p className="text-xs text-slate-500">Your trainer will see your name, email and your scores on tests in this batch.</p>
    </form>
  );
}

function TrainerBox({ data, onCreated }: { data: Mine | null; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await batchApi("", { method: "POST", body: { name, institution: institution || undefined } });
    setBusy(false);
    if (!r.data) return setError(r.error ?? "");
    setName("");
    setInstitution("");
    setOpen(false);
    setError("");
    onCreated();
  }
  const copy = (code: string) => {
    navigator.clipboard?.writeText(joinLink(code)).then(() => setCopied(code), () => {});
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <section className="card space-y-3" aria-labelledby="teaching">
      <div className="flex items-center justify-between gap-2">
        <h2 id="teaching" className="font-semibold">
          Batches I run
        </h2>
        {!open && (
          <button className="btn-quiet" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New batch
          </button>
        )}
      </div>
      {open && (
        <form onSubmit={create} className="space-y-2 rounded-xl border border-slate-200 p-3">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Batch name, e.g. CSE Placement 2027" maxLength={80} aria-label="Batch name" autoFocus />
          <input className="input" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="College or institute (optional)" maxLength={120} aria-label="Institution" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" disabled={busy || name.trim().length < 2}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create batch"}
            </button>
            <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {!data ? (
        <div className="skeleton h-16" />
      ) : data.teaching.length === 0 ? (
        !open && <p className="text-sm text-slate-600">Training a class for placements? Create a batch, share its code, assign tests and see every student’s score.</p>
      ) : (
        <ul className="space-y-2">
          {data.teaching.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <Link href={`/batches/manage?id=${t.id}`} className="card-link flex min-w-0 flex-1 items-center justify-between gap-3 p-3 sm:p-3">
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-medium text-slate-900">{t.name}</span>
                    {!t.owner && <span className="chip shrink-0 bg-slate-100 text-slate-600">co-trainer</span>}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5" /> {t.members} · {t.tests} tests · code <span className="font-mono">{t.joinCode}</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <button className="btn-quiet shrink-0 px-2" onClick={() => copy(t.joinCode)} aria-label={`Copy join link for ${t.name}`} title="Copy join link">
                {copied === t.joinCode ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
