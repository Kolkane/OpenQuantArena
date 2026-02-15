import crypto from "crypto";
import { prisma } from "./db";

export function isoWeek(date = new Date()) {
  // ISO week string like 2026-W07
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function shortCode(bytes = 9) {
  // url-safe base64
  return crypto.randomBytes(bytes).toString("base64url");
}

export async function ensureReferralForEvent(eventId: string, agentId: string) {
  const existing = await prisma.referral.findFirst({ where: { eventId, agentId } });
  if (existing) return existing;
  return prisma.referral.create({
    data: {
      code: shortCode(),
      eventId,
      agentId,
    },
  });
}
