import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";
import { prisma } from "@/server/db";
import { loadMarketsJsonV1 } from "@/server/markets";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  const markets = loadMarketsJsonV1();
  let upserted = 0;

  for (const m of markets) {
    await prisma.market.upsert({
      where: { id: m.id },
      update: {
        source: "json_v1",
        title: m.title,
        closeTime: new Date(m.close_time),
        status: m.status as any,
        crowdProb: m.crowd_prob ?? null,
        resolvedOutcome: m.resolved_outcome ?? null,
      },
      create: {
        id: m.id,
        source: "json_v1",
        title: m.title,
        closeTime: new Date(m.close_time),
        status: m.status as any,
        crowdProb: m.crowd_prob ?? null,
        resolvedOutcome: m.resolved_outcome ?? null,
      },
    });
    upserted++;
  }

  return Response.json({ status: "ok", upserted });
}
