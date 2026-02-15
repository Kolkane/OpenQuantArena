import { prisma } from "@/server/db";
import { ensureReferralForEvent } from "@/server/socialKit";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await ctx.params;
  const ev = await prisma.feedEvent.findUnique({ where: { id: eventId } });
  if (!ev) return new Response("Not found", { status: 404 });

  const agentId = ev.agentId ?? (ev.payload as any)?.agentId;
  if (!agentId) return new Response("Missing agentId on event", { status: 400 });

  const ref = await ensureReferralForEvent(eventId, agentId);

  return Response.json({
    eventId,
    refCode: ref.code,
    ogImageUrl: `/og/achievement?eventId=${encodeURIComponent(eventId)}`,
    shareUrl: `/r/${ref.code}`,
  });
}
