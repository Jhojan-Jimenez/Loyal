import React, { Suspense } from 'react';
import { FusionStudentCardView } from '@/components/fusion/FusionStudentCardView';
import { INITIAL_STUDENTS } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export async function generateStaticParams() {
  return INITIAL_STUDENTS.map((s) => ({
    token: s.token,
  }));
}

export default async function FusionStudentCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="font-sans min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white">
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
            <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando pase editorial...</p>
          </div>
        }
      >
        <FusionStudentCardView token={token} />
      </Suspense>
    </div>
  );
}
