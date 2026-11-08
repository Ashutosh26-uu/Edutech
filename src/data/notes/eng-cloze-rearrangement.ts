import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Fillers: method",
      points: [
        "Read the full sentence first and decide the meaning of the blank before looking at options",
        "Check grammar: part of speech, tense, singular/plural and the preposition that follows the blank",
        "Check logic: does the blank continue, contrast or explain the idea around it?",
        "Double blanks: eliminate on the easier blank first, then test the remaining pair together",
      ],
    },
    {
      heading: "Connectors and signal words",
      points: [
        "Contrast: but, yet, although, though, however, whereas, despite, far from",
        "Cause and result: because, since, so, therefore, hence, consequently",
        "Addition: moreover, furthermore, besides, in addition",
        "Example and sequence: for instance, first, then, finally",
        "'Far from X, it only Y' needs opposite words: far from resolving, it only worsened",
        "'Praised … while criticising': the two blanks carry opposite tone",
      ],
    },
    {
      heading: "Collocations and phrasal verbs",
      points: [
        "Reach / arrive at an agreement; move a motion; break the deadlock; reach an impasse",
        "Give up (quit) smoking; put off (postpone); call off (cancel); turn down (reject)",
        "Accused of; acquitted of; charged with; prefer to; abstain from",
        "A river overflows / bursts its banks; come clean (confess openly)",
      ],
    },
    {
      heading: "Grammar patterns tested in cloze",
      points: [
        "'Lest' takes 'should' + base verb or the base verb alone: lest you fall / lest you should fall",
        "'It is high time' + past tense: It is high time we left",
        "Third conditional: Had I known, I would have left",
        "Inversion after 'Not only', 'Hardly', 'No sooner': Not only did he…",
        "Comparative correlative: The more you practise, the more confident you will become",
      ],
    },
    {
      heading: "Para jumbles",
      points: [
        "Opening sentence introduces the topic and has no pronoun or connector pointing backwards",
        "Pronouns (he, they, this, it) and words like 'However', 'Then', 'Also' cannot open the paragraph",
        "Mandatory pairs: a pronoun sentence follows the sentence that names the noun",
        "Follow time order (first, then, finally) and cause before effect",
        "Closing sentence often states a conclusion, result or general lesson",
        "Odd-one-out: the sentence on a related but different subject breaks the chain",
      ],
    },
  ],
  formulas: [
    "lest + (should) + base verb",
    "It is high time + subject + past tense",
    "Had + subject + V3 …, subject + would have + V3",
    "The + comparative …, the + comparative …",
  ],
  traps: [
    "Choosing a word that fits the meaning but not the preposition after the blank",
    "Ignoring the contrast set up by 'although' or 'far from' in double-blank fillers",
    "Starting a para jumble with a sentence that begins 'This' or 'However'",
    "Using 'would' after 'lest' instead of 'should'",
    "Picking a pair in which only one word fits",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk papers carry a cloze passage or word-swap set and a para-jumble set in most years",
    "SSC CGL and CHSL ask single-blank fillers, cloze passages of five blanks and P-Q-R-S rearrangement",
    "In para jumbles, check options for a fixed opener or a mandatory pair to cut choices quickly",
  ],
};

export default notes;
