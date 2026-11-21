import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "A word is turned into a code by a fixed rule; find the rule from the example and apply it to the new word.",
        "Write letter positions A = 1 … Z = 26 under both the word and its code.",
        "Compare letter by letter: same shift, growing shift, reversal, or a swap of positions.",
      ],
    },
    {
      heading: "Letter-shift coding",
      points: [
        "Uniform shift: ROSE → SPTF (each +1), so LILY → MJMZ.",
        "Uniform shift +3: ROAD → URDG, so SWAN → VZDQ.",
        "Increasing shift: +1, +2, +3… (TABLE → UCEPJ), or +2, +3, +4… (FRIEND → HUMJTK).",
        "Different rules for vowels and consonants: apply each rule separately.",
        "Wrap around: Z + 1 = A, A − 1 = Z.",
      ],
    },
    {
      heading: "Position-based coding",
      points: [
        "Reversal: the word is written backwards, sometimes followed by a shift.",
        "Opposite-letter coding: each letter becomes its pair summing to 27 (A ↔ Z, M ↔ N).",
        "Halves swapped or reversed: split the word in two and check each half.",
        "Pairs swapped: letters 1–2, 3–4… exchanged, possibly with a shift.",
      ],
    },
    {
      heading: "Number and symbol coding",
      points: [
        "Sum of positions: CAT = 3 + 1 + 20 = 24.",
        "Variants: sum × number of letters, sum of reverse positions (A = 26), or products.",
        "Direct substitution: each letter maps to a given digit or symbol; read the table carefully.",
        "Conditional codes: check the conditions (first letter vowel, last consonant…) in order before coding.",
      ],
    },
    {
      heading: "Substitution and sentence coding",
      points: [
        "'Red is called blue, blue is called green…': answer with the new name of the thing asked (sky's colour blue → called green).",
        "Sentence codes: compare two sentences; the common word and common code match.",
        "Code words may appear in any order, so match by elimination, not by position.",
      ],
    },
  ],
  formulas: [
    "Positions: A1 E5 J10 O15 T20 Y25 (EJOTY)",
    "Opposite letter = 27 − position",
    "Reverse position = 27 − forward position",
    "Shift beyond 26: subtract 26",
  ],
  traps: [
    "Check the shift for every letter; one changed step means a growing or alternating pattern.",
    "In substitution codes, answer with the code name, not the real name.",
    "In sentence coding, words are not coded in the same order as they appear.",
    "For conditional codes, apply only the first condition that matches if the question says so.",
  ],
  examTips: [
    "A guaranteed 1–3 questions in SSC, railway, bank and police exams.",
    "Newer bank papers use conditional and sentence-based coding; SSC still favours letter-shift and number coding.",
    "Memorising letter positions (EJOTY and opposite pairs) saves the most time here.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "एक निश्चित नियम से शब्द को कूट में बदला जाता है; उदाहरण से नियम खोजिए और नए शब्द पर लगाइए।",
          "शब्द और उसके कूट, दोनों के नीचे अक्षरों की क्रम-संख्या A = 1 … Z = 26 लिखिए।",
          "अक्षर-दर-अक्षर तुलना कीजिए: समान अंतर, बढ़ता अंतर, उलटा क्रम, या स्थानों की अदला-बदली।",
        ],
      },
      {
        heading: "अक्षर-अंतर कूटलेखन",
        points: [
          "समान अंतर: ROSE → SPTF (हर अक्षर +1), अतः LILY → MJMZ।",
          "समान अंतर +3: ROAD → URDG, अतः SWAN → VZDQ।",
          "बढ़ता अंतर: +1, +2, +3… (TABLE → UCEPJ), या +2, +3, +4… (FRIEND → HUMJTK)।",
          "स्वरों और व्यंजनों के लिए अलग नियम: हर नियम अलग-अलग लगाइए।",
          "चक्रीय क्रम: Z + 1 = A, A − 1 = Z।",
        ],
      },
      {
        heading: "स्थान-आधारित कूटलेखन",
        points: [
          "उलटा क्रम: शब्द पीछे से लिखा जाता है, कभी-कभी उसके बाद अंतर भी लगता है।",
          "विपरीत-अक्षर कूटलेखन: हर अक्षर अपने उस जोड़ीदार में बदलता है जिसके साथ योग 27 हो (A ↔ Z, M ↔ N)।",
          "आधे भागों की अदला-बदली या उलटाव: शब्द को दो भागों में बाँटिए और हर भाग जाँचिए।",
          "जोड़ों की अदला-बदली: अक्षर 1–2, 3–4… आपस में बदलते हैं, संभवतः अंतर के साथ।",
        ],
      },
      {
        heading: "संख्या और प्रतीक कूटलेखन",
        points: [
          "क्रम-संख्याओं का योग: CAT = 3 + 1 + 20 = 24।",
          "रूपांतर: योग × अक्षरों की संख्या, उलटी क्रम-संख्याओं का योग (A = 26), या गुणनफल।",
          "सीधा प्रतिस्थापन: हर अक्षर दिए गए अंक या प्रतीक से जुड़ता है; तालिका ध्यान से पढ़िए।",
          "शर्तयुक्त कूट: कूटलेखन से पहले शर्तें (पहला अक्षर स्वर, अंतिम व्यंजन…) क्रम से जाँचिए।",
        ],
      },
      {
        heading: "प्रतिस्थापन और वाक्य कूटलेखन",
        points: [
          "'लाल को नीला कहते हैं, नीले को हरा कहते हैं…': पूछी गई वस्तु के नए नाम से उत्तर दीजिए (आकाश का रंग नीला → हरा कहलाता है)।",
          "वाक्य कूट: दो वाक्यों की तुलना कीजिए; उभयनिष्ठ शब्द और उभयनिष्ठ कूट आपस में मेल खाते हैं।",
          "कूट-शब्द किसी भी क्रम में आ सकते हैं, इसलिए स्थान से नहीं, निराकरण से मिलाइए।",
        ],
      },
    ],
    formulas: [
      "क्रम-संख्याएँ: A1 E5 J10 O15 T20 Y25 (EJOTY)",
      "विपरीत अक्षर = 27 − क्रम-संख्या",
      "उलटी क्रम-संख्या = 27 − सीधी क्रम-संख्या",
      "26 से आगे का अंतर: 26 घटाइए",
    ],
    traps: [
      "हर अक्षर का अंतर जाँचिए; एक चरण बदलने का अर्थ है बढ़ता या एकांतर प्रतिरूप।",
      "प्रतिस्थापन कूट में कूट-नाम से उत्तर दीजिए, वास्तविक नाम से नहीं।",
      "वाक्य कूटलेखन में शब्द उसी क्रम में कूटबद्ध नहीं होते जिसमें वे आते हैं।",
      "शर्तयुक्त कूट में, यदि प्रश्न ऐसा कहे, तो केवल पहली मेल खाने वाली शर्त लगाइए।",
    ],
    examTips: [
      "SSC, रेलवे, बैंक और पुलिस परीक्षाओं में 1–3 प्रश्न निश्चित आते हैं।",
      "नए बैंक पेपरों में शर्तयुक्त और वाक्य-आधारित कूटलेखन आता है; SSC अब भी अक्षर-अंतर और संख्या कूटलेखन पसंद करता है।",
      "अक्षरों की क्रम-संख्या (EJOTY और विपरीत जोड़े) याद रखने से यहाँ सबसे अधिक समय बचता है।",
    ],
  },
};

export default notes;
