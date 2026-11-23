import { NextRequest, NextResponse } from 'next/server';
import {
  deleteStudentServer,
  getStudentByToken,
  validateSessionAgainstDb,
} from '@/lib/server-db';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const rawSession = authToken ? await verifySessionToken(authToken) : null;
    const session =
      rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 400 });
    }

    const student = getStudentByToken(token);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Cliente no encontrado' }, { status: 404 });
    }

    if (
      !session.isPlatformSuperAdmin &&
      session.activeTenant?.slug?.toLowerCase().trim() !== student.tenantSlug?.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { success: false, error: 'No autorizado para eliminar clientes de otro comercio' },
        { status: 403 }
      );
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
