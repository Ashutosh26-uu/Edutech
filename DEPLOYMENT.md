# Deploying the full version (with accounts and payments)

The GitHub Pages site is a static demo with no backend. The full version runs on a Node host with a Postgres database. The recommended setup is free to start and scales automatically.

| Piece | Service | Free tier |
|---|---|---|
| App and API | [Netlify](https://netlify.com) (current) or [Vercel](https://vercel.com) | Free tier for testing; use a paid plan for a commercial site |
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) Postgres | Yes |
| Shared rate limiting | [Upstash Redis](https://upstash.com) | Yes |
| Payments | [Razorpay](https://razorpay.com) | Pay per transaction |

## 1. Database

This repo is linked to the Neon project `quiet-salad-64911010` (branch `production`) through `neon.ts` and `.neon`.

1. Pull the connection strings into `.env.local`:
   ```bash
   neon deploy
   ```
   This writes `DATABASE_URL` (the pooled "-pooler" host, used by the app) and `DATABASE_URL_UNPOOLED` (direct, used by migrations).
   On Supabase or another provider, set `DATABASE_URL` to the pooled url and `DIRECT_DATABASE_URL` to the direct one yourself.
2. Create the tables:
   ```bash
   npm run db:migrate
   ```
   Run this again after any schema change. Migrations are SQL files in `drizzle/`.

## 2. Hosting

Current deployment: **https://studyclip.netlify.app** (Netlify project `studyclip`, linked from this folder with `netlify link`). `netlify.toml` holds the build settings; Netlify's Next.js runtime turns the API routes into serverless functions. An older Vercel deployment (`vercel.json`, https://studyclip-six.vercel.app) still exists.

1. Deploy from this folder. The one-step command builds and uploads together:
   ```bash
   netlify deploy --prod --build
   ```
   If the upload fails with `ExpiredToken` (the build can outlast the upload token), build first and upload the build separately. Upload `.netlify/static`, **not** the `.next` folder that `netlify.toml` names. Uploading `.next` puts every CSS/JS file at `/static/...` while pages ask for `/_next/static/...`, so the site renders unstyled. This happened on 7 Nov 2026.
   ```bash
   netlify build
   netlify deploy --no-build --dir .netlify/static          # draft: prints a draft URL
   npm run check:live -- <draft URL>                         # pages, every CSS/JS file, /api/health
   netlify deploy --prod --no-build --dir .netlify/static    # same files, now live
   npm run check:live
   ```
   After any production deploy, run `npm run check:live`; it fails if a page or a CSS/JS file it references does not load. If an upload hangs, the deploy stays in "uploading", and later deploys may skip the files it never finished. Cancel it (`netlify api cancelSiteDeploy --data '{"deploy_id":"<id>"}'`; `netlify api listSiteDeploys` shows the ids) before deploying again. To put a previous deploy back live, run `netlify api restoreSiteDeploy` or use Deploys → Publish deploy in the Netlify UI.
   Or let GitHub deploy every push to `main`: `.github/workflows/deploy-netlify.yml` runs `npm run db:migrate` and then `netlify deploy --prod` (with retries). It stays switched off until you add the repository secrets `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` and `DATABASE_URL` (plus `DATABASE_URL_UNPOOLED`) under Settings → Secrets and variables → Actions.
   Deploying by hand, run `npm run db:migrate` first whenever `drizzle/` has a new migration.
2. Set the environment variables from `.env.example` (`netlify env:set KEY value --context production`, or Project configuration → Environment variables):
   `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `DB_POOL_MAX=3`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_COOKIE_SECRET` (a new random value, not the local one), `RAZORPAY_*`, `UPSTASH_*`. **Do not** set `PAYMENTS_DEMO` or `NEXT_PUBLIC_STATIC`.
3. Check `https://<your-app>/api/health` returns `{"ok":true,"db":"up"}`. In Project configuration → Functions, set the region to Singapore (next to the Neon database) if it is not already.
4. Trust the site's domain in Neon Auth, or sign-up and log-in fail with `INVALID_ORIGIN`:
   ```bash
   neon neon-auth domain add https://<your-domain>
   ```
5. Email verification is on: sign-up emails a 6-digit code (`neon neon-auth config email-password get` shows the settings), and the login page asks for it before the first session. Codes go out through Neon's shared SMTP, which is fine to start with; for production, set up your own SMTP (`neon neon-auth config email-provider`) so the emails carry your domain.
6. Before launch, follow Neon's [Auth production checklist](https://neon.com/docs/auth/production-checklist): your own SMTP for auth emails, the application name, and turning off "Allow Localhost".
7. Optionally set `ANTHROPIC_API_KEY` to turn on the AI doubt solver on `/learn` (signed-in users, `DOUBT_DAILY_LIMIT` per day, default 10). Every answer is a paid API call; set a monthly spend limit in the Anthropic Console.
8. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` (your support address). The Contact, Privacy, Terms and Refund pages then show it next to the contact form.

## Contact messages

The Contact page form saves messages in the `contact_messages` table (support, refunds, privacy requests and grievances). Run `npm run db:migrate` once after deploying it. Set `ADMIN_EMAILS` (comma-separated account emails) and the listed accounts can read and mark messages at `/admin/messages`. Without it, read them in the Neon console's SQL editor:

```sql
select created_at, topic, name, email, message, left(id::text, 8) as reference
from contact_messages where status = 'open' order by created_at;
```

Mark one as answered with `update contact_messages set status = 'answered' where id::text like 'ea365ca4%';` (use the reference the user quotes, in lower case).

## 3. Payments

1. Create a Razorpay account and finish KYC. Add **Privacy Policy, Terms and Refund Policy** pages to the site; Razorpay requires them.
2. Start with **Test Mode** keys: put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` and buy a pack with a Razorpay test card.
3. Add a webhook: Dashboard → Webhooks → URL `https://<your-domain>/api/payments/webhook`, events `payment.captured` and `order.paid`, and a secret → `RAZORPAY_WEBHOOK_SECRET`. The webhook grants access even if the buyer closes the tab before the browser confirms.
4. Switch to Live keys when ready.

## How it handles load

- **Stateless app servers.** The host adds function instances as traffic grows. Sessions are managed by Neon Auth and cached in a signed cookie, so any instance can serve any user.
- **Connection pooling.** Each instance keeps 1–3 connections; the provider's pooler multiplexes thousands of clients onto a few Postgres connections.
- **No race conditions on money.** Credits are deducted with a single conditional `UPDATE … WHERE credits > 0`. Free tests are claimed with a primary-key insert. Payments are granted once per order (unique order and payment ids), whether by the browser or the webhook.
- **Graceful overload.** Past `MAX_INFLIGHT` concurrent requests an instance answers `503` with `Retry-After` instead of slowing down for everyone. Database statements time out after 10 s.
- **Abuse protection.** Login, sign-up, test start, orders and public endpoints are rate-limited (shared across instances with Upstash).

### Load test

```bash
npm run db:dev                         # terminal 1: local Postgres
npm run db:migrate && npm run build
npx next start -p 3301                 # one or more instances
node scripts/load-test.mjs 1000 30 http://127.0.0.1:3301   # 1000 users
```

Result on a laptop with 4 local instances (Windows, local Postgres):

- **Spike:** 1,000 users started a timed test at the same moment and all 1,000 succeeded (slowest 4.0 s); 1,000 simultaneous submissions were all scored (slowest 2.3 s).
- **Sustained:** 1,000 open connections for 30 s produced 16,705 requests with 0 errors, 0 timeouts and 0 server errors.
- **Integrity:** credits left plus credits spent equalled exactly the credits issued, with no negative balances and at most one free test per user per exam.
