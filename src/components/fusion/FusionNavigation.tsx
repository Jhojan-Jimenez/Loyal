'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Menu, X, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface FusionNavigationProps {
  onOpenDemo: () => void;
}

export function FusionNavigation({ onOpenDemo }: FusionNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D5]/80 transition-all font-sans">
      <div className="max-w-[1440px] mx-auto h-full px-6 sm:px-12 lg:px-20 flex items-center justify-between">
        {/* Left: Brand Symbol & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Artisanal Olive Seal Stamp */}
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

        {/* Center: Discreet navigation links (Airbnb stage spacing with warm stone tones) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#57534E]">
          <a
            href="#experiencia"
            className="hover:text-[#1C1917] transition-colors py-2"
          >
            Pase Digital
          </a>
          <a
            href="#beneficios"
            className="hover:text-[#1C1917] transition-colors py-2"
          >
            Cómo funciona
          </a>
          <a
            href="#historias"
            className="hover:text-[#1C1917] transition-colors py-2"
          >
            Comercios
          </a>
          <a
            href="#precios"
            className="hover:text-[#1C1917] transition-colors py-2"
          >
            Precios
          </a>
          <a
            href="#preguntas"
            className="hover:text-[#1C1917] transition-colors py-2"
          >
            Preguntas
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/scanner"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#1C1917] transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#5B6F00]" />
            <span>Escáner Mostrador</span>
          </Link>

          <Link
            href="/admin"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#F3EFE6] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B6F00]" />
            <span>Admin</span>
          </Link>

          {/* Primary Action Button (Granola Olive Capsule) */}
          <button
            type="button"
            onClick={onOpenDemo}
            className="h-11 sm:h-12 px-6 sm:px-7 rounded-full text-white text-[14px] sm:text-[15px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:shadow-[0_6px_20px_rgba(91,111,0,0.35)] hover:bg-[#4D5E00]"
            style={{
              background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
            }}
          >
            <span>Crear Tarjeta Demo</span>
          </button>

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
            <a
              href="#experiencia"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#5B6F00]"
            >
              Pase Digital
            </a>
            <a
              href="#beneficios"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#5B6F00]"
            >
              Cómo funciona
            </a>
            <a
              href="#historias"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#5B6F00]"
            >
              Comercios
            </a>
            <a
              href="#precios"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#5B6F00]"
            >
              Precios
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#5B6F00]"
            >
              Preguntas
            </a>
          </nav>

          <div className="pt-4 border-t border-[#EAE4D5] flex flex-col gap-2.5">
            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F1E8] text-[#1C1917] text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Abrir Escáner de Mostrador</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C]" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F1E8] text-[#1C1917] text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#5B6F00]" />
                <span>Panel Admin Comercio</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C]" />
            </Link>

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
          </div>
        </div>
      )}
    </header>
  );
}
