import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Statement and assumption",
      points: [
        "An assumption is unstated and taken for granted by the person making the statement",
        "Advertisements assume people want the promised benefit and that the advert will influence them",
        "Notices and appeals assume people will respond or that the step will work",
        "Negation test: if the opposite of the assumption makes the statement pointless, it is implicit",
        "Extreme words (only, all, always, best) usually make an assumption non-implicit",
      ],
    },
    {
      heading: "Statement and conclusion / inference",
      points: [
        "A conclusion must follow directly from the statement, with no outside facts",
        "'Most' does not mean 'all'; 'some' does not mean 'not all'",
        "'Only those who X' gives a necessary condition: everyone eligible has X, not everyone with X is chosen",
        "Inference grading: definitely true, probably true, data inadequate, probably false, definitely false",
        "'Data inadequate' when the passage neither supports nor denies the inference",
      ],
    },
    {
      heading: "Arguments: strong or weak",
      points: [
        "Strong: relevant, important, directly linked to the question and backed by reason",
        "Weak: ambiguous, emotional, based on examples from elsewhere, or claiming 'only way'",
        "A 'Yes' or 'No' that just restates the question is weak",
        "Both a 'Yes' and a 'No' argument can be strong at the same time",
      ],
    },
    {
      heading: "Course of action",
      points: [
        "A valid action is practical, legal, proportionate and tackles the problem or its cause",
        "Immediate relief (treat patients, clean up) and long-term prevention can both follow",
        "Extreme steps (ban, close down, dismiss everyone) rarely follow",
        "An action that only punishes after the fact, without solving the problem, is usually rejected",
      ],
    },
    {
      heading: "Cause and effect; strengthen and weaken",
      points: [
        "Options: I causes II, II causes I, both independent causes, both effects of a common cause, or effects of independent causes",
        "The cause usually happens earlier; check time order and logical link",
        "Strengthen: new evidence that supports the link between evidence and conclusion",
        "Weaken: another explanation, a counter-example or a flaw in the sample",
        "Correlation is not causation (breakfast and higher marks may share a common cause)",
      ],
    },
  ],
  traps: [
    "Using general knowledge to accept a conclusion the statement does not support",
    "Treating 'only those' as a guarantee that everyone meeting the condition is selected",
    "Accepting harsh actions such as bans as 'logical' because they sound decisive",
    "Rejecting a strong argument because you disagree with its side",
    "Assuming two events are linked as cause and effect only because they happen together",
  ],
  examTips: [
    "IBPS/SBI PO mains and RBI Grade B ask assumption, course of action, inference and strengthen/weaken in sets",
    "SSC CGL and CHSL prefer statement–conclusion and statement–assumption with two options",
    "Answer patterns: only I, only II, either I or II, neither, both; check each option independently first",
  ],
};

export default notes;
