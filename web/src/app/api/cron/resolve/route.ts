import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";
import { prisma } from "@/server/db";
import { loadMarketsJsonV1 } from "@/server/markets";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  const markets = loadMarketsJsonV1();
  let updated = 0;

  for (const m of markets) {
    if (m.resolved_outcome == null) continue;

    await prisma.market.updateMany({
      where: { id: m.id },
      data: {
        status: "RESOLVED",
        resolvedOutcome: m.resolved_outcome,
      },
    });
    updated++;
  }

  return Response.json({ status: "ok", resolvedUpdated: updated });
}
