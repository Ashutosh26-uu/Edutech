import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Core idea",
      points: [
        "Every question links people through a chain; decode one link at a time and draw it.",
        "Mark males with +, females with −, couples with a double line (=), siblings on one level with a dash.",
        "Keep generations on separate rows: grandparents on top, then parents, then children.",
        "Never assume gender from a name; use only words like son, sister, husband, he/she.",
      ],
    },
    {
      heading: "Relation vocabulary",
      points: [
        "Father’s or mother’s brother: uncle; their sister: aunt.",
        "Brother’s or sister’s son: nephew; daughter: niece.",
        "Uncle’s or aunt’s child: cousin (same generation as you).",
        "Spouse’s parents: father-in-law, mother-in-law; spouse’s brother or sister’s husband: brother-in-law.",
        "Son’s wife: daughter-in-law; daughter’s husband: son-in-law.",
        "Father’s father: paternal grandfather; mother’s father: maternal grandfather.",
        "Only son of my grandfather (paternal) = my father; only daughter of my maternal grandfather = my mother.",
      ],
    },
    {
      heading: "Pointing / introducing questions",
      points: [
        "Split the sentence into “speaker” and “the person pointed at”.",
        "Start from the end of the description (“my …”) and work backwards to the speaker.",
        "Example: “son of my grandfather’s only son” → grandfather’s only son = father → father’s son = brother (or self).",
        "“My mother’s only son” refers to the speaker himself if the speaker is male.",
      ],
    },
    {
      heading: "Coded relations",
      points: [
        "Write the code meanings in a table first (e.g. @ = father, # = sister, $ = son).",
        "Read the expression left to right, drawing each link on the tree.",
        "For “which expression shows X is Y’s aunt”, test each option and check every gender is fixed.",
        "A relation is definite only if the genders and generations needed are all known.",
      ],
    },
    {
      heading: "Generations and mixed questions",
      points: [
        "Count rows on the tree to find generation gaps (grandparent to grandchild = 2 gaps).",
        "Puzzle-type sets: list couples first, then place children under them.",
        "Some sets mix direction with relations; solve the relation part first, then the distance.",
      ],
    },
  ],
  formulas: [
    "Father’s/mother’s brother = uncle; father’s/mother’s sister = aunt",
    "Sibling’s son = nephew; sibling’s daughter = niece",
    "Same generation as you: brother, sister, cousin, spouse, brother-in-law, sister-in-law",
    "One generation up: parents, uncles, aunts, parents-in-law",
  ],
  traps: [
    "Assuming B is male because the name sounds male; use “son or daughter” when gender is unknown.",
    "Calling father’s sister’s husband “father-in-law”; he is your uncle.",
    "Forgetting that “only son” of your parents can be the speaker himself.",
    "Mixing up direction of the relation: “A is B’s uncle” is not the same as “B is A’s uncle”.",
    "Reading coded expressions right to left; always go in the stated order.",
  ],
  examTips: [
    "SSC, banking and railway papers ask 2–3 questions: direct, pointing-type and coded-type.",
    "Bank mains favour family puzzles with 6–8 members and multiple conditions.",
    "Always draw the tree; mental tracking fails on three-step chains.",
  ],
};

export default notes;
