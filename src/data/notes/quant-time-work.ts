import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "If A finishes a job in a days, A's rate is 1/a of the job per day.",
        "Work = rate × time; rates of people working together add up.",
        "Time and efficiency are inversely proportional: twice as efficient means half the time.",
        "If A does a fraction f of the work in d days, the whole work takes d/f days.",
      ],
    },
    {
      heading: "LCM (total work) method",
      points: [
        "Step 1: take total work = LCM of the individual days.",
        "Step 2: each person's units per day = total ÷ their days.",
        "Step 3: add (or subtract) daily units, then divide total work by the result.",
        "Example: A 10 days, B 15 days → work 30 units, A 3/day, B 2/day, together 30 ÷ 5 = 6 days.",
      ],
    },
    {
      heading: "Standard results",
      points: [
        "A and B together: ab/(a + b) days.",
        "A, B, C together: abc/(ab + bc + ca) days.",
        "A + B take x days and A alone a days ⇒ B alone = ax/(a − x) days.",
        "Pairs: if A+B, B+C, C+A take given days, add the three rates and halve to get A+B+C.",
      ],
    },
    {
      heading: "Men, women and wages",
      points: [
        "M₁D₁H₁/W₁ = M₂D₂H₂/W₂ (men × days × hours per work).",
        "'10 men or 15 women' ⇒ 1 man = 1.5 women; convert everyone to one unit.",
        "Two equations like 12m + 16b in 5 days and 13m + 24b in 4 days: equate total work to find m : b.",
        "Wages are shared in the ratio of work done (efficiency × days worked), not in the ratio of days alone.",
      ],
    },
    {
      heading: "People leaving and pipes",
      points: [
        "Someone leaves x days before the end: count backwards from the finish or count their days worked.",
        "Work done by all = sum of (each rate × days that person actually worked).",
        "Pipes: inlets add, outlets subtract; net rate = Σ(1/inlet) − Σ(1/outlet).",
        "A leak that empties in L hours turns a fill time f into fL/(L − f).",
      ],
    },
  ],
  formulas: [
    "Together: ab/(a + b)",
    "Three together: abc/(ab + bc + ca)",
    "M₁D₁H₁/W₁ = M₂D₂H₂/W₂",
    "Net pipe rate = 1/a + 1/b − 1/c",
    "With leak: fL/(L − f)",
  ],
  traps: [
    "Do not add days; add rates (1/a + 1/b).",
    "Outlet pipes and leaks carry a minus sign in the net rate.",
    "When someone leaves early, the others still work for the full time.",
    "Wages follow work done, so a faster worker for fewer days may still earn more.",
  ],
  examTips: [
    "Regular in SSC, bank and placement aptitude tests; pipes and cisterns is the same topic.",
    "Look for: combined work, men–women equivalence, people leaving mid-way, wage sharing.",
    "The LCM method avoids fractions and is quickest under time pressure.",
  ],
  hi: {
    sections: [
      {
        heading: "मूल विचार",
        points: [
          "यदि A कोई काम a दिन में पूरा करता है, तो A की दर प्रतिदिन काम का 1/a भाग है।",
          "कार्य = दर × समय; साथ काम करने वालों की दरें जुड़ जाती हैं।",
          "समय और कार्यक्षमता व्युत्क्रमानुपाती हैं: दोगुनी कार्यक्षमता का अर्थ है आधा समय।",
          "यदि A d दिन में काम का भाग f करता है, तो पूरा काम d/f दिन में होता है।",
        ],
      },
      {
        heading: "LCM (कुल कार्य) विधि",
        points: [
          "पहला चरण: कुल कार्य = अलग-अलग दिनों का LCM लें।",
          "दूसरा चरण: प्रत्येक व्यक्ति की प्रतिदिन इकाइयाँ = कुल ÷ उसके दिन।",
          "तीसरा चरण: दैनिक इकाइयाँ जोड़ें (या घटाएँ), फिर कुल कार्य को परिणाम से भाग दें।",
          "उदाहरण: A 10 दिन, B 15 दिन → कार्य 30 इकाई, A 3/दिन, B 2/दिन, साथ में 30 ÷ 5 = 6 दिन।",
        ],
      },
      {
        heading: "मानक परिणाम",
        points: [
          "A और B साथ में: ab/(a + b) दिन।",
          "A, B, C साथ में: abc/(ab + bc + ca) दिन।",
          "A + B x दिन लें और A अकेला a दिन ⇒ B अकेला = ax/(a − x) दिन।",
          "जोड़ियाँ: यदि A+B, B+C, C+A के दिन दिए हों, तो तीनों दरें जोड़कर आधा करने पर A+B+C मिलता है।",
        ],
      },
      {
        heading: "पुरुष, महिलाएँ और मजदूरी",
        points: [
          "M₁D₁H₁/W₁ = M₂D₂H₂/W₂ (पुरुष × दिन × घंटे प्रति कार्य)।",
          "'10 पुरुष या 15 महिलाएँ' ⇒ 1 पुरुष = 1.5 महिलाएँ; सबको एक इकाई में बदलें।",
          "12m + 16b 5 दिन में और 13m + 24b 4 दिन में जैसे दो समीकरण: कुल कार्य बराबर करके m : b निकालें।",
          "मजदूरी किए गए कार्य (कार्यक्षमता × कार्य के दिन) के अनुपात में बँटती है, केवल दिनों के अनुपात में नहीं।",
        ],
      },
      {
        heading: "काम छोड़कर जाना और पाइप",
        points: [
          "कोई अंत से x दिन पहले चला जाए: समाप्ति से पीछे गिनें या उसके काम के दिन गिनें।",
          "सबका किया कार्य = (प्रत्येक की दर × उस व्यक्ति द्वारा वास्तव में काम किए दिन) का योग।",
          "पाइप: अंतर्वाही जुड़ते हैं, निकास घटते हैं; शुद्ध दर = Σ(1/अंतर्वाही) − Σ(1/निकास)।",
          "L घंटे में खाली करने वाला रिसाव भरने के समय f को fL/(L − f) कर देता है।",
        ],
      },
    ],
    formulas: [
      "साथ में: ab/(a + b)",
      "तीन साथ में: abc/(ab + bc + ca)",
      "M₁D₁H₁/W₁ = M₂D₂H₂/W₂",
      "पाइप की शुद्ध दर = 1/a + 1/b − 1/c",
      "रिसाव के साथ: fL/(L − f)",
    ],
    traps: [
      "दिन न जोड़ें; दरें जोड़ें (1/a + 1/b)।",
      "निकास पाइपों और रिसाव का शुद्ध दर में ऋण चिह्न होता है।",
      "कोई जल्दी चला जाए तो भी बाकी लोग पूरे समय काम करते हैं।",
      "मजदूरी किए गए कार्य के अनुसार मिलती है, इसलिए कम दिन काम करने वाला तेज़ कर्मचारी भी अधिक कमा सकता है।",
    ],
    examTips: [
      "SSC, बैंक और प्लेसमेंट एप्टीट्यूड टेस्टों में नियमित; पाइप और टंकी भी यही विषय है।",
      "इन पर ध्यान दें: संयुक्त कार्य, पुरुष–महिला समतुल्यता, बीच में काम छोड़ना, मजदूरी बाँटना।",
      "LCM विधि भिन्नों से बचाती है और समय के दबाव में सबसे तेज़ है।",
    ],
  },
};

export default notes;
