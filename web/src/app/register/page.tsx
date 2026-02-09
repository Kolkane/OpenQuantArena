"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, tokenStorage } from "@/lib/api";

type RegisterResponse = { id: string; email: string };

type LoginResponse = { access_token: string; token_type: string };

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      tokenStorage().set(data.access_token);
      router.push("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-semibold">Start free</h1>
        <p className="mt-2 text-sm text-slate-300">Create your QuantArena account.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Password</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={8}
            />
            <div className="mt-1 text-xs text-slate-400">Min 8 chars.</div>
          </div>

          {error ? <div className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Already have an account?{" "}
          <Link className="text-indigo-300 hover:underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
