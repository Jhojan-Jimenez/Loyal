import { NextRequest, NextResponse } from 'next/server';
import {
  redeemRewardServer,
  getStudentByToken,
  validateSessionAgainstDb,
} from '@/lib/server-db';
import {
  AUTH_COOKIE_NAME,
  CASHIER_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const rawSession = authToken ? await verifySessionToken(authToken) : null;
    const session =
      rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;

    const cashierToken = request.cookies.get(CASHIER_COOKIE_NAME)?.value;
    const cashierSession = cashierToken ? await verifySessionToken(cashierToken) : null;

    if (!session && !cashierSession) {
      return NextResponse.json(
        { success: false, error: 'No autorizado. Desbloquea el mostrador o inicia sesión.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token, notes, cashierName, tenantSlug } = body;

    if (!token || !token.trim()) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const student = getStudentByToken(token);
    const targetSlug = (tenantSlug || student?.tenantSlug)?.toLowerCase().trim();

    if (!session?.isPlatformSuperAdmin) {
      const allowedSlug =
        session?.activeTenant?.slug?.toLowerCase().trim() ||
        cashierSession?.tenantSlug?.toLowerCase().trim();
      if (!allowedSlug || (targetSlug && allowedSlug !== targetSlug)) {
        return NextResponse.json(
          { success: false, error: 'No autorizado para redimir en este comercio.' },
          { status: 403 }
        );
      }
    }

    const effectiveCashierName =
      cashierSession?.fullName || session?.fullName || cashierName || 'Caja Mostrador';

    const res = redeemRewardServer(token, notes, effectiveCashierName, tenantSlug);
    if (!res.success) {
      const status = res.error?.includes('sellos requeridos')
        ? 400
        : res.error?.includes('suspendido') || res.error?.includes('otro comercio')
          ? 403
          : 404;
      return NextResponse.json({ success: false, error: res.error }, { status });
    }

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error redeeming reward' },
      { status: 500 }
    );
  }
}
