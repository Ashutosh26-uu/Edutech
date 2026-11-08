import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Quadratic equations",
      points: [
        "ax² + bx + c = 0 (a ≠ 0): sum of roots α + β = −b/a, product αβ = c/a.",
        "Equation with roots α, β: x² − (α + β)x + αβ = 0.",
        "Symmetric functions: α² + β² = (α + β)² − 2αβ; (α − β)² = (α + β)² − 4αβ; α³ + β³ = (α + β)³ − 3αβ(α + β).",
        "Nature (real a, b, c): D > 0 two real distinct, D = 0 equal, D < 0 complex conjugate pair; D a perfect square (rational coefficients) gives rational roots.",
        "Sign of ax² + bx + c: same sign as a for all real x iff D < 0; minimum value −D/4a at x = −b/2a when a > 0.",
        "Range of y = (quadratic)/(quadratic): cross-multiply into a quadratic in x and demand D ≥ 0.",
        "Equations with |x| or [x]: split into cases (x ≥ 0, x < 0, or integer intervals) and keep only roots that lie in their case.",
      ],
    },
    {
      heading: "Location of roots",
      points: [
        "Both roots greater than k: D ≥ 0, −b/2a > k, a·f(k) > 0.",
        "k lies between the roots: a·f(k) < 0 (no other condition needed).",
        "Exactly one root in (p, q): f(p)·f(q) < 0.",
        "Roots of opposite sign: c/a < 0; both positive: D ≥ 0, −b/a > 0, c/a > 0.",
        "Common root of a₁x² + b₁x + c₁ = 0 and a₂x² + b₂x + c₂ = 0: (c₁a₂ − c₂a₁)² = (a₁b₂ − a₂b₁)(b₁c₂ − b₂c₁).",
      ],
    },
    {
      heading: "Complex numbers",
      points: [
        "i² = −1, powers of i repeat every 4: iⁿ depends on n mod 4 (i²⁰²³ = i³ = −i).",
        "z = x + iy = r(cos θ + i sin θ) = re^(iθ); r = |z|, θ = arg z with principal value in (−π, π].",
        "|z₁z₂| = |z₁||z₂|, arg(z₁z₂) = arg z₁ + arg z₂ (up to 2π); z z̄ = |z|²; 1/z = z̄/|z|².",
        "z is real iff z = z̄; purely imaginary iff z = −z̄ (z ≠ 0).",
        "nth roots of unity: e^(2πik/n), k = 0 … n − 1; they sum to 0 and form a regular n-gon on the unit circle.",
        "If 1, α₁, …, αₙ₋₁ are the nth roots of unity, (x − α₁)…(x − αₙ₋₁) = 1 + x + … + xⁿ⁻¹.",
      ],
    },
    {
      heading: "Loci in the Argand plane",
      points: [
        "|z − z₁| = r: circle; |z − z₁| = |z − z₂|: perpendicular bisector of z₁z₂.",
        "|z − z₁|/|z − z₂| = k (k ≠ 1): circle (Apollonius); k = 1 gives a line.",
        "|z − z₁| + |z − z₂| = 2a: ellipse if 2a > |z₁ − z₂|, the segment if equal; |z − z₁| − |z − z₂| = constant < |z₁ − z₂| is a hyperbola branch.",
        "Re[(z − z₁)/(z − z₂)] = 0 or arg = ±π/2: circle with z₁z₂ as diameter.",
        "Minimise |z − a| + |z − b| over a line: reflect one point in the line and join (shortest-path trick).",
      ],
    },
  ],
  formulas: [
    "x = [−b ± √(b² − 4ac)]/(2a), D = b² − 4ac",
    "De Moivre: (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ",
    "ω = (−1 + i√3)/2 = e^(2πi/3); 1 + ω + ω² = 0, ω³ = 1, ω̄ = ω²",
    "1 + ωⁿ + ω²ⁿ = 3 if 3 | n, else 0",
    "|z₁ + z₂|² = |z₁|² + |z₂|² + 2Re(z₁z̄₂)",
    "Triangle inequality: ||z₁| − |z₂|| ≤ |z₁ ± z₂| ≤ |z₁| + |z₂|",
  ],
  traps: [
    "Applying 'complex roots occur in conjugate pairs' when coefficients are not real.",
    "Forgetting D ≥ 0 when both roots must lie in an interval; the vertex and end conditions alone are not enough.",
    "Taking arg z = tan⁻¹(y/x) without checking the quadrant of z.",
    "Counting roots of x² − 5|x| + 6 = 0 from only the x ≥ 0 case; the graph is symmetric, so roots come in ± pairs.",
    "Using arg(z₁z₂) = arg z₁ + arg z₂ for principal values without adjusting back into (−π, π].",
  ],
  examTips: [
    "JEE Main typically sets one quadratic (roots in an interval, symmetric expressions, range) and one complex-number question (locus, modulus, cube roots of unity).",
    "JEE Advanced combines complex numbers with geometry: rotation, regular polygons and roots of unity.",
    "For loci, substitute z = x + iy only as a last resort; recognise the standard forms first.",
  ],
};

export default notes;
