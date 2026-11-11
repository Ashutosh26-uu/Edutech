// Checks the skill tools: speed-drill generators (right answers, no repeats in a round),
// typing-test scoring (WPM, accuracy, word errors), the passages and formula-sheet topics.
// Run: npm run test:skills
import { DRILLS, LEVELS, DrillRound, isCorrect, makeQuestion, makeRound, parseAnswer, perMinute, seeded } from "../src/lib/drills.ts";
import { diffWords, liveWpm, scoreTyping, splitWords } from "../src/lib/typing.ts";
import { PASSAGES } from "../src/data/typing-passages.ts";
import { formulaTopics, shortTricks } from "../src/lib/formulas.ts";

let fail = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fail++;
    console.log("✗ " + msg);
  }
};
const eq = (name, got, want) => ok(JSON.stringify(got) === JSON.stringify(want), `${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

// ---- Drill answers, recomputed independently from the prompt ----
const num = (s) => Number(s);
function solve(prompt) {
  let m;
  const p = prompt.replace(/ ≈ \?$/, "");
  if ((m = p.match(/^(\d+) × (\d+)$/))) return num(m[1]) * num(m[2]);
  if ((m = p.match(/^(\d+)²$/))) return num(m[1]) ** 2;
  if ((m = p.match(/^(\d+)³$/))) return num(m[1]) ** 3;
  if ((m = p.match(/^√(\d+)$/))) return Math.sqrt(num(m[1]));
  if ((m = p.match(/^(\d+)\/(\d+) = \?%$/))) return (num(m[1]) / num(m[2])) * 100;
  if ((m = p.match(/^([\d.]+)% = 1\/\?$/))) return Math.round(100 / num(m[1]));
  if ((m = p.match(/^([\d.]+)% of ([\d.]+)$/))) return (num(m[1]) * num(m[2])) / 100;
  if ((m = p.match(/^(\d+) \+ (\d+) − (\d+)$/))) return num(m[1]) + num(m[2]) - num(m[3]);
  if ((m = p.match(/^([\d.]+) \+ ([\d.]+)$/))) return num(m[1]) + num(m[2]);
  if ((m = p.match(/^(\d+) − (\d+)$/))) return num(m[1]) - num(m[2]);
  if ((m = p.match(/^([\d.]+) × ([\d.]+)$/))) return num(m[1]) * num(m[2]);
  if ((m = p.match(/^([\d.]+) ÷ ([\d.]+)$/))) return num(m[1]) / num(m[2]);
  return NaN;
}

const rng = seeded(42);
for (const d of DRILLS) {
  for (const l of LEVELS) {
    for (let k = 0; k < 300; k++) {
      const q = makeQuestion(d.id, l.id, rng);
      const want = solve(q.prompt);
      ok(Number.isFinite(want), `${d.id}/${l.id}: cannot read prompt "${q.prompt}"`);
      ok(Math.abs(q.answer - want) < 1e-9, `${d.id}/${l.id}: "${q.prompt}" answer ${q.answer}, expected ${want}`);
      ok(isCorrect(q, String(q.answer)), `${d.id}/${l.id}: exact answer to "${q.prompt}" marked wrong`);
      ok(isCorrect(q, q.display.replace(/^about /, "")), `${d.id}/${l.id}: shown answer "${q.display}" for "${q.prompt}" marked wrong`);
      ok(!isCorrect(q, String(Math.round(q.answer) + Math.max(5, Math.abs(q.answer) * 0.1))), `${d.id}/${l.id}: far-off answer to "${q.prompt}" marked right`);
      ok(q.answer >= 0, `${d.id}/${l.id}: negative answer for "${q.prompt}"`);
    }
    // No question repeats within a round of up to 30 questions (or the whole pool, if smaller).
    const pool = new Set(Array.from({ length: 5000 }, () => makeQuestion(d.id, l.id, rng).key)).size;
    const round = makeRound(d.id, l.id, Math.min(30, pool), seeded(7));
    const keys = round.map((q) => q.key);
    ok(new Set(keys).size === keys.length, `${d.id}/${l.id}: repeated question in a round: ${keys.join(" ")}`);
    // Once a small pool runs out the round starts over, but never repeats back to back.
    const r = new DrillRound(d.id, l.id, seeded(3));
    let prev = "";
    for (let k = 0; k < 120; k++) {
      const q = r.next();
      ok(q.key !== prev, `${d.id}/${l.id}: same question twice in a row (${q.key})`);
      prev = q.key;
    }
  }
}
// Ranges asked for: tables to 30, squares to 50, cubes to 30, 1/2 … 1/20.
{
  const seen = (id, lvl, re) => {
    const r = seeded(11);
    let max = 0;
    for (let k = 0; k < 3000; k++) max = Math.max(max, Number(makeQuestion(id, lvl, r).prompt.match(re)?.[1] ?? 0));
    return max;
  };
  eq("tables reach 30", seen("tables", "hard", /^(\d+)/), 30);
  eq("squares reach 50", seen("squares", "hard", /^(\d+)/), 50);
  eq("cubes reach 30", seen("cubes", "hard", /^(\d+)/), 30);
  eq("fractions reach 1/20", seen("fractions", "medium", /^1\/(\d+)/), 20);
}
// Recurring decimals and approximation tolerances.
{
  const third = { key: "1/3", prompt: "1/3 = ?%", answer: 100 / 3, absTolerance: 0.05, display: "33.33" };
  eq("33.33 accepted for 1/3", isCorrect(third, "33.33"), true);
  eq("33.3 accepted for 1/3", isCorrect(third, "33.3"), true);
  eq("33 rejected for 1/3", isCorrect(third, "33"), false);
  const ap = { key: "a", prompt: "x", answer: 1000, relTolerance: 0.03, display: "about 1000" };
  eq("approx within 3%", isCorrect(ap, "1025"), true);
  eq("approx outside 3%", isCorrect(ap, "1040"), false);
  eq("parse commas", parseAnswer("1,024"), 1024);
  eq("parse junk", parseAnswer("12a"), null);
  eq("parse empty", parseAnswer(""), null);
  eq("perMinute 60s", perMinute(25, 60), 25);
  eq("perMinute 2 min", perMinute(25, 120), 12.5);
  eq("perMinute 0s", perMinute(5, 0), 0);
}

// ---- Typing scores ----
{
  const passage = "The quick brown fox jumps over the lazy dog near the river bank.";
  const perfect = scoreTyping(passage, passage, 60);
  eq("perfect: mistakes", [perfect.fullMistakes, perfect.halfMistakes], [0, 0]);
  eq("perfect: accuracy", perfect.accuracy, 100);
  eq("perfect: gross = chars/5 per minute", perfect.grossWpm, Math.round((passage.length / 5) * 10) / 10);
  eq("perfect: net = gross", perfect.netWpm, perfect.grossWpm);

  // One wrong word, one missed word, one extra word, one capital-letter slip.
  const typed = "The quikc brown fox over the the lazy Dog";
  const d = diffWords(passage, typed);
  eq("diff kinds", d.map((t) => t.kind), ["ok", "wrong", "ok", "ok", "missing", "ok", "ok", "extra", "ok", "half"]);
  const s = scoreTyping(passage, typed, 30);
  eq("mistakes: full", s.fullMistakes, 3);
  eq("mistakes: half", s.halfMistakes, 1);
  eq("words typed", s.typedWords, 9);
  // Gross: 41 chars / 5 = 8.2 words in 0.5 min = 16.4 wpm; net: 16.4 − 3.5/0.5 = 9.4.
  eq("gross wpm", s.grossWpm, 16.4);
  eq("net wpm", s.netWpm, 9.4);
  // 6 ok + 0.5 half out of 10 compared words.
  eq("accuracy", s.accuracy, 65);
  // Untyped rest of the passage is not counted as missing.
  eq("unfinished passage: no missing", scoreTyping(passage, "The quick brown", 60).fullMistakes, 0);
  // A skipped word does not make every later word wrong.
  const skip = scoreTyping(passage, "The brown fox jumps over the lazy dog near the river bank.", 60);
  eq("skipped word: one mistake", [skip.fullMistakes, skip.halfMistakes], [1, 0]);
  // Net speed never goes below zero.
  eq("net floor", scoreTyping(passage, "zz yy xx ww vv", 60).netWpm, 0);
  eq("empty", scoreTyping(passage, "", 60).accuracy, 0);
  eq("live wpm", liveWpm("a".repeat(100), 60), 20);
  // Hindi: words compare as Unicode text; the danda is punctuation (half mistake if left out).
  const hi = scoreTyping("जल ही जीवन है।", "जल ही जीवन है", 60);
  eq("hindi danda is half mistake", [hi.fullMistakes, hi.halfMistakes], [0, 1]);
}

// ---- Passages ----
{
  const ids = new Set();
  for (const p of PASSAGES) {
    ok(!ids.has(p.id), `duplicate passage ${p.id}`);
    ids.add(p.id);
    const n = splitWords(p.text).length;
    ok(n >= 150 && n <= 350, `${p.id}: ${n} words (want 150–350)`);
    if (p.lang === "en") ok(/^[\x20-\x7E]+$/.test(p.text), `${p.id}: has characters that need special keys`);
    else ok(/[ऀ-ॿ]/.test(p.text) && !/[A-Za-z]/.test(p.text), `${p.id}: Hindi passage should be Devanagari only`);
  }
  ok(PASSAGES.filter((p) => p.lang === "en").length >= 15, "need at least 15 English passages");
  ok(PASSAGES.filter((p) => p.lang === "hi").length >= 8, "need at least 8 Hindi passages");
}

// ---- Formula sheets ----
const sheets = await formulaTopics();
{
  const subjects = new Set(sheets.map((t) => t.subject));
  for (const s of ["Quantitative Aptitude", "Reasoning", "Mathematics (JEE)"]) ok(subjects.has(s), `no formula sheets for ${s}`);
  ok(!sheets.some((t) => t.id === "apt-verbal-placement"), "verbal aptitude should not get a formula sheet");
  eq("tricks from a shortcut section", shortTricks({ sections: [{ heading: "x + 1/x shortcuts", points: ["a", "b"] }, { heading: "Other", points: ["c", "Net rotation trick: d"] }] }), ["a", "b", "Net rotation trick: d"]);
  eq("quick marks is not a trick", shortTricks({ sections: [], examTips: ["clocks are quick marks", "add long lists quickly"] }), ["add long lists quickly"]);
}

const en = PASSAGES.filter((p) => p.lang === "en").length;
console.log(`\n${checks} checks · ${DRILLS.length} drills · ${en} English + ${PASSAGES.length - en} Hindi passages · ${sheets.length} formula sheets · ${fail ? `${fail} problem(s)` : "all passed"}`);
process.exit(fail ? 1 : 0);
