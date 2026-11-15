// The plain-text quiz format editors paste into /admin/content.
import assert from "node:assert/strict";
import { parseQuizText } from "../src/lib/quizText.ts";

const sample = `Q: Which organisation publishes the World Economic Outlook?
A) World Bank
B) IMF
C) WTO
D) OECD
Answer: B
Explanation: The International Monetary Fund publishes it twice a year.

2. Capital of Australia?
(a) Sydney
(b) Melbourne
(c) Canberra
(d) Perth
Ans - c

Q3. Missing answer?
A. one
B. two
C. three
D. four`;

const { questions, errors } = parseQuizText(sample);
assert.equal(questions.length, 2);
assert.equal(questions[0].question, "Which organisation publishes the World Economic Outlook?");
assert.deepEqual(questions[0].options, ["World Bank", "IMF", "WTO", "OECD"]);
assert.equal(questions[0].answer, 1);
assert.match(questions[0].explanation, /twice a year/);
assert.equal(questions[1].question, "Capital of Australia?");
assert.equal(questions[1].answer, 2);
assert.equal(errors.length, 1);
assert.match(errors[0], /Answer: B/);
assert.equal(parseQuizText("").questions.length, 0);
console.log("✓ quiz text format: questions, options, answers, explanations and error messages");

// Numbered statements stay, on their own lines; "Reason:" before the options belongs to the question.
const st = parseQuizText(`Consider the following statements:
1. The Earth is round.
2. The Sun is a star.
Which of the above is/are correct?
A) 1 only
B) 2 only
C) Both 1 and 2
D) Neither 1 nor 2
Answer: C

Assertion: Plants make food.
Reason: plants need light.
A) Both true, R explains A
B) Both true, R does not explain A
C) A true, R false
D) A false, R true
Answer: A
Explanation: Photosynthesis needs light.`);
assert.equal(st.errors.length, 0, st.errors.join("; "));
assert.equal(st.questions[0].question, "Consider the following statements:\n1. The Earth is round.\n2. The Sun is a star.\nWhich of the above is/are correct?");
assert.match(st.questions[1].question, /Reason: plants need light\./);
assert.equal(st.questions[1].explanation, "Photosynthesis needs light.");
console.log("✓ quiz text format: numbered statements and assertion–reason questions");
