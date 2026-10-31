/**
 * Lightweight, dependency-free text analysis used by the local AI provider:
 * tokenising, TF-IDF keywords, TextTiling-style topic segmentation and extractive summaries.
 */

const STOPWORDS = new Set(
  (
    "a about above after again against all also am an and any are aren't as at be because been before being below between both but by " +
    "can can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further get gets getting got " +
    "had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've " +
    "if in into is isn't it it's its itself just let's like me more most mustn't my myself no nor not now of off on once only or other ought " +
    "our ours ourselves out over own really right same say said says see shan't she she'd she'll she's should shouldn't so some such than that " +
    "that's the their theirs them themselves then there there's these they they'd they'll they're they've thing things think this those through to too " +
    "um uh under until up us very want was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while " +
    "who who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves yeah okay ok " +
    "going gonna wanna know one two also actually basically just kind lot lots way much many well look let make made makes take takes " +
    "come comes go goes put use used using need needs mean means try tell told give gives given time times something anything everything " +
    "next first last back still even every another around always never may might must shall whatever whether yes hey hi hello guys today " +
    "video videos channel subscribe music applause laughter please thank thanks welcome " +
    // Generic verbs, adjectives and adverbs that make poor keywords
    "hold holds held chose choose chosen feel feels felt happy stick kindly little big giant huge small tiny extremely tight neat nice " +
    "good great bad better best worse worst new old different same certain sure able whole entire simple simply quite rather pretty " +
    "start started starting end ended keep kept call calls called find found show shows showed shown think thought seem seems seemed " +
    "help helps want wanted wants talk talking talked speak spoke ask asked asks read reads write writes wrote work works worked " +
    "happen happens happened change changes changed turn turns turned move moves moved bring brings brought leave left set sets " +
    "mind idea ideas part parts piece pieces point points case cases example examples sort type types bit bits stuff fact facts " +
    "maybe probably perhaps definitely exactly totally completely literally obviously generally usually often sometimes later early " +
    "least less lots plenty enough several various specific particular general real truly true false kind kinds reason reasons " +
    "expect expected imagine remember understand understanding saw seen hear heard watch watching " +
    "person people someone anyone everyone thing's isn't wasn't here's that's what's let lets doing done makes making getting going " +
    "able along already although among anyway away became become becomes either else elsewhere far further hence however instead " +
    "less likely mostly near nearly otherwise per quite since somewhat soon though thus together towards upon via whereas within without " +
    "year years day days minute minutes second seconds hour hours week weeks month months question questions answer answers " +
    "patreon patrons patron sponsor sponsored funding support supporters link description comment comments " +
    // Common Hinglish fillers in Indian lectures
    "hai hain ho hota hoti hote ki ka ke ko se me mein par aur ya to bhi jo yeh ye woh wo kya kaise kyun kyunki agar toh na nahi nhi " +
    "hum aap tum main mai apna apne isko usko iske uske isme usme jab tab ab abhi bahut sab kuch koi ek do teen ji haan acha accha theek thik " +
    "dekho dekhiye samjho chaliye matlab yaha yahan waha wahan wala wali wale gaya gayi gaye raha rahi rahe karna karte karta kar diya liya"
  ).split(/\s+/),
);

export function stem(word: string): string {
  let w = word.toLowerCase();
  if (w.length > 5 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  for (const suf of ["ations", "ation", "ments", "ment", "ings", "ing", "edly", "ed", "es", "s"]) {
    if (w.length - suf.length >= 4 && w.endsWith(suf)) {
      w = w.slice(0, -suf.length);
      break;
    }
  }
  return w;
}

export interface Token {
  stem: string;
  surface: string;
}

/** Content-word tokens (stopwords, numbers-only and very short words removed). */
export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  for (const raw of text.toLowerCase().match(/[a-z][a-z'-]*[a-z]|\d{3,4}/g) ?? []) {
    const w = raw.replace(/^'+|'+$/g, "");
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    out.push({ stem: stem(w), surface: w });
  }
  return out;
}

export type Vec = Map<string, number>;

export function termFreq(tokens: Token[]): Vec {
  const v: Vec = new Map();
  for (const t of tokens) v.set(t.stem, (v.get(t.stem) ?? 0) + 1);
  return v;
}

export function cosine(a: Vec, b: Vec): number {
  let dot = 0, na = 0, nb = 0;
  for (const [k, x] of a) {
    na += x * x;
    const y = b.get(k);
    if (y) dot += x * y;
  }
  for (const y of b.values()) nb += y * y;
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export function addVec(...vs: Vec[]): Vec {
  const out: Vec = new Map();
  for (const v of vs) for (const [k, x] of v) out.set(k, (out.get(k) ?? 0) + x);
  return out;
}

/** Inverse document frequency over a set of "documents" (term-frequency vectors). */
export function idf(docs: Vec[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const d of docs) for (const k of d.keys()) df.set(k, (df.get(k) ?? 0) + 1);
  const n = docs.length;
  const out = new Map<string, number>();
  for (const [k, c] of df) out.set(k, Math.log((n + 1) / (c + 0.5)));
  return out;
}

/**
 * TextTiling: score each gap between blocks by how much lexical similarity "dips" there
 * compared with the peaks on either side. Deep dips are likely topic boundaries.
 */
export function gapDepths(blocks: Vec[], window = 3): number[] {
  const sims: number[] = [];
  for (let g = 1; g < blocks.length; g++) {
    const left = addVec(...blocks.slice(Math.max(0, g - window), g));
    const right = addVec(...blocks.slice(g, g + window));
    sims.push(cosine(left, right));
  }
  return sims.map((s, i) => {
    let lp = s, rp = s;
    for (let j = i - 1; j >= 0 && sims[j] >= lp; j--) lp = sims[j];
    for (let j = i + 1; j < sims.length && sims[j] >= rp; j++) rp = sims[j];
    return lp - s + (rp - s);
  });
}

/** Splits caption text into sentence-like units. Auto captions have no punctuation, so fall back to ~22-word chunks. */
export function sentences(text: string): string[] {
  const clean = text.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  const punct = clean.split(/(?<=[.!?।])\s+/).filter((s) => s.split(" ").length >= 4);
  if (punct.length >= Math.max(2, clean.split(" ").length / 60)) return punct.flatMap((s) => chunkWords(s, 40));
  return chunkWords(clean, 22);
}

function chunkWords(s: string, max: number): string[] {
  const words = s.split(" ");
  if (words.length <= max) return [s];
  const out: string[] = [];
  for (let i = 0; i < words.length; i += max) {
    const part = words.slice(i, i + max);
    if (part.length >= 6 || !out.length) out.push(part.join(" "));
    else out[out.length - 1] += " " + part.join(" ");
  }
  return out;
}

export function capitalize(s: string): string {
  const t = s.trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}

export function titleCase(s: string): string {
  const small = new Set(["of", "and", "the", "in", "on", "to", "for", "a", "an", "vs", "by"]);
  return s
    .split(" ")
    .map((w, i) => (i > 0 && small.has(w) ? w : w.length <= 3 && /^[a-z]+$/.test(w) && !/[aeiou]/.test(w) ? w.toUpperCase() : capitalize(w)))
    .join(" ");
}

/** Deterministic PRNG so the same transcript always yields the same quiz. */
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
