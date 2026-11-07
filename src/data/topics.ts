import type { Topic } from "@/lib/types";

/**
 * Study topics: name, subject, search aliases, a short summary and the key points shown on the
 * revision sheet. The questions for each topic live in data/bank/<topic id>.ts and are loaded on
 * demand (see lib/bank.ts), so adding questions never makes the site heavier to open.
 *
 * Every topic without a generator has at least 10 questions spread over all four difficulty
 * tiers (at least two per tier); Quant topics have a template generator per tier
 * (see lib/generators.ts). `npm run check:questions` enforces this.
 */
export const TOPICS: Topic[] = [
  // ---------------- Indian Polity ----------------
  {
    id: "polity-preamble",
    name: "Preamble of the Constitution",
    subject: "Indian Polity",
    aliases: ["preamble","we the people","sovereign socialist secular"],
    summary: "The Preamble is the introduction to the Constitution. It states the source of authority (the people of India), the nature of the state and its objectives.",
    keyPoints: [
      "Based on the Objectives Resolution moved by Jawaharlal Nehru on 13 December 1946.",
      "Declares India a Sovereign, Socialist, Secular, Democratic Republic.",
      "Objectives: Justice (social, economic, political), Liberty, Equality and Fraternity.",
      "Amended once, by the 42nd Amendment (1976), which added Socialist, Secular and Integrity.",
      "Kesavananda Bharati case (1973): the Preamble is a part of the Constitution.",
      "Source of authority: “We, the people of India”.",
    ],
  },
  {
    id: "polity-fundamental-rights",
    name: "Fundamental Rights",
    subject: "Indian Polity",
    aliases: ["fundamental rights","article 14","article 21","article 32","part iii","writs"],
    summary: "Fundamental Rights (Part III, Articles 12–35) are justiciable rights guaranteed to individuals against the state. There are six of them today.",
    keyPoints: [
      "Part III, Articles 12–35; borrowed from the USA (Bill of Rights).",
      "Six rights: Equality (14–18), Freedom (19–22), Against Exploitation (23–24), Freedom of Religion (25–28), Cultural and Educational (29–30), Constitutional Remedies (32).",
      "Article 17 abolishes untouchability.",
      "Article 21A (Right to Education, ages 6–14) was added by the 86th Amendment, 2002.",
      "Right to Property was removed as a Fundamental Right by the 44th Amendment (1978); it is now a legal right under Article 300A.",
      "Ambedkar called Article 32 the “heart and soul” of the Constitution.",
    ],
  },
  {
    id: "polity-dpsp-duties",
    name: "Directive Principles and Fundamental Duties",
    subject: "Indian Polity",
    aliases: ["dpsp","directive principles","fundamental duties","article 51a","uniform civil code"],
    summary: "Directive Principles (Part IV) guide the state in making policy but are not enforceable by courts. Fundamental Duties (Part IVA) list citizens’ moral obligations.",
    keyPoints: [
      "DPSP: Part IV, Articles 36–51; idea borrowed from the Irish Constitution.",
      "DPSPs are non-justiciable: courts cannot enforce them.",
      "Article 40: organisation of village panchayats. Article 44: Uniform Civil Code.",
      "Fundamental Duties: Part IVA, Article 51A, added by the 42nd Amendment (1976) on the Swaran Singh Committee’s recommendation.",
      "Originally 10 duties; the 11th (education of children 6–14) was added by the 86th Amendment (2002).",
    ],
  },
  {
    id: "polity-parliament",
    name: "Parliament of India",
    subject: "Indian Polity",
    aliases: ["parliament","lok sabha","rajya sabha","money bill","joint sitting","speaker"],
    summary: "Parliament consists of the President, the Rajya Sabha (Council of States) and the Lok Sabha (House of the People).",
    keyPoints: [
      "Maximum strength of the Rajya Sabha: 250 (238 elected + 12 nominated by the President).",
      "Rajya Sabha is a permanent house; one-third of members retire every two years.",
      "Minimum age: 25 years for the Lok Sabha, 30 years for the Rajya Sabha.",
      "Money Bills (Article 110) can be introduced only in the Lok Sabha.",
      "A joint sitting (Article 108) is presided over by the Speaker of the Lok Sabha.",
    ],
  },

  // ---------------- History ----------------
  {
    id: "history-ancient",
    name: "Ancient India",
    subject: "History",
    aliases: ["ancient india","ancient history","indus valley","harappa","harappan","vedic","rigveda","buddhism","jainism","buddha","mahavira","maurya","ashoka","gupta","sangam"],
    summary: "Ancient India from the Indus Valley Civilisation through the Vedic age, the rise of Buddhism and Jainism, the Mauryan and Gupta empires, and the Sangam age of the far south.",
    keyPoints: [
      "Indus Valley: Harappa found by Daya Ram Sahni (1921), Mohenjo-daro by R. D. Banerji (1922); Great Bath at Mohenjo-daro, dockyard at Lothal, ploughed field at Kalibangan; no iron.",
      "Rigveda is the oldest Veda: 10 mandalas; Gayatri Mantra in Mandala III, Purusha Sukta in Mandala X.",
      "Buddha: enlightenment at Bodh Gaya, first sermon at Sarnath, mahaparinirvana at Kushinagar. Mahavira was the 24th Jain Tirthankara.",
      "Buddhist councils: Rajagriha (Ajatashatru), Vaishali (Kalashoka), Pataliputra (Ashoka), Kashmir (Kanishka).",
      "Chandragupta Maurya founded the Mauryan Empire (c. 322 BCE) with Kautilya, author of the Arthashastra; Megasthenes wrote Indica.",
      "Ashoka turned to Buddhism after the Kalinga war (c. 261 BCE); his north-western edicts are in Kharosthi, most others in Brahmi.",
      "Guptas: Samudragupta’s Prayag prashasti by Harishena; Chandragupta II (Vikramaditya) patronised Kalidasa; Nalanda founded under Kumaragupta I.",
      "Sangam age: Cheras (bow), Cholas (tiger), Pandyas (fish); Tolkappiyam is the earliest Tamil grammar.",
    ],
  },
  {
    id: "history-national-movement",
    name: "Indian National Movement (1885–1947)",
    subject: "History",
    aliases: ["national movement","freedom struggle","congress","gandhi","quit india","dandi march","jallianwala"],
    summary: "India’s freedom struggle from the founding of the Indian National Congress in 1885 to independence in 1947.",
    keyPoints: [
      "Indian National Congress founded in 1885 by A. O. Hume; first session in Bombay, presided over by W. C. Bonnerjee.",
      "Partition of Bengal, 1905, under Lord Curzon, led to the Swadeshi Movement.",
      "Jallianwala Bagh massacre, Amritsar: 13 April 1919.",
      "Non-Cooperation Movement 1920–22; withdrawn after Chauri Chaura (1922).",
      "Dandi March (Salt Satyagraha) began on 12 March 1930.",
      "Quit India Movement launched in August 1942 with the slogan “Do or Die”.",
    ],
  },
  {
    id: "history-mughal",
    name: "The Mughal Empire",
    subject: "History",
    aliases: ["mughal","babur","akbar","shah jahan","aurangzeb","panipat"],
    summary: "The Mughal Empire was founded by Babur in 1526 and reached its height under Akbar, Jahangir and Shah Jahan.",
    keyPoints: [
      "First Battle of Panipat (1526): Babur defeated Ibrahim Lodi and founded the Mughal Empire.",
      "Akbar: Battle of Haldighati (1576) against Maharana Pratap; built Fatehpur Sikri; started Din-i-Ilahi.",
      "Shah Jahan built the Taj Mahal in memory of Mumtaz Mahal.",
      "Aurangzeb was the last of the great Mughals.",
    ],
  },

  // ---------------- Geography ----------------
  {
    id: "geo-physical-india",
    name: "Physical Geography of India",
    subject: "Geography",
    aliases: ["physical geography","physiography","himalaya","himalayan passes","mountain passes","plateau","monsoon","climate of india","soils","black soil","natural vegetation","forests","straits","indira point"],
    summary: "India’s physical setting: the Himalaya and its passes, the northern plains, the peninsular plateau and Ghats, the coasts and islands, and the monsoon climate, soils and vegetation that follow from them.",
    keyPoints: [
      "Himalaya from north to south: Trans-Himalaya (Karakoram, Ladakh, Zaskar), Himadri (Greater), Himachal (Lesser), Shiwalik (Outer).",
      "Passes, west to east: Zoji La (Srinagar–Leh), Shipki La (Himachal, Sutlej), Lipulekh (Uttarakhand), Nathu La (Sikkim), Bum La (Arunachal).",
      "Anamudi (2,695 m) is the highest peak of the Western Ghats and of peninsular India.",
      "The south-west monsoon reaches Kerala around 1 June; Tamil Nadu gets most of its rain from the retreating / north-east monsoon (October–December).",
      "Mawsynram and Cherrapunji (Meghalaya) are among the wettest places on Earth; Ladakh is a cold desert.",
      "Soils: alluvial is the most widespread; black (regur) soil suits cotton and is poor in nitrogen; red soil is coloured by iron oxide; laterite forms by heavy leaching.",
      "Indira Point (Great Nicobar) is the southernmost point of India; Palk Strait separates India and Sri Lanka; Ten Degree Channel separates the Andamans from the Nicobars.",
      "The Tropic of Cancer passes through eight states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.",
    ],
  },
  {
    id: "geo-indian-rivers",
    name: "Rivers of India",
    subject: "Geography",
    aliases: ["rivers","ganga","narmada","godavari","brahmaputra","dams","drainage"],
    summary: "India’s rivers fall into two systems: the Himalayan rivers (perennial) and the Peninsular rivers (mostly rain-fed).",
    keyPoints: [
      "The Ganga is the longest river flowing in India.",
      "Narmada and Tapi flow westward through rift valleys into the Arabian Sea.",
      "The Godavari is called the “Dakshin Ganga” (Ganga of the South).",
      "The Brahmaputra is called the Tsangpo in Tibet.",
      "Hirakud Dam is on the Mahanadi (Odisha).",
    ],
  },
  {
    id: "geo-solar-system",
    name: "The Solar System",
    subject: "Geography",
    aliases: ["solar system","planets","jupiter","mars","venus","universe"],
    summary: "The Solar System has the Sun at its centre and eight planets orbiting it.",
    keyPoints: [
      "Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
      "Largest planet: Jupiter. Smallest and closest to the Sun: Mercury.",
      "Hottest planet: Venus (thick carbon dioxide atmosphere).",
      "Mars is called the Red Planet because of iron oxide on its surface.",
      "Saturn has the most prominent ring system.",
    ],
  },

  // ---------------- Economy ----------------
  {
    id: "eco-basics",
    name: "Indian Economy Basics",
    subject: "Economy",
    aliases: ["economy","gdp","rbi","inflation","repo rate","gst","niti aayog"],
    summary: "Core ideas of the Indian economy: national income, the central bank, monetary policy and key institutions.",
    keyPoints: [
      "GDP: total value of final goods and services produced within a country in a year.",
      "RBI was established on 1 April 1935 and nationalised in 1949.",
      "Repo rate: the rate at which the RBI lends to commercial banks.",
      "NITI Aayog replaced the Planning Commission on 1 January 2015.",
      "GST was rolled out on 1 July 2017 (101st Amendment).",
    ],
  },

  // ---------------- General Science ----------------
  {
    id: "sci-physics",
    name: "Physics Basics",
    subject: "General Science",
    aliases: ["physics","si units","force","motion","newton","light","sound"],
    summary: "Basic physics for one-day exams: SI units, laws of motion, light and sound.",
    keyPoints: [
      "SI units: force – newton (N), work/energy – joule (J), power – watt (W), pressure – pascal (Pa).",
      "Newton’s first law is also called the law of inertia.",
      "Speed of light in vacuum ≈ 3 × 10⁸ m/s.",
      "Sound needs a medium; it cannot travel through a vacuum.",
    ],
  },
  {
    id: "sci-biology",
    name: "Human Body and Biology Basics",
    subject: "General Science",
    aliases: ["biology","human body","vitamins","cell","blood group","organs"],
    summary: "Frequently asked biology facts: cell organelles, organs, vitamins and deficiency diseases.",
    keyPoints: [
      "Mitochondria are the “powerhouse of the cell”.",
      "Largest organ: skin. Largest gland: liver.",
      "Vitamin A deficiency – night blindness; Vitamin C – scurvy; Vitamin D – rickets.",
      "Insulin is produced by the pancreas.",
      "Blood group O is the universal donor; AB is the universal recipient.",
    ],
  },
  {
    id: "sci-chemistry",
    name: "Chemistry Basics",
    subject: "General Science",
    aliases: ["chemistry","acids","ph","compounds","chemical formula","gases"],
    summary: "Common compounds, pH and the composition of air.",
    keyPoints: [
      "Common salt: sodium chloride (NaCl). Baking soda: sodium bicarbonate (NaHCO₃).",
      "pH of pure water is 7 (neutral); below 7 is acidic, above 7 is basic.",
      "Nitrogen is the most abundant gas in the atmosphere (about 78%).",
      "Laughing gas is nitrous oxide (N₂O).",
    ],
  },

  // ---------------- Quantitative Aptitude ----------------
  {
    id: "quant-percentage",
    name: "Percentage",
    subject: "Quantitative Aptitude",
    aliases: ["percentage","percent","%"],
    summary: "A percentage is a fraction with denominator 100. x% of N = (x / 100) × N.",
    keyPoints: [
      "x% of N = x × N / 100.",
      "Percentage change = (change ÷ original) × 100.",
      "If a value rises by x% and then falls by x%, the net change is a loss of x²/100 %.",
      "Useful fractions: 12.5% = 1/8, 20% = 1/5, 25% = 1/4, 33⅓% = 1/3.",
    ],
  },
  {
    id: "quant-profit-loss",
    name: "Profit and Loss",
    subject: "Quantitative Aptitude",
    aliases: ["profit","loss","cost price","selling price","discount"],
    summary: "Profit = SP − CP; Loss = CP − SP. Profit and loss percentages are always calculated on the cost price.",
    keyPoints: [
      "Profit % = (Profit ÷ CP) × 100.",
      "SP = CP × (100 + Profit%) / 100.",
      "SP = CP × (100 − Loss%) / 100.",
      "Discount is calculated on the marked price.",
    ],
  },
  {
    id: "quant-simple-interest",
    name: "Simple Interest",
    subject: "Quantitative Aptitude",
    aliases: ["simple interest","interest","si","principal"],
    summary: "Simple interest is earned only on the principal: SI = (P × R × T) / 100.",
    keyPoints: [
      "SI = P × R × T / 100.",
      "Amount = Principal + SI.",
      "If a sum doubles in T years at SI, the rate R = 100 / T %.",
    ],
  },
  {
    id: "quant-time-work",
    name: "Time and Work",
    subject: "Quantitative Aptitude",
    aliases: ["time and work","work","efficiency","pipes"],
    summary: "If A finishes a job in a days, A does 1/a of it per day. Rates add up when people work together.",
    keyPoints: [
      "Together, A and B finish in ab / (a + b) days.",
      "Work = Rate × Time.",
      "Use the LCM of the days as the total work to avoid fractions.",
    ],
  },
  {
    id: "quant-average",
    name: "Average",
    subject: "Quantitative Aptitude",
    aliases: ["average","mean"],
    summary: "Average = sum of observations ÷ number of observations.",
    keyPoints: [
      "Average of the first n natural numbers = (n + 1) / 2.",
      "If every value rises by k, the average rises by k.",
      "Sum = Average × Count.",
    ],
  },
  {
    id: "quant-ratio",
    name: "Ratio, Proportion and Mixtures",
    subject: "Quantitative Aptitude",
    aliases: ["ratio","proportion","mixture","alligation"],
    summary: "A ratio compares two quantities by division. Split a total into parts, chain ratios through a common term, and keep the unchanged ingredient fixed in mixture problems.",
    keyPoints: [
      "To divide N in a : b, one part = N ÷ (a + b).",
      "A : C = (A : B) × (B : C); make the common term equal first.",
      "Adding the same number to both terms moves a ratio towards 1 : 1.",
      "In mixtures, the ingredient you do not add or remove stays fixed.",
    ],
  },
  {
    id: "quant-tsd",
    name: "Time, Speed and Distance",
    subject: "Quantitative Aptitude",
    aliases: ["speed","distance","train","boat","stream","km/h"],
    summary: "Distance = Speed × Time. Trains, boats and relative speed are all this one formula with the right distance and the right speed.",
    keyPoints: [
      "km/h × 5/18 = m/s; m/s × 18/5 = km/h.",
      "A train passing a pole covers its own length; passing a platform covers train + platform.",
      "Opposite directions: add speeds. Same direction: subtract them.",
      "Boats: still water = (down + up) ÷ 2; stream = (down − up) ÷ 2.",
    ],
  },
  {
    id: "quant-ci",
    name: "Compound Interest",
    subject: "Quantitative Aptitude",
    aliases: ["compound interest","ci","compounded"],
    summary: "Compound interest is interest on interest: Amount = P × (1 + R/100)ⁿ. For 2 years it exceeds simple interest by P × (R/100)².",
    keyPoints: [
      "Amount = P(1 + R/100)ⁿ; CI = Amount − P.",
      "2 years: CI − SI = P(R/100)².",
      "At 10%: 2 years → × 1.21, 3 years → × 1.331.",
      "If a sum doubles in n years at CI, it becomes 2ᵏ times in k × n years.",
    ],
  },
  {
    id: "quant-number-system",
    name: "Number System, LCM and HCF",
    subject: "Quantitative Aptitude",
    aliases: ["number system","lcm","hcf","gcd","divisibility","unit digit","remainder","factors","prime numbers"],
    summary: "Number system questions test divisibility, factors, LCM and HCF, remainders and unit digits. Most can be done in your head once the rules below are at your fingertips.",
    keyPoints: [
      "LCM × HCF = product of the two numbers (for two numbers only).",
      "Divisibility: 3 or 9 – digit sum divisible by 3 or 9; 4 – last two digits; 8 – last three digits; 11 – difference of alternate-digit sums is 0 or a multiple of 11.",
      "Unit digits repeat in cycles of 4: 2 → 2, 4, 8, 6; 3 → 3, 9, 7, 1; 7 → 7, 9, 3, 1; 8 → 8, 4, 2, 6. 0, 1, 5, 6 never change; 4 and 9 alternate.",
      "If N = pᵃ × qᵇ × rᶜ (p, q, r prime), the number of factors is (a + 1)(b + 1)(c + 1).",
      "Least number leaving remainder r with each of a, b, c = LCM(a, b, c) + r.",
      "Greatest number dividing x and y leaving remainders r₁ and r₂ = HCF(x − r₁, y − r₂).",
    ],
  },
  {
    id: "quant-mensuration",
    name: "Mensuration (Area and Volume)",
    subject: "Quantitative Aptitude",
    aliases: ["mensuration","area","perimeter","volume","surface area","circle","cylinder","cone","sphere","cuboid","cube"],
    summary: "Mensuration is about lengths, areas and volumes of plane figures and solids. Memorise the formulas, use π = 22/7 when the radius is a multiple of 7, and keep units consistent.",
    keyPoints: [
      "Rectangle: area = l × b, perimeter = 2(l + b). Square: area = a², diagonal = a√2.",
      "Circle: area = πr², circumference = 2πr. Increasing the radius by x% increases the area by (2x + x²/100)%.",
      "Cuboid: volume = lbh, total surface area = 2(lb + bh + hl), diagonal = √(l² + b² + h²). Cube: volume = a³, TSA = 6a².",
      "Cylinder: volume = πr²h, curved surface area = 2πrh, total = 2πr(r + h).",
      "Cone: volume = ⅓πr²h, slant height l = √(r² + h²), curved surface area = πrl.",
      "Sphere: volume = ⁴⁄₃πr³, surface area = 4πr². Hemisphere: volume = ⅔πr³, total surface area = 3πr².",
      "When one solid is melted into another, the volume stays the same.",
    ],
  },

  // ---------------- Reasoning ----------------
  {
    id: "reason-series",
    name: "Number Series",
    subject: "Reasoning",
    aliases: ["series","number series","missing number","next number"],
    summary: "Find the rule connecting the terms: differences, ratios, squares/cubes or a mix.",
    keyPoints: [
      "Check differences first, then ratios.",
      "Look for squares (1, 4, 9, 16…) and cubes (1, 8, 27…).",
      "Patterns like ×2 + 1 are common.",
    ],
  },
  {
    id: "reason-coding",
    name: "Coding–Decoding",
    subject: "Reasoning",
    aliases: ["coding decoding","coding","code","decoding"],
    summary: "Work out the rule used to change a word into a code, then apply it to the new word.",
    keyPoints: [
      "Write down letter positions: A=1 … Z=26.",
      "Common rules: shift each letter by +1/−1, reverse order, sum of positions.",
    ],
  },
  {
    id: "reason-blood-relations",
    name: "Blood Relations",
    subject: "Reasoning",
    aliases: ["blood relations","family","relation"],
    summary: "Decode family relationships step by step, ideally with a small family-tree diagram.",
    keyPoints: [
      "Draw a family tree: + for male, − for female.",
      "Start from the end of the sentence and work back to the speaker.",
    ],
  },
  {
    id: "reason-syllogism",
    name: "Syllogism",
    subject: "Reasoning",
    aliases: ["syllogism","statements and conclusions","venn"],
    summary: "Take the statements as true even if they sound odd, draw the smallest Venn diagram they allow, and accept only conclusions that hold in every possible diagram.",
    keyPoints: [
      "“All A are B” converts to “Some B are A”, never to “All B are A”.",
      "“No A is B” converts to “No B is A”.",
      "Some + Some gives no definite conclusion.",
      "Some A are B + No B is C ⇒ Some A are not C.",
      "“Only a few A are B” means some are and some are not, so “All A are B” is impossible.",
    ],
  },
  {
    id: "reason-direction",
    name: "Direction Sense",
    subject: "Reasoning",
    aliases: ["direction","directions","north","distance from start","shadow"],
    summary: "Track each turn on a rough sketch: right and left depend on which way the person is facing. The final distance from the start is often a Pythagoras triangle.",
    keyPoints: [
      "Facing north, right is east; facing south, right is west.",
      "Morning sun is in the east, so shadows fall to the west; evening shadows fall to the east.",
      "Net displacement = √(net east–west² + net north–south²).",
      "Common triples: 3-4-5, 5-12-13, 6-8-10.",
    ],
  },
  {
    id: "reason-analogy",
    name: "Analogy and Classification",
    subject: "Reasoning",
    aliases: ["analogy","analogies","classification","odd one out","odd man out","word analogy","number analogy","letter analogy"],
    summary: "Analogy asks you to find the relationship in one pair and apply it to another; classification asks which item breaks the rule the others share. Test every option against the rule before choosing.",
    keyPoints: [
      "Word analogies: worker–tool, tool–use, instrument–measures, study–subject, part–whole, product–raw material.",
      "Number analogies: check n², n³, n² ± 1, n³ ± 1, n(n + 1) and simple multiples.",
      "Letter analogies: convert letters to positions (A = 1 … Z = 26) and look for a constant shift.",
      "Opposite letters add up to 27: A–Z, B–Y, C–X, … M–N.",
      "Odd one out: find the rule that fits exactly three options; if two rules each isolate a different option, look for a stronger one.",
      "Useful perfect squares 11²–20²: 121, 144, 169, 196, 225, 256, 289, 324, 361, 400; cubes 2³–10³: 8, 27, 64, 125, 216, 343, 512, 729, 1000.",
    ],
  },

  // ---------------- English ----------------
  {
    id: "eng-vocabulary",
    name: "Synonyms, Antonyms and One-Word Substitution",
    subject: "English",
    aliases: ["synonyms","antonyms","vocabulary","one word substitution"],
    summary: "Vocabulary questions test word meanings, opposites and single words for phrases.",
    keyPoints: [
      "Learn words in groups with their roots (bene = good, mal = bad).",
      "Revise common one-word substitutions.",
    ],
  },
  {
    id: "eng-grammar",
    name: "Grammar and Error Spotting",
    subject: "English",
    aliases: ["grammar","error spotting","subject verb agreement","prepositions","spelling"],
    summary: "Grammar questions focus on subject–verb agreement, tenses, prepositions and spelling.",
    keyPoints: [
      "“One of + plural noun” takes a singular verb.",
      "“Neither/Either of” takes a singular verb.",
      "Use “since” with a point in time and “for” with a period of time.",
    ],
  },

  // ---------------- Hindi Language ----------------
  {
    id: "hindi-vyakaran",
    name: "हिंदी व्याकरण (Hindi Grammar)",
    subject: "Hindi Language",
    aliases: ["hindi","hindi grammar","vyakaran","hindi vyakaran","sandhi","samas","paryayvachi","vilom","muhavare","alankar","ras","हिंदी","व्याकरण","संधि","समास","पर्यायवाची","विलोम","मुहावरे","अलंकार","रस"],
    summary: "हिंदी व्याकरण के वे अंश जो SSC, पुलिस, शिक्षक पात्रता और राज्य परीक्षाओं में बार-बार पूछे जाते हैं: संधि, समास, पर्यायवाची, विलोम, तत्सम-तद्भव, मुहावरे, लिंग-वचन, उपसर्ग-प्रत्यय, शुद्ध वर्तनी, रस और अलंकार।",
    keyPoints: [
      "संधि के तीन भेद: स्वर, व्यंजन और विसर्ग। स्वर संधि के पाँच भेद: दीर्घ (हिमालय), गुण (महेश), वृद्धि (सदैव), यण (इत्यादि), अयादि (नयन)।",
      "समास के छह भेद: अव्ययीभाव (यथाशक्ति), तत्पुरुष (राजपुत्र), कर्मधारय (नीलकमल), द्विगु (त्रिभुवन), द्वंद्व (माता-पिता), बहुव्रीहि (चक्रपाणि)।",
      "तत्सम-तद्भव: अग्नि–आग, क्षेत्र–खेत, दुग्ध–दूध, हस्त–हाथ।",
      "रस के चार अंग: स्थायी भाव, विभाव, अनुभाव और संचारी भाव; संचारी भाव 33 माने गए हैं।",
      "स्थायी भाव: शृंगार–रति, हास्य–हास, करुण–शोक, वीर–उत्साह, रौद्र–क्रोध, भयानक–भय।",
      "अलंकार: एक शब्द कई बार, अर्थ अलग – यमक; एक बार, अर्थ अनेक – श्लेष; उपमेय पर उपमान का अभेद आरोप – रूपक; ‘सा, सम, सरिस’ से तुलना – उपमा।",
    ],
  },

  // ---------------- Banking Awareness ----------------
  {
    id: "bank-awareness",
    name: "Banking Awareness",
    subject: "Banking Awareness",
    aliases: ["banking","neft","rtgs","kyc","crr","slr","sbi"],
    summary: "Basic banking terms, payment systems and regulators.",
    keyPoints: [
      "NEFT: National Electronic Funds Transfer. RTGS: Real Time Gross Settlement.",
      "KYC: Know Your Customer.",
      "CRR: share of deposits banks must keep as cash with the RBI.",
      "SBI was formed in 1955 from the Imperial Bank of India.",
      "The RBI is headquartered in Mumbai.",
    ],
  },

  // ---------------- Computer Awareness ----------------
  {
    id: "comp-awareness",
    name: "Computer Awareness",
    subject: "Computer Awareness",
    aliases: ["computer","cpu","ram","memory","internet","shortcut keys"],
    summary: "Basic computer hardware, memory, networking and shortcuts.",
    keyPoints: [
      "The CPU is the “brain” of the computer.",
      "1 byte = 8 bits.",
      "RAM is volatile; ROM is non-volatile.",
      "HTTP: HyperText Transfer Protocol.",
    ],
  },

  // ---------------- Child Development and Pedagogy ----------------
  {
    id: "cdp-child-development",
    name: "Child Development and Pedagogy",
    subject: "Child Development and Pedagogy",
    aliases: ["cdp","piaget","vygotsky","kohlberg","pedagogy","child development","rte"],
    summary: "Key learning theories and child-development thinkers tested in CTET and TET exams.",
    keyPoints: [
      "Piaget’s stages: Sensorimotor (0–2), Pre-operational (2–7), Concrete operational (7–11), Formal operational (11+).",
      "Vygotsky: Zone of Proximal Development (ZPD) and scaffolding.",
      "Kohlberg: stages of moral development.",
      "Howard Gardner: theory of multiple intelligences.",
      "RTE Act 2009: free and compulsory education for children aged 6–14.",
    ],
  },
];

export const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
