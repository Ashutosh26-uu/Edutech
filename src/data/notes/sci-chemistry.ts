import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Matter and atoms",
      points: [
        "Atomic number (Z) = number of protons = number of electrons in a neutral atom.",
        "Mass number (A) = protons + neutrons; neutrons = A − Z.",
        "Isotopes: same Z, different A (e.g. ¹²C and ¹⁴C). Isobars: same A, different Z (e.g. ⁴⁰Ar and ⁴⁰Ca).",
        "Shell capacity 2n²: K = 2, L = 8, M = 18. Noble gases have a full outer shell (helium has 2, the rest 8).",
        "Mixtures can be separated physically; compounds have fixed composition and need chemical methods.",
      ],
    },
    {
      heading: "Mole concept",
      points: [
        "1 mole = 6.022 × 10²³ particles (Avogadro's number).",
        "Moles = given mass ÷ molar mass (e.g. 22 g CO₂ ÷ 44 = 0.5 mol).",
        "At STP, 1 mole of any gas occupies 22.4 L.",
        "O₂ is diatomic: count molecules first, then multiply by 2 for atoms.",
        "Use the balanced equation's mole ratio: CaCO₃ → CaO + CO₂ (100 g gives 22.4 L CO₂ at STP).",
      ],
    },
    {
      heading: "Acids, bases and salts",
      points: [
        "pH = −log[H⁺]; pure water at 25 °C has pH 7; below 7 acidic, above 7 basic.",
        "At 25 °C, pH + pOH = 14. A fall of 1 pH unit means 10 times more H⁺.",
        "Indicators: litmus red in acid, blue in base; phenolphthalein colourless in acid, pink in base; methyl orange red in acid, yellow in base.",
        "Acid + base → salt + water (neutralisation). Acid + metal carbonate → salt + water + CO₂.",
        "Everyday pH: stomach acid (HCl) about 1–2, blood about 7.4, antacids are mild bases such as Mg(OH)₂.",
      ],
    },
    {
      heading: "Common chemical names",
      points: [
        "Common salt NaCl; baking soda NaHCO₃; washing soda Na₂CO₃·10H₂O.",
        "Quicklime CaO; slaked lime Ca(OH)₂; limestone/marble/chalk CaCO₃.",
        "Bleaching powder CaOCl₂; plaster of Paris CaSO₄·½H₂O; gypsum CaSO₄·2H₂O.",
        "Laughing gas N₂O; dry ice is solid CO₂; heavy water D₂O.",
        "Ores: bauxite (aluminium), haematite (iron), cinnabar (mercury), galena (lead), zinc blende (zinc).",
      ],
    },
    {
      heading: "Reactions, air and alloys",
      points: [
        "Oxidation = gain of oxygen or loss of electrons; reduction is the reverse.",
        "Exothermic releases heat (combustion, respiration); endothermic absorbs heat (photosynthesis, melting ice, dissolving NH₄Cl).",
        "Air: nitrogen ~78%, oxygen ~21%, argon ~0.9%, CO₂ ~0.04%.",
        "Brass = Cu + Zn; bronze = Cu + Sn; stainless steel = Fe + Cr + Ni (+ C); solder = Pb + Sn.",
        "Rusting of iron needs both oxygen and water; galvanising coats iron with zinc.",
      ],
    },
  ],
  formulas: [
    "Moles = mass ÷ molar mass = particles ÷ 6.022 × 10²³ = volume (L) at STP ÷ 22.4",
    "pH + pOH = 14 (at 25 °C)",
    "Neutrons = A − Z",
    "Molar masses: H₂O 18, CO₂ 44, NaCl 58.5, CaCO₃ 100, H₂SO₄ 98",
  ],
  traps: [
    "Baking soda (NaHCO₃) and washing soda (Na₂CO₃·10H₂O) are different; do not swap them.",
    "Quicklime is CaO, slaked lime is Ca(OH)₂; heating limestone gives quicklime.",
    "For gases like O₂, N₂, Cl₂, the number of atoms is twice the number of molecules.",
    "pH is logarithmic: pH 2 is 100 times (not twice) as acidic as pH 4.",
    "Phenolphthalein stays colourless in acids; it does not turn red.",
  ],
  examTips: [
    "SSC, RRB and state exams favour one-liners on chemical names, ores, alloys and indicator colours.",
    "Higher-level papers add mole and STP volume calculations and multi-statement questions on pH and atomic structure.",
    "Keep a ready table of formula, common name and use for 15–20 everyday compounds.",
  ],
  hi: {
    sections: [
      {
        heading: "पदार्थ और परमाणु",
        points: [
          "परमाणु क्रमांक (Z) = प्रोटॉनों की संख्या = उदासीन परमाणु में इलेक्ट्रॉनों की संख्या।",
          "द्रव्यमान संख्या (A) = प्रोटॉन + न्यूट्रॉन; न्यूट्रॉन = A − Z।",
          "समस्थानिक: Z समान, A भिन्न (जैसे ¹²C और ¹⁴C)। समभारिक: A समान, Z भिन्न (जैसे ⁴⁰Ar और ⁴⁰Ca)।",
          "कोश धारिता 2n²: K = 2, L = 8, M = 18। उत्कृष्ट गैसों का बाहरी कोश पूर्ण होता है (हीलियम में 2, शेष में 8)।",
          "मिश्रणों को भौतिक विधियों से अलग किया जा सकता है; यौगिकों का संघटन निश्चित होता है और उनके लिए रासायनिक विधियाँ चाहिए।",
        ],
      },
      {
        heading: "मोल संकल्पना",
        points: [
          "1 मोल = 6.022 × 10²³ कण (आवोगाद्रो संख्या)।",
          "मोल = दिया गया द्रव्यमान ÷ मोलर द्रव्यमान (जैसे 22 g CO₂ ÷ 44 = 0.5 मोल)।",
          "STP पर किसी भी गैस का 1 मोल 22.4 L आयतन घेरता है।",
          "O₂ द्विपरमाणुक है: पहले अणु गिनें, फिर परमाणुओं के लिए 2 से गुणा करें।",
          "संतुलित समीकरण का मोल अनुपात प्रयोग करें: CaCO₃ → CaO + CO₂ (100 g से STP पर 22.4 L CO₂ मिलती है)।",
        ],
      },
      {
        heading: "अम्ल, क्षार और लवण",
        points: [
          "pH = −log[H⁺]; 25 °C पर शुद्ध जल का pH 7 होता है; 7 से कम अम्लीय, 7 से अधिक क्षारीय।",
          "25 °C पर pH + pOH = 14। pH में 1 इकाई की कमी का अर्थ है H⁺ का 10 गुना अधिक होना।",
          "सूचक: लिटमस अम्ल में लाल, क्षार में नीला; फ़िनॉल्फ्थेलीन अम्ल में रंगहीन, क्षार में गुलाबी; मेथिल ऑरेंज अम्ल में लाल, क्षार में पीला।",
          "अम्ल + क्षार → लवण + जल (उदासीनीकरण)। अम्ल + धातु कार्बोनेट → लवण + जल + CO₂।",
          "दैनिक जीवन के pH: आमाशय का अम्ल (HCl) लगभग 1–2, रक्त लगभग 7.4, प्रतिअम्ल (एंटैसिड) Mg(OH)₂ जैसे मृदु क्षार होते हैं।",
        ],
      },
      {
        heading: "सामान्य रासायनिक नाम",
        points: [
          "खाने का नमक NaCl; बेकिंग सोडा NaHCO₃; धोने का सोडा Na₂CO₃·10H₂O।",
          "बिना बुझा चूना CaO; बुझा चूना Ca(OH)₂; चूना पत्थर/संगमरमर/चॉक CaCO₃।",
          "विरंजक चूर्ण (ब्लीचिंग पाउडर) CaOCl₂; प्लास्टर ऑफ़ पेरिस CaSO₄·½H₂O; जिप्सम CaSO₄·2H₂O।",
          "हँसाने वाली गैस N₂O; शुष्क बर्फ़ ठोस CO₂ है; भारी जल D₂O।",
          "अयस्क: बॉक्साइट (एल्युमिनियम), हेमेटाइट (लोहा), सिनेबार (पारा), गैलेना (सीसा), ज़िंक ब्लेंड (जस्ता)।",
        ],
      },
      {
        heading: "अभिक्रियाएँ, वायु और मिश्रातु",
        points: [
          "ऑक्सीकरण = ऑक्सीजन का लाभ या इलेक्ट्रॉनों की हानि; अपचयन इसका उलटा है।",
          "ऊष्माक्षेपी अभिक्रिया में ऊष्मा निकलती है (दहन, श्वसन); ऊष्माशोषी में ऊष्मा अवशोषित होती है (प्रकाश संश्लेषण, बर्फ़ का पिघलना, NH₄Cl का घुलना)।",
          "वायु: नाइट्रोजन ~78%, ऑक्सीजन ~21%, आर्गन ~0.9%, CO₂ ~0.04%।",
          "पीतल = Cu + Zn; काँसा = Cu + Sn; स्टेनलेस स्टील = Fe + Cr + Ni (+ C); सोल्डर = Pb + Sn।",
          "लोहे में जंग लगने के लिए ऑक्सीजन और जल दोनों चाहिए; गैल्वेनीकरण में लोहे पर जस्ते की परत चढ़ाई जाती है।",
        ],
      },
    ],
    formulas: [
      "मोल = द्रव्यमान ÷ मोलर द्रव्यमान = कण ÷ 6.022 × 10²³ = STP पर आयतन (L) ÷ 22.4",
      "pH + pOH = 14 (25 °C पर)",
      "न्यूट्रॉन = A − Z",
      "मोलर द्रव्यमान: H₂O 18, CO₂ 44, NaCl 58.5, CaCO₃ 100, H₂SO₄ 98",
    ],
    traps: [
      "बेकिंग सोडा (NaHCO₃) और धोने का सोडा (Na₂CO₃·10H₂O) अलग-अलग हैं; इन्हें आपस में न बदलें।",
      "बिना बुझा चूना CaO है, बुझा चूना Ca(OH)₂ है; चूना पत्थर को गर्म करने पर बिना बुझा चूना मिलता है।",
      "O₂, N₂, Cl₂ जैसी गैसों में परमाणुओं की संख्या अणुओं की संख्या की दोगुनी होती है।",
      "pH लघुगणकीय है: pH 2, pH 4 की तुलना में 100 गुना (दोगुना नहीं) अम्लीय है।",
      "फ़िनॉल्फ्थेलीन अम्लों में रंगहीन रहती है; वह लाल नहीं होती।",
    ],
    examTips: [
      "SSC, RRB और राज्य परीक्षाओं में रासायनिक नामों, अयस्कों, मिश्रातुओं और सूचकों के रंगों पर एक-पंक्ति प्रश्न अधिक आते हैं।",
      "उच्च स्तर के पेपरों में मोल और STP आयतन की गणनाएँ तथा pH और परमाणु संरचना पर बहु-कथन प्रश्न जुड़ जाते हैं।",
      "15–20 दैनिक यौगिकों की सूत्र, सामान्य नाम और उपयोग वाली तैयार तालिका रखें।",
    ],
  },
};

export default notes;
