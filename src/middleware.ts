import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 1. Proteger /superadmin
  if (pathname.startsWith('/superadmin')) {
    if (!session || session.role !== 'superadmin') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('role', 'superadmin');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteger /admin
  if (pathname.startsWith('/admin')) {
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('role', 'admin');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Proteger API de SuperAdmin
  if (pathname.startsWith('/api/superadmin')) {
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requiere rol de SuperAdmin.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/superadmin/:path*',
    '/admin/:path*',
    '/api/superadmin/:path*',
  ],
};
