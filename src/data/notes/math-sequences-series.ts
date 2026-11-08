import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Arithmetic and geometric progressions",
      points: [
        "AP: constant difference d; Tₙ = a + (n − 1)d; a, b, c in AP iff 2b = a + c.",
        "Three numbers in AP: take a − d, a, a + d; four numbers: a − 3d, a − d, a + d, a + 3d.",
        "Tₙ = Sₙ − Sₙ₋₁; if Sₙ is a quadratic in n with no constant term, the sequence is an AP.",
        "GP: constant ratio r; a, b, c in GP iff b² = ac; three numbers in GP: a/r, a, ar.",
        "Infinite GP sum exists only for |r| < 1.",
        "HP: reciprocals form an AP; there is no sum formula, so convert to an AP first.",
        "Numbers that are in both AP and GP must all be equal.",
      ],
    },
    {
      heading: "Means and inequalities",
      points: [
        "For a, b > 0: AM = (a + b)/2, GM = √(ab), HM = 2ab/(a + b); AM ≥ GM ≥ HM, and GM² = AM × HM.",
        "Inserting n AMs between a and b: d = (b − a)/(n + 1); n GMs: r = (b/a)^(1/(n + 1)).",
        "AM–GM for minimisation: split the expression into positive terms with a constant product, e.g. x + 1/x ≥ 2 for x > 0.",
        "Equality in AM–GM holds only when all terms are equal; check that the equality value is attainable.",
      ],
    },
    {
      heading: "Special series",
      points: [
        "Arithmetico-geometric series: multiply Sₙ by r, subtract, and sum the resulting GP.",
        "Method of differences: if the differences of terms form an AP or GP, write Tₙ as a polynomial or exponential in n.",
        "Telescoping: split 1/[n(n + 1)] = 1/n − 1/(n + 1) and similar partial fractions.",
        "Alternating squares: 1² − 2² + 3² − … − (2n)² = −n(2n + 1).",
      ],
    },
    {
      heading: "Binomial theorem",
      points: [
        "(x + y)ⁿ = Σ C(n, r) xⁿ⁻ʳ yʳ, with n + 1 terms; general term Tᵣ₊₁ = C(n, r) xⁿ⁻ʳ yʳ.",
        "Middle term: (n/2 + 1)th if n even; ((n + 1)/2)th and ((n + 3)/2)th if n odd.",
        "Term independent of x: set the power of x in Tᵣ₊₁ to zero and solve for r (must be a whole number).",
        "(1 + x)ⁿ + (1 − x)ⁿ keeps only even powers; (1 + x)ⁿ − (1 − x)ⁿ keeps only odd powers.",
        "Remainders: write the base as (multiple of divisor ± 1), e.g. 2³ = 8 = 7 + 1, so 2²⁰²⁴ = 4·(8)⁶⁷⁴ leaves remainder 4 on division by 7.",
        "C(n, r − 1), C(n, r), C(n, r + 1) in AP leads to a quadratic in n; e.g. C(n, 4), C(n, 5), C(n, 6) in AP gives n = 7 or 14.",
      ],
    },
  ],
  formulas: [
    "AP: Sₙ = (n/2)[2a + (n − 1)d] = (n/2)(a + l)",
    "GP: Sₙ = a(rⁿ − 1)/(r − 1), r ≠ 1; S∞ = a/(1 − r), |r| < 1",
    "Σk = n(n + 1)/2; Σk² = n(n + 1)(2n + 1)/6; Σk³ = [n(n + 1)/2]²",
    "1 + 2x + 3x² + … = 1/(1 − x)², |x| < 1",
    "ΣC(n, r) = 2ⁿ; C₀ + C₂ + … = C₁ + C₃ + … = 2ⁿ⁻¹",
    "Σ r·C(n, r) = n·2ⁿ⁻¹; Σ r²·C(n, r) = n(n + 1)·2ⁿ⁻²; Σ C(n, r)² = C(2n, n)",
    "C(n, r) + C(n, r − 1) = C(n + 1, r); C(r, r) + C(r + 1, r) + … + C(n, r) = C(n + 1, r + 1)",
  ],
  traps: [
    "Using Tᵣ for the general term instead of Tᵣ₊₁; the rth term has C(n, r − 1).",
    "Applying S∞ when |r| ≥ 1.",
    "Applying AM–GM to terms that can be negative.",
    "Counting terms in (1 + x)ⁿ + (1 − x)ⁿ as n + 1; odd powers cancel.",
    "Mixing 'coefficient of a term' with 'binomial coefficient' C(n, r) when the terms carry their own constants.",
  ],
  examTips: [
    "JEE Main usually has one progression question (AP/GP word problem or means) and one binomial question (specific term, coefficient sum or remainder).",
    "Statement-based questions test AP–GP–HP relations and properties of binomial expansions.",
    "Minimum-value questions often hide an AM–GM step; look for a constant product.",
  ],
};

export default notes;
