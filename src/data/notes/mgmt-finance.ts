import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Time value of money",
      points: [
        "FV = PV(1 + r)ⁿ and PV = FV/(1 + r)ⁿ; use the rate and the number of periods per compounding period (10% half-yearly for 3 years = 5% for 6 periods)",
        "Ordinary annuity PV = C[1 − (1 + r)⁻ⁿ]/r and FV = C[(1 + r)ⁿ − 1]/r; an annuity due is worth (1 + r) times as much",
        "Perpetuity = C/r; growing perpetuity = C₁/(r − g) with the NEXT cash flow; growing annuity = C₁/(r − g) × [1 − ((1 + g)/(1 + r))ⁿ]",
        "A deferred annuity or perpetuity is valued one period before its first payment, then discounted back to today",
        "EAR = (1 + i/m)ᵐ − 1; continuous compounding EAR = eⁱ − 1; exact real rate = (1 + nominal)/(1 + inflation) − 1",
        "Loan EMI = P·r(1 + r)ⁿ/[(1 + r)ⁿ − 1]; the outstanding balance at any time is the PV of the remaining EMIs",
      ],
    },
    {
      heading: "Capital budgeting",
      points: [
        "NPV = PV of inflows − outlay; accept if NPV > 0; NPV is additive and assumes reinvestment at the cost of capital",
        "IRR is the rate at which NPV = 0; it assumes reinvestment at the IRR, can be multiple when cash flows change sign more than once, and can misrank projects of different size or timing",
        "MIRR: compound inflows to the end at the reinvestment rate, discount outflows to today at the finance rate, then MIRR = (FV inflows/PV outflows)^(1/n) − 1",
        "PI = PV of inflows / initial outlay; PI > 1 ⇔ NPV > 0; under capital rationing rank divisible projects by PI",
        "Payback ignores the time value of money and cash flows after payback; discounted payback is always longer than simple payback",
        "Crossover (Fisher) rate: the discount rate at which two projects have equal NPV, found as the IRR of the difference in their cash flows",
        "Use incremental after-tax cash flows: include working capital and opportunity costs, exclude sunk costs and financing costs (interest is in the discount rate)",
      ],
    },
    {
      heading: "Cost of capital and capital structure",
      points: [
        "CAPM: Ke = Rf + β(Rm − Rf); Gordon: Ke = D₁/P₀ + g; retained earnings cost ≈ Ke (no flotation cost)",
        "After-tax Kd = YTM × (1 − t); preference capital Kp = Dp/net price (not tax-deductible)",
        "WACC = Σ wᵢkᵢ with market-value weights where available; use it to discount project cash flows of average risk",
        "MM without taxes: firm value and WACC are unaffected by leverage; Ke rises linearly: Ke = Ko + (Ko − Kd)D/E",
        "MM with taxes: V_L = V_U + t·D, so the tax shield makes debt valuable; trade-off theory adds distress costs",
        "Levered/unlevered beta: β_L = β_U[1 + (1 − t)D/E]",
      ],
    },
    {
      heading: "Leverage, EBIT–EPS and dividends",
      points: [
        "DOL = contribution/EBIT = %ΔEBIT/%ΔSales; DFL = EBIT/(EBIT − interest − preference dividend/(1 − t)); DCL = DOL × DFL = contribution/EBT",
        "Operating break-even: fixed costs / contribution per unit; financial break-even: EBIT = interest + preference dividend/(1 − t)",
        "EBIT–EPS indifference point: equate EPS under the two plans, (EBIT − I₁)(1 − t)/N₁ = (EBIT − I₂)(1 − t)/N₂",
        "Walter: P = [D + (r/k)(E − D)]/k; if r > k retain everything, if r < k pay out everything, if r = k payout is irrelevant",
        "Gordon (dividend) model: P = E(1 − b)/(k − br), with growth g = b × r",
        "MM dividend irrelevance: in perfect markets payout does not change firm value; bird-in-hand argues otherwise",
      ],
    },
    {
      heading: "Working capital",
      points: [
        "Operating cycle = inventory days + receivable days; cash conversion cycle = operating cycle − payable days",
        "Inventory days = average inventory/COGS × 365; receivable days = average debtors/credit sales × 365; payable days = average creditors/credit purchases × 365",
        "EOQ = √(2 × annual demand × ordering cost / holding cost per unit per year); at EOQ, total ordering cost = total holding cost",
        "Reorder level = lead-time demand + safety stock",
        "Cost of forgoing a cash discount 'a/b net c' = [a/(100 − a)] × [365/(c − b)]",
        "Relaxing credit policy: compare extra contribution with extra bad debts, collection costs and the cost of funds tied up in extra receivables (often at cost of sales)",
      ],
    },
    {
      heading: "Valuation and risk",
      points: [
        "Bond price = coupon × annuity factor + face value × discount factor at the YTM; price falls when yields rise",
        "Premium bond: coupon > YTM; discount bond: coupon < YTM; current yield = coupon/price",
        "Macaulay duration = weighted average time of cash flows; modified duration = Macaulay/(1 + y); %ΔP ≈ −modified duration × Δy",
        "DDM: P₀ = D₁/(Ke − g); justified P/E = payout/(Ke − g) on next year's earnings; EV = equity value + debt − cash",
        "Portfolio return = weighted average of returns; portfolio variance = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂; portfolio beta = weighted average beta",
        "Sharpe = (Rp − Rf)/σp; Treynor = (Rp − Rf)/βp; Jensen's alpha = Rp − [Rf + βp(Rm − Rf)]",
      ],
    },
    {
      heading: "Markets, derivatives and banking",
      points: [
        "Primary market issues new securities (IPO, FPO, rights, private placement); secondary market trades existing ones",
        "Forward: customised, OTC, settled at maturity; future: standardised, exchange-traded, marked to market daily with margins",
        "Long call payoff = max(S − K, 0) − premium; long put payoff = max(K − S, 0) − premium; writers have the mirror-image payoffs",
        "Put–call parity (European): C + K/(1 + r)ᵀ = P + S",
        "NIM = (interest income − interest expense)/average earning assets; CASA ratio = (current + savings deposits)/total deposits",
        "An asset becomes a non-performing asset when interest or principal is overdue beyond the regulator's stated period; net NPA = gross NPA − provisions",
        "Capital adequacy ratio = eligible capital / risk-weighted assets; Basel's three pillars are minimum capital, supervisory review and market discipline",
      ],
    },
  ],
  formulas: [
    "PV annuity = C[1 − (1 + r)⁻ⁿ]/r | Perpetuity = C/r | Growing perpetuity = C₁/(r − g)",
    "EAR = (1 + i/m)ᵐ − 1 | Real rate = (1 + i)/(1 + π) − 1",
    "Ke = Rf + β(Rm − Rf) | WACC = We·Ke + Wd·Kd(1 − t) + Wp·Kp",
    "DOL = C/EBIT | DFL = EBIT/EBT | DCL = C/EBT",
    "EOQ = √(2AO/C) | CCC = DIO + DSO − DPO",
    "Walter: P = [D + (r/k)(E − D)]/k | Sharpe = (Rp − Rf)/σp",
  ],
  traps: [
    "Using D₀ instead of D₁ in the Gordon model, or forgetting that a deferred annuity is discounted from one period before its first payment",
    "Taking the nominal rate as the effective rate, or using the annual rate with monthly periods",
    "Ranking mutually exclusive projects by IRR when NPV disagrees",
    "Including sunk costs or interest in project cash flows",
    "Forgetting the tax shield on debt but not on preference capital",
    "Mixing book-value and market-value weights in WACC when market values are given",
  ],
  examTips: [
    "Finance analyst, KPO, Big 4 and bank MT tests mix two-step numericals with concept traps; check every option against the common mistake it represents",
    "Write the timeline first: the off-by-one period error is the most frequent wrong option",
    "For indifference points, payback and EOQ, back-substitute the chosen option to confirm",
  ],
};

export default notes;
