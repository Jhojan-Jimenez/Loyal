import { NextRequest, NextResponse } from 'next/server';
import { addStampServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, note, cashierName } = body;

    if (!token || !token.trim()) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const res = addStampServer(token, note, cashierName);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 404 });
    }

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error adding stamp' },
      { status: 500 }
    );
  }
}
