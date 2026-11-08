import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Straight lines: forms and basics",
      points: [
        "Slope m = tan θ = (y₂ − y₁)/(x₂ − x₁); parallel lines m₁ = m₂, perpendicular m₁m₂ = −1.",
        "Forms: y = mx + c; y − y₁ = m(x − x₁); x/a + y/b = 1 (intercepts); x cos α + y sin α = p (normal).",
        "Section formula: point dividing (x₁, y₁)–(x₂, y₂) in m : n internally is ((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n)).",
        "Area of triangle = (1/2)|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|; zero area means collinear points.",
        "Centroid divides each median 2 : 1; incentre = (ax₁ + bx₂ + cx₃)/(a + b + c), similarly for y.",
        "Points (x₁, y₁) and (x₂, y₂) are on the same side of ax + by + c = 0 if ax₁ + by₁ + c and ax₂ + by₂ + c have the same sign.",
      ],
    },
    {
      heading: "Families, images and pairs of lines",
      points: [
        "L₁ + λL₂ = 0 passes through the intersection of L₁ and L₂; a line with a parameter k passes through a fixed point found by separating the k terms.",
        "Greatest distance of a point P from a family through fixed point A is PA.",
        "Foot of perpendicular from (x₁, y₁): (x − x₁)/a = (y − y₁)/b = −(ax₁ + by₁ + c)/(a² + b²); image uses −2(…) instead.",
        "Angle bisectors: (a₁x + b₁y + c₁)/√(a₁² + b₁²) = ±(a₂x + b₂y + c₂)/√(a₂² + b₂²).",
        "General second degree equation represents a pair of lines iff abc + 2fgh − af² − bg² − ch² = 0.",
        "Pair of parallel lines from a perfect square like (x + 2y)² + (x + 2y) − 6 = 0: factor, then use the parallel-line distance formula.",
      ],
    },
    {
      heading: "Circles",
      points: [
        "(x − h)² + (y − k)² = r²; general form x² + y² + 2gx + 2fy + c = 0 with centre (−g, −f), radius √(g² + f² − c).",
        "Diameter form: (x − x₁)(x − x₂) + (y − y₁)(y − y₂) = 0.",
        "Circle touching the y-axis at (0, k): centre (h, k) with radius |h|; intercept on x-axis = 2√(g² − c).",
        "Line touches a circle iff distance from centre = radius; chord length = 2√(r² − d²).",
        "Tangent at (x₁, y₁) and chord of contact from (x₁, y₁) are both T = 0: xx₁ + yy₁ + g(x + x₁) + f(y + y₁) + c = 0.",
        "Chord with given midpoint (x₁, y₁): T = S₁.",
        "S₁ + λS₂ = 0 is a circle through the intersection of two circles; S + λL = 0 through circle–line intersection.",
        "S₁ bisects the circumference of S₂ when the common chord S₁ − S₂ = 0 passes through the centre of S₂.",
      ],
    },
  ],
  formulas: [
    "Distance of (x₁, y₁) from ax + by + c = 0: |ax₁ + by₁ + c|/√(a² + b²)",
    "Distance between parallel lines ax + by + c₁ = 0 and ax + by + c₂ = 0: |c₁ − c₂|/√(a² + b²)",
    "Angle between lines: tan θ = |(m₁ − m₂)/(1 + m₁m₂)|",
    "Pair ax² + 2hxy + by² = 0: tan θ = 2√(h² − ab)/|a + b|; perpendicular iff a + b = 0",
    "Length of tangent from (x₁, y₁) = √S₁₁",
    "y = mx + c tangent to x² + y² = a² iff c² = a²(1 + m²); tangent y = mx ± a√(1 + m²)",
    "Orthogonal circles: 2g₁g₂ + 2f₁f₂ = c₁ + c₂; radical axis S₁ − S₂ = 0",
    "Common tangents: 4 (d > r₁ + r₂), 3 (d = r₁ + r₂), 2 (|r₁ − r₂| < d < r₁ + r₂), 1 (d = |r₁ − r₂|), 0 (d < |r₁ − r₂|)",
  ],
  traps: [
    "Forgetting to make the coefficients of x² and y² equal to 1 before reading off g, f, c or applying S₁ − S₂.",
    "Using the parallel-line distance formula without first making the x and y coefficients identical.",
    "Taking g = coefficient of x instead of half of it.",
    "Missing the ± in tangent conditions, which gives two tangents for each slope.",
    "Assuming the point lies outside the circle before using √S₁₁ (S₁₁ < 0 means inside).",
  ],
  examTips: [
    "JEE Main asks one or two questions here: fixed point of a family, image of a point, tangent/chord conditions or a circle through given conditions.",
    "Many circle questions are solved fastest by distance from centre = radius instead of solving simultaneous equations.",
    "Locus questions (centre of a circle touching a line and a circle) reduce to a parabola or another conic.",
  ],
};

export default notes;
