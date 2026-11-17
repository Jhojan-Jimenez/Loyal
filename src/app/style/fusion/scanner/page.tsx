'use client';

import React from 'react';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import { FusionScannerTerminal } from '@/components/fusion/FusionScannerTerminal';

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

export default function FusionScannerPage() {
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
      <FusionScannerTerminal />
    </div>
  );
}
