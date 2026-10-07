import { desc, eq, sql, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function getUserById(id: string) {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function setUserPlan(
  userId: string,
  plan: string,
  expiresAt?: Date | null
) {
  const [row] = await db
    .update(users)
    .set({
      plan,
      planExpiresAt: expiresAt ?? null,
      planUpdatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return row ?? null;
}

export async function grantProDays(userId: string, days: number) {
  const user = await getUserById(userId);
  if (!user) return null;

  const now = Date.now();
  const existing =
    user.planExpiresAt && new Date(user.planExpiresAt).getTime() > now
      ? new Date(user.planExpiresAt).getTime()
      : now;
  const expiresAt = new Date(existing + days * 24 * 60 * 60 * 1000);

  return setUserPlan(userId, 'pro', expiresAt);
}

export async function setUserDisabled(userId: string, disabled: boolean) {
  const [row] = await db
    .update(users)
    .set({ disabled, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return row ?? null;
}

export async function deleteUser(userId: string) {
  const [row] = await db.delete(users).where(eq(users.id, userId)).returning();
  return row ?? null;
}

export async function listUsers(limit = 100, offset = 0) {
  return db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countUsers() {
  const rows = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  return rows[0]?.count ?? 0;
}

// ─── Bulk helpers ───────────────────────────────────────
export async function bulkDisable(userIds: string[], disabled: boolean) {
  if (!userIds.length) return 0;
  const rows = await db
    .update(users)
    .set({ disabled, updatedAt: new Date() })
    .where(inArray(users.id, userIds))
    .returning({ id: users.id });
  return rows.length;
}

export async function bulkGrantPro(userIds: string[], days: number) {
  if (!userIds.length) return 0;

  // Fetch current rows to extend from existing expiry
  const rows = await db
    .select({ id: users.id, planExpiresAt: users.planExpiresAt })
    .from(users)
    .where(inArray(users.id, userIds));

  const now = Date.now();
  let updated = 0;

  for (const r of rows) {
    const existing =
      r.planExpiresAt && new Date(r.planExpiresAt).getTime() > now
        ? new Date(r.planExpiresAt).getTime()
        : now;
    const expiresAt = new Date(existing + days * 24 * 60 * 60 * 1000);
    await db
      .update(users)
      .set({
        plan: 'pro',
        planExpiresAt: expiresAt,
        planUpdatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, r.id));
    updated += 1;
  }

  return updated;
}
