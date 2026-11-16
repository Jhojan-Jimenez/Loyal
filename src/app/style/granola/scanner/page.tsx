'use client';

import React from 'react';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import { GranolaScannerTerminal } from '@/components/granola/GranolaScannerTerminal';

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

export default function GranolaScannerPage() {
  return (
    <div
      className={`${libreBaskerville.variable} ${dmSans.variable} font-sans min-h-screen bg-[#F7F7F2] text-[#292929] selection:bg-[#E5EACD] selection:text-[#5B6F00]`}
    >
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <GranolaScannerTerminal />
      </div>
    </div>
  );
}
