import React from 'react';
import { getTenantBySlug, getDbData } from '@/lib/server-db';
import { DEFAULT_STUDIO_CONFIG } from '@/lib/store';
import { FusionCustomerJoinView } from '@/components/fusion/FusionCustomerJoinView';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TenantJoinPage({
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
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE4D5] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif text-[#1C1917]">Comercio no encontrado</h1>
          <p className="text-xs text-[#78716C] mt-2 mb-6">
            El enlace de registro al que intentas acceder no corresponde a ningún negocio activo en Loyal.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ir a Loyal</span>
          </Link>
        </div>
      </div>
    );
  }

  if (tenant.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE4D5] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif text-[#1C1917]">Comercio suspendido temporalmente</h1>
          <p className="text-xs text-[#78716C] mt-2 mb-6">
            Este programa de fidelidad no está disponible en este momento.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ir a Loyal</span>
          </Link>
        </div>
      </div>
    );
  }

  const dbData = getDbData(cleanSlug);
  const config = tenant.config || dbData.config || DEFAULT_STUDIO_CONFIG;

  return <FusionCustomerJoinView tenant={tenant} config={config} />;
}
