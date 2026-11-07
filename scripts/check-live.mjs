// Checks a deployed site: key pages load, every CSS/JS file they reference is served, and the
// health check reports the database up. Exits 1 on any failure.
// Run: npm run check:live -- https://studyclip.netlify.app   (or a draft URL)
const base = (process.argv[2] ?? "https://studyclip.netlify.app").replace(/\/$/, "");
const PAGES = ["/", "/exams", "/exams/ssc-cgl", "/exams/jee-main", "/exams/neet-ug", "/practice", "/learn", "/review", "/pricing", "/about"];

let fails = 0;
const fail = (msg) => {
  console.log(`FAIL  ${msg}`);
  fails++;
};
const status = async (url) => {
  try {
    return (await fetch(url, { redirect: "follow" })).status;
  } catch (e) {
    return `error: ${e.message}`;
  }
};

const assets = new Set();
for (const path of PAGES) {
  const res = await fetch(base + path).catch(() => null);
  if (!res || res.status !== 200) {
    fail(`${path} → ${res?.status ?? "no response"}`);
    continue;
  }
  const html = await res.text();
  const found = [...html.matchAll(/\/_next\/static\/[^"'\s)]+\.(?:css|js)/g)].map((m) => m[0]);
  if (!found.some((a) => a.endsWith(".css"))) fail(`${path}: references no stylesheet under /_next/static`);
  found.forEach((a) => assets.add(a));
}

const results = await Promise.all([...assets].map(async (a) => [a, await status(base + a)]));
for (const [a, s] of results) if (s !== 200) fail(`${a} → ${s}`);

const health = await fetch(`${base}/api/health`).then((r) => r.json()).catch(() => null);
if (!health?.ok || health.db !== "up") fail(`/api/health → ${JSON.stringify(health)}`);

console.log(`Checked ${PAGES.length} pages and ${assets.size} CSS/JS files on ${base}.`);
console.log(fails ? `\n${fails} check(s) failed` : "All checks passed");
process.exit(fails ? 1 : 0);
