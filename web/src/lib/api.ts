export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set; API calls will fail.");
}

type FetchOptions = RequestInit & { token?: string | null };

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, { ...opts, headers, cache: "no-store" });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.detail ? `\n${JSON.stringify(data.detail)}` : `\n${JSON.stringify(data)}`;
    } catch {
      // ignore
    }
    throw new Error(`${res.status} ${res.statusText}${detail}`);
  }
  return (await res.json()) as T;
}

export function tokenStorage() {
  return {
    get() {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("qa_token");
    },
    set(token: string) {
      localStorage.setItem("qa_token", token);
    },
    clear() {
      localStorage.removeItem("qa_token");
    },
  };
}
