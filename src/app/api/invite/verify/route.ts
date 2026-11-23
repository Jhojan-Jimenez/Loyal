import { NextRequest, NextResponse } from 'next/server';
import { getInvitationByToken, getDbData } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de invitación requerido' },
        { status: 400 }
      );
    }

    const invitation = getInvitationByToken(token);
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Enlace de invitación no válido o ya utilizado' },
        { status: 404 }
      );
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Esta invitación ha expirado' },
        { status: 410 }
      );
    }

    const db = getDbData();
    const tenant = (db.tenants || []).find((t) => t.id === invitation.tenantId);

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'El comercio asociado a esta invitación ya no existe' },
        { status: 404 }
      );
    }

    if (tenant.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Este comercio se encuentra suspendido temporalmente' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        email: invitation.email,
        tenantName: tenant?.name || invitation.tenantName,
        tenantSlug: tenant?.slug || invitation.tenantSlug,
        role: invitation.role,
        ownerName: tenant?.ownerName || '',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al validar invitación' },
      { status: 500 }
    );
  }
}
