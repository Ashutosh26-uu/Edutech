import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Standard answer pattern",
      points: [
        "(a) I alone is sufficient, II is not",
        "(b) II alone is sufficient, I is not",
        "(c) Either I alone or II alone is sufficient",
        "(d) Neither alone, but both together are sufficient",
        "(e) Even both together are not sufficient",
        "Read the option wording each time; some papers order these differently",
      ],
    },
    {
      heading: "Method",
      points: [
        "Step 1: test I alone; Step 2: test II alone; Step 3: only if both fail, combine them",
        "You need a single definite answer, not the answer itself; stop once sufficiency is clear",
        "Yes/No questions: sufficient if the answer is always yes or always no",
        "Three statements: check single statements, then pairs, then all three; pick the smallest set that works",
      ],
    },
    {
      heading: "Hidden gaps to watch",
      points: [
        "x² = 9 gives x = ±3, not one value unless sign is fixed",
        "Two equations that are multiples of each other are really one equation",
        "Integer vs real: 'x is an integer' changes what can be decided",
        "Blood relations: unknown gender of the linking person leaves the relation open",
        "Directions: a turn without a starting direction gives no final direction",
        "Ranking: 'taller than B' does not fix order among others",
        "Geometry: area of a square needs one of side, diagonal or perimeter; a right triangle needs a² + b² = c² checked",
      ],
    },
    {
      heading: "Code-language DS",
      points: [
        "Compare two sentences: the common word gets the common code",
        "If a word always appears with another, their codes can never be separated",
        "A code is found only when exactly one unknown word–code pair remains",
      ],
    },
    {
      heading: "Machine input–output",
      points: [
        "Find the rule from Input → Step I → Step II; check it on every element",
        "Common rules: reverse digits, square/divide, sort ascending or descending, move one word per step to the left or right",
        "Word rules: alphabetical order, word length, replacing first/last letter with the next letter",
        "In arrangement machines, untouched elements keep their relative order",
        "To find the input from a later step, reverse the rule step by step",
        "Last step: when no further rearrangement is possible",
      ],
    },
  ],
  traps: [
    "Combining statements before testing each alone, which hides an 'either' answer",
    "Choosing 'either' when only one statement works alone",
    "Missing the negative root or the unknown gender and wrongly calling a statement sufficient",
    "Solving fully when only sufficiency was asked, wasting time",
    "In input–output, assuming the rule from one element without checking the others",
  ],
  examTips: [
    "IBPS/SBI PO mains and RBI Grade B set DS on ranking, relations, directions and codes, often with three statements",
    "Quant DS (arithmetic, profit, speed) appears in bank mains alongside reasoning DS",
    "Input–output sets of five questions come in bank PO mains; ask for a step number, an element position or the input",
  ],
};

export default notes;
