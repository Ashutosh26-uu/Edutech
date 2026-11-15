"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { useAccount } from "@/lib/account";
import { request } from "@/lib/api";

interface Reported {
  id: string;
  questionId: string;
  body: string;
  hidden: boolean;
  reports: number;
  createdAt: number;
  name: string;
}

/** Reported doubts (most reports first), for the accounts listed in ADMIN_EMAILS. */
export default function AdminDoubtsPage() {
  const account = useAccount();
  const [posts, setPosts] = useState<Reported[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await request("/api/discuss?reported=1", { cache: "no-store" }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok) setPosts(d.posts);
    else setError(d.error ?? "Could not load reported posts.");
  }, []);
  useEffect(() => {
    if (account.ready && account.user) load();
  }, [account.ready, account.user, load]);

  async function act(method: string, path: string, body?: object) {
    const r = await request(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined }).catch(() => null);
    if (!r?.ok) alert("Could not save. Please try again.");
    load();
  }

  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user) return <div className="card text-sm">Log in with an admin account to review doubts.</div>;
  if (error) return <div className="card text-sm text-red-600">{error}</div>;
  if (!posts) return <PageSkeleton tiles={0} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Reported doubts</h1>
        <Link href="/admin/reports" className="text-sm text-brand-700 hover:underline">
          Question reports →
        </Link>
      </div>
      <p className="text-sm text-slate-600">Posts with 3 reports are hidden automatically. Restore a post to clear its reports, or delete it with its replies.</p>
      {posts.length === 0 && <p className="card text-sm text-slate-500">Nothing reported. 🎉</p>}
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="card space-y-2 text-sm">
            <p className="text-xs text-slate-500">
              <b className="text-slate-700">{p.name}</b> · {new Date(p.createdAt).toLocaleString()} · <span className="font-mono">{p.questionId}</span> · {p.reports} report{p.reports === 1 ? "" : "s"}
              {p.hidden && <span className="text-red-700"> · hidden</span>}
            </p>
            <p className="whitespace-pre-line break-words text-slate-900">{p.body}</p>
            <div className="flex gap-2">
              <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => act("PATCH", "/api/discuss", { id: p.id, hidden: !p.hidden })}>
                {p.hidden ? "Restore" : "Hide"}
              </button>
              <button className="btn-quiet px-3 py-1.5 text-xs" onClick={() => confirm("Delete this post and its replies?") && act("DELETE", `/api/discuss?id=${p.id}`)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
