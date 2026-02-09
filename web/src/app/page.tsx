import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">QuantArena</div>
          <div className="flex gap-3">
            <Link className="rounded-xl bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700" href="/login">
              Login
            </Link>
            <Link className="rounded-xl bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500" href="/register">
              Start free
            </Link>
          </div>
        </div>

        <h1 className="mt-14 text-5xl font-semibold leading-tight">
          Paper-only strategy lab for builders.
          <br />
          Backtest → Proof → Leaderboard.
        </h1>
        <p className="mt-5 max-w-2xl text-slate-300">
          Upload a strategy, run backtests, publish a proof pack. Marketplace later.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500" href="/app">
            Open app
          </Link>
          <a
            className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium hover:bg-slate-700"
            href="https://openquantarena-production-0df1.up.railway.app/docs"
            target="_blank"
            rel="noreferrer"
          >
            API docs
          </a>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: "Strategies", desc: "Versioned uploads + metadata." },
            { title: "Backtests", desc: "Async runs via Celery worker." },
            { title: "Leaderboard", desc: "Rank by latest successful proof." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="text-lg font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-300">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
