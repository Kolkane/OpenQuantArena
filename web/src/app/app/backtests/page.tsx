"use client";

import { useEffect, useState } from "react";
import { apiFetch, tokenStorage } from "@/lib/api";

type Strategy = { id: string; name: string };

type Backtest = {
  id: string;
  strategy_id: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  start_date: string;
  end_date: string;
  metrics?: Record<string, unknown> | null;
  created_at: string;
};

export default function BacktestsPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [items, setItems] = useState<Backtest[]>([]);
  const [strategyId, setStrategyId] = useState<string>("");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setError(null);
    const token = tokenStorage().get();
    try {
      const [s, b] = await Promise.all([
        apiFetch<Strategy[]>("/api/strategies", { token }),
        apiFetch<Backtest[]>("/api/backtests", { token }),
      ]);
      setStrategies(s);
      setItems(b);
      if (!strategyId && s.length) setStrategyId(s[0].id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run() {
    setError(null);
    const token = tokenStorage().get();
    try {
      await apiFetch<Backtest>("/api/backtests", {
        method: "POST",
        token,
        body: JSON.stringify({ strategy_id: strategyId, start_date: startDate, end_date: endDate }),
      });
      await loadAll();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Backtests</h1>
        <button
          onClick={loadAll}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="font-semibold">Run backtest</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <select
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
            value={strategyId}
            onChange={(e) => setStrategyId(e.target.value)}
          >
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
          />
          <input
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
          />
          <button
            onClick={run}
            disabled={!strategyId}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-60"
          >
            Run
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-400">Status updates when you refresh (auto-poll later).</div>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="mt-6 space-y-3">
        {items.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Backtest {b.id.slice(0, 8)}</div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Strategy: <span className="text-slate-100">{b.strategy_id}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {b.start_date} → {b.end_date} • created {new Date(b.created_at).toLocaleString()}
            </div>
            {b.metrics ? (
              <pre className="mt-3 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
                {JSON.stringify(b.metrics, null, 2)}
              </pre>
            ) : null}
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-slate-400">No backtests yet.</div> : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Backtest["status"] }) {
  const cls =
    status === "SUCCESS"
      ? "bg-emerald-950/50 border-emerald-800 text-emerald-200"
      : status === "FAILED"
        ? "bg-red-950/50 border-red-800 text-red-200"
        : status === "RUNNING"
          ? "bg-amber-950/50 border-amber-800 text-amber-200"
          : "bg-slate-900 border-slate-700 text-slate-200";

  return <span className={`rounded-full border px-3 py-1 text-xs ${cls}`}>{status}</span>;
}
