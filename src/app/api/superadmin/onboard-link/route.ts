import { NextRequest, NextResponse } from 'next/server';
import { createBlankOnboardingLinkServer } from '@/lib/server-db';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { TenantPlan } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || !session.isPlatformSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const plan: TenantPlan = ['starter', 'pro', 'enterprise'].includes(body.plan)
      ? body.plan
      : 'pro';
    const monthlyFeeCop =
      body.monthlyFeeCop !== undefined ? Number(body.monthlyFeeCop) : undefined;

    const { onboardingToken, onboardUrl } = createBlankOnboardingLinkServer({
      plan,
      monthlyFeeCop,
    });

    return NextResponse.json({
      success: true,
      onboardUrl,
      onboardingToken,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error generando Magic Link' },
      { status: 500 }
    );
  }
}
