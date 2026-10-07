import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, sessionAnalytics } from '@/lib/db/schema';

export type CollectInput = {
  siteId: string;
  type: 'pageview' | 'event';
  eventName: string | null;
  path: string;
  referrer: string | null;
  country: string;
  device: string;
  browser: string;
  os: string;
  screen: string | null;
  language: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  visitorId: string;
  sessionId: string;
};

export async function recordEvent(input: CollectInput) {
  await db.insert(events).values({
    siteId: input.siteId,
    type: input.type,
    eventName: input.eventName,
    path: input.path,
    referrer: input.referrer,
    country: input.country,
    device: input.device,
    browser: input.browser,
    os: input.os,
    screen: input.screen,
    language: input.language,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    visitorId: input.visitorId,
    sessionId: input.sessionId,
  });

  // Only pageviews create sessions
  if (input.type !== 'pageview') return;

  const existing = await db
    .select()
    .from(sessionAnalytics)
    .where(
      and(
        eq(sessionAnalytics.siteId, input.siteId),
        eq(sessionAnalytics.visitorId, input.visitorId),
        eq(sessionAnalytics.id, input.sessionId)
      )
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(sessionAnalytics).values({
      id: input.sessionId,
      siteId: input.siteId,
      visitorId: input.visitorId,
      entryPage: input.path,
      exitPage: input.path,
      pageviews: 1,
    });
  } else {
    await db
      .update(sessionAnalytics)
      .set({
        pageviews: sql`${sessionAnalytics.pageviews} + 1`,
        exitPage: input.path,
        endedAt: new Date(),
      })
      .where(eq(sessionAnalytics.id, input.sessionId));
  }
}

export async function getTotalEvents(siteId: string, since: Date) {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)));
  return rows[0]?.count ?? 0;
}
