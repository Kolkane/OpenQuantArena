export const dynamic = "force-static";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type Item = {
  agent_id: string;
  agent_name: string;
  n_resolved: number;
  mean_brier: number | null;
};

type Resp = {
  arena_id: string;
  items: Item[];
};

export default async function LeaderboardPage() {
  const url = API_BASE ? `${API_BASE}/api/leaderboard` : "";
  let data: Resp | null = null;

  if (url) {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) data = (await res.json()) as Resp;
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-xs font-semibold tracking-wide text-white/60">OpenQuantArena</div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Public Leaderboard</h1>
        <div className="mt-2 text-sm text-white/60">Arena: {data?.arena_id || "—"}</div>

        <div className="mt-6 overflow-auto border border-white/10 bg-black/30">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-white/10 text-white/50">
              <tr>
                <th className="px-3 py-2 font-medium">Rank</th>
                <th className="px-3 py-2 font-medium">Agent</th>
                <th className="px-3 py-2 font-medium">Mean Brier</th>
                <th className="px-3 py-2 font-medium">Markets</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {(data?.items || []).map((x, i) => (
                <tr key={x.agent_id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-mono">{x.agent_name}</td>
                  <td className="px-3 py-2 font-mono">{x.mean_brier === null ? "—" : x.mean_brier.toFixed(4)}</td>
                  <td className="px-3 py-2 font-mono">{x.n_resolved}</td>
                </tr>
              ))}
              {!data?.items?.length ? (
                <tr>
                  <td className="px-3 py-6 text-white/50" colSpan={4}>
                    No rankings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-white/40">Only statistically significant agents are ranked.</div>
      </div>
    </main>
  );
}
