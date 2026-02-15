import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";
import { prisma } from "@/server/db";
import { SCORING_SPEC_V1 } from "@/server/scoringSpec";

// Thresholds V1 (credibility)
const MIN_TRACK_DAYS = 7;
const MIN_RESOLVED_7D = 20;
const MIN_TOTAL_RESOLVED = 30;

function startOfDayUTC(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return x;
}

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  const now = new Date();
  const day = startOfDayUTC(now);
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Resolved markets in last 7d window (by closeTime)
  const resolvedMarkets7d = await prisma.market.findMany({
    where: {
      status: "RESOLVED",
      closeTime: { gte: since7d, lt: now },
      resolvedOutcome: { not: null },
    },
    select: { id: true, closeTime: true, resolvedOutcome: true, crowdProb: true },
    orderBy: [{ closeTime: "asc" }],
    take: 500,
  });

  if (resolvedMarkets7d.length === 0) {
    return Response.json({ status: "ok", detail: "No resolved markets in last 7d", scoringSpec: SCORING_SPEC_V1 });
  }

  const marketIds = resolvedMarkets7d.map((m) => m.id);

  // Fetch last prediction before closeTime for each (agentId, marketId).
  // EXACT RULE (V1): last prediction where createdAt < closeTime; if none -> ignore.
  const lastPreds = await prisma.$queryRaw<
    Array<{ agentId: string; marketId: string; p: number; createdAt: Date; closeTime: Date; resolvedOutcome: number; crowdProb: number | null }>
  >`
    SELECT DISTINCT ON (p."agentId", p."marketId")
      p."agentId" as "agentId",
      p."marketId" as "marketId",
      p."p" as "p",
      p."createdAt" as "createdAt",
      m."closeTime" as "closeTime",
      m."resolvedOutcome" as "resolvedOutcome",
      m."crowdProb" as "crowdProb"
    FROM "Prediction" p
    JOIN "Market" m ON m."id" = p."marketId"
    WHERE p."marketId" = ANY(${marketIds})
      AND p."createdAt" < m."closeTime"
      AND m."status" = 'RESOLVED'
      AND m."resolvedOutcome" IS NOT NULL
    ORDER BY p."agentId", p."marketId", p."createdAt" DESC;
  `;

  // Aggregate per agent
  const byAgent = new Map<
    string,
    {
      briers: number[];
      deltas: number[];
      probs: number[];
      markets: Set<string>;
    }
  >();

  for (const r of lastPreds) {
    const y = Number(r.resolvedOutcome);
    const p = Number(r.p);
    const brier = (p - y) * (p - y);
    const crowd = r.crowdProb;
    const crowdBrier = crowd == null ? null : (Number(crowd) - y) * (Number(crowd) - y);

    const a = byAgent.get(r.agentId) ?? { briers: [], deltas: [], probs: [], markets: new Set() };
    a.briers.push(brier);
    a.probs.push(p);
    if (crowdBrier != null) a.deltas.push(brier - crowdBrier);
    a.markets.add(r.marketId);
    byAgent.set(r.agentId, a);
  }

  // Track record days: based on first ever prediction timestamp
  const firstPreds = await prisma.prediction.groupBy({
    by: ["agentId"],
    _min: { createdAt: true },
  });
  const firstMap = new Map(firstPreds.map((x) => [x.agentId, x._min.createdAt]));

  // Total resolved markets count per agent (ever) where agent has a valid prediction before close.
  const totalResolvedByAgent = await prisma.$queryRaw<Array<{ agentId: string; cnt: number }>>`
    SELECT p."agentId" as "agentId", COUNT(DISTINCT p."marketId")::int as cnt
    FROM "Prediction" p
    JOIN "Market" m ON m."id" = p."marketId"
    WHERE m."status" = 'RESOLVED'
      AND m."resolvedOutcome" IS NOT NULL
      AND p."createdAt" < m."closeTime"
    GROUP BY p."agentId";
  `;
  const totalMap = new Map(totalResolvedByAgent.map((x) => [x.agentId, Number(x.cnt)]));

  let upserted = 0;

  for (const [agentId, agg] of byAgent.entries()) {
    const n = agg.briers.length;
    if (n === 0) continue;

    const mean = agg.briers.reduce((s, x) => s + x, 0) / n;
    const muP = agg.probs.reduce((s, x) => s + x, 0) / agg.probs.length;
    const vol = Math.sqrt(agg.probs.reduce((s, x) => s + (x - muP) * (x - muP), 0) / agg.probs.length);

    const delta = agg.deltas.length ? agg.deltas.reduce((s, x) => s + x, 0) / agg.deltas.length : null;

    const first = firstMap.get(agentId);
    const trackDays = first ? Math.max(0, Math.floor((now.getTime() - first.getTime()) / 86400000)) : null;

    const totalResolved = totalMap.get(agentId) ?? 0;

    // Threshold flags (stored implicitly by nulling meanBrier when ineligible?)
    const eligible =
      (trackDays ?? 0) >= MIN_TRACK_DAYS &&
      agg.markets.size >= MIN_RESOLVED_7D &&
      totalResolved >= MIN_TOTAL_RESOLVED;

    await prisma.scoreDaily.upsert({
      where: { agentId_date: { agentId, date: day } },
      update: {
        meanBrier7d: eligible ? mean : null,
        volatility7d: eligible ? vol : null,
        marketsCount7d: agg.markets.size,
        deltaVsCrowd7d: eligible ? delta : null,
        trackRecordDays: trackDays,
      },
      create: {
        agentId,
        date: day,
        meanBrier7d: eligible ? mean : null,
        volatility7d: eligible ? vol : null,
        marketsCount7d: agg.markets.size,
        deltaVsCrowd7d: eligible ? delta : null,
        trackRecordDays: trackDays,
      },
    });
    upserted++;
  }

  return Response.json({
    status: "ok",
    scoringSpec: SCORING_SPEC_V1,
    window: { since: since7d.toISOString(), to: now.toISOString() },
    resolvedMarkets7d: resolvedMarkets7d.length,
    scoredAgents: byAgent.size,
    scoreDailyUpserted: upserted,
    thresholds: {
      minTrackDays: MIN_TRACK_DAYS,
      minResolved7d: MIN_RESOLVED_7D,
      minTotalResolved: MIN_TOTAL_RESOLVED,
    },
  });
}
