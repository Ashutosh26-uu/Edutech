// Checks the daily-habit logic: streak freezes, the question of the day and badges.
// Run: npm run test:habits
import { addDays, computeStreak, consecutiveDays, istDayKey, longestRun } from "../src/lib/streak.ts";
import { questionOfTheDay } from "../src/lib/daily.ts";
import { computeBadges } from "../src/lib/badges.ts";

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`✗ ${name}: got ${g}, want ${w}`);
  }
};

const T = "2026-03-31";
/** Activity for `n` consecutive days ending at `end`, skipping the given days. */
const days = (end, n, skip = []) => Object.fromEntries(Array.from({ length: n }, (_, i) => addDays(end, -i)).filter((d) => !skip.includes(d)).map((d) => [d, 10]));

// ---- dates ----
eq("addDays across month", addDays("2026-02-28", 1), "2026-03-01");
eq("addDays across year", addDays("2026-01-01", -1), "2025-12-31");
eq("IST day rolls over at 18:30 UTC", istDayKey(Date.UTC(2026, 0, 1, 18, 29)), "2026-01-01");
eq("IST day rolls over at 18:30 UTC (after)", istDayKey(Date.UTC(2026, 0, 1, 18, 30)), "2026-01-02");

// ---- plain streaks (same as before freezes) ----
eq("empty", computeStreak({}, [], T).count, 0);
eq("today only", computeStreak({ [T]: 5 }, [], T).count, 1);
eq("ends yesterday, today not started", computeStreak(days(addDays(T, -1), 3), [], T).count, 3);
eq("zero XP day is not active", computeStreak({ [T]: 0 }, [], T).count, 0);
eq("future days ignored", computeStreak({ "2027-01-01": 5 }, [], T).count, 0);

// ---- freezes ----
// 7 days earns a freeze; one missed day after it is bridged once the next day is studied.
{
  const miss = addDays(T, -1);
  const a = days(T, 9, [miss]); // 7 days, a gap yesterday, today
  const r = computeStreak(a, [], T);
  eq("gap bridged: count", r.count, 8);
  eq("gap bridged: frozen", r.frozen, [miss]);
  eq("gap bridged: freezes left", r.freezes, 0);
}
// Without a freeze (only 5 days before the gap) the streak restarts.
eq("no freeze, gap breaks", computeStreak(days(T, 7, [addDays(T, -1)]), [], T).count, 1);
// Two missed days in a row break the streak and spend nothing.
{
  const r = computeStreak(days(T, 10, [addDays(T, -1), addDays(T, -2)]), [], T);
  eq("two missed: count", r.count, 1);
  eq("two missed: nothing frozen", r.frozen, []);
  eq("two missed: freeze kept", r.freezes, 1);
}
// Yesterday missed, today not studied yet: the streak is still shown, with the freeze pending.
{
  const r = computeStreak(days(addDays(T, -2), 7), [], T);
  eq("pending: count", r.count, 7);
  eq("pending: flag", r.pendingFreeze, true);
  eq("pending: not spent yet", [r.freezes, r.frozen], [1, []]);
}
// Freezes cap at 2.
eq("cap at 2", computeStreak(days(T, 30), [], T).freezes, 2);
// 14 days then two separate single gaps: both bridged.
{
  const g1 = addDays(T, -3);
  const g2 = addDays(T, -1);
  const r = computeStreak(days(T, 17, [g1, g2]), [], T);
  eq("two separate gaps: frozen", r.frozen, [g1, g2]);
  eq("two separate gaps: count", r.count, 15);
}
// A recorded frozen day stays frozen (stable), and is not spent twice.
{
  const miss = addDays(T, -1);
  const a = days(T, 9, [miss]);
  const first = computeStreak(a, [], T);
  const again = computeStreak(a, first.frozen, T);
  eq("recorded: same result", again, first);
}
eq("best run", computeStreak({ ...days("2026-01-10", 12), ...days(T, 3) }, [], T).best, 12);

// ---- daily question streaks ----
eq("daily consecutive", consecutiveDays([T, addDays(T, -1), addDays(T, -3)], T), 2);
eq("daily ends yesterday", consecutiveDays([addDays(T, -1)], T), 1);
eq("longest run", longestRun(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-05"]), 3);

// ---- question of the day ----
{
  const a = await questionOfTheDay("2026-03-31", "ssc-cgl");
  const b = await questionOfTheDay("2026-03-31", "ssc-cgl");
  const c = await questionOfTheDay("2026-04-01", "ssc-cgl");
  const g = await questionOfTheDay("2026-03-31");
  eq("qotd: found", !!a && !!g, true);
  eq("qotd: same for same date and exam", a?.id, b?.id);
  eq("qotd: is hard", ["hard", "very-hard"].includes(a?.difficulty) && ["hard", "very-hard"].includes(g?.difficulty), true);
  if (a?.id === c?.id) eq("qotd: changes by date", a?.id === c?.id, false);
  // Over a month the picks should not repeat much.
  const ids = new Set();
  for (let i = 0; i < 30; i++) ids.add((await questionOfTheDay(addDays("2026-03-01", i), "ssc-cgl"))?.id);
  if (ids.size < 25) eq("qotd: variety over 30 days", ids.size >= 25, true);
}

// ---- badges ----
{
  const store = { videos: [], topics: { t: { attempted: 25, correct: 21 } }, mocks: [], cards: {}, xp: 1250, activity: days(T, 7), dailyGoal: 50, videoNotes: {}, counts: { [T]: { questions: 40, reviews: 50, videos: 1, mocks: 0 } }, credits: 0, revisionPasses: {}, freeMockUsed: {}, purchases: [], bookmarks: {}, deleted: {}, frozenDays: [], dailyQuestions: {} };
  const got = Object.fromEntries(computeBadges(store, T).map((b) => [b.id, b.earned]));
  eq("badges", got, { "first-set": true, "q-100": false, "q-1000": false, "streak-7": true, "streak-30": false, "mock-1": false, "mock-5": false, "topic-master": true, "cards-50": true, "video-1": true, "daily-7": false, "level-5": true, "level-10": false });
  eq("badge progress", computeBadges(store, T).find((b) => b.id === "q-100").have, 40);
}

console.log(fail ? `\n${fail} problem(s)` : "habits: all passed");
process.exit(fail ? 1 : 0);
