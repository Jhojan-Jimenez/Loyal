'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Menu, X, ArrowDownRight, Sparkles } from 'lucide-react';

interface GranolaNavProps {
  onOpenDemo: () => void;
}

export function GranolaNav({ onOpenDemo }: GranolaNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Producto', href: '#producto' },
    { label: 'Cómo Funciona', href: '#como-funciona' },
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Planes', href: '#planes' },
    { label: 'Preguntas', href: '#faq' },
  ];

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto w-full max-w-[1120px] h-14 px-3 sm:px-4 bg-white/80 backdrop-blur-md rounded-full border border-[#D5D5D2]/80 flex items-center justify-between transition-all duration-300 shadow-[0px_1px_2px_rgba(0,0,0,0.03),0px_4px_16px_rgba(41,41,41,0.05)]"
        aria-label="Navegación principal"
      >
        {/* Left: Brand Identity */}
        <Link
          href="/style/granola"
          className="flex items-center gap-2 pl-2 sm:pl-3 group focus:outline-hidden"
        >
          {/* Artisanal stamp mark icon */}
          <div className="w-7 h-7 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shadow-xs group-hover:bg-[#4D5E00] transition-colors">
            <span className="font-serif text-xs font-normal italic">L</span>
          </div>
          <span className="font-serif text-xl sm:text-2xl font-normal text-[#292929] tracking-[-0.02em] group-hover:text-[#0E0F0C] transition-colors">
            Loyal
          </span>
          <span className="hidden sm:inline-block text-[11px] font-sans font-normal text-[#72726E] tracking-wider uppercase ml-1 px-1.5 py-0.5 rounded-full bg-[#F7F7F2] border border-[#D5D5D2]/60">
            Edición Papel
          </span>
        </Link>

        {/* Center: Quiet Editorial Navigation */}
        <div className="hidden md:flex items-center gap-7 text-[14px] font-sans font-normal text-[#72726E]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#292929] hover:bg-[#F7F7F2] px-2.5 py-1 rounded-full transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Scanner Outline Link */}
          <Link
            href="/style/granola/scanner"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-sans font-medium text-[#292929] border border-[#D5D5D2] hover:border-[#292929] hover:bg-[#F7F7F2] transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-[#5B6F00]" />
            <span>Escáner</span>
          </Link>

          {/* Olive Action Button */}
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 h-9 px-4 sm:px-5 rounded-full text-xs font-sans font-medium bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 opacity-90" />
            <span>Crear Tarjeta Demo</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-[#292929] hover:bg-[#F7F7F2] transition-colors"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 bg-[#F7F7F2] border border-[#D5D5D2] rounded-2xl p-5 shadow-xl md:hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col gap-2 font-sans text-sm text-[#292929]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-1 border-t border-[#D5D5D2] flex flex-col gap-2">
              <Link
                href="/scanner"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#D5D5D2] text-xs font-medium text-[#292929]"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#5B6F00]" />
                  <span>Escáner de Mostrador</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-[#72726E]" />
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDemo();
                }}
                className="w-full py-2.5 rounded-full bg-[#5B6F00] text-[#FCFCF8] text-xs font-medium text-center"
              >
                Crear Tarjeta Demo Gratis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
