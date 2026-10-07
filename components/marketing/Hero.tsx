import Link from 'next/link';
import { ArrowRight, Github, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.25), transparent)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-28 pb-12 md:pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-elevated text-xs text-text-muted">
          <ShieldCheck size={12} className="text-brand-500 flex-shrink-0" />
          <span>Cookie-free · GDPR-friendly by default</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]">
          Privacy-first analytics.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            Own your data.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto px-2">
          Lightweight, cookie-free web analytics. Self-host it, or let us run it.
          No personal data, no ads, no cookie banners.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            Start tracking
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/IROTECHLAB/irotechlab-analytics"
            target="_blank"
            rel="noreferrer noopener"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            <Github size={16} />
            Self-host
          </a>
        </div>

        <p className="text-xs text-text-subtle">
          No credit card · 2-minute setup · MIT-licensed core
        </p>
      </div>
    </section>
  );
}
