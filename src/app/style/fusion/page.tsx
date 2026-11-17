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
  ChevronRight,
  Building2,
  Gift,
  Coffee,
  Scissors,
  Store,
} from 'lucide-react';
import { FusionNavigation } from '@/components/fusion/FusionNavigation';
import { FusionLoyaltyCard } from '@/components/fusion/FusionLoyaltyCard';
import { GranolaHeroTicket } from '@/components/granola/GranolaHeroTicket';
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

export default function FusionStylePage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
      <section className="relative min-h-screen min-h-[100dvh] pt-24 pb-12 sm:pt-28 sm:pb-16 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full py-2">
          
          {/* Left Column: 476px compact centered copy block */}
          <div className="lg:col-span-6 max-w-[520px] mx-auto lg:mx-0 text-left space-y-6">

            {/* Display Headline in Libre Baskerville Serif (Signature Granola Style) */}
            <h1 className="text-[38px] sm:text-[54px] lg:text-[64px] xl:text-[72px] leading-[0.98] font-serif font-normal text-[#1C1917] tracking-[-0.025em]">
              Fideliza clientes con tarjetas de sellos en su celular.
            </h1>

            {/* Hero Support Copy */}
            <p className="text-[18px] sm:text-[21px] lg:text-[22px] leading-[28px] sm:leading-[32px] lg:leading-[34px] text-[#57534E] font-normal">
              Pases inteligentes en Google Wallet y web. Sin tarjetas de cartón que se pierden y con escaneo en 1 segundo en tu mostrador.
            </p>

            {/* Actions: Primary Granola Olive Capsule & Pill Secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="h-12 px-7 rounded-full text-white text-[15px] sm:text-[16px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:shadow-[0_6px_20px_rgba(91,111,0,0.35)] hover:bg-[#4D5E00]"
                style={{
                  background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
                }}
              >
                <span>Crear tarjeta demo gratis</span>
                <ArrowRight className="w-4 h-4 text-[#B2C248]" />
              </button>

              <Link
                href="/style/fusion/scanner"
                className="h-12 px-6 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[15px] font-medium transition-all active:scale-[0.96] flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Ver escáner en mostrador</span>
              </Link>
            </div>

            {/* Discreet Trust Qualifiers */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-[13px] text-[#57534E]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5B6F00]" />
                Cero descargas de apps
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5B6F00]" />
                Google Wallet oficial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5B6F00]" />
                Listo en 15 minutos
              </span>
            </div>
          </div>

          {/* Right Column: Compact Granola Punch Ticket (Exact Content from Granola) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            {/* Ground radial shadow in warm tone */}
            <div
              className="absolute -bottom-8 w-[80%] h-20 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(40,30,10,0.14) 0%, rgba(40,30,10,0) 70%)',
              }}
            />

            <div id="experiencia" className="relative z-10 w-full max-w-[400px] flex justify-center">
              <GranolaHeroTicket
                onOpenRegister={() => setIsRegisterModalOpen(true)}
              />
            </div>
          </div>

        </div>

        {/* Subtle scroll cue at bottom of 100vh hero */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 opacity-40 hover:opacity-80 transition-opacity pointer-events-none">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#78716C]">Explorar</span>
          <div className="w-5 h-8 rounded-full border border-[#EAE4D5] flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#5B6F00] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TACTILE MINIATURES CAPABILITY FIELD (AIRBNB COMPONENTIZATION)
      ───────────────────────────────────────────────────────────── */}
      <section id="beneficios" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        {/* Centered Chapter Heading */}
        <div className="max-w-[640px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Todo lo que necesitas para fidelizar sin esfuerzo.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E] font-normal">
            Tecnología ligera con calidez editorial para la cercanía de tu mostrador diario.
          </p>
        </div>

        {/* 6 Miniature Capability Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-[1100px] mx-auto">
          {/* Item 1: Sello Digital */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="stamp" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Un toque en mostrador
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Tu cliente muestra su QR o acerca su teléfono y el sello se estampa al instante con un sonido agradable.
              </p>
            </div>
          </div>

          {/* Item 2: Google Wallet */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="wallet" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Siempre en su billetera
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Sin descargas en tiendas de apps. Se guarda nativamente en Google Wallet y en la pantalla de inicio de iPhone.
              </p>
            </div>
          </div>

          {/* Item 3: Notificaciones */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="bell" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Alertas amigables
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Recuerda con cariño a tus clientes cuando están a 1 o 2 sellos de reclamar su premio para que vuelvan esta semana.
              </p>
            </div>
          </div>

          {/* Item 4: Escáner Mostrador */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="scanner" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Cero hardware caro
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Funciona desde cualquier teléfono, tableta o laptop con cámara web que ya tengas en recepción o caja.
              </p>
            </div>
          </div>

          {/* Item 5: Métricas Claras */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="analytics" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Métricas de recurrencia
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Descubre qué días vuelven más clientes, qué premios motivan más visitas y quiénes son tus clientes más fieles.
              </p>
            </div>
          </div>

          {/* Item 6: Premio Personalizado */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D5] transition-all">
            <FusionMiniature type="gift" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Reglas a tu medida
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E]">
                Tú decides si son 6, 8 o 10 sellos, y si premias con un café gratis, un descuento porcentual o un tratamiento especial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN STORY TRIPTYCH (REAL LOCAL BUSINESS OUTCOMES)
      ───────────────────────────────────────────────────────────── */}
      <section id="historias" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[640px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Comercios reales que dijeron adiós al cartón.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E] font-normal">
            Desde cafeterías de especialidad hasta barberías y estudios, así cultivan la relación con sus clientes.
          </p>
        </div>

        {/* 3 Photo Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[948px] mx-auto">
          {/* Card 1 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)]"
          >
            <div className="relative h-[280px] bg-[#FAF7F2] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                alt="Café de especialidad y barista"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Café Varietale · Bogotá
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#1C1917] font-normal max-w-[220px] mx-auto">
                Elena reemplazó 2,000 tarjetas impresas con 84% de adopción en su primera semana.
              </p>
              <span className="inline-block mt-3 text-xs font-serif font-normal text-[#5B6F00]">
                +42% cafés recurrentes
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)]"
          >
            <div className="relative h-[280px] bg-[#FAF7F2] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
                alt="Barbería artesanal"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Grooming 93 · Medellín
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#1C1917] font-normal max-w-[220px] mx-auto">
                Mateo acortó el ciclo de visitas de 28 a 18 días premiando el 5º corte de barba.
              </p>
              <span className="inline-block mt-3 text-xs font-serif font-normal text-[#5B6F00]">
                Clientes vuelven cada 18 días
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="w-full bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EAE4D5] transition-all hover:-translate-y-1 shadow-[0_6px_16px_rgba(40,30,10,0.06)]"
          >
            <div className="relative h-[280px] bg-[#FAF7F2] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                alt="Estudio de Yoga y bienestar"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[11px] font-serif font-normal text-[#1C1917] border border-[#EAE4D5]">
                Yoga Shala & Wellness · Bogotá
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#1C1917] font-normal max-w-[220px] mx-auto">
                Andrea eliminó las libretas de papel y gestiona 120 alumnas frecuentes sin perder un pase.
              </p>
              <span className="inline-block mt-3 text-xs font-serif font-normal text-[#5B6F00]">
                120 pases activos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PORTRAITS CLUSTER & STACKED QUANTIFIED PROOF
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[700px] mx-auto text-center space-y-12">
          
          {/* Overlapping circular portraits */}
          <div className="flex items-center justify-center -space-x-4 sm:-space-x-6 py-4">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Central Largest Face */}
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-xl z-30 shrink-0 ring-4 ring-[#F1F5DC]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt="Líder de negocio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stacked Proof Statements in Serif */}
          <div className="space-y-8 max-w-[580px] mx-auto text-center divide-y divide-[#EAE4D5]">
            <div className="pt-2">
              <div className="text-[32px] sm:text-[40px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
                +38% más visitas repetidas
              </div>
              <p className="text-[16px] text-[#57534E] mt-2">
                Los clientes que guardan su pase digital regresan un promedio de 1.4 semanas antes a su próxima compra.
              </p>
            </div>

            <div className="pt-8">
              <div className="text-[32px] sm:text-[40px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
                Menos de 1 segundo por sello
              </div>
              <p className="text-[16px] text-[#57534E] mt-2">
                El escaneo óptico desde el celular o mostrador es instantáneo y no genera demoras en horas pico.
              </p>
            </div>

            <div className="pt-8">
              <div className="text-[32px] sm:text-[40px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
                94% de adopción frente al papel
              </div>
              <p className="text-[16px] text-[#57534E] mt-2">
                Nueve de cada diez clientes prefieren tener su tarjeta en Google Wallet en lugar de llenar su cartera de cartones.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. PAIRED CAPABILITY EXHIBITS (DEMONSTRATIONS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[640px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Dos lados de una experiencia impecable.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E] font-normal">
            Hecho para deleitar al cliente en su teléfono y facilitar el trabajo de tu equipo en mostrador.
          </p>
        </div>

        {/* Feature Grid: Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[848px] mx-auto">
          {/* Exhibit 1: Para el Cliente */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-[320px] sm:w-[360px] h-[460px] bg-[#FAF7F2] rounded-[36px] p-6 border border-[#EAE4D5] flex flex-col justify-between overflow-hidden relative shadow-xs"
            >
              {/* Phone Speaker Notch */}
              <div className="w-20 h-4 bg-[#1C1917] rounded-full mx-auto mb-4" />

              {/* In-device interface preview */}
              <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#EAE4D5] text-left shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#78716C]">Google Wallet</span>
                    <h4 className="text-sm font-serif font-normal text-[#1C1917]">Café Varietale</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F1F5DC] text-[10px] font-bold text-[#5B6F00] border border-[#D9E2B3]">
                    7 / 10 Sellos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <div
                      key={n}
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        n <= 7 ? 'bg-[#5B6F00] text-white' : 'bg-[#FAF7F2] text-[#A89F91] border border-dashed border-[#DDD5C3]'
                      }`}
                    >
                      {n <= 7 ? '✓' : n}
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[11px] text-[#57534E] flex items-center gap-2 border border-[#EAE4D5]">
                  <Gift className="w-3.5 h-3.5 text-[#5B6F00]" />
                  <span>Próximo sello desbloquea café gratis</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="text-center py-2 text-[11px] text-[#78716C]">
                Disponible sin conexión · Notificaciones de cercanía
              </div>
            </div>

            {/* Caption */}
            <div className="mt-6 max-w-[320px]">
              <h3 className="text-[18px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Para tus clientes
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E] mt-1.5">
                Su tarjeta siempre a mano en la pantalla de bloqueo. Sin contraseñas ni apps que actualizar.
              </p>
            </div>
          </div>

          {/* Exhibit 2: Para el Mostrador */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-[320px] sm:w-[360px] h-[460px] bg-[#FAF7F2] rounded-[36px] p-6 border border-[#EAE4D5] flex flex-col justify-between overflow-hidden relative shadow-xs"
            >
              {/* Camera Lens */}
              <div className="w-3 h-3 bg-[#1C1917] rounded-full mx-auto mb-4" />

              {/* Scanner Screen */}
              <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#EAE4D5] text-left shadow-2xs space-y-3 flex-1 flex flex-col justify-center items-center">
                <div className="w-36 h-36 border-2 border-dashed border-[#5B6F00] rounded-2xl flex items-center justify-center bg-[#F1F5DC]/40 relative">
                  <QrCode className="w-20 h-20 text-[#5B6F00] opacity-80" />
                  <div className="absolute inset-x-3 top-1/2 h-0.5 bg-[#5B6F00] shadow-xs" />
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B6F00] text-white text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    ¡Sello Estampado!
                  </span>
                  <p className="text-[11px] text-[#78716C] mt-1">
                    Cliente: Camila Restrepo (Visita #8)
                  </p>
                </div>
              </div>

              <div className="text-center py-2 text-[11px] text-[#78716C]">
                Compatible con Chrome, Safari y cualquier cámara web
              </div>
            </div>

            {/* Caption */}
            <div className="mt-6 max-w-[320px]">
              <h3 className="text-[19px] leading-[24px] font-serif font-normal text-[#1C1917]">
                Para tu mostrador
              </h3>
              <p className="text-[15px] leading-[22px] text-[#57534E] mt-1.5">
                El encargado abre el escáner web en segundos. Un clic y el sello queda registrado y respaldado en la nube.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. WARM SUPPORT PANEL (ASSISTED DECISION CHAPTER)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full">
        <div
          className="max-w-[848px] mx-auto bg-[#F5F1E8] rounded-[28px] p-8 sm:p-10 border border-[#EAE4D5] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs"
        >
          <div className="space-y-2 text-left max-w-[500px]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5B6F00] font-bold">
              Acompañamiento personalizado
            </span>
            <h3 className="text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-serif font-normal text-[#1C1917] tracking-tight">
              ¿Quieres que configuremos tu tarjeta juntos?
            </h3>
            <p className="text-[15px] leading-[22px] text-[#57534E]">
              Te ayudamos a diseñar tu pase con tu logo, definir la recompensa ideal para tu margen y capacitar a tu equipo en 15 minutos.
            </p>
          </div>

          <a
            href="https://wa.me/573203282014?text=Hola!%20Quiero%20asesoría%20para%20crear%20mi%20tarjeta%20de%20sellos%20con%20Loyal"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-7 rounded-full bg-[#1C1917] hover:bg-black text-white text-[15px] font-medium transition-all active:scale-[0.96] flex items-center gap-2.5 shrink-0 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#B2C248]" />
            <span>Hablar con un especialista</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PRICING PLANS (AIRBNB STYLE SOBER SUBSCRIPTION IN GRANOLA TONES)
      ───────────────────────────────────────────────────────────── */}
      <section id="precios" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[640px] mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[#5B6F00]">
            Precios Claros
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Planes transparentes, sin ataduras.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E] font-normal">
            Comienza gratis hoy mismo y escala a medida que crece tu comunidad de clientes recurrentes.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1080px] mx-auto items-stretch">
          
          {/* Plan 1: Starter */}
          <div
            className="bg-[#FFFDF9] rounded-[28px] p-8 border border-[#EAE4D5] flex flex-col justify-between transition-all hover:border-[#DDD5C3] shadow-[0_4px_12px_rgba(40,30,10,0.03)]"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-bold">
                Starter
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-serif font-normal text-[#1C1917] tracking-tight">$0</span>
                <span className="text-sm text-[#78716C]">/ mes</span>
              </div>
              <p className="text-[14px] text-[#57534E] leading-relaxed mb-6">
                Para negocios que quieren digitalizar su primera tarjeta de sellos sin costo fijo.
              </p>

              <ul className="space-y-3 text-sm text-[#1C1917] border-t border-[#EAE4D5] pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>1 punto de venta / mostrador</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Hasta 100 clientes activos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Pases Google Wallet & Web</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Escáner QR ilimitado</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full mt-8 h-12 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[15px] font-bold transition-all active:scale-[0.96] cursor-pointer"
            >
              Empezar Gratis
            </button>
          </div>

          {/* Plan 2: Pro (Destacado con Granola Olive Capsule) */}
          <div
            className="bg-[#FFFDF9] rounded-[28px] p-8 border-2 border-[#5B6F00] flex flex-col justify-between relative transition-all shadow-[0_12px_32px_rgba(91,111,0,0.12)]"
          >
            {/* Recommendation Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs" style={{ background: 'linear-gradient(135deg, #5B6F00, #4D5E00)' }}>
              Más Popular
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#5B6F00] font-bold">
                Pro Negocios
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-serif font-normal text-[#1C1917] tracking-tight">$29</span>
                <span className="text-xs text-[#78716C] font-mono">USD / mes (o $79.000 COP)</span>
              </div>
              <p className="text-[14px] text-[#57534E] leading-relaxed mb-6">
                Para comercios en crecimiento que buscan fidelizar sin límites y con analítica.
              </p>

              <ul className="space-y-3 text-sm text-[#1C1917] border-t border-[#EAE4D5] pt-6">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Clientes y sellos ilimitados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Múltiples cajeros y terminales</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Logo y colores personalizados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Métricas de retención y visitas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Soporte prioritario por WhatsApp</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Quiero%20suscribirme%20al%20plan%20Pro%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 h-12 rounded-full text-white text-[15px] font-bold transition-all active:scale-[0.96] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:bg-[#4D5E00] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
              }}
            >
              <span>Elegir Plan Pro</span>
              <ArrowRight className="w-4 h-4 text-[#B2C248]" />
            </a>
          </div>

          {/* Plan 3: Enterprise */}
          <div
            className="bg-[#FFFDF9] rounded-[28px] p-8 border border-[#EAE4D5] flex flex-col justify-between transition-all hover:border-[#DDD5C3] shadow-[0_4px_12px_rgba(40,30,10,0.03)]"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-bold">
                Enterprise
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-serif font-normal text-[#1C1917] tracking-tight">$89</span>
                <span className="text-xs text-[#78716C] font-mono">USD / mes (o $249.000 COP)</span>
              </div>
              <p className="text-[14px] text-[#57534E] leading-relaxed mb-6">
                Para franquicias, cadenas y marcas con múltiples sucursales que requieren integración POS.
              </p>

              <ul className="space-y-3 text-sm text-[#1C1917] border-t border-[#EAE4D5] pt-6">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Sucursales y cajas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>API para facturación y POS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Subdominio personalizado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
                  <span>Gerente de cuenta dedicado</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Quiero%20información%20del%20plan%20Enterprise%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 h-12 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[15px] font-bold transition-all active:scale-[0.96] flex items-center justify-center cursor-pointer"
            >
              Contactar Ventas
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FREQUENTLY ASKED QUESTIONS (AIRBNB ACCORDION)
      ───────────────────────────────────────────────────────────── */}
      <section id="preguntas" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[640px] mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[#78716C]">
            Preguntas Frecuentes
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Respuestas claras para tu negocio.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E] font-normal">
            Todo lo que necesitas saber antes de implementar pases de fidelización.
          </p>
        </div>

        {/* Accordion Component */}
        <FusionAccordion items={faqItems} defaultOpenId="faq-1" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. BOTTOM CONVERSION BANNER & SOBER FOOTER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#EAE4D5]">
        <div className="max-w-[720px] mx-auto text-center space-y-6">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.05] font-serif font-normal text-[#1C1917] tracking-tight">
            Tus clientes ya tienen el celular en la mano.
          </h2>
          <p className="text-[18px] sm:text-[21px] leading-[28px] sm:leading-[32px] text-[#57534E]">
            Dales una razón para volver esta semana con una experiencia cálida, rápida y sin cartones.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="h-12 px-8 rounded-full text-white text-[16px] font-bold transition-all active:scale-[0.96] shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:bg-[#4D5E00] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
              }}
            >
              Crear mi tarjeta demo gratis
            </button>
            <Link
              href="/style/fusion/scanner"
              className="h-12 px-6 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-[15px] font-bold transition-all active:scale-[0.96] flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-[#5B6F00]" />
              <span>Abrir escáner</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#EAE4D5] py-12 px-6 sm:px-12 lg:px-20 bg-[#FAF7F2] text-xs text-[#78716C]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-normal text-sm text-[#1C1917]">loyal</span>
            <span>·</span>
            <span>Pases de fidelización digital con estética editorial</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-[#1C1917]">
              Panel de Administración
            </Link>
            <span>·</span>
            <Link href="/superadmin" className="hover:text-[#1C1917]">
              SuperAdmin
            </Link>
            <span>·</span>
            <Link href="/style/fusion/scanner" className="hover:text-[#1C1917]">
              Escáner
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Register Demo Modal ── */}
      <FusionRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
