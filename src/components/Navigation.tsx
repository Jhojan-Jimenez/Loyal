'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  QrCode,
  ShieldCheck,
  Calendar,
  Sparkles,
  Menu,
  X,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  // Navigation matching reference screenshot: Home | Events | About us | Contact us
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/schedule' },
    { label: 'About us', href: isHome ? '#about' : '/#about' },
    { label: 'Contact us', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF5F5]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        {/* Left: Brand Logo exact to reference */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* 8-pointed golden star icon from reference */}
          <svg className="w-7 h-7 text-amber-500 transition-transform group-hover:rotate-45 duration-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
          <div className="flex items-baseline">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
              Samyama
            </span>
            <span className="text-xl sm:text-2xl font-light text-fuchsia-600 ml-1">
              Yoga
            </span>
          </div>
        </Link>

        {/* Center/Right Nav: Editorial Minimalist Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-neutral-800">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-fuchsia-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: SwiftPieces iOS-style Pill Dock */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-neutral-200/80 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-white hover:border-neutral-300 transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-fuchsia-600" />
            <span>Escáner</span>
          </Link>

          <Link
            href="/card/camila-restrepo-yoga"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-100/80 hover:bg-purple-100 text-xs font-semibold text-purple-900 transition-all active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-700" />
            <span>Ver Tarjeta</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/scanner"
            className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-800"
            title="Escáner"
          >
            <QrCode className="w-4 h-4 text-fuchsia-600" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-800 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100/60 bg-[#FFF5F5] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-neutral-800 hover:text-fuchsia-600 py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-purple-100 flex flex-col gap-2.5">
            <Link
              href="/card/camila-restrepo-yoga"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-purple-100 font-semibold text-xs text-purple-950"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Mi Pase Digital</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </Link>

            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-purple-600 text-white font-semibold text-xs"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                <span>Recepción (Escáner QR)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-200" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 text-white font-semibold text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
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
