import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core calculations",
      points: [
        "Percentage change = (new − old)/old × 100; the base is always the earlier or reference value",
        "'A is what % of B' = A/B × 100; 'A is what % more than B' = (A − B)/B × 100",
        "Average = sum of values ÷ number of values; for 'average annual', divide by the count of years listed",
        "Ratio questions: find each total first, then simplify only at the end",
        "Missing value from an average: missing = (average × count) − sum of known values",
      ],
    },
    {
      heading: "Pie charts",
      points: [
        "Central angle = (part/total) × 360°; 1% of the whole = 3.6°",
        "Amount = (angle/360°) × total, or (percentage/100) × total",
        "Difference between two sectors: subtract angles or percentages first, then convert once",
        "Two pie charts with different totals cannot be compared by angle alone; convert to actual values",
      ],
    },
    {
      heading: "Tables and bar graphs",
      points: [
        "Highest percentage growth is not always the highest absolute growth; compute both when asked",
        "Profit = revenue − expenditure; profit % on expenditure = profit/expenditure × 100",
        "Profit as a % of sales: profit = sales × rate; compare actual profits, not the rates",
        "Male/female ratio data: split each department as (ratio part/sum of parts) × total",
        "Trade balance: exports − imports; surplus if positive, deficit if negative",
      ],
    },
    {
      heading: "Combined and weighted figures",
      points: [
        "Weighted average = Σ(count × average) ÷ Σ count, never the plain mean of averages",
        "Combined percentage (e.g. female % of all colleges) = total females ÷ total students × 100",
        "Successive yearly changes multiply: P × (1 + r₁/100)(1 + r₂/100)…; a fall uses (1 − r/100)",
        "Pass percentage = passed/appeared × 100; compare years by percentage, not by count",
        "Percentage points vs per cent: literacy rising from 60% to 72% is 12 points but a 20% rise in the rate",
      ],
    },
    {
      heading: "Speed and approximation",
      points: [
        "Use fraction equivalents: 1/8 = 12.5%, 1/6 ≈ 16.67%, 1/12 ≈ 8.33%, 3/8 = 37.5%",
        "For 'which is highest', compare ratios by cross-multiplication instead of finding each percentage",
        "Round only when options are far apart; with close options work exactly",
      ],
    },
  ],
  formulas: [
    "% change = (new − old)/old × 100",
    "Central angle = part/total × 360°",
    "Weighted average = Σ(nᵢ × aᵢ)/Σnᵢ",
    "Successive change: a + b + ab/100",
    "Literate population = population × literacy rate",
  ],
  traps: [
    "Dividing by the new value when finding percentage change",
    "Averaging growth rates of different groups instead of using their totals",
    "Confusing percentage points with percentage change",
    "Using a pie angle as if it were a percentage (90° is 25%, not 90%)",
    "Answering a 'decrease' question with the absolute fall when the percentage fall is asked",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk mains carry DI sets of five questions on one table, bar graph, pie or caselet; read all five before calculating",
    "SSC CGL Tier 2 and CHSL use single-table DI with percentage change, ratio and average",
    "Caselet DI (data in a paragraph) is common in SBI PO mains; convert it to a table first",
  ],
};

export default notes;
