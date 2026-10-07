import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/admin/auth';

export const runtime = 'nodejs';

export async function POST() {
  await destroyAdminSession();
  return NextResponse.redirect(new URL('/admin/login', process.env.APP_URL || 'http://localhost:3000'));
}
