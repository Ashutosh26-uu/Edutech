import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Direction cosines and points",
      points: [
        "Direction cosines l, m, n = cos α, cos β, cos γ with l² + m² + n² = 1; direction ratios a, b, c are any proportional triple.",
        "From ratios: l = a/√(a² + b² + c²) and similarly; line through P and Q has ratios Q − P.",
        "Angle between lines: cos θ = |a₁a₂ + b₁b₂ + c₁c₂|/(|b₁||b₂|); perpendicular if the dot product is 0, parallel if ratios are proportional.",
        "Section formula as in 2D; the xy-plane divides PQ in the ratio −z₁ : z₂ (positive means internal).",
        "Plane ax + by + cz + d = 0 divides PQ in ratio −(ax₁ + by₁ + cz₁ + d) : (ax₂ + by₂ + cz₂ + d).",
        "Two points are on the same side of a plane when ax + by + cz + d has the same sign at both.",
      ],
    },
    {
      heading: "Lines",
      points: [
        "Cartesian: (x − x₁)/a = (y − y₁)/b = (z − z₁)/c; vector: r = a + λb.",
        "Rewrite non-standard forms (like (1 − x)/3 or 7y − 14) so x, y, z have coefficient 1 before reading ratios.",
        "Foot of perpendicular from P to a line: take the general point, make (point − P)·b = 0, solve λ; image = 2·foot − P.",
        "Skew lines: SD = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|; coplanar (intersecting) iff (a₂ − a₁)·(b₁ × b₂) = 0.",
        "Parallel lines: distance = |(a₂ − a₁) × b|/|b|.",
        "Line of intersection of two planes has direction n₁ × n₂; find one point by putting z = 0.",
      ],
    },
    {
      heading: "Planes",
      points: [
        "Normal form n·r = d; Cartesian ax + by + cz + d = 0 with normal (a, b, c).",
        "Intercept form x/p + y/q + z/r = 1; if the centroid of the axis-triangle is (α, β, γ), the plane is x/α + y/β + z/γ = 3.",
        "Through three points: the 3 × 3 determinant of differences = 0; containing two lines: normal = b₁ × b₂ (or (a₂ − a₁) × b for parallel lines).",
        "Through a point and perpendicular to two planes: normal n₁ × n₂.",
        "Family through the line of intersection: P₁ + λP₂ = 0; fix λ with the extra condition.",
        "Angle between planes: cos θ = |n₁·n₂|/(|n₁||n₂|); line and plane: sin θ = |b·n|/(|b||n|).",
        "Line parallel to plane: b·n = 0; line lies in plane if also a point of it satisfies the plane.",
        "Perpendicular bisector plane of AB: normal B − A through the midpoint.",
      ],
    },
    {
      heading: "Distances, images, volumes",
      points: [
        "Point to plane: |ax₁ + by₁ + cz₁ + d|/√(a² + b² + c²).",
        "Parallel planes: make x, y, z coefficients equal, then |d₁ − d₂|/√(a² + b² + c²).",
        "Image of (x₁, y₁, z₁) in a plane: (x − x₁)/a = (y − y₁)/b = (z − z₁)/c = −2(ax₁ + by₁ + cz₁ + d)/(a² + b² + c²); use −1 instead of −2 for the foot.",
        "Angle bisectors: P₁/|n₁| = ±P₂/|n₂|; with both d's of the same sign, '+' gives the bisector containing the origin.",
        "Projection of segment PQ on a plane: √(|PQ|² − (PQ·n̂)²); on a line: |PQ·b̂|.",
        "Tetrahedron volume = (1/6)|[AB AC AD]|; height from D = 3V/area(ABC).",
      ],
    },
  ],
  formulas: [
    "l² + m² + n² = 1; cos²α + cos²β + cos²γ = 1; sin²α + sin²β + sin²γ = 2",
    "SD (skew) = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|",
    "d(point, plane) = |ax₁ + by₁ + cz₁ + d|/√(a² + b² + c²)",
  ],
  traps: [
    "Angle between line and plane uses sin, not cos.",
    "Distance between parallel planes is wrong unless coefficients are made identical first.",
    "Direction ratios must be read only after the x, y, z coefficients are 1 in symmetric form.",
    "Coincident lines also give zero shortest distance; check whether a point of one lies on the other.",
  ],
  examTips: [
    "JEE Main usually has two 3D questions: shortest distance, image/foot, or plane through a line of intersection.",
    "Image of a line in a plane: take images of two points of the line (or one point plus the intersection point).",
    "Statement and assertion–reason items test coplanarity and same-side checks.",
  ],
};

export default notes;
