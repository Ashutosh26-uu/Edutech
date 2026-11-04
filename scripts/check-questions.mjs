// Checks the question bank, the set builder and the Quant generators. Run: npm run check:questions
// Fails (exit 1) if any topic is thin, a tier is missing, a question is duplicated or malformed,
// a practice set breaks its rules, or a generated answer does not match its question.
import { QUESTION_BANK, TOPICS } from "@/data/topics";
import { EXAMS, EXAM_BY_ID, examTopicIds } from "@/data/exams";
import { PATTERNS, mockPlan } from "@/data/patterns";
import { localProvider } from "@/lib/ai/local";
import { generateQuestions, hasGenerator } from "@/lib/generators";
import { DIFFICULTIES, MIN_SET_SIZE, tierQuota } from "@/lib/difficulty";

let fails = 0;
const fail = (name, detail = "") => {
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  fails++;
};
const tiers = (qs) => Object.fromEntries(DIFFICULTIES.map((d) => [d, qs.filter((q) => q.difficulty === d).length]));

// 1. Bank
for (const t of TOPICS) {
  if (hasGenerator(t.id)) continue;
  const k = tiers(QUESTION_BANK.filter((q) => q.topicId === t.id));
  if (Object.values(k).reduce((a, b) => a + b, 0) < MIN_SET_SIZE || DIFFICULTIES.some((d) => k[d] < 2)) fail(`bank ${t.id}: needs ≥${MIN_SET_SIZE} questions and ≥2 per tier`, JSON.stringify(k));
}
for (const q of QUESTION_BANK) {
  if (!DIFFICULTIES.includes(q.difficulty)) fail(`difficulty ${q.id}`);
  if (!(q.answer >= 0 && q.answer < q.options.length) || new Set(q.options).size !== q.options.length || q.options.length < 4) fail(`options ${q.id}`, q.question.slice(0, 60));
  if (q.pyq && !q.source) fail(`pyq without source ${q.id}`);
}
const dupes = QUESTION_BANK.map((q) => q.question).filter((q, i, a) => a.indexOf(q) !== i);
if (dupes.length) fail("duplicate questions", dupes.join(" | "));
const ids = QUESTION_BANK.map((q) => q.id).filter((q, i, a) => a.indexOf(q) !== i);
if (ids.length) fail("duplicate ids", ids.join(", "));

// 2. Quotas
for (const n of [10, 15, 25]) {
  const q = tierQuota(n);
  if (Object.values(q).reduce((a, b) => a + b, 0) !== n || Object.values(q).some((v) => v < 1)) fail(`tierQuota(${n})`, JSON.stringify(q));
}

// 3. Sets: every topic, 20 random sets each
for (const t of TOPICS) {
  for (let i = 0; i < 20; i++) {
    const qs = await localProvider.practiceQuestions({ topicIds: [t.id], count: MIN_SET_SIZE });
    const k = tiers(qs);
    const order = qs.map((q) => DIFFICULTIES.indexOf(q.difficulty));
    if (qs.length < MIN_SET_SIZE || DIFFICULTIES.some((d) => k[d] < 1) || new Set(qs.map((q) => q.question)).size !== qs.length || order.some((v, j) => j && v < order[j - 1])) {
      fail(`set ${t.id}`, `${qs.length} q, ${JSON.stringify(k)}`);
      break;
    }
  }
}

// 4. Full mocks for every exam with practice topics
for (const e of EXAMS) {
  const topicIds = examTopicIds(e);
  if (!topicIds.length) continue;
  const qs = await localProvider.practiceQuestions({ topicIds, count: 25 });
  const k = tiers(qs);
  if (qs.length < MIN_SET_SIZE || DIFFICULTIES.some((d) => k[d] < 1) || new Set(qs.map((q) => q.question)).size !== qs.length) fail(`mock ${e.id}`, `${qs.length} q, ${JSON.stringify(k)}`);
}

// 4b. Paper patterns: every section names a real subject with topics, and the bank can fill it
for (const [examId, pattern] of Object.entries(PATTERNS)) {
  const exam = EXAM_BY_ID.get(examId);
  if (!exam) {
    fail(`pattern ${examId}: unknown exam`);
    continue;
  }
  for (const s of pattern.sections) {
    const subject = exam.subjects.find((x) => x.name === s.subject);
    if (!subject) fail(`pattern ${examId}: no subject "${s.subject}"`, exam.subjects.map((x) => x.name).join(" | "));
    else if (!subject.topicIds.length) fail(`pattern ${examId}: "${s.subject}" has no topics`);
  }
  const plan = mockPlan(exam);
  if (!plan) {
    fail(`pattern ${examId}: no usable sections`);
    continue;
  }
  for (const s of plan.sections) {
    const qs = await localProvider.practiceQuestions({ topicIds: s.topicIds, count: s.questions });
    if (qs.length < Math.min(s.questions, MIN_SET_SIZE)) fail(`pattern ${examId}/${s.subject}: only ${qs.length} questions for ${s.questions}`);
  }
}

// 5. Generators: valid MCQs, and every answer re-derived from the question text
const num = (s) => Number(String(s).replace(/[^\d.]/g, ""));
const n = (s) => Number(String(s).replace(/,/g, ""));
const g = (a, b) => (b ? g(b, a % b) : a);
const ratioStr = (a, b) => `${a / g(a, b)} : ${b / g(a, b)}`;
const CHECKS = [
  [/increased by (\d+)% and then decreased by (\d+)%/, (m) => Math.abs(+m[1] - +m[2] - (+m[1] * +m[2]) / 100)],
  [/(\d+)% of the candidates failed in Hindi, (\d+)% failed in English and (\d+)% failed in both. If ([\d,]+) candidates/, (m) => (n(m[4]) * 100) / (100 - (+m[1] + +m[2] - +m[3]))],
  [/weight of (\d+) g instead of 1 kg and also sells at (\d+)% above/, (m) => ((1000 / +m[1]) * (1 + +m[2] / 100) - 1) * 100],
  [/claims to sell at cost price but uses a weight of (\d+) g/, (m) => (1000 / +m[1] - 1) * 100],
  [/gain (\d+)% even after allowing a discount of (\d+)%/, (m) => ((100 + +m[1]) / (100 - +m[2]) - 1) * 100],
  [/₹([\d,]+) is lent in two parts, one at (\d+)% and the other at (\d+)%.*yearly interest is ₹([\d,]+)/, (m) => (((n(m[1]) * +m[3]) / 100 - n(m[4])) * 100) / (+m[3] - +m[2])],
  [/(\d+)% higher simple interest, it would have fetched ₹([\d,]+) more in (\d+) years/, (m) => (n(m[2]) * 100) / (+m[1] * +m[3])],
  [/(\d+) men working (\d+) hours a day can finish a job in (\d+) days. In how many days will (\d+) men working (\d+) hours/, (m) => (+m[1] * +m[2] * +m[3]) / (+m[4] * +m[5])],
  [/A and B together can finish a work in (\d+) days, B and C in (\d+) days, and C and A in (\d+) days. In how many days can (A|C)/, (m) => 1 / ((1 / +m[1] + 1 / +m[2] + 1 / +m[3]) / 2 - (m[4] === "A" ? 1 / +m[2] : 1 / +m[1]))],
  [/at (\d+) km\/h and returns along the same road at (\d+) km\/h/, (m) => (2 * +m[1] * +m[2]) / (+m[1] + +m[2])],
  [/scores (\d+) runs in his (\d+)\w\w innings and thereby raises his average by (\d+)/, (m) => +m[1] - (+m[2] - 1) * +m[3]],
  [/₹([\d,]+) is divided between A and B in the ratio (\d+) : (\d+)\. What is (A|B)’s share/, (m) => (n(m[1]) * (m[4] === "A" ? +m[2] : +m[3])) / (+m[2] + +m[3])],
  [/If A : B = (\d+) : (\d+) and B : C = (\d+) : (\d+), what is A : C/, (m) => ratioStr(+m[1] * +m[3], +m[2] * +m[4])],
  [/ratio (\d+) : (\d+)\. If (\d+) is added to each, the ratio becomes (\d+) : (\d+)/, (m) => (+m[1] * (+m[3] * (+m[4] - +m[5]))) / (+m[1] * +m[5] - +m[2] * +m[4])],
  [/A (\d+)-litre mixture has milk and water in the ratio (\d+) : (\d+)\. How much water must be added to make the ratio (\d+) : (\d+)/, (m) => {
    const milk = (+m[1] * +m[2]) / (+m[2] + +m[3]);
    return (milk * +m[5]) / +m[4] - (+m[1] - milk);
  }],
  [/Convert (\d+) km\/h into metres per second/, (m) => (+m[1] * 5) / 18],
  [/A train (\d+) m long runs at (\d+) km\/h\. How long/, (m) => +m[1] / ((+m[2] * 5) / 18)],
  [/A train (\d+) m long crosses a (\d+) m long platform in (\d+) seconds/, (m) => ((+m[1] + +m[2]) / +m[3]) * 3.6],
  [/Two trains, (\d+) m and (\d+) m long, .* at (\d+) km\/h and (\d+) km\/h/, (m) => (+m[1] + +m[2]) / (((+m[3] + +m[4]) * 5) / 18)],
  [/goes (\d+) km downstream in ([\d.]+) hours and comes back the same distance upstream in ([\d.]+) hours\. What is the speed of (the stream|the boat in still water)/, (m) => {
    const [down, up] = [+m[1] / +m[2], +m[1] / +m[3]];
    return m[4] === "the stream" ? (down - up) / 2 : (down + up) / 2;
  }],
  [/compound interest on ₹([\d,]+) at (\d+)% per annum for 2 years/, (m) => n(m[1]) * ((1 + +m[2] / 100) ** 2 - 1)],
  [/difference between compound interest and simple interest on ₹([\d,]+) for 2 years at (\d+)%/, (m) => (n(m[1]) * Number(m[2]) ** 2) / 1e4],
  [/What does ₹([\d,]+) amount to in 3 years at (\d+)%/, (m) => n(m[1]) * (1 + +m[2] / 100) ** 3],
  [/doubles itself in (\d+) years at compound interest\. In how many years will it become (\d+) times/, (m) => +m[1] * Math.log2(+m[2])],
  [/amounts to ₹([\d,]+) in 2 years and ₹([\d,]+) in 3 years/, (m) => ((n(m[2]) - n(m[1])) / n(m[1])) * 100],
  [/A is (twice|\d+ times) as efficient as B, and together they finish a work in (\d+) days\. In how many days can (A|B)/, (m) => {
    const k = m[1] === "twice" ? 2 : parseInt(m[1]);
    return m[3] === "A" ? (+m[2] * (k + 1)) / k : +m[2] * (k + 1);
  }],
  [/holds (\d+) litres of pure milk\. (\d+) litres are taken out and replaced with water, and this is done (twice|three times)/, (m) => +m[1] * (1 - +m[2] / +m[1]) ** (m[3] === "twice" ? 2 : 3)],
  [/spotted by a policeman (\d+) m away\. The thief runs at (\d+) km\/h and the policeman chases at (\d+) km\/h/, (m) => (+m[1] * +m[2]) / (+m[3] - +m[2])],
  [/difference between compound interest and simple interest on ₹([\d,]+) for 3 years at (\d+)%/, (m) => n(m[1]) * (+m[2] / 100) ** 2 * (3 + +m[2] / 100)],
];
let derived = 0;
for (const t of TOPICS.filter((x) => hasGenerator(x.id))) {
  for (const d of DIFFICULTIES) {
    const qs = generateQuestions(t.id, 120, Math.random, d);
    if (qs.length < 5) fail(`generator ${t.id}/${d}: too few distinct questions`, `${qs.length}`);
    for (const q of qs) {
      if (q.difficulty !== d || q.options.length !== 4 || new Set(q.options).size !== 4 || !(q.answer >= 0 && q.answer < 4)) fail(`generator ${t.id}/${d}: malformed`, q.question);
      for (const [re, f] of CHECKS) {
        const m = q.question.match(re);
        if (!m) continue;
        derived++;
        const want = f(m);
        const got = q.options[q.answer];
        const ok = typeof want === "string" ? got === want : Math.abs(num(got) - want) <= 0.011;
        if (!ok) fail(`generator ${t.id}/${d}: wrong answer`, `${q.question} → ${got}, expected ${want}`);
      }
    }
  }
}

console.log(`Checked ${QUESTION_BANK.length} bank questions, ${TOPICS.length} topics, ${EXAMS.length} exams, ${derived} generated answers.`);
console.log(fails ? `\n${fails} check(s) failed` : "All checks passed");
process.exit(fails ? 1 : 0);
