import Link from 'next/link';
import { Check, Send, Instagram } from 'lucide-react';

const UPGRADE_TELEGRAM = 'https://t.me/ironmanhindigaming';
const UPGRADE_INSTAGRAM = 'https://instagram.com/ironmanyt00';

const TIERS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'For side projects and personal sites.',
    features: [
      '1 site',
      '10,000 events / month',
      '30-day data retention',
      'Realtime dashboard',
      'CSV export',
    ],
    cta: 'Get started',
    ctaHref: '/login',
    highlighted: false,
    external: false,
  },
  {
    name: 'Pro',
    price: '₹100',
    period: '/ 30 days',
    description: 'For growing apps and serious sites.',
    features: [
      '10 sites',
      '1M events / month',
      '1-year data retention',
      'Public dashboards',
      'Custom events',
      'Webhooks',
      'Priority support',
    ],
    cta: 'Contact to upgrade',
    ctaHref: UPGRADE_TELEGRAM,
    highlighted: true,
    external: true,
  },
  {
    name: 'Self-host',
    price: 'Free',
    period: 'MIT licensed',
    description: 'Run it on your own infrastructure.',
    features: [
      'Unlimited sites',
      'Unlimited events',
      'Your data, your server',
      'All features included',
      'Community support',
    ],
    cta: 'View on GitHub',
    ctaHref: 'https://github.com/IROTECHLAB/irotechlab-analytics',
    highlighted: false,
    external: true,
  },
];

export function Pricing() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Simple pricing.
        </h2>
        <p className="text-text-muted mt-3">
          Free to start. ₹100 for 30 days of Pro. Self-host for free, forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-lg bg-bg-elevated border p-6 space-y-5 ${
              tier.highlighted ? 'border-brand-500/40' : 'border-border'
            }`}
            style={
              tier.highlighted
                ? { boxShadow: '0 4px 24px rgba(16,185,129,0.15)' }
                : undefined
            }
          >
            {tier.highlighted && (
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                Most popular
              </span>
            )}

            <div>
              <h3 className="font-bold text-lg">{tier.name}</h3>
              <p className="text-xs text-text-muted mt-1">{tier.description}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tnum">{tier.price}</span>
              <span className="text-sm text-text-muted">{tier.period}</span>
            </div>

            <ul className="space-y-2.5 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check
                    size={14}
                    className="text-brand-500 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-text-muted">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={tier.ctaHref}
              target={tier.external ? '_blank' : undefined}
              rel={tier.external ? 'noreferrer noopener' : undefined}
              className={`block text-center px-4 py-2.5 rounded-md font-semibold text-sm transition-all ${
                tier.highlighted
                  ? 'text-white shadow-glow hover:shadow-glow-hover hover:-translate-y-px'
                  : 'border border-border-strong text-text-muted hover:text-text'
              }`}
              style={
                tier.highlighted
                  ? { backgroundImage: 'var(--brand-gradient)' }
                  : undefined
              }
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Contact block */}
      <div className="mt-10 rounded-lg bg-bg-elevated border border-border p-6 space-y-4">
        <h3 className="font-semibold">How to upgrade</h3>
        <p className="text-sm text-text-muted">
          Pro is ₹100 for 30 days. Message us on Telegram or Instagram to
          purchase. We&apos;ll activate Pro on your account within minutes —
          no auto-renew, no card on file.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={UPGRADE_TELEGRAM}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            <Send size={14} />
            Telegram @ironmanhindigaming
          </a>
          <a
            href={UPGRADE_INSTAGRAM}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            <Instagram size={14} />
            Instagram @ironmanyt00
          </a>
        </div>
      </div>
    </section>
  );
}
