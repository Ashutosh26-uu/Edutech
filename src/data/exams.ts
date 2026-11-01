import type { Exam, ExamCategory } from "@/lib/types";

/**
 * Indian government and competitive exams. Subjects list the syllabus areas; topicIds link the
 * ones that have practice content today. negativeMarking is null wherever it varies by paper or
 * year, and the exam page then points to the official notification instead of guessing.
 */

const POLITY = ["polity-preamble", "polity-fundamental-rights", "polity-dpsp-duties", "polity-parliament"];
const HISTORY = ["history-national-movement", "history-mughal"];
const GEO = ["geo-indian-rivers", "geo-solar-system"];
const SCIENCE = ["sci-physics", "sci-biology", "sci-chemistry"];
const QUANT = ["quant-percentage", "quant-profit-loss", "quant-simple-interest", "quant-time-work", "quant-average"];
const REASONING = ["reason-series", "reason-coding", "reason-blood-relations"];
const ENGLISH = ["eng-vocabulary", "eng-grammar"];
const GA = [...POLITY, ...HISTORY, ...GEO, "eco-basics", ...SCIENCE];

type Subject = Exam["subjects"][number];
const s = (name: string, topicIds: string[] = []): Subject => ({ name, topicIds });

// Common subject blocks
const reasoning = s("General Intelligence & Reasoning", REASONING);
const quant = s("Quantitative Aptitude", QUANT);
const maths = s("Mathematics", QUANT);
const english = s("English Language", ENGLISH);
const ga = s("General Awareness", GA);
const science = s("General Science", SCIENCE);
const hindi = s("Hindi Language");
const computer = s("Computer Knowledge", ["comp-awareness"]);
const bankingGa = s("General, Economy & Banking Awareness", ["bank-awareness", "eco-basics"]);
const cdp = s("Child Development & Pedagogy", ["cdp-child-development"]);
const evs = s("Environmental Studies", ["sci-biology", "geo-solar-system", "geo-indian-rivers"]);
const stateGk = s("State-specific GK (history, geography, culture)");
const csat = s("CSAT / Aptitude", ["quant-percentage", "quant-average", ...REASONING]);
const gsBlocks = [s("Indian Polity", POLITY), s("History", HISTORY), s("Geography", GEO), s("Economy", ["eco-basics"]), s("General Science", SCIENCE)];

type Def = Omit<Exam, "category" | "level" | "conductedBy" | "website"> & Partial<Pick<Exam, "level" | "conductedBy" | "website">>;

function group(category: ExamCategory, defaults: Partial<Pick<Exam, "conductedBy" | "level" | "website">>, defs: Def[]): Exam[] {
  return defs.map((d) => ({ level: "National", conductedBy: "", ...defaults, ...d, category }) as Exam);
}

export const EXAMS: Exam[] = [
  ...group("SSC", { conductedBy: "Staff Selection Commission", website: "https://ssc.gov.in" }, [
    { id: "ssc-cgl", name: "SSC CGL", fullName: "Combined Graduate Level Examination", negativeMarking: 0.25, featured: true, subjects: [reasoning, ga, quant, english] },
    { id: "ssc-chsl", name: "SSC CHSL", fullName: "Combined Higher Secondary (10+2) Level Examination", negativeMarking: 0.25, subjects: [reasoning, ga, quant, english] },
    { id: "ssc-mts", name: "SSC MTS", fullName: "Multi-Tasking (Non-Technical) Staff and Havaldar", negativeMarking: null, subjects: [reasoning, s("Numerical & Mathematical Ability", QUANT), ga, english] },
    { id: "ssc-gd", name: "SSC GD Constable", fullName: "Constable (General Duty) in CAPFs, SSF, Rifleman in Assam Rifles", negativeMarking: null, subjects: [reasoning, ga, s("Elementary Mathematics", QUANT), s("English / Hindi", ENGLISH)] },
    { id: "ssc-cpo", name: "SSC CPO", fullName: "Sub-Inspector in Delhi Police and CAPFs", negativeMarking: 0.25, subjects: [reasoning, ga, quant, s("English Comprehension", ENGLISH)] },
    { id: "ssc-je", name: "SSC JE", fullName: "Junior Engineer (Civil, Mechanical, Electrical)", negativeMarking: 0.25, subjects: [reasoning, ga, s("General Engineering")] },
    { id: "ssc-steno", name: "SSC Stenographer", fullName: "Stenographer Grade C and Grade D", negativeMarking: 0.25, subjects: [reasoning, ga, s("English Language & Comprehension", ENGLISH)] },
    { id: "ssc-selection-post", name: "SSC Selection Post", fullName: "Selection Post examinations (Matriculation, Higher Secondary, Graduate level)", negativeMarking: null, subjects: [reasoning, ga, quant, english] },
    { id: "delhi-police-constable", name: "Delhi Police Constable", fullName: "Constable (Executive) in Delhi Police", negativeMarking: 0.25, subjects: [ga, reasoning, s("Numerical Ability", QUANT), computer] },
  ]),

  ...group("Banking", {}, [
    { id: "ibps-po", name: "IBPS PO", fullName: "Probationary Officer / Management Trainee (CRP PO/MT)", conductedBy: "Institute of Banking Personnel Selection", website: "https://www.ibps.in", negativeMarking: 0.25, featured: true, subjects: [s("Reasoning Ability", REASONING), quant, english, bankingGa, computer] },
    { id: "ibps-clerk", name: "IBPS Clerk", fullName: "Clerical Cadre (CRP Clerks)", conductedBy: "Institute of Banking Personnel Selection", website: "https://www.ibps.in", negativeMarking: 0.25, subjects: [s("Reasoning Ability", REASONING), s("Numerical Ability", QUANT), english, bankingGa, computer] },
    { id: "ibps-rrb-po", name: "IBPS RRB PO", fullName: "Officer Scale I in Regional Rural Banks", conductedBy: "Institute of Banking Personnel Selection", website: "https://www.ibps.in", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), quant, s("English / Hindi", ENGLISH), bankingGa, computer] },
    { id: "ibps-rrb-clerk", name: "IBPS RRB Clerk", fullName: "Office Assistant (Multipurpose) in Regional Rural Banks", conductedBy: "Institute of Banking Personnel Selection", website: "https://www.ibps.in", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), s("Numerical Ability", QUANT), s("English / Hindi", ENGLISH), bankingGa, computer] },
    { id: "ibps-so", name: "IBPS SO", fullName: "Specialist Officer (IT, Agriculture, Law, HR, Marketing, Rajbhasha)", conductedBy: "Institute of Banking Personnel Selection", website: "https://www.ibps.in", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), quant, english, s("Professional Knowledge")] },
    { id: "sbi-po", name: "SBI PO", fullName: "Probationary Officer, State Bank of India", conductedBy: "State Bank of India", website: "https://sbi.co.in/web/careers", negativeMarking: 0.25, featured: true, subjects: [s("Reasoning & Computer Aptitude", [...REASONING, "comp-awareness"]), s("Data Analysis & Interpretation", QUANT), english, bankingGa] },
    { id: "sbi-clerk", name: "SBI Clerk", fullName: "Junior Associate (Customer Support & Sales), State Bank of India", conductedBy: "State Bank of India", website: "https://sbi.co.in/web/careers", negativeMarking: 0.25, subjects: [s("Reasoning & Computer Aptitude", [...REASONING, "comp-awareness"]), s("Numerical Ability", QUANT), english, bankingGa] },
    { id: "rbi-grade-b", name: "RBI Grade B", fullName: "Officer in Grade B (DR) – General", conductedBy: "Reserve Bank of India", website: "https://www.rbi.org.in", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), quant, english, s("General Awareness", ["bank-awareness", "eco-basics", ...POLITY]), s("Economic & Social Issues", ["eco-basics"]), s("Finance & Management", ["bank-awareness"])] },
    { id: "rbi-assistant", name: "RBI Assistant", fullName: "Assistant, Reserve Bank of India", conductedBy: "Reserve Bank of India", website: "https://www.rbi.org.in", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), s("Numerical Ability", QUANT), english, bankingGa, computer] },
    { id: "nabard-grade-a", name: "NABARD Grade A", fullName: "Assistant Manager (RDBS)", conductedBy: "National Bank for Agriculture and Rural Development", website: "https://www.nabard.org", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), quant, english, computer, bankingGa, s("Agriculture & Rural Development")] },
  ]),

  ...group("Insurance", {}, [
    { id: "lic-aao", name: "LIC AAO", fullName: "Assistant Administrative Officer (Generalist)", conductedBy: "Life Insurance Corporation of India", website: "https://licindia.in", negativeMarking: 0.25, subjects: [s("Reasoning Ability", REASONING), quant, english, s("General Knowledge & Current Affairs", GA), s("Insurance & Financial Market Awareness", ["bank-awareness"])] },
    { id: "lic-ado", name: "LIC ADO", fullName: "Apprentice Development Officer", conductedBy: "Life Insurance Corporation of India", website: "https://licindia.in", negativeMarking: null, subjects: [s("Reasoning Ability", REASONING), s("Numerical Ability", QUANT), english, s("Insurance & Financial Marketing Awareness", ["bank-awareness"])] },
    { id: "niacl-ao", name: "NIACL AO", fullName: "Administrative Officer (Scale I)", conductedBy: "The New India Assurance Co. Ltd.", negativeMarking: 0.25, subjects: [s("Reasoning", REASONING), quant, english, s("General Awareness", GA)] },
  ]),

  ...group("Railways", { conductedBy: "Railway Recruitment Boards" }, [
    { id: "rrb-ntpc", name: "RRB NTPC", fullName: "Non-Technical Popular Categories (Graduate and Undergraduate)", negativeMarking: 1 / 3, featured: true, subjects: [maths, reasoning, s("General Awareness", [...GA, "comp-awareness"])] },
    { id: "rrb-group-d", name: "RRB Group D", fullName: "Level 1 posts (Track Maintainer, Helper, Assistant and others)", negativeMarking: 1 / 3, subjects: [maths, reasoning, science, s("General Awareness & Current Affairs", [...POLITY, ...HISTORY, ...GEO, "eco-basics"])] },
    { id: "rrb-alp", name: "RRB ALP", fullName: "Assistant Loco Pilot", negativeMarking: 1 / 3, subjects: [maths, reasoning, science, ga, s("Basic Science & Engineering / Trade")] },
    { id: "rrb-je", name: "RRB JE", fullName: "Junior Engineer, Depot Material Superintendent, Chemical & Metallurgical Assistant", negativeMarking: 1 / 3, subjects: [maths, reasoning, ga, science, s("Technical Abilities")] },
    { id: "rpf-constable", name: "RPF Constable", fullName: "Constable (Executive), Railway Protection Force", negativeMarking: 1 / 3, subjects: [s("Arithmetic", QUANT), reasoning, ga] },
    { id: "rpf-si", name: "RPF SI", fullName: "Sub-Inspector (Executive), Railway Protection Force", negativeMarking: 1 / 3, subjects: [s("Arithmetic", QUANT), reasoning, ga] },
  ]),

  ...group("UPSC", { conductedBy: "Union Public Service Commission", website: "https://upsc.gov.in" }, [
    { id: "upsc-prelims", name: "UPSC CSE Prelims", fullName: "Civil Services (Preliminary) Examination – IAS, IPS, IFS and other services", negativeMarking: 1 / 3, featured: true, subjects: [...gsBlocks, csat] },
    { id: "upsc-cds", name: "UPSC CDS", fullName: "Combined Defence Services Examination", negativeMarking: 1 / 3, subjects: [s("English", ENGLISH), s("General Knowledge", GA), s("Elementary Mathematics", QUANT)] },
    { id: "upsc-nda", name: "UPSC NDA", fullName: "National Defence Academy and Naval Academy Examination", negativeMarking: 1 / 3, subjects: [s("Mathematics"), s("General Ability: English", ENGLISH), s("General Ability: General Knowledge", GA)] },
    { id: "upsc-capf", name: "UPSC CAPF AC", fullName: "Central Armed Police Forces (Assistant Commandants) Examination", negativeMarking: 1 / 3, subjects: [s("General Ability & Intelligence", [...GA, ...REASONING, ...QUANT]), s("General Studies, Essay & Comprehension")] },
    { id: "upsc-ese", name: "UPSC ESE", fullName: "Engineering Services Examination", negativeMarking: 1 / 3, subjects: [s("General Studies & Engineering Aptitude", [...REASONING, ...QUANT, "comp-awareness"]), s("Engineering Discipline Paper")] },
    { id: "upsc-epfo", name: "UPSC EPFO", fullName: "Enforcement Officer / Accounts Officer and APFC, EPFO", negativeMarking: 1 / 3, subjects: [s("General English", ENGLISH), s("Indian Polity, Economy & History", [...POLITY, ...HISTORY, "eco-basics"]), s("Quantitative Aptitude & Reasoning", [...QUANT, ...REASONING]), computer, s("Industrial Relations & Labour Laws")] },
    { id: "upsc-cms", name: "UPSC CMS", fullName: "Combined Medical Services Examination", negativeMarking: 1 / 3, subjects: [s("General Medicine & Paediatrics"), s("Surgery, Gynaecology & Obstetrics, Preventive & Social Medicine")] },
  ]),

  ...group("Defence", {}, [
    { id: "afcat", name: "AFCAT", fullName: "Air Force Common Admission Test", conductedBy: "Indian Air Force", website: "https://afcat.cdac.in", negativeMarking: 1 / 3, subjects: [s("Verbal Ability in English", ENGLISH), s("General Awareness", GA), s("Numerical Ability", QUANT), s("Reasoning & Military Aptitude", REASONING)] },
    { id: "agniveer-army", name: "Agniveer (Army)", fullName: "Agniveer under the Agnipath scheme – Common Entrance Exam", conductedBy: "Indian Army", website: "https://joinindianarmy.nic.in", negativeMarking: null, subjects: [s("General Knowledge", GA), science, maths, s("Logical Reasoning", REASONING)] },
    { id: "agniveer-vayu", name: "Agniveer Vayu", fullName: "Agniveer Vayu under the Agnipath scheme", conductedBy: "Indian Air Force", negativeMarking: null, subjects: [s("English", ENGLISH), s("Physics", ["sci-physics"]), s("Mathematics"), s("Reasoning & General Awareness", [...REASONING, ...GA])] },
    { id: "agniveer-navy", name: "Agniveer (Navy)", fullName: "Agniveer (SSR / MR) under the Agnipath scheme", conductedBy: "Indian Navy", negativeMarking: null, subjects: [s("English", ENGLISH), science, maths, s("General Awareness", GA)] },
  ]),

  ...group("State PSC", { level: "State" }, [
    { id: "uppsc-pcs", name: "UPPSC PCS", fullName: "Combined State / Upper Subordinate Services Examination", conductedBy: "Uttar Pradesh Public Service Commission", website: "https://uppsc.up.nic.in", negativeMarking: null, featured: true, subjects: [...gsBlocks, stateGk, csat] },
    { id: "bpsc-cce", name: "BPSC CCE", fullName: "Combined Competitive Examination", conductedBy: "Bihar Public Service Commission", website: "https://bpsc.bih.nic.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, s("Mental Ability", REASONING)] },
    { id: "mppsc-sse", name: "MPPSC SSE", fullName: "State Service Examination", conductedBy: "Madhya Pradesh Public Service Commission", website: "https://mppsc.mp.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "rpsc-ras", name: "RPSC RAS", fullName: "Rajasthan State and Subordinate Services Combined Competitive Examination", conductedBy: "Rajasthan Public Service Commission", website: "https://rpsc.rajasthan.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, s("Logical Reasoning & Mental Ability", REASONING)] },
    { id: "mpsc-rajyaseva", name: "MPSC Rajyaseva", fullName: "Maharashtra State Services Examination", conductedBy: "Maharashtra Public Service Commission", website: "https://mpsc.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "tnpsc-group-1", name: "TNPSC Group 1", fullName: "Combined Civil Services Examination – I", conductedBy: "Tamil Nadu Public Service Commission", website: "https://www.tnpsc.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, s("Aptitude & Mental Ability", [...QUANT, ...REASONING])] },
    { id: "tnpsc-group-4", name: "TNPSC Group 4", fullName: "Combined Civil Services Examination – IV", conductedBy: "Tamil Nadu Public Service Commission", website: "https://www.tnpsc.gov.in", negativeMarking: null, subjects: [s("General Studies", GA), s("Aptitude & Mental Ability", [...QUANT, ...REASONING]), s("General Tamil / English", ENGLISH)] },
    { id: "kpsc-kas", name: "KPSC KAS", fullName: "Gazetted Probationers (Group A & B) Examination", conductedBy: "Karnataka Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "wbcs", name: "WBCS", fullName: "West Bengal Civil Service (Executive) Examination", conductedBy: "Public Service Commission, West Bengal", website: "https://wbpsc.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, s("Mental Ability", REASONING), english] },
    { id: "appsc-group-1", name: "APPSC Group 1", fullName: "Group-I Services Examination", conductedBy: "Andhra Pradesh Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "tgpsc-group-1", name: "TGPSC Group 1", fullName: "Group-I Services Examination", conductedBy: "Telangana Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "gpsc-class-1-2", name: "GPSC Class 1-2", fullName: "Gujarat Administrative Service and Civil Services, Class 1 & 2", conductedBy: "Gujarat Public Service Commission", website: "https://gpsc.gujarat.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "hpsc-hcs", name: "HPSC HCS", fullName: "Haryana Civil Services (Executive Branch) and Allied Services", conductedBy: "Haryana Public Service Commission", website: "https://hpsc.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "ppsc-pcs", name: "PPSC PCS", fullName: "Punjab State Civil Services Combined Competitive Examination", conductedBy: "Punjab Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "ukpsc-pcs", name: "UKPSC PCS", fullName: "Combined State Civil / Upper Subordinate Services Examination", conductedBy: "Uttarakhand Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "cgpsc-sse", name: "CGPSC SSE", fullName: "State Service Examination", conductedBy: "Chhattisgarh Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "jpsc-cce", name: "JPSC CCE", fullName: "Combined Civil Services Examination", conductedBy: "Jharkhand Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk] },
    { id: "opsc-ocs", name: "OPSC OCS", fullName: "Odisha Civil Services Examination", conductedBy: "Odisha Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "kerala-psc", name: "Kerala PSC", fullName: "Kerala Administrative Service and other state recruitments", conductedBy: "Kerala Public Service Commission", website: "https://www.keralapsc.gov.in", negativeMarking: null, subjects: [...gsBlocks, stateGk, english] },
    { id: "hppsc-hpas", name: "HPPSC HPAS", fullName: "HP Administrative Services Combined Competitive Examination", conductedBy: "Himachal Pradesh Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "jkpsc-cce", name: "JKPSC CCE", fullName: "Combined Competitive Examination", conductedBy: "Jammu & Kashmir Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
    { id: "apsc-cce", name: "APSC CCE", fullName: "Combined Competitive Examination", conductedBy: "Assam Public Service Commission", negativeMarking: null, subjects: [...gsBlocks, stateGk, csat] },
  ]),

  ...group("Police", { level: "State" }, [
    { id: "up-police-constable", name: "UP Police Constable", fullName: "Constable (Civil Police) Recruitment", conductedBy: "Uttar Pradesh Police Recruitment and Promotion Board", negativeMarking: null, subjects: [s("General Knowledge", GA), hindi, s("Numerical & Mental Ability", QUANT), s("Mental Aptitude & Reasoning", REASONING)] },
    { id: "up-police-si", name: "UP Police SI", fullName: "Sub-Inspector (Civil Police) Recruitment", conductedBy: "Uttar Pradesh Police Recruitment and Promotion Board", negativeMarking: null, subjects: [s("General Knowledge", GA), hindi, s("Numerical & Mental Ability", QUANT), s("Mental Aptitude & Reasoning", REASONING)] },
    { id: "bihar-police-constable", name: "Bihar Police Constable", fullName: "Constable Recruitment", conductedBy: "Central Selection Board of Constable, Bihar", negativeMarking: null, subjects: [s("General Knowledge", GA), science, maths, hindi] },
    { id: "rajasthan-police-constable", name: "Rajasthan Police Constable", fullName: "Constable Recruitment", conductedBy: "Rajasthan Police", negativeMarking: null, subjects: [s("Reasoning & Computer", [...REASONING, "comp-awareness"]), s("General Knowledge", GA), stateGk] },
    { id: "mp-police-constable", name: "MP Police Constable", fullName: "Constable Recruitment", conductedBy: "Employee Selection Board, Madhya Pradesh", negativeMarking: null, subjects: [s("General Knowledge & Reasoning", [...GA, ...REASONING]), s("Science & Simple Arithmetic", [...SCIENCE, ...QUANT])] },
  ]),

  ...group("Teaching", {}, [
    { id: "ctet", name: "CTET", fullName: "Central Teacher Eligibility Test", conductedBy: "Central Board of Secondary Education", website: "https://ctet.nic.in", negativeMarking: 0, featured: true, subjects: [cdp, s("Mathematics", ["quant-percentage", "quant-average", "quant-profit-loss"]), evs, s("Language I & II (English)", ENGLISH)] },
    { id: "ugc-net", name: "UGC NET", fullName: "National Eligibility Test for Assistant Professor and JRF", conductedBy: "National Testing Agency", website: "https://ugcnet.nta.ac.in", negativeMarking: 0, subjects: [s("Paper 1: Teaching & Research Aptitude", ["cdp-child-development", ...REASONING, "quant-percentage", "quant-average", "comp-awareness"]), s("Paper 2: Subject")] },
    { id: "csir-net", name: "CSIR NET", fullName: "Joint CSIR-UGC NET (Sciences)", conductedBy: "National Testing Agency", negativeMarking: null, subjects: [s("Part A: General Aptitude", [...REASONING, ...QUANT]), s("Parts B & C: Subject")] },
    { id: "kvs-teachers", name: "KVS Teachers", fullName: "PRT, TGT and PGT recruitment, Kendriya Vidyalaya Sangathan", conductedBy: "Kendriya Vidyalaya Sangathan", website: "https://kvsangathan.nic.in", negativeMarking: null, subjects: [cdp, s("General Awareness", GA), s("Reasoning", REASONING), english, hindi, computer] },
    { id: "nvs-teachers", name: "NVS Teachers", fullName: "Teacher recruitment, Navodaya Vidyalaya Samiti", conductedBy: "Navodaya Vidyalaya Samiti", website: "https://navodaya.gov.in", negativeMarking: null, subjects: [cdp, s("General Awareness", GA), s("Reasoning", REASONING), english, hindi] },
    { id: "dsssb", name: "DSSSB", fullName: "TGT, PGT, PRT and other posts, Delhi Subordinate Services Selection Board", conductedBy: "Delhi Subordinate Services Selection Board", website: "https://dsssb.delhi.gov.in", negativeMarking: 0.25, subjects: [s("General Awareness", GA), reasoning, s("Arithmetical & Numerical Ability", QUANT), english, hindi, cdp] },
    { id: "uptet", name: "UPTET", fullName: "Uttar Pradesh Teacher Eligibility Test", conductedBy: "Government of Uttar Pradesh", level: "State", negativeMarking: 0, subjects: [cdp, s("Mathematics", QUANT), evs, s("Language (English / Hindi)", ENGLISH)] },
    { id: "reet", name: "REET", fullName: "Rajasthan Eligibility Examination for Teachers", conductedBy: "Board of Secondary Education, Rajasthan", level: "State", negativeMarking: 0, subjects: [cdp, s("Mathematics", QUANT), evs, s("Language (English / Hindi)", ENGLISH)] },
    { id: "htet", name: "HTET", fullName: "Haryana Teacher Eligibility Test", conductedBy: "Board of School Education, Haryana", level: "State", negativeMarking: 0, subjects: [cdp, s("Mathematics", QUANT), evs, s("Language (English / Hindi)", ENGLISH), s("General Studies", [...REASONING, ...QUANT, ...GA])] },
  ]),

  ...group("Engineering & Medical", {}, [
    { id: "jee-main", name: "JEE Main", fullName: "Joint Entrance Examination (Main)", conductedBy: "National Testing Agency", website: "https://jeemain.nta.nic.in", negativeMarking: 0.25, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics")] },
    { id: "jee-advanced", name: "JEE Advanced", fullName: "Joint Entrance Examination (Advanced) for IIT admissions", conductedBy: "Indian Institutes of Technology", website: "https://jeeadv.ac.in", negativeMarking: null, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics")] },
    { id: "neet-ug", name: "NEET UG", fullName: "National Eligibility cum Entrance Test (Undergraduate)", conductedBy: "National Testing Agency", website: "https://neet.nta.nic.in", negativeMarking: 0.25, featured: true, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Biology (Botany & Zoology)", ["sci-biology"])] },
    { id: "neet-pg", name: "NEET PG", fullName: "National Eligibility cum Entrance Test (Postgraduate)", conductedBy: "National Board of Examinations in Medical Sciences", website: "https://natboard.edu.in", negativeMarking: 0.25, subjects: [s("Pre-clinical, Para-clinical and Clinical Subjects")] },
    { id: "gate", name: "GATE", fullName: "Graduate Aptitude Test in Engineering", conductedBy: "IISc Bengaluru and IITs (on rotation)", negativeMarking: 1 / 3, subjects: [s("General Aptitude", [...QUANT, ...ENGLISH, ...REASONING]), s("Engineering Mathematics"), s("Subject Paper")] },
  ]),

  ...group("Law & Management", {}, [
    { id: "clat", name: "CLAT", fullName: "Common Law Admission Test (UG and PG)", conductedBy: "Consortium of National Law Universities", website: "https://consortiumofnlus.ac.in", negativeMarking: 0.25, subjects: [s("English Language", ENGLISH), s("Current Affairs & General Knowledge", GA), s("Legal Reasoning", POLITY), s("Logical Reasoning", REASONING), s("Quantitative Techniques", QUANT)] },
    { id: "ailet", name: "AILET", fullName: "All India Law Entrance Test", conductedBy: "National Law University, Delhi", negativeMarking: null, subjects: [s("English Language", ENGLISH), s("Current Affairs & GK", GA), s("Logical Reasoning", REASONING)] },
    { id: "cat", name: "CAT", fullName: "Common Admission Test for IIMs", conductedBy: "Indian Institutes of Management", website: "https://iimcat.ac.in", negativeMarking: 1 / 3, subjects: [s("Verbal Ability & Reading Comprehension", ENGLISH), s("Data Interpretation & Logical Reasoning", REASONING), s("Quantitative Ability", QUANT)] },
    { id: "xat", name: "XAT", fullName: "Xavier Aptitude Test", conductedBy: "XLRI Jamshedpur", negativeMarking: null, subjects: [s("Verbal & Logical Ability", [...ENGLISH, ...REASONING]), s("Decision Making"), s("Quantitative Ability & Data Interpretation", QUANT), s("General Knowledge", GA)] },
    { id: "cmat", name: "CMAT", fullName: "Common Management Admission Test", conductedBy: "National Testing Agency", negativeMarking: 0.25, subjects: [s("Quantitative Techniques & Data Interpretation", QUANT), s("Logical Reasoning", REASONING), s("Language Comprehension", ENGLISH), s("General Awareness", GA), s("Innovation & Entrepreneurship")] },
    { id: "mat", name: "MAT", fullName: "Management Aptitude Test", conductedBy: "All India Management Association", negativeMarking: null, subjects: [s("Language Comprehension", ENGLISH), s("Mathematical Skills", QUANT), s("Data Analysis & Sufficiency", QUANT), s("Intelligence & Critical Reasoning", REASONING), s("Indian & Global Environment", GA)] },
  ]),

  ...group("University & Research", { conductedBy: "National Testing Agency" }, [
    { id: "cuet-ug", name: "CUET UG", fullName: "Common University Entrance Test (Undergraduate)", website: "https://cuet.nta.nic.in", negativeMarking: 0.2, subjects: [s("Languages", ENGLISH), s("Domain Subjects"), s("General Test", [...GA, ...QUANT, ...REASONING])] },
    { id: "cuet-pg", name: "CUET PG", fullName: "Common University Entrance Test (Postgraduate)", negativeMarking: 0.25, subjects: [s("General Paper", [...GA, ...QUANT, ...REASONING, ...ENGLISH]), s("Domain Subject")] },
  ]),

  ...group("Other Central", {}, [
    { id: "ib-acio", name: "IB ACIO", fullName: "Assistant Central Intelligence Officer Grade II/Executive", conductedBy: "Intelligence Bureau, Ministry of Home Affairs", negativeMarking: 0.25, subjects: [s("Current Affairs & General Studies", GA), s("Numerical Aptitude", QUANT), s("Reasoning / Logical Aptitude", REASONING), s("English Language", ENGLISH)] },
    { id: "fci", name: "FCI", fullName: "Manager, Assistant Grade III and other posts", conductedBy: "Food Corporation of India", negativeMarking: null, subjects: [s("Reasoning", REASONING), quant, english, s("General Awareness", GA), computer] },
    { id: "epfo-ssa", name: "EPFO SSA", fullName: "Social Security Assistant", conductedBy: "Employees’ Provident Fund Organisation", negativeMarking: null, subjects: [reasoning, ga, quant, english, computer] },
    { id: "drdo-ceptam", name: "DRDO CEPTAM", fullName: "Senior Technical Assistant-B and Technician-A", conductedBy: "DRDO Centre for Personnel Talent Management", negativeMarking: null, subjects: [reasoning, quant, ga, science, s("Technical Subject")] },
    { id: "isro-scientist", name: "ISRO Scientist/Engineer", fullName: "Scientist/Engineer 'SC' recruitment", conductedBy: "ISRO Centralised Recruitment Board", negativeMarking: null, subjects: [s("Engineering Discipline")] },
    { id: "aai-je", name: "AAI Junior Executive", fullName: "Junior Executive (ATC, Common Cadre and other streams)", conductedBy: "Airports Authority of India", negativeMarking: null, subjects: [english, ga, reasoning, quant, s("Stream-specific subject")] },
    { id: "sci-jca", name: "Supreme Court JCA", fullName: "Junior Court Assistant", conductedBy: "Supreme Court of India", negativeMarking: null, subjects: [s("General English", ENGLISH), s("General Aptitude", [...REASONING, ...QUANT]), s("General Knowledge", GA), computer] },
  ]),

  ...group("Defence", {}, [
    { id: "coast-guard-navik", name: "Coast Guard Navik", fullName: "Navik (General Duty / Domestic Branch) and Yantrik", conductedBy: "Indian Coast Guard", negativeMarking: null, subjects: [maths, science, english, s("Reasoning & General Awareness", [...REASONING, ...GA])] },
    { id: "navy-inet", name: "Navy INET", fullName: "Indian Navy Entrance Test (Officers)", conductedBy: "Indian Navy", negativeMarking: null, subjects: [english, s("Reasoning & Numerical Ability", [...REASONING, ...QUANT]), s("General Science & Mathematical Aptitude", SCIENCE), s("General Knowledge", GA)] },
    { id: "territorial-army", name: "Territorial Army Officer", fullName: "Territorial Army Officers (non-departmental)", conductedBy: "Territorial Army", negativeMarking: null, subjects: [s("Reasoning & Elementary Mathematics", [...REASONING, ...QUANT]), s("General Knowledge & English", [...GA, ...ENGLISH])] },
  ]),

  ...group("Police", { level: "State" }, [
    { id: "tnusrb", name: "TNUSRB SI / Constable", fullName: "Sub-Inspector and Grade II Police Constable recruitment", conductedBy: "Tamil Nadu Uniformed Services Recruitment Board", negativeMarking: null, subjects: [s("General Knowledge", GA), s("Logical Analysis & Numerical Ability", [...REASONING, ...QUANT]), s("Tamil Language")] },
    { id: "maharashtra-police", name: "Maharashtra Police Bharti", fullName: "Police Constable recruitment", conductedBy: "Maharashtra Police", negativeMarking: null, subjects: [s("Arithmetic", QUANT), s("General Knowledge & Current Affairs", GA), s("Intelligence Test", REASONING), s("Marathi Grammar")] },
    { id: "wb-police", name: "WB Police Constable", fullName: "Constable and Lady Constable recruitment", conductedBy: "West Bengal Police Recruitment Board", negativeMarking: null, subjects: [s("General Awareness & GK", GA), s("Elementary Mathematics", QUANT), s("Reasoning", REASONING), english] },
  ]),

  ...group("State Subordinate", { level: "State" }, [
    { id: "upsssc-pet", name: "UPSSSC PET", fullName: "Preliminary Eligibility Test for Group C posts", conductedBy: "Uttar Pradesh Subordinate Services Selection Commission", negativeMarking: null, featured: true, subjects: [s("Indian History, Polity & Geography", [...HISTORY, ...POLITY, ...GEO]), s("Indian Economy", ["eco-basics"]), s("General Science", SCIENCE), s("Elementary Arithmetic", QUANT), s("General Hindi"), s("General English", ENGLISH), s("Reasoning", REASONING), s("Data Interpretation", QUANT)] },
    { id: "bssc-cgl", name: "BSSC CGL", fullName: "Inter Level / Graduate Level Combined Competitive Examination", conductedBy: "Bihar Staff Selection Commission", negativeMarking: null, subjects: [ga, stateGk, s("Mathematics", QUANT), s("Mental Ability", REASONING)] },
    { id: "hssc-cet", name: "HSSC CET", fullName: "Common Eligibility Test for Group C and D posts", conductedBy: "Haryana Staff Selection Commission", negativeMarking: null, subjects: [ga, stateGk, reasoning, quant, english, hindi] },
    { id: "rsmssb-patwari", name: "Rajasthan Patwari", fullName: "Patwari Direct Recruitment", conductedBy: "Rajasthan Staff Selection Board", negativeMarking: null, subjects: [s("General Science, History, Polity & Geography", [...SCIENCE, ...HISTORY, ...POLITY, ...GEO]), stateGk, s("General English & Hindi", ENGLISH), s("Mental Ability & Reasoning", REASONING), s("Basic Computer", ["comp-awareness"])] },
    { id: "mp-patwari", name: "MP Patwari", fullName: "Patwari Recruitment Examination", conductedBy: "Employee Selection Board, Madhya Pradesh", negativeMarking: null, subjects: [s("General Knowledge", GA), stateGk, s("Mathematics & Reasoning", [...QUANT, ...REASONING]), computer, hindi, english] },
    { id: "ossc-cgl", name: "OSSC CGL", fullName: "Combined Graduate Level Recruitment Examination", conductedBy: "Odisha Staff Selection Commission", negativeMarking: null, subjects: [ga, stateGk, reasoning, quant, english, computer] },
    { id: "gsssb", name: "GSSSB", fullName: "Class III recruitment examinations", conductedBy: "Gujarat Subordinate Service Selection Board", negativeMarking: null, subjects: [ga, stateGk, reasoning, quant, english] },
  ]),

  ...group("Teaching", { level: "State" }, [
    { id: "maha-tet", name: "MAHA TET", fullName: "Maharashtra Teacher Eligibility Test", conductedBy: "Maharashtra State Council of Examination", negativeMarking: 0, subjects: [cdp, s("Mathematics", QUANT), evs, s("Language (English / Marathi)", ENGLISH)] },
    { id: "bihar-stet", name: "Bihar STET", fullName: "Secondary Teacher Eligibility Test", conductedBy: "Bihar School Examination Board", negativeMarking: 0, subjects: [cdp, s("Subject Paper")] },
    { id: "bpsc-tre", name: "BPSC TRE", fullName: "Teacher Recruitment Examination (school teachers)", conductedBy: "Bihar Public Service Commission", negativeMarking: null, subjects: [s("General Studies", GA), s("Language", ENGLISH), s("Subject Paper")] },
    { id: "emrs", name: "EMRS Teachers", fullName: "Teaching and non-teaching staff, Eklavya Model Residential Schools", conductedBy: "National Education Society for Tribal Students", level: "National", negativeMarking: null, subjects: [cdp, s("General Awareness", GA), reasoning, english, hindi, computer] },
  ]),

  ...group("Engineering & Medical", {}, [
    { id: "bitsat", name: "BITSAT", fullName: "BITS Admission Test", conductedBy: "Birla Institute of Technology and Science, Pilani", negativeMarking: 1 / 3, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics / Biology", ["sci-biology"]), s("English Proficiency & Logical Reasoning", [...ENGLISH, ...REASONING])] },
    { id: "viteee", name: "VITEEE", fullName: "VIT Engineering Entrance Examination", conductedBy: "Vellore Institute of Technology", negativeMarking: 0, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics / Biology", ["sci-biology"]), s("Aptitude & English", [...REASONING, ...ENGLISH])] },
    { id: "mht-cet", name: "MHT CET", fullName: "Maharashtra Common Entrance Test (PCM / PCB)", conductedBy: "State Common Entrance Test Cell, Maharashtra", level: "State", negativeMarking: 0, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics / Biology", ["sci-biology"])] },
    { id: "wbjee", name: "WBJEE", fullName: "West Bengal Joint Entrance Examination", conductedBy: "West Bengal Joint Entrance Examinations Board", level: "State", negativeMarking: null, subjects: [s("Mathematics"), s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"])] },
    { id: "kcet", name: "KCET", fullName: "Karnataka Common Entrance Test", conductedBy: "Karnataka Examinations Authority", level: "State", negativeMarking: 0, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics / Biology", ["sci-biology"])] },
    { id: "ap-eapcet", name: "AP EAPCET", fullName: "Engineering, Agriculture and Pharmacy Common Entrance Test, Andhra Pradesh", conductedBy: "Andhra Pradesh State Council of Higher Education", level: "State", negativeMarking: 0, subjects: [s("Mathematics / Biology", ["sci-biology"]), s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"])] },
    { id: "ts-eapcet", name: "TS EAPCET", fullName: "Engineering, Agriculture and Pharmacy Common Entrance Test, Telangana", conductedBy: "Telangana State Council of Higher Education", level: "State", negativeMarking: 0, subjects: [s("Mathematics / Biology", ["sci-biology"]), s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"])] },
    { id: "comedk", name: "COMEDK UGET", fullName: "Undergraduate Entrance Test for Karnataka private engineering colleges", conductedBy: "Consortium of Medical, Engineering and Dental Colleges of Karnataka", negativeMarking: 0, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Mathematics")] },
    { id: "iit-jam", name: "IIT JAM", fullName: "Joint Admission Test for Masters (M.Sc. and integrated programmes)", conductedBy: "Indian Institutes of Technology", negativeMarking: null, subjects: [s("Subject Paper (Physics, Chemistry, Mathematics, Biotechnology, Economics and others)", ["sci-physics", "sci-chemistry", "sci-biology"])] },
    { id: "iiser-iat", name: "IISER IAT", fullName: "IISER Aptitude Test (BS-MS admissions)", conductedBy: "Indian Institutes of Science Education and Research", negativeMarking: null, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Biology", ["sci-biology"]), s("Mathematics")] },
    { id: "nest", name: "NEST", fullName: "National Entrance Screening Test (NISER and UM-DAE CEBS)", conductedBy: "NISER Bhubaneswar and UM-DAE CEBS Mumbai", negativeMarking: null, subjects: [s("Physics", ["sci-physics"]), s("Chemistry", ["sci-chemistry"]), s("Biology", ["sci-biology"]), s("Mathematics")] },
    { id: "gpat", name: "GPAT", fullName: "Graduate Pharmacy Aptitude Test", conductedBy: "National Board of Examinations in Medical Sciences", negativeMarking: 0.25, subjects: [s("Pharmaceutics, Pharmaceutical Chemistry, Pharmacology and allied subjects")] },
    { id: "neet-mds", name: "NEET MDS", fullName: "NEET for Master of Dental Surgery", conductedBy: "National Board of Examinations in Medical Sciences", negativeMarking: 0.25, subjects: [s("Dental and medical subjects")] },
    { id: "nchm-jee", name: "NCHM JEE", fullName: "Joint Entrance Examination for Hotel Management", conductedBy: "National Testing Agency", negativeMarking: 0.25, subjects: [s("Numerical Ability & Analytical Aptitude", QUANT), s("Reasoning & Logical Deduction", REASONING), s("General Knowledge & Current Affairs", GA), s("English Language", ENGLISH), s("Aptitude for Service Sector")] },
  ]),

  ...group("Design & Architecture", {}, [
    { id: "nift", name: "NIFT Entrance", fullName: "NIFT admissions (B.Des, B.FTech, M.Des, MFM, MFTech)", conductedBy: "National Testing Agency for NIFT", negativeMarking: null, subjects: [s("General Ability Test", [...QUANT, ...ENGLISH, ...REASONING, ...GA]), s("Creative Ability Test")] },
    { id: "nid-dat", name: "NID DAT", fullName: "Design Aptitude Test (B.Des and M.Des)", conductedBy: "National Institute of Design", negativeMarking: null, subjects: [s("Design Aptitude & Drawing"), s("General Awareness", GA)] },
    { id: "uceed", name: "UCEED", fullName: "Undergraduate Common Entrance Examination for Design", conductedBy: "IIT Bombay", negativeMarking: null, subjects: [s("Visualisation, Observation & Design Sensitivity"), s("Analytical & Logical Reasoning", REASONING), s("Language", ENGLISH), s("Drawing")] },
    { id: "ceed", name: "CEED", fullName: "Common Entrance Examination for Design (Master's)", conductedBy: "IIT Bombay", negativeMarking: null, subjects: [s("Visual Perception & Design Aptitude"), s("Analytical Reasoning", REASONING), s("Drawing")] },
    { id: "nata", name: "NATA", fullName: "National Aptitude Test in Architecture", conductedBy: "Council of Architecture", negativeMarking: null, subjects: [s("Mathematics & General Aptitude", [...QUANT, ...REASONING]), s("Drawing & Composition")] },
  ]),

  ...group("Law & Management", {}, [
    { id: "ipmat", name: "IPMAT", fullName: "Integrated Programme in Management Aptitude Test", conductedBy: "IIM Indore", negativeMarking: null, subjects: [s("Quantitative Ability", QUANT), s("Verbal Ability", ENGLISH)] },
    { id: "snap", name: "SNAP", fullName: "Symbiosis National Aptitude Test", conductedBy: "Symbiosis International (Deemed University)", negativeMarking: null, subjects: [s("General English", ENGLISH), s("Analytical & Logical Reasoning", REASONING), s("Quantitative, Data Interpretation & Data Sufficiency", QUANT)] },
    { id: "nmat", name: "NMAT", fullName: "NMAT by GMAC", conductedBy: "Graduate Management Admission Council", negativeMarking: 0, subjects: [s("Language Skills", ENGLISH), s("Quantitative Skills", QUANT), s("Logical Reasoning", REASONING)] },
    { id: "mah-cet-mba", name: "MAH MBA CET", fullName: "Maharashtra MBA/MMS Common Entrance Test", conductedBy: "State Common Entrance Test Cell, Maharashtra", level: "State", negativeMarking: 0, subjects: [s("Logical & Abstract Reasoning", REASONING), s("Quantitative Aptitude", QUANT), s("Verbal Ability & Reading Comprehension", ENGLISH)] },
  ]),

  ...group("Commerce & Professional", {}, [
    { id: "ca-foundation", name: "CA Foundation", fullName: "Chartered Accountancy Foundation Examination", conductedBy: "The Institute of Chartered Accountants of India", negativeMarking: null, subjects: [s("Accounting"), s("Business Laws"), s("Quantitative Aptitude", QUANT), s("Business Economics", ["eco-basics"])] },
    { id: "ca-intermediate", name: "CA Intermediate", fullName: "Chartered Accountancy Intermediate Examination", conductedBy: "The Institute of Chartered Accountants of India", negativeMarking: null, subjects: [s("Accounting, Law, Taxation, Costing, Auditing and Financial Management")] },
    { id: "cseet", name: "CSEET", fullName: "Company Secretary Executive Entrance Test", conductedBy: "The Institute of Company Secretaries of India", negativeMarking: null, subjects: [s("Business Communication", ENGLISH), s("Legal Aptitude & Logical Reasoning", [...POLITY, ...REASONING]), s("Economic & Business Environment", ["eco-basics", "bank-awareness"]), s("Current Affairs", GA)] },
    { id: "cma-foundation", name: "CMA Foundation", fullName: "Cost and Management Accountancy Foundation", conductedBy: "The Institute of Cost Accountants of India", negativeMarking: null, subjects: [s("Fundamentals of Economics & Management", ["eco-basics"]), s("Accounting"), s("Business Laws & Ethics"), s("Business Mathematics & Statistics", QUANT)] },
  ]),

  ...group("University & Research", {}, [
    { id: "icar-aieea-pg", name: "ICAR AIEEA PG", fullName: "All India Entrance Examination for Admission (PG) and AICE-JRF/SRF (PhD)", conductedBy: "National Testing Agency", negativeMarking: null, subjects: [s("Agricultural Sciences subject paper", ["sci-biology"])] },
    { id: "nimcet", name: "NIMCET", fullName: "NIT MCA Common Entrance Test", conductedBy: "National Institutes of Technology", negativeMarking: null, subjects: [s("Mathematics"), s("Analytical Ability & Logical Reasoning", REASONING), s("Computer Awareness", ["comp-awareness"]), s("General English", ENGLISH)] },
    { id: "tancet", name: "TANCET", fullName: "Tamil Nadu Common Entrance Test (MBA, MCA)", conductedBy: "Anna University", level: "State", negativeMarking: null, subjects: [s("Quantitative Ability", QUANT), s("Analytical Reasoning", REASONING), s("Verbal Ability", ENGLISH)] },
  ]),
];

export const EXAM_BY_ID = new Map(EXAMS.map((e) => [e.id, e]));

export const CATEGORIES = [...new Set(EXAMS.map((e) => e.category))];

export const FEATURED_EXAMS = EXAMS.filter((e) => e.featured);

export function examTopicIds(exam: Exam): string[] {
  return [...new Set(exam.subjects.flatMap((s) => s.topicIds))];
}
