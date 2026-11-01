// Starts a real local PostgreSQL server (embedded binaries) for development and load testing.
// Usage: npm run db:dev   →   DATABASE_URL=postgres://studyclip:studyclip@127.0.0.1:5433/studyclip
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const dir = "./.pgdata";
const pg = new EmbeddedPostgres({ databaseDir: dir, user: "studyclip", password: "studyclip", port: 5433, persistent: true, initdbFlags: ["--encoding=UTF8", "--locale=C"], postgresFlags: ["-c", "max_connections=300"] });
if (!existsSync(dir)) await pg.initialise();
await pg.start();
try {
  await pg.createDatabase("studyclip");
} catch {
  /* already exists */
}
console.log("Postgres ready: postgres://studyclip:studyclip@127.0.0.1:5433/studyclip");
const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
