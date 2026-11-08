import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Functions and domains",
      points: [
        "Domain rules: expression under √ must be ≥ 0, denominator ≠ 0, argument of log must be > 0.",
        "sin⁻¹x and cos⁻¹x need −1 ≤ x ≤ 1; tan⁻¹x is defined for all real x.",
        "[x] is the greatest integer ≤ x: [2.7] = 2, [−2.7] = −3; {x} = x − [x] lies in [0, 1).",
        "[x] is discontinuous at every integer; |x| is continuous everywhere but has a corner at 0.",
      ],
    },
    {
      heading: "Evaluating limits",
      points: [
        "Try direct substitution first; only indeterminate forms (0/0, ∞/∞, 0·∞, ∞ − ∞, 1^∞, 0⁰, ∞⁰) need work.",
        "Factorise and cancel, or rationalise when square roots appear.",
        "For x → ∞ with rational functions, divide by the highest power of x in the denominator.",
        "Series expansions near 0: sin x = x − x³/6 + …, cos x = 1 − x²/2 + x⁴/24 − …, tan x = x + x³/3 + …, eˣ = 1 + x + x²/2 + …, ln(1 + x) = x − x²/2 + …, tan⁻¹x = x − x³/3 + ….",
        "L'Hôpital: for 0/0 or ∞/∞, lim f/g = lim f'/g'; repeat if still indeterminate.",
        "Sandwich theorem: if g ≤ f ≤ h and g, h → L, then f → L; useful with [x], sin and cos bounds.",
        "Sums of n terms as n → ∞: convert to a definite integral or squeeze between two simple sums.",
        "For [·] inside a limit, use x − 1 < [x] ≤ x and squeeze.",
      ],
    },
    {
      heading: "Continuity",
      points: [
        "f is continuous at a iff LHL = RHL = f(a).",
        "Sums, products and compositions of continuous functions are continuous; a quotient is continuous where the denominator ≠ 0.",
        "Removable discontinuity: the limit exists but differs from f(a) or f(a) is undefined; redefine f(a) to fix it.",
        "For piecewise functions, test only the junction points; each piece is usually continuous on its own.",
      ],
    },
    {
      heading: "Differentiability",
      points: [
        "f is differentiable at a iff left derivative = right derivative (finite).",
        "Differentiable ⇒ continuous, but not conversely (|x| at 0, x^(1/3) has a vertical tangent at 0).",
        "|f(x)| can fail to be differentiable only at zeros of f; it has a corner where f crosses zero with f′ ≠ 0, and stays differentiable where f′ = 0 too (|x³| at 0).",
        "A product g(x)·|h(x)| is differentiable at a simple zero of h if g is zero there as well.",
        "x² sin(1/x) (with f(0) = 0) is differentiable at 0, but its derivative is not continuous at 0; x sin(1/x) is continuous but not differentiable at 0.",
        "Counting non-differentiable points: list corners of every |…| term and jumps of [·], then cancel those made smooth by a zero factor.",
      ],
    },
  ],
  formulas: [
    "As x → 0: sin x/x → 1, tan x/x → 1, (1 − cos x)/x² → 1/2",
    "As x → 0: (eˣ − 1)/x → 1, (aˣ − 1)/x → ln a, ln(1 + x)/x → 1",
    "lim (xⁿ − aⁿ)/(x − a) = n aⁿ⁻¹ as x → a",
    "lim (1 + x)^(1/x) = e as x → 0; lim (1 + 1/n)ⁿ = e as n → ∞",
    "1^∞ form: lim f^g = e^(lim g·(f − 1))",
    "lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx as n → ∞",
  ],
  traps: [
    "Applying L'Hôpital to forms that are not 0/0 or ∞/∞.",
    "Using the quotient rule in L'Hôpital; differentiate numerator and denominator separately.",
    "Truncating a series too early when the leading terms cancel (e.g. x − sin x needs the x³ term).",
    "Assuming continuity implies differentiability.",
    "Forgetting that [x] behaves differently from the left and right at integers.",
  ],
  examTips: [
    "JEE Main nearly always has a limit question (1^∞ form, series expansion or limit of a sum) and one continuity/differentiability question.",
    "Counting points of non-differentiability for functions with |…| and [·] is a favourite numerical-answer question.",
    "Piecewise functions with an unknown constant: equate left and right limits to the function value.",
  ],
};

export default notes;
