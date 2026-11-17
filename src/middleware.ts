import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 1. Proteger /superadmin (solo SuperAdmin de la plataforma)
  if (pathname === '/superadmin' || pathname.startsWith('/superadmin/')) {
    if (!session || !session.isPlatformSuperAdmin) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteger API de SuperAdmin
  if (pathname.startsWith('/api/superadmin')) {
    if (!session || !session.isPlatformSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requiere rol de SuperAdmin.' },
        { status: 401 }
      );
    }
  }

  // 3. Proteger y redirigir /admin legado
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.isPlatformSuperAdmin) {
      return NextResponse.redirect(new URL('/superadmin', req.url));
    }
    if (session.activeTenant?.slug) {
      return NextResponse.redirect(new URL(`/${session.activeTenant.slug}/admin`, req.url));
    }
  }

  // 4. Proteger /[slug]/admin (SuperAdmin o el Administrador del Tenant correspondiente)
  const slugAdminMatch = pathname.match(/^\/([^\/]+)\/admin(\/.*)?$/);
  if (slugAdminMatch) {
    const targetSlug = slugAdminMatch[1];
    // Evitar falsos positivos en rutas del sistema
    if (!['api', 'superadmin', 'admin', 'login', 'invite', 'card', '_next'].includes(targetSlug)) {
      if (!session) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Si es SuperAdmin de la plataforma, tiene acceso a todos los comercios
      if (session.isPlatformSuperAdmin) {
        return NextResponse.next();
      }

      // Si el usuario pertenece a este tenant específico
      if (session.activeTenant?.slug === targetSlug) {
        return NextResponse.next();
      }

      // Si pertenece a otro tenant diferente, redirigir a su propio admin
      if (session.activeTenant?.slug) {
        return NextResponse.redirect(new URL(`/${session.activeTenant.slug}/admin`, req.url));
      }

      // Sin permisos
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/superadmin',
    '/superadmin/:path*',
    '/api/superadmin/:path*',
    '/admin',
    '/admin/:path*',
    '/:slug/admin',
    '/:slug/admin/:path*',
  ],
};
