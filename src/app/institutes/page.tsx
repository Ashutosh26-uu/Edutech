"use client";

import { ArrowRight, Building2, Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { instApi, instituteHref } from "@/lib/institutes";

interface Data {
  institutes: { slug: string; name: string; city: string | null; verified: boolean; sets: number; questions: number }[];
  mine: { running: { slug: string; name: string; verified: boolean; role: "owner" | "staff" }[]; joined: { slug: string; name: string; verified: boolean }[] } | null;
}

export default function InstitutesPage() {
  const account = useAccount();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const load = useCallback(() => instApi<Data>("").then((r) => (r.data ? setData(r.data) : setError(r.error ?? ""))), []);
  useEffect(() => {
    if (!IS_STATIC && account.ready) load();
  }, [account.ready, account.user, load]);

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return (data?.institutes ?? []).filter((i) => words.every((w) => `${i.name} ${i.city ?? ""}`.toLowerCase().includes(w)));
  }, [data, q]);

  if (IS_STATIC) return <StaticNotice>Institute pages are on the full site.</StaticNotice>;
  if (!data && !error) return <PageSkeleton tiles={2} />;

  return (
    <div className="space-y-6">
      <PageHeader path="/institutes" title="Institutes" intro="Practice sets published by colleges, universities and coaching institutes. Public sets are free for everyone; some are only for the institute’s own students." />
      {error && <p className="card text-sm text-red-700">{error}</p>}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="space-y-3" aria-labelledby="dir-h">
          <h2 id="dir-h" className="sr-only">
            All institutes
          </h2>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input className="input pl-9" placeholder="Search by name or city" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search institutes" />
          </label>
          {shown.length === 0 ? (
            <p className="card text-sm text-slate-600">{data?.institutes.length ? `No institute matches “${q}”.` : "No institute has published a set yet. Be the first: create your institute’s page on the right."}</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {shown.map((i) => (
                <li key={i.slug}>
                  <Link href={instituteHref(i.slug)} className="card-link flex h-full flex-col gap-2 p-4">
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0 font-semibold text-slate-900">{i.name}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </span>
                    <span className="text-xs text-slate-500">
                      {i.city ? `${i.city} · ` : ""}
                      {i.sets} set{i.sets === 1 ? "" : "s"}
                      {i.questions ? ` · ${i.questions} public questions` : ""}
                    </span>
                    <span className="mt-auto">
                      <VerifiedBadge verified={i.verified} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-5">
          {data?.mine && (data.mine.running.length > 0 || data.mine.joined.length > 0) && (
            <section className="card space-y-2" aria-labelledby="mine-h">
              <h2 id="mine-h" className="font-semibold">
                Yours
              </h2>
              <ul className="space-y-1 text-sm">
                {data.mine.running.map((i) => (
                  <li key={`r-${i.slug}`} className="flex items-center justify-between gap-2">
                    <Link href={instituteHref(i.slug)} className="truncate font-medium text-slate-900 hover:underline">
                      {i.name}
                    </Link>
                    <Link href={`/institute/manage?slug=${i.slug}`} className="btn-quiet shrink-0">
                      Manage
                    </Link>
                  </li>
                ))}
                {data.mine.joined.map((i) => (
                  <li key={`j-${i.slug}`} className="flex items-center justify-between gap-2">
                    <Link href={instituteHref(i.slug)} className="truncate text-slate-700 hover:underline">
                      {i.name}
                    </Link>
                    <span className="chip shrink-0 bg-slate-100 text-slate-600">student</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <JoinInstitute onJoined={(slug) => router.push(instituteHref(slug))} loggedIn={!!account.user} />
          <CreateInstitute loggedIn={!!account.user} onCreated={(slug) => router.push(`/institute/manage?slug=${slug}`)} />
        </div>
      </div>
    </div>
  );
}

function JoinInstitute({ loggedIn, onJoined }: { loggedIn: boolean; onJoined: (slug: string) => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await instApi<{ slug: string }>("/join", "POST", { code });
    setBusy(false);
    if (r.data) onJoined(r.data.slug);
    else setError(r.error ?? "");
  }
  return (
    <form onSubmit={join} className="card space-y-2">
      <h2 className="font-semibold">Got a code from your college?</h2>
      <p className="text-sm text-slate-600">Enter it to unlock your institute’s members-only sets.</p>
      {loggedIn ? (
        <div className="flex gap-2">
          <input className="input font-mono uppercase tracking-widest" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABC123" maxLength={12} aria-label="Institute code" />
          <button className="btn-primary shrink-0" disabled={busy || code.trim().length < 6}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
          </button>
        </div>
      ) : (
        <Link href="/login?next=/institutes" className="btn-ghost">
          Log in to enter a code
        </Link>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

function CreateInstitute({ loggedIn, onCreated }: { loggedIn: boolean; onCreated: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await instApi<{ slug: string }>("", "POST", { name, city: city || undefined });
    setBusy(false);
    if (r.data) onCreated(r.data.slug);
    else setError(r.error ?? "");
  }
  return (
    <section className="card space-y-2" aria-labelledby="create-h">
      <h2 id="create-h" className="flex items-center gap-2 font-semibold">
        <Building2 className="h-4 w-4 text-slate-500" /> For colleges and institutes
      </h2>
      <p className="text-sm text-slate-600">Create your institute’s page, add your own question sets and let your students (or everyone) practise them. Your page goes live at once and gets a Verified badge after we check it.</p>
      {!loggedIn ? (
        <Link href="/login?next=/institutes" className="btn-ghost">
          Log in to create a page
        </Link>
      ) : !open ? (
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Create institute page
        </button>
      ) : (
        <form onSubmit={create} className="space-y-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name, e.g. ABC Institute of Technology" maxLength={120} aria-label="Institute name" autoFocus />
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (optional)" maxLength={80} aria-label="City" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" disabled={busy || name.trim().length < 3}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create page"}
            </button>
            <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
