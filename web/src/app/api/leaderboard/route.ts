import { prisma } from "@/server/db";

export async function GET() {
  // Latest snapshot per agent (ScoreDaily is precomputed by cron).
  const rows = await prisma.scoreDaily.findMany({
    orderBy: [{ date: "desc" }],
    distinct: ["agentId"],
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          description: true,
          subscriptionEnabled: true,
          priceEurMonthly: true,
          builder: {
            select: {
              user: { select: { handle: true, name: true, image: true } },
              twitterUrl: true,
              githubUrl: true,
            },
          },
        },
      },
    },
    take: 200,
  });

  // Rank by meanBrier7d asc (lower is better). Nulls last.
  const sorted = [...rows].sort((a, b) => {
    const av = a.meanBrier7d;
    const bv = b.meanBrier7d;
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return av - bv;
  });

  const out = sorted.map((r, idx) => ({
    rank: idx + 1,
    agentId: r.agentId,
    agent: r.agent,
    date: r.date,
    meanBrier7d: r.meanBrier7d,
    volatility7d: r.volatility7d,
    marketsCount7d: r.marketsCount7d,
    deltaVsCrowd7d: r.deltaVsCrowd7d,
    trackRecordDays: r.trackRecordDays,
  }));

  return Response.json({
    asOf: rows[0]?.date ?? null,
    count: out.length,
    items: out,
  });
}
