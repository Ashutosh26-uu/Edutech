import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Percent means 'per hundred': x% = x/100.",
        "x% of N = x × N / 100; x% of y = y% of x (e.g. 8% of 50 = 50% of 8 = 4).",
        "A as a % of B = (A ÷ B) × 100.",
        "Percentage change = (new − old) ÷ old × 100; always divide by the original value.",
      ],
    },
    {
      heading: "Fraction equivalents",
      points: [
        "1/2 = 50%, 1/3 = 33⅓%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16⅔%.",
        "1/7 ≈ 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 ≈ 9.09%, 1/12 = 8⅓%.",
        "Convert a % change to a fraction: +25% means new : old = 5 : 4.",
      ],
    },
    {
      heading: "Successive and comparative change",
      points: [
        "Two successive changes a% and b%: net = a + b + ab/100 (use minus sign for a fall).",
        "Rise x% then fall x% (either order): net loss of x²/100 %.",
        "If A is x% more than B, B is less than A by x/(100 + x) × 100 %.",
        "If A is x% less than B, B is more than A by x/(100 − x) × 100 %.",
        "Chain comparisons by multiplying factors: A = 1.2B and B = 0.75C gives A = 0.9C, so A is 90% of C.",
      ],
    },
    {
      heading: "Price, consumption and population",
      points: [
        "Expenditure = price × consumption; if price rises r%, cut consumption by r/(100 + r) × 100 % to keep spending the same.",
        "If price falls r%, consumption can rise by r/(100 − r) × 100 %.",
        "Price fall lets you buy more: reduced price = (r% of money) ÷ extra quantity.",
        "Population after n years at r% growth: P(1 + r/100)ⁿ; n years ago: P ÷ (1 + r/100)ⁿ.",
        "Depreciation at r%: value after n years = V(1 − r/100)ⁿ.",
      ],
    },
    {
      heading: "Elections, exams and sets",
      points: [
        "Two-candidate election: winning margin % = winner% − loser%; votes margin ÷ that % gives total valid votes.",
        "Account for invalid votes first if given: valid = total × (100 − invalid%)/100.",
        "Pass/fail in two subjects: passed in both = pass₁ + pass₂ − (100 − failed in both), all in %.",
        "Marks problems: difference in % of maximum marks = difference in actual marks.",
      ],
    },
  ],
  formulas: [
    "Successive change: a + b + ab/100",
    "Equal rise and fall: −x²/100 %",
    "Consumption cut for constant spend: r/(100 + r) × 100",
    "Growth: P(1 + r/100)ⁿ; decay: P(1 − r/100)ⁿ",
    "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
  ],
  traps: [
    "A 20% rise followed by a 20% fall does not return to the start; it is a 4% net fall.",
    "'A is 25% more than B' does not mean 'B is 25% less than A' (it is 20% less).",
    "Percentage change uses the original value as the base, not the new one.",
    "In elections, check whether percentages are of total votes or valid votes.",
    "Percentage points differ from percent: 10% to 12% is a 2-point rise but a 20% rise.",
  ],
  examTips: [
    "Very high weightage in SSC, banking and railway exams; also the base for profit, interest and DI questions.",
    "Common forms: price–consumption, successive change, elections, pass/fail, population growth.",
    "Memorise fraction equivalents up to 1/12 to turn most questions into mental arithmetic.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "प्रतिशत का अर्थ है 'प्रति सैकड़ा': x% = x/100।",
          "N का x% = x × N / 100; y का x% = x का y% (जैसे 50 का 8% = 8 का 50% = 4)।",
          "A, B का कितने % है = (A ÷ B) × 100।",
          "प्रतिशत परिवर्तन = (नया − पुराना) ÷ पुराना × 100; सदैव मूल मान से भाग दें।",
        ],
      },
      {
        heading: "भिन्न-तुल्यांक",
        points: [
          "1/2 = 50%, 1/3 = 33⅓%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16⅔%।",
          "1/7 ≈ 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 ≈ 9.09%, 1/12 = 8⅓%।",
          "% परिवर्तन को भिन्न में बदलें: +25% का अर्थ है नया : पुराना = 5 : 4।",
        ],
      },
      {
        heading: "क्रमिक और तुलनात्मक परिवर्तन",
        points: [
          "दो क्रमिक परिवर्तन a% और b%: शुद्ध = a + b + ab/100 (गिरावट के लिए ऋण चिह्न लें)।",
          "x% वृद्धि फिर x% गिरावट (किसी भी क्रम में): x²/100 % की शुद्ध हानि।",
          "यदि A, B से x% अधिक है, तो B, A से x/(100 + x) × 100 % कम है।",
          "यदि A, B से x% कम है, तो B, A से x/(100 − x) × 100 % अधिक है।",
          "गुणकों को गुणा करके तुलनाएँ जोड़ें: A = 1.2B और B = 0.75C से A = 0.9C, अतः A, C का 90% है।",
        ],
      },
      {
        heading: "मूल्य, खपत और जनसंख्या",
        points: [
          "व्यय = मूल्य × खपत; यदि मूल्य r% बढ़े, तो व्यय समान रखने के लिए खपत r/(100 + r) × 100 % घटाएँ।",
          "यदि मूल्य r% घटे, तो खपत r/(100 − r) × 100 % बढ़ाई जा सकती है।",
          "मूल्य घटने से अधिक सामान खरीदा जा सकता है: घटा हुआ मूल्य = (धन का r%) ÷ अतिरिक्त मात्रा।",
          "r% वृद्धि पर n वर्ष बाद जनसंख्या: P(1 + r/100)ⁿ; n वर्ष पहले: P ÷ (1 + r/100)ⁿ।",
          "r% मूल्यह्रास पर n वर्ष बाद मूल्य = V(1 − r/100)ⁿ।",
        ],
      },
      {
        heading: "चुनाव, परीक्षा और समुच्चय",
        points: [
          "दो प्रत्याशियों का चुनाव: जीत का अंतर % = विजेता% − पराजित%; मतों के अंतर को उस % से भाग देने पर कुल वैध मत मिलते हैं।",
          "अवैध मत दिए हों तो पहले उन्हें हटाएँ: वैध = कुल × (100 − अवैध%)/100।",
          "दो विषयों में उत्तीर्ण/अनुत्तीर्ण: दोनों में उत्तीर्ण = उत्तीर्ण₁ + उत्तीर्ण₂ − (100 − दोनों में अनुत्तीर्ण), सब % में।",
          "अंकों के प्रश्न: अधिकतम अंकों के % में अंतर = वास्तविक अंकों में अंतर।",
        ],
      },
    ],
    formulas: [
      "क्रमिक परिवर्तन: a + b + ab/100",
      "समान वृद्धि और गिरावट: −x²/100 %",
      "समान व्यय के लिए खपत में कटौती: r/(100 + r) × 100",
      "वृद्धि: P(1 + r/100)ⁿ; ह्रास: P(1 − r/100)ⁿ",
      "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
    ],
    traps: [
      "20% वृद्धि के बाद 20% गिरावट से शुरुआती मान नहीं मिलता; यह 4% की शुद्ध गिरावट है।",
      "'A, B से 25% अधिक है' का अर्थ 'B, A से 25% कम है' नहीं है (यह 20% कम है)।",
      "प्रतिशत परिवर्तन में आधार मूल मान होता है, नया मान नहीं।",
      "चुनावों में देखें कि प्रतिशत कुल मतों का है या वैध मतों का।",
      "प्रतिशत अंक और प्रतिशत भिन्न हैं: 10% से 12% होना 2 अंकों की वृद्धि है पर 20% की वृद्धि।",
    ],
    examTips: [
      "SSC, बैंकिंग और रेलवे परीक्षाओं में बहुत अधिक भारांक; लाभ, ब्याज और DI प्रश्नों का भी आधार।",
      "सामान्य रूप: मूल्य–खपत, क्रमिक परिवर्तन, चुनाव, उत्तीर्ण/अनुत्तीर्ण, जनसंख्या वृद्धि।",
      "1/12 तक के भिन्न-तुल्यांक याद रखें ताकि अधिकांश प्रश्न मानसिक गणित बन जाएँ।",
    ],
  },
};

export default notes;
