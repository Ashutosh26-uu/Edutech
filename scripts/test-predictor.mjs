// Checks the "Where you stand" predictor: scaling past cut-offs to a mock's total, the gap to each,
// the verdict bands at their boundaries, unknown exams, and that every cut-off entry is well formed.
// Run: npm run test:predictor
import { CATEGORIES, CUTOFFS } from "../src/data/cutoffs.ts";
import { EXAM_BY_ID } from "../src/data/exams.ts";
import { CLOSE_SHARE, gapText, hasCutoffs, predict, scaleCutoff, verdictFor } from "../src/lib/predictor.ts";

let fail = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g !== w) {
    fail++;
    console.log(`✗ ${name}: got ${g}, want ${w}`);
  }
};

// ---- scaling ----
eq("same total is not scaled", scaleCutoff(153.18981, 200, 200), 153.18981);
eq("halved total halves the cut-off", scaleCutoff(150, 200, 100), 75);
eq("CTET 90/150 on a 25-mark mock", scaleCutoff(90, 150, 25), 15);
eq("scaled figures round to 2 decimals", scaleCutoff(49.21, 100, 30), 14.76);

// ---- gaps ----
eq("gap above", gapText(12, 2024, "UR"), "+12 above the 2024 UR cut-off");
eq("gap below", gapText(-18, 2024, "UR"), "18 below the 2024 UR cut-off");
eq("level", gapText(0, 2023, "SC"), "Level with the 2023 SC cut-off");
eq("qualifying mark wording", gapText(-3.5, 2011, "OBC", "qualifying"), "3.5 below the OBC qualifying mark");

// ---- verdict bands at the boundaries (cut-off 100, close = within 10) ----
eq("close share is 10%", CLOSE_SHARE, 0.1);
eq("exactly at the cut-off is above", verdictFor(100, 100).band, "above");
eq("above", verdictFor(120, 100).verdict, "Above recent cut-offs");
eq("just below is close", verdictFor(99.99, 100).band, "close");
eq("exactly 10% below is close", verdictFor(90, 100), { band: "close", verdict: "Close: within 10% of the cut-off", short: 10 });
eq("just past 10% below is below", verdictFor(89.99, 100), { band: "below", verdict: "Below: needs about 11 more marks", short: 10.01 });
eq("far below", verdictFor(50, 100).verdict, "Below: needs about 50 more marks");
eq("rounds the shortfall up", verdictFor(0.5, 1.6).verdict, "Below: needs about 2 more marks");
eq("one mark wording", verdictFor(0, 0.9).verdict, "Below: needs about 1 more mark");

// ---- predict ----
const fixture = [
  { examId: "x", year: 2024, category: "UR", marks: 150, total: 200, source: "s", kind: "cutoff" },
  { examId: "x", year: 2023, category: "UR", marks: 140, total: 200, source: "s", kind: "cutoff" },
  { examId: "x", year: 2024, category: "SC", marks: 120, total: 200, source: "s", kind: "cutoff" },
];
const p = predict("x", 145, 200, "UR", fixture);
eq("rows for the category, newest first", p.rows.map((r) => r.year), [2024, 2023]);
eq("gaps", p.rows.map((r) => r.gap), [-5, 5]);
eq("gap texts", p.rows.map((r) => r.gapText), ["5 below the 2024 UR cut-off", "+5 above the 2023 UR cut-off"]);
eq("verdict against the highest cut-off", p.band, "close");
eq("not scaled on the same total", p.rows[0].scaled, false);
const half = predict("x", 80, 100, "UR", fixture);
eq("scaled to a 100-mark mock", half.rows.map((r) => r.cutoff), [75, 70]);
eq("scaled flag", half.rows[0].scaled, true);
eq("above both", half.verdict, "Above recent cut-offs");
eq("unknown exam is null", predict("no-such-exam", 50, 100, "UR"), null);
eq("undefined exam is null", predict(undefined, 50, 100, "UR"), null);
eq("category with no data is null", predict("x", 50, 100, "ST", fixture), null);
eq("zero max score is null", predict("x", 0, 0, "UR", fixture), null);
eq("hasCutoffs unknown", hasCutoffs("no-such-exam"), false);
eq("SSC CGL has data", hasCutoffs("ssc-cgl"), true);
const cgl = predict("ssc-cgl", 160, 200, "UR");
eq("SSC CGL 160/200 UR is above", cgl?.band, "above");
eq("SSC CGL rows not scaled on a 200-mark mock", cgl?.rows.every((r) => !r.scaled), true);

// ---- every cut-off entry is well formed ----
const seen = new Set();
for (const c of CUTOFFS) {
  const id = `${c.examId} ${c.year} ${c.category}`;
  if (!EXAM_BY_ID.has(c.examId)) eq(`${id}: known exam id`, false, true);
  if (!CATEGORIES.includes(c.category)) eq(`${id}: valid category`, c.category, "one of UR/OBC/EWS/SC/ST");
  if (!(typeof c.source === "string" && c.source.trim().length > 5)) eq(`${id}: has a source`, c.source, "a source");
  if (!(c.marks > 0)) eq(`${id}: positive marks`, c.marks, "> 0");
  if (!(c.total > 0 && c.marks <= c.total)) eq(`${id}: marks within total`, `${c.marks}/${c.total}`, "marks <= total");
  if (!(Number.isInteger(c.year) && c.year >= 2010 && c.year <= new Date().getFullYear())) eq(`${id}: sensible year`, c.year, "a past year");
  if (!["cutoff", "qualifying"].includes(c.kind)) eq(`${id}: kind`, c.kind, "cutoff or qualifying");
  if (seen.has(id)) eq(`${id}: listed once`, "duplicate", "unique");
  seen.add(id);
}
// Each exam/year covers every category.
for (const key of new Set(CUTOFFS.map((c) => `${c.examId} ${c.year}`))) {
  const cats = CUTOFFS.filter((c) => `${c.examId} ${c.year}` === key).map((c) => c.category).sort();
  eq(`${key}: all five categories`, cats, [...CATEGORIES].sort());
}

if (fail) {
  console.log(`\n${fail} check(s) failed`);
  process.exit(1);
}
console.log("✓ predictor: scaling, gaps, verdict bands and cut-off data all check out");
