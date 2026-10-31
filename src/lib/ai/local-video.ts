import type { Chapter, Importance, MCQ, TranscriptLine, VideoBreakdown, VideoNotes } from "../types";
import type { VideoTranscript } from "../youtube";
import { formatTime } from "../youtube";
import { capitalize, gapDepths, idf, seededRandom, sentences, shuffle, termFreq, titleCase, tokenize, type Vec } from "../nlp";

/** Channel promotion and sponsor talk: never useful as notes or quiz material. */
const PROMO = /\b(patreon|patrons?|subscribe|sponsor(ed)?|funding|bell icon|comment below|like and share|telegram|discount|coupon)\b/i;

/** Words that lecturers use when flagging exam-relevant material. */
const CUES = /\b(important|exam|remember|note down|definition|defined|formula|rule|asked|question|key point|must|always|never|called|known as|means)\b/gi;
const FACT = /\b(1[5-9]\d\d|20\d\d)\b|\d+(\.\d+)?\s?(%|percent|km|kg|crore|lakh|million|billion)|\b(article|section|schedule|amendment)\s+\d+|\b(is called|is known as|is defined as|refers to|stands for|means)\b/i;

interface Block {
  start: number;
  end: number;
  text: string;
  tf: Vec;
}

interface Sentence {
  text: string;
  start: number;
  chapter: number;
  score: number;
}

function buildBlocks(lines: TranscriptLine[], blockSec: number): Block[] {
  const blocks: Block[] = [];
  let cur: TranscriptLine[] = [];
  const flush = () => {
    if (!cur.length) return;
    const text = cur.map((l) => l.text).join(" ");
    const last = cur.at(-1)!;
    blocks.push({ start: cur[0].start, end: last.start + last.dur, text, tf: termFreq(tokenize(text)) });
    cur = [];
  };
  for (const line of lines) {
    if (cur.length && line.start - cur[0].start >= blockSec) flush();
    cur.push(line);
  }
  flush();
  return blocks;
}

/** Picks chapter boundaries at the deepest similarity dips, keeping chapters at least `minLen` seconds long. */
function chooseBoundaries(blocks: Block[], target: number, minLen: number): number[] {
  if (target <= 1 || blocks.length < 4) return [];
  const depths = gapDepths(blocks.map((b) => b.tf), 3);
  const order = depths.map((d, i) => ({ d, i })).sort((a, b) => b.d - a.d);
  const cuts: number[] = []; // block index where a new chapter starts
  const total = blocks.at(-1)!.end;
  for (const { i } of order) {
    if (cuts.length >= target - 1) break;
    const at = blocks[i + 1].start;
    if (at < minLen || total - at < minLen) continue;
    if (cuts.some((c) => Math.abs(blocks[c].start - at) < minLen)) continue;
    cuts.push(i + 1);
  }
  return cuts.sort((a, b) => a - b);
}

/** Most frequent surface spelling for each stem, so keywords display as real words. */
function surfaceForms(text: string): Map<string, string> {
  const counts = new Map<string, Map<string, number>>();
  for (const t of tokenize(text)) {
    const m = counts.get(t.stem) ?? new Map();
    m.set(t.surface, (m.get(t.surface) ?? 0) + 1);
    counts.set(t.stem, m);
  }
  const out = new Map<string, string>();
  for (const [s, m] of counts) out.set(s, [...m].sort((a, b) => b[1] - a[1])[0][0]);
  return out;
}

/** Keywords must recur across the video (`minGlobal` times) so one-off words and names don't become topics. */
function topKeywords(tf: Vec, weights: Map<string, number>, n: number, globalTf: Vec, minGlobal: number): string[] {
  return [...tf]
    .map(([k, c]) => [k, (1 + Math.log(c)) * (weights.get(k) ?? 0)] as const)
    .filter(([k, s]) => s > 0 && !/^\d+$/.test(k) && (globalTf.get(k) ?? 0) >= minGlobal)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

/** Best two-word phrase made of adjacent content words, e.g. "fundamental rights". */
function bestPhrase(text: string, weights: Map<string, number>, globalTf: Vec, minGlobal: number): string | null {
  const words = text.toLowerCase().match(/[a-z][a-z'-]*[a-z]/g) ?? [];
  const counts = new Map<string, { n: number; score: number }>();
  for (let i = 0; i < words.length - 1; i++) {
    const a = tokenize(words[i])[0];
    const b = tokenize(words[i + 1])[0];
    if (!a || !b || a.stem === b.stem) continue;
    if ((globalTf.get(a.stem) ?? 0) < minGlobal || (globalTf.get(b.stem) ?? 0) < minGlobal) continue;
    const key = `${a.surface} ${b.surface}`;
    const e = counts.get(key) ?? { n: 0, score: ((weights.get(a.stem) ?? 0) + (weights.get(b.stem) ?? 0)) / 2 };
    e.n++;
    counts.set(key, e);
  }
  const best = [...counts].filter(([, e]) => e.n >= 2).sort((a, b) => b[1].n * b[1].score - a[1].n * a[1].score)[0];
  return best ? best[0] : null;
}

function scoreSentence(text: string, weights: Map<string, number>): number {
  if (/^\s*\W*\s*$/.test(text)) return 0;
  const toks = tokenize(text);
  if (toks.length < 4) return 0;
  const uniq = new Set(toks.map((t) => t.stem));
  let s = 0;
  for (const k of uniq) s += weights.get(k) ?? 0;
  const cues = text.match(CUES)?.length ?? 0;
  return (s / Math.sqrt(toks.length)) * (1 + 0.25 * cues) * (FACT.test(text) ? 1.2 : 1) * (PROMO.test(text) ? 0.2 : 1);
}

function tidy(s: string, maxWords = 40): string {
  const words = s.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim().split(" ");
  let t = words.slice(0, maxWords).join(" ");
  if (words.length > maxWords) t += "…";
  t = capitalize(t);
  return /[.!?…]$/.test(t) ? t : t + ".";
}

function buildQuiz(cands: Sentence[], keywords: string[], forms: Map<string, string>, weights: Map<string, number>, seed: string): MCQ[] {
  const rand = seededRandom(seed);
  // Answers come from the video's top keywords, best-ranked first; "-ing" words are usually verbs, so only the strongest are kept.
  const pool = keywords
    .slice(0, 20)
    .map((k) => forms.get(k) ?? k)
    .filter((w, i) => w.length >= 4 && (i < 6 || !/ing$/.test(w)));
  const rank = (w: string) => pool.indexOf(w);
  const used = new Set<string>();
  const quiz: MCQ[] = [];
  for (const s of cands) {
    if (quiz.length >= 8) break;
    if (PROMO.test(s.text)) continue;
    const year = s.text.match(/\b(1[5-9]\d\d|20\d\d)\b/)?.[0];
    let answer: string | undefined;
    let distractors: string[] = [];
    if (year && !used.has(year)) {
      answer = year;
      const offsets = shuffle([-12, -7, -3, 4, 9, 15], rand).slice(0, 3);
      distractors = offsets.map((o) => String(+year + o));
    } else {
      const toks = tokenize(s.text).filter((t) => t.surface === (forms.get(t.stem) ?? t.surface) && rank(t.surface) >= 0 && !used.has(t.surface));
      toks.sort((a, b) => rank(a.surface) - rank(b.surface));
      const pick = toks[0];
      if (!pick) continue;
      answer = pick.surface;
      const lower = s.text.toLowerCase();
      distractors = shuffle(pool.filter((w) => w !== answer && !lower.includes(w)), rand).slice(0, 3);
    }
    if (!answer || distractors.length < 3) continue;
    const re = new RegExp(`\\b${answer.replace(/[-']/g, "\\$&")}\\b`, "i");
    if (!re.test(s.text)) continue;
    used.add(answer);
    const options = shuffle([answer, ...distractors], rand);
    quiz.push({
      id: `v${quiz.length}`,
      question: `Fill in the blank: “${tidy(s.text.replace(re, "_____"), 45)}”`,
      options,
      answer: options.indexOf(answer),
      explanation: `At ${formatTime(s.start)} in the video: “${tidy(s.text, 45)}”`,
      timestamp: s.start,
    });
  }
  return quiz;
}

export function analyzeVideo(videoId: string, t: VideoTranscript): Omit<VideoBreakdown, "provider"> {
  const duration = Math.max(t.lengthSeconds, Math.ceil(t.lines.at(-1)!.start + t.lines.at(-1)!.dur));
  const blockSec = Math.min(60, Math.max(15, duration / 120));
  const blocks = buildBlocks(t.lines, blockSec);
  const weights = idf(blocks.map((b) => b.tf));
  const fullText = blocks.map((b) => b.text).join(" ");
  const forms = surfaceForms(fullText);

  const target = Math.min(24, Math.max(duration < 240 ? 1 : 2, Math.round(duration / 240)));
  const minLen = Math.max(45, duration / (target * 2.5));
  const cuts = chooseBoundaries(blocks, target, minLen);
  const ranges = [0, ...cuts, blocks.length].slice(0, -1).map((s, i, arr) => [s, i + 1 < arr.length ? arr[i + 1] : blocks.length] as const);

  // Keywords favour terms that recur across the video but are concentrated in parts of it.
  const globalTf = termFreq(tokenize(fullText));
  const minGlobal = duration < 300 ? 2 : 3;
  const globalKeywords = topKeywords(globalTf, weights, 30, globalTf, minGlobal);

  const allSentences: Sentence[] = [];
  const chapters: Chapter[] = ranges.map(([a, b], ci) => {
    const part = blocks.slice(a, b);
    const text = part.map((x) => x.text).join(" ");
    const tf = termFreq(tokenize(text));
    const kws = topKeywords(tf, weights, 5, globalTf, minGlobal);
    const phrase = bestPhrase(text, weights, globalTf, minGlobal);
    const extra = kws.map((k) => forms.get(k) ?? k).find((w) => !phrase?.includes(w));
    const title = phrase
      ? titleCase(extra && phrase.split(" ").length < 3 ? `${phrase} and ${extra}` : phrase)
      : titleCase(kws.slice(0, 2).map((k) => forms.get(k) ?? k).join(" and ") || `Part ${ci + 1}`);

    const sents: Sentence[] = part.flatMap((blk) =>
      sentences(blk.text).map((s) => ({ text: s, start: blk.start, chapter: ci, score: scoreSentence(s, weights) })),
    );
    allSentences.push(...sents);
    const summary = [...sents].sort((x, y) => y.score - x.score).slice(0, 2).sort((x, y) => x.start - y.start).map((s) => tidy(s.text, 32)).join(" ");

    return {
      start: part[0].start,
      end: part.at(-1)!.end,
      title,
      summary: summary || "Short segment with little spoken content.",
      keywords: kws.map((k) => forms.get(k) ?? k),
      importance: "Medium" as Importance,
    };
  });

  // Rank chapters by keyword density plus "this is important" cues; top 30% High, bottom 30% Low.
  const chapterScores = chapters.map((c, i) => {
    const sents = allSentences.filter((s) => s.chapter === i);
    const avg = sents.reduce((n, s) => n + s.score, 0) / Math.max(1, sents.length);
    const text = sents.map((s) => s.text).join(" ");
    const cues = (text.match(CUES)?.length ?? 0) / Math.max(1, text.split(" ").length / 100);
    return avg * (1 + 0.15 * cues);
  });
  const ranked = chapterScores.map((s, i) => ({ s, i })).sort((a, b) => b.s - a.s);
  ranked.forEach(({ i }, rank) => {
    const r = rank / Math.max(1, chapters.length);
    chapters[i].importance = chapters.length < 3 ? "High" : r < 0.3 ? "High" : r < 0.7 ? "Medium" : "Low";
  });

  const best = [...allSentences].sort((a, b) => b.score - a.score);
  const keyPoints = best.slice(0, 8).sort((a, b) => a.start - b.start).map((s) => ({ text: tidy(s.text), timestamp: s.start }));
  const facts = best
    .filter((s) => FACT.test(s.text) && !keyPoints.some((k) => k.timestamp === s.start && k.text === tidy(s.text)))
    .slice(0, 6)
    .sort((a, b) => a.start - b.start)
    .map((s) => ({ text: tidy(s.text), timestamp: s.start }));

  const topTitles = chapters.filter((c) => c.importance === "High").map((c) => c.title).slice(0, 3);
  const notes: VideoNotes = {
    oneLine: `${chapters.length} section${chapters.length > 1 ? "s" : ""} covering ${(topTitles.length ? topTitles : chapters.slice(0, 3).map((c) => c.title)).join(", ")}${chapters.length > 3 ? " and more" : ""}.`,
    keyPoints,
    facts,
    keywords: globalKeywords.slice(0, 12).map((k) => forms.get(k) ?? k),
  };

  const quizCands = best.filter((s) => s.text.split(" ").length >= 8).slice(0, 40);
  const quiz = buildQuiz(quizCands, globalKeywords, forms, weights, videoId);

  return { videoId, title: t.title, author: t.author, lengthSeconds: duration, language: t.language, chapters, notes, quiz };
}
