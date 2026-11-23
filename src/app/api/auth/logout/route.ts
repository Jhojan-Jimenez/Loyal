import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, CASHIER_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' });
  const cookieOpts = {
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  res.cookies.set({ name: AUTH_COOKIE_NAME, ...cookieOpts });
  res.cookies.set({ name: CASHIER_COOKIE_NAME, ...cookieOpts });
  return res;
}
