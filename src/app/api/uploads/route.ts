import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDataDir, validateSessionAgainstDb } from '@/lib/server-db';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const rawSession = token ? await verifySessionToken(token) : null;
    const session =
      rawSession && validateSessionAgainstDb(rawSession).valid ? rawSession : null;
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const tenantSlug = (formData.get('tenantSlug') as string | null) || 'general';

    if (
      tenantSlug !== 'general' &&
      !session.isPlatformSuperAdmin &&
      session.activeTenant?.slug?.toLowerCase().trim() !== tenantSlug.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { success: false, error: 'No autorizado para subir archivos en este comercio' },
        { status: 403 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo válido' },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: 'Formato inválido. Usa PNG, JPG o WebP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'La imagen no puede superar los 5 MB.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(getDataDir(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanSlug = tenantSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filename = `${cleanSlug}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
    const publicUrl = `${appUrl.replace(/\/$/, '')}/api/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      relativeUrl: `/api/uploads/${filename}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}
