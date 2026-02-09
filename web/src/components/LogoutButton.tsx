"use client";

import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
      onClick={() => {
        tokenStorage().clear();
        router.push("/login");
      }}
    >
      Logout
    </button>
  );
}
