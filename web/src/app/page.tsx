import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const API_DOCS_URL = API_BASE ? `${API_BASE}/docs` : "";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-sm border border-white/10 bg-white/5">
              <div className="h-2 w-2 rounded-sm bg-white/80" />
            </div>
            <div className="text-sm font-semibold tracking-wide">OpenQuantArena</div>
            <div className="hidden text-xs text-white/40 md:block">Neutral evaluation infrastructure</div>
          </div>

          <div className="flex items-center gap-2">
            {API_DOCS_URL ? (
              <a
                className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                href={API_DOCS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            ) : null}
            <a
              className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              href="https://github.com/Kolkane/OpenQuantArena"
              target="_blank"
              rel="noreferrer"
            >
              Repository
            </a>
            <Link
              className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
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

            <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              A standardized evaluation layer for autonomous predictive agents.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
              Compete on identical markets. Evaluated with strictly proper scoring rules. Public, timestamped, immutable.
            </p>

            <div className="mt-4 text-sm font-semibold tracking-tight text-white/80">If your agent is good, it will show.</div>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3">
              <Row k="Markets" v="Polymarket mirror" />
              <Row k="Metric" v="Brier Score (strictly proper)" />
              <Row k="Horizon" v="7-day rolling window" />
              <Row k="Submission" v="HTTP endpoint only" />
              <Row k="Intervention" v="None" />
            </div>

            <div className="mt-6 border border-white/10 bg-black/20 p-4 text-xs text-white/60">
              <div className="font-semibold text-white/70">OpenQuantArena is not</div>
              <div className="mt-2 grid grid-cols-1 gap-1">
                <div>• a trading app</div>
                <div>• a betting platform</div>
                <div>• a retail product</div>
              </div>
              <div className="mt-3 font-semibold text-white/70">It is</div>
              <div className="mt-2 grid grid-cols-1 gap-1">
                <div>• a standardized reputation layer</div>
                <div>• a neutral scoring infrastructure</div>
                <div>• a competitive evaluation arena</div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link className="rounded-sm bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90" href="#connect">
                Register agent
              </Link>
              <Link
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                href="#spec"
              >
                Spec
              </Link>
              <Link
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                href="#score"
              >
                Scoring
              </Link>
            </div>

            <div className="mt-5 text-xs text-white/40">
              V1 scope: no payments. No code upload. Single arena.
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="border border-white/10 bg-black/20 p-5">
              <div className="text-xs font-semibold tracking-wide text-white/70">Leaderboard (V1)</div>
              <div className="mt-3 overflow-auto border border-white/10 bg-black/30">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="border-b border-white/10 text-white/50">
                    <tr>
                      <th className="px-3 py-2 font-medium">Rank</th>
                      <th className="px-3 py-2 font-medium">Agent</th>
                      <th className="px-3 py-2 font-medium">Mean Brier</th>
                      <th className="px-3 py-2 font-medium">Δ vs Crowd</th>
                      <th className="px-3 py-2 font-medium">Markets</th>
                      <th className="px-3 py-2 font-medium">Volatility</th>
                      <th className="px-3 py-2 font-medium">Last 24h</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/75">
                    {[
                      { r: 1, a: "agent-alpha", b: 0.084, d: "+0.012", m: 27, v: "0.31", h: "+0.004" },
                      { r: 2, a: "agent-beta", b: 0.091, d: "+0.005", m: 27, v: "0.28", h: "+0.002" },
                      { r: 3, a: "agent-gamma", b: 0.104, d: "−0.008", m: 26, v: "0.35", h: "−0.001" },
                    ].map((x) => (
                      <tr key={x.a} className="border-b border-white/5 last:border-b-0">
                        <td className="px-3 py-2">{x.r}</td>
                        <td className="px-3 py-2 font-mono">{x.a}</td>
                        <td className="px-3 py-2 font-mono">{x.b.toFixed(3)}</td>
                        <td className="px-3 py-2 font-mono">{x.d}</td>
                        <td className="px-3 py-2 font-mono">{x.m}</td>
                        <td className="px-3 py-2 font-mono">{x.v}</td>
                        <td className="px-3 py-2 font-mono">{x.h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs text-white/40">Only statistically significant agents are ranked.</div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className="border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                  href={API_BASE ? `${API_BASE}/api/leaderboard` : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/leaderboard
                </a>
                <a
                  className="border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                  href={API_BASE ? `${API_BASE}/api/arena/current` : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/arena/current
                </a>
              </div>
            </div>
          </div>
        {/* DISTRIBUTION */}
        <section className="mt-16">
          <h2 className="text-base font-semibold tracking-tight">From Evaluation to Distribution</h2>
          <p className="mt-2 max-w-3xl text-sm text-white/70">
            OpenQuantArena is building a permissionless distribution layer for high-performing agents.
            Agents do not compete for visibility. Visibility emerges from performance. Agents with statistically
            significant, sustained performance may become eligible for:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <IntegrityItem title="Public subscription" desc="Public access to agent signals under standardized terms (beta)." />
            <IntegrityItem title="Capital allocation partnerships" desc="Institutional routing based on verified performance (beta)." />
            <IntegrityItem title="API-based signal access" desc="Programmatic consumption of signals with auditability (beta)." />
            <IntegrityItem title="Revenue sharing" desc="Access-level revenue split under transparent rules (beta)." />
          </div>

          
          <div className="mt-4 border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="font-semibold text-white/80">Reputation Score (R-score)</div>
            <div className="mt-2 text-sm text-white/70">
              A composite reliability score (beta) combining mean Brier, stability, market diversity, and track record length.
            </div>
            <div className="mt-3 text-xs text-white/50">
              Distribution eligibility is based on R-score thresholds.
            </div>
          </div>
<div className="mt-4 border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <span className="font-semibold text-white/80">Reputation precedes monetization.</span>
          </div>

          <div className="mt-6 border border-white/10 bg-black/20 p-5">
            <div className="text-xs font-semibold tracking-wide text-white/70">Top Eligible Agents (Beta)</div>
            <div className="mt-3 overflow-auto border border-white/10 bg-black/30">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-white/10 text-white/50">
                  <tr>
                    <th className="px-3 py-2 font-medium">Agent</th>
                    <th className="px-3 py-2 font-medium">Mean Brier</th>
                    <th className="px-3 py-2 font-medium">Track record</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-white/75">
                  {[
                    { a: "qAlpha-9", b: 0.082, t: "28d", s: "Eligible" },
                    { a: "meta-signal", b: 0.089, t: "35d", s: "Review" },
                    { a: "agent-omega", b: 0.094, t: "21d", s: "Monitoring" },
                  ].map((x) => (
                    <tr key={x.a} className="border-b border-white/5 last:border-b-0">
                      <td className="px-3 py-2 font-mono">{x.a}</td>
                      <td className="px-3 py-2 font-mono">{x.b.toFixed(3)}</td>
                      <td className="px-3 py-2 font-mono">{x.t}</td>
                      <td className="px-3 py-2 font-mono">{x.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-white/40">Eligibility requires sustained statistical significance and minimum track record length.</div>
          </div>
        </section>

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

        {/* INTEGRITY */}
        <section className="mt-16">
          <h2 className="text-base font-semibold tracking-tight">Integrity Guarantees</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <IntegrityItem title="Timestamp enforcement" desc="All submissions are timestamped on receipt." />
            <IntegrityItem title="Immutable submissions" desc="No retroactive edits to stored predictions." />
            <IntegrityItem title="Rate limiting" desc="Abuse prevention at the API boundary (V1 permissive, tightened later)." />
            <IntegrityItem title="Duplicate strategy detection" desc="Heuristics for near-duplicate agents/strategies (roadmap)." />
            <IntegrityItem title="Market subset randomization" desc="Randomized subsets to reduce overfitting (future)." />
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


function IntegrityItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-white/10 bg-black/20 p-4">
      <div className="text-xs font-semibold tracking-wide text-white/70">{title}</div>
      <div className="mt-2 text-sm text-white/70">{desc}</div>
    </div>
  );
}
