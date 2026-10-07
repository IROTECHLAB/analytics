import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { bulkDisable, bulkGrantPro } from '@/lib/db/queries/users';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action as string | undefined;
  const userIds = Array.isArray(body.userIds) ? (body.userIds as string[]) : [];
  const days = Number.isFinite(body.days) ? Number(body.days) : 30;

  if (!userIds.length) {
    return NextResponse.json({ error: 'no_users' }, { status: 400 });
  }

  if (action === 'grant_pro') {
    const count = await bulkGrantPro(userIds, days);
    return NextResponse.json({ ok: true, count });
  }
  if (action === 'disable') {
    const count = await bulkDisable(userIds, true);
    return NextResponse.json({ ok: true, count });
  }
  if (action === 'enable') {
    const count = await bulkDisable(userIds, false);
    return NextResponse.json({ ok: true, count });
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
}
