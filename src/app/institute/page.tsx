"use client";

import { ArrowLeft, ArrowRight, ExternalLink, Loader2, Lock, MapPin, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { StaticNotice } from "@/components/StaticNotice";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import { instApi } from "@/lib/institutes";

interface Page {
  institute: { slug: string; name: string; city: string | null; about: string | null; website: string | null; verified: boolean };
  role: "owner" | "staff" | null;
  member: boolean;
  members: number;
  sets: { id: string; title: string; description: string | null; visibility: "public" | "members"; count: number; updatedAt: number; locked: boolean }[];
}

export default function InstitutePage() {
  return (
    <Suspense fallback={<PageSkeleton tiles={2} />}>
      <Institute />
    </Suspense>
  );
}

function Institute() {
  const slug = useSearchParams().get("slug") ?? "";
  const account = useAccount();
  const [p, setP] = useState<Page | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => instApi<Page>(`/page?slug=${encodeURIComponent(slug)}`).then((r) => (r.data ? setP(r.data) : setError(r.error ?? ""))), [slug]);
  useEffect(() => {
    if (!IS_STATIC && account.ready) load();
  }, [account.ready, account.user, load]);

  if (IS_STATIC) return <StaticNotice>Institute pages are on the full site.</StaticNotice>;
  if (error)
    return (
      <div className="card space-y-2 text-sm">
        <p className="text-red-700">{error}</p>
        <Link href="/institutes" className="font-medium text-brand-700 hover:underline">
          See all institutes
        </Link>
      </div>
    );
  if (!p) return <PageSkeleton tiles={2} />;
  const i = p.institute;
  const hasLocked = p.sets.some((s) => s.locked);

  return (
    <div className="space-y-6">
      <Link href="/institutes" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Institutes
      </Link>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <VerifiedBadge verified={i.verified} />
          {p.member && <span className="chip bg-brand-50 text-brand-700">You’re a student here</span>}
        </div>
        <h1 className="text-3xl font-semibold">{i.name}</h1>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          {i.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {i.city}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" /> {p.members} student{p.members === 1 ? "" : "s"} joined
          </span>
          {i.website && (
            <a href={i.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-slate-900">
              Website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </p>
        {i.about && <p className="max-w-2xl text-slate-600">{i.about}</p>}
        {p.role && (
          <Link href={`/institute/manage?slug=${i.slug}`} className="btn-primary">
            <Settings className="h-4 w-4" /> Manage this page
          </Link>
        )}
        {!i.verified && <p className="max-w-2xl text-xs text-slate-500">This page was created by its users and hasn’t been checked by StudyClip yet. Questions are written by the institute.</p>}
      </header>

      {hasLocked && !p.member && !p.role && <JoinBox loggedIn={!!account.user} slug={i.slug} onJoined={load} />}

      <section className="space-y-3" aria-labelledby="sets-h">
        <h2 id="sets-h" className="font-semibold">
          Practice sets
        </h2>
        {p.sets.length === 0 ? (
          <p className="card text-sm text-slate-600">No sets published yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.sets.map((s) => (
              <li key={s.id}>
                {s.locked ? (
                  <div className="card flex h-full flex-col gap-1 opacity-75">
                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                      <Lock className="h-4 w-4 text-slate-400" /> {s.title}
                    </span>
                    {s.description && <span className="text-sm text-slate-600">{s.description}</span>}
                    <span className="mt-auto pt-2 text-xs text-slate-500">{s.count} questions · for this institute’s students</span>
                  </div>
                ) : (
                  <Link href={`/institute/practice?set=${s.id}`} className="card-link flex h-full flex-col gap-1 p-4">
                    <span className="flex items-start justify-between gap-2 font-semibold text-slate-900">
                      {s.title} <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </span>
                    {s.description && <span className="text-sm text-slate-600">{s.description}</span>}
                    <span className="mt-auto pt-2 text-xs text-slate-500">
                      {s.count} questions{s.visibility === "members" ? " · members only" : ""}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function JoinBox({ loggedIn, slug, onJoined }: { loggedIn: boolean; slug: string; onJoined: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await instApi("/join", "POST", { code });
    setBusy(false);
    if (r.error) return setError(r.error);
    onJoined();
  }
  return (
    <form onSubmit={join} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-slate-900">Studying here?</p>
        <p className="text-sm text-slate-600">Enter the code from your institute to unlock the members-only sets.</p>
      </div>
      {loggedIn ? (
        <div className="flex gap-2">
          <input className="input w-36 font-mono uppercase tracking-widest" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABC123" maxLength={12} aria-label="Institute code" />
          <button className="btn-primary shrink-0" disabled={busy || code.trim().length < 6}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
          </button>
        </div>
      ) : (
        <Link href={`/login?next=${encodeURIComponent(`/institute?slug=${slug}`)}`} className="btn-ghost">
          Log in to join
        </Link>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
