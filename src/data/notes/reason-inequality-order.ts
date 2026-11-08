import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Direct inequalities: how to read a chain",
      points: [
        "Two terms are comparable only if the path between them keeps one direction: all of >, ≥, = or all of <, ≤, =",
        "Opposite signs on the path (A > B < C or A ≤ B ≥ C) mean no relation between the end terms",
        "If the path has at least one strict sign (> or <), the result is strict: A ≥ B > C = D gives A > D",
        "If the path has only ≥ and =, the result is ≥: A ≥ B = C gives A ≥ C, so neither A > C nor A = C follows alone",
        "If the path has only =, the result is =",
        "A ≥ B and B ≥ A together force A = B",
      ],
    },
    {
      heading: "Either–or and coded inequalities",
      points: [
        "Give 'either I or II' only when neither follows alone, both have the same two terms, and together they cover every case",
        "Valid either–or pairs: (> and =) when the relation is ≥; (< and =) when it is ≤; (> and ≤) or (< and ≥) when no relation exists",
        "Coded symbols: first decode each symbol into >, ≥, =, ≤ or < and write the statement in plain signs before testing",
        "'Not smaller than' = ≥; 'neither greater than nor equal to' = <; 'neither smaller nor greater' = =",
        "Find the symbol order that makes a conclusion definite: every sign must point the same way, with one strict sign if strict is required",
      ],
    },
    {
      heading: "Ranking in a row or class",
      points: [
        "Total = rank from top + rank from bottom − 1 (same for left/right)",
        "Rank from the other end = total − given rank + 1",
        "Persons between A and B (no overlap) = total − (A's rank from left + B's rank from right)",
        "If the ranks overlap, persons between = (sum of the two ranks) − total − 2",
        "After A and B interchange, A's new position = B's old position; use it with A's old position to get the total",
        "Students leaving above someone lower that person's rank from top; those leaving below change only the bottom rank",
      ],
    },
    {
      heading: "Ordering by height, age, weight or marks",
      points: [
        "Write every clue as a chain with the larger element on the left, then merge chains through common people",
        "'More than only T' means second from the bottom; 'more than only two' means third from the bottom",
        "When a clue leaves two people unordered, list both arrangements and answer only what is fixed in both",
        "Midway between positions p and q: position (p + q)/2, which must be a whole number",
      ],
    },
    {
      heading: "Number and letter arrangement",
      points: [
        "Do the operation (add 1, swap pairs, sort) step by step and write the new number before answering",
        "'Letters in the same place after sorting': compare each letter of the word with the sorted word position by position",
      ],
    },
  ],
  formulas: [
    "A ≥ B > C ⇒ A > C;  A ≥ B ≥ C ⇒ A ≥ C;  A > B < C ⇒ no relation",
    "k persons between two people, side unknown: min total and max total come from the two cases",
  ],
  traps: [
    "Reading A ≥ B as A > B and marking 'A > B follows'; it does not, because A may equal B",
    "Giving 'either–or' for a pair that is already definitely true or one that does not cover all cases",
    "Comparing terms joined through a reversed sign, such as concluding A > C from A > B < C",
    "Forgetting the −1 in the total formula, or adding it when counting persons between",
    "Assuming B is to the right of A when the question gives no side; check both sides",
  ],
  examTips: [
    "Coded inequalities with 2–3 conclusions are regular in IBPS/SBI PO and Clerk prelims; decode once and reuse",
    "SSC CGL/CHSL and RRB NTPC prefer row ranking, interchange and 'how many between' questions",
    "Mains papers combine an ordering puzzle with ranking; draw a single vertical line of people and fill it",
  ],
};

export default notes;
