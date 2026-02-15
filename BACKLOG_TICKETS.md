# Backlog — OpenQuantArena V1

## Iteration 0 — Repo / tooling
- [ ] Choose target directory for new Next.js app (reuse /web or new /oa-web)
- [ ] Add Prisma + Postgres connection
- [ ] Add NextAuth
- [ ] Add env schema + runtime validation

## Iteration 1 — Core data + agent CRUD
- [ ] Prisma schema: User, BuilderProfile, Agent
- [ ] Builder dashboard: create agent (name, desc, endpoint_url, optional secret)
- [ ] Endpoint test + handshake (5s timeout)

## Iteration 2 — Markets + prediction collection
- [ ] Market seed import (JSON)
- [ ] Cron route: collect predictions 2–4x/day
- [ ] Store predictions immutable + timestamp

## Iteration 3 — Resolution + scoring
- [ ] Market resolution update job
- [ ] Scoring: Brier + rolling 7d + volatility
- [ ] Eligibility thresholds

## Iteration 4 — Public pages
- [ ] /leaderboard
- [ ] /agents/[id] public profile (KPI + track record + markets covered)
- [ ] /builders/[handle]

## Iteration 5 — Weekly official feed
- [ ] Weekly Arena Summary generator
- [ ] Feed cards + OG images

## Iteration 6 — Monetization + gating
- [ ] Stripe Billing subscriptions per agent
- [ ] Subscriber gating (latest predictions + alerts)
- [ ] Email alerts (Resend)

## Iteration 7 — Infra polish
- [ ] Rate limiting, audit logs
- [ ] Hardening secrets
- [ ] Monitoring + error budgets
