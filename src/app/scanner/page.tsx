'use client';

import React, { useEffect, useState } from 'react';
import { FusionScannerTerminal } from '@/components/fusion/FusionScannerTerminal';
import { Loader2 } from 'lucide-react';

export default function ScannerPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.session) {
          if (data.session.activeTenant?.slug) {
            window.location.href = `/${data.session.activeTenant.slug}/scanner`;
            return;
          }
        }
      } catch (e) {
        // Fallback
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
        <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando terminal de escaneo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white">
      <FusionScannerTerminal />
    </div>
  );
}
