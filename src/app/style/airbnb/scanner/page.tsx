'use client';

import React from 'react';
import { AirbnbScannerTerminal } from '@/components/airbnb/AirbnbScannerTerminal';

export default function AirbnbScannerPage() {
  return (
    <div className="font-sans min-h-screen bg-[#F7F7F7] text-[#222222] selection:bg-[#FFF8F8] selection:text-[#E61E4D]">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <AirbnbScannerTerminal />
      </div>
    </div>
  );
}
