import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/require-user';
import { getSite } from '@/lib/db/queries/sites';
import { getAllStats, type Range } from '@/lib/db/queries/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID: Range[] = ['24h', '7d', '30d', '90d'];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const site = await getSite(user.id, params.id);
  if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const rangeParam = new URL(req.url).searchParams.get('range');
  const range: Range = VALID.includes(rangeParam as Range)
    ? (rangeParam as Range)
    : '7d';

  const stats = await getAllStats(site.id, range);
  return NextResponse.json(stats);
}
