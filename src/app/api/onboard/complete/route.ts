import { NextRequest, NextResponse } from 'next/server';
import { completeSelfOnboardingServer } from '@/lib/server-db';
import { signSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { AuthSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token,
      businessName,
      category,
      ownerName,
      ownerPhone,
      ownerEmail,
      password,
    } = body;

    if (!token || !businessName?.trim() || !ownerName?.trim() || !ownerPhone?.trim() || !ownerEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Por favor completa todos los campos requeridos' },
        { status: 400 }
      );
    }

    if (!password || password.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const result = completeSelfOnboardingServer({
      token,
      businessName,
      category,
      ownerName,
      ownerPhone,
      ownerEmail,
      password,
    });

    if (!result.success || !result.user || !result.tenant) {
      return NextResponse.json(
        { success: false, error: result.error || 'No se pudo crear el negocio' },
        { status: 400 }
      );
    }

    const session: AuthSession = {
      userId: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      isPlatformSuperAdmin: false,
      activeTenant: {
        id: result.tenant.id,
        slug: result.tenant.slug,
        name: result.tenant.name,
        role: 'OWNER',
      },
      role: 'admin',
      tenantSlug: result.tenant.slug,
      name: result.user.fullName,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
    };

    const sessionJwt = await signSessionToken(session);
    const redirectUrl = `/${result.tenant.slug}/admin`;

    const res = NextResponse.json({
      success: true,
      redirectUrl,
      tenant: result.tenant,
    });

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
      { success: false, error: err.message || 'Error al crear el negocio' },
      { status: 500 }
    );
  }
}
