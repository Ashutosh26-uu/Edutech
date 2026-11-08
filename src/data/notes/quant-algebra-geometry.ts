import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Algebraic identities",
      points: [
        "(a + b)² − (a − b)² = 4ab; (a + b)² + (a − b)² = 2(a² + b²)",
        "a³ + b³ = (a + b)³ − 3ab(a + b); a³ − b³ = (a − b)³ + 3ab(a − b)",
        "a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)",
        "If a + b + c = 0: a³ + b³ + c³ = 3abc and a²/bc + b²/ca + c²/ab = 3",
        "(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)",
        "Remainder theorem: p(x) ÷ (x − a) leaves remainder p(a)",
      ],
    },
    {
      heading: "x + 1/x shortcuts",
      points: [
        "x + 1/x = k ⇒ x² + 1/x² = k² − 2, x³ + 1/x³ = k³ − 3k, x⁴ + 1/x⁴ = (k² − 2)² − 2",
        "x − 1/x = k ⇒ x² + 1/x² = k² + 2, x³ − 1/x³ = k³ + 3k",
        "x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) − (x + 1/x)",
        "x² − kx + 1 = 0 ⇒ divide by x to get x + 1/x = k",
        "x = 2 + √3 ⇒ 1/x = 2 − √3, so x + 1/x = 4; same idea for √3 + √2",
        "x + 1/x = 1 ⇒ x³ = −1, so x³ + 1/x³ = −2; x + 1/x = 2 ⇒ x = 1",
      ],
    },
    {
      heading: "Triangles and polygons",
      points: [
        "Interior angle sum = (n − 2) × 180°; each exterior angle of a regular polygon = 360°/n",
        "Triangle inequality: sum of any two sides > third side",
        "Incentre I: ∠BIC = 90° + A/2, always inside; circumcentre O: ∠BOC = 2A (acute triangle)",
        "Orthocentre H: ∠BHC = 180° − A; in a right triangle H is at the right-angle vertex and O at the mid-point of the hypotenuse",
        "Centroid divides each median 2 : 1 from the vertex",
        "Angle bisector theorem: BD/DC = AB/AC",
        "Right triangle: circumradius R = hypotenuse/2, inradius r = (a + b − c)/2; median to hypotenuse = half the hypotenuse",
        "Heron: area = √[s(s − a)(s − b)(s − c)], s = half the perimeter; altitude = 2 × area/base",
      ],
    },
    {
      heading: "Circles",
      points: [
        "Angle at the centre = 2 × angle at the circumference on the same arc",
        "Angles in the same segment are equal; angle in a semicircle = 90°",
        "Opposite angles of a cyclic quadrilateral sum to 180°",
        "Tangents from an external point are equal; tangent ⟂ radius at the point of contact",
        "Tangent–secant: PT² = PA × PB; alternate segment: angle between tangent and chord = angle in the alternate segment",
      ],
    },
    {
      heading: "Trigonometry and heights",
      points: [
        "sin²θ + cos²θ = 1; sec²θ − tan²θ = 1; cosec²θ − cot²θ = 1",
        "sec θ − tan θ = 1/(sec θ + tan θ); cosec θ − cot θ = 1/(cosec θ + cot θ)",
        "sin⁶θ + cos⁶θ = 1 − 3sin²θcos²θ; sin⁴θ + cos⁴θ = 1 − 2sin²θcos²θ",
        "Min of a tan²θ + b cot²θ = 2√(ab) (AM ≥ GM)",
        "Values: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2; tan 30° = 1/√3, tan 45° = 1, tan 60° = √3",
        "Heights: tan(angle) = height/horizontal distance; angle of depression from the top equals angle of elevation from below",
      ],
    },
  ],
  formulas: [
    "Area cut by line ax + by = c with axes = c²/(2|ab|)",
    "Median to side a: mₐ = ½√(2b² + 2c² − a²)",
  ],
  traps: [
    "Using k² − 2 for x − 1/x; it becomes k² + 2",
    "Taking ∠BOC = 2A for an obtuse angle A; the formula holds for acute triangles",
    "Measuring height from the ground when the observer's eye level is given",
    "Using PA × AB instead of PA × PB (PB = PA + AB) in the tangent–secant rule",
    "Forgetting the triangle inequality when counting integer-sided triangles",
  ],
  examTips: [
    "SSC CGL Tier 1/2 and CHSL ask several 'advance maths' questions per paper; x + 1/x and triangle centres are the most repeated",
    "Trigonometric value questions often reduce to standard angles; substitute θ = 45° or 30° to check options quickly",
    "CDS and NDA include heights and distances with two angles of depression; draw the figure first",
  ],
};

export default notes;
