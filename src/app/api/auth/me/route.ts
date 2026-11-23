import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { validateSessionAgainstDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false, session: null });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false, session: null });
    }

    const liveCheck = validateSessionAgainstDb(session);
    if (!liveCheck.valid) {
      const res = NextResponse.json({
        authenticated: false,
        session: null,
        reason: liveCheck.reason,
      });
      res.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return res;
    }

    return NextResponse.json({ authenticated: true, session });
  } catch {
    return NextResponse.json({ authenticated: false, session: null });
  }
}
