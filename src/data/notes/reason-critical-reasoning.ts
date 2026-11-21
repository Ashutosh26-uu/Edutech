import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Statement and assumption",
      points: [
        "An assumption is unstated and taken for granted by the person making the statement",
        "Advertisements assume people want the promised benefit and that the advert will influence them",
        "Notices and appeals assume people will respond or that the step will work",
        "Negation test: if the opposite of the assumption makes the statement pointless, it is implicit",
        "Extreme words (only, all, always, best) usually make an assumption non-implicit",
      ],
    },
    {
      heading: "Statement and conclusion / inference",
      points: [
        "A conclusion must follow directly from the statement, with no outside facts",
        "'Most' does not mean 'all'; 'some' does not mean 'not all'",
        "'Only those who X' gives a necessary condition: everyone eligible has X, not everyone with X is chosen",
        "Inference grading: definitely true, probably true, data inadequate, probably false, definitely false",
        "'Data inadequate' when the passage neither supports nor denies the inference",
      ],
    },
    {
      heading: "Arguments: strong or weak",
      points: [
        "Strong: relevant, important, directly linked to the question and backed by reason",
        "Weak: ambiguous, emotional, based on examples from elsewhere, or claiming 'only way'",
        "A 'Yes' or 'No' that just restates the question is weak",
        "Both a 'Yes' and a 'No' argument can be strong at the same time",
      ],
    },
    {
      heading: "Course of action",
      points: [
        "A valid action is practical, legal, proportionate and tackles the problem or its cause",
        "Immediate relief (treat patients, clean up) and long-term prevention can both follow",
        "Extreme steps (ban, close down, dismiss everyone) rarely follow",
        "An action that only punishes after the fact, without solving the problem, is usually rejected",
      ],
    },
    {
      heading: "Cause and effect; strengthen and weaken",
      points: [
        "Options: I causes II, II causes I, both independent causes, both effects of a common cause, or effects of independent causes",
        "The cause usually happens earlier; check time order and logical link",
        "Strengthen: new evidence that supports the link between evidence and conclusion",
        "Weaken: another explanation, a counter-example or a flaw in the sample",
        "Correlation is not causation (breakfast and higher marks may share a common cause)",
      ],
    },
  ],
  traps: [
    "Using general knowledge to accept a conclusion the statement does not support",
    "Treating 'only those' as a guarantee that everyone meeting the condition is selected",
    "Accepting harsh actions such as bans as 'logical' because they sound decisive",
    "Rejecting a strong argument because you disagree with its side",
    "Assuming two events are linked as cause and effect only because they happen together",
  ],
  examTips: [
    "IBPS/SBI PO mains and RBI Grade B ask assumption, course of action, inference and strengthen/weaken in sets",
    "SSC CGL and CHSL prefer statement–conclusion and statement–assumption with two options",
    "Answer patterns: only I, only II, either I or II, neither, both; check each option independently first",
  ],
  hi: {
    sections: [
      {
        heading: "कथन और पूर्वधारणा",
        points: [
          "पूर्वधारणा (Assumption) वह है जो कही नहीं गई होती और कथन करने वाला व्यक्ति उसे मानकर चलता है",
          "विज्ञापन मानते हैं कि लोग वादा किया गया लाभ चाहते हैं और विज्ञापन उन्हें प्रभावित करेगा",
          "सूचनाएँ और अपीलें मानती हैं कि लोग प्रतिक्रिया देंगे या वह कदम कारगर होगा",
          "निषेध परीक्षण: यदि पूर्वधारणा का उलटा कथन को निरर्थक बना दे, तो वह निहित है",
          "चरम शब्द (केवल, सभी, हमेशा, सर्वश्रेष्ठ) प्रायः पूर्वधारणा को निहित नहीं रहने देते",
        ],
      },
      {
        heading: "कथन और निष्कर्ष / अनुमान",
        points: [
          "निष्कर्ष कथन से सीधे निकलना चाहिए, बाहरी तथ्यों के बिना",
          "'अधिकांश' का अर्थ 'सभी' नहीं है; 'कुछ' का अर्थ 'सभी नहीं' नहीं है",
          "'केवल वे जो X' आवश्यक शर्त देता है: हर पात्र व्यक्ति के पास X है, पर X वाले हर व्यक्ति का चयन नहीं होता",
          "अनुमान का श्रेणीकरण: निश्चित रूप से सत्य, संभवतः सत्य, आँकड़े अपर्याप्त, संभवतः असत्य, निश्चित रूप से असत्य",
          "'आँकड़े अपर्याप्त' तब, जब गद्यांश अनुमान का न समर्थन करे न खंडन",
        ],
      },
      {
        heading: "तर्क: सशक्त या कमज़ोर",
        points: [
          "सशक्त: प्रासंगिक, महत्त्वपूर्ण, प्रश्न से सीधे जुड़ा और कारण द्वारा समर्थित",
          "कमज़ोर: अस्पष्ट, भावनात्मक, कहीं और के उदाहरणों पर आधारित, या 'एकमात्र उपाय' का दावा करने वाला",
          "जो 'हाँ' या 'नहीं' केवल प्रश्न को दोहराए, वह कमज़ोर है",
          "'हाँ' और 'नहीं' दोनों तर्क एक साथ सशक्त हो सकते हैं",
        ],
      },
      {
        heading: "कार्यवाही का मार्ग",
        points: [
          "उचित कार्यवाही व्यावहारिक, वैध, अनुपातिक होती है और समस्या या उसके कारण को सुलझाती है",
          "तात्कालिक राहत (मरीज़ों का इलाज, सफ़ाई) और दीर्घकालिक रोकथाम दोनों अनुसरण हो सकते हैं",
          "चरम कदम (प्रतिबंध, बंद करना, सबको बर्खास्त करना) शायद ही अनुसरण करते हैं",
          "जो कार्यवाही समस्या सुलझाए बिना केवल बाद में दंड दे, वह प्रायः अस्वीकार होती है",
        ],
      },
      {
        heading: "कारण और प्रभाव; सुदृढ़ और दुर्बल करना",
        points: [
          "विकल्प: I, II का कारण है, II, I का कारण है, दोनों स्वतंत्र कारण हैं, दोनों किसी उभयनिष्ठ कारण के प्रभाव हैं, या स्वतंत्र कारणों के प्रभाव हैं",
          "कारण प्रायः पहले घटित होता है; समय-क्रम और तार्किक संबंध जाँचिए",
          "सुदृढ़ करना: नया प्रमाण जो साक्ष्य और निष्कर्ष के बीच के संबंध का समर्थन करे",
          "दुर्बल करना: कोई अन्य व्याख्या, प्रति-उदाहरण या प्रतिदर्श में दोष",
          "सहसंबंध कारण नहीं है (नाश्ता और अधिक अंकों का कोई उभयनिष्ठ कारण हो सकता है)",
        ],
      },
    ],
    traps: [
      "सामान्य ज्ञान से ऐसा निष्कर्ष स्वीकार कर लेना जिसे कथन समर्थन नहीं देता",
      "'केवल वे' को इस बात की गारंटी मान लेना कि शर्त पूरी करने वाले सभी चुने जाएँगे",
      "प्रतिबंध जैसी कठोर कार्यवाहियों को निर्णायक लगने के कारण 'तर्कसंगत' मान लेना",
      "किसी सशक्त तर्क को इसलिए अस्वीकार करना कि आप उसके पक्ष से असहमत हैं",
      "दो घटनाएँ साथ होने मात्र से उन्हें कारण-प्रभाव मान लेना",
    ],
    examTips: [
      "IBPS/SBI PO मुख्य परीक्षा और RBI Grade B में पूर्वधारणा, कार्यवाही का मार्ग, अनुमान और सुदृढ़/दुर्बल करना समूहों में आते हैं",
      "SSC CGL और CHSL में दो विकल्पों वाले कथन–निष्कर्ष और कथन–पूर्वधारणा अधिक आते हैं",
      "उत्तर-प्रतिरूप: केवल I, केवल II, I या II में से कोई एक, न तो I न II, दोनों; पहले हर विकल्प को अलग से जाँचिए",
    ],
  },
};

export default notes;
