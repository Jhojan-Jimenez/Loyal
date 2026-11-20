'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Store,
  QrCode,
  UserPlus,
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';

export function DevRoleSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()).catch(() => null),
      fetch('/api/db').then((r) => r.json()).catch(() => null),
    ]).then(([authData, dbData]) => {
      const superAdmin = Boolean(
        authData?.authenticated && authData?.session?.isPlatformSuperAdmin
      );
      setIsSuperAdmin(superAdmin);
      if (!superAdmin) return;

      const sessionSlug = authData?.session?.activeTenant?.slug;
      const firstTenantSlug =
        Array.isArray(dbData?.tenants) && dbData.tenants.length > 0
          ? dbData.tenants[0].slug
          : null;
      setTenantSlug(sessionSlug || firstTenantSlug || null);
    });
  }, [pathname]);

  if (!isSuperAdmin) return null;

  const handleSwitch = async (
    role: 'public' | 'superadmin' | 'admin' | 'scanner' | 'join' | 'onboard'
  ) => {
    setSwitching(role);
    try {
      const res = await fetch('/api/dev/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        setOpen(false);
        window.location.href = data.redirectUrl;
      }
    } catch {
      setSwitching(null);
    }
  };

  const roles = [
    {
      id: 'public' as const,
      label: 'Landing Pública',
      icon: Globe,
      active: pathname === '/',
    },
    {
      id: 'superadmin' as const,
      label: 'SuperAdmin SaaS',
      icon: ShieldCheck,
      active: pathname.startsWith('/superadmin'),
    },
    {
      id: 'admin' as const,
      label: tenantSlug ? `Admin (${tenantSlug})` : 'Admin Comercio',
      icon: Store,
      active: pathname.endsWith('/admin'),
    },
    {
      id: 'scanner' as const,
      label: tenantSlug ? `Escáner (${tenantSlug})` : 'Escáner Cajero',
      icon: QrCode,
      active: pathname.endsWith('/scanner'),
    },
    {
      id: 'join' as const,
      label: tenantSlug ? `Registro QR (${tenantSlug})` : 'Registro QR Cliente',
      icon: UserPlus,
      active: pathname.endsWith('/join'),
    },
    {
      id: 'onboard' as const,
      label: 'Magic Link (/onboard)',
      icon: Sparkles,
      active: pathname.startsWith('/onboard'),
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      {open && (
        <div className="mb-2 w-64 bg-[#1C1917] text-white rounded-2xl p-2 shadow-2xl border border-[#3E3832] space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-[#292524] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B2C248]">
              Cambiar UI de Rol (Auto-Auth)
            </span>
          </div>

          {roles.map((r) => {
            const Icon = r.icon;
            const isLoading = switching === r.id;
            return (
              <button
                key={r.id}
                type="button"
                disabled={Boolean(switching)}
                onClick={() => handleSwitch(r.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left disabled:opacity-60 ${
                  r.active
                    ? 'bg-[#5B6F00] text-white font-bold'
                    : 'text-[#E7E5E4] hover:bg-[#292524]'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B2C248] shrink-0" />
                ) : (
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      r.active ? 'text-[#E2F099]' : 'text-[#B2C248]'
                    }`}
                  />
                )}
                <span className="truncate">{r.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow-xl border border-[#3E3832] transition-all active:scale-95 cursor-pointer"
      >
        <Layers className="w-3.5 h-3.5 text-[#B2C248]" />
        <span>Roles UI</span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#A8A29E]" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-[#A8A29E]" />
        )}
      </button>
    </div>
  );
}
