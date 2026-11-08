import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Triangles and quadrilaterals",
      points: [
        "Triangle area = ½ × base × height; Heron's: √(s(s − a)(s − b)(s − c)), s = (a + b + c)/2.",
        "Equilateral triangle of side a: area = (√3/4)a², height = (√3/2)a.",
        "Rectangle: area lb, perimeter 2(l + b), diagonal √(l² + b²).",
        "Square: area a² = d²/2, diagonal a√2.",
        "Rhombus: area = ½d₁d₂; side = √((d₁/2)² + (d₂/2)²).",
        "Parallelogram: base × height; trapezium: ½(sum of parallel sides) × height.",
      ],
    },
    {
      heading: "Circles",
      points: [
        "Area πr², circumference 2πr; semicircle perimeter = πr + 2r.",
        "Sector of angle θ: area = (θ/360)πr², arc length = (θ/360)2πr.",
        "Largest circle in a square of side a has r = a/2; circle around a square has r = a/√2.",
        "Distance covered by a wheel in one revolution = its circumference.",
      ],
    },
    {
      heading: "Cuboid, cube and cylinder",
      points: [
        "Cuboid: V = lbh, TSA = 2(lb + bh + hl), diagonal √(l² + b² + h²).",
        "Cube: V = a³, TSA = 6a², LSA = 4a², diagonal a√3.",
        "Cylinder: V = πr²h, CSA = 2πrh, TSA = 2πr(r + h).",
        "Hollow cylinder: V = π(R² − r²)h.",
      ],
    },
    {
      heading: "Cone, sphere, hemisphere",
      points: [
        "Cone: V = ⅓πr²h, slant l = √(r² + h²), CSA = πrl, TSA = πr(l + r).",
        "Sphere: V = ⁴⁄₃πr³, SA = 4πr².",
        "Hemisphere: V = ⅔πr³, CSA = 2πr², TSA = 3πr².",
        "Cone cut parallel to base at half height: small cone volume = 1/8 of the original.",
      ],
    },
    {
      heading: "Scaling and recasting",
      points: [
        "Lengths × k ⇒ areas × k², volumes × k³.",
        "Radius up x% ⇒ circle area up (2x + x²/100)%.",
        "Melting and recasting keeps volume constant: number of small solids = big volume ÷ small volume.",
        "Solid dropped in water: rise in level × base area of vessel = volume of solid.",
        "Canvas or sheet length = area needed ÷ width of the material.",
      ],
    },
  ],
  formulas: [
    "Equilateral triangle area = (√3/4)a²",
    "Cylinder V = πr²h; cone V = ⅓πr²h; sphere V = ⁴⁄₃πr³",
    "Cone slant l = √(r² + h²)",
    "Hemisphere TSA = 3πr²",
    "1 m³ = 1000 L; 1 hectare = 10,000 m²",
  ],
  traps: [
    "Use the slant height, not vertical height, for a cone's curved surface area.",
    "Hemisphere TSA (solid) is 3πr², but a hollow bowl has only 2πr².",
    "Diameter given? Halve it before using r.",
    "Keep units the same (cm vs m) before computing area or volume.",
    "Doubling the radius makes volume 8 times, not 2 times.",
  ],
  examTips: [
    "Appears in SSC CGL/CHSL, railway and placement tests; 2D in easier papers, 3D solids in tougher ones.",
    "Common: recasting solids, water level rise, tent canvas, inscribed circles, % change in area.",
    "Pick π = 22/7 when the radius is a multiple of 7; options are usually clean numbers.",
  ],
};

export default notes;
