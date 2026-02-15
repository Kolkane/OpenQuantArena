import { ImageResponse } from "@vercel/og";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

function formatBrier(x: number | null | undefined) {
  if (x == null) return "—";
  return x.toFixed(3);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) return new Response("Missing eventId", { status: 400 });

  const ev = await prisma.feedEvent.findUnique({
    where: { id: eventId },
    include: {
      agent: {
        include: {
          builder: { include: { user: { select: { handle: true } } } },
          scoresDaily: { orderBy: [{ date: "desc" }], take: 1 },
        },
      },
    },
  });

  if (!ev) return new Response("Not found", { status: 404 });

  const agentName = (ev.payload as any)?.agentName ?? ev.agent?.name ?? "Agent";
  const builderHandle = (ev.payload as any)?.builderHandle ?? ev.agent?.builder?.user?.handle ?? "builder";
  const milestone = (ev.payload as any)?.milestone ?? ev.type;
  const rank = (ev.payload as any)?.rank as number | undefined;

  const latest = ev.agent?.scoresDaily?.[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "675px",
          background: "linear-gradient(135deg, #0b0f14 0%, #070a0d 60%, #06080a 100%)",
          color: "#e6edf3",
          display: "flex",
          flexDirection: "column",
          padding: "56px",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          border: "2px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 22, letterSpacing: 1, opacity: 0.9 }}>OPENQUANTARENA</div>
          <div style={{ fontSize: 16, opacity: 0.55 }}>Performance creates visibility.</div>
        </div>

        <div style={{ marginTop: 42, display: "flex", gap: 28, flex: 1 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, opacity: 0.7 }}>Agent</div>
            <div style={{ fontSize: 54, lineHeight: 1.05, marginTop: 12, fontWeight: 700 }}>
              {agentName}
            </div>
            <div style={{ marginTop: 18, fontSize: 22, opacity: 0.75 }}>Builder: @{builderHandle}</div>

            <div
              style={{
                marginTop: 34,
                padding: "18px 20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 18, opacity: 0.7 }}>Achievement</div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>
                {rank ? `Rank #${rank}` : milestone}
              </div>
            </div>
          </div>

          <div
            style={{
              width: 420,
              padding: "22px 22px",
              background: "rgba(0, 212, 170, 0.06)",
              border: "1px solid rgba(0, 212, 170, 0.18)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 18, opacity: 0.75 }}>KPIs (7d window)</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
              <span style={{ opacity: 0.75 }}>Mean Brier</span>
              <span style={{ fontWeight: 700 }}>{formatBrier(latest?.meanBrier7d)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
              <span style={{ opacity: 0.75 }}>Track record</span>
              <span style={{ fontWeight: 700 }}>{latest?.trackRecordDays ?? "—"} days</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
              <span style={{ opacity: 0.75 }}>Markets (7d)</span>
              <span style={{ fontWeight: 700 }}>{latest?.marketsCount7d ?? "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
              <span style={{ opacity: 0.75 }}>Volatility</span>
              <span style={{ fontWeight: 700 }}>{latest?.volatility7d?.toFixed(3) ?? "—"}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, opacity: 0.5 }}>Generated from objective performance events. No ROI. No profit claims.</div>
          <div style={{ fontSize: 14, opacity: 0.55 }}>{ev.week}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 675 }
  );
}
