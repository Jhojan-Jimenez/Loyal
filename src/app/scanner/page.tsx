'use client';

import React from 'react';
import { ScannerTerminal } from '@/components/ScannerTerminal';

export default function ScannerPage() {
  return (
    <div className="py-8 px-4 bg-white min-h-screen text-neutral-900">
      <ScannerTerminal />
    </div>
  );
}
