import { NextRequest, NextResponse } from 'next/server';
import {
  createCashierServer,
  deleteCashierServer,
  getTenantBySlug,
  getTenantCashiersServer,
  toggleCashierStatusServer,
  validateSessionAgainstDb,
} from '@/lib/server-db';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { AuthSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

type AuthResult =
  | { ok: false; error: NextResponse }
  | { ok: true; session: AuthSession; slug: string };

async function authorizeTenantAdmin(
  req: NextRequest,
  tenantSlug: string | null
): Promise<AuthResult> {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const rawSession = token ? await verifySessionToken(token) : null;
  const session =
    rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;

  if (!session) {
    return { ok: false, error: NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 }) };
  }

  const cleanSlug = tenantSlug?.toLowerCase().trim();
  if (!cleanSlug) {
    return {
      ok: false,
      error: NextResponse.json({ success: false, error: 'tenantSlug requerido' }, { status: 400 }),
    };
  }

  if (!session.isPlatformSuperAdmin && session.activeTenant?.slug.toLowerCase().trim() !== cleanSlug) {
    return {
      ok: false,
      error: NextResponse.json(
        { success: false, error: 'No tienes permiso para administrar cajeros de este comercio.' },
        { status: 403 }
      ),
    };
  }

  const tenant = getTenantBySlug(cleanSlug);
  if (!tenant) {
    return {
      ok: false,
      error: NextResponse.json({ success: false, error: 'Comercio no encontrado.' }, { status: 404 }),
    };
  }

  return { ok: true, session, slug: tenant.slug };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authResult = await authorizeTenantAdmin(req, searchParams.get('tenantSlug'));
  if (!authResult.ok) return authResult.error;

  const cashiers = getTenantCashiersServer(authResult.slug);
  return NextResponse.json({ success: true, cashiers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authResult = await authorizeTenantAdmin(req, body?.tenantSlug || null);
    if (!authResult.ok) return authResult.error;

    const cashier = createCashierServer(
      authResult.slug,
      String(body?.name || ''),
      String(body?.pin || '')
    );
    return NextResponse.json({ success: true, cashier }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al crear cajero' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const authResult = await authorizeTenantAdmin(req, body?.tenantSlug || null);
    if (!authResult.ok) return authResult.error;

    if (!body?.cashierId || typeof body?.active !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'cashierId y active son requeridos' },
        { status: 400 }
      );
    }

    const updated = toggleCashierStatusServer(
      authResult.slug,
      String(body.cashierId),
      body.active
    );
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Cajero no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, cashier: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al actualizar cajero' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const authResult = await authorizeTenantAdmin(req, body?.tenantSlug || null);
    if (!authResult.ok) return authResult.error;

    if (!body?.cashierId) {
      return NextResponse.json({ success: false, error: 'cashierId requerido' }, { status: 400 });
    }

    const deleted = deleteCashierServer(authResult.slug, String(body.cashierId));
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Cajero no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al eliminar cajero' },
      { status: 400 }
    );
  }
}
