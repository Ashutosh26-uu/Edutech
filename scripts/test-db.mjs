// A throwaway PostgreSQL on port 5434 for the integration tests (test:batches, test:content).
// Usage: node scripts/test-db.mjs <empty folder outside the project>
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
const dir = process.argv[2];
const pg = new EmbeddedPostgres({ databaseDir: dir, user: "studyclip", password: "studyclip", port: 5434, persistent: false, initdbFlags: ["--encoding=UTF8", "--locale=C"] });
if (!existsSync(dir)) await pg.initialise();
await pg.start();
try { await pg.createDatabase("studyclip"); } catch {}
console.log("TESTDB READY");
const stop = async () => { await pg.stop(); process.exit(0); };
process.on("SIGINT", stop); process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
