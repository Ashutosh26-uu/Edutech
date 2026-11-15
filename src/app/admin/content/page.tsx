"use client";

import { BadgeCheck, Building2, CalendarDays, KeyRound, Loader2, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { EXAMS } from "@/data/exams";
import { useAccount } from "@/lib/account";
import { request } from "@/lib/api";
import { KIND, fmtDay, type EventKind, type ExamEvent } from "@/lib/calendar";
import { blankQuestion, QuestionsEditor } from "@/components/QuestionsEditor";
import type { DraftQuestion } from "@/lib/quizText";

type Tab = "quiz" | "calendar" | "access" | "institutes";
interface Role {
  role: "admin" | "editor" | null;
  organisation: string | null;
}
interface SavedQuiz {
  day: string;
  title: string;
  published: boolean;
  questions: DraftQuestion[];
  updatedAt: number;
}

async function call<T>(path: string, method = "GET", body?: object): Promise<{ ok: boolean; data: T | null; error?: string }> {
  try {
    const r = await request(path, { method, cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => null);
    return r.ok ? { ok: true, data: j as T } : { ok: false, data: null, error: j?.error ?? "Something went wrong." };
  } catch {
    return { ok: false, data: null, error: "You seem to be offline." };
  }
}

const istToday = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

/** Publishing for admins and editors: the daily current-affairs quiz, the exam calendar and (admins) access. */
export default function ContentAdminPage() {
  const account = useAccount();
  const [role, setRole] = useState<Role | null>(null);
  const [tab, setTab] = useState<Tab>("quiz");

  useEffect(() => {
    if (!account.ready || !account.user) return;
    call<Role>("/api/content/role").then((r) => setRole(r.data ?? { role: null, organisation: null }));
  }, [account.ready, account.user]);

  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user)
    return (
      <div className="card max-w-xl space-y-3 text-sm">
        <h1 className="text-xl font-semibold">Publishing</h1>
        <p className="text-slate-600">Log in with the email that was given publishing access.</p>
        <Link href="/login?next=/admin/content" className="btn-primary">
          Log in
        </Link>
      </div>
    );
  if (!role) return <PageSkeleton tiles={0} />;
  if (!role.role)
    return (
      <div className="card max-w-xl space-y-2 text-sm text-slate-600">
        <h1 className="text-xl font-semibold text-slate-900">No publishing access</h1>
        <p>
          This page is for people who publish the daily current-affairs quiz and the exam calendar. Ask the site admin to add <b>{account.user.email}</b>. See{" "}
          <Link href="/guide#editors" className="font-medium text-brand-700 hover:underline">
            how publishing access works
          </Link>
          .
        </p>
      </div>
    );

  const tabs: { id: Tab; label: string; icon: typeof Newspaper }[] = [
    { id: "quiz", label: "Daily quiz", icon: Newspaper },
    { id: "calendar", label: "Exam calendar", icon: CalendarDays },
    ...(role.role === "admin"
      ? [
          { id: "access" as Tab, label: "Access", icon: KeyRound },
          { id: "institutes" as Tab, label: "Institutes", icon: Building2 },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="eyebrow">{role.role === "admin" ? "Admin" : `Editor${role.organisation ? ` · ${role.organisation}` : ""}`}</p>
        <h1 className="text-2xl font-semibold">Publishing</h1>
        <p className="text-sm text-slate-600">
          What you publish appears on{" "}
          <Link href="/current-affairs" className="font-medium text-brand-700 hover:underline">
            Current affairs
          </Link>
          ,{" "}
          <Link href="/calendar" className="font-medium text-brand-700 hover:underline">
            Exam calendar
          </Link>{" "}
          and every student’s home page. Check facts and dates against an official source before publishing.
        </p>
      </header>
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`pill gap-1.5 ${tab === t.id ? "border-ink bg-ink text-on-ink hover:border-ink hover:text-on-ink" : ""}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>
      {tab === "quiz" && <QuizTab />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "access" && role.role === "admin" && <AccessTab />}
      {tab === "institutes" && role.role === "admin" && <InstitutesTab />}
    </div>
  );
}

// ---------- Daily quiz ----------

const blank = blankQuestion;

function QuizTab() {
  const [list, setList] = useState<SavedQuiz[] | null>(null);
  const [editing, setEditing] = useState<{ day: string; title: string; published: boolean; questions: DraftQuestion[] } | null>(null);
  const load = useCallback(() => call<{ quizzes: SavedQuiz[] }>("/api/content/quizzes").then((r) => setList(r.data?.quizzes ?? [])), []);
  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    const today = istToday();
    const taken = new Set(list?.map((q) => q.day));
    let day = today;
    for (let i = 0; taken.has(day) && i < 30; i++) day = new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
    setEditing({ day, title: `Current affairs · ${fmtDay(day)}`, published: true, questions: [blank(), blank(), blank(), blank(), blank()] });
  };

  if (editing) return <QuizEditor initial={editing} onDone={() => (setEditing(null), load())} />;
  return (
    <section className="space-y-3">
      <button className="btn-primary" onClick={startNew}>
        <Plus className="h-4 w-4" /> New quiz
      </button>
      {!list ? (
        <div className="skeleton h-24" />
      ) : list.length === 0 ? (
        <p className="card text-sm text-slate-600">No quizzes yet. Create the first one: 5 to 10 questions on recent news works well.</p>
      ) : (
        <ul className="card divide-y divide-slate-100 p-0 sm:p-0">
          {list.map((q) => (
            <li key={q.day} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="min-w-0">
                <span className="block font-medium text-slate-900">{q.title}</span>
                <span className="block text-xs text-slate-500">
                  {fmtDay(q.day)} · {q.questions.length} questions · {q.published ? (q.day > istToday() ? "scheduled" : "live") : "draft"}
                </span>
              </span>
              <span className="flex gap-1">
                <button className="btn-quiet" onClick={() => setEditing({ day: q.day, title: q.title, published: q.published, questions: q.questions.map((x) => ({ question: x.question, options: [...x.options], answer: x.answer, explanation: x.explanation ?? "" })) })}>
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button
                  className="btn-quiet text-slate-400 hover:text-red-600"
                  aria-label={`Delete ${q.title}`}
                  onClick={async () => {
                    if (!confirm(`Delete the quiz for ${fmtDay(q.day)}? This cannot be undone.`)) return;
                    await call(`/api/content/quizzes?day=${q.day}`, "DELETE");
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
  );
}

function QuizEditor({ initial, onDone }: { initial: { day: string; title: string; published: boolean; questions: DraftQuestion[] }; onDone: () => void }) {
  const [day, setDay] = useState(initial.day);
  const [title, setTitle] = useState(initial.title);
  const [published, setPublished] = useState(initial.published);
  const [qs, setQs] = useState(initial.questions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const filled = qs.filter((q) => q.question.trim());

  async function save() {
    setBusy(true);
    setError("");
    const r = await call("/api/content/quizzes", "POST", { day, title, published, questions: filled.map((q) => ({ ...q, options: q.options.map((o) => o.trim()) })) });
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "");
    onDone();
  }

  return (
    <section className="space-y-4">
      <div className="card grid gap-3 sm:grid-cols-[10rem_1fr_auto] sm:items-end">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Date</span>
          <input type="date" className="input" value={day} onChange={(e) => setDay(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-600">Title</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish
        </label>
      </div>

      <QuestionsEditor value={qs} onChange={setQs} />

      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="sticky bottom-[var(--float-bottom,1rem)] flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-surface/95 p-3 backdrop-blur">
        <button className="btn-primary" onClick={save} disabled={busy || filled.length < 3}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : published ? "Save and publish" : "Save draft"}
        </button>
        <button className="btn-quiet" onClick={onDone}>
          Cancel
        </button>
        <span className="text-xs text-slate-500">{filled.length} question{filled.length === 1 ? "" : "s"} · 3 to 25 · a quiz dated in the future goes live on that day</span>
      </div>
    </section>
  );
}

// ---------- Exam calendar ----------

const KINDS = Object.keys(KIND) as EventKind[];
const emptyEvent = () => ({ id: undefined as string | undefined, examId: "" as string, kind: "apply-end" as EventKind, title: "", day: istToday(), endDay: "", link: "", note: "" });

function CalendarTab() {
  const [list, setList] = useState<ExamEvent[] | null>(null);
  const [form, setForm] = useState<ReturnType<typeof emptyEvent> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const load = useCallback(() => call<{ events: ExamEvent[] }>("/api/content/events").then((r) => setList(r.data?.events ?? [])), []);
  useEffect(() => {
    load();
  }, [load]);
  const exams = useMemo(() => [...EXAMS].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)), []);
  const shown = (list ?? []).filter((e) => `${e.title} ${e.examName ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setError("");
    const r = await call("/api/content/events", "POST", { ...form, examId: form.examId || null, endDay: form.endDay || null, link: form.link || null, note: form.note || null });
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "");
    setForm(null);
    load();
  }

  return (
    <section className="space-y-3">
      {form ? (
        <form onSubmit={save} className="card space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">
              <span className="text-slate-600">Exam</span>
              <select className="input" value={form.examId} onChange={(e) => setForm({ ...form, examId: e.target.value })}>
                <option value="">Not a listed exam</option>
                {exams.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.category} · {x.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-600">What</span>
              <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as EventKind })}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {KIND[k].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="text-slate-600">Title</span>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. SSC CGL 2026: last date to apply online" maxLength={160} />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block space-y-1 text-sm">
              <span className="text-slate-600">Date</span>
              <input type="date" className="input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-600">Until (optional)</span>
              <input type="date" className="input" value={form.endDay} onChange={(e) => setForm({ ...form, endDay: e.target.value })} />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-600">Official link</span>
              <input className="input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://…" />
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="text-slate-600">Note (optional)</span>
            <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={500} placeholder="e.g. Fee payment till 11 pm" />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" disabled={busy || form.title.trim().length < 3}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : form.id ? "Save changes" : "Add to calendar"}
            </button>
            <button type="button" className="btn-quiet" onClick={() => (setForm(null), setError(""))}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={() => setForm(emptyEvent())}>
            <Plus className="h-4 w-4" /> Add a date
          </button>
          <input className="input max-w-xs" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events" aria-label="Search events" />
        </div>
      )}
      {!list ? (
        <div className="skeleton h-24" />
      ) : shown.length === 0 ? (
        <p className="card text-sm text-slate-600">No dates yet. Add application windows, admit cards, exam days and results, each with its official link.</p>
      ) : (
        <ul className="card divide-y divide-slate-100 p-0 sm:p-0">
          {shown.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className={`chip ${KIND[e.kind].tone}`}>{KIND[e.kind].label}</span>
                  {e.examName && <span className="chip bg-slate-100 text-slate-600">{e.examName}</span>}
                </span>
                <span className="mt-1 block font-medium text-slate-900">{e.title}</span>
                <span className="block text-xs text-slate-500">
                  {fmtDay(e.day)}
                  {e.endDay ? ` – ${fmtDay(e.endDay)}` : ""}
                  {e.link ? " · link" : " · no link"}
                </span>
              </span>
              <span className="flex gap-1">
                <button className="btn-quiet" onClick={() => setForm({ id: e.id, examId: e.examId ?? "", kind: e.kind, title: e.title, day: e.day, endDay: e.endDay ?? "", link: e.link ?? "", note: e.note ?? "" })}>
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button
                  className="btn-quiet text-slate-400 hover:text-red-600"
                  aria-label={`Delete ${e.title}`}
                  onClick={async () => {
                    if (!confirm(`Delete “${e.title}”?`)) return;
                    await call(`/api/content/events?id=${e.id}`, "DELETE");
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
  );
}

// ---------- Institutes (admins) ----------

interface AdminInstitute {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  verified: boolean;
  sets: number;
  createdAt: number;
}

/** Institute pages go live unverified; the admin checks each one and verifies or removes it. */
function InstitutesTab() {
  const [list, setList] = useState<AdminInstitute[] | null>(null);
  const load = useCallback(() => call<{ institutes: AdminInstitute[] }>("/api/content/institutes").then((r) => setList(r.data?.institutes ?? [])), []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <section className="space-y-3">
      <p className="text-sm text-slate-600">New pages appear here first. Open each one, check it is a real institute run by its own staff, then verify it. Remove fakes or spam.</p>
      {!list ? (
        <div className="skeleton h-16" />
      ) : list.length === 0 ? (
        <p className="card text-sm text-slate-600">No institute pages yet.</p>
      ) : (
        <ul className="card divide-y divide-slate-100 p-0 sm:p-0">
          {list.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="min-w-0">
                <Link href={`/institute?slug=${i.slug}`} className="block font-medium text-slate-900 hover:underline">
                  {i.name}
                </Link>
                <span className="block text-xs text-slate-500">
                  {i.city ? `${i.city} · ` : ""}
                  {i.sets} sets · created {new Date(i.createdAt).toLocaleDateString("en-IN")} · {i.verified ? "verified" : "not verified"}
                </span>
              </span>
              <span className="flex gap-1">
                <button
                  className={i.verified ? "btn-quiet" : "btn-ghost"}
                  onClick={async () => {
                    await call("/api/content/institutes", "PATCH", { id: i.id, verified: !i.verified });
                    load();
                  }}
                >
                  <BadgeCheck className="h-4 w-4" /> {i.verified ? "Unverify" : "Verify"}
                </button>
                <button
                  className="btn-quiet text-red-600"
                  onClick={async () => {
                    if (!confirm(`Remove “${i.name}” with all its sets? This cannot be undone.`)) return;
                    await call("/api/content/institutes", "DELETE", { id: i.id });
                    load();
                  }}
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------- Access (admins) ----------

function AccessTab() {
  const [list, setList] = useState<{ email: string; organisation: string | null; createdAt: number }[] | null>(null);
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(() => call<{ editors: { email: string; organisation: string | null; createdAt: number }[] }>("/api/content/editors").then((r) => setList(r.data?.editors ?? [])), []);
  useEffect(() => {
    load();
  }, [load]);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call("/api/content/editors", "POST", { email, organisation: org || undefined });
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "");
    setEmail("");
    setOrg("");
    load();
  }

  return (
    <section className="space-y-3">
      <form onSubmit={grant} className="card space-y-3">
        <div>
          <h2 className="font-semibold">Give publishing access</h2>
          <p className="text-sm text-slate-600">Editors can publish the daily quiz and exam dates. They cannot give access to others. The person logs in with this email; they don’t need an account yet.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.edu" aria-label="Email" />
          <input className="input" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organisation (optional)" aria-label="Organisation" maxLength={120} />
          <button className="btn-primary" disabled={busy || !email.includes("@")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Give access"}
          </button>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
      {!list ? (
        <div className="skeleton h-16" />
      ) : list.length === 0 ? (
        <p className="card text-sm text-slate-600">No editors yet. Admins are set with ADMIN_EMAILS on the server.</p>
      ) : (
        <ul className="card divide-y divide-slate-100 p-0 sm:p-0">
          {list.map((e) => (
            <li key={e.email} className="flex items-center justify-between gap-2 px-4 py-3">
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900">{e.email}</span>
                <span className="block text-xs text-slate-500">{e.organisation ?? "No organisation"} · since {new Date(e.createdAt).toLocaleDateString("en-IN")}</span>
              </span>
              <button
                className="btn-quiet text-red-600"
                onClick={async () => {
                  if (!confirm(`Remove publishing access for ${e.email}?`)) return;
                  await call("/api/content/editors", "DELETE", { email: e.email });
                  load();
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
