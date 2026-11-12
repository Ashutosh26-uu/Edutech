// Checks that progress writes tell live widgets after the write, not during it: a write made while
// React renders one component must not set state in another (the "Cannot update a component (Nav)
// while rendering TypingTest" warning). Run: npm run test:store
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};
let events = 0;
globalThis.window = new EventTarget();
window.addEventListener("studyclip:update", () => events++);

const { awardXp, load } = await import("../src/lib/storage.ts");

let fail = 0;
const eq = (name, got, want) => {
  if (got !== want) {
    fail++;
    console.log(`✗ ${name}: got ${got}, want ${want}`);
  }
};

awardXp(10);
eq("write is saved at once", load().xp, 10);
eq("no event during the write (would update other components mid-render)", events, 0);
awardXp(5);
await Promise.resolve();
eq("one event after the writes, from a microtask", events, 1);
eq("both writes kept", load().xp, 15);
awardXp(1);
await Promise.resolve();
eq("a later write sends its own event", events, 2);

if (fail) {
  console.log(`${fail} store notification check(s) failed`);
  process.exit(1);
}
console.log("✓ store notifications are deferred and coalesced");
