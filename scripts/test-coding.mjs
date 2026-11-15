// Coding-round problems: shape of the data the in-browser runner depends on, and output comparison.
import assert from "node:assert/strict";
import { CODING_PROBLEMS, CODING_PROBLEM_BY_ID } from "../src/data/coding-problems.ts";

const ids = new Set();
for (const p of CODING_PROBLEMS) {
  const where = `problem ${p.id}`;
  assert.match(p.id, /^[a-z0-9-]+$/, `${where}: id must be lowercase-kebab`);
  assert.ok(!ids.has(p.id), `${where}: duplicate id`);
  ids.add(p.id);
  assert.ok(p.title && p.statement && p.inputFormat && p.outputFormat && p.constraints, `${where}: missing text`);
  assert.ok(["easy", "medium"].includes(p.difficulty), `${where}: bad difficulty`);
  assert.ok(p.samples.length >= 2, `${where}: needs at least 2 samples`);
  assert.ok(p.hidden.length >= 3, `${where}: needs at least 3 hidden tests`);
  for (const t of [...p.samples, ...p.hidden]) {
    assert.equal(typeof t.input, "string", `${where}: input must be a string`);
    assert.ok(t.output.trim().length > 0, `${where}: empty expected output`);
  }
  const all = [...p.samples, ...p.hidden].map((t) => t.input);
  assert.equal(new Set(all).size, all.length, `${where}: repeated test input`);
  for (const lang of ["python", "javascript"]) assert.ok(p.starter[lang]?.trim(), `${where}: no ${lang} starter`);
}
assert.ok(CODING_PROBLEMS.length >= 20, "expected at least 20 problems");
assert.equal(CODING_PROBLEM_BY_ID.size, CODING_PROBLEMS.length);

// The runner's comparison ignores trailing spaces, \r and blank lines at the end, but not content.
const { normalise } = await import("../src/lib/codeRunnerCompare.ts");
assert.equal(normalise("1 2 3  \r\n\n"), normalise("1 2 3"));
assert.equal(normalise("a\n  b"), "a\nb");
assert.notEqual(normalise("1 2"), normalise("12"));
assert.notEqual(normalise("YES"), normalise("yes"));

console.log(`coding problems ok: ${CODING_PROBLEMS.length} problems, ${CODING_PROBLEMS.reduce((n, p) => n + p.samples.length + p.hidden.length, 0)} tests`);
