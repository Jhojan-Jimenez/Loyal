import { NextRequest, NextResponse } from 'next/server';
import { registerStudentServer } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, token } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const student = registerStudentServer(name, phone || '', email, token);
    return NextResponse.json({ success: true, student });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error registering student' },
      { status: 500 }
    );
  }
}
