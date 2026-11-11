// Checks the mock-analysis maths: attempt strategy, the wrong-guess (negative marking) cost,
// section time vs marks, the exam-mode palette states and the error-coach pattern.
// Run: npm run test:analysis
import { attemptStrategy, averageSeconds, guessCost, mistakePattern, paletteCounts, paletteState, scoreOf, sectionTimes } from "../src/lib/mockAnalysis.ts";

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`✗ ${name}: got ${g}, want ${w}`);
  }
};

// answer 0 is always right in these fixtures
const R = (chosen, seconds, difficulty) => ({ chosen, correct: chosen === 0, seconds, difficulty });

// ---- score ----
const paper = [
  R(0, 30, "easy"), // right
  R(1, 200, "hard"), // wrong, very slow -> should have skipped
  R(null, 5, "easy"), // skipped easy -> missed easy marks
  R(null, 0, "very-hard"), // skipped hard: fine
  R(2, 10, "moderate"), // wrong, quick guess
  R(0, 40, "moderate"), // right
  R(3, 8, "hard"), // wrong, quick guess
  R(null, 7, "moderate"), // skipped moderate -> missed easy marks
];
eq("score with 1/4 negative", scoreOf(paper, 0.25), 1.25); // 2 right, 3 wrong
eq("score in marks", scoreOf(paper, 0.25, 2), 2.5);
eq("score without negative", scoreOf(paper, 0), 2);
eq("average over the whole paper", averageSeconds(paper), 300 / 8);

// ---- attempt strategy ----
const s = attemptStrategy(paper);
eq("should have skipped: slow and wrong", s.shouldSkip, [1]);
eq("time lost on them", s.wastedSeconds, 200);
eq("missed easy marks: easy/moderate skipped", s.missedEasy, [2, 7]);
eq("slow but right is not flagged", attemptStrategy([R(0, 100), R(1, 10), R(1, 10)]).shouldSkip, []);
eq("exactly 2x the average is not over it", attemptStrategy([R(1, 20), R(0, 5), R(0, 5)]).shouldSkip, []);
eq("untimed paper flags nothing slow", attemptStrategy([R(1), R(0)]).shouldSkip, []);
eq("skips without difficulty are not 'easy'", attemptStrategy([R(null, 3)]).missedEasy, []);

// ---- wrong guesses ----
const g = guessCost(paper, 0.25);
eq("quick wrong answers", g.fastWrong, [4, 6]);
eq("their negative-marking cost", g.cost, 0.5);
eq("score as taken", g.score, 1.25);
eq("score had they been skipped", g.scoreWithout, 1.75);
eq("cost in marks (2 marks, 1/3 negative)", guessCost([R(1, 3), R(0, 20)], 1 / 3, 2), { fastWrong: [0], cost: 0.67, score: 1.33, scoreWithout: 2 });
eq("15 s exactly is not a quick guess", guessCost([R(1, 15)], 0.25).fastWrong, []);
eq("no time data, no guesses", guessCost([R(1)], 0.25).fastWrong, []);
eq("no negative marking costs nothing", guessCost(paper, 0).cost, 0);

// ---- sections ----
const secs = sectionTimes(
  [R(0, 60), R(0, 60), R(1, 60), R(0, 300), R(1, 300), R(null, 0)],
  [
    { name: "Quant", from: 0, count: 3 },
    { name: "English", from: 3, count: 3 },
  ],
  0.25,
  2,
);
eq("section rows", secs.rows.map((r) => [r.name, r.score, r.max, r.seconds, r.perMin]), [["Quant", 3.5, 6, 180, 1.17], ["English", 1.5, 6, 600, 0.15]]);
eq("suggestion names the best section", secs.suggestion, "Start with Quant next time: highest marks per minute (1.17). English took the most time for the least return.");
eq("one timed section: no suggestion", sectionTimes([R(0, 10), R(0)], [{ name: "A", from: 0, count: 1 }, { name: "B", from: 1, count: 1 }], 0).suggestion, "");
eq("nothing paid off", sectionTimes([R(1, 10), R(1, 10)], [{ name: "A", from: 0, count: 1 }, { name: "B", from: 1, count: 1 }], 1).suggestion.startsWith("No section paid off"), true);

// ---- palette ----
eq("not visited", paletteState(false, false, false), "not-visited");
eq("visited, no answer", paletteState(true, false, false), "not-answered");
eq("answered", paletteState(true, true, false), "answered");
eq("marked", paletteState(true, false, true), "marked");
eq("answered and marked", paletteState(true, true, true), "answered-marked");
eq("counts", paletteCounts(["answered", "answered", "not-visited", "marked"]), { "not-visited": 1, "not-answered": 0, answered: 2, marked: 1, "answered-marked": 0 });

// ---- error coach ----
const p = mistakePattern(["silly", "silly", "silly", "concept", "time", "guess", "silly", "misread"]);
eq("pattern total", p.total, 8);
eq("dominant category", p.dominant, "silly");
eq("dominant share", p.pct, 50);
eq("line", p.line.startsWith("50% of your mistakes are silly mistakes: slow down on the last step"), true);
eq("ties go to the first category", mistakePattern(["time", "concept"]).dominant, "concept");
eq("time pressure wording", mistakePattern(["time"]).line.startsWith("100% of your mistakes come from time pressure"), true);
eq("no tags", mistakePattern([]), { counts: { silly: 0, concept: 0, time: 0, misread: 0, guess: 0 }, total: 0, dominant: null, pct: 0, line: "" });

if (fail) {
  console.log(`\n${fail} check(s) failed.`);
  process.exit(1);
}
console.log("✓ mock analysis, palette and error coach checks pass");
