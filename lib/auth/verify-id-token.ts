import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { config } from '@/lib/config';

const JWKS = createRemoteJWKSet(
  new URL(`${config.iro.issuer}/.well-known/jwks.json`)
);

export type IroIdToken = JWTPayload & {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

export async function verifyIdToken(idToken: string): Promise<IroIdToken> {
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: config.iro.issuer,
    audience: config.iro.clientId,
  });
  return payload as IroIdToken;
}
