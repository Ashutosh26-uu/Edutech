import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Reading strategy",
      points: [
        "Skim the questions first so you know what to look for, then read the passage once with attention",
        "Mark the topic sentence of each paragraph and any contrast words: however, yet, but, on the other hand",
        "Note the author's view separately from the views the author reports or rejects",
        "Answer only from the passage, never from your own knowledge of the subject",
      ],
    },
    {
      heading: "Question types and how to solve them",
      points: [
        "Main idea / central theme: the option that covers every paragraph; reject ones that are too narrow or too broad",
        "Title: short, covers the whole passage, often echoes the conclusion",
        "Factual (detail): locate the key word in the passage and read the lines around it",
        "Inference: must be strongly supported by the text; not a restatement and not a leap",
        "Author's purpose: inform, argue, criticise, warn, describe or narrate; judge from the structure",
        "'EXCEPT / NOT true' and 'cannot be answered': test each option against the text line by line",
      ],
    },
    {
      heading: "Tone and attitude",
      points: [
        "Positive: appreciative, laudatory, optimistic, admiring",
        "Negative: critical, sarcastic, cynical, pessimistic, scathing",
        "Neutral: objective, analytical, informative, detached",
        "Mixed: ambivalent (both sides held), cautious, sceptical (doubting but not hostile)",
        "Judge tone from adjectives, adverbs and the conclusion, not from the subject matter",
      ],
    },
    {
      heading: "Vocabulary in context",
      points: [
        "Replace the word in the sentence with each option and keep the one that preserves the meaning",
        "The answer is often a less common sense of the word (e.g. 'sanction' as approve or penalise)",
        "Antonym questions: first fix the meaning in context, then find its opposite",
      ],
    },
    {
      heading: "Critical-reasoning questions on passages",
      points: [
        "Assumption: an unstated idea the argument needs; negate it and the argument should collapse",
        "Strengthen: adds evidence that closes the gap between premise and conclusion",
        "Weaken: offers another cause, a counter-example or shows the evidence is unrepresentative",
        "Conclusion: what the evidence leads to, stated or not",
      ],
    },
  ],
  traps: [
    "Choosing a true but minor detail as the main idea",
    "Picking options with extreme words (always, never, only, all) that the passage does not support",
    "Letting outside knowledge override what the passage actually says",
    "Taking a reported view (\"some critics argue…\") as the author's own opinion",
    "Choosing the dictionary meaning of a word instead of its meaning in the sentence",
  ],
  examTips: [
    "IBPS/SBI PO and Clerk prelims and mains have one or two RC sets of 5–8 questions; inference and vocabulary dominate",
    "SSC CGL and CHSL use short passages with five questions on title, detail, tone and word meaning",
    "CDS and AFCAT English test main idea and inference; elimination of extreme options saves time",
  ],
};

export default notes;
