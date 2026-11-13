import { DIFFICULTIES } from "./difficulty";
import type { Difficulty, MCQ } from "./types";
import { shuffle } from "./nlp";

/**
 * Template-based Quant question generators. Every question is computed, so answers are
 * always correct and practice never runs out. Each topic has one template per difficulty
 * tier, from a direct formula (easy) to a two-step or inverse problem (very hard).
 * Every template also writes the question and explanation in Hindi, with the same numbers.
 */

type Rand = () => number;
type Gen = (id: string, r: Rand) => MCQ;
/** Hindi text for a generated question. `options` maps an English option to its Hindi, for options that are words. */
interface Hi {
  q: string;
  e: string;
  options?: Record<string, string>;
}
const pick = <T,>(arr: readonly T[], r: Rand) => arr[Math.floor(r() * arr.length)];
/** A tier with several templates: each question picks one at random. */
const either = (...gens: Gen[]): Gen => (id, r) => pick(gens, r)(id, r);
const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2).replace(/\.?0+$/, ""));
/** 7, 95 → "7⁹⁵". */
const sup = (n: number) => String(n).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);

/** Hindi for the word units that follow numeric options; symbols such as ₹ and % need none. */
const UNIT_HI: Record<string, string> = {
  days: "दिन",
  years: "वर्ष",
  hours: "घंटे",
  minutes: "मिनट",
  seconds: "सेकंड",
  litres: "लीटर",
  "km/h": "किमी/घंटा",
  "m/s": "मी/से",
  m: "मीटर",
  "m²": "वर्ग मीटर",
  cm: "सेमी",
  "cm²": "वर्ग सेमी",
  "cm³": "घन सेमी",
  units: "इकाई",
  "sq units": "वर्ग इकाई",
  lakh: "लाख",
};
/** Hindi for a unit used inside question text: "cm" → "सेमी". */
const unitHi = (u: string) => UNIT_HI[u];

/** Builds a numeric MCQ with plausible near-miss distractors. */
function numeric(id: string, topicId: string, difficulty: Difficulty, question: string, answer: number, explanation: string, hi: Hi, r: Rand, unit = "", suffix = ""): MCQ {
  // Very hard questions get near misses (within ±15%), so rough estimation cannot rule options out.
  const steps = difficulty === "very-hard" ? [0.9, 0.95, 1.05, 1.1, 0.92, 1.08, 0.85, 1.15, 0.8, 1.2] : [0.8, 0.9, 1.1, 1.2, 1.25, 0.75, 1.5, 0.5];
  const set = new Set<number>([answer]);
  for (const s of shuffle(steps, r)) {
    if (set.size === 4) break;
    const v = Number.isInteger(answer) ? Math.round(answer * s) : Math.round(answer * s * 100) / 100;
    if (v > 0 && v !== answer) set.add(v);
  }
  let k = 1;
  while (set.size < 4) set.add(answer + k++ * Math.max(1, Math.round(answer / 10)));
  const options = shuffle([...set], r);
  let optionsHi: string[] | undefined;
  if (/[A-Za-z]/.test(suffix)) {
    const word = UNIT_HI[suffix.trim()];
    if (!word) throw new Error(`No Hindi for the unit "${suffix.trim()}"`);
    optionsHi = options.map((o) => `${unit}${fmt(o)} ${word}`);
  }
  return {
    id,
    topicId,
    difficulty,
    question,
    options: options.map((o) => `${unit}${fmt(o)}${suffix}`),
    answer: options.indexOf(answer),
    explanation,
    questionHi: hi.q,
    explanationHi: hi.e,
    ...(optionsHi && { optionsHi }),
  };
}

/** Builds an MCQ whose answer is text (a ratio, say) from the right answer and candidate distractors. */
function choice(id: string, topicId: string, difficulty: Difficulty, question: string, answer: string, distractors: string[], explanation: string, hi: Hi, r: Rand): MCQ {
  const wrong = [...new Set(distractors)].filter((d) => d !== answer).slice(0, 3);
  const options = shuffle([answer, ...wrong], r);
  const map = hi.options;
  return {
    id,
    topicId,
    difficulty,
    question,
    options,
    answer: options.indexOf(answer),
    explanation,
    questionHi: hi.q,
    explanationHi: hi.e,
    ...(map && { optionsHi: options.map((o) => map[o] ?? o) }),
  };
}

/** a : b in lowest terms. */
const ratio = (a: number, b: number) => {
  const g = gcd(a, b);
  return `${a / g} : ${b / g}`;
};

const GENERATORS: Record<string, Record<Difficulty, Gen>> = {
  "quant-percentage": {
    easy: (id, r) => {
      const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 60, 75], r);
      const n = pick([40, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600, 800, 1200], r);
      const ans = (p * n) / 100;
      if (!Number.isInteger(ans)) return GENERATORS["quant-percentage"].easy(id, r);
      return numeric(
        id, "quant-percentage", "easy",
        `What is ${p}% of ${fmt(n)}?`,
        ans,
        `${p}% of ${fmt(n)} = ${p} × ${fmt(n)} ÷ 100 = ${fmt(ans)}.`,
        { q: `${fmt(n)} का ${p}% कितना है?`, e: `${fmt(n)} का ${p}% = ${p} × ${fmt(n)} ÷ 100 = ${fmt(ans)}।` },
        r,
      );
    },
    moderate: (id, r) => {
      const n = pick([200, 250, 400, 500, 800, 1200, 1500, 2000], r);
      const p = pick([5, 8, 12, 15, 18, 24, 30, 35, 45, 60], r);
      const part = (p * n) / 100;
      if (!Number.isInteger(part)) return GENERATORS["quant-percentage"].moderate(id, r);
      return numeric(
        id, "quant-percentage", "moderate",
        `What percent of ${fmt(n)} is ${fmt(part)}?`,
        p,
        `Required % = ${fmt(part)} ÷ ${fmt(n)} × 100 = ${p}%.`,
        { q: `${fmt(part)}, ${fmt(n)} का कितना प्रतिशत है?`, e: `अभीष्ट प्रतिशत = ${fmt(part)} ÷ ${fmt(n)} × 100 = ${p}%।` },
        r, "", "%",
      );
    },
    hard: either((id, r) => {
      // Successive change: net = a − b − ab/100.
      const [a, b] = pick([[20, 10], [25, 10], [30, 20], [10, 20], [20, 25], [40, 25], [50, 20], [15, 10]], r);
      const net = a - b - (a * b) / 100;
      const up = net > 0;
      const ans = Math.abs(net);
      return numeric(
        id, "quant-percentage", "hard",
        `The price of an article is first increased by ${a}% and then decreased by ${b}%. What is the net percentage ${up ? "increase" : "decrease"} in its price?`,
        ans,
        `Net change = a − b − ab/100 = ${a} − ${b} − ${a}×${b}/100 = ${fmt(net)}%, i.e. a ${fmt(ans)}% ${up ? "increase" : "decrease"}.`,
        {
          q: `किसी वस्तु का मूल्य पहले ${a}% बढ़ाया जाता है और फिर ${b}% घटाया जाता है। मूल्य में शुद्ध प्रतिशत ${up ? "वृद्धि" : "कमी"} कितनी है?`,
          e: `शुद्ध परिवर्तन = a − b − ab/100 = ${a} − ${b} − ${a}×${b}/100 = ${fmt(net)}%, अर्थात् ${fmt(ans)}% की ${up ? "वृद्धि" : "कमी"}।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      const pop = pick([10000, 20000, 40000, 50000, 80000], r);
      const rate = pick([5, 10, 20], r);
      const ans = (pop * (100 + rate) * (100 + rate)) / 10000;
      const factor = (((100 + rate) / 100) ** 2).toFixed(4).replace(/0+$/, "");
      return numeric(
        id, "quant-percentage", "hard",
        `The population of a town is ${fmt(pop)} and grows by ${rate}% every year. What will it be after 2 years?`,
        ans,
        `After 2 years = ${fmt(pop)} × (${100 + rate}/100)² = ${fmt(pop)} × ${factor} = ${fmt(ans)}.`,
        {
          q: `एक कस्बे की जनसंख्या ${fmt(pop)} है और यह प्रति वर्ष ${rate}% की दर से बढ़ती है। 2 वर्ष बाद जनसंख्या कितनी होगी?`,
          e: `2 वर्ष बाद जनसंख्या = ${fmt(pop)} × (${100 + rate}/100)² = ${fmt(pop)} × ${factor} = ${fmt(ans)}।`,
        },
        r,
      );
    }),
    "very-hard": either((id, r) => {
      // Three successive changes, worked backwards: original = final ÷ (product of the three factors).
      const [x, y, z] = pick([[20, 25, 10], [25, 20, 50], [10, 20, 25], [50, 20, 25], [20, 10, 25], [40, 25, 20], [25, 40, 20], [10, 25, 20]], r);
      const orig = pick([800, 1200, 1600, 2000, 2400, 3200, 4000, 4800, 6000], r);
      const fin = (orig * (100 + x) * (100 - y) * (100 + z)) / 1e6;
      if (!Number.isInteger(fin)) return GENERATORS["quant-percentage"]["very-hard"](id, r);
      return numeric(
        id, "quant-percentage", "very-hard",
        `A number is first increased by ${x}%, then decreased by ${y}%, and then increased by ${z}%. If the final number is ${fmt(fin)}, what was the original number?`,
        orig,
        `Original × ${100 + x}/100 × ${100 - y}/100 × ${100 + z}/100 = ${fmt(fin)}, so original = ${fmt(fin)} × 100 × 100 × 100 ÷ (${100 + x} × ${100 - y} × ${100 + z}) = ${fmt(orig)}.`,
        {
          q: `एक संख्या में पहले ${x}% की वृद्धि, फिर ${y}% की कमी और फिर ${z}% की वृद्धि की जाती है। यदि अंतिम संख्या ${fmt(fin)} है, तो मूल संख्या क्या थी?`,
          e: `मूल संख्या × ${100 + x}/100 × ${100 - y}/100 × ${100 + z}/100 = ${fmt(fin)}, अतः मूल संख्या = ${fmt(fin)} × 100 × 100 × 100 ÷ (${100 + x} × ${100 - y} × ${100 + z}) = ${fmt(orig)}।`,
        },
        r,
      );
    }, (id, r) => {
      const [x, ans] = pick([[25, 20], [100, 50], [150, 60], [400, 80], [50, 33.33], [20, 16.67]], r);
      const income = r() < 0.5;
      const q = income
        ? `A’s income is ${x}% more than B’s. By what percent is B’s income less than A’s?`
        : `The price of sugar rises by ${x}%. By what percent must a family cut its consumption so that its expenditure stays the same?`;
      const qHi = income
        ? `A की आय B की आय से ${x}% अधिक है। B की आय A की आय से कितने प्रतिशत कम है?`
        : `चीनी के मूल्य में ${x}% की वृद्धि हो जाती है। एक परिवार को अपनी खपत में कितने प्रतिशत की कमी करनी चाहिए ताकि उसका व्यय पहले जितना ही रहे?`;
      return numeric(
        id, "quant-percentage", "very-hard", q, ans,
        `Required % = x ÷ (100 + x) × 100 = ${x} ÷ ${100 + x} × 100 = ${fmt(ans)}%.`,
        { q: qHi, e: `अभीष्ट प्रतिशत = x ÷ (100 + x) × 100 = ${x} ÷ ${100 + x} × 100 = ${fmt(ans)}%।` },
        r, "", "%",
      );
    }, (id, r) => {
      // Pass/fail overlap: passed in both = 100 − (x + y − z)%.
      const [x, y, z] = pick([[30, 35, 15], [25, 40, 20], [20, 30, 10], [35, 25, 20], [40, 30, 20], [32, 28, 12]], r);
      const pass = 100 - (x + y - z);
      const total = pick([400, 500, 800, 1000, 1200, 1500], r);
      const passed = (pass * total) / 100;
      if (!Number.isInteger(passed)) return GENERATORS["quant-percentage"]["very-hard"](id, r);
      return numeric(
        id, "quant-percentage", "very-hard",
        `In an exam, ${x}% of the candidates failed in Hindi, ${y}% failed in English and ${z}% failed in both. If ${fmt(passed)} candidates passed in both subjects, how many candidates appeared?`,
        total,
        `Failed in at least one = ${x} + ${y} − ${z} = ${x + y - z}%, so passed in both = ${pass}%. Total = ${fmt(passed)} × 100 ÷ ${pass} = ${fmt(total)}.`,
        {
          q: `एक परीक्षा में ${x}% परीक्षार्थी हिंदी में, ${y}% अंग्रेज़ी में और ${z}% दोनों विषयों में अनुत्तीर्ण हुए। यदि ${fmt(passed)} परीक्षार्थी दोनों विषयों में उत्तीर्ण हुए, तो कुल कितने परीक्षार्थी परीक्षा में बैठे?`,
          e: `कम से कम एक विषय में अनुत्तीर्ण = ${x} + ${y} − ${z} = ${x + y - z}%, अतः दोनों विषयों में उत्तीर्ण = ${pass}%। कुल परीक्षार्थी = ${fmt(passed)} × 100 ÷ ${pass} = ${fmt(total)}।`,
        },
        r,
      );
    }, (id, r) => {
      // x% of A = y% of B ⇒ A : B = y : x (the trap: the bigger percent belongs to the smaller number).
      const [x, y] = pick([[20, 30], [25, 40], [30, 45], [40, 60], [15, 25], [12, 18], [35, 50], [50, 75], [24, 36], [45, 30], [60, 40], [75, 25]], r);
      const k = pick([20, 25, 40, 50, 100], r);
      const [A, B] = [y * k, x * k];
      const S = A + B;
      const gg = gcd(x, y);
      return numeric(
        id, "quant-percentage", "very-hard",
        `${x}% of A is equal to ${y}% of B. If A + B = ${fmt(S)}, what is the value of A?`,
        A,
        `${x}% × A = ${y}% × B ⇒ A : B = ${y} : ${x} = ${y / gg} : ${x / gg}. A = ${fmt(S)} × ${y / gg}/${(x + y) / gg} = ${fmt(A)}.`,
        {
          q: `A का ${x}%, B के ${y}% के बराबर है। यदि A + B = ${fmt(S)} है, तो A का मान क्या है?`,
          e: `${x}% × A = ${y}% × B ⇒ A : B = ${y} : ${x} = ${y / gg} : ${x / gg}। A = ${fmt(S)} × ${y / gg}/${(x + y) / gg} = ${fmt(A)}।`,
        },
        r,
      );
    }),
  },

  "quant-profit-loss": {
    easy: (id, r) => {
      const cp = pick([200, 250, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500], r);
      const pct = pick([5, 10, 12, 15, 20, 25, 30, 40], r);
      const profit = r() < 0.6;
      const sp = (cp * (100 + (profit ? pct : -pct))) / 100;
      if (!Number.isInteger(sp)) return GENERATORS["quant-profit-loss"].easy(id, r);
      const word = profit ? "profit" : "loss";
      return numeric(
        id, "quant-profit-loss", "easy",
        `An article costs ₹${fmt(cp)}. At what price must it be sold to make a ${word} of ${pct}%?`,
        sp,
        `SP = CP × (100 ${profit ? "+" : "−"} ${pct}) ÷ 100 = ${fmt(cp)} × ${100 + (profit ? pct : -pct)} ÷ 100 = ₹${fmt(sp)}.`,
        {
          q: `एक वस्तु का क्रय मूल्य ₹${fmt(cp)} है। ${pct}% ${profit ? "लाभ" : "हानि"} प्राप्त करने के लिए उसे किस मूल्य पर बेचना चाहिए?`,
          e: `विक्रय मूल्य = क्रय मूल्य × (100 ${profit ? "+" : "−"} ${pct}) ÷ 100 = ${fmt(cp)} × ${100 + (profit ? pct : -pct)} ÷ 100 = ₹${fmt(sp)}।`,
        },
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const cp = pick([200, 400, 500, 800, 1000, 1200, 1600, 2000, 2500, 4000], r);
      const pct = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 50], r);
      const profit = r() < 0.6;
      const sp = (cp * (100 + (profit ? pct : -pct))) / 100;
      if (!Number.isInteger(sp)) return GENERATORS["quant-profit-loss"].moderate(id, r);
      const word = profit ? "profit" : "loss";
      const wordHi = profit ? "लाभ" : "हानि";
      return numeric(
        id, "quant-profit-loss", "moderate",
        `An article bought for ₹${fmt(cp)} is sold for ₹${fmt(sp)}. What is the ${word} percentage?`,
        pct,
        `${profit ? "Profit" : "Loss"} = ₹${fmt(Math.abs(sp - cp))}; ${word} % = ${fmt(Math.abs(sp - cp))} ÷ ${fmt(cp)} × 100 = ${pct}%.`,
        {
          q: `₹${fmt(cp)} में खरीदी गई एक वस्तु ₹${fmt(sp)} में बेची जाती है। ${wordHi} प्रतिशत कितना है?`,
          e: `${wordHi} = ₹${fmt(Math.abs(sp - cp))}; ${wordHi} % = ${fmt(Math.abs(sp - cp))} ÷ ${fmt(cp)} × 100 = ${pct}%।`,
        },
        r, "", "%",
      );
    },
    hard: either((id, r) => {
      // Dishonest dealer: false weight plus a markup on cost.
      const [g, x, ans] = pick([[800, 20, 50], [900, 8, 20], [960, 20, 25], [800, 10, 37.5], [750, 5, 40], [900, 0, 11.11], [950, 14, 20]], r);
      return numeric(
        id, "quant-profit-loss", "hard",
        x
          ? `A dealer uses a weight of ${g} g instead of 1 kg and also sells at ${x}% above the cost price. What is his total gain percentage?`
          : `A dishonest dealer claims to sell at cost price but uses a weight of ${g} g instead of 1 kg. What is his gain percentage?`,
        ans,
        `He gives ${g} g but charges for 1,000 g${x ? ` plus ${x}%` : ""}. Gain % = (1000/${g}${x ? ` × ${(100 + x) / 100}` : ""} − 1) × 100 = ${fmt(ans)}%.`,
        {
          q: x
            ? `एक व्यापारी 1 किग्रा के स्थान पर ${g} ग्राम के बाट का प्रयोग करता है और साथ ही क्रय मूल्य से ${x}% अधिक मूल्य पर बेचता है। उसका कुल लाभ प्रतिशत कितना है?`
            : `एक बेईमान व्यापारी क्रय मूल्य पर ही बेचने का दावा करता है, परंतु 1 किग्रा के स्थान पर ${g} ग्राम के बाट का प्रयोग करता है। उसका लाभ प्रतिशत कितना है?`,
          e: `वह ${g} ग्राम देता है परंतु 1,000 ग्राम का मूल्य लेता है${x ? `, वह भी ${x}% अधिक` : ""}। लाभ % = (1000/${g}${x ? ` × ${(100 + x) / 100}` : ""} − 1) × 100 = ${fmt(ans)}%।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      const [mark, disc] = pick([[50, 20], [40, 25], [60, 25], [25, 12], [100, 40], [30, 10], [50, 10], [20, 10], [75, 20]], r);
      const ans = Math.round(((100 + mark) * (100 - disc)) / 100 - 100);
      const sp = fmt(((100 + mark) * (100 - disc)) / 100);
      return numeric(
        id, "quant-profit-loss", "hard",
        `A shopkeeper marks an article ${mark}% above its cost price and then allows a discount of ${disc}%. What is his profit percentage?`,
        ans,
        `Take CP = 100. Marked price = ${100 + mark}; SP after ${disc}% discount = ${100 + mark} × ${100 - disc} ÷ 100 = ${sp}. Profit = ${ans}%.`,
        {
          q: `एक दुकानदार किसी वस्तु पर क्रय मूल्य से ${mark}% अधिक मूल्य अंकित करता है और फिर ${disc}% की छूट देता है। उसका लाभ प्रतिशत कितना है?`,
          e: `माना क्रय मूल्य = 100। अंकित मूल्य = ${100 + mark}; ${disc}% छूट के बाद विक्रय मूल्य = ${100 + mark} × ${100 - disc} ÷ 100 = ${sp}। लाभ = ${ans}%।`,
        },
        r, "", "%",
      );
    }),
    "very-hard": either((id, r) => {
      // Two scenarios: SP₁ = CP(100 + x)/100; SP₂ = CP(100 − y)(100 + w)/10⁴; SP₁ − SP₂ = Z.
      const [x, y, w] = pick([[20, 20, 30], [10, 10, 20], [25, 20, 25], [20, 10, 30], [10, 20, 25], [30, 20, 50], [25, 10, 25], [20, 20, 40]], r);
      const cp = pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000], r);
      const k = (100 + x) * 100 - (100 - y) * (100 + w);
      const less = (cp * k) / 1e4;
      if (k <= 0 || !Number.isInteger(less)) return GENERATORS["quant-profit-loss"]["very-hard"](id, r);
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `A man bought an article and sold it at a gain of ${x}%. Had he bought it at ${y}% less and sold it for ₹${fmt(less)} less, he would have gained ${w}%. What is the cost price of the article?`,
        cp,
        `Let CP = ₹100. First SP = ₹${100 + x}. New CP = ₹${100 - y}, new SP = ${100 - y} × ${100 + w}/100 = ₹${fmt(((100 - y) * (100 + w)) / 100)}. Difference = ${100 + x} − ${fmt(((100 - y) * (100 + w)) / 100)} = ₹${fmt(k / 100)} for every ₹100 of CP, so CP = ${fmt(less)} × 100 ÷ ${fmt(k / 100)} = ₹${fmt(cp)}.`,
        {
          q: `एक व्यक्ति ने एक वस्तु खरीदी और उसे ${x}% लाभ पर बेच दिया। यदि उसने उसे ${y}% कम में खरीदा होता और ₹${fmt(less)} कम में बेचा होता, तो उसे ${w}% लाभ होता। वस्तु का क्रय मूल्य क्या है?`,
          e: `मान लीजिए क्रय मूल्य = ₹100। पहला विक्रय मूल्य = ₹${100 + x}। नया क्रय मूल्य = ₹${100 - y}, नया विक्रय मूल्य = ${100 - y} × ${100 + w}/100 = ₹${fmt(((100 - y) * (100 + w)) / 100)}। अंतर = ${100 + x} − ${fmt(((100 - y) * (100 + w)) / 100)} = प्रति ₹100 क्रय मूल्य पर ₹${fmt(k / 100)}, अतः क्रय मूल्य = ${fmt(less)} × 100 ÷ ${fmt(k / 100)} = ₹${fmt(cp)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      // Mark-up needed so that a discount still leaves a target profit.
      const [d, g, ans] = pick([[20, 20, 50], [25, 20, 60], [10, 8, 20], [20, 4, 30], [25, 5, 40], [16, 26, 50], [10, 17, 30]], r);
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `A shopkeeper wants to gain ${g}% even after allowing a discount of ${d}%. By what percentage above the cost price must he mark his goods?`,
        ans,
        `MP × (100 − ${d})/100 = CP × (100 + ${g})/100, so MP/CP = ${100 + g}/${100 - d} = ${fmt((100 + g) / (100 - d))}. Mark-up = ${ans}%.`,
        {
          q: `एक दुकानदार ${d}% की छूट देने के बाद भी ${g}% लाभ कमाना चाहता है। उसे अपनी वस्तुओं पर क्रय मूल्य से कितने प्रतिशत अधिक मूल्य अंकित करना चाहिए?`,
          e: `अंकित मूल्य × (100 − ${d})/100 = क्रय मूल्य × (100 + ${g})/100, अतः अंकित मूल्य/क्रय मूल्य = ${100 + g}/${100 - d} = ${fmt((100 + g) / (100 - d))}। अतः अंकित मूल्य क्रय मूल्य से ${ans}% अधिक होना चाहिए।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      if (r() < 0.5) {
        const x = pick([10, 20, 25, 30, 40, 50], r);
        const ans = (x * x) / 100;
        const sp = pick([1200, 2400, 3000, 4800, 6000], r);
        return numeric(
          id, "quant-profit-loss", "very-hard",
          `A man sells two articles for ₹${fmt(sp)} each, gaining ${x}% on one and losing ${x}% on the other. What is his overall loss percentage?`,
          ans,
          `When two articles sell at the same price with equal gain and loss %, there is always a loss of x²/100 % = ${x}² ÷ 100 = ${fmt(ans)}%.`,
          {
            q: `एक व्यक्ति दो वस्तुएँ ₹${fmt(sp)} प्रत्येक में बेचता है। एक पर उसे ${x}% लाभ और दूसरी पर ${x}% हानि होती है। उसकी कुल हानि प्रतिशत कितनी है?`,
            e: `जब दो वस्तुएँ समान मूल्य पर बेची जाएँ और लाभ व हानि का प्रतिशत समान हो, तो सदैव x²/100 % की हानि होती है = ${x}² ÷ 100 = ${fmt(ans)}%।`,
          },
          r, "", "%",
        );
      }
      const [n, g] = pick([[10, 2], [12, 4], [15, 5], [20, 4], [12, 2], [25, 5], [11, 1], [30, 10], [6, 1], [16, 4]], r);
      const ans = (g * 100) / (n - g);
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `By selling ${n} articles, a trader gains the selling price of ${g} articles. What is his profit percentage?`,
        ans,
        `CP of ${n} articles = SP of ${n - g} articles. Profit % = ${g} ÷ ${n - g} × 100 = ${fmt(ans)}%.`,
        {
          q: `${n} वस्तुएँ बेचने पर एक व्यापारी को ${g} वस्तुओं के विक्रय मूल्य के बराबर लाभ होता है। उसका लाभ प्रतिशत कितना है?`,
          e: `${n} वस्तुओं का क्रय मूल्य = ${n - g} वस्तुओं का विक्रय मूल्य। लाभ % = ${g} ÷ ${n - g} × 100 = ${fmt(ans)}%।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      // Three tricks at once: mark-up, discount and a false weight.
      const [w, x, d, ans] = pick([[900, 20, 10, 20], [800, 20, 10, 35], [960, 25, 4, 25], [800, 30, 20, 30], [900, 35, 20, 20], [950, 40, 5, 40], [750, 20, 10, 44], [900, 40, 10, 40], [800, 25, 12, 37.5], [800, 40, 25, 31.25]], r);
      const sp = ((100 + x) * (100 - d)) / 100;
      const cp = w / 10;
      return numeric(
        id, "quant-profit-loss", "very-hard",
        `A dishonest dealer marks his goods ${x}% above the cost price, allows a discount of ${d}% and also uses a weight of ${w} g in place of 1 kg. What is his overall gain percentage?`,
        ans,
        `Take CP of 1 kg = ₹100. SP = ${100 + x} × ${100 - d}/100 = ₹${fmt(sp)}, but he gives only ${w} g, whose CP is ₹${fmt(cp)}. Gain % = (${fmt(sp)} − ${fmt(cp)}) ÷ ${fmt(cp)} × 100 = ${fmt(ans)}%.`,
        {
          q: `एक बेईमान व्यापारी अपनी वस्तुओं पर क्रय मूल्य से ${x}% अधिक मूल्य अंकित करता है, ${d}% की छूट देता है और 1 किग्रा के स्थान पर ${w} ग्राम के बाट का प्रयोग करता है। उसका कुल लाभ प्रतिशत कितना है?`,
          e: `माना 1 किग्रा का क्रय मूल्य = ₹100। विक्रय मूल्य = ${100 + x} × ${100 - d}/100 = ₹${fmt(sp)}, परंतु वह केवल ${w} ग्राम देता है, जिसका क्रय मूल्य ₹${fmt(cp)} है। लाभ % = (${fmt(sp)} − ${fmt(cp)}) ÷ ${fmt(cp)} × 100 = ${fmt(ans)}%।`,
        },
        r, "", "%",
      );
    }),
  },

  "quant-simple-interest": {
    easy: (id, r) => {
      const p = pick([1000, 2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000, 15000], r);
      const rate = pick([4, 5, 6, 8, 10, 12, 15], r);
      const t = pick([2, 3, 4, 5, 6], r);
      const si = (p * rate * t) / 100;
      return numeric(
        id, "quant-simple-interest", "easy",
        `Find the simple interest on ₹${fmt(p)} at ${rate}% per annum for ${t} years.`,
        si,
        `SI = P × R × T ÷ 100 = ${fmt(p)} × ${rate} × ${t} ÷ 100 = ₹${fmt(si)}.`,
        {
          q: `₹${fmt(p)} पर ${rate}% वार्षिक दर से ${t} वर्ष का साधारण ब्याज ज्ञात कीजिए।`,
          e: `साधारण ब्याज = मूलधन × दर × समय ÷ 100 = ${fmt(p)} × ${rate} × ${t} ÷ 100 = ₹${fmt(si)}।`,
        },
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const p = pick([2000, 2500, 4000, 5000, 8000, 10000, 12000], r);
      const rate = pick([4, 5, 6, 8, 10, 12], r);
      const t = pick([2, 3, 4, 5], r);
      const si = (p * rate * t) / 100;
      return numeric(
        id, "quant-simple-interest", "moderate",
        `A sum of ₹${fmt(p)} earns ₹${fmt(si)} as simple interest in ${t} years. What is the rate of interest per annum?`,
        rate,
        `R = SI × 100 ÷ (P × T) = ${fmt(si)} × 100 ÷ (${fmt(p)} × ${t}) = ${rate}%.`,
        {
          q: `₹${fmt(p)} की राशि पर ${t} वर्ष में ₹${fmt(si)} साधारण ब्याज मिलता है। वार्षिक ब्याज दर क्या है?`,
          e: `दर = साधारण ब्याज × 100 ÷ (मूलधन × समय) = ${fmt(si)} × 100 ÷ (${fmt(p)} × ${t}) = ${rate}%।`,
        },
        r, "", "%",
      );
    },
    hard: either((id, r) => {
      // A sum split between two rates (alligation).
      const [r1, r2] = pick([[8, 12], [5, 10], [6, 9], [10, 15], [4, 8]], r);
      const p = pick([10000, 12000, 15000, 20000, 24000], r);
      const x = pick([0.25, 0.4, 0.5, 0.6, 0.75], r) * p;
      const yearly = (x * r1 + (p - x) * r2) / 100;
      if (!Number.isInteger(yearly)) return GENERATORS["quant-simple-interest"].hard(id, r);
      const all = fmt((p * r2) / 100);
      const short = fmt((p * r2) / 100 - yearly);
      return numeric(
        id, "quant-simple-interest", "hard",
        `₹${fmt(p)} is lent in two parts, one at ${r1}% and the other at ${r2}% simple interest per annum. The total yearly interest is ₹${fmt(yearly)}. How much was lent at ${r1}%?`,
        x,
        `If all were at ${r2}%, interest would be ₹${all}. The shortfall ₹${short} comes from the ${r2 - r1}% gap on the ${r1}% part: ${short} × 100 ÷ ${r2 - r1} = ₹${fmt(x)}.`,
        {
          q: `₹${fmt(p)} को दो भागों में उधार दिया जाता है, एक भाग ${r1}% और दूसरा ${r2}% वार्षिक साधारण ब्याज पर। कुल वार्षिक ब्याज ₹${fmt(yearly)} है। ${r1}% पर कितनी राशि उधार दी गई?`,
          e: `यदि पूरी राशि ${r2}% पर होती, तो ब्याज ₹${all} होता। ₹${short} की यह कमी ${r1}% वाले भाग पर ${r2 - r1}% कम दर के कारण है: ${short} × 100 ÷ ${r2 - r1} = ₹${fmt(x)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      const t = pick([4, 5, 6, 8, 10, 12, 15, 20], r);
      const [times, word, wordHi] = pick([[3, "triple", "तिगुनी"], [4, "become four times", "चार गुनी"]] as const, r);
      const ans = t * (times - 1);
      return numeric(
        id, "quant-simple-interest", "hard",
        `A sum of money doubles itself in ${t} years at simple interest. In how many years will it ${word}?`,
        ans,
        `Doubling means SI = P in ${t} years, so SI grows by P every ${t} years. To ${word}, SI must be ${times - 1}P, which takes ${times - 1} × ${t} = ${ans} years.`,
        {
          q: `कोई धनराशि साधारण ब्याज पर ${t} वर्ष में दोगुनी हो जाती है। कितने वर्ष में यह ${wordHi} हो जाएगी?`,
          e: `दोगुनी होने का अर्थ है कि ${t} वर्ष में साधारण ब्याज = मूलधन, अर्थात् हर ${t} वर्ष में ब्याज मूलधन के बराबर बढ़ता है। ${wordHi} होने के लिए ब्याज ${times - 1} × मूलधन होना चाहिए, जिसमें ${times - 1} × ${t} = ${ans} वर्ष लगेंगे।`,
        },
        r, "", " years",
      );
    }),
    "very-hard": either((id, r) => {
      // Rate equal to time: R² = 100 × SI/P.
      const [rate, frac] = pick([[4, "4/25"], [5, "1/4"], [6, "9/25"], [8, "16/25"], [10, "1"], [12, "36/25"]] as const, r);
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `The simple interest on a sum is ${frac === "1" ? "equal to the sum" : `${frac} of the sum`}, and the rate per annum equals the number of years. What is the rate?`,
        rate,
        `SI/P = R × T/100 with R = T, so R² = 100 × ${frac} = ${rate * rate}, giving R = ${rate}%.`,
        {
          q: `किसी राशि पर साधारण ब्याज ${frac === "1" ? "मूलधन के बराबर" : `मूलधन का ${frac}`} है, और वार्षिक ब्याज दर वर्षों की संख्या के बराबर है। ब्याज दर क्या है?`,
          e: `साधारण ब्याज/मूलधन = दर × समय/100, जहाँ दर = समय, अतः दर² = 100 × ${frac} = ${rate * rate}, अर्थात् दर = ${rate}%।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      // A higher rate fetches more interest.
      const p = pick([2000, 2500, 4000, 5000, 6000, 8000], r);
      const k = pick([1, 2, 3], r);
      const t = pick([2, 3, 4, 5], r);
      const more = (p * k * t) / 100;
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `Had a sum been lent at ${k}% higher simple interest, it would have fetched ₹${fmt(more)} more in ${t} years. What is the sum?`,
        p,
        `The extra interest comes only from the extra ${k}%: P × ${k} × ${t} ÷ 100 = ${fmt(more)}, so P = ${fmt(more)} × 100 ÷ ${k * t} = ₹${fmt(p)}.`,
        {
          q: `यदि कोई राशि ${k}% अधिक साधारण ब्याज दर पर उधार दी जाती, तो ${t} वर्ष में ₹${fmt(more)} अधिक ब्याज मिलता। राशि क्या है?`,
          e: `अतिरिक्त ब्याज केवल अतिरिक्त ${k}% दर से आता है: मूलधन × ${k} × ${t} ÷ 100 = ${fmt(more)}, अतः मूलधन = ${fmt(more)} × 100 ÷ ${k * t} = ₹${fmt(p)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      const p = pick([2000, 4000, 5000, 6000, 8000, 10000], r);
      const rate = pick([5, 8, 10, 12], r);
      const t1 = pick([2, 3], r);
      const t2 = t1 + pick([2, 3, 4], r);
      const a1 = p + (p * rate * t1) / 100;
      const a2 = p + (p * rate * t2) / 100;
      const perYear = fmt((a2 - a1) / (t2 - t1));
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `At simple interest, a sum amounts to ₹${fmt(a1)} in ${t1} years and to ₹${fmt(a2)} in ${t2} years. What is the sum?`,
        p,
        `Interest for ${t2 - t1} years = ${fmt(a2)} − ${fmt(a1)} = ₹${fmt(a2 - a1)}, so interest per year = ₹${perYear}. Sum = ${fmt(a1)} − ${t1} × ${perYear} = ₹${fmt(p)}.`,
        {
          q: `साधारण ब्याज पर कोई राशि ${t1} वर्ष में ₹${fmt(a1)} और ${t2} वर्ष में ₹${fmt(a2)} हो जाती है। मूलधन क्या है?`,
          e: `${t2 - t1} वर्ष का ब्याज = ${fmt(a2)} − ${fmt(a1)} = ₹${fmt(a2 - a1)}, अतः एक वर्ष का ब्याज = ₹${perYear}। मूलधन = ${fmt(a1)} − ${t1} × ${perYear} = ₹${fmt(p)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      // Two parts earning equal SI: P1 × r1 × t1 = P2 × r2 × t2, so P1 : P2 = r2t2 : r1t1.
      const [r1, t1, r2, t2] = pick([[10, 5, 9, 6], [8, 3, 12, 5], [5, 4, 10, 3], [8, 5, 10, 3], [4, 6, 9, 2], [10, 4, 6, 5], [12, 5, 8, 6], [5, 6, 9, 4], [10, 3, 8, 5], [6, 4, 10, 3]], r);
      const [p1, p2] = [r1 * t1, r2 * t2];
      const gg = gcd(p1, p2);
      const [a, b] = [p2 / gg, p1 / gg];
      const k = pick([200, 300, 500, 1000], r);
      const S = (a + b) * k;
      const ans = a * k;
      return numeric(
        id, "quant-simple-interest", "very-hard",
        `A sum of ₹${fmt(S)} is lent in two parts: the first at ${r1}% per annum for ${t1} years and the second at ${r2}% per annum for ${t2} years. If both parts earn equal simple interest, what is the first part?`,
        ans,
        `Equal interest: P₁ × ${r1} × ${t1} = P₂ × ${r2} × ${t2}, so P₁ : P₂ = ${p2} : ${p1} = ${a} : ${b}. First part = ${fmt(S)} × ${a}/${a + b} = ₹${fmt(ans)}.`,
        {
          q: `₹${fmt(S)} की राशि दो भागों में उधार दी जाती है: पहला भाग ${r1}% वार्षिक दर पर ${t1} वर्ष के लिए और दूसरा ${r2}% वार्षिक दर पर ${t2} वर्ष के लिए। यदि दोनों भागों पर साधारण ब्याज बराबर मिलता है, तो पहला भाग कितना है?`,
          e: `ब्याज बराबर है: P₁ × ${r1} × ${t1} = P₂ × ${r2} × ${t2}, अतः P₁ : P₂ = ${p2} : ${p1} = ${a} : ${b}। पहला भाग = ${fmt(S)} × ${a}/${a + b} = ₹${fmt(ans)}।`,
        },
        r, "₹",
      );
    }),
  },

  "quant-time-work": {
    easy: (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [12, 6], [20, 5], [30, 60], [18, 9], [24, 8], [21, 42], [15, 10], [40, 60]], r);
      const t = (a * b) / (a + b);
      return numeric(
        id, "quant-time-work", "easy",
        `A can finish a piece of work in ${a} days and B can finish it in ${b} days. In how many days can they finish it together?`,
        t,
        `Together they finish in (${a} × ${b}) ÷ (${a} + ${b}) = ${a * b} ÷ ${a + b} = ${fmt(t)} days.`,
        {
          q: `A किसी काम को ${a} दिन में और B उसे ${b} दिन में पूरा कर सकता है। दोनों मिलकर उसे कितने दिन में पूरा करेंगे?`,
          e: `मिलकर लगने वाला समय = (${a} × ${b}) ÷ (${a} + ${b}) = ${a * b} ÷ ${a + b} = ${fmt(t)} दिन।`,
        },
        r, "", " days",
      );
    },
    moderate: (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [30, 60], [15, 10], [40, 60], [21, 42], [24, 8], [18, 9], [20, 5], [12, 6]], r);
      const t = (a * b) / (a + b);
      return numeric(
        id, "quant-time-work", "moderate",
        `A alone can do a piece of work in ${a} days. A and B together can do it in ${fmt(t)} days. In how many days can B alone do it?`,
        b,
        `B’s one-day work = 1/${fmt(t)} − 1/${a} = 1/${b}, so B alone takes ${b} days.`,
        {
          q: `A अकेले किसी काम को ${a} दिन में कर सकता है। A और B मिलकर उसे ${fmt(t)} दिन में कर सकते हैं। B अकेले उसे कितने दिन में करेगा?`,
          e: `B का एक दिन का काम = 1/${fmt(t)} − 1/${a} = 1/${b}, अतः B अकेले ${b} दिन लेगा।`,
        },
        r, "", " days",
      );
    },
    hard: either((id, r) => {
      // Men × days × hours stays constant for the same work.
      const [m1, d1, h1, m2, h2] = pick([[12, 18, 8, 16, 9], [15, 20, 6, 10, 9], [20, 12, 9, 24, 6], [8, 24, 6, 12, 8], [18, 10, 8, 12, 6], [25, 12, 8, 20, 10]], r);
      const ans = (m1 * d1 * h1) / (m2 * h2);
      return numeric(
        id, "quant-time-work", "hard",
        `${m1} men working ${h1} hours a day can finish a job in ${d1} days. In how many days will ${m2} men working ${h2} hours a day finish it?`,
        ans,
        `M₁D₁H₁ = M₂D₂H₂: ${m1} × ${d1} × ${h1} = ${m2} × D × ${h2}, so D = ${m1 * d1 * h1} ÷ ${m2 * h2} = ${fmt(ans)} days.`,
        {
          q: `${m1} पुरुष प्रतिदिन ${h1} घंटे काम करके एक काम ${d1} दिन में पूरा कर सकते हैं। ${m2} पुरुष प्रतिदिन ${h2} घंटे काम करके उसे कितने दिन में पूरा करेंगे?`,
          e: `M₁D₁H₁ = M₂D₂H₂: ${m1} × ${d1} × ${h1} = ${m2} × D × ${h2}, अतः D = ${m1 * d1 * h1} ÷ ${m2 * h2} = ${fmt(ans)} दिन।`,
        },
        r, "", " days",
      );
    }, (id, r) => {
      const [a, b] = pick([[10, 15], [12, 24], [20, 30], [6, 12], [30, 60], [40, 60], [21, 42], [15, 10]], r);
      const k = pick([1, 2, 3, 4, 5], r);
      const ans = b * (1 - k / a - k / b);
      if (ans <= 0 || !Number.isInteger(ans)) return GENERATORS["quant-time-work"].hard(id, r);
      const done = fmt((k * (a + b)) / (a * b));
      const left = fmt(1 - (k * (a + b)) / (a * b));
      return numeric(
        id, "quant-time-work", "hard",
        `A can do a work in ${a} days and B in ${b} days. They start together, but A leaves after ${k} day${k > 1 ? "s" : ""}. In how many more days will B finish the remaining work?`,
        ans,
        `In ${k} day${k > 1 ? "s" : ""} they do ${k} × (1/${a} + 1/${b}) = ${done} of the work. Remaining = ${left}, which B alone does in ${left} × ${b} = ${ans} days.`,
        {
          q: `A किसी काम को ${a} दिन में और B उसे ${b} दिन में कर सकता है। दोनों साथ मिलकर काम शुरू करते हैं, परंतु A ${k} दिन बाद काम छोड़ देता है। B शेष काम को और कितने दिन में पूरा करेगा?`,
          e: `${k} दिन में वे ${k} × (1/${a} + 1/${b}) = ${done} भाग काम करते हैं। शेष काम = ${left}, जिसे B अकेले ${left} × ${b} = ${ans} दिन में पूरा करेगा।`,
        },
        r, "", " days",
      );
    }),
    "very-hard": either((id, r) => {
      // Pipes: A and B fill, C empties; after t hours C is shut, and A + B finish the rest.
      const [a, b, c, t] = pick([[10, 15, 30, 5], [6, 12, 8, 4], [20, 30, 60, 5], [15, 20, 60, 3], [8, 12, 24, 1], [12, 16, 48, 1]], r);
      const filled = t * (1 / a + 1 / b - 1 / c);
      const ans = Math.round(((1 - filled) / (1 / a + 1 / b)) * 1e6) / 1e6;
      if (!Number.isInteger(ans) || ans <= 0) return GENERATORS["quant-time-work"]["very-hard"](id, r);
      const L = (a * b * c) / gcd(gcd(a, b), c);
      const net = L / a + L / b - L / c;
      return numeric(
        id, "quant-time-work", "very-hard",
        `Pipe A can fill a tank in ${a} hours and pipe B in ${b} hours, while pipe C can empty it in ${c} hours. All three are opened together, and after ${t} hour${t > 1 ? "s" : ""} pipe C is closed. In how many more hours will the tank be full?`,
        ans,
        `Take the tank as ${fmt(L)} units: A fills ${fmt(L / a)}, B ${fmt(L / b)} and C empties ${fmt(L / c)} per hour, so all three together fill ${fmt(net)} per hour. In ${t} hour${t > 1 ? "s" : ""}: ${fmt(net * t)} units; ${fmt(L - net * t)} remain. A + B fill ${fmt(L / a + L / b)} per hour, so ${fmt(L - net * t)} ÷ ${fmt(L / a + L / b)} = ${fmt(ans)} hours more.`,
        {
          q: `पाइप A एक टंकी को ${a} घंटे में और पाइप B ${b} घंटे में भर सकता है, जबकि पाइप C उसे ${c} घंटे में खाली कर सकता है। तीनों पाइप एक साथ खोले जाते हैं और ${t} घंटे बाद पाइप C बंद कर दिया जाता है। टंकी को पूरा भरने में और कितने घंटे लगेंगे?`,
          e: `टंकी को ${fmt(L)} इकाई मानें: A प्रति घंटे ${fmt(L / a)}, B ${fmt(L / b)} भरता है और C ${fmt(L / c)} खाली करता है, अतः तीनों मिलकर प्रति घंटे ${fmt(net)} इकाई भरते हैं। ${t} घंटे में: ${fmt(net * t)} इकाई; ${fmt(L - net * t)} शेष। A + B प्रति घंटे ${fmt(L / a + L / b)} भरते हैं, अतः ${fmt(L - net * t)} ÷ ${fmt(L / a + L / b)} = ${fmt(ans)} घंटे और।`,
        },
        r, "", " hours",
      );
    }, (id, r) => {
      // Pairwise rates: A+B, B+C, C+A given; find one person alone.
      const [a, b, c] = pick([[20, 30, 60], [30, 60, 20], [40, 60, 120], [15, 30, 30], [6, 12, 12], [60, 20, 30]], r);
      const pair = (x: number, y: number) => (x * y) / (x + y);
      const [ab, bc, ca] = [pair(a, b), pair(b, c), pair(c, a)];
      if (![ab, bc, ca].every(Number.isInteger)) return GENERATORS["quant-time-work"]["very-hard"](id, r);
      const who = pick(["A", "C"], r);
      const ans = who === "A" ? a : c;
      const all = pair(pair(a, b), c);
      const rest = who === "A" ? "B+C" : "A+B";
      return numeric(
        id, "quant-time-work", "very-hard",
        `A and B together can finish a work in ${ab} days, B and C in ${bc} days, and C and A in ${ca} days. In how many days can ${who} alone finish it?`,
        ans,
        `Adding the three pairs gives twice the work of A+B+C per day: 2(A+B+C) = 1/${ab} + 1/${bc} + 1/${ca}, so A+B+C does 1/${all} per day. ${who} alone = (A+B+C) − (${rest}) = 1/${ans}, i.e. ${ans} days.`,
        {
          q: `A और B मिलकर किसी काम को ${ab} दिन में, B और C ${bc} दिन में, तथा C और A ${ca} दिन में पूरा कर सकते हैं। ${who} अकेले उसे कितने दिन में पूरा करेगा?`,
          e: `तीनों युग्मों का एक दिन का काम जोड़ने पर: 2(A+B+C) = 1/${ab} + 1/${bc} + 1/${ca}, अतः A+B+C एक दिन में 1/${all} काम करते हैं। ${who} अकेले = (A+B+C) − (${rest}) = 1/${ans}, अर्थात् ${ans} दिन।`,
        },
        r, "", " days",
      );
    }, (id, r) => {
      const [a, b, c, ans] = pick([[6, 12, 8, 8], [12, 18, 36, 9], [20, 30, 60, 15], [8, 12, 24, 6], [15, 20, 30, 12], [6, 8, 24, 4]], r);
      const lcm = [a, b, c].reduce((x, y) => (x * y) / gcd(x, y));
      const net = lcm / a + lcm / b - lcm / c;
      return numeric(
        id, "quant-time-work", "very-hard",
        `Pipe A can fill a tank in ${a} hours and pipe B in ${b} hours, while pipe C can empty it in ${c} hours. If all three are opened together, in how many hours will the tank be full?`,
        ans,
        `Take the tank as ${lcm} units. A fills ${lcm / a}/h, B fills ${lcm / b}/h, C empties ${lcm / c}/h: net ${net} units/h. Time = ${lcm} ÷ ${net} = ${ans} hours.`,
        {
          q: `नल A एक टंकी को ${a} घंटे में और नल B ${b} घंटे में भर सकता है, जबकि नल C उसे ${c} घंटे में खाली कर सकता है। यदि तीनों नल एक साथ खोल दिए जाएँ, तो टंकी कितने घंटे में भर जाएगी?`,
          e: `माना टंकी की क्षमता = ${lcm} इकाई। A प्रति घंटा ${lcm / a} इकाई भरता है, B ${lcm / b} इकाई भरता है और C ${lcm / c} इकाई खाली करता है: शुद्ध ${net} इकाई प्रति घंटा। समय = ${lcm} ÷ ${net} = ${ans} घंटे।`,
        },
        r, "", " hours",
      );
    }, (id, r) => {
      // One worker k times as efficient as the other.
      const [k, t] = pick([[2, 18], [3, 12], [2, 12], [4, 20], [3, 24], [2, 24]], r);
      const askA = r() < 0.5;
      const ans = askA ? (t * (k + 1)) / k : t * (k + 1);
      const units = (k + 1) * t;
      return numeric(
        id, "quant-time-work", "very-hard",
        `A is ${k === 2 ? "twice" : `${k} times`} as efficient as B, and together they finish a work in ${t} days. In how many days can ${askA ? "A" : "B"} alone finish it?`,
        ans,
        `If B does 1 unit a day, A does ${k}; together ${k + 1} units a day for ${t} days = ${units} units. ${askA ? `A alone = ${units} ÷ ${k}` : `B alone = ${units} ÷ 1`} = ${fmt(ans)} days.`,
        {
          q: `A, B से ${k === 2 ? "दोगुना" : `${k} गुना`} कुशल है, और दोनों मिलकर एक काम ${t} दिन में पूरा करते हैं। ${askA ? "A" : "B"} अकेले उसे कितने दिन में पूरा करेगा?`,
          e: `यदि B एक दिन में 1 इकाई काम करता है, तो A ${k} इकाई करता है; मिलकर प्रतिदिन ${k + 1} इकाई, अतः ${t} दिन में कुल काम = ${units} इकाई। ${askA ? `A अकेले = ${units} ÷ ${k}` : `B अकेले = ${units} ÷ 1`} = ${fmt(ans)} दिन।`,
        },
        r, "", " days",
      );
    }, (id, r) => {
      // A works alone for a third of his time, then B joins: back out B's rate from the finishing time.
      const [a, b] = pick([[18, 9], [15, 10], [30, 20], [36, 12], [36, 18], [18, 36], [45, 30], [27, 54], [24, 24], [30, 30]], r);
      const n = a / 3;
      const m = (2 * a * b) / (3 * (a + b));
      if (!Number.isInteger(m)) return GENERATORS["quant-time-work"]["very-hard"](id, r);
      const lcm = (a * b) / gcd(a, b);
      const left = lcm - n * (lcm / a);
      return numeric(
        id, "quant-time-work", "very-hard",
        `A can complete a work in ${a} days. He works alone for ${n} days, after which B joins him and the two finish the remaining work in ${m} days. In how many days can B alone complete the whole work?`,
        b,
        `Take the work as ${lcm} units: A does ${lcm / a}/day, so after ${n} days ${left} units remain. In ${m} days A and B do ${left} units, i.e. ${left / m}/day together; B = ${left / m} − ${lcm / a} = ${lcm / b}/day, so B alone takes ${lcm} ÷ ${lcm / b} = ${b} days.`,
        {
          q: `A किसी काम को ${a} दिन में पूरा कर सकता है। वह ${n} दिन अकेले काम करता है, फिर B उसके साथ जुड़ जाता है और दोनों मिलकर शेष काम ${m} दिन में पूरा कर देते हैं। B अकेले पूरे काम को कितने दिन में कर सकता है?`,
          e: `माना कुल काम = ${lcm} इकाई: A प्रतिदिन ${lcm / a} इकाई करता है, अतः ${n} दिन बाद ${left} इकाई शेष रहती है। ${m} दिन में A और B ${left} इकाई करते हैं, अर्थात् मिलकर ${left / m} इकाई/दिन; B = ${left / m} − ${lcm / a} = ${lcm / b} इकाई/दिन, अतः B अकेले ${lcm} ÷ ${lcm / b} = ${b} दिन लेगा।`,
        },
        r, "", " days",
      );
    }),
  },

  "quant-average": {
    easy: (id, r) => {
      const count = pick([4, 5, 6], r);
      const avg = pick([12, 15, 18, 20, 24, 25, 30, 36, 40, 45], r);
      const nums = Array.from({ length: count - 1 }, () => avg + Math.round((r() - 0.5) * avg));
      nums.push(avg * count - nums.reduce((s, n) => s + n, 0));
      if (nums.some((n) => n <= 0)) return GENERATORS["quant-average"].easy(id, r);
      return numeric(
        id, "quant-average", "easy",
        `What is the average of ${nums.slice(0, -1).join(", ")} and ${nums.at(-1)}?`,
        avg,
        `Sum = ${nums.join(" + ")} = ${avg * count}; average = ${avg * count} ÷ ${count} = ${avg}.`,
        {
          q: `${nums.slice(0, -1).join(", ")} और ${nums.at(-1)} का औसत क्या है?`,
          e: `योग = ${nums.join(" + ")} = ${avg * count}; औसत = ${avg * count} ÷ ${count} = ${avg}।`,
        },
        r,
      );
    },
    moderate: (id, r) => {
      const n = pick([5, 6, 8, 10], r);
      const avg = pick([20, 24, 30, 36, 40, 50], r);
      const newAvg = avg - pick([1, 2, 3, 4], r);
      const ans = n * avg - (n - 1) * newAvg;
      return numeric(
        id, "quant-average", "moderate",
        `The average of ${n} numbers is ${avg}. If one number is removed, the average of the remaining numbers becomes ${newAvg}. What is the removed number?`,
        ans,
        `Removed number = (${n} × ${avg}) − (${n - 1} × ${newAvg}) = ${n * avg} − ${(n - 1) * newAvg} = ${ans}.`,
        {
          q: `${n} संख्याओं का औसत ${avg} है। यदि एक संख्या हटा दी जाए, तो शेष संख्याओं का औसत ${newAvg} हो जाता है। हटाई गई संख्या क्या है?`,
          e: `हटाई गई संख्या = (${n} × ${avg}) − (${n - 1} × ${newAvg}) = ${n * avg} − ${(n - 1) * newAvg} = ${ans}।`,
        },
        r,
      );
    },
    hard: either((id, r) => {
      // Average speed over equal distances is the harmonic mean, not the plain average.
      const [x, y] = pick([[40, 60], [30, 60], [60, 90], [20, 30], [45, 90], [36, 45], [60, 40]], r);
      const ans = (2 * x * y) / (x + y);
      return numeric(
        id, "quant-average", "hard",
        `A car goes from town P to town Q at ${x} km/h and returns along the same road at ${y} km/h. What is its average speed for the whole journey?`,
        ans,
        `For equal distances, average speed = 2xy ÷ (x + y) = 2 × ${x} × ${y} ÷ ${x + y} = ${fmt(ans)} km/h (not ${fmt((x + y) / 2)}).`,
        {
          q: `एक कार नगर P से नगर Q तक ${x} किमी/घंटा की चाल से जाती है और उसी मार्ग से ${y} किमी/घंटा की चाल से वापस लौटती है। पूरी यात्रा में उसकी औसत चाल क्या है?`,
          e: `समान दूरी के लिए औसत चाल = 2xy ÷ (x + y) = 2 × ${x} × ${y} ÷ ${x + y} = ${fmt(ans)} किमी/घंटा (न कि ${fmt((x + y) / 2)})।`,
        },
        r, "", " km/h",
      );
    }, (id, r) => {
      const n = pick([20, 24, 29, 30, 35, 39], r);
      const avg = pick([12, 14, 15, 16], r);
      const d = pick([1, 2], r);
      const ans = avg + (n + 1) * d;
      return numeric(
        id, "quant-average", "hard",
        `The average age of ${n} students in a class is ${avg} years. When the teacher’s age is included, the average rises by ${d} year${d > 1 ? "s" : ""}. What is the teacher’s age?`,
        ans,
        `New average = ${avg + d} for ${n + 1} people. Teacher’s age = ${n + 1} × ${avg + d} − ${n} × ${avg} = ${(n + 1) * (avg + d)} − ${n * avg} = ${ans} years.`,
        {
          q: `एक कक्षा के ${n} विद्यार्थियों की औसत आयु ${avg} वर्ष है। शिक्षक की आयु को शामिल करने पर औसत ${d} वर्ष बढ़ जाता है। शिक्षक की आयु कितनी है?`,
          e: `${n + 1} व्यक्तियों का नया औसत = ${avg + d}। शिक्षक की आयु = ${n + 1} × ${avg + d} − ${n} × ${avg} = ${(n + 1) * (avg + d)} − ${n * avg} = ${ans} वर्ष।`,
        },
        r, "", " years",
      );
    }),
    "very-hard": either((id, r) => {
      // Batsman's innings: one score lifts the average by d.
      const n = pick([10, 11, 15, 16, 19, 20], r);
      const d = pick([2, 3, 4], r);
      const newAvg = pick([32, 36, 40, 45, 48, 52], r);
      const score = newAvg + n * d;
      return numeric(
        id, "quant-average", "very-hard",
        `A batsman scores ${score} runs in his ${ordinal(n + 1)} innings and thereby raises his average by ${d}. What is his average after the ${ordinal(n + 1)} innings?`,
        newAvg,
        `Let the new average be A. Then ${n}(A − ${d}) + ${score} = ${n + 1}A, so A = ${score} − ${n} × ${d} = ${newAvg}.`,
        {
          q: `एक बल्लेबाज़ अपनी ${n + 1}वीं पारी में ${score} रन बनाता है और इससे उसका औसत ${d} बढ़ जाता है। ${n + 1}वीं पारी के बाद उसका औसत क्या है?`,
          e: `माना नया औसत A है। तब ${n}(A − ${d}) + ${score} = ${n + 1}A, अतः A = ${score} − ${n} × ${d} = ${newAvg}।`,
        },
        r,
      );
    }, (id, r) => {
      const m = pick([5, 6, 7], r);
      const n = 2 * m - 1;
      const all = pick([40, 50, 60], r);
      const first = all - pick([1, 2, 3], r);
      const last = all + pick([1, 2, 4], r);
      const ans = m * first + m * last - n * all;
      if (ans <= 0) return GENERATORS["quant-average"]["very-hard"](id, r);
      return numeric(
        id, "quant-average", "very-hard",
        `The average of ${n} results is ${all}. The average of the first ${m} results is ${first} and that of the last ${m} is ${last}. What is the ${ordinal(m)} result?`,
        ans,
        `The ${ordinal(m)} result is counted in both groups: ${m} × ${first} + ${m} × ${last} − ${n} × ${all} = ${m * first} + ${m * last} − ${n * all} = ${ans}.`,
        {
          q: `${n} परिणामों का औसत ${all} है। पहले ${m} परिणामों का औसत ${first} और अंतिम ${m} परिणामों का औसत ${last} है। ${m}वाँ परिणाम क्या है?`,
          e: `${m}वाँ परिणाम दोनों समूहों में गिना गया है: ${m} × ${first} + ${m} × ${last} − ${n} × ${all} = ${m * first} + ${m * last} − ${n * all} = ${ans}।`,
        },
        r,
      );
    }, (id, r) => {
      // A misread entry: the correct average moves by (correct − wrong)/n.
      const n = pick([10, 20, 25, 30, 40, 50], r);
      const avg = pick([36, 42, 45, 48, 54, 60, 65, 72], r);
      const wrong = pick([27, 36, 48, 52, 63, 65, 73, 84, 91], r);
      const k = pick([-2, -1, 1, 2], r);
      const correct = wrong + n * k;
      if (correct < 10 || correct > 99 || avg + k <= 0) return GENERATORS["quant-average"]["very-hard"](id, r);
      const high = wrong > correct;
      const diff = Math.abs(wrong - correct);
      return numeric(
        id, "quant-average", "very-hard",
        `The average of ${n} numbers was calculated as ${avg}. It was later found that one number had been read as ${wrong} instead of ${correct}. What is the correct average?`,
        avg + k,
        `The total was taken ${diff} too ${high ? "high" : "low"} (${high ? `${wrong} − ${correct}` : `${correct} − ${wrong}`} = ${diff}), so the average was ${diff} ÷ ${n} = ${Math.abs(k)} too ${high ? "high" : "low"}. Correct average = ${avg} ${high ? "−" : "+"} ${Math.abs(k)} = ${avg + k}.`,
        {
          q: `${n} संख्याओं का औसत ${avg} निकाला गया। बाद में पता चला कि एक संख्या को ${correct} के स्थान पर ${wrong} पढ़ लिया गया था। सही औसत क्या है?`,
          e: `योग ${diff} ${high ? "अधिक" : "कम"} लिया गया (${high ? `${wrong} − ${correct}` : `${correct} − ${wrong}`} = ${diff}), अतः औसत ${diff} ÷ ${n} = ${Math.abs(k)} ${high ? "अधिक" : "कम"} आया। सही औसत = ${avg} ${high ? "−" : "+"} ${Math.abs(k)} = ${avg + k}।`,
        },
        r,
      );
    }),
  },

  "quant-ratio": {
    easy: (id, r) => {
      const [a, b] = pick([[2, 3], [3, 5], [4, 5], [5, 7], [3, 7], [1, 4], [2, 5], [7, 8]], r);
      const k = pick([20, 25, 40, 50, 100, 120], r);
      const larger = r() < 0.5;
      const ans = (larger ? b : a) * k;
      const who = larger ? "B" : "A";
      return numeric(
        id, "quant-ratio", "easy",
        `₹${fmt((a + b) * k)} is divided between A and B in the ratio ${a} : ${b}. What is ${who}’s share?`,
        ans,
        `Total parts = ${a} + ${b} = ${a + b}; one part = ${fmt((a + b) * k)} ÷ ${a + b} = ${k}. ${who} gets ${larger ? b : a} × ${k} = ₹${fmt(ans)}.`,
        {
          q: `₹${fmt((a + b) * k)} को A और B में ${a} : ${b} के अनुपात में बाँटा जाता है। ${who} का हिस्सा कितना है?`,
          e: `कुल भाग = ${a} + ${b} = ${a + b}; एक भाग = ${fmt((a + b) * k)} ÷ ${a + b} = ${k}। ${who} को ${larger ? b : a} × ${k} = ₹${fmt(ans)} मिलते हैं।`,
        },
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const [a, b] = pick([[2, 3], [3, 4], [4, 5], [5, 6], [2, 5], [3, 7]], r);
      const [c, d] = pick([[4, 5], [2, 3], [5, 7], [3, 4], [6, 7], [3, 8]], r);
      const ans = ratio(a * c, b * d);
      return choice(
        id, "quant-ratio", "moderate",
        `If A : B = ${a} : ${b} and B : C = ${c} : ${d}, what is A : C?`,
        ans,
        [ratio(a * d, b * c), ratio(b * d, a * c), ratio(a, d), ratio(a * c, d), ratio(a + c, b + d)],
        `A : C = (A/B) × (B/C) = (${a}/${b}) × (${c}/${d}) = ${a * c}/${b * d} = ${ans}.`,
        {
          q: `यदि A : B = ${a} : ${b} और B : C = ${c} : ${d} है, तो A : C क्या है?`,
          e: `A : C = (A/B) × (B/C) = (${a}/${b}) × (${c}/${d}) = ${a * c}/${b * d} = ${ans}।`,
        },
        r,
      );
    },
    hard: (id, r) => {
      const [a, b] = pick([[3, 5], [2, 3], [4, 7], [5, 8], [3, 4], [5, 9]], r);
      const k = pick([4, 5, 6, 8, 10, 12], r);
      const x = pick([2, 4, 5, 6, 8, 10], r);
      const g = gcd(a * k + x, b * k + x);
      const [c, d] = [(a * k + x) / g, (b * k + x) / g];
      return numeric(
        id, "quant-ratio", "hard",
        `Two numbers are in the ratio ${a} : ${b}. If ${x} is added to each, the ratio becomes ${c} : ${d}. What is the smaller number?`,
        a * k,
        `Let the numbers be ${a}k and ${b}k. (${a}k + ${x}) ÷ (${b}k + ${x}) = ${c}/${d} gives k = ${k}, so the smaller number is ${a} × ${k} = ${a * k}.`,
        {
          q: `दो संख्याएँ ${a} : ${b} के अनुपात में हैं। यदि प्रत्येक में ${x} जोड़ दिया जाए, तो अनुपात ${c} : ${d} हो जाता है। छोटी संख्या क्या है?`,
          e: `माना संख्याएँ ${a}k और ${b}k हैं। (${a}k + ${x}) ÷ (${b}k + ${x}) = ${c}/${d} से k = ${k}, अतः छोटी संख्या = ${a} × ${k} = ${a * k}।`,
        },
        r,
      );
    },
    "very-hard": either((id, r) => {
      // Repeated draw-and-replace: milk left = P × (1 − x/P)^n.
      const [p, x, n] = pick([[80, 8, 2], [40, 4, 2], [100, 10, 3], [50, 10, 2], [60, 6, 2], [125, 25, 3]], r);
      const ans = Math.round(p * (1 - x / p) ** n * 100) / 100;
      return numeric(
        id, "quant-ratio", "very-hard",
        `A vessel holds ${p} litres of pure milk. ${x} litres are taken out and replaced with water, and this is done ${n === 2 ? "twice" : "three times"} in all. How much milk is left in the vessel?`,
        ans,
        `Each round keeps ${p - x}/${p} of the milk, so milk left = ${p} × (${p - x}/${p})^${n} = ${fmt(ans)} litres.`,
        {
          q: `एक बर्तन में ${p} लीटर शुद्ध दूध है। इसमें से ${x} लीटर दूध निकालकर उतना ही पानी मिला दिया जाता है, और यह प्रक्रिया कुल ${n === 2 ? "दो" : "तीन"} बार की जाती है। बर्तन में कितना दूध शेष है?`,
          e: `हर बार दूध का ${p - x}/${p} भाग बचता है, अतः शेष दूध = ${p} × (${p - x}/${p})^${n} = ${fmt(ans)} लीटर।`,
        },
        r, "", " litres",
      );
    }, (id, r) => {
      const [t, m, w, m2, w2] = pick([[60, 2, 1, 1, 2], [40, 3, 1, 1, 1], [80, 3, 1, 2, 1], [90, 7, 2, 7, 3], [45, 4, 1, 3, 2], [100, 4, 1, 2, 1]], r);
      const milk = (t * m) / (m + w);
      const water = t - milk;
      const need = (milk * w2) / m2;
      const ans = need - water;
      return numeric(
        id, "quant-ratio", "very-hard",
        `A ${t}-litre mixture has milk and water in the ratio ${m} : ${w}. How much water must be added to make the ratio ${m2} : ${w2}?`,
        ans,
        `Milk = ${milk} L and water = ${water} L. Milk stays the same, so water needed = ${milk} × ${w2}/${m2} = ${need} L. Add ${need} − ${water} = ${ans} L.`,
        {
          q: `${t} लीटर के एक मिश्रण में दूध और पानी का अनुपात ${m} : ${w} है। अनुपात ${m2} : ${w2} करने के लिए इसमें कितना पानी मिलाना होगा?`,
          e: `दूध = ${milk} लीटर और पानी = ${water} लीटर। दूध की मात्रा नहीं बदलती, अतः आवश्यक पानी = ${milk} × ${w2}/${m2} = ${need} लीटर। मिलाना होगा ${need} − ${water} = ${ans} लीटर।`,
        },
        r, "", " litres",
      );
    }, (id, r) => {
      // Partnership: profit shares are in the ratio of capital × time.
      const caps = shuffle([10000, 12000, 15000, 16000, 18000, 20000, 24000, 25000, 30000, 36000, 40000], r).slice(0, 3);
      const months = [pick([6, 8, 9, 10, 12], r), pick([4, 6, 8, 9, 10, 12], r), pick([4, 6, 8, 9, 10, 12], r)];
      const prod = caps.map((c, i) => c * months[i]);
      const gg = prod.reduce(gcd);
      const parts = prod.map((p) => p / gg);
      const sum = parts.reduce((x, y) => x + y);
      if (sum > 30 || new Set(parts).size < 3 || new Set(months).size < 2) return GENERATORS["quant-ratio"]["very-hard"](id, r);
      const P = sum * pick([300, 500, 700, 1000, 1500], r);
      const who = Math.floor(r() * 3);
      const name = "ABC"[who];
      const ans = (P * parts[who]) / sum;
      return numeric(
        id, "quant-ratio", "very-hard",
        `A, B and C invest ₹${fmt(caps[0])}, ₹${fmt(caps[1])} and ₹${fmt(caps[2])} in a business for ${months[0]}, ${months[1]} and ${months[2]} months respectively. If the total profit is ₹${fmt(P)}, what is ${name}’s share?`,
        ans,
        `Profit is shared in the ratio of capital × time: ${caps.map((c, i) => `${fmt(c)} × ${months[i]}`).join(" : ")} = ${parts.join(" : ")}. ${name}’s share = ${fmt(P)} × ${parts[who]}/${sum} = ₹${fmt(ans)}.`,
        {
          q: `A, B और C एक व्यापार में क्रमशः ₹${fmt(caps[0])}, ₹${fmt(caps[1])} और ₹${fmt(caps[2])} क्रमशः ${months[0]}, ${months[1]} और ${months[2]} महीनों के लिए लगाते हैं। यदि कुल लाभ ₹${fmt(P)} है, तो ${name} का हिस्सा कितना है?`,
          e: `लाभ पूँजी × समय के अनुपात में बँटता है: ${caps.map((c, i) => `${fmt(c)} × ${months[i]}`).join(" : ")} = ${parts.join(" : ")}। ${name} का हिस्सा = ${fmt(P)} × ${parts[who]}/${sum} = ₹${fmt(ans)}।`,
        },
        r, "₹",
      );
    }),
  },

  "quant-tsd": {
    easy: (id, r) => {
      const kmh = pick([18, 36, 54, 72, 90, 108, 126, 144], r);
      const ms = (kmh * 5) / 18;
      return numeric(
        id, "quant-tsd", "easy",
        `Convert ${kmh} km/h into metres per second.`,
        ms,
        `Multiply by 5/18: ${kmh} × 5/18 = ${ms} m/s.`,
        { q: `${kmh} किमी/घंटा को मीटर/सेकंड में बदलिए।`, e: `5/18 से गुणा करें: ${kmh} × 5/18 = ${ms} मी/से।` },
        r, "", " m/s",
      );
    },
    moderate: (id, r) => {
      const kmh = pick([36, 54, 72, 90, 108], r);
      const v = (kmh * 5) / 18;
      const t = pick([6, 8, 9, 10, 12, 15, 18], r);
      return numeric(
        id, "quant-tsd", "moderate",
        `A train ${v * t} m long runs at ${kmh} km/h. How long does it take to pass a pole?`,
        t,
        `${kmh} km/h = ${v} m/s. To pass a pole the train covers its own length: ${v * t} ÷ ${v} = ${t} seconds.`,
        {
          q: `${v * t} मीटर लंबी एक रेलगाड़ी ${kmh} किमी/घंटा की चाल से चल रही है। वह एक खंभे को पार करने में कितना समय लेगी?`,
          e: `${kmh} किमी/घंटा = ${v} मी/से। खंभे को पार करने में रेलगाड़ी अपनी लंबाई के बराबर दूरी तय करती है: ${v * t} ÷ ${v} = ${t} सेकंड।`,
        },
        r, "", " seconds",
      );
    },
    hard: either((id, r) => {
      const v = pick([10, 15, 20, 25, 30], r);
      const t = pick([12, 15, 18, 20, 24, 30], r);
      const len = pick([100, 120, 150, 180, 200, 240], r);
      const plat = v * t - len;
      if (plat < 60) return GENERATORS["quant-tsd"].hard(id, r);
      return numeric(
        id, "quant-tsd", "hard",
        `A train ${len} m long crosses a ${plat} m long platform in ${t} seconds. What is its speed?`,
        v * 3.6,
        `Distance = train + platform = ${len} + ${plat} = ${v * t} m. Speed = ${v * t} ÷ ${t} = ${v} m/s = ${v} × 18/5 = ${fmt(v * 3.6)} km/h.`,
        {
          q: `${len} मीटर लंबी एक रेलगाड़ी ${plat} मीटर लंबे प्लेटफ़ॉर्म को ${t} सेकंड में पार करती है। रेलगाड़ी की चाल क्या है?`,
          e: `दूरी = रेलगाड़ी की लंबाई + प्लेटफ़ॉर्म की लंबाई = ${len} + ${plat} = ${v * t} मीटर। चाल = ${v * t} ÷ ${t} = ${v} मी/से = ${v} × 18/5 = ${fmt(v * 3.6)} किमी/घंटा।`,
        },
        r, "", " km/h",
      );
    }, (id, r) => {
      const [s1, s2] = pick([[40, 50], [45, 63], [36, 54], [60, 48], [72, 54], [30, 42]], r);
      const rel = ((s1 + s2) * 5) / 18;
      const t = pick([6, 8, 9, 10, 12, 15], r);
      const total = rel * t;
      const l1 = Math.round((total * pick([0.4, 0.5, 0.6], r)) / 10) * 10;
      if (!Number.isInteger(rel) || l1 <= 0 || l1 >= total) return GENERATORS["quant-tsd"].hard(id, r);
      return numeric(
        id, "quant-tsd", "hard",
        `Two trains, ${l1} m and ${total - l1} m long, run on parallel tracks in opposite directions at ${s1} km/h and ${s2} km/h. How long do they take to cross each other?`,
        t,
        `Relative speed = ${s1} + ${s2} = ${s1 + s2} km/h = ${rel} m/s. Distance = ${l1} + ${total - l1} = ${total} m. Time = ${total} ÷ ${rel} = ${t} seconds.`,
        {
          q: `${l1} मीटर और ${total - l1} मीटर लंबी दो रेलगाड़ियाँ समानांतर पटरियों पर विपरीत दिशाओं में क्रमशः ${s1} किमी/घंटा और ${s2} किमी/घंटा की चाल से चल रही हैं। वे एक-दूसरे को पार करने में कितना समय लेंगी?`,
          e: `सापेक्ष चाल = ${s1} + ${s2} = ${s1 + s2} किमी/घंटा = ${rel} मी/से। दूरी = ${l1} + ${total - l1} = ${total} मीटर। समय = ${total} ÷ ${rel} = ${t} सेकंड।`,
        },
        r, "", " seconds",
      );
    }),
    "very-hard": either((id, r) => {
      // Late at a fraction of the usual speed: time scales inversely, so usual time = late × a/(b − a).
      const [a, b, late] = pick([[3, 4, 10], [4, 5, 12], [2, 3, 20], [5, 6, 10], [3, 5, 30], [4, 7, 15], [5, 7, 16], [7, 8, 6], [6, 7, 8]], r);
      const ans = (late * a) / (b - a);
      if (!Number.isInteger(ans)) return GENERATORS["quant-tsd"]["very-hard"](id, r);
      return numeric(
        id, "quant-tsd", "very-hard",
        `Walking at ${a}/${b} of his usual speed, a man reaches his office ${late} minutes late. What is his usual time to reach the office?`,
        ans,
        `At ${a}/${b} of the speed the journey takes ${b}/${a} of the usual time, i.e. ${b - a}/${a} of it extra. So ${b - a}/${a} × usual time = ${late} minutes, and usual time = ${late} × ${a}/${b - a} = ${fmt(ans)} minutes.`,
        {
          q: `अपनी सामान्य चाल की ${a}/${b} चाल से चलते हुए एक व्यक्ति अपने कार्यालय ${late} मिनट देर से पहुँचता है। कार्यालय पहुँचने में उसका सामान्य समय क्या है?`,
          e: `${a}/${b} चाल पर यात्रा में सामान्य समय का ${b}/${a} गुना समय लगता है, अर्थात् ${b - a}/${a} भाग अतिरिक्त। अतः ${b - a}/${a} × सामान्य समय = ${late} मिनट, और सामान्य समय = ${late} × ${a}/${b - a} = ${fmt(ans)} मिनट।`,
        },
        r, "", " minutes",
      );
    }, (id, r) => {
      // Chase: the gap closes at the relative speed while the thief keeps running.
      const [gap, vt, vp] = pick([[200, 10, 12], [100, 8, 10], [300, 12, 15], [150, 9, 12], [250, 10, 15], [120, 10, 14]], r);
      const ans = (gap * vt) / (vp - vt);
      return numeric(
        id, "quant-tsd", "very-hard",
        `A thief is spotted by a policeman ${gap} m away. The thief runs at ${vt} km/h and the policeman chases at ${vp} km/h. How far will the thief have run before he is caught?`,
        ans,
        `The gap closes at ${vp} − ${vt} = ${vp - vt} km/h, so the chase lasts as long as covering ${gap} m at ${vp - vt} km/h. In that time the thief runs ${vt}/${vp - vt} × ${gap} = ${fmt(ans)} m.`,
        {
          q: `एक पुलिसकर्मी ${gap} मीटर की दूरी पर एक चोर को देखता है। चोर ${vt} किमी/घंटा की चाल से भागता है और पुलिसकर्मी ${vp} किमी/घंटा की चाल से उसका पीछा करता है। पकड़े जाने से पहले चोर कितनी दूरी तय कर चुका होगा?`,
          e: `दोनों के बीच की दूरी ${vp} − ${vt} = ${vp - vt} किमी/घंटा की सापेक्ष चाल से घटती है, अतः पीछा उतने समय चलता है जितना ${gap} मीटर को ${vp - vt} किमी/घंटा से तय करने में लगता है। इतने समय में चोर ${vt}/${vp - vt} × ${gap} = ${fmt(ans)} मीटर दौड़ता है।`,
        },
        r, "", " m",
      );
    }, (id, r) => {
      const [down, up] = pick([[12, 8], [15, 9], [20, 12], [18, 10], [16, 8], [14, 10]], r);
      const lcm = (down * up) / gcd(down, up);
      const d = lcm * pick([1, 2], r);
      const askStream = r() < 0.5;
      const ans = askStream ? (down - up) / 2 : (down + up) / 2;
      return numeric(
        id, "quant-tsd", "very-hard",
        `A boat goes ${d} km downstream in ${d / down} hours and comes back the same distance upstream in ${d / up} hours. What is the speed of ${askStream ? "the stream" : "the boat in still water"}?`,
        ans,
        `Downstream speed = ${d} ÷ ${d / down} = ${down} km/h; upstream = ${d} ÷ ${d / up} = ${up} km/h. ${askStream ? `Stream = (${down} − ${up}) ÷ 2` : `Still water = (${down} + ${up}) ÷ 2`} = ${ans} km/h.`,
        {
          q: `एक नाव धारा के अनुकूल ${d} किमी की दूरी ${d / down} घंटे में तय करती है और उतनी ही दूरी धारा के प्रतिकूल ${d / up} घंटे में तय करके लौटती है। ${askStream ? "धारा की चाल" : "शांत जल में नाव की चाल"} क्या है?`,
          e: `धारा के अनुकूल चाल = ${d} ÷ ${d / down} = ${down} किमी/घंटा; धारा के प्रतिकूल चाल = ${d} ÷ ${d / up} = ${up} किमी/घंटा। ${askStream ? `धारा की चाल = (${down} − ${up}) ÷ 2` : `शांत जल में नाव की चाल = (${down} + ${up}) ÷ 2`} = ${ans} किमी/घंटा।`,
        },
        r, "", " km/h",
      );
    }, (id, r) => {
      // Pole gives the first train's speed; crossing the second train gives the relative speed.
      const va = pick([15, 20, 25, 30], r);
      const t1 = pick([8, 10, 12, 15], r);
      const L1 = va * t1;
      const vb = pick([10, 15, 20, 25], r);
      const t2 = pick([8, 10, 12, 15], r);
      const L2 = (va + vb) * t2 - L1;
      if (L2 < 100 || L2 > 600 || vb === va) return GENERATORS["quant-tsd"]["very-hard"](id, r);
      const ans = (vb * 18) / 5;
      return numeric(
        id, "quant-tsd", "very-hard",
        `A ${L1} m long train crosses a pole in ${t1} seconds and crosses a ${L2} m long train coming from the opposite direction in ${t2} seconds. What is the speed of the second train in km/h?`,
        ans,
        `First train’s speed = ${L1} ÷ ${t1} = ${va} m/s. Relative speed = (${L1} + ${L2}) ÷ ${t2} = ${va + vb} m/s, so the second train runs at ${va + vb} − ${va} = ${vb} m/s = ${vb} × 18/5 = ${ans} km/h.`,
        {
          q: `एक ${L1} मीटर लंबी रेलगाड़ी एक खंभे को ${t1} सेकंड में पार करती है और विपरीत दिशा से आती हुई ${L2} मीटर लंबी रेलगाड़ी को ${t2} सेकंड में पार करती है। दूसरी रेलगाड़ी की चाल किमी/घंटा में कितनी है?`,
          e: `पहली रेलगाड़ी की चाल = ${L1} ÷ ${t1} = ${va} मी/से। सापेक्ष चाल = (${L1} + ${L2}) ÷ ${t2} = ${va + vb} मी/से, अतः दूसरी रेलगाड़ी की चाल = ${va + vb} − ${va} = ${vb} मी/से = ${vb} × 18/5 = ${ans} किमी/घंटा।`,
        },
        r, "", " km/h",
      );
    }),
  },

  "quant-ci": {
    easy: (id, r) => {
      const [p, rate] = pick([[5000, 10], [8000, 10], [2000, 20], [4000, 5], [8000, 5], [5000, 8], [10000, 4], [12000, 10], [2500, 20]], r);
      const ci = (p * (200 * rate + rate * rate)) / 10000;
      return numeric(
        id, "quant-ci", "easy",
        `Find the compound interest on ₹${fmt(p)} at ${rate}% per annum for 2 years, compounded annually.`,
        ci,
        `Amount = ${fmt(p)} × (1 + ${rate}/100)² = ₹${fmt(p + ci)}. CI = ${fmt(p + ci)} − ${fmt(p)} = ₹${fmt(ci)}.`,
        {
          q: `₹${fmt(p)} पर ${rate}% वार्षिक दर से 2 वर्ष का चक्रवृद्धि ब्याज ज्ञात कीजिए, जबकि ब्याज वार्षिक रूप से संयोजित होता है।`,
          e: `मिश्रधन = ${fmt(p)} × (1 + ${rate}/100)² = ₹${fmt(p + ci)}। चक्रवृद्धि ब्याज = ${fmt(p + ci)} − ${fmt(p)} = ₹${fmt(ci)}।`,
        },
        r, "₹",
      );
    },
    moderate: (id, r) => {
      const p = pick([5000, 8000, 10000, 12000, 20000, 25000], r);
      const rate = pick([4, 5, 8, 10, 12], r);
      const ans = (p * rate * rate) / 10000;
      if (!Number.isInteger(ans)) return GENERATORS["quant-ci"].moderate(id, r);
      return numeric(
        id, "quant-ci", "moderate",
        `What is the difference between compound interest and simple interest on ₹${fmt(p)} for 2 years at ${rate}% per annum?`,
        ans,
        `For 2 years, CI − SI = P × (R/100)² = ${fmt(p)} × (${rate}/100)² = ₹${fmt(ans)}.`,
        {
          q: `₹${fmt(p)} पर ${rate}% वार्षिक दर से 2 वर्ष के चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर क्या है?`,
          e: `2 वर्ष के लिए, चक्रवृद्धि ब्याज − साधारण ब्याज = मूलधन × (दर/100)² = ${fmt(p)} × (${rate}/100)² = ₹${fmt(ans)}।`,
        },
        r, "₹",
      );
    },
    hard: (id, r) => {
      const p = pick([1000, 2000, 5000, 8000, 10000, 15000, 20000], r);
      const rate = pick([10, 20], r);
      const amt = (p * (100 + rate) ** 3) / 1e6;
      const factor = (((100 + rate) / 100) ** 3).toFixed(3);
      return numeric(
        id, "quant-ci", "hard",
        `What does ₹${fmt(p)} amount to in 3 years at ${rate}% per annum compound interest?`,
        amt,
        `Amount = ${fmt(p)} × (${100 + rate}/100)³ = ${fmt(p)} × ${factor} = ₹${fmt(amt)}.`,
        {
          q: `₹${fmt(p)} पर ${rate}% वार्षिक चक्रवृद्धि ब्याज की दर से 3 वर्ष में मिश्रधन कितना होगा?`,
          e: `मिश्रधन = ${fmt(p)} × (${100 + rate}/100)³ = ${fmt(p)} × ${factor} = ₹${fmt(amt)}।`,
        },
        r, "₹",
      );
    },
    "very-hard": either((id, r) => {
      // Three-year CI − SI = P × r²(300 + r)/10⁶: the two-year shortcut P(r/100)² is the trap.
      const [rate, p] = pick([[10, 10000], [10, 20000], [10, 5000], [5, 8000], [5, 16000], [5, 40000], [20, 5000], [20, 2500], [20, 10000]], r);
      const diff = (p * rate * rate * (300 + rate)) / 1e6;
      if (!Number.isInteger(diff)) return GENERATORS["quant-ci"]["very-hard"](id, r);
      return numeric(
        id, "quant-ci", "very-hard",
        `The difference between the compound interest and the simple interest on a sum for 3 years at ${rate}% per annum is ₹${fmt(diff)}. What is the sum?`,
        p,
        `For 3 years, CI − SI = P × (r/100)² × (3 + r/100) = P × ${rate}² × ${300 + rate} ÷ 10⁶ = P × ${fmt((rate * rate * (300 + rate)) / 1e6)}. So P = ${fmt(diff)} ÷ ${fmt((rate * rate * (300 + rate)) / 1e6)} = ₹${fmt(p)}. (The 2-year formula P(r/100)² would give the wrong sum.)`,
        {
          q: `किसी धनराशि पर ${rate}% वार्षिक दर से 3 वर्ष के चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर ₹${fmt(diff)} है। वह धनराशि क्या है?`,
          e: `3 वर्ष के लिए चक्रवृद्धि ब्याज − साधारण ब्याज = P × (r/100)² × (3 + r/100) = P × ${rate}² × ${300 + rate} ÷ 10⁶ = P × ${fmt((rate * rate * (300 + rate)) / 1e6)}। अतः P = ${fmt(diff)} ÷ ${fmt((rate * rate * (300 + rate)) / 1e6)} = ₹${fmt(p)}। (2 वर्ष वाला सूत्र P(r/100)² यहाँ गलत उत्तर देगा।)`,
        },
        r, "₹",
      );
    }, (id, r) => {
      const n = pick([3, 4, 5, 6, 8, 10], r);
      const [times, pow] = pick([[4, 2], [8, 3], [16, 4]], r);
      return numeric(
        id, "quant-ci", "very-hard",
        `A sum of money doubles itself in ${n} years at compound interest. In how many years will it become ${times} times itself?`,
        n * pow,
        `At compound interest the sum doubles every ${n} years: ${times} = 2^${pow}, so it takes ${pow} × ${n} = ${n * pow} years.`,
        {
          q: `कोई धनराशि चक्रवृद्धि ब्याज पर ${n} वर्ष में दोगुनी हो जाती है। कितने वर्ष में यह ${times} गुनी हो जाएगी?`,
          e: `चक्रवृद्धि ब्याज पर राशि हर ${n} वर्ष में दोगुनी होती है: ${times} = 2^${pow}, अतः समय = ${pow} × ${n} = ${n * pow} वर्ष।`,
        },
        r, "", " years",
      );
    }, (id, r) => {
      const [p, rate] = pick([[10000, 10], [20000, 10], [40000, 5], [10000, 20], [5000, 20], [16000, 25]], r);
      const a2 = (p * (100 + rate) ** 2) / 1e4;
      const a3 = (a2 * (100 + rate)) / 100;
      return numeric(
        id, "quant-ci", "very-hard",
        `At compound interest, a sum amounts to ₹${fmt(a2)} in 2 years and ₹${fmt(a3)} in 3 years. What is the rate of interest?`,
        rate,
        `The third year’s interest is earned on ₹${fmt(a2)}: ${fmt(a3)} − ${fmt(a2)} = ₹${fmt(a3 - a2)}. Rate = ${fmt(a3 - a2)} ÷ ${fmt(a2)} × 100 = ${rate}%.`,
        {
          q: `चक्रवृद्धि ब्याज पर कोई राशि 2 वर्ष में ₹${fmt(a2)} और 3 वर्ष में ₹${fmt(a3)} हो जाती है। ब्याज की दर क्या है?`,
          e: `तीसरे वर्ष का ब्याज ₹${fmt(a2)} पर मिलता है: ${fmt(a3)} − ${fmt(a2)} = ₹${fmt(a3 - a2)}। दर = ${fmt(a3 - a2)} ÷ ${fmt(a2)} × 100 = ${rate}%।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      const [p, rate] = pick([[10000, 10], [8000, 5], [20000, 10], [5000, 20], [15625, 4], [30000, 10]], r);
      const ans = Math.round(((p * rate * rate) / 1e4) * (3 + rate / 100) * 100) / 100;
      return numeric(
        id, "quant-ci", "very-hard",
        `What is the difference between compound interest and simple interest on ₹${fmt(p)} for 3 years at ${rate}% per annum?`,
        ans,
        `For 3 years, CI − SI = P × (R/100)² × (3 + R/100) = ${fmt(p)} × (${rate}/100)² × ${fmt(3 + rate / 100)} = ₹${fmt(ans)}.`,
        {
          q: `₹${fmt(p)} पर ${rate}% वार्षिक दर से 3 वर्ष के चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर क्या है?`,
          e: `3 वर्ष के लिए, चक्रवृद्धि ब्याज − साधारण ब्याज = मूलधन × (दर/100)² × (3 + दर/100) = ${fmt(p)} × (${rate}/100)² × ${fmt(3 + rate / 100)} = ₹${fmt(ans)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      // Two equal annual instalments: P = x/q + x/q² with q = 1 + R/100, so x = P × q²/(1 + q).
      const [p, rate] = pick([[2100, 10], [4200, 10], [6300, 10], [5500, 20], [2200, 20], [3300, 20], [8200, 5], [4100, 5], [3600, 25], [7200, 25], [1800, 25], [5100, 4]], r);
      const q = 100 + rate;
      const ans = (p * q * q) / (100 * (100 + q));
      if (!Number.isInteger(ans)) return GENERATORS["quant-ci"]["very-hard"](id, r);
      // Exact decimals (1.1025, not 1.1), so the working can be followed.
      const q1 = String(q / 100);
      const q2 = String((q * q) / 1e4);
      return numeric(
        id, "quant-ci", "very-hard",
        `A loan of ₹${fmt(p)} at ${rate}% per annum compound interest is to be repaid in two equal annual instalments. What is the value of each instalment?`,
        ans,
        `Let each instalment be x. Its present value must equal the loan: x/${q1} + x/${q2} = ${fmt(p)}, so x × (${q1} + 1)/${q2} = ${fmt(p)}. x = ${fmt(p)} × ${q2} ÷ ${String(q / 100 + 1)} = ₹${fmt(ans)}.`,
        {
          q: `₹${fmt(p)} का ऋण ${rate}% वार्षिक चक्रवृद्धि ब्याज पर दो समान वार्षिक किस्तों में चुकाना है। प्रत्येक किस्त का मान कितना होगा?`,
          e: `माना प्रत्येक किस्त x है। किस्तों का वर्तमान मूल्य ऋण के बराबर होगा: x/${q1} + x/${q2} = ${fmt(p)}, अतः x × (${q1} + 1)/${q2} = ${fmt(p)}। x = ${fmt(p)} × ${q2} ÷ ${String(q / 100 + 1)} = ₹${fmt(ans)}।`,
        },
        r, "₹",
      );
    }),
  },

  "quant-number-system": {
    easy: either((id, r) => {
      const [a, b] = pick([[12, 18], [15, 20], [24, 36], [16, 40], [21, 28], [18, 27], [30, 45], [14, 35], [20, 32], [36, 48], [25, 40], [42, 56]], r);
      const h = gcd(a, b);
      const l = (a * b) / h;
      return numeric(
        id, "quant-number-system", "easy",
        `What is the LCM of ${a} and ${b}?`,
        l,
        `HCF of ${a} and ${b} = ${h}, so LCM = ${a} × ${b} ÷ ${h} = ${l}.`,
        {
          q: `${a} और ${b} का लघुत्तम समापवर्त्य (LCM) क्या है?`,
          e: `${a} और ${b} का महत्तम समापवर्तक (HCF) = ${h}, अतः LCM = ${a} × ${b} ÷ ${h} = ${l}।`,
        },
        r,
      );
    }, (id, r) => {
      const [a, b, c] = pick([[24, 36, 60], [18, 30, 42], [16, 40, 56], [27, 45, 63], [32, 48, 80], [21, 35, 56], [36, 54, 90], [25, 75, 100], [44, 66, 110]], r);
      const h = gcd(gcd(a, b), c);
      return numeric(
        id, "quant-number-system", "easy",
        `What is the HCF of ${a}, ${b} and ${c}?`,
        h,
        `${a} = ${h} × ${a / h}, ${b} = ${h} × ${b / h} and ${c} = ${h} × ${c / h}; ${a / h}, ${b / h} and ${c / h} have no common factor, so HCF = ${h}.`,
        {
          q: `${a}, ${b} और ${c} का महत्तम समापवर्तक (HCF) क्या है?`,
          e: `${a} = ${h} × ${a / h}, ${b} = ${h} × ${b / h} और ${c} = ${h} × ${c / h}; ${a / h}, ${b / h} और ${c / h} में कोई उभयनिष्ठ गुणनखंड नहीं है, अतः HCF = ${h}।`,
        },
        r,
      );
    }),
    moderate: either((id, r) => {
      // Unit digit of a power: the last digit repeats in a cycle of 1, 2 or 4.
      const base = pick([2, 3, 4, 7, 8, 9, 12, 13, 14, 17, 18, 19, 22, 23, 27, 28, 33, 37], r);
      const exp = 21 + Math.floor(r() * 79);
      const u = base % 10;
      const cycle: number[] = [];
      for (let d = u; !cycle.includes(d); d = (d * u) % 10) cycle.push(d);
      const L = cycle.length;
      const k = ((exp - 1) % L) + 1;
      const ans = cycle[k - 1];
      const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], r);
      return choice(
        id, "quant-number-system", "moderate",
        `What is the unit digit of ${base}${sup(exp)}?`,
        String(ans),
        [...cycle, ...digits].map(String),
        `The unit digits of powers of ${u} repeat in a cycle of ${L}: ${cycle.join(", ")}. ${exp} = ${L} × ${(exp - k) / L} + ${k}, so the unit digit is that of ${u}${sup(k)}, i.e. ${ans}.`,
        {
          q: `${base}${sup(exp)} का इकाई अंक क्या है?`,
          e: `${u} की घातों के इकाई अंक ${L} के चक्र में दोहराते हैं: ${cycle.join(", ")}। ${exp} = ${L} × ${(exp - k) / L} + ${k}, अतः इकाई अंक वही होगा जो ${u}${sup(k)} का है, अर्थात् ${ans}।`,
        },
        r,
      );
    }, (id, r) => {
      // Missing digit for divisibility by 9 or 11.
      const div = pick([9, 11], r);
      const digits = [1 + Math.floor(r() * 9), ...Array.from({ length: 5 }, () => Math.floor(r() * 10))];
      const pos = 1 + Math.floor(r() * 5);
      const value = (x: number) => Number(digits.map((d, i) => (i === pos ? x : d)).join(""));
      const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((v) => value(v) % div === 0);
      if (x === undefined) return GENERATORS["quant-number-system"].moderate(id, r);
      const shown = digits.map((d, i) => (i === pos ? "*" : d)).join("");
      const full = digits.map((d, i) => (i === pos ? x : d));
      let en: string, hiE: string;
      if (div === 9) {
        const s = digits.reduce((a, d, i) => (i === pos ? a : a + d), 0);
        en = `A number is divisible by 9 when its digit sum is. The digits other than * add up to ${s}; the smallest digit that makes ${s} + * a multiple of 9 is ${x} (sum ${s + x}).`;
        hiE = `कोई संख्या 9 से विभाज्य होती है जब उसके अंकों का योग 9 से विभाज्य हो। * को छोड़कर अंकों का योग ${s} है; ${s} + * को 9 का गुणज बनाने वाला सबसे छोटा अंक ${x} है (योग ${s + x})।`;
      } else {
        const odd = full.filter((_, i) => i % 2 === 0).reduce((a, d) => a + d, 0);
        const even = full.filter((_, i) => i % 2 === 1).reduce((a, d) => a + d, 0);
        en = `A number is divisible by 11 when the sums of its digits in odd and even places differ by 0 or a multiple of 11. With * = ${x}, odd places (from the left) add up to ${odd} and even places to ${even}; the difference is ${odd - even}.`;
        hiE = `कोई संख्या 11 से विभाज्य होती है जब विषम स्थानों और सम स्थानों के अंकों के योगों का अंतर 0 या 11 का गुणज हो। * = ${x} रखने पर (बाएँ से) विषम स्थानों का योग ${odd} और सम स्थानों का योग ${even} है; अंतर = ${odd - even}।`;
      }
      return choice(
        id, "quant-number-system", "moderate",
        `What is the smallest digit that can replace * in ${shown} so that the number is divisible by ${div}?`,
        String(x),
        shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], r).map(String),
        en,
        { q: `संख्या ${shown} में * के स्थान पर वह सबसे छोटा अंक कौन-सा है जिससे संख्या ${div} से विभाज्य हो जाए?`, e: hiE },
        r,
      );
    }),
    hard: either((id, r) => {
      // Remainder by a factor of the divisor.
      const [D, d] = pick([[56, 8], [84, 12], [72, 9], [91, 13], [65, 13], [48, 6], [119, 17], [153, 17], [75, 15], [96, 16], [133, 19], [108, 12]], r);
      const R = 1 + Math.floor(r() * (D - 1));
      if (R % d === 0 || R < d) return GENERATORS["quant-number-system"].hard(id, r);
      const ans = R % d;
      return numeric(
        id, "quant-number-system", "hard",
        `When a number is divided by ${D}, the remainder is ${R}. What will the remainder be when the same number is divided by ${d}?`,
        ans,
        `The number is ${D}k + ${R}. Since ${D} = ${d} × ${D / d} is divisible by ${d}, the remainder is the remainder of ${R} ÷ ${d}, which is ${ans}.`,
        {
          q: `किसी संख्या को ${D} से भाग देने पर शेषफल ${R} आता है। उसी संख्या को ${d} से भाग देने पर शेषफल क्या होगा?`,
          e: `संख्या = ${D}k + ${R}। चूँकि ${D} = ${d} × ${D / d}, ${d} से पूर्णतः विभाज्य है, इसलिए शेषफल वही होगा जो ${R} को ${d} से भाग देने पर आता है, अर्थात् ${ans}।`,
        },
        r,
      );
    }, (id, r) => {
      // Counting multiples with inclusion–exclusion.
      const [a, b] = pick([[3, 5], [4, 6], [6, 8], [5, 7], [3, 7], [4, 10], [6, 9], [2, 5]], r);
      const N = pick([100, 150, 200, 250, 300, 400, 500, 600], r);
      const l = (a * b) / gcd(a, b);
      const [x, y, z] = [Math.floor(N / a), Math.floor(N / b), Math.floor(N / l)];
      const either_ = x + y - z;
      const neither = r() < 0.4;
      const ans = neither ? N - either_ : either_;
      return numeric(
        id, "quant-number-system", "hard",
        neither
          ? `How many numbers from 1 to ${N} are divisible by neither ${a} nor ${b}?`
          : `How many numbers from 1 to ${N} are divisible by ${a} or ${b}?`,
        ans,
        `Divisible by ${a}: ${x}; by ${b}: ${y}; by both (i.e. by their LCM ${l}): ${z}. Divisible by ${a} or ${b} = ${x} + ${y} − ${z} = ${either_}.${neither ? ` Divisible by neither = ${N} − ${either_} = ${ans}.` : ""}`,
        {
          q: neither
            ? `1 से ${N} तक की कितनी संख्याएँ न तो ${a} से और न ही ${b} से विभाज्य हैं?`
            : `1 से ${N} तक की कितनी संख्याएँ ${a} या ${b} से विभाज्य हैं?`,
          e: `${a} से विभाज्य: ${x}; ${b} से विभाज्य: ${y}; दोनों से (अर्थात् उनके LCM ${l} से) विभाज्य: ${z}। ${a} या ${b} से विभाज्य = ${x} + ${y} − ${z} = ${either_}।${neither ? ` किसी से भी विभाज्य नहीं = ${N} − ${either_} = ${ans}।` : ""}`,
        },
        r,
      );
    }),
    "very-hard": either((id, r) => {
      // HCF × LCM = product of the two numbers.
      const h = pick([4, 6, 8, 9, 12, 14, 15, 16, 18], r);
      const [a, b] = pick([[3, 5], [4, 5], [2, 7], [5, 6], [3, 8], [4, 7], [2, 9], [5, 8], [3, 4]], r);
      const L = h * a * b;
      const [given, ans] = r() < 0.5 ? [h * a, h * b] : [h * b, h * a];
      return numeric(
        id, "quant-number-system", "very-hard",
        `The HCF of two numbers is ${h} and their LCM is ${fmt(L)}. If one of the numbers is ${given}, what is the other?`,
        ans,
        `Product of two numbers = HCF × LCM, so the other number = ${h} × ${fmt(L)} ÷ ${given} = ${ans}.`,
        {
          q: `दो संख्याओं का महत्तम समापवर्तक (HCF) ${h} और लघुत्तम समापवर्त्य (LCM) ${fmt(L)} है। यदि उनमें से एक संख्या ${given} है, तो दूसरी संख्या क्या है?`,
          e: `दो संख्याओं का गुणनफल = HCF × LCM, अतः दूसरी संख्या = ${h} × ${fmt(L)} ÷ ${given} = ${ans}।`,
        },
        r,
      );
    }, (id, r) => {
      // Largest number dividing three numbers with given remainders = HCF of the differences.
      const g = pick([13, 17, 19, 23, 29, 31, 37, 41, 43, 47], r);
      const rem = Array.from({ length: 3 }, () => 1 + Math.floor(r() * (g - 1)));
      const nums = rem.map((x) => g * (5 + Math.floor(r() * 26)) + x);
      const diffs = nums.map((x, i) => x - rem[i]);
      const ans = diffs.reduce(gcd);
      if (new Set(nums).size < 3 || ans <= Math.max(...rem)) return GENERATORS["quant-number-system"]["very-hard"](id, r);
      const subs = nums.map((x, i) => `${x} − ${rem[i]} = ${diffs[i]}`).join(", ");
      return numeric(
        id, "quant-number-system", "very-hard",
        `What is the largest number that divides ${nums[0]}, ${nums[1]} and ${nums[2]} leaving remainders ${rem[0]}, ${rem[1]} and ${rem[2]} respectively?`,
        ans,
        `The number must divide ${subs} exactly. The largest such number is their HCF = ${ans}.`,
        {
          q: `वह बड़ी से बड़ी संख्या कौन-सी है जिससे ${nums[0]}, ${nums[1]} और ${nums[2]} को भाग देने पर क्रमशः ${rem[0]}, ${rem[1]} और ${rem[2]} शेष बचते हैं?`,
          e: `अभीष्ट संख्या ${subs} को पूर्णतः विभाजित करेगी। ऐसी सबसे बड़ी संख्या इनका महत्तम समापवर्तक (HCF) = ${ans} है।`,
        },
        r,
      );
    }, (id, r) => {
      // Remainder of a large power: find the cycle length k with a^k ≡ 1 (mod m), then reduce the exponent.
      const [a, m] = pick([[2, 5], [3, 5], [7, 5], [2, 7], [3, 7], [4, 7], [2, 9], [7, 9], [3, 11], [2, 13], [8, 13], [12, 13], [5, 7], [9, 11], [6, 7]], r);
      const n = pick([50, 64, 75, 99, 100, 101, 120, 123, 200, 250, 2023, 2024, 2025], r);
      let k = 1;
      for (let pw = a % m; pw !== 1; pw = (pw * a) % m) k++;
      const s = n % k;
      const qt = (n - s) / k;
      const ans = Number(BigInt(a) ** BigInt(s) % BigInt(m));
      const distractors = shuffle(Array.from({ length: m }, (_, i) => String(i)).filter((x) => x !== String(ans)), r);
      const split = `${n} = ${k} × ${qt}${s ? ` + ${s}` : ""}`;
      const tail = s ? `${a}${sup(n)} = (${a}${sup(k)})${sup(qt)} × ${a}${sup(s)} leaves the same remainder as ${a}${sup(s)} = ${a ** s}, i.e. ${ans}` : `${a}${sup(n)} = (${a}${sup(k)})${sup(qt)} leaves remainder 1`;
      const tailHi = s ? `${a}${sup(n)} = (${a}${sup(k)})${sup(qt)} × ${a}${sup(s)} का शेषफल वही होगा जो ${a}${sup(s)} = ${a ** s} का है, अर्थात् ${ans}` : `${a}${sup(n)} = (${a}${sup(k)})${sup(qt)} का शेषफल 1 होगा`;
      return choice(
        id, "quant-number-system", "very-hard",
        `What is the remainder when ${a}${sup(n)} is divided by ${m}?`,
        String(ans),
        distractors,
        `${a}${sup(k)} = ${a ** k} leaves remainder 1 when divided by ${m}, so the remainders repeat every ${k} powers. ${split}, so ${tail}.`,
        {
          q: `${a}${sup(n)} को ${m} से भाग देने पर शेषफल क्या होगा?`,
          e: `${a}${sup(k)} = ${a ** k} को ${m} से भाग देने पर शेषफल 1 आता है, अतः हर ${k} घातों के बाद शेषफल दोहराते हैं। ${split}, अतः ${tailHi}।`,
        },
        r,
      );
    }),
  },

  "quant-mensuration": {
    easy: either((id, r) => {
      const u = pick(["cm", "m"], r);
      const uh = unitHi(u);
      const kind = pick(["area", "perimeter", "square"] as const, r);
      if (kind === "square") {
        const s = pick([9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 24, 25], r);
        return numeric(
          id, "quant-mensuration", "easy",
          `The area of a square is ${s * s} ${u}². What is its perimeter?`,
          4 * s,
          `Side = √${s * s} = ${s} ${u}; perimeter = 4 × ${s} = ${4 * s} ${u}.`,
          { q: `एक वर्ग का क्षेत्रफल ${s * s} वर्ग ${uh} है। उसका परिमाप कितना है?`, e: `भुजा = √${s * s} = ${s} ${uh}; परिमाप = 4 × ${s} = ${4 * s} ${uh}।` },
          r, "", ` ${u}`,
        );
      }
      const [L, B] = pick([[12, 8], [15, 10], [20, 14], [25, 16], [18, 12], [30, 20], [24, 15], [40, 25], [35, 20], [16, 9]], r);
      const area = kind === "area";
      return numeric(
        id, "quant-mensuration", "easy",
        `A rectangle is ${L} ${u} long and ${B} ${u} wide. What is its ${kind}?`,
        area ? L * B : 2 * (L + B),
        area
          ? `Area = length × breadth = ${L} × ${B} = ${L * B} ${u}².`
          : `Perimeter = 2 × (length + breadth) = 2 × (${L} + ${B}) = ${2 * (L + B)} ${u}.`,
        {
          q: `एक आयत की लंबाई ${L} ${uh} और चौड़ाई ${B} ${uh} है। उसका ${area ? "क्षेत्रफल" : "परिमाप"} कितना है?`,
          e: area
            ? `क्षेत्रफल = लंबाई × चौड़ाई = ${L} × ${B} = ${L * B} वर्ग ${uh}।`
            : `परिमाप = 2 × (लंबाई + चौड़ाई) = 2 × (${L} + ${B}) = ${2 * (L + B)} ${uh}।`,
        },
        r, "", area ? ` ${u}²` : ` ${u}`,
      );
    }, (id, r) => {
      const rad = 7 * pick([1, 2, 3, 4, 5, 6], r);
      const area = r() < 0.5;
      const ans = area ? (22 * rad * rad) / 7 : (2 * 22 * rad) / 7;
      return numeric(
        id, "quant-mensuration", "easy",
        `What is the ${area ? "area" : "circumference"} of a circle of radius ${rad} cm? (Take π = 22/7)`,
        ans,
        area
          ? `Area = πr² = 22/7 × ${rad} × ${rad} = ${fmt(ans)} cm².`
          : `Circumference = 2πr = 2 × 22/7 × ${rad} = ${fmt(ans)} cm.`,
        {
          q: `${rad} सेमी त्रिज्या वाले वृत्त ${area ? "का क्षेत्रफल कितना है" : "की परिधि कितनी है"}? (π = 22/7 लीजिए)`,
          e: area
            ? `क्षेत्रफल = πr² = 22/7 × ${rad} × ${rad} = ${fmt(ans)} वर्ग सेमी।`
            : `परिधि = 2πr = 2 × 22/7 × ${rad} = ${fmt(ans)} सेमी।`,
        },
        r, "", area ? " cm²" : " cm",
      );
    }),
    moderate: either((id, r) => {
      const rad = 7 * pick([1, 2, 3], r);
      const h = pick([5, 10, 12, 15, 20, 24, 30], r);
      const kind = pick(["volume", "curved surface area", "total surface area"] as const, r);
      const vol = kind === "volume";
      const { ans, en, hiE, hiKind } = {
        volume: { ans: (22 * rad * rad * h) / 7, en: `Volume = πr²h = 22/7 × ${rad} × ${rad} × ${h}`, hiE: `आयतन = πr²h = 22/7 × ${rad} × ${rad} × ${h}`, hiKind: "आयतन" },
        "curved surface area": { ans: (2 * 22 * rad * h) / 7, en: `Curved surface area = 2πrh = 2 × 22/7 × ${rad} × ${h}`, hiE: `वक्र पृष्ठीय क्षेत्रफल = 2πrh = 2 × 22/7 × ${rad} × ${h}`, hiKind: "वक्र पृष्ठीय क्षेत्रफल" },
        "total surface area": { ans: (2 * 22 * rad * (h + rad)) / 7, en: `Total surface area = 2πr(h + r) = 2 × 22/7 × ${rad} × (${h} + ${rad})`, hiE: `संपूर्ण पृष्ठीय क्षेत्रफल = 2πr(h + r) = 2 × 22/7 × ${rad} × (${h} + ${rad})`, hiKind: "संपूर्ण पृष्ठीय क्षेत्रफल" },
      }[kind];
      return numeric(
        id, "quant-mensuration", "moderate",
        `A solid cylinder has radius ${rad} cm and height ${h} cm. What is its ${kind}? (Take π = 22/7)`,
        ans,
        `${en} = ${fmt(ans)} ${vol ? "cm³" : "cm²"}.`,
        {
          q: `एक ठोस बेलन की त्रिज्या ${rad} सेमी और ऊँचाई ${h} सेमी है। उसका ${hiKind} कितना है? (π = 22/7 लीजिए)`,
          e: `${hiE} = ${fmt(ans)} ${vol ? "घन सेमी" : "वर्ग सेमी"}।`,
        },
        r, "", vol ? " cm³" : " cm²",
      );
    }, (id, r) => {
      const [rad, h, l] = pick([[7, 24, 25], [21, 20, 29], [14, 48, 50], [21, 28, 35], [28, 21, 35], [35, 12, 37]], r);
      const vol = r() < 0.5;
      const ans = vol ? (22 * rad * rad * h) / 21 : (22 * rad * l) / 7;
      return numeric(
        id, "quant-mensuration", "moderate",
        `A right circular cone has base radius ${rad} cm and height ${h} cm. What is its ${vol ? "volume" : "curved surface area"}? (Take π = 22/7)`,
        ans,
        vol
          ? `Volume = ⅓πr²h = 1/3 × 22/7 × ${rad} × ${rad} × ${h} = ${fmt(ans)} cm³.`
          : `Slant height l = √(${rad}² + ${h}²) = ${l} cm. Curved surface area = πrl = 22/7 × ${rad} × ${l} = ${fmt(ans)} cm².`,
        {
          q: `एक लंब वृत्तीय शंकु के आधार की त्रिज्या ${rad} सेमी और ऊँचाई ${h} सेमी है। उसका ${vol ? "आयतन" : "वक्र पृष्ठीय क्षेत्रफल"} कितना है? (π = 22/7 लीजिए)`,
          e: vol
            ? `आयतन = ⅓πr²h = 1/3 × 22/7 × ${rad} × ${rad} × ${h} = ${fmt(ans)} घन सेमी।`
            : `तिर्यक ऊँचाई l = √(${rad}² + ${h}²) = ${l} सेमी। वक्र पृष्ठीय क्षेत्रफल = πrl = 22/7 × ${rad} × ${l} = ${fmt(ans)} वर्ग सेमी।`,
        },
        r, "", vol ? " cm³" : " cm²",
      );
    }),
    hard: either((id, r) => {
      // Percentage change in area.
      if (r() < 0.5) {
        const [a, b] = pick([[20, 10], [10, 20], [25, 10], [30, 20], [20, 20], [40, 25], [50, 20], [15, 10], [10, 10], [20, 30]], r);
        const net = a - b - (a * b) / 100;
        const up = net > 0;
        const ans = Math.abs(net);
        return numeric(
          id, "quant-mensuration", "hard",
          `The length of a rectangle is increased by ${a}% and its breadth is decreased by ${b}%. What is the percentage ${up ? "increase" : "decrease"} in its area?`,
          ans,
          `New area = (1 + ${a}/100)(1 − ${b}/100) × old area. Net change = ${a} − ${b} − ${a}×${b}/100 = ${fmt(net)}%, i.e. a ${fmt(ans)}% ${up ? "increase" : "decrease"}.`,
          {
            q: `एक आयत की लंबाई ${a}% बढ़ा दी जाती है और चौड़ाई ${b}% घटा दी जाती है। उसके क्षेत्रफल में कितने प्रतिशत की ${up ? "वृद्धि" : "कमी"} होगी?`,
            e: `नया क्षेत्रफल = (1 + ${a}/100)(1 − ${b}/100) × पुराना क्षेत्रफल। शुद्ध परिवर्तन = ${a} − ${b} − ${a}×${b}/100 = ${fmt(net)}%, अर्थात् ${fmt(ans)}% की ${up ? "वृद्धि" : "कमी"}।`,
          },
          r, "", "%",
        );
      }
      const x = pick([5, 10, 20, 25, 30, 40, 50], r);
      const up = r() < 0.6;
      const f = (100 + (up ? x : -x)) / 100;
      const ans = up ? 2 * x + (x * x) / 100 : 2 * x - (x * x) / 100;
      return numeric(
        id, "quant-mensuration", "hard",
        `The radius of a circle is ${up ? "increased" : "decreased"} by ${x}%. By what percentage does its area ${up ? "increase" : "decrease"}?`,
        ans,
        `Area ∝ r². New area = (${fmt(f)})² × old = ${fmt(f * f)} × old, so the area ${up ? "rises" : "falls"} by ${fmt(ans)}%.`,
        {
          q: `एक वृत्त की त्रिज्या ${x}% ${up ? "बढ़ा" : "घटा"} दी जाती है। उसके क्षेत्रफल में कितने प्रतिशत की ${up ? "वृद्धि" : "कमी"} होगी?`,
          e: `क्षेत्रफल ∝ r²। नया क्षेत्रफल = (${fmt(f)})² × पुराना = ${fmt(f * f)} × पुराना, अतः क्षेत्रफल में ${fmt(ans)}% की ${up ? "वृद्धि" : "कमी"} होगी।`,
        },
        r, "", "%",
      );
    }, (id, r) => {
      // A path of uniform width around a rectangular field.
      const [L, B] = pick([[60, 40], [50, 30], [80, 60], [100, 70], [45, 30], [120, 80], [90, 50], [75, 40]], r);
      const w = pick([2, 2.5, 3, 4, 5], r);
      const outside = r() < 0.5;
      const [L2, B2] = outside ? [L + 2 * w, B + 2 * w] : [L - 2 * w, B - 2 * w];
      const ans = Math.abs(L2 * B2 - L * B);
      return numeric(
        id, "quant-mensuration", "hard",
        `A rectangular field is ${L} m long and ${B} m wide. A path ${fmt(w)} m wide runs all around it ${outside ? "outside" : "inside"}. What is the area of the path?`,
        ans,
        outside
          ? `Outer rectangle = (${L} + 2 × ${fmt(w)}) × (${B} + 2 × ${fmt(w)}) = ${fmt(L2)} × ${fmt(B2)} = ${fmt(L2 * B2)} m². Path = ${fmt(L2 * B2)} − ${L} × ${B} = ${fmt(ans)} m².`
          : `Inner rectangle = (${L} − 2 × ${fmt(w)}) × (${B} − 2 × ${fmt(w)}) = ${fmt(L2)} × ${fmt(B2)} = ${fmt(L2 * B2)} m². Path = ${L} × ${B} − ${fmt(L2 * B2)} = ${fmt(ans)} m².`,
        {
          q: `एक आयताकार मैदान ${L} मीटर लंबा और ${B} मीटर चौड़ा है। इसके चारों ओर ${outside ? "बाहर" : "भीतर"} की ओर ${fmt(w)} मीटर चौड़ा एक रास्ता बना है। रास्ते का क्षेत्रफल कितना है?`,
          e: outside
            ? `बाहरी आयत = (${L} + 2 × ${fmt(w)}) × (${B} + 2 × ${fmt(w)}) = ${fmt(L2)} × ${fmt(B2)} = ${fmt(L2 * B2)} वर्ग मीटर। रास्ते का क्षेत्रफल = ${fmt(L2 * B2)} − ${L} × ${B} = ${fmt(ans)} वर्ग मीटर।`
            : `भीतरी आयत = (${L} − 2 × ${fmt(w)}) × (${B} − 2 × ${fmt(w)}) = ${fmt(L2)} × ${fmt(B2)} = ${fmt(L2 * B2)} वर्ग मीटर। रास्ते का क्षेत्रफल = ${L} × ${B} − ${fmt(L2 * B2)} = ${fmt(ans)} वर्ग मीटर।`,
        },
        r, "", " m²",
      );
    }),
    "very-hard": either((id, r) => {
      // Melting and recasting: the volume stays the same.
      if (r() < 0.5) {
        const [R, s] = pick([[6, 2], [9, 3], [8, 2], [10, 2], [12, 3], [12, 4], [15, 3], [6, 3], [12, 2], [9, 1]], r);
        const ans = (R / s) ** 3;
        return numeric(
          id, "quant-mensuration", "very-hard",
          `A solid metallic sphere of radius ${R} cm is melted and recast into small solid spheres, each of radius ${s} cm. How many small spheres are obtained?`,
          ans,
          `Number = volume of the big sphere ÷ volume of a small one = (4/3 π × ${R}³) ÷ (4/3 π × ${s}³) = (${R}/${s})³ = ${fmt(ans)}.`,
          {
            q: `${R} सेमी त्रिज्या वाले धातु के एक ठोस गोले को पिघलाकर ${s} सेमी त्रिज्या वाले छोटे ठोस गोले बनाए जाते हैं। ऐसे कितने छोटे गोले बनेंगे?`,
            e: `गोलों की संख्या = बड़े गोले का आयतन ÷ एक छोटे गोले का आयतन = (4/3 π × ${R}³) ÷ (4/3 π × ${s}³) = (${R}/${s})³ = ${fmt(ans)}।`,
          },
          r,
        );
      }
      const [R, c] = pick([[6, 4], [3, 2], [9, 6], [12, 8], [6, 3], [6, 8], [3, 1], [9, 3]], r);
      const ans = (4 * R ** 3) / (3 * c * c);
      return numeric(
        id, "quant-mensuration", "very-hard",
        `A solid metallic sphere of radius ${R} cm is melted and recast into a solid cylinder of radius ${c} cm. What is the height of the cylinder?`,
        ans,
        `Volume is unchanged: 4/3 π × ${R}³ = π × ${c}² × h, so h = 4 × ${R ** 3} ÷ (3 × ${c * c}) = ${fmt(ans)} cm.`,
        {
          q: `${R} सेमी त्रिज्या वाले धातु के एक ठोस गोले को पिघलाकर ${c} सेमी त्रिज्या वाला एक ठोस बेलन बनाया जाता है। बेलन की ऊँचाई कितनी है?`,
          e: `आयतन नहीं बदलता: 4/3 π × ${R}³ = π × ${c}² × h, अतः h = 4 × ${R ** 3} ÷ (3 × ${c * c}) = ${fmt(ans)} सेमी।`,
        },
        r, "", " cm",
      );
    }, (id, r) => {
      // Fencing costs, worked backwards.
      if (r() < 0.5) {
        const rad = 7 * pick([2, 3, 4, 5, 6, 10], r);
        const rate = pick([10, 12, 15, 20, 25, 30, 40, 50], r);
        const C = (44 * rad) / 7;
        const cost = C * rate;
        const ans = (22 * rad * rad) / 7;
        return numeric(
          id, "quant-mensuration", "very-hard",
          `The cost of fencing a circular field at ₹${rate} per metre is ₹${fmt(cost)}. What is the area of the field? (Take π = 22/7)`,
          ans,
          `Circumference = ${fmt(cost)} ÷ ${rate} = ${C} m. 2 × 22/7 × r = ${C} gives r = ${rad} m. Area = 22/7 × ${rad} × ${rad} = ${fmt(ans)} m².`,
          {
            q: `एक वृत्ताकार मैदान के चारों ओर ₹${rate} प्रति मीटर की दर से बाड़ लगाने का व्यय ₹${fmt(cost)} है। मैदान का क्षेत्रफल कितना है? (π = 22/7 लीजिए)`,
            e: `परिधि = ${fmt(cost)} ÷ ${rate} = ${C} मीटर। 2 × 22/7 × r = ${C} से r = ${rad} मीटर। क्षेत्रफल = 22/7 × ${rad} × ${rad} = ${fmt(ans)} वर्ग मीटर।`,
          },
          r, "", " m²",
        );
      }
      const [a, b] = pick([[3, 2], [4, 3], [5, 3], [5, 4], [2, 1], [7, 4]], r);
      const x = pick([5, 10, 12, 15, 20, 25], r);
      const rate = pick([10, 15, 20, 25, 40, 50], r);
      const area = a * b * x * x;
      const P = 2 * (a + b) * x;
      return numeric(
        id, "quant-mensuration", "very-hard",
        `The sides of a rectangular park are in the ratio ${a} : ${b} and its area is ${fmt(area)} m². What is the cost of fencing it at ₹${rate} per metre?`,
        P * rate,
        `Let the sides be ${a}x and ${b === 1 ? "" : b}x. ${a * b}x² = ${fmt(area)}, so x = ${x} and the sides are ${a * x} m and ${b * x} m. Perimeter = 2 × (${a * x} + ${b * x}) = ${P} m; cost = ${P} × ${rate} = ₹${fmt(P * rate)}.`,
        {
          q: `एक आयताकार पार्क की भुजाओं का अनुपात ${a} : ${b} है और उसका क्षेत्रफल ${fmt(area)} वर्ग मीटर है। ₹${rate} प्रति मीटर की दर से उसके चारों ओर बाड़ लगाने का व्यय कितना होगा?`,
          e: `माना भुजाएँ ${a}x और ${b === 1 ? "" : b}x हैं। ${a * b}x² = ${fmt(area)}, अतः x = ${x} और भुजाएँ ${a * x} मीटर तथा ${b * x} मीटर हैं। परिमाप = 2 × (${a * x} + ${b * x}) = ${P} मीटर; व्यय = ${P} × ${rate} = ₹${fmt(P * rate)}।`,
        },
        r, "₹",
      );
    }, (id, r) => {
      // Four walls plus the ceiling, minus a door and windows.
      const [l, b, h] = [pick([8, 10, 12, 15], r), pick([6, 7, 8, 9, 10], r), pick([4, 5], r)];
      const win = pick([2, 4], r);
      const rate = pick([8, 10, 12, 15, 20, 25], r);
      if (b >= l) return GENERATORS["quant-mensuration"]["very-hard"](id, r);
      const walls = 2 * (l + b) * h;
      const ded = 3 + 1.5 * win;
      const area = walls + l * b - ded;
      return numeric(
        id, "quant-mensuration", "very-hard",
        `A room is ${l} m long, ${b} m wide and ${h} m high. It has one door measuring 2 m × 1.5 m and ${win} windows each measuring 1.5 m × 1 m. What is the cost of painting its four walls and the ceiling at ₹${rate} per m²?`,
        area * rate,
        `Four walls = 2 × (${l} + ${b}) × ${h} = ${walls} m²; ceiling = ${l} × ${b} = ${l * b} m². Deduct the door (3 m²) and ${win} windows (${win} × 1.5 = ${1.5 * win} m²): area = ${walls} + ${l * b} − ${fmt(ded)} = ${fmt(area)} m². Cost = ${fmt(area)} × ${rate} = ₹${fmt(area * rate)}.`,
        {
          q: `एक कमरा ${l} मीटर लंबा, ${b} मीटर चौड़ा और ${h} मीटर ऊँचा है। इसमें 2 मीटर × 1.5 मीटर का एक दरवाज़ा और 1.5 मीटर × 1 मीटर की ${win} खिड़कियाँ हैं। ₹${rate} प्रति वर्ग मीटर की दर से इसकी चारों दीवारों और छत पर रंग करने का व्यय कितना होगा?`,
          e: `चारों दीवारें = 2 × (${l} + ${b}) × ${h} = ${walls} वर्ग मीटर; छत = ${l} × ${b} = ${l * b} वर्ग मीटर। दरवाज़ा (3 वर्ग मीटर) और ${win} खिड़कियाँ (${win} × 1.5 = ${1.5 * win} वर्ग मीटर) घटाने पर क्षेत्रफल = ${walls} + ${l * b} − ${fmt(ded)} = ${fmt(area)} वर्ग मीटर। व्यय = ${fmt(area)} × ${rate} = ₹${fmt(area * rate)}।`,
        },
        r, "₹",
      );
    }),
  },
};

// ---------------------------------------------------------------------------
// Algebra, geometry and trigonometry (the SSC "advance maths" block)
// ---------------------------------------------------------------------------

const AG = "quant-algebra-geometry";
/** A whole number from lo to hi, both included. */
const rint = (lo: number, hi: number, r: Rand) => lo + Math.floor(r() * (hi - lo + 1));
/** Keeps drawing until the numbers come out clean (`make` returns null for a draw it rejects). */
function until<T>(make: () => T | null): T {
  for (let i = 0; i < 2000; i++) {
    const v = make();
    if (v !== null) return v;
  }
  throw new Error("generator: no clean numbers found");
}
/** p/q in lowest terms ("7/5"), or a whole number when q divides p. */
const frac = (p: number, q: number) => {
  const g = gcd(Math.abs(p), Math.abs(q));
  return q / g === 1 ? `${p / g}` : `${p / g}/${q / g}`;
};
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const pt = (x: number, y: number) => `(${x}, ${y})`;
/** Pythagorean triples; the first five are primitive. */
const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10], [9, 12, 15], [12, 16, 20], [10, 24, 26], [15, 20, 25]];
/** Triangles with whole-number sides and a whole-number area (Heron). */
const HERON: [number, number, number][] = [[13, 14, 15], [5, 5, 6], [5, 5, 8], [10, 13, 13], [13, 13, 24], [9, 10, 17], [7, 15, 20], [11, 13, 20], [12, 17, 25], [13, 20, 21], [10, 17, 21], [17, 25, 26], [17, 25, 28], [4, 13, 15], [3, 25, 26], [15, 26, 37], [6, 25, 29], [15, 28, 41], [15, 34, 35], [8, 29, 35], [11, 25, 30], [25, 29, 36]];
/** Standard-angle values as [name, numerator, denominator]. */
const TRIG: [string, number, number][] = [
  ["sin 30°", 1, 2], ["cos 60°", 1, 2], ["tan 45°", 1, 1], ["cot 45°", 1, 1], ["sec 60°", 2, 1], ["cosec 30°", 2, 1],
  ["sin² 45°", 1, 2], ["cos² 45°", 1, 2], ["sin² 60°", 3, 4], ["cos² 30°", 3, 4], ["tan² 60°", 3, 1], ["tan² 30°", 1, 3],
  ["sin² 30°", 1, 4], ["cos² 60°", 1, 4], ["cot² 30°", 3, 1], ["sec² 45°", 2, 1],
];
/** A heights-and-distances MCQ: the options are lengths in metres, some in surd form ("20√3 m"). */
function lengths(id: string, difficulty: Difficulty, question: string, answer: string, base: number, explanation: string, hi: Hi, r: Rand, extra: string[] = []): MCQ {
  const cands = [
    ...extra,
    `${base} m`, `${base}√3 m`, `${2 * base} m`, `${2 * base}√3 m`, `${3 * base} m`,
    ...(base % 3 === 0 ? [`${base / 3}√3 m`, `${(2 * base) / 3}√3 m`] : []),
    ...(base % 2 === 0 ? [`${base / 2}√3 m`, `${base / 2} m`] : []),
  ];
  const options = Object.fromEntries([answer, ...cands].map((o) => [o, o.replace(/ m$/, " मीटर")]));
  return choice(id, AG, difficulty, question, answer, shuffle(cands, r), explanation, { ...hi, options }, r);
}

GENERATORS[AG] = {
  easy: either((id, r) => {
    // A one-step linear equation.
    const [a, x, b] = [rint(2, 9, r), rint(2, 15, r), rint(1, 25, r)];
    const minus = r() < 0.4 && a * x > b;
    const c = minus ? a * x - b : a * x + b;
    const [s, back] = minus ? ["−", "+"] : ["+", "−"];
    return numeric(
      id, AG, "easy",
      `If ${a}x ${s} ${b} = ${c}, what is the value of x?`,
      x,
      `${a}x = ${c} ${back} ${b} = ${a * x}, so x = ${a * x} ÷ ${a} = ${x}.`,
      { q: `यदि ${a}x ${s} ${b} = ${c} है, तो x का मान क्या है?`, e: `${a}x = ${c} ${back} ${b} = ${a * x}, अतः x = ${a * x} ÷ ${a} = ${x}।` },
      r,
    );
  }, (id, r) => {
    // Polygons: angle sum and number of diagonals.
    const n = rint(5, 20, r);
    if (r() < 0.5) {
      const ans = (n - 2) * 180;
      return numeric(
        id, AG, "easy",
        `What is the sum of the interior angles of a polygon with ${n} sides?`,
        ans,
        `Sum of interior angles = (n − 2) × 180° = (${n} − 2) × 180° = ${fmt(ans)}°.`,
        { q: `${n} भुजाओं वाले बहुभुज के अंतः कोणों का योग कितना होता है?`, e: `अंतः कोणों का योग = (n − 2) × 180° = (${n} − 2) × 180° = ${fmt(ans)}°।` },
        r, "", "°",
      );
    }
    const ans = (n * (n - 3)) / 2;
    return numeric(
      id, AG, "easy",
      `How many diagonals does a polygon with ${n} sides have?`,
      ans,
      `Number of diagonals = n(n − 3)/2 = ${n} × ${n - 3} ÷ 2 = ${ans}.`,
      { q: `${n} भुजाओं वाले बहुभुज में कितने विकर्ण होते हैं?`, e: `विकर्णों की संख्या = n(n − 3)/2 = ${n} × ${n - 3} ÷ 2 = ${ans}।` },
      r,
    );
  }, (id, r) => {
    // The angles of a triangle add up to 180°.
    const [a, b] = until(() => {
      const [p, q] = [5 * rint(4, 17, r), 5 * rint(4, 17, r)];
      return p + q <= 160 && p !== q ? [p, q] : null;
    });
    const ans = 180 - a - b;
    return numeric(
      id, AG, "easy",
      `Two angles of a triangle measure ${a}° and ${b}°. What is the measure of the third angle?`,
      ans,
      `The angles of a triangle add up to 180°, so the third angle = 180° − ${a}° − ${b}° = ${ans}°.`,
      { q: `एक त्रिभुज के दो कोण ${a}° और ${b}° हैं। तीसरे कोण का माप कितना है?`, e: `त्रिभुज के तीनों कोणों का योग 180° होता है, अतः तीसरा कोण = 180° − ${a}° − ${b}° = ${ans}°।` },
      r, "", "°",
    );
  }, (id, r) => {
    // Distance formula on a Pythagorean triple.
    const [p, q, d] = pick(TRIPLES, r);
    const [dx, dy] = r() < 0.5 ? [p, q] : [q, p];
    const [x1, y1] = [rint(0, 9, r), rint(0, 9, r)];
    const [x2, y2] = [x1 + dx, y1 + dy];
    return numeric(
      id, AG, "easy",
      `What is the distance between the points ${pt(x1, y1)} and ${pt(x2, y2)}?`,
      d,
      `Distance = √[(${x2} − ${x1})² + (${y2} − ${y1})²] = √(${dx}² + ${dy}²) = √${dx * dx + dy * dy} = ${d} units.`,
      { q: `बिंदुओं ${pt(x1, y1)} और ${pt(x2, y2)} के बीच की दूरी कितनी है?`, e: `दूरी = √[(${x2} − ${x1})² + (${y2} − ${y1})²] = √(${dx}² + ${dy}²) = √${dx * dx + dy * dy} = ${d} इकाई।` },
      r, "", " units",
    );
  }, (id, r) => {
    // Values of trigonometric ratios at the standard angles.
    const parts = shuffle(TRIG, r).slice(0, rint(2, 3, r)).map(([name, n, d]) => ({ name, n, d, c: d * rint(1, 3, r) }));
    const expr = parts.map((p) => `${p.c === 1 ? "" : `${p.c} `}${p.name}`).join(" + ");
    const total = sum(parts.map((p) => (p.c * p.n) / p.d));
    const values = parts.map((p) => `${p.name} = ${frac(p.n, p.d)}`).join(", ");
    const work = parts.map((p) => (p.c === 1 ? frac(p.n, p.d) : `${p.c} × ${frac(p.n, p.d)}`)).join(" + ");
    return numeric(
      id, AG, "easy",
      `What is the value of ${expr}?`,
      total,
      `${values}. So the value = ${work} = ${total}.`,
      { q: `${expr} का मान क्या है?`, e: `${values}। अतः मान = ${work} = ${total}।` },
      r,
    );
  }),

  moderate: either((id, r) => {
    // Two equations in two unknowns, in word form.
    const [p, n] = [rint(4, 15, r), 5 * rint(4, 12, r)];
    const [a, b, c, d] = until(() => {
      const k = [rint(2, 6, r), rint(2, 6, r), rint(2, 6, r), rint(2, 6, r)];
      return k[0] * k[3] !== k[1] * k[2] ? k : null;
    });
    const [X, Y] = [a * p + b * n, c * p + d * n];
    const pen = r() < 0.5;
    return numeric(
      id, AG, "moderate",
      `The cost of ${a} pens and ${b} notebooks is ₹${fmt(X)}, and the cost of ${c} pens and ${d} notebooks is ₹${fmt(Y)}. What is the cost of one ${pen ? "pen" : "notebook"}?`,
      pen ? p : n,
      `Let a pen cost ₹p and a notebook ₹n. Then ${a}p + ${b}n = ${fmt(X)} and ${c}p + ${d}n = ${fmt(Y)}. Multiply the first by ${c} and the second by ${a} and subtract: ${Math.abs(b * c - a * d)}n = ${fmt(Math.abs(c * X - a * Y))}, so n = ${n}. Then ${a}p = ${fmt(X)} − ${b} × ${n} = ${a * p}, so p = ${p}. One ${pen ? "pen" : "notebook"} costs ₹${pen ? p : n}.`,
      {
        q: `${a} पेन और ${b} कॉपियों का मूल्य ₹${fmt(X)} है, तथा ${c} पेन और ${d} कॉपियों का मूल्य ₹${fmt(Y)} है। एक ${pen ? "पेन" : "कॉपी"} का मूल्य कितना है?`,
        e: `माना एक पेन का मूल्य ₹p और एक कॉपी का मूल्य ₹n है। तब ${a}p + ${b}n = ${fmt(X)} और ${c}p + ${d}n = ${fmt(Y)}। पहले समीकरण को ${c} से और दूसरे को ${a} से गुणा करके घटाने पर: ${Math.abs(b * c - a * d)}n = ${fmt(Math.abs(c * X - a * Y))}, अतः n = ${n}। फिर ${a}p = ${fmt(X)} − ${b} × ${n} = ${a * p}, अतः p = ${p}। एक ${pen ? "पेन" : "कॉपी"} का मूल्य ₹${pen ? p : n} है।`,
      },
      r, "₹",
    );
  }, (id, r) => {
    // Sum and difference of two numbers.
    const [small, gap] = [rint(8, 60, r), rint(3, 40, r)];
    const big = small + gap;
    const larger = r() < 0.5;
    return numeric(
      id, AG, "moderate",
      `The sum of two numbers is ${small + big} and their difference is ${gap}. What is the ${larger ? "larger" : "smaller"} number?`,
      larger ? big : small,
      `Let the numbers be x and y with x + y = ${small + big} and x − y = ${gap}. Adding, 2x = ${small + big + gap}, so x = ${big}; then y = ${small + big} − ${big} = ${small}. The ${larger ? "larger" : "smaller"} number is ${larger ? big : small}.`,
      {
        q: `दो संख्याओं का योग ${small + big} और उनका अंतर ${gap} है। ${larger ? "बड़ी" : "छोटी"} संख्या कौन-सी है?`,
        e: `माना संख्याएँ x और y हैं, जहाँ x + y = ${small + big} और x − y = ${gap}। जोड़ने पर 2x = ${small + big + gap}, अतः x = ${big}; तब y = ${small + big} − ${big} = ${small}। ${larger ? "बड़ी" : "छोटी"} संख्या ${larger ? big : small} है।`,
      },
      r,
    );
  }, (id, r) => {
    // a² + b² from a + b and ab.
    const a = rint(2, 12, r);
    const b = until(() => {
      const v = rint(1, 12, r);
      return v !== a ? v : null;
    });
    const [s, p] = [a + b, a * b];
    const ans = s * s - 2 * p;
    return numeric(
      id, AG, "moderate",
      `If a + b = ${s} and ab = ${p}, what is the value of a² + b²?`,
      ans,
      `a² + b² = (a + b)² − 2ab = ${s}² − 2 × ${p} = ${s * s} − ${2 * p} = ${ans}.`,
      { q: `यदि a + b = ${s} और ab = ${p} है, तो a² + b² का मान क्या है?`, e: `a² + b² = (a + b)² − 2ab = ${s}² − 2 × ${p} = ${s * s} − ${2 * p} = ${ans}।` },
      r,
    );
  }, (id, r) => {
    // x ± 1/x → x² + 1/x².
    const k = rint(3, 15, r);
    const plus = r() < 0.6;
    const ans = plus ? k * k - 2 : k * k + 2;
    const s = plus ? "+" : "−";
    return numeric(
      id, AG, "moderate",
      `If x ${s} 1/x = ${k}, what is the value of x² + 1/x²?`,
      ans,
      `Squaring, x² + 1/x² ${s} 2 = ${k}² = ${k * k}, so x² + 1/x² = ${k * k} ${plus ? "−" : "+"} 2 = ${ans}.`,
      { q: `यदि x ${s} 1/x = ${k} है, तो x² + 1/x² का मान क्या है?`, e: `वर्ग करने पर x² + 1/x² ${s} 2 = ${k}² = ${k * k}, अतः x² + 1/x² = ${k * k} ${plus ? "−" : "+"} 2 = ${ans}।` },
      r,
    );
  }, (id, r) => {
    // Regular polygon: sides from one angle.
    const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36], r);
    const ext = 360 / n;
    const exterior = r() < 0.5;
    return numeric(
      id, AG, "moderate",
      `Each ${exterior ? "exterior" : "interior"} angle of a regular polygon measures ${exterior ? ext : 180 - ext}°. How many sides does the polygon have?`,
      n,
      exterior
        ? `The exterior angles of any polygon add up to 360°, so the number of sides = 360° ÷ ${ext}° = ${n}.`
        : `Each exterior angle = 180° − ${180 - ext}° = ${ext}°. The exterior angles add up to 360°, so the number of sides = 360° ÷ ${ext}° = ${n}.`,
      {
        q: `एक सम बहुभुज का प्रत्येक ${exterior ? "बाह्य" : "अंतः"} कोण ${exterior ? ext : 180 - ext}° है। बहुभुज की कितनी भुजाएँ हैं?`,
        e: exterior
          ? `किसी भी बहुभुज के बाह्य कोणों का योग 360° होता है, अतः भुजाओं की संख्या = 360° ÷ ${ext}° = ${n}।`
          : `प्रत्येक बाह्य कोण = 180° − ${180 - ext}° = ${ext}°। बाह्य कोणों का योग 360° होता है, अतः भुजाओं की संख्या = 360° ÷ ${ext}° = ${n}।`,
      },
      r,
    );
  }, (id, r) => {
    // Coordinate geometry: slope and midpoint.
    const [x1, y1] = [rint(0, 9, r), rint(0, 9, r)];
    if (r() < 0.5) {
      const [dx, dy] = until(() => {
        const v = [rint(1, 6, r), rint(1, 9, r)];
        return v[0] !== v[1] ? v : null;
      });
      const [x2, y2] = [x1 + dx, y1 + dy];
      const ans = frac(dy, dx);
      const wrong = [frac(dx, dy), frac(dy + dx, dx), frac(dy, dx + 1), frac(dy + 1, dx), frac(2 * dy, dx), frac(dy, 2 * dx), frac(dx + dy, dy)];
      return choice(
        id, AG, "moderate",
        `What is the slope of the line passing through the points ${pt(x1, y1)} and ${pt(x2, y2)}?`,
        ans,
        shuffle(wrong, r),
        `Slope = (y₂ − y₁)/(x₂ − x₁) = (${y2} − ${y1})/(${x2} − ${x1}) = ${dy}/${dx}${ans === `${dy}/${dx}` ? "" : ` = ${ans}`}.`,
        {
          q: `बिंदुओं ${pt(x1, y1)} और ${pt(x2, y2)} से होकर जाने वाली रेखा की ढाल (प्रवणता) क्या है?`,
          e: `ढाल = (y₂ − y₁)/(x₂ − x₁) = (${y2} − ${y1})/(${x2} − ${x1}) = ${dy}/${dx}${ans === `${dy}/${dx}` ? "" : ` = ${ans}`}।`,
        },
        r,
      );
    }
    const [i, j] = until(() => {
      const v = [rint(1, 5, r), rint(1, 5, r)];
      return v[0] !== v[1] ? v : null;
    });
    const [x2, y2] = [x1 + 2 * i, y1 + 2 * j];
    const [mx, my] = [x1 + i, y1 + j];
    const wrong = [pt(my, mx), pt(i, j), pt(x1 + x2, y1 + y2), pt(mx + 1, my), pt(mx, my + 1), pt(mx + 1, my + 1)];
    return choice(
      id, AG, "moderate",
      `What is the midpoint of the line segment joining the points ${pt(x1, y1)} and ${pt(x2, y2)}?`,
      pt(mx, my),
      shuffle(wrong, r),
      `Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = ${pt(mx, my)}.`,
      {
        q: `बिंदुओं ${pt(x1, y1)} और ${pt(x2, y2)} को मिलाने वाले रेखाखंड का मध्य बिंदु क्या है?`,
        e: `मध्य बिंदु = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = ${pt(mx, my)}।`,
      },
      r,
    );
  }, (id, r) => {
    // Chord of a circle: the perpendicular from the centre bisects it.
    const [p, q, c] = pick(TRIPLES, r);
    const [half, dist] = r() < 0.5 ? [p, q] : [q, p];
    if (r() < 0.5) {
      return numeric(
        id, AG, "moderate",
        `A chord of length ${2 * half} cm is drawn in a circle of radius ${c} cm. What is the distance of the chord from the centre?`,
        dist,
        `The perpendicular from the centre bisects the chord, so half the chord = ${half} cm. Distance = √(${c}² − ${half}²) = √${dist * dist} = ${dist} cm.`,
        {
          q: `${c} सेमी त्रिज्या वाले वृत्त में ${2 * half} सेमी लंबी एक जीवा खींची गई है। केंद्र से जीवा की दूरी कितनी है?`,
          e: `केंद्र से डाला गया लंब जीवा को समद्विभाजित करता है, अतः आधी जीवा = ${half} सेमी। दूरी = √(${c}² − ${half}²) = √${dist * dist} = ${dist} सेमी।`,
        },
        r, "", " cm",
      );
    }
    return numeric(
      id, AG, "moderate",
      `A chord of a circle of radius ${c} cm is at a distance of ${dist} cm from the centre. What is the length of the chord?`,
      2 * half,
      `Half the chord = √(${c}² − ${dist}²) = √${half * half} = ${half} cm, so the chord = 2 × ${half} = ${2 * half} cm.`,
      {
        q: `${c} सेमी त्रिज्या वाले वृत्त की एक जीवा केंद्र से ${dist} सेमी की दूरी पर है। जीवा की लंबाई कितनी है?`,
        e: `आधी जीवा = √(${c}² − ${dist}²) = √${half * half} = ${half} सेमी, अतः जीवा = 2 × ${half} = ${2 * half} सेमी।`,
      },
      r, "", " cm",
    );
  }, (id, r) => {
    // Tangent from an external point.
    const [p, q, c] = pick(TRIPLES, r);
    const [rad, t] = r() < 0.5 ? [p, q] : [q, p];
    return numeric(
      id, AG, "moderate",
      `A point P is ${c} cm away from the centre of a circle of radius ${rad} cm. What is the length of the tangent drawn from P to the circle?`,
      t,
      `The tangent is perpendicular to the radius at the point of contact, so tangent = √(${c}² − ${rad}²) = √${t * t} = ${t} cm.`,
      {
        q: `एक बिंदु P, ${rad} सेमी त्रिज्या वाले वृत्त के केंद्र से ${c} सेमी दूर है। P से वृत्त पर खींची गई स्पर्श रेखा की लंबाई कितनी है?`,
        e: `स्पर्श बिंदु पर स्पर्श रेखा त्रिज्या पर लंब होती है, अतः स्पर्श रेखा = √(${c}² − ${rad}²) = √${t * t} = ${t} सेमी।`,
      },
      r, "", " cm",
    );
  }, (id, r) => {
    // A ladder against a wall: cos 60° = sin 30° = 1/2.
    const d = rint(2, 15, r);
    if (r() < 0.5) {
      return numeric(
        id, AG, "moderate",
        `A ladder leaning against a wall makes an angle of 60° with the ground. If the foot of the ladder is ${d} m away from the wall, what is the length of the ladder?`,
        2 * d,
        `cos 60° = distance from the wall ÷ length of the ladder, so 1/2 = ${d} ÷ length and the length = ${2 * d} m.`,
        {
          q: `दीवार के सहारे टिकी एक सीढ़ी भूमि के साथ 60° का कोण बनाती है। यदि सीढ़ी का पाद दीवार से ${d} मीटर दूर है, तो सीढ़ी की लंबाई कितनी है?`,
          e: `cos 60° = दीवार से दूरी ÷ सीढ़ी की लंबाई, अतः 1/2 = ${d} ÷ लंबाई और लंबाई = ${2 * d} मीटर।`,
        },
        r, "", " m",
      );
    }
    return numeric(
      id, AG, "moderate",
      `A ${2 * d} m long ladder leaning against a wall makes an angle of 30° with the ground. How high up the wall does the ladder reach?`,
      d,
      `sin 30° = height ÷ length of the ladder, so height = ${2 * d} × 1/2 = ${d} m.`,
      {
        q: `दीवार के सहारे टिकी ${2 * d} मीटर लंबी एक सीढ़ी भूमि के साथ 30° का कोण बनाती है। सीढ़ी दीवार पर कितनी ऊँचाई तक पहुँचती है?`,
        e: `sin 30° = ऊँचाई ÷ सीढ़ी की लंबाई, अतः ऊँचाई = ${2 * d} × 1/2 = ${d} मीटर।`,
      },
      r, "", " m",
    );
  }),

  hard: either((id, r) => {
    // Heron's formula, on triangles whose area is a whole number.
    const k = pick([1, 1, 2, 3], r);
    const [a, b, c] = pick(HERON, r).map((x) => x * k);
    const s = (a + b + c) / 2;
    const prod = s * (s - a) * (s - b) * (s - c);
    const ans = Math.round(Math.sqrt(prod));
    return numeric(
      id, AG, "hard",
      `The sides of a triangle are ${a} cm, ${b} cm and ${c} cm. What is its area?`,
      ans,
      `s = (${a} + ${b} + ${c})/2 = ${s}. Area = √[s(s − a)(s − b)(s − c)] = √(${s} × ${s - a} × ${s - b} × ${s - c}) = √${prod} = ${fmt(ans)} cm².`,
      {
        q: `एक त्रिभुज की भुजाएँ ${a} सेमी, ${b} सेमी और ${c} सेमी हैं। उसका क्षेत्रफल कितना है?`,
        e: `s = (${a} + ${b} + ${c})/2 = ${s}। क्षेत्रफल = √[s(s − a)(s − b)(s − c)] = √(${s} × ${s - a} × ${s - b} × ${s - c}) = √${prod} = ${fmt(ans)} वर्ग सेमी।`,
      },
      r, "", " cm²",
    );
  }, (id, r) => {
    // Similar triangles: areas are in the ratio of the squares of the sides.
    const [p, q] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [1, 2], [1, 3], [5, 6], [4, 7], [3, 2], [5, 3], [4, 3], [5, 2], [2, 1], [3, 1], [7, 4]], r);
    const k = rint(2, 9, r);
    const [given, ans] = [p * p * k, q * q * k];
    return numeric(
      id, AG, "hard",
      `Triangles ABC and PQR are similar and AB : PQ = ${p} : ${q}. If the area of triangle ABC is ${given} cm², what is the area of triangle PQR?`,
      ans,
      `Areas of similar triangles are in the ratio of the squares of corresponding sides: ${given} : area of PQR = ${p}² : ${q}² = ${p * p} : ${q * q}. So area of PQR = ${given} × ${q * q} ÷ ${p * p} = ${ans} cm².`,
      {
        q: `त्रिभुज ABC और PQR समरूप हैं तथा AB : PQ = ${p} : ${q} है। यदि त्रिभुज ABC का क्षेत्रफल ${given} वर्ग सेमी है, तो त्रिभुज PQR का क्षेत्रफल कितना है?`,
        e: `समरूप त्रिभुजों के क्षेत्रफलों का अनुपात संगत भुजाओं के वर्गों के अनुपात के बराबर होता है: ${given} : PQR का क्षेत्रफल = ${p}² : ${q}² = ${p * p} : ${q * q}। अतः PQR का क्षेत्रफल = ${given} × ${q * q} ÷ ${p * p} = ${ans} वर्ग सेमी।`,
      },
      r, "", " cm²",
    );
  }, (id, r) => {
    // x + 1/x → x³ + 1/x³.
    const k = rint(3, 9, r);
    const ans = k ** 3 - 3 * k;
    return numeric(
      id, AG, "hard",
      `If x + 1/x = ${k}, what is the value of x³ + 1/x³?`,
      ans,
      `x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${k}³ − 3 × ${k} = ${k ** 3} − ${3 * k} = ${ans}.`,
      { q: `यदि x + 1/x = ${k} है, तो x³ + 1/x³ का मान क्या है?`, e: `x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${k}³ − 3 × ${k} = ${k ** 3} − ${3 * k} = ${ans}।` },
      r,
    );
  }, (id, r) => {
    // a³ + b³ from a + b and ab.
    const a = rint(2, 9, r);
    const b = until(() => {
      const v = rint(1, 9, r);
      return v !== a ? v : null;
    });
    const [s, p] = [a + b, a * b];
    const ans = s ** 3 - 3 * p * s;
    return numeric(
      id, AG, "hard",
      `If a + b = ${s} and ab = ${p}, what is the value of a³ + b³?`,
      ans,
      `a³ + b³ = (a + b)³ − 3ab(a + b) = ${s}³ − 3 × ${p} × ${s} = ${fmt(s ** 3)} − ${fmt(3 * p * s)} = ${fmt(ans)}.`,
      { q: `यदि a + b = ${s} और ab = ${p} है, तो a³ + b³ का मान क्या है?`, e: `a³ + b³ = (a + b)³ − 3ab(a + b) = ${s}³ − 3 × ${p} × ${s} = ${fmt(s ** 3)} − ${fmt(3 * p * s)} = ${fmt(ans)}।` },
      r,
    );
  }, (id, r) => {
    // Sum and product of the roots of a quadratic.
    const p = rint(1, 9, r);
    const q = until(() => {
      const v = rint(2, 9, r);
      return v !== p ? v : null;
    });
    const [S, P] = [p + q, p * q];
    const eq = `x² − ${S}x + ${P} = 0`;
    if (r() < 0.5) {
      const ans = S * S - 2 * P;
      return numeric(
        id, AG, "hard",
        `If α and β are the roots of the equation ${eq}, what is the value of α² + β²?`,
        ans,
        `α + β = ${S} and αβ = ${P}. α² + β² = (α + β)² − 2αβ = ${S * S} − ${2 * P} = ${ans}.`,
        { q: `यदि α और β समीकरण ${eq} के मूल हैं, तो α² + β² का मान क्या है?`, e: `α + β = ${S} और αβ = ${P}। α² + β² = (α + β)² − 2αβ = ${S * S} − ${2 * P} = ${ans}।` },
        r,
      );
    }
    const ans = frac(S, P);
    const wrong = [frac(P, S), frac(S, P + 1), frac(S + 1, P), `${S}`, frac(S * S - 2 * P, P), frac(1, P), frac(S, 2 * P), frac(2 * S, P)];
    return choice(
      id, AG, "hard",
      `If α and β are the roots of the equation ${eq}, what is the value of 1/α + 1/β?`,
      ans,
      shuffle(wrong, r),
      `α + β = ${S} and αβ = ${P}. 1/α + 1/β = (α + β)/αβ = ${S}/${P}${ans === `${S}/${P}` ? "" : ` = ${ans}`}.`,
      { q: `यदि α और β समीकरण ${eq} के मूल हैं, तो 1/α + 1/β का मान क्या है?`, e: `α + β = ${S} और αβ = ${P}। 1/α + 1/β = (α + β)/αβ = ${S}/${P}${ans === `${S}/${P}` ? "" : ` = ${ans}`}।` },
      r,
    );
  }, (id, r) => {
    // Heights and distances with one angle of 30° or 60°.
    const len = 3 * pick([4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 20, 25, 30], r);
    const ang = pick([30, 60], r);
    const third = `${len / 3}√3 m`;
    const full = `${len}√3 m`;
    if (r() < 0.5) {
      const steep = ang === 60;
      return lengths(
        id, "hard",
        `From a point on the ground ${len} m away from the foot of a tower, the angle of elevation of the top of the tower is ${ang}°. What is the height of the tower?`,
        steep ? full : third, len,
        steep
          ? `tan 60° = height ÷ ${len}, so height = ${len} × √3 = ${full}.`
          : `tan 30° = height ÷ ${len}, so height = ${len} ÷ √3 = ${len}√3/3 = ${third}.`,
        {
          q: `भूमि पर स्थित एक बिंदु से, जो एक मीनार के पाद से ${len} मीटर दूर है, मीनार के शिखर का उन्नयन कोण ${ang}° है। मीनार की ऊँचाई कितनी है?`,
          e: steep
            ? `tan 60° = ऊँचाई ÷ ${len}, अतः ऊँचाई = ${len} × √3 = ${len}√3 मीटर।`
            : `tan 30° = ऊँचाई ÷ ${len}, अतः ऊँचाई = ${len} ÷ √3 = ${len}√3/3 = ${len / 3}√3 मीटर।`,
        },
        r,
      );
    }
    const steep = ang === 60;
    return lengths(
      id, "hard",
      `The angle of elevation of the top of a ${len} m high tower from a point on the ground is ${ang}°. How far is the point from the foot of the tower?`,
      steep ? third : full, len,
      steep
        ? `tan 60° = ${len} ÷ distance, so distance = ${len} ÷ √3 = ${len}√3/3 = ${third}.`
        : `tan 30° = ${len} ÷ distance, so distance = ${len} × √3 = ${full}.`,
      {
        q: `भूमि पर स्थित एक बिंदु से ${len} मीटर ऊँची मीनार के शिखर का उन्नयन कोण ${ang}° है। वह बिंदु मीनार के पाद से कितनी दूर है?`,
        e: steep
          ? `tan 60° = ${len} ÷ दूरी, अतः दूरी = ${len} ÷ √3 = ${len}√3/3 = ${len / 3}√3 मीटर।`
          : `tan 30° = ${len} ÷ दूरी, अतः दूरी = ${len} × √3 = ${len}√3 मीटर।`,
      },
      r,
    );
  }, (id, r) => {
    // Area of a triangle from its vertices; centroid.
    if (r() < 0.6) {
      const v = until(() => {
        const c = Array.from({ length: 6 }, () => rint(0, 9, r));
        const twice = Math.abs(c[0] * (c[3] - c[5]) + c[2] * (c[5] - c[1]) + c[4] * (c[1] - c[3]));
        return twice >= 8 && twice % 2 === 0 ? c : null;
      });
      const [x1, y1, x2, y2, x3, y3] = v;
      const inner = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);
      const ans = Math.abs(inner) / 2;
      const b = (n: number) => (n < 0 ? `(−${-n})` : `${n}`);
      const work = `½ |${x1} × ${b(y2 - y3)} + ${x2} × ${b(y3 - y1)} + ${x3} × ${b(y1 - y2)}| = ½ × ${Math.abs(inner)} = ${ans}`;
      return numeric(
        id, AG, "hard",
        `What is the area of the triangle whose vertices are ${pt(x1, y1)}, ${pt(x2, y2)} and ${pt(x3, y3)}?`,
        ans,
        `Area = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)| = ${work} sq units.`,
        {
          q: `उस त्रिभुज का क्षेत्रफल कितना है जिसके शीर्ष ${pt(x1, y1)}, ${pt(x2, y2)} और ${pt(x3, y3)} हैं?`,
          e: `क्षेत्रफल = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)| = ${work} वर्ग इकाई।`,
        },
        r, "", " sq units",
      );
    }
    const v = until(() => {
      const c = Array.from({ length: 6 }, () => rint(0, 12, r));
      const twice = Math.abs(c[0] * (c[3] - c[5]) + c[2] * (c[5] - c[1]) + c[4] * (c[1] - c[3]));
      const [sx, sy] = [c[0] + c[2] + c[4], c[1] + c[3] + c[5]];
      return twice > 0 && sx % 3 === 0 && sy % 3 === 0 && sx !== sy ? c : null;
    });
    const [x1, y1, x2, y2, x3, y3] = v;
    const [gx, gy] = [(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3];
    const wrong = [pt(gy, gx), pt(gx + 1, gy), pt(gx, gy + 1), pt(x1 + x2 + x3, y1 + y2 + y3), pt(gx + 1, gy + 1), pt(gx + 2, gy)];
    return choice(
      id, AG, "hard",
      `What is the centroid of the triangle whose vertices are ${pt(x1, y1)}, ${pt(x2, y2)} and ${pt(x3, y3)}?`,
      pt(gx, gy),
      shuffle(wrong, r),
      `Centroid = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3) = (${x1 + x2 + x3}/3, ${y1 + y2 + y3}/3) = ${pt(gx, gy)}.`,
      {
        q: `उस त्रिभुज का केंद्रक क्या है जिसके शीर्ष ${pt(x1, y1)}, ${pt(x2, y2)} और ${pt(x3, y3)} हैं?`,
        e: `केंद्रक = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3) = (${x1 + x2 + x3}/3, ${y1 + y2 + y3}/3) = ${pt(gx, gy)}।`,
      },
      r,
    );
  }, (id, r) => {
    // Angles at the centres of a triangle.
    const A = 2 * rint(20, 42, r);
    const kind = pick(["incentre", "circumcentre", "orthocentre"] as const, r);
    const { letter, ans, en, hiName, hiE } = {
      incentre: { letter: "I", ans: 90 + A / 2, en: `∠BIC = 90° + ∠A/2 = 90° + ${A / 2}° = ${90 + A / 2}°`, hiName: "अंतःकेंद्र", hiE: `∠BIC = 90° + ∠A/2 = 90° + ${A / 2}° = ${90 + A / 2}°` },
      circumcentre: { letter: "O", ans: 2 * A, en: `The angle at the centre is twice the angle at the circumference: ∠BOC = 2∠A = 2 × ${A}° = ${2 * A}°`, hiName: "परिकेंद्र", hiE: `केंद्र पर बना कोण परिधि पर बने कोण का दुगुना होता है: ∠BOC = 2∠A = 2 × ${A}° = ${2 * A}°` },
      orthocentre: { letter: "H", ans: 180 - A, en: `∠BHC = 180° − ∠A = 180° − ${A}° = ${180 - A}°`, hiName: "लंबकेंद्र", hiE: `∠BHC = 180° − ∠A = 180° − ${A}° = ${180 - A}°` },
    }[kind];
    return numeric(
      id, AG, "hard",
      `In an acute-angled triangle ABC, ∠A = ${A}°. If ${letter} is the ${kind} of the triangle, what is the measure of ∠B${letter}C?`,
      ans,
      `${en}.`,
      { q: `एक न्यूनकोण त्रिभुज ABC में ∠A = ${A}° है। यदि ${letter} त्रिभुज का ${hiName} है, तो ∠B${letter}C का माप कितना है?`, e: `${hiE}।` },
      r, "", "°",
    );
  }, (id, r) => {
    // tan θ from a Pythagorean triple → sin θ + cos θ.
    const [p, q, h] = pick(TRIPLES.slice(0, 5), r);
    const [a, b] = r() < 0.5 ? [p, q] : [q, p];
    const ans = frac(a + b, h);
    const wrong = [frac(a, h), frac(b, h), frac(h, a + b), frac(Math.abs(a - b), h), frac(a + b, a), frac(a + b, b), frac(a * b, h)];
    return choice(
      id, AG, "hard",
      `If tan θ = ${a}/${b} and θ is an acute angle, what is the value of sin θ + cos θ?`,
      ans,
      shuffle(wrong, r),
      `Take the perpendicular as ${a} and the base as ${b}; hypotenuse = √(${a}² + ${b}²) = ${h}. So sin θ = ${a}/${h} and cos θ = ${b}/${h}, and sin θ + cos θ = ${ans}.`,
      {
        q: `यदि tan θ = ${a}/${b} है और θ एक न्यून कोण है, तो sin θ + cos θ का मान क्या है?`,
        e: `लंब ${a} और आधार ${b} लेने पर कर्ण = √(${a}² + ${b}²) = ${h}। अतः sin θ = ${a}/${h} और cos θ = ${b}/${h}, तथा sin θ + cos θ = ${ans}।`,
      },
      r,
    );
  }),

  "very-hard": either((id, r) => {
    // Heights and distances with two angles.
    const kind = pick(["points", "shadow", "boats", "building"] as const, r);
    if (kind === "points" || kind === "shadow") {
      const d = 2 * rint(5, 60, r);
      const ans = `${d / 2}√3 m`;
      const points = kind === "points";
      const what = points ? "tower" : "pole";
      const whatHi = points ? "मीनार" : "खंभे";
      return lengths(
        id, "very-hard",
        points
          ? `The angles of elevation of the top of a tower from two points on the ground, on the same side of the tower and in line with its foot, are 30° and 60°. If the two points are ${d} m apart, what is the height of the tower?`
          : `The shadow of a vertical pole becomes ${d} m longer when the sun’s angle of elevation falls from 60° to 30°. What is the height of the pole?`,
        ans, d,
        `Let the height be h. The two distances from the foot of the ${what} are h/tan 30° = h√3 and h/tan 60° = h/√3. Their difference is h√3 − h/√3 = 2h/√3 = ${d}, so h = ${d}√3/2 = ${ans}.`,
        {
          q: points
            ? `भूमि पर स्थित दो बिंदुओं से, जो एक मीनार के एक ही ओर तथा उसके पाद की सीध में हैं, मीनार के शिखर के उन्नयन कोण 30° और 60° हैं। यदि दोनों बिंदुओं के बीच की दूरी ${d} मीटर है, तो मीनार की ऊँचाई कितनी है?`
            : `जब सूर्य का उन्नयन कोण 60° से घटकर 30° हो जाता है, तो एक ऊर्ध्वाधर खंभे की छाया ${d} मीटर लंबी हो जाती है। खंभे की ऊँचाई कितनी है?`,
          e: `माना ऊँचाई h है। ${whatHi} के पाद से दोनों दूरियाँ h/tan 30° = h√3 और h/tan 60° = h/√3 हैं। इनका अंतर h√3 − h/√3 = 2h/√3 = ${d}, अतः h = ${d}√3/2 = ${d / 2}√3 मीटर।`,
        },
        r,
      );
    }
    if (kind === "boats") {
      const h = 3 * rint(4, 40, r);
      const ans = `${(2 * h) / 3}√3 m`;
      return lengths(
        id, "very-hard",
        `From the top of a ${h} m high cliff, the angles of depression of two boats on the same side of the cliff and in line with its foot are 30° and 60°. What is the distance between the two boats?`,
        ans, h,
        `The boats are ${h}/tan 30° = ${h}√3 m and ${h}/tan 60° = ${h}/√3 = ${h / 3}√3 m from the foot of the cliff. Distance between them = ${h}√3 − ${h / 3}√3 = ${ans}.`,
        {
          q: `${h} मीटर ऊँची एक चट्टान के शिखर से, चट्टान के एक ही ओर तथा उसके पाद की सीध में स्थित दो नावों के अवनमन कोण 30° और 60° हैं। दोनों नावों के बीच की दूरी कितनी है?`,
          e: `चट्टान के पाद से नावों की दूरियाँ ${h}/tan 30° = ${h}√3 मीटर और ${h}/tan 60° = ${h}/√3 = ${h / 3}√3 मीटर हैं। उनके बीच की दूरी = ${h}√3 − ${h / 3}√3 = ${(2 * h) / 3}√3 मीटर।`,
        },
        r,
      );
    }
    const h = rint(8, 80, r);
    const ans = `${h}(√3 + 1) m`;
    return lengths(
      id, "very-hard",
      `From the top of a ${h} m high building, the angle of depression of the foot of a tower is 45° and the angle of elevation of the top of the tower is 60°. What is the height of the tower?`,
      ans, h,
      `The angle of depression of the foot is 45°, so the tower is ${h} m away from the building. The top of the tower is ${h} × tan 60° = ${h}√3 m above the top of the building. Height of the tower = ${h} + ${h}√3 = ${ans}.`,
      {
        q: `${h} मीटर ऊँचे एक भवन के शिखर से एक मीनार के पाद का अवनमन कोण 45° और मीनार के शिखर का उन्नयन कोण 60° है। मीनार की ऊँचाई कितनी है?`,
        e: `पाद का अवनमन कोण 45° है, अतः मीनार भवन से ${h} मीटर दूर है। मीनार का शिखर भवन के शिखर से ${h} × tan 60° = ${h}√3 मीटर ऊपर है। मीनार की ऊँचाई = ${h} + ${h}√3 = ${h}(√3 + 1) मीटर।`,
      },
      r, [`${h}(√3 − 1) m`],
    );
  }, (id, r) => {
    // Higher powers from x ± 1/x.
    if (r() < 0.5) {
      const k = rint(3, 7, r);
      const sq = k * k - 2;
      const ans = sq * sq - 2;
      return numeric(
        id, AG, "very-hard",
        `If x + 1/x = ${k}, what is the value of x⁴ + 1/x⁴?`,
        ans,
        `x² + 1/x² = ${k}² − 2 = ${sq}. Squaring again, x⁴ + 1/x⁴ = ${sq}² − 2 = ${fmt(sq * sq)} − 2 = ${fmt(ans)}.`,
        { q: `यदि x + 1/x = ${k} है, तो x⁴ + 1/x⁴ का मान क्या है?`, e: `x² + 1/x² = ${k}² − 2 = ${sq}। पुनः वर्ग करने पर x⁴ + 1/x⁴ = ${sq}² − 2 = ${fmt(sq * sq)} − 2 = ${fmt(ans)}।` },
        r,
      );
    }
    const k = rint(2, 9, r);
    const ans = k ** 3 + 3 * k;
    return numeric(
      id, AG, "very-hard",
      `If x − 1/x = ${k}, what is the value of x³ − 1/x³?`,
      ans,
      `x³ − 1/x³ = (x − 1/x)³ + 3(x − 1/x) = ${k}³ + 3 × ${k} = ${k ** 3} + ${3 * k} = ${ans}.`,
      { q: `यदि x − 1/x = ${k} है, तो x³ − 1/x³ का मान क्या है?`, e: `x³ − 1/x³ = (x − 1/x)³ + 3(x − 1/x) = ${k}³ + 3 × ${k} = ${k ** 3} + ${3 * k} = ${ans}।` },
      r,
    );
  }, (id, r) => {
    // Three-variable identities.
    const [a, b, c] = until(() => {
      const v = [rint(1, 9, r), rint(1, 9, r), rint(1, 9, r)];
      return new Set(v).size > 1 ? v : null;
    });
    const s = a + b + c;
    const q = a * b + b * c + c * a;
    const t = a * a + b * b + c * c;
    const kind = pick(["squares", "products", "cubes"] as const, r);
    if (kind === "squares") {
      return numeric(
        id, AG, "very-hard",
        `If a + b + c = ${s} and ab + bc + ca = ${q}, what is the value of a² + b² + c²?`,
        t,
        `a² + b² + c² = (a + b + c)² − 2(ab + bc + ca) = ${s}² − 2 × ${q} = ${s * s} − ${2 * q} = ${t}.`,
        { q: `यदि a + b + c = ${s} और ab + bc + ca = ${q} है, तो a² + b² + c² का मान क्या है?`, e: `a² + b² + c² = (a + b + c)² − 2(ab + bc + ca) = ${s}² − 2 × ${q} = ${s * s} − ${2 * q} = ${t}।` },
        r,
      );
    }
    if (kind === "products") {
      return numeric(
        id, AG, "very-hard",
        `If a + b + c = ${s} and a² + b² + c² = ${t}, what is the value of ab + bc + ca?`,
        q,
        `(a + b + c)² = a² + b² + c² + 2(ab + bc + ca), so ${s * s} = ${t} + 2(ab + bc + ca) and ab + bc + ca = (${s * s} − ${t}) ÷ 2 = ${q}.`,
        { q: `यदि a + b + c = ${s} और a² + b² + c² = ${t} है, तो ab + bc + ca का मान क्या है?`, e: `(a + b + c)² = a² + b² + c² + 2(ab + bc + ca), अतः ${s * s} = ${t} + 2(ab + bc + ca) और ab + bc + ca = (${s * s} − ${t}) ÷ 2 = ${q}।` },
        r,
      );
    }
    const ans = s * (t - q);
    return numeric(
      id, AG, "very-hard",
      `If a + b + c = ${s} and a² + b² + c² = ${t}, what is the value of a³ + b³ + c³ − 3abc?`,
      ans,
      `ab + bc + ca = (${s}² − ${t}) ÷ 2 = ${q}. a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca) = ${s} × (${t} − ${q}) = ${fmt(ans)}.`,
      {
        q: `यदि a + b + c = ${s} और a² + b² + c² = ${t} है, तो a³ + b³ + c³ − 3abc का मान क्या है?`,
        e: `ab + bc + ca = (${s}² − ${t}) ÷ 2 = ${q}। a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca) = ${s} × (${t} − ${q}) = ${fmt(ans)}।`,
      },
      r,
    );
  }, (id, r) => {
    // Quadratic equations: cubes of the roots, an unknown constant, equal roots.
    const kind = pick(["cubes", "constant", "equal"] as const, r);
    if (kind === "equal") {
      const m = rint(2, 15, r);
      return numeric(
        id, AG, "very-hard",
        `For what positive value of k does the equation x² − kx + ${m * m} = 0 have equal roots?`,
        2 * m,
        `Equal roots need the discriminant to be zero: k² − 4 × ${m * m} = 0, so k² = ${4 * m * m} and k = ${2 * m}.`,
        { q: `k के किस धनात्मक मान के लिए समीकरण x² − kx + ${m * m} = 0 के मूल बराबर होंगे?`, e: `बराबर मूलों के लिए विविक्तकर शून्य होना चाहिए: k² − 4 × ${m * m} = 0, अतः k² = ${4 * m * m} और k = ${2 * m}।` },
        r,
      );
    }
    const p = rint(2, 9, r);
    const q = until(() => {
      const v = rint(1, 9, r);
      return v !== p ? v : null;
    });
    const [S, P] = [p + q, p * q];
    if (kind === "constant") {
      return numeric(
        id, AG, "very-hard",
        `If one root of the equation x² − ${S}x + k = 0 is ${p}, what is the value of k?`,
        P,
        `The sum of the roots is ${S}, so the other root = ${S} − ${p} = ${q}. k = product of the roots = ${p} × ${q} = ${P}.`,
        { q: `यदि समीकरण x² − ${S}x + k = 0 का एक मूल ${p} है, तो k का मान क्या है?`, e: `मूलों का योग ${S} है, अतः दूसरा मूल = ${S} − ${p} = ${q}। k = मूलों का गुणनफल = ${p} × ${q} = ${P}।` },
        r,
      );
    }
    const ans = S ** 3 - 3 * P * S;
    return numeric(
      id, AG, "very-hard",
      `If α and β are the roots of the equation x² − ${S}x + ${P} = 0, what is the value of α³ + β³?`,
      ans,
      `α + β = ${S} and αβ = ${P}. α³ + β³ = (α + β)³ − 3αβ(α + β) = ${fmt(S ** 3)} − 3 × ${P} × ${S} = ${fmt(ans)}.`,
      { q: `यदि α और β समीकरण x² − ${S}x + ${P} = 0 के मूल हैं, तो α³ + β³ का मान क्या है?`, e: `α + β = ${S} और αβ = ${P}। α³ + β³ = (α + β)³ − 3αβ(α + β) = ${fmt(S ** 3)} − 3 × ${P} × ${S} = ${fmt(ans)}।` },
      r,
    );
  }, (id, r) => {
    // Two circles: direct common tangent and common chord.
    if (r() < 0.5) {
      const [R, s] = pick([[9, 4], [16, 9], [25, 4], [25, 9], [16, 4], [25, 16], [36, 25], [9, 1], [18, 8], [8, 2], [27, 3], [12, 3], [32, 2], [50, 2], [20, 5], [45, 5], [36, 16], [49, 4], [49, 9], [36, 4]], r);
      const ans = 2 * Math.round(Math.sqrt(R * s));
      return numeric(
        id, AG, "very-hard",
        `Two circles of radii ${R} cm and ${s} cm touch each other externally. What is the length of their direct common tangent?`,
        ans,
        `Distance between the centres = ${R} + ${s} = ${R + s} cm. Direct common tangent = √[d² − (R − r)²] = √(${R + s}² − ${R - s}²) = 2√(${R} × ${s}) = ${ans} cm.`,
        {
          q: `${R} सेमी और ${s} सेमी त्रिज्या वाले दो वृत्त एक-दूसरे को बाह्यतः स्पर्श करते हैं। उनकी सीधी उभयनिष्ठ स्पर्श रेखा की लंबाई कितनी है?`,
          e: `केंद्रों के बीच की दूरी = ${R} + ${s} = ${R + s} सेमी। सीधी उभयनिष्ठ स्पर्श रेखा = √[d² − (R − r)²] = √(${R + s}² − ${R - s}²) = 2√(${R} × ${s}) = ${ans} सेमी।`,
        },
        r, "", " cm",
      );
    }
    // The radii and the line of centres make a triangle; the common chord is twice its height.
    const [r1, r2, d, half] = pick([[13, 15, 14, 12], [10, 17, 21, 8], [17, 25, 28, 15], [13, 20, 21, 12], [15, 20, 25, 12], [25, 26, 17, 24], [13, 37, 40, 12], [15, 13, 4, 12], [20, 15, 7, 12], [17, 10, 9, 8], [25, 17, 12, 15], [26, 30, 28, 24], [20, 34, 42, 16], [30, 40, 50, 24]], r);
    const x = (d * d + r1 * r1 - r2 * r2) / (2 * d);
    return numeric(
      id, AG, "very-hard",
      `Two circles of radii ${r1} cm and ${r2} cm intersect at two points, and the distance between their centres is ${d} cm. What is the length of their common chord?`,
      2 * half,
      `The common chord is perpendicular to the line of centres. If it is x cm from the first centre, ${r1}² − x² = ${r2}² − (${d} − x)², which gives x = ${fmt(x)}. Half the chord = √(${r1}² − ${fmt(x)}²) = ${half} cm, so the chord = ${2 * half} cm.`,
      {
        q: `${r1} सेमी और ${r2} सेमी त्रिज्या वाले दो वृत्त एक-दूसरे को दो बिंदुओं पर काटते हैं और उनके केंद्रों के बीच की दूरी ${d} सेमी है। उनकी उभयनिष्ठ जीवा की लंबाई कितनी है?`,
        e: `उभयनिष्ठ जीवा केंद्रों को मिलाने वाली रेखा पर लंब होती है। यदि वह पहले केंद्र से x सेमी दूर है, तो ${r1}² − x² = ${r2}² − (${d} − x)², जिससे x = ${fmt(x)}। आधी जीवा = √(${r1}² − ${fmt(x)}²) = ${half} सेमी, अतः जीवा = ${2 * half} सेमी।`,
      },
      r, "", " cm",
    );
  }, (id, r) => {
    // A line cutting the axes: area of the triangle with the origin.
    const [a, b, k] = until(() => {
      const v = [rint(2, 9, r), rint(2, 9, r), rint(1, 4, r)];
      return v[0] !== v[1] && (v[0] * v[1] * v[2] * v[2]) % 2 === 0 ? v : null;
    });
    const c = a * b * k;
    const [px, py] = [c / a, c / b];
    const ans = (px * py) / 2;
    return numeric(
      id, AG, "very-hard",
      `The line ${a}x + ${b}y = ${c} meets the x-axis at A and the y-axis at B. If O is the origin, what is the area of triangle OAB?`,
      ans,
      `Put y = 0: x = ${c} ÷ ${a} = ${px}, so OA = ${px}. Put x = 0: y = ${c} ÷ ${b} = ${py}, so OB = ${py}. Area = ½ × ${px} × ${py} = ${fmt(ans)} sq units.`,
      {
        q: `रेखा ${a}x + ${b}y = ${c}, x-अक्ष को A पर और y-अक्ष को B पर मिलती है। यदि O मूल बिंदु है, तो त्रिभुज OAB का क्षेत्रफल कितना है?`,
        e: `y = 0 रखने पर x = ${c} ÷ ${a} = ${px}, अतः OA = ${px}। x = 0 रखने पर y = ${c} ÷ ${b} = ${py}, अतः OB = ${py}। क्षेत्रफल = ½ × ${px} × ${py} = ${fmt(ans)} वर्ग इकाई।`,
      },
      r, "", " sq units",
    );
  }, (id, r) => {
    // A ratio of sin and cos, found by dividing through by cos θ.
    const [p, q, m, n] = until(() => {
      const v = [rint(1, 6, r), rint(1, 6, r), rint(2, 7, r), rint(2, 7, r)];
      return gcd(v[0], v[1]) === 1 && v[0] !== v[1] && v[2] * v[0] - v[3] * v[1] > 0 && v[2] * v[1] !== v[3] * v[0] ? v : null;
    });
    const [top, bottom] = [m * p + n * q, m * p - n * q];
    const ans = frac(top, bottom);
    const wrong = [frac(bottom, top), frac(m * q + n * p, Math.abs(m * q - n * p)), frac(top + 1, bottom), frac(top, bottom + 1), frac(top, m * p), frac(m + n, m + n - 1), frac(top + bottom, bottom + 1), frac(top, bottom + 2)];
    const expr = `(${m} sin θ + ${n} cos θ)/(${m} sin θ − ${n} cos θ)`;
    return choice(
      id, AG, "very-hard",
      `If tan θ = ${p}/${q}, what is the value of ${expr}?`,
      ans,
      shuffle(wrong, r),
      `Divide the numerator and the denominator by cos θ: (${m} tan θ + ${n})/(${m} tan θ − ${n}) = (${m} × ${p}/${q} + ${n})/(${m} × ${p}/${q} − ${n}) = (${m * p} + ${n * q})/(${m * p} − ${n * q}) = ${top}/${bottom}${ans === `${top}/${bottom}` ? "" : ` = ${ans}`}.`,
      {
        q: `यदि tan θ = ${p}/${q} है, तो ${expr} का मान क्या है?`,
        e: `अंश और हर को cos θ से भाग देने पर: (${m} tan θ + ${n})/(${m} tan θ − ${n}) = (${m} × ${p}/${q} + ${n})/(${m} × ${p}/${q} − ${n}) = (${m * p} + ${n * q})/(${m * p} − ${n * q}) = ${top}/${bottom}${ans === `${top}/${bottom}` ? "" : ` = ${ans}`}।`,
      },
      r,
    );
  }),
};

// ---------------------------------------------------------------------------
// Data interpretation: every question carries its own small data set as text
// ---------------------------------------------------------------------------

const DI = "quant-data-interpretation";
/** True when x has at most one decimal place, so the answer prints cleanly. */
const tidy = (x: number) => Math.abs(x * 10 - Math.round(x * 10)) < 1e-9;
const round1 = (x: number) => Math.round(x * 10) / 10;
const lowerFirst = (s: string) => s[0].toLowerCase() + s.slice(1);

const DI_SERIES = [
  { en: "Sales (in ₹ lakh) of a company", hi: "एक कंपनी की बिक्री (₹ लाख में)" },
  { en: "Production (in thousand tonnes) of a steel plant", hi: "एक इस्पात संयंत्र का उत्पादन (हज़ार टन में)" },
  { en: "Number of students enrolled in a college", hi: "एक महाविद्यालय में नामांकित विद्यार्थियों की संख्या" },
  { en: "Exports (in ₹ crore) of a firm", hi: "एक फर्म का निर्यात (₹ करोड़ में)" },
  { en: "Number of cars sold by a dealer", hi: "एक डीलर द्वारा बेची गई कारों की संख्या" },
  { en: "Number of visitors (in thousands) to a museum", hi: "एक संग्रहालय में आए आगंतुकों की संख्या (हज़ार में)" },
];
interface Series {
  years: number[];
  vals: number[];
  /** "Sales (in ₹ lakh) of a company — 2019: 120, 2020: 150." and the same in Hindi. */
  en: string;
  hi: string;
}
/** A yearly series of `n` distinct figures, all multiples of `step`. Each year moves by a round percentage, so changes work out cleanly. */
function series(r: Rand, n: number, step = 1): Series {
  const ctx = pick(DI_SERIES, r);
  const y0 = rint(2012, 2020, r);
  const years = Array.from({ length: n }, (_, i) => y0 + i);
  const vals = until(() => {
    const v = [step === 1 ? 40 * rint(2, 10, r) : 50 * rint(2, 8, r)];
    while (v.length < n) {
      const last = v[v.length - 1];
      const nexts = [-25, -20, -10, 5, 10, 15, 20, 25, 30, 40, 50].map((p) => (last * (100 + p)) / 100).filter((x) => x % step === 0 && x >= 40 && x <= 900 && !v.includes(x));
      if (!nexts.length) return null;
      v.push(pick(nexts, r));
    }
    return v;
  });
  const list = years.map((y, i) => `${y}: ${vals[i]}`).join(", ");
  return { years, vals, en: `${ctx.en} — ${list}.`, hi: `${ctx.hi} — ${list}।` };
}
/** Two different positions in a list of `n`, in order. */
const twoOf = (n: number, r: Rand): [number, number] => {
  const i = rint(0, n - 2, r);
  return [i, rint(i + 1, n - 1, r)];
};

/**
 * A numeric MCQ whose wrong options sit close to the answer and print as cleanly as it does (39.5% beside
 * 37.5%, never 39.38%). `traps` are the answers that common mistakes lead to; they are offered first.
 */
function close(id: string, d: Difficulty, question: string, ans: number, explanation: string, hi: Hi, r: Rand, traps: number[] = [], unit = "", suffix = ""): MCQ {
  const scale = ans >= 300 ? 10 : ans >= 100 ? 5 : ans >= 40 ? 2 : 1;
  const offsets = d === "very-hard" ? [-4, -3, -2, -1, 1, 2, 3, 4] : [-8, -6, -5, -4, -2, 2, 4, 5, 6, 8];
  const show = (v: number) => `${unit}${fmt(v)}${suffix}`;
  const wrong = [...shuffle(traps.map(round1), r).slice(0, 2), ...shuffle(offsets, r).map((o) => round1(ans + o * scale))].filter((v) => v > 0 && Number.isFinite(v));
  return choice(id, DI, d, question, show(ans), wrong.map(show), explanation, hi, r);
}
/** Wrong options for a ratio a : b, built from its lowest terms so they look as simple as the answer. */
const ratioTraps = (a: number, b: number) => {
  const g = gcd(a, b);
  const [p, q] = [a / g, b / g];
  return [ratio(q, p), ratio(p + 1, q), ratio(p, q + 1), ratio(p + q, q), ratio(p, p + q), ratio(p + 1, q + 2), ratio(p + 2, q + 1), ratio(p + 2, q + 3)];
};

interface PieCtx {
  /** Opening words with the total: "The monthly expenditure of a family is ₹40,000". */
  lead: (t: string) => string;
  leadHi: (t: string) => string;
  /** Opening words without a total: "In a pie chart of a family’s monthly expenditure". */
  chart: string;
  chartHi: string;
  cats: [string, string][];
  totals: number[];
  unit: string;
  suffix: string;
  one: (c: string) => string;
  oneHi: (c: string) => string;
  more: (a: string, b: string) => string;
  moreHi: (a: string, b: string) => string;
  given: (c: string, amount: string) => string;
  givenHi: (c: string, amount: string) => string;
}
const PIES: PieCtx[] = [
  {
    lead: (t) => `The monthly expenditure of a family is ₹${t}`,
    leadHi: (t) => `एक परिवार का मासिक व्यय ₹${t} है`,
    chart: "In a pie chart of a family’s monthly expenditure",
    chartHi: "एक परिवार के मासिक व्यय के पाई चार्ट में",
    cats: [["Food", "भोजन"], ["Rent", "किराया"], ["Education", "शिक्षा"], ["Transport", "परिवहन"], ["Clothing", "कपड़े"]],
    totals: [20000, 24000, 30000, 36000, 40000, 48000, 50000, 60000, 72000, 80000],
    unit: "₹",
    suffix: "",
    one: (c) => `How much is spent on ${c}?`,
    oneHi: (c) => `${c} पर कितना व्यय होता है?`,
    more: (a, b) => `How much more is spent on ${a} than on ${b}?`,
    moreHi: (a, b) => `${a} पर ${b} की तुलना में कितना अधिक व्यय होता है?`,
    given: (c, amount) => `If ₹${amount} is spent on ${c}`,
    givenHi: (c, amount) => `यदि ${c} पर ₹${amount} व्यय होते हैं`,
  },
  {
    lead: (t) => `The ${t} students of a school each play exactly one sport`,
    leadHi: (t) => `एक विद्यालय के ${t} विद्यार्थियों में से प्रत्येक केवल एक खेल खेलता है`,
    chart: "In a pie chart of the sports played by the students of a school",
    chartHi: "एक विद्यालय के विद्यार्थियों द्वारा खेले जाने वाले खेलों के पाई चार्ट में",
    cats: [["Cricket", "क्रिकेट"], ["Football", "फुटबॉल"], ["Hockey", "हॉकी"], ["Tennis", "टेनिस"], ["Kabaddi", "कबड्डी"]],
    totals: [600, 800, 1200, 1600, 1800, 2000, 2400, 3000, 3600],
    unit: "",
    suffix: "",
    one: (c) => `How many students play ${c}?`,
    oneHi: (c) => `${c} खेलने वाले विद्यार्थी कितने हैं?`,
    more: (a, b) => `How many more students play ${a} than ${b}?`,
    moreHi: (a, b) => `${a} खेलने वाले विद्यार्थी ${b} खेलने वाले विद्यार्थियों से कितने अधिक हैं?`,
    given: (c, amount) => `If ${amount} students play ${c}`,
    givenHi: (c, amount) => `यदि ${amount} विद्यार्थी ${c} खेलते हैं`,
  },
  {
    lead: (t) => `A company spent ₹${t} lakh in a year`,
    leadHi: (t) => `एक कंपनी ने एक वर्ष में ₹${t} लाख व्यय किए`,
    chart: "In a pie chart of a company’s yearly spending",
    chartHi: "एक कंपनी के वार्षिक व्यय के पाई चार्ट में",
    cats: [["Salaries", "वेतन"], ["Raw material", "कच्चा माल"], ["Marketing", "विपणन"], ["Transport", "परिवहन"], ["Research", "अनुसंधान"]],
    totals: [120, 160, 180, 240, 300, 360, 400, 480, 600, 720],
    unit: "₹",
    suffix: " lakh",
    one: (c) => `How much was spent on ${c}?`,
    oneHi: (c) => `${c} पर कितना व्यय हुआ?`,
    more: (a, b) => `How much more was spent on ${a} than on ${b}?`,
    moreHi: (a, b) => `${a} पर ${b} की तुलना में कितना अधिक व्यय हुआ?`,
    given: (c, amount) => `If ₹${amount} lakh was spent on ${c}`,
    givenHi: (c, amount) => `यदि ${c} पर ₹${amount} लाख व्यय हुए`,
  },
];
/** `n` different shares, each a multiple of 5 from 5 to 45, adding up to 100. */
const shares = (n: number, r: Rand) =>
  until(() => {
    const p = Array.from({ length: n - 1 }, () => 5 * rint(1, 9, r));
    const all = [...p, 100 - sum(p)];
    return all[n - 1] >= 5 && all[n - 1] <= 45 && new Set(all).size === n ? all : null;
  });
interface Pie {
  ctx: PieCtx;
  total: number;
  pct: number[];
  /** "Food: 30%, Rent: 25%" (or the central angles with `degrees`), in English and Hindi. */
  list: string;
  listHi: string;
}
function pie(r: Rand, degrees: boolean): Pie {
  const ctx = pick(PIES, r);
  const pct = shares(ctx.cats.length, r);
  const show = (p: number) => (degrees ? `${(p * 18) / 5}°` : `${p}%`);
  return {
    ctx,
    total: pick(ctx.totals, r),
    pct,
    list: ctx.cats.map(([c], i) => `${c}: ${show(pct[i])}`).join(", "),
    listHi: ctx.cats.map(([, c], i) => `${c}: ${show(pct[i])}`).join(", "),
  };
}
const pieAnswer = (id: string, d: Difficulty, p: Pie, q: string, ans: number, e: string, hi: Hi, r: Rand) => numeric(id, DI, d, q, ans, e, hi, r, p.ctx.unit, p.ctx.suffix);
/** "₹12,000" or "₹36 lakh" or "300", for explanations. */
const money = (p: Pie, v: number) => `${p.ctx.unit}${fmt(v)}${p.ctx.suffix}`;
const moneyHi = (p: Pie, v: number) => `${p.ctx.unit}${fmt(v)}${p.ctx.suffix ? " लाख" : ""}`;

GENERATORS[DI] = {
  easy: either((id, r) => {
    // Average or total of a series.
    const s = series(r, rint(4, 5, r), 10);
    const total = sum(s.vals);
    const n = s.vals.length;
    const adds = s.vals.join(" + ");
    if (r() < 0.7 && total % n === 0) {
      const ans = total / n;
      return numeric(
        id, DI, "easy",
        `${s.en} What is the average of the yearly figures?`,
        ans,
        `Average = (${adds}) ÷ ${n} = ${fmt(total)} ÷ ${n} = ${fmt(ans)}.`,
        { q: `${s.hi} वार्षिक आँकड़ों का औसत क्या है?`, e: `औसत = (${adds}) ÷ ${n} = ${fmt(total)} ÷ ${n} = ${fmt(ans)}।` },
        r,
      );
    }
    return numeric(
      id, DI, "easy",
      `${s.en} What is the total of the yearly figures?`,
      total,
      `Total = ${adds} = ${fmt(total)}.`,
      { q: `${s.hi} वार्षिक आँकड़ों का कुल योग क्या है?`, e: `कुल योग = ${adds} = ${fmt(total)}।` },
      r,
    );
  }, (id, r) => {
    // Difference or sum of two years.
    const s = series(r, rint(4, 5, r), 10);
    const [i, j] = twoOf(s.vals.length, r);
    const [hiI, loI] = s.vals[i] > s.vals[j] ? [i, j] : [j, i];
    if (r() < 0.5) {
      const ans = s.vals[hiI] - s.vals[loI];
      return numeric(
        id, DI, "easy",
        `${s.en} By how much does the figure for ${s.years[hiI]} exceed the figure for ${s.years[loI]}?`,
        ans,
        `${s.years[hiI]} figure − ${s.years[loI]} figure = ${s.vals[hiI]} − ${s.vals[loI]} = ${ans}.`,
        { q: `${s.hi} ${s.years[hiI]} का आँकड़ा ${s.years[loI]} के आँकड़े से कितना अधिक है?`, e: `${s.years[hiI]} का आँकड़ा − ${s.years[loI]} का आँकड़ा = ${s.vals[hiI]} − ${s.vals[loI]} = ${ans}।` },
        r,
      );
    }
    const ans = s.vals[i] + s.vals[j];
    return numeric(
      id, DI, "easy",
      `${s.en} What is the total of the figures for ${s.years[i]} and ${s.years[j]}?`,
      ans,
      `${s.vals[i]} + ${s.vals[j]} = ${fmt(ans)}.`,
      { q: `${s.hi} ${s.years[i]} और ${s.years[j]} के आँकड़ों का योग कितना है?`, e: `${s.vals[i]} + ${s.vals[j]} = ${fmt(ans)}।` },
      r,
    );
  }, (id, r) => {
    // Ratio of two years.
    const s = series(r, rint(4, 5, r), 10);
    const [a, b] = r() < 0.5 ? twoOf(s.vals.length, r) : (twoOf(s.vals.length, r).reverse() as [number, number]);
    const [va, vb] = [s.vals[a], s.vals[b]];
    const ans = ratio(va, vb);
    return choice(
      id, DI, "easy",
      `${s.en} What is the ratio of the figure for ${s.years[a]} to the figure for ${s.years[b]}?`,
      ans,
      ratioTraps(va, vb),
      `${s.years[a]} : ${s.years[b]} = ${va} : ${vb} = ${ans} (divide both by ${gcd(va, vb)}).`,
      { q: `${s.hi} ${s.years[a]} के आँकड़े का ${s.years[b]} के आँकड़े से अनुपात क्या है?`, e: `${s.years[a]} : ${s.years[b]} = ${va} : ${vb} = ${ans} (दोनों को ${gcd(va, vb)} से भाग दें)।` },
      r,
    );
  }, (id, r) => {
    // One slice of a pie chart given in percentages.
    const p = pie(r, false);
    const i = rint(0, p.pct.length - 1, r);
    const [c, cHi] = p.ctx.cats[i];
    const t = fmt(p.total);
    const ans = (p.total * p.pct[i]) / 100;
    return pieAnswer(
      id, "easy", p,
      `${p.ctx.lead(t)}, split as — ${p.list}. ${p.ctx.one(c)}`,
      ans,
      `${c} = ${p.pct[i]}% of ${t} = ${p.pct[i]} × ${t} ÷ 100 = ${money(p, ans)}.`,
      { q: `${p.ctx.leadHi(t)}, जिसका बँटवारा इस प्रकार है — ${p.listHi}। ${p.ctx.oneHi(cHi)}`, e: `${cHi} = ${t} का ${p.pct[i]}% = ${p.pct[i]} × ${t} ÷ 100 = ${moneyHi(p, ans)}।` },
      r,
    );
  }),

  moderate: either((id, r) => {
    // Percentage change between two years.
    const { s, i, j, change } = until(() => {
      const s = series(r, rint(4, 5, r));
      const [i, j] = twoOf(s.vals.length, r);
      const change = ((s.vals[j] - s.vals[i]) * 100) / s.vals[i];
      return tidy(change) ? { s, i, j, change } : null;
    });
    const up = change > 0;
    const ans = round1(Math.abs(change));
    const diff = Math.abs(s.vals[j] - s.vals[i]);
    return close(
      id, "moderate",
      `${s.en} What is the percentage ${up ? "increase" : "decrease"} in the figure from ${s.years[i]} to ${s.years[j]}?`,
      ans,
      `Change = ${up ? `${s.vals[j]} − ${s.vals[i]}` : `${s.vals[i]} − ${s.vals[j]}`} = ${diff}. Percentage ${up ? "increase" : "decrease"} = ${diff} ÷ ${s.vals[i]} × 100 = ${fmt(ans)}% (always divide by the earlier value).`,
      {
        q: `${s.hi} ${s.years[i]} से ${s.years[j]} तक आँकड़े में कितने प्रतिशत की ${up ? "वृद्धि" : "कमी"} हुई?`,
        e: `परिवर्तन = ${up ? `${s.vals[j]} − ${s.vals[i]}` : `${s.vals[i]} − ${s.vals[j]}`} = ${diff}। प्रतिशत ${up ? "वृद्धि" : "कमी"} = ${diff} ÷ ${s.vals[i]} × 100 = ${fmt(ans)}% (सदैव पहले वाले मान से भाग दें)।`,
      },
      r, [(diff * 100) / s.vals[j]], "", "%",
    );
  }, (id, r) => {
    // One slice of a pie chart given in central angles.
    const p = pie(r, true);
    const i = rint(0, p.pct.length - 1, r);
    const [c, cHi] = p.ctx.cats[i];
    const t = fmt(p.total);
    const deg = (p.pct[i] * 18) / 5;
    const ans = (p.total * p.pct[i]) / 100;
    return pieAnswer(
      id, "moderate", p,
      `${p.ctx.lead(t)}, shown in a pie chart with central angles — ${p.list}. ${p.ctx.one(c)}`,
      ans,
      `${c} = ${deg}/360 × ${t} = ${money(p, ans)}.`,
      { q: `${p.ctx.leadHi(t)}, जिसे एक पाई चार्ट में इन केंद्रीय कोणों से दिखाया गया है — ${p.listHi}। ${p.ctx.oneHi(cHi)}`, e: `${cHi} = ${deg}/360 × ${t} = ${moneyHi(p, ans)}।` },
      r,
    );
  }, (id, r) => {
    // One year as a percentage of another.
    const { s, a, b, ans } = until(() => {
      const s = series(r, rint(4, 5, r));
      const [a, b] = r() < 0.5 ? twoOf(s.vals.length, r) : twoOf(s.vals.length, r).reverse();
      const ans = (s.vals[a] * 100) / s.vals[b];
      return tidy(ans) ? { s, a, b, ans: round1(ans) } : null;
    });
    return close(
      id, "moderate",
      `${s.en} The figure for ${s.years[a]} is what percent of the figure for ${s.years[b]}?`,
      ans,
      `Required % = ${s.vals[a]} ÷ ${s.vals[b]} × 100 = ${fmt(ans)}%.`,
      { q: `${s.hi} ${s.years[a]} का आँकड़ा, ${s.years[b]} के आँकड़े का कितना प्रतिशत है?`, e: `अभीष्ट प्रतिशत = ${s.vals[a]} ÷ ${s.vals[b]} × 100 = ${fmt(ans)}%।` },
      r, [(s.vals[b] * 100) / s.vals[a], Math.abs(ans - 100)], "", "%",
    );
  }, (id, r) => {
    // Difference between two slices of a pie chart given in percentages.
    const p = pie(r, false);
    const [x, y] = twoOf(p.pct.length, r);
    const [i, j] = p.pct[x] > p.pct[y] ? [x, y] : [y, x];
    const [[a, aHi], [b, bHi]] = [p.ctx.cats[i], p.ctx.cats[j]];
    const t = fmt(p.total);
    const gap = p.pct[i] - p.pct[j];
    const ans = (p.total * gap) / 100;
    return pieAnswer(
      id, "moderate", p,
      `${p.ctx.lead(t)}, split as — ${p.list}. ${p.ctx.more(a, b)}`,
      ans,
      `Difference in shares = ${p.pct[i]}% − ${p.pct[j]}% = ${gap}%. ${gap}% of ${t} = ${money(p, ans)}.`,
      { q: `${p.ctx.leadHi(t)}, जिसका बँटवारा इस प्रकार है — ${p.listHi}। ${p.ctx.moreHi(aHi, bHi)}`, e: `हिस्सों का अंतर = ${p.pct[i]}% − ${p.pct[j]}% = ${gap}%। ${t} का ${gap}% = ${moneyHi(p, ans)}।` },
      r,
    );
  }, (id, r) => {
    // A two-row table: boys and girls in two schools.
    const { v, pctGirls } = until(() => {
      const v = Array.from({ length: 4 }, () => 20 * rint(5, 30, r));
      const pctGirls = [(v[1] * 100) / (v[0] + v[1]), (v[3] * 100) / (v[2] + v[3])];
      return new Set(v).size === 4 && pctGirls.every(tidy) && sum([v[0], v[2]]) !== sum([v[1], v[3]]) ? { v, pctGirls } : null;
    });
    const [ba, ga, bb, gb] = v;
    const data = `Students in two schools — School A: ${ba} boys and ${ga} girls; School B: ${bb} boys and ${gb} girls.`;
    const dataHi = `दो विद्यालयों के विद्यार्थी — विद्यालय A: ${ba} लड़के और ${ga} लड़कियाँ; विद्यालय B: ${bb} लड़के और ${gb} लड़कियाँ।`;
    if (r() < 0.5) {
      const k = rint(0, 1, r);
      const school = "AB"[k];
      const [boys, girls] = k ? [bb, gb] : [ba, ga];
      const ans = round1(pctGirls[k]);
      return close(
        id, "moderate",
        `${data} What percent of the students of School ${school} are girls?`,
        ans,
        `School ${school} has ${boys} + ${girls} = ${boys + girls} students. Girls = ${girls} ÷ ${boys + girls} × 100 = ${fmt(ans)}%.`,
        { q: `${dataHi} विद्यालय ${school} के विद्यार्थियों में से कितने प्रतिशत लड़कियाँ हैं?`, e: `विद्यालय ${school} में ${boys} + ${girls} = ${boys + girls} विद्यार्थी हैं। लड़कियाँ = ${girls} ÷ ${boys + girls} × 100 = ${fmt(ans)}%।` },
        r, [100 - ans, pctGirls[1 - k]], "", "%",
      );
    }
    const [B, G] = [ba + bb, ga + gb];
    const ans = ratio(B, G);
    const wrong = [ratio(G, B), ...shuffle([ratio(ba, ga), ratio(bb, gb), ratio(ba + ga, bb + gb)], r).slice(0, 2), ...ratioTraps(B, G)];
    return choice(
      id, DI, "moderate",
      `${data} What is the ratio of the total number of boys to the total number of girls in the two schools together?`,
      ans,
      wrong,
      `Boys = ${ba} + ${bb} = ${B}; girls = ${ga} + ${gb} = ${G}. Ratio = ${B} : ${G} = ${ans}.`,
      { q: `${dataHi} दोनों विद्यालयों को मिलाकर लड़कों की कुल संख्या का लड़कियों की कुल संख्या से अनुपात क्या है?`, e: `लड़के = ${ba} + ${bb} = ${B}; लड़कियाँ = ${ga} + ${gb} = ${G}। अनुपात = ${B} : ${G} = ${ans}।` },
      r,
    );
  }),

  hard: either((id, r) => {
    // The year with the highest growth over the previous year.
    const { s, growth, best } = until(() => {
      const s = series(r, 5);
      const growth = s.vals.slice(1).map((v, i) => ((v - s.vals[i]) * 100) / s.vals[i]);
      const order = [...growth].sort((a, b) => b - a);
      // One clear winner, so rounding never decides the answer.
      return order[0] - order[1] >= 3 && order[0] > 0 ? { s, growth, best: growth.indexOf(order[0]) } : null;
    });
    const years = s.years.slice(1).map(String);
    const show = (x: number) => `${x < 0 ? "−" : ""}${fmt(Math.abs(round1(x)))}%`;
    const work = growth.map((gr, i) => `${years[i]}: (${s.vals[i + 1]} − ${s.vals[i]}) ÷ ${s.vals[i]} × 100 = ${show(gr)}`).join("; ");
    return choice(
      id, DI, "hard",
      `${s.en} In which year was the percentage increase in the figure over the previous year the highest?`,
      years[best],
      years,
      `${work}. The highest is in ${years[best]}.`,
      { q: `${s.hi} किस वर्ष में आँकड़े में पिछले वर्ष की तुलना में प्रतिशत वृद्धि सबसे अधिक थी?`, e: `${work}। सबसे अधिक वृद्धि ${years[best]} में हुई।` },
      r,
    );
  }, (id, r) => {
    // Weighted average of two groups.
    const wages = r() < 0.4;
    const { n1, n2, a1, a2, ans } = until(() => {
      const [n1, n2] = [5 * rint(3, 12, r), 5 * rint(3, 12, r)];
      const [a1, a2] = wages ? [10 * rint(30, 80, r), 10 * rint(30, 80, r)] : [rint(40, 90, r), rint(40, 90, r)];
      const ans = (n1 * a1 + n2 * a2) / (n1 + n2);
      return n1 !== n2 && a1 !== a2 && tidy(ans) ? { n1, n2, a1, a2, ans: round1(ans) } : null;
    });
    const work = `(${n1} × ${a1} + ${n2} × ${a2}) ÷ (${n1} + ${n2}) = ${fmt(n1 * a1 + n2 * a2)} ÷ ${n1 + n2} = ${fmt(ans)}`;
    if (wages) {
      return close(
        id, "hard",
        `Daily wages in a factory — Group A: ${n1} workers, average ₹${a1}; Group B: ${n2} workers, average ₹${a2}. What is the average daily wage of all the workers together?`,
        ans,
        `Use totals, not the mean of the two averages: ${work}. Average = ₹${fmt(ans)}.`,
        {
          q: `एक कारखाने में दैनिक मज़दूरी — समूह A: ${n1} श्रमिक, औसत ₹${a1}; समूह B: ${n2} श्रमिक, औसत ₹${a2}। सभी श्रमिकों की मिलाकर औसत दैनिक मज़दूरी कितनी है?`,
          e: `दोनों औसतों का औसत नहीं, कुल योग लें: ${work}। औसत = ₹${fmt(ans)}।`,
        },
        r, [(a1 + a2) / 2, (n2 * a1 + n1 * a2) / (n1 + n2)], "₹",
      );
    }
    return close(
      id, "hard",
      `Marks of two sections of a class — Section A: ${n1} students, average ${a1}; Section B: ${n2} students, average ${a2}. What is the average marks of the whole class?`,
      ans,
      `Use totals, not the mean of the two averages: ${work}.`,
      {
        q: `एक कक्षा के दो वर्गों के अंक — वर्ग A: ${n1} विद्यार्थी, औसत ${a1}; वर्ग B: ${n2} विद्यार्थी, औसत ${a2}। पूरी कक्षा के औसत अंक कितने हैं?`,
        e: `दोनों औसतों का औसत नहीं, कुल योग लें: ${work}।`,
      },
      r, [(a1 + a2) / 2, (n2 * a1 + n1 * a2) / (n1 + n2)],
    );
  }, (id, r) => {
    // Pie chart in degrees: one slice's amount is given, another is asked.
    const p = pie(r, true);
    const [i, j] = r() < 0.5 ? twoOf(p.pct.length, r) : (twoOf(p.pct.length, r).reverse() as [number, number]);
    const [[a, aHi], [b, bHi]] = [p.ctx.cats[i], p.ctx.cats[j]];
    const [known, ans] = [(p.total * p.pct[i]) / 100, (p.total * p.pct[j]) / 100];
    const [da, db] = [(p.pct[i] * 18) / 5, (p.pct[j] * 18) / 5];
    return pieAnswer(
      id, "hard", p,
      `${p.ctx.chart}, the central angles are — ${p.list}. ${p.ctx.given(a, fmt(known))}, ${lowerFirst(p.ctx.one(b))}`,
      ans,
      `Amounts are in the ratio of the angles: ${b} = ${fmt(known)} × ${db}/${da} = ${money(p, ans)}. (The whole chart is ${fmt(known)} × 360/${da} = ${money(p, p.total)}.)`,
      {
        q: `${p.ctx.chartHi} केंद्रीय कोण इस प्रकार हैं — ${p.listHi}। ${p.ctx.givenHi(aHi, fmt(known))}, तो ${p.ctx.oneHi(bHi)}`,
        e: `राशियाँ कोणों के अनुपात में होती हैं: ${bHi} = ${fmt(known)} × ${db}/${da} = ${moneyHi(p, ans)}। (पूरा चार्ट ${fmt(known)} × 360/${da} = ${moneyHi(p, p.total)} का है।)`,
      },
      r,
    );
  }, (id, r) => {
    // One year's share of the total.
    const { s, i, total, ans } = until(() => {
      const s = series(r, rint(4, 5, r));
      const i = rint(0, s.vals.length - 1, r);
      const total = sum(s.vals);
      const ans = (s.vals[i] * 100) / total;
      return tidy(ans) ? { s, i, total, ans: round1(ans) } : null;
    });
    return close(
      id, "hard",
      `${s.en} The figure for ${s.years[i]} is what percent of the total for all the given years?`,
      ans,
      `Total = ${s.vals.join(" + ")} = ${fmt(total)}. Share of ${s.years[i]} = ${s.vals[i]} ÷ ${fmt(total)} × 100 = ${fmt(ans)}%.`,
      {
        q: `${s.hi} ${s.years[i]} का आँकड़ा, दिए गए सभी वर्षों के कुल योग का कितना प्रतिशत है?`,
        e: `कुल योग = ${s.vals.join(" + ")} = ${fmt(total)}। ${s.years[i]} का हिस्सा = ${s.vals[i]} ÷ ${fmt(total)} × 100 = ${fmt(ans)}%।`,
      },
      r, [(s.vals[i] * 100) / (total - s.vals[i]), 100 / s.vals.length], "", "%",
    );
  }, (id, r) => {
    // Two factories over three years: ratio of the totals.
    const y0 = rint(2014, 2021, r);
    const { a, b } = until(() => {
      const [a, b] = [0, 1].map(() => Array.from({ length: 3 }, () => 5 * rint(4, 30, r)));
      return sum(a) !== sum(b) && gcd(sum(a), sum(b)) >= 10 ? { a, b } : null;
    });
    const row = (v: number[]) => v.map((x, i) => `${y0 + i}: ${x}`).join(", ");
    const [A, B] = [sum(a), sum(b)];
    const first = r() < 0.5;
    const ans = first ? ratio(A, B) : ratio(B, A);
    const wrong = [...ratioTraps(first ? A : B, first ? B : A).slice(0, 1), pick([ratio(a[0], b[0]), ratio(a[2], b[2]), ratio(b[1], a[1])], r), ...ratioTraps(first ? A : B, first ? B : A).slice(1)];
    const [x, y] = first ? ["A", "B"] : ["B", "A"];
    return choice(
      id, DI, "hard",
      `Production (in thousand units) of two factories — Factory A: ${row(a)}; Factory B: ${row(b)}. What is the ratio of the total production of Factory ${x} to that of Factory ${y} over the three years?`,
      ans,
      wrong,
      `Factory A = ${a.join(" + ")} = ${A}; Factory B = ${b.join(" + ")} = ${B}. Ratio ${x} : ${y} = ${first ? A : B} : ${first ? B : A} = ${ans}.`,
      {
        q: `दो कारखानों का उत्पादन (हज़ार इकाइयों में) — कारखाना A: ${row(a)}; कारखाना B: ${row(b)}। तीनों वर्षों में कारखाना ${x} के कुल उत्पादन का कारखाना ${y} के कुल उत्पादन से अनुपात क्या है?`,
        e: `कारखाना A = ${a.join(" + ")} = ${A}; कारखाना B = ${b.join(" + ")} = ${B}। अनुपात ${x} : ${y} = ${first ? A : B} : ${first ? B : A} = ${ans}।`,
      },
      r,
    );
  }),

  "very-hard": either((id, r) => {
    // Income and expenditure over four years.
    const y0 = rint(2014, 2020, r);
    const years = [0, 1, 2, 3].map((i) => y0 + i);
    const rows = (inc: number[], exp: number[]) => years.map((y, i) => `${y}: income ${inc[i]}, expenditure ${exp[i]}`).join("; ");
    const rowsHi = (inc: number[], exp: number[]) => years.map((y, i) => `${y}: आय ${inc[i]}, व्यय ${exp[i]}`).join("; ");
    // Expenditure drifts from year to year; income stays above it.
    const books = () => {
      const exp = [10 * rint(10, 36, r)];
      while (exp.length < 4) exp.push(Math.max(80, exp[exp.length - 1] + 10 * rint(-2, 5, r)));
      return { exp, inc: exp.map((e) => e + 10 * rint(2, 12, r)) };
    };
    if (r() < 0.5) {
      const { inc, exp, i, j, ans } = until(() => {
        const { inc, exp } = books();
        const [i, j] = twoOf(4, r);
        const [p1, p2] = [inc[i] - exp[i], inc[j] - exp[j]];
        const ans = ((p2 - p1) * 100) / p1;
        return p2 > p1 && ans <= 150 && tidy(ans) ? { inc, exp, i, j, ans: round1(ans) } : null;
      });
      const [p1, p2] = [inc[i] - exp[i], inc[j] - exp[j]];
      return close(
        id, "very-hard",
        `Income and expenditure (in ₹ lakh) of a company — ${rows(inc, exp)}. Profit = income − expenditure. What is the percentage increase in profit from ${years[i]} to ${years[j]}?`,
        ans,
        `Profit in ${years[i]} = ${inc[i]} − ${exp[i]} = ${p1}; profit in ${years[j]} = ${inc[j]} − ${exp[j]} = ${p2}. Increase = (${p2} − ${p1}) ÷ ${p1} × 100 = ${fmt(ans)}%.`,
        {
          q: `एक कंपनी की आय और व्यय (₹ लाख में) — ${rowsHi(inc, exp)}। लाभ = आय − व्यय। ${years[i]} से ${years[j]} तक लाभ में कितने प्रतिशत की वृद्धि हुई?`,
          e: `${years[i]} में लाभ = ${inc[i]} − ${exp[i]} = ${p1}; ${years[j]} में लाभ = ${inc[j]} − ${exp[j]} = ${p2}। वृद्धि = (${p2} − ${p1}) ÷ ${p1} × 100 = ${fmt(ans)}%।`,
        },
        r, [((p2 - p1) * 100) / p2, ((inc[j] - inc[i]) * 100) / inc[i]], "", "%",
      );
    }
    const { inc, exp, pc, best } = until(() => {
      const { inc, exp } = books();
      const pc = inc.map((v, i) => ((v - exp[i]) * 100) / exp[i]);
      const order = [...pc].sort((a, b) => b - a);
      return order[0] - order[1] >= 2 ? { inc, exp, pc, best: pc.indexOf(order[0]) } : null;
    });
    const work = years.map((y, i) => `${y}: ${inc[i] - exp[i]} ÷ ${exp[i]} × 100 = ${fmt(round1(pc[i]))}%`).join("; ");
    return choice(
      id, DI, "very-hard",
      `Income and expenditure (in ₹ lakh) of a company — ${rows(inc, exp)}. Profit percent = (income − expenditure) ÷ expenditure × 100. In which year was the profit percent the highest?`,
      String(years[best]),
      years.map(String),
      `${work}. The highest profit percent is in ${years[best]}.`,
      {
        q: `एक कंपनी की आय और व्यय (₹ लाख में) — ${rowsHi(inc, exp)}। लाभ प्रतिशत = (आय − व्यय) ÷ व्यय × 100। किस वर्ष में लाभ प्रतिशत सबसे अधिक था?`,
        e: `${work}। सबसे अधिक लाभ प्रतिशत ${years[best]} में था।`,
      },
      r,
    );
  }, (id, r) => {
    // Candidates appeared and the percentage who passed: rebuild the counts first.
    const y0 = rint(2015, 2021, r);
    const years = [0, 1, 2].map((i) => y0 + i);
    const rows = (ap: number[], pc: number[]) => years.map((y, i) => `${y}: ${ap[i]} appeared, ${pc[i]}% passed`).join("; ");
    const rowsHi = (ap: number[], pc: number[]) => years.map((y, i) => `${y}: ${ap[i]} सम्मिलित, ${pc[i]}% उत्तीर्ण`).join("; ");
    const lead = "Candidates who appeared in an examination and the percentage of them who passed";
    const leadHi = "एक परीक्षा में सम्मिलित अभ्यर्थी और उनमें से उत्तीर्ण होने वालों का प्रतिशत";
    if (r() < 0.5) {
      const { ap, pc, i, j, change } = until(() => {
        const ap = years.map(() => 50 * rint(4, 19, r));
        const pc = years.map(() => 2 * rint(15, 42, r));
        const [i, j] = twoOf(3, r);
        const [a, b] = [(ap[i] * pc[i]) / 100, (ap[j] * pc[j]) / 100];
        const change = ((b - a) * 100) / a;
        return change !== 0 && Math.abs(change) <= 100 && tidy(change) && ap[i] !== ap[j] && pc[i] !== pc[j] ? { ap, pc, i, j, change } : null;
      });
      const [a, b] = [(ap[i] * pc[i]) / 100, (ap[j] * pc[j]) / 100];
      const up = change > 0;
      const ans = round1(Math.abs(change));
      return close(
        id, "very-hard",
        `${lead} — ${rows(ap, pc)}. What is the percentage ${up ? "increase" : "decrease"} in the number of candidates who passed from ${years[i]} to ${years[j]}?`,
        ans,
        `Passed in ${years[i]} = ${pc[i]}% of ${ap[i]} = ${a}; passed in ${years[j]} = ${pc[j]}% of ${ap[j]} = ${b}. Percentage ${up ? "increase" : "decrease"} = ${Math.abs(b - a)} ÷ ${a} × 100 = ${fmt(ans)}%. (Comparing the two pass percentages directly would be wrong, because the number who appeared also changed.)`,
        {
          q: `${leadHi} — ${rowsHi(ap, pc)}। ${years[i]} से ${years[j]} तक उत्तीर्ण अभ्यर्थियों की संख्या में कितने प्रतिशत की ${up ? "वृद्धि" : "कमी"} हुई?`,
          e: `${years[i]} में उत्तीर्ण = ${ap[i]} का ${pc[i]}% = ${a}; ${years[j]} में उत्तीर्ण = ${ap[j]} का ${pc[j]}% = ${b}। प्रतिशत ${up ? "वृद्धि" : "कमी"} = ${Math.abs(b - a)} ÷ ${a} × 100 = ${fmt(ans)}%। (दोनों उत्तीर्ण प्रतिशतों की सीधी तुलना गलत होगी, क्योंकि सम्मिलित अभ्यर्थियों की संख्या भी बदली है।)`,
        },
        r, [Math.abs(pc[j] - pc[i]), (Math.abs(b - a) * 100) / b], "", "%",
      );
    }
    const { ap, pc, ans } = until(() => {
      const ap = years.map(() => 50 * rint(4, 19, r));
      const pc = years.map(() => 2 * rint(15, 42, r));
      const ans = sum(ap.map((a, i) => a * pc[i])) / sum(ap);
      return new Set(ap).size === 3 && new Set(pc).size === 3 && tidy(ans) ? { ap, pc, ans: round1(ans) } : null;
    });
    const passed = ap.map((a, i) => (a * pc[i]) / 100);
    return close(
      id, "very-hard",
      `${lead} — ${rows(ap, pc)}. What is the overall pass percentage for the three years taken together?`,
      ans,
      `Passed = ${passed.join(" + ")} = ${fmt(sum(passed))}; appeared = ${ap.join(" + ")} = ${fmt(sum(ap))}. Overall pass % = ${fmt(sum(passed))} ÷ ${fmt(sum(ap))} × 100 = ${fmt(ans)}%. (Do not average the three percentages.)`,
      {
        q: `${leadHi} — ${rowsHi(ap, pc)}। तीनों वर्षों को मिलाकर कुल उत्तीर्ण प्रतिशत कितना है?`,
        e: `उत्तीर्ण = ${passed.join(" + ")} = ${fmt(sum(passed))}; सम्मिलित = ${ap.join(" + ")} = ${fmt(sum(ap))}। कुल उत्तीर्ण प्रतिशत = ${fmt(sum(passed))} ÷ ${fmt(sum(ap))} × 100 = ${fmt(ans)}%। (तीनों प्रतिशतों का औसत न लें।)`,
      },
      r, [sum(pc) / 3], "", "%",
    );
  }, (id, r) => {
    // Two linked charts: department shares, and the percentage of girls in each.
    const depts: [string, string][] = [["Arts", "कला"], ["Science", "विज्ञान"], ["Commerce", "वाणिज्य"], ["Engineering", "इंजीनियरिंग"]];
    const total = pick([1000, 1200, 1600, 1800, 2000, 2400, 3000, 4000], r);
    const kind = pick(["two", "boys", "overall"] as const, r);
    const { share, girlsPct, count, girls } = until(() => {
      const share = shares(4, r);
      const girlsPct = depts.map(() => 10 * rint(2, 7, r));
      const count = share.map((s) => (total * s) / 100);
      const girls = count.map((c, i) => (c * girlsPct[i]) / 100);
      return new Set(girlsPct).size >= 3 && (kind !== "overall" || tidy((sum(girls) * 100) / total)) ? { share, girlsPct, count, girls } : null;
    });
    const t = fmt(total);
    const en = `A college has ${t} students in four departments — ${depts.map(([d], i) => `${d}: ${share[i]}%`).join(", ")}. The percentage of girls in each department is — ${depts.map(([d], i) => `${d}: ${girlsPct[i]}%`).join(", ")}.`;
    const hi = `एक महाविद्यालय के चार विभागों में ${t} विद्यार्थी हैं — ${depts.map(([, d], i) => `${d}: ${share[i]}%`).join(", ")}। प्रत्येक विभाग में लड़कियों का प्रतिशत इस प्रकार है — ${depts.map(([, d], i) => `${d}: ${girlsPct[i]}%`).join(", ")}।`;
    if (kind === "two") {
      const [i, j] = twoOf(4, r);
      const ans = girls[i] + girls[j];
      return numeric(
        id, DI, "very-hard",
        `${en} How many girls are there in ${depts[i][0]} and ${depts[j][0]} together?`,
        ans,
        `${depts[i][0]}: ${share[i]}% of ${t} = ${fmt(count[i])} students, of whom ${girlsPct[i]}% = ${girls[i]} are girls. ${depts[j][0]}: ${share[j]}% of ${t} = ${fmt(count[j])} students, of whom ${girlsPct[j]}% = ${girls[j]} are girls. Total = ${girls[i]} + ${girls[j]} = ${fmt(ans)}.`,
        {
          q: `${hi} ${depts[i][1]} और ${depts[j][1]} विभागों में मिलाकर कितनी लड़कियाँ हैं?`,
          e: `${depts[i][1]}: ${t} का ${share[i]}% = ${fmt(count[i])} विद्यार्थी, जिनमें से ${girlsPct[i]}% = ${girls[i]} लड़कियाँ हैं। ${depts[j][1]}: ${t} का ${share[j]}% = ${fmt(count[j])} विद्यार्थी, जिनमें से ${girlsPct[j]}% = ${girls[j]} लड़कियाँ हैं। कुल = ${girls[i]} + ${girls[j]} = ${fmt(ans)}।`,
        },
        r,
      );
    }
    if (kind === "boys") {
      const i = rint(0, 3, r);
      const ans = count[i] - girls[i];
      return numeric(
        id, DI, "very-hard",
        `${en} How many boys are there in ${depts[i][0]}?`,
        ans,
        `${depts[i][0]} has ${share[i]}% of ${t} = ${fmt(count[i])} students. Boys = (100 − ${girlsPct[i]})% = ${100 - girlsPct[i]}% of ${fmt(count[i])} = ${fmt(ans)}.`,
        {
          q: `${hi} ${depts[i][1]} विभाग में कितने लड़के हैं?`,
          e: `${depts[i][1]} विभाग में ${t} का ${share[i]}% = ${fmt(count[i])} विद्यार्थी हैं। लड़के = (100 − ${girlsPct[i]})% = ${fmt(count[i])} का ${100 - girlsPct[i]}% = ${fmt(ans)}।`,
        },
        r,
      );
    }
    const allGirls = sum(girls);
    const ans = round1((allGirls * 100) / total);
    return close(
      id, "very-hard",
      `${en} What percent of all the students of the college are girls?`,
      ans,
      `Girls = ${girls.join(" + ")} = ${fmt(allGirls)}. Required % = ${fmt(allGirls)} ÷ ${t} × 100 = ${fmt(ans)}%. (This is a weighted average of the four percentages, not their simple mean.)`,
      {
        q: `${hi} महाविद्यालय के सभी विद्यार्थियों में से कितने प्रतिशत लड़कियाँ हैं?`,
        e: `लड़कियाँ = ${girls.join(" + ")} = ${fmt(allGirls)}। अभीष्ट प्रतिशत = ${fmt(allGirls)} ÷ ${t} × 100 = ${fmt(ans)}%। (यह चारों प्रतिशतों का भारित औसत है, साधारण औसत नहीं।)`,
      },
      r, [sum(girlsPct) / 4], "", "%",
    );
  }, (id, r) => {
    // Two products over two years: growth of the combined sales, and a product's share.
    const y = rint(2015, 2022, r);
    const growth = r() < 0.5;
    const { a1, b1, a2, b2, ans } = until(() => {
      const [a1, b1] = [10 * rint(8, 50, r), 10 * rint(8, 50, r)];
      const [a2, b2] = [a1 + 10 * rint(-3, 15, r), b1 + 10 * rint(-3, 15, r)];
      const ans = growth ? ((a2 + b2 - a1 - b1) * 100) / (a1 + b1) : (a2 * 100) / (a2 + b2);
      return new Set([a1, b1, a2, b2]).size === 4 && a2 > 0 && b2 > 0 && ans > 0 && tidy(ans) ? { a1, b1, a2, b2, ans: round1(ans) } : null;
    });
    const en = `Sales (in ₹ lakh) of two products of a company — ${y}: Product A ${a1}, Product B ${b1}; ${y + 1}: Product A ${a2}, Product B ${b2}.`;
    const hi = `एक कंपनी के दो उत्पादों की बिक्री (₹ लाख में) — ${y}: उत्पाद A ${a1}, उत्पाद B ${b1}; ${y + 1}: उत्पाद A ${a2}, उत्पाद B ${b2}।`;
    if (growth) {
      return close(
        id, "very-hard",
        `${en} What is the percentage growth in the combined sales of the two products from ${y} to ${y + 1}?`,
        ans,
        `Combined sales: ${y} = ${a1} + ${b1} = ${a1 + b1}; ${y + 1} = ${a2} + ${b2} = ${a2 + b2}. Growth = (${a2 + b2} − ${a1 + b1}) ÷ ${a1 + b1} × 100 = ${fmt(ans)}%. (Work from the totals; do not average the two products’ growth rates.)`,
        {
          q: `${hi} ${y} से ${y + 1} तक दोनों उत्पादों की संयुक्त बिक्री में कितने प्रतिशत की वृद्धि हुई?`,
          e: `संयुक्त बिक्री: ${y} = ${a1} + ${b1} = ${a1 + b1}; ${y + 1} = ${a2} + ${b2} = ${a2 + b2}। वृद्धि = (${a2 + b2} − ${a1 + b1}) ÷ ${a1 + b1} × 100 = ${fmt(ans)}%। (कुल योग से हल करें; दोनों उत्पादों की वृद्धि दरों का औसत न लें।)`,
        },
        r, [(((a2 - a1) * 100) / a1 + ((b2 - b1) * 100) / b1) / 2, ((a2 + b2 - a1 - b1) * 100) / (a2 + b2)], "", "%",
      );
    }
    return close(
      id, "very-hard",
      `${en} What was the share of Product A in the combined sales of the two products in ${y + 1}?`,
      ans,
      `Combined sales in ${y + 1} = ${a2} + ${b2} = ${a2 + b2}. Share of Product A = ${a2} ÷ ${a2 + b2} × 100 = ${fmt(ans)}%.`,
      {
        q: `${hi} ${y + 1} में दोनों उत्पादों की संयुक्त बिक्री में उत्पाद A का हिस्सा कितना था?`,
        e: `${y + 1} में संयुक्त बिक्री = ${a2} + ${b2} = ${a2 + b2}। उत्पाद A का हिस्सा = ${a2} ÷ ${a2 + b2} × 100 = ${fmt(ans)}%।`,
      },
      r, [(a2 * 100) / b2, (a1 * 100) / (a1 + b1)], "", "%",
    );
  }, (id, r) => {
    // A missing figure, from the average.
    const { s, i, avg } = until(() => {
      const s = series(r, 5);
      return sum(s.vals) % 5 === 0 ? { s, i: rint(0, 4, r), avg: sum(s.vals) / 5 } : null;
    });
    const hide = (text: string) => text.replace(`${s.years[i]}: ${s.vals[i]}`, `${s.years[i]}: ?`);
    const others = s.vals.filter((_, k) => k !== i);
    return numeric(
      id, DI, "very-hard",
      `${hide(s.en)} If the average of the five yearly figures is ${avg}, what is the missing figure for ${s.years[i]}?`,
      s.vals[i],
      `Total of the five figures = 5 × ${avg} = ${fmt(5 * avg)}. The four known figures add up to ${others.join(" + ")} = ${fmt(sum(others))}. Missing figure = ${fmt(5 * avg)} − ${fmt(sum(others))} = ${s.vals[i]}.`,
      {
        q: `${hide(s.hi)} यदि पाँचों वार्षिक आँकड़ों का औसत ${avg} है, तो ${s.years[i]} का लुप्त आँकड़ा क्या है?`,
        e: `पाँचों आँकड़ों का कुल योग = 5 × ${avg} = ${fmt(5 * avg)}। चार ज्ञात आँकड़ों का योग ${others.join(" + ")} = ${fmt(sum(others))}। लुप्त आँकड़ा = ${fmt(5 * avg)} − ${fmt(sum(others))} = ${s.vals[i]}।`,
      },
      r,
    );
  }),
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const ordinal = (n: number) => `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || Math.floor(n / 10) === 1 ? 0 : n % 10]}`;

export const hasGenerator = (topicId: string) => topicId in GENERATORS;

let seq = 0;

/** Generates `count` distinct questions for a topic, from one tier or (by default) a rotation of all four. */
export function generateQuestions(topicId: string, count: number, r: Rand = Math.random, difficulty?: Difficulty): MCQ[] {
  const gens = GENERATORS[topicId];
  if (!gens) return [];
  const out: MCQ[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < count && i < count * 10; i++) {
    const tier = difficulty ?? DIFFICULTIES[i % DIFFICULTIES.length];
    // Time plus a running counter, so two sets made in the same millisecond never share an id.
    const q = gens[tier](`${topicId}-g${Date.now().toString(36)}${(seq++).toString(36)}`, r);
    if (!seen.has(q.question)) {
      seen.add(q.question);
      out.push(q);
    }
  }
  return out;
}
