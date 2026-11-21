import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Ratio basics",
      points: [
        "a : b = a/b; multiplying or dividing both terms by the same non-zero number keeps the ratio.",
        "Divide N in a : b: shares are Na/(a + b) and Nb/(a + b).",
        "Compound ratio of a : b and c : d is ac : bd.",
        "Duplicate ratio a² : b²; sub-duplicate √a : √b; triplicate a³ : b³.",
        "If x : y = 3 : 4, write x = 3k, y = 4k and substitute into any condition.",
      ],
    },
    {
      heading: "Chaining ratios",
      points: [
        "A : B = 2 : 3 and B : C = 4 : 5: make B equal (12) → A : B : C = 8 : 12 : 15.",
        "Coins problems: multiply count ratio by face value to get value ratio, then split the total value.",
        "Shares with conditions like 2A = 3B = 4C: A : B : C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3.",
      ],
    },
    {
      heading: "Proportion",
      points: [
        "a : b :: c : d means ad = bc (product of extremes = product of means).",
        "Fourth proportional to a, b, c = bc/a; third proportional to a, b = b²/a.",
        "Mean proportional between a and b = √(ab).",
        "Direct proportion: y/x constant; inverse proportion: xy constant.",
      ],
    },
    {
      heading: "Mixtures",
      points: [
        "Keep the ingredient you are not adding or removing fixed, then rescale.",
        "Milk : water 7 : 3 in 30 L means 21 L milk, 9 L water; for 3 : 2 keep milk 21 → water 14, so add 5 L.",
        "Mixing two mixtures: convert each to actual quantities of each ingredient, then add.",
        "Repeated replacement: after n removals of x from V, pure part = V(1 − x/V)ⁿ.",
      ],
    },
    {
      heading: "Alligation",
      points: [
        "Cheaper : dearer = (dearer price − mean) : (mean − cheaper price).",
        "Works for prices, concentrations, speeds or any weighted average of two groups.",
        "Write the two values on top, the mean in the middle, cross-subtract to get the ratio.",
      ],
    },
  ],
  formulas: [
    "Share of A in a : b = N·a/(a + b)",
    "Mean proportional = √(ab)",
    "Alligation: (d − m) : (m − c)",
    "Replacement: final pure = V(1 − x/V)ⁿ",
  ],
  traps: [
    "Before chaining ratios, make the common term equal; do not just write 2 : 3 : 4 : 5.",
    "Adding the same number to both terms changes the ratio; it is not preserved.",
    "In coin problems the count ratio is not the value ratio.",
    "Equal weights of two alloys: convert each to fractions of the same total before adding.",
  ],
  examTips: [
    "Very common in SSC and bank exams; also feeds partnership, ages and DI questions.",
    "Typical: dividing money among three, coin bags, adding water to milk, alloys and alligation.",
    "Use the k-multiplier method for algebraic conditions like x² + y² = 400.",
  ],
  hi: {
    sections: [
      {
        heading: "अनुपात की मूल बातें",
        points: [
          "a : b = a/b; दोनों पदों को एक ही शून्येतर संख्या से गुणा या भाग देने पर अनुपात नहीं बदलता।",
          "N को a : b में बाँटें: हिस्से Na/(a + b) और Nb/(a + b) होते हैं।",
          "a : b और c : d का संयुक्त अनुपात ac : bd होता है।",
          "द्विगुणित अनुपात a² : b²; उपद्विगुणित √a : √b; त्रिगुणित a³ : b³।",
          "यदि x : y = 3 : 4, तो x = 3k, y = 4k लिखें और किसी भी शर्त में रखें।",
        ],
      },
      {
        heading: "अनुपातों को जोड़ना",
        points: [
          "A : B = 2 : 3 और B : C = 4 : 5: B को बराबर (12) करें → A : B : C = 8 : 12 : 15।",
          "सिक्कों के प्रश्न: संख्या के अनुपात को मूल्य से गुणा करके मूल्य का अनुपात निकालें, फिर कुल मूल्य बाँटें।",
          "2A = 3B = 4C जैसी शर्तों वाले हिस्से: A : B : C = 1/2 : 1/3 : 1/4 = 6 : 4 : 3।",
        ],
      },
      {
        heading: "समानुपात",
        points: [
          "a : b :: c : d का अर्थ है ad = bc (अंत्य पदों का गुणनफल = मध्य पदों का गुणनफल)।",
          "a, b, c का चतुर्थानुपाती = bc/a; a, b का तृतीयानुपाती = b²/a।",
          "a और b का मध्यानुपाती = √(ab)।",
          "प्रत्यक्ष समानुपात: y/x अचर; व्युत्क्रम समानुपात: xy अचर।",
        ],
      },
      {
        heading: "मिश्रण",
        points: [
          "जिस घटक को न मिला रहे हैं न निकाल रहे हैं, उसे स्थिर रखें, फिर पैमाना बदलें।",
          "30 L में दूध : पानी 7 : 3 का अर्थ है 21 L दूध, 9 L पानी; 3 : 2 के लिए दूध 21 रखें → पानी 14, अतः 5 L मिलाएँ।",
          "दो मिश्रण मिलाना: प्रत्येक को घटकों की वास्तविक मात्राओं में बदलें, फिर जोड़ें।",
          "बार-बार प्रतिस्थापन: V में से x को n बार निकालने के बाद शुद्ध भाग = V(1 − x/V)ⁿ।",
        ],
      },
      {
        heading: "एलीगेशन (मिश्रण विधि)",
        points: [
          "सस्ता : महँगा = (महँगे का मूल्य − माध्य) : (माध्य − सस्ते का मूल्य)।",
          "मूल्य, सांद्रता, चाल या दो समूहों के किसी भी भारित औसत के लिए काम करता है।",
          "ऊपर दोनों मान, बीच में माध्य लिखें, तिरछा घटाने पर अनुपात मिलता है।",
        ],
      },
    ],
    formulas: [
      "a : b में A का हिस्सा = N·a/(a + b)",
      "मध्यानुपाती = √(ab)",
      "एलीगेशन: (d − m) : (m − c)",
      "प्रतिस्थापन: अंतिम शुद्ध = V(1 − x/V)ⁿ",
    ],
    traps: [
      "अनुपातों को जोड़ने से पहले उभयनिष्ठ पद बराबर करें; सीधे 2 : 3 : 4 : 5 न लिखें।",
      "दोनों पदों में समान संख्या जोड़ने पर अनुपात बदल जाता है; वह सुरक्षित नहीं रहता।",
      "सिक्कों के प्रश्नों में संख्या का अनुपात मूल्य का अनुपात नहीं होता।",
      "दो मिश्रधातुओं के समान भार: जोड़ने से पहले प्रत्येक को समान कुल के भिन्नों में बदलें।",
    ],
    examTips: [
      "SSC और बैंक परीक्षाओं में बहुत आम; साझेदारी, आयु और DI प्रश्नों का भी आधार।",
      "विशिष्ट प्रश्न: तीन में धन बाँटना, सिक्कों के थैले, दूध में पानी मिलाना, मिश्रधातुएँ और एलीगेशन।",
      "x² + y² = 400 जैसी बीजीय शर्तों के लिए k-गुणक विधि अपनाएँ।",
    ],
  },
};

export default notes;
