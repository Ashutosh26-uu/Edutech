import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core method",
      points: [
        "Step 1: draw the frame (row, circle, table, floors, boxes, calendar) before reading clues.",
        "Step 2: place definite clues first (an end seat, a given floor, a fixed day, 'opposite').",
        "Step 3: link clues that share a person; write each uncertain clue as two cases side by side.",
        "Step 4: apply negative clues ('not adjacent', 'not on an even floor') to kill cases.",
        "Step 5: when one case survives, fill the rest and re-check every clue once.",
        "Count unknown 'some persons' puzzles only after fixing everyone named.",
      ],
    },
    {
      heading: "Linear arrangement",
      points: [
        "Facing north: your right is the observer's right (east). Facing south: your right is the observer's left (west).",
        "'Immediate right' means the adjacent seat; 'second to the right' leaves one seat between.",
        "'Between' counts only those strictly in between.",
        "Total in a row: position from left + position from right − 1.",
        "If X is pth from the left and Y is q places right of X (facing north), Y is (p + q)th from the left.",
        "Two parallel rows facing each other: the person opposite you has your right as their left.",
        "Mixed facing: mark an arrow on each person, then read left/right from that arrow.",
      ],
    },
    {
      heading: "Circular and square tables",
      points: [
        "Facing the centre: left = clockwise, right = anticlockwise; facing outward, reverse.",
        "In a circle of n, 'opposite' needs n even; seats are n/2 apart.",
        "If A is m-th to the left and n-th to the right of B, there are m + n persons (when counting from the same person each way).",
        "Square table: corner and side-middle seats may face different ways; read left/right from each person's own facing.",
        "Fix one person at the top of the diagram; rotating the whole circle does not create a new arrangement.",
      ],
    },
    {
      heading: "Floors, boxes, days and attributes",
      points: [
        "Floors and boxes are counted from the bottom (1 = lowest) unless stated.",
        "'Immediately above' means the very next floor; 'above' alone allows gaps.",
        "'Two persons live between A and B' means a gap of three floors.",
        "Flats on a floor (east/west) form a grid: track floor and side separately.",
        "Days/months puzzles: use the calendar order and note dates within a month (12th before 25th).",
        "Designation puzzles: rank order (CEO highest) behaves like floors.",
        "Attribute puzzles (car colour, city, sport): build a table with a column per attribute and tick only definite matches.",
      ],
    },
  ],
  formulas: [
    "Persons in a row = left position + right position − 1",
    "Circle: m-th left and n-th right of the same person ⇒ m + n persons",
    "k persons between two floors ⇒ floor difference k + 1",
  ],
  traps: [
    "Reading 'left' from your own view instead of the person's facing, especially facing south or outward.",
    "Treating 'above' as 'immediately above'.",
    "Fixing a case too early; keep alternatives until a clue rules one out.",
    "Assuming everyone faces the centre when the puzzle says some face outside.",
    "Forgetting that 'between' excludes the two people named.",
  ],
  examTips: [
    "IBPS, SBI PO and clerk mains give large puzzles in sets of five questions; prelims use smaller ones.",
    "Solve the puzzle fully before answering; most questions in a set then take seconds.",
    "SSC and RRB ask single-question linear or circular arrangements; aim for one diagram, no cases.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विधि",
        points: [
          "चरण 1: संकेत पढ़ने से पहले ढाँचा (पंक्ति, वृत्त, तालिका, मंज़िलें, डिब्बे, कैलेंडर) बनाइए।",
          "चरण 2: पहले निश्चित संकेत रखिए (कोई छोर की सीट, दी गई मंज़िल, तय दिन, 'सामने')।",
          "चरण 3: जिन संकेतों में कोई व्यक्ति साझा हो उन्हें जोड़िए; हर अनिश्चित संकेत को दो स्थितियों के रूप में साथ-साथ लिखिए।",
          "चरण 4: स्थितियाँ काटने के लिए नकारात्मक संकेत ('आसन्न नहीं', 'सम मंज़िल पर नहीं') लगाइए।",
          "चरण 5: जब एक स्थिति बचे, तो शेष भरिए और हर संकेत को एक बार फिर जाँचिए।",
          "'कुछ व्यक्ति' वाली अज्ञात संख्या की पहेलियाँ तभी गिनिए जब नामित सभी लोग तय हो जाएँ।",
        ],
      },
      {
        heading: "रैखिक व्यवस्था",
        points: [
          "उत्तर की ओर मुख: आपका दायाँ पर्यवेक्षक का दायाँ (पूर्व) है। दक्षिण की ओर मुख: आपका दायाँ पर्यवेक्षक का बायाँ (पश्चिम) है।",
          "'तुरंत दाएँ' का अर्थ है आसन्न सीट; 'दाएँ से दूसरा' के बीच एक सीट छूटती है।",
          "'बीच में' केवल उन्हें गिनता है जो ठीक बीच में हों।",
          "पंक्ति में कुल: बाएँ से स्थिति + दाएँ से स्थिति − 1।",
          "यदि X बाएँ से p-वाँ है और Y, X के q स्थान दाएँ है (उत्तर की ओर मुख), तो Y बाएँ से (p + q)-वाँ है।",
          "आमने-सामने की दो समानांतर पंक्तियाँ: आपके सामने बैठे व्यक्ति का बायाँ आपका दायाँ होता है।",
          "मिश्रित मुख: हर व्यक्ति पर तीर बनाइए, फिर उस तीर से बाएँ/दाएँ पढ़िए।",
        ],
      },
      {
        heading: "वृत्ताकार और वर्गाकार मेज़",
        points: [
          "केंद्र की ओर मुख: बायाँ = दक्षिणावर्त, दायाँ = वामावर्त; बाहर की ओर मुख हो तो उलटा।",
          "n वाले वृत्त में 'सामने' के लिए n का सम होना आवश्यक है; सीटें n/2 दूरी पर होती हैं।",
          "यदि A, B के m-वें बाएँ और n-वें दाएँ है, तो m + n व्यक्ति होते हैं (जब हर ओर एक ही व्यक्ति से गिना जाए)।",
          "वर्गाकार मेज़: कोने और भुजा-मध्य की सीटों का मुख अलग-अलग हो सकता है; बाएँ/दाएँ हर व्यक्ति के अपने मुख से पढ़िए।",
          "आरेख में एक व्यक्ति को ऊपर स्थिर कीजिए; पूरे वृत्त को घुमाने से नई व्यवस्था नहीं बनती।",
        ],
      },
      {
        heading: "मंज़िलें, डिब्बे, दिन और गुण",
        points: [
          "जब तक न कहा जाए, मंज़िलें और डिब्बे नीचे से गिने जाते हैं (1 = सबसे नीचे)।",
          "'ठीक ऊपर' का अर्थ है अगली ही मंज़िल; केवल 'ऊपर' में अंतर हो सकता है।",
          "'A और B के बीच दो व्यक्ति रहते हैं' का अर्थ है तीन मंज़िलों का अंतर।",
          "एक मंज़िल पर फ़्लैट (पूर्व/पश्चिम) ग्रिड बनाते हैं: मंज़िल और पक्ष अलग-अलग दर्ज कीजिए।",
          "दिन/महीनों की पहेलियाँ: कैलेंडर क्रम का प्रयोग कीजिए और महीने की तिथियाँ ध्यान में रखिए (12 तारीख 25 से पहले)।",
          "पदनाम पहेलियाँ: पद-क्रम (CEO सर्वोच्च) मंज़िलों की तरह व्यवहार करता है।",
          "गुण पहेलियाँ (कार का रंग, शहर, खेल): हर गुण के लिए एक स्तंभ वाली तालिका बनाइए और केवल निश्चित मेल पर निशान लगाइए।",
        ],
      },
    ],
    formulas: [
      "पंक्ति में व्यक्ति = बाएँ की स्थिति + दाएँ की स्थिति − 1",
      "वृत्त: एक ही व्यक्ति के m-वें बाएँ और n-वें दाएँ ⇒ m + n व्यक्ति",
      "दो मंज़िलों के बीच k व्यक्ति ⇒ मंज़िल का अंतर k + 1",
    ],
    traps: [
      "'बायाँ' को अपने दृष्टिकोण से पढ़ना, व्यक्ति के मुख से नहीं, विशेषकर दक्षिण या बाहर की ओर मुख होने पर।",
      "'ऊपर' को 'ठीक ऊपर' मान लेना।",
      "कोई स्थिति बहुत जल्दी तय कर लेना; कोई संकेत एक को काट न दे तब तक विकल्प बनाए रखिए।",
      "पहेली में कुछ का मुख बाहर की ओर बताए जाने पर भी सबका मुख केंद्र की ओर मान लेना।",
      "यह भूलना कि 'बीच में' में नामित दोनों व्यक्ति शामिल नहीं होते।",
    ],
    examTips: [
      "IBPS, SBI PO और क्लर्क मुख्य परीक्षा में पाँच प्रश्नों के समूह में बड़ी पहेलियाँ आती हैं; प्रारंभिक में छोटी।",
      "उत्तर देने से पहले पहेली पूरी हल कीजिए; तब समूह के अधिकांश प्रश्न सेकंडों में हो जाते हैं।",
      "SSC और RRB में एकल प्रश्न वाली रैखिक या वृत्ताकार व्यवस्थाएँ पूछी जाती हैं; एक ही आरेख बनाइए, स्थितियाँ नहीं।",
    ],
  },
};

export default notes;
