import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Counting basics",
      points: [
        "Multiplication principle for 'and' (successive choices); addition principle for 'or' (disjoint cases).",
        "Permutation = arrangement (order matters); combination = selection (order does not matter).",
        "Arrangements of n things with p alike of one kind, q of another: n!/(p! q! …).",
        "Items together: tie them as one block, arrange, then arrange inside the block.",
        "No two together (gap method): arrange the others, then place the restricted items in the gaps.",
        "'At least one' = total − none.",
        "Circular: (n − 1)! for n distinct people; (n − 1)!/2 for a necklace or garland where clockwise = anticlockwise.",
      ],
    },
    {
      heading: "Standard counting results",
      points: [
        "Selecting r from n with one particular item always included: C(n − 1, r − 1); always excluded: C(n − 1, r).",
        "Sum of all n-digit numbers from n distinct non-zero digits (no repetition): (n − 1)! × (sum of digits) × (111…1, n ones).",
        "Rank of a word in dictionary order: count words starting with each smaller letter, position by position, then add 1.",
        "Number of diagonals of an n-gon: C(n, 2) − n; triangles from n points with no three collinear: C(n, 3).",
        "Distributing n distinct objects into r distinct boxes: rⁿ; with no box empty use inclusion–exclusion.",
        "Distinct objects into identical boxes, none empty: Stirling numbers, e.g. 6 into 3 gives 90.",
        "Number of divisors of p^a q^b r^c: (a + 1)(b + 1)(c + 1).",
      ],
    },
    {
      heading: "Probability",
      points: [
        "P(E) = favourable/total for equally likely outcomes; 0 ≤ P(E) ≤ 1; P(E') = 1 − P(E).",
        "P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
        "Conditional: P(A | B) = P(A ∩ B)/P(B); shrink the sample space to B.",
        "Independent events: P(A ∩ B) = P(A)P(B); then A', B' are also independent.",
        "P(at least one of independent events) = 1 − Π(1 − pᵢ).",
        "Total probability: P(E) = Σ P(Aᵢ)P(E | Aᵢ) over a partition A₁, A₂, ….",
        "Bayes: reverse the condition, P(Aᵢ | E) = P(Aᵢ)P(E | Aᵢ)/P(E).",
      ],
    },
    {
      heading: "Random variables",
      points: [
        "Mean E(X) = Σ xᵢpᵢ; variance = E(X²) − [E(X)]².",
        "Binomial B(n, p): n independent trials, each success with probability p.",
        "P(X = r) = C(n, r) pʳ qⁿ⁻ʳ, q = 1 − p; mean np, variance npq.",
      ],
    },
  ],
  formulas: [
    "ⁿPᵣ = n!/(n − r)!; ⁿCᵣ = n!/[r!(n − r)!]; ⁿCᵣ = ⁿCₙ₋ᵣ",
    "Non-negative integer solutions of x₁ + … + xᵣ = n: C(n + r − 1, r − 1); positive solutions: C(n − 1, r − 1)",
    "Onto maps / no empty box: rⁿ − C(r, 1)(r − 1)ⁿ + C(r, 2)(r − 2)ⁿ − …",
    "Derangements: Dₙ = n![1 − 1/1! + 1/2! − … + (−1)ⁿ/n!]; D₃ = 2, D₄ = 9, D₅ = 44",
    "Ways to split mn distinct items into m equal groups (groups unlabelled): (mn)!/[(n!)ᵐ m!]",
    "Bayes: P(Aᵢ | E) = P(Aᵢ)P(E | Aᵢ) / Σ P(Aⱼ)P(E | Aⱼ)",
  ],
  traps: [
    "Using permutations where order does not matter (selecting a team or committee).",
    "Calling mutually exclusive events independent; with positive probabilities they never are.",
    "Forgetting that a leading zero is not allowed when forming numbers.",
    "Treating identical boxes or identical objects as distinct (or the reverse).",
    "Using P(A | B) when the question really asks for P(B | A) (typical Bayes slip).",
  ],
  examTips: [
    "JEE Main usually has one P&C and one or two probability questions, often as integer-answer numericals.",
    "Look for the single restriction (at least one, no two together, divisible by 5, digit not repeated) that drives the count.",
    "Bayes and conditional-probability questions come as urn, factory-defect or test-result stories; draw a tree diagram.",
  ],
};

export default notes;
