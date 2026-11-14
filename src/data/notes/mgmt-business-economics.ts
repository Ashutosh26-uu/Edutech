import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Demand, supply and elasticity",
      points: [
        "A change in the good's own price moves along the curve; income, related prices, tastes, expectations and the number of buyers shift it",
        "Equilibrium: set Qd = Qs; a binding price ceiling (below equilibrium) creates a shortage, a binding floor (above equilibrium) a surplus",
        "Price elasticity = %ΔQ/%ΔP; arc (midpoint) method divides changes by the averages of the two values",
        "Point elasticity on a linear demand curve = slope × P/Q: elastic above the midpoint, unit-elastic at it, inelastic below it",
        "Total revenue rises with a price increase only when demand is inelastic and is maximised where |Ed| = 1",
        "Income elasticity: < 0 inferior, 0–1 necessity, > 1 luxury; cross elasticity: > 0 substitutes, < 0 complements",
        "Tax incidence: buyers' share = Es/(Es + |Ed|); deadweight loss = ½ × tax × reduction in quantity",
      ],
    },
    {
      heading: "Consumer surplus, production and costs",
      points: [
        "Consumer surplus = area below demand and above price; producer surplus = area above supply and below price",
        "Law of diminishing marginal returns: with one input fixed, marginal product eventually falls; MC rises when MP falls",
        "AFC falls continuously; AVC, ATC and MC are U-shaped; MC cuts AVC and ATC at their minimum points",
        "Economic profit = revenue − explicit costs − implicit (opportunity) costs; normal profit means zero economic profit",
        "Returns to scale: doubling all inputs more than doubles output = increasing returns (falling long-run average cost)",
        "Break-even quantity = fixed cost / (price − AVC); contribution margin ratio = (P − AVC)/P",
      ],
    },
    {
      heading: "Market structures and pricing",
      points: [
        "Every profit-maximising firm produces where MR = MC; under perfect competition MR = P",
        "Competitive firm: shut down in the short run if P < minimum AVC; exit in the long run if P < minimum ATC",
        "Monopoly: MR = P(1 − 1/|e|), so P = MC/(1 − 1/|e|); a monopolist never operates on the inelastic part of demand",
        "For linear demand P = a − bQ, MR = a − 2bQ (twice as steep)",
        "Lerner index = (P − MC)/P = 1/|e|; third-degree price discrimination charges more where demand is less elastic",
        "Monopolistic competition: zero long-run economic profit with excess capacity; oligopoly: interdependence, kinked demand, cartels",
        "Concentration: HHI = sum of squared market shares (in %); higher means more concentrated",
      ],
    },
    {
      heading: "Game theory",
      points: [
        "Dominant strategy: best whatever the rival does; if both players have one, that pair is the equilibrium",
        "Nash equilibrium: no player can gain by changing strategy alone; a game may have none, one or several in pure strategies",
        "Prisoner's dilemma: defecting is dominant for each, yet mutual cooperation would make both better off — the logic of price wars and cartel cheating",
        "Repeated games make cooperation sustainable through strategies such as tit-for-tat",
        "Sequential games are solved by backward induction; a first mover can gain by committing credibly",
      ],
    },
    {
      heading: "National income and macro policy",
      points: [
        "GDP (expenditure) = C + I + G + (X − M); GNP = GDP + net factor income from abroad; NNP = GNP − depreciation",
        "GDP at factor cost = GDP at market prices − indirect taxes + subsidies; real GDP = nominal GDP / deflator × 100",
        "Simple multiplier = 1/(1 − MPC) = 1/MPS; with tax rate t and import propensity m: 1/[1 − MPC(1 − t) + m]; balanced-budget multiplier = 1",
        "Money multiplier ≈ 1/reserve ratio (simple model); open market purchases, lower policy rates and lower reserve ratios expand money supply",
        "Fiscal deficit = total expenditure − (revenue receipts + non-debt capital receipts); primary deficit = fiscal deficit − interest payments",
        "Inflation: CPI measures consumer prices; demand-pull vs cost-push; real interest rate ≈ nominal − inflation",
        "Balance of payments: current account (trade, services, income, transfers) + capital/financial account + change in reserves = 0",
      ],
    },
    {
      heading: "Strategy frameworks",
      points: [
        "Porter's five forces: rivalry, threat of new entrants, threat of substitutes, buyer power, supplier power",
        "Generic strategies: cost leadership, differentiation, focus (cost focus or differentiation focus); being 'stuck in the middle' is risky",
        "BCG matrix: market growth vs relative market share — stars (high/high), cash cows (low growth, high share), question marks (high growth, low share), dogs (low/low)",
        "Ansoff matrix: market penetration, market development, product development, diversification (riskiest)",
        "Value chain: primary activities (inbound logistics, operations, outbound logistics, marketing and sales, service) plus support activities",
        "McKinsey 7S: hard — strategy, structure, systems; soft — shared values, style, staff, skills",
        "SWOT: strengths and weaknesses are internal, opportunities and threats external",
      ],
    },
    {
      heading: "Guesstimates and business cases",
      points: [
        "State the population, segment it, apply usage rates and frequency, then sanity-check the order of magnitude",
        "Profit = revenue − cost; revenue = price × volume; break the problem into a tree before calculating",
        "Market entry: market size and growth, competition, capabilities, economics (break-even), entry mode, risks",
        "For a falling-profit case, first ask whether revenue or cost changed, then find which segment drove it",
      ],
    },
  ],
  formulas: [
    "Ed = %ΔQ/%ΔP | Arc: (ΔQ/avg Q)/(ΔP/avg P) | Point: (dQ/dP)(P/Q)",
    "MR = P(1 − 1/|e|) | Lerner = (P − MC)/P = 1/|e|",
    "DWL = ½ × tax × ΔQ | Buyers' tax share = Es/(Es + |Ed|)",
    "GDP = C + I + G + (X − M) | GNP = GDP + NFIA | NNP_FC = NNP_MP − indirect taxes + subsidies",
    "Multiplier = 1/(1 − MPC) | With tax and imports: 1/[1 − MPC(1 − t) + m]",
    "Break-even Q = FC/(P − AVC) | HHI = Σ(share %)²",
  ],
  traps: [
    "Using the initial-value base for elasticity when the question asks for arc (midpoint) elasticity",
    "Thinking a price rise always raises revenue — it does so only when demand is inelastic",
    "Confusing a shift of the curve with a movement along it",
    "Producing where P = MC under monopoly instead of MR = MC",
    "Counting intermediate goods or transfer payments in GDP",
    "Labelling a business with high share in a slow-growing market a 'star' instead of a cash cow",
  ],
  examTips: [
    "Big 4, consulting and bank MT tests mix two-step numericals with framework-based mini-cases",
    "For game tables, check each player's best response cell by cell before choosing the Nash equilibrium",
    "In guesstimates, pick the option whose assumptions are internally consistent, not the one with the most precise number",
  ],
};

export default notes;
