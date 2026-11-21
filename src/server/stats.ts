import "server-only";
import { sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import { TOPIC_BY_ID } from "@/data/topics";
import { PRODUCTS } from "@/lib/products";
import { istDay, statsFor } from "./events";

/**
 * The founder's view on /admin/stats: a funnel, retention, daily actives, top exams and topics,
 * and paid orders. Everything is aggregated in SQL from tables that already exist; nothing here
 * returns a name, an email or a user id. Each number carries the sentence that defines it, and
 * what today's data cannot answer is listed in `notMeasured` instead of being guessed.
 */

const DAY_MS = 24 * 60 * 60_000;
/** Retention cohorts: sign-up weeks shown (this week and the seven before it). */
const COHORT_WEEKS = 8;
/** Daily actives always cover this many days, whatever period is chosen. */
const DAILY_DAYS = 30;

export interface FunnelStep {
  key: string;
  label: string;
  count: number;
  /** What is counted: anonymous event counters count actions, the account tables count people. */
  unit: "events" | "people";
  /** Share of the step before it (0 to 1); null for the first step or when that step is zero. */
  ofPrevious: number | null;
  definition: string;
}

export interface RetentionCell {
  /** Users of the cohort who signed up at least N days ago, so they could have come back. */
  eligible: number;
  returned: number;
}

const rows = async <T>(q: SQL) => (await db.execute(q)) as unknown as T[];
const steps = (list: Omit<FunnelStep, "ofPrevious">[]): FunnelStep[] =>
  list.map((s, i) => ({ ...s, ofPrevious: i > 0 && list[i - 1].count > 0 ? s.count / list[i - 1].count : null }));

export async function adminStats(days: 7 | 30, now = Date.now()) {
  const nowIso = new Date(now).toISOString();
  // Periods start at midnight India time, like the daily event counters.
  const since = istDay(days - 1, now);
  const from = `${since}T00:00:00+05:30`;
  const dailySince = istDay(DAILY_DAYS - 1, now);
  const dailyFrom = `${dailySince}T00:00:00+05:30`;
  const today = istDay(0, now);
  const inPeriod = (col: SQL) => sql`${col} >= ${from}::timestamptz and ${col} <= ${nowIso}::timestamptz`;
  const inDaily = (col: SQL) => sql`${col} >= ${dailyFrom}::timestamptz and ${col} <= ${nowIso}::timestamptz`;
  const istDate = (col: SQL) => sql`(${col} at time zone 'Asia/Kolkata')::date`;

  const [base, people, cohort, payers, byProduct, topExams, topTopics, retention, activeDays, eventDays] = await Promise.all([
    statsFor(days, now),
    rows<{ signups: number; test_takers: number; test_submitters: number }>(sql`
      select
        (select count(*)::int from users where ${inPeriod(sql`created_at`)}) as signups,
        (select count(distinct user_id)::int from test_attempts where ${inPeriod(sql`started_at`)}) as test_takers,
        (select count(distinct user_id)::int from test_attempts where ${inPeriod(sql`submitted_at`)}) as test_submitters`),
    // What the people who signed up in the period went on to do (at any time since).
    rows<{ signed: number; answered: number; started: number; submitted: number; paid: number }>(sql`
      select
        count(*)::int as signed,
        (count(*) filter (where exists (select 1 from topic_stats s where s.user_id = u.id)))::int as answered,
        (count(*) filter (where exists (select 1 from test_attempts a where a.user_id = u.id)))::int as started,
        (count(*) filter (where exists (select 1 from test_attempts a where a.user_id = u.id and a.submitted_at is not null)))::int as submitted,
        (count(*) filter (where exists (select 1 from payments p where p.user_id = u.id and p.status = 'paid' and p.mode = 'live')))::int as paid
      from users u where ${inPeriod(sql`u.created_at`)}`),
    rows<{ payers: number }>(sql`
      select count(distinct coalesce(user_id::text, order_id))::int as payers
      from payments where status = 'paid' and mode = 'live' and ${inPeriod(sql`coalesce(paid_at, created_at)`)}`),
    rows<{ product_id: string; mode: string; orders: number; payers: number; paise: number }>(sql`
      select product_id, mode, count(*)::int as orders, count(distinct coalesce(user_id::text, order_id))::int as payers, coalesce(sum(amount_paise), 0)::int as paise
      from payments where status = 'paid' and ${inPeriod(sql`coalesce(paid_at, created_at)`)}
      group by product_id, mode order by paise desc`),
    rows<{ exam_id: string; tests: number; users: number }>(sql`
      select exam_id, count(*)::int as tests, count(distinct user_id)::int as users
      from test_attempts where ${inPeriod(sql`started_at`)}
      group by exam_id order by tests desc, exam_id limit 10`),
    rows<{ topic_id: string; users: number }>(sql`
      select topic_id, count(*)::int as users
      from topic_stats where ${inPeriod(sql`last_practiced`)}
      group by topic_id order by users desc, topic_id limit 10`),
    // One row per sign-up week. "Last active" is the latest thing the account is known to have
    // done; every lookup is by user id on an existing index.
    rows<{ week: string; size: number; e1: number; r1: number; e7: number; r7: number; e30: number; r30: number }>(sql`
      with u as (
        select id, created_at from users
        where created_at <= ${nowIso}::timestamptz
          and created_at >= (date_trunc('week', ${nowIso}::timestamptz at time zone 'Asia/Kolkata') - interval '${sql.raw(String(COHORT_WEEKS - 1))} weeks') at time zone 'Asia/Kolkata'
      ), a as (
        select u.created_at, greatest(
          (select max(last_practiced) from topic_stats where user_id = u.id),
          (select max(greatest(started_at, coalesce(submitted_at, started_at))) from test_attempts where user_id = u.id),
          (select max(updated_at) from user_data where user_id = u.id),
          (select max(started_at) from challenge_starts where user_id = u.id),
          (select max(created_at) from payments where user_id = u.id)
        ) as last_active
        from u
      )
      select to_char(date_trunc('week', created_at at time zone 'Asia/Kolkata'), 'YYYY-MM-DD') as week,
        count(*)::int as size,
        (count(*) filter (where created_at + interval '1 day' <= ${nowIso}::timestamptz))::int as e1,
        (count(*) filter (where created_at + interval '1 day' <= ${nowIso}::timestamptz and last_active >= created_at + interval '1 day'))::int as r1,
        (count(*) filter (where created_at + interval '7 days' <= ${nowIso}::timestamptz))::int as e7,
        (count(*) filter (where created_at + interval '7 days' <= ${nowIso}::timestamptz and last_active >= created_at + interval '7 days'))::int as r7,
        (count(*) filter (where created_at + interval '30 days' <= ${nowIso}::timestamptz))::int as e30,
        (count(*) filter (where created_at + interval '30 days' <= ${nowIso}::timestamptz and last_active >= created_at + interval '30 days'))::int as r30
      from a group by 1 order by 1 desc`),
    rows<{ day: string; users: number }>(sql`
      select to_char(d, 'YYYY-MM-DD') as day, count(distinct user_id)::int as users from (
        select user_id, ${istDate(sql`started_at`)} as d from test_attempts where ${inDaily(sql`started_at`)}
        union all select user_id, ${istDate(sql`submitted_at`)} from test_attempts where ${inDaily(sql`submitted_at`)}
        union all select user_id, ${istDate(sql`last_practiced`)} from topic_stats where ${inDaily(sql`last_practiced`)}
        union all select user_id, ${istDate(sql`updated_at`)} from user_data where ${inDaily(sql`updated_at`)}
        union all select user_id, ${istDate(sql`started_at`)} from challenge_starts where ${inDaily(sql`started_at`)}
        union all select id, ${istDate(sql`created_at`)} from users where ${inDaily(sql`created_at`)}
      ) x group by d`),
    rows<{ day: string; views: number; practice: number }>(sql`
      select to_char(day, 'YYYY-MM-DD') as day,
        coalesce(sum(count) filter (where name = 'page_view'), 0)::int as views,
        coalesce(sum(count) filter (where name = 'practice_start'), 0)::int as practice
      from event_counts where day >= ${dailySince}::date and day <= ${today}::date and name in ('page_view', 'practice_start')
      group by day`),
  ]);

  const ev = (name: string) => base.events.find((e) => e.name === name)?.count ?? 0;
  const p = people[0];
  const c = cohort[0];

  const funnel = steps([
    { key: "visits", label: "Page views", unit: "events", count: ev("page_view"), definition: "Pages opened on the live site in the period (page_view counter). One person opening five pages counts five times: unique visitors are not recorded." },
    { key: "practice_start", label: "Practice sets started", unit: "events", count: ev("practice_start"), definition: "Untimed practice sets opened, logged in or not (practice_start counter). One per set, not per person." },
    { key: "practice_finish", label: "Practice sets finished", unit: "events", count: ev("practice_finish"), definition: "Untimed practice sets answered to the end, logged in or not (practice_finish counter). One per set. Counted only from the day the practice page starts sending this event." },
    { key: "signup", label: "Signed up", unit: "people", count: p.signups, definition: "Accounts created in the period (rows in users by created_at). Accounts deleted since are not counted." },
    { key: "timed_test", label: "Took a timed test", unit: "people", count: p.test_takers, definition: "Different accounts that started at least one timed test in the period (test_attempts by started_at), whenever they signed up." },
    { key: "paid", label: "Paid", unit: "people", count: payers[0].payers, definition: "Different accounts with at least one successful live payment in the period (payments with status paid, mode live). Demo payments are left out." },
  ]);

  const signupFunnel = steps([
    { key: "signed", label: "Signed up in the period", unit: "people", count: c.signed, definition: "Accounts created in the period. Every later step counts only these same accounts." },
    { key: "answered", label: "Had answers saved", unit: "people", count: c.answered, definition: "Of those, accounts with any saved answers: a finished practice set or a submitted timed test (a row in topic_stats)." },
    { key: "started", label: "Started a timed test", unit: "people", count: c.started, definition: "Of those, accounts that started any timed test (test_attempts)." },
    { key: "submitted", label: "Submitted a timed test", unit: "people", count: c.submitted, definition: "Of those, accounts that submitted a timed test (test_attempts with submitted_at)." },
    { key: "paid", label: "Paid", unit: "people", count: c.paid, definition: "Of those, accounts with a successful live payment at any time since signing up." },
  ]);

  const activeBy = new Map(activeDays.map((d) => [d.day, d.users]));
  const eventBy = new Map(eventDays.map((d) => [d.day, d]));
  const daily = Array.from({ length: DAILY_DAYS }, (_, i) => {
    const day = istDay(DAILY_DAYS - 1 - i, now);
    return { day, activeUsers: activeBy.get(day) ?? 0, views: eventBy.get(day)?.views ?? 0, practiceStarts: eventBy.get(day)?.practice ?? 0 };
  });

  return {
    ...base,
    period: { days, since, until: today },
    funnel,
    signupFunnel,
    testsSubmittedBy: p.test_submitters,
    retention: {
      definition:
        "Accounts grouped by the week they signed up (Monday to Sunday, India time). \"Day N\" is the share still active N or more days after signing up: their latest saved practice, timed test, synced data, challenge or payment is at least N × 24 hours after sign-up. Only accounts that signed up at least N days ago are counted in a cell.",
      cohorts: retention.map((r) => ({
        week: r.week,
        weekEnd: new Date(Date.parse(`${r.week}T00:00:00Z`) + 6 * DAY_MS).toISOString().slice(0, 10),
        size: r.size,
        day1: { eligible: r.e1, returned: r.r1 } as RetentionCell,
        day7: { eligible: r.e7, returned: r.r7 } as RetentionCell,
        day30: { eligible: r.e30, returned: r.r30 } as RetentionCell,
      })),
    },
    daily: {
      definition:
        "Active accounts: different logged-in accounts with something saved that day (signed up, started or submitted a timed test, saved practice answers, synced data, opened a challenge). Practice and sync keep only their latest date, so earlier days read low for people who came back later: treat past days as a minimum. Visitors who are not logged in are not in this number.",
      days: daily,
    },
    topExams: {
      definition: "Timed tests started in the period, by exam (test_attempts). Untimed practice does not record which exam it was for.",
      rows: topExams.map((e) => ({ examId: e.exam_id, name: EXAM_BY_ID.get(e.exam_id)?.name ?? e.exam_id, tests: e.tests, users: e.users })),
    },
    topTopics: {
      definition: "Accounts whose latest saved answers in a topic (practice or timed test) fall in the period (topic_stats by last_practiced). Logged-in accounts only.",
      rows: topTopics.map((t) => ({ topicId: t.topic_id, name: TOPIC_BY_ID.get(t.topic_id)?.name ?? t.topic_id, users: t.users })),
    },
    revenue: {
      definition: "Successful payments in the period by product (payments with status paid, by paid time). Revenue is the amount charged, before gateway fees, tax and refunds. Demo-mode payments are listed apart and are not money.",
      rows: byProduct.map((r) => ({
        productId: r.product_id,
        name: (PRODUCTS as Record<string, { name: string } | undefined>)[r.product_id]?.name ?? r.product_id,
        mode: r.mode as "live" | "demo",
        orders: r.orders,
        payers: r.payers,
        rupees: r.paise / 100,
      })),
    },
    notMeasured: [
      "Unique visitors: the site stores no cookie, device id or IP, only a count per day, event and page. So the first funnel steps count actions, not people, and the % between an action step and a people step is only a rough guide.",
      "Retention of visitors who never log in: nothing links two visits from the same device.",
      "Exact-day retention (\"came back on day 7 itself\"): practice keeps only the latest date per topic, so the table shows \"still active on day N or later\" instead.",
      "Which exam untimed practice was for: the practice counter stores only the page path, without the exam.",
      "Practice sets finished before the practice_finish event went live: only logged-in practice was saved, and only as per-topic totals.",
    ],
  };
}

export type AdminStats = Awaited<ReturnType<typeof adminStats>>;
