import React, { Suspense } from 'react';
import { AirbnbStudentCardView } from '@/components/airbnb/AirbnbStudentCardView';
import { INITIAL_STUDENTS } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export async function generateStaticParams() {
  return INITIAL_STUDENTS.map((s) => ({
    token: s.token,
  }));
}

export default async function AirbnbStudentCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="font-sans min-h-screen bg-[#F7F7F7] text-[#222222] selection:bg-[#FFF8F8] selection:text-[#E61E4D]">
      <div className="py-8 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
              <Loader2 className="w-8 h-8 text-[#E61E4D] animate-spin" />
              <p className="text-xs text-[#717171] mt-3 font-semibold">Cargando pase Airbnb...</p>
            </div>
          }
        >
          <AirbnbStudentCardView token={token} />
        </Suspense>
      </div>
    </div>
  );
}
