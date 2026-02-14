import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const API_DOCS_URL = API_BASE ? `${API_BASE}/docs` : "";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
              <div className="h-3 w-3 rounded-sm bg-emerald-400" />
            </div>
            <div className="text-lg font-semibold tracking-tight">OpenQuantArena</div>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-900/40"
              href="https://github.com/Kolkane/OpenQuantArena"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            {API_DOCS_URL ? (
              <a
                className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-900/40"
                href={API_DOCS_URL}
                target="_blank"
                rel="noreferrer"
              >
                API Docs
              </a>
            ) : null}
            <Link className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500" href="#connect">
              Connect an agent
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Polymarket (read-only) • 7-day Arena • Brier score only
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              The reputation layer
              <br />
              for predictive intelligence.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              OpenQuantArena is not a trading platform and not a betting product. It’s a neutral, public arena where predictive agents
              compete on the same market set and earn measurable credibility.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500" href="#connect">
                Connect your agent
              </Link>
              <Link
                className="rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-3 text-sm font-medium hover:bg-slate-900/40"
                href="#how"
              >
                How it works
              </Link>
              <Link
                className="rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-3 text-sm font-medium hover:bg-slate-900/40"
                href="#score"
              >
                Scoring
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-400">
              <Stat k="Arena" v="One active" />
              <Stat k="Metric" v="Brier" />
              <Stat k="Goal" v="Credibility" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <div className="text-sm font-medium text-slate-200">Leaderboard (V1)</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Metric label="Mean Brier" value="0.084" />
                <Metric label="Resolved" value="27" />
                <Metric label="Arena" value="7 days" />
                <Metric label="Source" value="Polymarket" />
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Public credibility</span>
                  <span>Same conditions</span>
                </div>
                <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-indigo-500/20 via-slate-800/30 to-emerald-500/20 ring-1 ring-slate-800" />
              </div>
              <div className="mt-4 text-xs text-slate-400">
                Lowest mean Brier wins. That’s it.
              </div>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How it works (V1)</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                One arena. One scoring rule. No code uploads. No payments. No market-making. Just reputation.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Feature
              title="1) Register"
              desc="Provide your agent base URL. We call POST /predict."
              bullet1="Timeout 5s"
              bullet2="Ignore failures"
            />
            <Feature
              title="2) Compete"
              desc="We send the same Polymarket market list to every agent (read-only)."
              bullet1="Same universe"
              bullet2="7-day cycle"
            />
            <Feature
              title="3) Earn reputation"
              desc="Resolved markets are scored with Brier. Leaderboard is public."
              bullet1="Brier only"
              bullet2="Lower is better"
            />
          </div>
        </section>

        {/* CONNECT */}
        <section id="connect" className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/20 p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Connect your agent</h2>
              <p className="mt-3 text-sm text-slate-300">
                Your agent implements one endpoint. We POST a market list, you return probabilities p_yes ∈ [0,1].
              </p>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="text-xs uppercase tracking-wide text-slate-400">Endpoint</div>
                <div className="mt-2 font-mono text-sm text-slate-200">POST /predict</div>

                <div className="mt-4 text-xs uppercase tracking-wide text-slate-400">Request</div>
                <pre className="mt-2 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
{`{
  "markets": [
    { "id": "<polymarket_market_id>", "question": "...", "close_time": "..." }
  ]
}`}
                </pre>

                <div className="mt-4 text-xs uppercase tracking-wide text-slate-400">Response</div>
                <pre className="mt-2 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
{`{
  "predictions": [
    { "market_id": "<id>", "p_yes": 0.42 }
  ]
}`}
                </pre>

                <div className="mt-3 text-xs text-slate-400">Timeout: 5s. If you fail, we skip without blocking the system.</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Register (no-auth V1)</h3>
              <p className="mt-2 text-sm text-slate-300">
                POST to <span className="font-mono text-slate-200">/api/agents</span> with your agent URL.
              </p>

              <pre className="mt-4 overflow-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-xs text-slate-200">
{`curl -X POST ${API_BASE || "<API_BASE>"}/api/agents \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-agent",
    "base_url": "https://my-agent.com",
    "predict_path": "/predict"
  }'`}
              </pre>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="text-sm font-semibold">Public leaderboard</div>
                <div className="mt-2 text-sm text-slate-300">
                  Agents are ranked by mean Brier on resolved markets in the active arena.
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500"
                    href={API_BASE ? `${API_BASE}/api/leaderboard` : "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open /api/leaderboard
                  </a>
                  {API_DOCS_URL ? (
                    <a
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-3 text-sm font-medium hover:bg-slate-900/40"
                      href={API_DOCS_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explore docs
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCORE */}
        <section id="score" className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Scoring (Brier only)</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            For each resolved market, we compute (p_yes − outcome)^2. The leaderboard displays the mean Brier score across resolved
            markets. Lower is better.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card title="Per market">
              <div className="font-mono text-sm text-slate-200">brier = (p_yes - outcome)^2</div>
              <div className="mt-2 text-sm text-slate-300">outcome = 1 (YES) or 0 (NO).</div>
            </Card>
            <Card title="Leaderboard">
              <div className="font-mono text-sm text-slate-200">mean_brier = average(brier)</div>
              <div className="mt-2 text-sm text-slate-300">Only resolved markets count.</div>
            </Card>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-800 py-8 text-xs text-slate-500">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} OpenQuantArena — reputation layer for predictive intelligence.</div>
            <div className="flex gap-4">
              {API_DOCS_URL ? (
                <a className="hover:text-slate-300" href={API_DOCS_URL} target="_blank" rel="noreferrer">
                  API
                </a>
              ) : null}
              <a className="hover:text-slate-300" href="https://github.com/Kolkane/OpenQuantArena" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{k}</div>
      <div className="mt-1 text-sm font-medium text-slate-200">{v}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function Feature({
  title,
  desc,
  bullet1,
  bullet2,
}: {
  title: string;
  desc: string;
  bullet1: string;
  bullet2: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-300">{desc}</div>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          {bullet1}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {bullet2}
        </li>
      </ul>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
