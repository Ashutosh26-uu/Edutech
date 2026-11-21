import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Clock basics",
      points: [
        "Minute hand moves 6° per minute; hour hand 0.5° per minute (30° per hour)",
        "Relative speed: the minute hand gains 5.5° per minute, i.e. 55 minute-spaces per hour",
        "Angle at H:M = |30H − 5.5M|; if the result exceeds 180°, the smaller angle is 360° minus it",
        "Hour hand turn between two times = 0.5° × minutes elapsed (e.g. 8:20 to 2:50 is 390 min = 195°)",
      ],
    },
    {
      heading: "Hands coinciding, opposite, at right angles",
      points: [
        "Between H and H + 1, hands coincide at 60H/11 minutes past H (4 o'clock: 21 9/11 min)",
        "For an angle θ between H and H + 1: M = (2/11)(30H ± θ); take the value that lies between 0 and 60",
        "In 12 hours: coincide 11 times, opposite 11 times, right angle 22 times, straight line 22 times",
        "In 24 hours: coincide 22, opposite 22, right angle 44, straight line 44",
        "Hands coincide every 65 5/11 minutes, not every 65 minutes",
      ],
    },
    {
      heading: "Mirror images and faulty clocks",
      points: [
        "Mirror time = 11:60 − shown time (for times after 11:00, use 23:60 − shown time)",
        "Water image (vertical flip) = 18:30 − shown time, used rarely",
        "Losing/gaining clock: set up the ratio clock-time : true-time from the given rate and scale it",
        "A watch losing 2 min per hour shows 58 min for every 60 true minutes",
      ],
    },
    {
      heading: "Calendar and odd days",
      points: [
        "Odd days = days left over after full weeks (total days mod 7)",
        "Ordinary year 1 odd day, leap year 2; 100 years 5, 200 years 3, 300 years 1, 400 years 0",
        "Leap year: divisible by 4; century years only if divisible by 400 (2000 yes, 1900 and 2100 no)",
        "Month odd days: 31-day months 3, 30-day months 2, February 0 (or 1 in a leap year)",
        "Moving forward one year adds 1 day (2 if the span crosses 29 February)",
        "Day code from odd days: 0 Sunday, 1 Monday … 6 Saturday",
        "Last day of a century is never Tuesday, Thursday or Saturday",
        "Same calendar: a leap year repeats after 28 years; an ordinary year usually after 6 or 11 years; check odd days sum to a multiple of 7 and leap status matches",
      ],
    },
    {
      heading: "Painted cubes",
      points: [
        "n × n × n painted cube cut into n³ unit cubes: three faces 8, two faces 12(n − 2), one face 6(n − 2)², none (n − 2)³",
        "At least one face painted = n³ − (n − 2)³",
        "Cuboid a × b × c: none (a − 2)(b − 2)(c − 2); two faces 4[(a − 2) + (b − 2) + (c − 2)]",
        "Only some faces painted: count face by face; cubes on a shared edge of two painted faces get two colours",
      ],
    },
  ],
  formulas: [
    "θ = |30H − 5.5M|",
    "Coincide: M = 60H/11 minutes past H",
    "Mirror time = 11:60 − given time",
    "Odd days: 100 yr = 5, 200 yr = 3, 300 yr = 1, 400 yr = 0",
    "Painted cube: 8, 12(n − 2), 6(n − 2)², (n − 2)³",
  ],
  traps: [
    "Counting 1900 or 2100 as leap years",
    "Forgetting that the hour hand also moves: at 7:30 it is midway between 7 and 8, so the angle is 45°, not 60°",
    "Adding the leap day when the span ends before 29 February (1 Jan to 1 Jan of the next year uses the first year's length)",
    "'Counting both dates' needs +1 to the difference of dates",
    "Saying 24 right angles in 12 hours; between 2 and 4 and between 8 and 10 there are only 3 each (3:00 and 9:00 are shared), so the count is 22",
  ],
  examTips: [
    "SSC CGL, CHSL and RRB NTPC ask one clock or calendar question almost every shift; angle and day-of-week are the favourites",
    "Statement-count questions (how many are correct) test leap-year and coincidence facts together",
    "Cube painting comes as 'how many have at least one / exactly two faces painted' in SSC and bank clerk papers",
  ],
  hi: {
    sections: [
      {
        heading: "घड़ी की मूल बातें",
        points: [
          "मिनट की सुई प्रति मिनट 6° चलती है; घंटे की सुई प्रति मिनट 0.5° (प्रति घंटा 30°)",
          "सापेक्ष चाल: मिनट की सुई प्रति मिनट 5.5° आगे निकलती है, अर्थात प्रति घंटा 55 मिनट-खाने",
          "H:M पर कोण = |30H − 5.5M|; यदि परिणाम 180° से अधिक हो, तो छोटा कोण 360° में से उसे घटाने पर मिलता है",
          "दो समयों के बीच घंटे की सुई का घूमना = 0.5° × बीता हुआ समय (मिनट में) (जैसे 8:20 से 2:50 तक 390 मिनट = 195°)",
        ],
      },
      {
        heading: "सुइयों का संपाती, विपरीत और समकोण पर होना",
        points: [
          "H और H + 1 के बीच सुइयाँ H बजे के 60H/11 मिनट बाद संपाती होती हैं (4 बजे: 21 9/11 मिनट)",
          "H और H + 1 के बीच कोण θ के लिए: M = (2/11)(30H ± θ); 0 और 60 के बीच वाला मान लीजिए",
          "12 घंटे में: संपाती 11 बार, विपरीत 11 बार, समकोण 22 बार, सीधी रेखा 22 बार",
          "24 घंटे में: संपाती 22, विपरीत 22, समकोण 44, सीधी रेखा 44",
          "सुइयाँ हर 65 5/11 मिनट में संपाती होती हैं, हर 65 मिनट में नहीं",
        ],
      },
      {
        heading: "दर्पण प्रतिबिंब और दोषपूर्ण घड़ियाँ",
        points: [
          "दर्पण समय = 11:60 − दिखाया गया समय (11:00 के बाद के समय के लिए 23:60 − दिखाया गया समय)",
          "जल प्रतिबिंब (ऊर्ध्वाधर पलटाव) = 18:30 − दिखाया गया समय, कम ही प्रयोग होता है",
          "धीमी/तेज़ घड़ी: दी गई दर से घड़ी-समय : वास्तविक-समय का अनुपात बनाइए और उसे बढ़ाइए",
          "प्रति घंटा 2 मिनट पीछे होने वाली घड़ी हर 60 वास्तविक मिनट पर 58 मिनट दिखाती है",
        ],
      },
      {
        heading: "कैलेंडर और विषम दिन",
        points: [
          "विषम दिन = पूरे सप्ताह निकालने के बाद बचे दिन (कुल दिन mod 7)",
          "सामान्य वर्ष में 1 विषम दिन, लीप वर्ष में 2; 100 वर्ष में 5, 200 वर्ष में 3, 300 वर्ष में 1, 400 वर्ष में 0",
          "लीप वर्ष: 4 से विभाज्य; शताब्दी वर्ष केवल तब जब 400 से विभाज्य हो (2000 हाँ, 1900 और 2100 नहीं)",
          "महीनों के विषम दिन: 31 दिन वाले महीने 3, 30 दिन वाले महीने 2, फरवरी 0 (लीप वर्ष में 1)",
          "एक वर्ष आगे जाने पर 1 दिन जुड़ता है (यदि अवधि 29 फरवरी पार करे तो 2)",
          "विषम दिनों से दिन का कोड: 0 रविवार, 1 सोमवार … 6 शनिवार",
          "शताब्दी का अंतिम दिन कभी मंगलवार, गुरुवार या शनिवार नहीं होता",
          "समान कैलेंडर: लीप वर्ष 28 वर्ष बाद दोहराता है; सामान्य वर्ष प्रायः 6 या 11 वर्ष बाद; जाँचिए कि विषम दिनों का योग 7 का गुणज हो और लीप स्थिति मेल खाए",
        ],
      },
      {
        heading: "रंगे हुए घन",
        points: [
          "n × n × n के रंगे घन को n³ इकाई घनों में काटने पर: तीन फलक 8, दो फलक 12(n − 2), एक फलक 6(n − 2)², कोई नहीं (n − 2)³",
          "कम से कम एक फलक रंगा = n³ − (n − 2)³",
          "घनाभ a × b × c: कोई नहीं (a − 2)(b − 2)(c − 2); दो फलक 4[(a − 2) + (b − 2) + (c − 2)]",
          "केवल कुछ फलक रंगे हों: फलक-दर-फलक गिनिए; दो रंगे फलकों की साझा कोर पर स्थित घनों पर दो रंग होते हैं",
        ],
      },
    ],
    formulas: [
      "θ = |30H − 5.5M|",
      "संपाती: H बजे के 60H/11 मिनट बाद M",
      "दर्पण समय = 11:60 − दिया गया समय",
      "विषम दिन: 100 वर्ष = 5, 200 वर्ष = 3, 300 वर्ष = 1, 400 वर्ष = 0",
      "रंगा घन: 8, 12(n − 2), 6(n − 2)², (n − 2)³",
    ],
    traps: [
      "1900 या 2100 को लीप वर्ष गिनना",
      "यह भूलना कि घंटे की सुई भी चलती है: 7:30 पर वह 7 और 8 के ठीक बीच में होती है, इसलिए कोण 45° है, 60° नहीं",
      "अवधि 29 फरवरी से पहले समाप्त होने पर भी लीप दिन जोड़ देना (1 जनवरी से अगले वर्ष की 1 जनवरी तक पहले वर्ष की लंबाई ली जाती है)",
      "'दोनों तिथियाँ गिनने' पर तिथियों के अंतर में +1 चाहिए",
      "12 घंटे में 24 समकोण कहना; 2 और 4 के बीच तथा 8 और 10 के बीच केवल 3-3 हैं (3:00 और 9:00 साझा हैं), इसलिए गिनती 22 है",
    ],
    examTips: [
      "SSC CGL, CHSL और RRB NTPC में लगभग हर शिफ्ट में एक घड़ी या कैलेंडर प्रश्न आता है; कोण और सप्ताह का दिन सबसे प्रिय हैं",
      "कथन-गणना प्रश्न (कितने सही हैं) लीप वर्ष और संपाती तथ्यों को साथ परखते हैं",
      "घन-रंगाई SSC और बैंक क्लर्क पेपरों में 'कितनों का कम से कम एक / ठीक दो फलक रंगा है' के रूप में आती है",
    ],
  },
};

export default notes;
