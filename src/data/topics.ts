import type { MCQ, Topic } from "@/lib/types";

/**
 * Sample study content. Questions are practice questions written in the style of
 * one-day exams; they are not labelled as previous-year questions (PYQs).
 */

type Q = [question: string, options: string[], answer: number, explanation: string];

interface TopicSeed extends Topic {
  questions: Q[];
}

const SEED: TopicSeed[] = [
  // ---------------- Polity ----------------
  {
    id: "polity-preamble",
    name: "Preamble of the Constitution",
    subject: "Indian Polity",
    aliases: ["preamble", "we the people", "sovereign socialist secular"],
    summary: "The Preamble is the introduction to the Constitution. It states the source of authority (the people of India), the nature of the state and its objectives.",
    keyPoints: [
      "Based on the Objectives Resolution moved by Jawaharlal Nehru on 13 December 1946.",
      "Declares India a Sovereign, Socialist, Secular, Democratic Republic.",
      "Objectives: Justice (social, economic, political), Liberty, Equality and Fraternity.",
      "Amended once, by the 42nd Amendment (1976), which added Socialist, Secular and Integrity.",
      "Kesavananda Bharati case (1973): the Preamble is a part of the Constitution.",
      "Source of authority: “We, the people of India”.",
    ],
    questions: [
      ["Which Constitutional Amendment added the words “Socialist” and “Secular” to the Preamble?", ["24th Amendment", "42nd Amendment", "44th Amendment", "52nd Amendment"], 1, "The 42nd Amendment Act, 1976 added Socialist, Secular and Integrity to the Preamble."],
      ["Which of these words was NOT added to the Preamble by the 42nd Amendment?", ["Socialist", "Secular", "Integrity", "Republic"], 3, "“Republic” was in the original Preamble. Socialist, Secular and Integrity were added in 1976."],
      ["The Objectives Resolution, on which the Preamble is based, was moved by:", ["B. R. Ambedkar", "Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel"], 2, "Nehru moved the Objectives Resolution in the Constituent Assembly on 13 December 1946."],
      ["In which case did the Supreme Court hold that the Preamble is a part of the Constitution?", ["Berubari Union case", "Kesavananda Bharati case", "Golaknath case", "Minerva Mills case"], 1, "Kesavananda Bharati (1973) reversed the Berubari (1960) view and held the Preamble is part of the Constitution."],
    ],
  },
  {
    id: "polity-fundamental-rights",
    name: "Fundamental Rights",
    subject: "Indian Polity",
    aliases: ["fundamental rights", "article 14", "article 21", "article 32", "part iii", "writs"],
    summary: "Fundamental Rights (Part III, Articles 12–35) are justiciable rights guaranteed to individuals against the state. There are six of them today.",
    keyPoints: [
      "Part III, Articles 12–35; borrowed from the USA (Bill of Rights).",
      "Six rights: Equality (14–18), Freedom (19–22), Against Exploitation (23–24), Freedom of Religion (25–28), Cultural and Educational (29–30), Constitutional Remedies (32).",
      "Article 17 abolishes untouchability.",
      "Article 21A (Right to Education, ages 6–14) was added by the 86th Amendment, 2002.",
      "Right to Property was removed as a Fundamental Right by the 44th Amendment (1978); it is now a legal right under Article 300A.",
      "Ambedkar called Article 32 the “heart and soul” of the Constitution.",
    ],
    questions: [
      ["Which Article of the Constitution abolishes untouchability?", ["Article 14", "Article 15", "Article 17", "Article 21"], 2, "Article 17 abolishes untouchability and forbids its practice in any form."],
      ["Dr. B. R. Ambedkar described which Article as the “heart and soul” of the Constitution?", ["Article 19", "Article 21", "Article 32", "Article 368"], 2, "Article 32 (Right to Constitutional Remedies) lets citizens move the Supreme Court directly to enforce Fundamental Rights."],
      ["The Right to Property was removed from the list of Fundamental Rights by the:", ["42nd Amendment", "44th Amendment", "52nd Amendment", "86th Amendment"], 1, "The 44th Amendment (1978) removed it; it is now a constitutional legal right under Article 300A."],
      ["The Right to Education (Article 21A) was inserted by which Amendment?", ["73rd Amendment", "74th Amendment", "86th Amendment", "93rd Amendment"], 2, "The 86th Amendment Act, 2002 inserted Article 21A for free and compulsory education for children aged 6–14."],
    ],
  },
  {
    id: "polity-dpsp-duties",
    name: "Directive Principles and Fundamental Duties",
    subject: "Indian Polity",
    aliases: ["dpsp", "directive principles", "fundamental duties", "article 51a", "uniform civil code"],
    summary: "Directive Principles (Part IV) guide the state in making policy but are not enforceable by courts. Fundamental Duties (Part IVA) list citizens’ moral obligations.",
    keyPoints: [
      "DPSP: Part IV, Articles 36–51; idea borrowed from the Irish Constitution.",
      "DPSPs are non-justiciable: courts cannot enforce them.",
      "Article 40: organisation of village panchayats. Article 44: Uniform Civil Code.",
      "Fundamental Duties: Part IVA, Article 51A, added by the 42nd Amendment (1976) on the Swaran Singh Committee’s recommendation.",
      "Originally 10 duties; the 11th (education of children 6–14) was added by the 86th Amendment (2002).",
    ],
    questions: [
      ["The idea of Directive Principles of State Policy was borrowed from the Constitution of:", ["USA", "Ireland", "Canada", "Australia"], 1, "DPSPs were borrowed from the Irish Constitution."],
      ["Fundamental Duties were added to the Constitution on the recommendation of the:", ["Sarkaria Commission", "Swaran Singh Committee", "Balwant Rai Mehta Committee", "Kothari Commission"], 1, "The Swaran Singh Committee (1976) recommended them; the 42nd Amendment added Article 51A."],
      ["Which Article of the Constitution deals with a Uniform Civil Code?", ["Article 40", "Article 44", "Article 48", "Article 51"], 1, "Article 44 directs the state to secure a Uniform Civil Code for citizens."],
      ["How many Fundamental Duties are there in the Constitution today?", ["9", "10", "11", "12"], 2, "There were 10 originally; the 86th Amendment (2002) added the 11th."],
    ],
  },
  {
    id: "polity-parliament",
    name: "Parliament of India",
    subject: "Indian Polity",
    aliases: ["parliament", "lok sabha", "rajya sabha", "money bill", "joint sitting", "speaker"],
    summary: "Parliament consists of the President, the Rajya Sabha (Council of States) and the Lok Sabha (House of the People).",
    keyPoints: [
      "Maximum strength of the Rajya Sabha: 250 (238 elected + 12 nominated by the President).",
      "Rajya Sabha is a permanent house; one-third of members retire every two years.",
      "Minimum age: 25 years for the Lok Sabha, 30 years for the Rajya Sabha.",
      "Money Bills (Article 110) can be introduced only in the Lok Sabha.",
      "A joint sitting (Article 108) is presided over by the Speaker of the Lok Sabha.",
    ],
    questions: [
      ["What is the maximum number of members the President can nominate to the Rajya Sabha?", ["2", "10", "12", "14"], 2, "The President nominates 12 members with special knowledge of literature, science, art and social service."],
      ["A Money Bill can be introduced only in:", ["Rajya Sabha", "Lok Sabha", "Either House", "A joint sitting"], 1, "Under Article 109–110, Money Bills can be introduced only in the Lok Sabha."],
      ["Who presides over a joint sitting of both Houses of Parliament?", ["President", "Vice-President", "Speaker of the Lok Sabha", "Prime Minister"], 2, "Under Article 108, the Speaker of the Lok Sabha presides over a joint sitting."],
      ["What is the minimum age to become a member of the Rajya Sabha?", ["21 years", "25 years", "30 years", "35 years"], 2, "The minimum age is 30 for the Rajya Sabha and 25 for the Lok Sabha."],
    ],
  },

  // ---------------- History ----------------
  {
    id: "history-national-movement",
    name: "Indian National Movement (1885–1947)",
    subject: "History",
    aliases: ["national movement", "freedom struggle", "congress", "gandhi", "quit india", "dandi march", "jallianwala"],
    summary: "India’s freedom struggle from the founding of the Indian National Congress in 1885 to independence in 1947.",
    keyPoints: [
      "Indian National Congress founded in 1885 by A. O. Hume; first session in Bombay, presided over by W. C. Bonnerjee.",
      "Partition of Bengal, 1905, under Lord Curzon, led to the Swadeshi Movement.",
      "Jallianwala Bagh massacre, Amritsar: 13 April 1919.",
      "Non-Cooperation Movement 1920–22; withdrawn after Chauri Chaura (1922).",
      "Dandi March (Salt Satyagraha) began on 12 March 1930.",
      "Quit India Movement launched in August 1942 with the slogan “Do or Die”.",
    ],
    questions: [
      ["Who presided over the first session of the Indian National Congress in 1885?", ["Dadabhai Naoroji", "W. C. Bonnerjee", "A. O. Hume", "Surendranath Banerjee"], 1, "W. C. Bonnerjee presided over the first session held in Bombay in December 1885."],
      ["The Partition of Bengal (1905) was carried out under which Viceroy?", ["Lord Ripon", "Lord Curzon", "Lord Minto", "Lord Dalhousie"], 1, "Lord Curzon announced the Partition of Bengal in 1905."],
      ["The Dandi March began on:", ["26 January 1930", "12 March 1930", "6 April 1930", "8 August 1942"], 1, "Gandhi started the march from Sabarmati Ashram on 12 March 1930 and broke the salt law at Dandi on 6 April 1930."],
      ["The slogan “Do or Die” is associated with which movement?", ["Non-Cooperation Movement", "Civil Disobedience Movement", "Quit India Movement", "Swadeshi Movement"], 2, "Gandhi gave the call “Do or Die” when the Quit India Movement was launched in August 1942."],
    ],
  },
  {
    id: "history-mughal",
    name: "The Mughal Empire",
    subject: "History",
    aliases: ["mughal", "babur", "akbar", "shah jahan", "aurangzeb", "panipat"],
    summary: "The Mughal Empire was founded by Babur in 1526 and reached its height under Akbar, Jahangir and Shah Jahan.",
    keyPoints: [
      "First Battle of Panipat (1526): Babur defeated Ibrahim Lodi and founded the Mughal Empire.",
      "Akbar: Battle of Haldighati (1576) against Maharana Pratap; built Fatehpur Sikri; started Din-i-Ilahi.",
      "Shah Jahan built the Taj Mahal in memory of Mumtaz Mahal.",
      "Aurangzeb was the last of the great Mughals.",
    ],
    questions: [
      ["The First Battle of Panipat (1526) was fought between Babur and:", ["Rana Sanga", "Ibrahim Lodi", "Hemu", "Sher Shah Suri"], 1, "Babur defeated Ibrahim Lodi, the last Sultan of Delhi, and founded the Mughal Empire."],
      ["The Battle of Haldighati (1576) was fought between the Mughal army and:", ["Shivaji", "Rana Sanga", "Maharana Pratap", "Hemu"], 2, "Akbar’s forces, led by Man Singh, fought Maharana Pratap of Mewar."],
      ["Which Mughal emperor built Fatehpur Sikri?", ["Babur", "Humayun", "Akbar", "Shah Jahan"], 2, "Akbar built Fatehpur Sikri as his capital."],
      ["The Taj Mahal was built by:", ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"], 2, "Shah Jahan built it in Agra in memory of his wife Mumtaz Mahal."],
    ],
  },

  // ---------------- Geography ----------------
  {
    id: "geo-indian-rivers",
    name: "Rivers of India",
    subject: "Geography",
    aliases: ["rivers", "ganga", "narmada", "godavari", "brahmaputra", "dams", "drainage"],
    summary: "India’s rivers fall into two systems: the Himalayan rivers (perennial) and the Peninsular rivers (mostly rain-fed).",
    keyPoints: [
      "The Ganga is the longest river flowing in India.",
      "Narmada and Tapi flow westward through rift valleys into the Arabian Sea.",
      "The Godavari is called the “Dakshin Ganga” (Ganga of the South).",
      "The Brahmaputra is called the Tsangpo in Tibet.",
      "Hirakud Dam is on the Mahanadi (Odisha).",
    ],
    questions: [
      ["Which of these rivers flows westward into the Arabian Sea?", ["Godavari", "Krishna", "Narmada", "Mahanadi"], 2, "The Narmada flows west through a rift valley into the Arabian Sea; the others drain into the Bay of Bengal."],
      ["Which river is known as the “Dakshin Ganga”?", ["Kaveri", "Godavari", "Krishna", "Tungabhadra"], 1, "The Godavari, the longest peninsular river, is called the Dakshin Ganga."],
      ["The Brahmaputra is known by which name in Tibet?", ["Tsangpo", "Dihang", "Jamuna", "Lohit"], 0, "It is the Tsangpo in Tibet, the Dihang in Arunachal Pradesh and the Jamuna in Bangladesh."],
      ["Hirakud Dam is built on which river?", ["Godavari", "Mahanadi", "Sutlej", "Krishna"], 1, "Hirakud Dam, in Odisha, is on the Mahanadi."],
    ],
  },
  {
    id: "geo-solar-system",
    name: "The Solar System",
    subject: "Geography",
    aliases: ["solar system", "planets", "jupiter", "mars", "venus", "universe"],
    summary: "The Solar System has the Sun at its centre and eight planets orbiting it.",
    keyPoints: [
      "Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
      "Largest planet: Jupiter. Smallest and closest to the Sun: Mercury.",
      "Hottest planet: Venus (thick carbon dioxide atmosphere).",
      "Mars is called the Red Planet because of iron oxide on its surface.",
      "Saturn has the most prominent ring system.",
    ],
    questions: [
      ["Which is the largest planet in the Solar System?", ["Saturn", "Jupiter", "Neptune", "Earth"], 1, "Jupiter is the largest planet."],
      ["Which planet is the hottest?", ["Mercury", "Venus", "Mars", "Jupiter"], 1, "Venus is hotter than Mercury because its thick CO₂ atmosphere traps heat."],
      ["Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Mercury"], 1, "Iron oxide (rust) on its surface makes Mars look red."],
      ["Which planet is closest to the Sun?", ["Venus", "Earth", "Mercury", "Mars"], 2, "Mercury is the closest planet to the Sun."],
    ],
  },

  // ---------------- Economy ----------------
  {
    id: "eco-basics",
    name: "Indian Economy Basics",
    subject: "Economy",
    aliases: ["economy", "gdp", "rbi", "inflation", "repo rate", "gst", "niti aayog"],
    summary: "Core ideas of the Indian economy: national income, the central bank, monetary policy and key institutions.",
    keyPoints: [
      "GDP: total value of final goods and services produced within a country in a year.",
      "RBI was established on 1 April 1935 and nationalised in 1949.",
      "Repo rate: the rate at which the RBI lends to commercial banks.",
      "NITI Aayog replaced the Planning Commission on 1 January 2015.",
      "GST was rolled out on 1 July 2017 (101st Amendment).",
    ],
    questions: [
      ["The Reserve Bank of India was established in:", ["1935", "1947", "1949", "1969"], 0, "The RBI was set up on 1 April 1935 and nationalised in 1949."],
      ["The rate at which the RBI lends money to commercial banks is called the:", ["Reverse repo rate", "Repo rate", "Bank rate", "CRR"], 1, "The repo rate is the rate at which the RBI lends to banks against government securities."],
      ["NITI Aayog replaced which body?", ["Finance Commission", "Planning Commission", "National Development Council", "Election Commission"], 1, "NITI Aayog replaced the Planning Commission on 1 January 2015."],
      ["GST was implemented in India from:", ["1 April 2016", "1 July 2017", "1 January 2018", "1 April 2017"], 1, "GST came into force on 1 July 2017."],
    ],
  },

  // ---------------- Science ----------------
  {
    id: "sci-physics",
    name: "Physics Basics",
    subject: "General Science",
    aliases: ["physics", "si units", "force", "motion", "newton", "light", "sound"],
    summary: "Basic physics for one-day exams: SI units, laws of motion, light and sound.",
    keyPoints: [
      "SI units: force – newton (N), work/energy – joule (J), power – watt (W), pressure – pascal (Pa).",
      "Newton’s first law is also called the law of inertia.",
      "Speed of light in vacuum ≈ 3 × 10⁸ m/s.",
      "Sound needs a medium; it cannot travel through a vacuum.",
    ],
    questions: [
      ["What is the SI unit of force?", ["Joule", "Watt", "Newton", "Pascal"], 2, "Force is measured in newtons (1 N = 1 kg·m/s²)."],
      ["Newton’s first law of motion is also known as the law of:", ["Acceleration", "Inertia", "Gravitation", "Action and reaction"], 1, "The first law describes inertia: a body stays at rest or in uniform motion unless acted on by a force."],
      ["Sound cannot travel through:", ["Water", "Steel", "Air", "Vacuum"], 3, "Sound is a mechanical wave and needs a medium."],
      ["The SI unit of power is the:", ["Joule", "Watt", "Volt", "Newton"], 1, "Power is work done per second, measured in watts (1 W = 1 J/s)."],
    ],
  },
  {
    id: "sci-biology",
    name: "Human Body and Biology Basics",
    subject: "General Science",
    aliases: ["biology", "human body", "vitamins", "cell", "blood group", "organs"],
    summary: "Frequently asked biology facts: cell organelles, organs, vitamins and deficiency diseases.",
    keyPoints: [
      "Mitochondria are the “powerhouse of the cell”.",
      "Largest organ: skin. Largest gland: liver.",
      "Vitamin A deficiency – night blindness; Vitamin C – scurvy; Vitamin D – rickets.",
      "Insulin is produced by the pancreas.",
      "Blood group O is the universal donor; AB is the universal recipient.",
    ],
    questions: [
      ["Which organelle is called the “powerhouse of the cell”?", ["Ribosome", "Nucleus", "Mitochondria", "Golgi body"], 2, "Mitochondria produce ATP through cellular respiration."],
      ["Deficiency of Vitamin C causes:", ["Rickets", "Scurvy", "Night blindness", "Beriberi"], 1, "Scurvy (bleeding gums) is caused by a lack of Vitamin C."],
      ["Which is the largest gland in the human body?", ["Pancreas", "Thyroid", "Liver", "Pituitary"], 2, "The liver is the largest gland; the skin is the largest organ."],
      ["Insulin is secreted by the:", ["Liver", "Pancreas", "Kidney", "Thyroid"], 1, "The beta cells of the pancreas (islets of Langerhans) secrete insulin."],
    ],
  },
  {
    id: "sci-chemistry",
    name: "Chemistry Basics",
    subject: "General Science",
    aliases: ["chemistry", "acids", "ph", "compounds", "chemical formula", "gases"],
    summary: "Common compounds, pH and the composition of air.",
    keyPoints: [
      "Common salt: sodium chloride (NaCl). Baking soda: sodium bicarbonate (NaHCO₃).",
      "pH of pure water is 7 (neutral); below 7 is acidic, above 7 is basic.",
      "Nitrogen is the most abundant gas in the atmosphere (about 78%).",
      "Laughing gas is nitrous oxide (N₂O).",
    ],
    questions: [
      ["What is the chemical name of baking soda?", ["Sodium carbonate", "Sodium bicarbonate", "Calcium carbonate", "Sodium chloride"], 1, "Baking soda is sodium bicarbonate, NaHCO₃."],
      ["What is the pH of pure water?", ["0", "5", "7", "14"], 2, "Pure water is neutral, with a pH of 7 at 25 °C."],
      ["Which gas is most abundant in the Earth’s atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], 2, "Nitrogen makes up about 78% of the atmosphere."],
      ["“Laughing gas” is the common name of:", ["Nitric oxide", "Nitrous oxide", "Nitrogen dioxide", "Ammonia"], 1, "Nitrous oxide (N₂O) is called laughing gas."],
    ],
  },

  // ---------------- Quantitative Aptitude (also has generated questions) ----------------
  {
    id: "quant-percentage",
    name: "Percentage",
    subject: "Quantitative Aptitude",
    aliases: ["percentage", "percent", "%"],
    summary: "A percentage is a fraction with denominator 100. x% of N = (x / 100) × N.",
    keyPoints: [
      "x% of N = x × N / 100.",
      "Percentage change = (change ÷ original) × 100.",
      "If a value rises by x% and then falls by x%, the net change is a loss of x²/100 %.",
      "Useful fractions: 12.5% = 1/8, 20% = 1/5, 25% = 1/4, 33⅓% = 1/3.",
    ],
    questions: [
      ["A price rises by 20% and then falls by 20%. The net change is:", ["No change", "4% decrease", "4% increase", "2% decrease"], 1, "Net change = −x²/100 = −400/100 = −4%."],
    ],
  },
  {
    id: "quant-profit-loss",
    name: "Profit and Loss",
    subject: "Quantitative Aptitude",
    aliases: ["profit", "loss", "cost price", "selling price", "discount"],
    summary: "Profit = SP − CP; Loss = CP − SP. Profit and loss percentages are always calculated on the cost price.",
    keyPoints: [
      "Profit % = (Profit ÷ CP) × 100.",
      "SP = CP × (100 + Profit%) / 100.",
      "SP = CP × (100 − Loss%) / 100.",
      "Discount is calculated on the marked price.",
    ],
    questions: [
      ["An article bought for ₹500 is sold for ₹600. The profit percentage is:", ["10%", "16.67%", "20%", "25%"], 2, "Profit = ₹100; profit % = 100 / 500 × 100 = 20%."],
    ],
  },
  {
    id: "quant-simple-interest",
    name: "Simple Interest",
    subject: "Quantitative Aptitude",
    aliases: ["simple interest", "interest", "si", "principal"],
    summary: "Simple interest is earned only on the principal: SI = (P × R × T) / 100.",
    keyPoints: ["SI = P × R × T / 100.", "Amount = Principal + SI.", "If a sum doubles in T years at SI, the rate R = 100 / T %."],
    questions: [
      ["At what rate of simple interest will a sum double itself in 10 years?", ["5%", "8%", "10%", "12%"], 2, "To double, SI = P, so P = P × R × 10 / 100, giving R = 10%."],
    ],
  },
  {
    id: "quant-time-work",
    name: "Time and Work",
    subject: "Quantitative Aptitude",
    aliases: ["time and work", "work", "efficiency", "pipes"],
    summary: "If A finishes a job in a days, A does 1/a of it per day. Rates add up when people work together.",
    keyPoints: ["Together, A and B finish in ab / (a + b) days.", "Work = Rate × Time.", "Use the LCM of the days as the total work to avoid fractions."],
    questions: [],
  },
  {
    id: "quant-average",
    name: "Average",
    subject: "Quantitative Aptitude",
    aliases: ["average", "mean"],
    summary: "Average = sum of observations ÷ number of observations.",
    keyPoints: ["Average of the first n natural numbers = (n + 1) / 2.", "If every value rises by k, the average rises by k.", "Sum = Average × Count."],
    questions: [
      ["What is the average of the first 10 natural numbers?", ["5", "5.5", "6", "10"], 1, "Average of 1 to n = (n + 1) / 2 = 11 / 2 = 5.5."],
    ],
  },

  // ---------------- Reasoning ----------------
  {
    id: "reason-series",
    name: "Number Series",
    subject: "Reasoning",
    aliases: ["series", "number series", "missing number", "next number"],
    summary: "Find the rule connecting the terms: differences, ratios, squares/cubes or a mix.",
    keyPoints: ["Check differences first, then ratios.", "Look for squares (1, 4, 9, 16…) and cubes (1, 8, 27…).", "Patterns like ×2 + 1 are common."],
    questions: [
      ["Find the next number: 2, 6, 12, 20, 30, ?", ["40", "42", "44", "36"], 1, "The terms are n(n + 1): 1×2, 2×3, … 6×7 = 42."],
      ["Find the next number: 5, 11, 23, 47, ?", ["94", "95", "96", "93"], 1, "Each term is (previous × 2) + 1: 47 × 2 + 1 = 95."],
      ["Find the next number: 3, 9, 27, 81, ?", ["162", "243", "324", "216"], 1, "Each term is multiplied by 3: 81 × 3 = 243."],
      ["Find the next number: 2, 3, 5, 7, 11, ?", ["12", "13", "15", "17"], 1, "These are consecutive prime numbers; the next is 13."],
    ],
  },
  {
    id: "reason-coding",
    name: "Coding–Decoding",
    subject: "Reasoning",
    aliases: ["coding decoding", "coding", "code", "decoding"],
    summary: "Work out the rule used to change a word into a code, then apply it to the new word.",
    keyPoints: ["Write down letter positions: A=1 … Z=26.", "Common rules: shift each letter by +1/−1, reverse order, sum of positions."],
    questions: [
      ["If CAT is coded as DBU, how is DOG coded?", ["EPH", "EPI", "DPH", "FPH"], 0, "Each letter moves one place forward: D→E, O→P, G→H."],
      ["If ROSE is written as SPTF, how is LILY written?", ["MJMZ", "MJNZ", "KJMZ", "MKMZ"], 0, "Each letter moves one place forward: L→M, I→J, L→M, Y→Z."],
      ["If APPLE = 50 (sum of letter positions), what is BAT?", ["21", "22", "23", "24"], 2, "B(2) + A(1) + T(20) = 23."],
    ],
  },
  {
    id: "reason-blood-relations",
    name: "Blood Relations",
    subject: "Reasoning",
    aliases: ["blood relations", "family", "relation"],
    summary: "Decode family relationships step by step, ideally with a small family-tree diagram.",
    keyPoints: ["Draw a family tree: + for male, − for female.", "Start from the end of the sentence and work back to the speaker."],
    questions: [
      ["Pointing to a man, Riya says, “He is the son of my grandfather’s only son.” How is the man related to Riya?", ["Cousin", "Brother", "Uncle", "Nephew"], 1, "Her grandfather’s only son is her father, and her father’s son is her brother."],
      ["A is B’s sister. C is B’s mother. D is C’s father. How is A related to D?", ["Granddaughter", "Daughter", "Niece", "Grandmother"], 0, "A is C’s daughter, and C is D’s daughter, so A is D’s granddaughter."],
      ["X is the brother of Y, and Y is the father of Z. How is X related to Z?", ["Father", "Uncle", "Brother", "Grandfather"], 1, "X is the brother of Z’s father, so X is Z’s uncle."],
    ],
  },

  // ---------------- English ----------------
  {
    id: "eng-vocabulary",
    name: "Synonyms, Antonyms and One-Word Substitution",
    subject: "English",
    aliases: ["synonyms", "antonyms", "vocabulary", "one word substitution"],
    summary: "Vocabulary questions test word meanings, opposites and single words for phrases.",
    keyPoints: ["Learn words in groups with their roots (bene = good, mal = bad).", "Revise common one-word substitutions."],
    questions: [
      ["Choose the synonym of “Abundant”.", ["Scarce", "Plentiful", "Rare", "Empty"], 1, "Abundant means existing in large quantities, i.e., plentiful."],
      ["Choose the antonym of “Benevolent”.", ["Kind", "Generous", "Malevolent", "Charitable"], 2, "Benevolent means well-meaning; malevolent means wishing harm."],
      ["One who knows everything is called:", ["Omnipotent", "Omnipresent", "Omniscient", "Omnivorous"], 2, "Omniscient = all-knowing; omnipotent = all-powerful; omnipresent = present everywhere."],
      ["Choose the synonym of “Candid”.", ["Frank", "Secretive", "Rude", "Shy"], 0, "Candid means open and honest, i.e., frank."],
    ],
  },
  {
    id: "eng-grammar",
    name: "Grammar and Error Spotting",
    subject: "English",
    aliases: ["grammar", "error spotting", "subject verb agreement", "prepositions", "spelling"],
    summary: "Grammar questions focus on subject–verb agreement, tenses, prepositions and spelling.",
    keyPoints: ["“One of + plural noun” takes a singular verb.", "“Neither/Either of” takes a singular verb.", "Use “since” with a point in time and “for” with a period of time."],
    questions: [
      ["He has been working here ___ 2015.", ["for", "since", "from", "by"], 1, "“Since” is used with a point in time."],
      ["Neither of the boys ___ present.", ["were", "are", "was", "have been"], 2, "“Neither of” takes a singular verb."],
      ["One of my friends ___ a doctor.", ["are", "is", "were", "have"], 1, "The subject is “one”, which is singular."],
      ["Choose the correctly spelt word.", ["Acommodate", "Accomodate", "Accommodate", "Acomodate"], 2, "Accommodate has double c and double m."],
    ],
  },

  // ---------------- Banking and Computer ----------------
  {
    id: "bank-awareness",
    name: "Banking Awareness",
    subject: "Banking Awareness",
    aliases: ["banking", "neft", "rtgs", "kyc", "crr", "slr", "sbi"],
    summary: "Basic banking terms, payment systems and regulators.",
    keyPoints: [
      "NEFT: National Electronic Funds Transfer. RTGS: Real Time Gross Settlement.",
      "KYC: Know Your Customer.",
      "CRR: share of deposits banks must keep as cash with the RBI.",
      "SBI was formed in 1955 from the Imperial Bank of India.",
      "The RBI is headquartered in Mumbai.",
    ],
    questions: [
      ["What is the full form of NEFT?", ["National Electronic Funds Transfer", "New Electronic Fund Transaction", "National Easy Funds Transfer", "Net Electronic Funds Transfer"], 0, "NEFT stands for National Electronic Funds Transfer."],
      ["Where is the headquarters of the Reserve Bank of India?", ["New Delhi", "Kolkata", "Mumbai", "Chennai"], 2, "The RBI is headquartered in Mumbai."],
      ["State Bank of India was formed in 1955 from:", ["Bank of Calcutta", "Imperial Bank of India", "Bank of Bombay", "Allahabad Bank"], 1, "SBI was created by nationalising the Imperial Bank of India in 1955."],
      ["The portion of deposits that banks must keep with the RBI as cash is called:", ["SLR", "CRR", "Repo rate", "MSF"], 1, "CRR (Cash Reserve Ratio) is kept as cash with the RBI."],
    ],
  },
  {
    id: "comp-awareness",
    name: "Computer Awareness",
    subject: "Computer Awareness",
    aliases: ["computer", "cpu", "ram", "memory", "internet", "shortcut keys"],
    summary: "Basic computer hardware, memory, networking and shortcuts.",
    keyPoints: ["The CPU is the “brain” of the computer.", "1 byte = 8 bits.", "RAM is volatile; ROM is non-volatile.", "HTTP: HyperText Transfer Protocol."],
    questions: [
      ["Which part is called the brain of the computer?", ["RAM", "Hard disk", "CPU", "Monitor"], 2, "The CPU (Central Processing Unit) processes all instructions."],
      ["1 byte is equal to:", ["4 bits", "8 bits", "16 bits", "1024 bits"], 1, "A byte has 8 bits."],
      ["Which type of memory is volatile?", ["ROM", "RAM", "Hard disk", "Flash drive"], 1, "RAM loses its data when power is switched off."],
      ["HTTP stands for:", ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Process", "Hyper Transfer Text Program"], 0, "HTTP is the HyperText Transfer Protocol used on the web."],
    ],
  },

  // ---------------- Teaching (CTET) ----------------
  {
    id: "cdp-child-development",
    name: "Child Development and Pedagogy",
    subject: "Child Development and Pedagogy",
    aliases: ["cdp", "piaget", "vygotsky", "kohlberg", "pedagogy", "child development", "rte"],
    summary: "Key learning theories and child-development thinkers tested in CTET and TET exams.",
    keyPoints: [
      "Piaget’s stages: Sensorimotor (0–2), Pre-operational (2–7), Concrete operational (7–11), Formal operational (11+).",
      "Vygotsky: Zone of Proximal Development (ZPD) and scaffolding.",
      "Kohlberg: stages of moral development.",
      "Howard Gardner: theory of multiple intelligences.",
      "RTE Act 2009: free and compulsory education for children aged 6–14.",
    ],
    questions: [
      ["The concept of the Zone of Proximal Development was given by:", ["Piaget", "Vygotsky", "Kohlberg", "Skinner"], 1, "Lev Vygotsky introduced the ZPD: what a learner can do with help but not yet alone."],
      ["Object permanence develops during which of Piaget’s stages?", ["Sensorimotor", "Pre-operational", "Concrete operational", "Formal operational"], 0, "Object permanence develops in the sensorimotor stage (0–2 years)."],
      ["The theory of multiple intelligences was proposed by:", ["Howard Gardner", "Jean Piaget", "Lawrence Kohlberg", "B. F. Skinner"], 0, "Howard Gardner proposed it in 1983."],
      ["The RTE Act, 2009 provides free and compulsory education for children aged:", ["3–14 years", "6–14 years", "6–18 years", "5–15 years"], 1, "It covers children aged 6 to 14."],
    ],
  },
];

export const TOPICS: Topic[] = SEED.map(({ questions, ...t }) => t);

export const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));

export const QUESTION_BANK: MCQ[] = SEED.flatMap((t) =>
  t.questions.map(([question, options, answer, explanation], i) => ({ id: `${t.id}-${i + 1}`, question, options, answer, explanation, topicId: t.id })),
);
