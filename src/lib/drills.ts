/**
 * Speed drills: rapid mental-calculation questions generated in the browser (tables, squares,
 * cubes, roots, fraction ↔ percentage, percentages, addition/subtraction, approximation).
 * Pure functions with an injectable random source, so `npm run test:skills` can check them.
 */

export type DrillId = "tables" | "squares" | "cubes" | "roots" | "fractions" | "percent" | "addsub" | "approx";
export type DrillLevel = "easy" | "medium" | "hard";

export interface DrillQuestion {
  /** Identifies the question within a drill; no key repeats in a round until the pool runs out. */
  key: string;
  prompt: string;
  answer: number;
  /** Accept answers within this fraction of the exact value (approximation drills). */
  relTolerance?: number;
  /** Accept answers within this absolute distance (recurring decimals such as 33.33). */
  absTolerance?: number;
  /** How the answer is shown after a miss or skip. */
  display: string;
}

export const DRILLS: { id: DrillId; name: string; blurb: string }[] = [
  { id: "tables", name: "Multiplication tables", blurb: "Tables from 2 to 30" },
  { id: "squares", name: "Squares", blurb: "Squares of 1 to 50" },
  { id: "cubes", name: "Cubes", blurb: "Cubes of 1 to 30" },
  { id: "roots", name: "Square roots", blurb: "Roots of perfect squares" },
  { id: "fractions", name: "Fraction ↔ percentage", blurb: "1/2 … 1/20 as a percentage, and back" },
  { id: "percent", name: "Percentages", blurb: "x% of y" },
  { id: "addsub", name: "Add and subtract", blurb: "2- and 3-digit numbers" },
  { id: "approx", name: "Approximation", blurb: "Nearest value, within 3%" },
];

export const LEVELS: { id: DrillLevel; name: string }[] = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
];

export type Rng = () => number;

/** Small seeded generator (mulberry32) for repeatable tests. */
export function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [lo, hi]. */
const int = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)];
/** Rounds to 2 decimals and drops trailing zeros: 12.5, 33.33, 20. */
export const fmt = (n: number) => String(Math.round(n * 100) / 100);
const exact = (key: string, prompt: string, answer: number): DrillQuestion => ({ key, prompt, answer, display: fmt(answer) });

/** Range of the "number" being drilled at each level, for the drills that drill one number. */
const RANGES: Record<"squares" | "cubes" | "roots", Record<DrillLevel, [number, number]>> = {
  squares: { easy: [1, 20], medium: [11, 35], hard: [21, 50] },
  cubes: { easy: [1, 10], medium: [1, 20], hard: [11, 30] },
  roots: { easy: [1, 20], medium: [11, 35], hard: [21, 50] },
};

export function makeQuestion(id: DrillId, level: DrillLevel, rng: Rng = Math.random): DrillQuestion {
  switch (id) {
    case "tables": {
      const [lo, hi] = level === "easy" ? [2, 10] : level === "medium" ? [2, 20] : [12, 30];
      const a = int(rng, lo, hi);
      const b = int(rng, level === "hard" ? 3 : 1, level === "hard" ? 19 : 10);
      return exact(`${a}x${b}`, `${a} × ${b}`, a * b);
    }
    case "squares": {
      const n = int(rng, ...RANGES.squares[level]);
      return exact(`${n}`, `${n}²`, n * n);
    }
    case "cubes": {
      const n = int(rng, ...RANGES.cubes[level]);
      return exact(`${n}`, `${n}³`, n * n * n);
    }
    case "roots": {
      const n = int(rng, ...RANGES.roots[level]);
      return exact(`${n * n}`, `√${n * n}`, n);
    }
    case "fractions": {
      const d = int(rng, 2, level === "easy" ? 10 : 20);
      // Hard also uses numerators above 1 (3/8) and asks the way back (12.5% = 1/?).
      const num = level === "hard" && rng() < 0.4 ? pick(rng, [2, 3, 4, 5, 7].filter((k) => k < d && gcd(k, d) === 1).concat(1)) : 1;
      const pct = (num / d) * 100;
      if (level !== "easy" && num === 1 && rng() < (level === "hard" ? 0.5 : 0.3)) {
        return { key: `back-${d}`, prompt: `${fmt(pct)}% = 1/?`, answer: d, display: String(d) };
      }
      return { key: `${num}/${d}`, prompt: `${num}/${d} = ?%`, answer: pct, absTolerance: Number.isInteger(pct * 100) ? 0 : 0.05, display: fmt(pct) };
    }
    case "percent": {
      const xs = level === "easy" ? [5, 10, 20, 25, 50] : level === "medium" ? [5, 10, 12.5, 15, 20, 25, 30, 40, 45, 60, 75] : null;
      for (;;) {
        const x = xs ? pick(rng, xs) : int(rng, 1, 99);
        const y = level === "easy" ? int(rng, 1, 20) * 20 : level === "medium" ? int(rng, 2, 40) * 20 : int(rng, 2, 40) * 50;
        const v = (x * y) / 100;
        if (Number.isInteger(v)) return exact(`${x}%${y}`, `${x}% of ${y}`, v);
      }
    }
    case "addsub": {
      if (level === "easy") {
        const a = int(rng, 10, 99);
        const b = int(rng, 10, 99);
        return rng() < 0.5 ? exact(`${a}+${b}`, `${a} + ${b}`, a + b) : exact(`${Math.max(a, b)}-${Math.min(a, b)}`, `${Math.max(a, b)} − ${Math.min(a, b)}`, Math.abs(a - b));
      }
      if (level === "medium") {
        const a = int(rng, 100, 999);
        const b = int(rng, 10, 999);
        if (rng() < 0.5) return exact(`${a}+${b}`, `${a} + ${b}`, a + b);
        const [p, q] = a >= b ? [a, b] : [b, a];
        return exact(`${p}-${q}`, `${p} − ${q}`, p - q);
      }
      const a = int(rng, 100, 999);
      const b = int(rng, 100, 999);
      const c = int(rng, 100, Math.min(999, a + b));
      return exact(`${a}+${b}-${c}`, `${a} + ${b} − ${c}`, a + b - c);
    }
    case "approx": {
      // A round "intended" sum/product, with each number nudged off by a little.
      const nudge = (n: number) => Math.round((n + (rng() - 0.5) * Math.max(0.4, n * 0.02)) * 100) / 100;
      if (level === "easy") {
        const a = nudge(int(rng, 10, 90) * 10);
        const b = nudge(int(rng, 10, 90) * 10);
        return approx(`${a}+${b}`, `${a} + ${b} ≈ ?`, a + b);
      }
      if (level === "medium") {
        const a = nudge(int(rng, 11, 60));
        const b = nudge(int(rng, 11, 40));
        return approx(`${a}x${b}`, `${a} × ${b} ≈ ?`, a * b);
      }
      if (rng() < 0.5) {
        const x = nudge(pick(rng, [10, 15, 20, 25, 30, 40, 50, 60, 75]));
        const y = nudge(int(rng, 2, 40) * 50);
        return approx(`${x}%${y}`, `${x}% of ${y} ≈ ?`, (x * y) / 100);
      }
      const q = int(rng, 12, 60);
      const d = int(rng, 11, 40);
      const a = nudge(q * d);
      const b = nudge(d);
      return approx(`${a}/${b}`, `${a} ÷ ${b} ≈ ?`, a / b);
    }
  }
}

const approx = (key: string, prompt: string, value: number): DrillQuestion => ({ key, prompt, answer: value, relTolerance: 0.03, display: `about ${Math.round(value)}` });

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

/** Reads a typed answer: allows spaces and thousands commas; returns null for anything else. */
export function parseAnswer(raw: string): number | null {
  const s = raw.replace(/[\s,]/g, "").replace(/%$/, "");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  return Number(s);
}

export function isCorrect(q: DrillQuestion, raw: string): boolean {
  const v = parseAnswer(raw);
  if (v === null) return false;
  if (q.relTolerance) return Math.abs(v - q.answer) <= Math.abs(q.answer) * q.relTolerance;
  return Math.abs(v - q.answer) <= (q.absTolerance ?? 0) + 1e-9;
}

/**
 * Hands out questions for one round without repeating a question until every question
 * at that level has been seen (then it starts over).
 */
export class DrillRound {
  readonly id: DrillId;
  readonly level: DrillLevel;
  private rng: Rng;
  private seen = new Set<string>();
  private last = "";
  // Plain fields (no parameter properties), so Node can run this file with type stripping.
  constructor(id: DrillId, level: DrillLevel, rng: Rng = Math.random) {
    this.id = id;
    this.level = level;
    this.rng = rng;
  }
  next(): DrillQuestion {
    for (let tries = 0; tries < 400; tries++) {
      const q = makeQuestion(this.id, this.level, this.rng);
      if (!this.seen.has(q.key)) {
        this.seen.add(q.key);
        this.last = q.key;
        return q;
      }
    }
    // Pool used up: start over, but never show the same question twice in a row.
    this.seen.clear();
    for (;;) {
      const q = makeQuestion(this.id, this.level, this.rng);
      if (q.key !== this.last) {
        this.seen.add(q.key);
        this.last = q.key;
        return q;
      }
    }
  }
}

/** The first `n` questions of a round. */
export function makeRound(id: DrillId, level: DrillLevel, n: number, rng: Rng = Math.random): DrillQuestion[] {
  const r = new DrillRound(id, level, rng);
  return Array.from({ length: n }, () => r.next());
}

/** The score: correct answers per minute, to one decimal. */
export function perMinute(correct: number, seconds: number): number {
  return seconds > 0 ? Math.round((correct / (seconds / 60)) * 10) / 10 : 0;
}
