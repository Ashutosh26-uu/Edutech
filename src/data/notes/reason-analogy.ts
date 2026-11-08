import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Analogy: find the exact relation in the first pair, then apply the same relation to the second.",
        "Classification (odd one out): three items share a rule; the fourth breaks it.",
        "State the rule in words before looking at options; then test every option.",
      ],
    },
    {
      heading: "Word analogies: common relations",
      points: [
        "Worker–tool: carpenter : saw, tailor : needle.",
        "Instrument–measures: thermometer : temperature, barometer : pressure, odometer : distance.",
        "Study–subject: ornithology : birds, seismology : earthquakes, entomology : insects.",
        "Part–whole: petal : flower, page : book. Product–raw material: paper : pulp, cloth : yarn.",
        "Young one: cow : calf, horse : foal, dog : puppy. Home: bee : hive, lion : den, horse : stable.",
        "Synonym/antonym pairs, cause–effect, and country–currency or capital also appear.",
      ],
    },
    {
      heading: "Number analogies",
      points: [
        "Check squares and cubes first: 4 : 64 = n³; 4 : 65 = n³ + 1.",
        "Then n² ± 1, n³ ± 1, n(n + 1), n² + n, and simple multiples.",
        "Pairs like (6, 8) : 100 often mean 6² + 8² = 100; then (5, 12) : 169.",
        "For odd one out among numbers, check primes, squares, cubes, multiples and digit sums.",
        "121, 169 are squares (11², 13²); 143 = 11 × 13 and 187 = 11 × 17 are not.",
      ],
    },
    {
      heading: "Letter analogies",
      points: [
        "Convert letters to positions: A = 1 … Z = 26.",
        "Look for a constant shift: ACE : BDF is +1 on each letter, so GIK : HJL.",
        "Opposite letters add to 27: A–Z, B–Y, C–X, D–W, E–V … M–N.",
        "Letter–number mixes: B4 : D16 means position², so F36 : H64.",
        "Odd letter group: check gaps between letters (e.g. +1+1, +2+2, +1+2+1).",
      ],
    },
    {
      heading: "Classification method",
      points: [
        "Group by category (fruit vs flower, river flowing east vs west, 2D vs 3D shape).",
        "Kaveri, Krishna, Godavari flow east into the Bay of Bengal; Narmada flows west.",
        "Triangle, square, pentagon are 2D; cube is 3D.",
        "If two rules each isolate a different option, pick the stronger, more specific rule.",
      ],
    },
  ],
  formulas: [
    "Squares 11²–20²: 121, 144, 169, 196, 225, 256, 289, 324, 361, 400",
    "Cubes 2³–10³: 8, 27, 64, 125, 216, 343, 512, 729, 1000",
    "EJOTY: E = 5, J = 10, O = 15, T = 20, Y = 25",
    "Opposite letter: position of X + position of opposite = 27",
  ],
  traps: [
    "Reversing the order of the relation in the second pair (tool : worker vs worker : tool).",
    "Stopping at the first rule that fits; check that it fits all three non-odd items exactly.",
    "Missing n³ ± 1 patterns because n² looked close.",
    "Counting letter gaps from the wrong end or forgetting the alphabet wraps only if stated.",
    "Assuming 343 is a square; it is 7³.",
  ],
  examTips: [
    "SSC CGL/CHSL/MTS and railway exams ask several analogy and classification items each paper.",
    "Expect a mix: words, numbers, letters and number pairs like (2, 9), (3, 28).",
    "Memorising squares, cubes and EJOTY saves the most time here.",
  ],
};

export default notes;
