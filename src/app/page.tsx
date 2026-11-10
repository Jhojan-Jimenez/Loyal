'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoyal } from '@/context/LoyalContext';
import { LotusIcon } from '@/components/MandalaBackground';
import {
  Sparkles,
  QrCode,
  Smartphone,
  ShieldCheck,
  Calendar,
  Gift,
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  Heart,
  Clock,
  Compass,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';

// The 4 authentic visual compositions from the style reference
interface Composition {
  id: string;
  tabLabel: string;
  titleLight: string;
  titleBold: string;
  subtitle: string;
  characterImage: string;
  characterAlt: string;
  heroCardImage: string;
  align: 'right' | 'left'; // illustration position
  poseName: string;
  accentColor: string;
}

const COMPOSITIONS: Composition[] = [
  {
    id: 'lotus',
    tabLabel: '1. Start with Yoga',
    titleLight: 'Start your day with',
    titleBold: 'YOGA',
    subtitle:
      'Comienza tu jornada con la serenidad del cuerpo alineado y la respiración profunda. Acumula sellos en tu pase digital y desbloquea clases especiales y retiros conscientes.',
    characterImage: '/images/yoga/character_lotus.png',
    characterAlt: 'Yogui en postura de loto (Padmasana)',
    heroCardImage: '/images/yoga/hero_lotus_card.png',
    align: 'right',
    poseName: 'Padmasana · Postura de Loto',
    accentColor: '#C84B7C',
  },
  {
    id: 'warrior',
    tabLabel: '2. Healthy Lifestyle',
    titleLight: 'Healthy',
    titleBold: 'LIFESTYLE',
    subtitle:
      'Transforma tu rutina diaria en un hábito de bienestar duradero. Cada clase registrada en tu tarjeta digital te acerca a nuevas metas y recompensas exclusivas del estudio.',
    characterImage: '/images/yoga/character_warrior.png',
    characterAlt: 'Yogui en postura del guerrero (Virabhadrasana)',
    heroCardImage: '/images/yoga/hero_warrior_card.png',
    align: 'left',
    poseName: 'Virabhadrasana · Postura del Guerrero',
    accentColor: '#D95B8A',
  },
  {
    id: 'goddess',
    tabLabel: "3. Let's do Yoga",
    titleLight: "Let's do",
    titleBold: 'YOGA',
    subtitle:
      'Despierta tu energía interior y comparte la práctica en comunidad. Una tarjeta de fidelización sin descargas que premia tu constancia semana tras semana.',
    characterImage: '/images/yoga/character_goddess.png',
    characterAlt: 'Yogui en postura de la diosa (Utkata Konasana)',
    heroCardImage: '/images/yoga/hero_goddess_card.png',
    align: 'left',
    poseName: 'Utkata Konasana · Postura de la Diosa',
    accentColor: '#C84B7C',
  },
  {
    id: 'tree',
    tabLabel: '4. Yoga Time',
    titleLight: 'Yoga',
    titleBold: 'TIME',
    subtitle:
      'Haz una pausa en tu día para volver a tu centro. Conéctate con tu respiración y lleva tu progreso y recompensas siempre a mano en tu celular.',
    characterImage: '/images/yoga/character_tree.png',
    characterAlt: 'Yogui en postura del árbol (Vrikshasana)',
    heroCardImage: '/images/yoga/hero_tree_card.png',
    align: 'right',
    poseName: 'Vrikshasana · Postura del Árbol',
    accentColor: '#A24876',
  },
];

// Fluid Organic Wave SVG & Prana Dots Background
function OrganicWaveCanvas({ align = 'right' }: { align: 'right' | 'left' }) {
  const isRight = align === 'right';

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${
        isRight ? 'translate-x-4 lg:translate-x-12' : '-translate-x-4 lg:-translate-x-12'
      }`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveLavender" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDF8FF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F5E8FF" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#FCE7F3" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FAF0F8" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="waveRose" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#F5E8FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Liquid Asymmetric Wave */}
        {isRight ? (
          <path
            d="M 320,60 
               C 420,10 520,40 560,110 
               C 600,180 580,270 540,340 
               C 500,410 420,470 330,460 
               C 240,450 180,380 190,300 
               C 200,220 220,110 320,60 Z"
            fill="url(#waveLavender)"
          />
        ) : (
          <path
            d="M 280,60 
               C 180,10 80,40 40,110 
               C 0,180 20,270 60,340 
               C 100,410 180,470 270,460 
               C 360,450 420,380 410,300 
               C 400,220 380,110 280,60 Z"
            fill="url(#waveLavender)"
          />
        )}

        {/* Secondary Delicate Wave Layer */}
        {isRight ? (
          <path
            d="M 370,110 
               C 460,80 530,120 545,190 
               C 560,260 520,330 460,370 
               C 400,410 320,400 280,340 
               C 240,280 280,140 370,110 Z"
            fill="url(#waveRose)"
          />
        ) : (
          <path
            d="M 230,110 
               C 140,80 70,120 55,190 
               C 40,260 80,330 140,370 
               C 200,410 280,400 320,340 
               C 360,280 320,140 230,110 Z"
            fill="url(#waveRose)"
          />
        )}

        {/* Floating Prana Dots (Subtle organic circles exact to illustration) */}
        {isRight ? (
          <g>
            <circle cx="210" cy="90" r="5" fill="#C84B7C" opacity="0.75" />
            <circle cx="235" cy="140" r="3.5" fill="#4A154B" opacity="0.6" />
            <circle cx="180" cy="220" r="7" fill="#FCE7F3" stroke="#C84B7C" strokeWidth="1" />
            <circle cx="215" cy="380" r="4" fill="#E8A85C" opacity="0.7" />
            <circle cx="480" cy="40" r="6" fill="#F5E8FF" stroke="#4A154B" strokeWidth="1" opacity="0.7" />
            <circle cx="560" cy="80" r="4" fill="#C84B7C" opacity="0.6" />
            <circle cx="575" cy="240" r="8" fill="#FCE7F3" opacity="0.8" />
            <circle cx="550" cy="380" r="5" fill="#4A154B" opacity="0.5" />
            <circle cx="430" cy="450" r="4" fill="#C84B7C" opacity="0.6" />
            <circle cx="310" cy="470" r="6" fill="#E8A85C" opacity="0.65" />
          </g>
        ) : (
          <g>
            <circle cx="390" cy="90" r="5" fill="#C84B7C" opacity="0.75" />
            <circle cx="365" cy="140" r="3.5" fill="#4A154B" opacity="0.6" />
            <circle cx="420" cy="220" r="7" fill="#FCE7F3" stroke="#C84B7C" strokeWidth="1" />
            <circle cx="385" cy="380" r="4" fill="#E8A85C" opacity="0.7" />
            <circle cx="120" cy="40" r="6" fill="#F5E8FF" stroke="#4A154B" strokeWidth="1" opacity="0.7" />
            <circle cx="40" cy="80" r="4" fill="#C84B7C" opacity="0.6" />
            <circle cx="25" cy="240" r="8" fill="#FCE7F3" opacity="0.8" />
            <circle cx="50" cy="380" r="5" fill="#4A154B" opacity="0.5" />
            <circle cx="170" cy="450" r="4" fill="#C84B7C" opacity="0.6" />
            <circle cx="290" cy="470" r="6" fill="#E8A85C" opacity="0.65" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { registerStudent, students, config } = useLoyal();

  // Active visual composition (0 = Lotus, 1 = Warrior, 2 = Goddess, 3 = Tree)
  const [activeCompIdx, setActiveCompIdx] = useState(0);
  const currentComp = COMPOSITIONS[activeCompIdx];

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);

  // Registration form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const newStudent = registerStudent(name, phone, email);
    setIsRegisterOpen(false);
    router.push(`/card/${newStudent.token}`);
  };

  const handleQuickFill = (demoName: string, demoPhone: string, demoEmail: string) => {
    setName(demoName);
    setPhone(demoPhone);
    setEmail(demoEmail);
  };

  return (
    <div className="bg-white text-[#4A154B] min-h-screen flex flex-col justify-between selection:bg-[#F3E8FF] selection:text-[#4A154B]">
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (Recreated 1:1 Pixel-Perfect from Reference)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Composition Switcher Bar (Client Live Interactive Showcase) */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#F5E8FF] pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF5FF] rounded-full border border-[#F3E8FF] overflow-x-auto max-w-full">
            {COMPOSITIONS.map((comp, idx) => {
              const isActive = activeCompIdx === idx;
              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveCompIdx(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#4A154B] text-white shadow-xs'
                      : 'text-[#6B5B6E] hover:text-[#4A154B] hover:bg-white/80'
                  }`}
                >
                  {comp.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Reference Modal Inspector Toggle */}
          <button
            onClick={() => setIsReferenceModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C84B7C] hover:text-[#4A154B] px-3 py-1.5 rounded-full hover:bg-[#FAF5FF] border border-transparent hover:border-[#F3E8FF] transition-all cursor-pointer"
            title="Ver la tarjeta de diseño original recortada 1:1"
          >
            <Eye className="w-3.5 h-3.5 text-[#C84B7C]" />
            <span>Comparar Maqueta 1:1</span>
          </button>
        </div>

        {/* Hero Main Grid: Alternates smoothly based on comp.align */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] ${
            currentComp.align === 'left' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Typography & CTA Column */}
          <div
            className={`space-y-6 ${
              currentComp.align === 'left'
                ? 'lg:col-span-6 lg:order-2 text-left'
                : 'lg:col-span-6 lg:order-1 text-left'
            }`}
          >
            {/* Tagline / Pose Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5FF] border border-[#F3E8FF]">
              <span className="w-2 h-2 rounded-full bg-[#C84B7C]" />
              <span className="text-[11px] font-semibold text-[#4A154B] tracking-wider uppercase">
                {currentComp.poseName}
              </span>
            </div>

            {/* Two-Tone Title Exact to Style Reference */}
            <div className="space-y-0.5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#C84B7C] tracking-tight leading-tight">
                {currentComp.titleLight}
              </h2>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#4A154B] tracking-tight leading-[0.92] uppercase">
                {currentComp.titleBold}
              </h1>
            </div>

            {/* Editorial Serene Paragraph */}
            <p className="text-sm sm:text-base text-[#6B5B6E] leading-relaxed max-w-lg">
              {currentComp.subtitle}
            </p>

            {/* Actions: Pill Button 'Learn more' + Quick Pass Access */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-8 py-3.5 rounded-full bg-[#4A154B] hover:bg-[#380E39] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 text-pink-300" />
              </button>

              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF5FF] border border-[#E9D5FF] text-[#4A154B] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer"
              >
                Obtener Mi Pase
              </button>
            </div>

            {/* Secondary Quick-Test Link */}
            <div className="pt-2 text-xs text-[#6B5B6E] flex items-center gap-2">
              <span className="text-[#C84B7C] font-semibold">¿Ya eres alumno?</span>
              <Link
                href="/card/camila-restrepo-yoga"
                className="text-[#4A154B] font-bold underline underline-offset-4 hover:text-[#C84B7C] transition-colors"
              >
                Ver tarjeta demo de Camila (8/10 sellos) →
              </Link>
            </div>
          </div>

          {/* Illustration & Organic Wave Column */}
          <div
            className={`relative flex items-center justify-center min-h-[380px] lg:min-h-[440px] ${
              currentComp.align === 'left'
                ? 'lg:col-span-6 lg:order-1'
                : 'lg:col-span-6 lg:order-2'
            }`}
          >
            {/* Liquid Asymmetrical Wave Canvas with Prana Dots */}
            <OrganicWaveCanvas align={currentComp.align} />

            {/* The Real Cropped Yoga Character Asset */}
            <div className="relative z-10 p-4 transition-all duration-300 transform hover:scale-102">
              <div className="relative max-w-[340px] sm:max-w-[400px] mx-auto">
                <Image
                  src={currentComp.characterImage}
                  alt={currentComp.characterAlt}
                  width={380}
                  height={320}
                  priority
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm select-none"
                />
              </div>

              {/* Floating Pill Caption */}
              <div className="absolute bottom-2 right-4 sm:right-10 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#F3E8FF] shadow-xs text-[11px] font-medium text-[#4A154B] flex items-center gap-1.5">
                <LotusIcon className="w-3.5 h-3.5 text-[#C84B7C]" />
                <span>Práctica Guiada · Samyama</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: ABOUT US (#about)
      ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-6 lg:px-12 border-t border-[#F5E8FF] bg-[#FAF8FC]/50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#C84B7C] uppercase tracking-[0.2em]">
              About us · Filosofía del Estudio
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4A154B] mt-2 tracking-tight">
              Un santuario sereno para cultivar tu presencia
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#6B5B6E] leading-relaxed">
              En Samyama Yoga fusionamos la tradición milenaria del Hatha y Vinyasa con una
              experiencia digital serena y libre de fricciones. Diseñamos un espacio donde cada
              respiración cuenta y tu constancia es celebrada.
            </p>
          </div>

          {/* 3 Pillars of Experience */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#F3E8FF] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#4A154B] mb-5">
                <LotusIcon className="w-6 h-6 text-[#C84B7C]" />
              </div>
              <h3 className="text-lg font-bold text-[#4A154B]">Práctica Auténtica</h3>
              <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                Sesiones guiadas por maestros certificados en India y Bali, con ajustes personalizados
                y un enfoque profundo en alineación biomecánica y pranayama.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#F3E8FF] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#4A154B] mb-5">
                <Smartphone className="w-6 h-6 text-[#4A154B]" />
              </div>
              <h3 className="text-lg font-bold text-[#4A154B]">Pase Digital Cero Fricción</h3>
              <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                Olvídate de las tarjetas de cartón que se pierden o de apps invasivas de la App Store.
                Tu pase vive en tu celular con actualización instantánea de sellos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#F3E8FF] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#4A154B] mb-5">
                <Gift className="w-6 h-6 text-[#C84B7C]" />
              </div>
              <h3 className="text-lg font-bold text-[#4A154B]">Recompensas con Sentido</h3>
              <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                Premia tus 10 asistencias con talleres de cuencos sonoros, esterillas de caucho natural
                ecológico y pases de cortesía para compartir con quien más quieres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: INFO (#info) — CÓMO FUNCIONA EL PASE
      ───────────────────────────────────────────────────────────── */}
      <section id="info" className="py-20 px-6 lg:px-12 border-t border-[#F5E8FF] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C84B7C] uppercase tracking-[0.2em]">
              Info · Funcionamiento
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4A154B] mt-2 tracking-tight">
              Tu Pase de Clases en 3 Pasos Sencillos
            </h2>
            <p className="text-sm sm:text-base text-[#6B5B6E] mt-3">
              Sin contraseñas, sin almacenamiento ocupado en tu teléfono y compatible con Apple Wallet y
              Google Wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF5FF]/70 border border-[#F3E8FF] flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-[#C84B7C]/40">01</span>
                <h3 className="text-lg font-bold text-[#4A154B] mt-2">Registro en 10 Segundos</h3>
                <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                  Ingresa tu nombre y WhatsApp. Al instante se genera tu enlace único y tu código QR
                  personal para registrar asistencias.
                </p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4A154B] hover:text-[#C84B7C] cursor-pointer"
              >
                <span>Generar pase ahora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF5FF]/70 border border-[#F3E8FF] flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-[#C84B7C]/40">02</span>
                <h3 className="text-lg font-bold text-[#4A154B] mt-2">Check-in en Recepción</h3>
                <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                  Al llegar a tu clase, el personal escanea tu código en 2 segundos desde la tablet o móvil
                  del estudio y tu sello queda guardado.
                </p>
              </div>
              <Link
                href="/scanner"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4A154B] hover:text-[#C84B7C]"
              >
                <span>Ver escáner de caja</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF5FF]/70 border border-[#F3E8FF] flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-[#C84B7C]/40">03</span>
                <h3 className="text-lg font-bold text-[#4A154B] mt-2">Desbloquea tu Taller</h3>
                <p className="text-xs sm:text-sm text-[#6B5B6E] mt-2 leading-relaxed">
                  Al completar tus 10 asistencias, tu tarjeta activa automáticamente tu pase para el
                  taller sonoro mensual o tu obsequio de bienvenida.
                </p>
              </div>
              <Link
                href="/card/david-echeverry-yoga"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#4A154B] hover:text-[#C84B7C]"
              >
                <span>Ver ejemplo con 10 sellos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Preloaded Demo Cards Inspector for Evaluation */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FAF5FF] border border-[#F3E8FF]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#4A154B] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C84B7C]" />
                  <span>Tarjetas de Prueba Pre-cargadas en Vivo</span>
                </h3>
                <p className="text-xs text-[#6B5B6E] mt-1">
                  Haz clic en cualquier tarjeta para probar la experiencia del alumno en producción:
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#4A154B] bg-white px-3 py-1 rounded-full border border-[#F3E8FF]">
                {students.length} alumnos registrados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {students.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/card/${s.token}`}
                  className="p-4 rounded-2xl bg-white border border-[#F3E8FF] hover:border-[#C84B7C] shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#4A154B] group-hover:text-[#C84B7C] transition-colors truncate">
                        {s.name}
                      </p>
                      <LotusIcon className="w-3.5 h-3.5 text-[#C84B7C]" />
                    </div>
                    <p className="text-[11px] text-[#A288A6] mt-0.5">{s.phone}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FAF5FF] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#6B5B6E]">Progreso</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF5FF] text-[#4A154B]">
                      {s.stamps}/10 sellos
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: PORTFOLIO (#portfolio) — ESTILOS Y CLASES
      ───────────────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-20 px-6 lg:px-12 border-t border-[#F5E8FF] bg-[#FAF8FC]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold text-[#C84B7C] uppercase tracking-[0.2em]">
                Portfolio · Estilos de Práctica
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#4A154B] mt-2 tracking-tight">
                Nuestras Clases & Horarios
              </h2>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A154B] text-white text-xs font-semibold hover:bg-[#380E39] transition-all self-start md:self-auto cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-pink-300" />
              <span>Ver Horario Completo</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F3E8FF]">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-wider">
                Vinyasa Flow
              </span>
              <h3 className="text-base font-bold text-[#4A154B] mt-1">Dinamismo y Respiración</h3>
              <p className="text-xs text-[#6B5B6E] mt-2 leading-relaxed">
                Secuencias fluidas que coordinan movimiento y respiración para construir calor interno y
                agilidad.
              </p>
              <div className="mt-4 pt-3 border-t border-[#FAF5FF] text-[11px] text-[#A288A6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>60 min · Todos los niveles</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F3E8FF]">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-wider">
                Hatha Clásico
              </span>
              <h3 className="text-base font-bold text-[#4A154B] mt-1">Alineación y Calma</h3>
              <p className="text-xs text-[#6B5B6E] mt-2 leading-relaxed">
                Posturas sostenidas con precisión anatómica, perfectas para profundizar y estabilizar la
                mente.
              </p>
              <div className="mt-4 pt-3 border-t border-[#FAF5FF] text-[11px] text-[#A288A6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>75 min · Enfoque postural</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F3E8FF]">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-wider">
                Yin & Sound Bath
              </span>
              <h3 className="text-base font-bold text-[#4A154B] mt-1">Restauración Fascial</h3>
              <p className="text-xs text-[#6B5B6E] mt-2 leading-relaxed">
                Posturas pasivas en el suelo acompañadas de vibración con cuencos de cuarzo y gongs.
              </p>
              <div className="mt-4 pt-3 border-t border-[#FAF5FF] text-[11px] text-[#A288A6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>90 min · Restaurativo</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F3E8FF]">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-wider">
                Ashtanga Yoga
              </span>
              <h3 className="text-base font-bold text-[#4A154B] mt-1">Disciplina Tradicional</h3>
              <p className="text-xs text-[#6B5B6E] mt-2 leading-relaxed">
                La serie primaria en método Mysore para practicantes que buscan rigor, fuerza y devoción.
              </p>
              <div className="mt-4 pt-3 border-t border-[#FAF5FF] text-[11px] text-[#A288A6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>75 min · Intermedio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: CONTACT US (#contact)
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-6 lg:px-12 border-t border-[#F5E8FF] bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-[#C84B7C] uppercase tracking-[0.2em]">
              Contact us · Visítanos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4A154B] tracking-tight">
              ¿Listo para comenzar tu práctica?
            </h2>
            <p className="text-sm sm:text-base text-[#6B5B6E] leading-relaxed max-w-lg">
              Estamos ubicados en un entorno tranquilo con luz natural, tatamis de bambú y aire
              purificado. Escríbenos directamente o acércate a recepción para tu clase de prueba.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#4A154B]">
                <MapPin className="w-4 h-4 text-[#C84B7C]" />
                <span>Calle 85 # 11-53, Zona Zen, Bogotá · Colombia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#4A154B]">
                <Phone className="w-4 h-4 text-[#C84B7C]" />
                <span>+57 (312) 345-6789 · Atención Lunes a Sábado de 6:00 a 20:00</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#4A154B]">
                <MessageCircle className="w-4 h-4 text-[#C84B7C]" />
                <span>WhatsApp directo disponible para reservas y consultas</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-8 py-3.5 rounded-full bg-[#4A154B] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#380E39] transition-all cursor-pointer shadow-xs"
              >
                Crear Mi Pase Digital
              </button>

              <Link
                href="/scanner"
                className="px-6 py-3.5 rounded-full bg-[#FAF5FF] border border-[#F3E8FF] text-[#4A154B] text-xs font-semibold hover:bg-[#F5E8FF] transition-all"
              >
                Abrir Escáner de Caja
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FAF5FF] p-8 rounded-3xl border border-[#F3E8FF] relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#4A154B] shadow-xs">
                <LotusIcon className="w-6 h-6 text-[#C84B7C]" />
              </div>
              <h3 className="text-lg font-bold text-[#4A154B]">Horario de Recepción</h3>
              <p className="text-xs text-[#6B5B6E] leading-relaxed">
                Lunes a Viernes: 6:00 AM – 8:30 PM <br />
                Sábados y Domingos: 7:30 AM – 2:00 PM
              </p>
              <div className="p-4 rounded-2xl bg-white border border-[#F3E8FF] text-xs text-[#4A154B] font-medium space-y-1">
                <p className="font-bold text-[#C84B7C]">Recepción Inteligente:</p>
                <p className="text-[#6B5B6E]">
                  Puedes añadir tu pase a Google Wallet con un solo toque desde tu tarjeta digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#F5E8FF] py-8 px-6 lg:px-12 bg-white text-xs text-[#6B5B6E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-widest text-[#4A154B] uppercase">WEBSITE</span>
            <span>·</span>
            <span>{config.studioName} © 2026</span>
            <span className="hidden sm:inline">· Programa Oficial de Lealtad</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-medium">
            <Link href="/schedule" className="hover:text-[#4A154B]">
              Horarios
            </Link>
            <Link href="/card/camila-restrepo-yoga" className="hover:text-[#4A154B]">
              Mi Pase
            </Link>
            <Link href="/scanner" className="hover:text-[#4A154B]">
              Recepción
            </Link>
            <Link href="/admin" className="hover:text-[#4A154B]">
              Administración
            </Link>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: REGISTRO ELEGANTE DEL PASE DIGITAL
      ───────────────────────────────────────────────────────────── */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-[#F3E8FF] shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#6B5B6E] hover:text-[#4A154B] hover:bg-[#FAF5FF] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#4A154B]">
                <LotusIcon className="w-6 h-6 text-[#C84B7C]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#4A154B] leading-tight">
                  Obtén tu Pase Digital
                </h3>
                <p className="text-xs text-[#6B5B6E]">
                  Listo en 10 segundos · Compatible con Google Wallet
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-fill Pills */}
            <div className="mb-6 p-3 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF]">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-wider block mb-2">
                O autocompleta con datos de prueba:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill('Mariana Cadavid', '+57 312 987 6543', 'mariana@yoga.com')
                  }
                  className="px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-[#4A154B] border border-[#F3E8FF] hover:border-[#C84B7C] cursor-pointer"
                >
                  Mariana Cadavid
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill('Santiago Morales', '+57 320 456 7890', 'santiago@yoga.com')
                  }
                  className="px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-[#4A154B] border border-[#F3E8FF] hover:border-[#C84B7C] cursor-pointer"
                >
                  Santiago Morales
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A154B] mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mariana Cadavid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#FAF5FF]/60 border border-[#F3E8FF] text-[#4A154B] placeholder:text-[#A288A6] focus:outline-hidden focus:ring-2 focus:ring-[#C84B7C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A154B] mb-1">
                  WhatsApp / Celular *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +57 312 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#FAF5FF]/60 border border-[#F3E8FF] text-[#4A154B] placeholder:text-[#A288A6] focus:outline-hidden focus:ring-2 focus:ring-[#C84B7C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A154B] mb-1">
                  Correo Electrónico <span className="font-normal text-[#6B5B6E]">(Opcional)</span>
                </label>
                <input
                  type="email"
                  placeholder="mariana@yoga.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#FAF5FF]/60 border border-[#F3E8FF] text-[#4A154B] placeholder:text-[#A288A6] focus:outline-hidden focus:ring-2 focus:ring-[#C84B7C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#4A154B] hover:bg-[#380E39] text-white text-xs font-bold tracking-wider uppercase shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LotusIcon className="w-4 h-4 text-pink-300" />
                <span>Crear Mi Pase Digital</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-[#6B5B6E]">
                <span>✓ Sin descargas de App Store</span>
                <span>✓ Guardable en Google Wallet</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: INSPECTOR DE MAQUETA ORIGINAL 1:1
      ───────────────────────────────────────────────────────────── */}
      {isReferenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#F3E8FF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsReferenceModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#6B5B6E] hover:text-[#4A154B] hover:bg-[#FAF5FF] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C84B7C] uppercase tracking-widest">
                Fidelidad 1:1 Pixel-Perfect
              </span>
              <h3 className="text-xl font-black text-[#4A154B] mt-1">
                Tarjeta de Referencia Oficial de Diseño
              </h3>
              <p className="text-xs text-[#6B5B6E] mt-1">
                Visualizando el asset gráfico original del diseñador para la composición activa:
              </p>
            </div>

            {/* The Reference Card Asset */}
            <div className="rounded-2xl overflow-hidden border border-[#F3E8FF] shadow-md bg-white my-4">
              <Image
                src={currentComp.heroCardImage}
                alt={`Referencia original: ${currentComp.tabLabel}`}
                width={600}
                height={325}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Quick Switcher inside modal */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F5E8FF]">
              {COMPOSITIONS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCompIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    activeCompIdx === i
                      ? 'bg-[#4A154B] text-white'
                      : 'bg-[#FAF5FF] text-[#4A154B] hover:bg-[#F5E8FF]'
                  }`}
                >
                  {c.tabLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
