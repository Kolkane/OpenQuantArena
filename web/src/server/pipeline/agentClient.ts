import { Agent } from "@prisma/client";

export type MarketForAgent = {
  id: string;
  title: string;
  close_time: string;
  crowd_prob?: number | null;
};

export type AgentPredictionResponse = {
  // Preferred format
  predictions?: Array<{ market_id: string; p: number }>;
  // Fallback: map
  [marketId: string]: any;
};

function withTimeout(ms: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { ctrl, cancel: () => clearTimeout(t) };
}

export async function fetchAgentPredictions(args: {
  agent: Pick<Agent, "id" | "endpointUrl" | "endpointSecretEnc">;
  markets: MarketForAgent[];
  snapshotAt: Date;
  timeoutMs?: number;
  retry?: number;
}): Promise<{ ok: boolean; predictions: Array<{ marketId: string; p: number }>; error?: string; status?: number; latencyMs: number }> {
  const timeoutMs = args.timeoutMs ?? 5000;
  const retry = args.retry ?? 1;

  const body = {
    snapshot_at: args.snapshotAt.toISOString(),
    markets: args.markets,
  };

  let attempt = 0;
  const start0 = Date.now();

  while (attempt <= retry) {
    attempt++;
    const { ctrl, cancel } = withTimeout(timeoutMs);
    const start = Date.now();
    try {
      const res = await fetch(args.agent.endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(args.agent.endpointSecretEnc
            ? { "x-agent-secret": args.agent.endpointSecretEnc }
            : {}),
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      cancel();

      const latencyMs = Date.now() - start;
      if (!res.ok) {
        const err = `http_${res.status}`;
        if (attempt <= retry && (res.status >= 500 || res.status === 429)) continue;
        return { ok: false, predictions: [], error: err, status: res.status, latencyMs };
      }

      const data = (await res.json()) as AgentPredictionResponse;

      // Preferred: {predictions:[{market_id,p}]}
      const predsRaw = Array.isArray(data.predictions) ? data.predictions : null;
      const out: Array<{ marketId: string; p: number }> = [];

      if (predsRaw) {
        for (const pr of predsRaw) {
          const p = Number(pr.p);
          if (!Number.isFinite(p)) continue;
          if (p < 0 || p > 1) continue;
          out.push({ marketId: pr.market_id, p });
        }
      } else {
        // Fallback: allow {"market_001": 0.61, ...}
        for (const m of args.markets) {
          const v = (data as any)[m.id];
          if (v == null) continue;
          const p = Number(v);
          if (!Number.isFinite(p)) continue;
          if (p < 0 || p > 1) continue;
          out.push({ marketId: m.id, p });
        }
      }

      return { ok: true, predictions: out, latencyMs };
    } catch (e: any) {
      cancel();
      const latencyMs = Date.now() - start;
      const isAbort = e?.name === "AbortError";
      if (attempt <= retry && (isAbort || e?.code === "ECONNRESET")) continue;
      return {
        ok: false,
        predictions: [],
        error: isAbort ? "timeout" : "fetch_error",
        latencyMs,
      };
    }
  }

  return { ok: false, predictions: [], error: "unknown", latencyMs: Date.now() - start0 };
}
