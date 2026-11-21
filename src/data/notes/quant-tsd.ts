import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Distance = speed × time; keep units consistent.",
        "km/h × 5/18 = m/s; m/s × 18/5 = km/h (36 km/h = 10 m/s, 72 km/h = 20 m/s).",
        "At constant distance, speed and time are inversely proportional.",
        "If speed becomes a/b of usual, time becomes b/a of usual.",
      ],
    },
    {
      heading: "Average speed",
      points: [
        "Average speed = total distance ÷ total time, never the plain average of speeds.",
        "Equal distances at u and v: 2uv/(u + v) (40 and 60 → 48 km/h).",
        "Equal times at u and v: (u + v)/2.",
        "Stoppages: stop time per hour = (speed without − speed with)/speed without × 60 min.",
      ],
    },
    {
      heading: "Relative speed and trains",
      points: [
        "Opposite directions: add speeds; same direction: subtract speeds.",
        "Train passing a pole or person: distance = train length.",
        "Train passing a platform, bridge or another train: distance = sum of both lengths.",
        "Meeting time from opposite ends = gap ÷ (sum of speeds); catching up = lead ÷ (difference of speeds).",
        "If one starts later, first find the head start distance, then use relative speed.",
      ],
    },
    {
      heading: "Boats and streams",
      points: [
        "Downstream speed D = b + s; upstream speed U = b − s (b = boat in still water, s = stream).",
        "b = (D + U)/2; s = (D − U)/2.",
        "Round trip of distance d each way: total time = d/(b + s) + d/(b − s).",
      ],
    },
    {
      heading: "Circular tracks and races",
      points: [
        "Same direction: first meeting time = track length ÷ (difference of speeds).",
        "Opposite directions: first meeting time = track length ÷ (sum of speeds).",
        "Meeting at the start point: LCM of the individual lap times.",
        "A beats B by x m in a race of L m: when A runs L, B runs L − x.",
      ],
    },
  ],
  formulas: [
    "1 km/h = 5/18 m/s",
    "Average speed (equal distances) = 2uv/(u + v)",
    "Still water = (D + U)/2; stream = (D − U)/2",
    "Crossing time = (L₁ + L₂)/(relative speed)",
    "Late/early: d = (product of speeds/difference of speeds) × time difference",
  ],
  traps: [
    "Converting units: mixing metres with km/h is the most common error.",
    "For a pole only the train's own length counts; for a platform add both lengths.",
    "Average speed for equal distances is the harmonic mean, not (u + v)/2.",
    "Upstream and downstream are swapped easily: downstream is the faster one.",
  ],
  examTips: [
    "Heavy weightage in SSC, railway (RRB NTPC/Group D) and bank exams; trains and boats appear almost every paper.",
    "Common types: crossing time, meeting point of two travellers, late/early arrival, circular track meetings.",
    "Convert everything to m/s for train-length questions and to km/h for travel questions before solving.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "दूरी = चाल × समय; इकाइयाँ एक जैसी रखें।",
          "km/h × 5/18 = m/s; m/s × 18/5 = km/h (36 km/h = 10 m/s, 72 km/h = 20 m/s)।",
          "स्थिर दूरी पर चाल और समय व्युत्क्रमानुपाती होते हैं।",
          "यदि चाल सामान्य की a/b हो जाए, तो समय सामान्य का b/a हो जाता है।",
        ],
      },
      {
        heading: "औसत चाल",
        points: [
          "औसत चाल = कुल दूरी ÷ कुल समय, चालों का साधारण औसत कभी नहीं।",
          "समान दूरियाँ u और v चाल से: 2uv/(u + v) (40 और 60 → 48 km/h)।",
          "समान समय u और v चाल से: (u + v)/2।",
          "ठहराव: प्रति घंटे रुकने का समय = (बिना ठहराव की चाल − ठहराव सहित चाल)/बिना ठहराव की चाल × 60 मिनट।",
        ],
      },
      {
        heading: "सापेक्ष चाल और रेलगाड़ियाँ",
        points: [
          "विपरीत दिशाओं में: चालें जोड़ें; समान दिशा में: चालें घटाएँ।",
          "रेलगाड़ी खंभे या व्यक्ति को पार करे: दूरी = रेलगाड़ी की लंबाई।",
          "रेलगाड़ी प्लेटफ़ॉर्म, पुल या दूसरी रेलगाड़ी को पार करे: दूरी = दोनों लंबाइयों का योग।",
          "विपरीत सिरों से मिलने का समय = दूरी ÷ (चालों का योग); पकड़ने का समय = बढ़त ÷ (चालों का अंतर)।",
          "यदि कोई देर से चले, तो पहले बढ़त की दूरी निकालें, फिर सापेक्ष चाल प्रयोग करें।",
        ],
      },
      {
        heading: "नाव और धारा",
        points: [
          "धारा के अनुकूल चाल D = b + s; धारा के प्रतिकूल चाल U = b − s (b = शांत जल में नाव, s = धारा)।",
          "b = (D + U)/2; s = (D − U)/2।",
          "प्रत्येक ओर d दूरी की आना-जाना यात्रा: कुल समय = d/(b + s) + d/(b − s)।",
        ],
      },
      {
        heading: "वृत्ताकार पथ और दौड़",
        points: [
          "समान दिशा में: पहली बार मिलने का समय = पथ की लंबाई ÷ (चालों का अंतर)।",
          "विपरीत दिशाओं में: पहली बार मिलने का समय = पथ की लंबाई ÷ (चालों का योग)।",
          "प्रारंभ बिंदु पर मिलना: अलग-अलग चक्कर-समयों का LCM।",
          "L m की दौड़ में A, B को x m से हराता है: जब A, L दौड़ता है तब B, L − x दौड़ता है।",
        ],
      },
    ],
    formulas: [
      "1 km/h = 5/18 m/s",
      "औसत चाल (समान दूरियाँ) = 2uv/(u + v)",
      "शांत जल = (D + U)/2; धारा = (D − U)/2",
      "पार करने का समय = (L₁ + L₂)/(सापेक्ष चाल)",
      "देर/जल्दी: d = (चालों का गुणनफल/चालों का अंतर) × समय का अंतर",
    ],
    traps: [
      "इकाइयाँ बदलना: मीटर को km/h के साथ मिलाना सबसे आम त्रुटि है।",
      "खंभे के लिए केवल रेलगाड़ी की अपनी लंबाई गिनी जाती है; प्लेटफ़ॉर्म के लिए दोनों लंबाइयाँ जोड़ें।",
      "समान दूरियों की औसत चाल हरात्मक माध्य होती है, (u + v)/2 नहीं।",
      "धारा के प्रतिकूल और अनुकूल आसानी से उलट जाते हैं: धारा के अनुकूल वाली चाल अधिक होती है।",
    ],
    examTips: [
      "SSC, रेलवे (RRB NTPC/ग्रुप D) और बैंक परीक्षाओं में अधिक भारांक; रेलगाड़ी और नाव के प्रश्न लगभग हर पेपर में आते हैं।",
      "सामान्य प्रकार: पार करने का समय, दो यात्रियों के मिलने का बिंदु, देर/जल्दी पहुँचना, वृत्ताकार पथ पर मिलना।",
      "हल करने से पहले रेलगाड़ी की लंबाई वाले प्रश्नों में सब कुछ m/s में और यात्रा के प्रश्नों में km/h में बदलें।",
    ],
  },
};

export default notes;
