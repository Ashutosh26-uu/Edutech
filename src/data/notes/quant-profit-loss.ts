import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "CP = cost price, SP = selling price, MP = marked (list) price.",
        "Profit = SP − CP; Loss = CP − SP.",
        "Profit % and loss % are always on CP unless the question says otherwise.",
        "Discount is always on MP: SP = MP − discount.",
      ],
    },
    {
      heading: "Finding SP or CP",
      points: [
        "SP = CP × (100 + P%)/100; SP = CP × (100 − L%)/100.",
        "CP = SP × 100/(100 + P%) or SP × 100/(100 − L%).",
        "Two SPs for two profit levels: SP₂ = SP₁ × (100 + P₂)/(100 + P₁).",
        "If the difference of two SPs is given, it equals the difference in profit % of CP.",
      ],
    },
    {
      heading: "Quantity-based questions",
      points: [
        "CP of x articles = SP of y articles: profit % = (x − y)/y × 100 (loss if y > x).",
        "Buy a for ₹p, sell b for ₹q: make the quantities equal with LCM, then compare.",
        "Profit on selling n items equals CP (or SP) of m items: profit % = m/n × 100 (on CP) or m/(n − m) × 100 (on SP).",
        "False weight: gain % = (true weight − false weight)/false weight × 100 (800 g for 1 kg gives 25%).",
      ],
    },
    {
      heading: "Discount and mark-up",
      points: [
        "Discount % = discount ÷ MP × 100.",
        "Successive discounts a% and b%: single discount = a + b − ab/100.",
        "Mark up m%, discount d%: net profit % = m − d − md/100.",
        "MP/CP = (100 + P%)/(100 − D%) gives how much above cost to mark.",
        "Buy x get y free: discount % = y/(x + y) × 100.",
      ],
    },
    {
      heading: "Special cases",
      points: [
        "Two items sold at the same SP, one at x% gain and one at x% loss: always a loss of x²/100 %.",
        "Two items with the same CP, one at x% gain and one at x% loss: no profit, no loss.",
        "Overall profit on mixed sales: find total CP and total SP; do not average the percentages.",
      ],
    },
  ],
  formulas: [
    "Profit % = (SP − CP)/CP × 100",
    "SP = CP(100 + P%)/100",
    "Successive discounts: a + b − ab/100",
    "Same SP, x% gain and x% loss: loss = x²/100 %",
    "False weight gain % = error/(true − error) × 100",
  ],
  traps: [
    "Profit % on SP is not the same as on CP; use CP as base by default.",
    "Discounts of 20% and 10% are not 30%; they make 28%.",
    "Retailer buying at a discount on list price: his CP is the discounted price, not the list price.",
    "With 'same SP' the answer is a loss; with 'same CP' it is neither; read which one is given.",
    "Do not average gain percentages for items with different CPs.",
  ],
  examTips: [
    "A favourite in SSC CGL/CHSL, bank PO/clerk and railway papers, often 2–3 questions per set.",
    "Expect dishonest dealer, successive discount, CP-of-x-equals-SP-of-y and mark-up-then-discount types.",
    "Work with multiplying factors (×1.2, ×0.9) instead of full formulas to save time.",
  ],
};

export default notes;
