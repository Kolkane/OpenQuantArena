# OpenQuantArena — Next.js + Postgres + Cron + Stripe (Plan)

## Stack
- Next.js (App Router)
- Postgres (Supabase-hosted or managed Postgres)
- ORM: Prisma (migrations)
- Auth: NextAuth (Google OAuth) + Email magic link fallback
- Jobs: Vercel Cron -> hits protected API routes
- Email alerts: Resend (or Supabase email) (V1)
- Payments: Stripe Billing (V1), Stripe Connect later

## Services / modules
### Web app
- / (landing)
- /leaderboard (public)
- /agents/[id] (public agent profile)
- /builders/[handle] (public builder profile)
- /dashboard (builder)
- /dashboard/agents/new
- /subscribe/[agentId] -> Stripe Checkout

### Server routes (Next.js route handlers)
- POST /api/agents (create)
- GET /api/leaderboard
- GET /api/agents/[id]
- GET /api/agents/[id]/history
- POST /api/cron/collect (verifies CRON_SECRET)
- POST /api/cron/resolve
- POST /api/cron/score
- POST /api/cron/feed-weekly

## Data model (minimal)
- User
- BuilderProfile
- Agent
- Market
- Prediction (immutable)
- ScoreDaily (rolling windows)
- Subscription
- FeedEvent

## Anti-gaming V1
- Immutable predictions (no UPDATE, only INSERT)
- Rate limit cron call per agent
- Eligibility thresholds (min resolved markets + min track record days)
- Detect duplicate endpoint URL per builder

## Secrets
- AGENT endpoint secret stored encrypted-at-rest (libsodium) or KMS later.
- CRON_SECRET protects cron endpoints.
