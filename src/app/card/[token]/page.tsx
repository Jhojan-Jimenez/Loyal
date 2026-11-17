import React, { Suspense } from 'react';
import { FusionStudentCardView } from '@/components/fusion/FusionStudentCardView';
import { getStudentByToken, getDbData } from '@/lib/server-db';
import { DEFAULT_STUDIO_CONFIG } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const initialStudent = getStudentByToken(token);
  const initialConfig = initialStudent?.tenantSlug
    ? getDbData(initialStudent.tenantSlug).config
    : DEFAULT_STUDIO_CONFIG;

  return (
    <div className="font-sans min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white">
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
            <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando pase digital...</p>
          </div>
        }
      >
        <FusionStudentCardView
          token={token}
          initialStudent={initialStudent}
          initialConfig={initialConfig}
        />
      </Suspense>
    </div>
  );
}
