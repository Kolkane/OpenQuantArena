export default function AppHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-2 text-sm text-slate-300">
        Start with <span className="font-medium text-slate-100">Strategies</span>, then run a backtest and publish results.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="1) Upload strategy" desc="Create a strategy and upload a .py file." />
        <Card title="2) Run backtest" desc="Queue async backtest jobs via Celery." />
        <Card title="3) Leaderboard" desc="Rank by latest successful backtest." />
      </div>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-300">{desc}</div>
    </div>
  );
}
