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
        "Profit on selling n items equals the CP of m items: profit % = m/n × 100. If it equals the SP of m items: profit % = m/(n − m) × 100 (both on CP).",
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
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "CP = क्रय मूल्य, SP = विक्रय मूल्य, MP = अंकित (सूची) मूल्य।",
          "लाभ = SP − CP; हानि = CP − SP।",
          "लाभ % और हानि % सदैव CP पर होते हैं, जब तक प्रश्न में कुछ और न कहा गया हो।",
          "छूट सदैव MP पर होती है: SP = MP − छूट।",
        ],
      },
      {
        heading: "SP या CP निकालना",
        points: [
          "SP = CP × (100 + P%)/100; SP = CP × (100 − L%)/100।",
          "CP = SP × 100/(100 + P%) या SP × 100/(100 − L%)।",
          "दो लाभ-स्तरों पर दो SP: SP₂ = SP₁ × (100 + P₂)/(100 + P₁)।",
          "यदि दो SP का अंतर दिया हो, तो वह CP के लाभ % के अंतर के बराबर होता है।",
        ],
      },
      {
        heading: "मात्रा आधारित प्रश्न",
        points: [
          "x वस्तुओं का CP = y वस्तुओं का SP: लाभ % = (x − y)/y × 100 (y > x हो तो हानि)।",
          "a वस्तुएँ ₹p में खरीदें, b वस्तुएँ ₹q में बेचें: LCM से मात्राएँ बराबर करें, फिर तुलना करें।",
          "n वस्तुएँ बेचने पर लाभ m वस्तुओं के CP के बराबर हो तो लाभ % = m/n × 100; m वस्तुओं के SP के बराबर हो तो लाभ % = m/(n − m) × 100 (दोनों CP पर)।",
          "झूठा बाट: लाभ % = (सही वज़न − झूठा वज़न)/झूठा वज़न × 100 (1 kg के बदले 800 g देने पर 25%)।",
        ],
      },
      {
        heading: "छूट और अंकित मूल्य वृद्धि",
        points: [
          "छूट % = छूट ÷ MP × 100।",
          "क्रमिक छूट a% और b%: एकल छूट = a + b − ab/100।",
          "m% अंकित मूल्य वृद्धि, d% छूट: शुद्ध लाभ % = m − d − md/100।",
          "MP/CP = (100 + P%)/(100 − D%) से पता चलता है कि लागत से कितना ऊपर अंकित करें।",
          "x खरीदें y मुफ़्त पाएँ: छूट % = y/(x + y) × 100।",
        ],
      },
      {
        heading: "विशेष स्थितियाँ",
        points: [
          "दो वस्तुएँ समान SP पर बेची गईं, एक x% लाभ पर और एक x% हानि पर: सदैव x²/100 % की हानि।",
          "समान CP वाली दो वस्तुएँ, एक x% लाभ पर और एक x% हानि पर: न लाभ, न हानि।",
          "मिश्रित बिक्री पर कुल लाभ: कुल CP और कुल SP निकालें; प्रतिशतों का औसत न लें।",
        ],
      },
    ],
    formulas: [
      "लाभ % = (SP − CP)/CP × 100",
      "SP = CP(100 + P%)/100",
      "क्रमिक छूट: a + b − ab/100",
      "समान SP, x% लाभ और x% हानि: हानि = x²/100 %",
      "झूठे बाट पर लाभ % = त्रुटि/(सही − त्रुटि) × 100",
    ],
    traps: [
      "SP पर लाभ % और CP पर लाभ % एक नहीं हैं; सामान्यतः CP को आधार मानें।",
      "20% और 10% की छूट 30% नहीं होती; यह 28% होती है।",
      "सूची मूल्य पर छूट पर खरीदने वाले खुदरा विक्रेता का CP छूट के बाद का मूल्य होता है, सूची मूल्य नहीं।",
      "'समान SP' में उत्तर हानि होता है; 'समान CP' में न लाभ न हानि; देखें कि कौन-सा दिया है।",
      "भिन्न CP वाली वस्तुओं के लाभ प्रतिशतों का औसत न लें।",
    ],
    examTips: [
      "SSC CGL/CHSL, बैंक PO/क्लर्क और रेलवे पेपरों का पसंदीदा विषय, प्रति सेट प्रायः 2–3 प्रश्न।",
      "बेईमान दुकानदार, क्रमिक छूट, x का CP = y का SP और अंकित मूल्य बढ़ाकर छूट वाले प्रकार अपेक्षित हैं।",
      "समय बचाने के लिए पूरे सूत्रों की जगह गुणकों (×1.2, ×0.9) से काम करें।",
    ],
  },
};

export default notes;
