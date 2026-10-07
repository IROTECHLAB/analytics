import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin/auth';
import { getAdminStats, listUsersWithSiteCounts } from '@/lib/db/queries/admin';
import { AdminClient } from './client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Console · IROTECHLAB ANALYTICS',
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  if (!(await getAdminSession())) redirect('/admin/login');

  const [stats, users] = await Promise.all([
    getAdminStats(),
    listUsersWithSiteCounts(200, searchParams.q),
  ]);

  return <AdminClient stats={stats} users={users} initialQuery={searchParams.q ?? ''} />;
}
