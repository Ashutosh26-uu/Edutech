import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Sketch every move on rough paper with north at the top, east to the right.",
        "Left and right depend on the direction the person is currently facing.",
        "Answer “how far from start” with net displacement, not total path walked.",
      ],
    },
    {
      heading: "The eight directions",
      points: [
        "Main: N, E, S, W; corners: NE, SE, SW, NW (each 45° from the main ones).",
        "Opposite pairs: N–S, E–W, NE–SW, NW–SE.",
        "Facing N: right = E, left = W. Facing S: right = W, left = E.",
        "Facing E: right = S, left = N. Facing W: right = N, left = S.",
      ],
    },
    {
      heading: "Turns and rotation",
      points: [
        "Right turn = 90° clockwise; left turn = 90° anticlockwise.",
        "180° turn: face the opposite direction, whichever way you rotate.",
        "Clockwise order: N → NE → E → SE → S → SW → W → NW → N.",
        "Net rotation trick: add clockwise turns, subtract anticlockwise ones, then reduce mod 360°.",
      ],
    },
    {
      heading: "Distance from start",
      points: [
        "Step 1: total all east moves minus west moves (net horizontal).",
        "Step 2: total all north moves minus south moves (net vertical).",
        "Step 3: distance = √(horizontal² + vertical²).",
        "Final direction: combine the two signs, e.g. net east and net north ⇒ north-east of start.",
        "If one net is zero, the person is due N/S/E/W of the start.",
      ],
    },
    {
      heading: "Shadows and clocks",
      points: [
        "Morning: sun in the east, shadow falls west. Evening: sun in the west, shadow falls east.",
        "At noon (in India) the shadow is almost absent; questions avoid noon.",
        "Morning shadow to your left ⇒ you face north; to your right ⇒ you face south.",
        "Evening shadow to your right ⇒ you face north; to your left ⇒ you face south.",
        "Clock questions: fix the direction of one numeral (e.g. 3 points east), then rotate the dial 30° per hour mark.",
      ],
    },
  ],
  formulas: [
    "Distance = √(net E–W² + net N–S²)",
    "Pythagorean triples: 3-4-5, 6-8-10, 5-12-13, 8-15-17, 9-12-15, 7-24-25",
    "Diagonal of a square of side a = a√2",
    "One clock mark = 30°; minute hand moves 6° per minute",
  ],
  traps: [
    "Using total distance walked instead of shortest distance from start.",
    "Taking “left” as west regardless of facing direction.",
    "Mixing the shadow rule: morning shadow points west, not east.",
    "Reporting the start’s direction from the person when asked the person’s direction from the start (they are opposite).",
    "Forgetting that repeated left turns can bring the person back on a parallel line.",
  ],
  examTips: [
    "SSC, railway and bank prelims ask 1–3 questions: plain walks, turns, shadows and point-to-point grids.",
    "Bank papers use “point P is 4 m north of Q…” grids with 6–8 points; draw the whole grid once.",
    "Learn the common triples so the √ step takes no time.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "हर गति को कच्चे कागज़ पर बनाइए, उत्तर ऊपर और पूर्व दाईं ओर रखते हुए।",
          "बाएँ और दाएँ उस दिशा पर निर्भर हैं जिस ओर व्यक्ति उस समय मुख किए है।",
          "“प्रारंभ से कितनी दूर” का उत्तर कुल चले पथ से नहीं, शुद्ध विस्थापन से दीजिए।",
        ],
      },
      {
        heading: "आठ दिशाएँ",
        points: [
          "मुख्य: N, E, S, W; कोणीय: NE, SE, SW, NW (मुख्य दिशाओं से 45° पर)।",
          "विपरीत जोड़े: N–S, E–W, NE–SW, NW–SE।",
          "उत्तर की ओर मुख: दाएँ = पूर्व, बाएँ = पश्चिम। दक्षिण की ओर मुख: दाएँ = पश्चिम, बाएँ = पूर्व।",
          "पूर्व की ओर मुख: दाएँ = दक्षिण, बाएँ = उत्तर। पश्चिम की ओर मुख: दाएँ = उत्तर, बाएँ = दक्षिण।",
        ],
      },
      {
        heading: "मोड़ और घूर्णन",
        points: [
          "दाएँ मोड़ = 90° दक्षिणावर्त (घड़ी की दिशा में); बाएँ मोड़ = 90° वामावर्त।",
          "180° का मोड़: किसी भी ओर घूमें, मुख विपरीत दिशा में हो जाता है।",
          "दक्षिणावर्त क्रम: N → NE → E → SE → S → SW → W → NW → N।",
          "शुद्ध घूर्णन की युक्ति: दक्षिणावर्त मोड़ जोड़िए, वामावर्त घटाइए, फिर mod 360° कीजिए।",
        ],
      },
      {
        heading: "प्रारंभ से दूरी",
        points: [
          "चरण 1: सभी पूर्व की गतियों का योग घटा पश्चिम की गतियों का योग (शुद्ध क्षैतिज)।",
          "चरण 2: सभी उत्तर की गतियों का योग घटा दक्षिण की गतियों का योग (शुद्ध ऊर्ध्वाधर)।",
          "चरण 3: दूरी = √(क्षैतिज² + ऊर्ध्वाधर²)।",
          "अंतिम दिशा: दोनों चिह्न मिलाइए, जैसे शुद्ध पूर्व और शुद्ध उत्तर ⇒ प्रारंभ से उत्तर-पूर्व।",
          "यदि एक शुद्ध मान शून्य हो, तो व्यक्ति प्रारंभ से ठीक उत्तर/दक्षिण/पूर्व/पश्चिम में है।",
        ],
      },
      {
        heading: "छाया और घड़ियाँ",
        points: [
          "सुबह: सूर्य पूर्व में, छाया पश्चिम की ओर पड़ती है। शाम: सूर्य पश्चिम में, छाया पूर्व की ओर पड़ती है।",
          "दोपहर (भारत में) छाया लगभग नहीं होती; प्रश्न दोपहर से बचते हैं।",
          "सुबह की छाया आपके बाईं ओर ⇒ आपका मुख उत्तर की ओर; दाईं ओर ⇒ मुख दक्षिण की ओर।",
          "शाम की छाया आपके दाईं ओर ⇒ आपका मुख उत्तर की ओर; बाईं ओर ⇒ मुख दक्षिण की ओर।",
          "घड़ी के प्रश्न: एक अंक की दिशा तय कीजिए (जैसे 3 पूर्व की ओर है), फिर प्रति घंटा-निशान 30° के हिसाब से डायल घुमाइए।",
        ],
      },
    ],
    formulas: [
      "दूरी = √(शुद्ध E–W² + शुद्ध N–S²)",
      "पाइथागोरस त्रिक: 3-4-5, 6-8-10, 5-12-13, 8-15-17, 9-12-15, 7-24-25",
      "भुजा a वाले वर्ग का विकर्ण = a√2",
      "घड़ी का एक निशान = 30°; मिनट की सुई प्रति मिनट 6° चलती है",
    ],
    traps: [
      "प्रारंभ से सबसे छोटी दूरी की जगह चली गई कुल दूरी लेना।",
      "मुख की दिशा देखे बिना “बाएँ” को हमेशा पश्चिम मान लेना।",
      "छाया का नियम गड़बड़ाना: सुबह की छाया पश्चिम की ओर होती है, पूर्व की ओर नहीं।",
      "जब व्यक्ति की प्रारंभ से दिशा पूछी हो, तब व्यक्ति से प्रारंभ की दिशा बता देना (वे विपरीत हैं)।",
      "यह भूलना कि बार-बार बाएँ मुड़ने से व्यक्ति समानांतर रेखा पर लौट सकता है।",
    ],
    examTips: [
      "SSC, रेलवे और बैंक प्रारंभिक परीक्षाओं में 1–3 प्रश्न आते हैं: सीधी यात्राएँ, मोड़, छाया और बिंदु-से-बिंदु ग्रिड।",
      "बैंक पेपरों में “बिंदु P, Q से 4 m उत्तर में है…” जैसे 6–8 बिंदुओं वाले ग्रिड आते हैं; पूरा ग्रिड एक बार बनाइए।",
      "सामान्य त्रिक याद रखिए ताकि √ वाले चरण में समय न लगे।",
    ],
  },
};

export default notes;
