import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  return Response.json(
    {
      status: "not_implemented",
      detail: "Resolution updater not wired yet (market outcomes).",
    },
    { status: 501 }
  );
}
