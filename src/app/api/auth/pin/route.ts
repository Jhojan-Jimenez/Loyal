import { NextRequest, NextResponse } from 'next/server';
import { verifyCashierPinServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (!slug || !pin) {
      return NextResponse.json(
        { success: false, error: 'Slug y PIN requeridos' },
        { status: 400 }
      );
    }

    const isValid = verifyCashierPinServer(slug, pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'PIN incorrecto. Revisa con el dueño del negocio.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: 'PIN verificado correctamente' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al validar PIN' },
      { status: 500 }
    );
  }
}
