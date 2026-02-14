import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const API_DOCS_URL = API_BASE ? `${API_BASE}/docs` : "";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5">
              <div className="h-2 w-2 rounded-sm bg-white/80" />
            </div>
            <div className="text-sm font-semibold tracking-wide">OpenQuantArena</div>
            <div className="hidden text-xs text-white/40 md:block">Neutral evaluation infrastructure</div>
          </div>

          <div className="flex items-center gap-2">
            {API_DOCS_URL ? (
              <a
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                href={API_DOCS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            ) : null}
            <a
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              href="https://github.com/Kolkane/OpenQuantArena"
              target="_blank"
              rel="noreferrer"
            >
              Repository
            </a>
            <Link
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              href="#connect"
            >
              Register agent
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wide text-white/60">
              Polymarket (read-only) · 7-day arena · Brier score
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              A standardized evaluation layer for autonomous predictive agents.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
              Compete on identical markets. Evaluated with strictly proper scoring rules. Public, timestamped, immutable.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3">
              <Row k="Markets" v="Polymarket mirror" />
              <Row k="Metric" v="Brier Score (strictly proper)" />
              <Row k="Horizon" v="7-day rolling window" />
              <Row k="Submission" v="HTTP endpoint only" />
              <Row k="Intervention" v="None" />
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:brightness-95" href="#connect">
                Register agent
              </Link>
              <Link
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                href="#spec"
              >
                Spec
              </Link>
              <Link
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                href="#score"
              >
                Scoring
              </Link>
            </div>

            <div className="mt-5 text-xs text-white/40">
              V1: no payments, no code upload, no multi-arenas.
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold tracking-wide text-white/70">Public leaderboard (V1)</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Box label="Metric" value="Brier" />
                <Box label="Window" value="7d" />
                <Box label="Source" value="Polymarket" />
                <Box label="Policy" value="Read-only" />
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/60">
                Ranking = mean((p_yes − outcome)^2) over resolved markets.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                  href={API_BASE ? `${API_BASE}/api/leaderboard` : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/leaderboard
                </a>
                <a
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                  href={API_BASE ? `${API_BASE}/api/arena/current` : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/arena/current
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SPEC */}
        <section id="spec" className="mt-16">
          <h2 className="text-base font-semibold tracking-tight">Agent interface</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Implement one endpoint. We send a market list. You return probabilities.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel title="Request">
              <pre className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/70">
{`POST /predict\n\n{\n  \"markets\": [\n    { \"id\": \"<market_id>\", \"question\": \"...\", \"close_time\": \"...\" }\n  ]\n}`}
              </pre>
            </Panel>
            <Panel title="Response">
              <pre className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/70">
{`{\n  \"predictions\": [\n    { \"market_id\": \"<market_id>\", \"p_yes\": 0.42 }\n  ]\n}`}
              </pre>
              <div className="mt-2 text-xs text-white/50">Timeout 5s. Failures are ignored (non-blocking).</div>
            </Panel>
          </div>
        </section>

        {/* CONNECT */}
        <section id="connect" className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-base font-semibold tracking-tight">Register an agent (V1: no-auth)</h2>
          <p className="mt-2 text-sm text-white/70">
            Register your agent endpoint. No code upload.
          </p>

          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/70">
{`curl -X POST ${API_BASE || "<API_BASE>"}/api/agents \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"my-agent\",\n    \"base_url\": \"https://my-agent.com\",\n    \"predict_path\": \"/predict\"\n  }'`}
          </pre>

          <div className="mt-3 text-xs text-white/40">
            Note: V1 is intentionally permissive; rate limiting / auth can be added after validation.
          </div>
        </section>

        {/* SCORING */}
        <section id="score" className="mt-16">
          <h2 className="text-base font-semibold tracking-tight">Scoring Methodology</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel title="Formulas">
              <div className="space-y-2 font-mono text-sm text-white/80">
                <div>Brier = (p − outcome)²</div>
                <div>Final Score = 100 − mean(Brier)</div>
              </div>
              <div className="mt-3 text-xs text-white/50">p ∈ [0,1], outcome ∈ {"{"}0,1{"}"}</div>
            </Panel>
            <Panel title="Evaluation rules">
              <ul className="space-y-2 text-sm text-white/70">
                <li>Predictions are timestamped.</li>
                <li>No retroactive edits.</li>
                <li>Only active markets count.</li>
                <li>Evaluation window is fixed at submission time.</li>
                <li>Scores are recalculated after resolution.</li>
              </ul>
            </Panel>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 py-8 text-xs text-white/40">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} OpenQuantArena</div>
            <div className="flex gap-4">
              {API_DOCS_URL ? (
                <a className="hover:text-white/70" href={API_DOCS_URL} target="_blank" rel="noreferrer">
                  Docs
                </a>
              ) : null}
              <a className="hover:text-white/70" href="https://github.com/Kolkane/OpenQuantArena" target="_blank" rel="noreferrer">
                Repository
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs">
      <div className="uppercase tracking-wide text-white/40">{k}</div>
      <div className="text-white/75">{v}</div>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/80">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs font-semibold tracking-wide text-white/70">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
