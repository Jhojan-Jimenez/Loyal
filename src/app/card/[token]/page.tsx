import React, { Suspense } from 'react';
import { StudentCardView } from './StudentCardView';
import { Loader2 } from 'lucide-react';
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
          <Loader2 className="w-8 h-8 text-neutral-900 animate-spin" />
          <p className="text-xs text-neutral-600 mt-3 font-medium">Cargando pase digital...</p>
        </div>
      }
    >
      <StudentCardView token={token} />
    </Suspense>
  );
}
