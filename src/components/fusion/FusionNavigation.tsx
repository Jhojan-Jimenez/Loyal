'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QrCode, Menu, X, ShieldCheck, ArrowRight, Sparkles, LogOut, Lock } from 'lucide-react';

export function FusionNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{
    isPlatformSuperAdmin?: boolean;
    role?: string;
    activeTenant?: { slug: string; name: string };
    name?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.session) {
          setSession(d.session);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    window.location.reload();
  };

  const isSuperAdmin = session?.isPlatformSuperAdmin || session?.role === 'superadmin';
  const tenantSlug = session?.activeTenant?.slug;
  const adminHref = tenantSlug ? `/${tenantSlug}/admin` : '/admin';

  const navItems = [
    { id: 'experiencia', label: 'Pase Digital' },
    { id: 'beneficios', label: 'Cómo funciona' },
    { id: 'historias', label: 'Comercios' },
    { id: 'precios', label: 'Precios' },
    { id: 'preguntas', label: 'Preguntas' },
  ];

  const handleSectionNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 sm:h-20 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D5]/80 transition-all font-sans">
      <div className="max-w-[1440px] mx-auto h-full px-5 sm:px-12 lg:px-20 flex items-center justify-between">
        {/* Left: Brand Symbol & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Artisanal Loyal Brand Emblem */}
          <img
            src="/logo-loyal.png"
            alt="Loyal"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover transition-transform duration-200 group-hover:scale-105 shadow-[0_2px_8px_rgba(91,111,0,0.2)]"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] sm:text-[24px] font-serif font-normal tracking-tight text-[#1C1917]">
              Loyal
            </span>
          </div>
        </Link>

        {/* Center: Discreet navigation links (Airbnb stage spacing with warm stone tones) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#57534E]">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleSectionNavClick(e, item.id)}
              className="hover:text-[#1C1917] transition-colors py-2 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions (Role-Aware) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {session ? (
            // LOGGED IN USER: Show only their authorized portal button + Logout
            <>
              {isSuperAdmin && (
                <Link
                  href="/superadmin"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1C1917] text-[#B2C248] border border-[#292524] text-xs font-bold shadow-xs hover:bg-black transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B2C248] animate-pulse" />
                  <span>Consola SuperAdmin</span>
                </Link>
              )}

              {!isSuperAdmin && (
                <Link
                  href={adminHref}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#1C1917] transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5B6F00]" />
                  <span>{session.activeTenant?.name ? `Panel: ${session.activeTenant.name}` : 'Panel Admin'}</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#FAF7F2] border border-[#EAE4D5] text-xs font-semibold text-[#78716C] hover:text-[#C2410C] transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </>
          ) : (
            // PUBLIC VISITOR / CLIENT: Clean "Acceso" link to /login
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#78716C]" />
              <span>Acceso Comercio</span>
            </Link>
          )}

          {/* Primary Action Button */}
          <a
            href="#precios"
            onClick={(e) => handleSectionNavClick(e, 'precios')}
            className="h-11 sm:h-12 px-6 sm:px-7 rounded-full text-white text-[14px] sm:text-[15px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:shadow-[0_6px_20px_rgba(91,111,0,0.35)] hover:bg-[#4D5E00]"
            style={{
              background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
            }}
          >
            <span>Empezar ahora</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full hover:bg-[#F3EFE6] text-[#1C1917]"
            aria-label="Menú móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-[#EAE4D5] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-[15px] font-medium text-[#1C1917]">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSectionNavClick(e, item.id)}
                className="py-1 hover:text-[#5B6F00] cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#EAE4D5] flex flex-col gap-2.5">
            {session ? (
              <>
                {isSuperAdmin && (
                  <Link
                    href="/superadmin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1C1917] text-[#B2C248] text-sm font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#B2C248] animate-pulse" />
                      <span>Consola SuperAdmin (SaaS)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B2C248]" />
                  </Link>
                )}

                {!isSuperAdmin && (
                  <Link
                    href={adminHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F1E8] text-[#1C1917] text-sm font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
                      <span>{session.activeTenant?.name ? `Panel: ${session.activeTenant.name}` : 'Panel Admin Comercio'}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#78716C]" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F2] border border-[#F5C7C0] text-[#C2410C] text-sm font-semibold cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4 text-[#C2410C]" />
                    <span>Cerrar Sesión</span>
                  </div>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F1E8] text-[#1C1917] text-sm font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#5B6F00]" />
                  <span>Acceso Comercio / Admin</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#78716C]" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
