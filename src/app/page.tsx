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
  Gift,
  ArrowRight,
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
    <div className="bg-[#FFF5F5] text-neutral-900 min-h-screen flex flex-col justify-between selection:bg-purple-200 selection:text-purple-950">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (1:1 with user reference image)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
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

          {/* Magenta Star near illustration */}
          <div className="absolute top-1/2 right-1/2 -translate-y-12">
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
          <div className="absolute top-1/2 right-4">
            <Starburst size={35} color="#F59E0B" />
          </div>

          {/* Flowing Organic Lavender Curves with Beads */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 600" fill="none">
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

        {/* Hero Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Minimalist Typography & CTA */}
          <div className="lg:col-span-6 space-y-6 max-w-xl">
            <div className="space-y-1">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-neutral-900 tracking-tight leading-none uppercase">
                YOGA
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-800 tracking-wide uppercase">
                RETREAT
              </h2>
            </div>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed pr-4">
              Tu espacio sagrado de respiración, presencia y equilibrio. Acumula sellos en cada clase que asistas y canjea talleres de meditación o mats ecológicos directo en tu Google Wallet.
            </p>

            {/* SwiftPieces iOS-style Pill Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-9 py-3.5 rounded-full bg-[#C084FC] hover:bg-[#B370FC] text-white text-base font-bold shadow-lg shadow-purple-400/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Join us
              </button>

              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 border border-purple-200 text-neutral-800 text-sm font-semibold hover:bg-white hover:border-purple-300 transition-all active:scale-95 shadow-xs"
              >
                <QrCode className="w-4 h-4 text-fuchsia-600" />
                <span>Escanear en Recepción</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Gratis sin descargas
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Google Wallet (Android)
              </span>
            </div>
          </div>

          {/* Right Column: Hero Illustration (100% Original AI Vector Artwork) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[540px] aspect-[4/3.6] flex items-center justify-center">
              {/* Main Artwork - Original AI-generated editorial vector */}
              <Image
                src="/images/yoga/hero_ai_pigeon_transparent.png"
                alt="Yogui en postura King Pigeon (Eka Pada Rajakapotasana) - Samyama Yoga"
                width={540}
                height={480}
                priority
                className="object-contain drop-shadow-sm select-none hover:scale-[1.02] transition-transform duration-500"
              />

              {/* Floating SwiftPieces Info Chip */}
              <div className="absolute -bottom-4 right-2 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-100 shadow-md flex items-center gap-3 animate-float-slow">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-purple-600">Recompensa</p>
                  <p className="text-xs font-semibold text-neutral-900">10 Clases = 1 Taller Gratis</p>
                </div>
              </div>
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
            <span className="text-[11px] font-bold tracking-widest text-fuchsia-600 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Pase Digital Oficial
            </span>
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
          3. EVENTS & HORARIOS (Simple, Breathing Section)
      ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Próximas Clases & Horarios
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Encuentra la práctica ideal para tu nivel en nuestro estudio de Chapinero Alto.
            </p>
          </div>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 transition-colors"
          >
            <span>Ver horario semanal completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class 1 */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-xs hover:shadow-md transition-shadow">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-fuchsia-50 text-fuchsia-700 mb-3">
              Vinyasa Flow
            </span>
            <h4 className="text-base font-bold text-neutral-900">Despertar Consciente</h4>
            <p className="text-xs text-neutral-500 mt-1">Andrea Salgar · 06:45 AM</p>
            <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
              Secuencia dinámica y enérgica para iniciar tu día conectando respiración ujjayi con movimiento.
            </p>
            <div className="mt-4 pt-4 border-t border-purple-50 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900">Lun, Mié, Vie</span>
              <a
                href={`https://wa.me/573203282014?text=Hola!%20Quiero%20reservar%20mi%20cupo%20para%20Vinyasa%20Flow`}
                target="_blank"
                rel="noreferrer"
                className="text-fuchsia-600 font-bold hover:underline"
              >
                Reservar
              </a>
            </div>
          </div>

          {/* Class 2 */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-xs hover:shadow-md transition-shadow">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 mb-3">
              Hatha Yoga
            </span>
            <h4 className="text-base font-bold text-neutral-900">Alineación & Pranayama</h4>
            <p className="text-xs text-neutral-500 mt-1">Felipe Osorio · 07:30 AM</p>
            <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
              Permanencia consciente en asanas fundamentales y técnicas de respiración para calmar la mente.
            </p>
            <div className="mt-4 pt-4 border-t border-purple-50 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900">Mar, Jue</span>
              <a
                href={`https://wa.me/573203282014?text=Hola!%20Quiero%20reservar%20mi%20cupo%20para%20Hatha%20Yoga`}
                target="_blank"
                rel="noreferrer"
                className="text-fuchsia-600 font-bold hover:underline"
              >
                Reservar
              </a>
            </div>
          </div>

          {/* Class 3 */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-xs hover:shadow-md transition-shadow">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 mb-3">
              Yin Restaurativo
            </span>
            <h4 className="text-base font-bold text-neutral-900">Liberación Fascial</h4>
            <p className="text-xs text-neutral-500 mt-1">Valentina Restrepo · 06:15 PM</p>
            <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
              Posturas suaves en el suelo sostenidas por varios minutos para soltar tensiones profundas.
            </p>
            <div className="mt-4 pt-4 border-t border-purple-50 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900">Lun, Mié</span>
              <a
                href={`https://wa.me/573203282014?text=Hola!%20Quiero%20reservar%20mi%20cupo%20para%20Yin%20Yoga`}
                target="_blank"
                rel="noreferrer"
                className="text-fuchsia-600 font-bold hover:underline"
              >
                Reservar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MODAL DE REGISTRO RÁPIDO (SwiftPieces Pill Style)
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
