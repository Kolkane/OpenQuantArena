import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  return Response.json(
    {
      status: "not_implemented",
      detail:
        "Collector pipeline not wired yet (agents->predictions). This endpoint is reserved for Vercel Cron.",
    },
    { status: 501 }
  );
}
