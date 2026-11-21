// Checks sub-topics: every list is well formed, answers add up per sub-topic, the weakest ones are
// picked with the minimum-attempts rule, and progress saved before sub-topics existed still loads.
// Run: npm run test:subtopics
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};
globalThis.window = new EventTarget();

const { SUBTOPICS } = await import("../src/data/subtopics.ts");
const { TOPICS } = await import("../src/data/topics.ts");
const { addSubtopicAnswers, isSubtopic, MIN_SUBTOPIC_ATTEMPTS, splitSubtopicKey, subtopicKey, subtopicPracticeHref, weakestSubtopics } = await import("../src/lib/subtopics.ts");
const { load, recordAnswers, recordDailyAnswer } = await import("../src/lib/storage.ts");

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`✗ ${name}: got ${g}, want ${w}`);
  }
};

// ---- lists ----
const families = TOPICS.filter((t) => /^(quant|reason)-/.test(t.id)).map((t) => t.id);
eq("every quant-/reason- topic has a list", families.filter((id) => !SUBTOPICS[id]), []);
for (const [id, list] of Object.entries(SUBTOPICS)) {
  eq(`${id}: is a real topic`, TOPICS.some((t) => t.id === id), true);
  eq(`${id}: 4-8 sub-topics`, list.length >= 4 && list.length <= 8, true);
  eq(`${id}: unique slugs`, new Set(list.map((s) => s.slug)).size, list.length);
  eq(`${id}: unique labels`, new Set(list.map((s) => s.label.trim().toLowerCase())).size, list.length);
  eq(`${id}: slugs are kebab-case`, list.filter((s) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.slug)).map((s) => s.slug), []);
  eq(`${id}: labels are not empty`, list.every((s) => s.label.trim().length > 0), true);
}
eq("isSubtopic: in list", isSubtopic("quant-percentage", "successive-change"), true);
eq("isSubtopic: other topic's slug", isSubtopic("quant-percentage", "trains"), false);
eq("isSubtopic: no topic", isSubtopic(undefined, "successive-change"), false);
eq("key round trip", splitSubtopicKey(subtopicKey("quant-tsd", "trains")), { topicId: "quant-tsd", slug: "trains" });
eq("practice link", subtopicPracticeHref("quant-percentage", "successive-change", "ssc-cgl"), "/practice?exam=ssc-cgl&topics=quant-percentage&subtopic=successive-change");
eq("practice link without exam", subtopicPracticeHref("quant-tsd", "trains"), "/practice?topics=quant-tsd&subtopic=trains");

// ---- aggregation ----
const P = "quant-percentage";
const stats = addSubtopicAnswers({}, [
  { topicId: P, subtopic: "successive-change", correct: false },
  { topicId: P, subtopic: "successive-change", correct: true },
  { topicId: P, subtopic: "successive-change", correct: false },
  { topicId: P, subtopic: "population-depreciation", correct: true },
  { topicId: P, subtopic: "population-depreciation", correct: true },
  { topicId: P, subtopic: "population-depreciation", correct: true },
  { topicId: P, subtopic: "population-depreciation", correct: false },
  { topicId: P, subtopic: "election-votes", correct: false }, // only 1 attempt
  { topicId: P, subtopic: "made-up", correct: false }, // not in the list: skipped
  { topicId: P, correct: false }, // untagged: skipped
  { subtopic: "trains", correct: false }, // no topic: skipped
], 1000);
eq("keys", Object.keys(stats).sort(), [`${P}/election-votes`, `${P}/population-depreciation`, `${P}/successive-change`]);
eq("successive-change counts", stats[`${P}/successive-change`], { attempted: 3, correct: 1, lastPracticed: 1000 });
eq("population counts", [stats[`${P}/population-depreciation`].attempted, stats[`${P}/population-depreciation`].correct], [4, 3]);

// ---- weakest with the min-attempts rule ----
const T = "quant-tsd";
addSubtopicAnswers(stats, [
  ...Array.from({ length: 5 }, (_, i) => ({ topicId: T, subtopic: "trains", correct: i < 1 })), // 20%
  ...Array.from({ length: 3 }, () => ({ topicId: T, subtopic: "boats-streams", correct: false })), // 0%, exactly 3
  ...Array.from({ length: 2 }, () => ({ topicId: T, subtopic: "circular-track", correct: false })), // 0% but only 2
]);
stats["quant-tsd/renamed-slug"] = { attempted: 10, correct: 0 }; // stale key: ignored
stats["garbage"] = { attempted: 10, correct: 0 }; // malformed key: ignored
eq("MIN_SUBTOPIC_ATTEMPTS", MIN_SUBTOPIC_ATTEMPTS, 3);
eq("weakest, worst first, min 3", weakestSubtopics(stats).map((s) => [s.slug, s.pct]), [["boats-streams", 0], ["trains", 20], ["successive-change", 33], ["population-depreciation", 75]]);
eq("n limits", weakestSubtopics(stats, { n: 2 }).map((s) => s.slug), ["boats-streams", "trains"]);
eq("one topic", weakestSubtopics(stats, { topicId: P }).map((s) => s.slug), ["successive-change", "population-depreciation"]);
eq("below drops strong ones", weakestSubtopics(stats, { below: 70 }).map((s) => s.slug), ["boats-streams", "trains", "successive-change"]);
eq("min 2 lets circular-track in", weakestSubtopics(stats, { min: 2 }).some((s) => s.slug === "circular-track"), true);
eq("labels come from the list", weakestSubtopics(stats, { n: 1 })[0].label, SUBTOPICS[T].find((s) => s.slug === "boats-streams").label);
eq("tie: more attempts first", weakestSubtopics({ [`${T}/trains`]: { attempted: 3, correct: 0 }, [`${T}/average-speed`]: { attempted: 6, correct: 0 } }).map((s) => s.slug), ["average-speed", "trains"]);
eq("undefined stats", weakestSubtopics(undefined), []);

// ---- old saved progress (no `subtopics`) still loads and keeps working ----
mem.set("studyclip:v1", JSON.stringify({ videos: [], topics: { [P]: { attempted: 7, correct: 4 } }, mocks: [], xp: 120, activity: {}, counts: {} }));
const old = load();
eq("old save: topics kept", old.topics[P], { attempted: 7, correct: 4 });
eq("old save: xp kept", old.xp, 120);
eq("old save: subtopics default to empty", old.subtopics, {});
eq("old save: no weak sub-topics", weakestSubtopics(old.subtopics), []);

recordAnswers([
  { topicId: P, subtopic: "successive-change", correct: false },
  { topicId: P, subtopic: "successive-change", correct: false },
  { topicId: P, subtopic: "successive-change", correct: true },
  { topicId: P, correct: true }, // untagged question: topic only
]);
const after = load();
eq("topic stats still counted", [after.topics[P].attempted, after.topics[P].correct], [11, 6]);
eq("sub-topic stats saved", [after.subtopics[`${P}/successive-change`].attempted, after.subtopics[`${P}/successive-change`].correct], [3, 1]);
eq("sub-topic keys stay out of topics", Object.keys(after.topics), [P]);
eq("weakest from the store", weakestSubtopics(after.subtopics).map((s) => [s.slug, s.pct]), [["successive-change", 33]]);

recordDailyAnswer("2026-11-20", { id: `${P}-9`, question: "q", options: ["a", "b", "c", "d"], answer: 0, explanation: "", topicId: P, subtopic: "election-votes" }, 0);
eq("question of the day counts its sub-topic", load().subtopics[`${P}/election-votes`], { attempted: 1, correct: 1, lastPracticed: load().subtopics[`${P}/election-votes`].lastPracticed });

if (fail) {
  console.log(`\n${fail} check(s) failed`);
  process.exit(1);
}
console.log("Sub-topic checks passed");
