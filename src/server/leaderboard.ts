import "server-only";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { EXAM_BY_ID } from "@/data/exams";
import type { SessionUser } from "./auth";
import { HttpError } from "./http";

/** Tests that count towards a week's points: each user's best few, so buying credits cannot buy the top spot. */
export const BEST_OF = 5;
const TOP = 50;
const IST_MS = 330 * 60_000; // Asia/Kolkata is UTC+5:30 all year

/** Monday 00:00 to next Monday 00:00 in Asia/Kolkata, for the week containing `now`. */
export function istWeek(now = Date.now()) {
  const ist = new Date(now + IST_MS);
  const day = (ist.getUTCDay() + 6) % 7; // 0 = Monday
  const mondayIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - day);
  const start = new Date(mondayIst - IST_MS);
  return { start, end: new Date(start.getTime() + 7 * 24 * 60 * 60_000) };
}

// Small list of words that cannot appear in a public name (English and common Hinglish).
const BLOCKED = ["fuck", "shit", "bitch", "cunt", "dick", "pussy", "slut", "whore", "nigg", "rape", "porn", "sex", "chutiya", "madarchod", "bhenchod", "behenchod", "bsdk", "gandu", "randi", "lund", "chod", "admin", "studyclip", "moderator"];

/** Null when the name is fine, else the reason it is not. */
export function nameProblem(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 3 || name.length > 20) return "Use 3 to 20 characters.";
  if (!/^[A-Za-z0-9 ]+$/.test(name)) return "Use only letters, numbers and spaces.";
  const flat = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (BLOCKED.some((w) => flat.includes(w))) return "Please choose a different name.";
  return null;
}

export async function getProfile(user: SessionUser) {
  const [row] = await db.select({ displayName: schema.users.displayName, leaderboard: schema.users.leaderboard }).from(schema.users).where(eq(schema.users.id, user.id));
  return { displayName: row?.displayName ?? null, leaderboard: row?.leaderboard ?? false };
}

export async function setProfile(user: SessionUser, displayName: string | null, leaderboard: boolean) {
  const name = displayName?.trim().replace(/\s+/g, " ") || null;
  if (name) {
    const problem = nameProblem(name);
    if (problem) throw new HttpError(400, problem);
  }
  if (leaderboard && !name) throw new HttpError(400, "Choose a display name to appear on leaderboards.");
  try {
    await db.update(schema.users).set({ displayName: name, leaderboard }).where(eq(schema.users.id, user.id));
  } catch (e) {
    const code = (e as { code?: string })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") throw new HttpError(409, "That name is taken. Try another.");
    throw e;
  }
  return getProfile(user);
}

interface Row {
  rank: number;
  name: string;
  points: number;
  tests: number;
  is_me: boolean;
  [key: string]: unknown;
}

/**
 * The exam's leaderboard for this week (Monday to Sunday, Asia/Kolkata). A user's points are the
 * sum of the score percentages of their best BEST_OF timed tests on the exam submitted this week
 * (negative scores count as 0; late submissions do not count). Only users who opted in and set a
 * display name are listed. Ties share a rank. No emails or ids leave the server.
 */
export async function weeklyBoard(examId: string, viewer: SessionUser | null) {
  if (!EXAM_BY_ID.has(examId)) throw new HttpError(400, "Unknown exam.");
  const { start, end } = istWeek();
  const a = schema.testAttempts;
  const u = schema.users;
  const viewerId = viewer?.id ?? null;
  const rows = await db.execute<Row>(sql`
    with scored as (
      select ${a.userId} as user_id,
        greatest(coalesce(${a.score}, 0), 0) * 100.0 / greatest(jsonb_array_length(${a.questions}), 1) as pct,
        row_number() over (partition by ${a.userId} order by greatest(coalesce(${a.score}, 0), 0) * 100.0 / greatest(jsonb_array_length(${a.questions}), 1) desc) as n
      from ${a}
      join ${u} on ${u.id} = ${a.userId}
      where ${a.examId} = ${examId}
        and ${a.submittedAt} >= ${start.toISOString()}::timestamptz and ${a.submittedAt} < ${end.toISOString()}::timestamptz
        and ${a.submittedAt} <= ${a.deadlineAt} + interval '2 minutes'
        and ${u.leaderboard} and ${u.displayName} is not null
    ),
    totals as (
      select user_id, round(sum(pct)::numeric, 1)::float8 as points, count(*)::int as tests
      from scored where n <= ${BEST_OF} group by user_id
    ),
    ranked as (
      select t.*, rank() over (order by t.points desc)::int as rank from totals t
    )
    select r.rank, ${u.displayName} as name, r.points, r.tests, (r.user_id = ${viewerId}::uuid) is true as is_me
    from ranked r join ${u} on ${u.id} = r.user_id
    where r.rank <= ${TOP} or r.user_id = ${viewerId}::uuid
    order by r.rank, ${u.displayName}
  `);
  const list = [...rows];
  const strip = (r: Row) => ({ rank: r.rank, name: r.name, points: Number(r.points), tests: r.tests, me: !!r.is_me });
  const board = list.filter((r) => r.rank <= TOP).slice(0, TOP).map(strip);
  const mine = list.find((r) => r.is_me);
  return { weekStart: start.getTime(), weekEnd: end.getTime(), bestOf: BEST_OF, board, me: mine ? strip(mine) : null };
}
