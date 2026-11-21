/**
 * Past official first-stage cut-offs, by category, for the "Where you stand" predictor on full-mock
 * results. Only figures that match the commission's published result are listed; an exam or year
 * we could not confirm is left out rather than guessed. Marks are out of `total` (the real paper's
 * maximum); the predictor scales them to a StudyClip mock's total.
 *
 * Left out on purpose:
 * - SSC CHSL Tier 1, SBI PO Prelims: published figures disagree between reports, so none are listed yet.
 * - SSC CGL 2023: the "all other posts" list could not be confirmed.
 * - RRB NTPC CBT 1: cut-offs are set separately by each of the 21 RRBs, so there is no single figure.
 *
 * Self-contained (no imports) so scripts can load it directly.
 */

export const CATEGORIES = ["UR", "OBC", "EWS", "SC", "ST"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Cutoff {
  /** Exam id as in src/data/exams.ts. */
  examId: string;
  /** Year of the exam cycle; for a standing qualifying rule, the year the rule was set. */
  year: number;
  category: Category;
  /** Cut-off marks, out of `total`. */
  marks: number;
  /** Maximum marks of the real paper. */
  total: number;
  /** Where the figure comes from. */
  source: string;
  /** "cutoff": marks needed to go to the next stage that year. "qualifying": a fixed pass mark. */
  kind: "cutoff" | "qualifying";
  /** Which list or post group the figure is for, when the exam has several. */
  note?: string;
}

const rows = (
  examId: string,
  year: number,
  total: number,
  source: string,
  marks: Record<Category, number>,
  extra: { kind?: Cutoff["kind"]; note?: string } = {},
): Cutoff[] => CATEGORIES.map((category) => ({ examId, year, category, marks: marks[category], total, source, kind: extra.kind ?? "cutoff", ...(extra.note ? { note: extra.note } : {}) }));

const CGL_NOTE = "Normalised marks; list for all posts other than JSO and Statistical Investigator";

export const CUTOFFS: Cutoff[] = [
  // ---------------- SSC CGL Tier 1 (200 marks) ----------------
  // 2025: the revised List 3 figures SSC published after correcting an error in the first result PDF.
  ...rows("ssc-cgl", 2025, 200, "SSC notice, CGL 2025 Tier 1 result (revised)", { UR: 136.40215, OBC: 130.36617, EWS: 127.4163, SC: 115.02843, ST: 106.38576 }, { note: CGL_NOTE }),
  ...rows("ssc-cgl", 2024, 200, "SSC notice, CGL 2024 Tier 1 result", { UR: 153.18981, OBC: 146.26291, EWS: 142.01963, SC: 126.45554, ST: 111.8893 }, { note: CGL_NOTE }),

  // ---------------- IBPS PO Prelims (100 marks) ----------------
  ...rows("ibps-po", 2025, 100, "IBPS, CRP PO/MT-XV Prelims cut-off (score card release)", { UR: 49.21, OBC: 49.21, EWS: 49.21, SC: 45.96, ST: 40.96 }),
  ...rows("ibps-po", 2024, 100, "IBPS, CRP PO/MT-XIV Prelims cut-off (score card release)", { UR: 48.5, OBC: 48.5, EWS: 48.5, SC: 48, ST: 41 }),
  ...rows("ibps-po", 2023, 100, "IBPS, CRP PO/MT-XIII Prelims cut-off (score card release)", { UR: 54.25, OBC: 54.25, EWS: 54.25, SC: 49.5, ST: 43 }),

  // ---------------- CTET (150 marks per paper) ----------------
  // Fixed pass mark: 60%, with 5% relaxation (55%) for SC, ST and OBC. EWS is not named in the
  // relaxation, so it stays at 60%.
  ...rows("ctet", 2011, 150, "NCTE TET guidelines (2011), as applied in the CBSE CTET information bulletin", { UR: 90, OBC: 82.5, EWS: 90, SC: 82.5, ST: 82.5 }, { kind: "qualifying", note: "Qualifying mark, the same every session" }),
];

/** Exam ids that have cut-off data. */
export const CUTOFF_EXAMS = new Set(CUTOFFS.map((c) => c.examId));
