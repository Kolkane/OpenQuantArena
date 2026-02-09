"use client";

import { useEffect, useState } from "react";
import { apiFetch, tokenStorage } from "@/lib/api";

type Strategy = {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  created_at: string;
};

type StrategyCreate = { name: string; description?: string | null };

export default function StrategiesPage() {
  const [items, setItems] = useState<Strategy[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setError(null);
    const token = tokenStorage().get();
    try {
      const data = await apiFetch<Strategy[]>("/api/strategies", { token });
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setLoading(true);
    setError(null);
    const token = tokenStorage().get();
    try {
      const payload: StrategyCreate = { name, description: description || null };
      await apiFetch<Strategy>("/api/strategies", { method: "POST", body: JSON.stringify(payload), token });
      setName("");
      setDescription("");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Strategies</h1>
        <button
          onClick={load}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="font-semibold">Create strategy</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          disabled={!name || loading}
          onClick={create}
          className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-slate-800">
                <td className="px-4 py-3">
                  <div className="font-medium">{s.name}</div>
                  {s.description ? <div className="text-xs text-slate-400">{s.description}</div> : null}
                </td>
                <td className="px-4 py-3 text-slate-300">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={2}>
                  No strategies yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Note: file upload UI comes next (upload .py to /strategies/{"{id}"}/upload).
      </div>
    </div>
  );
}
