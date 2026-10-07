import { getAdminSession } from '@/lib/admin/auth';
import { listUsersWithSiteCounts } from '@/lib/db/queries/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function esc(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET() {
  if (!(await getAdminSession())) {
    return new Response('unauthorized', { status: 401 });
  }

  const rows = await listUsersWithSiteCounts(10000);

  const header = [
    'id',
    'email',
    'name',
    'plan',
    'plan_expires_at',
    'disabled',
    'site_count',
    'created_at',
  ].join(',');

  const lines = rows.map((r) =>
    [
      r.id,
      r.email,
      r.name,
      r.plan,
      r.planExpiresAt ? new Date(r.planExpiresAt).toISOString() : '',
      r.disabled ? 'true' : 'false',
      r.siteCount,
      r.createdAt.toISOString(),
    ]
      .map(esc)
      .join(',')
  );

  const csv = [header, ...lines].join('\n');
  const filename = `users-${Date.now()}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
