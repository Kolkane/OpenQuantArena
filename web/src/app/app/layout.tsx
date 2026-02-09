import Link from "next/link";
import AuthGate from "@/components/AuthGate";
import LogoutButton from "@/components/LogoutButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
          <aside className="w-64 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="text-lg font-semibold">QuantArena</div>
            <div className="mt-6 space-y-1 text-sm">
              <Nav href="/app">Overview</Nav>
              <Nav href="/app/strategies">Strategies</Nav>
              <Nav href="/app/backtests">Backtests</Nav>
              <Nav href="/app/leaderboard">Leaderboard</Nav>
            </div>
            <div className="mt-8">
              <LogoutButton />
            </div>
          </aside>

          <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/20 p-6">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}

function Nav({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="block rounded-xl px-3 py-2 hover:bg-slate-800" href={href}>
      {children}
    </Link>
  );
}
