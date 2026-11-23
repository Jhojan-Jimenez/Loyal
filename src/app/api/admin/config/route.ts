import { NextRequest, NextResponse } from 'next/server';
import {
  getTenantBySlug,
  updateStudioConfigServer,
  updateTenantConfigServer,
  validateSessionAgainstDb,
} from '@/lib/server-db';
import { updateGoogleWalletClass } from '@/lib/google-wallet';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const rawSession = token ? await verifySessionToken(token) : null;
    const session =
      rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado. Inicia sesión primero.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { tenantSlug, config } = body;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Configuración inválida' },
        { status: 400 }
      );
    }

    if (config.totalStampsRequired !== undefined) {
      const stampsNum = Number(config.totalStampsRequired);
      if (!Number.isInteger(stampsNum) || stampsNum < 1 || stampsNum > 50) {
        return NextResponse.json(
          { success: false, error: 'La cantidad de sellos requeridos debe ser un entero entre 1 y 50.' },
          { status: 400 }
        );
      }
      config.totalStampsRequired = stampsNum;
    }

    if (config.walletBgColor !== undefined && String(config.walletBgColor).trim() !== '') {
      const color = String(config.walletBgColor).trim();
      if (!HEX_COLOR_RE.test(color)) {
        return NextResponse.json(
          { success: false, error: 'Color hexadecimal inválido. Usa formato #RGB o #RRGGBB.' },
          { status: 400 }
        );
      }
      config.walletBgColor = color;
    }

    // Si viene tenantSlug, verificar permisos (SuperAdmin o el mismo Tenant)
    if (tenantSlug) {
      const cleanSlug = String(tenantSlug).toLowerCase().trim();
      if (
        !session.isPlatformSuperAdmin &&
        session.activeTenant?.slug?.toLowerCase().trim() !== cleanSlug
      ) {
        return NextResponse.json(
          { success: false, error: 'No autorizado para modificar este comercio' },
          { status: 403 }
        );
      }

      const tenant = getTenantBySlug(cleanSlug);
      if (!tenant) {
        return NextResponse.json(
          { success: false, error: 'Comercio no encontrado' },
          { status: 404 }
        );
      }
      if (tenant.status === 'suspended' && !session.isPlatformSuperAdmin) {
        return NextResponse.json(
          { success: false, error: 'Este comercio se encuentra suspendido temporalmente.' },
          { status: 403 }
        );
      }

      const updated = updateTenantConfigServer(tenant.slug, config);

      // Sync LoyaltyClass styling with Google Wallet in the background
      if (updated?.config) {
        updateGoogleWalletClass(tenant.slug, updated.config).catch((err) => {
          console.warn('[AdminConfig] Google Wallet class sync warning:', err);
        });
      }

      return NextResponse.json({ success: true, config: updated?.config || config });
    }

    // Config global por defecto: solo SuperAdmin
    if (!session.isPlatformSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Solo el SuperAdmin puede modificar la configuración global.' },
        { status: 403 }
      );
    }

    const updated = updateStudioConfigServer(config);
    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
