import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Marketing concepts and STP",
      points: [
        "Orientations in order: production (cheap, available), product (best quality), selling (push hard), marketing (find needs first), societal/holistic (needs plus long-term welfare and all stakeholders)",
        "Marketing myopia: defining the business by the product (we sell drills) instead of the need (people want holes)",
        "Segmentation bases: geographic, demographic, psychographic (lifestyle, values), behavioural (occasion, benefit sought, usage rate, loyalty)",
        "A useful segment is measurable, substantial, accessible, differentiable and actionable",
        "Targeting: undifferentiated (one offer), differentiated (separate offers per segment), concentrated/niche (one segment), micro/local/individual",
        "Positioning statement: for [target], [brand] is the [frame of reference] that [point of difference] because [reason to believe]; points of parity neutralise, points of difference win",
      ],
    },
    {
      heading: "Consumer behaviour",
      points: [
        "Buying process: need recognition → information search → evaluation of alternatives → purchase decision → post-purchase behaviour",
        "High involvement + big brand differences = complex buying; high involvement + few differences = dissonance-reducing; low involvement + few differences = habitual; low involvement + big differences = variety-seeking",
        "Cognitive dissonance is post-purchase doubt; reassurance, warranties and follow-up calls reduce it",
        "Between purchase intention and decision sit the attitudes of others and unexpected situational factors",
        "Maslow in marketing: match the appeal to the need being served (safety → insurance, esteem → luxury badges, belonging → group-oriented messages)",
      ],
    },
    {
      heading: "Product, PLC, diffusion and branding",
      points: [
        "Product levels: core benefit, basic/actual product, expected, augmented, potential",
        "PLC: introduction (losses, awareness), growth (rising profit, new entrants), maturity (peak sales, price competition), decline (harvest, drop or revive)",
        "Diffusion of innovation: innovators 2.5%, early adopters 13.5%, early majority 34%, late majority 34%, laggards 16%; adoption speeds up with relative advantage, compatibility, trialability and observability, and slows with complexity",
        "Ansoff: market penetration, market development, product development, diversification (riskiest)",
        "Brand equity (customer-based): the differential effect of brand knowledge on response; a line extension keeps the category, a brand extension enters a new category",
        "Brand architecture: branded house (one master brand), house of brands (separate brands), endorsed brands, sub-brands",
      ],
    },
    {
      heading: "Pricing and channel arithmetic",
      points: [
        "Markup on cost = (P − C)/C; margin on price = (P − C)/P; margin = markup/(1 + markup), markup = margin/(1 − margin)",
        "Channel chain: retailer price = MRP; distributor price = MRP × (1 − retailer margin); and so on back to the factory",
        "Price elasticity = %Δ quantity / %Δ price; if |E| > 1 a price cut raises revenue, if |E| < 1 it lowers revenue",
        "Skimming suits inelastic early buyers, patents and capacity limits; penetration suits elastic markets, scale economies and network effects",
        "Break-even units = fixed cost / (price − variable cost per unit); contribution margin ratio = (P − V)/P",
        "Psychological pricing: charm prices (₹499), prestige round prices, reference prices, decoy options",
      ],
    },
    {
      heading: "Promotion, sales and customer metrics",
      points: [
        "Push strategy uses trade promotions and sales force toward the channel; pull strategy uses consumer advertising and promotions to create demand",
        "IMC: all tools carry one consistent message; AIDA = attention, interest, desire, action",
        "Funnel: final conversions = leads × product of stage conversion rates; required leads = target ÷ overall conversion",
        "CAC = sales and marketing spend ÷ new customers; LTV (simple) = average margin per period ÷ churn rate per period",
        "Retention rate = (customers at end − new customers) ÷ customers at start; churn = 1 − retention",
        "Territory design aims for balanced workload and potential; quota types are volume, profit, activity and combination",
      ],
    },
    {
      heading: "Digital marketing and research",
      points: [
        "CTR = clicks ÷ impressions; CPC = spend ÷ clicks; CPM = spend ÷ impressions × 1,000; conversion rate = conversions ÷ clicks (or visits)",
        "CPA = spend ÷ conversions = CPC ÷ conversion rate; ROAS = revenue ÷ ad spend; break-even ROAS = 1 ÷ gross margin",
        "NPS = % promoters (9–10) − % detractors (0–6); passives (7–8) count only in the denominator",
        "Probability samples: simple random, systematic, stratified, cluster; non-probability: convenience, judgement, quota, snowball",
        "Scales: nominal (labels), ordinal (rank), interval (equal gaps, no true zero, e.g. Likert treated as interval), ratio (true zero)",
      ],
    },
    {
      heading: "Services and rural marketing",
      points: [
        "Service characteristics: intangibility, inseparability, variability (heterogeneity), perishability",
        "7P adds people, process, physical evidence to product, price, place, promotion",
        "Gaps model: 1 knowledge (expectations vs management perception), 2 standards/design, 3 delivery/performance, 4 communication; Gap 5 is customer expected vs perceived service",
        "SERVQUAL dimensions: reliability, assurance, tangibles, empathy, responsiveness (RATER)",
        "Rural 4A framework: availability, affordability, acceptability, awareness; small packs (sachets) solve affordability and low cash flow",
      ],
    },
  ],
  formulas: [
    "Margin = markup ÷ (1 + markup); markup = margin ÷ (1 − margin)",
    "Break-even units = fixed cost ÷ (price − variable cost)",
    "LTV ≈ (ARPU × gross margin) ÷ monthly churn; LTV:CAC of about 3:1 is a common health benchmark",
    "ROAS = revenue ÷ ad spend; CPA = CPC ÷ conversion rate; CPM = spend × 1000 ÷ impressions",
    "NPS = %promoters − %detractors (range −100 to +100)",
  ],
  traps: [
    "Do not add channel margins straight up: each member's margin is on its own selling price",
    "ROAS of 3 does not mean profit; at a 30% gross margin it is still a loss before other costs",
    "Successive percentage drops in a funnel multiply, they do not subtract",
    "A Likert or NPS question is not a ratio scale; you cannot say one score is 'twice' another",
  ],
};

export default notes;
