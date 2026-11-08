import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Simple interest (SI) is charged only on the original principal P, every year the same.",
        "SI = P × R × T / 100, where R = rate % per annum and T = time in years.",
        "Amount A = P + SI = P(1 + RT/100).",
        "Rearranged: P = 100·SI/(RT), R = 100·SI/(PT), T = 100·SI/(PR).",
      ],
    },
    {
      heading: "Time conversions",
      points: [
        "Months: divide by 12 (9 months = 3/4 year).",
        "Days: divide by 365; count dates excluding the day of deposit and including the day of withdrawal (or as the question specifies).",
        "Rate per half-year or quarter: convert to an annual rate or use matching periods.",
      ],
    },
    {
      heading: "Multiple-of-principal rules",
      points: [
        "A sum becomes n times in T years: R = 100(n − 1)/T.",
        "Doubles in T years: R = 100/T.",
        "If it becomes n times in T years, it becomes m times in T × (m − 1)/(n − 1) years.",
        "Sum triples in 20 years ⇒ interest = 2P in 20 years ⇒ 5 times (interest 4P) takes 40 years.",
      ],
    },
    {
      heading: "Two-amount and split problems",
      points: [
        "Amount A₁ after T₁ years and A₂ after T₂ years: yearly SI = (A₂ − A₁)/(T₂ − T₁); P = A₁ − T₁ × yearly SI.",
        "Sum split so that interests are equal: parts are in ratio 1/(R₁T₁) : 1/(R₂T₂).",
        "Parts invested at different rates: total interest = Σ(part × rate)/100 per year; set up one equation.",
        "Borrow at r₁, lend at r₂: gain per year = P(r₂ − r₁)/100.",
      ],
    },
    {
      heading: "Instalments and rate changes",
      points: [
        "Equal annual instalments x for n years at SI: debt = nx + x·R(0 + 1 + … + (n − 1))/100.",
        "Rate changes over periods: SI = P(R₁T₁ + R₂T₂ + …)/100.",
        "Interest rate cut from R₁ to R₂ changes yearly income by P(R₁ − R₂)/100.",
      ],
    },
  ],
  formulas: [
    "SI = PRT/100",
    "A = P(1 + RT/100)",
    "n times in T years: R = 100(n − 1)/T",
    "Equal-interest split: P₁ : P₂ = 1/(R₁T₁) : 1/(R₂T₂)",
    "Instalment: Debt = nx + (xR/100) × n(n − 1)/2",
  ],
  traps: [
    "'Becomes 3 times' means interest is 2P, not 3P.",
    "Time must be in years when R is per annum; convert months and days.",
    "For date-to-date questions count days carefully: Feb 2024 has 29 days (leap year).",
    "In SI the interest each year is the same; do not compound it.",
  ],
  examTips: [
    "Asked in SSC, bank and railway exams, usually 1–2 easy-to-moderate questions, often paired with CI.",
    "Common patterns: amounts after two different times, sum doubling/tripling, splitting a sum, instalments.",
    "Use the 'interest per year' idea to skip formulas in two-amount questions.",
  ],
};

export default notes;
