'use client';

import React from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { LoyaltyCard } from '@/components/LoyaltyCard';
import Link from 'next/link';
import { LotusIcon } from '@/components/MandalaBackground';
import { ArrowLeft, UserX, Sparkles } from 'lucide-react';

export function StudentCardView({ token }: { token: string }) {
  const { getStudentByToken, config, isLoaded } = useLoyal();

  const student = getStudentByToken(token);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <LotusIcon className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-xs text-purple-700 mt-3 font-medium">Cargando pase de clases...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-purple-100 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-purple-950">Tarjeta no encontrada</h2>
          <p className="text-xs text-purple-700 mt-2 mb-6">
            El código <code className="bg-purple-50 px-2 py-0.5 rounded text-purple-900 font-mono">{token}</code> no corresponde a ningún alumno registrado.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 rounded-2xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all"
            >
              Crear una Nueva Tarjeta
            </Link>
            <Link
              href="/card/camila-restrepo-yoga"
              className="py-3 rounded-2xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-all"
            >
              Ver Tarjeta Demo de Camila
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Top Breadcrumb */}
      <div className="max-w-md mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio Estudio</span>
        </Link>
        <span className="text-[11px] font-medium text-purple-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          Pase Activo
        </span>
      </div>

      <LoyaltyCard student={student} config={config} />
    </div>
  );
}
