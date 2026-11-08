import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Sets and counting",
      points: [
        "n(A ∪ B) = n(A) + n(B) − n(A ∩ B); for three sets add back n(A ∩ B ∩ C) after subtracting the pairwise terms.",
        "Symmetric difference: n(A Δ B) = n(A) + n(B) − 2n(A ∩ B).",
        "A set with n elements has 2ⁿ subsets and 2ⁿ − 1 proper subsets.",
        "Overlap bounds: n(A) + n(B) − n(U) ≤ n(A ∩ B) ≤ min(n(A), n(B)).",
        "(A × B) ∩ (B × A) = (A ∩ B) × (A ∩ B); n(A × B) = mn.",
        "Ordered pairs (X, Y) of subsets of an n-set with X ∩ Y = ∅: 3ⁿ (each element goes to X, Y or neither).",
      ],
    },
    {
      heading: "Relations",
      points: [
        "A relation from A to B is any subset of A × B: 2^(mn) relations.",
        "Reflexive: (a, a) for every a; symmetric: (a, b) ⇒ (b, a); antisymmetric: (a, b) and (b, a) ⇒ a = b; transitive: (a, b), (b, c) ⇒ (a, c).",
        "Equivalence = reflexive + symmetric + transitive; each equivalence relation is a partition of the set.",
        "Number of equivalence relations = Bell number: 1, 2, 5, 15, 52 for n = 1 to 5.",
        "|a − b| ≤ 1 is reflexive and symmetric but not transitive; 1 + ab > 0 fails transitivity too.",
      ],
    },
    {
      heading: "Functions: types and counting",
      points: [
        "One-one: f(x₁) = f(x₂) ⇒ x₁ = x₂ (strictly monotonic works); onto: range = codomain; bijection = both.",
        "From |A| = m to |B| = n: nᵐ functions, ⁿPₘ one-one (m ≤ n), n! bijections if m = n.",
        "Onto (m ≥ n): Σ (−1)ᵏ ⁿCₖ (n − k)ᵐ; into 3 elements this is 3ᵐ − 3·2ᵐ + 3.",
        "Derangements Dₙ: 1, 2, 9, 44 for n = 2, 3, 4, 5; use inclusion–exclusion for 'f(i) ≠ i' conditions.",
        "Involutions (f(f(x)) = x) count pairings: 1, 2, 4, 10, 26 for n = 1 to 5.",
        "A map on N swapping odd n with n + 1 is a bijection.",
      ],
    },
    {
      heading: "Domain, range, composition, inverse",
      points: [
        "Domain: denominator ≠ 0, even root ≥ 0, log argument > 0, log base > 0 and ≠ 1.",
        "log of base less than 1 reverses inequalities: log₀.₅ t ≥ 0 ⇔ 0 < t ≤ 1.",
        "Range: set y = f(x), solve for x, impose the conditions on y (e.g. x²/(1 + x²) has range [0, 1)).",
        "g∘f one-one ⇒ f one-one; g∘f onto ⇒ g onto; (g∘f)⁻¹ = f⁻¹∘g⁻¹.",
        "Inverse exists only for a bijection; inverse of tanh x = (eˣ − e⁻ˣ)/(eˣ + e⁻ˣ) is ½ ln((1 + x)/(1 − x)).",
        "Repeated composition of a Möbius map like (x − 1)/(x + 1) cycles; find the cycle length, then reduce the power mod it.",
        "Functional equations like f(x) + 2f(1/x) = 3x: replace x by 1/x and solve the two equations.",
        "Period of a sum = LCM of periods; sin⁴x + cos⁴x has period π/2; log(x + √(1 + x²)) is odd.",
      ],
    },
  ],
  formulas: [
    "Relations on n-set: total 2^(n²); reflexive 2^(n² − n); symmetric 2^(n(n+1)/2); reflexive and symmetric 2^(n(n−1)/2).",
    "Antisymmetric: 2ⁿ · 3^(n(n−1)/2); reflexive and antisymmetric: 3^(n(n−1)/2).",
    "Onto functions {m} → {3}: 3ᵐ − 3·2ᵐ + 3 (e.g. m = 4 gives 36).",
  ],
  traps: [
    "Reflexive needs every (a, a), not just some; {(1,1),(2,2),(1,2)} on {1,2,3} is not reflexive.",
    "Symmetric but not reflexive = symmetric total − reflexive-and-symmetric total.",
    "When computing the least overlap, use the universal size, not the sum of only two sets.",
    "A function onto its stated codomain is checked against that codomain, not against R.",
    "Do not forget base conditions (x − 1 > 0, x − 1 ≠ 1) in log-base domains.",
  ],
  examTips: [
    "JEE Main asks counts of relations/functions of a type and one-one/onto checks almost every year.",
    "Domain questions mix logs, roots and greatest-integer functions; solve each condition and intersect.",
    "Venn questions in JEE and CUET often ask least/greatest possible values.",
  ],
};

export default notes;
