import { NextRequest, NextResponse } from 'next/server';
import { verifyOnboardingTokenServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  const result = verifyOnboardingTokenServer(token);

  if (!result.valid || !result.onboardingToken) {
    return NextResponse.json(
      { valid: false, error: result.error || 'Enlace inválido' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    valid: true,
    plan: result.onboardingToken.plan,
    monthlyFeeCop: result.onboardingToken.monthlyFeeCop,
    expiresAt: result.onboardingToken.expiresAt,
  });
}
