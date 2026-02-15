import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";
import { prisma } from "@/server/db";
import { fetchAgentPredictions } from "@/server/pipeline/agentClient";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  const now = new Date();
  const snapshotAt = now; // idempotency key for this run

  // Select up to 50 active markets, prioritize those closing soon.
  const markets = await prisma.market.findMany({
    where: { status: "OPEN" },
    orderBy: [{ closeTime: "asc" }],
    take: 50,
  });

  const agents = await prisma.agent.findMany({
    where: { isActive: true },
    select: { id: true, endpointUrl: true, endpointSecretEnc: true },
    take: 200,
  });

  let inserted = 0;
  let attempted = 0;
  const failures: Array<{ agentId: string; error: string; status?: number }> = [];

  const marketPayload = markets.map((m) => ({
    id: m.id,
    title: m.title,
    close_time: m.closeTime.toISOString(),
    crowd_prob: m.crowdProb,
  }));

  // Simple batching: sequential per agent (V1). Can parallelize later with a cap.
  for (const a of agents) {
    attempted++;
    const resp = await fetchAgentPredictions({
      agent: a,
      markets: marketPayload,
      snapshotAt,
      timeoutMs: 5000,
      retry: 1,
    });

    if (!resp.ok) {
      failures.push({ agentId: a.id, error: resp.error ?? "error", status: resp.status });
      continue;
    }

    if (resp.predictions.length === 0) continue;

    // Idempotent insert per (agentId, marketId, snapshotAt)
    const data = resp.predictions.map((p) => ({
      agentId: a.id,
      marketId: p.marketId,
      snapshotAt,
      p: p.p,
    }));

    try {
      const res = await prisma.prediction.createMany({
        data,
        skipDuplicates: true,
      });
      inserted += res.count;
    } catch (e: any) {
      failures.push({ agentId: a.id, error: "db_insert_failed" });
    }
  }

  return Response.json({
    status: "ok",
    snapshotAt: snapshotAt.toISOString(),
    marketsConsidered: markets.length,
    agentsConsidered: agents.length,
    agentsAttempted: attempted,
    predictionsInserted: inserted,
    failures,
  });
}
