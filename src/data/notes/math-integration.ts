import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Indefinite integration",
      points: [
        "Substitution: spot a function and its derivative; ∫ f'(x)/f(x) dx = ln|f(x)| + C.",
        "By parts: ∫ u v dx = u∫v dx − ∫(u'∫v dx) dx; choose u by ILATE (Inverse, Log, Algebraic, Trig, Exponential).",
        "∫ eˣ[f(x) + f'(x)] dx = eˣ f(x) + C; the same idea works with e^(tan⁻¹x) after substituting t = tan⁻¹x.",
        "Partial fractions for rational functions; divide first if the numerator degree ≥ denominator degree.",
        "(x² ± 1)/(x⁴ + kx² + 1): divide by x² and substitute t = x ∓ 1/x.",
        "∫ dx/(1 + eˣ): multiply by e^(−x) to get ∫ e^(−x)/(e^(−x) + 1) dx = −ln(1 + e^(−x)) + C.",
        "Trig powers: odd power of sin or cos, peel one off and substitute; for sinᵐx cosⁿx with m + n a negative even integer, write it as tanᵐx · sec^(−(m + n))x and put t = tan x.",
      ],
    },
    {
      heading: "Definite integrals",
      points: [
        "King's rule: ∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx; add the two forms to cancel awkward terms.",
        "∫₀^(2a) f(x) dx = 2∫₀ᵃ f(x) dx if f(2a − x) = f(x), and 0 if f(2a − x) = −f(x).",
        "Periodic f with period T: ∫₀^(nT) f dx = n∫₀ᵀ f dx.",
        "∫₀^(π/4) ln(1 + tan x) dx = (π/8) ln 2; ∫₀^(π/2) ln sin x dx = −(π/2) ln 2.",
        "Split the interval at the points where |…|, [x] or a piecewise rule changes.",
        "Limit of a sum: replace r/n by x and 1/n by dx; limits are the values of r/n at the ends.",
      ],
    },
    {
      heading: "Area under curves",
      points: [
        "Area between y = f(x) and y = g(x) on [a, b] = ∫ₐᵇ |f − g| dx; split at intersections.",
        "Sometimes integrating w.r.t. y (right curve − left curve) is easier.",
        "Area between y = x² and y = x is 1/6; area bounded by y² = 4ax and its latus rectum is 8a²/3.",
        "Ellipse x²/a² + y²/b² = 1 encloses area πab.",
      ],
    },
    {
      heading: "Differential equations",
      points: [
        "Order = highest derivative; degree = power of that derivative once the equation is polynomial in derivatives (may be undefined, e.g. with sin(y')).",
        "Variables separable: bring all y terms with dy and x terms with dx, then integrate.",
        "Homogeneous dy/dx = F(y/x): put y = vx, so dy/dx = v + x dv/dx.",
        "dy/dx = (ax + by + c)/(a'x + b'y + c'): if a/a' = b/b', put t = ax + by; otherwise shift the origin to the intersection point.",
        "Linear: dy/dx + P(x)y = Q(x) has IF = e^(∫P dx); in x-form dx/dy + P(y)x = Q(y) use IF = e^(∫P dy).",
        "Exact forms to recognise: x dy + y dx = d(xy); (x dy − y dx)/x² = d(y/x).",
      ],
    },
  ],
  formulas: [
    "∫ dx/(x² + a²) = (1/a) tan⁻¹(x/a); ∫ dx/√(a² − x²) = sin⁻¹(x/a)",
    "∫ dx/(x² − a²) = (1/2a) ln|(x − a)/(x + a)|; ∫ dx/√(x² ± a²) = ln|x + √(x² ± a²)|",
    "∫ √(a² − x²) dx = (x/2)√(a² − x²) + (a²/2) sin⁻¹(x/a)",
    "∫ tan x dx = ln|sec x|; ∫ sec x dx = ln|sec x + tan x|",
    "∫₋ₐᵃ f dx = 0 (f odd), 2∫₀ᵃ f dx (f even)",
    "Leibniz: d/dx ∫ from u(x) to v(x) of f(t) dt = f(v)v' − f(u)u'",
    "lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx",
    "Linear DE solution: y·IF = ∫ Q·IF dx + C",
  ],
  traps: [
    "Dropping the constant of integration or the modulus in ln|x|.",
    "Taking area as a plain integral when the curve goes below the axis; use absolute values or split.",
    "Forgetting the chain-rule factor v'(x) in Leibniz's rule.",
    "Stating the degree of a DE before clearing radicals in the derivatives.",
    "Using the initial condition before adding the constant C.",
  ],
  examTips: [
    "JEE Main typically has one indefinite integral, one or two definite-integral properties questions, one area and one differential equation.",
    "If a definite integral looks impossible directly, try King's rule or an odd/even split first.",
    "DE questions usually give an initial condition and ask for y at another point, or describe a curve through a tangent property.",
  ],
};

export default notes;
