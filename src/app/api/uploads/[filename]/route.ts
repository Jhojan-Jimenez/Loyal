import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDataDir } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const safeName = path.basename(filename);
    if (!safeName || safeName !== filename) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_MAP[ext];
    if (!contentType) {
      return new NextResponse('Unsupported file type', { status: 400 });
    }

    const filePath = path.join(getDataDir(), 'uploads', safeName);
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Not found', { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Internal error', { status: 500 });
  }
}
