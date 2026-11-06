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
  seconds: "सेकंड",
  litres: "लीटर",
  "km/h": "किमी/घंटा",
  "m/s": "मी/से",
  m: "मीटर",
  "m²": "वर्ग मीटर",
  cm: "सेमी",
  "cm²": "वर्ग सेमी",
  "cm³": "घन सेमी",
};
/** Hindi for a unit used inside question text: "cm" → "सेमी". */
const unitHi = (u: string) => UNIT_HI[u];

/** Builds a numeric MCQ with plausible near-miss distractors. */
function numeric(id: string, topicId: string, difficulty: Difficulty, question: string, answer: number, explanation: string, hi: Hi, r: Rand, unit = "", suffix = ""): MCQ {
  const steps = [0.8, 0.9, 1.1, 1.2, 1.25, 0.75, 1.5, 0.5];
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
