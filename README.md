# OpenQuantArena

Paper-trading only: a minimal Strategy Lab + Backtest Worker + Leaderboard.

## Stack

- Python 3.11+
- FastAPI
- Postgres
- Redis
- Celery worker (dummy deterministic backtests)
- Alembic migrations

## Run locally (Docker)

```bash
cp .env.example .env
docker compose up --build
```

API will be on http://localhost:8000

## Migrations

In another shell:

```bash
docker compose exec api alembic upgrade head
```

## Quick curl demo

### 1) Register + login

```bash
curl -sS -X POST http://localhost:8000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'

TOKEN=$(curl -sS -X POST http://localhost:8000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r .access_token)

echo $TOKEN
```

### 2) Create strategy + upload file

```bash
STRAT_ID=$(curl -sS -X POST http://localhost:8000/api/strategies \
  -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"name":"mean-reversion","description":"demo"}' | jq -r .id)

echo "print(\"hello\")" > /tmp/strategy.py

curl -sS -X POST "http://localhost:8000/api/strategies/$STRAT_ID/upload" \
  -H "authorization: Bearer $TOKEN" \
  -F "file=@/tmp/strategy.py"
```

### 3) Enqueue backtest

```bash
RUN_ID=$(curl -sS -X POST http://localhost:8000/api/backtests \
  -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d "{\"strategy_id\":\"$STRAT_ID\",\"start_date\":\"2024-01-01\",\"end_date\":\"2024-12-31\"}" | jq -r .id)

echo $RUN_ID
```

### 4) Get backtest results

```bash
curl -sS -H "authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/backtests/$RUN_ID" | jq
```

### 5) Leaderboard (latest backtest per strategy)

```bash
curl -sS -H "authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/leaderboard?metric=sharpe" | jq
```
