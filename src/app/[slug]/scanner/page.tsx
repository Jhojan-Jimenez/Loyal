import React from 'react';
import { FusionScannerTerminal } from '@/components/fusion/FusionScannerTerminal';
import { getTenantBySlug } from '@/lib/server-db';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TenantScannerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let cleanSlug = slug;
  try {
    cleanSlug = decodeURIComponent(slug);
  } catch {}
  cleanSlug = cleanSlug.toLowerCase().trim();

  const tenant = getTenantBySlug(cleanSlug);

  if (!tenant) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE4D5] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif text-[#1C1917]">Comercio no encontrado</h1>
          <p className="text-xs text-[#78716C] mt-2 mb-6">
            No existe ningún mostrador para{' '}
            <span className="font-mono font-bold text-[#1C1917]">/{cleanSlug}</span>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  if (tenant.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE4D5] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif text-[#1C1917]">Comercio suspendido temporalmente</h1>
          <p className="text-xs text-[#78716C] mt-2 mb-6">
            El mostrador de este negocio está deshabilitado hasta reactivar la cuenta.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white">
      <FusionScannerTerminal tenantSlug={cleanSlug} />
    </div>
  );
}
