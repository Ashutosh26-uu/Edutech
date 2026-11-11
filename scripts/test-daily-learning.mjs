// Checks word and fact of the day, printable sheets and audio revision data:
// every word and fact has all its fields, no word repeats, every fact's topic exists, the daily
// pick is the same on every run and walks the whole list before repeating, the 3-option quiz is
// sound, and the help bot sends the new questions to the new answers.
// Run: npm run test:daily-learning
import { DAILY_FACTS } from "../src/data/daily-facts.ts";
import { DAILY_WORDS } from "../src/data/daily-words.ts";
import { TOPIC_BY_ID } from "../src/data/topics.ts";
import { dailyIndex, meaningQuiz, pickForDay } from "../src/lib/dailyLearn.ts";
import { answer } from "../src/lib/helpbot.ts";
import { addDays } from "../src/lib/streak.ts";

let fail = 0;
const bad = (msg) => {
  fail++;
  console.log("✗ " + msg);
};

// ---- Words ----
const POS = new Set(["noun", "verb", "adjective", "adverb"]);
const seenWords = new Set();
for (const w of DAILY_WORDS) {
  for (const k of ["word", "pos", "meaning", "synonym", "antonym", "example", "hindi"]) if (typeof w[k] !== "string" || !w[k].trim()) bad(`word ${w.word}: empty ${k}`);
  if (!POS.has(w.pos)) bad(`word ${w.word}: unknown part of speech ${w.pos}`);
  const key = w.word.toLowerCase();
  if (seenWords.has(key)) bad(`duplicate word ${w.word}`);
  seenWords.add(key);
  if (!/[ऀ-ॿ]/.test(w.hindi)) bad(`word ${w.word}: Hindi meaning is not in Devanagari`);
  if (w.synonym.toLowerCase() === key || w.antonym.toLowerCase() === key) bad(`word ${w.word}: synonym/antonym repeats the word`);
  if (w.synonym.toLowerCase() === w.antonym.toLowerCase()) bad(`word ${w.word}: synonym equals antonym`);
}
if (DAILY_WORDS.length < 400) bad(`only ${DAILY_WORDS.length} words (want 400+)`);

// ---- Facts ----
const seenFacts = new Set();
for (const f of DAILY_FACTS) {
  for (const k of ["topicId", "fact", "hook"]) if (typeof f[k] !== "string" || !f[k].trim()) bad(`fact "${f.fact?.slice(0, 40)}": empty ${k}`);
  if (!TOPIC_BY_ID.has(f.topicId)) bad(`fact "${f.fact.slice(0, 40)}": unknown topic ${f.topicId}`);
  if (seenFacts.has(f.fact)) bad(`duplicate fact "${f.fact.slice(0, 40)}"`);
  seenFacts.add(f.fact);
}
if (DAILY_FACTS.length < 400) bad(`only ${DAILY_FACTS.length} facts (want 400+)`);

// ---- Daily pick: deterministic, in range, no repeat within one full cycle ----
for (const [name, list, salt] of [
  ["word", DAILY_WORDS, "word"],
  ["fact", DAILY_FACTS, "fact"],
]) {
  if (pickForDay(list, "2026-11-11", salt) !== pickForDay(list, "2026-11-11", salt)) bad(`${name}: pick is not deterministic`);
  const seen = new Set();
  let day = "2026-01-01";
  for (let i = 0; i < list.length; i++, day = addDays(day, 1)) {
    const idx = dailyIndex(day, list.length, salt);
    if (!Number.isInteger(idx) || idx < 0 || idx >= list.length) bad(`${name}: index ${idx} out of range on ${day}`);
    seen.add(idx);
  }
  if (seen.size !== list.length) bad(`${name}: ${list.length - seen.size} items repeat before the list is used up`);
  if (dailyIndex("2026-11-11", list.length, salt) === dailyIndex("2026-11-12", list.length, salt)) bad(`${name}: same pick two days running`);
}

// ---- Quiz me ----
for (let d = 0, day = "2026-01-01"; d < 60; d++, day = addDays(day, 1)) {
  const i = dailyIndex(day, DAILY_WORDS.length, "word");
  const q = meaningQuiz(DAILY_WORDS, i, day);
  if (q.options.length !== 3) bad(`${day}: quiz has ${q.options.length} options`);
  if (q.options[q.answer] !== DAILY_WORDS[i].meaning) bad(`${day}: quiz answer is not the word's meaning`);
  if (new Set(q.options).size !== q.options.length) bad(`${day}: quiz has duplicate options`);
  const again = meaningQuiz(DAILY_WORDS, i, day);
  if (again.options.join("|") !== q.options.join("|")) bad(`${day}: quiz is not deterministic`);
}

// ---- Help bot ----
for (const [q, want] of [
  ["word of the day", "word-of-day"],
  ["aaj ka word kahan hai", "word-of-day"],
  ["gk fact of the day", "word-of-day"],
  ["audio revision", "audio-revision"],
  ["safar mein revision kaise kare", "audio-revision"],
  ["read aloud", "read-aloud"],
]) {
  const { reply } = answer(q, {});
  if (reply.id !== want) bad(`help bot: "${q}" → ${reply.id ?? "?"} (want ${want})`);
}

console.log(`${DAILY_WORDS.length} words, ${DAILY_FACTS.length} facts`);
if (fail) {
  console.log(`\n${fail} problem(s)`);
  process.exit(1);
}
console.log("✓ daily learning checks passed");
