// Appends new questions to one topic's bank file, safely: checks every field, gives each question
// the next id, refuses repeats (of the bank's existing questions anywhere, or within the batch)
// and keeps the file's header count right. Rejected lines are printed with the reason.
//
// Usage: node scripts/bank-append.mjs <topic-id> <questions.jsonl> [--dry-run]
// Each line of the .jsonl file is one question WITHOUT an id:
//   {"question":"…","options":["…","…","…","…"],"answer":2,"explanation":"…","difficulty":"hard","source":"TCS NQT · Infosys"}
// difficulty: easy | moderate | hard | very-hard. `source` (optional) names the exams the question
// suits; never `pyq` (new questions are original). Hindi topics write question/options in Hindi.
// After appending to any topics, run: npm run bank:index && npm run check:questions
import { readFileSync, readdirSync, writeFileSync, existsSync, openSync, closeSync, unlinkSync } from "node:fs";

const [topic, file, flag] = process.argv.slice(2);
if (!topic || !file) {
  console.error("Usage: node scripts/bank-append.mjs <topic-id> <questions.jsonl> [--dry-run]");
  process.exit(1);
}
const BANK = "src/data/bank";
const path = `${BANK}/${topic}.ts`;
if (!existsSync(path)) {
  console.error(`No bank file ${path}`);
  process.exit(1);
}
// Several helpers may append to the same topic at once: take a per-file lock (wait up to 2 min),
// and read the file and the id/duplicate state only while holding it.
const lock = `${path}.lock`;
const t0 = Date.now();
for (;;) {
  try {
    closeSync(openSync(lock, "wx"));
    break;
  } catch {
    if (Date.now() - t0 > 120_000) {
      console.error(`Timed out waiting for ${lock}; remove it if no other helper is running.`);
      process.exit(1);
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
  }
}
process.on("exit", () => {
  try {
    unlinkSync(lock);
  } catch {
    /* already gone */
  }
});

const DIFF = ["easy", "moderate", "hard", "very-hard"];
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const isQuestionLine = (l) => /^\s*\{\s*"id"\s*:/.test(l);

// Every question already in the bank, all topics, so a new one can't repeat any of them.
const seen = new Map();
for (const f of readdirSync(BANK)) {
  if (!f.endsWith(".ts") || f === "index.ts") continue;
  for (const line of readFileSync(`${BANK}/${f}`, "utf8").split(/\r?\n/)) {
    // Older files write `"id": "…"` (with a space), newer ones `"id":"…"`: accept both.
    if (!isQuestionLine(line)) continue;
    try {
      const q = JSON.parse(line.trim().replace(/,$/, ""));
      seen.set(norm(q.question), q.id);
    } catch {
      /* not a question line */
    }
  }
}

const text = readFileSync(path, "utf8");
const eol = text.includes("\r\n") ? "\r\n" : "\n";
const lines = text.split(/\r?\n/);
const end = lines.findIndex((l) => l.startsWith("];"));
if (end < 0) throw new Error(`${path}: no closing "];"`);
let next = 0;
for (const l of lines) {
  const m = l.match(new RegExp(`"id"\\s*:\\s*"${topic}-(\\d+)"`));
  if (m) next = Math.max(next, Number(m[1]));
}

const out = [];
const rejected = [];
const raw = readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim());
raw.forEach((line, n) => {
  const why = (r) => rejected.push(`line ${n + 1}: ${r}`);
  let q;
  try {
    q = JSON.parse(line);
  } catch {
    return why("not valid JSON");
  }
  const { question, options, answer, explanation, difficulty, source } = q;
  if (typeof question !== "string" || question.trim().length < 15) return why("question missing or too short");
  if (!Array.isArray(options) || options.length !== 4 || options.some((o) => typeof o !== "string" || !o.trim())) return why("needs exactly 4 non-empty options");
  if (new Set(options.map((o) => norm(o))).size !== 4) return why("two options are the same");
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) return why("answer must be 0-3");
  if (typeof explanation !== "string" || explanation.trim().length < 30) return why("explanation missing or too short (30+ characters)");
  if (!DIFF.includes(difficulty)) return why(`difficulty must be one of ${DIFF.join(", ")}`);
  if (source !== undefined && (typeof source !== "string" || source.length > 80)) return why("source must be a short string");
  if ("pyq" in q || "id" in q) return why("don't set id or pyq");
  const key = norm(question);
  if (seen.has(key)) return why(`repeats ${seen.get(key)}`);
  next++;
  const id = `${topic}-${next}`;
  seen.set(key, id);
  const clean = { id, question: question.trim(), options: options.map((o) => o.trim()), answer, explanation: explanation.trim(), difficulty };
  for (const k of ["questionHi", "optionsHi", "explanationHi"]) if (q[k] !== undefined) clean[k] = q[k];
  if (source) clean.source = source.trim();
  out.push(`  ${JSON.stringify(clean)},`);
});

const total = lines.filter(isQuestionLine).length + out.length;
const header = lines.findIndex((l) => /: \d+ questions\./.test(l));
if (header >= 0) lines[header] = lines[header].replace(/: \d+ questions\./, `: ${total} questions.`);
// The file's last question may have no trailing comma (it used to be the final element).
for (let i = end - 1; i >= 0; i--) {
  if (!isQuestionLine(lines[i])) continue;
  if (!/\},\s*$/.test(lines[i])) lines[i] = lines[i].replace(/\}\s*$/, "},");
  break;
}
lines.splice(end, 0, ...out);
if (flag !== "--dry-run" && out.length) writeFileSync(path, lines.join(eol));

const pos = [0, 0, 0, 0];
for (const l of out) pos[JSON.parse(l.trim().replace(/,$/, "")).answer]++;
console.log(`${topic}: ${flag === "--dry-run" ? "would add" : "added"} ${out.length}, rejected ${rejected.length}, file now ${total}. Answer positions A-D: ${pos.join("/")}`);
for (const r of rejected) console.log("  ✗ " + r);
