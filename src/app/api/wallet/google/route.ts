import { NextRequest, NextResponse } from 'next/server';
import { generateGoogleWalletSaveUrl } from '@/lib/google-wallet';
import { getStudentByToken, getDbData } from '@/lib/server-db';
import { DEFAULT_STUDIO_CONFIG } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // Find student in server DB or fallback
  const student = getStudentByToken(token) || {
    id: `std_${token}`,
    token,
    name: 'Cliente Loyal',
    phone: '',
    registeredAt: new Date().toISOString(),
    stamps: 0,
    totalCompletedCycles: 0,
    totalVisits: 0,
    lastVisitAt: null,
  };

  const tenantSlug = student?.tenantSlug || searchParams.get('tenantSlug') || undefined;
  const db = getDbData(tenantSlug);
  const res = generateGoogleWalletSaveUrl(student, db.config || DEFAULT_STUDIO_CONFIG);

  if (res.success && res.saveUrl) {
    // If request has accept text/html or browser direct click, redirect to Google Wallet save URL
    const accept = request.headers.get('accept') || '';
    if (accept.includes('text/html')) {
      return NextResponse.redirect(res.saveUrl);
    }
    return NextResponse.json({ success: true, saveUrl: res.saveUrl });
  }

  return NextResponse.json(
    { success: false, error: res.error || 'Failed to generate Google Wallet link' },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let student = body.student;

    // Support payload with studentToken (used by FusionStudentCardView)
    if (!student && body.studentToken) {
      const existing = getStudentByToken(body.studentToken);
      student = existing || {
        id: `std_${body.studentToken}`,
        token: body.studentToken,
        name: body.studentName || 'Cliente Loyal',
        phone: body.phone || '',
        registeredAt: new Date().toISOString(),
        stamps: body.currentStamps ?? 0,
        totalCompletedCycles: body.totalCycles ?? 0,
        totalVisits: body.currentStamps ?? 0,
        lastVisitAt: null,
        tenantSlug: body.tenantSlug,
      };
    }

    if (!student || !student.token) {
      return NextResponse.json({ error: 'Student or studentToken is required' }, { status: 400 });
    }

    const tenantSlug = student.tenantSlug || body.tenantSlug;
    const db = getDbData(tenantSlug);
    const resolvedConfig = body.config || db.config || DEFAULT_STUDIO_CONFIG;

    const res = generateGoogleWalletSaveUrl(student, resolvedConfig);

    if (res.success && res.saveUrl) {
      return NextResponse.json({ success: true, saveUrl: res.saveUrl });
    }

    return NextResponse.json(
      { success: false, error: res.error || 'Could not generate link' },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 500 });
  }
}
