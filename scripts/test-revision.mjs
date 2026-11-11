// Checks the topic revision schedule: gaps, moving forward or back on accuracy, and what is due.
// Run: npm run test:revision
import { GAPS, dueAt, dueTopics, markRevised, nextStep, startOfDay, syncPlan, upcomingTopics } from "../src/lib/revision-plan.ts";

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`✗ ${name}: got ${g}, want ${w}`);
  }
};

/** Local time on a day of March 2026 (local, so it works in any time zone). */
const at = (day, hour = 10) => new Date(2026, 2, day, hour).getTime();
const dayOf = (t) => new Date(t).getDate();

// ---- steps ----
eq("gaps", [...GAPS], [1, 3, 7, 15, 30]);
eq("advance at 70%", nextStep(0, 0.7), 1);
eq("advance caps at 30 days", nextStep(4, 1), 4);
eq("hold between 50 and 70%", nextStep(2, 0.6), 2);
eq("hold at exactly 50%", nextStep(2, 0.5), 2);
eq("reset under 50%", nextStep(3, 0.4), 0);

// ---- due dates are whole days after the last practice ----
eq("step 0 → next day", dayOf(dueAt({ step: 0, last: at(1, 23), attempted: 0, correct: 0 })), 2);
eq("step 2 → 7 days", dayOf(dueAt({ step: 2, last: at(1), attempted: 0, correct: 0 })), 8);
eq("due at local midnight", dueAt({ step: 1, last: at(1, 15), attempted: 0, correct: 0 }), startOfDay(at(4)));

// ---- new topics enter the plan ----
{
  const p = syncPlan({}, { a: { attempted: 5, correct: 4, lastPracticed: at(1) } }, {}, at(1, 12));
  eq("practised topic added at step 0", p.a, { step: 0, last: at(1), attempted: 5, correct: 4 });
  const q = syncPlan({}, {}, { b: { s: "done", at: at(2) }, c: { s: "studying", at: at(2) } }, at(2));
  eq("done topic added from status time", q.b, { step: 0, last: at(2), attempted: 0, correct: 0 });
  eq("studying topic without practice not added", q.c, undefined);
}

// ---- unchanged input returns the same object (no needless save) ----
{
  const plan = { a: { step: 1, last: at(1), attempted: 5, correct: 4 } };
  eq("no change → same object", syncPlan(plan, { a: { attempted: 5, correct: 4, lastPracticed: at(1) } }, {}, at(3)) === plan, true);
}

// ---- a full run: good sessions move forward, a bad one resets ----
{
  let plan = {};
  let stats = { t: { attempted: 10, correct: 8, lastPracticed: at(1) } };
  plan = syncPlan(plan, stats, {}, at(1));
  eq("day 1: due day 2", dayOf(dueAt(plan.t)), 2);
  eq("not due on day 1", dueTopics(plan, at(1)).length, 0);
  eq("due on day 2", dueTopics(plan, at(2)).map((d) => d.id), ["t"]);

  stats = { t: { attempted: 20, correct: 17, lastPracticed: at(2) } }; // 9/10 = 90%
  plan = syncPlan(plan, stats, {}, at(2));
  eq("90% → step 1", plan.t.step, 1);
  eq("next due 3 days later", dayOf(dueAt(plan.t)), 5);

  stats = { t: { attempted: 30, correct: 24, lastPracticed: at(5) } }; // 7/10 = 70%
  plan = syncPlan(plan, stats, {}, at(5));
  eq("70% → step 2 (7 days)", [plan.t.step, dayOf(dueAt(plan.t))], [2, 12]);

  stats = { t: { attempted: 40, correct: 30, lastPracticed: at(12) } }; // 6/10 = 60%
  plan = syncPlan(plan, stats, {}, at(12));
  eq("60% → same gap from new date", [plan.t.step, dayOf(dueAt(plan.t))], [2, 19]);

  stats = { t: { attempted: 50, correct: 33, lastPracticed: at(19) } }; // 3/10 = 30%
  plan = syncPlan(plan, stats, {}, at(19));
  eq("30% → back to 1 day", [plan.t.step, dayOf(dueAt(plan.t))], [0, 20]);
}

// ---- tiny sessions wait to be combined ----
{
  let plan = { t: { step: 1, last: at(1), attempted: 10, correct: 8 } };
  plan = syncPlan(plan, { t: { attempted: 12, correct: 8, lastPracticed: at(4) } }, {}, at(4)); // 0/2
  eq("2 answers: step kept, date moves", [plan.t.step, plan.t.last, plan.t.attempted], [1, at(4), 10]);
  plan = syncPlan(plan, { t: { attempted: 14, correct: 11, lastPracticed: at(5) } }, {}, at(5)); // 3/4 combined = 75%
  eq("combined with the next answers → advance", [plan.t.step, plan.t.attempted], [2, 14]);
}

// ---- manual revision, reset and cleared progress ----
{
  const plan = { t: { step: 2, last: at(1), attempted: 10, correct: 8 } };
  const r = markRevised(plan, "t", { attempted: 10, correct: 8 }, at(9));
  eq("marked revised → one gap further from today", [r.t.step, dayOf(dueAt(r.t))], [3, 24]);
  eq("marked revised, new topic → 3 days", markRevised({}, "n", undefined, at(1)).n.step, 1);
  eq("original plan untouched", plan.t.step, 2);
  eq("not started, nothing practised → removed", syncPlan({ x: { step: 0, last: at(1), attempted: 0, correct: 0 } }, {}, { x: { s: "not-started", at: at(2) } }, at(2)).x, undefined);
  const cleared = syncPlan(plan, { t: { attempted: 3, correct: 1, lastPracticed: at(9) } }, {}, at(9));
  eq("totals went down → start over", [cleared.t.step, cleared.t.attempted], [0, 3]);
}

// ---- due list order and filter ----
{
  const plan = {
    a: { step: 0, last: at(1), attempted: 1, correct: 1 }, // due day 2
    b: { step: 1, last: at(1), attempted: 1, correct: 1 }, // due day 4
    c: { step: 2, last: at(1), attempted: 1, correct: 1 }, // due day 8
  };
  eq("most overdue first", dueTopics(plan, at(5)).map((d) => [d.id, d.overdue]), [["a", 3], ["b", 1]]);
  eq("filter by exam topics", dueTopics(plan, at(5), ["b", "c"]).map((d) => d.id), ["b"]);
  eq("upcoming", upcomingTopics(plan, at(5)).map((d) => d.id), ["c"]);
}

console.log(fail ? `\n${fail} problem(s)` : "revision plan: all passed");
process.exit(fail ? 1 : 0);
