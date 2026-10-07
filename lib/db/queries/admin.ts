import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, sites, users } from '@/lib/db/schema';

export type AdminStats = {
  totalUsers: number;
  totalSites: number;
  totalEvents: number;
  proUsers: number;
  disabledUsers: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [u] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const [s] = await db.select({ count: sql<number>`count(*)::int` }).from(sites);
  const [e] = await db.select({ count: sql<number>`count(*)::int` }).from(events);
  const [p] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.plan, 'pro'));
  const [d] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.disabled, true));

  return {
    totalUsers: u?.count ?? 0,
    totalSites: s?.count ?? 0,
    totalEvents: e?.count ?? 0,
    proUsers: p?.count ?? 0,
    disabledUsers: d?.count ?? 0,
  };
}

export type AdminUserRow = {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  plan: string;
  planExpiresAt: Date | null;
  disabled: boolean;
  createdAt: Date;
  siteCount: number;
};

export async function listUsersWithSiteCounts(
  limit = 200,
  search?: string
): Promise<AdminUserRow[]> {
  const rows = await db.execute(sql`
    select
      u.id,
      u.email,
      u.name,
      u.picture,
      u.plan,
      u.plan_expires_at as "planExpiresAt",
      u.disabled,
      u.created_at as "createdAt",
      coalesce(count(s.id), 0)::int as "siteCount"
    from users u
    left join sites s on s.user_id = u.id
    ${
      search
        ? sql`where u.email ilike ${'%' + search + '%'} or u.name ilike ${'%' + search + '%'}`
        : sql``
    }
    group by u.id
    order by u.created_at desc
    limit ${limit}
  `);

  return (rows.rows as any[]).map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    picture: r.picture,
    plan: r.plan,
    planExpiresAt: r.planExpiresAt ? new Date(r.planExpiresAt) : null,
    disabled: r.disabled,
    createdAt: new Date(r.createdAt),
    siteCount: Number(r.siteCount),
  }));
}
