"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/api";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = tokenStorage().get();
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (!token && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    if (token && isAuthRoute) {
      router.replace("/app");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
