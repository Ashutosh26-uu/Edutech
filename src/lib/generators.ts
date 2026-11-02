import { DIFFICULTIES } from "./difficulty";
import type { Difficulty, MCQ } from "./types";
import { shuffle } from "./nlp";

/**
 * Template-based Quant question generators. Every question is computed, so answers are
 * always correct and practice never runs out. Each topic has one template per difficulty
 * tier, from a direct formula (easy) to a two-step or inverse problem (very hard).
 */

type Rand = () => number;
type Gen = (id: string, r: Rand) => MCQ;
const pick = <T,>(arr: T[], r: Rand) => arr[Math.floor(r() * arr.length)];
const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2).replace(/\.?0+$/, ""));

/** Builds a numeric MCQ with plausible near-miss distractors. */
function numeric(id: string, topicId: string, difficulty: Difficulty, question: string, answer: number, explanation: string, r: Rand, unit = "", suffix = ""): MCQ {
  const steps = [0.8, 0.9, 1.1, 1.2, 1.25, 0.75, 1.5, 0.5];
  const set = new Set<number>([answer]);
  for (const s of shuffle(steps, r)) {
    if (set.size === 4) break;
    const v = Number.isInteger(answer) ? Math.round(answer * s) : Math.round(answer * s * 100) / 100;
    if (v > 0 && v !== answer) set.add(v);
  }
  let k = 1;
  while (set.size < 4) set.add(answer + k++ * Math.max(1, Math.round(answer / 10)));
  const options = shuffle([...set], r);
  return {
    id,
    topicId,
    difficulty,
    question,
    options: options.map((o) => `${unit}${fmt(o)}${suffix}`),
    answer: options.indexOf(answer),
    explanation,
  };
}

const GENERATORS: Record<string, Record<Difficulty, Gen>> = {
  "quant-percentage": {
    easy: (id, r) => {
      const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 60, 75], r);
      const n = pick([40, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600, 800, 1200], r);
      const ans = (p * n) / 100;
      if (!Number.isInteger(ans)) return GENERATORS["quant-percentage"].easy(id, r);
      return numeric(id, "quant-percentage", "easy", `What is ${p}% of ${fmt(n)}?`, ans, `${p}% of ${fmt(n)} = ${p} × ${fmt(n)} ÷ 100 = ${fmt(ans)}.`, r);
    },
    moderate: (id, r) => {
      const n = pick([200, 250, 400, 500, 800, 1200, 1500, 2000], r);
      const p = pick([5, 8, 12, 15, 18, 24, 30, 35, 45, 60], r);
      const part = (p * n) / 100;
      if (!Number.isInteger(part)) return GENERATORS["quant-percentage"].moderate(id, r);
      return numeric(id, "quant-percentage", "moderate", `What percent of ${fmt(n)} is ${fmt(part)}?`, p, `Required % = ${fmt(part)} ÷ ${fmt(n)} × 100 = ${p}%.`, r, "", "%");
    },
    hard: (id, r) => {
      const pop = pick([10000, 20000, 40000, 50000, 80000], r);
      const rate = pick([5, 10, 20], r);
      const ans = (pop * (100 + rate) * (100 + rate)) / 10000;
      return numeric(
        id, "quant-percentage", "hard",
        `The population of a town is ${fmt(pop)} and grows by ${rate}% every year. What will it be after 2 years?`,
        ans,
        `After 2 years = ${fmt(pop)} × (${100 + rate}/100)² = ${fmt(pop)} × ${(((100 + rate) / 100) ** 2).toFixed(4).replace(/0+$/, "")} = ${fmt(ans)}.`,
        r,
      );
    },
    "very-hard": (id, r) => {
      const [x, ans] = pick([[25, 20], [100, 50], [150, 60], [400, 80], [50, 33.33], [20, 16.67]], r);
      const income = r() < 0.5;
      const q = income
        ? `A’s income is ${x}% more than B’s. By what percent is B’s income less than A’s?`
        : `The price of sugar rises by ${x}%. By what percent must a family cut its consumption so that its expenditure stays the same?`;
      return numeric(id, "quant-percentage", "very-hard", q, ans, `Required % = x ÷ (100 + x) × 100 = ${x} ÷ ${100 + x} × 100 = ${fmt(ans)}%.`, r, "", "%");
    },
  },

  "quant-profit-loss": {
    easy: (id, r) => {
      const cp = pick([200, 250, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500], r);
      const pct = pick([5, 10, 12, 15, 20, 25, 30, 40], r);
      const profit = r() < 0.6;
      const sp = (cp * (100 + (profit ? pct : -pct))) / 100;
      if (!Number.isInteger(sp)) return GENERATORS["quant-profit-loss"].easy(id, r);
      const word = profit ? "profit" : "loss";
      return numeric(
        id, "quant-profit-loss", "easy",
        `An article costs ₹${fmt(cp)}. At what price must it be sold to make a ${word} of ${pct}%?`,
        sp,
        `SP = CP × (100 ${profit ? "+" : "−"} ${pct}) ÷ 100 = ${fmt(cp)} × ${100 + (profit ? pct : -pct)} ÷ 100 = ₹${fmt(sp)}.`,
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const cp = pick([200, 400, 500, 800, 1000, 1200, 1600, 2000, 2500, 4000], r);
      const pct = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 50], r);
      const profit = r() < 0.6;
      const sp = (cp * (100 + (profit ? pct : -pct))) / 100;
      if (!Number.isInteger(sp)) return GENERATORS["quant-profit-loss"].moderate(id, r);
      const word = profit ? "profit" : "loss";
      return numeric(
        id, "quant-profit-loss", "moderate",
        `An article bought for ₹${fmt(cp)} is sold for ₹${fmt(sp)}. What is the ${word} percentage?`,
        pct,
        `${profit ? "Profit" : "Loss"} = ₹${fmt(Math.abs(sp - cp))}; ${word} % = ${fmt(Math.abs(sp - cp))} ÷ ${fmt(cp)} × 100 = ${pct}%.`,
        r, "", "%",
      );
    },
    hard: (id, r) => {
      const [mark, disc] = pick([[50, 20], [40, 25], [60, 25], [25, 12], [100, 40], [30, 10], [50, 10], [20, 10], [75, 20]], r);
      const ans = Math.round(((100 + mark) * (100 - disc)) / 100 - 100);
      return numeric(
        id, "quant-profit-loss", "hard",
        `A shopkeeper marks an article ${mark}% above its cost price and then allows a discount of ${disc}%. What is his profit percentage?`,
        ans,
        `Take CP = 100. Marked price = ${100 + mark}; SP after ${disc}% discount = ${100 + mark} × ${100 - disc} ÷ 100 = ${fmt(((100 + mark) * (100 - disc)) / 100)}. Profit = ${ans}%.`,
        r, "", "%",
      );
    },
    "very-hard": (id, r) => {
      if (r() < 0.5) {
        const x = pick([10, 20, 25, 30, 40, 50], r);
        const ans = (x * x) / 100;
        const sp = pick([1200, 2400, 3000, 4800, 6000], r);
        return numeric(
          id, "quant-profit-loss", "very-hard",
          `A man sells two articles for ₹${fmt(sp)} each, gaining ${x}% on one and losing ${x}% on the other. What is his overall loss percentage?`,
          ans,
          `When two articles sell at the same price with equal gain and loss %, there is always a loss of x²/100 % = ${x}² ÷ 100 = ${fmt(ans)}%.`,
          r, "", "%",
        );
      }
      const [n, g] = pick([[10, 2], [12, 4], [15, 5], [20, 4], [12, 2], [25, 5], [11, 1], [30, 10], [6, 1], [16, 4]], r);
      const ans = (g * 100) / (n - g);
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `By selling ${n} articles, a trader gains the selling price of ${g} articles. What is his profit percentage?`,
        ans,
        `CP of ${n} articles = SP of ${n - g} articles. Profit % = ${g} ÷ ${n - g} × 100 = ${fmt(ans)}%.`,
        r, "", "%",
      );
    },
  },

  "quant-simple-interest": {
    easy: (id, r) => {
      const p = pick([1000, 2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000, 15000], r);
      const rate = pick([4, 5, 6, 8, 10, 12, 15], r);
      const t = pick([2, 3, 4, 5, 6], r);
      const si = (p * rate * t) / 100;
      return numeric(
        id, "quant-simple-interest", "easy",
        `Find the simple interest on ₹${fmt(p)} at ${rate}% per annum for ${t} years.`,
        si,
        `SI = P × R × T ÷ 100 = ${fmt(p)} × ${rate} × ${t} ÷ 100 = ₹${fmt(si)}.`,
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const p = pick([2000, 2500, 4000, 5000, 8000, 10000, 12000], r);
      const rate = pick([4, 5, 6, 8, 10, 12], r);
      const t = pick([2, 3, 4, 5], r);
      const si = (p * rate * t) / 100;
      return numeric(
        id, "quant-simple-interest", "moderate",
        `A sum of ₹${fmt(p)} earns ₹${fmt(si)} as simple interest in ${t} years. What is the rate of interest per annum?`,
        rate,
        `R = SI × 100 ÷ (P × T) = ${fmt(si)} × 100 ÷ (${fmt(p)} × ${t}) = ${rate}%.`,
        r, "", "%",
      );
    },
    hard: (id, r) => {
      const t = pick([4, 5, 6, 8, 10, 12, 15, 20], r);
      const [times, word] = pick([[3, "triple"], [4, "become four times"]], r);
      const ans = t * (times - 1);
      return numeric(
        id, "quant-simple-interest", "hard",
        `A sum of money doubles itself in ${t} years at simple interest. In how many years will it ${word}?`,
        ans,
        `Doubling means SI = P in ${t} years, so SI grows by P every ${t} years. To ${word}, SI must be ${times - 1}P, which takes ${times - 1} × ${t} = ${ans} years.`,
        r, "", " years",
      );
    },
    "very-hard": (id, r) => {
      const p = pick([2000, 4000, 5000, 6000, 8000, 10000], r);
      const rate = pick([5, 8, 10, 12], r);
      const t1 = pick([2, 3], r);
      const t2 = t1 + pick([2, 3, 4], r);
      const a1 = p + (p * rate * t1) / 100;
      const a2 = p + (p * rate * t2) / 100;
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `At simple interest, a sum amounts to ₹${fmt(a1)} in ${t1} years and to ₹${fmt(a2)} in ${t2} years. What is the sum?`,
        p,
        `Interest for ${t2 - t1} years = ${fmt(a2)} − ${fmt(a1)} = ₹${fmt(a2 - a1)}, so interest per year = ₹${fmt((a2 - a1) / (t2 - t1))}. Sum = ${fmt(a1)} − ${t1} × ${fmt((a2 - a1) / (t2 - t1))} = ₹${fmt(p)}.`,
        r, "₹",
      );
    },
  },

  "quant-time-work": {
    easy: (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [12, 6], [20, 5], [30, 60], [18, 9], [24, 8], [21, 42], [15, 10], [40, 60]], r);
      const t = (a * b) / (a + b);
      return numeric(
        id, "quant-time-work", "easy",
        `A can finish a piece of work in ${a} days and B can finish it in ${b} days. In how many days can they finish it together?`,
        t,
        `Together they finish in (${a} × ${b}) ÷ (${a} + ${b}) = ${a * b} ÷ ${a + b} = ${fmt(t)} days.`,
        r, "", " days",
      );
    },
    moderate: (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [30, 60], [15, 10], [40, 60], [21, 42], [24, 8], [18, 9], [20, 5], [12, 6]], r);
      const t = (a * b) / (a + b);
      return numeric(
        id, "quant-time-work", "moderate",
        `A alone can do a piece of work in ${a} days. A and B together can do it in ${fmt(t)} days. In how many days can B alone do it?`,
        b,
        `B’s one-day work = 1/${fmt(t)} − 1/${a} = 1/${b}, so B alone takes ${b} days.`,
        r, "", " days",
      );
    },
    hard: (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [30, 60], [40, 60], [21, 42], [15, 10]], r);
      const k = pick([1, 2, 3, 4, 5], r);
      const ans = b * (1 - k / a - k / b);
      if (ans <= 0 || !Number.isInteger(ans)) return GENERATORS["quant-time-work"].hard(id, r);
      return numeric(
        id, "quant-time-work", "hard",
        `A can do a work in ${a} days and B in ${b} days. They start together, but A leaves after ${k} day${k > 1 ? "s" : ""}. In how many more days will B finish the remaining work?`,
        ans,
        `In ${k} day${k > 1 ? "s" : ""} they do ${k} × (1/${a} + 1/${b}) = ${fmt((k * (a + b)) / (a * b))} of the work. Remaining = ${fmt(1 - (k * (a + b)) / (a * b))}, which B alone does in ${fmt(1 - (k * (a + b)) / (a * b))} × ${b} = ${ans} days.`,
        r, "", " days",
      );
    },
    "very-hard": (id, r) => {
      const [a, b, c, ans] = pick([[6, 12, 8, 8], [12, 18, 36, 9], [20, 30, 60, 15], [8, 12, 24, 6], [15, 20, 30, 12], [6, 8, 24, 4]], r);
      const lcm = [a, b, c].reduce((x, y) => (x * y) / gcd(x, y));
      return numeric(
        id, "quant-time-work", "very-hard",
        `Pipe A can fill a tank in ${a} hours and pipe B in ${b} hours, while pipe C can empty it in ${c} hours. If all three are opened together, in how many hours will the tank be full?`,
        ans,
        `Take the tank as ${lcm} units. A fills ${lcm / a}/h, B fills ${lcm / b}/h, C empties ${lcm / c}/h: net ${lcm / a + lcm / b - lcm / c} units/h. Time = ${lcm} ÷ ${lcm / a + lcm / b - lcm / c} = ${ans} hours.`,
        r, "", " hours",
      );
    },
  },

  "quant-average": {
    easy: (id, r) => {
      const count = pick([4, 5, 6], r);
      const avg = pick([12, 15, 18, 20, 24, 25, 30, 36, 40, 45], r);
      const nums = Array.from({ length: count - 1 }, () => avg + Math.round((r() - 0.5) * avg));
      nums.push(avg * count - nums.reduce((s, n) => s + n, 0));
      if (nums.some((n) => n <= 0)) return GENERATORS["quant-average"].easy(id, r);
      return numeric(
        id, "quant-average", "easy",
        `What is the average of ${nums.slice(0, -1).join(", ")} and ${nums.at(-1)}?`,
        avg,
        `Sum = ${nums.join(" + ")} = ${avg * count}; average = ${avg * count} ÷ ${count} = ${avg}.`,
        r,
      );
    },
    moderate: (id, r) => {
      const n = pick([5, 6, 8, 10], r);
      const avg = pick([20, 24, 30, 36, 40, 50], r);
      const newAvg = avg - pick([1, 2, 3, 4], r);
      const ans = n * avg - (n - 1) * newAvg;
      return numeric(
        id, "quant-average", "moderate",
        `The average of ${n} numbers is ${avg}. If one number is removed, the average of the remaining numbers becomes ${newAvg}. What is the removed number?`,
        ans,
        `Removed number = (${n} × ${avg}) − (${n - 1} × ${newAvg}) = ${n * avg} − ${(n - 1) * newAvg} = ${ans}.`,
        r,
      );
    },
    hard: (id, r) => {
      const n = pick([20, 24, 29, 30, 35, 39], r);
      const avg = pick([12, 14, 15, 16], r);
      const d = pick([1, 2], r);
      const ans = avg + (n + 1) * d;
      return numeric(
        id, "quant-average", "hard",
        `The average age of ${n} students in a class is ${avg} years. When the teacher’s age is included, the average rises by ${d} year${d > 1 ? "s" : ""}. What is the teacher’s age?`,
        ans,
        `New average = ${avg + d} for ${n + 1} people. Teacher’s age = ${n + 1} × ${avg + d} − ${n} × ${avg} = ${(n + 1) * (avg + d)} − ${n * avg} = ${ans} years.`,
        r, "", " years",
      );
    },
    "very-hard": (id, r) => {
      const m = pick([5, 6, 7], r);
      const n = 2 * m - 1;
      const all = pick([40, 50, 60], r);
      const first = all - pick([1, 2, 3], r);
      const last = all + pick([1, 2, 4], r);
      const ans = m * first + m * last - n * all;
      if (ans <= 0) return GENERATORS["quant-average"]["very-hard"](id, r);
      return numeric(
        id, "quant-average", "very-hard",
        `The average of ${n} results is ${all}. The average of the first ${m} results is ${first} and that of the last ${m} is ${last}. What is the ${ordinal(m)} result?`,
        ans,
        `The ${ordinal(m)} result is counted in both groups: ${m} × ${first} + ${m} × ${last} − ${n} × ${all} = ${m * first} + ${m * last} − ${n * all} = ${ans}.`,
        r,
      );
    },
  },
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const ordinal = (n: number) => `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || Math.floor(n / 10) === 1 ? 0 : n % 10]}`;

export const hasGenerator = (topicId: string) => topicId in GENERATORS;

/** Generates `count` distinct questions for a topic, from one tier or (by default) a rotation of all four. */
export function generateQuestions(topicId: string, count: number, r: Rand = Math.random, difficulty?: Difficulty): MCQ[] {
  const gens = GENERATORS[topicId];
  if (!gens) return [];
  const out: MCQ[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < count && i < count * 10; i++) {
    const tier = difficulty ?? DIFFICULTIES[i % DIFFICULTIES.length];
    const q = gens[tier](`${topicId}-g${Date.now().toString(36)}${i}`, r);
    if (!seen.has(q.question)) {
      seen.add(q.question);
      out.push(q);
    }
  }
  return out;
}
