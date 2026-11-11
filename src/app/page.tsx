'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoyal } from '@/context/LoyalContext';
import { LoyaltyCard } from '@/components/LoyaltyCard';
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  X,
  CreditCard,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';

// Geometric 8-pointed starburst matching reference artwork
function Starburst({
  size = 50,
  color = '#F59E0B',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      className={`select-none pointer-events-none ${className}`}
    >
      <polygon points="50,0 59,32 91,15 72,43 100,50 72,57 91,85 59,68 50,100 41,68 9,85 28,57 0,50 28,43 9,15 41,32" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { students, config, registerStudent } = useLoyal();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo student for the live preview card (Camila Restrepo)
  const demoStudent = students.find((s) => s.token === 'camila-restrepo-yoga') || students[0] || {
    id: 'std_demo',
    token: 'camila-restrepo-yoga',
    name: 'Camila Restrepo',
    phone: '+57 312 458 9012',
    registeredAt: new Date().toISOString(),
    stamps: 7,
    totalCompletedCycles: 1,
    totalVisits: 17,
    lastVisitAt: null,
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const newStudent = registerStudent(name, phone, email);
    setIsRegisterOpen(false);
    router.push(`/card/${newStudent.token}`);
  };

  return (
    <div className="bg-[#FFF5F5] text-neutral-900 flex flex-col selection:bg-purple-200 selection:text-purple-950">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (1:1 with user reference image - 100% Viewport)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden w-full h-[calc(100vh-5rem)] supports-[height:100dvh]:h-[calc(100dvh-5rem)] max-h-[calc(100vh-5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-5rem)] flex items-center justify-center bg-[#FFF5F5]">
        {/* Decorative Floating Starbursts & Wavy Curves */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Top Blush Star */}
          <div className="absolute top-2 left-1/3 opacity-70">
            <Starburst size={75} color="#FBCFE8" className="animate-float-slow" />
          </div>

          {/* Golden Star Far Left */}
          <div className="absolute top-16 -left-4 sm:left-4">
            <Starburst size={65} color="#F59E0B" />
          </div>

          {/* Magenta Star near illustration (hidden on mobile to prevent text clash) */}
          <div className="hidden lg:block absolute top-1/2 right-1/2 -translate-y-12">
            <Starburst size={60} color="#C026D3" className="animate-pulse-glow" />
          </div>

          {/* Golden Star bottom center */}
          <div className="absolute bottom-6 left-1/4">
            <Starburst size={70} color="#F59E0B" />
          </div>

          {/* Top-Right Magenta Star */}
          <div className="absolute top-12 right-12">
            <Starburst size={65} color="#D946EF" />
          </div>

          {/* Tiny Yellow Star far right */}
          <div className="hidden sm:block absolute top-1/2 right-4">
            <Starburst size={35} color="#F59E0B" />
          </div>

          {/* Flowing Organic Lavender Curves with Beads */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 600" fill="none" preserveAspectRatio="none">
            <path
              d="M 50,480 C 220,440 320,530 460,380 C 600,230 740,140 950,80"
              stroke="#DDD6FE"
              strokeWidth="2.5"
            />
            <path
              d="M 120,40 C 280,140 380,40 520,200 C 660,340 760,520 950,560"
              stroke="#C4B5FD"
              strokeWidth="2"
            />
            {/* Pastel Beads */}
            <circle cx="485" cy="140" r="9" fill="#F59E0B" />
            <circle cx="460" cy="480" r="8" fill="#FBCFE8" />
            <circle cx="68" cy="460" r="10" fill="#C026D3" />
            <circle cx="940" cy="90" r="8" fill="#C4B5FD" />
          </svg>
        </div>

        {/* Hero Content Grid (Responsive for both Mobile & Desktop) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center justify-between lg:justify-center py-4 sm:py-6 lg:py-0">
          {/* Left Column: Minimalist Typography & CTA */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-5 max-w-xl w-full">
            <div className="space-y-0.5">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-neutral-900 tracking-tight leading-none uppercase">
                YOGA
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-neutral-800 tracking-wide uppercase">
                RETREAT
              </h2>
            </div>

            <p className="text-neutral-600 text-xs sm:text-base leading-relaxed pr-2 max-w-lg">
              Tu espacio sagrado de respiración, presencia y equilibrio. Acumula sellos en cada clase que asistas y canjea talleres de meditación o mats ecológicos directo en tu Google Wallet.
            </p>

            {/* SwiftPieces iOS-style Pill Button */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-7 sm:px-9 py-2.5 sm:py-3.5 rounded-full bg-[#C084FC] hover:bg-[#B370FC] text-white text-sm sm:text-base font-bold shadow-lg shadow-purple-400/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Join us
              </button>

              <Link
                href="/scanner"
                className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white/90 border border-purple-200 text-neutral-800 text-xs sm:text-sm font-semibold hover:bg-white hover:border-purple-300 transition-all active:scale-95 shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-600" />
                <span>Escanear en Recepción</span>
              </Link>
            </div>

            <div className="pt-1 flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                100% Gratis sin descargas
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                Google Wallet (Android)
              </span>
            </div>
          </div>

          {/* Right Column: Hero Illustration (100% Original AI Vector Artwork) */}
          <div className="lg:col-span-6 relative flex-1 lg:flex-none min-h-0 w-full flex items-center justify-center my-auto lg:my-0">
            <div className="relative w-full max-w-[540px] h-full max-h-[36dvh] sm:max-h-[42dvh] lg:max-h-[min(500px,calc(100dvh-12rem))] flex items-center justify-center">
              {/* Main Artwork - Original AI-generated editorial vector */}
              <Image
                src="/images/yoga/hero_ai_pigeon_transparent.png"
                alt="Yogui en postura King Pigeon (Eka Pada Rajakapotasana) - Samyama Yoga"
                width={540}
                height={480}
                priority
                className="h-full w-auto max-h-[36dvh] sm:max-h-[42dvh] lg:max-h-[500px] object-contain drop-shadow-sm select-none hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SWIFTPIECES CARD PREVIEW (Punch Card Interactiva)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-10 lg:px-16 bg-white border-y border-purple-100/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Tu Tarjeta de 10 Sellos en el Celular
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              Sin papel, sin apps pesadas. Muestra tu código QR al entrar a clase y guárdala directamente en tu Google Wallet.
            </p>
          </div>

          {/* Interactive Punch Card Component */}
          <div className="flex justify-center">
            <LoyaltyCard student={demoStudent} config={config} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MODAL DE REGISTRO RÁPIDO (SwiftPieces Pill Style)
      ───────────────────────────────────────────────────────────── */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-purple-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto text-purple-700 mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Crea tu Pase de Clases</h3>
              <p className="text-xs text-neutral-500">
                Obtén tu tarjeta digital al instante para sumar sellos y agregarlo a tu Google Wallet.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Camila Restrepo"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  WhatsApp (Móvil)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +57 320 328 2014"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.email@ejemplo.com"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#C084FC] hover:bg-[#B370FC] text-white text-sm font-bold shadow-lg shadow-purple-400/25 transition-all active:scale-95 cursor-pointer mt-2"
              >
                {isSubmitting ? 'Generando tu pase...' : 'Emitir Mi Pase Digital'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. FOOTER MINIMALISTA
      ───────────────────────────────────────────────────────────── */}
      <footer id="contact" className="border-t border-purple-100 bg-[#FFF5F5] py-12 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Samyama Yoga & Wellness</span>
            <span>·</span>
            <span>Calle 70A # 9-45, Chapinero Alto, Bogotá</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/573203282014"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fuchsia-600 transition-colors"
            >
              WhatsApp: +57 320 328 2014
            </a>
            <Link href="/admin" className="hover:text-neutral-900 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
