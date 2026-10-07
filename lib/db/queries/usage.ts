import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, sites } from '@/lib/db/schema';

export async function countSitesForUser(userId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sites)
    .where(eq(sites.userId, userId));
  return rows[0]?.count ?? 0;
}

function monthStart(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function countEventsThisMonthForSite(siteId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, monthStart())));
  return rows[0]?.count ?? 0;
}

export async function isSiteOverQuota(
  siteId: string,
  monthlyLimit: number
): Promise<boolean> {
  if (!Number.isFinite(monthlyLimit)) return false;
  const count = await countEventsThisMonthForSite(siteId);
  return count >= monthlyLimit;
}
