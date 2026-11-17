import { NextRequest, NextResponse } from 'next/server';
import { findStudentByPhoneServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const tenantSlug = searchParams.get('tenantSlug') || undefined;

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone parameter is required' },
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
