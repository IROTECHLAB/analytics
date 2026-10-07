import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/require-user';
import { createSite, listSites } from '@/lib/db/queries/sites';
import { countSitesForUser } from '@/lib/db/queries/usage';
import { effectivePlan, UPGRADE_CONTACTS } from '@/lib/plans';

export const runtime = 'nodejs';

const CreateSchema = z.object({
  domain: z.string().min(1).max(255).transform((s) => s.trim().toLowerCase()),
  name: z.string().min(1).max(100).transform((s) => s.trim()),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const list = await listSites(user.id);
  return NextResponse.json({ sites: list });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const plan = effectivePlan(user.plan, user.planExpiresAt);
  const count = await countSitesForUser(user.id);
  if (count >= plan.maxSites) {
    return NextResponse.json(
      {
        error: 'limit_reached',
        message: `Your ${plan.name} plan allows ${plan.maxSites} site${
          plan.maxSites === 1 ? '' : 's'
        }.`,
        plan: plan.id,
        maxSites: plan.maxSites,
        upgrade: UPGRADE_CONTACTS,
      },
      { status: 402 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const site = await createSite(user.id, parsed.data);
  return NextResponse.json({ site }, { status: 201 });
}
