import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core properties",
      points: [
        "∫ₐᵇ f(x) dx = F(b) − F(a); swapping limits changes the sign; ∫ₐᵇ = ∫ₐᶜ + ∫ᶜᵇ.",
        "King's rule: ∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx; add the two forms to cancel awkward parts.",
        "∫₋ₐᵃ f = 2∫₀ᵃ f for even f, 0 for odd f.",
        "∫₀^(2a) f = 2∫₀ᵃ f if f(2a − x) = f(x); 0 if f(2a − x) = −f(x) (so ∫₀^π cos⁵x dx = 0).",
        "Period T: ∫₀^(nT) f = n∫₀^T f; ∫ₐ^(a+T) f is independent of a.",
        "∫₀^π x f(sin x) dx = (π/2)∫₀^π f(sin x) dx.",
        "∫₀^(π/2) g(sin x)/[g(sin x) + g(cos x)] dx = π/4.",
      ],
    },
    {
      heading: "Special integrands",
      points: [
        "Greatest integer [x]: split at integers; ∫₀ⁿ [x] dx = n(n − 1)/2.",
        "Modulus: find where the inside is zero, split there and flip the sign of negative parts.",
        "|sin x + cos x| has period π, so ∫₀^(10π) = 10∫₀^π.",
        "Wallis: ∫₀^(π/2) sinⁿx dx = [(n − 1)(n − 3)…]/[n(n − 2)…] × (π/2 if n even, 1 if n odd); same for cosⁿx.",
        "Beta form: ∫₀¹ xᵐ(1 − x)ⁿ dx = m! n!/(m + n + 1)!.",
        "Standard values: ∫₀^(π/2) ln sin x dx = −(π/2) ln 2; ∫₀¹ ln(1 + x)/(1 + x²) dx = (π/8) ln 2; ∫₀^∞ ln x/(1 + x²) dx = 0.",
        "Improper ∫₀^∞ dx/(x² + a²) = π/(2a); complete the square first.",
      ],
    },
    {
      heading: "Leibniz, limits and bounds",
      points: [
        "Leibniz: d/dx ∫ from u(x) to v(x) of f(t) dt = f(v)v′ − f(u)u′.",
        "For max/min of F(x) = ∫₀ˣ f(t) dt, critical points are the zeros of f.",
        "Limit of a sum: lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx; replace r/n by x and 1/n by dx; range of r fixes the limits.",
        "Product limits: take log, convert to a sum, then integrate (e.g. (1/n)[(n + 1)…(2n)]^(1/n) → 4/e).",
        "f(x) = x² + x∫₀¹ f + ∫₀¹ t f: call the integrals constants, then solve the linear equations.",
        "Bounds: if m ≤ f ≤ M on [a, b], then m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a).",
        "∞/∞ limits with integrals: apply L'Hôpital using Leibniz.",
      ],
    },
    {
      heading: "Area (method)",
      points: [
        "Step 1: sketch and find intersection points. Step 2: decide vertical or horizontal strips. Step 3: integrate (upper − lower) dx or (right − left) dy.",
        "Area is always positive: integrate |f|, splitting where the curve crosses the axis.",
        "Split the region wherever the upper or lower boundary changes.",
        "Use symmetry (about y-axis, or about y = x for inverse functions) to halve the work.",
        "Standard areas: circle πa², ellipse πab, between y² = 4ax and x² = 4ay is 16a²/3.",
        "Tangent-and-curve regions: find the second intersection of the tangent with the curve first.",
      ],
    },
  ],
  formulas: [
    "∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx",
    "d/dx ∫ᵤ^ᵛ f(t) dt = f(v)v′ − f(u)u′",
    "lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx",
    "∫₀^(π/2) sin⁶x dx = (5·3·1)/(6·4·2) · π/2 = 5π/32",
  ],
  traps: [
    "Integrating a signed function for area gives the net value; split at sign changes.",
    "Forgetting the chain-rule factor v′(x) in Leibniz's rule.",
    "The f(2a − x) = −f(x) test applies on [0, 2a], not on [−a, a].",
    "Greatest-integer integrands need a separate piece for every integer inside the limits.",
  ],
  examTips: [
    "JEE Main typically has two questions: a property-based definite integral and an area between curves.",
    "Integrals with x and sin x/cos x together are almost always King's rule.",
    "JEE Advanced pairs Leibniz's rule with functional equations and limits.",
  ],
};

export default notes;
