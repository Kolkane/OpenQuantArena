import { prisma } from "@/server/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const history = await prisma.scoreDaily.findMany({
    where: { agentId: id },
    orderBy: [{ date: "asc" }],
    take: 180,
  });

  return Response.json({ agentId: id, items: history });
}
