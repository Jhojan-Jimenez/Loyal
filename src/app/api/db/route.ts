import { NextRequest, NextResponse } from 'next/server';
import { getDbData } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get('tenantSlug') || undefined;
    const data = getDbData(tenantSlug);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error fetching database' },
      { status: 500 }
    );
  }
}
