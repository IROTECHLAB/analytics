import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { generatePKCE } from '@/lib/auth/pkce';
import { setPKCECookie } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  const { verifier, challenge, state } = generatePKCE();

  setPKCECookie({ verifier, state });

  const params = new URLSearchParams({
    client_id: config.iro.clientId,
    redirect_uri: config.iro.redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  return NextResponse.redirect(
    `${config.iro.issuer}/api/oauth/authorize?${params.toString()}`
  );
}
