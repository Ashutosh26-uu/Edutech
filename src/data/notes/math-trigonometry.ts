import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Identities",
      points: [
        "sin(A ± B) = sin A cos B ± cos A sin B; cos(A ± B) = cos A cos B ∓ sin A sin B.",
        "tan(A + B) = (tan A + tan B)/(1 − tan A tan B); if A + B = 45°, then (1 + tan A)(1 + tan B) = 2.",
        "cos(A + B)cos(A − B) = cos²A − sin²B; sin(A + B)sin(A − B) = sin²A − sin²B.",
        "Sum to product: sin C + sin D = 2 sin[(C + D)/2] cos[(C − D)/2]; cos C + cos D = 2 cos[(C + D)/2] cos[(C − D)/2].",
        "Double angle: sin 2θ = 2 sin θ cos θ = 2tan θ/(1 + tan²θ); cos 2θ = 1 − 2sin²θ = 2cos²θ − 1 = (1 − tan²θ)/(1 + tan²θ).",
        "Triple angle: sin 3θ = 3sin θ − 4sin³θ; cos 3θ = 4cos³θ − 3cos θ; tan 3θ = (3tan θ − tan³θ)/(1 − 3tan²θ).",
        "Cosine chain: cos A cos 2A cos 4A … cos 2ⁿ⁻¹A = sin(2ⁿA)/(2ⁿ sin A); e.g. cos(π/7)cos(2π/7)cos(4π/7) = −1/8.",
      ],
    },
    {
      heading: "Trigonometric equations",
      points: [
        "Reduce to a single function and use the general solution; check that no denominator (tan, sec) becomes undefined.",
        "a sin x + b cos x = c: divide by √(a² + b²) to get sin(x + φ) = c/√(a² + b²); solvable only if |c| ≤ √(a² + b²).",
        "sin x + cos x = 1 on [0, 2π] has three solutions: 0, π/2, 2π.",
        "Squaring both sides can add false roots; substitute back to verify.",
        "For counting solutions in an interval, list n = 0, ±1, ±2 … and keep only values inside.",
      ],
    },
    {
      heading: "Inverse trigonometric functions",
      points: [
        "sin⁻¹(sin x) = x only for x ∈ [−π/2, π/2]; otherwise shift by π or 2π into that range (sin⁻¹(sin 5) = 5 − 2π).",
        "sin⁻¹(−x) = −sin⁻¹x, tan⁻¹(−x) = −tan⁻¹x, but cos⁻¹(−x) = π − cos⁻¹x.",
        "tan⁻¹x + tan⁻¹y = π + tan⁻¹[(x + y)/(1 − xy)] when x, y > 0 and xy > 1.",
        "2tan⁻¹x = sin⁻¹[2x/(1 + x²)] for |x| ≤ 1; tan⁻¹(1/2) + tan⁻¹(1/3) = π/4.",
        "Convert sin⁻¹ to tan⁻¹ using a right triangle: sin⁻¹(4/5) = tan⁻¹(4/3).",
      ],
    },
    {
      heading: "Properties of triangles",
      points: [
        "Projection formula: a = b cos C + c cos B.",
        "Median from A: mₐ = (1/2)√(2b² + 2c² − a²).",
        "Inradius r = Δ/s = (s − a) tan(A/2) = 4R sin(A/2) sin(B/2) sin(C/2).",
        "Half-angle: tan(A/2) = √[(s − b)(s − c)/(s(s − a))].",
        "Heights and distances: angle of elevation is measured up from the horizontal at the observer; draw a figure and use tan in each right triangle.",
      ],
    },
  ],
  formulas: [
    "sin x = sin α ⇒ x = nπ + (−1)ⁿα; cos x = cos α ⇒ x = 2nπ ± α; tan x = tan α ⇒ x = nπ + α",
    "Principal ranges: sin⁻¹ [−π/2, π/2], cos⁻¹ [0, π], tan⁻¹ (−π/2, π/2)",
    "sin⁻¹x + cos⁻¹x = π/2; tan⁻¹x + cot⁻¹x = π/2",
    "a/sin A = b/sin B = c/sin C = 2R; cos A = (b² + c² − a²)/(2bc)",
    "Δ = (1/2)bc sin A = √[s(s − a)(s − b)(s − c)] = abc/(4R)",
    "sin 18° = (√5 − 1)/4; cos 36° = (√5 + 1)/4; sin 15° = (√3 − 1)/(2√2); tan 15° = 2 − √3",
    "sin θ sin(60° − θ) sin(60° + θ) = (sin 3θ)/4; cos θ cos(60° − θ) cos(60° + θ) = (cos 3θ)/4",
    "−√(a² + b²) ≤ a sin x + b cos x ≤ √(a² + b²)",
  ],
  traps: [
    "Writing sin⁻¹(sin x) = x for any x; it holds only in the principal range.",
    "Using tan⁻¹x + tan⁻¹y = tan⁻¹[(x + y)/(1 − xy)] when xy > 1.",
    "Dividing an equation by sin x or cos x and losing the solutions where it is zero.",
    "Counting solutions on an open interval as if endpoints were included (or vice versa).",
    "Mixing degrees and radians in the same calculation.",
  ],
  examTips: [
    "JEE Main tests trigonometric equations (number or sum of solutions in an interval) and inverse-trig simplification almost every year.",
    "Product-of-sines/cosines values like sin 20° sin 40° sin 80° = √3/8 are best done with the 60° ± θ identity.",
    "Triangle questions combine sine/cosine rules with medians, inradius or area; heights-and-distances appears in board exams and occasionally in JEE Main.",
  ],
};

export default notes;
