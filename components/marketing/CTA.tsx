import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div
        className="relative rounded-2xl border border-border overflow-hidden p-10 md:p-16 text-center"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(16,185,129,0.12), transparent), var(--bg-elevated)',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
          Start tracking in 2 minutes.
        </h2>
        <p className="text-text-muted mt-3 max-w-lg mx-auto">
          Sign in with IrotechLab, paste one line, watch the data roll in.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}
