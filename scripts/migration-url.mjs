// The connection string migrations should use. A direct (non-pooled) url is preferred, but only
// when it points at the same database host as DATABASE_URL (Neon's pooler host is the direct host
// plus "-pooler"). This stops `DATABASE_URL=<local> npm run db:migrate` from silently migrating the
// remote database named by DATABASE_URL_UNPOOLED in .env.local.
const host = (u) => {
  try {
    return new URL(u).hostname.replace("-pooler.", ".");
  } catch {
    return null;
  }
};

export function migrationUrl(env = process.env) {
  const main = env.DATABASE_URL;
  if (!main) return null;
  const direct = env.DATABASE_URL_UNPOOLED || env.DIRECT_DATABASE_URL;
  return direct && host(direct) === host(main) ? direct : main;
}

export const describeTarget = (u) => {
  try {
    const x = new URL(u);
    return `${x.hostname}${x.port ? `:${x.port}` : ""}${x.pathname}`;
  } catch {
    return "(unparseable url)";
  }
};
