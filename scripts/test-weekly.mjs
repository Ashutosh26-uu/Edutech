// Checks the Sunday All-India Mock: ISO weeks on the India calendar, the Sunday 10 am – 10 pm
// window across time-zone boundaries, and that a week's paper is the same on every call.
// Run: npm run test:weekly
import { mockPlan } from "@/data/patterns";
import { EXAM_BY_ID } from "@/data/exams";
import { weeklyPaper } from "@/lib/weekly-paper";
import { WEEKLY_EXAMS, istWeek, lastClosedWindow, nextWindow, seededRandom, shiftWeek, statusAt, weeklySeed, windowOf } from "@/lib/weekly";

let fail = 0;
const check = (name, ok, detail = "") => {
  if (!ok) {
    fail++;
    console.log(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
};
const eq = (name, got, want) => check(name, got === want, `got ${got}, want ${want}`);
const at = (iso) => Date.parse(iso);

// ---- ISO weeks, India time ----
eq("Sunday 23:59:59 IST is still its week", istWeek(at("2026-11-15T18:29:59Z")), "2026-W46");
eq("Monday 00:00 IST starts the next week", istWeek(at("2026-11-15T18:30:00Z")), "2026-W47");
eq("Sunday 01:00 IST, still Saturday in UTC", istWeek(at("2026-11-14T19:30:00Z")), "2026-W46");
eq("Monday 00:00 IST (Sunday in UTC)", istWeek(at("2026-11-08T18:30:00Z")), "2026-W46");
eq("year boundary: 3 Jan 2021 is 2020-W53", istWeek(at("2021-01-03T06:00:00Z")), "2020-W53");
eq("year boundary: 30 Dec 2024 is 2025-W01", istWeek(at("2024-12-30T06:00:00Z")), "2025-W01");
eq("shiftWeek across a year", shiftWeek("2020-W53", 1), "2021-W01");
eq("shiftWeek back", shiftWeek("2025-W01", -1), "2024-W52");

// ---- The Sunday window ----
const w = windowOf("2026-W46");
eq("opens Sunday 10:00 IST", new Date(w.opensAt).toISOString(), "2026-11-15T04:30:00.000Z");
eq("closes Sunday 22:00 IST", new Date(w.closesAt).toISOString(), "2026-11-15T16:30:00.000Z");
eq("2020-W53 opens on 3 Jan 2021", new Date(windowOf("2020-W53").opensAt).toISOString(), "2021-01-03T04:30:00.000Z");
eq("1 s before opening", statusAt(w, at("2026-11-15T04:29:59Z")), "upcoming");
eq("at opening", statusAt(w, at("2026-11-15T04:30:00Z")), "live");
eq("1 s before closing", statusAt(w, at("2026-11-15T16:29:59Z")), "live");
eq("at closing", statusAt(w, at("2026-11-15T16:30:00Z")), "closed");
for (const wk of ["2026-W01", "2026-W30", "2027-W52", "2020-W53"]) eq(`windowOf/istWeek round trip ${wk}`, istWeek(windowOf(wk).opensAt), wk);

// Which mock the page shows, and whose results.
const cases = [
  // [instant, next window's week, its status, last closed week]
  ["2026-11-14T18:29:00Z", "2026-W46", "upcoming", "2026-W45"], // Saturday 23:59 IST
  ["2026-11-15T05:30:00Z", "2026-W46", "live", "2026-W45"], // Sunday 11:00 IST
  ["2026-11-15T17:30:00Z", "2026-W47", "upcoming", "2026-W46"], // Sunday 23:00 IST: closed, next week's countdown
  ["2026-11-15T18:30:00Z", "2026-W47", "upcoming", "2026-W46"], // Monday 00:00 IST
];
for (const [iso, next, status, last] of cases) {
  const n = nextWindow(at(iso));
  eq(`${iso}: next week`, n.week, next);
  eq(`${iso}: status`, statusAt(n, at(iso)), status);
  eq(`${iso}: last closed week`, lastClosedWindow(at(iso)).week, last);
}

// ---- Seeds ----
const seq = (seed) => Array.from({ length: 5 }, seededRandom(seed)).join();
eq("same seed, same numbers", seq(weeklySeed("2026-W46", "ssc-cgl")), seq(weeklySeed("2026-W46", "ssc-cgl")));
check("another week, other numbers", seq(weeklySeed("2026-W46", "ssc-cgl")) !== seq(weeklySeed("2026-W47", "ssc-cgl")));
check("another exam, other numbers", seq(weeklySeed("2026-W46", "ssc-cgl")) !== seq(weeklySeed("2026-W46", "ibps-po")));
check("numbers in [0, 1)", Array.from({ length: 1000 }, seededRandom("x")).every((r) => r >= 0 && r < 1));

// ---- The paper ----
check("at least one exam has a Sunday mock", WEEKLY_EXAMS.length > 0);
const sig = (p) => JSON.stringify(p.questions.map((q) => [q.id, q.question, q.options, q.answer]));
for (const exam of WEEKLY_EXAMS) {
  const a = await weeklyPaper(exam.id, "2026-W46");
  const b = await weeklyPaper(exam.id, "2026-W46");
  eq(`${exam.id}: same paper on two calls`, sig(a), sig(b));
  check(`${exam.id}: another week gives another paper`, sig(a) !== sig(await weeklyPaper(exam.id, "2026-W47")));
  const plan = mockPlan(EXAM_BY_ID.get(exam.id));
  eq(`${exam.id}: one section per pattern section`, a.sections.length, plan.sections.length);
  for (const s of plan.sections) {
    const got = a.sections.find((x) => x.name === s.subject);
    check(`${exam.id}/${s.subject}: question count`, got && got.count === s.questions, `got ${got?.count}, want ${s.questions}`);
  }
  eq(`${exam.id}: sections cover the paper`, a.sections.reduce((n, s) => n + s.count, 0), a.questions.length);
  eq(`${exam.id}: ids are unique`, new Set(a.questions.map((q) => q.id)).size, a.questions.length);
  check(`${exam.id}: answers point at an option`, a.questions.every((q) => q.answer >= 0 && q.answer < q.options.length));
}

if (fail) {
  console.log(`\n${fail} weekly mock check(s) failed.`);
  process.exit(1);
}
console.log(`Weekly mock: all checks passed (${WEEKLY_EXAMS.map((e) => e.id).join(", ")}).`);
