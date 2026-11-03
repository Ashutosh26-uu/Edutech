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
/** A tier with several templates: each question picks one at random. */
const either = (...gens: Gen[]): Gen => (id, r) => pick(gens, r)(id, r);
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

/** Builds an MCQ whose answer is text (a ratio, say) from the right answer and candidate distractors. */
function choice(id: string, topicId: string, difficulty: Difficulty, question: string, answer: string, distractors: string[], explanation: string, r: Rand): MCQ {
  const wrong = [...new Set(distractors)].filter((d) => d !== answer).slice(0, 3);
  const options = shuffle([answer, ...wrong], r);
  return { id, topicId, difficulty, question, options, answer: options.indexOf(answer), explanation };
}

/** a : b in lowest terms. */
const ratio = (a: number, b: number) => {
  const g = gcd(a, b);
  return `${a / g} : ${b / g}`;
};

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
    hard: either((id, r) => {
      // Successive change: net = a − b − ab/100.
      const [a, b] = pick([[20, 10], [25, 10], [30, 20], [10, 20], [20, 25], [40, 25], [50, 20], [15, 10]], r);
      const net = a - b - (a * b) / 100;
      const up = net > 0;
      const ans = Math.abs(net);
      return numeric(
        id, "quant-percentage", "hard",
        `The price of an article is first increased by ${a}% and then decreased by ${b}%. What is the net percentage ${up ? "increase" : "decrease"} in its price?`,
        ans,
        `Net change = a − b − ab/100 = ${a} − ${b} − ${a}×${b}/100 = ${fmt(net)}%, i.e. a ${fmt(ans)}% ${up ? "increase" : "decrease"}.`,
        r, "", "%",
      );
    }, (id, r) => {
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
    }),
    "very-hard": either((id, r) => {
      const [x, ans] = pick([[25, 20], [100, 50], [150, 60], [400, 80], [50, 33.33], [20, 16.67]], r);
      const income = r() < 0.5;
      const q = income
        ? `A’s income is ${x}% more than B’s. By what percent is B’s income less than A’s?`
        : `The price of sugar rises by ${x}%. By what percent must a family cut its consumption so that its expenditure stays the same?`;
      return numeric(id, "quant-percentage", "very-hard", q, ans, `Required % = x ÷ (100 + x) × 100 = ${x} ÷ ${100 + x} × 100 = ${fmt(ans)}%.`, r, "", "%");
    }, (id, r) => {
      // Pass/fail overlap: passed in both = 100 − (x + y − z)%.
      const [x, y, z] = pick([[30, 35, 15], [25, 40, 20], [20, 30, 10], [35, 25, 20], [40, 30, 20], [32, 28, 12]], r);
      const pass = 100 - (x + y - z);
      const total = pick([400, 500, 800, 1000, 1200, 1500], r);
      const passed = (pass * total) / 100;
      if (!Number.isInteger(passed)) return GENERATORS["quant-percentage"]["very-hard"](id, r);
      return numeric(
        id, "quant-percentage", "very-hard",
        `In an exam, ${x}% of the candidates failed in Hindi, ${y}% failed in English and ${z}% failed in both. If ${fmt(passed)} candidates passed in both subjects, how many candidates appeared?`,
        total,
        `Failed in at least one = ${x} + ${y} − ${z} = ${x + y - z}%, so passed in both = ${pass}%. Total = ${fmt(passed)} × 100 ÷ ${pass} = ${fmt(total)}.`,
        r,
      );
    }),
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
    hard: either((id, r) => {
      // Dishonest dealer: false weight plus a markup on cost.
      const [g, x, ans] = pick([[800, 20, 50], [900, 8, 20], [960, 20, 25], [800, 10, 37.5], [750, 5, 40], [900, 0, 11.11], [950, 14, 20]], r);
      return numeric(
        id, "quant-profit-loss", "hard",
        x
          ? `A dealer uses a weight of ${g} g instead of 1 kg and also sells at ${x}% above the cost price. What is his total gain percentage?`
          : `A dishonest dealer claims to sell at cost price but uses a weight of ${g} g instead of 1 kg. What is his gain percentage?`,
        ans,
        `He gives ${g} g but charges for 1,000 g${x ? ` plus ${x}%` : ""}. Gain % = (1000/${g}${x ? ` × ${(100 + x) / 100}` : ""} − 1) × 100 = ${fmt(ans)}%.`,
        r, "", "%",
      );
    }, (id, r) => {
      const [mark, disc] = pick([[50, 20], [40, 25], [60, 25], [25, 12], [100, 40], [30, 10], [50, 10], [20, 10], [75, 20]], r);
      const ans = Math.round(((100 + mark) * (100 - disc)) / 100 - 100);
      return numeric(
        id, "quant-profit-loss", "hard",
        `A shopkeeper marks an article ${mark}% above its cost price and then allows a discount of ${disc}%. What is his profit percentage?`,
        ans,
        `Take CP = 100. Marked price = ${100 + mark}; SP after ${disc}% discount = ${100 + mark} × ${100 - disc} ÷ 100 = ${fmt(((100 + mark) * (100 - disc)) / 100)}. Profit = ${ans}%.`,
        r, "", "%",
      );
    }),
    "very-hard": either((id, r) => {
      // Mark-up needed so that a discount still leaves a target profit.
      const [d, g, ans] = pick([[20, 20, 50], [25, 20, 60], [10, 8, 20], [20, 4, 30], [25, 5, 40], [16, 26, 50], [10, 17, 30]], r);
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `A shopkeeper wants to gain ${g}% even after allowing a discount of ${d}%. By what percentage above the cost price must he mark his goods?`,
        ans,
        `MP × (100 − ${d})/100 = CP × (100 + ${g})/100, so MP/CP = ${100 + g}/${100 - d} = ${fmt((100 + g) / (100 - d))}. Mark-up = ${ans}%.`,
        r, "", "%",
      );
    }, (id, r) => {
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
    }),
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
    hard: either((id, r) => {
      // A sum split between two rates (alligation).
      const [r1, r2] = pick([[8, 12], [5, 10], [6, 9], [10, 15], [4, 8]], r);
      const p = pick([10000, 12000, 15000, 20000, 24000], r);
      const x = pick([0.25, 0.4, 0.5, 0.6, 0.75], r) * p;
      const yearly = (x * r1 + (p - x) * r2) / 100;
      if (!Number.isInteger(yearly)) return GENERATORS["quant-simple-interest"].hard(id, r);
      return numeric(
        id, "quant-simple-interest", "hard",
        `₹${fmt(p)} is lent in two parts, one at ${r1}% and the other at ${r2}% simple interest per annum. The total yearly interest is ₹${fmt(yearly)}. How much was lent at ${r1}%?`,
        x,
        `If all were at ${r2}%, interest would be ₹${fmt((p * r2) / 100)}. The shortfall ₹${fmt((p * r2) / 100 - yearly)} comes from the ${r2 - r1}% gap on the ${r1}% part: ${fmt((p * r2) / 100 - yearly)} × 100 ÷ ${r2 - r1} = ₹${fmt(x)}.`,
        r, "₹",
      );
    }, (id, r) => {
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
    }),
    "very-hard": either((id, r) => {
      // Rate equal to time: R² = 100 × SI/P.
      const [rate, frac] = pick([[4, "4/25"], [5, "1/4"], [6, "9/25"], [8, "16/25"], [10, "1"], [12, "36/25"]], r);
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `The simple interest on a sum is ${frac === "1" ? "equal to the sum" : `${frac} of the sum`}, and the rate per annum equals the number of years. What is the rate?`,
        rate,
        `SI/P = R × T/100 with R = T, so R² = 100 × ${frac} = ${rate * rate}, giving R = ${rate}%.`,
        r, "", "%",
      );
    }, (id, r) => {
      // A higher rate fetches more interest.
      const p = pick([2000, 2500, 4000, 5000, 6000, 8000], r);
      const k = pick([1, 2, 3], r);
      const t = pick([2, 3, 4, 5], r);
      const more = (p * k * t) / 100;
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `Had a sum been lent at ${k}% higher simple interest, it would have fetched ₹${fmt(more)} more in ${t} years. What is the sum?`,
        p,
        `The extra interest comes only from the extra ${k}%: P × ${k} × ${t} ÷ 100 = ${fmt(more)}, so P = ${fmt(more)} × 100 ÷ ${k * t} = ₹${fmt(p)}.`,
        r, "₹",
      );
    }, (id, r) => {
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
    }),
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
    hard: either((id, r) => {
      // Men × days × hours stays constant for the same work.
      const [m1, d1, h1, m2, h2] = pick([[12, 18, 8, 16, 9], [15, 20, 6, 10, 9], [20, 12, 9, 24, 6], [8, 24, 6, 12, 8], [18, 10, 8, 12, 6], [25, 12, 8, 20, 10]], r);
      const ans = (m1 * d1 * h1) / (m2 * h2);
      return numeric(
        id, "quant-time-work", "hard",
        `${m1} men working ${h1} hours a day can finish a job in ${d1} days. In how many days will ${m2} men working ${h2} hours a day finish it?`,
        ans,
        `M₁D₁H₁ = M₂D₂H₂: ${m1} × ${d1} × ${h1} = ${m2} × D × ${h2}, so D = ${m1 * d1 * h1} ÷ ${m2 * h2} = ${fmt(ans)} days.`,
        r, "", " days",
      );
    }, (id, r) => {
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
    }),
    "very-hard": either((id, r) => {
      // Pairwise rates: A+B, B+C, C+A given; find one person alone.
      const [a, b, c] = pick([[20, 30, 60], [30, 60, 20], [40, 60, 120], [15, 30, 30], [6, 12, 12], [60, 20, 30]], r);
      const pair = (x: number, y: number) => (x * y) / (x + y);
      const [ab, bc, ca] = [pair(a, b), pair(b, c), pair(c, a)];
      if (![ab, bc, ca].every(Number.isInteger)) return GENERATORS["quant-time-work"]["very-hard"](id, r);
      const who = pick(["A", "C"], r);
      const ans = who === "A" ? a : c;
      return numeric(
        id, "quant-time-work", "very-hard",
        `A and B together can finish a work in ${ab} days, B and C in ${bc} days, and C and A in ${ca} days. In how many days can ${who} alone finish it?`,
        ans,
        `Adding the three pairs gives twice the work of A+B+C per day: 2(A+B+C) = 1/${ab} + 1/${bc} + 1/${ca}, so A+B+C does 1/${pair(pair(a, b), c)} per day. ${who} alone = (A+B+C) − (${who === "A" ? "B+C" : "A+B"}) = 1/${ans}, i.e. ${ans} days.`,
        r, "", " days",
      );
    }, (id, r) => {
      const [a, b, c, ans] = pick([[6, 12, 8, 8], [12, 18, 36, 9], [20, 30, 60, 15], [8, 12, 24, 6], [15, 20, 30, 12], [6, 8, 24, 4]], r);
      const lcm = [a, b, c].reduce((x, y) => (x * y) / gcd(x, y));
      return numeric(
        id, "quant-time-work", "very-hard",
        `Pipe A can fill a tank in ${a} hours and pipe B in ${b} hours, while pipe C can empty it in ${c} hours. If all three are opened together, in how many hours will the tank be full?`,
        ans,
        `Take the tank as ${lcm} units. A fills ${lcm / a}/h, B fills ${lcm / b}/h, C empties ${lcm / c}/h: net ${lcm / a + lcm / b - lcm / c} units/h. Time = ${lcm} ÷ ${lcm / a + lcm / b - lcm / c} = ${ans} hours.`,
        r, "", " hours",
      );
    }, (id, r) => {
      // One worker k times as efficient as the other.
      const [k, t] = pick([[2, 18], [3, 12], [2, 12], [4, 20], [3, 24], [2, 24]], r);
      const askA = r() < 0.5;
      const ans = askA ? (t * (k + 1)) / k : t * (k + 1);
      return numeric(
        id, "quant-time-work", "very-hard",
        `A is ${k === 2 ? "twice" : `${k} times`} as efficient as B, and together they finish a work in ${t} days. In how many days can ${askA ? "A" : "B"} alone finish it?`,
        ans,
        `If B does 1 unit a day, A does ${k}; together ${k + 1} units a day for ${t} days = ${(k + 1) * t} units. ${askA ? `A alone = ${(k + 1) * t} ÷ ${k}` : `B alone = ${(k + 1) * t} ÷ 1`} = ${ans} days.`,
        r, "", " days",
      );
    }),
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
    hard: either((id, r) => {
      // Average speed over equal distances is the harmonic mean, not the plain average.
      const [x, y] = pick([[40, 60], [30, 60], [60, 90], [20, 30], [45, 90], [36, 45], [60, 40]], r);
      const ans = (2 * x * y) / (x + y);
      return numeric(
        id, "quant-average", "hard",
        `A car goes from town P to town Q at ${x} km/h and returns along the same road at ${y} km/h. What is its average speed for the whole journey?`,
        ans,
        `For equal distances, average speed = 2xy ÷ (x + y) = 2 × ${x} × ${y} ÷ ${x + y} = ${fmt(ans)} km/h (not ${fmt((x + y) / 2)}).`,
        r, "", " km/h",
      );
    }, (id, r) => {
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
    }),
    "very-hard": either((id, r) => {
      // Batsman's innings: one score lifts the average by d.
      const n = pick([10, 11, 15, 16, 19, 20], r);
      const d = pick([2, 3, 4], r);
      const newAvg = pick([32, 36, 40, 45, 48, 52], r);
      const score = newAvg + n * d;
      return numeric(
        id, "quant-average", "very-hard",
        `A batsman scores ${score} runs in his ${ordinal(n + 1)} innings and thereby raises his average by ${d}. What is his average after the ${ordinal(n + 1)} innings?`,
        newAvg,
        `Let the new average be A. Then ${n}(A − ${d}) + ${score} = ${n + 1}A, so A = ${score} − ${n} × ${d} = ${newAvg}.`,
        r,
      );
    }, (id, r) => {
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
    }),
  },

  "quant-ratio": {
    easy: (id, r) => {
      const [a, b] = pick([[2, 3], [3, 5], [4, 5], [5, 7], [3, 7], [1, 4], [2, 5], [7, 8]], r);
      const k = pick([20, 25, 40, 50, 100, 120], r);
      const larger = r() < 0.5;
      const ans = (larger ? b : a) * k;
      return numeric(
        id, "quant-ratio", "easy",
        `₹${fmt((a + b) * k)} is divided between A and B in the ratio ${a} : ${b}. What is ${larger ? "B’s" : "A’s"} share?`,
        ans,
        `Total parts = ${a} + ${b} = ${a + b}; one part = ${fmt((a + b) * k)} ÷ ${a + b} = ${k}. ${larger ? "B" : "A"} gets ${larger ? b : a} × ${k} = ₹${fmt(ans)}.`,
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const [a, b] = pick([[2, 3], [3, 4], [4, 5], [5, 6], [2, 5], [3, 7]], r);
      const [c, d] = pick([[4, 5], [2, 3], [5, 7], [3, 4], [6, 7], [3, 8]], r);
      const ans = ratio(a * c, b * d);
      return choice(
        id, "quant-ratio", "moderate",
        `If A : B = ${a} : ${b} and B : C = ${c} : ${d}, what is A : C?`,
        ans,
        [ratio(a * d, b * c), ratio(b * d, a * c), ratio(a, d), ratio(a * c, d), ratio(a + c, b + d)],
        `A : C = (A/B) × (B/C) = (${a}/${b}) × (${c}/${d}) = ${a * c}/${b * d} = ${ans}.`,
        r,
      );
    },
    hard: (id, r) => {
      const [a, b] = pick([[3, 5], [2, 3], [4, 7], [5, 8], [3, 4], [5, 9]], r);
      const k = pick([4, 5, 6, 8, 10, 12], r);
      const x = pick([2, 4, 5, 6, 8, 10], r);
      const g = gcd(a * k + x, b * k + x);
      const [c, d] = [(a * k + x) / g, (b * k + x) / g];
      return numeric(
        id, "quant-ratio", "hard",
        `Two numbers are in the ratio ${a} : ${b}. If ${x} is added to each, the ratio becomes ${c} : ${d}. What is the smaller number?`,
        a * k,
        `Let the numbers be ${a}k and ${b}k. (${a}k + ${x}) ÷ (${b}k + ${x}) = ${c}/${d} gives k = ${k}, so the smaller number is ${a} × ${k} = ${a * k}.`,
        r,
      );
    },
    "very-hard": either((id, r) => {
      // Repeated draw-and-replace: milk left = P × (1 − x/P)^n.
      const [p, x, n] = pick([[80, 8, 2], [40, 4, 2], [100, 10, 3], [50, 10, 2], [60, 6, 2], [125, 25, 3]], r);
      const ans = Math.round(p * (1 - x / p) ** n * 100) / 100;
      return numeric(
        id, "quant-ratio", "very-hard",
        `A vessel holds ${p} litres of pure milk. ${x} litres are taken out and replaced with water, and this is done ${n === 2 ? "twice" : "three times"} in all. How much milk is left in the vessel?`,
        ans,
        `Each round keeps ${p - x}/${p} of the milk, so milk left = ${p} × (${p - x}/${p})^${n} = ${fmt(ans)} litres.`,
        r, "", " litres",
      );
    }, (id, r) => {
      const [t, m, w, m2, w2] = pick([[60, 2, 1, 1, 2], [40, 3, 1, 1, 1], [80, 3, 1, 2, 1], [90, 7, 2, 7, 3], [45, 4, 1, 3, 2], [100, 4, 1, 2, 1]], r);
      const milk = (t * m) / (m + w);
      const water = t - milk;
      const ans = (milk * w2) / m2 - water;
      return numeric(
        id, "quant-ratio", "very-hard",
        `A ${t}-litre mixture has milk and water in the ratio ${m} : ${w}. How much water must be added to make the ratio ${m2} : ${w2}?`,
        ans,
        `Milk = ${milk} L and water = ${water} L. Milk stays the same, so water needed = ${milk} × ${w2}/${m2} = ${(milk * w2) / m2} L. Add ${(milk * w2) / m2} − ${water} = ${ans} L.`,
        r, "", " litres",
      );
    }),
  },

  "quant-tsd": {
    easy: (id, r) => {
      const kmh = pick([18, 36, 54, 72, 90, 108, 126, 144], r);
      return numeric(id, "quant-tsd", "easy", `Convert ${kmh} km/h into metres per second.`, (kmh * 5) / 18, `Multiply by 5/18: ${kmh} × 5/18 = ${(kmh * 5) / 18} m/s.`, r, "", " m/s");
    },
    moderate: (id, r) => {
      const kmh = pick([36, 54, 72, 90, 108], r);
      const v = (kmh * 5) / 18;
      const t = pick([6, 8, 9, 10, 12, 15, 18], r);
      return numeric(
        id, "quant-tsd", "moderate",
        `A train ${v * t} m long runs at ${kmh} km/h. How long does it take to pass a pole?`,
        t,
        `${kmh} km/h = ${v} m/s. To pass a pole the train covers its own length: ${v * t} ÷ ${v} = ${t} seconds.`,
        r, "", " seconds",
      );
    },
    hard: either((id, r) => {
      const v = pick([10, 15, 20, 25, 30], r);
      const t = pick([12, 15, 18, 20, 24, 30], r);
      const len = pick([100, 120, 150, 180, 200, 240], r);
      const plat = v * t - len;
      if (plat < 60) return GENERATORS["quant-tsd"].hard(id, r);
      return numeric(
        id, "quant-tsd", "hard",
        `A train ${len} m long crosses a ${plat} m long platform in ${t} seconds. What is its speed?`,
        v * 3.6,
        `Distance = train + platform = ${len} + ${plat} = ${v * t} m. Speed = ${v * t} ÷ ${t} = ${v} m/s = ${v} × 18/5 = ${fmt(v * 3.6)} km/h.`,
        r, "", " km/h",
      );
    }, (id, r) => {
      const [s1, s2] = pick([[40, 50], [45, 63], [36, 54], [60, 48], [72, 54], [30, 42]], r);
      const rel = ((s1 + s2) * 5) / 18;
      const t = pick([6, 8, 9, 10, 12, 15], r);
      const total = rel * t;
      const l1 = Math.round((total * pick([0.4, 0.5, 0.6], r)) / 10) * 10;
      if (!Number.isInteger(rel) || l1 <= 0 || l1 >= total) return GENERATORS["quant-tsd"].hard(id, r);
      return numeric(
        id, "quant-tsd", "hard",
        `Two trains, ${l1} m and ${total - l1} m long, run on parallel tracks in opposite directions at ${s1} km/h and ${s2} km/h. How long do they take to cross each other?`,
        t,
        `Relative speed = ${s1} + ${s2} = ${s1 + s2} km/h = ${rel} m/s. Distance = ${l1} + ${total - l1} = ${total} m. Time = ${total} ÷ ${rel} = ${t} seconds.`,
        r, "", " seconds",
      );
    }),
    "very-hard": either((id, r) => {
      // Chase: the gap closes at the relative speed while the thief keeps running.
      const [gap, vt, vp] = pick([[200, 10, 12], [100, 8, 10], [300, 12, 15], [150, 9, 12], [250, 10, 15], [120, 10, 14]], r);
      const ans = (gap * vt) / (vp - vt);
      return numeric(
        id, "quant-tsd", "very-hard",
        `A thief is spotted by a policeman ${gap} m away. The thief runs at ${vt} km/h and the policeman chases at ${vp} km/h. How far will the thief have run before he is caught?`,
        ans,
        `The gap closes at ${vp} − ${vt} = ${vp - vt} km/h, so the chase lasts as long as covering ${gap} m at ${vp - vt} km/h. In that time the thief runs ${vt}/${vp - vt} × ${gap} = ${fmt(ans)} m.`,
        r, "", " m",
      );
    }, (id, r) => {
      const [down, up] = pick([[12, 8], [15, 9], [20, 12], [18, 10], [16, 8], [14, 10]], r);
      const lcm = (down * up) / gcd(down, up);
      const d = lcm * pick([1, 2], r);
      const askStream = r() < 0.5;
      const ans = askStream ? (down - up) / 2 : (down + up) / 2;
      return numeric(
        id, "quant-tsd", "very-hard",
        `A boat goes ${d} km downstream in ${d / down} hours and comes back the same distance upstream in ${d / up} hours. What is the speed of ${askStream ? "the stream" : "the boat in still water"}?`,
        ans,
        `Downstream speed = ${d} ÷ ${d / down} = ${down} km/h; upstream = ${d} ÷ ${d / up} = ${up} km/h. ${askStream ? `Stream = (${down} − ${up}) ÷ 2` : `Still water = (${down} + ${up}) ÷ 2`} = ${ans} km/h.`,
        r, "", " km/h",
      );
    }),
  },

  "quant-ci": {
    easy: (id, r) => {
      const [p, rate] = pick([[5000, 10], [8000, 10], [2000, 20], [4000, 5], [8000, 5], [5000, 8], [10000, 4], [12000, 10], [2500, 20]], r);
      const ci = (p * (200 * rate + rate * rate)) / 10000;
      return numeric(
        id, "quant-ci", "easy",
        `Find the compound interest on ₹${fmt(p)} at ${rate}% per annum for 2 years, compounded annually.`,
        ci,
        `Amount = ${fmt(p)} × (1 + ${rate}/100)² = ₹${fmt(p + ci)}. CI = ${fmt(p + ci)} − ${fmt(p)} = ₹${fmt(ci)}.`,
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const p = pick([5000, 8000, 10000, 12000, 20000, 25000], r);
      const rate = pick([4, 5, 8, 10, 12], r);
      const ans = (p * rate * rate) / 10000;
      if (!Number.isInteger(ans)) return GENERATORS["quant-ci"].moderate(id, r);
      return numeric(
        id, "quant-ci", "moderate",
        `What is the difference between compound interest and simple interest on ₹${fmt(p)} for 2 years at ${rate}% per annum?`,
        ans,
        `For 2 years, CI − SI = P × (R/100)² = ${fmt(p)} × (${rate}/100)² = ₹${fmt(ans)}.`,
        r, "₹",
      );
    },
    hard: (id, r) => {
      const p = pick([1000, 2000, 5000, 8000, 10000, 15000, 20000], r);
      const rate = pick([10, 20], r);
      const amt = (p * (100 + rate) ** 3) / 1e6;
      return numeric(
        id, "quant-ci", "hard",
        `What does ₹${fmt(p)} amount to in 3 years at ${rate}% per annum compound interest?`,
        amt,
        `Amount = ${fmt(p)} × (${100 + rate}/100)³ = ${fmt(p)} × ${(((100 + rate) / 100) ** 3).toFixed(3)} = ₹${fmt(amt)}.`,
        r, "₹",
      );
    },
    "very-hard": either((id, r) => {
      const n = pick([3, 4, 5, 6, 8, 10], r);
      const [times, pow] = pick([[4, 2], [8, 3], [16, 4]], r);
      return numeric(
        id, "quant-ci", "very-hard",
        `A sum of money doubles itself in ${n} years at compound interest. In how many years will it become ${times} times itself?`,
        n * pow,
        `At compound interest the sum doubles every ${n} years: ${times} = 2^${pow}, so it takes ${pow} × ${n} = ${n * pow} years.`,
        r, "", " years",
      );
    }, (id, r) => {
      const [p, rate] = pick([[10000, 10], [20000, 10], [40000, 5], [10000, 20], [5000, 20], [16000, 25]], r);
      const a2 = (p * (100 + rate) ** 2) / 1e4;
      const a3 = (a2 * (100 + rate)) / 100;
      return numeric(
        id, "quant-ci", "very-hard",
        `At compound interest, a sum amounts to ₹${fmt(a2)} in 2 years and ₹${fmt(a3)} in 3 years. What is the rate of interest?`,
        rate,
        `The third year’s interest is earned on ₹${fmt(a2)}: ${fmt(a3)} − ${fmt(a2)} = ₹${fmt(a3 - a2)}. Rate = ${fmt(a3 - a2)} ÷ ${fmt(a2)} × 100 = ${rate}%.`,
        r, "", "%",
      );
    }, (id, r) => {
      const [p, rate] = pick([[10000, 10], [8000, 5], [20000, 10], [5000, 20], [15625, 4], [30000, 10]], r);
      const ans = Math.round(((p * rate * rate) / 1e4) * (3 + rate / 100) * 100) / 100;
      return numeric(
        id, "quant-ci", "very-hard",
        `What is the difference between compound interest and simple interest on ₹${fmt(p)} for 3 years at ${rate}% per annum?`,
        ans,
        `For 3 years, CI − SI = P × (R/100)² × (3 + R/100) = ${fmt(p)} × (${rate}/100)² × ${fmt(3 + rate / 100)} = ₹${fmt(ans)}.`,
        r, "₹",
      );
    }),
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
