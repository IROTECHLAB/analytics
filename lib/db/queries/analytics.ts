import { and, eq, gte, sql, desc, isNotNull, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, sessionAnalytics } from '@/lib/db/schema';

export type Range = '24h' | '7d' | '30d' | '90d';

export function rangeStart(range: Range): Date {
  const now = Date.now();
  const map: Record<Range, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };
  return new Date(now - map[range]);
}

export async function getOverview(siteId: string, since: Date) {
  const [pageviewsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        eq(events.type, 'pageview')
      )
    );

  const [visitorsRow] = await db
    .select({ count: sql<number>`count(distinct ${events.visitorId})::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)));

  const [sessionsRow] = await db
    .select({
      count: sql<number>`count(*)::int`,
      bounces: sql<number>`sum(case when ${sessionAnalytics.pageviews} = 1 then 1 else 0 end)::int`,
      avgDuration: sql<number>`coalesce(avg(extract(epoch from (coalesce(${sessionAnalytics.endedAt}, ${sessionAnalytics.startedAt}) - ${sessionAnalytics.startedAt}))), 0)::int`,
    })
    .from(sessionAnalytics)
    .where(
      and(
        eq(sessionAnalytics.siteId, siteId),
        gte(sessionAnalytics.startedAt, since)
      )
    );

  const pageviews = pageviewsRow?.count ?? 0;
  const visitors = visitorsRow?.count ?? 0;
  const sessions = sessionsRow?.count ?? 0;
  const bounces = sessionsRow?.bounces ?? 0;
  const bounceRate = sessions > 0 ? Math.round((bounces / sessions) * 100) : 0;
  const avgDuration = sessionsRow?.avgDuration ?? 0;

  return { visitors, pageviews, sessions, bounceRate, avgDuration };
}

export type Bucket = 'hour' | 'day';

export async function getTimeSeries(siteId: string, since: Date, bucket: Bucket) {
  const rows = await db.execute(sql`
    with buckets as (
      select date_trunc(${bucket}, ts) as bucket_ts
      from generate_series(
        ${since}::timestamptz,
        now(),
        ${bucket === 'hour' ? sql`'1 hour'::interval` : sql`'1 day'::interval`}
      ) ts
    )
    select
      b.bucket_ts as ts,
      coalesce(count(e.id), 0)::int as pageviews,
      coalesce(count(distinct e.visitor_id), 0)::int as visitors
    from buckets b
    left join ${events} e
      on date_trunc(${bucket}, e.timestamp) = b.bucket_ts
      and e.site_id = ${siteId}
      and e.type = 'pageview'
    group by b.bucket_ts
    order by b.bucket_ts asc
  `);

  return (rows.rows as any[]).map((r) => ({
    ts: new Date(r.ts).toISOString(),
    pageviews: Number(r.pageviews),
    visitors: Number(r.visitors),
  }));
}

export async function getTopPages(siteId: string, since: Date, limit = 10) {
  return db
    .select({ path: events.path, count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        eq(events.type, 'pageview')
      )
    )
    .groupBy(events.path)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getTopReferrers(siteId: string, since: Date, limit = 10) {
  return db
    .select({ referrer: events.referrer, count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        eq(events.type, 'pageview'),
        sql`${events.referrer} is not null`
      )
    )
    .groupBy(events.referrer)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getCountries(siteId: string, since: Date, limit = 10) {
  return db
    .select({ country: events.country, count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)))
    .groupBy(events.country)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getDevices(siteId: string, since: Date) {
  return db
    .select({ device: events.device, count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)))
    .groupBy(events.device)
    .orderBy(desc(sql`count(*)`));
}

export async function getBrowsers(siteId: string, since: Date, limit = 8) {
  return db
    .select({ browser: events.browser, count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)))
    .groupBy(events.browser)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getOS(siteId: string, since: Date, limit = 8) {
  return db
    .select({ os: events.os, count: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)))
    .groupBy(events.os)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── Custom events ──────────────────────────────────────
export async function getCustomEvents(siteId: string, since: Date, limit = 15) {
  return db
    .select({
      name: events.eventName,
      count: sql<number>`count(*)::int`,
      uniques: sql<number>`count(distinct ${events.visitorId})::int`,
    })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        eq(events.type, 'event'),
        isNotNull(events.eventName)
      )
    )
    .groupBy(events.eventName)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── Entry / Exit pages ─────────────────────────────────
export async function getEntryPages(siteId: string, since: Date, limit = 10) {
  return db
    .select({
      page: sessionAnalytics.entryPage,
      count: sql<number>`count(*)::int`,
    })
    .from(sessionAnalytics)
    .where(
      and(
        eq(sessionAnalytics.siteId, siteId),
        gte(sessionAnalytics.startedAt, since)
      )
    )
    .groupBy(sessionAnalytics.entryPage)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export async function getExitPages(siteId: string, since: Date, limit = 10) {
  return db
    .select({
      page: sessionAnalytics.exitPage,
      count: sql<number>`count(*)::int`,
    })
    .from(sessionAnalytics)
    .where(
      and(
        eq(sessionAnalytics.siteId, siteId),
        gte(sessionAnalytics.startedAt, since)
      )
    )
    .groupBy(sessionAnalytics.exitPage)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── UTM sources ────────────────────────────────────────
export async function getUtmSources(siteId: string, since: Date, limit = 10) {
  return db
    .select({
      source: events.utmSource,
      medium: events.utmMedium,
      campaign: events.utmCampaign,
      count: sql<number>`count(*)::int`,
    })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        isNotNull(events.utmSource)
      )
    )
    .groupBy(events.utmSource, events.utmMedium, events.utmCampaign)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── Languages ──────────────────────────────────────────
export async function getLanguages(siteId: string, since: Date, limit = 8) {
  return db
    .select({ language: events.language, count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        isNotNull(events.language)
      )
    )
    .groupBy(events.language)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── Screens ────────────────────────────────────────────
export async function getScreens(siteId: string, since: Date, limit = 8) {
  return db
    .select({ screen: events.screen, count: sql<number>`count(*)::int` })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.timestamp, since),
        isNotNull(events.screen)
      )
    )
    .groupBy(events.screen)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

// ─── Realtime ───────────────────────────────────────────
export async function getRealtimeCount(siteId: string, minutes = 5) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  const [row] = await db
    .select({ count: sql<number>`count(distinct ${events.visitorId})::int` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.timestamp, since)));
  return row?.count ?? 0;
}

// ─── All stats bundle ───────────────────────────────────
export async function getAllStats(siteId: string, range: Range) {
  const since = rangeStart(range);
  const bucket: Bucket = range === '24h' ? 'hour' : 'day';

  const [
    overview,
    timeSeries,
    topPages,
    topReferrers,
    countries,
    devices,
    browsers,
    os,
    customEvents,
    entryPages,
    exitPages,
    utmSources,
    languages,
    screens,
    realtime,
  ] = await Promise.all([
    getOverview(siteId, since),
    getTimeSeries(siteId, since, bucket),
    getTopPages(siteId, since),
    getTopReferrers(siteId, since),
    getCountries(siteId, since),
    getDevices(siteId, since),
    getBrowsers(siteId, since),
    getOS(siteId, since),
    getCustomEvents(siteId, since),
    getEntryPages(siteId, since),
    getExitPages(siteId, since),
    getUtmSources(siteId, since),
    getLanguages(siteId, since),
    getScreens(siteId, since),
    getRealtimeCount(siteId),
  ]);

  return {
    range,
    bucket,
    since: since.toISOString(),
    overview,
    timeSeries,
    topPages,
    topReferrers,
    countries,
    devices,
    browsers,
    os,
    customEvents,
    entryPages,
    exitPages,
    utmSources,
    languages,
    screens,
    realtime,
  };
}

export type StatsResponse = Awaited<ReturnType<typeof getAllStats>>;
