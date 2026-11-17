'use client';

import React from 'react';
import { FusionScannerTerminal } from '@/components/fusion/FusionScannerTerminal';

export default function FusionScannerPage() {
  return (
    <div className="font-sans min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white">
      <FusionScannerTerminal />
    </div>
  );
}
