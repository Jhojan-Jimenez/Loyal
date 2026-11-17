import { NextRequest, NextResponse } from 'next/server';
import { updateStudioConfigServer, updateTenantConfigServer } from '@/lib/server-db';
import { updateGoogleWalletClass } from '@/lib/google-wallet';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    const body = await req.json();
    const { tenantSlug, config } = body;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Configuración inválida' },
        { status: 400 }
      );
    }

    // Si viene tenantSlug, verificar permisos (SuperAdmin o el mismo Tenant)
    if (tenantSlug) {
      if (
        session &&
        !session.isPlatformSuperAdmin &&
        session.activeTenant?.slug !== tenantSlug
      ) {
        return NextResponse.json(
          { success: false, error: 'No autorizado para modificar este comercio' },
          { status: 403 }
        );
      }

      const updated = updateTenantConfigServer(tenantSlug, config);

      // Sync LoyaltyClass styling with Google Wallet in the background
      if (updated?.config) {
        updateGoogleWalletClass(tenantSlug, updated.config).catch((err) => {
          console.warn('[AdminConfig] Google Wallet class sync warning:', err);
        });
      }

      return NextResponse.json({ success: true, config: updated?.config || config });
    }

    // Config global por defecto
    const updated = updateStudioConfigServer(config);
    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
