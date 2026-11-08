import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Percent means 'per hundred': x% = x/100.",
        "x% of N = x × N / 100; x% of y = y% of x (e.g. 8% of 50 = 50% of 8 = 4).",
        "A as a % of B = (A ÷ B) × 100.",
        "Percentage change = (new − old) ÷ old × 100; always divide by the original value.",
      ],
    },
    {
      heading: "Fraction equivalents",
      points: [
        "1/2 = 50%, 1/3 = 33⅓%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16⅔%.",
        "1/7 ≈ 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 ≈ 9.09%, 1/12 = 8⅓%.",
        "Convert a % change to a fraction: +25% means new : old = 5 : 4.",
      ],
    },
    {
      heading: "Successive and comparative change",
      points: [
        "Two successive changes a% and b%: net = a + b + ab/100 (use minus sign for a fall).",
        "Rise x% then fall x% (either order): net loss of x²/100 %.",
        "If A is x% more than B, B is less than A by x/(100 + x) × 100 %.",
        "If A is x% less than B, B is more than A by x/(100 − x) × 100 %.",
        "Chain comparisons by multiplying factors: A = 1.2B and B = 0.75C gives A = 0.9C, so A is 90% of C.",
      ],
    },
    {
      heading: "Price, consumption and population",
      points: [
        "Expenditure = price × consumption; if price rises r%, cut consumption by r/(100 + r) × 100 % to keep spending the same.",
        "If price falls r%, consumption can rise by r/(100 − r) × 100 %.",
        "Price fall lets you buy more: reduced price = (r% of money) ÷ extra quantity.",
        "Population after n years at r% growth: P(1 + r/100)ⁿ; n years ago: P ÷ (1 + r/100)ⁿ.",
        "Depreciation at r%: value after n years = V(1 − r/100)ⁿ.",
      ],
    },
    {
      heading: "Elections, exams and sets",
      points: [
        "Two-candidate election: winning margin % = winner% − loser%; votes margin ÷ that % gives total valid votes.",
        "Account for invalid votes first if given: valid = total × (100 − invalid%)/100.",
        "Pass/fail in two subjects: passed in both = pass₁ + pass₂ − (100 − failed in both), all in %.",
        "Marks problems: difference in % of maximum marks = difference in actual marks.",
      ],
    },
  ],
  formulas: [
    "Successive change: a + b + ab/100",
    "Equal rise and fall: −x²/100 %",
    "Consumption cut for constant spend: r/(100 + r) × 100",
    "Growth: P(1 + r/100)ⁿ; decay: P(1 − r/100)ⁿ",
    "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
  ],
  traps: [
    "A 20% rise followed by a 20% fall does not return to the start; it is a 4% net fall.",
    "'A is 25% more than B' does not mean 'B is 25% less than A' (it is 20% less).",
    "Percentage change uses the original value as the base, not the new one.",
    "In elections, check whether percentages are of total votes or valid votes.",
    "Percentage points differ from percent: 10% to 12% is a 2-point rise but a 20% rise.",
  ],
  examTips: [
    "Very high weightage in SSC, banking and railway exams; also the base for profit, interest and DI questions.",
    "Common forms: price–consumption, successive change, elections, pass/fail, population growth.",
    "Memorise fraction equivalents up to 1/12 to turn most questions into mental arithmetic.",
  ],
};

export default notes;
