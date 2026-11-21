import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Direct inequalities: how to read a chain",
      points: [
        "Two terms are comparable only if the path between them keeps one direction: all of >, ≥, = or all of <, ≤, =",
        "Opposite signs on the path (A > B < C or A ≤ B ≥ C) mean no relation between the end terms",
        "If the path has at least one strict sign (> or <), the result is strict: A ≥ B > C = D gives A > D",
        "If the path has only ≥ and =, the result is ≥: A ≥ B = C gives A ≥ C, so neither A > C nor A = C follows alone",
        "If the path has only =, the result is =",
        "A ≥ B and B ≥ A together force A = B",
      ],
    },
    {
      heading: "Either–or and coded inequalities",
      points: [
        "Give 'either I or II' only when neither follows alone, both have the same two terms, and together they cover every case",
        "Valid either–or pairs: (> and =) when the relation is ≥; (< and =) when it is ≤; (> and ≤) or (< and ≥) when no relation exists",
        "Coded symbols: first decode each symbol into >, ≥, =, ≤ or < and write the statement in plain signs before testing",
        "'Not smaller than' = ≥; 'neither greater than nor equal to' = <; 'neither smaller nor greater' = =",
        "Find the symbol order that makes a conclusion definite: every sign must point the same way, with one strict sign if strict is required",
      ],
    },
    {
      heading: "Ranking in a row or class",
      points: [
        "Total = rank from top + rank from bottom − 1 (same for left/right)",
        "Rank from the other end = total − given rank + 1",
        "Persons between A and B (no overlap) = total − (A's rank from left + B's rank from right)",
        "If the ranks overlap, persons between = (sum of the two ranks) − total − 2",
        "After A and B interchange, A's new position = B's old position; use it with A's old position to get the total",
        "Students leaving above someone lower that person's rank from top; those leaving below change only the bottom rank",
      ],
    },
    {
      heading: "Ordering by height, age, weight or marks",
      points: [
        "Write every clue as a chain with the larger element on the left, then merge chains through common people",
        "'More than only T' means second from the bottom; 'more than only two' means third from the bottom",
        "When a clue leaves two people unordered, list both arrangements and answer only what is fixed in both",
        "Midway between positions p and q: position (p + q)/2, which must be a whole number",
      ],
    },
    {
      heading: "Number and letter arrangement",
      points: [
        "Do the operation (add 1, swap pairs, sort) step by step and write the new number before answering",
        "'Letters in the same place after sorting': compare each letter of the word with the sorted word position by position",
      ],
    },
  ],
  formulas: [
    "A ≥ B > C ⇒ A > C;  A ≥ B ≥ C ⇒ A ≥ C;  A > B < C ⇒ no relation",
    "k persons between two people, side unknown: min total and max total come from the two cases",
  ],
  traps: [
    "Reading A ≥ B as A > B and marking 'A > B follows'; it does not, because A may equal B",
    "Giving 'either–or' for a pair that is already definitely true or one that does not cover all cases",
    "Comparing terms joined through a reversed sign, such as concluding A > C from A > B < C",
    "Forgetting the −1 in the total formula, or adding it when counting persons between",
    "Assuming B is to the right of A when the question gives no side; check both sides",
  ],
  examTips: [
    "Coded inequalities with 2–3 conclusions are regular in IBPS/SBI PO and Clerk prelims; decode once and reuse",
    "SSC CGL/CHSL and RRB NTPC prefer row ranking, interchange and 'how many between' questions",
    "Mains papers combine an ordering puzzle with ranking; draw a single vertical line of people and fill it",
  ],
  hi: {
    sections: [
      {
        heading: "सीधी असमिकाएँ: शृंखला कैसे पढ़ें",
        points: [
          "दो पद तभी तुलनीय हैं जब उनके बीच का पथ एक ही दिशा रखे: सब >, ≥, = या सब <, ≤, =",
          "पथ में विपरीत चिह्न (A > B < C या A ≤ B ≥ C) का अर्थ है कि सिरों के पदों में कोई संबंध नहीं",
          "यदि पथ में कम से कम एक सख्त चिह्न (> या <) हो, तो परिणाम सख्त होता है: A ≥ B > C = D से A > D मिलता है",
          "यदि पथ में केवल ≥ और = हों, तो परिणाम ≥ होता है: A ≥ B = C से A ≥ C मिलता है, इसलिए अकेले न A > C निकलता है न A = C",
          "यदि पथ में केवल = हो, तो परिणाम = होता है",
          "A ≥ B और B ≥ A साथ मिलकर A = B सुनिश्चित करते हैं",
        ],
      },
      {
        heading: "या तो–या और कूटबद्ध असमिकाएँ",
        points: [
          "'या तो I या II' तभी दीजिए जब अकेले कोई न निकले, दोनों में वही दो पद हों और साथ मिलकर वे हर स्थिति को समेटें",
          "वैध या तो–या जोड़े: (> और =) जब संबंध ≥ हो; (< और =) जब संबंध ≤ हो; (> और ≤) या (< और ≥) जब कोई संबंध न हो",
          "कूटबद्ध चिह्न: पहले हर चिह्न को >, ≥, =, ≤ या < में डिकोड कीजिए और परखने से पहले कथन को सादे चिह्नों में लिखिए",
          "'से छोटा नहीं' = ≥; 'न तो से बड़ा और न ही बराबर' = <; 'न छोटा न बड़ा' = =",
          "वह चिह्न-क्रम खोजिए जो निष्कर्ष को निश्चित बनाए: हर चिह्न एक ही ओर इंगित करे, और सख्त चाहिए तो एक सख्त चिह्न हो",
        ],
      },
      {
        heading: "पंक्ति या कक्षा में क्रमांकन",
        points: [
          "कुल = ऊपर से क्रम + नीचे से क्रम − 1 (बाएँ/दाएँ के लिए भी यही)",
          "दूसरे छोर से क्रम = कुल − दिया गया क्रम + 1",
          "A और B के बीच के व्यक्ति (अधिव्यापन नहीं) = कुल − (A का बाएँ से क्रम + B का दाएँ से क्रम)",
          "यदि क्रम अधिव्यापित हों, तो बीच के व्यक्ति = (दोनों क्रमों का योग) − कुल − 2",
          "A और B की अदला-बदली के बाद A की नई स्थिति = B की पुरानी स्थिति; इसे A की पुरानी स्थिति के साथ लेकर कुल निकालिए",
          "जो विद्यार्थी किसी के ऊपर से चले जाएँ, उससे उस व्यक्ति का ऊपर से क्रम घटता है; जो नीचे से जाएँ, उनसे केवल नीचे का क्रम बदलता है",
        ],
      },
      {
        heading: "ऊँचाई, आयु, भार या अंकों के अनुसार क्रम",
        points: [
          "हर संकेत को शृंखला के रूप में लिखिए, बड़ा अवयव बाईं ओर, फिर उभयनिष्ठ व्यक्तियों से शृंखलाएँ जोड़िए",
          "'केवल T से अधिक' का अर्थ है नीचे से दूसरा; 'केवल दो से अधिक' का अर्थ है नीचे से तीसरा",
          "जब कोई संकेत दो व्यक्तियों का क्रम खुला छोड़े, तो दोनों व्यवस्थाएँ लिखिए और केवल वही उत्तर दीजिए जो दोनों में निश्चित हो",
          "स्थितियों p और q के ठीक बीच: स्थिति (p + q)/2, जो पूर्ण संख्या होनी चाहिए",
        ],
      },
      {
        heading: "संख्या और अक्षर व्यवस्था",
        points: [
          "संक्रिया (1 जोड़ना, जोड़ों की अदला-बदली, छाँटना) चरण-दर-चरण कीजिए और उत्तर देने से पहले नई संख्या लिखिए",
          "'छाँटने के बाद एक ही स्थान पर अक्षर': शब्द के हर अक्षर की छाँटे हुए शब्द से स्थान-दर-स्थान तुलना कीजिए",
        ],
      },
    ],
    formulas: [
      "A ≥ B > C ⇒ A > C;  A ≥ B ≥ C ⇒ A ≥ C;  A > B < C ⇒ कोई संबंध नहीं",
      "दो व्यक्तियों के बीच k व्यक्ति, पक्ष अज्ञात: न्यूनतम और अधिकतम कुल दोनों स्थितियों से मिलते हैं",
    ],
    traps: [
      "A ≥ B को A > B पढ़कर 'A > B निकलता है' चिह्नित करना; ऐसा नहीं होता, क्योंकि A, B के बराबर हो सकता है",
      "ऐसे जोड़े के लिए 'या तो–या' देना जो पहले से निश्चित रूप से सत्य हो, या जो सभी स्थितियाँ न समेटे",
      "उलटे चिह्न से जुड़े पदों की तुलना करना, जैसे A > B < C से A > C निष्कर्ष निकालना",
      "कुल के सूत्र में −1 भूल जाना, या बीच के व्यक्ति गिनते समय उसे जोड़ देना",
      "प्रश्न में पक्ष न दिया हो तब B को A के दाईं ओर मान लेना; दोनों पक्ष जाँचिए",
    ],
    examTips: [
      "2–3 निष्कर्षों वाली कूटबद्ध असमिकाएँ IBPS/SBI PO और क्लर्क प्रारंभिक परीक्षाओं में नियमित हैं; एक बार डिकोड कीजिए और दोबारा प्रयोग कीजिए",
      "SSC CGL/CHSL और RRB NTPC पंक्ति क्रमांकन, अदला-बदली और 'बीच में कितने' प्रश्न अधिक पसंद करते हैं",
      "मुख्य परीक्षा के पेपर क्रम-पहेली को क्रमांकन से जोड़ते हैं; व्यक्तियों की एक ऊर्ध्वाधर रेखा बनाइए और उसे भरिए",
    ],
  },
};

export default notes;
