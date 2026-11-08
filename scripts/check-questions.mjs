// Checks the question bank, the set builder and the Quant generators. Run: npm run check:questions
// Fails (exit 1) if any topic is thin, a tier is missing, a question is duplicated or malformed,
// a practice set breaks its rules, or a generated answer does not match its question.
import { readFileSync } from "node:fs";
import { TOPICS } from "@/data/topics";
import { BANK_TOPIC_IDS, bankSize, loadAllBank } from "@/lib/bank";
import { buildIndex, buildNotesIndex, NOTES_OUT } from "./bank-index.mjs";
import { NOTES_LOADERS } from "@/data/notes";
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

// 1. Bank: every file belongs to a topic, the index is current, ids carry their topic
const QUESTION_BANK = await loadAllBank();
// Line endings may differ after a Windows checkout, so compare without them.
const norm = (s) => s.replace(/\r/g, "");
if (norm(buildIndex()) !== norm(readFileSync("src/data/bank/index.ts", "utf8"))) fail("bank index is stale", "run: npm run bank:index");
for (const id of BANK_TOPIC_IDS) if (!TOPICS.some((t) => t.id === id)) fail(`bank file ${id}: no such topic in topics.ts`);
// Short notes: index current, every file belongs to a topic and has real content.
if (norm(buildNotesIndex()) !== norm(readFileSync(NOTES_OUT, "utf8"))) fail("notes index is stale", "run: npm run bank:index");
for (const [id, load] of Object.entries(NOTES_LOADERS)) {
  if (!TOPICS.some((t) => t.id === id)) fail(`notes file ${id}: no such topic in topics.ts`);
  const n = (await load()).default;
  if (!n.sections?.length || n.sections.some((s) => !s.heading || !s.points?.length)) fail(`notes ${id}: needs sections with a heading and points`);
}
for (const id of BANK_TOPIC_IDS) {
  const n = QUESTION_BANK.filter((q) => q.topicId === id).length;
  if (n !== bankSize(id)) fail(`bank index count for ${id}`, `index says ${bankSize(id)}, file has ${n}`);
}
for (const q of QUESTION_BANK) if (!q.id.startsWith(`${q.topicId}-`)) fail(`id ${q.id}: must start with its topic id "${q.topicId}-"`);
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
  [/first increased by (\d+)%, then decreased by (\d+)%, and then increased by (\d+)%\. If the final number is ([\d,]+)/, (m) => (n(m[4]) * 1e6) / ((100 + +m[1]) * (100 - +m[2]) * (100 + +m[3]))],
  [/sold it at a gain of (\d+)%\. Had he bought it at (\d+)% less and sold it for ₹([\d,]+) less, he would have gained (\d+)%/, (m) => (n(m[3]) * 1e4) / ((100 + +m[1]) * 100 - (100 - +m[2]) * (100 + +m[4]))],
  [/Pipe A can fill a tank in (\d+) hours and pipe B in (\d+) hours, while pipe C can empty it in (\d+) hours\. All three are opened together, and after (\d+) hours? pipe C is closed/, (m) => (1 - +m[4] * (1 / +m[1] + 1 / +m[2] - 1 / +m[3])) / (1 / +m[1] + 1 / +m[2])],
  [/Walking at (\d+)\/(\d+) of his usual speed, a man reaches his office (\d+) minutes late/, (m) => (+m[3] * +m[1]) / (+m[2] - +m[1])],
  [/difference between the compound interest and the simple interest on a sum for 3 years at (\d+)% per annum is ₹([\d,]+)/, (m) => (n(m[2]) * 1e6) / (+m[1] * +m[1] * (300 + +m[1]))],
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
  // Number system
  [/What is the LCM of (\d+) and (\d+)\?/, (m) => (+m[1] * +m[2]) / g(+m[1], +m[2])],
  [/What is the HCF of (\d+), (\d+) and (\d+)\?/, (m) => g(g(+m[1], +m[2]), +m[3])],
  [/What is the unit digit of (\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\?/, (m) => {
    const exp = Number([...m[2]].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
    return Number(BigInt(m[1]) ** BigInt(exp) % 10n);
  }],
  [/smallest digit that can replace \* in (\d*)\*(\d*) so that the number is divisible by (\d+)/, (m) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((x) => Number(`${m[1]}${x}${m[2]}`) % +m[3] === 0)],
  [/divided by (\d+), the remainder is (\d+)\. What will the remainder be when the same number is divided by (\d+)/, (m) => {
    // Try several numbers that leave the stated remainder; they must all agree.
    const rs = new Set([1, 2, 3, 7, 11].map((k) => (+m[1] * k + +m[2]) % +m[3]));
    return rs.size === 1 ? [...rs][0] : NaN;
  }],
  [/How many numbers from 1 to (\d+) are divisible by (?:neither (\d+) nor (\d+)|(\d+) or (\d+))\?/, (m) => {
    const neither = m[2] !== undefined;
    const [a, b] = neither ? [+m[2], +m[3]] : [+m[4], +m[5]];
    let c = 0;
    for (let i = 1; i <= +m[1]; i++) if ((i % a === 0 || i % b === 0) !== neither) c++;
    return c;
  }],
  [/HCF of two numbers is (\d+) and their LCM is ([\d,]+)\. If one of the numbers is (\d+)/, (m) => {
    const [h, L, x] = [+m[1], n(m[2]), +m[3]];
    const y = (h * L) / x;
    return g(x, y) === h && (x * y) / g(x, y) === L ? y : NaN;
  }],
  [/largest number that divides (\d+), (\d+) and (\d+) leaving remainders (\d+), (\d+) and (\d+) respectively/, (m) => {
    for (let d = +m[1]; d > 1; d--) if (d > Math.max(+m[4], +m[5], +m[6]) && [1, 2, 3].every((i) => +m[i] % d === +m[i + 3])) return d;
    return NaN;
  }],
  // Mensuration (π = 22/7)
  [/The area of a square is (\d+) (?:cm|m)²\. What is its perimeter/, (m) => 4 * Math.sqrt(+m[1])],
  [/A rectangle is (\d+) (?:cm|m) long and (\d+) (?:cm|m) wide\. What is its (area|perimeter)/, (m) => (m[3] === "area" ? +m[1] * +m[2] : 2 * (+m[1] + +m[2]))],
  [/What is the (area|circumference) of a circle of radius (\d+) cm/, (m) => (m[1] === "area" ? (22 / 7) * Number(m[2]) ** 2 : 2 * (22 / 7) * +m[2])],
  [/solid cylinder has radius (\d+) cm and height (\d+) cm\. What is its (volume|curved surface area|total surface area)/, (m) => {
    const [r, h] = [+m[1], +m[2]];
    return { volume: (22 / 7) * r * r * h, "curved surface area": 2 * (22 / 7) * r * h, "total surface area": 2 * (22 / 7) * r * (r + h) }[m[3]];
  }],
  [/cone has base radius (\d+) cm and height (\d+) cm\. What is its (volume|curved surface area)/, (m) => {
    const [r, h] = [+m[1], +m[2]];
    return m[3] === "volume" ? ((22 / 7) * r * r * h) / 3 : (22 / 7) * r * Math.hypot(r, h);
  }],
  [/length of a rectangle is increased by (\d+)% and its breadth is decreased by (\d+)%/, (m) => Math.abs((1 + +m[1] / 100) * (1 - +m[2] / 100) - 1) * 100],
  [/radius of a circle is (increased|decreased) by (\d+)%/, (m) => Math.abs((1 + (m[1] === "increased" ? 1 : -1) * (+m[2] / 100)) ** 2 - 1) * 100],
  [/field is (\d+) m long and (\d+) m wide\. A path ([\d.]+) m wide runs all around it (outside|inside)/, (m) => {
    const [L, B, w] = [+m[1], +m[2], +m[3]];
    const k = m[4] === "outside" ? 2 * w : -2 * w;
    return Math.abs((L + k) * (B + k) - L * B);
  }],
  [/sphere of radius (\d+) cm is melted and recast into small solid spheres, each of radius (\d+) cm/, (m) => ((4 / 3) * Math.PI * Number(m[1]) ** 3) / ((4 / 3) * Math.PI * Number(m[2]) ** 3)],
  [/sphere of radius (\d+) cm is melted and recast into a solid cylinder of radius (\d+) cm/, (m) => ((4 / 3) * Math.PI * Number(m[1]) ** 3) / (Math.PI * Number(m[2]) ** 2)],
  [/cost of fencing a circular field at ₹(\d+) per metre is ₹([\d,]+)\. What is the area/, (m) => {
    const r = n(m[2]) / +m[1] / (2 * (22 / 7));
    return (22 / 7) * r * r;
  }],
  [/rectangular park are in the ratio (\d+) : (\d+) and its area is ([\d,]+) m²\. What is the cost of fencing it at ₹(\d+)/, (m) => {
    const x = Math.sqrt(n(m[3]) / (+m[1] * +m[2]));
    return 2 * (+m[1] + +m[2]) * x * +m[4];
  }],
  // Very-hard additions, one per topic
  [/^(\d+)% of A is equal to (\d+)% of B\. If A \+ B = ([\d,]+), what is the value of A\?/, (m) => {
    // x·A = y·B and A + B = S ⇒ A = S·y/(x + y)
    return (n(m[3]) * +m[2]) / (+m[1] + +m[2]);
  }],
  [/dishonest dealer marks his goods (\d+)% above the cost price, allows a discount of (\d+)% and also uses a weight of (\d+) g in place of 1 kg/, (m) => {
    // Charges for 1000 g at MP×(1−d), hands over w g: gain on cost w.
    const charged = (1 + +m[1] / 100) * (1 - +m[2] / 100) * 1000;
    return ((charged - +m[3]) / +m[3]) * 100;
  }],
  [/A sum of ₹([\d,]+) is lent in two parts: the first at (\d+)% per annum for (\d+) years and the second at (\d+)% per annum for (\d+) years\. If both parts earn equal simple interest, what is the first part/, (m) => {
    // P1·r1·t1 = (S − P1)·r2·t2 ⇒ P1 = S·r2·t2/(r1·t1 + r2·t2)
    const [S, r1, t1, r2, t2] = [n(m[1]), +m[2], +m[3], +m[4], +m[5]];
    return (S * r2 * t2) / (r1 * t1 + r2 * t2);
  }],
  [/A can complete a work in (\d+) days\. He works alone for (\d+) days, after which B joins him and the two finish the remaining work in (\d+) days\. In how many days can B alone/, (m) => {
    const [a, d, t] = [+m[1], +m[2], +m[3]];
    const bRate = (1 - d / a) / t - 1 / a;
    return 1 / bRate;
  }],
  [/The average of (\d+) numbers was calculated as (\d+)\. It was later found that one number had been read as (\d+) instead of (\d+)\. What is the correct average/, (m) => {
    const [cnt, avg, wrong, right] = [+m[1], +m[2], +m[3], +m[4]];
    return (cnt * avg - wrong + right) / cnt;
  }],
  [/A, B and C invest ₹([\d,]+), ₹([\d,]+) and ₹([\d,]+) in a business for (\d+), (\d+) and (\d+) months respectively\. If the total profit is ₹([\d,]+), what is (A|B|C)’s share/, (m) => {
    const w = [n(m[1]) * +m[4], n(m[2]) * +m[5], n(m[3]) * +m[6]];
    return (n(m[7]) * w["ABC".indexOf(m[8])]) / (w[0] + w[1] + w[2]);
  }],
  [/A (\d+) m long train crosses a pole in (\d+) seconds and crosses a (\d+) m long train coming from the opposite direction in (\d+) seconds\. What is the speed of the second train/, (m) => {
    const [L1, t1, L2, t2] = [+m[1], +m[2], +m[3], +m[4]];
    return ((L1 + L2) / t2 - L1 / t1) * 3.6;
  }],
  [/A loan of ₹([\d,]+) at (\d+)% per annum compound interest is to be repaid in two equal annual instalments\. What is the value of each instalment/, (m) => {
    // Solve P = x/q + x/q² by searching x, independent of the closed form.
    const [P, q] = [n(m[1]), 1 + +m[2] / 100];
    let lo = 0, hi = P;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (mid / q + mid / (q * q) < P) lo = mid; else hi = mid;
    }
    return lo;
  }],
  [/What is the remainder when (\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+) is divided by (\d+)\?/, (m) => {
    const exp = Number([...m[2]].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
    return Number(BigInt(m[1]) ** BigInt(exp) % BigInt(m[3]));
  }],
  [/A room is (\d+) m long, (\d+) m wide and (\d+) m high\. It has one door measuring 2 m × 1\.5 m and (\d+) windows each measuring 1\.5 m × 1 m\. What is the cost of painting its four walls and the ceiling at ₹(\d+) per m²/, (m) => {
    const [l, b, h, w, rate] = [+m[1], +m[2], +m[3], +m[4], +m[5]];
    return (2 * l * h + 2 * b * h + l * b - 2 * 1.5 - w * 1.5 * 1) * rate;
  }],
];
let derived = 0;
const NEW_TOPICS = ["quant-number-system", "quant-mensuration"];
for (const id of NEW_TOPICS) if (!hasGenerator(id)) fail(`generator ${id}: missing`);
// The new topics are checked directly, whether or not topics.ts lists them yet.
const genTopics = [...new Set([...TOPICS.filter((x) => hasGenerator(x.id)).map((x) => x.id), ...NEW_TOPICS])];
const hits = CHECKS.map(() => 0);
const DEVANAGARI = /[ऀ-ॿ]/;
const numbers = (s) => (s.match(/\d[\d,.]*/g) ?? []).map((x) => x.replace(/[.,]+$/, ""));
let hindi = 0;
for (const id of genTopics) {
  for (const d of DIFFICULTIES) {
    const qs = generateQuestions(id, 120, Math.random, d);
    if (qs.length < 5) fail(`generator ${id}/${d}: too few distinct questions`, `${qs.length}`);
    for (const q of qs) {
      if (q.difficulty !== d || q.options.length !== 4 || new Set(q.options).size !== 4 || !(q.answer >= 0 && q.answer < 4)) fail(`generator ${id}/${d}: malformed`, q.question);
      let matched = false;
      CHECKS.forEach(([re, f], i) => {
        const m = q.question.match(re);
        if (!m) return;
        matched = true;
        derived++;
        hits[i]++;
        const want = f(m);
        const got = q.options[q.answer];
        const ok = typeof want === "string" ? got === want : Math.abs(num(got) - want) <= 0.011;
        if (!ok) fail(`generator ${id}/${d}: wrong answer`, `${q.question} → ${got}, expected ${want}`);
      });
      if (!matched && NEW_TOPICS.includes(id)) fail(`generator ${id}/${d}: no answer check for`, q.question);

      // Hindi: question and explanation in Devanagari, with the same numbers as the English;
      // Hindi options (when present) line up one-to-one with the English ones.
      hindi++;
      if (!q.questionHi?.trim() || !DEVANAGARI.test(q.questionHi)) fail(`generator ${id}/${d}: no Hindi question`, q.question);
      if (!q.explanationHi?.trim() || !DEVANAGARI.test(q.explanationHi)) fail(`generator ${id}/${d}: no Hindi explanation`, q.question);
      const missing = numbers(q.question).filter((x) => !numbers(q.questionHi ?? "").includes(x));
      if (missing.length) fail(`generator ${id}/${d}: Hindi question lacks ${missing.join(", ")}`, `${q.question} | ${q.questionHi}`);
      if (q.optionsHi) {
        if (q.optionsHi.length !== q.options.length) fail(`generator ${id}/${d}: optionsHi length`, q.question);
        else if (q.optionsHi.some((o, i) => !o.trim() || o.replace(/[^\d.]/g, "") !== q.options[i].replace(/[^\d.]/g, ""))) fail(`generator ${id}/${d}: optionsHi out of order`, `${q.options} | ${q.optionsHi}`);
      }
    }
  }
}
CHECKS.forEach(([re], i) => {
  if (!hits[i]) fail("answer check never matched a generated question", String(re));
});

console.log(`Checked ${QUESTION_BANK.length} bank questions, ${TOPICS.length} topics, ${EXAMS.length} exams, ${derived} generated answers, ${hindi} Hindi versions.`);
console.log(fails ? `\n${fails} check(s) failed` : "All checks passed");
process.exit(fails ? 1 : 0);
