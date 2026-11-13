// Checks the offline help bot: knowledge-base integrity, and that real student questions
// (English, Hinglish, typos, short forms) reach the right answer. Run: npm run test:helpbot
import { readdirSync, existsSync } from "node:fs";
import { answer, detectLang, findExam, rank } from "../src/lib/helpbot.ts";
import { FAQ } from "../src/data/faq.ts";

let fail = 0;
const bad = (msg) => {
  fail++;
  console.log("✗ " + msg);
};

// ---- Knowledge base integrity ----
const ids = new Set();
const routes = new Set(readdirSync("src/app", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name));
for (const f of FAQ) {
  if (ids.has(f.id)) bad(`duplicate id ${f.id}`);
  ids.add(f.id);
  if (!f.en.trim() || !f.hi.trim()) bad(`${f.id}: empty answer`);
  if (f.ask.length < 3) bad(`${f.id}: needs at least 3 ways of asking`);
  for (const [, href] of f.links ?? []) {
    const seg = href.split(/[/?#]/)[1];
    if (!href.startsWith("/") || (seg && !routes.has(seg))) bad(`${f.id}: link to unknown page ${href}`);
  }
}
for (const f of FAQ) for (const n of f.next ?? []) if (!ids.has(n)) bad(`${f.id}: next "${n}" does not exist`);
if (!existsSync("src/app/contact")) bad("contact page missing");

// ---- Questions → expected answer ----
// "id" = FAQ entry, "exam:<id>" = exam card, "topic:<id>" = topic card, "?" = unsure/fallback
const CASES = [
  ["hi", "hello"],
  ["namaste", "hello"],
  ["thanks bhai", "thanks"],
  ["what is this website", "what-is"],
  ["ye website kya hai", "what-is"],
  ["kaha se shuru karu", "start-where"],
  ["i am new here how to use", "start-where"],
  ["is there a step by step guide", "start-guide"],
  ["tutorial hai kya", "start-guide"],
  ["shuru se samjhao", "start-guide"],
  ["which exams do you have", "exams-list"],
  ["kaun kaun se exam hai", "exams-list"],
  ["mera exam list mein nahi hai", "exam-missing"],
  ["how many questions are there", "question-count"],
  ["kitne question hai total", "question-count"],
  ["are there unlimited questions", "unlimited-questions"],
  ["unlimited practice kaise kare", "unlimited-questions"],
  ["are these pyq", "question-source"],
  ["previous year questions milenge?", "question-source"],
  ["questions bahut tough hai", "difficulty"],
  ["hindi mein question milenge kya", "hindi"],
  ["how to practice topic wise", "practice-how"],
  ["practice kaise kare", "practice-how"],
  ["what is smart practice", "smart-practice"],
  ["can i skip a question", "skip-question"],
  ["pichla question kaise dekhe", "skip-question"],
  ["where is the explanation", "explanations"],
  ["keyboard shortcuts", "keyboard"],
  ["answer galat hai question ka", "report-question"],
  ["how to report wrong answer", "report-question"],
  ["bookmark a question", "save-question"],
  ["question save kaise kare", "save-question"],
  ["mistake notebook", "mistakes"],
  ["is there a weekly leaderboard", "leaderboard"],
  ["how to refer a friend", "invite"],
  ["dost ko invite kaise kare", "invite"],
  ["galat sawal dobara practice kaise kare", "mistakes"],
  ["challenge my friend", "challenge"],
  ["whatsapp pe share", "challenge"],
  ["how to give mock test", "mock-how"],
  ["mock test kaise de", "mock-how"],
  ["mok test", "mock-how"],
  ["test series hai kya", "mock-how"],
  ["kitne mock test free hai", "free-test"],
  ["is mock test free", "free-test"],
  ["sectional test", "section-test"],
  ["sirf quant ka test dena hai", "section-test"],
  ["negative marking kitni hai", "negative"],
  ["negetive marking", "negative"],
  ["where is syllabus", "syllabus"],
  ["sylabus kahan milega", "syllabus"],
  ["cant go back to previous section", "sectional-timing"],
  ["mark for review kya hai", "mark-review"],
  ["test ke beech net chala gaya", "submit-test"],
  ["where is my test result", "results"],
  ["my rank and percentile", "results"],
  ["exam tomorrow page", "last-minute"],
  ["kal exam hai kya karu", "exam-tomorrow-advice"],
  ["daily plan", "daily-plan"],
  ["aaj kya padhu", "daily-plan"],
  ["streak kaise badhaye", "streak"],
  ["how to earn xp", "streak"],
  ["my progress", "progress"],
  ["is my progress saved", "progress-saved"],
  ["phone change kiya to data rahega", "progress-saved"],
  ["how do flashcards work", "flashcards-what"],
  ["flash cards kya hai", "flashcards-what"],
  ["how to add flashcards", "flashcards-add"],
  ["no cards due", "flashcards-due"],
  ["topic notes kahan hai", "learn"],
  ["youtube video ke notes", "video-how"],
  ["paste youtube link", "video-how"],
  ["video not working captions", "video-no-captions"],
  ["download video notes pdf", "video-export"],
  ["read aloud", "read-aloud"],
  ["interview questions", "interview"],
  ["tell me about yourself answer", "interview"],
  ["tcs nqt preparation", "exam:tcs-nqt"],
  ["placement preparation", "placement"],
  ["resume kaise banaye", "resume"],
  ["make my cv", "resume"],
  ["resume pdf download", "resume-download"],
  ["resume word file", "resume-download"],
  ["resume gayab ho gaya", "resume-saved"],
  ["photo in resume", "resume-photo"],
  ["dark mode", "dark-mode"],
  ["night mode kaise kare", "dark-mode"],
  ["android app hai kya", "app"],
  ["play store app", "app"],
  ["bina internet chalega", "offline"],
  ["certificate milega", "certificate"],
  ["live classes hai kya", "live-classes"],
  ["ssc cgl form kab aayega", "job-alerts"],
  ["my exam is tomorrow what should i do", "exam-tomorrow-advice|last-minute"],
  ["login nahi ho raha password galat", "login"],
  ["hello", "hello"],
  ["vacancy notification", "job-alerts"],
  ["admit card", "job-alerts"],
  ["how to create account", "signup"],
  ["register kaise kare", "signup"],
  ["sign up", "signup"],
  ["login nahi ho raha", "login"],
  ["google login", "login"],
  ["forgot password", "forgot-password"],
  ["password bhool gaya", "forgot-password"],
  ["otp nahi aaya", "no-code"],
  ["verification code not received", "no-code"],
  ["logout", "logout"],
  ["delete my account", "delete-account"],
  ["is my data safe", "privacy"],
  ["kya ye free hai", "free-vs-paid"],
  ["is it free", "free-vs-paid"],
  ["kitne paise lagte hai", "price"],
  ["price", "price"],
  ["what are credits", "credits"],
  ["revision pack kya hai", "revision-pack"],
  ["upi se payment", "pay-how"],
  ["phonepe", "pay-how"],
  ["paisa kat gaya par test nahi mila", "paid-not-received"],
  ["payment failed money deducted", "paid-not-received"],
  ["refund", "refund"],
  ["paisa wapas chahiye", "refund"],
  ["invoice", "invoice"],
  ["contact support", "contact"],
  ["complaint karni hai", "contact"],
  ["is this official ssc website", "who-runs"],
  ["site not working", "bug"],
  ["page load nahi ho raha", "bug"],
  ["can i share my account", "terms"],
  ["who are you", "who-bot"],
  ["kya tum robot ho", "who-bot"],
  ["talk to human", "human"],
  ["tell me a joke", "joke"],
  ["how to prepare for exam", "how-prepare"],
  ["padhai kaise karu", "how-prepare"],
  ["kitne ghante padhna chahiye", "how-many-hours"],
  ["weak topics kaise sudhare", "weak-topics"],
  ["paper time pe complete nahi hota", "time-management"],
  ["man nahi lagta padhne mein", "motivation"],
  ["solve my maths doubt", "doubt-solve"],
  // Exams and topics named
  ["ssc cgl", "exam:ssc-cgl"],
  ["cgl syllabus", "exam:ssc-cgl"],
  ["ibps po mock test", "exam:ibps-po"],
  ["neet syllabus", "exam:neet-ug"],
  ["jee main pattern", "exam:jee-main"],
  ["upsc", "exam:upsc-prelims"],
  ["ctet negative marking", "exam:ctet"],
  ["rrb ntpc", "exam:rrb-ntpc"],
  ["preamble", "topic:polity-preamble"],
  // Second batch, written after the first round of tuning
  ["test dene ke liye login zaroori hai?", "need-account"],
  ["mere credits kitne bache hai", "credits"],
  ["19 rupay me kya milta hai", "price"],
  ["maine galti se do baar pay kar diya", "paid-not-received"],
  ["laptop pe progress dikhega kya", "progress-saved"],
  ["how to change my email", "change-email"],
  ["flashcard skip kaise kare", "flashcards-what"],
  ["topic ke notes pdf me chahiye", "notes-pdf"],
  ["shorts link chalega?", "video-no-captions"],
  ["resume one page se zyada ho raha", "resume-one-page"],
  ["quant ke questions kahan hai", "subjects-where"],
  ["current affairs hai kya", "current-affairs"],
  ["timer kaise band kare", "pause-timer"],
  ["section ka time khatam ho gaya", "sectional-timing"],
  ["site hindi me hai kya", "hindi"],
  ["who made this", "who-runs"],
  ["gpay chalega", "pay-how"],
  ["unlock all topics", "revision-pack"],
  ["kya haal hai", "hello"],
  ["thnx", "thanks"],
  ["pls help", "help-menu"],
  ["not helpful", "abuse"],
  ["sbi po syllabus", "exam:sbi-po"],
  ["rrb group d mock", "exam:rrb-group-d"],
  ["neet pg", "exam:neet-pg"],
  ["percentage questions", "topic:quant-percentage"],
  ["profit and loss", "topic:quant-profit-loss"],
  ["photosynthesis", "topic:bio-plant-physiology"],
  // Third batch
  ["sir mock test me kitne question aate hai", "mock-how"],
  ["teacher banne ke liye exam", "exams-list"],
  ["answer dekhne ke baad wapas change kar sakte hai", "change-answer"],
  ["practice me timer hai kya", "practice-how"],
  ["mujhe roz 50 question karne hai", "daily-plan"],
  ["kaise pata chalega mai kitna ready hu", "progress"],
  ["flashcards delete kaise kare", "flashcard-delete"],
  ["video speed badhani hai", "video-how"],
  ["resume me linkedin link", "resume"],
  ["same test dobara", "retake-test"],
  ["login karne ke baad bhi test nahi khul raha", "bug"],
  ["account hack ho gaya", "account-hacked"],
  ["website kisne banayi", "who-runs"],
  ["telegram channel", "community"],
  ["refund kitne din me aata hai", "refund"],
  ["kitne ka hai", "price"],
  // Fourth batch
  ["exam select kaise kare", "choose-exam"],
  ["mera exam change karna hai", "choose-exam"],
  ["video ke liye account chahiye", "need-account"],
  ["group discussion", "group-discussion"],
  ["account bana liya ab kya kare", "start-where"],
  ["result kab aayega mock ka", "results"],
  ["free me kitne test milenge", "free-test"],
  ["password change", "forgot-password"],
  ["streak wapas kaise laye", "streak"],
  // Skill tools
  ["calculation speed kaise badhaye", "speed-drills"],
  ["tables practice", "speed-drills"],
  ["typing test", "typing-test"],
  ["hindi typing practice", "typing-test"],
  ["quant formulas", "formula-sheets"],
  ["formula sheet pdf download", "formula-sheets"],
  ["how do i get daily reminders", "reminders"],
  ["roz padhai ka reminder chahiye", "reminders"],
  ["notification band kaise kare reminder", "reminders"],
  ["remind me to study every day", "reminders"],
  // Nonsense
  ["asdfgh qwerty", "?"],
  ["what is the capital of mars", "topic:geo-solar-system"],
  ["who won the cricket match yesterday", "?"],
];

const examIds = new Set();
for (const [q, want] of CASES) {
  const { reply } = answer(q, {});
  let got;
  if (want.startsWith("exam:")) {
    const e = findExam(q);
    got = e && reply.links.some((l) => l.href === `/exams/${e.id}`) ? `exam:${e.id}` : (reply.id ?? (reply.unsure ? "?" : "-"));
    examIds.add(want.slice(5));
  } else if (want.startsWith("topic:")) {
    const l = reply.links.find((x) => x.href.startsWith("/practice?topics="));
    got = l ? `topic:${l.href.split("=")[1]}` : (reply.id ?? "-");
  } else got = reply.unsure && !reply.id ? "?" : (reply.id ?? "-");
  if (!want.split("|").includes(got)) {
    const top = rank(q).slice(0, 3).map((m) => `${m.faq.id}:${m.score.toFixed(2)}`).join(" ");
    bad(`"${q}" → ${got} (want ${want})   top: ${top}`);
  }
}

// Follow-up memory: an exam named earlier is used for "iska syllabus".
{
  const first = answer("ssc cgl", {});
  const second = answer("iska syllabus", first.ctx);
  if (!second.reply.links.some((l) => l.href === "/exams/ssc-cgl")) bad(`follow-up "iska syllabus" lost the exam`);
}
// Language detection
for (const [q, l] of [["mock test kaise de", "hi"], ["how do i take a mock test", "en"], ["मॉक टेस्ट", "hi"], ["refund", "en"]])
  if (detectLang(q) !== l) bad(`detectLang("${q}") = ${detectLang(q)}, want ${l}`);

console.log(`\n${FAQ.length} FAQ entries · ${CASES.length} test questions · ${fail ? `${fail} problem(s)` : "all passed"}`);
process.exit(fail ? 1 : 0);
