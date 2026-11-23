import { NextRequest, NextResponse } from 'next/server';
import {
  getTenantsServer,
  createTenantServer,
  updateTenantStatusServer,
  deleteTenantServer,
  getOrCreateInvitationForTenant,
} from '@/lib/server-db';

export async function GET() {
  try {
    const tenants = getTenantsServer();
    return NextResponse.json({ success: true, tenants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { name, slug, category, ownerName, ownerEmail, ownerPhone, plan, monthlyFeeCop } = body;
      if (!name || !ownerName || !ownerPhone || !ownerEmail) {
        return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(ownerEmail).trim())) {
        return NextResponse.json({ success: false, error: 'El formato del correo electrónico no es válido' }, { status: 400 });
      }
      try {
        const result = createTenantServer({
          name,
          slug,
          category,
          ownerName,
          ownerEmail,
          ownerPhone,
          plan,
          monthlyFeeCop,
        });
        return NextResponse.json({
          success: true,
          tenant: result.tenant,
          invitation: result.invitation,
          activationUrl: result.activationUrl,
        });
      } catch (e: any) {
        return NextResponse.json({ success: false, error: e?.message || 'Error al crear comercio' }, { status: 400 });
      }
    }

    if (action === 'status') {
      const { slug, status } = body;
      if (!slug || !status) {
        return NextResponse.json({ success: false, error: 'Slug y status requeridos' }, { status: 400 });
      }
      const ok = updateTenantStatusServer(slug, status);
      return NextResponse.json({ success: ok });
    }

    if (action === 'delete') {
      const { slug } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Slug requerido' }, { status: 400 });
      }
      const ok = deleteTenantServer(slug);
      return NextResponse.json({ success: ok });
    }

    if (action === 'invite') {
      const { slug } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Slug requerido' }, { status: 400 });
      }
      const inviteData = getOrCreateInvitationForTenant(slug);
      if (!inviteData) {
        return NextResponse.json({ success: false, error: 'Comercio no encontrado' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        invitation: inviteData.invitation,
        activationUrl: inviteData.activationUrl,
      });
    }

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
