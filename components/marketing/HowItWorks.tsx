import { UserPlus, Code2, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    Icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign in with IrotechLab \u2014 takes 10 seconds. No credit card, no email confirmation loop.',
  },
  {
    Icon: Code2,
    title: 'Paste one line',
    desc: 'Drop a single script tag into your site\u2019s <head>. It\u2019s under 2KB.',
  },
  {
    Icon: BarChart3,
    title: 'Watch the data',
    desc: 'Visitors, pages, referrers, devices \u2014 live in your dashboard within seconds.',
  },
];

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Live in under 2 minutes.
        </h2>
        <p className="text-text-muted mt-3">
          Three steps. No config files. No tag managers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map(({ Icon, title, desc }, i) => (
          <div
            key={title}
            className="relative rounded-lg bg-bg-elevated border border-border p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                {i + 1}
              </div>
              <Icon size={18} className="text-brand-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-bg-elevated border border-border p-6">
        <p className="text-xs text-text-subtle mb-2 font-mono uppercase tracking-wider">
          The whole snippet
        </p>
        <pre className="text-xs md:text-sm font-mono text-text overflow-x-auto">
          <code>{`<script defer
  data-site="iro_site_xxx"
  src="https://irotechlab-analytics.netlify.app/script.js"
></script>`}</code>
        </pre>
      </div>
    </section>
  );
}
