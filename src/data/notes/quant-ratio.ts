import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Ratio basics",
      points: [
        "a : b = a/b; multiplying or dividing both terms by the same non-zero number keeps the ratio.",
        "Divide N in a : b: shares are Na/(a + b) and Nb/(a + b).",
        "Compound ratio of a : b and c : d is ac : bd.",
        "Duplicate ratio a² : b²; sub-duplicate √a : √b; triplicate a³ : b³.",
        "If x : y = 3 : 4, write x = 3k, y = 4k and substitute into any condition.",
      ],
    },
    {
      heading: "Chaining ratios",
      points: [
        "A : B = 2 : 3 and B : C = 4 : 5: make B equal (12) → A : B : C = 8 : 12 : 15.",
        "Coins problems: multiply count ratio by face value to get value ratio, then split the total value.",
        "Shares with conditions like 2A = 3B = 4C: A : B : C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3.",
      ],
    },
    {
      heading: "Proportion",
      points: [
        "a : b :: c : d means ad = bc (product of extremes = product of means).",
        "Fourth proportional to a, b, c = bc/a; third proportional to a, b = b²/a.",
        "Mean proportional between a and b = √(ab).",
        "Direct proportion: y/x constant; inverse proportion: xy constant.",
      ],
    },
    {
      heading: "Mixtures",
      points: [
        "Keep the ingredient you are not adding or removing fixed, then rescale.",
        "Milk : water 7 : 3 in 30 L means 21 L milk, 9 L water; for 3 : 2 keep milk 21 → water 14, so add 5 L.",
        "Mixing two mixtures: convert each to actual quantities of each ingredient, then add.",
        "Repeated replacement: after n removals of x from V, pure part = V(1 − x/V)ⁿ.",
      ],
    },
    {
      heading: "Alligation",
      points: [
        "Cheaper : dearer = (dearer price − mean) : (mean − cheaper price).",
        "Works for prices, concentrations, speeds or any weighted average of two groups.",
        "Write the two values on top, the mean in the middle, cross-subtract to get the ratio.",
      ],
    },
  ],
  formulas: [
    "Share of A in a : b = N·a/(a + b)",
    "Mean proportional = √(ab)",
    "Alligation: (d − m) : (m − c)",
    "Replacement: final pure = V(1 − x/V)ⁿ",
  ],
  traps: [
    "Before chaining ratios, make the common term equal; do not just write 2 : 3 : 4 : 5.",
    "Adding the same number to both terms changes the ratio; it is not preserved.",
    "In coin problems the count ratio is not the value ratio.",
    "Equal weights of two alloys: convert each to fractions of the same total before adding.",
  ],
  examTips: [
    "Very common in SSC and bank exams; also feeds partnership, ages and DI questions.",
    "Typical: dividing money among three, coin bags, adding water to milk, alloys and alligation.",
    "Use the k-multiplier method for algebraic conditions like x² + y² = 400.",
  ],
};

export default notes;
