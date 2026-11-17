'use client';

import React, { useEffect, useState } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.session) {
          if (data.session.isPlatformSuperAdmin) {
            window.location.href = '/superadmin';
            return;
          }
          if (data.session.activeTenant?.slug) {
            window.location.href = `/${data.session.activeTenant.slug}/admin`;
            return;
          }
        }
      } catch (e) {
        // Fallback to local admin
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
        <p className="text-xs text-[#78716C] mt-3 font-semibold">Redirigiendo a tu espacio de trabajo...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <AdminDashboard />
    </div>
  );
}
