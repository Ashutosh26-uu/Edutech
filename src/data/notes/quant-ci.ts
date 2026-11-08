import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Compound interest adds each period's interest to the principal, so interest earns interest.",
        "Amount A = P(1 + R/100)ⁿ; CI = A − P.",
        "For 1 year (compounded annually) CI = SI.",
        "Different rates in successive years: A = P(1 + R₁/100)(1 + R₂/100)…",
      ],
    },
    {
      heading: "Compounding frequency",
      points: [
        "Half-yearly: rate R/2 per period, periods 2n.",
        "Quarterly: rate R/4 per period, periods 4n.",
        "Fractional years compounded annually (e.g. 1½ years): A = P(1 + R/100)(1 + R/200).",
        "More frequent compounding always gives a slightly larger amount.",
      ],
    },
    {
      heading: "CI vs SI",
      points: [
        "2 years: CI − SI = P(R/100)².",
        "3 years: CI − SI = P(R/100)²(3 + R/100).",
        "Ratio of CI to SI for 2 years = (200 + R) : 200.",
        "Given CI and SI for 2 years: R = 2(CI − SI)/SI × 100.",
      ],
    },
    {
      heading: "Growth multiples",
      points: [
        "If a sum becomes k times in n years, it becomes kᵐ times in m × n years (doubles in 5 → 8 times in 15).",
        "Amounts A₁ and A₂ in consecutive years: rate = (A₂ − A₁)/A₁ × 100.",
        "Amounts after n and n + m years: (1 + R/100)ᵐ = A₂/A₁.",
        "Same idea runs population growth and depreciation: P(1 ± r/100)ⁿ.",
      ],
    },
    {
      heading: "Handy multipliers",
      points: [
        "10%: 1.1, 1.21, 1.331, 1.4641.",
        "20%: 1.2, 1.44, 1.728, 2.0736.",
        "5%: 1.05, 1.1025, 1.157625.",
        "Effective 2-year rate at R% = 2R + R²/100 (10% → 21%, 20% → 44%).",
      ],
    },
    {
      heading: "Instalments",
      points: [
        "Equal annual instalment x repaying P over n years at R%: P = x/(1 + r) + x/(1 + r)² + … + x/(1 + r)ⁿ, where r = R/100.",
        "Each instalment is discounted back to today (present value) before adding.",
      ],
    },
  ],
  formulas: [
    "A = P(1 + R/100)ⁿ",
    "2-year CI − SI = P(R/100)²",
    "3-year CI − SI = P(R/100)²(3 + R/100)",
    "Half-yearly: P(1 + R/200)²ⁿ; quarterly: P(1 + R/400)⁴ⁿ",
    "Effective 2-year rate = 2R + R²/100",
  ],
  traps: [
    "CI is A − P; many options list the amount instead of the interest.",
    "For half-yearly compounding halve the rate and double the periods; do not change only one.",
    "Growth multiples multiply (2 → 4 → 8), they do not add (2 → 3 → 4).",
    "For 1½ years compounded annually, the last half-year uses R/2 once, not √(1 + R/100).",
  ],
  examTips: [
    "Comes with SI in SSC, bank PO/clerk and insurance exams, usually 1–2 moderate questions.",
    "Favourites: CI − SI difference, doubling time, half-yearly or quarterly compounding, varying rates.",
    "Memorise 10% and 20% multiplier tables to avoid long multiplication.",
  ],
};

export default notes;
