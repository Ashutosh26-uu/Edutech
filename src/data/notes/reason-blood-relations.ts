import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Every question links people through a chain; decode one link at a time and draw it.",
        "Mark males with +, females with −, couples with a double line (=), siblings on one level with a dash.",
        "Keep generations on separate rows: grandparents on top, then parents, then children.",
        "Never assume gender from a name; use only words like son, sister, husband, he/she.",
      ],
    },
    {
      heading: "Relation vocabulary",
      points: [
        "Father’s or mother’s brother: uncle; their sister: aunt.",
        "Brother’s or sister’s son: nephew; daughter: niece.",
        "Uncle’s or aunt’s child: cousin (same generation as you).",
        "Spouse’s parents: father-in-law, mother-in-law; spouse’s brother or sister’s husband: brother-in-law.",
        "Son’s wife: daughter-in-law; daughter’s husband: son-in-law.",
        "Father’s father: paternal grandfather; mother’s father: maternal grandfather.",
        "Only son of my grandfather (paternal) = my father; only daughter of my maternal grandfather = my mother.",
      ],
    },
    {
      heading: "Pointing / introducing questions",
      points: [
        "Split the sentence into “speaker” and “the person pointed at”.",
        "Start from the end of the description (“my …”) and work backwards to the speaker.",
        "Example: “son of my grandfather’s only son” → grandfather’s only son = father → father’s son = brother (or self).",
        "“My mother’s only son” refers to the speaker himself if the speaker is male.",
      ],
    },
    {
      heading: "Coded relations",
      points: [
        "Write the code meanings in a table first (e.g. @ = father, # = sister, $ = son).",
        "Read the expression left to right, drawing each link on the tree.",
        "For “which expression shows X is Y’s aunt”, test each option and check every gender is fixed.",
        "A relation is definite only if the genders and generations needed are all known.",
      ],
    },
    {
      heading: "Generations and mixed questions",
      points: [
        "Count rows on the tree to find generation gaps (grandparent to grandchild = 2 gaps).",
        "Puzzle-type sets: list couples first, then place children under them.",
        "Some sets mix direction with relations; solve the relation part first, then the distance.",
      ],
    },
  ],
  formulas: [
    "Father’s/mother’s brother = uncle; father’s/mother’s sister = aunt",
    "Sibling’s son = nephew; sibling’s daughter = niece",
    "Same generation as you: brother, sister, cousin, spouse, brother-in-law, sister-in-law",
    "One generation up: parents, uncles, aunts, parents-in-law",
  ],
  traps: [
    "Assuming B is male because the name sounds male; use “son or daughter” when gender is unknown.",
    "Calling father’s sister’s husband “father-in-law”; he is your uncle.",
    "Forgetting that “only son” of your parents can be the speaker himself.",
    "Mixing up direction of the relation: “A is B’s uncle” is not the same as “B is A’s uncle”.",
    "Reading coded expressions right to left; always go in the stated order.",
  ],
  examTips: [
    "SSC, banking and railway papers ask 2–3 questions: direct, pointing-type and coded-type.",
    "Bank mains favour family puzzles with 6–8 members and multiple conditions.",
    "Always draw the tree; mental tracking fails on three-step chains.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "हर प्रश्न लोगों को एक शृंखला से जोड़ता है; एक-एक कड़ी खोलिए और उसका चित्र बनाइए।",
          "पुरुष को +, महिला को −, दंपती को दोहरी रेखा (=) और एक ही स्तर के भाई-बहनों को डैश से दिखाइए।",
          "पीढ़ियों को अलग पंक्तियों में रखिए: ऊपर दादा-दादी, फिर माता-पिता, फिर बच्चे।",
          "नाम से लिंग का अनुमान कभी न लगाइए; केवल बेटा, बहन, पति, वह (he/she) जैसे शब्दों का प्रयोग कीजिए।",
        ],
      },
      {
        heading: "संबंध शब्दावली",
        points: [
          "पिता या माता का भाई: चाचा/मामा (uncle); उनकी बहन: बुआ/मौसी (aunt)।",
          "भाई या बहन का पुत्र: भतीजा/भांजा (nephew); पुत्री: भतीजी/भांजी (niece)।",
          "चाचा-मामा या बुआ-मौसी की संतान: चचेरा/ममेरा भाई-बहन (cousin) (आपकी ही पीढ़ी का)।",
          "पति/पत्नी के माता-पिता: ससुर, सास; पति/पत्नी का भाई या बहन का पति: साला/जीजा/बहनोई (brother-in-law)।",
          "पुत्र की पत्नी: पुत्रवधू (बहू); पुत्री का पति: दामाद।",
          "पिता के पिता: पितामह (दादा); माता के पिता: मातामह (नाना)।",
          "मेरे दादा का इकलौता पुत्र (पैतृक) = मेरे पिता; मेरे नाना की इकलौती पुत्री = मेरी माता।",
        ],
      },
      {
        heading: "इंगित / परिचय वाले प्रश्न",
        points: [
          "वाक्य को “वक्ता” और “जिसकी ओर संकेत है” में बाँटिए।",
          "विवरण के अंत (“मेरा …”) से शुरू करके वक्ता तक पीछे की ओर चलिए।",
          "उदाहरण: “मेरे दादा के इकलौते पुत्र का पुत्र” → दादा का इकलौता पुत्र = पिता → पिता का पुत्र = भाई (या स्वयं)।",
          "“मेरी माता का इकलौता पुत्र” वक्ता स्वयं है, यदि वक्ता पुरुष है।",
        ],
      },
      {
        heading: "कूटबद्ध संबंध",
        points: [
          "पहले कोड के अर्थ तालिका में लिखिए (जैसे @ = पिता, # = बहन, $ = पुत्र)।",
          "व्यंजक को बाएँ से दाएँ पढ़िए और हर कड़ी वृक्ष में बनाइए।",
          "“कौन-सा व्यंजक दर्शाता है कि X, Y की बुआ/मौसी है” में हर विकल्प जाँचिए और देखिए कि हर व्यक्ति का लिंग निश्चित है।",
          "संबंध तभी निश्चित है जब आवश्यक लिंग और पीढ़ियाँ सभी ज्ञात हों।",
        ],
      },
      {
        heading: "पीढ़ियाँ और मिश्रित प्रश्न",
        points: [
          "पीढ़ियों का अंतर जानने के लिए वृक्ष की पंक्तियाँ गिनिए (दादा-दादी से पोते-पोती तक 2 अंतर)।",
          "पहेली-प्रकार के समूह: पहले दंपतियों को लिखिए, फिर उनके नीचे बच्चों को रखिए।",
          "कुछ समूहों में दिशा और संबंध मिले होते हैं; पहले संबंध वाला भाग हल कीजिए, फिर दूरी।",
        ],
      },
    ],
    formulas: [
      "पिता/माता का भाई = चाचा/मामा; पिता/माता की बहन = बुआ/मौसी",
      "भाई-बहन का पुत्र = भतीजा/भांजा; भाई-बहन की पुत्री = भतीजी/भांजी",
      "आपकी पीढ़ी के: भाई, बहन, चचेरे/ममेरे भाई-बहन, जीवनसाथी, साला/बहनोई (brother-in-law), भाभी/साली (sister-in-law)",
      "एक पीढ़ी ऊपर: माता-पिता, चाचा-मामा, बुआ-मौसी, सास-ससुर",
    ],
    traps: [
      "नाम पुरुष जैसा लगने पर B को पुरुष मान लेना; लिंग अज्ञात होने पर “पुत्र या पुत्री” कहिए।",
      "पिता की बहन के पति को “ससुर” कहना; वह आपके फूफा (uncle) हैं।",
      "यह भूल जाना कि आपके माता-पिता का “इकलौता पुत्र” वक्ता स्वयं भी हो सकता है।",
      "संबंध की दिशा गड़बड़ा देना: “A, B का चाचा है” और “B, A का चाचा है” एक नहीं हैं।",
      "कूटबद्ध व्यंजक को दाएँ से बाएँ पढ़ना; हमेशा दिए गए क्रम में चलिए।",
    ],
    examTips: [
      "SSC, बैंकिंग और रेलवे पेपरों में 2–3 प्रश्न आते हैं: सीधे, इंगित-प्रकार और कूट-प्रकार।",
      "बैंक मुख्य परीक्षा में 6–8 सदस्यों और कई शर्तों वाली पारिवारिक पहेलियाँ अधिक आती हैं।",
      "वृक्ष हमेशा बनाइए; तीन चरणों की शृंखला में मन ही मन हिसाब रखना विफल होता है।",
    ],
  },
};

export default notes;
