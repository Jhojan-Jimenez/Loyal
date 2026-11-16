import React, { Suspense } from 'react';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import { GranolaStudentCardView } from '@/components/granola/GranolaStudentCardView';
import { INITIAL_STUDENTS } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-granola-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export async function generateStaticParams() {
  return INITIAL_STUDENTS.map((s) => ({
    token: s.token,
  }));
}

export default async function GranolaStudentCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div
      className={`${libreBaskerville.variable} ${dmSans.variable} font-sans min-h-screen bg-[#F7F7F2] text-[#292929] selection:bg-[#E5EACD] selection:text-[#5B6F00]`}
    >
      <div className="py-8 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
              <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
              <p className="text-xs text-[#72726E] mt-3 font-medium">Cargando pase Granola...</p>
            </div>
          }
        >
          <GranolaStudentCardView token={token} />
        </Suspense>
      </div>
    </div>
  );
}
