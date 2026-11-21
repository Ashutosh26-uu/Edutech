import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Simple interest (SI) is charged only on the original principal P, every year the same.",
        "SI = P × R × T / 100, where R = rate % per annum and T = time in years.",
        "Amount A = P + SI = P(1 + RT/100).",
        "Rearranged: P = 100·SI/(RT), R = 100·SI/(PT), T = 100·SI/(PR).",
      ],
    },
    {
      heading: "Time conversions",
      points: [
        "Months: divide by 12 (9 months = 3/4 year).",
        "Days: divide by 365; count dates excluding the day of deposit and including the day of withdrawal (or as the question specifies).",
        "Rate per half-year or quarter: convert to an annual rate or use matching periods.",
      ],
    },
    {
      heading: "Multiple-of-principal rules",
      points: [
        "A sum becomes n times in T years: R = 100(n − 1)/T.",
        "Doubles in T years: R = 100/T.",
        "If it becomes n times in T years, it becomes m times in T × (m − 1)/(n − 1) years.",
        "Sum triples in 20 years ⇒ interest = 2P in 20 years ⇒ 5 times (interest 4P) takes 40 years.",
      ],
    },
    {
      heading: "Two-amount and split problems",
      points: [
        "Amount A₁ after T₁ years and A₂ after T₂ years: yearly SI = (A₂ − A₁)/(T₂ − T₁); P = A₁ − T₁ × yearly SI.",
        "Sum split so that interests are equal: parts are in ratio 1/(R₁T₁) : 1/(R₂T₂).",
        "Parts invested at different rates: total interest = Σ(part × rate)/100 per year; set up one equation.",
        "Borrow at r₁, lend at r₂: gain per year = P(r₂ − r₁)/100.",
      ],
    },
    {
      heading: "Instalments and rate changes",
      points: [
        "Equal annual instalments x for n years at SI: debt = nx + x·R(0 + 1 + … + (n − 1))/100.",
        "Rate changes over periods: SI = P(R₁T₁ + R₂T₂ + …)/100.",
        "Interest rate cut from R₁ to R₂ changes yearly income by P(R₁ − R₂)/100.",
      ],
    },
  ],
  formulas: [
    "SI = PRT/100",
    "A = P(1 + RT/100)",
    "n times in T years: R = 100(n − 1)/T",
    "Equal-interest split: P₁ : P₂ = 1/(R₁T₁) : 1/(R₂T₂)",
    "Instalment: Debt = nx + (xR/100) × n(n − 1)/2",
  ],
  traps: [
    "'Becomes 3 times' means interest is 2P, not 3P.",
    "Time must be in years when R is per annum; convert months and days.",
    "For date-to-date questions count days carefully: Feb 2024 has 29 days (leap year).",
    "In SI the interest each year is the same; do not compound it.",
  ],
  examTips: [
    "Asked in SSC, bank and railway exams, usually 1–2 easy-to-moderate questions, often paired with CI.",
    "Common patterns: amounts after two different times, sum doubling/tripling, splitting a sum, instalments.",
    "Use the 'interest per year' idea to skip formulas in two-amount questions.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "साधारण ब्याज (SI) केवल मूल मूलधन P पर लगता है, प्रत्येक वर्ष समान।",
          "SI = P × R × T / 100, जहाँ R = वार्षिक दर % और T = समय वर्षों में।",
          "मिश्रधन A = P + SI = P(1 + RT/100)।",
          "पुनर्व्यवस्थित रूप: P = 100·SI/(RT), R = 100·SI/(PT), T = 100·SI/(PR)।",
        ],
      },
      {
        heading: "समय का रूपांतरण",
        points: [
          "महीने: 12 से भाग दें (9 महीने = 3/4 वर्ष)।",
          "दिन: 365 से भाग दें; तारीखें गिनते समय जमा करने का दिन छोड़ें और निकासी का दिन जोड़ें (या जैसा प्रश्न में कहा हो)।",
          "अर्धवार्षिक या त्रैमासिक दर: वार्षिक दर में बदलें या मेल खाती अवधियाँ प्रयोग करें।",
        ],
      },
      {
        heading: "मूलधन के गुणज के नियम",
        points: [
          "कोई राशि T वर्ष में n गुनी हो: R = 100(n − 1)/T।",
          "T वर्ष में दोगुनी हो: R = 100/T।",
          "यदि वह T वर्ष में n गुनी हो जाए, तो m गुनी होने में T × (m − 1)/(n − 1) वर्ष लगते हैं।",
          "राशि 20 वर्ष में तिगुनी ⇒ 20 वर्ष में ब्याज = 2P ⇒ 5 गुनी (ब्याज 4P) होने में 40 वर्ष लगेंगे।",
        ],
      },
      {
        heading: "दो मिश्रधन और विभाजन के प्रश्न",
        points: [
          "T₁ वर्ष बाद मिश्रधन A₁ और T₂ वर्ष बाद A₂: वार्षिक SI = (A₂ − A₁)/(T₂ − T₁); P = A₁ − T₁ × वार्षिक SI।",
          "राशि को इस तरह बाँटना कि ब्याज बराबर हों: भाग 1/(R₁T₁) : 1/(R₂T₂) के अनुपात में होते हैं।",
          "भिन्न दरों पर लगाए भाग: प्रति वर्ष कुल ब्याज = Σ(भाग × दर)/100; एक समीकरण बनाएँ।",
          "r₁ पर उधार लें, r₂ पर उधार दें: प्रति वर्ष लाभ = P(r₂ − r₁)/100।",
        ],
      },
      {
        heading: "किस्तें और दर में परिवर्तन",
        points: [
          "SI पर n वर्ष की समान वार्षिक किस्तें x: ऋण = nx + x·R(0 + 1 + … + (n − 1))/100।",
          "अवधियों में दर बदलती है: SI = P(R₁T₁ + R₂T₂ + …)/100।",
          "ब्याज दर R₁ से घटकर R₂ होने पर वार्षिक आय P(R₁ − R₂)/100 बदलती है।",
        ],
      },
    ],
    formulas: [
      "SI = PRT/100",
      "A = P(1 + RT/100)",
      "T वर्ष में n गुना: R = 100(n − 1)/T",
      "समान ब्याज विभाजन: P₁ : P₂ = 1/(R₁T₁) : 1/(R₂T₂)",
      "किस्त: ऋण = nx + (xR/100) × n(n − 1)/2",
    ],
    traps: [
      "'3 गुना हो जाता है' का अर्थ है ब्याज 2P है, 3P नहीं।",
      "R वार्षिक हो तो समय वर्षों में होना चाहिए; महीनों और दिनों को बदलें।",
      "तारीख से तारीख तक के प्रश्नों में दिन ध्यान से गिनें: फ़रवरी 2024 में 29 दिन थे (लीप वर्ष)।",
      "SI में प्रत्येक वर्ष ब्याज समान रहता है; उसे चक्रवृद्धि न करें।",
    ],
    examTips: [
      "SSC, बैंक और रेलवे परीक्षाओं में पूछा जाता है, प्रायः 1–2 आसान से मध्यम प्रश्न, अक्सर CI के साथ।",
      "सामान्य प्रारूप: दो अलग समयों के मिश्रधन, राशि का दोगुना/तिगुना होना, राशि का विभाजन, किस्तें।",
      "दो मिश्रधन वाले प्रश्नों में सूत्र छोड़ने के लिए 'प्रति वर्ष ब्याज' का विचार प्रयोग करें।",
    ],
  },
};

export default notes;
