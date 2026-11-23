import { NextRequest, NextResponse } from 'next/server';
import { getTenantBySlug, resolveCashierByPinServer } from '@/lib/server-db';
import { CASHIER_COOKIE_NAME, signSessionToken } from '@/lib/auth';
import { AuthSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (!slug || !pin || !String(pin).trim()) {
      return NextResponse.json(
        { success: false, error: 'Slug y PIN requeridos' },
        { status: 400 }
      );
    }

    const tenant = getTenantBySlug(String(slug));
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Comercio no encontrado o eliminado.' },
        { status: 404 }
      );
    }

    if (tenant.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Este comercio se encuentra suspendido temporalmente.' },
        { status: 403 }
      );
    }

    const resolved = resolveCashierByPinServer(tenant.slug, String(pin));
    if (!resolved.valid || !resolved.cashier) {
      return NextResponse.json(
        { success: false, error: 'PIN incorrecto o cajero desactivado. Revisa con el dueño del negocio.' },
        { status: 401 }
      );
    }

    const cashierSession: AuthSession = {
      userId: `cashier_${tenant.slug}_${resolved.cashier.id}`,
      email: '',
      fullName: resolved.cashier.name,
      isPlatformSuperAdmin: false,
      role: 'cashier',
      tenantSlug: tenant.slug,
      expiresAt: Date.now() + 12 * 3600 * 1000,
    };

    const cashierToken = await signSessionToken(cashierSession);
    const res = NextResponse.json({
      success: true,
      message: 'PIN verificado correctamente',
      cashierName: resolved.cashier.name,
    });
    res.cookies.set({
      name: CASHIER_COOKIE_NAME,
      value: cashierToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 3600,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al validar PIN' },
      { status: 500 }
    );
  }
}
