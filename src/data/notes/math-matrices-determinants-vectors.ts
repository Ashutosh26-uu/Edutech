import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Matrix algebra",
      points: [
        "Product AB exists only if columns of A = rows of B; in general AB ≠ BA.",
        "Symmetric: Aᵀ = A; skew-symmetric: Aᵀ = −A, so every diagonal entry is 0.",
        "Any square matrix = ½(A + Aᵀ) + ½(A − Aᵀ): a symmetric part plus a skew-symmetric part.",
        "Orthogonal: AAᵀ = I, so A⁻¹ = Aᵀ and |A| = ±1.",
      ],
    },
    {
      heading: "Determinants",
      points: [
        "Swapping two rows changes the sign; two equal or proportional rows give 0.",
        "Adding a multiple of one row to another leaves the determinant unchanged.",
        "Skew-symmetric matrix of odd order always has determinant 0.",
        "Area of triangle with vertices (xᵢ, yᵢ) = ½|det of rows (xᵢ, yᵢ, 1)|; zero means collinear.",
      ],
    },
    {
      heading: "Inverse, adjoint and linear systems",
      points: [
        "adj A = transpose of the cofactor matrix; A(adj A) = (adj A)A = |A| I.",
        "A⁻¹ = adj A / |A|, exists only when |A| ≠ 0 (non-singular).",
        "For 2 × 2 rows (a, b), (c, d): A⁻¹ = (1/(ad − bc)) × rows (d, −b), (−c, a).",
        "Cayley–Hamilton: every square matrix satisfies its own characteristic equation |A − λI| = 0; use it to find A⁻¹ or high powers.",
        "AX = B with |A| ≠ 0: unique solution X = A⁻¹B.",
        "|A| = 0 and (adj A)B ≠ O: no solution; |A| = 0 and (adj A)B = O: usually infinitely many (check consistency directly).",
        "Homogeneous AX = O always has the trivial solution; non-trivial solutions iff |A| = 0.",
      ],
    },
    {
      heading: "Vectors",
      points: [
        "a·b = |a||b| cos θ = a₁b₁ + a₂b₂ + a₃b₃; a·b = 0 means perpendicular.",
        "|a × b| = |a||b| sin θ = area of parallelogram on a, b; triangle area is half.",
        "a × b = −b × a; a × b = 0 means parallel.",
        "Projection of a on b = (a·b)/|b|.",
        "[a b c] = a·(b × c) = determinant of components = volume of parallelepiped; 0 means coplanar.",
        "a × (b × c) = (a·c)b − (a·b)c.",
      ],
    },
    {
      heading: "Lines and planes in 3D",
      points: [
        "Line: r = a + λb, or (x − x₁)/l = (y − y₁)/m = (z − z₁)/n with direction ratios l, m, n.",
        "Plane: r·n = d, or ax + by + cz = d with normal (a, b, c); intercept form x/p + y/q + z/r = 1.",
        "Angle between planes = angle between normals; between lines = angle between directions.",
        "Line–plane angle uses sin θ = |b·n|/(|b||n|); line is parallel to plane when b·n = 0.",
        "Distance between parallel planes ax + by + cz = d₁, d₂: |d₁ − d₂|/√(a² + b² + c²).",
        "Two lines are coplanar iff (a₂ − a₁)·(b₁ × b₂) = 0.",
      ],
    },
  ],
  formulas: [
    "|kA| = kⁿ|A| for an n × n matrix A",
    "|adj A| = |A|^(n−1); adj(adj A) = |A|^(n−2) A; |A⁻¹| = 1/|A|",
    "(AB)⁻¹ = B⁻¹A⁻¹; (AB)ᵀ = BᵀAᵀ; (A⁻¹)ᵀ = (Aᵀ)⁻¹",
    "|a × b|² + (a·b)² = |a|²|b|² (Lagrange identity)",
    "Point (x₁, y₁, z₁) to plane ax + by + cz = d: |ax₁ + by₁ + cz₁ − d|/√(a² + b² + c²)",
    "Skew lines: shortest distance = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|",
    "Unit vectors with a + b + c = 0: a·b + b·c + c·a = −3/2",
  ],
  traps: [
    "|kA| is kⁿ|A|, not k|A|: for a 3 × 3 matrix |2A| = 8|A|.",
    "Line–plane angle uses sine of the dot-product formula, not cosine (the normal is perpendicular to the plane).",
    "|A| = 0 does not automatically mean infinitely many solutions; the system may be inconsistent.",
    "(AB)⁻¹ reverses the order; writing A⁻¹B⁻¹ is wrong unless A and B commute.",
  ],
  examTips: [
    "JEE Main asks one or two direct questions on determinant/adjoint properties and one on the consistency of a 3 × 3 system with a parameter.",
    "3D questions usually combine a line and a plane: foot of perpendicular, image of a point, or shortest distance between skew lines.",
    "For powers like A⁵, look for a pattern (A² = I, nilpotent) or use Cayley–Hamilton before multiplying.",
  ],
};

export default notes;
