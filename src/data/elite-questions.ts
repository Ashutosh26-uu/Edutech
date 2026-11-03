import type { Difficulty } from "@/lib/types";
import type { Q } from "./topics";

/**
 * Topper-level questions for the very hard tier: statement counting, case law, chronology,
 * two-step calculations and traps that hinge on one word. Appended to each topic's bank after
 * TOUGH_QUESTIONS, so existing question ids stay the same.
 */

const V: Difficulty = "very-hard";

const COUNT4 = ["Only one", "Only two", "Only three", "All four"];
const COUNT3 = ["Only one", "Only two", "All three", "None"];
const SY = ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"];

const AR = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

export const ELITE_QUESTIONS: Record<string, Q[]> = {
  // ---------------- Polity ----------------
  "polity-preamble": [
    ["How many of these statements are correct? I. In the Berubari Union reference (1960) the Supreme Court said the Preamble is not a part of the Constitution. II. In Kesavananda Bharati (1973) it held that the Preamble is a part of the Constitution. III. In LIC of India (1995) it again held the Preamble to be an integral part of the Constitution.", COUNT3, 2, "All three. Berubari (1960) excluded the Preamble; Kesavananda Bharati (1973) reversed that, and LIC of India (1995) reaffirmed it.", V],
    ["The Preamble is based on the Objectives Resolution, which Jawaharlal Nehru moved in the Constituent Assembly on:", ["13 December 1946", "22 January 1947", "26 November 1949", "9 December 1946"], 0, "Nehru moved it on 13 December 1946; the Assembly adopted it on 22 January 1947. 9 December 1946 was the Assembly’s first sitting.", V],
    ["Assertion (A): Parliament can amend the Preamble under Article 368. Reason (R): The Supreme Court has held that the Preamble is a part of the Constitution.", AR, 0, "Because the Preamble is part of the Constitution (Kesavananda Bharati), it can be amended under Article 368, subject to the basic structure. It was amended once, in 1976.", V],
  ],
  "polity-fundamental-rights": [
    ["How many of these Articles are available to foreigners as well as citizens? I. Article 14 II. Article 15 III. Article 20 IV. Article 29", COUNT4, 1, "Only Articles 14 and 20. Article 15 protects citizens only, and Article 29 protects “any section of the citizens”.", V],
    ["How many of these statements are correct? I. Article 32 is itself a fundamental right. II. The writ jurisdiction of High Courts under Article 226 is wider than that of the Supreme Court under Article 32. III. Dr Ambedkar called Article 32 the “heart and soul” of the Constitution.", COUNT3, 2, "All three. Article 226 is wider because High Courts can issue writs for any legal right, not only fundamental rights.", V],
    ["The “doctrine of eclipse” applies to:", ["Pre-constitutional laws that are inconsistent with fundamental rights", "Post-constitutional laws that violate fundamental rights", "Constitutional amendments that violate the basic structure", "Ordinances that lapse when Parliament reassembles"], 0, "A pre-1950 law that conflicts with a fundamental right is not void but eclipsed; it revives if the right is amended (Bhikaji Narain Dhakras, 1955). Post-constitutional laws that violate fundamental rights are void from the start.", V],
  ],
  "polity-dpsp-duties": [
    ["How many of these Directive Principles were added by the 42nd Amendment (1976)? I. Article 39A II. Article 43A III. Article 48A IV. Article 45", COUNT4, 2, "Articles 39A (free legal aid), 43A (workers in management) and 48A (environment) came in 1976. Article 45 was in the original text and was rewritten by the 86th Amendment (2002).", V],
    ["The fundamental duty of a parent or guardian to provide opportunities for education to a child aged six to fourteen was added by the:", ["42nd Amendment", "44th Amendment", "86th Amendment", "73rd Amendment"], 2, "The 86th Amendment (2002) added Article 51A(k), the eleventh duty, along with Article 21A.", V],
    ["How many of these statements are correct? I. Fundamental duties apply only to citizens. II. Fundamental duties were added on the recommendation of the Swaran Singh Committee. III. Fundamental duties can be enforced through writs.", COUNT3, 1, "Only I and II. Fundamental duties are not enforceable by writs, though courts use them to interpret laws.", V],
  ],
  "polity-parliament": [
    ["How many of these statements are correct? I. A Money Bill can be introduced only in the Lok Sabha, on the President’s recommendation. II. The Rajya Sabha can withhold a Money Bill for at most 14 days. III. The President decides whether a bill is a Money Bill.", COUNT3, 1, "Only I and II. The Speaker of the Lok Sabha certifies a Money Bill, and that decision is final under Article 110(3).", V],
    ["A joint sitting of the two Houses under Article 108 can NOT be held on:", ["An ordinary bill rejected by the Rajya Sabha", "A financial bill of the second category", "A Constitution Amendment Bill", "A bill the other House has not passed within six months"], 2, "A joint sitting is not available for Money Bills or Constitution Amendment Bills; an amendment must pass each House separately by special majority.", V],
    ["How many of these statements are correct? I. The Rajya Sabha is a permanent House; one-third of its members retire every second year. II. The Vice-President is the ex officio Chairman of the Rajya Sabha. III. The President nominates 12 members to the Rajya Sabha. IV. The Lok Sabha can be dissolved only on the Speaker’s advice.", COUNT4, 2, "I, II and III are correct. The President dissolves the Lok Sabha on the advice of the Council of Ministers, not the Speaker.", V],
  ],

  // ---------------- History ----------------
  "history-national-movement": [
    ["Arrange in chronological order: 1. Champaran Satyagraha 2. Rowlatt Satyagraha 3. Kheda Satyagraha 4. Ahmedabad mill strike", ["1-4-3-2", "1-3-4-2", "4-1-3-2", "1-3-2-4"], 0, "Champaran (1917), Ahmedabad mill strike (February–March 1918), Kheda (from March 1918), Rowlatt Satyagraha (1919).", V],
    ["Who among these was NOT a founder of the Swaraj Party (1923)?", ["Chittaranjan Das", "Motilal Nehru", "N. C. Kelkar", "Rajendra Prasad"], 3, "Rajendra Prasad was a “no-changer” who opposed entering the councils. C. R. Das, Motilal Nehru and Kelkar were “pro-changers” who founded the Swaraj Party.", V],
    ["Assertion (A): Gandhi withdrew the Non-Cooperation Movement in February 1922. Reason (R): At Chauri Chaura a mob set fire to a police station, killing several policemen.", AR, 0, "Gandhi called off the movement because the Chauri Chaura violence (5 February 1922) showed it was turning violent.", V],
  ],
  "history-mughal": [
    ["Arrange in chronological order: 1. Second Battle of Panipat 2. Battle of Khanwa 3. Battle of Haldighati 4. Battle of Chausa", ["2-4-1-3", "4-2-1-3", "2-1-4-3", "2-4-3-1"], 0, "Khanwa (1527), Chausa (1539), Second Panipat (1556), Haldighati (1576).", V],
    ["How many of these statements are correct? I. Akbar’s Mahzar (1579) let him decide between conflicting interpretations of Islamic law. II. Din-i-Ilahi was propagated by Jahangir. III. Akbar abolished the jizya in 1564.", COUNT3, 1, "Only I and III. Din-i-Ilahi was Akbar’s, started in 1582.", V],
    ["In the Mughal mansabdari system, the “sawar” rank showed:", ["The officer’s personal rank and salary", "The number of cavalrymen he had to maintain", "The land revenue assigned to him", "The number of elephants under his command"], 1, "Zat was the personal rank and salary; sawar was the number of horsemen the mansabdar had to keep.", V],
  ],

  // ---------------- Geography ----------------
  "geo-indian-rivers": [
    ["How many of these statements are correct? I. The Narmada flows through a rift valley. II. The Tapi rises in the Satpura range near Multai. III. The Mahi crosses the Tropic of Cancer twice.", COUNT3, 2, "All three. The Narmada and Tapi flow west through rift valleys; the Mahi loops across the Tropic of Cancer twice before reaching the Gulf of Khambhat.", V],
    ["Arrange these tributaries of the Indus from north to south: 1. Jhelum 2. Ravi 3. Chenab 4. Sutlej", ["1-3-2-4", "1-2-3-4", "3-1-2-4", "1-3-4-2"], 0, "From north to south: Jhelum, Chenab, Ravi, Beas, Sutlej.", V],
    ["The Ganga is formed by the confluence of the Bhagirathi and the Alaknanda at:", ["Devprayag", "Rudraprayag", "Karnaprayag", "Vishnuprayag"], 0, "At Devprayag. Rudraprayag joins the Mandakini, Karnaprayag the Pindar and Vishnuprayag the Dhauliganga with the Alaknanda.", V],
  ],
  "geo-solar-system": [
    ["How many of these statements are correct? I. Venus rotates from east to west. II. Uranus has an axial tilt of about 98°. III. Mars has no natural satellite.", COUNT3, 1, "Only I and II. Mars has two moons, Phobos and Deimos.", V],
    ["The Earth is closest to the Sun (perihelion) around:", ["3 January", "4 July", "21 June", "22 December"], 0, "Perihelion falls around 3 January and aphelion around 4 July. Seasons come from the axial tilt, not distance.", V],
    ["Assertion (A): The outer planets have much lower densities than the inner planets. Reason (R): The outer planets are made mostly of light gases such as hydrogen and helium.", AR, 0, "Saturn’s density is even less than water’s, because the giants are mostly hydrogen and helium.", V],
  ],

  // ---------------- Economy ----------------
  "eco-basics": [
    ["How many of these statements are correct? I. GDP at factor cost = GDP at market prices − net indirect taxes. II. NNP = GNP − depreciation. III. GNP = GDP + net factor income from abroad.", COUNT3, 2, "All three are standard national-income identities.", V],
    ["Which measure of money supply is called “broad money”?", ["M1", "M2", "M3", "M4"], 2, "M3 (M1 plus time deposits with banks) is broad money; M1 is narrow money.", V],
    ["If the RBI raises the cash reserve ratio, what follows?", ["The money multiplier falls", "The money multiplier rises", "Banks have more funds to lend", "The repo rate falls automatically"], 0, "The money multiplier is roughly 1 ÷ reserve ratio, so a higher CRR shrinks it and leaves banks less to lend.", V],
  ],

  // ---------------- Science ----------------
  "sci-physics": [
    ["How many of these statements are correct? I. The SI unit of pressure is the pascal. II. Sound travels faster in steel than in air. III. The escape velocity from the Earth is about 11.2 km/s. IV. Light travels faster in glass than in vacuum.", COUNT4, 2, "I, II and III are correct. Light is slowest in denser media; glass slows it to about 2 × 10⁸ m/s.", V],
    ["Resistors of 6 Ω and 3 Ω are connected in parallel across a 6 V battery. What current does the battery supply?", ["1 A", "2 A", "3 A", "0.67 A"], 2, "Parallel resistance = (6 × 3) ÷ (6 + 3) = 2 Ω, so I = 6 ÷ 2 = 3 A.", V],
    ["A convex lens of focal length 20 cm forms a real image the same size as the object. Where is the object?", ["20 cm from the lens", "40 cm from the lens", "10 cm from the lens", "At infinity"], 1, "A real image of equal size forms when the object is at 2F, i.e. 40 cm away.", V],
  ],
  "sci-biology": [
    ["How many of these statements are correct? I. Mature red blood cells in mammals have no nucleus. II. Platelets help blood to clot. III. Lymphocytes are a type of red blood cell.", COUNT3, 1, "Only I and II. Lymphocytes are white blood cells.", V],
    ["Which vitamin is made by bacteria in the human large intestine?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin D"], 2, "Gut bacteria make vitamin K. Vitamin D is made in the skin in sunlight, not by bacteria.", V],
    ["A father has blood group AB and a mother has group O. Which blood groups can their children have?", ["A or B only", "AB or O only", "A, B, AB or O", "O only"], 0, "The father passes A or B, the mother always passes O: children are AO (group A) or BO (group B).", V],
  ],
  "sci-chemistry": [
    ["What is the pH of a 0.001 M solution of HCl?", ["1", "3", "11", "0.001"], 1, "HCl ionises fully, so [H⁺] = 10⁻³ M and pH = −log(10⁻³) = 3.", V],
    ["How many of these statements are correct? I. Isotopes have the same atomic number. II. Isobars have the same mass number. III. Isotopes have identical physical properties.", COUNT3, 1, "Only I and II. Isotopes share chemical properties but differ in physical ones such as mass and density.", V],
    ["How many molecules are there in 9 g of water?", ["3.011 × 10²³", "6.022 × 10²³", "1.204 × 10²⁴", "1.505 × 10²³"], 0, "The molar mass of H₂O is 18 g/mol, so 9 g is 0.5 mol, i.e. 0.5 × 6.022 × 10²³ = 3.011 × 10²³ molecules.", V],
  ],

  // ---------------- Reasoning ----------------
  "reason-series": [
    ["Find the next term: 1, 2, 6, 15, 31, ?", ["56", "52", "48", "63"], 0, "The differences are 1, 4, 9, 16, i.e. squares; the next is 25, so 31 + 25 = 56.", V],
    ["Find the next term: 2, 3, 10, 15, 26, 35, ?", ["50", "48", "49", "63"], 0, "The terms are n² + 1 for odd n and n² − 1 for even n: 1+1, 4−1, 9+1, 16−1, 25+1, 36−1, so next is 49 + 1 = 50.", V],
    ["Find the wrong term: 5, 10, 17, 26, 37, 50, 64", ["37", "50", "64", "26"], 2, "The terms are n² + 1 for n = 2 to 8. The last should be 8² + 1 = 65, not 64.", V],
  ],
  "reason-coding": [
    ["In a code, MONKEY is written as XDJMNL. How is TIGER written in that code?", ["QDFHS", "SHFDQ", "UJHFS", "QDFHT"], 0, "Reverse the word and move each letter one step back: MONKEY → YEKNOM → XDJMNL. TIGER → REGIT → QDFHS.", V],
    ["“sky is blue” is “tie pa ro”, “blue is good” is “pa ro la” and “good and sky” is “la ki tie”. What is the code for “and”?", ["ki", "la", "tie", "pa"], 0, "“blue is” = “pa ro” (first two), “sky” = “tie” (first and third), “good” = “la” (second and third), so “and” = “ki”.", V],
    ["In a code, FRIEND is written as HUMJTK. How is CANDLE written?", ["EDRIRL", "DCQHQK", "EDRJRL", "ESJKTL"], 0, "The letters move forward by +2, +3, +4, +5, +6, +7: C→E, A→D, N→R, D→I, L→R, E→L.", V],
  ],
  "reason-blood-relations": [
    ["Pointing to a man, Rina says, “His mother is the only daughter of my mother.” How is Rina related to the man?", ["Mother", "Sister", "Aunt", "Grandmother"], 0, "The only daughter of Rina’s mother is Rina herself, so Rina is the man’s mother.", V],
    ["A is B’s brother. C is A’s mother. D is C’s father. E is D’s mother. How is A related to D?", ["Grandson", "Son", "Great-grandson", "Nephew"], 0, "D is the father of A’s mother, so D is A’s maternal grandfather and A is D’s grandson.", V],
    ["P + Q means P is the father of Q; P − Q means P is the wife of Q; P × Q means P is the brother of Q. What does A − B + C × D mean?", ["A is D’s mother", "A is D’s aunt", "A is D’s sister", "A is D’s grandmother"], 0, "A is B’s wife, B is C’s father and C is D’s brother, so D is also B’s child and A is D’s mother.", V],
  ],
  "reason-syllogism": [
    ["Statements: All pens are books. Some books are tables. Conclusions: I. Some pens are tables. II. Some tables are books.", SY, 1, "The books that are tables need not be pens, so I does not follow. II is the converse of “some books are tables” and follows.", V],
    ["Statements: No cat is a dog. All dogs are rats. Conclusions: I. Some rats are not cats. II. No rat is a cat.", SY, 0, "The rats that are dogs are not cats, so I follows. Other rats may be cats, so II does not.", V],
    ["Statements: Some A are B. No B is C. Conclusions: I. Some A are not C. II. Some C are A.", SY, 0, "The A that are B cannot be C, so I follows. Nothing links C to A, so II does not.", V],
  ],
  "reason-direction": [
    ["Ravi walks 10 m north, turns right and walks 6 m, turns right and walks 18 m, then turns left and walks 9 m. How far and in which direction is he from the start?", ["17 m, south-east", "17 m, north-east", "15 m, south-east", "23 m, south-east"], 0, "He ends 15 m east and 8 m south of the start: √(15² + 8²) = 17 m, to the south-east.", V],
    ["A man faces north. He turns 135° clockwise, then 180° anticlockwise, then 90° clockwise. Which direction does he face now?", ["North-east", "South-east", "North-west", "South-west"], 0, "Net turn = 135 − 180 + 90 = 45° clockwise from north, which is north-east.", V],
    ["A clock is placed so that at 3:00 the hour hand points east. In which direction does the minute hand point at 3:30?", ["South", "West", "North-east", "South-west"], 0, "If 3 points east, then 12 points north and 6 points south. At 3:30 the minute hand is on 6, so it points south.", V],
  ],

  // ---------------- English ----------------
  "eng-vocabulary": [
    ["Choose the word nearest in meaning to OBSEQUIOUS.", ["Servile", "Obstinate", "Obscure", "Generous"], 0, "Obsequious means too eager to please or obey, i.e. servile.", V],
    ["Choose the word opposite in meaning to EPHEMERAL.", ["Transient", "Perpetual", "Fleeting", "Brief"], 1, "Ephemeral means short-lived; the other three options are its synonyms.", V],
    ["One word for “a person who is indifferent to pleasure and pain”:", ["Stoic", "Hedonist", "Cynic", "Epicure"], 0, "A stoic endures pain and pleasure without showing feeling; a hedonist pursues pleasure.", V],
  ],
  "eng-grammar": [
    ["Spot the part with the error: “Neither the manager nor the employees / was aware / of the new policy.”", ["Neither the manager nor the employees", "was aware", "of the new policy", "No error"], 1, "With neither … nor, the verb agrees with the nearer subject, “employees”, so it should be “were aware”.", V],
    ["Which sentence is correct?", ["Scarcely had he left when it started raining.", "Scarcely had he left than it started raining.", "Scarcely he had left when it started raining.", "Scarcely did he left when it started raining."], 0, "“Scarcely” and “hardly” take “when”, not “than”, and put the auxiliary before the subject.", V],
    ["Fill in the blank: “The committee ___ divided in their opinions.”", ["is", "are", "was being", "has"], 1, "When a collective noun’s members act separately (“their opinions”), it takes a plural verb.", V],
  ],

  // ---------------- Awareness ----------------
  "bank-awareness": [
    ["How many of these statements are correct? I. Banks keep SLR assets with themselves. II. CRR is kept with the RBI and earns no interest. III. The Marginal Standing Facility rate is lower than the repo rate.", COUNT3, 1, "Only I and II. The MSF rate is set above the repo rate, as a penal window for overnight funds.", V],
    ["The Basel III norms deal mainly with:", ["Capital adequacy and liquidity of banks", "Priority sector lending targets", "Deregulation of interest rates", "Know-your-customer rules"], 0, "Basel III, from the Basel Committee on Banking Supervision, sets capital, leverage and liquidity standards for banks.", V],
    ["Under the RBI’s Prompt Corrective Action framework for banks, which indicators are tracked?", ["Capital, asset quality and leverage", "Deposits, branches and staff", "CRR, SLR and repo borrowing", "Inflation, GDP and fiscal deficit"], 0, "The revised PCA framework (2021) tracks capital (CRAR), asset quality (net NPA) and leverage.", V],
  ],
  "comp-awareness": [
    ["How many of these statements are correct? I. RAM is volatile memory. II. Cache memory is faster than RAM. III. ROM loses its contents when the power is switched off.", COUNT3, 1, "Only I and II. ROM is non-volatile and keeps its contents without power.", V],
    ["What is the binary number 101101 in decimal?", ["45", "43", "47", "53"], 0, "32 + 0 + 8 + 4 + 0 + 1 = 45.", V],
    ["Which layer of the OSI model routes packets between networks?", ["Network layer", "Transport layer", "Data link layer", "Session layer"], 0, "The network layer (layer 3) handles logical addressing and routing; IP works here.", V],
  ],

  // ---------------- Teaching ----------------
  "cdp-child-development": [
    ["A child knows that a ball of clay rolled into a sausage still has the same amount of clay. According to Piaget, the child has acquired:", ["Conservation", "Object permanence", "Egocentrism", "Animism"], 0, "Conservation develops in the concrete operational stage (about 7 to 11 years).", V],
    ["Vygotsky’s Zone of Proximal Development is the gap between:", ["What a child can do alone and what the child can do with guidance", "A child’s mental age and chronological age", "What a child knows and what the curriculum expects", "A child’s performance at home and at school"], 0, "The ZPD is what a learner can do with help from a more knowledgeable other but not yet alone; scaffolding works inside it.", V],
    ["How many of these statements are correct? I. Kohlberg’s theory deals with moral development. II. Erikson proposed eight psychosocial stages. III. Piaget proposed five stages of cognitive development.", COUNT3, 1, "Only I and II. Piaget proposed four stages: sensorimotor, pre-operational, concrete operational and formal operational.", V],
  ],
};
