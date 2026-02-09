"use client";

import { useEffect, useState } from "react";
import { apiFetch, tokenStorage } from "@/lib/api";

type Row = {
  strategy_id: string;
  strategy_name: string;
  cagr: number;
  sharpe: number;
  max_drawdown: number;
  backtest_id: string;
};

export default function LeaderboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const token = tokenStorage().get();
    try {
      const data = await apiFetch<Row[]>("/api/leaderboard", { token });
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
        <button
          onClick={load}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-200">
            <tr>
              <th className="px-4 py-3">Strategy</th>
              <th className="px-4 py-3">CAGR</th>
              <th className="px-4 py-3">Sharpe</th>
              <th className="px-4 py-3">Max DD</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.backtest_id} className="border-t border-slate-800">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.strategy_name}</div>
                  <div className="text-xs text-slate-400">{r.strategy_id}</div>
                </td>
                <td className="px-4 py-3">{(r.cagr * 100).toFixed(2)}%</td>
                <td className="px-4 py-3">{r.sharpe.toFixed(2)}</td>
                <td className="px-4 py-3">{(r.max_drawdown * 100).toFixed(2)}%</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={4}>
                  No entries yet. Run a backtest.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
