# Moving StudyClip to its own domain (or a new host)

The app is a standard Next.js server app. It runs on any host that runs Node.js 20 or newer:
a VPS (with `npm run build` then `npm start` behind Nginx/Caddy), Docker, Vercel, Render,
Railway or similar. Nothing in the code depends on Netlify; the steps below are what must be
set again on the new host.

Do the steps in order. Keep the old site running until step 8 passes.

## 1. Environment variables

Copy every value from the old host's settings to the new one. The full list, with notes, is in
[`.env.example`](../.env.example). Never commit real values.

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | **New:** the new address, e.g. `https://studyclip.in`, no trailing slash. Built into the browser bundle: rebuild after setting it. |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Same Neon database as today (pooled and direct URLs). |
| `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_COOKIE_SECRET` | Same values. See step 3 for the domain. |
| `ADMIN_EMAILS` | Comma-separated admin emails (publishing, access, institute verification). |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Same values. See step 4. Never set `PAYMENTS_DEMO` in production. |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CRON_SECRET` | Daily reminders. See step 5. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Strongly recommended: shared rate limiting (logins, join codes). Without them each server instance counts on its own. |
| `IP_HEADER` | **Set this on the new host:** the one header it fills with the visitor's IP (Cloudflare: `cf-connecting-ip`, nginx: `x-real-ip`). Otherwise a client can send a fake IP header and dodge rate limits. |
| `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` (and their `*_MODEL`), `DB_POOL_MAX`, `MAX_INFLIGHT`, … | Optional; copy if set today. |

## 2. Build, migrate and start

```bash
npm ci
npm run db:migrate   # safe to run every deploy; applies only new migrations
npm run build
npm start            # listens on PORT (default 3000); put HTTPS in front of it
```

## 3. Sign-in (Neon Auth): add the new domain

Neon Auth only redirects to trusted domains. Before switching DNS, add the new address to the
Neon Auth trusted domains for the production branch (Neon Console → Auth → Domains, or
`neon neon-auth domain add https://your-domain`). Without this, login fails with "invalid domain".

## 4. Payments: update the webhook URL

In the Razorpay dashboard, change the webhook URL to `https://your-domain/api/payments/webhook`
(same secret). Make a test purchase in test mode first.

## 5. Daily reminders: one hourly job

The reminder sender is `POST /api/push/send` with `Authorization: Bearer $CRON_SECRET`.
Use **one** of:

- **GitHub Actions** (works with any host): `.github/workflows/reminders.yml`. In the repository
  settings set the variable `SITE_URL` and the secret `CRON_SECRET`.
- The host's own cron, calling the URL above every hour at minute 30 UTC.

Turn off the Netlify scheduled function (`netlify/functions/send-reminders.mts`) when you leave
Netlify, so reminders are not sent twice.

## 6. Search engines

- Google Search Console: add the new domain and submit `https://your-domain/sitemap.xml`.
- On the old Netlify site, redirect every path to the new domain with a permanent (301) redirect
  so links and rankings carry over.

## 7. Deploy workflow

`.github/workflows/deploy-netlify.yml` deploys to Netlify only. Disable or replace it with the new
host's deploy step. CI checks (`.github/workflows/ci.yml`) stay as they are.

## 8. Check the new site

```bash
npm run check:live -- https://your-domain
```

Then by hand: log in, practise a set, take a timed test, open Batches, Current affairs, Exam
calendar, Institutes and Publishing (as an admin). When all work, point users to the new domain.
