import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Techniques of differentiation",
      points: [
        "Chain rule: d/dx f(g(x)) = f'(g(x))·g'(x); product (uv)' = u'v + uv'; quotient (u/v)' = (u'v − uv')/v².",
        "Implicit: differentiate both sides w.r.t. x, treating y as a function of x, then solve for dy/dx.",
        "Logarithmic: for y = f(x)^g(x) or long products, take ln first: y'/y = d/dx[g ln f].",
        "Inverse-trig expressions: substitute x = tan θ, sin θ or cos θ to simplify before differentiating (sin⁻¹(2x/(1 + x²)) = 2tan⁻¹x for |x| ≤ 1).",
        "Parametric second derivative: d²y/dx² = [d/dt(dy/dx)] ÷ (dx/dt), not (d²y/dt²)/(d²x/dt²).",
        "If y = e^(ax) solves a linear ODE with constant coefficients, a is a root of the auxiliary equation (y'' − 5y' + 6y = 0 gives a = 2, 3).",
      ],
    },
    {
      heading: "Tangents, normals and rates",
      points: [
        "Tangent at (x₀, y₀): y − y₀ = f'(x₀)(x − x₀); normal: y − y₀ = −(x − x₀)/f'(x₀).",
        "Horizontal tangent where dy/dx = 0; vertical tangent where dx/dy = 0.",
        "Tangents from an external point: take a general point (t, f(t)) on the curve, write its tangent and make it pass through the point.",
        "Curves cut orthogonally when m₁m₂ = −1.",
        "Related rates: write the relation between quantities, differentiate w.r.t. time, then substitute the instant values (ladder: x² + y² = L²).",
        "Approximation: Δy ≈ f'(x)Δx.",
      ],
    },
    {
      heading: "Monotonicity and extrema",
      points: [
        "f' ≥ 0 on an interval (zero only at isolated points) ⇒ f increasing; f' ≤ 0 ⇒ decreasing.",
        "Critical points: f'(c) = 0 or f' undefined; extrema can occur at corners such as |x|.",
        "First-derivative test: f' changes + to − gives local max, − to + gives local min, no change gives neither.",
        "Second-derivative test: f'(c) = 0 and f''(c) < 0 ⇒ max, f''(c) > 0 ⇒ min; f''(c) = 0 is inconclusive.",
        "Absolute extrema on [a, b]: evaluate f at all critical points and at a and b, then compare.",
        "Optimisation: express the target in one variable using the constraint, then differentiate; check the domain.",
      ],
    },
    {
      heading: "Mean value theorems",
      points: [
        "Rolle: f continuous on [a, b], differentiable on (a, b), f(a) = f(b) ⇒ some c in (a, b) with f'(c) = 0.",
        "Lagrange (LMVT): same conditions without f(a) = f(b) ⇒ f'(c) = [f(b) − f(a)]/(b − a).",
        "Bounding with LMVT: |f'| ≤ M gives |f(x) − f(0)| ≤ M|x|.",
        "Between two roots of f there is a root of f' (used to count real roots).",
      ],
    },
  ],
  formulas: [
    "d/dx sin⁻¹x = 1/√(1 − x²); d/dx tan⁻¹x = 1/(1 + x²); d/dx aˣ = aˣ ln a; d/dx logₐx = 1/(x ln a)",
    "Parametric: dy/dx = (dy/dt)/(dx/dt)",
    "Angle between curves: tan θ = |(m₁ − m₂)/(1 + m₁m₂)|",
    "Length of subtangent = |y/y'|, subnormal = |y·y'|",
    "x³ − 3x + k = 0 has three distinct real roots iff −2 < k < 2",
    "AM–GM shortcut: min of a/sin x + b/cos x on (0, π/2) is (a^(2/3) + b^(2/3))^(3/2)",
  ],
  traps: [
    "Treating f'(c) = 0 as proof of an extremum (x³ at 0 has none).",
    "Ignoring endpoints when finding absolute maximum or minimum on a closed interval.",
    "Missing extrema at points where f' does not exist, e.g. x^(2/3) or |x| at 0.",
    "Computing the parametric second derivative as (d²y/dt²)/(d²x/dt²).",
    "Applying Rolle or LMVT without checking continuity and differentiability.",
  ],
  examTips: [
    "JEE Main sets monotonic intervals, maximum/minimum values and tangent-normal problems every year.",
    "Optimisation with geometry (triangles formed by tangents with the axes, inscribed shapes) is common.",
    "Statement questions on Rolle/LMVT test whether the hypotheses hold on the given interval.",
  ],
};

export default notes;
