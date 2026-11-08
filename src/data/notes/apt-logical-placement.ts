import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Number and letter series",
      points: [
        "Check in this order: differences, second differences, ratios, alternate terms, squares/cubes, then mixed (×2 + 1, ×n + n)",
        "4, 9, 19, 39, 79 → ×2 + 1 each time; 6, 7, 10, 19, 46 → differences 1, 3, 9, 27",
        "Odd one out: test perfect squares, cubes, primes and digit sums – 51 = 3 × 17 is not prime",
        "Wrong-number questions: find the rule from most terms, then the one term that breaks it (n³ + 1, n³ − 1 patterns)",
        "Letter series: convert to positions A = 1 … Z = 26 and treat as numbers; wrap around after Z",
      ],
    },
    {
      heading: "Coding–decoding",
      points: [
        "Write position numbers under both words and look for a constant shift (+1, +2), alternating shift or reversal",
        "Reverse alphabet pairs: letter + pair = 27 (A↔Z, C↔X, R↔I); remember EJOTY = 5, 10, 15, 20, 25",
      ],
    },
    {
      heading: "Arrangements and puzzles",
      points: [
        "Draw the layout first (row, circle, floors) and place the most constrained person or item first",
        "Branch into cases only when forced, and cross out cases as soon as one clue fails",
        "Row facing north: left is the viewer's left; facing south: left and right swap",
        "Circle facing the centre: left = clockwise, right = anticlockwise; facing outward it reverses",
        "Floors: 'above' does not mean 'immediately above' unless stated",
      ],
    },
    {
      heading: "Statements, syllogisms and inequalities",
      points: [
        "A conclusion follows only if it is true in every possible diagram, not just one",
        "All + All → All; All + No → No; Some + All → Some; Some + No → Some … not; Some + Some → no definite conclusion",
        "'Some A are B' does not imply 'Some A are not B'",
        "Either–or: two conclusions on the same terms that are individually doubtful but together cover all cases (e.g. Some … / No …)",
        "Inequality chains: combine only signs running the same way; any > in the chain makes the result >, otherwise ≥; = keeps the other sign",
      ],
    },
    {
      heading: "Blood relations and cryptarithms",
      points: [
        "Draw a family tree: + for male, − for female, horizontal lines for siblings and spouses, vertical for generations",
        "For coded relations (A $ B = mother), decode one symbol at a time from right to left of the chain",
        "Cryptarithm: a sum longer than its addends starts with 1; each letter is a different digit; no leading zero",
        "Square ending in itself: AB × AB = CAB works only for 25 (625) or 76 (5776, too long) – check digits",
        "AB − BA = 9(A − B) and AB + BA = 11(A + B)",
      ],
    },
    {
      heading: "Cubes, dice and figures",
      points: [
        "Standard die: opposite faces add to 7 (1–6, 2–5, 3–4)",
        "Two views sharing a common face in the same position: the faces in matching positions are opposite each other",
        "Cube net: in a straight row of three faces, the first and third are opposite",
        "Figure series: track each element separately (rotation angle, position step, shading) and repeat the step",
      ],
    },
  ],
  formulas: [
    "Painted cube cut into n³: 3 faces 8; 2 faces 12(n − 2); 1 face 6(n − 2)²; no face (n − 2)³",
    "Letter positions: A1 E5 J10 O15 T20 Y25; opposite letter = 27 − position",
    "Number of squares in an n × n grid = 1² + 2² + … + n²",
  ],
  traps: [
    "Accepting a conclusion that is merely possible rather than certain",
    "Forgetting that left and right flip for people facing south or facing outward",
    "Applying the all-faces painted cube formula when only some faces are painted – count face by face",
    "Assuming a die is standard when the question says numbers are not placed in the standard way",
    "Stopping at the first series rule that fits three terms without checking the rest",
  ],
  examTips: [
    "TCS, Infosys, Cognizant and Capgemini logical sections are timed tightly – solve series and coding first, puzzles last",
    "Puzzle sets usually ask 3–5 questions from one arrangement, so a careful first diagram pays off",
    "Infosys favours cryptarithms and harder arrangements; TCS NQT favours series, syllogisms and seating",
  ],
};

export default notes;
