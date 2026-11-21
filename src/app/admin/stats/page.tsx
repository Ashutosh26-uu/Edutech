"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";
import { useAccount } from "@/lib/account";
import { IS_STATIC } from "@/lib/api";
import type { AdminStats, FunnelStep, RetentionCell } from "@/server/stats";

const EVENT_LABEL: Record<string, string> = {
  page_view: "Page views",
  practice_start: "Practice sets started",
  practice_finish: "Practice sets finished",
  mock_start: "Timed tests started",
  mock_submit: "Timed tests submitted",
  video_breakdown: "Video breakdowns",
  signup: "Sign-ups",
  purchase_click: "Purchase clicks",
  helpbot_open: "Help bot opened",
  share_click: "Share clicks",
  challenge_create: "Challenges created",
  challenge_play: "Challenges played",
};

const num = (n: number) => n.toLocaleString("en-IN");
const pct = (share: number | null) => (share === null ? "–" : `${share >= 0.1 ? Math.round(share * 100) : Math.round(share * 1000) / 10}%`);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/** The one-line definition shown under every number or table. */
function Meaning({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-slate-500">{children}</p>;
}

function Funnel({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((s) => s.count));
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={s.key} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-slate-900">
              {i + 1}. {s.label} <span className="font-normal text-slate-500">({s.unit === "people" ? "accounts" : "count of actions"})</span>
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-semibold text-slate-900">{num(s.count)}</span>
              {i > 0 && <span className="ml-2 text-slate-500">{pct(s.ofPrevious)} of step {i}</span>}
            </span>
          </div>
          <div className="h-2 rounded bg-slate-100" aria-hidden="true">
            <div className="h-2 rounded bg-brand-500" style={{ width: `${(s.count / max) * 100}%`, minWidth: s.count ? 2 : 0 }} />
          </div>
          <Meaning>{s.definition}</Meaning>
        </li>
      ))}
    </ol>
  );
}

function Cell({ c }: { c: RetentionCell }) {
  if (!c.eligible) return <td className="px-2 py-1.5 text-right text-slate-400" title="Nobody in this week signed up long enough ago yet">too early</td>;
  return (
    <td className="px-2 py-1.5 text-right tabular-nums" title={`${c.returned} of ${c.eligible} accounts that signed up long enough ago`}>
      <span className="font-medium text-slate-900">{pct(c.returned / c.eligible)}</span> <span className="text-xs text-slate-500">({c.returned}/{c.eligible})</span>
    </td>
  );
}

/** One bar per day; the tallest bar fills the row. */
function Bars({ days, value, label }: { days: { day: string }[]; value: (i: number) => number; label: string }) {
  const values = days.map((_, i) => value(i));
  const max = Math.max(1, ...values);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-slate-900">{label}</span>
        <span className="text-xs text-slate-500 tabular-nums">highest day {num(Math.max(0, ...values))}</span>
      </div>
      <div className="flex h-24 items-end gap-0.5" role="img" aria-label={`${label}, one bar per day, highest day ${Math.max(0, ...values)}`}>
        {days.map((d, i) => (
          <div key={d.day} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={`${d.day}: ${values[i]}`}>
            <div className="rounded-t bg-brand-500" style={{ height: `${(values[i] / max) * 100}%`, minHeight: values[i] ? 2 : 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** The founder's view: funnel, retention, daily actives and sales, for the accounts listed in ADMIN_EMAILS. */
export default function AdminStatsPage() {
  const account = useAccount();
  const [days, setDays] = useState<7 | 30>(7);
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [showDays, setShowDays] = useState(false);

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

  if (IS_STATIC || (account.ready && account.mode === "local")) return <div className="card text-sm">Stats run on the full site, not this demo build.</div>;
  if (!account.ready) return <PageSkeleton tiles={0} />;
  if (!account.user) return <div className="card text-sm">Log in with an admin account to see stats.</div>;
  if (error) return <div className="card text-sm text-red-600">{error}</div>;

  const max = Math.max(1, ...(data?.days.map((d) => d.views) ?? [1]));
  const total = data?.days.reduce((n, d) => n + d.views, 0) ?? 0;
  const live = data?.revenue.rows.filter((r) => r.mode === "live") ?? [];
  const demo = data?.revenue.rows.filter((r) => r.mode === "demo") ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex gap-4">
          <Link href="/admin/reports" className="text-sm text-brand-700 hover:underline">Question reports →</Link>
          <Link href="/admin/messages" className="text-sm text-brand-700 hover:underline">Contact messages →</Link>
        </div>
        <h1 className="text-2xl font-semibold">Is the product working?</h1>
        <p className="text-sm text-slate-600">
          Visitor numbers are daily counters only: no cookies, IPs or user ids are stored, and visits from localhost are not counted. Account numbers come from sign-ups, saved answers, timed tests and payments. Days are India time.
        </p>
      </div>
      <div className="flex gap-2">
        {([7, 30] as const).map((d) => (
          <button key={d} className={d === days ? "btn-primary px-3 py-1 text-xs" : "btn-ghost px-3 py-1 text-xs"} aria-pressed={d === days} onClick={() => setDays(d)}>
            Last {d} days
          </button>
        ))}
      </div>
      {!data ? (
        <PageSkeleton tiles={0} />
      ) : (
        <>
          <section className="card space-y-4">
            <div>
              <h2 className="font-semibold">Funnel: visit to payment</h2>
              <Meaning>
                {data.period.since} to {data.period.until}. Each step shows its count and its share of the step above. Steps 1 to 3 count actions by anyone; steps 4 to 6 count accounts, so the % across that change of unit is a rough guide.
              </Meaning>
            </div>
            <Funnel steps={data.funnel} />
          </section>

          <section className="card space-y-4">
            <div>
              <h2 className="font-semibold">What new sign-ups went on to do</h2>
              <Meaning>The same accounts all the way down, so every % here is exact: people who signed up in the period and what they have done since.</Meaning>
            </div>
            <Funnel steps={data.signupFunnel} />
          </section>

          <section className="card space-y-3">
            <h2 className="font-semibold">Retention by sign-up week</h2>
            <Meaning>{data.retention.definition}</Meaning>
            {!data.retention.cohorts.length ? (
              <p className="text-sm text-slate-500">No sign-ups in the last 8 weeks.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                      <th scope="col" className="px-2 py-1.5 font-medium">Signed up in week of</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Accounts</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Day 1+</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Day 7+</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Day 30+</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.retention.cohorts.map((c) => (
                      <tr key={c.week}>
                        <th scope="row" className="px-2 py-1.5 text-left font-normal text-slate-700" title={`${c.week} to ${c.weekEnd}`}>{c.week}</th>
                        <td className="px-2 py-1.5 text-right tabular-nums text-slate-900">{num(c.size)}</td>
                        <Cell c={c.day1} />
                        <Cell c={c.day7} />
                        <Cell c={c.day30} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Each day, last 30 days</h2>
              <button className="text-xs text-brand-700 hover:underline" aria-expanded={showDays} onClick={() => setShowDays((v) => !v)}>
                {showDays ? "Hide the numbers" : "Show the numbers"}
              </button>
            </div>
            <Bars days={data.daily.days} value={(i) => data.daily.days[i].activeUsers} label="Active accounts" />
            <Meaning>{data.daily.definition}</Meaning>
            <Bars days={data.daily.days} value={(i) => data.daily.days[i].practiceStarts} label="Practice sets started" />
            <Meaning>Untimed practice sets opened that day by anyone, logged in or not (practice_start counter).</Meaning>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{data.daily.days[0]?.day}</span>
              <span>{data.daily.days[data.daily.days.length - 1]?.day}</span>
            </div>
            {showDays && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                      <th scope="col" className="px-2 py-1.5 font-medium">Day</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Active accounts</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Practice sets started</th>
                      <th scope="col" className="px-2 py-1.5 text-right font-medium">Page views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...data.daily.days].reverse().map((d) => (
                      <tr key={d.day}>
                        <th scope="row" className="px-2 py-1 text-left font-normal text-slate-700">{d.day}</th>
                        <td className="px-2 py-1 text-right tabular-nums">{num(d.activeUsers)}</td>
                        <td className="px-2 py-1 text-right tabular-nums">{num(d.practiceStarts)}</td>
                        <td className="px-2 py-1 text-right tabular-nums">{num(d.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="card space-y-2">
              <h2 className="font-semibold">Top exams</h2>
              <Meaning>{data.topExams.definition}</Meaning>
              {!data.topExams.rows.length && <p className="text-sm text-slate-500">No timed tests in this period.</p>}
              <ul className="divide-y divide-slate-100 text-sm">
                {data.topExams.rows.map((e) => (
                  <li key={e.examId} className="flex justify-between gap-3 py-1.5">
                    <span className="min-w-0 truncate text-slate-700">{e.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{num(e.tests)} tests · {num(e.users)} accounts</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="card space-y-2">
              <h2 className="font-semibold">Top topics</h2>
              <Meaning>{data.topTopics.definition}</Meaning>
              {!data.topTopics.rows.length && <p className="text-sm text-slate-500">No saved answers in this period.</p>}
              <ul className="divide-y divide-slate-100 text-sm">
                {data.topTopics.rows.map((t) => (
                  <li key={t.topicId} className="flex justify-between gap-3 py-1.5">
                    <span className="min-w-0 truncate text-slate-700">{t.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{num(t.users)} accounts</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="card space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Paid orders and revenue</h2>
              <span className="text-sm text-slate-500 tabular-nums">{rupees(live.reduce((n, r) => n + r.rupees, 0))} total</span>
            </div>
            <Meaning>{data.revenue.definition}</Meaning>
            {!live.length && <p className="text-sm text-slate-500">No paid orders in this period.</p>}
            <ul className="divide-y divide-slate-100 text-sm">
              {live.map((r) => (
                <li key={r.productId} className="flex justify-between gap-3 py-1.5">
                  <span className="min-w-0 truncate text-slate-700">{r.name}</span>
                  <span className="shrink-0 tabular-nums text-slate-900">{num(r.orders)} orders · {num(r.payers)} accounts · {rupees(r.rupees)}</span>
                </li>
              ))}
            </ul>
            {demo.length > 0 && (
              <p className="text-xs text-amber-700">
                Also {num(demo.reduce((n, r) => n + r.orders, 0))} demo-mode payments in this period (no money was charged). On the live site this should be zero.
              </p>
            )}
          </section>

          <section className="card space-y-2">
            <h2 className="font-semibold">What this page cannot tell you yet</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              {data.notMeasured.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

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
            <Meaning>Pages opened per day in the chosen period (page_view counter); not unique people.</Meaning>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="card space-y-2">
              <h2 className="font-semibold">Top pages</h2>
              <Meaning>Page views by page in the period, ids replaced by “:id”. The 25 most viewed.</Meaning>
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
              <Meaning>How many times each action happened in the period, by anyone. Counts of actions, not people.</Meaning>
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
