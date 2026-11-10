'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LotusIcon } from './MandalaBackground';
import {
  QrCode,
  ShieldCheck,
  Calendar,
  Sparkles,
  Menu,
  X,
  CreditCard,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  // Editorial reference navigation links (exact match to style-reference.png)
  const editorialNav = [
    { label: 'Home', href: '/' },
    { label: 'About us', href: isHome ? '#about' : '/#about' },
    { label: 'Portfolio', href: isHome ? '#portfolio' : '/#portfolio' },
    { label: 'Info', href: isHome ? '#info' : '/#info' },
    { label: 'Contact us', href: isHome ? '#contact' : '/#contact' },
  ];

  // Studio management & digital pass links
  const functionalNav = [
    { label: 'Mi Pase', href: '/card/camila-restrepo-yoga', icon: CreditCard },
    { label: 'Horarios', href: '/schedule', icon: Calendar },
    { label: 'Recepción', href: '/scanner', icon: QrCode, badge: 'Caja' },
    { label: 'Admin', href: '/admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#F5E8FF]/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Logo exact to reference */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-full bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#4A154B] group-hover:scale-105 transition-transform shadow-xs">
              <LotusIcon className="w-5 h-5 text-[#4A154B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] text-[#4A154B] uppercase leading-none">
                WEBSITE
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C84B7C] uppercase mt-0.5">
                Samyama Yoga Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav: Editorial Links (Exact 5 items from reference) */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide">
          {editorialNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors py-1 ${
                item.href === '/' && isHome
                  ? 'text-[#4A154B] font-bold border-b-2 border-[#4A154B]'
                  : 'text-[#6B5B6E] hover:text-[#4A154B]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right: Functional Actions (Pases, Recepción, Admin) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/card/camila-restrepo-yoga"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A154B] hover:bg-[#FAF5FF] border border-[#F3E8FF] transition-all flex items-center gap-1.5"
            title="Ver tarjeta de alumno de prueba"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#C84B7C]" />
            <span>Mi Pase</span>
          </Link>

          <Link
            href="/scanner"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4A154B] text-white hover:bg-[#3B113C] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            title="Escanear pase en recepción"
          >
            <QrCode className="w-3.5 h-3.5 text-pink-300" />
            <span>Recepción</span>
          </Link>

          <Link
            href="/admin"
            className="p-2 rounded-full text-[#6B5B6E] hover:text-[#4A154B] hover:bg-[#FAF5FF] transition-all"
            title="Panel de administración"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/scanner"
            className="p-2 rounded-full bg-[#FAF5FF] text-[#4A154B] border border-[#F3E8FF]"
            title="Escanear QR"
          >
            <QrCode className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#4A154B] hover:bg-[#FAF5FF] focus:outline-hidden"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F5E8FF] bg-white px-6 py-6 space-y-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Editorial links */}
          <div className="space-y-3 border-b border-[#F5E8FF] pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#C84B7C] font-bold">
              Navegación
            </span>
            <div className="flex flex-col space-y-2 pt-1">
              {editorialNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-[#4A154B] hover:text-[#C84B7C] py-1 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#C84B7C]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Functional Studio Apps */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C84B7C] font-bold">
              Pase & Gestión del Estudio
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {functionalNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex flex-col gap-1 text-left hover:bg-[#F5E8FF]/60 transition-all"
                  >
                    <Icon className="w-4 h-4 text-[#4A154B]" />
                    <span className="text-xs font-bold text-[#4A154B] mt-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold text-[#C84B7C]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
