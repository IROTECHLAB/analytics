import { NextResponse, type NextRequest } from 'next/server';
import { and, eq, gte, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/require-user';
import { getSite } from '@/lib/db/queries/sites';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { rangeStart, type Range } from '@/lib/db/queries/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID: Range[] = ['24h', '7d', '30d', '90d'];

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const site = await getSite(user.id, params.id);
  if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const url = new URL(req.url);
  const rangeParam = url.searchParams.get('range');
  const range: Range = VALID.includes(rangeParam as Range)
    ? (rangeParam as Range)
    : '7d';
  const since = rangeStart(range);

  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.siteId, site.id), gte(events.timestamp, since)))
    .orderBy(desc(events.timestamp))
    .limit(50_000);

  const header = [
    'id',
    'timestamp',
    'type',
    'event_name',
    'path',
    'referrer',
    'country',
    'device',
    'browser',
    'os',
    'screen',
    'language',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'visitor_id',
    'session_id',
  ].join(',');

  const lines = rows.map((r) =>
    [
      r.id,
      r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
      r.type,
      r.eventName,
      r.path,
      r.referrer,
      r.country,
      r.device,
      r.browser,
      r.os,
      r.screen,
      r.language,
      r.utmSource,
      r.utmMedium,
      r.utmCampaign,
      r.visitorId,
      r.sessionId,
    ]
      .map(csvEscape)
      .join(',')
  );

  const csv = [header, ...lines].join('\n');
  const filename = `${site.domain.replace(/[^a-z0-9.-]/gi, '_')}-events-${range}-${Date.now()}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
