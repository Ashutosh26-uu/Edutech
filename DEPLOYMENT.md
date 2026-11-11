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

## Question reports and answer statistics

Every bank question has a **Report** button (signed in or not, 20 reports per hour per IP); reports land in `question_reports`. Answers from practice (signed in) and timed tests are also counted per question in `question_stats`, by the option's position in the bank. Admins (`ADMIN_EMAILS`) see both at `/admin/reports`: reported questions grouped by question, and **suspect answer keys** — questions with at least 15 answers where another option is picked more often than the key. Fix the question in `src/data/bank/<topic>.ts`, deploy, then mark its reports fixed. Needs migration `0005` (`npm run db:migrate`).

Result screens of server-scored tests show **rank and percentile** among everyone who took the same kind of test (each user's best attempt counts; topic and section tests compare only the same topics).

## Invites, leaderboards and visitor stats

All three need migration `0006_growth` (`npm run db:migrate`). It adds `users.referral_code` (unique), `users.display_name` (unique, case-insensitive) and `users.leaderboard` (default off), the `referrals` and `event_counts` tables, and the `attempts_week_idx` index on `test_attempts (exam_id, submitted_at)`.

**Invite a friend** (`/invite`, linked from the account menu). Each account gets an 8-character invite code (random, created on first visit) and a link `/login?tab=signup&ref=CODE`. The login page keeps the code in the browser and sends it (`POST /api/referral`) once the new account is signed in. Rules:
- Only an account created in the last 7 days with no submitted timed test can claim a code, never its own, and only once (`referrals.new_user_id` is the primary key). An address that delivers to the inviter's inbox, or to a friend's already counted (`+tags`, Gmail dots), is refused.
- The reward is paid when the new account, with a verified email, submits a timed test with at least 5 answered questions: +1 test credit to the new user and +1 to the inviter. It is claimed with a conditional `UPDATE … WHERE rewarded_at IS NULL`, so it happens once however many submits race.
- An inviter earns credits for at most 20 friends (the inviter's row is locked while the cap is checked). Friends past the cap still get their own credit.
- Change the limits in `src/server/referral.ts` (`INVITE_CAP`, `MIN_ANSWERED`, `CLAIM_WINDOW_MS`).

**Weekly leaderboards** (`/leaderboard?exam=<id>`, linked from every exam page). Opt-in: a user sets a display name (3–20 letters, numbers or spaces, unique, with a small blocked-words list) and ticks "Show me on leaderboards" (off by default). Points for a week (Monday 00:00 to Sunday 23:59, India time) are the sum of the score percentages of the user's **best 5** timed tests on that exam submitted that week; a negative score counts as 0 and late submissions (past the deadline plus the 2-minute grace) do not count. Summing the best 5 rewards practising through the week, while the cap stops anyone buying the top spot with unlimited credits. The page shows the top 50 (ties share a rank) and the viewer's own rank if they opted in. Only display names and points are sent; never emails or ids. `GET /api/leaderboard` is public and rate-limited to 60 requests a minute per IP.

**Visitor stats** (`/admin/stats`, for `ADMIN_EMAILS`). The site sends `POST /api/event` with an event name and the page path on each page view and a few actions (practice and test start, test submit, sign-up, purchase click, help bot opened, share click). The server keeps only daily counters per event and path (`event_counts`, days in India time); no cookies, IPs or user ids are stored. Query strings are dropped and ids in paths become `:id`. Unknown event names are rejected, each IP may send 120 events a minute (in-memory limit, or Upstash when set), and nothing is sent from localhost or the static build. The admin page shows views per day, top pages and event totals for the last 7 or 30 days.

## Daily study reminders (Web Push)

Opt-in browser notifications from the **Daily reminder** card on `/today`. The feature stays hidden and off until it is configured: without `NEXT_PUBLIC_VAPID_PUBLIC_KEY` the card is not shown, without `CRON_SECRET` `/api/push/send` answers 404, and the static build never shows it.

1. Generate a VAPID key pair once: `npx web-push generate-vapid-keys`.
2. Set four env vars in Netlify (production context): `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (public key), `VAPID_PRIVATE_KEY` (private key), `VAPID_SUBJECT` (`mailto:` your support address) and `CRON_SECRET` (`openssl rand -base64 32`). The public key is built into the page, so redeploy after setting it. Keep the same key pair afterwards: changing it breaks every existing subscription.
3. Run migration `0007_reminders` (`npm run db:migrate`). It adds the `push_subscriptions` table.

How it works: turning the card on asks for notification permission (only on that click), subscribes the browser and sends the subscription with the chosen time (7 am, 1 pm, 6 pm, 7 pm, 8 pm or 9 pm India time; default 7 pm) and exam to `POST /api/push/subscribe` (same-origin only, 4 KB body cap, 20 requests an hour per IP; signed-in users are linked to the row). Turning it off unsubscribes and calls `DELETE /api/push/subscribe`. The Netlify scheduled function `netlify/functions/send-reminders.mts` runs at minute 30 of every UTC hour (`30 * * * *`), which is the top of the hour in India (UTC+5:30), so a 7 pm reminder goes out at 7:00 pm IST, and calls `POST /api/push/send` with `Authorization: Bearer $CRON_SECRET`. The sender claims the rows due this India hour that were not sent today, marks them sent first (so retries never double-send), and pushes in batches of 50. Expired subscriptions (404/410) are deleted; other errors count as failures and the row is deleted after 5 in a row. Scheduled functions run only on the published production deploy; check them under Logs → Functions → `send-reminders`, or trigger one by hand:

```bash
curl -X POST https://<your-domain>/api/push/send -H "Authorization: Bearer $CRON_SECRET"
```

On iPhone and iPad, Web Push works only from a site added to the Home Screen (iOS 16.4+); the card says so in Safari.

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
