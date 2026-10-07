import { cookies } from 'next/headers';
import crypto from 'crypto';
import { config } from '@/lib/config';

// ─── Encrypt / decrypt refresh tokens at rest ───────────
function getKey(): Buffer {
  // Derive 32-byte key from SESSION_SECRET
  return crypto.createHash('sha256').update(config.session.secret).digest();
}

export function encryptSecret(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptSecret(payload: string): string {
  const key = getKey();
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}

// ─── Our session cookie (holds our session id) ─────────
export type SessionCookie = {
  sessionId: string;
};

export function signSession(payload: SessionCookie): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', config.session.secret)
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

export function verifySessionCookie(value: string): SessionCookie | null {
  const [data, sig] = value.split('.');
  if (!data || !sig) return null;
  const expected = crypto
    .createHmac('sha256', config.session.secret)
    .update(data)
    .digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// ─── Set / clear ────────────────────────────────────────
export function setSessionCookie(sessionId: string) {
  const cookieStore = cookies();
  cookieStore.set(config.session.cookieName, signSession({ sessionId }), {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: config.session.maxAge,
    domain: config.cookieDomain,
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(config.session.cookieName, '', {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    domain: config.cookieDomain,
  });
}

export function readSessionCookie(): SessionCookie | null {
  const cookieStore = cookies();
  const value = cookieStore.get(config.session.cookieName)?.value;
  if (!value) return null;
  return verifySessionCookie(value);
}

// ─── PKCE temp cookie (used between login → callback) ───
export const PKCE_COOKIE = 'iro_analytics_pkce';

export function setPKCECookie(data: { verifier: string; state: string }) {
  const cookieStore = cookies();
  cookieStore.set(PKCE_COOKIE, signSession(data as any), {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 min
    domain: config.cookieDomain,
  });
}

export function readPKCECookie(): { verifier: string; state: string } | null {
  const cookieStore = cookies();
  const value = cookieStore.get(PKCE_COOKIE)?.value;
  if (!value) return null;
  return verifySessionCookie(value) as any;
}

export function clearPKCECookie() {
  const cookieStore = cookies();
  cookieStore.set(PKCE_COOKIE, '', {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    domain: config.cookieDomain,
  });
}
