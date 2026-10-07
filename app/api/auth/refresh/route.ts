import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { config } from '@/lib/config';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import {
  decryptSecret,
  encryptSecret,
  readSessionCookie,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST() {
  const cookie = readSessionCookie();
  if (!cookie) return NextResponse.json({ error: 'no_session' }, { status: 401 });

  const rows = await db.select().from(sessions).where(eq(sessions.id, cookie.sessionId)).limit(1);
  const row = rows[0];
  if (!row) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const refresh = decryptSecret(row.refreshTokenEnc);
  if (!refresh) return NextResponse.json({ error: 'no_refresh' }, { status: 401 });

  const res = await fetch(`${config.iro.issuer}/api/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
      client_id: config.iro.clientId,
      client_secret: config.iro.clientSecret,
    }),
  });

  if (!res.ok) {
    // Refresh reuse / expiry = compromise → force re-login
    await db.delete(sessions).where(eq(sessions.id, cookie.sessionId));
    return NextResponse.json({ error: 'refresh_failed' }, { status: 401 });
  }

  const tokens = (await res.json()) as { refresh_token: string };
  await db
    .update(sessions)
    .set({
      refreshTokenEnc: encryptSecret(tokens.refresh_token),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .where(eq(sessions.id, cookie.sessionId));

  return NextResponse.json({ ok: true });
}
