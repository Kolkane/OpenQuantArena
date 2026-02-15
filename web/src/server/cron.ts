import { NextRequest } from "next/server";
import { env } from "./env";

export function assertCron(req: NextRequest) {
  const secret = env.CRON_SECRET;
  if (!secret) {
    throw new Error("CRON_SECRET is not set (cron endpoints disabled)");
  }
  const got = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (got !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}
