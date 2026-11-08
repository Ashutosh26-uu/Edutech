import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "A conic is the locus of a point whose distance from a focus is e times its distance from a directrix.",
        "e = 1 parabola, e < 1 ellipse, e > 1 hyperbola; a circle is the limiting ellipse with e = 0.",
        "For a shifted conic, complete the squares, shift the origin to the centre/vertex, then read a, b and e.",
        "If the y² term has the larger denominator in an ellipse (b > a), the major axis is along the y-axis: swap the roles of a and b.",
      ],
    },
    {
      heading: "Parabola y² = 4ax",
      points: [
        "Vertex (0, 0), focus (a, 0), directrix x = −a, axis y = 0, latus rectum 4a with ends (a, ±2a).",
        "Other forms: x² = 4ay opens up (focus (0, a), directrix y = −a); x² = −4ay opens down.",
        "Parametric point (at², 2at); focal distance of a point = x + a.",
        "Tangent at t: ty = x + at²; tangents at t₁ and t₂ meet at (at₁t₂, a(t₁ + t₂)).",
        "Normal at t: y = −tx + 2at + at³; in slope form y = mx − 2am − am³ (up to three normals from a point).",
        "Shortest distance from a line to a parabola: find the point where the tangent is parallel to the line.",
      ],
    },
    {
      heading: "Ellipse x²/a² + y²/b² = 1 (a > b)",
      points: [
        "Centre (0, 0), vertices (±a, 0), foci (±ae, 0), directrices x = ±a/e, b² = a²(1 − e²).",
        "Parametric point (a cos θ, b sin θ); focal distances a ± ex, summing to 2a.",
        "Tangent in slope form: y = mx ± √(a²m² + b²); at θ: (x cos θ)/a + (y sin θ)/b = 1.",
        "Area πab; largest inscribed rectangle with sides parallel to the axes has area 2ab.",
      ],
    },
    {
      heading: "Hyperbola x²/a² − y²/b² = 1",
      points: [
        "Foci (±ae, 0), directrices x = ±a/e, b² = a²(e² − 1); transverse axis 2a, conjugate axis 2b.",
        "Focal distances on the right branch: ex − a and ex + a, differing by 2a.",
        "Tangent in slope form: y = mx ± √(a²m² − b²); asymptotes y = ±(b/a)x.",
        "Rectangular hyperbola (a = b) has e = √2 and perpendicular asymptotes; xy = c² has parametric point (ct, c/t).",
        "Tangent to xy = c² at (x₁, y₁): xy₁ + yx₁ = 2c²; xy − 3x − 2y = 0 rewrites as (x − 2)(y − 3) = 6, centre (2, 3).",
      ],
    },
  ],
  formulas: [
    "Parabola y² = 4ax: y = mx + c tangent iff c = a/m; focal chord t₁t₂ = −1, length a(t₁ − t₂)², also 4a cosec²θ",
    "Ellipse: e = √(1 − b²/a²), latus rectum 2b²/a, tangent condition c² = a²m² + b²",
    "Hyperbola: e = √(1 + b²/a²), latus rectum 2b²/a, tangent condition c² = a²m² − b²",
    "Conjugate hyperbolas: 1/e₁² + 1/e₂² = 1",
    "Tangent at (x₁, y₁): T = 0; chord with midpoint (x₁, y₁): T = S₁; chord of contact: T = 0",
    "Normal to ellipse at (x₁, y₁): a²x/x₁ − b²y/y₁ = a² − b²",
    "Director circle: ellipse x² + y² = a² + b², hyperbola x² + y² = a² − b²; for a parabola it is the directrix",
  ],
  traps: [
    "Using b² = a²(1 − e²) for a hyperbola; it is b² = a²(e² − 1).",
    "Assuming the major axis is along x without checking which denominator is larger.",
    "Reading the focus of a shifted parabola like y = x² − 4x + 5 from the unshifted form; complete the square first.",
    "Forgetting that focal distance in a hyperbola uses the nearer focus for the given branch.",
    "Mixing the parabola tangent condition c = a/m with the one for x² = 4ay (c = −am²).",
  ],
  examTips: [
    "JEE Main usually has one or two conic questions: eccentricity, latus rectum, tangent condition or a locus.",
    "Parametric coordinates make chord, tangent and normal problems on the parabola much shorter.",
    "Common-tangent and shortest-distance questions mix conics with circles and lines.",
  ],
};

export default notes;
