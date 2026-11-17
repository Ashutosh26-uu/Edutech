// Mock-interview coach: key terms, filler words, STAR parts, scoring and the scorecard, plus the
// AI feedback parser. No network and no database.
// Usage: npm run test:interview
import assert from "node:assert/strict";

const { analyse, keyTerms, countFillers, starParts, scorecard } = await import("../src/lib/interviewCoach.ts");
const { parseFeedback, pickQuestions } = await import("../src/lib/interviewAiShared.ts");
const { INTERVIEW } = await import("../src/data/interview.ts");

// Key terms come from the model answer, not from the question or stop words
const terms = keyTerms("A deadlock happens when processes wait in a circular chain, each holding a resource. Prevent it by breaking mutual exclusion, hold and wait, no preemption or circular wait. The OS can also detect deadlock.", "What is a deadlock?");
assert.ok(terms.includes("circular"), terms.join(","));
assert.ok(terms.includes("OS"));
assert.ok(!terms.some((t) => t.toLowerCase() === "deadlock"), "the question's own word is not a key term");
assert.ok(!terms.includes("when") && !terms.includes("each"));

// Fillers, including Hinglish ones and two-word phrases
assert.deepEqual(countFillers("Um so basically I, you know, built it. Basically matlab it worked, umm."), [
  { word: "basically", count: 2 },
  { word: "um", count: 1 },
  { word: "umm", count: 1 },
  { word: "you know", count: 1 },
  { word: "matlab", count: 1 },
]);

// STAR
assert.deepEqual(starParts("During my internship our build kept failing. I was asked to fix it before the demo, so I wrote a script to clean the cache. As a result builds took 40% less time."), { situation: true, task: true, action: true, result: true });
assert.deepEqual(starParts("I am a team player."), { situation: false, task: false, action: false, result: false });

// Scoring: a good spoken answer beats an empty one and a filler-heavy one
const model = INTERVIEW.find((s) => s.id === "hr").items[0];
const good = analyse({ round: "hr", question: model.q, modelAnswer: model.a, speakingSeconds: 60, answer: "I'm a final-year computer science student from Pune. Over the last two years I have mostly done backend development; my final-year project is an attendance system built with Spring Boot and MySQL that our department now uses. I also did a two-month internship where I wrote REST APIs and learned how code reviews work in a real team. I enjoy turning a vague problem into working software, which is why this developer role interests me." });
const empty = analyse({ round: "hr", question: model.q, modelAnswer: model.a, answer: "" });
const filler = analyse({ round: "hr", question: model.q, modelAnswer: model.a, speakingSeconds: 30, answer: "Um basically I am um a student and basically um I like um you know coding basically um yes." });
assert.ok(good.score >= 6, `good score ${good.score}`);
assert.equal(empty.score, 0);
assert.ok(filler.score < good.score);
assert.ok(filler.fillerRate > 20);
assert.ok(good.wpm > 60 && good.wpm < 120, `wpm ${good.wpm}`);
assert.ok(filler.tips.some((t) => t.includes("filler")));
assert.equal(analyse({ round: "hr", question: "q", modelAnswer: "x", answer: "typed answer here" }).wpm, null);

// Scorecard
const card = scorecard([good, empty, filler]);
assert.equal(card.answered, 2);
assert.ok(card.improvements[0].includes("unanswered"));
assert.ok(card.improvements.length <= 3);

// AI feedback parser: strict JSON, JSON inside text or fences, clamping, and garbage
assert.deepEqual(parseFeedback('{"score": 7, "strengths": ["Clear"], "improve": ["Add a number"], "betterAnswer": "Say X", "followUp": "Why Java?"}'), { score: 7, strengths: ["Clear"], improve: ["Add a number"], betterAnswer: "Say X", followUp: "Why Java?" });
assert.equal(parseFeedback('Sure! ```json\n{"score": 15, "strengths": [], "improve": [], "betterAnswer": "", "followUp": ""}\n```').score, 10);
assert.equal(parseFeedback('{"score": 6, "strengths": [], "improve": [], "betterAnswer": "", "followUp": ""}').followUp, null);
assert.equal(parseFeedback("not json at all"), null);

// Question picking: right sections, no repeats, the asked count
const picked = pickQuestions("technical", 8, () => 0.42);
assert.equal(picked.length, 8);
assert.equal(new Set(picked.map((p) => `${p.sectionId}:${p.index}`)).size, 8);
assert.ok(picked.every((p) => ["oop", "dsa", "dbms", "os", "cn", "prog"].includes(p.sectionId)));
const mixed = pickQuestions("mixed", 6, Math.random);
assert.equal(mixed[0].sectionId, "hr");
assert.ok(mixed.some((p) => p.sectionId === "behavioural"));

// Provider chain: the first provider failing (free limit hit) hands over to the next; with no keys the feature is off
process.env.NEON_AUTH_BASE_URL ??= "https://auth.invalid/neondb/auth";
process.env.NEON_AUTH_COOKIE_SECRET ??= "0123456789abcdef0123456789abcdef";
process.env.DATABASE_URL ??= "postgres://nobody:nobody@127.0.0.1:1/none";
const { interviewFeedback, interviewAiEnabled } = await import("../src/server/interviewAi.ts");
const student = { id: "u1", email: "s@test.local", name: "S", credits: 0, emailVerified: true };
const ask = { sectionId: "hr", index: 0, answer: "I am a final-year student who likes backend work." };
assert.equal(interviewAiEnabled(), false);
await assert.rejects(interviewFeedback(student, ask), (e) => e.status === 503);
process.env.GROQ_API_KEY = "test-groq";
process.env.GEMINI_API_KEY = "test-gemini";
const calls = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), body: JSON.parse(init.body) });
  if (String(url).includes("groq")) return new Response("rate limited", { status: 429 });
  return Response.json({ choices: [{ message: { content: '{"score": 8, "strengths": ["Relevant"], "improve": ["Name the project"], "betterAnswer": "I am...", "followUp": "Which backend framework do you like most?"}' } }] });
};
try {
  const fb = await interviewFeedback(student, ask);
  assert.equal(fb.provider, "gemini");
  assert.equal(fb.score, 8);
  assert.equal(calls.length, 2);
  // The question sent is the bank's own text, and the student's answer is fenced as data
  assert.ok(calls[1].body.messages[1].content.includes("Tell me about yourself."));
  assert.ok(calls[1].body.messages[1].content.includes('"""\nI am a final-year student'));
  await assert.rejects(interviewFeedback(student, { ...ask, index: 9999 }), (e) => e.status === 404);
  await assert.rejects(interviewFeedback({ ...student, emailVerified: false }, ask), (e) => e.status === 403);
  // Every provider failing gives a 503 (the page keeps its in-browser feedback)
  globalThis.fetch = async () => new Response("down", { status: 500 });
  await assert.rejects(interviewFeedback(student, ask), (e) => e.status === 503);
} finally {
  globalThis.fetch = realFetch;
}

console.log("✓ interview coach: key terms, fillers, STAR, scoring, scorecard, AI parser, question picking and provider fallback all pass");
