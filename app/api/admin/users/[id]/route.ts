import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import {
  deleteUser,
  setUserDisabled,
  setUserPlan,
} from '@/lib/db/queries/users';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action as string | undefined;

  if (action === 'disable') {
    return NextResponse.json({ user: await setUserDisabled(params.id, true) });
  }
  if (action === 'enable') {
    return NextResponse.json({ user: await setUserDisabled(params.id, false) });
  }
  if (action === 'revoke_pro') {
    return NextResponse.json({ user: await setUserPlan(params.id, 'free', null) });
  }
  if (action === 'set_self_host') {
    return NextResponse.json({ user: await setUserPlan(params.id, 'self-host', null) });
  }
  if (action === 'delete') {
    const removed = await deleteUser(params.id);
    if (!removed) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
}
