'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LotusIcon } from './MandalaBackground';
import { QrCode, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Inicio', icon: Sparkles },
    { href: '/card/camila-restrepo-yoga', label: 'Mi Tarjeta', icon: LotusIcon },
    { href: '/scanner', label: 'Escanear (Recepción)', icon: QrCode },
    { href: '/schedule', label: 'Clases & Horario', icon: Calendar },
    { href: '/admin', label: 'Panel Dueño', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <LotusIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-purple-950 tracking-tight text-base leading-tight">
              Samyama Yoga
            </div>
            <div className="text-[11px] font-medium text-purple-500 tracking-wider uppercase">
              Loyalty Pass PWA
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 bg-purple-50/70 p-1 rounded-2xl border border-purple-100/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href) ||
                  (item.href.startsWith('/card') && pathname.startsWith('/card'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xs'
                    : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Badge */}
        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-600/20 active:scale-95 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Caja / Recepción</span>
            <span className="sm:hidden">Escanear</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-purple-100/50 bg-white/95 px-2 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href) ||
                (item.href.startsWith('/card') && pathname.startsWith('/card'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-purple-700 font-semibold' : 'text-purple-900/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'bg-transparent text-purple-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[70px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
