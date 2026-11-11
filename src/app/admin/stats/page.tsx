"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";

interface Stats {
  since: string;
  days: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
  events: { name: string; count: number }[];
}

const EVENT_LABEL: Record<string, string> = {
  page_view: "Page views",
  practice_start: "Practice sets started",
  mock_start: "Timed tests started",
  mock_submit: "Timed tests submitted",
  video_breakdown: "Video breakdowns",
  signup: "Sign-ups",
  purchase_click: "Purchase clicks",
  helpbot_open: "Help bot opened",
  share_click: "Share clicks",
};

/** Daily visitor counters (no personal data), for the accounts listed in ADMIN_EMAILS. */
export default function AdminStatsPage() {
  const account = useAccount();
  const [days, setDays] = useState<7 | 30>(7);
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (IS_STATIC || !account.ready || !account.user) return;
    setData(null);
    fetch(`/api/admin/stats?days=${days}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) return setError((await r.json().catch(() => ({}))).error ?? "Could not load stats.");
        setError("");
        setData(await r.json());
      })
      .catch(() => setError("Could not load stats."));
  }, [account.ready, account.user, days]);

  if (IS_STATIC || (account.ready && account.mode === "local")) return <div className="card text-sm">Visitor stats run on the full site, not this demo build.</div>;
  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user) return <div className="card text-sm">Log in with an admin account to see visitor stats.</div>;
  if (error) return <div className="card text-sm text-red-600">{error}</div>;

  const max = Math.max(1, ...(data?.days.map((d) => d.views) ?? [1]));
  const total = data?.days.reduce((n, d) => n + d.views, 0) ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex gap-4">
          <Link href="/admin/reports" className="text-sm text-brand-700 hover:underline">Question reports →</Link>
          <Link href="/admin/messages" className="text-sm text-brand-700 hover:underline">Contact messages →</Link>
        </div>
        <h1 className="text-2xl font-semibold">Visitor stats</h1>
        <p className="text-sm text-slate-600">Daily counters only: no cookies, IPs or user ids are stored. Days are India time. Visits from localhost are not counted.</p>
      </div>
      <div className="flex gap-2">
        {([7, 30] as const).map((d) => (
          <button key={d} className={d === days ? "btn-primary px-3 py-1 text-xs" : "btn-ghost px-3 py-1 text-xs"} onClick={() => setDays(d)}>
            Last {d} days
          </button>
        ))}
      </div>
      {!data ? (
        <PageSkeleton tiles={0} />
      ) : (
        <>
          <section className="card space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Page views per day</h2>
              <span className="text-sm text-slate-500 tabular-nums">{total.toLocaleString("en-IN")} total</span>
            </div>
            <div className="flex h-36 items-end gap-0.5" role="img" aria-label={`Page views per day, ${total} in total`}>
              {data.days.map((d) => (
                <div key={d.day} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={`${d.day}: ${d.views}`}>
                  <div className="rounded-t bg-brand-500" style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views ? 2 : 0 }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{data.days[0]?.day}</span>
              <span>{data.days[data.days.length - 1]?.day}</span>
            </div>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="card space-y-2">
              <h2 className="font-semibold">Top pages</h2>
              {!data.topPages.length && <p className="text-sm text-slate-500">No views yet.</p>}
              <ul className="divide-y divide-slate-100 text-sm">
                {data.topPages.map((p) => (
                  <li key={p.path} className="flex justify-between gap-3 py-1.5">
                    <span className="min-w-0 truncate font-mono text-xs text-slate-700">{p.path}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{p.views}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="card space-y-2">
              <h2 className="font-semibold">Events</h2>
              {!data.events.length && <p className="text-sm text-slate-500">No events yet.</p>}
              <ul className="divide-y divide-slate-100 text-sm">
                {data.events.map((e) => (
                  <li key={e.name} className="flex justify-between gap-3 py-1.5">
                    <span className="text-slate-700">{EVENT_LABEL[e.name] ?? e.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{e.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
