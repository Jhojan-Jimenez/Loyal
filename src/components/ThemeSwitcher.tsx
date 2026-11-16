'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette, Check, Sparkles, ChevronRight } from 'lucide-react';

export function ThemeSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isGranola = pathname?.startsWith('/style/granola');
  const isAirbnb = pathname?.startsWith('/style/airbnb');
  const isBase = !isGranola && !isAirbnb;

  const currentVersion = isGranola
    ? { name: '🌾 Granola', color: '#5B6F00', bg: 'bg-[#5B6F00]' }
    : isAirbnb
    ? { name: '🌸 Airbnb', color: '#E61E4D', bg: 'bg-[#E61E4D]' }
    : { name: '⬛ Carbón Grafito', color: '#09090B', bg: 'bg-neutral-950' };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Floating Widget Flyout Menu */}
      {isOpen && (
        <div className="mb-3 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xl w-80 animate-in slide-in-from-bottom-2 duration-200 text-[#222222]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-neutral-800" />
              <span className="text-xs font-bold text-neutral-900">Versiones de Diseño</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              3 Diseños Finales
            </span>
          </div>

          {/* 3 Main Final Version Cards */}
          <div className="space-y-2 mb-3">
            {/* 1. Base: Carbón Grafito */}
            <div
              className={`rounded-2xl border p-2.5 transition-all ${
                isBase
                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                  : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Link
                href="/"
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-neutral-900 border border-white/40 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold leading-tight">Base: Carbón Grafito</span>
                    <span
                      className={`text-[10px] ${
                        isBase ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Minimalista, Titanio Mate & Vercel Stark
                    </span>
                  </div>
                </div>
                {isBase && <Check className="w-4 h-4 text-white shrink-0" />}
              </Link>

              {/* Sub-pages for Base */}
              {isBase && (
                <div className="mt-2 pt-2 border-t border-neutral-800/80 grid grid-cols-3 gap-1">
                  <Link
                    href="/"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/'
                        ? 'bg-neutral-800 text-white border-neutral-700 font-bold'
                        : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                    }`}
                  >
                    Portada
                  </Link>
                  <Link
                    href="/scanner"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/scanner'
                        ? 'bg-neutral-800 text-white border-neutral-700 font-bold'
                        : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                    }`}
                  >
                    Escáner
                  </Link>
                  <Link
                    href="/card/camila-restrepo-yoga"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname?.startsWith('/card')
                        ? 'bg-neutral-800 text-white border-neutral-700 font-bold'
                        : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                    }`}
                  >
                    Tarjeta
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Granola */}
            <div
              className={`rounded-2xl border p-2.5 transition-all ${
                isGranola
                  ? 'bg-[#5B6F00] text-white border-[#5B6F00] shadow-md'
                  : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Link
                href="/style/granola"
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#B2C248] shrink-0" />
                  <div>
                    <span className="block text-xs font-bold leading-tight">🌾 Granola</span>
                    <span
                      className={`text-[10px] ${
                        isGranola ? 'text-[#E5EACD]' : 'text-neutral-500'
                      }`}
                    >
                      Papel Cálido, Serif & Verde Oliva
                    </span>
                  </div>
                </div>
                {isGranola && <Check className="w-4 h-4 text-white shrink-0" />}
              </Link>

              {/* Sub-pages for Granola */}
              {isGranola && (
                <div className="mt-2 pt-2 border-t border-white/20 grid grid-cols-3 gap-1">
                  <Link
                    href="/style/granola"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/style/granola'
                        ? 'bg-white text-[#5B6F00] border-white font-bold'
                        : 'bg-[#4D5E00]/60 text-white border-[#4D5E00] hover:bg-[#4D5E00]'
                    }`}
                  >
                    Portada
                  </Link>
                  <Link
                    href="/style/granola/scanner"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/style/granola/scanner'
                        ? 'bg-white text-[#5B6F00] border-white font-bold'
                        : 'bg-[#4D5E00]/60 text-white border-[#4D5E00] hover:bg-[#4D5E00]'
                    }`}
                  >
                    Escáner
                  </Link>
                  <Link
                    href="/style/granola/card/camila-restrepo-yoga"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname?.includes('/style/granola/card')
                        ? 'bg-white text-[#5B6F00] border-white font-bold'
                        : 'bg-[#4D5E00]/60 text-white border-[#4D5E00] hover:bg-[#4D5E00]'
                    }`}
                  >
                    Tarjeta
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Airbnb */}
            <div
              className={`rounded-2xl border p-2.5 transition-all ${
                isAirbnb
                  ? 'bg-[#E61E4D] text-white border-[#E61E4D] shadow-md'
                  : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Link
                href="/style/airbnb"
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-white border border-[#E61E4D] shrink-0" />
                  <div>
                    <span className="block text-xs font-bold leading-tight">🌸 Airbnb</span>
                    <span
                      className={`text-[10px] ${
                        isAirbnb ? 'text-white/80' : 'text-neutral-500'
                      }`}
                    >
                      Calidez Humana, Berry & Perla
                    </span>
                  </div>
                </div>
                {isAirbnb && <Check className="w-4 h-4 text-white shrink-0" />}
              </Link>

              {/* Sub-pages for Airbnb */}
              {isAirbnb && (
                <div className="mt-2 pt-2 border-t border-white/20 grid grid-cols-3 gap-1">
                  <Link
                    href="/style/airbnb"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/style/airbnb'
                        ? 'bg-white text-[#E61E4D] border-white font-bold'
                        : 'bg-[#D70466]/60 text-white border-[#D70466] hover:bg-[#D70466]'
                    }`}
                  >
                    Portada
                  </Link>
                  <Link
                    href="/style/airbnb/scanner"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname === '/style/airbnb/scanner'
                        ? 'bg-white text-[#E61E4D] border-white font-bold'
                        : 'bg-[#D70466]/60 text-white border-[#D70466] hover:bg-[#D70466]'
                    }`}
                  >
                    Escáner
                  </Link>
                  <Link
                    href="/style/airbnb/card/camila-restrepo-yoga"
                    className={`py-1 rounded-lg text-center text-[10px] font-medium border ${
                      pathname?.includes('/style/airbnb/card')
                        ? 'bg-white text-[#E61E4D] border-white font-bold'
                        : 'bg-[#D70466]/60 text-white border-[#D70466] hover:bg-[#D70466]'
                    }`}
                  >
                    Tarjeta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-950/95 hover:bg-black text-white text-xs font-semibold shadow-xl border border-neutral-800 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        title="Cambiar versión de diseño"
      >
        <span
          className="w-3 h-3 rounded-full border border-white/20 animate-pulse"
          style={{ backgroundColor: currentVersion.color }}
        />
        <span className="text-[11px] font-bold">
          {currentVersion.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-neutral-400" />
      </button>
    </div>
  );
}
