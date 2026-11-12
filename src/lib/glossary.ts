/**
 * Plain-word meanings of the site's own words, shown by the "?" buttons (components/InfoTip.tsx).
 * Written for someone using StudyClip for the first time: short sentences, no jargon.
 */
export const GLOSSARY = {
  xp: {
    term: "XP",
    text: "Points you earn for studying: 10 for each right answer, 2 for a wrong one, 5 for each flashcard and more for tests. Reach your daily XP goal to finish the day.",
    hi: "Padhai karne pe milne wale points.",
  },
  streak: {
    term: "Streak",
    text: "How many days in a row you have studied. Study something every day to keep it growing; miss a day and it starts again from zero.",
    hi: "Lagatar kitne din padhai ki.",
  },
  "streak-freeze": {
    term: "Streak freeze",
    text: "Saves your streak if you miss one day. You earn one for every 7 days in a row you study (you can hold 2), and it is used up automatically.",
    hi: "Ek din chhoot jaye to streak bachata hai.",
  },
  level: {
    term: "Level",
    text: "Goes up as you collect more XP. It shows how much you have studied in total.",
    hi: "Zyada XP = zyada level.",
  },
  "smart-practice": {
    term: "Smart practice",
    text: "A set of 10 questions picked for you from your exam’s syllabus, with more questions from topics you get wrong or haven’t tried yet.",
    hi: "Aapke kamzor topics se chune hue 10 sawaal.",
  },
  "free-test": {
    term: "Free test",
    text: "Your first timed test for each exam costs nothing: a full mock, a section test or a topic test. Practice without a timer is always free.",
    hi: "Har exam ka pehla timed test free hai.",
  },
  credits: {
    term: "Credits",
    text: "After the free test, each timed test uses 1 credit. Credits come in small paid packs and never expire.",
    hi: "Free test ke baad har timed test ke liye 1 credit lagta hai.",
  },
  "cards-due": {
    term: "Flashcards due",
    text: "Cards that are ready to be revised today, just before you would start forgetting them. Reviewing them now helps you remember for longer.",
    hi: "Aaj revise karne wale cards.",
  },
  accuracy: {
    term: "Accuracy",
    text: "Out of the questions you answered, the share you got right. 7 right out of 10 answered is 70%. Skipped questions don’t count.",
    hi: "Jitne sawaal kiye, unme se kitne sahi.",
  },
  "negative-marking": {
    term: "Negative marking",
    text: "In the real exam (and our timed tests), a wrong answer takes away some marks, such as ¼ of a question’s marks. A question you leave blank costs nothing, so don’t guess blindly.",
    hi: "Galat jawab pe number katte hain; chhoda hua sawaal zero.",
  },
  "sectional-timing": {
    term: "Sectional timing",
    text: "Each section of the paper has its own time limit. When a section’s time ends you move to the next one and can’t go back.",
    hi: "Har section ka alag time; time khatam to agla section.",
  },
  "mark-review": {
    term: "Mark for review",
    text: "In a timed test, tap this to flag a question you want to look at again before you submit, so you can find it quickly in the question list.",
    hi: "Sawaal ko baad mein dobara dekhne ke liye nishaan lagao.",
  },
  "revise-today": {
    term: "Revise today",
    text: "Topics you studied a while ago that are due for a quick revision today, so you don’t forget them.",
    hi: "Purane topics jo aaj dohraane hain.",
  },
} as const satisfies Record<string, { term: string; text: string; hi: string }>;

export type GlossaryId = keyof typeof GLOSSARY;
