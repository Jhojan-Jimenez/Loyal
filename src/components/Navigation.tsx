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
  Sparkles,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Producto', href: isHome ? '#producto' : '/#producto' },
    { label: 'Cómo Funciona', href: isHome ? '#como-funciona' : '/#como-funciona' },
    { label: 'Planes', href: isHome ? '#planes' : '/#planes' },
    { label: 'Contacto', href: isHome ? '#contacto' : '/#contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        {/* Left: Sober Minimalist Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Geometric Black Monogram / Loyalty Mark */}
          <div className="w-9 h-9 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="4" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950">
              Loyal
            </span>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest ml-2 px-1.5 py-0.5 rounded-sm bg-neutral-100 border border-neutral-200">
              SaaS
            </span>
          </div>
        </Link>

        {/* Center Nav: Editorial Sober Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-neutral-600">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-neutral-950 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: High-contrast B2B Button Dock */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-neutral-700" />
            <span>Escáner</span>
          </Link>

          <Link
            href="/card/camila-restrepo-yoga"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-semibold text-neutral-900 transition-all active:scale-95 shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-neutral-600" />
            <span>Ver Tarjeta Demo</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/scanner"
            className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800"
            title="Escáner"
          >
            <QrCode className="w-4 h-4 text-neutral-900" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-neutral-700 hover:text-neutral-950 py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2.5">
            <Link
              href="/card/camila-restrepo-yoga"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold text-xs text-neutral-900"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-600" />
                <span>Ver Tarjeta Demo</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 border border-neutral-300 font-semibold text-xs text-neutral-900"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-neutral-800" />
                <span>Recepción (Escáner QR)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 text-white font-semibold text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-300" />
                <span>Panel de Administración</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
