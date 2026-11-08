import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Counting principles",
      points: [
        "Multiplication rule: tasks done one after another (AND) → multiply the ways",
        "Addition rule: mutually exclusive choices (OR) → add the ways",
        "Order matters → permutation; order does not matter → combination",
        "Complementary counting: total − unwanted is often faster ('at least one', 'not together')",
      ],
    },
    {
      heading: "Arrangements",
      points: [
        "n distinct objects in a row: n!; choose and arrange r of them: nPr",
        "Letters with repeats: n! / (p! q! …) – BANANA = 6!/(3! 2!) = 60",
        "Items together: tie them into one block, arrange the blocks, then multiply by the arrangements inside the block",
        "No two of a group together (gap method): arrange the others first, then choose gaps – 5 boys and 3 girls: 5! × 6P3",
        "Circular: (n − 1)!; necklace or garland (flip allowed): (n − 1)!/2",
        "Digits: handle the restricted place first (no leading 0, last digit for even/divisible by 5)",
        "Dictionary rank: count words starting with each smaller letter, fix letters left to right, add 1 at the end",
      ],
    },
    {
      heading: "Selections and distributions",
      points: [
        "nCr = nC(n − r); total subsets 2ⁿ; at least one item 2ⁿ − 1",
        "Committee with exactly k of a group: (group C k) × (others C rest); 'at least' → add the cases",
        "Handshakes or lines from n points: nC2; triangles: nC3; diagonals of an n-gon: n(n − 3)/2",
        "If m of the n points are collinear: lines nC2 − mC2 + 1, triangles nC3 − mC3",
        "n identical items into r groups, empty allowed: (n + r − 1)C(r − 1); each at least one: (n − 1)C(r − 1)",
        "Grid paths from (0, 0) to (a, b) moving right/up: (a + b)C a; rectangles in an m × n grid: (m + 1)C2 × (n + 1)C2",
        "Dividing 3n distinct items into 3 unlabelled groups of n: (3n)! / ((n!)³ 3!)",
      ],
    },
    {
      heading: "Probability",
      points: [
        "P(E) = favourable / total equally likely outcomes; 0 ≤ P ≤ 1",
        "P(A ∪ B) = P(A) + P(B) − P(A ∩ B); independent events: P(A ∩ B) = P(A) × P(B)",
        "P(at least one) = 1 − P(none)",
        "Conditional: P(A | B) = P(A ∩ B) / P(B) – shrink the sample space to B",
        "Bayes: P(A | D) = P(A)P(D | A) / Σ P(Aᵢ)P(D | Aᵢ) – used for machine/defective questions",
        "Binomial: P(exactly r successes in n trials) = nCr pʳ qⁿ⁻ʳ, q = 1 − p",
        "Expected value E = Σ xᵢ pᵢ; for one fair die E = 3.5",
      ],
    },
  ],
  formulas: [
    "nPr = n! / (n − r)!; nCr = n! / (r! (n − r)!)",
    "Derangements: D₂ = 1, D₃ = 2, D₄ = 9, D₅ = 44, D₆ = 265; exactly k of n correct = nCk × D(n − k)",
    "Two dice: 36 outcomes; sum 7 is most likely (6/36); sum ≥ 10 has 6 outcomes",
    "Cards: 52 cards, 4 suits of 13, 26 red, 12 face cards (J, Q, K), 4 aces",
    "Coins: n coins give 2ⁿ outcomes; exactly r heads = nCr / 2ⁿ",
    "Odds in favour a : b ⇒ P = a / (a + b)",
  ],
  traps: [
    "Using permutations for a committee or combinations for a seating arrangement",
    "Forgetting to arrange the items inside a 'together' block",
    "Dividing by 2 in circular seating when clockwise and anticlockwise are different (people at a table)",
    "Counting with replacement when the question draws without replacement",
    "In 'at least one boy' family questions, the sample space is {BB, BG, GB}, so P(both boys) = 1/3, not 1/2",
  ],
  examTips: [
    "TCS NQT, Infosys, Cognizant and AMCAT ask 2–4 questions here, usually word arrangements, committees, dice and cards",
    "Harder tests chain ideas: derangements, distributions with constraints, conditional probability and Bayes",
    "If casework gets long, switch to the complement – the options are usually built from the most common miscount",
  ],
};

export default notes;
