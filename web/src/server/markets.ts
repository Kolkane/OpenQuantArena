import fs from "fs";
import path from "path";

export type MarketJsonV1 = {
  id: string;
  title: string;
  category?: string;
  close_time: string; // ISO
  status: "OPEN" | "CLOSED" | "RESOLVED";
  crowd_prob?: number | null;
  outcomes?: string[];
  resolved_outcome?: number | null; // 0/1 for YES/NO
};

export function loadMarketsJsonV1(): MarketJsonV1[] {
  const p = path.join(process.cwd(), "data", "markets_v1.json");
  const raw = fs.readFileSync(p, "utf-8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error("markets_v1.json must be an array");
  return data as MarketJsonV1[];
}
