-- Patch: add composite index to speed "last prediction before close_time" lookups
-- Adds index on (marketId, agentId, createdAt)

CREATE INDEX IF NOT EXISTS "Prediction_marketId_agentId_createdAt_idx"
  ON "Prediction" ("marketId", "agentId", "createdAt");
