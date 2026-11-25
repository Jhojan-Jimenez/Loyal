import { NextRequest, NextResponse } from 'next/server';
import { findStudentByPhoneServer, getStudentByToken } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const token = searchParams.get('token');
    const tenantSlug = searchParams.get('tenantSlug')?.toLowerCase().trim() || undefined;

    if (token && token.trim()) {
      const byToken = getStudentByToken(token.trim());
      if (
        !byToken ||
        (tenantSlug && byToken.tenantSlug?.toLowerCase().trim() !== tenantSlug)
      ) {
        return NextResponse.json(
          { success: false, error: 'Tarjeta no encontrada para este comercio' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        student: {
          token: byToken.token,
          name: byToken.name,
          stamps: byToken.stamps,
          totalVisits: byToken.totalVisits,
          tenantSlug: byToken.tenantSlug,
        },
      });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone or token parameter is required' },
        { status: 400 }
      );
    }

    const student = findStudentByPhoneServer(phone, tenantSlug);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'No se encontró tarjeta con este número' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        token: student.token,
        name: student.name,
        stamps: student.stamps,
        totalVisits: student.totalVisits,
        tenantSlug: student.tenantSlug,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error searching student' },
      { status: 500 }
    );
  }
}
