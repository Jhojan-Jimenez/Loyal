import { NextRequest, NextResponse } from 'next/server';
import {
  getTenantsServer,
  createTenantServer,
  updateTenantStatusServer,
  deleteTenantServer,
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
      if (!name || !ownerName || !ownerPhone) {
        return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
      }
      const tenant = createTenantServer({
        name,
        slug,
        category,
        ownerName,
        ownerEmail,
        ownerPhone,
        plan,
        monthlyFeeCop,
      });
      return NextResponse.json({ success: true, tenant });
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

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
