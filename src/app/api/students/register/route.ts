import { NextRequest, NextResponse } from 'next/server';
import { registerStudentServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, token, tenantSlug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const student = registerStudentServer(name, phone || '', email, token, tenantSlug);
    return NextResponse.json({ success: true, student });
  } catch (err: any) {
    const msg = err?.message || 'Error registering student';
    const status = msg.includes('suspendido')
      ? 403
      : msg.includes('no encontrado')
        ? 404
        : 500;
    return NextResponse.json(
      { success: false, error: msg },
      { status }
    );
  }
}
