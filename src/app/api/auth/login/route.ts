import { NextRequest, NextResponse } from 'next/server';
import {
  signSessionToken,
  AUTH_COOKIE_NAME,
  SUPERADMIN_PASSWORD,
} from '@/lib/auth';
import { AuthSession } from '@/lib/types';
import { getDbData } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, password, pin, slug, cashierName } = body;

    const db = getDbData();

    // 1. SuperAdmin Login
    if (role === 'superadmin') {
      if (!password || password.trim() !== SUPERADMIN_PASSWORD) {
        return NextResponse.json(
          { success: false, error: 'Contraseña de SuperAdmin incorrecta.' },
          { status: 401 }
        );
      }

      const session: AuthSession = {
        role: 'superadmin',
        name: 'SuperAdmin Maestro',
        expiresAt: Date.now() + 7 * 24 * 3600 * 1000, // 7 días
      };

      const token = await signSessionToken(session);
      const res = NextResponse.json({ success: true, session });
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
    }

    // 2. Admin de Comercio Login
    if (role === 'admin') {
      // El SuperAdmin puede ingresar con su clave maestra
      if (password && password.trim() === SUPERADMIN_PASSWORD) {
        const session: AuthSession = {
          role: 'admin',
          tenantSlug: slug || undefined,
          name: 'SuperAdmin (Vista Admin)',
          expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
        };

        const token = await signSessionToken(session);
        const res = NextResponse.json({ success: true, session });
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
      }

      // Validación por PIN de comercio
      let targetTenant = slug ? (db.tenants || []).find((t) => t.slug === slug) : null;
      if (!targetTenant && (db.tenants || []).length === 1) {
        targetTenant = db.tenants[0];
      }

      const validPin = targetTenant?.adminPin || db.config.adminPin || '1234';

      if (!pin || pin.trim() !== validPin) {
        return NextResponse.json(
          { success: false, error: 'PIN de Administrador incorrecto (default: 1234).' },
          { status: 401 }
        );
      }

      const session: AuthSession = {
        role: 'admin',
        tenantSlug: targetTenant?.slug,
        name: targetTenant ? `Admin · ${targetTenant.name}` : 'Administrador',
        expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
      };

      const token = await signSessionToken(session);
      const res = NextResponse.json({ success: true, session });
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
    }

    // 3. Cajero / Mostrador Login
    if (role === 'cashier') {
      let targetTenant = slug ? (db.tenants || []).find((t) => t.slug === slug) : null;
      if (!targetTenant && (db.tenants || []).length === 1) {
        targetTenant = db.tenants[0];
      }

      const validPin = targetTenant?.cashierPin || db.config.cashierPin || '0000';

      if (!pin || pin.trim() !== validPin) {
        return NextResponse.json(
          { success: false, error: 'PIN de Cajero incorrecto (default: 0000).' },
          { status: 401 }
        );
      }

      const session: AuthSession = {
        role: 'cashier',
        tenantSlug: targetTenant?.slug,
        name: cashierName?.trim() || 'Cajero de Mostrador',
        expiresAt: Date.now() + 24 * 3600 * 1000, // 24 horas
      };

      const token = await signSessionToken(session);
      const res = NextResponse.json({ success: true, session });
      res.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 3600,
      });
      return res;
    }

    return NextResponse.json(
      { success: false, error: 'Rol no reconocido.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error en inicio de sesión' },
      { status: 500 }
    );
  }
}
