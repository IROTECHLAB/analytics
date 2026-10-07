import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { config } from '@/lib/config';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { verifyIdToken } from '@/lib/auth/verify-id-token';
import {
  clearPKCECookie,
  readPKCECookie,
  setSessionCookie,
  encryptSecret,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${config.appUrl}/login?error=${error}`);
  }

  const pkce = readPKCECookie();
  if (!code || !state || !pkce || state !== pkce.state) {
    return NextResponse.redirect(`${config.appUrl}/login?error=state_mismatch`);
  }

  const tokenRes = await fetch(`${config.iro.issuer}/api/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.iro.redirectUri,
      client_id: config.iro.clientId,
      client_secret: config.iro.clientSecret,
      code_verifier: pkce.verifier,
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    console.error('[auth/callback] token exchange failed', tokenRes.status, body);
    return NextResponse.redirect(`${config.appUrl}/login?error=token_exchange`);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    id_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  let claims;
  try {
    claims = await verifyIdToken(tokens.id_token);
  } catch (e) {
    console.error('[auth/callback] id_token verify failed', e);
    return NextResponse.redirect(`${config.appUrl}/login?error=invalid_token`);
  }

  const existing = await db.select().from(users).where(eq(users.id, claims.sub)).limit(1);

  // Block disabled accounts before creating a session
  if (existing[0]?.disabled) {
    return NextResponse.redirect(`${config.appUrl}/login?error=account_disabled`);
  }

  if (existing.length === 0) {
    await db.insert(users).values({
      id: claims.sub,
      email: claims.email ?? null,
      emailVerified: claims.email_verified ?? false,
      name: claims.name ?? null,
      givenName: claims.given_name ?? null,
      familyName: claims.family_name ?? null,
      picture: claims.picture ?? null,
    });
  } else {
    await db
      .update(users)
      .set({
        email: claims.email ?? existing[0].email,
        emailVerified: claims.email_verified ?? existing[0].emailVerified,
        name: claims.name ?? existing[0].name,
        givenName: claims.given_name ?? existing[0].givenName,
        familyName: claims.family_name ?? existing[0].familyName,
        picture: claims.picture ?? existing[0].picture,
        updatedAt: new Date(),
      })
      .where(eq(users.id, claims.sub));
  }

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const [sessionRow] = await db
    .insert(sessions)
    .values({
      userId: claims.sub,
      refreshTokenEnc: encryptSecret(tokens.refresh_token ?? ''),
      expiresAt,
    })
    .returning();

  setSessionCookie(sessionRow.id);
  clearPKCECookie();

  return NextResponse.redirect(`${config.appUrl}/dashboard`);
}
