import React, { Suspense } from 'react';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import { FusionStudentCardView } from '@/components/fusion/FusionStudentCardView';
import { INITIAL_STUDENTS } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-fusion-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-fusion-sans',
  display: 'swap',
});

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
    <div
      style={{
        ['--font-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-sans' as any]: dmSans.style.fontFamily,
        ['--font-granola-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-granola-sans' as any]: dmSans.style.fontFamily,
        ['--font-fusion-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-fusion-sans' as any]: dmSans.style.fontFamily,
      }}
      className={`style-fusion ${libreBaskerville.variable} ${dmSans.variable} font-sans min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white antialiased`}
    >
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
