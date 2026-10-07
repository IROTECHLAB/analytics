import {
  ShieldCheck,
  Zap,
  Server,
  BarChart3,
  Globe,
  Smartphone,
  Download,
  Share2,
  Webhook,
  Sparkles,
  Cookie,
  Github,
} from 'lucide-react';

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: 'Privacy-first',
    desc: 'No cookies. No fingerprinting. No personal data stored. Compliant by default.',
  },
  {
    Icon: Cookie,
    title: 'No cookie banner',
    desc: 'Because we don\u2019t use cookies. Skip the GDPR popup entirely.',
  },
  {
    Icon: Zap,
    title: 'Lightweight',
    desc: 'Under 2KB tracking script. Doesn\u2019t slow your site down.',
  },
  {
    Icon: Server,
    title: 'Self-hostable',
    desc: 'Run it on your own server with Docker. Full data ownership.',
  },
  {
    Icon: BarChart3,
    title: 'Realtime dashboard',
    desc: 'Watch visitors arrive in real time, with auto-refresh.',
  },
  {
    Icon: Globe,
    title: 'Geo & device breakdown',
    desc: 'Country, city, device, browser, OS \u2014 no IPs stored.',
  },
  {
    Icon: Smartphone,
    title: 'Mobile-friendly',
    desc: 'Dashboard works beautifully on phones and tablets.',
  },
  {
    Icon: Download,
    title: 'CSV export',
    desc: 'Download raw events anytime. Your data, your rules.',
  },
  {
    Icon: Share2,
    title: 'Public dashboards',
    desc: 'Share a read-only view of your stats with a private link.',
  },
  {
    Icon: Sparkles,
    title: 'Custom events',
    desc: 'Track signups, purchases, clicks \u2014 anything you want.',
  },
  {
    Icon: Webhook,
    title: 'Webhooks',
    desc: 'React to user events with signed webhook deliveries.',
  },
  {
    Icon: Github,
    title: 'Open source',
    desc: 'MIT-licensed. Audit it, fork it, contribute.',
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Everything you need, nothing you don&apos;t.
        </h2>
        <p className="text-text-muted mt-3">
          All the analytics you actually use \u2014 without the bloat,
          surveillance, or complexity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-lg bg-bg-elevated border border-border p-5 hover:border-border-strong transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-bg-overlay border border-border flex items-center justify-center text-brand-500 mb-3">
              <Icon size={16} />
            </div>
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
