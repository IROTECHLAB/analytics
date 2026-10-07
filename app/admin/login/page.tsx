import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin/auth';
import { AdminLoginForm } from './form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin · Sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect('/admin');

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Admin Console</h1>
          <p className="text-xs text-text-muted">
            IROTECHLAB ANALYTICS
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
