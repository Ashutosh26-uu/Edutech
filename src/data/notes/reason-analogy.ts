import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Analogy: find the exact relation in the first pair, then apply the same relation to the second.",
        "Classification (odd one out): three items share a rule; the fourth breaks it.",
        "State the rule in words before looking at options; then test every option.",
      ],
    },
    {
      heading: "Word analogies: common relations",
      points: [
        "Worker–tool: carpenter : saw, tailor : needle.",
        "Instrument–measures: thermometer : temperature, barometer : pressure, odometer : distance.",
        "Study–subject: ornithology : birds, seismology : earthquakes, entomology : insects.",
        "Part–whole: petal : flower, page : book. Product–raw material: paper : pulp, cloth : yarn.",
        "Young one: cow : calf, horse : foal, dog : puppy. Home: bee : hive, lion : den, horse : stable.",
        "Synonym/antonym pairs, cause–effect, and country–currency or capital also appear.",
      ],
    },
    {
      heading: "Number analogies",
      points: [
        "Check squares and cubes first: 4 : 64 = n³; 4 : 65 = n³ + 1.",
        "Then n² ± 1, n³ ± 1, n(n + 1), n² + n, and simple multiples.",
        "Pairs like (6, 8) : 100 often mean 6² + 8² = 100; then (5, 12) : 169.",
        "For odd one out among numbers, check primes, squares, cubes, multiples and digit sums.",
        "121, 169 are squares (11², 13²); 143 = 11 × 13 and 187 = 11 × 17 are not.",
      ],
    },
    {
      heading: "Letter analogies",
      points: [
        "Convert letters to positions: A = 1 … Z = 26.",
        "Look for a constant shift: ACE : BDF is +1 on each letter, so GIK : HJL.",
        "Opposite letters add to 27: A–Z, B–Y, C–X, D–W, E–V … M–N.",
        "Letter–number mixes: B4 : D16 means position², so F36 : H64.",
        "Odd letter group: check gaps between letters (e.g. +1+1, +2+2, +1+2+1).",
      ],
    },
    {
      heading: "Classification method",
      points: [
        "Group by category (fruit vs flower, river flowing east vs west, 2D vs 3D shape).",
        "Kaveri, Krishna, Godavari flow east into the Bay of Bengal; Narmada flows west.",
        "Triangle, square, pentagon are 2D; cube is 3D.",
        "If two rules each isolate a different option, pick the stronger, more specific rule.",
      ],
    },
  ],
  formulas: [
    "Squares 11²–20²: 121, 144, 169, 196, 225, 256, 289, 324, 361, 400",
    "Cubes 2³–10³: 8, 27, 64, 125, 216, 343, 512, 729, 1000",
    "EJOTY: E = 5, J = 10, O = 15, T = 20, Y = 25",
    "Opposite letter: position of X + position of opposite = 27",
  ],
  traps: [
    "Reversing the order of the relation in the second pair (tool : worker vs worker : tool).",
    "Stopping at the first rule that fits; check that it fits all three non-odd items exactly.",
    "Missing n³ ± 1 patterns because n² looked close.",
    "Counting letter gaps from the wrong end or forgetting the alphabet wraps only if stated.",
    "Assuming 343 is a square; it is 7³.",
  ],
  examTips: [
    "SSC CGL/CHSL/MTS and railway exams ask several analogy and classification items each paper.",
    "Expect a mix: words, numbers, letters and number pairs like (2, 9), (3, 28).",
    "Memorising squares, cubes and EJOTY saves the most time here.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "सादृश्य (Analogy): पहले युग्म का सटीक संबंध पहचानिए, फिर वही संबंध दूसरे युग्म पर लगाइए।",
          "वर्गीकरण (विषम चुनना): तीन पद एक नियम मानते हैं; चौथा उसे तोड़ता है।",
          "विकल्प देखने से पहले नियम को शब्दों में बोलिए; फिर हर विकल्प को जाँचिए।",
        ],
      },
      {
        heading: "शब्द सादृश्य: सामान्य संबंध",
        points: [
          "कार्यकर्ता–औज़ार: बढ़ई : आरी, दर्जी : सुई।",
          "यंत्र–मापन: थर्मामीटर : तापमान, बैरोमीटर : दाब, ओडोमीटर : दूरी।",
          "अध्ययन–विषय: ऑर्निथोलॉजी : पक्षी, सिस्मोलॉजी : भूकंप, एंटोमोलॉजी : कीट।",
          "भाग–पूर्ण: पंखुड़ी : फूल, पृष्ठ : पुस्तक। उत्पाद–कच्चा माल: कागज : लुगदी, कपड़ा : सूत।",
          "शावक: गाय : बछड़ा, घोड़ा : बछेड़ा, कुत्ता : पिल्ला। घर: मधुमक्खी : छत्ता, शेर : माँद, घोड़ा : अस्तबल।",
          "पर्यायवाची/विलोम युग्म, कारण–परिणाम, तथा देश–मुद्रा या राजधानी भी पूछे जाते हैं।",
        ],
      },
      {
        heading: "संख्या सादृश्य",
        points: [
          "पहले वर्ग और घन जाँचिए: 4 : 64 = n³; 4 : 65 = n³ + 1।",
          "फिर n² ± 1, n³ ± 1, n(n + 1), n² + n और सरल गुणज देखिए।",
          "(6, 8) : 100 जैसे युग्म का अर्थ प्रायः 6² + 8² = 100 होता है; तब (5, 12) : 169।",
          "संख्याओं में विषम चुनने के लिए अभाज्य, वर्ग, घन, गुणज और अंकों का योग जाँचिए।",
          "121, 169 वर्ग हैं (11², 13²); 143 = 11 × 13 और 187 = 11 × 17 वर्ग नहीं हैं।",
        ],
      },
      {
        heading: "अक्षर सादृश्य",
        points: [
          "अक्षरों को क्रम-संख्या में बदलिए: A = 1 … Z = 26।",
          "स्थिर अंतर देखिए: ACE : BDF में हर अक्षर +1 है, अतः GIK : HJL।",
          "विपरीत अक्षरों का योग 27 होता है: A–Z, B–Y, C–X, D–W, E–V … M–N।",
          "अक्षर–संख्या मिश्रण: B4 : D16 का अर्थ क्रम-संख्या², अतः F36 : H64।",
          "विषम अक्षर-समूह: अक्षरों के बीच अंतर जाँचिए (जैसे +1+1, +2+2, +1+2+1)।",
        ],
      },
      {
        heading: "वर्गीकरण की विधि",
        points: [
          "श्रेणी के आधार पर समूह बनाइए (फल बनाम फूल, पूर्व बनाम पश्चिम बहने वाली नदी, 2D बनाम 3D आकृति)।",
          "कावेरी, कृष्णा, गोदावरी पूर्व की ओर बहकर बंगाल की खाड़ी में गिरती हैं; नर्मदा पश्चिम की ओर बहती है।",
          "त्रिभुज, वर्ग, पंचभुज 2D हैं; घन 3D है।",
          "यदि दो नियम अलग-अलग विकल्पों को अलग करते हैं, तो अधिक मज़बूत और विशिष्ट नियम चुनिए।",
        ],
      },
    ],
    formulas: [
      "वर्ग 11²–20²: 121, 144, 169, 196, 225, 256, 289, 324, 361, 400",
      "घन 2³–10³: 8, 27, 64, 125, 216, 343, 512, 729, 1000",
      "EJOTY: E = 5, J = 10, O = 15, T = 20, Y = 25",
      "विपरीत अक्षर: X की क्रम-संख्या + उसके विपरीत की क्रम-संख्या = 27",
    ],
    traps: [
      "दूसरे युग्म में संबंध का क्रम उलट देना (औज़ार : कार्यकर्ता बनाम कार्यकर्ता : औज़ार)।",
      "पहले बैठने वाले नियम पर रुक जाना; जाँचिए कि वह तीनों सामान्य पदों पर ठीक-ठीक लागू होता है।",
      "n² पास दिखने के कारण n³ ± 1 के प्रतिरूप छूट जाना।",
      "अक्षरों का अंतर गलत छोर से गिनना, या यह भूलना कि वर्णमाला तभी घूमती है जब बताया गया हो।",
      "343 को वर्ग मान लेना; यह 7³ है।",
    ],
    examTips: [
      "SSC CGL/CHSL/MTS और रेलवे परीक्षाओं में हर पेपर में कई सादृश्य और वर्गीकरण प्रश्न आते हैं।",
      "मिश्रण की अपेक्षा रखिए: शब्द, संख्या, अक्षर और (2, 9), (3, 28) जैसे संख्या-युग्म।",
      "वर्ग, घन और EJOTY याद रखने से यहाँ सबसे अधिक समय बचता है।",
    ],
  },
};

export default notes;
