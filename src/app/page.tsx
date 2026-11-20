'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import {
  QrCode,
  ShieldCheck,
  Check,
  ArrowRight,
  Smartphone,
  Star,
  Users,
  Sparkles,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Gift,
  Coffee,
  Scissors,
  Store,
  X,
} from 'lucide-react';
import { FusionNavigation } from '@/components/fusion/FusionNavigation';
import { FusionLoyaltyCard } from '@/components/fusion/FusionLoyaltyCard';
import { GranolaHeroTicket } from '@/components/fusion/FusionHeroTicket';
import { FusionMiniature } from '@/components/fusion/FusionMiniature';
import { FusionAccordion, AccordionItem } from '@/components/fusion/FusionAccordion';
import { FusionRegisterModal } from '@/components/fusion/FusionRegisterModal';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-fusion-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-fusion-sans',
  display: 'swap',
});

export default function HomePage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState<'client' | 'counter'>('client');
  const [activePlanIndex, setActivePlanIndex] = useState<number>(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const pricingPlans = [
    {
      id: 'starter',
      eyebrow: 'PARA EMPEZAR',
      title: 'Plan Starter',
      subtitle: 'Digitaliza tu primera tarjeta de sellos sin costo fijo.',
      price: '$0',
      period: 'COP / mes',
      dailyBadge: 'Gratis para siempre',
      featured: false,
      ctaLabel: 'Empezar Gratis',
      ctaAction: 'modal' as const,
      features: [
        { text: '1 punto de venta / mostrador', included: true },
        { text: 'Hasta 100 clientes activos', included: true },
        { text: 'Pases Google Wallet & Web', included: true },
        { text: 'Escáner QR ilimitado', included: true },
        { text: 'Sin diseño ni logo personalizado', included: false },
      ],
    },
    {
      id: 'pro',
      eyebrow: 'MÁS POPULAR · RECOMENDADO',
      title: 'Plan Pro Negocios',
      subtitle: 'Fideliza sin límites con tu marca, colores y analítica real.',
      price: '$79.000',
      period: 'COP / mes',
      dailyBadge: '$2.633 COP / día · $29 USD',
      featured: true,
      ctaLabel: 'Elegir Plan Pro',
      ctaAction: 'link' as const,
      ctaHref: 'https://wa.me/573203282014?text=Hola!%20Quiero%20suscribirme%20al%20plan%20Pro%20de%20Loyal',
      features: [
        { text: 'Clientes y sellos ilimitados', included: true },
        { text: 'Múltiples cajeros y terminales', included: true },
        { text: 'Logo, colores y fondo personalizado', included: true },
        { text: 'Métricas de retención y visitas', included: true },
        { text: 'Soporte prioritario por WhatsApp', included: true },
      ],
    },
    {
      id: 'enterprise',
      eyebrow: 'MULTI-SUCURSAL',
      title: 'Plan Enterprise',
      subtitle: 'Para franquicias y cadenas que requieren integración POS.',
      price: '$249.000',
      period: 'COP / mes',
      dailyBadge: '$8.300 COP / día · $89 USD',
      featured: false,
      ctaLabel: 'Contactar Ventas',
      ctaAction: 'link' as const,
      ctaHref: 'https://wa.me/573203282014?text=Hola!%20Quiero%20información%20del%20plan%20Enterprise%20de%20Loyal',
      features: [
        { text: 'Sucursales y cajas ilimitadas', included: true },
        { text: 'API para facturación y POS', included: true },
        { text: 'Subdominio personalizado', included: true },
        { text: 'Gerente de cuenta dedicado', included: true },
        { text: 'Onboarding presencial o remoto', included: true },
      ],
    },
  ];

  // FAQ Items tailored to local merchants
  const faqItems: AccordionItem[] = [
    {
      id: 'faq-1',
      question: '¿Mis clientes necesitan descargar alguna app pesada?',
      answer:
        'No. Esa es la mayor ventaja de Loyal. Tus clientes no tienen que buscar en la App Store, ni crear contraseñas, ni gastar espacio en su teléfono. La tarjeta se abre al instante en el navegador web y se guarda directamente en Google Wallet (en Android) o como pase en la pantalla de inicio (en iPhone).',
    },
    {
      id: 'faq-2',
      question: '¿Cómo funciona el guardado en Google Wallet?',
      answer:
        'Loyal utiliza la API oficial de Google Wallet. Con solo pulsar "Guardar en Google Wallet", el pase se almacena de forma nativa en la billetera del cliente junto a sus tarjetas de crédito o pases de abordar. Siempre está a mano sin conexión y envía alertas automáticas cuando el cliente está cerca de tu local.',
    },
    {
      id: 'faq-3',
      question: '¿Cómo estampamos los sellos en el mostrador?',
      answer:
        'Tu personal de caja abre nuestro Escáner de Mostrador web (/scanner) desde cualquier celular, tableta o laptop que ya tengas en caja. Al escanear el código QR del cliente, el sello se suma en menos de 1 segundo y se sincroniza en la nube de forma segura.',
    },
    {
      id: 'faq-4',
      question: '¿Cómo evitan que los clientes se auto-estampen sellos fraudulentos?',
      answer:
        'Cada sello requiere una firma criptográfica única generada por el escáner del comercio autorizado. Los clientes no pueden añadir sellos por su cuenta: el código QR del cliente rota cada 30 segundos con tecnología TOTP, y únicamente tu escáner autenticado tiene el permiso de emitir visitas.',
    },
    {
      id: 'faq-5',
      question: '¿Puedo tener varios cajeros o sucursales funcionando al mismo tiempo?',
      answer:
        'Sí. En el Plan Pro puedes autorizar múltiples dispositivos de mostrador simultáneos. Si tienes dos cajas o tres meseros con su propio celular, todos pueden estampar visitas y los datos se consolidan en tu panel de administración en tiempo real.',
    },
    {
      id: 'faq-6',
      question: '¿Cuánto tiempo toma empezar a usar Loyal en mi negocio?',
      answer:
        'Menos de 15 minutos. Eliges cuántos sellos requiere tu tarjeta (ej. 8 o 10 visitas), cuál es el premio para tu cliente y subes tu logo. Imprimes el código QR de registro en tu mostrador o mesas y tus clientes empiezan a coleccionar sellos hoy mismo.',
    },
  ];

  return (
    <div
      style={{
        fontFamily: dmSans.style.fontFamily,
        ['--font-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-sans' as any]: dmSans.style.fontFamily,
        ['--font-granola-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-granola-sans' as any]: dmSans.style.fontFamily,
        ['--font-fusion-serif' as any]: libreBaskerville.style.fontFamily,
        ['--font-fusion-sans' as any]: dmSans.style.fontFamily,
      }}
      className={`style-fusion relative min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#5B6F00] selection:text-white antialiased ${libreBaskerville.variable} ${dmSans.variable} font-sans`}
    >
      {/* ── Fixed Airbnb-Structure Navigation with Granola Styling ── */}
      <FusionNavigation onOpenDemo={() => setIsRegisterModalOpen(true)} />

      {/* ─────────────────────────────────────────────────────────────
          1. TWO-OBJECT OPENING (HERO CHAPTER ON WARM STAGE) - 100VH VIEWPORT
      ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[100dvh] max-h-[100dvh] overflow-hidden lg:h-auto lg:max-h-none lg:min-h-[100dvh] lg:overflow-visible pt-18 pb-4 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-16 px-5 sm:px-10 lg:px-12 max-w-[1240px] mx-auto w-full flex flex-col justify-between lg:justify-center">
        <div className="flex-1 lg:flex-none grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-10 xl:gap-12 items-center content-evenly lg:content-center w-full py-1 sm:py-4">
          
          {/* Left Column: Focused editorial copy block */}
          <div className="lg:col-span-7 max-w-[580px] mx-auto lg:mx-0 text-left space-y-2.5 sm:space-y-4 lg:space-y-5">

            {/* Display Headline in Libre Baskerville Serif (Signature Granola Style) */}
            <h1 className="text-[32px] sm:text-[38px] lg:text-[46px] xl:text-[50px] leading-[1.1] sm:leading-[1.08] font-serif font-normal text-[#1C1917] tracking-[-0.02em]">
              Fideliza clientes con tarjetas de sellos en su celular.
            </h1>

            {/* Hero Support Copy */}
            <p className="text-[15px] sm:text-[17px] lg:text-[19px] leading-[20px] sm:leading-[26px] lg:leading-[28px] text-[#57534E] font-normal">
              Pases inteligentes en Google Wallet y web. Sin tarjetas de cartón que se pierden y con escaneo en 1 segundo en tu mostrador.
            </p>

            {/* Actions: Primary Granola Olive Capsule & Pill Secondary */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="h-11 sm:h-12 px-5 sm:px-7 rounded-full text-white text-[13px] sm:text-[15px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:shadow-[0_6px_20px_rgba(91,111,0,0.35)] hover:bg-[#4D5E00]"
                style={{
                  background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
                }}
              >
                <span>Crear tarjeta demo</span>
                <ArrowRight className="w-4 h-4 text-[#B2C248]" />
              </button>

              <Link
                href="/scanner"
                className="h-11 sm:h-12 px-4 sm:px-6 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[13px] sm:text-[15px] font-medium transition-all active:scale-[0.96] flex items-center gap-1.5 sm:gap-2"
              >
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Escáner</span>
                <span className="hidden sm:inline">en mostrador</span>
              </Link>
            </div>

            {/* Discreet Trust Qualifiers */}
            <div className="pt-0.5 sm:pt-1 flex flex-wrap items-center gap-y-1 gap-x-3.5 sm:gap-x-5 text-[12px] sm:text-[13px] text-[#57534E]">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B6F00]" />
                Cero descargas
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B6F00]" />
                Google Wallet
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B6F00]" />
                Listo en 15 min
              </span>
            </div>
          </div>

          {/* Right Column: Prominent Granola Punch Ticket */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end w-full">
            {/* Ground radial shadow in warm tone */}
            <div
              className="hidden sm:block absolute -bottom-8 w-[90%] h-24 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(40,30,10,0.16) 0%, rgba(40,30,10,0) 70%)',
              }}
            />

            <div id="experiencia" className="relative z-10 w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] flex justify-center lg:justify-end">
              <GranolaHeroTicket
                size="lg"
                onOpenRegister={() => setIsRegisterModalOpen(true)}
              />
            </div>
          </div>

        </div>

        {/* Subtle scroll cue at bottom of 100vh hero (visible on mobile & desktop) */}
        <a
          href="#beneficios"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center gap-1.5 py-1 opacity-60 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
        >
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#78716C]">
            Toca los sellos arriba o explora
          </span>
          <div className="w-4 h-6 rounded-full border border-[#D5D5D2] flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-[#5B6F00] animate-bounce" />
          </div>
        </a>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TACTILE MINIATURES CAPABILITY FIELD (AIRBNB COMPONENTIZATION)
      ───────────────────────────────────────────────────────────── */}
      <section id="beneficios" className="min-h-[70dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-14 lg:py-16 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        {/* Centered Chapter Heading */}
        <div className="max-w-[640px] mx-auto text-center mb-3 sm:mb-8 lg:mb-10 space-y-1 sm:space-y-3 shrink-0">
          <h2 className="text-[22px] sm:text-[38px] lg:text-[44px] leading-[1.1] font-serif font-normal text-[#1C1917] tracking-tight">
            Todo lo que necesitas para fidelizar sin esfuerzo.
          </h2>
          <p className="text-[12px] sm:text-[18px] leading-[17px] sm:leading-[26px] text-[#57534E] font-normal">
            Tecnología ligera con calidez editorial para la cercanía de tu mostrador diario.
          </p>
        </div>

        {/* 6 Miniature Capability Items (2x3 Bento grid on mobile, 3x2 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6 max-w-[1100px] mx-auto w-full">
          {/* Item 1: Sello Digital */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="stamp" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Un toque en mostrador
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Tu cliente muestra su QR y el sello se estampa al instante con sonido.
              </p>
            </div>
          </div>

          {/* Item 2: Google Wallet */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="wallet" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Siempre en su billetera
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Sin descargas de apps. Se guarda en Google Wallet y pantalla de inicio.
              </p>
            </div>
          </div>

          {/* Item 3: Notificaciones */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="bell" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Alertas amigables
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Recuerda a tus clientes cuando están a 1 o 2 sellos de reclamar su premio.
              </p>
            </div>
          </div>

          {/* Item 4: Escáner Mostrador */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="scanner" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Cero hardware caro
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Funciona desde cualquier celular, tableta o laptop que ya tengas en caja.
              </p>
            </div>
          </div>

          {/* Item 5: Métricas Claras */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="analytics" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Métricas claras
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Descubre qué días vuelven más clientes y quiénes son tus más fieles.
              </p>
            </div>
          </div>

          {/* Item 6: Premio Personalizado */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF7F2]/70 md:bg-transparent hover:bg-[#FAF7F2] border border-[#EAE4D5] md:border-transparent md:hover:border-[#EAE4D5] transition-all">
            <div className="scale-75 sm:scale-100 origin-top-left -mb-3 sm:mb-0">
              <FusionMiniature type="gift" size={56} />
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <h3 className="text-[13px] sm:text-[18px] leading-[17px] sm:leading-[22px] font-serif font-normal text-[#1C1917]">
                Reglas a tu medida
              </h3>
              <p className="text-[11px] sm:text-[14px] leading-[15px] sm:leading-[20px] text-[#57534E] line-clamp-3">
                Tú decides si son 6, 8 o 10 sellos y qué beneficio recibe tu cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN STORY TRIPTYCH (REAL LOCAL BUSINESS OUTCOMES)
      ───────────────────────────────────────────────────────────── */}
      <section id="historias" className="min-h-[65dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-14 lg:py-16 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        <div className="max-w-[640px] mx-auto text-center mb-3 sm:mb-8 lg:mb-10 space-y-1 sm:space-y-3 shrink-0">
          <h2 className="text-[22px] sm:text-[38px] lg:text-[44px] leading-[1.1] font-serif font-normal text-[#1C1917] tracking-tight">
            Comercios reales que dijeron adiós al cartón.
          </h2>
          <p className="text-[12px] sm:text-[18px] leading-[17px] sm:leading-[26px] text-[#57534E] font-normal">
            Desde cafeterías de especialidad hasta barberías y estudios, así cultivan la relación con sus clientes.
          </p>
        </div>

        {/* 3 Photo Story Cards (Horizontal row cards stacked on mobile, 3-col on desktop) */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-2.5 sm:gap-5 max-w-[948px] mx-auto w-full">
          {/* Card 1 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)] flex md:block items-stretch"
          >
            <div className="relative w-28 sm:w-36 md:w-full h-28 sm:h-32 md:h-[210px] lg:h-[220px] bg-[#FAF7F2] overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                alt="Café de especialidad y barista"
                className="w-full h-full object-cover"
              />
              <div className="hidden md:block absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Café Varietale · Bogotá
              </div>
            </div>
            <div className="p-3 sm:p-4 text-left md:text-center flex flex-col justify-center min-w-0">
              <span className="md:hidden text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-0.5">
                Café Varietale · Bogotá
              </span>
              <p className="text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] text-[#1C1917] font-normal md:max-w-[240px] md:mx-auto">
                Elena reemplazó 2,000 tarjetas impresas con 84% de adopción en su primera semana.
              </p>
              <span className="inline-block mt-1.5 md:mt-2 text-[11px] sm:text-xs font-serif font-normal text-[#5B6F00]">
                +42% cafés recurrentes
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)] flex md:block items-stretch"
          >
            <div className="relative w-28 sm:w-36 md:w-full h-28 sm:h-32 md:h-[210px] lg:h-[220px] bg-[#FAF7F2] overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
                alt="Barbería artesanal"
                className="w-full h-full object-cover"
              />
              <div className="hidden md:block absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Grooming 93 · Medellín
              </div>
            </div>
            <div className="p-3 sm:p-4 text-left md:text-center flex flex-col justify-center min-w-0">
              <span className="md:hidden text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-0.5">
                Grooming 93 · Medellín
              </span>
              <p className="text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] text-[#1C1917] font-normal md:max-w-[240px] md:mx-auto">
                Mateo acortó el ciclo de visitas de 28 a 18 días premiando el 5º corte de barba.
              </p>
              <span className="inline-block mt-1.5 md:mt-2 text-[11px] sm:text-xs font-serif font-normal text-[#5B6F00]">
                Clientes vuelven cada 18 días
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)] flex md:block items-stretch"
          >
            <div className="relative w-28 sm:w-36 md:w-full h-28 sm:h-32 md:h-[210px] lg:h-[220px] bg-[#FAF7F2] overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                alt="Estudio de Yoga y bienestar"
                className="w-full h-full object-cover"
              />
              <div className="hidden md:block absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Comercio Local · Bogotá
              </div>
            </div>
            <div className="p-3 sm:p-4 text-left md:text-center flex flex-col justify-center min-w-0">
              <span className="md:hidden text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-0.5">
                Comercio Local · Bogotá
              </span>
              <p className="text-[12px] sm:text-[14px] leading-[16px] sm:leading-[19px] text-[#1C1917] font-normal md:max-w-[240px] md:mx-auto">
                Elimina las tarjetas de cartón y fideliza a tus clientes frecuentes con métricas claras en tiempo real.
              </p>
              <span className="inline-block mt-1.5 md:mt-2 text-[11px] sm:text-xs font-serif font-normal text-[#5B6F00]">
                Programa activo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PORTRAITS CLUSTER & STACKED QUANTIFIED PROOF
      ───────────────────────────────────────────────────────────── */}
      <section className="min-h-[60dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-14 lg:py-14 px-5 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        <div className="max-w-[700px] mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Overlapping circular portraits */}
          <div className="flex items-center justify-center -space-x-3 sm:-space-x-5 py-1">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 sm:border-4 border-[#FFFDF9] shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 sm:border-4 border-[#FFFDF9] shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Central Largest Face */}
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-[#FFFDF9] shadow-xl z-30 shrink-0 ring-4 ring-[#F1F5DC]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt="Líder de negocio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 sm:border-4 border-[#FFFDF9] shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 sm:border-4 border-[#FFFDF9] shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stacked Proof Statements in Serif */}
          <div className="space-y-4 sm:space-y-6 max-w-[580px] mx-auto text-center divide-y divide-[#EAE4D5]">
            <div className="pt-1">
              <div className="text-[22px] sm:text-[34px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
                +38% más visitas repetidas
              </div>
              <p className="text-[13px] sm:text-[15px] text-[#57534E] mt-1">
                Los clientes que guardan su pase digital regresan un promedio de 1.4 semanas antes a su próxima compra.
              </p>
            </div>

            <div className="pt-4 sm:pt-6">
              <div className="text-[22px] sm:text-[34px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
                Menos de 1 segundo por sello
              </div>
              <p className="text-[13px] sm:text-[15px] text-[#57534E] mt-1">
                El escaneo óptico desde el celular o mostrador es instantáneo y no genera demoras en horas pico.
              </p>
            </div>

            <div className="pt-4 sm:pt-6">
              <div className="text-[22px] sm:text-[34px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
                94% de adopción frente al papel
              </div>
              <p className="text-[13px] sm:text-[15px] text-[#57534E] mt-1">
                Nueve de cada diez clientes prefieren tener su tarjeta en Google Wallet en lugar de llenar su cartera de cartones.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. PAIRED CAPABILITY EXHIBITS (DEMONSTRATIONS)
      ───────────────────────────────────────────────────────────── */}
      <section className="min-h-[65dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-14 lg:py-14 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        <div className="max-w-[640px] mx-auto text-center mb-3 sm:mb-8 space-y-1.5 shrink-0">
          <h2 className="text-[22px] sm:text-[38px] lg:text-[44px] leading-[1.1] font-serif font-normal text-[#1C1917] tracking-tight">
            Dos lados de una experiencia impecable.
          </h2>
          <p className="text-[12px] sm:text-[18px] leading-[17px] sm:leading-[26px] text-[#57534E] font-normal">
            Hecho para deleitar al cliente en su teléfono y facilitar el trabajo de tu equipo en mostrador.
          </p>
        </div>

        {/* Mobile Segmented Toggle (Cliente / Mostrador) */}
        <div className="flex md:hidden items-center p-1 bg-[#FAF7F2] rounded-full border border-[#EAE4D5] max-w-[280px] mx-auto w-full mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveExhibit('client')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeExhibit === 'client'
                ? 'bg-[#5B6F00] text-white shadow-xs'
                : 'text-[#57534E]'
            }`}
          >
            Para tus clientes
          </button>
          <button
            type="button"
            onClick={() => setActiveExhibit('counter')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeExhibit === 'counter'
                ? 'bg-[#5B6F00] text-white shadow-xs'
                : 'text-[#57534E]'
            }`}
          >
            Para tu mostrador
          </button>
        </div>

        {/* Feature Grid: Interactive single-focus on mobile, Two-column grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-[848px] mx-auto w-full">
          {/* Exhibit 1: Para el Cliente */}
          <div className={`${activeExhibit === 'client' ? 'flex' : 'hidden'} md:flex flex-col items-center text-center`}>
            <div
              className="w-full max-w-[300px] sm:max-w-[340px] h-[310px] sm:h-[360px] bg-[#FAF7F2] rounded-[32px] p-4 sm:p-5 border border-[#EAE4D5] flex flex-col justify-between overflow-hidden relative shadow-xs"
            >
              {/* Phone Speaker Notch */}
              <div className="w-16 h-3 bg-[#1C1917] rounded-full mx-auto mb-2" />

              {/* In-device interface preview */}
              <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#EAE4D5] text-left shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#78716C]">Google Wallet</span>
                    <h4 className="text-sm font-serif font-normal text-[#1C1917]">Café Varietale</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F1F5DC] text-[10px] font-bold text-[#5B6F00] border border-[#D9E2B3]">
                    7 / 10 Sellos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 py-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <div
                      key={n}
                      className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        n <= 7 ? 'bg-[#5B6F00] text-white' : 'bg-[#FAF7F2] text-[#A89F91] border border-dashed border-[#DDD5C3]'
                      }`}
                    >
                      {n <= 7 ? '✓' : n}
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-xl bg-[#FAF7F2] text-[11px] text-[#57534E] flex items-center gap-2 border border-[#EAE4D5]">
                  <Gift className="w-3.5 h-3.5 text-[#5B6F00]" />
                  <span>Próximo sello desbloquea café gratis</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="text-center py-1 text-[10px] text-[#78716C]">
                Disponible sin conexión · Notificaciones de cercanía
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 sm:mt-4 max-w-[300px]">
              <h3 className="hidden md:block text-[18px] leading-[22px] font-serif font-normal text-[#1C1917]">
                Para tus clientes
              </h3>
              <p className="text-[12px] sm:text-[14px] leading-[17px] sm:leading-[19px] text-[#57534E] mt-1">
                Su tarjeta siempre a mano en la pantalla de bloqueo. Sin contraseñas ni apps que actualizar.
              </p>
            </div>
          </div>

          {/* Exhibit 2: Para el Mostrador */}
          <div className={`${activeExhibit === 'counter' ? 'flex' : 'hidden'} md:flex flex-col items-center text-center`}>
            <div
              className="w-full max-w-[300px] sm:max-w-[340px] h-[310px] sm:h-[360px] bg-[#FAF7F2] rounded-[32px] p-4 sm:p-5 border border-[#EAE4D5] flex flex-col justify-between overflow-hidden relative shadow-xs"
            >
              {/* Camera Lens */}
              <div className="w-3 h-3 bg-[#1C1917] rounded-full mx-auto mb-2" />

              {/* Scanner Screen */}
              <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#EAE4D5] text-left shadow-2xs space-y-2.5 flex-1 flex flex-col justify-center items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-[#5B6F00] rounded-2xl flex items-center justify-center bg-[#F1F5DC]/40 relative">
                  <QrCode className="w-16 h-16 text-[#5B6F00] opacity-80" />
                  <div className="absolute inset-x-3 top-1/2 h-0.5 bg-[#5B6F00] shadow-xs" />
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B6F00] text-white text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    ¡Sello Estampado!
                  </span>
                  <p className="text-[11px] text-[#78716C] mt-1">
                    Cliente Frecuente (Visita #8)
                  </p>
                </div>
              </div>

              <div className="text-center py-1 text-[10px] text-[#78716C]">
                Compatible con Chrome, Safari y cualquier cámara web
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 sm:mt-4 max-w-[300px]">
              <h3 className="hidden md:block text-[18px] leading-[22px] font-serif font-normal text-[#1C1917]">
                Para tu mostrador
              </h3>
              <p className="text-[12px] sm:text-[14px] leading-[17px] sm:leading-[19px] text-[#57534E] mt-1">
                El encargado abre el escáner web en segundos. Un clic y el sello queda registrado y respaldado en la nube.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. WARM SUPPORT PANEL (ASSISTED DECISION CHAPTER)
      ───────────────────────────────────────────────────────────── */}
      <section className="min-h-[55dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-12 px-5 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full flex items-center justify-center">
        <div
          className="max-w-[848px] w-full mx-auto bg-[#F5F1E8] rounded-[28px] p-6 sm:p-10 border border-[#EAE4D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs"
        >
          <div className="space-y-3 text-left max-w-[500px]">
            <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#5B6F00] font-bold bg-[#F1F5DC] px-3 py-1 rounded-full border border-[#D9E2B3]">
              Acompañamiento personalizado
            </span>
            <h3 className="text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-serif font-normal text-[#1C1917] tracking-tight">
              ¿Quieres que configuremos tu tarjeta juntos?
            </h3>
            <p className="text-[14px] sm:text-[15px] leading-[21px] text-[#57534E]">
              Te ayudamos a diseñar tu pase con tu logo, definir la recompensa ideal para tu margen y capacitar a tu equipo en 15 minutos.
            </p>
            <ul className="space-y-2 pt-2 text-[13px] text-[#1C1917] sm:hidden">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                <span>Diseño de pase en Google Wallet incluido</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                <span>QR listo para imprimir en tu mostrador</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                <span>Capacitación rápida para tus cajeros</span>
              </li>
            </ul>
          </div>

          <a
            href="https://wa.me/573203282014?text=Hola!%20Quiero%20asesoría%20para%20crear%20mi%20tarjeta%20de%20sellos%20con%20Loyal"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto h-12 px-6 sm:px-7 rounded-full bg-[#1C1917] hover:bg-black text-white text-[14px] sm:text-[15px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2.5 shrink-0 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#B2C248]" />
            <span>Hablar con un especialista</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PRICING PLANS (COVERFLOW CAROUSEL ON MOBILE + 3-COL GRID ON DESKTOP)
      ───────────────────────────────────────────────────────────── */}
      <section id="precios" className="min-h-[75dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-8 sm:py-14 lg:py-16 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        <div className="max-w-[640px] mx-auto text-center mb-4 sm:mb-8 space-y-1.5 shrink-0">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 sm:py-1 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[#5B6F00]">
            Precios Claros
          </span>
          <h2 className="text-[22px] sm:text-[38px] lg:text-[44px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
            Planes transparentes, sin ataduras.
          </h2>
          <p className="hidden sm:block text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] text-[#57534E] font-normal">
            Comienza gratis hoy mismo y escala a medida que crece tu comunidad de clientes recurrentes.
          </p>
        </div>

        {/* Mobile Coverflow Carousel */}
        <div
          className="md:hidden relative w-full max-w-[400px] mx-auto select-none"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (delta < -40) {
              setActivePlanIndex((prev) => (prev + 1) % pricingPlans.length);
            } else if (delta > 40) {
              setActivePlanIndex((prev) => (prev - 1 + pricingPlans.length) % pricingPlans.length);
            }
            setTouchStartX(null);
          }}
        >
          <div className="relative h-[435px] flex items-center justify-center">
            {pricingPlans.map((plan, idx) => {
              const offset = idx - activePlanIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1 || (activePlanIndex === 0 && idx === pricingPlans.length - 1);
              const isRight = offset === 1 || (activePlanIndex === pricingPlans.length - 1 && idx === 0);

              let positionClass = 'opacity-0 pointer-events-none scale-75 z-0';
              if (isCenter) {
                positionClass = 'translate-x-0 scale-100 opacity-100 z-20';
              } else if (isLeft) {
                positionClass = '-translate-x-[58%] scale-[0.86] opacity-45 blur-[0.4px] z-10 cursor-pointer';
              } else if (isRight) {
                positionClass = 'translate-x-[58%] scale-[0.86] opacity-45 blur-[0.4px] z-10 cursor-pointer';
              }

              return (
                <div
                  key={plan.id}
                  onClick={() => !isCenter && setActivePlanIndex(idx)}
                  className={`absolute w-[78%] max-w-[295px] bg-[#FFFDF9] rounded-[28px] p-5 border transition-all duration-300 ease-out flex flex-col justify-between ${
                    plan.featured && isCenter
                      ? 'border-2 border-[#5B6F00] shadow-[0_20px_44px_rgba(40,30,10,0.14)]'
                      : 'border-[#EAE4D5] shadow-[0_12px_30px_rgba(40,30,10,0.08)]'
                  } ${positionClass}`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                        plan.featured ? 'text-[#5B6F00]' : 'text-[#9A6B2F]'
                      }`}
                    >
                      {plan.eyebrow}
                    </span>
                    <h3 className="text-[20px] font-serif font-normal text-[#1C1917] mt-0.5 leading-snug">
                      {plan.title}
                    </h3>
                    <p className="text-[11.5px] text-[#57534E] leading-snug mt-1">
                      {plan.subtitle}
                    </p>

                    {/* Highlighted Price Box */}
                    <div className="my-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-center">
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-[28px] font-serif font-normal text-[#1C1917] tracking-tight leading-none">
                          {plan.price}
                        </span>
                        <span className="text-[11px] font-mono text-[#78716C]">{plan.period}</span>
                      </div>
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[10.5px] font-bold text-[#5B6F00]">
                        {plan.dailyBadge}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 text-[12px] text-[#1C1917]">
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          className={`flex items-start gap-2 ${
                            feat.included ? 'text-[#1C1917]' : 'text-[#A89F91]'
                          }`}
                        >
                          {feat.included ? (
                            <Check className="w-3.5 h-3.5 text-[#5B6F00] shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-[#A89F91] shrink-0 mt-0.5" />
                          )}
                          <span className="leading-tight">{feat.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.ctaAction === 'modal' ? (
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full mt-4 h-10 rounded-full bg-[#1C1917] hover:bg-black text-white text-[12px] font-bold uppercase tracking-wider transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B2C248]" />
                    </button>
                  ) : (
                    <a
                      href={plan.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full mt-4 h-10 rounded-full text-white text-[12px] font-bold uppercase tracking-wider transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer ${
                        plan.featured
                          ? 'shadow-[0_4px_14px_rgba(91,111,0,0.28)]'
                          : 'bg-[#1C1917] hover:bg-black'
                      }`}
                      style={
                        plan.featured
                          ? { background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)' }
                          : undefined
                      }
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B2C248]" />
                    </a>
                  )}
                </div>
              );
            })}

            {/* Left / Right Floating Arrows */}
            <button
              type="button"
              aria-label="Plan anterior"
              onClick={() =>
                setActivePlanIndex((prev) => (prev - 1 + pricingPlans.length) % pricingPlans.length)
              }
              className="absolute left-1 z-30 w-9 h-9 rounded-full bg-[#FFFDF9]/95 border border-[#EAE4D5] shadow-md flex items-center justify-center text-[#1C1917] hover:bg-[#FAF7F2] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente plan"
              onClick={() => setActivePlanIndex((prev) => (prev + 1) % pricingPlans.length)}
              className="absolute right-1 z-30 w-9 h-9 rounded-full bg-[#FFFDF9]/95 border border-[#EAE4D5] shadow-md flex items-center justify-center text-[#1C1917] hover:bg-[#FAF7F2] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {pricingPlans.map((plan, idx) => (
              <button
                key={plan.id}
                type="button"
                aria-label={`Ver ${plan.title}`}
                onClick={() => setActivePlanIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activePlanIndex ? 'w-6 bg-[#5B6F00]' : 'w-2 bg-[#D5D5D2]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop 3-Column Pricing Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7 max-w-[1080px] mx-auto w-full items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#FFFDF9] rounded-[28px] p-6 border flex flex-col justify-between relative transition-all ${
                plan.featured
                  ? 'border-2 border-[#5B6F00] shadow-[0_12px_32px_rgba(91,111,0,0.12)]'
                  : 'border-[#EAE4D5] hover:border-[#DDD5C3] shadow-[0_4px_12px_rgba(40,30,10,0.03)]'
              }`}
            >
              <div>
                <span
                  className={`text-[11px] font-mono uppercase tracking-wider font-bold block ${
                    plan.featured ? 'text-[#5B6F00]' : 'text-[#9A6B2F]'
                  }`}
                >
                  {plan.eyebrow}
                </span>
                <h3 className="text-[22px] font-serif font-normal text-[#1C1917] mt-1">
                  {plan.title}
                </h3>
                <p className="text-[13px] text-[#57534E] leading-relaxed mt-1">
                  {plan.subtitle}
                </p>

                <div className="my-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-[36px] font-serif font-normal text-[#1C1917] tracking-tight leading-none">
                      {plan.price}
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">{plan.period}</span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[11px] font-bold text-[#5B6F00]">
                    {plan.dailyBadge}
                  </span>
                </div>

                <ul className="space-y-2.5 text-[13px] text-[#1C1917] pt-1">
                  {plan.features.map((feat) => (
                    <li
                      key={feat.text}
                      className={`flex items-start gap-2 ${
                        feat.included ? 'text-[#1C1917]' : 'text-[#A89F91]'
                      }`}
                    >
                      {feat.included ? (
                        <Check className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-[#A89F91] shrink-0 mt-0.5" />
                      )}
                      <span>{feat.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.ctaAction === 'modal' ? (
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full mt-6 h-11 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[14px] font-bold transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#5B6F00]" />
                </button>
              ) : (
                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full mt-6 h-11 rounded-full text-white text-[14px] font-bold transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer ${
                    plan.featured
                      ? 'shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:bg-[#4D5E00]'
                      : 'bg-[#1C1917] hover:bg-black'
                  }`}
                  style={
                    plan.featured
                      ? { background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)' }
                      : undefined
                  }
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#B2C248]" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FREQUENTLY ASKED QUESTIONS (AIRBNB ACCORDION)
      ───────────────────────────────────────────────────────────── */}
      <section id="preguntas" className="min-h-[65dvh] max-h-[100dvh] lg:h-auto overflow-hidden py-10 sm:py-14 lg:py-14 px-5 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-center">
        <div className="max-w-[640px] mx-auto text-center mb-6 sm:mb-8 space-y-2 shrink-0">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[#78716C]">
            Preguntas Frecuentes
          </span>
          <h2 className="text-[26px] sm:text-[38px] lg:text-[44px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
            Respuestas claras para tu negocio.
          </h2>
          <p className="text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] text-[#57534E] font-normal">
            Todo lo que necesitas saber antes de implementar pases de fidelización.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="overflow-y-auto max-h-[62dvh] pr-1">
          <FusionAccordion items={faqItems} defaultOpenId="faq-1" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. BOTTOM CONVERSION BANNER & SOBER FOOTER
      ───────────────────────────────────────────────────────────── */}
      <section className="min-h-[55dvh] max-h-[100dvh] lg:h-auto overflow-hidden pt-10 sm:pt-14 lg:pt-16 px-5 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5] flex flex-col justify-between gap-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-[720px] mx-auto text-center space-y-5">
            <h2 className="text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.08] font-serif font-normal text-[#1C1917] tracking-tight">
              Tus clientes ya tienen el celular en la mano.
            </h2>
            <p className="text-[15px] sm:text-[19px] leading-[22px] sm:leading-[28px] text-[#57534E]">
              Dales una razón para volver esta semana con una experiencia cálida, rápida y sin cartones.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="h-11 sm:h-12 px-6 sm:px-8 rounded-full text-white text-[14px] sm:text-[16px] font-bold transition-all active:scale-[0.96] shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:bg-[#4D5E00] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
                }}
              >
                Crear mi tarjeta demo gratis
              </button>
              <Link
                href="/scanner"
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[14px] sm:text-[15px] font-bold transition-all active:scale-[0.96] flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Abrir escáner</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-[#EAE4D5] py-6 sm:py-10 -mx-5 sm:-mx-12 lg:-mx-20 px-5 sm:px-12 lg:px-20 bg-[#FAF7F2] text-xs text-[#78716C] shrink-0">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-loyal.png"
                alt="Loyal"
                className="w-6 h-6 rounded-lg object-cover shadow-2xs"
              />
              <span className="font-serif font-normal text-sm text-[#1C1917]">loyal</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Pases de fidelización digital con estética editorial</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:text-[#1C1917]">
                Admin
              </Link>
              <span>·</span>
              <Link href="/superadmin" className="hover:text-[#1C1917]">
                SuperAdmin
              </Link>
              <span>·</span>
              <Link href="/scanner" className="hover:text-[#1C1917]">
                Escáner
              </Link>
            </div>
          </div>
        </footer>
      </section>

      {/* ── Register Demo Modal ── */}
      <FusionRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
