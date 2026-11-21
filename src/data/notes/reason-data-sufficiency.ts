import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Standard answer pattern",
      points: [
        "(a) I alone is sufficient, II is not",
        "(b) II alone is sufficient, I is not",
        "(c) Either I alone or II alone is sufficient",
        "(d) Neither alone, but both together are sufficient",
        "(e) Even both together are not sufficient",
        "Read the option wording each time; some papers order these differently",
      ],
    },
    {
      heading: "Method",
      points: [
        "Step 1: test I alone; Step 2: test II alone; Step 3: only if both fail, combine them",
        "You need a single definite answer, not the answer itself; stop once sufficiency is clear",
        "Yes/No questions: sufficient if the answer is always yes or always no",
        "Three statements: check single statements, then pairs, then all three; pick the smallest set that works",
      ],
    },
    {
      heading: "Hidden gaps to watch",
      points: [
        "x² = 9 gives x = ±3, not one value unless sign is fixed",
        "Two equations that are multiples of each other are really one equation",
        "Integer vs real: 'x is an integer' changes what can be decided",
        "Blood relations: unknown gender of the linking person leaves the relation open",
        "Directions: a turn without a starting direction gives no final direction",
        "Ranking: 'taller than B' does not fix order among others",
        "Geometry: area of a square needs one of side, diagonal or perimeter; a right triangle needs a² + b² = c² checked",
      ],
    },
    {
      heading: "Code-language DS",
      points: [
        "Compare two sentences: the common word gets the common code",
        "If a word always appears with another, their codes can never be separated",
        "A code is found only when exactly one unknown word–code pair remains",
      ],
    },
    {
      heading: "Machine input–output",
      points: [
        "Find the rule from Input → Step I → Step II; check it on every element",
        "Common rules: reverse digits, square/divide, sort ascending or descending, move one word per step to the left or right",
        "Word rules: alphabetical order, word length, replacing first/last letter with the next letter",
        "In arrangement machines, untouched elements keep their relative order",
        "To find the input from a later step, reverse the rule step by step",
        "Last step: when no further rearrangement is possible",
      ],
    },
  ],
  traps: [
    "Combining statements before testing each alone, which hides an 'either' answer",
    "Choosing 'either' when only one statement works alone",
    "Missing the negative root or the unknown gender and wrongly calling a statement sufficient",
    "Solving fully when only sufficiency was asked, wasting time",
    "In input–output, assuming the rule from one element without checking the others",
  ],
  examTips: [
    "IBPS/SBI PO mains and RBI Grade B set DS on ranking, relations, directions and codes, often with three statements",
    "Quant DS (arithmetic, profit, speed) appears in bank mains alongside reasoning DS",
    "Input–output sets of five questions come in bank PO mains; ask for a step number, an element position or the input",
  ],
  hi: {
    sections: [
      {
        heading: "मानक उत्तर-प्रतिरूप",
        points: [
          "(a) केवल I पर्याप्त है, II नहीं",
          "(b) केवल II पर्याप्त है, I नहीं",
          "(c) या तो केवल I या केवल II पर्याप्त है",
          "(d) अकेले कोई नहीं, पर दोनों साथ मिलकर पर्याप्त हैं",
          "(e) दोनों साथ मिलकर भी पर्याप्त नहीं हैं",
          "हर बार विकल्पों के शब्द पढ़िए; कुछ पेपरों में इनका क्रम भिन्न होता है",
        ],
      },
      {
        heading: "विधि",
        points: [
          "चरण 1: केवल I जाँचिए; चरण 2: केवल II जाँचिए; चरण 3: दोनों विफल हों तभी उन्हें मिलाइए",
          "आपको एक निश्चित उत्तर मिलना चाहिए, उत्तर का मान नहीं; पर्याप्तता स्पष्ट होते ही रुक जाइए",
          "हाँ/नहीं प्रश्न: पर्याप्त तब, जब उत्तर हमेशा हाँ या हमेशा नहीं हो",
          "तीन कथन: पहले एकल कथन, फिर जोड़े, फिर तीनों जाँचिए; सबसे छोटा काम करने वाला समूह चुनिए",
        ],
      },
      {
        heading: "छिपी कमियाँ जिन पर नज़र रखें",
        points: [
          "x² = 9 से x = ±3 मिलता है, एक मान नहीं, जब तक चिह्न तय न हो",
          "जो दो समीकरण एक-दूसरे के गुणज हों, वे वास्तव में एक ही समीकरण हैं",
          "पूर्णांक बनाम वास्तविक: 'x पूर्णांक है' से तय हो सकने वाली बातें बदल जाती हैं",
          "रक्त संबंध: जोड़ने वाले व्यक्ति का लिंग अज्ञात होने पर संबंध खुला रहता है",
          "दिशाएँ: प्रारंभिक दिशा के बिना मोड़ से अंतिम दिशा नहीं मिलती",
          "क्रमांकन: 'B से लंबा' से अन्य लोगों का क्रम तय नहीं होता",
          "ज्यामिति: वर्ग का क्षेत्रफल निकालने के लिए भुजा, विकर्ण या परिमाप में से एक चाहिए; समकोण त्रिभुज के लिए a² + b² = c² की जाँच चाहिए",
        ],
      },
      {
        heading: "कूट-भाषा DS",
        points: [
          "दो वाक्यों की तुलना कीजिए: उभयनिष्ठ शब्द को उभयनिष्ठ कूट मिलता है",
          "यदि कोई शब्द हमेशा किसी दूसरे के साथ आता है, तो उनके कूट कभी अलग नहीं किए जा सकते",
          "कूट तभी मिलता है जब ठीक एक अज्ञात शब्द–कूट जोड़ा बचे",
        ],
      },
      {
        heading: "मशीन इनपुट–आउटपुट",
        points: [
          "इनपुट → चरण I → चरण II से नियम खोजिए; उसे हर अवयव पर जाँचिए",
          "सामान्य नियम: अंक उलटना, वर्ग/भाग, आरोही या अवरोही क्रम में छाँटना, प्रति चरण एक शब्द बाईं या दाईं ओर ले जाना",
          "शब्द नियम: अकारादि क्रम, शब्द की लंबाई, पहले/अंतिम अक्षर को अगले अक्षर से बदलना",
          "व्यवस्थापन मशीनों में अछूते अवयव अपना सापेक्ष क्रम बनाए रखते हैं",
          "बाद के चरण से इनपुट खोजने के लिए नियम को चरण-दर-चरण उलटिए",
          "अंतिम चरण: जब आगे कोई पुनर्व्यवस्था संभव न हो",
        ],
      },
    ],
    traps: [
      "हर कथन को अलग से परखने से पहले उन्हें मिला देना, जिससे 'या तो' वाला उत्तर छिप जाता है",
      "जब केवल एक कथन अकेले काम करे, तब 'या तो' चुन लेना",
      "ऋणात्मक मूल या अज्ञात लिंग छूट जाना और कथन को गलती से पर्याप्त कह देना",
      "जब केवल पर्याप्तता पूछी गई हो, तब पूरा हल करके समय गँवाना",
      "इनपुट–आउटपुट में दूसरे अवयवों को जाँचे बिना एक अवयव से नियम मान लेना",
    ],
    examTips: [
      "IBPS/SBI PO मुख्य परीक्षा और RBI Grade B में DS क्रमांकन, संबंधों, दिशाओं और कूटों पर आता है, प्रायः तीन कथनों के साथ",
      "बैंक मुख्य परीक्षा में रीज़निंग DS के साथ क्वांट DS (अंकगणित, लाभ, चाल) भी आता है",
      "बैंक PO मुख्य परीक्षा में पाँच प्रश्नों के इनपुट–आउटपुट समूह आते हैं; वे चरण संख्या, अवयव की स्थिति या इनपुट पूछते हैं",
    ],
  },
};

export default notes;
