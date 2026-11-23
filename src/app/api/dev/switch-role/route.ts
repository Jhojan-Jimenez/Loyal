import { NextRequest, NextResponse } from 'next/server';
import { signSessionToken, verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import {
  getTenantsServer,
  createBlankOnboardingLinkServer,
  completeSelfOnboardingServer,
  validateSessionAgainstDb,
} from '@/lib/server-db';
import { AuthSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const currentSession = token ? await verifySessionToken(token) : null;
  const isSuperAdmin = Boolean(
    currentSession?.isPlatformSuperAdmin &&
      validateSessionAgainstDb(currentSession).valid
  );

  if (!isSuperAdmin) {
    return NextResponse.json(
      { success: false, error: 'Acceso exclusivo para SuperAdmin' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const targetRole = body.role as
      | 'public'
      | 'superadmin'
      | 'admin'
      | 'scanner'
      | 'join'
      | 'onboard';

    let tenants = getTenantsServer();
    let targetSlug = tenants[0]?.slug;

    // If user wants a tenant-scoped UI (admin/scanner/join) and DB is empty, spin up a quick local test tenant
    if (['admin', 'scanner', 'join'].includes(targetRole) && !targetSlug) {
      const { onboardingToken } = createBlankOnboardingLinkServer({ plan: 'pro' });
      const created = completeSelfOnboardingServer({
        token: onboardingToken.token,
        businessName: 'Café Demo Local',
        category: 'Cafetería & Panadería',
        ownerName: 'Admin Local',
        ownerPhone: '+57 300 000 0000',
        ownerEmail: 'demo@local.dev',
        password: 'loyal2026',
      });
      if (created.success && created.tenant) {
        targetSlug = created.tenant.slug;
      }
    }

    if (targetRole === 'onboard') {
      const { onboardingToken } = createBlankOnboardingLinkServer({ plan: 'pro' });
      return NextResponse.json({
        success: true,
        redirectUrl: `/onboard?token=${onboardingToken.token}`,
      });
    }

    if (targetRole === 'public') {
      return NextResponse.json({ success: true, redirectUrl: '/' });
    }

    if (targetRole === 'join') {
      return NextResponse.json({
        success: true,
        redirectUrl: targetSlug ? `/${targetSlug}/join` : '/',
      });
    }

    // For superadmin, admin, or scanner: issue a valid SuperAdmin session cookie so all routes are unlocked
    const session: AuthSession = {
      userId: 'usr_superadmin',
      email: 'jhojanjimene@gmail.com',
      fullName: 'Jhojan Jimenez (SuperAdmin)',
      isPlatformSuperAdmin: true,
      role: 'superadmin',
      name: 'Jhojan Jimenez (SuperAdmin)',
      ...(targetSlug ? { tenantSlug: targetSlug } : {}),
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    };

    const sessionJwt = await signSessionToken(session);

    let redirectUrl = '/superadmin';
    if (targetRole === 'admin') {
      redirectUrl = targetSlug ? `/${targetSlug}/admin` : '/superadmin';
    } else if (targetRole === 'scanner') {
      redirectUrl = targetSlug ? `/${targetSlug}/scanner` : '/scanner';
    }

    const res = NextResponse.json({ success: true, redirectUrl });
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionJwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error cambiando de rol' },
      { status: 500 }
    );
  }
}
