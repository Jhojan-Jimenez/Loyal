import { NextRequest, NextResponse } from 'next/server';
import { acceptInvitationServer } from '@/lib/server-db';
import { signSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { AuthSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, fullName } = body;

    if (!token || !password || password.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const result = acceptInvitationServer(token, password, fullName);
    if (!result.success || !result.user || !result.tenant) {
      return NextResponse.json(
        { success: false, error: result.error || 'No se pudo activar la invitación' },
        { status: 400 }
      );
    }

    // Crear sesión autenticada automática para el nuevo dueño
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
      // Compatibilidad
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
      { success: false, error: err.message || 'Error al procesar activación' },
      { status: 500 }
    );
  }
}
