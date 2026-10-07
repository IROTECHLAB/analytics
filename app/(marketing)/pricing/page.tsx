import { Pricing } from '@/components/marketing/Pricing';
import { CTA } from '@/components/marketing/CTA';

export const metadata = {
  title: 'Pricing — IROTECHLAB ANALYTICS',
  description: 'Simple, honest pricing. ₹100 for 30 days of Pro.',
};

export default function PricingPage() {
  return (
    <main className="pt-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Pricing
        </h1>
        <p className="text-text-muted mt-3 max-w-xl">
          Free for side projects. ₹100 for 30 days of Pro. Self-host for free,
          forever.
        </p>
      </div>
      <Pricing />
      <CTA />
    </main>
  );
}
