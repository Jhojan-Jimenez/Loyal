import { NextRequest, NextResponse } from 'next/server';
import { signSessionToken, AUTH_COOKIE_NAME, SUPERADMIN_PASSWORD } from '@/lib/auth';
import { AuthSession } from '@/lib/types';
import {
  findUserByEmail,
  verifyPassword,
  getUserMemberships,
  getUserAllMemberships,
} from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu correo y contraseña.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // 1. Buscar usuario por email (o alias 'admin')
    const user = findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Correo o contraseña incorrectos.' },
        { status: 401 }
      );
    }

    // 2. Validar contraseña
    const isPasswordValid =
      verifyPassword(cleanPassword, user.passwordHash) ||
      (user.isPlatformSuperAdmin && cleanPassword === SUPERADMIN_PASSWORD);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Correo o contraseña incorrectos.' },
        { status: 401 }
      );
    }

    // 3. Resolver destino inteligente y membresías
    let redirectUrl = '/';
    let activeTenant: AuthSession['activeTenant'] = undefined;

    if (user.isPlatformSuperAdmin) {
      redirectUrl = '/superadmin';
    } else {
      const memberships = getUserMemberships(user.id);

      if (memberships.length === 1) {
        const m = memberships[0];
        activeTenant = {
          id: m.tenant.id,
          slug: m.tenant.slug,
          name: m.tenant.name,
          role: m.membership.role,
        };
        redirectUrl = `/${m.tenant.slug}/admin`;
      } else if (memberships.length > 1) {
        redirectUrl = '/workspaces';
      } else {
        const allMemberships = getUserAllMemberships(user.id);
        const isSuspended = allMemberships.some(
          (m) => m.tenant?.status === 'suspended'
        );
        return NextResponse.json(
          {
            success: false,
            error: isSuspended
              ? 'Tu comercio se encuentra suspendido temporalmente. Contacta al administrador de Loyal.'
              : 'Tu comercio ha sido eliminado o no tienes acceso activo a ningún espacio.',
          },
          { status: 403 }
        );
      }
    }

    // 4. Crear sesión
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isPlatformSuperAdmin: user.isPlatformSuperAdmin,
      activeTenant,
      // Compatibilidad con código existente
      role: user.isPlatformSuperAdmin ? 'superadmin' : 'admin',
      tenantSlug: activeTenant?.slug,
      name: user.fullName,
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000, // 7 días
    };

    const token = await signSessionToken(session);
    const res = NextResponse.json({ success: true, redirectUrl, session });

    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error en inicio de sesión' },
      { status: 500 }
    );
  }
}
