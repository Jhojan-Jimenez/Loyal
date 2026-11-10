import { NextRequest, NextResponse } from 'next/server';
import { generateGoogleWalletSaveUrl } from '@/lib/google-wallet';
import { INITIAL_STUDENTS, DEFAULT_STUDIO_CONFIG } from '@/lib/store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // Find student in initial list or fallback
  const student = INITIAL_STUDENTS.find(
    (s) => s.token.toLowerCase() === token.toLowerCase().trim()
  ) || {
    id: `std_${token}`,
    token,
    name: 'Alumno Samyama Yoga',
    phone: '',
    registeredAt: new Date().toISOString(),
    stamps: 0,
    totalCompletedCycles: 0,
    totalVisits: 0,
    lastVisitAt: null,
  };

  const res = generateGoogleWalletSaveUrl(student, DEFAULT_STUDIO_CONFIG);

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
    const { student, config } = body;

    if (!student || !student.token) {
      return NextResponse.json({ error: 'Student object is required' }, { status: 400 });
    }

    const res = generateGoogleWalletSaveUrl(student, config || DEFAULT_STUDIO_CONFIG);

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
