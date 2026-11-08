import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "If A finishes a job in a days, A's rate is 1/a of the job per day.",
        "Work = rate × time; rates of people working together add up.",
        "Time and efficiency are inversely proportional: twice as efficient means half the time.",
        "If A does a fraction f of the work in d days, the whole work takes d/f days.",
      ],
    },
    {
      heading: "LCM (total work) method",
      points: [
        "Step 1: take total work = LCM of the individual days.",
        "Step 2: each person's units per day = total ÷ their days.",
        "Step 3: add (or subtract) daily units, then divide total work by the result.",
        "Example: A 10 days, B 15 days → work 30 units, A 3/day, B 2/day, together 30 ÷ 5 = 6 days.",
      ],
    },
    {
      heading: "Standard results",
      points: [
        "A and B together: ab/(a + b) days.",
        "A, B, C together: abc/(ab + bc + ca) days.",
        "A + B take x days and A alone a days ⇒ B alone = ax/(a − x) days.",
        "Pairs: if A+B, B+C, C+A take given days, add the three rates and halve to get A+B+C.",
      ],
    },
    {
      heading: "Men, women and wages",
      points: [
        "M₁D₁H₁/W₁ = M₂D₂H₂/W₂ (men × days × hours per work).",
        "'10 men or 15 women' ⇒ 1 man = 1.5 women; convert everyone to one unit.",
        "Two equations like 12m + 16b in 5 days and 13m + 24b in 4 days: equate total work to find m : b.",
        "Wages are shared in the ratio of work done (efficiency × days worked), not in the ratio of days alone.",
      ],
    },
    {
      heading: "People leaving and pipes",
      points: [
        "Someone leaves x days before the end: count backwards from the finish or count their days worked.",
        "Work done by all = sum of (each rate × days that person actually worked).",
        "Pipes: inlets add, outlets subtract; net rate = Σ(1/inlet) − Σ(1/outlet).",
        "A leak that empties in L hours turns a fill time f into fL/(L − f).",
      ],
    },
  ],
  formulas: [
    "Together: ab/(a + b)",
    "Three together: abc/(ab + bc + ca)",
    "M₁D₁H₁/W₁ = M₂D₂H₂/W₂",
    "Net pipe rate = 1/a + 1/b − 1/c",
    "With leak: fL/(L − f)",
  ],
  traps: [
    "Do not add days; add rates (1/a + 1/b).",
    "Outlet pipes and leaks carry a minus sign in the net rate.",
    "When someone leaves early, the others still work for the full time.",
    "Wages follow work done, so a faster worker for fewer days may still earn more.",
  ],
  examTips: [
    "Regular in SSC, bank and placement aptitude tests; pipes and cisterns is the same topic.",
    "Look for: combined work, men–women equivalence, people leaving mid-way, wage sharing.",
    "The LCM method avoids fractions and is quickest under time pressure.",
  ],
};

export default notes;
