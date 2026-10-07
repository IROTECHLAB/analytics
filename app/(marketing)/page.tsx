import { Hero } from '@/components/marketing/Hero';
import { Features } from '@/components/marketing/Features';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { SelfHost } from '@/components/marketing/SelfHost';
import { Pricing } from '@/components/marketing/Pricing';
import { CTA } from '@/components/marketing/CTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <SelfHost />
      <Pricing />
      <CTA />
    </main>
  );
}
