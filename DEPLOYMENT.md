# Deploying the full version (with accounts and payments)

The GitHub Pages site is a static demo with no backend. The full version runs on a Node host with a Postgres database. The recommended setup is free to start and scales automatically.

| Piece | Service | Free tier |
|---|---|---|
| App and API | [Vercel](https://vercel.com) (connect the GitHub repo) | Hobby plan for testing; use Pro for a commercial site |
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) Postgres | Yes |
| Shared rate limiting | [Upstash Redis](https://upstash.com) | Yes |
| Payments | [Razorpay](https://razorpay.com) | Pay per transaction |

## 1. Database

1. Create a Postgres project on Neon (region: Mumbai / `ap-south-1`) or Supabase.
2. Copy two connection strings:
   - **Pooled** (Neon "-pooler" host, or Supabase port 6543) → `DATABASE_URL`
   - **Direct** (non-pooled) → `DIRECT_DATABASE_URL`
3. Create the tables:
   ```bash
   DATABASE_URL="<pooled>" DIRECT_DATABASE_URL="<direct>" npm run db:migrate
   ```
   Run this again after any schema change. Migrations are SQL files in `drizzle/`.

## 2. Vercel

1. Import the GitHub repo in Vercel. Framework: Next.js (detected automatically).
2. In Project → Settings → Environment Variables, add the variables from `.env.example`:
   `DATABASE_URL`, `DB_POOL_MAX=3`, `RAZORPAY_*`, `UPSTASH_*`. **Do not** set `PAYMENTS_DEMO` or `NEXT_PUBLIC_STATIC`.
3. Deploy. Check `https://<your-app>/api/health` returns `{"ok":true,"db":"up"}`.

## 3. Payments

1. Create a Razorpay account and finish KYC. Add **Privacy Policy, Terms and Refund Policy** pages to the site; Razorpay requires them.
2. Start with **Test Mode** keys: put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` and buy a pack with a Razorpay test card.
3. Add a webhook: Dashboard → Webhooks → URL `https://<your-domain>/api/payments/webhook`, events `payment.captured` and `order.paid`, and a secret → `RAZORPAY_WEBHOOK_SECRET`. The webhook grants access even if the buyer closes the tab before the browser confirms.
4. Switch to Live keys when ready.

## How it handles load

- **Stateless app servers.** Vercel adds instances as traffic grows. Sessions live in the database, so any instance can serve any user.
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
