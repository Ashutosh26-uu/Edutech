import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Capacity, flow and queues",
      points: [
        "Utilisation = actual output ÷ design capacity; efficiency = actual output ÷ effective capacity; capacity cushion = 1 − utilisation",
        "Throughput of a serial process = capacity of the bottleneck (lowest capacity, after parallel machines, yields and rework are counted)",
        "Little's law L = λW works for any stable system or part of one; inventory turns = 1 ÷ flow time; days of inventory = 365 ÷ (COGS ÷ average inventory)",
        "Takt time = available time ÷ demand; minimum stations = ⌈total work ÷ cycle time⌉ (always round up); efficiency = work ÷ (stations × cycle time); balance delay = 1 − efficiency",
        "OEE = availability × performance × quality = good units × ideal cycle time ÷ planned time",
        "M/M/1 with ρ = λ/μ: L = λ/(μ − λ), W = 1/(μ − λ), Lq = ρ²/(1 − ρ), Wq = Lq/λ, P(idle) = 1 − ρ; waiting cost is charged on L, not Lq, unless the question says queue only",
      ],
    },
    {
      heading: "Forecasting",
      points: [
        "Simple moving average weights the last n periods equally; weighted moving average divides by the sum of the weights",
        "Exponential smoothing: F(t+1) = αA(t) + (1 − α)F(t); a larger α reacts faster but follows noise",
        "Errors: MAD = mean |A − F|, MSE = mean (A − F)², MAPE = mean |A − F| ÷ A × 100, bias = mean (A − F); tracking signal = running sum of errors ÷ MAD",
        "A positive bias (A > F on average) means the method under-forecasts",
      ],
    },
    {
      heading: "Inventory and supply chain",
      points: [
        "EOQ = √(2DS/H); at EOQ annual ordering cost = annual holding cost; if H is a % of price, H = i × C",
        "Total cost = DS/Q + QH/2 (+ DC for purchase cost when quantity discounts are compared; check the price-break quantities too)",
        "Reorder point = d × L + safety stock; safety stock = z × σd × √L when daily demand varies",
        "ABC = by annual consumption value (about 70/20/10 of value); VED = by criticality (vital, essential, desirable); FSN = by movement",
        "Bullwhip effect: order variability grows upstream because of demand-signal processing, order batching, price promotions and shortage gaming; cure with shared POS data, smaller batches, EDLP and VMI",
      ],
    },
    {
      heading: "Quality and lean",
      points: [
        "DPU = defects ÷ units; DPMO = defects ÷ (units × opportunities per unit) × 1,000,000; Six Sigma (with the 1.5σ shift) ≈ 3.4 DPMO",
        "Control limits: X̄-chart X̄ ± A2R̄; R-chart D3R̄ to D4R̄; p-chart p̄ ± 3√(p̄(1 − p̄)/n), with a negative LCL set to 0",
        "Cp = (USL − LSL)/6σ; Cpk = min(USL − μ, μ − LSL)/3σ; Cpk < Cp means the process is off-centre",
        "Pareto chart = vital few causes; fishbone (Ishikawa) = cause categories; DMAIC = define, measure, analyse, improve, control",
        "Seven lean wastes (TIMWOOD): transport, inventory, motion, waiting, overproduction, over-processing, defects; Kaizen = continuous small improvement, poka-yoke = mistake-proofing",
      ],
    },
    {
      heading: "Projects: CPM and PERT",
      points: [
        "Forward pass gives ES/EF (take the max at merges); backward pass gives LS/LF (take the min at bursts)",
        "Total float = LS − ES; free float = earliest ES of successors − EF; the critical path has zero total float and is the longest path",
        "PERT: te = (a + 4m + b)/6, σ² = ((b − a)/6)²; project variance = sum of variances on the critical path; z = (T − Te)/σ",
        "Crash the cheapest critical activity per day first; when paths tie, crash them together and watch for new critical paths",
      ],
    },
    {
      heading: "LP, transportation and decision theory",
      points: [
        "LP optimum lies at a corner point of the feasible region; evaluate the objective at every corner; a slack constraint has a shadow price of zero",
        "Transportation: balance supply and demand with a dummy row or column; a basic solution has m + n − 1 allocations; methods are NWCR, least cost and VAM",
        "Assignment (Hungarian): reduce rows, then columns, and cover the zeros with the fewest lines; for maximisation, subtract every entry from the largest first",
        "EMV = Σ p × payoff; EVPI = expected value with perfect information − best EMV; EVSI ≤ EVPI",
        "Under uncertainty: maximax (optimist), maximin (pessimist), minimax regret (regret = column best − payoff), Hurwicz α × best + (1 − α) × worst, Laplace equal weights",
      ],
    },
    {
      heading: "Business statistics and regression",
      points: [
        "Mean is pulled by outliers, median is not; for right-skewed data mean > median; CV = σ/mean compares variability across scales",
        "Regression ŷ = a + bx: b = change in y per unit x; R² = share of variance in y explained; r = ±√R² with the sign of b",
        "A p-value below α rejects H0; Type I = rejecting a true H0 (probability α); Type II = keeping a false H0 (β); power = 1 − β",
        "Bayes for business: P(A | B) = P(B | A)P(A) ÷ P(B); with a low base rate most positives are false positives",
      ],
    },
    {
      heading: "Spreadsheet and SQL traps",
      points: [
        "VLOOKUP looks only in the first column and returns the first match; with TRUE (approximate) it needs the column sorted and returns the largest value ≤ the key",
        "XLOOKUP and INDEX/MATCH can look left; MATCH(…, 0) is exact; XLOOKUP's if-not-found argument replaces #N/A",
        "SUMIFS(sum range, criteria range 1, criteria 1, …) needs all criteria to hold; COUNTIF with \">50\" is strict",
        "$A$1 is fully fixed, $A1 fixes the column, A$1 fixes the row; copying shifts only the parts without $",
        "SQL runs FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY; WHERE filters rows, HAVING filters groups; COUNT(col) skips NULLs and COUNT(*) does not",
        "LEFT JOIN keeps every left row (NULLs where nothing matches); a join on a non-unique key multiplies rows",
      ],
    },
  ],
};

export default notes;
