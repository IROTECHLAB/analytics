import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/require-user';
import {
  disableSharing,
  enableSharing,
  regenerateShareToken,
} from '@/lib/db/queries/sites';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action = body.action as string | undefined;

  if (action === 'enable') {
    const site = await enableSharing(user.id, params.id);
    if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ site });
  }

  if (action === 'disable') {
    const site = await disableSharing(user.id, params.id);
    if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ site });
  }

  if (action === 'regenerate') {
    const site = await regenerateShareToken(user.id, params.id);
    if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ site });
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
}
