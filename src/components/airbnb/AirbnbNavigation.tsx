'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Menu, X, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AirbnbNavigationProps {
  onOpenDemo: () => void;
}

export function AirbnbNavigation({ onOpenDemo }: AirbnbNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-white/90 backdrop-blur-md border-b border-[#ffffff] transition-all">
      <div className="max-w-[1440px] mx-auto h-full px-6 sm:px-12 lg:px-20 flex items-center justify-between">
        {/* Left: Brand Symbol & Wordmark */}
        <Link href="/style/airbnb" className="flex items-center gap-2.5 group">
          {/* Airbnb-inspired Bélo Loyalty Stamp Mark */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="navBerry" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E61E4D" />
                  <stop offset="50%" stopColor="#E31C5F" />
                  <stop offset="100%" stopColor="#D70466" />
                </linearGradient>
              </defs>
              {/* Loop heart stamp geometry */}
              <path
                d="M16 2.5C11.3 2.5 7.5 6.3 7.5 11C7.5 16.5 13 23.5 16 29C19 23.5 24.5 16.5 24.5 11C24.5 6.3 20.7 2.5 16 2.5ZM16 15C13.8 15 12 13.2 12 11C12 8.8 13.8 7 16 7C18.2 7 20 8.8 20 11C20 13.2 18.2 15 16 15Z"
                fill="url(#navBerry)"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-semibold tracking-[-0.03em] text-[#222222]">
              loyal
            </span>
            <span className="text-[11px] font-medium text-[#6a6a6a] hidden sm:inline">
              pases
            </span>
          </div>
        </Link>

        {/* Center: Discreet navigation links (unobtrusive, keeping stage airy) */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#222222]">
          <a
            href="#experiencia"
            className="hover:text-[#717171] transition-colors py-2"
          >
            Pase Digital
          </a>
          <a
            href="#beneficios"
            className="hover:text-[#717171] transition-colors py-2"
          >
            Cómo funciona
          </a>
          <a
            href="#historias"
            className="hover:text-[#717171] transition-colors py-2"
          >
            Comercios
          </a>
          <a
            href="#precios"
            className="hover:text-[#717171] transition-colors py-2"
          >
            Precios
          </a>
          <a
            href="#preguntas"
            className="hover:text-[#717171] transition-colors py-2"
          >
            Preguntas
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/style/airbnb/scanner"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#f7f7f7] text-xs font-semibold text-[#222222] transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#222222]" />
            <span>Escáner Mostrador</span>
          </Link>

          {/* Primary Action Button (AirBnb Berry Gradient Capsule) */}
          <button
            type="button"
            onClick={onOpenDemo}
            className="h-12 px-6 sm:px-7 rounded-full text-white text-[15px] sm:text-[16px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            style={{
              background: 'linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
            }}
          >
            <span>Crear Tarjeta Demo</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full hover:bg-[#f7f7f7] text-[#222222]"
            aria-label="Menú móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ebebeb] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-[16px] font-medium text-[#222222]">
            <a
              href="#experiencia"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#e61e4d]"
            >
              Pase Digital
            </a>
            <a
              href="#beneficios"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#e61e4d]"
            >
              Cómo funciona
            </a>
            <a
              href="#historias"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#e61e4d]"
            >
              Comercios
            </a>
            <a
              href="#precios"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#e61e4d]"
            >
              Precios
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#e61e4d]"
            >
              Preguntas
            </a>
          </nav>

          <div className="pt-4 border-t border-[#ebebeb] flex flex-col gap-2.5">
            <Link
              href="/style/airbnb/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f7f7] text-[#222222] text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-[#222222]" />
                <span>Abrir Escáner de Mostrador</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6a6a6a]" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f7f7] text-[#222222] text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#222222]" />
                <span>Panel de Administración</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6a6a6a]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
