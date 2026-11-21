import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Development principles",
      points: [
        "Development is continuous, sequential, and follows a predictable pattern, but its rate differs between children.",
        "Cephalocaudal: head to toe; proximodistal: centre of body outwards.",
        "Growth is quantitative (height, weight); development is qualitative and lifelong.",
        "Heredity and environment both shape development; they interact rather than compete.",
      ],
    },
    {
      heading: "Piaget: cognitive development",
      points: [
        "Sensorimotor (0–2): object permanence develops.",
        "Pre-operational (2–7): symbolic play, egocentrism, animism, no conservation.",
        "Concrete operational (7–11): conservation, reversibility, logic on concrete things.",
        "Formal operational (11+): abstract and hypothetical thinking.",
        "Key terms: schema, assimilation, accommodation, equilibration. Child is an active constructor of knowledge.",
      ],
    },
    {
      heading: "Vygotsky, Kohlberg, Erikson",
      points: [
        "Vygotsky: learning is social; ZPD = gap between what a child does alone and with help; scaffolding = temporary support.",
        "Vygotsky: private speech guides thinking; language drives cognitive growth.",
        "Kohlberg: 3 levels, 6 stages – pre-conventional, conventional, post-conventional.",
        "Kohlberg’s “good boy–good girl” orientation is stage 3, in the conventional level.",
        "Erikson: 8 psychosocial stages; Industry vs Inferiority covers roughly 6–12 years.",
      ],
    },
    {
      heading: "Learning theories",
      points: [
        "Pavlov: classical conditioning (dog, bell, salivation).",
        "Thorndike: trial and error; laws of readiness, exercise and effect.",
        "Skinner: operant conditioning, reinforcement (positive and negative).",
        "Kohler: insight learning (Gestalt, chimpanzee Sultan). Bandura: observational/social learning (Bobo doll).",
        "Chomsky: innate Language Acquisition Device (LAD).",
      ],
    },
    {
      heading: "Intelligence and inclusion",
      points: [
        "Binet–Simon: first intelligence test. IQ = (mental age ÷ chronological age) × 100.",
        "Spearman: two-factor theory (g and s). Gardner: multiple intelligences. Sternberg: triarchic theory.",
        "Gifted: IQ roughly above 130; giftedness also includes creativity and commitment.",
        "Dyslexia: reading; dysgraphia: writing; dyscalculia: maths; dyspraxia: motor coordination.",
        "Inclusive education: all children, including those with disabilities, learn together in regular classrooms.",
      ],
    },
    {
      heading: "Assessment and RTE",
      points: [
        "Formative assessment: during teaching, to improve learning (quizzes, observation, feedback).",
        "Summative assessment: at the end of a unit or term, to grade.",
        "RTE Act 2009 came into force on 1 April 2010; free and compulsory education for ages 6–14.",
        "Section 12(1)(c): 25% seats at entry level in private unaided schools for disadvantaged children.",
        "NCF 2005 stresses learning without burden and linking knowledge to life outside school.",
      ],
    },
  ],
  formulas: [
    "Piaget: 0–2 sensorimotor, 2–7 pre-operational, 7–11 concrete, 11+ formal",
    "IQ = (MA ÷ CA) × 100",
    "Kohlberg: 3 levels × 2 stages = 6 stages",
    "RTE: ages 6–14, in force 1 April 2010, 25% seats under 12(1)(c)",
  ],
  traps: [
    "Giving ZPD to Piaget; it is Vygotsky’s idea.",
    "Mixing Thorndike (law of effect) with Skinner (operant conditioning).",
    "Treating formative assessment as end-of-term testing.",
    "Placing conservation in the pre-operational stage; it arrives in concrete operational.",
    "Calling RTE an amendment year; Article 21A came via the 86th Amendment (2002), the Act itself is 2009.",
  ],
  examTips: [
    "CTET Paper I and II each carry a 30-mark CDP section; scenario-based pedagogy questions dominate.",
    "Match-the-pair (thinker and theory) and statement-count items are common.",
    "In classroom scenarios, choose the child-centred, inclusive, non-punitive option.",
  ],
  hi: {
    sections: [
      {
        heading: "विकास के सिद्धांत",
        points: [
          "विकास सतत, क्रमिक होता है और पूर्वानुमेय प्रतिरूप का अनुसरण करता है, पर उसकी दर बच्चों में भिन्न होती है।",
          "शीर्ष-पदाभिमुख (सेफ़ालोकॉडल): सिर से पैर की ओर; निकट-दूराभिमुख (प्रॉक्सिमोडिस्टल): शरीर के केंद्र से बाहर की ओर।",
          "वृद्धि मात्रात्मक है (ऊँचाई, भार); विकास गुणात्मक और आजीवन है।",
          "आनुवंशिकता और पर्यावरण दोनों विकास को आकार देते हैं; वे प्रतिस्पर्धा नहीं, परस्पर अंतःक्रिया करते हैं।",
        ],
      },
      {
        heading: "पियाजे: संज्ञानात्मक विकास",
        points: [
          "संवेदी-गामक (0–2): वस्तु स्थायित्व विकसित होता है।",
          "पूर्व-संक्रियात्मक (2–7): प्रतीकात्मक खेल, अहंकेंद्रिता, जीववाद, संरक्षण नहीं।",
          "मूर्त संक्रियात्मक (7–11): संरक्षण, उत्क्रमणीयता, मूर्त वस्तुओं पर तर्क।",
          "औपचारिक संक्रियात्मक (11+): अमूर्त और काल्पनिक चिंतन।",
          "मुख्य शब्द: स्कीमा, आत्मसात्करण, समायोजन, साम्यधारण। बालक ज्ञान का सक्रिय निर्माता है।",
        ],
      },
      {
        heading: "वाइगोत्स्की, कोहलबर्ग, एरिक्सन",
        points: [
          "वाइगोत्स्की: अधिगम सामाजिक है; ZPD = बच्चा अकेले जो कर सकता है और सहायता से जो कर सकता है, उसके बीच का अंतर; पाड़ (स्कैफ़ोल्डिंग) = अस्थायी सहारा।",
          "वाइगोत्स्की: निजी भाषण चिंतन का मार्गदर्शन करता है; भाषा संज्ञानात्मक विकास को आगे बढ़ाती है।",
          "कोहलबर्ग: 3 स्तर, 6 अवस्थाएँ – पूर्व-परंपरागत, परंपरागत, उत्तर-परंपरागत।",
          "कोहलबर्ग का “अच्छा लड़का–अच्छी लड़की” अभिमुखन तीसरी अवस्था है, जो परंपरागत स्तर में आती है।",
          "एरिक्सन: 8 मनोसामाजिक अवस्थाएँ; उद्यमशीलता बनाम हीनता लगभग 6–12 वर्ष को कवर करती है।",
        ],
      },
      {
        heading: "अधिगम के सिद्धांत",
        points: [
          "पावलोव: शास्त्रीय अनुबंधन (कुत्ता, घंटी, लार स्राव)।",
          "थॉर्नडाइक: प्रयास और त्रुटि; तत्परता, अभ्यास और प्रभाव के नियम।",
          "स्किनर: क्रियाप्रसूत अनुबंधन, पुनर्बलन (धनात्मक और ऋणात्मक)।",
          "कोहलर: अंतर्दृष्टि अधिगम (गेस्टाल्ट, चिंपैंज़ी सुल्तान)। बंडूरा: अवलोकनात्मक/सामाजिक अधिगम (बोबो डॉल)।",
          "चॉम्स्की: जन्मजात भाषा अर्जन युक्ति (LAD)।",
        ],
      },
      {
        heading: "बुद्धि और समावेशन",
        points: [
          "बिने–साइमन: पहला बुद्धि परीक्षण। IQ = (मानसिक आयु ÷ कालानुक्रमिक आयु) × 100।",
          "स्पीयरमैन: द्विकारक सिद्धांत (g और s)। गार्डनर: बहुबुद्धि सिद्धांत। स्टर्नबर्ग: त्रिचापीय सिद्धांत।",
          "प्रतिभाशाली: IQ लगभग 130 से ऊपर; प्रतिभा में सृजनात्मकता और प्रतिबद्धता भी शामिल हैं।",
          "डिस्लेक्सिया: पठन; डिसग्राफ़िया: लेखन; डिस्कैल्कुलिया: गणित; डिस्प्रैक्सिया: गामक समन्वय।",
          "समावेशी शिक्षा: विकलांगता वाले बच्चों सहित सभी बच्चे सामान्य कक्षाओं में साथ-साथ सीखते हैं।",
        ],
      },
      {
        heading: "आकलन और RTE",
        points: [
          "रचनात्मक आकलन: शिक्षण के दौरान, अधिगम सुधारने के लिए (प्रश्नोत्तरी, अवलोकन, प्रतिपुष्टि)।",
          "योगात्मक आकलन: इकाई या सत्र के अंत में, श्रेणी निर्धारण के लिए।",
          "RTE अधिनियम 2009 1 अप्रैल 2010 को लागू हुआ; 6–14 आयु वर्ग के लिए निःशुल्क और अनिवार्य शिक्षा।",
          "धारा 12(1)(ग): निजी गैर-सहायता प्राप्त विद्यालयों में प्रवेश स्तर पर वंचित वर्ग के बच्चों के लिए 25% सीटें।",
          "NCF 2005 बिना बोझ के सीखने और ज्ञान को विद्यालय के बाहर के जीवन से जोड़ने पर बल देता है।",
        ],
      },
    ],
    formulas: [
      "पियाजे: 0–2 संवेदी-गामक, 2–7 पूर्व-संक्रियात्मक, 7–11 मूर्त, 11+ औपचारिक",
      "IQ = (MA ÷ CA) × 100",
      "कोहलबर्ग: 3 स्तर × 2 अवस्थाएँ = 6 अवस्थाएँ",
      "RTE: आयु 6–14, 1 अप्रैल 2010 से लागू, 12(1)(ग) के तहत 25% सीटें",
    ],
    traps: [
      "ZPD को पियाजे से जोड़ना; यह वाइगोत्स्की की संकल्पना है।",
      "थॉर्नडाइक (प्रभाव का नियम) को स्किनर (क्रियाप्रसूत अनुबंधन) से मिला देना।",
      "रचनात्मक आकलन को सत्र-अंत की परीक्षा मानना।",
      "संरक्षण को पूर्व-संक्रियात्मक अवस्था में रखना; यह मूर्त संक्रियात्मक में आता है।",
      "RTE को संशोधन का वर्ष कहना; अनुच्छेद 21A 86वें संशोधन (2002) से आया, अधिनियम स्वयं 2009 का है।",
    ],
    examTips: [
      "CTET के पेपर I और II में प्रत्येक में 30 अंक का CDP खंड होता है; परिदृश्य-आधारित शिक्षाशास्त्र प्रश्न प्रमुख होते हैं।",
      "सुमेलन (चिंतक और सिद्धांत) और कथन-गणना प्रश्न आम हैं।",
      "कक्षा के परिदृश्यों में बाल-केंद्रित, समावेशी, दंड-रहित विकल्प चुनें।",
    ],
  },
};

export default notes;
