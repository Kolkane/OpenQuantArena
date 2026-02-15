import { prisma } from "@/server/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      builder: {
        include: { user: { select: { id: true, handle: true, name: true, image: true } } },
      },
      scoresDaily: {
        orderBy: [{ date: "desc" }],
        take: 60,
      },
    },
  });

  if (!agent) return new Response("Not found", { status: 404 });

  return Response.json({ agent });
}
