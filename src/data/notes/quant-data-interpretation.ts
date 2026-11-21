import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core calculations",
      points: [
        "Percentage change = (new − old)/old × 100; the base is always the earlier or reference value",
        "'A is what % of B' = A/B × 100; 'A is what % more than B' = (A − B)/B × 100",
        "Average = sum of values ÷ number of values; for 'average annual', divide by the count of years listed",
        "Ratio questions: find each total first, then simplify only at the end",
        "Missing value from an average: missing = (average × count) − sum of known values",
      ],
    },
    {
      heading: "Pie charts",
      points: [
        "Central angle = (part/total) × 360°; 1% of the whole = 3.6°",
        "Amount = (angle/360°) × total, or (percentage/100) × total",
        "Difference between two sectors: subtract angles or percentages first, then convert once",
        "Two pie charts with different totals cannot be compared by angle alone; convert to actual values",
      ],
    },
    {
      heading: "Tables and bar graphs",
      points: [
        "Highest percentage growth is not always the highest absolute growth; compute both when asked",
        "Profit = revenue − expenditure; profit % on expenditure = profit/expenditure × 100",
        "Profit as a % of sales: profit = sales × rate; compare actual profits, not the rates",
        "Male/female ratio data: split each department as (ratio part/sum of parts) × total",
        "Trade balance: exports − imports; surplus if positive, deficit if negative",
      ],
    },
    {
      heading: "Combined and weighted figures",
      points: [
        "Weighted average = Σ(count × average) ÷ Σ count, never the plain mean of averages",
        "Combined percentage (e.g. female % of all colleges) = total females ÷ total students × 100",
        "Successive yearly changes multiply: P × (1 + r₁/100)(1 + r₂/100)…; a fall uses (1 − r/100)",
        "Pass percentage = passed/appeared × 100; compare years by percentage, not by count",
        "Percentage points vs per cent: literacy rising from 60% to 72% is 12 points but a 20% rise in the rate",
      ],
    },
    {
      heading: "Speed and approximation",
      points: [
        "Use fraction equivalents: 1/8 = 12.5%, 1/6 ≈ 16.67%, 1/12 ≈ 8.33%, 3/8 = 37.5%",
        "For 'which is highest', compare ratios by cross-multiplication instead of finding each percentage",
        "Round only when options are far apart; with close options work exactly",
      ],
    },
  ],
  formulas: [
    "% change = (new − old)/old × 100",
    "Central angle = part/total × 360°",
    "Weighted average = Σ(nᵢ × aᵢ)/Σnᵢ",
    "Successive change: a + b + ab/100",
    "Literate population = population × literacy rate",
  ],
  traps: [
    "Dividing by the new value when finding percentage change",
    "Averaging growth rates of different groups instead of using their totals",
    "Confusing percentage points with percentage change",
    "Using a pie angle as if it were a percentage (90° is 25%, not 90%)",
    "Answering a 'decrease' question with the absolute fall when the percentage fall is asked",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk mains carry DI sets of five questions on one table, bar graph, pie or caselet; read all five before calculating",
    "SSC CGL Tier 2 and CHSL use single-table DI with percentage change, ratio and average",
    "Caselet DI (data in a paragraph) is common in SBI PO mains; convert it to a table first",
  ],
  hi: {
    sections: [
      {
        heading: "मूल गणनाएँ",
        points: [
          "प्रतिशत परिवर्तन = (नया − पुराना)/पुराना × 100; आधार सदैव पहले वाला या संदर्भ मान होता है",
          "'A, B का कितने % है' = A/B × 100; 'A, B से कितने % अधिक है' = (A − B)/B × 100",
          "औसत = मानों का योग ÷ मानों की संख्या; 'औसत वार्षिक' के लिए सूचीबद्ध वर्षों की संख्या से भाग दें",
          "अनुपात के प्रश्न: पहले प्रत्येक कुल निकालें, सरल रूप अंत में करें",
          "औसत से लुप्त मान: लुप्त मान = (औसत × संख्या) − ज्ञात मानों का योग",
        ],
      },
      {
        heading: "पाई चार्ट",
        points: [
          "केंद्रीय कोण = (भाग/कुल) × 360°; पूरे का 1% = 3.6°",
          "राशि = (कोण/360°) × कुल, या (प्रतिशत/100) × कुल",
          "दो खंडों का अंतर: पहले कोणों या प्रतिशतों को घटाएँ, फिर एक बार परिवर्तित करें",
          "भिन्न कुल वाले दो पाई चार्टों की तुलना केवल कोण से नहीं हो सकती; वास्तविक मानों में बदलें",
        ],
      },
      {
        heading: "सारणियाँ और दंड आलेख",
        points: [
          "सबसे अधिक प्रतिशत वृद्धि सदैव सबसे अधिक निरपेक्ष वृद्धि नहीं होती; पूछे जाने पर दोनों निकालें",
          "लाभ = आय − व्यय; व्यय पर लाभ % = लाभ/व्यय × 100",
          "बिक्री के % के रूप में लाभ: लाभ = बिक्री × दर; दरों की नहीं, वास्तविक लाभों की तुलना करें",
          "पुरुष/महिला अनुपात आँकड़े: प्रत्येक विभाग को (अनुपात का भाग/भागों का योग) × कुल से बाँटें",
          "व्यापार संतुलन: निर्यात − आयात; धनात्मक होने पर अधिशेष, ऋणात्मक होने पर घाटा",
        ],
      },
      {
        heading: "संयुक्त और भारित आँकड़े",
        points: [
          "भारित औसत = Σ(संख्या × औसत) ÷ Σ संख्या, औसतों का साधारण माध्य कभी नहीं",
          "संयुक्त प्रतिशत (जैसे सभी कॉलेजों में महिला %) = कुल महिलाएँ ÷ कुल छात्र × 100",
          "क्रमिक वार्षिक परिवर्तन गुणा होते हैं: P × (1 + r₁/100)(1 + r₂/100)…; गिरावट के लिए (1 − r/100) लें",
          "उत्तीर्ण प्रतिशत = उत्तीर्ण/सम्मिलित × 100; वर्षों की तुलना संख्या से नहीं, प्रतिशत से करें",
          "प्रतिशत अंक बनाम प्रतिशत: साक्षरता 60% से 72% होना 12 अंकों की वृद्धि है, पर दर में 20% की वृद्धि",
        ],
      },
      {
        heading: "गति और सन्निकटन",
        points: [
          "भिन्न-तुल्यांक का प्रयोग करें: 1/8 = 12.5%, 1/6 ≈ 16.67%, 1/12 ≈ 8.33%, 3/8 = 37.5%",
          "'सबसे अधिक कौन सा' के लिए प्रत्येक प्रतिशत निकालने के बजाय वज्र-गुणन से अनुपातों की तुलना करें",
          "तभी सन्निकटन करें जब विकल्प दूर-दूर हों; विकल्प पास-पास हों तो सटीक गणना करें",
        ],
      },
    ],
    formulas: [
      "% परिवर्तन = (नया − पुराना)/पुराना × 100",
      "केंद्रीय कोण = भाग/कुल × 360°",
      "भारित औसत = Σ(nᵢ × aᵢ)/Σnᵢ",
      "क्रमिक परिवर्तन: a + b + ab/100",
      "साक्षर जनसंख्या = जनसंख्या × साक्षरता दर",
    ],
    traps: [
      "प्रतिशत परिवर्तन निकालते समय नए मान से भाग देना",
      "समूहों के कुल के बजाय उनकी वृद्धि दरों का औसत लेना",
      "प्रतिशत अंक और प्रतिशत परिवर्तन में भ्रम करना",
      "पाई कोण को प्रतिशत मान लेना (90° का अर्थ 25% है, 90% नहीं)",
      "प्रतिशत गिरावट पूछे जाने पर निरपेक्ष गिरावट बताना",
    ],
    examTips: [
      "IBPS/SBI PO और क्लर्क मेन्स में एक सारणी, दंड आलेख, पाई या केसलेट पर पाँच प्रश्नों के DI सेट आते हैं; गणना से पहले पाँचों प्रश्न पढ़ लें",
      "SSC CGL Tier 2 और CHSL में प्रतिशत परिवर्तन, अनुपात और औसत वाले एकल-सारणी DI आते हैं",
      "केसलेट DI (अनुच्छेद में आँकड़े) SBI PO मेन्स में आम है; पहले उसे सारणी में बदलें",
    ],
  },
};

export default notes;
