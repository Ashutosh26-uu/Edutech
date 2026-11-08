import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Domains and principal ranges",
      points: [
        "sin⁻¹x: domain [−1, 1], range [−π/2, π/2].",
        "cos⁻¹x: domain [−1, 1], range [0, π].",
        "tan⁻¹x: domain R, range (−π/2, π/2); cot⁻¹x: domain R, range (0, π).",
        "sec⁻¹x: |x| ≥ 1, range [0, π] − {π/2}; cosec⁻¹x: |x| ≥ 1, range [−π/2, π/2] − {0}.",
        "Odd type: sin⁻¹(−x) = −sin⁻¹x, tan⁻¹(−x) = −tan⁻¹x, cosec⁻¹(−x) = −cosec⁻¹x.",
        "π-minus type: cos⁻¹(−x) = π − cos⁻¹x, cot⁻¹(−x) = π − cot⁻¹x, sec⁻¹(−x) = π − sec⁻¹x.",
      ],
    },
    {
      heading: "f⁻¹(f(x)) outside the principal range",
      points: [
        "sin⁻¹(sin x) = x on [−π/2, π/2], = π − x on [π/2, 3π/2].",
        "cos⁻¹(cos x) = x on [0, π], = 2π − x on [π, 2π].",
        "tan⁻¹(tan x) = x on (−π/2, π/2), = x − π on (π/2, 3π/2).",
        "Method: add or subtract multiples of 2π (π for tan) and use symmetry until the angle lands in the principal range with the same function value.",
        "f(f⁻¹(x)) = x always, but only for x in the domain of f⁻¹.",
      ],
    },
    {
      heading: "Key identities",
      points: [
        "sin⁻¹x + cos⁻¹x = π/2; tan⁻¹x + cot⁻¹x = π/2; sec⁻¹x + cosec⁻¹x = π/2.",
        "tan⁻¹(1/x) = cot⁻¹x for x > 0, = cot⁻¹x − π for x < 0.",
        "tan⁻¹a + tan⁻¹b = tan⁻¹((a + b)/(1 − ab)) if ab < 1; add π if ab > 1 with a, b > 0; = π/2 if ab = 1 (a, b > 0).",
        "tan⁻¹a − tan⁻¹b = tan⁻¹((a − b)/(1 + ab)) for ab > −1.",
        "2tan⁻¹x = sin⁻¹(2x/(1 + x²)) for |x| ≤ 1; = cos⁻¹((1 − x²)/(1 + x²)) for x ≥ 0; = tan⁻¹(2x/(1 − x²)) for |x| < 1.",
        "3sin⁻¹x = sin⁻¹(3x − 4x³) for |x| ≤ 1/2; 3tan⁻¹x = tan⁻¹((3x − x³)/(1 − 3x²)) for |x| < 1/√3.",
        "tan⁻¹1 + tan⁻¹2 + tan⁻¹3 = π; tan⁻¹(1/2) + tan⁻¹(1/3) = π/4; 4tan⁻¹(1/5) − tan⁻¹(1/239) = π/4.",
      ],
    },
    {
      heading: "Conditions and techniques",
      points: [
        "tan⁻¹x + tan⁻¹y + tan⁻¹z = π/2 ⇒ xy + yz + zx = 1; = π ⇒ x + y + z = xyz.",
        "sin⁻¹x + sin⁻¹y + sin⁻¹z = 3π/2 ⇒ x = y = z = 1 (each term at its maximum).",
        "cos⁻¹x + cos⁻¹y + cos⁻¹z = π ⇒ x² + y² + z² + 2xyz = 1.",
        "cos⁻¹x − cos⁻¹(y/2) = α ⇒ 4x² − 4xy cos α + y² = 4 sin²α.",
        "Substitute x = tan θ, sin θ or cos θ to strip radicals, then keep θ in the allowed interval.",
        "Telescoping: write the term as tan⁻¹((b − a)/(1 + ab)) = tan⁻¹b − tan⁻¹a; e.g. 2n/(n⁴ + n² + 2) uses a = n² − n + 1, b = n² + n + 1.",
        "(sin⁻¹x)² + (cos⁻¹x)²: put sin⁻¹x = t, cos⁻¹x = π/2 − t; least value π²/8 at x = 1/√2.",
        "Limits: sin⁻¹x ≈ x + x³/6, tan⁻¹x ≈ x − x³/3 near 0.",
      ],
    },
  ],
  traps: [
    "sin⁻¹(sin x) is not x when x lies outside [−π/2, π/2].",
    "Using the tan⁻¹ sum formula blindly when ab > 1 loses a π.",
    "Always substitute roots back: tan⁻¹2x + tan⁻¹3x = π/4 gives x = 1/6 and x = −1, but −1 makes the sum negative.",
    "Principal value of sec⁻¹(−2) is 2π/3, not −π/3.",
    "sin⁻¹x needs |x| ≤ 1; check the domain before solving any equation.",
  ],
  examTips: [
    "JEE Main asks one ITF question most sessions: principal values, an equation, or a telescoping tan⁻¹ series.",
    "In JEE Advanced, ITF mixes with limits, calculus and sequences.",
    "For 'how many solutions', check domains of every term first; often only one or two x survive.",
  ],
};

export default notes;
