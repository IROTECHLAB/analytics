import { NextResponse, type NextRequest } from 'next/server';
import { verifyCredentials, createAdminSession } from '@/lib/admin/auth';
import { rateLimit, clientIp } from '@/lib/admin/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const limit = rateLimit(`admin-login:${ip}`, 5, 10 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        message: `Too many attempts. Try again in ${Math.ceil(limit.resetIn / 60000)} minute(s).`,
      },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: 'invalid_credentials', message: 'Invalid credentials.' },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
