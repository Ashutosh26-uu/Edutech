/**
 * Mock-interview feedback that needs no AI: it runs in the browser on the student's answer
 * (typed, or spoken and turned into text) and the question's model answer. It measures what an
 * interviewer notices first: whether the key points came up, filler words, speaking pace, length,
 * and for behavioural questions the four parts of a STAR answer.
 */

export type Round = "hr" | "behavioural" | "technical" | "project" | "mixed";

export interface Analysis {
  words: number;
  /** Words per minute while speaking (null for typed answers). */
  wpm: number | null;
  fillers: { word: string; count: number }[];
  /** Filler words per 100 words. */
  fillerRate: number;
  /** Share of the model answer's key terms that came up, 0..1. */
  coverage: number;
  matched: string[];
  missed: string[];
  /** Only for behavioural answers. */
  star: { situation: boolean; task: boolean; action: boolean; result: boolean } | null;
  /** 0..10, from the parts above. */
  score: number;
  tips: string[];
}

const FILLERS = ["um", "umm", "uh", "uhh", "hmm", "er", "basically", "actually", "literally", "you know", "i mean", "kind of", "sort of", "so yeah", "like i said", "matlab", "toh basically"];

const STOP = new Set(
  (
    "a an the and or but if then than so of to in on at by for with from into over under about as is are was were be been being am do does did done have has had having " +
    "i me my mine we our you your he she they them their it its this that these those there here what which who whom whose when where why how all any both each few more most " +
    "other some such no nor not only own same too very can will just should would could may might must also again once up down out off further while because until " +
    "framework sample answer example say saying said tell keep like one two three first second last get got make made want wanted really thing things way ways " +
    "good great well lot much many time times year years day days try tried using use used able need needs give gives show shows know knows think thought " +
    "question questions interviewer interview candidate role job company work worked working team " +
    "situation task action result star structure point points short sentence sentences specific concrete"
  ).split(" "),
);

/** A light stem so "joins", "joined" and "joining" match "join". */
const stem = (w: string) => w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, "").replace(/(.)\1$/, "$1");
const tokens = (text: string) => text.toLowerCase().match(/[a-z][a-z0-9+#.-]*[a-z0-9+#]|[a-z]/g) ?? [];

/** The words of the model answer that carry its content, most frequent first (up to `max`). */
export function keyTerms(fullAnswer: string, question = "", max = 12): string[] {
  // HR and behavioural answers are "Framework: … Sample: '…'": the framework holds the points every
  // good answer makes, the sample is one person's story (its details don't belong in yours).
  const cut = fullAnswer.indexOf("Sample:");
  const framework = cut > 0 ? fullAnswer.slice(0, cut) : fullAnswer;
  const modelAnswer = cut > 0 && tokens(framework).filter((w) => w.length >= 4 && !STOP.has(w)).length >= 6 ? framework : fullAnswer;
  const counts = new Map<string, { word: string; n: number }>();
  const asked = new Set(tokens(question).map(stem));
  for (const w of tokens(modelAnswer)) {
    if (w.length < 4 || STOP.has(w) || /^\d/.test(w)) continue;
    const s = stem(w);
    if (asked.has(s)) continue; // repeating the question's own words proves nothing
    const c = counts.get(s);
    if (c) c.n++;
    else counts.set(s, { word: w, n: 1 });
  }
  // Short technical acronyms (SQL, TCP, OOP) matter even though they are short.
  for (const m of modelAnswer.match(/\b[A-Z]{2,5}\b/g) ?? []) {
    const s = stem(m.toLowerCase());
    if (!STOP.has(m.toLowerCase()) && !asked.has(s) && !counts.has(s)) counts.set(s, { word: m, n: 2 });
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n || b.word.length - a.word.length)
    .slice(0, max)
    .map((c) => c.word);
}

export function countFillers(text: string): { word: string; count: number }[] {
  const t = ` ${text.toLowerCase().replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ")} `;
  const out: { word: string; count: number }[] = [];
  for (const f of FILLERS) {
    const n = t.split(` ${f} `).length - 1;
    if (n) out.push({ word: f, count: n });
  }
  return out.sort((a, b) => b.count - a.count);
}

const STAR_SIGNS = {
  situation: /\b(when i was|during (my|our|the)|in (my|our) (project|internship|college|team|final)|once|last (year|semester)|there was|we had)\b/,
  task: /\b(i (had|needed|was asked|was responsible|wanted) to|my (task|job|role|responsibility|goal) was|the goal was|we needed to|deadline)\b/,
  action: /\b(so i|i (decided|started|built|wrote|spoke|talked|created|fixed|organised|organized|divided|asked|took|set up|learned|learnt|tried|made|led))\b/,
  result: /\b(as a result|in the end|finally|result was|which (helped|led|meant|saved)|we (won|finished|delivered|got)|it (worked|helped|reduced|improved)|\d+ ?(%|percent|marks|users|days|hours))\b/,
};

export function starParts(text: string) {
  const t = text.toLowerCase();
  return {
    situation: STAR_SIGNS.situation.test(t),
    task: STAR_SIGNS.task.test(t),
    action: STAR_SIGNS.action.test(t),
    result: STAR_SIGNS.result.test(t),
  };
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function analyse(input: { answer: string; question: string; modelAnswer: string; round: Exclude<Round, "mixed">; speakingSeconds?: number | null }): Analysis {
  const answer = input.answer.trim();
  const words = answer ? answer.split(/\s+/).length : 0;
  const wpm = input.speakingSeconds && input.speakingSeconds >= 5 && words ? Math.round((words / input.speakingSeconds) * 60) : null;
  const fillers = countFillers(answer);
  const fillerCount = fillers.reduce((n, f) => n + f.count, 0);
  const fillerRate = words ? Math.round((fillerCount / words) * 1000) / 10 : 0;

  // Behavioural model answers are one person's story; the student's own story should differ, so
  // those answers are judged on STAR, fluency, pace and length, not on matching words.
  const terms = input.round === "behavioural" ? [] : keyTerms(input.modelAnswer, input.question);
  const said = new Set(tokens(answer).map(stem));
  const matched = terms.filter((t) => said.has(stem(t.toLowerCase())));
  const missed = terms.filter((t) => !matched.includes(t));
  // No model answer (an AI follow-up question): content can't be measured here, so it doesn't count against the answer.
  const coverage = terms.length ? matched.length / terms.length : 1;
  const star = input.round === "behavioural" ? starParts(answer) : null;

  // A strong answer touches about half the key terms in its own words; more is a bonus, not required.
  const content = clamp01(coverage / 0.5);
  const fluency = clamp01(1 - fillerRate / 8);
  const pace = wpm === null ? 1 : wpm < 90 ? clamp01(wpm / 90) : wpm > 180 ? clamp01(1 - (wpm - 180) / 80) : 1;
  const [lo, hi] = input.round === "technical" ? [40, 260] : [70, 260];
  const length = words < lo ? clamp01(words / lo) : words > hi ? clamp01(1 - (words - hi) / 200) : 1;
  const starScore = star ? Object.values(star).filter(Boolean).length / 4 : null;
  const raw = starScore === null ? 0.5 * content + 0.2 * fluency + 0.15 * pace + 0.15 * length : 0.5 * starScore + 0.2 * fluency + 0.1 * pace + 0.2 * length;
  const score = words === 0 ? 0 : Math.round(raw * 100) / 10;

  const tips: string[] = [];
  if (words === 0) tips.push("No answer was recorded. Even a short, honest attempt is better than silence in a real interview.");
  else {
    if (words < lo) tips.push(`Too short (${words} words). Add one concrete example or detail.`);
    if (words > hi) tips.push(`Quite long (${words} words). Interviewers prefer about one to two minutes; lead with your main point.`);
    if (missed.length && coverage < 0.5) tips.push(`Key points you could add: ${missed.slice(0, 4).join(", ")}.`);
    if (fillerRate >= 3) tips.push(`Many filler words (${fillers.slice(0, 3).map((f) => `"${f.word}" ×${f.count}`).join(", ")}). Pause silently instead.`);
    if (wpm !== null && wpm < 90) tips.push(`Slow pace (${wpm} words/min). Aim for about 120 to 160.`);
    if (wpm !== null && wpm > 180) tips.push(`Fast pace (${wpm} words/min). Slow down a little so each point lands.`);
    if (star) {
      const gaps = (Object.keys(star) as (keyof typeof star)[]).filter((k) => !star[k]);
      if (gaps.length) tips.push(`STAR parts not heard: ${gaps.join(", ")}. Say what happened, your task, what you did and the result.`);
    }
    if (!tips.length) tips.push("Clear and complete. Next time, add one number or result to make it memorable.");
  }
  return { words, wpm, fillers, fillerRate, coverage, matched, missed, star, score, tips };
}

export interface Scorecard {
  overall: number;
  /** Null when no answer had key points to check (a behavioural-only round). */
  content: number | null;
  fluency: number;
  pace: number | null;
  star: number | null;
  answered: number;
  improvements: string[];
}

/** The whole interview: averages (0..10) and the three things to work on first. */
export function scorecard(results: Analysis[]): Scorecard {
  const answered = results.filter((r) => r.words > 0);
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : 0);
  const paced = answered.filter((r) => r.wpm !== null);
  const starred = answered.filter((r) => r.star);
  const improvements: string[] = [];
  const withTerms = answered.filter((r) => r.matched.length + r.missed.length > 0);
  const contentAvg = withTerms.length ? avg(withTerms.map((r) => clamp01(r.coverage / 0.5) * 10)) : null;
  const fillerAvg = avg(answered.map((r) => r.fillerRate));
  if (answered.length < results.length) improvements.push(`${results.length - answered.length} question${results.length - answered.length === 1 ? "" : "s"} left unanswered: always try, even briefly.`);
  if (contentAvg !== null && contentAvg < 6) improvements.push("Cover the core points: read the model answers for the questions you missed and say them in your own words.");
  if (fillerAvg >= 3) improvements.push(`Cut filler words (about ${fillerAvg} per 100 words): pause instead of saying "um" or "basically".`);
  const wpmAvg = paced.length ? avg(paced.map((r) => r.wpm!)) : null;
  if (wpmAvg !== null && (wpmAvg < 100 || wpmAvg > 175)) improvements.push(`Work on pace: you averaged ${Math.round(wpmAvg)} words a minute; 120 to 160 sounds confident.`);
  if (starred.some((r) => r.star && Object.values(r.star).filter(Boolean).length < 3)) improvements.push("Use STAR for behavioural answers: situation, task, action, and a clear result.");
  const short = answered.filter((r) => r.words < 50).length;
  if (short >= Math.max(2, answered.length / 3)) improvements.push("Many answers were very short: add one example or detail to each.");
  if (!improvements.length) improvements.push("Strong interview. Practise again with a different round to stay sharp.");
  return {
    overall: avg(results.map((r) => r.score)),
    content: contentAvg,
    fluency: avg(answered.map((r) => clamp01(1 - r.fillerRate / 8) * 10)),
    pace: wpmAvg === null ? null : Math.round(wpmAvg),
    star: starred.length ? avg(starred.map((r) => (Object.values(r.star!).filter(Boolean).length / 4) * 10)) : null,
    answered: answered.length,
    improvements: improvements.slice(0, 3),
  };
}
