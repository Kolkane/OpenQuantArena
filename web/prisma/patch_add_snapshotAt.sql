-- Patch: add snapshotAt idempotency key to Prediction
-- Safe if Prediction table is empty (recommended before first collect run).

ALTER TABLE "Prediction"
  ADD COLUMN IF NOT EXISTS "snapshotAt" TIMESTAMP(3);

-- If you already have rows, set snapshotAt = createdAt as a fallback
UPDATE "Prediction"
SET "snapshotAt" = COALESCE("snapshotAt", "createdAt")
WHERE "snapshotAt" IS NULL;

ALTER TABLE "Prediction"
  ALTER COLUMN "snapshotAt" SET NOT NULL;

-- Drop legacy uniqueness if present
DROP INDEX IF EXISTS "Prediction_agentId_marketId_createdAt_key";

-- Add idempotency uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS "Prediction_agentId_marketId_snapshotAt_key"
  ON "Prediction" ("agentId", "marketId", "snapshotAt");

CREATE INDEX IF NOT EXISTS "Prediction_snapshotAt_idx" ON "Prediction" ("snapshotAt");
