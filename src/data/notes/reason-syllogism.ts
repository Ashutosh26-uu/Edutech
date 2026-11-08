import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Treat statements as true even if they contradict real life.",
        "A conclusion follows only if it is true in every possible Venn diagram of the statements.",
        "Draw the minimum overlap the statements force; then try to break each conclusion with another diagram.",
      ],
    },
    {
      heading: "Four standard statements",
      points: [
        "All A are B (universal positive): circle A fully inside B.",
        "No A is B (universal negative): A and B do not touch.",
        "Some A are B (particular positive): A and B overlap at least partly; “some” can also mean all.",
        "Some A are not B (particular negative): part of A lies outside B.",
      ],
    },
    {
      heading: "Conversion (immediate inference)",
      points: [
        "All A are B → Some B are A (and Some A are B). Never “All B are A”.",
        "No A is B → No B is A; also Some A are not B, Some B are not A.",
        "Some A are B → Some B are A.",
        "Some A are not B → no valid conversion.",
      ],
    },
    {
      heading: "Two-statement combinations",
      points: [
        "All + All ⇒ All: All A are B, All B are C ⇒ All A are C.",
        "All + No ⇒ No: All A are B, No B is C ⇒ No A is C.",
        "Some + All ⇒ Some: Some A are B, All B are C ⇒ Some A are C.",
        "Some + No ⇒ Some not: Some A are B, No B is C ⇒ Some A are not C.",
        "All + Some, Some + Some, No + No ⇒ no definite conclusion between the end terms.",
        "No A is B + All B are C ⇒ only “Some C are not A” (reverse form), not “No A is C”.",
      ],
    },
    {
      heading: "Possibility and special cases",
      points: [
        "“X being Y is a possibility” is true if some valid diagram allows it and no statement forbids it.",
        "A possibility is false if a definite “No” or “All” rules it out.",
        "“Only a few A are B” = Some A are B and Some A are not B; so “All A are B” is impossible.",
        "Either–or pair: if two conclusions are about the same terms, neither follows alone, and one is “Some” and the other “No”, answer “either I or II”.",
        "“Some A are not C” is NOT the same as “No A is C”.",
      ],
    },
  ],
  formulas: [
    "All + All = All; All + No = No; Some + All = Some; Some + No = Some not",
    "All + Some, Some + Some, No + No, Some not + anything = no definite link",
    "Complementary pair (Some/No on same two terms, neither definite) ⇒ either I or II follows",
  ],
  traps: [
    "Converting “All A are B” into “All B are A”.",
    "Using real-world knowledge instead of the given statements.",
    "Thinking “Some + Some” gives a conclusion; it never does.",
    "Applying the either–or rule when one conclusion already follows definitely.",
    "Marking a possibility true when an earlier “No” statement blocks it.",
  ],
  examTips: [
    "SBI/IBPS PO and Clerk, SSC CGL and railway exams use 2–3 statement sets with 2 conclusions.",
    "Bank papers lean heavily on possibility and “only a few” statements.",
    "Draw each set in under 30 seconds; use the combination table to verify quickly.",
  ],
};

export default notes;
