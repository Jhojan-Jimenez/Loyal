import { NextRequest, NextResponse } from 'next/server';
import { redeemRewardServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, notes, cashierName } = body;

    if (!token || !token.trim()) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const res = redeemRewardServer(token, notes, cashierName);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 404 });
    }

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error redeeming reward' },
      { status: 500 }
    );
  }
}
