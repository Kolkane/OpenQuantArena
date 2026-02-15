import crypto from "crypto";
import { prisma } from "@/server/db";

function sha256(x: string) {
  return crypto.createHash("sha256").update(x).digest("hex");
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;

  const referral = await prisma.referral.findUnique({
    where: { code },
    include: { event: true },
  });

  if (!referral) return new Response("Not found", { status: 404 });

  // best-effort click log (privacy-safe)
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
    const ua = req.headers.get("user-agent") ?? "";
    await prisma.referralClick.create({
      data: {
        code,
        ipHash: ip ? sha256(ip) : null,
        uaHash: ua ? sha256(ua) : null,
      },
    });
  } catch {
    // ignore
  }

  const agentId = referral.agentId;
  // redirect to agent profile (to be created). For now, leaderboard.
  const url = new URL(req.url);
  url.pathname = `/leaderboard`;
  url.search = `?ref=${encodeURIComponent(code)}`;

  return Response.redirect(url.toString(), 302);
}
