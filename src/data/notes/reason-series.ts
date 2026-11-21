import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Step-by-step method",
      points: [
        "Step 1: look at the size of growth: slow growth suggests differences, fast growth suggests multiplication or powers.",
        "Step 2: write first differences; if not constant, take second differences.",
        "Step 3: try ratios between terms (×2, ×3, ×1.5) and mixed rules (×2 + 1, ×3 − 2).",
        "Step 4: check squares, cubes, primes and alternating patterns.",
        "Step 5: verify the rule on every term before choosing an answer.",
      ],
    },
    {
      heading: "Common number patterns",
      points: [
        "Constant or increasing differences: 7, 12, 19, 28, 39 (diff 5, 7, 9, 11) → 52.",
        "Squares and cubes, also n² ± 1 or n³ ± n: 1, 4, 9, 16, 25; 1, 8, 27, 64.",
        "Fibonacci: each term = sum of the previous two (1, 1, 2, 3, 5, 8, 13).",
        "Multiply then add: ×1 + 1, ×2 + 2, ×3 + 3… (5, 6, 14, 45, 184 → 925).",
        "Differences forming powers: 3, 4, 7, 16, 43 (diff 1, 3, 9, 27) → 124.",
        "Prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.",
      ],
    },
    {
      heading: "Alternating and mixed series",
      points: [
        "Two interleaved series: split into odd and even positions (3, 5, 7, 10, 11, 20, 15, 40 → 19).",
        "Alternate squares and cubes: 1, 8, 9, 64, 25, 216 → 49.",
        "Decreasing by squares or near-squares: 120, 99, 80, 63, 48 (11² − 1, 10² − 1, …) → 35.",
      ],
    },
    {
      heading: "Letter and alphanumeric series",
      points: [
        "Convert letters to positions A = 1 … Z = 26 and treat as numbers.",
        "Opposite letters sum to 27: A–Z, B–Y, C–X, D–W, E–V.",
        "Skip patterns: C, F, I, L (+3) → O; AC, EG, IK, MO → QS.",
        "Alphanumeric: letter position may match the number (B2, E5, H8, K11 → N14) or its square (A1, D4, I9, P16 → Y25).",
        "Positions past 26 wrap around to A.",
      ],
    },
  ],
  formulas: [
    "Squares: 11² = 121 … 20² = 400, 25² = 625",
    "Cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000",
    "Letter positions: EJOTY = 5, 10, 15, 20, 25",
    "Opposite letter = 27 − position",
  ],
  traps: [
    "Do not stop after two terms fit; check the whole series.",
    "If differences do not settle, try second differences or splitting into two series before giving up.",
    "Wrong-term questions: one term breaks the rule, so find the rule from the majority.",
    "Letter series often skip by a growing step (+1, +2, +3), not a fixed one.",
  ],
  examTips: [
    "Asked in almost every SSC, bank, railway and placement reasoning section; 2–5 questions per paper.",
    "Bank exams also use 'find the wrong number' series; SSC prefers missing-term and alphanumeric series.",
    "Memorise squares to 30, cubes to 15 and EJOTY letter anchors to spot rules quickly.",
  ],
  hi: {
    sections: [
      {
        heading: "चरण-दर-चरण विधि",
        points: [
          "चरण 1: वृद्धि का आकार देखिए: धीमी वृद्धि अंतर सुझाती है, तेज़ वृद्धि गुणा या घात।",
          "चरण 2: प्रथम अंतर लिखिए; यदि स्थिर न हों, तो द्वितीय अंतर लीजिए।",
          "चरण 3: पदों के बीच अनुपात आज़माइए (×2, ×3, ×1.5) और मिश्रित नियम (×2 + 1, ×3 − 2)।",
          "चरण 4: वर्ग, घन, अभाज्य और एकांतर प्रतिरूप जाँचिए।",
          "चरण 5: उत्तर चुनने से पहले नियम को हर पद पर सत्यापित कीजिए।",
        ],
      },
      {
        heading: "सामान्य संख्या प्रतिरूप",
        points: [
          "स्थिर या बढ़ते अंतर: 7, 12, 19, 28, 39 (अंतर 5, 7, 9, 11) → 52।",
          "वर्ग और घन, साथ ही n² ± 1 या n³ ± n: 1, 4, 9, 16, 25; 1, 8, 27, 64।",
          "फ़िबोनाची: प्रत्येक पद = पिछले दो पदों का योग (1, 1, 2, 3, 5, 8, 13)।",
          "गुणा फिर जोड़: ×1 + 1, ×2 + 2, ×3 + 3… (5, 6, 14, 45, 184 → 925)।",
          "घात बनाने वाले अंतर: 3, 4, 7, 16, 43 (अंतर 1, 3, 9, 27) → 124।",
          "अभाज्य संख्याएँ: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29।",
        ],
      },
      {
        heading: "एकांतर और मिश्रित शृंखलाएँ",
        points: [
          "दो गुँथी हुई शृंखलाएँ: विषम और सम स्थानों में बाँटिए (3, 5, 7, 10, 11, 20, 15, 40 → 19)।",
          "वर्ग और घन एकांतर: 1, 8, 9, 64, 25, 216 → 49।",
          "वर्गों या निकट-वर्गों से घटती: 120, 99, 80, 63, 48 (11² − 1, 10² − 1, …) → 35।",
        ],
      },
      {
        heading: "अक्षर और अक्षर-संख्या शृंखलाएँ",
        points: [
          "अक्षरों को क्रम-संख्या A = 1 … Z = 26 में बदलकर संख्या की तरह लीजिए।",
          "विपरीत अक्षरों का योग 27 होता है: A–Z, B–Y, C–X, D–W, E–V।",
          "छोड़ने के प्रतिरूप: C, F, I, L (+3) → O; AC, EG, IK, MO → QS।",
          "अक्षर-संख्या: अक्षर की क्रम-संख्या संख्या के बराबर हो सकती है (B2, E5, H8, K11 → N14) या उसके वर्ग के (A1, D4, I9, P16 → Y25)।",
          "26 से आगे की क्रम-संख्याएँ घूमकर A पर लौटती हैं।",
        ],
      },
    ],
    formulas: [
      "वर्ग: 11² = 121 … 20² = 400, 25² = 625",
      "घन: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000",
      "अक्षरों के स्थान: EJOTY = 5, 10, 15, 20, 25",
      "विपरीत अक्षर = 27 − क्रम-संख्या",
    ],
    traps: [
      "दो पद मेल खाने पर रुकिए मत; पूरी शृंखला जाँचिए।",
      "यदि अंतर स्थिर न हों, तो हार मानने से पहले द्वितीय अंतर आज़माइए या शृंखला को दो भागों में बाँटिए।",
      "गलत पद वाले प्रश्न: एक पद नियम तोड़ता है, इसलिए बहुमत से नियम खोजिए।",
      "अक्षर शृंखलाएँ प्रायः बढ़ते चरण (+1, +2, +3) से छोड़ती हैं, स्थिर चरण से नहीं।",
    ],
    examTips: [
      "लगभग हर SSC, बैंक, रेलवे और प्लेसमेंट रीज़निंग खंड में पूछी जाती है; प्रति पेपर 2–5 प्रश्न।",
      "बैंक परीक्षाएँ 'गलत संख्या खोजिए' शृंखला भी लेती हैं; SSC लुप्त पद और अक्षर-संख्या शृंखला अधिक पसंद करता है।",
      "नियम जल्दी पहचानने के लिए 30 तक के वर्ग, 15 तक के घन और EJOTY अक्षर-आधार याद रखिए।",
    ],
  },
};

export default notes;
