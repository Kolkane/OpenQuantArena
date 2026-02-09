import Link from "next/link";

const API_DOCS_URL = "https://openquantarena-production-0df1.up.railway.app/docs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
              <div className="h-3 w-3 rounded-sm bg-indigo-400" />
            </div>
            <div className="text-lg font-semibold tracking-tight">QuantArena</div>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-sm hover:bg-slate-900" href="/login">
              Login
            </Link>
            <Link className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500" href="/register">
              Start free
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Paper-only. Built for quants & builders.
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-tight">
              Build strategies.
              <br />
              Prove them.
              <br />
              Compete.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              QuantArena is the paper-trading strategy lab for equities: upload a strategy, run reproducible backtests, publish a proof
              pack, and climb the leaderboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500" href="/app">
                Open the app
              </Link>
              <Link className="rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-sm font-medium hover:bg-slate-900" href="/register">
                Create free account
              </Link>
              <a
                className="rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-sm font-medium hover:bg-slate-900"
                href={API_DOCS_URL}
                target="_blank"
                rel="noreferrer"
              >
                API docs
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-400">
              <Stat k="Proof-first" v="Standardized" />
              <Stat k="Compute" v="Async worker" />
              <Stat k="Focus" v="Equities" />
            </div>
          </div>

          {/* Hero card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <div className="text-sm font-medium text-slate-200">Strategy proof pack (example)</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Metric label="CAGR" value="18.2%" />
                <Metric label="Sharpe" value="1.41" />
                <Metric label="Max drawdown" value="-12.7%" />
                <Metric label="Trades" value="1,284" />
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Equity curve</span>
                  <span>Out-of-sample ready</span>
                </div>
                <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-indigo-500/20 via-slate-800/30 to-emerald-500/20 ring-1 ring-slate-800" />
              </div>
              <div className="mt-4 text-xs text-slate-400">
                Reproducible runs + versioning. Marketplace later.
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Everything a builder needs to ship credible strategies</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Keep the platform simple. Put the complexity in the strategy code — and in the proof.
              </p>
            </div>
            <Link className="hidden text-sm text-indigo-300 hover:underline md:block" href="/register">
              Start free →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Feature
              title="Strategy Lab"
              desc="Create strategies, upload .py files, track versions and parameters."
              bullet1="Metadata + tags"
              bullet2="Version-ready"
            />
            <Feature
              title="Backtests"
              desc="Queue runs asynchronously. Results stored with standard metrics."
              bullet1="Async worker"
              bullet2="Deterministic demo mode"
            />
            <Feature
              title="Arena"
              desc="Leaderboard based on the latest successful proof per strategy."
              bullet1="Comparable metrics"
              bullet2="Proof-first ranking"
            />
          </div>
        </section>

        {/* Pricing teaser */}
        <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/20 p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Freemium that scales with compute & data</h2>
              <p className="mt-3 text-sm text-slate-300">
                Start free. Pay when you scale backtests, datasets, automation, and distribution (proof packs + marketplace).
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500" href="/register">
                  Create free account
                </Link>
                <Link className="rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-sm font-medium hover:bg-slate-900" href="/app">
                  View dashboard
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Plan title="Free" price="€0" desc="Try the workflow" items={["2 strategies", "limited monthly backtests", "starter universe"]} />
              <Plan
                title="Pro"
                price="€79/mo"
                desc="Iterate seriously"
                items={["more strategies", "more compute (credits)", "longer history + exports", "proof packs"]}
              />
              <Plan
                title="Team"
                price="€299/mo"
                desc="Industrialize"
                items={["seats + workspaces", "API + webhooks", "priority queue", "audit + permissions"]}
              />
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-800 py-8 text-xs text-slate-500">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} QuantArena — paper-only, no financial advice.</div>
            <div className="flex gap-4">
              <a className="hover:text-slate-300" href={API_DOCS_URL} target="_blank" rel="noreferrer">
                API
              </a>
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
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          {bullet2}
        </li>
      </ul>
    </div>
  );
}

function Plan({
  title,
  price,
  desc,
  items,
}: {
  title: string;
  price: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-slate-400">{desc}</div>
        </div>
        <div className="text-sm font-semibold text-slate-100">{price}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
