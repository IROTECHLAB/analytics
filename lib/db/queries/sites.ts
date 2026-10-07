import { and, desc, eq } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sites } from '@/lib/db/schema';
import { generatePublicKey } from '@/lib/utils/public-key';

export async function listSites(userId: string) {
  return db
    .select()
    .from(sites)
    .where(eq(sites.userId, userId))
    .orderBy(desc(sites.createdAt));
}

export async function getSite(userId: string, siteId: string) {
  const rows = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSiteByPublicKey(publicKey: string) {
  const rows = await db
    .select()
    .from(sites)
    .where(eq(sites.publicKey, publicKey))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSiteByShareToken(token: string) {
  const rows = await db
    .select()
    .from(sites)
    .where(and(eq(sites.shareToken, token), eq(sites.shareEnabled, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSite(
  userId: string,
  input: { domain: string; name: string }
) {
  const [row] = await db
    .insert(sites)
    .values({
      userId,
      domain: input.domain.trim().toLowerCase(),
      name: input.name.trim(),
      publicKey: generatePublicKey(),
    })
    .returning();
  return row;
}

export async function updateSite(
  userId: string,
  siteId: string,
  patch: { name?: string; domain?: string }
) {
  const [row] = await db
    .update(sites)
    .set({
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.domain !== undefined
        ? { domain: patch.domain.trim().toLowerCase() }
        : {}),
    })
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .returning();
  return row ?? null;
}

export async function deleteSite(userId: string, siteId: string) {
  const [row] = await db
    .delete(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .returning();
  return row ?? null;
}

function newShareToken(): string {
  return crypto.randomBytes(16).toString('base64url');
}

export async function enableSharing(userId: string, siteId: string) {
  const site = await getSite(userId, siteId);
  if (!site) return null;
  const token = site.shareToken ?? newShareToken();
  const [row] = await db
    .update(sites)
    .set({ shareToken: token, shareEnabled: true })
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .returning();
  return row ?? null;
}

export async function disableSharing(userId: string, siteId: string) {
  const [row] = await db
    .update(sites)
    .set({ shareEnabled: false })
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .returning();
  return row ?? null;
}

export async function regenerateShareToken(userId: string, siteId: string) {
  const [row] = await db
    .update(sites)
    .set({ shareToken: newShareToken() })
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .returning();
  return row ?? null;
}
