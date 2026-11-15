"use client";

import { ArrowLeft, CheckCircle2, Copy, Eye, Loader2, Pencil, Plus, Trash2, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { blankQuestion, QuestionsEditor } from "@/components/QuestionsEditor";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { instApi, instituteHref } from "@/lib/institutes";
import type { DraftQuestion } from "@/lib/quizText";

interface Manage {
  institute: { id: string; slug: string; name: string; city: string | null; about: string | null; website: string | null; verified: boolean; joinCode: string };
  role: "owner" | "staff";
  members: number;
  staff: { email: string; role: "owner" | "staff" }[];
  sets: { id: string; title: string; description: string | null; visibility: "public" | "members"; published: boolean; questions: DraftQuestion[]; updatedAt: number }[];
}
type SetForm = { id?: string; title: string; description: string; visibility: "public" | "members"; published: boolean; questions: DraftQuestion[] };

export default function ManageInstitutePage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={2} />}>
      <ManageInstitute />
    </Suspense>
  );
}

function ManageInstitute() {
  const slug = useSearchParams().get("slug") ?? "";
  const account = useAccount();
  const [m, setM] = useState<Manage | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<SetForm | null>(null);
  const [copied, setCopied] = useState(false);
  const load = useCallback(() => instApi<Manage>(`/manage?slug=${encodeURIComponent(slug)}`).then((r) => (r.data ? setM(r.data) : setError(r.error ?? ""))), [slug]);
  useEffect(() => {
    if (!IS_STATIC && account.ready && account.user) load();
  }, [account.ready, account.user, load]);

  if (IS_STATIC) return <StaticNotice>Institute pages are on the full site.</StaticNotice>;
  if (!account.ready) return <PageSkeleton tiles={2} />;
  if (!account.user)
    return (
      <div className="card max-w-xl space-y-3 text-sm">
        <p>Log in with the email that runs this institute page.</p>
        <Link href={`/login?next=${encodeURIComponent(`/institute/manage?slug=${slug}`)}`} className="btn-primary">
          Log in
        </Link>
      </div>
    );
  if (error) return <p className="card text-sm text-red-700">{error} Only the page’s owner and staff can manage it.</p>;
  if (!m) return <PageSkeleton tiles={2} />;
  const i = m.institute;

  if (editing) return <SetEditor slug={i.slug} initial={editing} onDone={() => (setEditing(null), load())} />;

  const copy = () => {
    navigator.clipboard?.writeText(`${location.origin}${instituteHref(i.slug)}  ·  Code: ${i.joinCode}`).then(() => setCopied(true), () => {});
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <Link href={instituteHref(i.slug)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> View public page
      </Link>
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <VerifiedBadge verified={i.verified} />
          <span className="chip bg-slate-100 text-slate-600">{m.role === "owner" ? "Owner" : "Staff"}</span>
        </div>
        <h1 className="text-2xl font-semibold">{i.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-slate-200 bg-surface px-3 py-1.5 text-sm">
            Student code <span className="ml-1 font-mono text-base font-semibold tracking-widest text-slate-900">{i.joinCode}</span>
          </span>
          <button className="btn-ghost" onClick={copy}>
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link and code"}
          </button>
          <span className="text-sm text-slate-500">{m.members} students joined</span>
        </div>
        <p className="text-xs text-slate-500">Public sets are open to everyone. Members-only sets unlock for students who enter this code.</p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="min-w-0 space-y-3" aria-labelledby="sets-h">
          <div className="flex items-center justify-between gap-2">
            <h2 id="sets-h" className="font-semibold">
              Question sets
            </h2>
            <button className="btn-primary" onClick={() => setEditing({ title: "", description: "", visibility: "public", published: true, questions: [blankQuestion(), blankQuestion(), blankQuestion()] })}>
              <Plus className="h-4 w-4" /> New set
            </button>
          </div>
          {m.sets.length === 0 ? (
            <p className="card text-sm text-slate-600">No sets yet. Create one with your own questions; paste many at once from Word or WhatsApp.</p>
          ) : (
            <ul className="card divide-y divide-slate-100 p-0 sm:p-0">
              {m.sets.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <span className="min-w-0">
                    <span className="block font-medium text-slate-900">{s.title}</span>
                    <span className="block text-xs text-slate-500">
                      {s.questions.length} questions · {s.visibility === "public" ? "public" : "members only"} · {s.published ? "published" : "draft"}
                    </span>
                  </span>
                  <span className="flex gap-1">
                    <Link href={`/institute/practice?set=${s.id}`} className="btn-quiet" title="Preview">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button className="btn-quiet" onClick={() => setEditing({ id: s.id, title: s.title, description: s.description ?? "", visibility: s.visibility, published: s.published, questions: s.questions.map((q) => ({ question: q.question, options: [...q.options], answer: q.answer, explanation: q.explanation ?? "" })) })}>
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      className="btn-quiet text-slate-400 hover:text-red-600"
                      aria-label={`Delete ${s.title}`}
                      onClick={async () => {
                        if (!confirm(`Delete “${s.title}”? This cannot be undone.`)) return;
                        await instApi(`/sets?slug=${i.slug}&id=${s.id}`, "DELETE");
                        load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-5">
          {m.role === "owner" && <Details m={m} onSaved={load} />}
          <Staff m={m} onChange={load} />
        </div>
      </div>
    </div>
  );
}

function SetEditor({ slug, initial, onDone }: { slug: string; initial: SetForm; onDone: () => void }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const filled = f.questions.filter((q) => q.question.trim());
  async function save() {
    setBusy(true);
    setError("");
    const r = await instApi("/sets", "POST", { slug, ...f, description: f.description || undefined, questions: filled });
    setBusy(false);
    if (r.error) return setError(r.error);
    onDone();
  }
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h1 className="text-xl font-semibold">{f.id ? "Edit set" : "New set"}</h1>
        <input className="input text-base font-semibold" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title, e.g. Aptitude – Week 1" maxLength={120} aria-label="Set title" />
        <input className="input text-sm" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Short description (optional)" maxLength={400} aria-label="Description" />
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={f.visibility === "public"} onChange={() => setF({ ...f, visibility: "public" })} /> Public: anyone can practise
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={f.visibility === "members"} onChange={() => setF({ ...f, visibility: "members" })} /> Members only: students with your code
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Published
          </label>
        </div>
      </div>
      <QuestionsEditor value={f.questions} onChange={(questions) => setF({ ...f, questions })} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="sticky bottom-[var(--float-bottom,1rem)] flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-surface/95 p-3 backdrop-blur">
        <button className="btn-primary" onClick={save} disabled={busy || filled.length < 3 || f.title.trim().length < 3}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save set"}
        </button>
        <button className="btn-quiet" onClick={onDone}>
          Cancel
        </button>
        <span className="text-xs text-slate-500">{filled.length} questions · 3 to 200 · write them in your own words</span>
      </div>
    </div>
  );
}

function Details({ m, onSaved }: { m: Manage; onSaved: () => void }) {
  const i = m.institute;
  const [f, setF] = useState({ name: i.name, city: i.city ?? "", about: i.about ?? "", website: i.website ?? "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (i.verified && f.name.trim() !== i.name && !confirm("Changing the name removes the Verified badge until we check the page again. Continue?")) return;
    setBusy(true);
    const r = await instApi(`/manage?slug=${i.slug}`, "PATCH", { name: f.name, city: f.city || undefined, about: f.about || undefined, website: f.website || undefined });
    setBusy(false);
    setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: "Saved." });
    if (!r.error) onSaved();
  }
  return (
    <form onSubmit={save} className="card space-y-2">
      <h2 className="font-semibold">Page details</h2>
      <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={120} aria-label="Name" />
      <input className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="City" maxLength={80} aria-label="City" />
      <input className="input" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} placeholder="https://your-college.edu" maxLength={200} aria-label="Website" />
      <textarea className="input min-h-20" value={f.about} onChange={(e) => setF({ ...f, about: e.target.value })} placeholder="About (a line or two for students)" maxLength={600} aria-label="About" />
      {msg && <p className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</p>}
      <button className="btn-ghost" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save details"}
      </button>
    </form>
  );
}

function Staff({ m, onChange }: { m: Manage; onChange: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const owner = m.role === "owner";
  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await instApi("/staff", "POST", { slug: m.institute.slug, email });
    setBusy(false);
    if (r.error) return setError(r.error);
    setEmail("");
    onChange();
  }
  return (
    <section className="card space-y-2" aria-labelledby="staff-h">
      <h2 id="staff-h" className="font-semibold">
        Staff
      </h2>
      <p className="text-sm text-slate-600">{owner ? "Staff can add and edit question sets. They log in with the email you add." : "The owner decides who else manages this page."}</p>
      <ul className="divide-y divide-slate-100">
        {m.staff.map((s) => (
          <li key={s.email} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="min-w-0 truncate text-slate-800">{s.email}</span>
            {s.role === "owner" ? (
              <span className="chip shrink-0 bg-slate-100 text-slate-600">owner</span>
            ) : (
              owner && (
                <button
                  className="btn-quiet shrink-0 px-2 text-slate-400 hover:text-red-600"
                  aria-label={`Remove ${s.email}`}
                  onClick={async () => {
                    if (!confirm(`Remove ${s.email} from staff?`)) return;
                    await instApi("/staff", "DELETE", { slug: m.institute.slug, email: s.email });
                    onChange();
                  }}
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              )
            )}
          </li>
        ))}
      </ul>
      {owner && (
        <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="faculty@college.edu" aria-label="Staff email" />
          <button className="btn-ghost shrink-0" disabled={busy || !email.includes("@")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Add
          </button>
        </form>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </section>
  );
}
