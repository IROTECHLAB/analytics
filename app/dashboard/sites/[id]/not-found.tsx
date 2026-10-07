import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="text-sm text-text-muted">
          It may have been deleted, or it isn&apos;t yours.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm border border-border-strong text-text-muted hover:text-text transition-colors duration-base"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
