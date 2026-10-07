import crypto from 'crypto';
import { cookies } from 'next/headers';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminSessions } from '@/lib/db/schema';

const COOKIE_NAME = 'iro_admin';
const SESSION_HOURS = 24;

function envRequired(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = envRequired('ADMIN_USERNAME');
  const expectedPass = envRequired('ADMIN_PASSWORD');

  const u = Buffer.from(username);
  const eu = Buffer.from(expectedUser);
  const p = Buffer.from(password);
  const ep = Buffer.from(expectedPass);

  // Timing-safe compare; also require equal lengths
  const userOk = u.length === eu.length && crypto.timingSafeEqual(u, eu);
  const passOk = p.length === ep.length && crypto.timingSafeEqual(p, ep);
  return userOk && passOk;
}

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function createAdminSession(): Promise<string> {
  const raw = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

  await db.insert(adminSessions).values({ tokenHash, expiresAt });

  const store = cookies();
  store.set(COOKIE_NAME, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });

  return raw;
}

export async function getAdminSession(): Promise<boolean> {
  const store = cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const tokenHash = hashToken(raw);
  const rows = await db
    .select()
    .from(adminSessions)
    .where(
      and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date()))
    )
    .limit(1);

  return rows.length > 0;
}

export async function destroyAdminSession(): Promise<void> {
  const store = cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (raw) {
    const tokenHash = hashToken(raw);
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
  }
  store.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export const ADMIN_COOKIE = COOKIE_NAME;
