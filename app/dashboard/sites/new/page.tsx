import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth/require-user';
import { NewSiteForm } from './form';

export const dynamic = 'force-dynamic';

export default async function NewSitePage() {
  await requireUser();

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-xl mx-auto space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors duration-base"
        >
          <ArrowLeft size={16} />
          Back to sites
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Add a site</h1>
          <p className="text-sm text-text-muted mt-1">
            We&apos;ll generate a tracking snippet for you.
          </p>
        </div>

        <NewSiteForm />
      </div>
    </main>
  );
}
