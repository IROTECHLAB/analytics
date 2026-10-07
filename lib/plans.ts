export type PlanId = 'free' | 'pro' | 'self-host';

export type Plan = {
  id: PlanId;
  name: string;
  priceINR: number;
  priceDays: number;
  maxSites: number;
  maxEventsPerMonth: number;
  retentionDays: number;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceINR: 0,
    priceDays: 0,
    maxSites: 1,
    maxEventsPerMonth: 10_000,
    retentionDays: 30,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceINR: 100,
    priceDays: 30,
    maxSites: 10,
    maxEventsPerMonth: 1_000_000,
    retentionDays: 365,
  },
  'self-host': {
    id: 'self-host',
    name: 'Self-host',
    priceINR: 0,
    priceDays: 0,
    maxSites: Number.POSITIVE_INFINITY,
    maxEventsPerMonth: Number.POSITIVE_INFINITY,
    retentionDays: 3650,
  },
};

export function getPlan(planId: string | null | undefined): Plan {
  if (planId && planId in PLANS) return PLANS[planId as PlanId];
  return PLANS.free;
}

export function isSelfHosted(): boolean {
  return process.env.SELF_HOSTED === 'true';
}

export function effectivePlan(
  planId: string | null | undefined,
  expiresAt?: Date | string | null
): Plan {
  if (isSelfHosted()) return PLANS['self-host'];

  const plan = getPlan(planId);
  if (plan.id === 'free' || plan.id === 'self-host') return plan;

  if (!expiresAt) return PLANS.free;
  const exp = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  if (isNaN(exp.getTime())) return PLANS.free;
  if (exp.getTime() < Date.now()) return PLANS.free;

  return plan;
}

export function daysRemaining(expiresAt?: Date | string | null): number | null {
  if (!expiresAt) return null;
  const exp = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  if (isNaN(exp.getTime())) return null;
  const diff = exp.getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export const UPGRADE_CONTACTS = {
  telegram: 'ironmanhindigaming',
  telegramUrl: 'https://t.me/ironmanhindigaming',
  instagram: 'ironmanyt00',
  instagramUrl: 'https://instagram.com/ironmanyt00',
  priceINR: 100,
  periodDays: 30,
};
