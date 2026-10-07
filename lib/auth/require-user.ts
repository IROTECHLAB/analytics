import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sessions, users, type User } from '@/lib/db/schema';
import { readSessionCookie } from '@/lib/auth/session';

/**
 * Returns the current user. If they are on Pro with an expired plan_expires_at,
 * downgrades them in the DB (lazy cleanup) before returning.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookie = readSessionCookie();
  if (!cookie) return null;

  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, cookie.sessionId))
    .limit(1);

  let user = rows[0]?.user ?? null;
  if (!user) return null;
  if (user.disabled) return null;

  // ─── Lazy downgrade ──────────────────────────────
  if (
    user.plan === 'pro' &&
    user.planExpiresAt &&
    new Date(user.planExpiresAt).getTime() < Date.now()
  ) {
    const [updated] = await db
      .update(users)
      .set({ plan: 'free', planExpiresAt: null, planUpdatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
    user = updated ?? user;
  }

  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
