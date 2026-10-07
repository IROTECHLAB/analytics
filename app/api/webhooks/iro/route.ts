import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { processedWebhooks, sessions } from '@/lib/db/schema';
import { verifyWebhookSignature } from '@/lib/auth/verify-webhook';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const ts = req.headers.get('x-iro-timestamp') ?? '';
  const sig = req.headers.get('x-iro-signature') ?? '';
  const eventName = req.headers.get('x-iro-event') ?? '';

  if (!verifyWebhookSignature({ rawBody, timestamp: ts, signature: sig })) {
    return new NextResponse('invalid signature', { status: 401 });
  }

  let payload: { id: string; event: string; data: any };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('bad json', { status: 400 });
  }

  // Idempotency — dedupe by delivery id
  const seen = await db
    .select()
    .from(processedWebhooks)
    .where(eq(processedWebhooks.id, payload.id))
    .limit(1);
  if (seen.length > 0) return new NextResponse('ok');

  try {
    await handleEvent(payload);
  } catch (e) {
    console.error('[webhook] handler error', eventName, e);
    // We still return 200 — otherwise provider thinks delivery failed
  }

  await db.insert(processedWebhooks).values({
    id: payload.id,
    event: payload.event,
  });

  return new NextResponse('ok');
}

async function handleEvent(payload: { event: string; data: any }) {
  switch (payload.event) {
    case 'user.revoked': {
      const userId = payload.data?.user_id;
      if (userId) {
        await db.delete(sessions).where(eq(sessions.userId, userId));
      }
      break;
    }
    case 'user.revoked_all': {
      await db.delete(sessions);
      break;
    }
    case 'user.authorized': {
      // no-op for now; could send welcome email
      break;
    }
    case 'ping': {
      console.log('[webhook] ping received');
      break;
    }
    default:
      console.log('[webhook] unhandled event', payload.event);
  }
}
