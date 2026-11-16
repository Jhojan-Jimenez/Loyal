import { NextRequest, NextResponse } from 'next/server';
import { deleteStudentServer } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 400 });
    }

    const success = deleteStudentServer(token);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}
