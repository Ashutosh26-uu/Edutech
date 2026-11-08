import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Step-by-step method",
      points: [
        "Step 1: look at the size of growth: slow growth suggests differences, fast growth suggests multiplication or powers.",
        "Step 2: write first differences; if not constant, take second differences.",
        "Step 3: try ratios between terms (×2, ×3, ×1.5) and mixed rules (×2 + 1, ×3 − 2).",
        "Step 4: check squares, cubes, primes and alternating patterns.",
        "Step 5: verify the rule on every term before choosing an answer.",
      ],
    },
    {
      heading: "Common number patterns",
      points: [
        "Constant or increasing differences: 7, 12, 19, 28, 39 (diff 5, 7, 9, 11) → 52.",
        "Squares and cubes, also n² ± 1 or n³ ± n: 1, 4, 9, 16, 25; 1, 8, 27, 64.",
        "Fibonacci: each term = sum of the previous two (1, 1, 2, 3, 5, 8, 13).",
        "Multiply then add: ×1 + 1, ×2 + 2, ×3 + 3… (5, 6, 14, 45, 184 → 925).",
        "Differences forming powers: 3, 4, 7, 16, 43 (diff 1, 3, 9, 27) → 124.",
        "Prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.",
      ],
    },
    {
      heading: "Alternating and mixed series",
      points: [
        "Two interleaved series: split into odd and even positions (3, 5, 7, 10, 11, 20, 15, 40 → 19).",
        "Alternate squares and cubes: 1, 8, 9, 64, 25, 216 → 49.",
        "Decreasing by squares or near-squares: 120, 99, 80, 63, 48 (11² − 1, 10² − 1, …) → 35.",
      ],
    },
    {
      heading: "Letter and alphanumeric series",
      points: [
        "Convert letters to positions A = 1 … Z = 26 and treat as numbers.",
        "Opposite letters sum to 27: A–Z, B–Y, C–X, D–W, E–V.",
        "Skip patterns: C, F, I, L (+3) → O; AC, EG, IK, MO → QS.",
        "Alphanumeric: letter position may match the number (B2, E5, H8, K11 → N14) or its square (A1, D4, I9, P16 → Y25).",
        "Positions past 26 wrap around to A.",
      ],
    },
  ],
  formulas: [
    "Squares: 11² = 121 … 20² = 400, 25² = 625",
    "Cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000",
    "Reverse positions: EJOTY = 5, 10, 15, 20, 25",
    "Opposite letter = 27 − position",
  ],
  traps: [
    "Do not stop after two terms fit; check the whole series.",
    "If differences do not settle, try second differences or splitting into two series before giving up.",
    "Wrong-term questions: one term breaks the rule, so find the rule from the majority.",
    "Letter series often skip by a growing step (+1, +2, +3), not a fixed one.",
  ],
  examTips: [
    "Asked in almost every SSC, bank, railway and placement reasoning section; 2–5 questions per paper.",
    "Bank exams also use 'find the wrong number' series; SSC prefers missing-term and alphanumeric series.",
    "Memorise squares to 30, cubes to 15 and EJOTY letter anchors to spot rules quickly.",
  ],
};

export default notes;
