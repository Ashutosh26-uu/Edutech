/**
 * "Where you stand": a full-mock score against the exam's past official cut-offs (src/data/cutoffs.ts),
 * scaled to the mock's total. Pure functions; it compares, it never promises selection.
 */
import { CUTOFFS, type Category, type Cutoff } from "@/data/cutoffs";

export type { Category } from "@/data/cutoffs";
export { CATEGORIES } from "@/data/cutoffs";

export interface PredictorRow {
  year: number;
  category: Category;
  kind: Cutoff["kind"];
  /** Cut-off on this mock's scale. */
  cutoff: number;
  /** The published figure and the real paper's total. */
  original: number;
  originalTotal: number;
  /** The real paper's total differs from the mock's, so `cutoff` was scaled. */
  scaled: boolean;
  /** Score minus cut-off, on this mock's scale. */
  gap: number;
  /** "+12 above the 2024 UR cut-off" / "18 below the 2024 UR cut-off". */
  gapText: string;
  source: string;
  note?: string;
}

export type VerdictBand = "above" | "close" | "below";

export interface Prediction {
  rows: PredictorRow[];
  band: VerdictBand;
  /** "Above recent cut-offs", "Close: within 10% of the cut-off", "Below: needs about N more marks". */
  verdict: string;
  /** Marks short of the highest recent cut-off (0 when at or above it). */
  short: number;
}

/** Within this share of the cut-off counts as close. */
export const CLOSE_SHARE = 0.1;

const round2 = (n: number) => Math.round(n * 100) / 100;
/** 12, 12.5, 12.25: at most two decimals, no trailing zeros. */
export const fmtMarks = (n: number) => String(round2(n));

/** A published cut-off on a mock's scale. */
export const scaleCutoff = (marks: number, total: number, mockTotal: number) => (total === mockTotal ? marks : round2((marks * mockTotal) / total));

export function gapText(gap: number, year: number, category: Category, kind: Cutoff["kind"] = "cutoff"): string {
  const what = kind === "qualifying" ? `${category} qualifying mark` : `${year} ${category} cut-off`;
  if (gap > 0) return `+${fmtMarks(gap)} above the ${what}`;
  if (gap < 0) return `${fmtMarks(-gap)} below the ${what}`;
  return `Level with the ${what}`;
}

/** The verdict against one reference cut-off (the highest recent one). */
export function verdictFor(score: number, cutoff: number): { band: VerdictBand; verdict: string; short: number } {
  const gap = round2(score - cutoff);
  if (gap >= 0) return { band: "above", verdict: "Above recent cut-offs", short: 0 };
  const short = -gap;
  if (short <= round2(cutoff * CLOSE_SHARE)) return { band: "close", verdict: "Close: within 10% of the cut-off", short };
  const n = Math.ceil(short);
  return { band: "below", verdict: `Below: needs about ${n} more mark${n === 1 ? "" : "s"}`, short };
}

export const hasCutoffs = (examId: string | undefined) => !!examId && CUTOFFS.some((c) => c.examId === examId);

/**
 * Past cut-offs for the exam and category, scaled to the mock's total, the gap to each, and a verdict
 * against the highest of them. Null when the exam (or the category) has no data or the mock has no total.
 */
export function predict(examId: string | undefined, score: number, maxScore: number, category: Category, data: Cutoff[] = CUTOFFS): Prediction | null {
  if (!examId || !(maxScore > 0) || !Number.isFinite(score)) return null;
  const found = data.filter((c) => c.examId === examId && c.category === category).sort((a, b) => b.year - a.year);
  if (!found.length) return null;
  const rows = found.map((c): PredictorRow => {
    const cutoff = scaleCutoff(c.marks, c.total, maxScore);
    const gap = round2(score - cutoff);
    return {
      year: c.year,
      category: c.category,
      kind: c.kind,
      cutoff,
      original: c.marks,
      originalTotal: c.total,
      scaled: c.total !== maxScore,
      gap,
      gapText: gapText(gap, c.year, c.category, c.kind),
      source: c.source,
      ...(c.note ? { note: c.note } : {}),
    };
  });
  const highest = Math.max(...rows.map((r) => r.cutoff));
  return { rows, ...verdictFor(score, highest) };
}
