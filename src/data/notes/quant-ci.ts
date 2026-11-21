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
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "चक्रवृद्धि ब्याज में प्रत्येक अवधि का ब्याज मूलधन में जुड़ जाता है, इसलिए ब्याज पर भी ब्याज लगता है।",
          "मिश्रधन A = P(1 + R/100)ⁿ; CI = A − P।",
          "1 वर्ष (वार्षिक संयोजन) के लिए CI = SI।",
          "क्रमिक वर्षों में भिन्न दरें: A = P(1 + R₁/100)(1 + R₂/100)…",
        ],
      },
      {
        heading: "संयोजन की आवृत्ति",
        points: [
          "अर्धवार्षिक: प्रति अवधि दर R/2, अवधियाँ 2n।",
          "त्रैमासिक: प्रति अवधि दर R/4, अवधियाँ 4n।",
          "वार्षिक संयोजन में भिन्नात्मक वर्ष (जैसे 1½ वर्ष): A = P(1 + R/100)(1 + R/200)।",
          "अधिक बार संयोजन करने पर मिश्रधन सदैव थोड़ा अधिक मिलता है।",
        ],
      },
      {
        heading: "CI बनाम SI",
        points: [
          "2 वर्ष: CI − SI = P(R/100)²।",
          "3 वर्ष: CI − SI = P(R/100)²(3 + R/100)।",
          "2 वर्ष के लिए CI और SI का अनुपात = (200 + R) : 200।",
          "2 वर्ष के CI और SI दिए हों: R = 2(CI − SI)/SI × 100।",
        ],
      },
      {
        heading: "वृद्धि के गुणज",
        points: [
          "यदि कोई राशि n वर्ष में k गुनी हो जाए, तो m × n वर्ष में kᵐ गुनी हो जाती है (5 में दोगुनी → 15 में 8 गुनी)।",
          "क्रमागत वर्षों में मिश्रधन A₁ और A₂: दर = (A₂ − A₁)/A₁ × 100।",
          "n और n + m वर्ष बाद मिश्रधन: (1 + R/100)ᵐ = A₂/A₁।",
          "जनसंख्या वृद्धि और मूल्यह्रास भी इसी विचार पर चलते हैं: P(1 ± r/100)ⁿ।",
        ],
      },
      {
        heading: "उपयोगी गुणक",
        points: [
          "10%: 1.1, 1.21, 1.331, 1.4641।",
          "20%: 1.2, 1.44, 1.728, 2.0736।",
          "5%: 1.05, 1.1025, 1.157625।",
          "R% पर प्रभावी 2-वर्षीय दर = 2R + R²/100 (10% → 21%, 20% → 44%)।",
        ],
      },
      {
        heading: "किस्तें",
        points: [
          "R% पर n वर्षों में P चुकाने वाली समान वार्षिक किस्त x: P = x/(1 + r) + x/(1 + r)² + … + x/(1 + r)ⁿ, जहाँ r = R/100।",
          "जोड़ने से पहले प्रत्येक किस्त को आज के मूल्य (वर्तमान मूल्य) पर लाया जाता है।",
        ],
      },
    ],
    formulas: [
      "A = P(1 + R/100)ⁿ",
      "2-वर्षीय CI − SI = P(R/100)²",
      "3-वर्षीय CI − SI = P(R/100)²(3 + R/100)",
      "अर्धवार्षिक: P(1 + R/200)²ⁿ; त्रैमासिक: P(1 + R/400)⁴ⁿ",
      "प्रभावी 2-वर्षीय दर = 2R + R²/100",
    ],
    traps: [
      "CI = A − P होता है; कई विकल्पों में ब्याज की जगह मिश्रधन दिया होता है।",
      "अर्धवार्षिक संयोजन में दर आधी और अवधियाँ दोगुनी करें; केवल एक को न बदलें।",
      "वृद्धि के गुणज गुणा होते हैं (2 → 4 → 8), जुड़ते नहीं (2 → 3 → 4)।",
      "वार्षिक संयोजन में 1½ वर्ष के लिए अंतिम आधे वर्ष में R/2 एक बार लगता है, √(1 + R/100) नहीं।",
    ],
    examTips: [
      "SI के साथ SSC, बैंक PO/क्लर्क और बीमा परीक्षाओं में आता है, प्रायः 1–2 मध्यम प्रश्न।",
      "पसंदीदा प्रश्न: CI − SI अंतर, दोगुना होने का समय, अर्धवार्षिक या त्रैमासिक संयोजन, बदलती दरें।",
      "लंबे गुणन से बचने के लिए 10% और 20% की गुणक तालिकाएँ याद रखें।",
    ],
  },
};

export default notes;
