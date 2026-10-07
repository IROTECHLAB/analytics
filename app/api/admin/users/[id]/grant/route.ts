import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { grantProDays } from '@/lib/db/queries/users';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const days = Number.isFinite(body?.days) ? Number(body.days) : 30;

  const user = await grantProDays(params.id, days);
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  return NextResponse.json({ user });
}
