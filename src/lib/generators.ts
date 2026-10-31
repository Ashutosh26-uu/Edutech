import type { MCQ } from "./types";
import { shuffle } from "./nlp";

/**
 * Template-based Quant question generators. Every question is computed, so answers are
 * always correct and practice never runs out.
 */

type Rand = () => number;
const pick = <T,>(arr: T[], r: Rand) => arr[Math.floor(r() * arr.length)];
const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2).replace(/\.?0+$/, ""));

/** Builds a numeric MCQ with plausible near-miss distractors. */
function numeric(id: string, topicId: string, question: string, answer: number, explanation: string, r: Rand, unit = ""): MCQ {
  const steps = [0.8, 0.9, 1.1, 1.2, 1.25, 0.75, 1.5, 0.5];
  const set = new Set<number>([answer]);
  for (const s of shuffle(steps, r)) {
    if (set.size === 4) break;
    const v = Math.round(answer * s);
    if (v > 0 && v !== answer) set.add(v);
  }
  let k = 1;
  while (set.size < 4) set.add(answer + k++ * Math.max(1, Math.round(answer / 10)));
  const options = shuffle([...set], r);
  return {
    id,
    topicId,
    question,
    options: options.map((o) => `${unit}${fmt(o)}`),
    answer: options.indexOf(answer),
    explanation,
  };
}

const GENERATORS: Record<string, (id: string, r: Rand) => MCQ> = {
  "quant-percentage": (id, r) => {
    const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 60, 75], r);
    const n = pick([40, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600, 800, 1200], r);
    const ans = (p * n) / 100;
    if (!Number.isInteger(ans)) return GENERATORS["quant-percentage"](id, r);
    return numeric(id, "quant-percentage", `What is ${p}% of ${fmt(n)}?`, ans, `${p}% of ${fmt(n)} = ${p} × ${fmt(n)} ÷ 100 = ${fmt(ans)}.`, r);
  },
  "quant-profit-loss": (id, r) => {
    const cp = pick([200, 250, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500], r);
    const pct = pick([5, 10, 12, 15, 20, 25, 30, 40], r);
    const profit = r() < 0.6;
    const sp = (cp * (100 + (profit ? pct : -pct))) / 100;
    if (!Number.isInteger(sp)) return GENERATORS["quant-profit-loss"](id, r);
    const word = profit ? "profit" : "loss";
    return numeric(
      id, "quant-profit-loss",
      `An article costs ₹${fmt(cp)}. At what price must it be sold to make a ${word} of ${pct}%?`,
      sp,
      `SP = CP × (100 ${profit ? "+" : "−"} ${pct}) ÷ 100 = ${fmt(cp)} × ${100 + (profit ? pct : -pct)} ÷ 100 = ₹${fmt(sp)}.`,
      r, "₹",
    );
  },
  "quant-simple-interest": (id, r) => {
    const p = pick([1000, 2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000, 15000], r);
    const rate = pick([4, 5, 6, 8, 10, 12, 15], r);
    const t = pick([2, 3, 4, 5, 6], r);
    const si = (p * rate * t) / 100;
    return numeric(
      id, "quant-simple-interest",
      `Find the simple interest on ₹${fmt(p)} at ${rate}% per annum for ${t} years.`,
      si,
      `SI = P × R × T ÷ 100 = ${fmt(p)} × ${rate} × ${t} ÷ 100 = ₹${fmt(si)}.`,
      r, "₹",
    );
  },
  "quant-time-work": (id, r) => {
    const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [12, 6], [20, 5], [30, 60], [18, 9], [24, 8], [21, 42], [15, 10], [40, 60]], r);
    const t = (a * b) / (a + b);
    return numeric(
      id, "quant-time-work",
      `A can finish a piece of work in ${a} days and B can finish it in ${b} days. In how many days can they finish it together?`,
      t,
      `Together they finish in (${a} × ${b}) ÷ (${a} + ${b}) = ${a * b} ÷ ${a + b} = ${fmt(t)} days.`,
      r,
    );
  },
  "quant-average": (id, r) => {
    const count = pick([4, 5, 6], r);
    const avg = pick([12, 15, 18, 20, 24, 25, 30, 36, 40, 45], r);
    const nums = Array.from({ length: count - 1 }, () => avg + Math.round((r() - 0.5) * avg));
    nums.push(avg * count - nums.reduce((s, n) => s + n, 0));
    if (nums.some((n) => n <= 0)) return GENERATORS["quant-average"](id, r);
    return numeric(
      id, "quant-average",
      `What is the average of ${nums.slice(0, -1).join(", ")} and ${nums.at(-1)}?`,
      avg,
      `Sum = ${nums.join(" + ")} = ${avg * count}; average = ${avg * count} ÷ ${count} = ${avg}.`,
      r,
    );
  },
};

export const hasGenerator = (topicId: string) => topicId in GENERATORS;

export function generateQuestions(topicId: string, count: number, r: Rand = Math.random): MCQ[] {
  const gen = GENERATORS[topicId];
  if (!gen) return [];
  const out: MCQ[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < count && i < count * 10; i++) {
    const q = gen(`${topicId}-g${Date.now().toString(36)}${i}`, r);
    if (!seen.has(q.question)) {
      seen.add(q.question);
      out.push(q);
    }
  }
  return out;
}
