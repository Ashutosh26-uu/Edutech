import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Average = sum of observations ÷ number of observations.",
        "Sum = average × count; most questions are solved by working with sums.",
        "Adding, subtracting, multiplying or dividing every value by k does the same to the average.",
        "Weighted average = (n₁a₁ + n₂a₂)/(n₁ + n₂) for two groups.",
      ],
    },
    {
      heading: "Number series averages",
      points: [
        "First n natural numbers: (n + 1)/2.",
        "First n even numbers: n + 1; first n odd numbers: n.",
        "Any arithmetic progression: (first + last)/2.",
        "Squares of first n naturals: (n + 1)(2n + 1)/6.",
        "Consecutive numbers: average is the middle term (or mean of the two middle terms).",
      ],
    },
    {
      heading: "Replacement and joining",
      points: [
        "One person replaced, average up by d for n people: new = old + nd.",
        "New person joins n people, average up by d: new person = old average + (n + 1)d.",
        "Person leaves n people, average falls by d: leaver = old average + (n − 1)d.",
        "Committee average unchanged over t years after a replacement: new member is n × t years younger than the old one.",
      ],
    },
    {
      heading: "Innings and overlaps",
      points: [
        "Batsman scores x in the nth innings and raises average by d: new average = x − (n − 1)d.",
        "First k and last k of 2k − 1 results share the middle one: middle = sum(first k) + sum(last k) − total.",
        "Average of A, B, C and pairs given: add pair sums, subtract the total to isolate one person.",
        "Average speed for equal distances at u and v: 2uv/(u + v), not (u + v)/2.",
      ],
    },
  ],
  formulas: [
    "Sum = average × count",
    "Weighted average = Σnᵢaᵢ/Σnᵢ",
    "Average of 1 to n = (n + 1)/2",
    "Innings: new average = x − (n − 1)d",
    "Equal distance average speed = 2uv/(u + v)",
  ],
  traps: [
    "Do not average two averages of unequal groups; use weights.",
    "When a person replaces another, the count stays the same; when someone joins, it rises by 1.",
    "In overlapping-groups questions, the shared middle value is counted twice.",
    "Average age after t years rises by t for everyone, so total rises by n × t.",
  ],
  examTips: [
    "Comes as 1–2 quick questions in SSC, railway and bank prelims; easy marks if done with sums.",
    "Frequent forms: cricketer's innings, replacement of a member, ages of a family, overlapping results.",
    "Use deviation from an assumed mean to add long lists quickly.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "औसत = प्रेक्षणों का योग ÷ प्रेक्षणों की संख्या।",
          "योग = औसत × संख्या; अधिकांश प्रश्न योग के साथ काम करके हल होते हैं।",
          "प्रत्येक मान में k जोड़ने, घटाने, गुणा या भाग करने पर औसत में भी वही क्रिया होती है।",
          "दो समूहों के लिए भारित औसत = (n₁a₁ + n₂a₂)/(n₁ + n₂)।",
        ],
      },
      {
        heading: "संख्या श्रेणियों के औसत",
        points: [
          "पहली n प्राकृत संख्याएँ: (n + 1)/2।",
          "पहली n सम संख्याएँ: n + 1; पहली n विषम संख्याएँ: n।",
          "कोई भी समांतर श्रेणी: (प्रथम + अंतिम)/2।",
          "पहली n प्राकृत संख्याओं के वर्ग: (n + 1)(2n + 1)/6।",
          "क्रमागत संख्याएँ: औसत मध्य पद होता है (या दो मध्य पदों का माध्य)।",
        ],
      },
      {
        heading: "प्रतिस्थापन और शामिल होना",
        points: [
          "एक व्यक्ति के बदलने पर n व्यक्तियों का औसत d बढ़े: नया = पुराना + nd।",
          "n व्यक्तियों में नया व्यक्ति आने पर औसत d बढ़े: नया व्यक्ति = पुराना औसत + (n + 1)d।",
          "n व्यक्तियों में से एक के जाने पर औसत d घटे: जाने वाला = पुराना औसत + (n − 1)d।",
          "प्रतिस्थापन के बाद t वर्ष में समिति का औसत अपरिवर्तित रहे: नया सदस्य पुराने से n × t वर्ष छोटा होता है।",
        ],
      },
      {
        heading: "पारियाँ और अतिव्यापन",
        points: [
          "बल्लेबाज़ nवीं पारी में x रन बनाकर औसत d बढ़ाता है: नया औसत = x − (n − 1)d।",
          "2k − 1 परिणामों में पहले k और अंतिम k का मध्य परिणाम उभयनिष्ठ है: मध्य = पहले k का योग + अंतिम k का योग − कुल योग।",
          "A, B, C का औसत और जोड़ियों का औसत दिया हो: जोड़ियों के योग जोड़ें, कुल घटाकर एक व्यक्ति अलग करें।",
          "समान दूरी पर चाल u और v हो तो औसत चाल: 2uv/(u + v), न कि (u + v)/2।",
        ],
      },
    ],
    formulas: [
      "योग = औसत × संख्या",
      "भारित औसत = Σnᵢaᵢ/Σnᵢ",
      "1 से n का औसत = (n + 1)/2",
      "पारियाँ: नया औसत = x − (n − 1)d",
      "समान दूरी पर औसत चाल = 2uv/(u + v)",
    ],
    traps: [
      "असमान समूहों के दो औसतों का साधारण औसत न निकालें; भार का प्रयोग करें।",
      "एक व्यक्ति दूसरे की जगह लेता है तो संख्या वही रहती है; कोई नया जुड़े तो संख्या 1 बढ़ती है।",
      "अतिव्यापी समूहों के प्रश्नों में उभयनिष्ठ मध्य मान दो बार गिना जाता है।",
      "t वर्ष बाद सबके औसत आयु में t की वृद्धि होती है, अतः कुल योग n × t बढ़ता है।",
    ],
    examTips: [
      "SSC, रेलवे और बैंक प्रारंभिक परीक्षाओं में 1–2 त्वरित प्रश्न आते हैं; योग के तरीके से करने पर आसान अंक मिलते हैं।",
      "बार-बार आने वाले रूप: क्रिकेटर की पारियाँ, सदस्य का प्रतिस्थापन, परिवार की आयु, अतिव्यापी परिणाम।",
      "लंबी सूचियों को शीघ्र जोड़ने के लिए कल्पित माध्य से विचलन का प्रयोग करें।",
    ],
  },
};

export default notes;
