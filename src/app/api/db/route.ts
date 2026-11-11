import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getDbData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error fetching database' },
      { status: 500 }
    );
  }
}
