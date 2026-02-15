// Scoring Spec (V1) — keep it simple and audit-friendly.
//
// For each (agentId, marketId):
//   select the LAST prediction where createdAt < closeTime.
//   If none -> ignore (agent has no valid submission for that market).
//
// No averaging.
// No weighting.
// No multi-score.
//
// Brier score per market (binary outcome y in {0,1}): (p - y)^2.
export const SCORING_SPEC_V1 = {
  rule: "last_prediction_before_close",
  comparator: "createdAt < closeTime",
  score: "brier_binary",
} as const;
