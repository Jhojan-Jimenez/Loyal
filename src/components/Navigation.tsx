'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  QrCode,
  ShieldCheck,
  Menu,
  X,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pages that render their own complete, contextual navigation
  if (
    pathname === '/' ||
    pathname === '/scanner' ||
    pathname?.startsWith('/card/') ||
    pathname?.startsWith('/style/')
  ) {
    return null;
  }

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Escáner', href: '/scanner' },
    { label: 'Admin', href: '/admin' },
    { label: 'SuperAdmin', href: '/superadmin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D5]/80 transition-all font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#5B6F00] text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-[0_2px_8px_rgba(91,111,0,0.25)]">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="4" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-serif font-normal tracking-tight text-[#1C1917]">
              loyal
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6F00] font-bold px-1.5 py-0.5 rounded-md bg-[#F1F5DC] border border-[#D9E2B3] hidden sm:inline">
              saas
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#57534E]">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`hover:text-[#1C1917] transition-colors py-1 ${
                pathname === item.href ? 'text-[#1C1917] font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#1C1917] transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-[#5B6F00]" />
            <span>Escáner</span>
          </Link>

          <Link
            href="/card/camila-restrepo-yoga"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#EAE4D5] text-xs font-semibold text-[#1C1917] transition-all active:scale-95 shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#57534E]" />
            <span>Ver Tarjeta Demo</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-xs font-semibold transition-all active:scale-95"
            title="Panel de Comercio"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B6F00]" />
            <span>Admin</span>
          </Link>

          <Link
            href="/superadmin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1917] text-[#B2C248] border border-[#292524] text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xs"
            title="Consola Maestra del SaaS"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B2C248] animate-pulse" />
            <span>SuperAdmin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/scanner"
            className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917]"
            title="Escáner"
          >
            <QrCode className="w-4 h-4 text-[#5B6F00]" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE4D5] bg-[#FDFBF7] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-[#57534E] hover:text-[#1C1917] py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#EAE4D5] flex flex-col gap-2.5">
            <Link
              href="/card/camila-restrepo-yoga"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF9] border border-[#EAE4D5] font-semibold text-xs text-[#1C1917]"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#57534E]" />
                <span>Ver Tarjeta Demo</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C]" />
            </Link>

            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F1E8] border border-[#EAE4D5] font-semibold text-xs text-[#1C1917]"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Recepción (Escáner QR)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C]" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F1E8] border border-[#EAE4D5] font-semibold text-xs text-[#1C1917]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
                <span>Panel Admin Comercio</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C]" />
            </Link>

            <Link
              href="/superadmin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1917] border border-[#292524] text-[#B2C248] font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B2C248] animate-pulse" />
                <span>Consola SuperAdmin (SaaS)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#B2C248]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
