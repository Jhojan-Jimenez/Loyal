'use client';

import React from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { LoyaltyCard } from '@/components/LoyaltyCard';
import Link from 'next/link';
import { ArrowLeft, UserX, ShieldCheck, Loader2 } from 'lucide-react';

export function StudentCardView({ token }: { token: string }) {
  const { getStudentByToken, config, isLoaded, refreshFromServer } = useLoyal();

  const student = getStudentByToken(token);

  React.useEffect(() => {
    if (!student) {
      refreshFromServer();
    }
  }, [student, refreshFromServer]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin" />
        <p className="text-xs text-neutral-600 mt-3 font-medium">Cargando pase digital...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-neutral-200 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-950">Tarjeta no encontrada</h2>
          <p className="text-xs text-neutral-600 mt-2 mb-6">
            El código <code className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-900 font-mono">{token}</code> no corresponde a ningún cliente registrado.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-black transition-all"
            >
              Crear una Nueva Tarjeta
            </Link>
            <Link
              href="/card/camila-restrepo-yoga"
              className="py-3 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-all border border-neutral-200"
            >
              Ver Tarjeta Demo de Camila
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 bg-neutral-50 min-h-screen">
      {/* Top Breadcrumb */}
      <div className="max-w-md mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
        <span className="text-[11px] font-medium text-neutral-600 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-neutral-200">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
          Pase Activo
        </span>
      </div>

      <LoyaltyCard student={student} config={config} />
    </div>
  );
}
