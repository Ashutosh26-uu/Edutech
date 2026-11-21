import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Physics around us",
      points: [
        "Sweat cools us because evaporation takes latent heat from the skin",
        "Pan handles are wood or plastic because they are poor conductors of heat",
        "Dark clothes absorb more heat, so they suit winter; light colours reflect it",
        "Stars twinkle due to atmospheric refraction; planets do not, being nearer and seen as discs",
        "Mirage: refraction through hot, less dense air near the ground, ending in total internal reflection",
        "Sky is blue due to scattering of short wavelengths; space looks black as there is no air to scatter light",
        "Danger signals are red because red has the longest wavelength and scatters least",
        "Lightning distance = speed of sound × delay (3 s × 340 m/s = 1,020 m)",
        "A ship rises a little moving from river to sea because sea water is denser",
        "Pressure cookers cook faster because higher pressure raises the boiling point",
      ],
    },
    {
      heading: "Kitchen and household chemistry",
      points: [
        "LPG is mainly butane (with propane); ethyl mercaptan is added for smell",
        "Baking soda NaHCO₃ releases CO₂ on heating; baking powder = baking soda + tartaric acid",
        "Bee and ant stings are acidic (formic acid), so a mild base such as baking soda relieves them",
        "Milk turns to curd by Lactobacillus bacteria; vinegar is dilute acetic acid",
        "Green coating on copper: basic copper carbonate; black tarnish on silver: Ag₂S",
        "Non-stick coating: Teflon (PTFE); washing soda Na₂CO₃·10H₂O; bleaching powder CaOCl₂; plaster of Paris CaSO₄·½H₂O",
        "Pickles and jams last because salt or sugar draws water out of microbes by osmosis",
        "Soap forms micelles around grease; hard water's Ca²⁺ and Mg²⁺ form scum with soap",
        "Salt lowers the freezing point of water, so it clears ice on roads",
        "Never use water on electrical fires: water conducts; use a CO₂ or dry-powder extinguisher",
      ],
    },
    {
      heading: "Electricity bills",
      points: [
        "1 unit = 1 kWh; energy (kWh) = power (kW) × hours",
        "Cost = units × rate; e.g. 1,500 W for 2 h daily = 3 kWh a day",
        "Battery energy (Wh) = voltage × ampere-hours",
      ],
    },
    {
      heading: "Health and nutrition",
      points: [
        "Kwashiorkor: protein deficiency; marasmus: protein and calorie deficiency",
        "Goitre: iodine; anaemia: iron; fluorosis: excess fluoride in water",
        "Vitamin A night blindness, B1 beriberi, C scurvy, D rickets, K poor blood clotting",
      ],
    },
    {
      heading: "Inventions and discoveries",
      points: [
        "X-rays: Röntgen 1895; radioactivity: Becquerel 1896; electron: J. J. Thomson 1897; neutron: Chadwick 1932",
        "First powered flight: Wright brothers 1903; penicillin: Alexander Fleming 1928",
        "Rabies vaccine: Louis Pasteur 1885; smallpox vaccine: Edward Jenner 1796; oral polio vaccine: Albert Sabin",
        "Telephone: Graham Bell 1876; practical electric bulb: Edison 1879",
      ],
    },
  ],
  formulas: [
    "kWh = kW × hours; cost = kWh × rate",
    "Distance of lightning = 340 m/s × time gap",
    "NaHCO₃: baking soda; Na₂CO₃·10H₂O: washing soda; CaOCl₂: bleaching powder",
  ],
  traps: [
    "Forgetting to convert watts to kilowatts before finding units",
    "Saying LPG is mainly methane; methane is the main part of CNG",
    "Treating a mirage as reflection from water; it is refraction and total internal reflection in air",
    "Putting X-rays after radioactivity in chronological order; X-rays (1895) came first",
    "Using vinegar on a bee sting; an acid sting needs a mild base",
  ],
  examTips: [
    "SSC CGL, CHSL, MTS and RRB NTPC/Group D ask one or two everyday science questions per shift",
    "Chronological ordering and 'how many statements are correct' are common for discoveries",
    "Electricity bill sums appear in RRB papers; keep the kW × h × rate chain ready",
  ],
  hi: {
    sections: [
      {
        heading: "हमारे आसपास की भौतिकी",
        points: [
          "पसीना हमें ठंडक देता है क्योंकि वाष्पन त्वचा से गुप्त ऊष्मा ले लेता है",
          "कड़ाही के हैंडल लकड़ी या प्लास्टिक के होते हैं क्योंकि वे ऊष्मा के कुचालक हैं",
          "गहरे रंग के कपड़े अधिक ऊष्मा अवशोषित करते हैं, इसलिए सर्दियों के लिए उपयुक्त हैं; हल्के रंग उसे परावर्तित करते हैं",
          "तारे वायुमंडलीय अपवर्तन के कारण टिमटिमाते हैं; ग्रह नहीं टिमटिमाते, क्योंकि वे निकट हैं और बिंब (चकती) के रूप में दिखते हैं",
          "मरीचिका: ज़मीन के पास गर्म, कम घनत्व वाली वायु से अपवर्तन, जिसका अंत पूर्ण आंतरिक परावर्तन में होता है",
          "आकाश नीला दिखता है क्योंकि छोटी तरंगदैर्ध्य का प्रकीर्णन होता है; अंतरिक्ष काला दिखता है क्योंकि प्रकाश को प्रकीर्णित करने के लिए वायु नहीं है",
          "खतरे के संकेत लाल होते हैं क्योंकि लाल की तरंगदैर्ध्य सबसे अधिक होती है और उसका प्रकीर्णन सबसे कम होता है",
          "बिजली की दूरी = ध्वनि की चाल × समय-अंतराल (3 s × 340 m/s = 1,020 m)",
          "नदी से समुद्र में जाने पर जहाज़ थोड़ा ऊपर उठ जाता है क्योंकि समुद्री जल अधिक सघन होता है",
          "प्रेशर कुकर में भोजन जल्दी पकता है क्योंकि अधिक दाब क्वथनांक बढ़ा देता है",
        ],
      },
      {
        heading: "रसोई और घरेलू रसायन",
        points: [
          "LPG मुख्यतः ब्यूटेन है (प्रोपेन के साथ); गंध के लिए एथिल मरकैप्टन मिलाया जाता है",
          "बेकिंग सोडा NaHCO₃ गर्म करने पर CO₂ छोड़ता है; बेकिंग पाउडर = बेकिंग सोडा + टार्टरिक अम्ल",
          "मधुमक्खी और चींटी के डंक अम्लीय (फ़ॉर्मिक अम्ल) होते हैं, इसलिए बेकिंग सोडा जैसा मृदु क्षार राहत देता है",
          "दूध लैक्टोबैसिलस जीवाणुओं से दही बनता है; सिरका तनु ऐसीटिक अम्ल है",
          "ताँबे पर हरी परत: क्षारकीय कॉपर कार्बोनेट; चाँदी पर काली परत: Ag₂S",
          "नॉन-स्टिक परत: टेफ़लॉन (PTFE); धोने का सोडा Na₂CO₃·10H₂O; विरंजक चूर्ण CaOCl₂; प्लास्टर ऑफ़ पेरिस CaSO₄·½H₂O",
          "अचार और जैम इसलिए टिकते हैं क्योंकि नमक या चीनी परासरण द्वारा सूक्ष्मजीवों से जल खींच लेती है",
          "साबुन चिकनाई के चारों ओर मिसेल बनाता है; कठोर जल के Ca²⁺ और Mg²⁺ साबुन के साथ झाग-रहित मैल बनाते हैं",
          "नमक जल का हिमांक घटा देता है, इसलिए सड़कों की बर्फ़ पिघलाता है",
          "बिजली की आग पर कभी पानी न डालें: पानी चालक है; CO₂ या शुष्क चूर्ण वाला अग्निशामक प्रयोग करें",
        ],
      },
      {
        heading: "बिजली के बिल",
        points: [
          "1 यूनिट = 1 kWh; ऊर्जा (kWh) = शक्ति (kW) × घंटे",
          "लागत = यूनिट × दर; जैसे प्रतिदिन 2 घंटे 1,500 W = एक दिन में 3 kWh",
          "बैटरी की ऊर्जा (Wh) = वोल्टता × ऐम्पियर-घंटे",
        ],
      },
      {
        heading: "स्वास्थ्य और पोषण",
        points: [
          "क्वाशिओरकोर: प्रोटीन की कमी; मरास्मस: प्रोटीन और कैलोरी की कमी",
          "घेंघा: आयोडीन; रक्ताल्पता: आयरन; फ़्लोरोसिस: जल में फ़्लोराइड की अधिकता",
          "विटामिन A रतौंधी, B1 बेरीबेरी, C स्कर्वी, D रिकेट्स, K रक्त का थक्का कम जमना",
        ],
      },
      {
        heading: "आविष्कार और खोजें",
        points: [
          "X-किरणें: रॉन्टगेन 1895; रेडियोधर्मिता: बेकरल 1896; इलेक्ट्रॉन: जे. जे. थॉमसन 1897; न्यूट्रॉन: चैडविक 1932",
          "पहली चालित उड़ान: राइट बंधु 1903; पेनिसिलिन: अलेक्ज़ेंडर फ़्लेमिंग 1928",
          "रेबीज़ का टीका: लुई पाश्चर 1885; चेचक का टीका: एडवर्ड जेनर 1796; मौखिक पोलियो टीका: अल्बर्ट सेबिन",
          "टेलीफ़ोन: ग्राहम बेल 1876; व्यावहारिक विद्युत बल्ब: एडिसन 1879",
        ],
      },
    ],
    formulas: [
      "kWh = kW × घंटे; लागत = kWh × दर",
      "बिजली की दूरी = 340 m/s × समय-अंतराल",
      "NaHCO₃: बेकिंग सोडा; Na₂CO₃·10H₂O: धोने का सोडा; CaOCl₂: विरंजक चूर्ण",
    ],
    traps: [
      "यूनिट निकालने से पहले वाट को किलोवाट में बदलना भूल जाना",
      "LPG को मुख्यतः मीथेन कहना; मीथेन CNG का मुख्य घटक है",
      "मरीचिका को पानी से परावर्तन मानना; यह वायु में अपवर्तन और पूर्ण आंतरिक परावर्तन है",
      "कालक्रम में X-किरणों को रेडियोधर्मिता के बाद रखना; X-किरणें (1895) पहले आईं",
      "मधुमक्खी के डंक पर सिरका लगाना; अम्लीय डंक के लिए मृदु क्षार चाहिए",
    ],
    examTips: [
      "SSC CGL, CHSL, MTS और RRB NTPC/ग्रुप D में प्रति शिफ़्ट एक-दो दैनिक विज्ञान प्रश्न आते हैं",
      "खोजों के कालानुक्रम और 'कितने कथन सही हैं' वाले प्रश्न आम हैं",
      "बिजली बिल के प्रश्न RRB पेपरों में आते हैं; kW × घंटे × दर की शृंखला तैयार रखें",
    ],
  },
};

export default notes;
