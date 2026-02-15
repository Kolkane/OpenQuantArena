import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";
import { prisma } from "@/server/db";
import { isoWeek } from "@/server/socialKit";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  const week = isoWeek();

  // Latest score per agent (already computed by scoring cron).
  const rows = await prisma.scoreDaily.findMany({
    orderBy: [{ date: "desc" }],
    distinct: ["agentId"],
    include: { agent: { include: { builder: { include: { user: true } } } } },
    take: 500,
  });

  const eligible = rows
    .filter((r) => r.meanBrier7d != null)
    .sort((a, b) => (a.meanBrier7d ?? 999) - (b.meanBrier7d ?? 999));

  // Rarity / credibility guardrail: if <3 eligible agents, do not publish Top5.
  const top5 = eligible.length >= 3 ? eligible.slice(0, 5) : [];
  const created: string[] = [];

  // Create Top5 events
  for (let i = 0; i < top5.length; i++) {
    const r = top5[i];
    const agent = r.agent;
    const builderHandle = agent.builder.user.handle ?? agent.builder.user.name ?? "builder";

    const uniqueKey = `TOP5:${week}:${agent.id}:#${i + 1}`;

    const ev = await prisma.feedEvent.upsert({
      where: { uniqueKey },
      update: {},
      create: {
        uniqueKey,
        week,
        type: "AGENT_TOP5_7D",
        agentId: agent.id,
        payload: {
          agentId: agent.id,
          agentName: agent.name,
          builderHandle,
          rank: i + 1,
          meanBrier7d: r.meanBrier7d,
          trackRecordDays: r.trackRecordDays,
          marketsCount7d: r.marketsCount7d,
        },
      },
    });
    created.push(ev.id);
  }

  // #1 event (if exists)
  if (eligible[0]) {
    const r = eligible[0];
    const agent = r.agent;
    const builderHandle = agent.builder.user.handle ?? agent.builder.user.name ?? "builder";

    const uniqueKey = `WEEKLY_WINNER:${week}:${agent.id}`;
    const ev = await prisma.feedEvent.upsert({
      where: { uniqueKey },
      update: {},
      create: {
        uniqueKey,
        week,
        type: "AGENT_WEEKLY_WINNER",
        agentId: agent.id,
        payload: {
          agentId: agent.id,
          agentName: agent.name,
          builderHandle,
          rank: 1,
          meanBrier7d: r.meanBrier7d,
          trackRecordDays: r.trackRecordDays,
        },
      },
    });
    created.push(ev.id);
  }

  return Response.json({
    status: "ok",
    week,
    agentsConsidered: rows.length,
    eligibleAgents: eligible.length,
    eventsCreatedOrExisting: created.length,
    eventIds: created,
  });
}
