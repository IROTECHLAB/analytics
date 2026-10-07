import { NextResponse, type NextRequest } from 'next/server';
import { getSiteByShareToken } from '@/lib/db/queries/sites';
import { getAllStats, type Range } from '@/lib/db/queries/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID: Range[] = ['24h', '7d', '30d', '90d'];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const rangeParam = url.searchParams.get('range');
  const range: Range = VALID.includes(rangeParam as Range)
    ? (rangeParam as Range)
    : '7d';

  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 });
  }

  const site = await getSiteByShareToken(token);
  if (!site) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const stats = await getAllStats(site.id, range);
  return NextResponse.json({
    site: { name: site.name, domain: site.domain },
    ...stats,
  });
}
