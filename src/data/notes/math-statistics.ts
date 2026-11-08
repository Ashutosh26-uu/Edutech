import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Central tendency",
      points: [
        "Mean x̄ = Σx/n; for grouped data x̄ = A + (Σfd/Σf)·h with d = (x − A)/h (step deviation).",
        "Median (raw): middle value after sorting; for even n, average of the two middle values.",
        "Median (grouped) = l + [(N/2 − cf)/f]·h, l = lower boundary of median class, cf = cumulative frequency before it.",
        "Mode (grouped) = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)]·h.",
        "Empirical (moderate skew): mode = 3 median − 2 mean.",
      ],
    },
    {
      heading: "Dispersion",
      points: [
        "Range = max − min; coefficient of range = (max − min)/(max + min).",
        "Mean deviation about a = Σ|x − a|/n; it is least when a is the median.",
        "Variance σ² = Σ(x − x̄)²/n = Σx²/n − x̄²; SD σ = +√variance.",
        "Σ(x − a)² is least at a = mean, and its minimum is nσ².",
        "Coefficient of variation = (σ/x̄) × 100; lower CV means more consistent.",
        "With deviations d = x − a: mean = a + Σd/n, variance = Σd²/n − (Σd/n)².",
        "Grouped variance: σ² = h²[Σfd²/N − (Σfd/N)²] with step deviations.",
        "For any data, mean deviation about the mean ≤ SD.",
      ],
    },
    {
      heading: "Shifting, scaling and standard results",
      points: [
        "y = ax + b: mean becomes ax̄ + b, SD becomes |a|σ, variance a²σ².",
        "Adding a constant changes the mean, not the variance.",
        "Variance of 1, 2, …, n = (n² − 1)/12; of the first n even numbers (n² − 1)/3; of the first n odd numbers (n² − 1)/3.",
        "n terms of an AP with common difference d: variance = d²(n² − 1)/12.",
        "Two observations a, b: SD = |a − b|/2, so product = mean² − σ².",
        "Including the mean as an extra observation: new variance = nσ²/(n + 1).",
      ],
    },
    {
      heading: "Correction and combining (method)",
      points: [
        "Wrong entry: recover Σx = nx̄ and Σx² = n(σ² + x̄²), replace the wrong value in both, recompute.",
        "Removing observations: subtract them from Σx and Σx², divide by the new n.",
        "Missing a, b: mean gives a + b, variance gives a² + b²; then (a − b)² = 2(a² + b²) − (a + b)².",
        "Combined mean = (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂).",
        "Combined variance = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)]/(n₁ + n₂), dᵢ = x̄ᵢ − combined mean.",
        "Splitting a group: use Σx and Σx² of the whole minus those of the known part.",
      ],
    },
  ],
  formulas: [
    "σ² = Σx²/n − (Σx/n)²",
    "Var(ax + b) = a²·Var(x); SD(ax + b) = |a|·SD(x)",
    "Var(1…n) = (n² − 1)/12; AP: d²(n² − 1)/12",
    "CV = 100σ/x̄; mode = 3 median − 2 mean",
  ],
  traps: [
    "Squaring each observation does not square the variance.",
    "Multiplying by a negative constant makes SD |a|σ, never negative.",
    "Correcting a wrong value must update Σx² as well as Σx.",
    "Mean deviation for the median uses the median of the sorted data; sort first.",
    "In combined variance, dᵢ is measured from the combined mean, not from zero.",
  ],
  examTips: [
    "JEE Main sets one statistics question almost every shift, usually variance with missing or wrong observations.",
    "Look for the standard results (AP variance, two-observation SD) to skip long calculations.",
    "Grouped mean/median and coefficient of variation appear in CBSE and CUET.",
  ],
};

export default notes;
