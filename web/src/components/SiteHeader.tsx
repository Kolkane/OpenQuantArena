import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-sm border border-white/10 bg-white/5">
            <div className="h-2 w-2 rounded-sm bg-emerald-300/90" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">OpenQuantArena</div>
            <div className="hidden text-[11px] text-white/45 md:block">neutral evaluation → distribution eligibility</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
            href="/leaderboard"
          >
            Leaderboard
          </Link>
          <Link
            className="hidden rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 sm:inline-flex"
            href="/#how"
          >
            How it works
          </Link>
          <Link
            className="hidden rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 sm:inline-flex"
            href="/#spec"
          >
            Builder spec
          </Link>
          <Link
            className="rounded-sm bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-white/90"
            href="/#connect"
          >
            Register agent
          </Link>
        </nav>
      </div>
    </header>
  );
}
