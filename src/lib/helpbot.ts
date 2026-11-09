/**
 * Offline help bot: answers questions about the site from a hand-written FAQ, with no AI
 * provider and no network call. It works by normalising the question (Hinglish spellings,
 * synonyms, typos), scoring every FAQ entry with BM25-style weights, and adding live facts
 * (exam syllabus, negative marking, question counts) when the question names an exam or topic.
 */
import { EXAMS } from "@/data/exams";
import { BANK_SIZES } from "@/data/bank/index";
import { FAQ, type Faq } from "@/data/faq";
import { TOPICS } from "@/data/topics";
import type { Exam, Topic } from "@/lib/types";

export type Lang = "en" | "hi";
export interface BotLink {
  label: string;
  href: string;
}
export interface BotReply {
  text: string;
  links: BotLink[];
  /** Follow-up questions offered as chips */
  suggestions: string[];
  /** FAQ entry that answered, if any */
  id?: string;
  /** True when nothing matched well */
  unsure?: boolean;
}
/** What the bot remembers between messages, so "iska syllabus?" knows which exam "is" is. */
export interface BotContext {
  examId?: string;
  topicId?: string;
  lastId?: string;
}

// ---------------------------------------------------------------------------------------------
// Text normalisation
// ---------------------------------------------------------------------------------------------

/** Spelling variants and Hindi/Hinglish words mapped to one canonical token. */
const CANON: Record<string, string> = {};
const syn = (canon: string, words: string) => words.split(/\s+/).forEach((w) => w && (CANON[w] = canon));
syn("how", "how kaise kese kaisay kaise kaisa kaisi kesa kaese kasie kaisee kis tarah tarika tareeka tareka process steps method way");
syn("where", "where kahan kaha kahaan kidhar kahin kha khan");
syn("what", "what kya kyaa kia whats wat");
syn("why", "why kyun kyu kyon kiyu kyo reason");
syn("when", "when kab");
syn("price", "price prices pricing cost costs fee fees charge charges charged paisa paise paisay rupee rupees rs inr ₹ amount rate rupay rupaye rupya lagte lagta lagega lagegi mehnga sasta paid payment pay buy purchase kharid kharidna khareedna subscription premium");
syn("free", "free muft mufat freee frree unpaid");
syn("refund", "refund refunds return money-back moneyback");
syn("login", "login log-in signin sign-in logon");
syn("logout", "logout log-out signout sign-out");
syn("signup", "signup sign-up register registration join enroll");
syn("account", "account acount accnt profile id");
syn("password", "password passwd pwd pass passcode");
syn("forgot", "forgot forget bhool bhul bhoola bhula yaad reset");
syn("mock", "mock mocks mok moc full-length fulllength");
syn("test", "test tests exam-test paper papers");
syn("series", "series testseries");
syn("not", "not nahi nhi nai cant cannot didnt dont doesnt missing");
syn("complaint", "complaint complaints shikayat grievance");
syn("exam", "exam exams examination pariksha pareeksha");
syn("question", "question questions ques qs qns que sawal sawaal prashn prashna mcq mcqs");
syn("practice", "practice practise practicing practising abhyas riyaz solve");
syn("syllabus", "syllabus sylabus syllabous silabus curriculum topics-list");
syn("pattern", "pattern patern scheme structure format");
syn("negative", "negative negetive minus cut deduction");
syn("marking", "marking marks mark scoring");
syn("flashcard", "flashcard flashcards flash card cards revision-cards");
syn("resume", "resume resumes cv biodata bio-data");
syn("interview", "interview interviews hr");
syn("video", "video videos youtube yt lecture lectures clip");
syn("note", "note notes summary summaries");
syn("download", "download downloads export");
syn("save", "save saved saving store stored");
syn("pdf", "pdf pdfs");
syn("word", "word docx doc msword");
syn("print", "print printout");
syn("mistake", "mistake mistakes galti galtiyan galat wrong incorrect");
syn("bookmark", "bookmark bookmarks bookmarked star starred");
syn("progress", "progress report analysis stats statistics performance result results score scores");
syn("streak", "streak streaks");
syn("hindi", "hindi हिंदी हिन्दी");
syn("english", "english angrezi angreji");
syn("dark", "dark night black");
syn("contact", "contact support help-desk helpdesk email mail call");
syn("delete", "delete remove hatana hatao mitao erase");
syn("data", "data information info privacy");
syn("phone", "mobile phone android iphone ios smartphone");
syn("device", "device devices laptop pc tablet desktop");
syn("required", "required zaroori zaruri jaruri necessary compulsory must mandatory");
syn("left", "left bache bacha baki baaki remaining balance");
syn("twice", "twice double");
syn("work", "work works working chalega chalta chalti chal");
syn("khatam", "khatam khtm over finished ended");
syn("stop", "stop band rokna roko");
syn("long", "long lamba bada");
syn("install", "install app apk playstore play-store");
syn("offline", "offline internet net bina-internet");
syn("timer", "timer time samay");
syn("skip", "skip chhod chod chhodna");
syn("next", "next aage agla agle forward");
syn("previous", "previous pichla pichhe piche back peeche wapas vapas");
syn("count", "kitne kitna kitni");
syn("open", "open opening khul khulta khulti khol kholna load");
syn("hard", "hard tough difficult kathin mushkil");
syn("easy", "easy aasan asan simple");
syn("doubt", "doubt doubts shanka confusion");
syn("wrong", "galat-answer");
syn("report", "report flag");
syn("today", "today aaj daily roz rozana");
syn("plan", "plan plans planner schedule timetable");
syn("hello", "hello hi hey hii hiii namaste namaskar helo hlo heyy");
syn("thanks", "thanks thank thankyou thx thnx thanx tnx ty shukriya dhanyawad dhanyavad love");
syn("bye", "bye goodbye tata alvida");
syn("who", "who kaun kon");
syn("count", "count number total kitne-sare");
syn("certificate", "certificate certificates certification");
syn("job", "job jobs naukri placement placements campus");
syn("teacher", "teacher teachers faculty tutor mentor");
syn("live", "live class classes");

/** Words that carry no meaning for matching. */
const STOP = new Set(
  (
    "a an the is are was were be been am i me my mine you your we our us it its this that these those to of in on at for from by with and or but if so do does did can could would should will shall may might " +
    "hai hae he h hain hoon hu hun ho hota hoti hote tha thi the ka ki ke ko se me mai mae mein main mujhe mjhe muje mera meri mere hum hamara hame tum aap apna apni apne " +
    "ye yae yeh yah woh vo wo ek aak ak koi kuch kuchh sab sabhi bhi hi to toh na ab abhi phir fir aur or par pe per tak wala wali wale " +
    "kar karo karna karu karun karte karta karti kare kiya ki liye lie please pls plz plzz bhai bro yaar yarr sir mam ji dear sakta sakti sakte skta skte milega milta milti mil " +
    "pata chalega chalta aata aati aate jata jaata jaati jaate jaye jayega din baad pehle karne karke karun dekhe dekhna dekhu dikhta hu hoon hua hue raha rahi rahe chahiye chaiye chiaye chahie chaahiye batao bataiye bata btao bta tell know want need get give use using site website page studyclip"
  ).split(/\s+/),
);

/** Words that suggest the user is writing Hinglish, so the reply is in Hinglish. */
const HINGLISH = new Set(
  "hai hae kya kaise kese kahan kaha kidhar kyun kyu mujhe mera meri hum karo karna kar chahiye chaiye nahi nhi batao bata paise paisa kitne kitna wala wali aur bhi abhi kab kaun milega hota hoga sakta sakte yaar bhai galti galat wapas aaj".split(
    " ",
  ),
);

function stemWord(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("es") && !w.endsWith("ses")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

/** Lowercase words, with common two-word phrases joined first so "sign up" maps like "signup". */
function rawWords(text: string): string[] {
  const t = text
    .toLowerCase()
    .replace(/₹/g, " ₹ ")
    .replace(/\b(sign|log)\s+(in|up|out)\b/g, "$1$2")
    .replace(/\bflash\s+cards?\b/g, "flashcard")
    .replace(/\bbio\s+data\b/g, "biodata")
    .replace(/\bmoney\s+back\b/g, "moneyback")
    .replace(/\bplay\s+store\b/g, "playstore")
    .replace(/\bfull\s+length\b/g, "fulllength")
    .replace(/\bpaisa\s+wapas\b/g, "refund")
    .replace(/\bpaise\s+wapas\b/g, "refund")
    .replace(/\bkis\s+tarah\b/g, "how")
    .replace(/\b(do|2)\s+baar\b/g, "twice")
    .replace(/\b(kitne|kitna|kitni)\s+(ka|ki|ke|paise|paisa|rupay|rupaye|rs|charge)\b/g, "price")
    .replace(/\bone\s+page\b/g, "one-page")
    .replace(/[^\p{L}\p{N}₹\s-]/gu, " ");
  return t.split(/\s+/).filter(Boolean);
}

export function normalise(text: string): string[] {
  const words = rawWords(text);
  const out: string[] = [];
  for (const w of words) {
    if (STOP.has(w)) continue;
    const c = CANON[w] ?? CANON[stemWord(w)] ?? stemWord(w);
    if (!STOP.has(c)) out.push(c);
  }
  // "hi" alone is a greeting, though as a Hinglish word it usually means "only".
  if (!out.length) for (const w of words) if (CANON[w] === "hello" || CANON[w] === "thanks" || CANON[w] === "bye") out.push(CANON[w]);
  return out;
}

/** Question words say little about the topic, so they count for less. */
const WEAK = new Set(["what", "how", "where", "why", "when", "who"]);
const weightOf = (t: string) => (WEAK.has(t) ? 0.35 : 1);

export function detectLang(text: string): Lang {
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  const words = rawWords(text);
  const hits = words.filter((w) => HINGLISH.has(w)).length;
  return hits >= 1 && hits / Math.max(words.length, 1) >= 0.15 ? "hi" : "en";
}

/** Edit distance with an early exit once it passes `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

// ---------------------------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------------------------

interface Doc {
  faq: Faq;
  /** token -> weight in this entry (keywords count most, then the main question, then variants) */
  terms: Map<string, number>;
  /** Joined phrasings, for whole-phrase bonuses */
  phrases: string[];
}

const docs: Doc[] = FAQ.map((faq) => {
  const terms = new Map<string, number>();
  const add = (text: string, w: number) => {
    for (const t of new Set(normalise(text))) terms.set(t, Math.max(terms.get(t) ?? 0, w));
  };
  faq.ask.forEach((a) => add(a, 1));
  add(faq.q, 1.3);
  (faq.keys ?? []).forEach((k) => add(k, 1.8));
  return { faq, terms, phrases: [faq.q, ...faq.ask].map((p) => normalise(p).join(" ")) };
});

const docFreq = new Map<string, number>();
for (const d of docs) for (const t of d.terms.keys()) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
const idf = (t: string) => Math.log(1 + (docs.length - (docFreq.get(t) ?? 0) + 0.5) / ((docFreq.get(t) ?? 0) + 0.5));
const VOCAB = [...docFreq.keys()];

/** Map an unknown word to a known one with a small typo (sylabus → syllabus). */
function correct(t: string): string | null {
  if (docFreq.has(t) || t.length < 4 || /\d/.test(t)) return null;
  const max = t.length >= 8 ? 2 : 1;
  let best: string | null = null;
  let bestD = max + 1;
  for (const v of VOCAB) {
    if (v.length < 3) continue;
    const d = editDistance(t, v, max);
    if (d < bestD || (d === bestD && best && (docFreq.get(v) ?? 0) > (docFreq.get(best) ?? 0))) {
      best = v;
      bestD = d;
    }
  }
  return bestD <= max ? best : null;
}

// ---------------------------------------------------------------------------------------------
// Exams and topics named in a question
// ---------------------------------------------------------------------------------------------

// Full names first, longest first, so "jee advanced" wins over "jee".
const EXAM_NAMES: [string, Exam][] = EXAMS.flatMap((exam): [string, Exam][] => [
  [exam.name.toLowerCase(), exam],
  [exam.id.replace(/-/g, " "), exam],
]).sort((a, b) => b[0].length - a[0].length);
// Short forms ("cgl", "jee", "upsc") point to the featured or first exam that uses them.
const EXAM_SHORT = new Map<string, Exam>();
for (const exam of [...EXAMS.filter((e) => e.featured), ...EXAMS]) {
  const words = exam.name.toLowerCase().split(" ");
  const shorts = [words[0], exam.category === "SSC" ? words.slice(1).join(" ") : ""];
  for (const s of shorts) if (s.length >= 3 && !["ssc", "state", "the", "rrb", "ibps", "sbi"].includes(s) && !EXAM_SHORT.has(s)) EXAM_SHORT.set(s, exam);
}

export function findExam(text: string): Exam | undefined {
  const t = ` ${rawWords(text).join(" ")} `;
  for (const [n, exam] of EXAM_NAMES) if (t.includes(` ${n} `)) return exam;
  for (const [n, exam] of EXAM_SHORT) if (t.includes(` ${n} `)) return exam;
  return undefined;
}

const TOPIC_NAMES: { topic: Topic; names: string[] }[] = TOPICS.map((topic) => ({
  topic,
  names: [topic.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").trim(), ...topic.aliases.map((a) => a.toLowerCase())].filter((n) => n.length >= 4),
}));

export function findTopic(text: string): Topic | undefined {
  const t = ` ${rawWords(text).join(" ")} `;
  let best: Topic | undefined;
  let bestLen = 0;
  for (const { topic, names } of TOPIC_NAMES)
    for (const n of names)
      if (n.length > bestLen && t.includes(` ${n} `)) {
        best = topic;
        bestLen = n.length;
      }
  return best;
}

// ---------------------------------------------------------------------------------------------
// Live facts
// ---------------------------------------------------------------------------------------------

const TOTAL_QUESTIONS = Object.values(BANK_SIZES).reduce((a, b) => a + b, 0);
const round = (n: number) => (n >= 1000 ? `${Math.floor(n / 100) * 100}+` : String(n));
export const FACTS: Record<string, string> = {
  QUESTIONS: TOTAL_QUESTIONS.toLocaleString("en-IN"),
  QUESTIONS_ROUND: round(TOTAL_QUESTIONS),
  EXAMS: String(EXAMS.length),
  TOPICS: String(TOPICS.length),
  BANK_TOPICS: String(Object.keys(BANK_SIZES).length),
};
const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => FACTS[k] ?? m);

function examQuestions(exam: Exam): number {
  const ids = new Set(exam.subjects.flatMap((s) => s.topicIds));
  return [...ids].reduce((n, id) => n + (BANK_SIZES[id] ?? 0), 0);
}

function negativeLine(exam: Exam, lang: Lang): string {
  if (exam.negativeMarking === null)
    return lang === "hi" ? "Negative marking: exam ke saath badalti hai, official notification check karo." : "Negative marking: varies, check the official notification.";
  if (exam.negativeMarking === 0) return lang === "hi" ? "Negative marking: nahi hai." : "Negative marking: none.";
  const f = exam.negativeMarking === 0.25 ? "1/4" : exam.negativeMarking === 1 / 3 ? "1/3" : exam.negativeMarking === 0.5 ? "1/2" : String(exam.negativeMarking);
  return lang === "hi" ? `Negative marking: har galat answer pe ${f} marks katte hain. Mock tests mein bhi yahi lagta hai.` : `Negative marking: ${f} of the marks per wrong answer. Our mock tests apply the same rule.`;
}

/** A short card about one exam, for "ssc cgl", "cgl syllabus", "ibps po mock" and so on. */
function examCard(exam: Exam, focus: Faq["exam"], lang: Lang): { text: string; links: BotLink[] } {
  const withQs = exam.subjects.filter((s) => s.topicIds.length);
  const n = examQuestions(exam);
  const lines: string[] = [];
  lines.push(`**${exam.name}** · ${exam.fullName} (${exam.conductedBy})`);
  if (focus !== "mock") {
    lines.push(lang === "hi" ? "Subjects:" : "Subjects:");
    for (const s of exam.subjects) lines.push(`- ${s.name}${s.topicIds.length ? ` (${s.topicIds.length} ${lang === "hi" ? "topics" : s.topicIds.length === 1 ? "topic" : "topics"})` : lang === "hi" ? " (practice abhi nahi)" : " (no practice yet)"}`);
  }
  lines.push(negativeLine(exam, lang));
  if (n) lines.push(lang === "hi" ? `Is exam ke topics mein ${n.toLocaleString("en-IN")} practice questions hain.` : `${n.toLocaleString("en-IN")} practice questions across its topics.`);
  if (focus === "mock")
    lines.push(
      lang === "hi"
        ? "Full mock exam ke pattern pe hota hai: timer, sectional timing (jahan exam mein hai) aur negative marking ke saath. Har exam ka pehla mock free hai."
        : "The full mock follows the exam pattern: timer, sectional timing where the exam has it, and negative marking. Your first mock for each exam is free.",
    );
  if (!withQs.length) lines.push(lang === "hi" ? "Is exam ke liye practice questions abhi add nahi hue." : "Practice questions for this exam are not added yet.");
  const links: BotLink[] = [{ label: lang === "hi" ? `${exam.name} page kholo` : `Open ${exam.name}`, href: `/exams/${exam.id}` }];
  if (withQs.length) {
    links.push({ label: lang === "hi" ? "Full mock test do" : "Take a full mock", href: `/practice?exam=${exam.id}&mock=1` });
    links.push({ label: lang === "hi" ? "Smart practice" : "Smart practice", href: `/practice?exam=${exam.id}&smart=1` });
  }
  return { text: lines.join("\n"), links };
}

function topicCard(topic: Topic, lang: Lang): { text: string; links: BotLink[] } {
  const n = BANK_SIZES[topic.id] ?? 0;
  const lines = [`**${topic.name}** · ${topic.subject}`, topic.summary];
  if (n) lines.push(lang === "hi" ? `Is topic pe ${n} practice questions hain, easy se very hard tak.` : `${n} practice questions, from easy to very hard.`);
  const links: BotLink[] = [{ label: lang === "hi" ? "Notes padho" : "Read notes", href: `/learn?topic=${encodeURIComponent(topic.name)}` }];
  if (n) links.push({ label: lang === "hi" ? "Practice karo" : "Practise it", href: `/practice?topics=${topic.id}` });
  return { text: lines.join("\n"), links };
}

// ---------------------------------------------------------------------------------------------
// Answering
// ---------------------------------------------------------------------------------------------

export interface Match {
  faq: Faq;
  score: number;
}

/** Score every FAQ entry for a question. Exposed for tests. */
export function rank(query: string): Match[] {
  const toks = normalise(query);
  const fixed = toks.map((t) => (docFreq.has(t) ? t : (correct(t) ?? t)));
  const qset = [...new Set(fixed)];
  if (!qset.length) return [];
  const joined = fixed.join(" ");
  // Words no entry knows still count in the total, so "capital of mars" doesn't match "what is".
  const unknownIdf = Math.log(1 + (docs.length + 0.5) / 0.5);
  const maxPossible = qset.reduce((s, t) => s + (docFreq.has(t) ? idf(t) : unknownIdf * 0.6) * 1.8 * weightOf(t), 0) || 1;
  return docs
    .map(({ faq, terms, phrases }) => {
      let s = 0;
      let hit = 0;
      for (const t of qset) {
        const w = terms.get(t);
        if (w) {
          s += idf(t) * w * weightOf(t);
          hit += weightOf(t);
        }
      }
      if (!hit) return { faq, score: 0 };
      // Whole phrasing match ("refund policy" inside the query) is a strong signal.
      if (phrases.some((p) => p.length > 3 && (joined === p || ` ${joined} `.includes(` ${p} `)))) s *= 1.35;
      // Coverage: how much of the question this entry explains.
      const coverage = hit / qset.reduce((n, t) => n + weightOf(t), 0);
      return { faq, score: (s / maxPossible) * (0.55 + 0.45 * coverage) };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Words that don't change what an exam or topic question is about. */
const GENERIC = new Set(
  "question practice note learn formula test mock syllabus pattern exam negative marking what how where topic concept chapter mcq series paper full prepare preparation taiyari detail details info about".split(" "),
);

const CONFIDENT = 0.34;
const POSSIBLE = 0.16;

const label = (f: Faq, lang: Lang) => (lang === "hi" && f.qh ? f.qh : f.q);
const byId = new Map(FAQ.map((f) => [f.id, f]));

export const STARTERS: Record<Lang, string[]> = {
  en: ["How do I take a mock test?", "What is free and what is paid?", "How do flashcards work?", "How do I make my resume?", "Is my progress saved?"],
  hi: ["Mock test kaise du?", "Kya free hai, kya paid?", "Flashcards kaise kaam karte hain?", "Resume kaise banau?", "Mera progress save hota hai?"],
};

function linksOf(f: Faq, lang: Lang): BotLink[] {
  return (f.links ?? []).map(([en, href, hi]) => ({ label: lang === "hi" && hi ? hi : en, href }));
}

export function answer(query: string, ctx: BotContext = {}, forceLang?: Lang): { reply: BotReply; ctx: BotContext } {
  const lang = forceLang ?? detectLang(query);
  const q = query.trim();
  if (!q) return { reply: { text: "", links: [], suggestions: STARTERS[lang] }, ctx };

  const exam = findExam(q);
  const topic = exam ? undefined : findTopic(q);
  const matches = rank(q);
  let top = matches[0];
  const next: BotContext = { ...ctx, examId: exam?.id ?? ctx.examId, topicId: topic?.id ?? ctx.topicId };

  // A follow-up like "aur price?" or "iska syllabus" leans on the previous answer's subject.
  if ((!top || top.score < CONFIDENT) && ctx.lastId && normalise(q).length <= 3) {
    const prev = byId.get(ctx.lastId);
    if (prev) {
      const again = rank(`${q} ${prev.q}`);
      if (again[0] && again[0].score >= CONFIDENT && again[0].faq.id !== prev.id) top = again[0];
    }
  }

  // Exam named (or remembered) and the question is about that exam's syllabus/mock/pattern.
  const toks = normalise(q);
  const leftover = (names: string[]) => {
    const known = new Set(names.flatMap((n) => normalise(n)));
    return toks.filter((t) => !known.has(t) && !GENERIC.has(t));
  };
  const examFocus = top && top.score >= POSSIBLE ? top.faq.exam : undefined;
  const examForCard = exam ?? (examFocus && ctx.examId ? EXAMS.find((e) => e.id === ctx.examId) : undefined);
  // "ssc cgl", "cgl mock", "neet syllabus": only the exam's name plus words about tests.
  const justExam = !!exam && leftover([exam.name, exam.id.replace(/-/g, " "), ...exam.name.toLowerCase().split(" ")]).length === 0;
  if (examForCard && (examFocus || justExam || !top || top.score < CONFIDENT)) {
    const focus = examFocus ?? (toks.includes("mock") || toks.includes("test") ? "mock" : undefined);
    const card = examCard(examForCard, focus, lang);
    return {
      reply: {
        text: card.text,
        links: card.links,
        suggestions: lang === "hi" ? ["Negative marking kaise lagti hai?", "Mock test kaise du?", "Kya free hai, kya paid?"] : ["How is negative marking applied?", "How do I take a mock test?", "What is free and what is paid?"],
        id: top?.faq.id,
      },
      ctx: { ...next, examId: examForCard.id, lastId: top?.faq.id ?? ctx.lastId },
    };
  }

  // "percentage questions", "profit and loss": a topic's name plus words about studying it.
  const justTopic = !!topic && leftover([topic.name, ...topic.aliases]).length === 0;
  if (topic && ((justTopic && !(top && top.score >= 1)) || !top || top.score < CONFIDENT || top.faq.cat === "study")) {
    const card = topicCard(topic, lang);
    return {
      reply: { text: card.text, links: card.links, suggestions: lang === "hi" ? ["Notes kaise padhu?", "Practice kaise karu?"] : ["How do topic notes work?", "How does practice work?"] },
      ctx: next,
    };
  }

  // A clear winner counts as an answer even when the question had many extra words.
  const clearWinner = !!top && top.score >= 0.22 && top.score >= 1.5 * (matches[1]?.score ?? 0);
  if (top && (top.score >= CONFIDENT || clearWinner)) {
    const f = top.faq;
    const follow = (f.next ?? []).map((id) => byId.get(id)).filter((x): x is Faq => !!x);
    const others = matches.slice(1, 4).filter((m) => m.score >= CONFIDENT * 0.8 && !follow.includes(m.faq));
    return {
      reply: {
        text: fill(lang === "hi" ? f.hi : f.en),
        links: linksOf(f, lang),
        suggestions: [...follow, ...others.map((m) => m.faq)].slice(0, 3).map((x) => label(x, lang)),
        id: f.id,
      },
      ctx: { ...next, lastId: f.id },
    };
  }

  const maybe = matches.filter((m) => m.score >= POSSIBLE).slice(0, 3);
  if (maybe.length)
    return {
      reply: {
        text: lang === "hi" ? "Pakka nahi samjha. Kya aap inmein se kuch puchna chahte the?" : "I’m not sure I got that. Did you mean one of these?",
        links: [],
        suggestions: maybe.map((m) => label(m.faq, lang)),
        unsure: true,
      },
      ctx: next,
    };

  return {
    reply: {
      text:
        lang === "hi"
          ? "Iska jawab mere paas abhi nahi hai. Thoda alag shabdon mein pucho, ya Contact page se hamari team ko message karo, woh reply karegi."
          : "I don’t have an answer for that yet. Try asking in other words, or message our team from the Contact page and they’ll reply.",
      links: [{ label: lang === "hi" ? "Contact page" : "Contact us", href: "/contact" }],
      suggestions: STARTERS[lang].slice(0, 3),
      unsure: true,
    },
    ctx: next,
  };
}
