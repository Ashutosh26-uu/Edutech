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
    ["Arrange in chronological order: 1. Adoption of the Objectives Resolution 2. Kesavananda Bharati judgment 3. 42nd Amendment to the Preamble 4. Berubari Union opinion of the Supreme Court", ["1-4-2-3", "1-2-4-3", "4-1-2-3", "1-4-3-2"], 0, "Objectives Resolution adopted (January 1947), Berubari Union (1960), Kesavananda Bharati (1973), 42nd Amendment (1976).", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements are correct? I. “Republic” means the head of state is elected, not hereditary. II. India’s membership of the Commonwealth does not affect its sovereignty. III. The word “secular” was in the Preamble as adopted in 1949. IV. The Preamble records the date of adoption as 26 November 1949.", COUNT4, 2, "I, II and IV are correct. “Secular”, like “socialist” and “integrity”, was inserted only by the 42nd Amendment in 1976.", V, "UPSC Prelims · SSC CGL"],
  ],
  "polity-fundamental-rights": [
    ["How many of these Articles are available to foreigners as well as citizens? I. Article 14 II. Article 15 III. Article 20 IV. Article 29", COUNT4, 1, "Only Articles 14 and 20. Article 15 protects citizens only, and Article 29 protects “any section of the citizens”.", V],
    ["How many of these statements are correct? I. Article 32 is itself a fundamental right. II. The writ jurisdiction of High Courts under Article 226 is wider than that of the Supreme Court under Article 32. III. Dr Ambedkar called Article 32 the “heart and soul” of the Constitution.", COUNT3, 2, "All three. Article 226 is wider because High Courts can issue writs for any legal right, not only fundamental rights.", V],
    ["The “doctrine of eclipse” applies to:", ["Pre-constitutional laws that are inconsistent with fundamental rights", "Post-constitutional laws that violate fundamental rights", "Constitutional amendments that violate the basic structure", "Ordinances that lapse when Parliament reassembles"], 0, "A pre-1950 law that conflicts with a fundamental right is not void but eclipsed; it revives if the right is amended (Bhikaji Narain Dhakras, 1955). Post-constitutional laws that violate fundamental rights are void from the start.", V],
    ["Which pair of writ and its literal meaning is NOT correctly matched?", ["Habeas corpus – “to have the body”", "Mandamus – “we command”", "Certiorari – “to be certified”", "Quo warranto – “to forbid”"], 3, "Quo warranto means “by what authority”; it is prohibition that means “to forbid”.", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements are correct? I. Article 19 originally guaranteed seven freedoms; the right to property was dropped by the 44th Amendment. II. The safeguards of Article 22 against arrest do not apply to enemy aliens. III. Preventive detention beyond three months needs the opinion of an advisory board. IV. Article 21 can be suspended by a Presidential order under Article 359.", COUNT4, 2, "I, II and III are correct. Since the 44th Amendment, Articles 20 and 21 cannot be suspended even during a National Emergency.", V, "UPSC Prelims · SSC CGL"],
  ],
  "polity-dpsp-duties": [
    ["How many of these Directive Principles were added by the 42nd Amendment (1976)? I. Article 39A II. Article 43A III. Article 48A IV. Article 45", COUNT4, 2, "Articles 39A (free legal aid), 43A (workers in management) and 48A (environment) came in 1976. Article 45 was in the original text and was rewritten by the 86th Amendment (2002).", V],
    ["The fundamental duty of a parent or guardian to provide opportunities for education to a child aged six to fourteen was added by the:", ["42nd Amendment", "44th Amendment", "86th Amendment", "73rd Amendment"], 2, "The 86th Amendment (2002) added Article 51A(k), the eleventh duty, along with Article 21A.", V],
    ["How many of these statements are correct? I. Fundamental duties apply only to citizens. II. Fundamental duties were added on the recommendation of the Swaran Singh Committee. III. Fundamental duties can be enforced through writs.", COUNT3, 1, "Only I and II. Fundamental duties are not enforceable by writs, though courts use them to interpret laws.", V],
    ["Which Directive Principle is classed as a “Gandhian” principle?", ["Article 40 – organisation of village panchayats", "Article 39(b) – ownership of material resources for the common good", "Article 44 – Uniform Civil Code", "Article 50 – separation of judiciary from executive"], 0, "Village panchayats, cottage industries, cow protection and prohibition are the Gandhian principles; 39(b) is socialist, and 44 and 50 are liberal-intellectual.", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements are correct? I. Article 38(2), on minimising inequalities in income, was added by the 44th Amendment. II. Article 43B, on co-operative societies, was added by the 97th Amendment. III. Article 39(f), on the healthy development of children, was modified by the 42nd Amendment. IV. Article 51A was added by the 44th Amendment.", COUNT4, 2, "I, II and III are correct. Article 51A (fundamental duties) came with the 42nd Amendment (1976), not the 44th.", V, "UPSC Prelims"],
  ],
  "polity-parliament": [
    ["How many of these statements are correct? I. A Money Bill can be introduced only in the Lok Sabha, on the President’s recommendation. II. The Rajya Sabha can withhold a Money Bill for at most 14 days. III. The President decides whether a bill is a Money Bill.", COUNT3, 1, "Only I and II. The Speaker of the Lok Sabha certifies a Money Bill, and that decision is final under Article 110(3).", V],
    ["A joint sitting of the two Houses under Article 108 can NOT be held on:", ["An ordinary bill rejected by the Rajya Sabha", "A financial bill of the second category", "A Constitution Amendment Bill", "A bill the other House has not passed within six months"], 2, "A joint sitting is not available for Money Bills or Constitution Amendment Bills; an amendment must pass each House separately by special majority.", V],
    ["How many of these statements are correct? I. The Rajya Sabha is a permanent House; one-third of its members retire every second year. II. The Vice-President is the ex officio Chairman of the Rajya Sabha. III. The President nominates 12 members to the Rajya Sabha. IV. The Lok Sabha can be dissolved only on the Speaker’s advice.", COUNT4, 2, "I, II and III are correct. The President dissolves the Lok Sabha on the advice of the Council of Ministers, not the Speaker.", V],
    ["How many of these statements are correct? I. Impeachment of the President needs a two-thirds majority of the total membership of each House. II. Removal of a Supreme Court judge needs a special majority in each House. III. A Rajya Sabha resolution to create a new All-India Service needs two-thirds of members present and voting. IV. A no-confidence motion needs the support of at least 100 members to be admitted.", COUNT4, 2, "I, II and III are correct. A no-confidence motion needs the support of 50 members to be admitted in the Lok Sabha.", V, "UPSC Prelims · SSC CGL"],
    ["Which of these matters does NOT make a bill a Money Bill under Article 110?", ["Imposition or abolition of a tax", "Borrowing by the Government of India", "Appropriation of money from the Consolidated Fund of India", "Imposition of a fine or penalty"], 3, "Article 110(2) says a bill is not a Money Bill merely because it imposes fines or penalties or levies fees for services.", V, "UPSC Prelims · SSC CGL"],
  ],

  // ---------------- History ----------------
  "history-national-movement": [
    ["Arrange in chronological order: 1. Champaran Satyagraha 2. Rowlatt Satyagraha 3. Kheda Satyagraha 4. Ahmedabad mill strike", ["1-4-3-2", "1-3-4-2", "4-1-3-2", "1-3-2-4"], 0, "Champaran (1917), Ahmedabad mill strike (February–March 1918), Kheda (from March 1918), Rowlatt Satyagraha (1919).", V],
    ["Who among these was NOT a founder of the Swaraj Party (1923)?", ["Chittaranjan Das", "Motilal Nehru", "N. C. Kelkar", "Rajendra Prasad"], 3, "Rajendra Prasad was a “no-changer” who opposed entering the councils. C. R. Das, Motilal Nehru and Kelkar were “pro-changers” who founded the Swaraj Party.", V],
    ["Assertion (A): Gandhi withdrew the Non-Cooperation Movement in February 1922. Reason (R): At Chauri Chaura a mob set fire to a police station, killing several policemen.", AR, 0, "Gandhi called off the movement because the Chauri Chaura violence (5 February 1922) showed it was turning violent.", V],
    ["Arrange in chronological order: 1. Dandi March begins 2. Chittagong armoury raid 3. Lahore session adopts Purna Swaraj 4. Gandhi–Irwin Pact", ["3-1-2-4", "3-2-1-4", "1-3-2-4", "3-1-4-2"], 0, "Lahore session (December 1929), Dandi March (12 March 1930), Chittagong raid (18 April 1930), Gandhi–Irwin Pact (5 March 1931).", V, "UPSC Prelims · SSC CGL"],
    ["Which pair of Congress session and its president is NOT correctly matched?", ["Lahore 1929 – Jawaharlal Nehru", "Karachi 1931 – Vallabhbhai Patel", "Haripura 1938 – Subhas Chandra Bose", "Faizpur 1936 – Rajendra Prasad"], 3, "Faizpur (1936), the first session held in a village, was presided over by Jawaharlal Nehru. Rajendra Prasad presided at Bombay in 1934.", V, "SSC CGL · UPSC Prelims"],
  ],
  "history-mughal": [
    ["Arrange in chronological order: 1. Second Battle of Panipat 2. Battle of Khanwa 3. Battle of Haldighati 4. Battle of Chausa", ["2-4-1-3", "4-2-1-3", "2-1-4-3", "2-4-3-1"], 0, "Khanwa (1527), Chausa (1539), Second Panipat (1556), Haldighati (1576).", V],
    ["How many of these statements are correct? I. Akbar’s Mahzar (1579) let him decide between conflicting interpretations of Islamic law. II. Din-i-Ilahi was propagated by Jahangir. III. Akbar abolished the jizya in 1564.", COUNT3, 1, "Only I and III. Din-i-Ilahi was Akbar’s, started in 1582.", V],
    ["In the Mughal mansabdari system, the “sawar” rank showed:", ["The officer’s personal rank and salary", "The number of cavalrymen he had to maintain", "The land revenue assigned to him", "The number of elephants under his command"], 1, "Zat was the personal rank and salary; sawar was the number of horsemen the mansabdar had to keep.", V],
    ["Arrange in chronological order: 1. Treaty of Purandar between Shivaji and Jai Singh 2. Battle of Samugarh 3. Jahangir’s marriage to Nur Jahan 4. Start of construction of the Taj Mahal", ["3-4-2-1", "3-2-4-1", "4-3-2-1", "3-4-1-2"], 0, "Nur Jahan’s marriage (1611), Taj Mahal begun (1632), Samugarh (1658, where Aurangzeb defeated Dara Shikoh), Treaty of Purandar (1665).", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements are correct? I. Jahangir’s memoir is the Tuzuk-i-Jahangiri. II. The Ain-i-Akbari is the third volume of Abul Fazl’s Akbarnama. III. Aurangzeb took the title Alamgir. IV. The Red Fort of Delhi was built by Akbar.", COUNT4, 2, "I, II and III are correct. The Red Fort of Delhi was built by Shah Jahan when he moved the capital to Shahjahanabad; Akbar built the Agra fort.", V, "SSC CGL · UPSC Prelims"],
  ],

  // ---------------- Geography ----------------
  "geo-indian-rivers": [
    ["How many of these statements are correct? I. The Narmada flows through a rift valley. II. The Tapi rises in the Satpura range near Multai. III. The Mahi crosses the Tropic of Cancer twice.", COUNT3, 2, "All three. The Narmada and Tapi flow west through rift valleys; the Mahi loops across the Tropic of Cancer twice before reaching the Gulf of Khambhat.", V],
    ["Arrange these tributaries of the Indus from north to south: 1. Jhelum 2. Ravi 3. Chenab 4. Sutlej", ["1-3-2-4", "1-2-3-4", "3-1-2-4", "1-3-4-2"], 0, "From north to south: Jhelum, Chenab, Ravi, Beas, Sutlej.", V],
    ["The Ganga is formed by the confluence of the Bhagirathi and the Alaknanda at:", ["Devprayag", "Rudraprayag", "Karnaprayag", "Vishnuprayag"], 0, "At Devprayag. Rudraprayag joins the Mandakini, Karnaprayag the Pindar and Vishnuprayag the Dhauliganga with the Alaknanda.", V],
    ["Which pair of river and tributary is NOT correctly matched?", ["Krishna – Bhima", "Godavari – Manjra", "Kaveri – Kabini", "Mahanadi – Indravati"], 3, "The Indravati joins the Godavari. The main tributaries of the Mahanadi are the Seonath, Ib, Tel and Jonk.", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements are correct? I. The Luni ends in the Rann of Kutch. II. The Damodar is a tributary of the Hugli. III. The Brahmaputra is called the Dihang in Arunachal Pradesh. IV. The Sabarmati flows into the Gulf of Kutch.", COUNT4, 2, "I, II and III are correct. The Sabarmati, like the Mahi and the Narmada, drains into the Gulf of Khambhat.", V, "SSC CGL · UPSC Prelims"],
  ],
  "geo-solar-system": [
    ["How many of these statements are correct? I. Venus rotates from east to west. II. Uranus has an axial tilt of about 98°. III. Mars has no natural satellite.", COUNT3, 1, "Only I and II. Mars has two moons, Phobos and Deimos.", V],
    ["The Earth is closest to the Sun (perihelion) around:", ["3 January", "4 July", "21 June", "22 December"], 0, "Perihelion falls around 3 January and aphelion around 4 July. Seasons come from the axial tilt, not distance.", V],
    ["Assertion (A): The outer planets have much lower densities than the inner planets. Reason (R): The outer planets are made mostly of light gases such as hydrogen and helium.", AR, 0, "Saturn’s density is even less than water’s, because the giants are mostly hydrogen and helium.", V],
    ["Arrange these planets in order of size, largest first: 1. Neptune 2. Saturn 3. Uranus 4. Earth", ["2-3-1-4", "2-1-3-4", "1-2-3-4", "2-3-4-1"], 0, "Saturn (about 9 Earth radii), then Uranus, which is slightly larger than Neptune though less massive, then Earth.", V, "SSC CGL · RRB NTPC"],
    ["Assertion (A): Mercury has the largest difference between day and night temperatures of any planet. Reason (R): Mercury has almost no atmosphere to retain heat.", AR, 0, "Without an atmosphere, heat absorbed by day escapes at night, so the surface swings from about 430 °C to −180 °C.", V],
  ],

  // ---------------- Economy ----------------
  "eco-basics": [
    ["How many of these statements are correct? I. GDP at factor cost = GDP at market prices − net indirect taxes. II. NNP = GNP − depreciation. III. GNP = GDP + net factor income from abroad.", COUNT3, 2, "All three are standard national-income identities.", V],
    ["Which measure of money supply is called “broad money”?", ["M1", "M2", "M3", "M4"], 2, "M3 (M1 plus time deposits with banks) is broad money; M1 is narrow money.", V],
    ["If the RBI raises the cash reserve ratio, what follows?", ["The money multiplier falls", "The money multiplier rises", "Banks have more funds to lend", "The repo rate falls automatically"], 0, "The money multiplier is roughly 1 ÷ reserve ratio, so a higher CRR shrinks it and leaves banks less to lend.", V],
    ["How many of these statements are correct? I. Revenue deficit = revenue expenditure − revenue receipts. II. Effective revenue deficit = revenue deficit − grants given for the creation of capital assets. III. Disinvestment proceeds are capital receipts. IV. Interest payments are capital expenditure.", COUNT4, 2, "I, II and III are correct. Interest payments create no asset, so they are revenue expenditure.", V, "UPSC Prelims · IBPS PO"],
    ["Banks must hold reserves equal to 20% of deposits. If the central bank adds ₹1,000 crore of fresh reserves to the system, the maximum increase in deposits under the simple multiplier is:", ["₹5,000 crore", "₹2,000 crore", "₹1,200 crore", "₹20,000 crore"], 0, "Deposit multiplier = 1 ÷ reserve ratio = 1 ÷ 0.2 = 5, so ₹1,000 crore can support ₹5,000 crore of deposits.", V, "IBPS PO · UPSC Prelims"],
  ],

  // ---------------- Science ----------------
  "sci-physics": [
    ["How many of these statements are correct? I. The SI unit of pressure is the pascal. II. Sound travels faster in steel than in air. III. The escape velocity from the Earth is about 11.2 km/s. IV. Light travels faster in glass than in vacuum.", COUNT4, 2, "I, II and III are correct. Light is slowest in denser media; glass slows it to about 2 × 10⁸ m/s.", V],
    ["Resistors of 6 Ω and 3 Ω are connected in parallel across a 6 V battery. What current does the battery supply?", ["1 A", "2 A", "3 A", "0.67 A"], 2, "Parallel resistance = (6 × 3) ÷ (6 + 3) = 2 Ω, so I = 6 ÷ 2 = 3 A.", V],
    ["A convex lens of focal length 20 cm forms a real image the same size as the object. Where is the object?", ["20 cm from the lens", "40 cm from the lens", "10 cm from the lens", "At infinity"], 1, "A real image of equal size forms when the object is at 2F, i.e. 40 cm away.", V],
    ["A bulb rated 100 W, 200 V is connected to a 100 V supply. The power it consumes is:", ["25 W", "50 W", "100 W", "200 W"], 0, "Resistance = V² ÷ P = 200² ÷ 100 = 400 Ω. At 100 V, P = 100² ÷ 400 = 25 W: halving the voltage quarters the power.", V, "SSC CGL · RRB NTPC"],
    ["How many of these statements are correct? I. The time period of a simple pendulum does not depend on the mass of the bob. II. A fuse wire has a high melting point. III. A convex mirror always forms a virtual, erect and diminished image. IV. The weight of a body at the centre of the Earth is zero.", COUNT4, 2, "I, III and IV are correct. A fuse wire has a low melting point so that it melts and breaks the circuit when too much current flows.", V, "SSC CGL · RRB NTPC"],
  ],
  "sci-biology": [
    ["How many of these statements are correct? I. Mature red blood cells in mammals have no nucleus. II. Platelets help blood to clot. III. Lymphocytes are a type of red blood cell.", COUNT3, 1, "Only I and II. Lymphocytes are white blood cells.", V],
    ["Which vitamin is made by bacteria in the human large intestine?", ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin D"], 2, "Gut bacteria make vitamin K. Vitamin D is made in the skin in sunlight, not by bacteria.", V],
    ["A father has blood group AB and a mother has group O. Which blood groups can their children have?", ["A or B only", "AB or O only", "A, B, AB or O", "O only"], 0, "The father passes A or B, the mother always passes O: children are AO (group A) or BO (group B).", V],
    ["Which pair of hormone and the gland that secretes it is NOT correctly matched?", ["Insulin – pancreas", "Thyroxine – thyroid", "Adrenaline – adrenal gland", "Oxytocin – thyroid"], 3, "Oxytocin is released by the posterior pituitary. The thyroid secretes thyroxine and calcitonin.", V, "SSC CGL · RRB NTPC"],
    ["In pea plants tallness (T) is dominant over dwarfness (t). Two heterozygous tall plants are crossed and 400 offspring are obtained. How many are expected to be tall but heterozygous?", ["200", "300", "100", "400"], 0, "Tt × Tt gives TT : Tt : tt = 1 : 2 : 1. Heterozygous tall (Tt) is half the offspring: 200. (300 would be all tall plants.)", V, "SSC CGL · CTET"],
  ],
  "sci-chemistry": [
    ["What is the pH of a 0.001 M solution of HCl?", ["1", "3", "11", "0.001"], 1, "HCl ionises fully, so [H⁺] = 10⁻³ M and pH = −log(10⁻³) = 3.", V],
    ["How many of these statements are correct? I. Isotopes have the same atomic number. II. Isobars have the same mass number. III. Isotopes have identical physical properties.", COUNT3, 1, "Only I and II. Isotopes share chemical properties but differ in physical ones such as mass and density.", V],
    ["How many molecules are there in 9 g of water?", ["3.011 × 10²³", "6.022 × 10²³", "1.204 × 10²⁴", "1.505 × 10²³"], 0, "The molar mass of H₂O is 18 g/mol, so 9 g is 0.5 mol, i.e. 0.5 × 6.022 × 10²³ = 3.011 × 10²³ molecules.", V],
    ["How many grams of calcium carbonate must be heated to obtain 11.2 L of carbon dioxide at STP? (Ca = 40, C = 12, O = 16)", ["50 g", "100 g", "25 g", "56 g"], 0, "CaCO₃ → CaO + CO₂. 11.2 L at STP is 0.5 mol of CO₂, so 0.5 mol of CaCO₃ (molar mass 100 g/mol) = 50 g is needed.", V, "SSC CGL · RRB NTPC"],
    ["How many of these statements are correct? I. In the electrolysis of water, hydrogen collects at the cathode. II. The volume of hydrogen produced is twice that of oxygen. III. Rusting of iron needs both oxygen and water. IV. Galvanisation coats iron with a layer of tin.", COUNT4, 2, "I, II and III are correct. Galvanisation uses zinc; tin-plating is a different process used for food cans.", V, "SSC CGL · RRB NTPC"],
  ],

  // ---------------- Reasoning ----------------
  "reason-series": [
    ["Find the next term: 1, 2, 6, 15, 31, ?", ["56", "52", "48", "63"], 0, "The differences are 1, 4, 9, 16, i.e. squares; the next is 25, so 31 + 25 = 56.", V],
    ["Find the next term: 2, 3, 10, 15, 26, 35, ?", ["50", "48", "49", "63"], 0, "The terms are n² + 1 for odd n and n² − 1 for even n: 1+1, 4−1, 9+1, 16−1, 25+1, 36−1, so next is 49 + 1 = 50.", V],
    ["Find the wrong term: 5, 10, 17, 26, 37, 50, 64", ["37", "50", "64", "26"], 2, "The terms are n² + 1 for n = 2 to 8. The last should be 8² + 1 = 65, not 64.", V],
    ["Find the next term: 3, 4, 7, 16, 43, ?", ["124", "130", "121", "118"], 0, "The differences are 1, 3, 9, 27, powers of 3, so the next difference is 81 and the term is 43 + 81 = 124. (Equivalently each term is 3 × previous − 5.)", V, "SSC CGL · IBPS PO"],
    ["Find the wrong term: 8, 13, 21, 34, 55, 88, 144", ["88", "55", "34", "144"], 0, "Each term is the sum of the two before it (a Fibonacci-type series): 34 + 55 = 89, not 88, and 55 + 89 = 144 confirms it.", V, "SSC CGL · SSC CHSL"],
  ],
  "reason-coding": [
    ["In a code, every letter is replaced by its position counted from the end of the alphabet (Z = 1, A = 26), and the numbers are added. What is the code for GOD?", ["55", "52", "57", "26"], 0, "A letter’s reverse position is 27 minus its position: G = 27 − 7 = 20, O = 27 − 15 = 12, D = 27 − 4 = 23. Total = 55.", V],
    ["“sky is blue” is “tie pa ro”, “blue is good” is “pa ro la” and “good and sky” is “la ki tie”. What is the code for “and”?", ["ki", "la", "tie", "pa"], 0, "“blue is” = “pa ro” (first two), “sky” = “tie” (first and third), “good” = “la” (second and third), so “and” = “ki”.", V],
    ["In a code, FRIEND is written as HUMJTK. How is CANDLE written?", ["EDRIRL", "DCQHQK", "EDRJRL", "ESJKTL"], 0, "The letters move forward by +2, +3, +4, +5, +6, +7: C→E, A→D, N→R, D→I, L→R, E→L.", V],
    ["In a code, every consonant moves one step forward in the alphabet and every vowel moves one step backward. How is HOUSE written?", ["INTTD", "INTSD", "GNTTD", "INUTD"], 0, "H→I and S→T (consonants forward); O→N, U→T and E→D (vowels backward): INTTD.", V, "SSC CGL · SSC CHSL"],
    ["In a certain code LEMON is written as PQOGN. How is GRAPE written in the same code?", ["GRCTI", "ITCRG", "GRBTI", "HRCTI"], 0, "Each letter moves two steps forward (LEMON → NGOQP) and the result is written backwards (PQOGN). GRAPE → ITCRG, reversed: GRCTI.", V, "SSC CGL · SSC CPO"],
  ],
  "reason-blood-relations": [
    ["Pointing to a man, Rina says, “His mother is the only daughter of my mother.” How is Rina related to the man?", ["Mother", "Sister", "Aunt", "Grandmother"], 0, "The only daughter of Rina’s mother is Rina herself, so Rina is the man’s mother.", V],
    ["A is B’s brother. C is A’s mother. D is C’s father. E is D’s mother. How is A related to D?", ["Grandson", "Son", "Great-grandson", "Nephew"], 0, "D is the father of A’s mother, so D is A’s maternal grandfather and A is D’s grandson.", V],
    ["P + Q means P is the father of Q; P − Q means P is the wife of Q; P × Q means P is the brother of Q. What does A − B + C × D mean?", ["A is D’s mother", "A is D’s aunt", "A is D’s sister", "A is D’s grandmother"], 0, "A is B’s wife, B is C’s father and C is D’s brother, so D is also B’s child and A is D’s mother.", V],
    ["Ravi walks 6 m north from point X and then 8 m east, where he meets a woman who is the only daughter of his maternal grandfather. How far is the woman from X, and how is she related to Ravi?", ["10 m, mother", "10 m, aunt", "14 m, mother", "10 m, sister"], 0, "The only daughter of his maternal grandfather must be his mother. The distance is √(6² + 8²) = 10 m.", V, "SSC CGL · SSC CPO"],
    ["M is the father of N. N is the sister of O. O is the son of P. P is the daughter of Q. How is M related to Q?", ["Son-in-law", "Son", "Brother-in-law", "Grandson"], 0, "N and O are M’s children, and O is P’s son, so M and P are the parents, i.e. a couple. P is Q’s daughter, so M is Q’s son-in-law.", V, "SSC CGL · IBPS Clerk"],
  ],
  "reason-syllogism": [
    ["Statements: All pens are books. Some books are tables. Conclusions: I. Some pens are tables. II. Some tables are books.", SY, 1, "The books that are tables need not be pens, so I does not follow. II is the converse of “some books are tables” and follows.", V],
    ["Statements: No cat is a dog. All dogs are rats. Conclusions: I. Some rats are not cats. II. No rat is a cat.", SY, 0, "The rats that are dogs are not cats, so I follows. Other rats may be cats, so II does not.", V],
    ["Statements: Some A are B. No B is C. Conclusions: I. Some A are not C. II. Some C are A.", SY, 0, "The A that are B cannot be C, so I follows. Nothing links C to A, so II does not.", V],
    ["Statements: Some pens are pencils. All pencils are boxes. No box is a cap. Conclusions: I. No pen is a cap. II. Some boxes are pens.", SY, 1, "The pens that are pencils are boxes, so II follows. Those pens are not caps, but the other pens may be, so I does not follow.", V, "IBPS PO · SSC CGL"],
    ["Statements: All A are B. Some B are C. No C is D. Conclusions: I. Some A being D is a possibility. II. Some B are not D.", SY, 2, "Nothing connects A with D, so A being D remains possible (I). The B that are C cannot be D, so II follows definitely.", V, "IBPS PO · SBI Clerk"],
  ],
  "reason-direction": [
    ["Ravi walks 10 m north, turns right and walks 6 m, turns right and walks 18 m, then turns left and walks 9 m. How far and in which direction is he from the start?", ["17 m, south-east", "17 m, north-east", "15 m, south-east", "23 m, south-east"], 0, "He ends 15 m east and 8 m south of the start: √(15² + 8²) = 17 m, to the south-east.", V],
    ["A man faces north. He turns 135° clockwise, then 180° anticlockwise, then 90° clockwise. Which direction does he face now?", ["North-east", "South-east", "North-west", "South-west"], 0, "Net turn = 135 − 180 + 90 = 45° clockwise from north, which is north-east.", V],
    ["A clock is placed so that at 3:00 the hour hand points east. In which direction does the minute hand point at 3:30?", ["South", "West", "North-east", "South-west"], 0, "If 3 points east, then 12 points north and 6 points south. At 3:30 the minute hand is on 6, so it points south.", V],
    ["One morning after sunrise, Neha stood facing a pole and saw its shadow fall exactly to her right. Which direction was she facing?", ["South", "North", "East", "West"], 0, "In the morning the sun is in the east, so shadows fall towards the west. West on her right means she faces south.", V, "SSC CGL · SSC CHSL"],
    ["From home, Karan cycles 7 km east, then 24 km south, then 17 km west. How far and in which direction is he from home?", ["26 km, south-west", "26 km, south-east", "24 km, south-west", "34 km, south-west"], 0, "Net displacement: 17 − 7 = 10 km west and 24 km south, so √(10² + 24²) = 26 km to the south-west.", V, "SSC CGL · SSC CPO"],
  ],

  // ---------------- English ----------------
  "eng-vocabulary": [
    ["Choose the word nearest in meaning to OBSEQUIOUS.", ["Servile", "Obstinate", "Obscure", "Generous"], 0, "Obsequious means too eager to please or obey, i.e. servile.", V],
    ["Choose the word opposite in meaning to EPHEMERAL.", ["Transient", "Perpetual", "Fleeting", "Brief"], 1, "Ephemeral means short-lived; the other three options are its synonyms.", V],
    ["One word for “a person who is indifferent to pleasure and pain”:", ["Stoic", "Hedonist", "Cynic", "Epicure"], 0, "A stoic endures pain and pleasure without showing feeling; a hedonist pursues pleasure.", V],
    ["Choose the word nearest in meaning to PERFUNCTORY.", ["Cursory", "Thorough", "Deliberate", "Elaborate"], 0, "Perfunctory means done quickly and without real care or interest, i.e. cursory; the other three describe careful work.", V, "SSC CGL · IBPS PO"],
    ["Choose the word opposite in meaning to PARSIMONIOUS.", ["Frugal", "Munificent", "Thrifty", "Miserly"], 1, "Parsimonious means unwilling to spend money; munificent means very generous. Frugal, thrifty and miserly are all near-synonyms of the given word.", V, "SSC CGL · SBI PO"],
  ],
  "eng-grammar": [
    ["Spot the part with the error: “Neither the manager nor the employees / was aware / of the new policy.”", ["Neither the manager nor the employees", "was aware", "of the new policy", "No error"], 1, "With neither … nor, the verb agrees with the nearer subject, “employees”, so it should be “were aware”.", V],
    ["Which sentence is correct?", ["Scarcely had he left when it started raining.", "Scarcely had he left than it started raining.", "Scarcely he had left when it started raining.", "Scarcely did he left when it started raining."], 0, "“Scarcely” and “hardly” take “when”, not “than”, and put the auxiliary before the subject.", V],
    ["Fill in the blank: “The committee ___ divided in their opinions.”", ["is", "are", "was being", "has"], 1, "When a collective noun’s members act separately (“their opinions”), it takes a plural verb.", V],
    ["Which sentence has NO error?", ["Each of the players have given their best.", "One of my friend is a doctor.", "Neither of the answers is correct.", "The sceneries of Kashmir is beautiful."], 2, "“Neither of” takes a singular verb. The others need “has given his best”, “one of my friends” and “the scenery … is” (scenery is uncountable).", V, "SSC CGL · SSC CHSL"],
    ["Spot the part with the error: “The principal, along with the teachers, / were present / at the function.”", ["The principal, along with the teachers,", "were present", "at the function", "No error"], 1, "Words joined by “along with”, “as well as” or “together with” do not change the number of the subject: “the principal … was present”.", V, "SSC CGL · IBPS PO"],
  ],

  // ---------------- Awareness ----------------
  "bank-awareness": [
    ["How many of these statements are correct? I. Banks keep SLR assets with themselves. II. CRR is kept with the RBI and earns no interest. III. The Marginal Standing Facility rate is lower than the repo rate.", COUNT3, 1, "Only I and II. The MSF rate is set above the repo rate, as a penal window for overnight funds.", V],
    ["The Basel III norms deal mainly with:", ["Capital adequacy and liquidity of banks", "Priority sector lending targets", "Deregulation of interest rates", "Know-your-customer rules"], 0, "Basel III, from the Basel Committee on Banking Supervision, sets capital, leverage and liquidity standards for banks.", V],
    ["Under the RBI’s Prompt Corrective Action framework for banks, which indicators are tracked?", ["Capital, asset quality and leverage", "Deposits, branches and staff", "CRR, SLR and repo borrowing", "Inflation, GDP and fiscal deficit"], 0, "The revised PCA framework (2021) tracks capital (CRAR), asset quality (net NPA) and leverage.", V],
    ["How many of these statements are correct? I. The RBI began operations in 1935 under the RBI Act, 1934. II. The RBI was nationalised in 1949. III. The State Bank of India was created in 1955 by taking over the Imperial Bank of India. IV. The Imperial Bank of India was formed in 1935.", COUNT4, 2, "I, II and III are correct. The Imperial Bank was formed in 1921 by merging the three Presidency Banks.", V, "IBPS PO · SBI Clerk"],
    ["Which of these is NOT a qualitative (selective) instrument of credit control used by the RBI?", ["Margin requirements", "Moral suasion", "Credit rationing", "Bank rate"], 3, "The bank rate, CRR, SLR and open market operations are quantitative tools that act on the total volume of credit; the other three target particular sectors or borrowers.", V, "IBPS PO · RBI Grade B"],
  ],
  "comp-awareness": [
    ["How many of these statements are correct? I. RAM is volatile memory. II. Cache memory is faster than RAM. III. ROM loses its contents when the power is switched off.", COUNT3, 1, "Only I and II. ROM is non-volatile and keeps its contents without power.", V],
    ["What is the binary number 101101 in decimal?", ["45", "43", "47", "53"], 0, "32 + 0 + 8 + 4 + 0 + 1 = 45.", V],
    ["Which layer of the OSI model routes packets between networks?", ["Network layer", "Transport layer", "Data link layer", "Session layer"], 0, "The network layer (layer 3) handles logical addressing and routing; IP works here.", V],
    ["What is the sum of the hexadecimal number 2A and the binary number 1011, written in decimal?", ["53", "51", "47", "55"], 0, "2A = 2 × 16 + 10 = 42 and 1011 = 8 + 2 + 1 = 11, so the sum is 53.", V, "IBPS Clerk · SSC CGL"],
    ["How many of these statements are correct? I. A compiler translates a whole program at once, while an interpreter translates it line by line. II. Linux is an open-source operating system. III. A firewall is used to block unauthorised access to a network. IV. Standard ASCII uses 16 bits for each character.", COUNT4, 2, "I, II and III are correct. Standard ASCII is a 7-bit code (128 characters), stored in 8-bit bytes; Unicode UTF-16 uses 16 bits.", V, "IBPS PO · SBI Clerk"],
  ],

  // ---------------- Teaching ----------------
  "cdp-child-development": [
    ["A child knows that a ball of clay rolled into a sausage still has the same amount of clay. According to Piaget, the child has acquired:", ["Conservation", "Object permanence", "Egocentrism", "Animism"], 0, "Conservation develops in the concrete operational stage (about 7 to 11 years).", V],
    ["Vygotsky’s Zone of Proximal Development is the gap between:", ["What a child can do alone and what the child can do with guidance", "A child’s mental age and chronological age", "What a child knows and what the curriculum expects", "A child’s performance at home and at school"], 0, "The ZPD is what a learner can do with help from a more knowledgeable other but not yet alone; scaffolding works inside it.", V],
    ["How many of these statements are correct? I. Kohlberg’s theory deals with moral development. II. Erikson proposed eight psychosocial stages. III. Piaget proposed five stages of cognitive development.", COUNT3, 1, "Only I and II. Piaget proposed four stages: sensorimotor, pre-operational, concrete operational and formal operational.", V],
    ["Which pair of theory and psychologist is NOT correctly matched?", ["Classical conditioning – Pavlov", "Social learning theory – Bandura", "Multiple intelligences – Gardner", "Trial-and-error learning – Skinner"], 3, "Trial-and-error learning, with the laws of effect, exercise and readiness, is Thorndike’s. Skinner gave operant conditioning.", V, "CTET · KVS"],
    ["How many of these statements about Erikson’s theory are correct? I. Trust vs mistrust is the first stage. II. Identity vs role confusion belongs to adolescence. III. The stages end with adolescence. IV. Initiative vs guilt covers roughly 3 to 6 years.", COUNT4, 2, "I, II and IV are correct. Erikson’s eight stages run through the whole lifespan, ending with integrity vs despair in old age.", V, "CTET · DSSSB"],
  ],

  // ---------------- Newer topics ----------------
  "hindi-vyakaran": [
    ["निम्नलिखित में से कितने शब्दों में गुण संधि है? I. नरेंद्र II. परमेश्वर III. महोत्सव IV. नयन", ["केवल एक", "केवल दो", "केवल तीन", "चारों"], 2, "नर + इंद्र (अ + इ = ए), परम + ईश्वर (अ + ई = ए) और महा + उत्सव (आ + उ = ओ) में गुण संधि है; नयन (ने + अन, ए + अ = अय) में अयादि संधि है।", V, "UPTET · CTET"],
    ["‘सागर की लहरें उठ-उठ कर गिरतीं, मानो धरती से मिलने को आतुर हों’ — इस पंक्ति में कौन-सा अलंकार है?", ["उपमा", "उत्प्रेक्षा", "रूपक", "अतिशयोक्ति"], 1, "जहाँ उपमेय में उपमान की संभावना या कल्पना ‘मानो, जनु, मनु, मनहुँ’ जैसे शब्दों से की जाए, वहाँ उत्प्रेक्षा अलंकार होता है; उपमा में ‘सा, सम, सरिस’ से सीधी तुलना होती है।", V, "UPTET · DSSSB"],
    ["रस और स्थायी भाव का कौन-सा युग्म सही सुमेलित नहीं है?", ["वीर – उत्साह", "अद्भुत – विस्मय", "वीभत्स – जुगुप्सा", "शांत – रति"], 3, "शांत रस का स्थायी भाव निर्वेद है; रति शृंगार रस का स्थायी भाव है।", V, "CTET · UPTET"],
    ["‘नाकों चने चबवाना’ मुहावरे का निकटतम अर्थ है:", ["बहुत परेशान करना", "कड़ी सज़ा देना", "अपमानित करना", "भूखा रखना"], 0, "नाकों चने चबवाना अर्थात किसी को बहुत तंग या परेशान करना; सज़ा या अपमान इसका सीधा अर्थ नहीं है।", V, "UP Police · SSC GD"],
  ],
  "history-ancient": [
    ["Arrange in chronological order: 1. Accession of Harshavardhana 2. Accession of Kanishka 3. Reign of Chandragupta II 4. Ashoka’s Kalinga war", ["4-2-3-1", "4-3-2-1", "2-4-3-1", "4-2-1-3"], 0, "Kalinga war (c. 261 BCE), Kanishka (c. 78 CE), Chandragupta II (c. 375–415 CE), Harsha (606 CE).", V, "UPSC Prelims · SSC CGL"],
    ["How many of these statements about the Gupta age are correct? I. Fa-Hien visited India in the reign of Chandragupta II. II. Aryabhata lived in the Gupta period. III. Kalidasa was the court poet of Samudragupta. IV. Samudragupta’s Prayag prashasti is in Sanskrit.", COUNT4, 2, "I, II and IV are correct. Kalidasa is associated with the court of Chandragupta II Vikramaditya, not Samudragupta.", V, "UPSC Prelims · SSC CGL"],
    ["Which of these is NOT one of the Triratnas (three jewels) of Jainism?", ["Right faith", "Right knowledge", "Right conduct", "Right speech"], 3, "Jainism’s Triratnas are right faith, right knowledge and right conduct. Right speech is a step of the Buddhist Eightfold Path.", V, "SSC CGL · UPSC Prelims"],
    ["Assertion (A): The Harappans traded with Mesopotamia. Reason (R): Harappan seals have been found at Mesopotamian sites such as Ur.", AR, 0, "Harappan seals at Ur and other Mesopotamian cities, and Mesopotamian texts naming “Meluhha”, are the direct evidence of this trade.", V],
  ],
  "geo-physical-india": [
    ["How many of these statements are correct? I. The Aravalli is the oldest fold mountain range in India. II. The Deccan Trap was formed by fissure volcanic eruptions. III. The northern plains lie between the Shiwaliks and the peninsular plateau. IV. Khadar is older alluvium than Bhangar.", COUNT4, 2, "I, II and III are correct. Bhangar is the older alluvium on higher ground; Khadar is the newer alluvium of the flood plains.", V, "UPSC Prelims · SSC CGL"],
    ["Which of these passes is NOT in Himachal Pradesh?", ["Rohtang", "Bara Lacha La", "Shipki La", "Lipulekh"], 3, "Lipulekh is in Uttarakhand, on the route to Kailash–Mansarovar. Rohtang and Bara Lacha La are in the Kullu–Lahaul region and Shipki La in Kinnaur.", V, "UPSC Prelims · SSC CGL"],
    ["Arrange these stretches of the western coast from north to south: 1. Malabar coast 2. Konkan coast 3. Kanara coast 4. Kathiawar coast", ["4-2-3-1", "2-4-3-1", "4-3-2-1", "4-2-1-3"], 0, "Kathiawar (Gujarat), Konkan (Maharashtra–Goa), Kanara (Karnataka), Malabar (Kerala).", V, "SSC CGL · UPSC Prelims"],
    ["Assertion (A): Mumbai receives far more rainfall than Pune. Reason (R): Pune lies on the leeward side of the Western Ghats.", AR, 0, "The Arabian Sea branch of the monsoon drops its rain on the windward slopes near Mumbai; Pune, in the rain shadow, gets much less.", V, "UPSC Prelims"],
  ],
  "reason-analogy": [
    ["KNOT : LPRX :: FARM : ?", ["GCUQ", "GCUP", "GDUQ", "HCUQ"], 0, "The letters move +1, +2, +3, +4 in turn: K→L, N→P, O→R, T→X; so F→G, A→C, R→U, M→Q.", V, "SSC CGL · SSC CPO"],
    ["(6, 8) : 100 :: (5, 12) : ?", ["169", "144", "170", "60"], 0, "The rule is the sum of the squares: 6² + 8² = 100, so 5² + 12² = 25 + 144 = 169.", V, "SSC CGL · SSC CHSL"],
    ["Find the odd one out: 143, 221, 323, 341", ["143", "221", "323", "341"], 3, "143 = 11 × 13, 221 = 13 × 17 and 323 = 17 × 19 are products of two consecutive primes; 341 = 11 × 31 is not.", V, "SSC CGL · SSC CPO"],
    ["Miser : Stingy :: Spendthrift : ?", ["Extravagant", "Generous", "Wealthy", "Careless"], 0, "The second word names the defining trait of the first: a miser is stingy, a spendthrift is extravagant. Generous is a virtue, not wasteful spending.", V],
  ],
  "quant-number-system": [
    ["How many numbers from 1 to 300 are divisible by 4 or 6 but not by 5?", ["80", "100", "75", "85"], 0, "Divisible by 4 or 6: 75 + 50 − 25 (by 12) = 100. Of these, divisible by 5 means by 20 or 30: 15 + 10 − 5 (by 60) = 20. So 100 − 20 = 80.", V, "SSC CGL · IBPS PO"],
    ["What are the last two digits of 3⁷⁶?", ["21", "61", "81", "41"], 0, "3²⁰ ends in 01 (3¹⁰ = 59049 → 49, and 49² = 2401 → 01). So 3⁷⁶ = (3²⁰)³ × 3¹⁶ ends like 3¹⁶ = 81⁴: 81² → 61, 61² → 21.", V, "SSC CGL · SSC CPO"],
    ["Two numbers are in the ratio 4 : 5 and their LCM is 180. Their HCF is:", ["9", "20", "36", "45"], 0, "Let the numbers be 4k and 5k; since 4 and 5 are coprime, their HCF is k and LCM is 20k. 20k = 180 gives k = 9.", V, "SSC CGL · SSC CHSL"],
    ["What is the remainder when 1! + 2! + 3! + … + 50! is divided by 12?", ["9", "3", "0", "6"], 0, "4! = 24 and every later factorial is a multiple of 12, so only 1! + 2! + 3! = 1 + 2 + 6 = 9 matters.", V, "SSC CGL · IBPS PO"],
  ],
  "quant-mensuration": [
    ["A bucket is in the shape of a frustum of a cone with radii 14 cm and 7 cm and height 24 cm. Its capacity is (π = 22/7):", ["8,624 cm³", "8,232 cm³", "9,856 cm³", "7,392 cm³"], 0, "V = ⅓πh(R² + Rr + r²) = ⅓ × 22/7 × 24 × (196 + 98 + 49) = 22/7 × 8 × 343 = 22 × 8 × 49 = 8,624 cm³.", V, "SSC CGL · SSC CPO"],
    ["A toy is a cone mounted on a hemisphere of the same radius, 3.5 cm. The total height of the toy is 15.5 cm. Its total surface area is (π = 22/7):", ["214.5 cm²", "231 cm²", "192.5 cm²", "253 cm²"], 0, "Cone height = 15.5 − 3.5 = 12 cm, slant height = √(12² + 3.5²) = 12.5 cm. Area = πrl + 2πr² = πr(l + 2r) = 22/7 × 3.5 × (12.5 + 7) = 11 × 19.5 = 214.5 cm².", V, "SSC CGL · SSC CHSL"],
    ["A solid sphere is cut into two equal hemispheres. By what percent does the total surface area increase?", ["50%", "25%", "100%", "75%"], 0, "Sphere: 4πr². Two hemispheres: 2 × 3πr² = 6πr², because each gains a flat circular face of πr². Increase = 2πr² ÷ 4πr² = 50%.", V, "SSC CGL · SSC CPO"],
    ["A cone is cut by a plane parallel to its base through the midpoint of its height. The ratio of the volume of the small cone to that of the frustum is:", ["1 : 7", "1 : 8", "1 : 3", "1 : 4"], 0, "The small cone is similar to the whole with linear ratio 1 : 2, so its volume is (1/2)³ = 1/8 of the whole. The frustum is the remaining 7/8, giving 1 : 7.", V, "SSC CGL · SSC CHSL"],
  ],
};
