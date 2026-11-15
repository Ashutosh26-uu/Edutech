"use client";

import { BarChart3, CheckCircle2, Copy, Loader2, Plus, Trash2, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { BatchGate } from "@/components/BatchGate";
import { PageHeader } from "@/components/PageHeader";
import { PageSkeleton } from "@/components/Skeleton";
import { BANK_SIZES } from "@/data/bank";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { batchApi, fmtDate, joinLink } from "@/lib/batches";

interface Detail {
  batch: { id: string; name: string; institution: string | null; joinCode: string; createdAt: number };
  owner: boolean;
  trainers: string[];
  members: { userId: string; name: string; email: string; joinedAt: number }[];
  tests: { id: string; title: string; examId: string; minutes: number; dueAt: number | null; total: number; submitted: number; average: number | null; createdAt: number }[];
}

// Exam tracks that have practice questions; placement and management tracks first.
const TRACKS = EXAMS.filter((e) => examTopicIds(e).some((t) => (BANK_SIZES[t] ?? 0) > 0)).sort(
  (a, b) => Number(b.category === "Campus Placement") - Number(a.category === "Campus Placement") || a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
);

export default function BatchPage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={2} />}>
      <BatchGate>
        <Batch />
      </BatchGate>
    </Suspense>
  );
}

function Batch() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const load = useCallback(async () => {
    const r = await batchApi<Detail>(`/${id}`);
    if (r.data) setD(r.data);
    else setError(r.error ?? "");
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="card text-sm text-red-700">{error}</p>;
  if (!d) return <PageSkeleton tiles={2} />;

  const copy = () => {
    navigator.clipboard?.writeText(joinLink(d.batch.joinCode)).then(() => setCopied(true), () => {});
    setTimeout(() => setCopied(false), 1500);
  };
  const removeMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this batch? Their past results stay in their own account.`)) return;
    const r = await batchApi(`/${id}/members`, { method: "DELETE", body: { userId } });
    if (r.error) alert(r.error);
    load();
  };
  const deleteTest = async (testId: string, title: string) => {
    if (!confirm(`Delete “${title}”? Students can no longer take it, and its results page goes away. This cannot be undone.`)) return;
    const r = await batchApi(`/tests/${testId}`, { method: "DELETE" });
    if (r.error) alert(r.error);
    load();
  };
  const deleteBatch = async () => {
    if (!confirm(`Delete the batch “${d.batch.name}” with all its tests? This cannot be undone.`)) return;
    const r = await batchApi(`/${id}`, { method: "DELETE" });
    if (r.error) return alert(r.error);
    router.push("/batches");
  };

  return (
    <div className="space-y-6">
      <PageHeader path="/batches/manage" title={d.batch.name} intro={`${d.batch.institution ? `${d.batch.institution} · ` : ""}${d.members.length} students · ${d.tests.length} tests`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-slate-200 bg-surface px-3 py-1.5 text-sm">
            Join code <span className="ml-1 font-mono text-base font-semibold tracking-widest text-slate-900">{d.batch.joinCode}</span>
          </span>
          <button className="btn-ghost" onClick={copy}>
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? "Link copied" : "Copy join link"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Students open the link (or enter the code on the Batches page) after logging in.</p>
      </PageHeader>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <AssignTest batchId={id} onCreated={load} />
          <section className="card space-y-3" aria-labelledby="tests-h">
            <h2 id="tests-h" className="font-semibold">
              Assigned tests
            </h2>
            {d.tests.length === 0 ? (
              <p className="text-sm text-slate-500">No tests yet. Assign one above.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {d.tests.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block font-medium text-slate-900">{t.title}</span>
                      <span className="block text-xs text-slate-500">
                        {EXAM_BY_ID.get(t.examId)?.name ?? "Chosen topics"} · {t.total} Qs · {t.minutes} min{t.dueAt ? ` · due ${fmtDate(t.dueAt)}` : ""}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="mr-2 text-xs text-slate-500">
                        {t.submitted}/{d.members.length} done{t.average !== null ? ` · avg ${Math.round(t.average * 10) / 10}` : ""}
                      </span>
                      <Link href={`/batches/results?id=${t.id}`} className="btn-ghost">
                        <BarChart3 className="h-4 w-4" /> Results
                      </Link>
                      <button className="btn-quiet px-2 text-slate-400 hover:text-red-600" onClick={() => deleteTest(t.id, t.title)} aria-label={`Delete ${t.title}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="card space-y-3" aria-labelledby="members-h">
          <h2 id="members-h" className="font-semibold">
            Students <span className="font-normal text-slate-500">({d.members.length})</span>
          </h2>
          {d.members.length === 0 ? (
            <p className="text-sm text-slate-500">No one has joined yet. Share the join link with your class.</p>
          ) : (
            <ul className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
              {d.members.map((m) => (
                <li key={m.userId} className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">{m.name}</span>
                    <span className="block truncate text-xs text-slate-500">{m.email}</span>
                  </span>
                  <button className="btn-quiet shrink-0 px-2 text-slate-400 hover:text-red-600" onClick={() => removeMember(m.userId, m.name)} aria-label={`Remove ${m.name}`}>
                    <UserMinus className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {d.owner && (
            <button className="btn-quiet w-full justify-start text-red-600" onClick={deleteBatch}>
              <Trash2 className="h-4 w-4" /> Delete batch
            </button>
          )}
        </section>
      </div>

      <Trainers batchId={id} owner={d.owner} trainers={d.trainers} onChange={load} />
    </div>
  );
}

/** Co-trainers: the owner gives colleagues (by email) the same access to the batch. */
function Trainers({ batchId, owner, trainers, onChange }: { batchId: string; owner: boolean; trainers: string[]; onChange: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await batchApi(`/${batchId}/trainers`, { method: "POST", body: { email } });
    setBusy(false);
    if (r.error) return setError(r.error);
    setEmail("");
    onChange();
  }
  const remove = async (who: string) => {
    if (!confirm(`Remove ${who} as a trainer of this batch?`)) return;
    const r = await batchApi(`/${batchId}/trainers`, { method: "DELETE", body: { email: who } });
    if (r.error) alert(r.error);
    onChange();
  };
  return (
    <section className="card space-y-3" aria-labelledby="trainers-h">
      <div>
        <h2 id="trainers-h" className="font-semibold">
          Trainers
        </h2>
        <p className="text-sm text-slate-600">
          {owner
            ? "Add colleagues by email (for example your college’s placement team). They can assign tests, see results and manage students. Only you can delete the batch or change trainers."
            : "You are a co-trainer of this batch. The owner manages who else trains it."}
        </p>
      </div>
      {trainers.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {trainers.map((t) => (
            <li key={t} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span className="truncate text-slate-800">{t}</span>
              {owner && (
                <button className="btn-quiet px-2 text-slate-400 hover:text-red-600" onClick={() => remove(t)} aria-label={`Remove ${t}`}>
                  <UserMinus className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {owner && (
        <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@college.edu" aria-label="Trainer email" />
          <button className="btn-ghost shrink-0" disabled={busy || !email.includes("@")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Add trainer
          </button>
        </form>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </section>
  );
}

function AssignTest({ batchId, onCreated }: { batchId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [examId, setExamId] = useState(TRACKS[0]?.id ?? "");
  const [picked, setPicked] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(25);
  const [minutes, setMinutes] = useState(30);
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const topics = useMemo(() => {
    const e = EXAM_BY_ID.get(examId);
    return e ? examTopicIds(e).filter((t) => (BANK_SIZES[t] ?? 0) > 0) : [];
  }, [examId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await batchApi(`/${batchId}/tests`, {
      method: "POST",
      body: { title: title || `${EXAM_BY_ID.get(examId)?.name ?? "Practice"} test`, examId, topicIds: picked.length ? picked : undefined, count, minutes, dueAt: due ? new Date(due).getTime() : null },
    });
    setBusy(false);
    if (r.error) return setError(r.error);
    setTitle("");
    setPicked([]);
    setDue("");
    setOpen(false);
    onCreated();
  }

  if (!open)
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Assign a test
      </button>
    );

  return (
    <form onSubmit={submit} className="card space-y-4" aria-labelledby="assign-h">
      <h2 id="assign-h" className="font-semibold">
        Assign a test
      </h2>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">Title</span>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 3 – Quant and Reasoning" maxLength={100} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-slate-600">Build from</span>
        <select
          className="input"
          value={examId}
          onChange={(e) => {
            setExamId(e.target.value);
            setPicked([]);
          }}
        >
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.category} · {t.name}
            </option>
          ))}
        </select>
      </label>
      <details className="rounded-lg border border-slate-200 p-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">
          Topics: {picked.length ? `${picked.length} chosen` : `all ${topics.length}`} <span className="font-normal text-slate-500">(optional)</span>
        </summary>
        <div className="mt-3 grid max-h-60 gap-1 overflow-y-auto sm:grid-cols-2">
          {topics.map((t) => (
            <label key={t} className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-slate-50">
              <input type="checkbox" checked={picked.includes(t)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, t] : p.filter((x) => x !== t)))} />
              <span className="truncate">{TOPIC_BY_ID.get(t)?.name ?? t}</span>
            </label>
          ))}
        </div>
      </details>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Questions</span>
          <input className="input" type="number" min={5} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Minutes</span>
          <input className="input" type="number" min={5} max={180} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Due (optional)</span>
          <input className="input" type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
      </div>
      <p className="text-xs text-slate-500">Every student gets the same questions in their own option order. Marking follows the chosen exam track. Each student can take it once.</p>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={busy || !examId}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign test"}
        </button>
        <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
