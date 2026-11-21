import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Types of numbers",
      points: [
        "Natural 1, 2, 3…; whole numbers include 0; integers include negatives.",
        "Prime: exactly two factors (2 is the only even prime); 1 is neither prime nor composite.",
        "There are 25 primes below 100.",
        "Co-primes have HCF 1 (they need not be prime themselves, e.g. 8 and 15).",
      ],
    },
    {
      heading: "Divisibility rules",
      points: [
        "2: last digit even; 5: last digit 0 or 5; 10: last digit 0.",
        "3 / 9: digit sum divisible by 3 / 9.",
        "4: last two digits divisible by 4; 8: last three digits divisible by 8.",
        "6: divisible by 2 and 3; 12: by 3 and 4; 15: by 3 and 5 (use co-prime factor pairs).",
        "11: (sum of odd-place digits − sum of even-place digits) is 0 or a multiple of 11.",
      ],
    },
    {
      heading: "Factors, LCM and HCF",
      points: [
        "N = pᵃqᵇrᶜ ⇒ number of factors = (a + 1)(b + 1)(c + 1); 360 = 2³·3²·5 has 24.",
        "HCF: lowest powers of common primes; LCM: highest powers of all primes.",
        "For two numbers: HCF × LCM = product of the numbers.",
        "HCF of fractions = HCF of numerators/LCM of denominators; LCM of fractions = LCM of numerators/HCF of denominators.",
        "Numbers with HCF h: write them as ha and hb with a, b co-prime, then count valid co-prime pairs.",
      ],
    },
    {
      heading: "LCM/HCF word problems",
      points: [
        "Least number leaving remainder r with each divisor: LCM + r.",
        "Greatest number dividing x, y leaving remainders r₁, r₂: HCF(x − r₁, y − r₂).",
        "Greatest number dividing x, y, z leaving the same remainder: HCF of their differences.",
        "Bells, lights, runners meeting together: LCM of their intervals.",
        "Largest tile, container or plank size: HCF of the lengths.",
      ],
    },
    {
      heading: "Remainders, unit digits, zeros",
      points: [
        "Remainder of a product or sum = product or sum of the remainders (then reduce).",
        "If N leaves remainder r with d, Nᵏ leaves the remainder of rᵏ with d.",
        "Unit digit cycles of 4: 2 (2, 4, 8, 6), 3 (3, 9, 7, 1), 7 (7, 9, 3, 1), 8 (8, 4, 2, 6); use power mod 4 (0 → 4th term).",
        "0, 1, 5, 6 keep their unit digit; 4 and 9 alternate (odd power keeps, even power gives 6 or 1).",
        "Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … (100! has 24).",
        "From 4! onward every factorial is divisible by 12 (and from 5! by 10).",
      ],
    },
  ],
  formulas: [
    "Factors of pᵃqᵇrᶜ = (a + 1)(b + 1)(c + 1)",
    "HCF × LCM = a × b (two numbers)",
    "Sum of first n naturals = n(n + 1)/2",
    "Sum of squares = n(n + 1)(2n + 1)/6; sum of cubes = [n(n + 1)/2]²",
    "Trailing zeros of n! = Σ⌊n/5ᵏ⌋",
  ],
  traps: [
    "HCF × LCM = product works only for two numbers, not three.",
    "1 is not a prime number; 2 is prime.",
    "Counting zeros in n!: do not forget the extra 5s in 25, 50, 75, 100.",
    "In unit-digit cycles, a power that is a multiple of 4 takes the 4th term, not the 1st.",
    "'Besides the first toll' means exclude the starting moment when counting coincidences.",
  ],
  examTips: [
    "Core of SSC CGL/CHSL and placement tests; questions on factors, LCM/HCF and remainders appear in most papers.",
    "Common types: number of factors, bells tolling together, largest/least number with remainders, unit digit of big powers.",
    "Use prime factorisation as the default first step.",
  ],
  hi: {
    sections: [
      {
        heading: "संख्याओं के प्रकार",
        points: [
          "प्राकृत संख्याएँ 1, 2, 3…; पूर्ण संख्याओं में 0 शामिल है; पूर्णांकों में ऋणात्मक संख्याएँ भी शामिल हैं।",
          "अभाज्य: जिसके ठीक दो गुणनखंड हों (2 एकमात्र सम अभाज्य संख्या है); 1 न अभाज्य है न संयुक्त संख्या।",
          "100 से छोटी 25 अभाज्य संख्याएँ हैं।",
          "सह-अभाज्य संख्याओं का HCF 1 होता है (वे स्वयं अभाज्य हों, यह आवश्यक नहीं, जैसे 8 और 15)।",
        ],
      },
      {
        heading: "विभाज्यता के नियम",
        points: [
          "2: अंतिम अंक सम; 5: अंतिम अंक 0 या 5; 10: अंतिम अंक 0।",
          "3 / 9: अंकों का योग 3 / 9 से विभाज्य हो।",
          "4: अंतिम दो अंक 4 से विभाज्य; 8: अंतिम तीन अंक 8 से विभाज्य।",
          "6: 2 और 3 दोनों से विभाज्य; 12: 3 और 4 से; 15: 3 और 5 से (सह-अभाज्य गुणनखंडों के जोड़े प्रयोग करें)।",
          "11: (विषम स्थानों के अंकों का योग − सम स्थानों के अंकों का योग) 0 या 11 का गुणज हो।",
        ],
      },
      {
        heading: "गुणनखंड, LCM और HCF",
        points: [
          "N = pᵃqᵇrᶜ ⇒ गुणनखंडों की संख्या = (a + 1)(b + 1)(c + 1); 360 = 2³·3²·5 के 24 गुणनखंड हैं।",
          "HCF: उभयनिष्ठ अभाज्यों की न्यूनतम घातें; LCM: सभी अभाज्यों की अधिकतम घातें।",
          "दो संख्याओं के लिए: HCF × LCM = संख्याओं का गुणनफल।",
          "भिन्नों का HCF = अंशों का HCF/हरों का LCM; भिन्नों का LCM = अंशों का LCM/हरों का HCF।",
          "HCF h वाली संख्याएँ: उन्हें ha और hb लिखें जहाँ a, b सह-अभाज्य हैं, फिर मान्य सह-अभाज्य जोड़े गिनें।",
        ],
      },
      {
        heading: "LCM/HCF के शब्द-प्रश्न",
        points: [
          "प्रत्येक भाजक से शेषफल r देने वाली लघुतम संख्या: LCM + r।",
          "x, y को भाग देकर शेषफल r₁, r₂ छोड़ने वाली महत्तम संख्या: HCF(x − r₁, y − r₂)।",
          "x, y, z को भाग देकर समान शेषफल छोड़ने वाली महत्तम संख्या: उनके अंतरों का HCF।",
          "घंटियाँ, बत्तियाँ, धावक एक साथ मिलें: उनके अंतरालों का LCM।",
          "सबसे बड़ी टाइल, पात्र या तख्ते का माप: लंबाइयों का HCF।",
        ],
      },
      {
        heading: "शेषफल, इकाई अंक, शून्य",
        points: [
          "गुणनफल या योग का शेषफल = शेषफलों का गुणनफल या योग (फिर घटाएँ)।",
          "यदि N को d से भाग देने पर शेषफल r बचे, तो Nᵏ को d से भाग देने पर rᵏ का शेषफल बचता है।",
          "इकाई अंक के 4 के चक्र: 2 (2, 4, 8, 6), 3 (3, 9, 7, 1), 7 (7, 9, 3, 1), 8 (8, 4, 2, 6); घात का 4 से शेषफल लें (0 → चौथा पद)।",
          "0, 1, 5, 6 का इकाई अंक नहीं बदलता; 4 और 9 बारी-बारी से आते हैं (विषम घात में वही, सम घात में 6 या 1)।",
          "n! में अंत के शून्य = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … (100! में 24)।",
          "4! से आगे प्रत्येक factorial 12 से विभाज्य है (और 5! से आगे 10 से)।",
        ],
      },
    ],
    formulas: [
      "pᵃqᵇrᶜ के गुणनखंड = (a + 1)(b + 1)(c + 1)",
      "HCF × LCM = a × b (दो संख्याएँ)",
      "पहली n प्राकृत संख्याओं का योग = n(n + 1)/2",
      "वर्गों का योग = n(n + 1)(2n + 1)/6; घनों का योग = [n(n + 1)/2]²",
      "n! के अंत के शून्य = Σ⌊n/5ᵏ⌋",
    ],
    traps: [
      "HCF × LCM = गुणनफल केवल दो संख्याओं के लिए सही है, तीन के लिए नहीं।",
      "1 अभाज्य संख्या नहीं है; 2 अभाज्य है।",
      "n! में शून्य गिनते समय 25, 50, 75, 100 के अतिरिक्त 5 न भूलें।",
      "इकाई अंक के चक्रों में 4 का गुणज घात होने पर चौथा पद लिया जाता है, पहला नहीं।",
      "'पहले घंटे के अतिरिक्त' का अर्थ है संयोग गिनते समय आरंभिक क्षण को छोड़ दें।",
    ],
    examTips: [
      "SSC CGL/CHSL और प्लेसमेंट टेस्टों का मूल विषय; गुणनखंड, LCM/HCF और शेषफल के प्रश्न अधिकांश पेपरों में आते हैं।",
      "सामान्य प्रकार: गुणनखंडों की संख्या, साथ बजने वाली घंटियाँ, शेषफल वाली महत्तम/लघुतम संख्या, बड़ी घातों का इकाई अंक।",
      "अभाज्य गुणनखंडन को सदैव पहला चरण मानें।",
    ],
  },
};

export default notes;
