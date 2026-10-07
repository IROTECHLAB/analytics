import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { config } from '@/lib/config';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import {
  clearSessionCookie,
  decryptSecret,
  readSessionCookie,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST() {
  const cookie = readSessionCookie();
  if (cookie) {
    const rows = await db.select().from(sessions).where(eq(sessions.id, cookie.sessionId)).limit(1);
    const row = rows[0];

    if (row) {
      // Best-effort revoke with provider
      try {
        const refresh = decryptSecret(row.refreshTokenEnc);
        if (refresh) {
          await fetch(`${config.iro.issuer}/api/oauth/revoke`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: refresh,
              client_id: config.iro.clientId,
              client_secret: config.iro.clientSecret,
            }),
          });
        }
      } catch (e) {
        console.error('[auth/logout] revoke failed', e);
      }

      await db.delete(sessions).where(eq(sessions.id, cookie.sessionId));
    }
  }

  clearSessionCookie();
  return NextResponse.redirect(`${config.appUrl}/login`);
}
