import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "A word is turned into a code by a fixed rule; find the rule from the example and apply it to the new word.",
        "Write letter positions A = 1 … Z = 26 under both the word and its code.",
        "Compare letter by letter: same shift, growing shift, reversal, or a swap of positions.",
      ],
    },
    {
      heading: "Letter-shift coding",
      points: [
        "Uniform shift: ROSE → SPTF (each +1), so LILY → MJMZ.",
        "Uniform shift +3: ROAD → URDG, so SWAN → VZDQ.",
        "Increasing shift: +1, +2, +3… (TABLE → UCEPJ), or +2, +3, +4… (FRIEND → HUMJTK).",
        "Different rules for vowels and consonants: apply each rule separately.",
        "Wrap around: Z + 1 = A, A − 1 = Z.",
      ],
    },
    {
      heading: "Position-based coding",
      points: [
        "Reversal: the word is written backwards, sometimes followed by a shift.",
        "Opposite-letter coding: each letter becomes its pair summing to 27 (A ↔ Z, M ↔ N).",
        "Halves swapped or reversed: split the word in two and check each half.",
        "Pairs swapped: letters 1–2, 3–4… exchanged, possibly with a shift.",
      ],
    },
    {
      heading: "Number and symbol coding",
      points: [
        "Sum of positions: CAT = 3 + 1 + 20 = 24.",
        "Variants: sum × number of letters, sum of reverse positions (A = 26), or products.",
        "Direct substitution: each letter maps to a given digit or symbol; read the table carefully.",
        "Conditional codes: check the conditions (first letter vowel, last consonant…) in order before coding.",
      ],
    },
    {
      heading: "Substitution and sentence coding",
      points: [
        "'Red is called blue, blue is called green…': answer with the new name of the thing asked (sky's colour blue → called green).",
        "Sentence codes: compare two sentences; the common word and common code match.",
        "Code words may appear in any order, so match by elimination, not by position.",
      ],
    },
  ],
  formulas: [
    "Positions: A1 E5 J10 O15 T20 Y25 (EJOTY)",
    "Opposite letter = 27 − position",
    "Reverse position = 27 − forward position",
    "Shift beyond 26: subtract 26",
  ],
  traps: [
    "Check the shift for every letter; one changed step means a growing or alternating pattern.",
    "In substitution codes, answer with the code name, not the real name.",
    "In sentence coding, words are not coded in the same order as they appear.",
    "For conditional codes, apply only the first condition that matches if the question says so.",
  ],
  examTips: [
    "A guaranteed 1–3 questions in SSC, railway, bank and police exams.",
    "Newer bank papers use conditional and sentence-based coding; SSC still favours letter-shift and number coding.",
    "Memorising letter positions (EJOTY and opposite pairs) saves the most time here.",
  ],
};

export default notes;
