import React, { Suspense } from 'react';
import { StudentCardView } from './StudentCardView';
import { LotusIcon } from '@/components/MandalaBackground';
import { INITIAL_STUDENTS } from '@/lib/store';

export async function generateStaticParams() {
  return INITIAL_STUDENTS.map((s) => ({
    token: s.token,
  }));
}

export default async function StudentCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
          <LotusIcon className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-xs text-purple-700 mt-3 font-medium">Cargando pase de clases...</p>
        </div>
      }
    >
      <StudentCardView token={token} />
    </Suspense>
  );
}
