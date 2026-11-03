import type { Difficulty } from "@/lib/types";
import type { Q } from "./topics";

/**
 * Exam-level questions for the hard and very hard tiers: multi-statement questions,
 * assertion–reason, chronology, match-the-pair and multi-step reasoning, the formats that
 * separate toppers in SSC, UPSC, Banking and teaching exams. Appended to each topic's bank.
 */

const H: Difficulty = "hard";
const V: Difficulty = "very-hard";

const AR = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

export const TOUGH_QUESTIONS: Record<string, Q[]> = {
  // ---------------- Polity ----------------
  "polity-preamble": [
    ["Consider the statements: 1. The Preamble has been amended only once. 2. The original Preamble described India as a “Sovereign Democratic Republic”. 3. The word “Fraternity” was added by the 42nd Amendment. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 0, "The 42nd Amendment (1976) is the only amendment; it added Socialist, Secular and Integrity. Fraternity was in the original text.", H],
    ["Assertion (A): The Preamble cannot be enforced in a court of law. Reason (R): The Preamble is neither a source of power to the legislature nor a limit on its powers.", AR, 0, "The Preamble is non-justiciable precisely because it neither grants nor restricts legislative power.", H],
    ["The ideal of “Justice — social, economic and political” in the Preamble is drawn from the:", ["French Revolution", "Russian Revolution", "American Declaration of Independence", "Irish Constitution"], 1, "The ideal of justice comes from the Russian Revolution (1917); Liberty, Equality and Fraternity from the French Revolution.", V],
    ["Which of these is NOT among the liberties promised in the Preamble?", ["Thought", "Expression", "Faith", "Association"], 3, "The Preamble promises “liberty of thought, expression, belief, faith and worship”. Association is a right under Article 19, not a word in the Preamble.", V],
  ],
  "polity-fundamental-rights": [
    ["Consider: 1. Article 15 is available only to citizens. 2. Article 21 is available to citizens and foreigners. 3. Article 19 is suspended automatically during an emergency declared on the ground of war or external aggression. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 3, "All three are correct. Since the 44th Amendment, Article 358 suspends Article 19 only for war or external aggression, not armed rebellion.", H],
    ["Employment of children below 14 years in factories, mines or other hazardous work is prohibited by:", ["Article 21A", "Article 23", "Article 24", "Article 39"], 2, "Article 24 bans child labour in hazardous jobs; Article 23 bans forced labour and trafficking.", H],
    ["During a National Emergency, the President cannot suspend the right to move courts for the enforcement of:", ["Articles 14 and 19", "Articles 19 and 21", "Articles 20 and 21", "Articles 21 and 32"], 2, "The 44th Amendment (1978) made Articles 20 and 21 non-suspendable under Article 359.", V],
    ["The right to privacy was held to be a fundamental right by a nine-judge bench in:", ["Maneka Gandhi v Union of India (1978)", "Justice K. S. Puttaswamy v Union of India (2017)", "A. K. Gopalan v State of Madras (1950)", "Kharak Singh v State of UP (1962)"], 1, "Puttaswamy (2017) held privacy to be intrinsic to Article 21, overruling the earlier view in M. P. Sharma and Kharak Singh.", V],
  ],
  "polity-dpsp-duties": [
    ["Article 44 directs the State to endeavour to secure:", ["Free legal aid", "A Uniform Civil Code", "Separation of judiciary from executive", "Protection of national monuments"], 1, "Article 44: Uniform Civil Code. Free legal aid is 39A, separation of judiciary is 50 and monuments is 49.", H],
    ["Consider the pairs: 1. Article 39A — equal justice and free legal aid 2. Article 48A — protection of environment and wildlife 3. Article 50 — village panchayats. Which are correctly matched?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 0, "Article 50 is separation of the judiciary from the executive; village panchayats are Article 40.", H],
    ["In which case did the Supreme Court hold that the balance between Fundamental Rights and Directive Principles is part of the basic structure?", ["Golaknath (1967)", "Kesavananda Bharati (1973)", "Minerva Mills (1980)", "Champakam Dorairajan (1951)"], 2, "Minerva Mills (1980) struck down the part of the 42nd Amendment that gave all DPSP primacy over Articles 14 and 19.", V],
    ["Which of these is NOT a Fundamental Duty under Article 51A?", ["To protect the natural environment", "To develop the scientific temper", "To vote in public elections", "To safeguard public property"], 2, "Voting is not listed among the eleven Fundamental Duties.", V],
  ],
  "polity-parliament": [
    ["Consider: 1. The Rajya Sabha can withhold a Money Bill for at most 14 days. 2. A Money Bill can be introduced in either House. 3. The Speaker’s decision on whether a bill is a Money Bill is final. Which are correct?", ["1 and 2 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"], 1, "A Money Bill can be introduced only in the Lok Sabha (Article 109); statements 1 and 3 are correct.", H],
    ["To let Parliament legislate on a State List subject in the national interest (Article 249), the Rajya Sabha must pass a resolution by:", ["A simple majority", "An absolute majority", "Two-thirds of members present and voting", "Two-thirds of its total membership"], 2, "Article 249 needs two-thirds of the members present and voting in the Rajya Sabha.", H],
    ["A joint sitting of the two Houses can NOT be held on a:", ["Ordinary bill", "Financial bill under Article 117(3)", "Constitution Amendment bill", "Bill rejected by the Rajya Sabha"], 2, "Joint sittings (Article 108) do not apply to Money Bills or Constitution Amendment bills.", V],
    ["“Zero Hour” in Parliament is:", ["Laid down in the Rules of Procedure", "An Indian innovation, not in the rules, that follows Question Hour", "The first hour of every sitting, reserved for questions", "A period in which no business is transacted"], 1, "Zero Hour began informally in 1962 and is not mentioned in the Rules of Procedure.", V],
  ],

  // ---------------- History ----------------
  "history-national-movement": [
    ["Arrange in chronological order: 1. Champaran Satyagraha 2. Kheda Satyagraha 3. Ahmedabad mill strike 4. Rowlatt Satyagraha", ["1, 2, 3, 4", "1, 3, 2, 4", "3, 1, 2, 4", "2, 1, 3, 4"], 1, "Champaran (1917), Ahmedabad mill strike (Feb–Mar 1918), Kheda (from Mar 1918), Rowlatt Satyagraha (1919).", H],
    ["The Swaraj Party was founded in 1923 by Motilal Nehru and:", ["C. R. Das", "Bal Gangadhar Tilak", "Lala Lajpat Rai", "Bipin Chandra Pal"], 0, "C. R. Das and Motilal Nehru formed the Swaraj Party to contest council elections.", H],
    ["The “August Offer” of 1940 was made by Viceroy:", ["Lord Linlithgow", "Lord Wavell", "Lord Irwin", "Lord Mountbatten"], 0, "Linlithgow offered dominion status as the objective and an expanded Executive Council; Congress rejected it.", V],
    ["Consider: 1. The Poona Pact (1932) came after Gandhi’s fast in Yerwada jail. 2. It replaced separate electorates for the Depressed Classes with reserved seats in joint electorates. 3. It followed Ramsay MacDonald’s Communal Award. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 3, "All three are correct; the pact was signed by B. R. Ambedkar and Madan Mohan Malaviya.", V],
  ],
  "history-mughal": [
    ["The Second Battle of Panipat (1556) was fought between Akbar’s army, led by Bairam Khan, and:", ["Ibrahim Lodi", "Hemu", "Sher Shah Suri", "Rana Sanga"], 1, "Hemu was defeated and killed; Akbar’s rule was secured.", H],
    ["Babur’s memoir, the Baburnama, was originally written in:", ["Persian", "Arabic", "Chagatai Turkish", "Urdu"], 2, "Babur wrote in his mother tongue, Chagatai Turkish; it was translated into Persian under Akbar.", H],
    ["The Zabti (Dahsala) land revenue system under Akbar was developed by:", ["Birbal", "Raja Todar Mal", "Abul Fazl", "Man Singh"], 1, "Raja Todar Mal measured land and fixed revenue on the average produce of ten years.", V],
    ["Consider: 1. The Buland Darwaza at Fatehpur Sikri commemorates Akbar’s Gujarat campaign. 2. Akbar’s Ibadat Khana was at Fatehpur Sikri. 3. Akbar abolished the pilgrimage tax. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 3, "All three are correct; the pilgrimage tax went in 1563 and the jizya in 1564.", V],
  ],

  // ---------------- Geography ----------------
  "geo-indian-rivers": [
    ["Which of these is NOT part of the Ganga river system?", ["Chambal", "Betwa", "Son", "Mahanadi"], 3, "Chambal and Betwa join the Yamuna, the Son joins the Ganga. The Mahanadi drains independently into the Bay of Bengal.", H],
    ["Which river rises at Amarkantak and flows westward into the Arabian Sea?", ["Narmada", "Son", "Mahanadi", "Tapi"], 0, "The Narmada rises at Amarkantak and flows west through a rift valley; the Tapi rises near Multai.", H],
    ["Arrange these east-flowing rivers from north to south:", ["Mahanadi, Godavari, Krishna, Kaveri", "Godavari, Mahanadi, Krishna, Kaveri", "Mahanadi, Krishna, Godavari, Kaveri", "Godavari, Krishna, Mahanadi, Kaveri"], 0, "Mahanadi (Odisha), Godavari (Andhra/Telangana), Krishna, then Kaveri (Tamil Nadu).", V],
    ["The Tehri dam stands near the confluence of:", ["Alaknanda and Bhagirathi", "Bhagirathi and Bhilangana", "Yamuna and Tons", "Ganga and Ramganga"], 1, "Tehri dam is on the Bhagirathi, near its confluence with the Bhilangana. Alaknanda and Bhagirathi meet at Devprayag.", V],
  ],
  "geo-solar-system": [
    ["Which planets have no natural satellite?", ["Mercury only", "Venus only", "Both Mercury and Venus", "Mars and Venus"], 2, "Mercury and Venus have no moons; Mars has two, Phobos and Deimos.", H],
    ["The main asteroid belt lies between the orbits of:", ["Earth and Mars", "Mars and Jupiter", "Jupiter and Saturn", "Neptune and Pluto"], 1, "The asteroid belt is between Mars and Jupiter; the Kuiper belt is beyond Neptune.", H],
    ["Consider: 1. Venus rotates from east to west. 2. A day on Venus is longer than its year. 3. Venus has the highest surface temperature of any planet. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 3, "Venus rotates backwards; it takes about 243 Earth days to rotate and 225 to orbit; its CO₂ atmosphere makes it the hottest.", V],
    ["By Kepler’s third law, a planet 4 times as far from the Sun as Earth takes how many Earth years to orbit?", ["4", "8", "16", "64"], 1, "T² ∝ a³, so T = 4^(3/2) = 8 years.", V],
  ],

  // ---------------- Economy ----------------
  "eco-basics": [
    ["Consider: 1. The repo rate is a quantitative tool of credit control. 2. Raising the CRR increases money supply. 3. Open market operations mean buying and selling government securities. Which are correct?", ["1 and 2 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"], 1, "A higher CRR locks up more bank money with the RBI and reduces money supply.", H],
    ["GDP at market price minus depreciation equals:", ["GNP at market price", "NDP at market price", "NNP at factor cost", "GDP at factor cost"], 1, "Subtracting depreciation turns “gross” into “net”: NDP at market price.", H],
    ["If net factor income from abroad is negative, then:", ["GNP > GDP", "GNP < GDP", "GNP = GDP", "NNP > GNP"], 1, "GNP = GDP + net factor income from abroad, so a negative NFIA makes GNP smaller.", V],
    ["Fiscal deficit minus interest payments is called the:", ["Revenue deficit", "Primary deficit", "Effective revenue deficit", "Budget deficit"], 1, "Primary deficit shows borrowing needed for current spending other than interest.", V],
  ],

  // ---------------- Science ----------------
  "sci-physics": [
    ["A ball is thrown vertically upward. At its highest point:", ["Velocity and acceleration are both zero", "Velocity is zero and acceleration is g downward", "Velocity is maximum and acceleration is zero", "Both are maximum"], 1, "Gravity acts throughout, so acceleration stays g downward even when velocity is momentarily zero.", H],
    ["Resistors of 4 Ω and 12 Ω are connected in parallel. The equivalent resistance is:", ["3 Ω", "8 Ω", "16 Ω", "48 Ω"], 0, "1/R = 1/4 + 1/12 = 4/12, so R = 3 Ω.", H],
    ["A convex lens of focal length 20 cm forms a real image the same size as the object. The object is at:", ["10 cm", "20 cm", "40 cm", "80 cm"], 2, "A real image of equal size forms when the object is at 2F, i.e. 40 cm.", V],
    ["If each of two masses is doubled and the distance between them is also doubled, the gravitational force:", ["Stays the same", "Doubles", "Halves", "Becomes four times"], 0, "F ∝ m₁m₂/r²: (2 × 2)/2² = 1, so the force is unchanged.", V],
  ],
  "sci-biology": [
    ["Which vessel carries oxygenated blood from the lungs to the heart?", ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], 1, "Pulmonary veins are the only veins that carry oxygenated blood.", H],
    ["Which of these is NOT a function of the liver?", ["Making bile", "Storing glycogen", "Detoxifying drugs", "Producing insulin"], 3, "Insulin comes from the beta cells of the pancreas.", H],
    ["Consider: 1. Mature mammalian red blood cells have no nucleus. 2. Haemoglobin contains iron. 3. Platelets help blood to clot. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 3, "All three are correct.", V],
    ["A colour-blind man marries a woman with normal vision who is not a carrier. What is the chance that their son is colour-blind?", ["0%", "25%", "50%", "100%"], 0, "Colour blindness is X-linked; a son gets his X from his mother, who has two normal X chromosomes.", V],
  ],
  "sci-chemistry": [
    ["Which of these are chemical changes? 1. Rusting of iron 2. Melting of wax 3. Curdling of milk 4. Sublimation of camphor", ["1 and 3 only", "2 and 4 only", "1, 2 and 3", "All four"], 0, "Rusting and curdling form new substances; melting and sublimation only change state.", H],
    ["How many moles are there in 22 g of carbon dioxide?", ["0.5", "1", "2", "22"], 0, "Molar mass of CO₂ = 44 g/mol, so 22 ÷ 44 = 0.5 mol.", H],
    ["Which of these has the highest pH?", ["Lemon juice", "Pure water", "Milk of magnesia", "Vinegar"], 2, "Milk of magnesia (Mg(OH)₂) is basic, pH about 10.5; the others are acidic or neutral.", V],
    ["What volume of oxygen at STP is needed to burn 1 mole of methane completely?", ["11.2 L", "22.4 L", "44.8 L", "67.2 L"], 2, "CH₄ + 2O₂ → CO₂ + 2H₂O; 2 mol O₂ × 22.4 L = 44.8 L.", V],
  ],

  // ---------------- Reasoning ----------------
  "reason-series": [
    ["Find the next term: 2, 6, 30, 210, ?", ["2,100", "2,310", "2,520", "1,890"], 1, "Products of the first primes: 2, 2×3, ×5, ×7, ×11 = 2,310.", H],
    ["Find the next term: B2, E5, H8, K11, ?", ["M13", "N14", "N13", "O15"], 1, "Letters move 3 steps and the number is the letter’s position: N = 14.", H],
    ["Find the next term: 4, 9, 25, 49, 121, ?", ["144", "169", "196", "225"], 1, "Squares of primes 2, 3, 5, 7, 11, 13; 13² = 169.", V],
    ["Find the next term: 3, 7, 16, 35, 74, ?", ["148", "151", "153", "155"], 2, "×2 + 1, ×2 + 2, ×2 + 3, ×2 + 4, so 74 × 2 + 5 = 153.", V],
  ],
  "reason-coding": [
    ["If MONKEY is written as XDJMNL, how is TIGER written?", ["QDFHS", "SHFDQ", "QDFGS", "UJHFS"], 0, "Reverse the word (REGIT) and move each letter one step back: QDFHS.", H],
    ["If FRIEND is coded as HUMJTK, how is CANDLE coded?", ["EDRIRL", "EDRJRL", "DCQHQK", "EDSIRL"], 0, "Letters move +2, +3, +4, +5, +6, +7: C→E, A→D, N→R, D→I, L→R, E→L.", H],
    ["If PAPER is coded as QCSIW, how is PENCIL coded?", ["QGQGNR", "QGQGMR", "QFQGNR", "QGPGNR"], 0, "Letters move +1, +2, +3, +4, +5, +6: P→Q, E→G, N→Q, C→G, I→N, L→R.", V],
    ["“pit dar na” means “you are good”, “dar tok pa” means “good and bad” and “tok da pit” means “they are bad”. What does “na” mean?", ["you", "are", "good", "they"], 0, "dar = good (sentences 1 and 2), tok = bad (2 and 3), pit = are (1 and 3), so na = you.", V],
  ],
  "reason-blood-relations": [
    ["A is B’s sister. C is B’s mother. D is C’s father. E is D’s mother. How is A related to D?", ["Granddaughter", "Daughter", "Grandmother", "Niece"], 0, "A is C’s daughter, and C is D’s child, so A is D’s granddaughter.", H],
    ["Pointing to a woman, Rahul said, “Her mother’s only son is my father.” How is the woman related to Rahul?", ["Aunt", "Mother", "Sister", "Grandmother"], 0, "Her mother’s only son is her brother, who is Rahul’s father, so she is Rahul’s father’s sister.", H],
    ["P × Q means P is the brother of Q; P + Q means P is the mother of Q; P ÷ Q means P is the father of Q. Which shows that M is the maternal uncle of R?", ["M × N + R", "M + N × R", "M ÷ N × R", "M × N ÷ R"], 0, "M is the brother of N, and N is the mother of R, so M is R’s maternal uncle. M × N ÷ R would make him the paternal uncle.", V],
    ["A family of six (A–F) has two married couples. D is A’s grandmother and B’s mother. C is B’s wife and F’s mother. F is E’s granddaughter. How is E related to D?", ["Husband", "Son", "Father", "Brother"], 0, "B and C are one couple; E is F’s grandparent, which makes E and D the other couple.", V],
  ],

  // ---------------- English ----------------
  "eng-vocabulary": [
    ["Choose the synonym of “Ubiquitous”.", ["Rare", "Omnipresent", "Unique", "Hidden"], 1, "Ubiquitous means found everywhere.", H],
    ["Choose the antonym of “Laconic”.", ["Brief", "Verbose", "Terse", "Curt"], 1, "Laconic means using very few words; verbose is the opposite.", H],
    ["One word for “a person who bears pain or hardship without showing feelings”:", ["Stoic", "Hedonist", "Cynic", "Sceptic"], 0, "A stoic endures without complaint; a hedonist seeks pleasure.", V],
    ["The idiom “to cut the Gordian knot” means:", ["To break a promise", "To solve a hard problem by a bold, direct action", "To end a friendship", "To waste time on small details"], 1, "From the legend of Alexander slicing through a knot nobody could untie.", V],
  ],
  "eng-grammar": [
    ["Spot the error: Scarcely had he reached the station (a) / than the train (b) / started moving. (c) / No error (d)", ["a", "b", "c", "d"], 1, "“Scarcely” and “hardly” pair with “when”, not “than”.", H],
    ["Choose the correct option: “If I ___ a bird, I would fly to you.”", ["was", "were", "am", "had been"], 1, "An imaginary present condition takes the subjunctive “were” for all subjects.", H],
    ["Spot the error: He is one of those writers (a) / who has won (b) / several awards this year. (c) / No error (d)", ["a", "b", "c", "d"], 1, "“Who” refers to “writers” (plural), so it should be “who have won”.", V],
    ["Choose the correct passive form of: “Who taught you this trick?”", ["By whom were you taught this trick?", "By whom you were taught this trick?", "Who was taught this trick by you?", "This trick was taught by whom to you?"], 0, "Questions keep the question order in the passive: By whom + auxiliary + subject + past participle.", V],
  ],

  // ---------------- Banking and Computer ----------------
  "bank-awareness": [
    ["Consider: 1. SLR is kept by banks in liquid assets such as cash, gold and approved securities. 2. CRR is kept with the RBI. 3. Banks earn interest on CRR balances. Which are correct?", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], 0, "The RBI pays no interest on CRR balances.", H],
    ["Which of these is NOT a function of the RBI?", ["Issuing currency notes", "Banker to the government", "Lender of last resort", "Accepting deposits from the general public"], 3, "The RBI is a banker to banks and governments, not to the public.", H],
    ["In banking, MCLR stands for:", ["Marginal Cost of Funds based Lending Rate", "Minimum Credit Lending Rate", "Monetary Cost of Liquidity Ratio", "Marginal Credit and Loan Rate"], 0, "MCLR replaced the base rate in April 2016 as the benchmark for loans.", V],
    ["A cheque is valid for how long from the date written on it?", ["1 month", "3 months", "6 months", "1 year"], 1, "The RBI cut cheque validity from six months to three months from 1 April 2012.", V],
  ],
  "comp-awareness": [
    ["Which of these is NOT an operating system?", ["Linux", "Windows", "Oracle Database", "macOS"], 2, "Oracle Database is a database management system.", H],
    ["The hexadecimal number 1F equals which decimal number?", ["15", "31", "30", "16"], 1, "1F = 1 × 16 + 15 = 31.", H],
    ["Which layer of the OSI model handles routing of packets between networks?", ["Data link", "Network", "Transport", "Session"], 1, "The network layer (layer 3) routes packets using IP addresses.", V],
    ["Which order lists memory from fastest to slowest?", ["Registers, cache, RAM, hard disk", "Cache, registers, RAM, hard disk", "RAM, cache, registers, hard disk", "Registers, RAM, cache, hard disk"], 0, "Registers sit inside the CPU, then cache, then main memory, then storage.", V],
  ],

  // ---------------- Teaching (CTET) ----------------
  "cdp-child-development": [
    ["At Kohlberg’s pre-conventional level, a child judges right and wrong mainly by:", ["Social approval", "Punishment and reward", "Universal ethical principles", "Law and order"], 1, "Pre-conventional morality is about avoiding punishment and getting rewards.", H],
    ["Which of these is an example of formative assessment?", ["The board exam at the end of the year", "Short quizzes with feedback during teaching", "An entrance test", "The final term exam"], 1, "Formative assessment happens during learning and is used to improve it.", H],
    ["Bruner’s three modes of representation are:", ["Enactive, iconic, symbolic", "Sensory, motor, verbal", "Concrete, abstract, formal", "Visual, auditory, kinaesthetic"], 0, "Enactive (action), iconic (images) and symbolic (language).", V],
    ["Wolfgang Köhler demonstrated “learning by insight” in experiments with:", ["Cats", "Dogs", "Chimpanzees", "Pigeons"], 2, "His chimpanzee Sultan joined sticks to reach a banana, showing sudden insight.", V],
  ],
};
