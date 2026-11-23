import { NextRequest, NextResponse } from 'next/server';
import { getDbData, validateSessionAgainstDb } from '@/lib/server-db';
import {
  AUTH_COOKIE_NAME,
  CASHIER_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/auth';
import { StudioConfig, TenantBusiness } from '@/lib/types';

export const dynamic = 'force-dynamic';

function sanitizeConfig(cfg: StudioConfig): StudioConfig {
  const { adminPin: _a, cashierPin: _c, ...safe } = cfg;
  return safe;
}

function sanitizeTenant(t: TenantBusiness): TenantBusiness {
  const { adminPin: _a, cashierPin: _c, cashiers: _cashiers, config, ...safe } = t;
  return {
    ...safe,
    ...(config ? { config: sanitizeConfig(config) } : {}),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get('tenantSlug') || undefined;

    const authToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const rawSession = authToken ? await verifySessionToken(authToken) : null;
    const session =
      rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;

    const cashierToken = req.cookies.get(CASHIER_COOKIE_NAME)?.value;
    const cashierSession = cashierToken ? await verifySessionToken(cashierToken) : null;

    if (tenantSlug) {
      const cleanSlug = tenantSlug.toLowerCase().trim();
      const data = getDbData(cleanSlug);

      if (!data.tenant) {
        return NextResponse.json(
          { success: false, error: 'Comercio no encontrado' },
          { status: 404 }
        );
      }

      if (data.tenant.status === 'suspended' && !session?.isPlatformSuperAdmin) {
        return NextResponse.json(
          { success: false, error: 'Este comercio se encuentra suspendido temporalmente.' },
          { status: 403 }
        );
      }

      const canReadTenantPii = Boolean(
        session?.isPlatformSuperAdmin ||
          session?.activeTenant?.slug?.toLowerCase().trim() === cleanSlug ||
          (cashierSession?.role === 'cashier' &&
            cashierSession?.tenantSlug?.toLowerCase().trim() === cleanSlug)
      );

      return NextResponse.json({
        success: true,
        config: sanitizeConfig(data.config),
        tenant: sanitizeTenant(data.tenant),
        students: canReadTenantPii ? data.students : [],
        transactions: canReadTenantPii ? data.transactions : [],
        classes: data.classes,
      });
    }

    const data = getDbData();
    if (session?.isPlatformSuperAdmin) {
      return NextResponse.json({
        success: true,
        tenants: (data.tenants || []).map(sanitizeTenant),
        students: data.students,
        transactions: data.transactions,
        config: sanitizeConfig(data.config),
        classes: data.classes,
      });
    }

    return NextResponse.json({
      success: true,
      config: sanitizeConfig(data.config),
      students: [],
      transactions: [],
      classes: data.classes,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error fetching database' },
      { status: 500 }
    );
  }
}
