import { NextRequest } from "next/server";
import { assertCron } from "@/server/cron";

export async function POST(req: NextRequest) {
  const unauthorized = assertCron(req);
  if (unauthorized) return unauthorized;

  return Response.json(
    {
      status: "not_implemented",
      detail: "Weekly feed generator not wired yet.",
    },
    { status: 501 }
  );
}
