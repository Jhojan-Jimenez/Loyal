'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import {
  QrCode,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Check,
  ShieldCheck,
  Smartphone,
  Store,
  Heart,
  Clock,
} from 'lucide-react';
import { useLoyal } from '@/context/LoyalContext';
import { GranolaNav } from '@/components/granola/GranolaNav';
import { GranolaCollage } from '@/components/granola/GranolaCollage';
import { GranolaCard } from '@/components/granola/GranolaCard';
import { GranolaHeroTicket } from '@/components/granola/GranolaHeroTicket';
import { GranolaAccordion, GranolaFaqItem } from '@/components/granola/GranolaAccordion';
import { GranolaRegisterModal } from '@/components/granola/GranolaRegisterModal';
import { GranolaWordmark } from '@/components/granola/GranolaWordmark';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-granola-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-granola-sans',
  display: 'swap',
});

export default function GranolaStylePage() {
  const { students, config } = useLoyal();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Demo student fallback
  const demoStudent =
    students.find((s) => s.token === 'camila-restrepo-yoga') ||
    students[0] || {
      id: 'std_demo_1',
      name: 'Camila Restrepo',
      phone: '+57 320 328 2014',
      token: 'camila-restrepo-yoga',
      stamps: 7,
      totalCompletedCycles: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  // Real merchant FAQ items with warm tone
  const faqItems: GranolaFaqItem[] = [
    {
      id: 'faq-1',
      question: '¿Mis clientes necesitan descargar una app pesada?',
      answer:
        'No. Esa es la esencia de Loyal. Tus clientes no tienen que buscar en la App Store, ni crear contraseñas, ni gastar espacio en su teléfono. La tarjeta se abre al instante en el navegador web y se guarda con un toque en Google Wallet (en Android) o en la pantalla de inicio (en iPhone).',
    },
    {
      id: 'faq-2',
      question: '¿Cómo funciona la integración con Google Wallet?',
      answer:
        'Loyal utiliza la API oficial de Google Wallet Passes. Con solo pulsar "Guardar en Google Wallet", el pase se almacena de forma nativa en la billetera del cliente junto a sus tarjetas bancarias. Funciona sin conexión a internet y puede enviar notificaciones geolocalizadas cuando el cliente pasa cerca de tu local.',
    },
    {
      id: 'faq-3',
      question: '¿Cómo estampamos los sellos en el mostrador?',
      answer:
        'Tu personal de caja abre nuestro Escáner de Mostrador (/scanner) desde cualquier celular, tableta o laptop que ya tengas en el punto de venta. Al escanear el código QR del pase del cliente, el sello se valida y se suma en menos de un segundo.',
    },
    {
      id: 'faq-4',
      question: '¿Cómo se evitan los sellos fraudulentos o duplicados?',
      answer:
        'Cada sello requiere una firma generada por el escáner del comercio autorizado. Los clientes no pueden añadir sellos por su cuenta; su código QR es únicamente un identificador seguro y solo tu escáner autenticado puede emitir visitas.',
    },
    {
      id: 'faq-5',
      question: '¿Puedo tener varias cajas o meseros sellando al mismo tiempo?',
      answer:
        'Sí. Puedes autorizar múltiples dispositivos de mostrador simultáneos. Si tienes dos cajas o meseros con su propio celular, todos pueden estampar visitas y los datos se consolidan en tu panel en tiempo real.',
    },
    {
      id: 'faq-6',
      question: '¿Cuánto tiempo toma poner en marcha Loyal en mi negocio?',
      answer:
        'Menos de 10 minutos. Defines cuántos sellos requiere tu tarjeta (ej. 8 o 10 visitas), cuál es el premio para tu cliente y subes tu logo. Imprimes el código QR de registro en tu mostrador o mesas y tus clientes empiezan a coleccionar sellos hoy mismo.',
    },
  ];

  return (
    <div
      className={`${libreBaskerville.variable} ${dmSans.variable} font-sans min-h-screen bg-[#FFFFFF] text-[#292929] selection:bg-[#E5EACD] selection:text-[#5B6F00] antialiased`}
    >
      {/* ── Granola Floating Capsule Navigation ── */}
      <GranolaNav onOpenDemo={() => setIsRegisterOpen(true)} />

      {/* ── Modal for Demo Creation ── */}
      <GranolaRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <main>
        {/* ─────────────────────────────────────────────────────────────
            1. FIRST SCREEN: TACTILE PRODUCT OPENING (ASYMMETRIC DESK STAGE)
        ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 max-w-[1280px] mx-auto w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[680px]">
            {/* Left Column: Narrow 4-line promise + Olive Action */}
            <div className="lg:col-span-6 max-w-[540px] z-10 space-y-6">

              {/* Display Headline: Serif, regular 400, tight line height */}
              <h1 className="font-serif text-[42px] sm:text-[62px] lg:text-[76px] xl:text-[84px] font-normal leading-[0.93] tracking-[-0.025em] text-[#292929]">
                Tarjetas de sellos para negocios que aman a sus clientes.
              </h1>

              {/* Lead support lines (2 short sentences) */}
              <p className="font-sans text-[18px] sm:text-[20px] leading-[1.4] text-[#72726E] font-normal max-w-[480px]">
                Fidelización digital sin cartones que se pierden ni aplicaciones pesadas.
                Pases oficiales en Google Wallet y escaneo en un segundo en tu mostrador.
              </p>

              {/* Action Pair */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="h-14 px-7 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-[16px] font-sans font-medium inline-flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Crear tarjeta demo gratis</span>
                  <ArrowDown className="w-4 h-4 opacity-90" />
                </button>

                <Link
                  href="/style/granola/scanner"
                  className="h-14 px-6 rounded-full bg-transparent border border-[#292929] hover:bg-[#292929]/5 text-[#292929] text-[16px] font-sans font-medium inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <QrCode className="w-4 h-4 text-[#5B6F00]" />
                  <span>Ver escáner de caja</span>
                </Link>
              </div>

              {/* Caption */}
              <p className="text-[13px] font-sans text-[#72726E] pt-1">
                Listo para cafeterías, estudios de yoga, barberías y tiendas de barrio.
              </p>
            </div>

            {/* Right Column: Compact Granola Punch Ticket */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[400px] flex justify-center">
                <GranolaHeroTicket
                  onOpenRegister={() => setIsRegisterOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2. MOVING PROMPT PILLS: REAL TASKS CAROUSEL
        ───────────────────────────────────────────────────────────── */}
        <section className="py-6 border-y border-[#D5D5D2] bg-[#F7F7F2]/50 overflow-hidden select-none">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm font-sans">
              {[
                'Escanear QR de cliente en mostrador',
                'Guardar pase en Google Wallet',
                'Sellar visita en 0.8 segundos',
                'Recompensar al completar 10 sellos',
                'Alertas por proximidad al local',
                'Sin descargas en App Store',
              ].map((task, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-[#D5D5D2] rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.03)] text-[#292929]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00]">
                    <ArrowRight className="w-3 h-3 transform -rotate-45" />
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. CHAPTER TRANSITION & WORKFLOW RAIL
        ───────────────────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-[1280px] mx-auto">
          {/* Section Header */}
          <div className="max-w-[768px] mb-16 sm:mb-20">
            <span className="font-serif text-sm tracking-wider uppercase text-[#5B6F00] block mb-3">
              Ritual de Fidelización
            </span>
            <h2 className="font-serif text-[36px] sm:text-[54px] lg:text-[68px] font-normal leading-[0.98] tracking-[-0.02em] text-[#292929]">
              Un gesto noble que tus clientes quieren repetir.
            </h2>
            <p className="font-sans text-[17px] sm:text-[19px] leading-[1.5] text-[#72726E] mt-4">
              Diseñamos cada pantalla para que se sienta como un artefacto físico noble:
              el peso del papel, la claridad de la tinta y la inmediatez de la tecnología moderna.
            </p>
          </div>

          {/* 3-Step Physical Workflow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-[#FFFFFF] border border-[#D5D5D2] rounded-2xl p-7 flex flex-col justify-between hover:border-[#5B6F00]/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F7F7F2] border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00] font-serif text-lg mb-6">
                  1
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#292929] leading-tight mb-3">
                  Registro sin fricción
                </h3>
                <p className="font-sans text-[15px] leading-[1.5] text-[#72726E]">
                  Tu cliente escanea el QR en tu mesa o mostrador. Ingresa su nombre y teléfono en 5 segundos.
                  Cero contraseñas y sin descargar apps.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#D5D5D2]/60 flex items-center gap-2 text-xs text-[#72726E]">
                <Smartphone className="w-4 h-4 text-[#5B6F00]" />
                <span>Web táctil adaptativa</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFFFFF] border border-[#D5D5D2] rounded-2xl p-7 flex flex-col justify-between hover:border-[#5B6F00]/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#E5EACD] border border-[#5B6F00]/30 flex items-center justify-center text-[#5B6F00] font-serif text-lg mb-6">
                  2
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#292929] leading-tight mb-3">
                  Sello en un segundo
                </h3>
                <p className="font-sans text-[15px] leading-[1.5] text-[#72726E]">
                  En cada visita, el cliente muestra su pase en pantalla o desde Google Wallet. Tu cajero escanea
                  el código y el sello se estampa al instante.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#D5D5D2]/60 flex items-center gap-2 text-xs text-[#72726E]">
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Escáner web en caja</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFFFFF] border border-[#D5D5D2] rounded-2xl p-7 flex flex-col justify-between hover:border-[#5B6F00]/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] font-serif text-lg mb-6">
                  3
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#292929] leading-tight mb-3">
                  Recompensa y retorno
                </h3>
                <p className="font-sans text-[15px] leading-[1.5] text-[#72726E]">
                  Al completar los 10 sellos, la tarjeta se ilumina y celebra con el cliente.
                  Canjea su premio en caja y reinicia el ciclo automáticamente.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#D5D5D2]/60 flex items-center gap-2 text-xs text-[#72726E]">
                <Sparkles className="w-4 h-4 text-[#5B6F00]" />
                <span>+42% de recurrencia probada</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. WIDE CAPABILITY CHAPTER: NATURE & CRAFT STAGE
        ───────────────────────────────────────────────────────────── */}
        <section id="producto" className="py-20 sm:py-28 bg-[#F7F7F2] border-y border-[#D5D5D2]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
            {/* Header Row: 32px feature title left, 448px description right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
              <div className="lg:col-span-7">
                <span className="font-serif text-sm text-[#5B6F00] tracking-wider uppercase block mb-2">
                  Capacidad de Producto
                </span>
                <h2 className="font-serif text-[32px] sm:text-[44px] font-normal leading-[1.05] tracking-[-0.015em] text-[#292929]">
                  El encanto del papel artesanal, con la inteligencia de la nube.
                </h2>
              </div>
              <div className="lg:col-span-5 max-w-[448px]">
                <p className="font-sans text-[18px] sm:text-[20px] leading-[1.4] text-[#72726E]">
                  Olvídate de mandar a imprimir cartones que terminan en la lavadora o en la basura.
                  Loyal vive donde tus clientes ya están: en la billetera de su teléfono inteligente.
                </p>
              </div>
            </div>

            {/* Staged Interface Composition */}
            <div className="relative rounded-2xl bg-white border border-[#D5D5D2] p-8 sm:p-12 overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {/* Pillar 1 */}
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F7F2] border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00]">
                    <Store className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#292929]">
                    Personalizable a tu marca
                  </h3>
                  <p className="font-sans text-sm text-[#72726E] leading-relaxed">
                    Sube tu logotipo, escoge tu paleta de colores y redacta la recompensa exacta: un café de origen, una sesión de yoga o un corte de autor.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F7F2] border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#292929]">
                    Auditoría en tiempo real
                  </h3>
                  <p className="font-sans text-sm text-[#72726E] leading-relaxed">
                    Visualiza cuántas visitas se registraron hoy, qué horas son las más activas y qué clientes están a un sello de completar su ciclo.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F7F2] border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#292929]">
                    Firma criptográfica anti-fraude
                  </h3>
                  <p className="font-sans text-sm text-[#72726E] leading-relaxed">
                    Imposible de duplicar o falsificar. Cada sello lleva un sello temporal cifrado emitido exclusivamente por el terminal de tu caja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. GREEN CHAPTER BAND (#B2C248)
        ───────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-[#B2C248] text-[#292929] overflow-hidden select-none">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="max-w-[840px] mx-auto text-center space-y-6">
              <span className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#5B6F00] px-3 py-1 rounded-full bg-white/70">
                Velocidad en Mostrador
              </span>

              <h2 className="font-serif text-[38px] sm:text-[56px] lg:text-[68px] font-normal leading-[0.96] tracking-[-0.02em] text-[#0E0F0C]">
                Un segundo en caja. Cero filas, cero esperas.
              </h2>

              <p className="font-sans text-[18px] sm:text-[21px] leading-[1.4] text-[#292929]/80 font-normal max-w-[620px] mx-auto">
                No hagas esperar a tus clientes mientras pagan. Abre el escáner web en cualquier teléfono, apunta al código y la visita queda guardada.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/style/granola/scanner"
                  className="h-13 px-8 rounded-full bg-[#0E0F0C] hover:bg-[#292929] text-[#FCFCF8] text-sm font-sans font-medium inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#B2C248]" />
                  <span>Abrir Escáner de Prueba Ahora</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. DARK PROOF CHAPTER (#292929)
        ───────────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32 bg-[#292929] text-white overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="max-w-[880px] mx-auto text-center space-y-8">
              {/* Monogram / Category */}
              <span className="font-serif text-sm tracking-wider uppercase text-[#B2C248] block">
                Comercios Reales · Testimonio
              </span>

              {/* Serif Quotation */}
              <blockquote className="font-serif text-[28px] sm:text-[40px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.015em] text-[#FCFCF8]">
                «Cambiamos las tarjetas de cartón por Loyal y nuestra tasa de clientes que vuelven en menos de 14 días subió un 42%. A la gente le fascina ver su sello en Google Wallet.»
              </blockquote>

              <div className="pt-2">
                <p className="font-sans text-base font-medium text-[#FCFCF8]">
                  Mariana Ospina
                </p>
                <p className="font-sans text-sm text-[#B2C248]">
                  Fundadora de Café Origen & Botánica · Usaquén, Bogotá
                </p>
              </div>

              {/* 3 Compact Stat Tiles in Warm Paper (#F7F7F2) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-[#292929]">
                <div className="bg-[#F7F7F2] rounded-xl p-6 text-left border border-[#D5D5D2]">
                  <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5B6F00] block mb-1">
                    +42%
                  </span>
                  <span className="font-sans text-xs text-[#72726E] leading-tight block">
                    Incremento en visitas recurrentes durante el primer mes de uso.
                  </span>
                </div>

                <div className="bg-[#F7F7F2] rounded-xl p-6 text-left border border-[#D5D5D2]">
                  <span className="font-serif text-3xl sm:text-4xl font-normal text-[#292929] block mb-1">
                    0 apps
                  </span>
                  <span className="font-sans text-xs text-[#72726E] leading-tight block">
                    Cero descargas requeridas. Funciona en cualquier navegador y Google Wallet.
                  </span>
                </div>

                <div className="bg-[#F7F7F2] rounded-xl p-6 text-left border border-[#D5D5D2]">
                  <span className="font-serif text-3xl sm:text-4xl font-normal text-[#5B6F00] block mb-1">
                    0.8s
                  </span>
                  <span className="font-sans text-xs text-[#72726E] leading-tight block">
                    Tiempo promedio de lectura del código QR en el mostrador de caja.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. PRICING CHAPTER: PLAN CARDS
        ───────────────────────────────────────────────────────────── */}
        <section id="planes" className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-[1280px] mx-auto">
          <div className="max-w-[768px] mx-auto text-center mb-16 sm:mb-20">
            <span className="font-serif text-sm tracking-wider uppercase text-[#5B6F00] block mb-2">
              Suscripciones Transparentes
            </span>
            <h2 className="font-serif text-[38px] sm:text-[54px] font-normal leading-[1] tracking-[-0.015em] text-[#292929]">
              Precios honestos, pensados para crecer.
            </h2>
            <p className="font-sans text-[17px] text-[#72726E] mt-3">
              Todos los planes incluyen 14 días de prueba gratuita. Sin contratos forzosos.
            </p>
          </div>

          {/* 3 Equal Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-[1120px] mx-auto items-stretch">
            {/* Plan 1: Starter */}
            <div className="bg-[#FFFFFF] border border-[#D5D5D2] rounded-2xl p-7 flex flex-col justify-between hover:border-[#292929] transition-all">
              <div>
                <span className="font-serif text-xl font-normal text-[#292929] block">
                  Artesanal
                </span>
                <p className="text-xs text-[#72726E] mt-1 mb-5">
                  Para cafeterías de barrio y estudios emergentes.
                </p>

                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#D5D5D2]/60">
                  <span className="font-serif text-4xl font-normal text-[#292929]">
                    $19
                  </span>
                  <span className="text-xs text-[#72726E]">USD / mes</span>
                </div>

                <ul className="space-y-3 font-sans text-xs text-[#292929]">
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>1 Local o Mostrador</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Hasta 300 clientes activos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Escáner web ilimitado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Pases web adaptativos</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D5D5D2]/60">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full h-11 rounded-full bg-[#F7F7F2] hover:bg-[#EAEBE5] text-[#292929] border border-[#D5D5D2] text-xs font-medium transition-colors cursor-pointer"
                >
                  Comenzar prueba
                </button>
              </div>
            </div>

            {/* Plan 2: Pro (Highlighted) */}
            <div className="bg-[#FFFFFF] border-2 border-[#5B6F00] rounded-2xl p-7 flex flex-col justify-between shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#5B6F00] text-[#FCFCF8] text-[10px] font-sans font-semibold uppercase tracking-wider">
                Más popular
              </span>

              <div>
                <span className="font-serif text-xl font-normal text-[#292929] block">
                  Negocio Pro
                </span>
                <p className="text-xs text-[#72726E] mt-1 mb-5">
                  Para comercios activos que buscan máxima recurrencia.
                </p>

                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#D5D5D2]/60">
                  <span className="font-serif text-4xl font-normal text-[#292929]">
                    $49
                  </span>
                  <span className="text-xs text-[#72726E]">USD / mes</span>
                </div>

                <ul className="space-y-3 font-sans text-xs text-[#292929]">
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Hasta 3 Locales simultáneos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Clientes activos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Pases oficiales en Google Wallet</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Múltiples cajeros y terminales</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#5B6F00] flex items-center justify-center text-[#FCFCF8] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Alertas por geolocalización</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D5D5D2]/60">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full h-11 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  Probar Plan Pro gratis
                </button>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-[#FFFFFF] border border-[#D5D5D2] rounded-2xl p-7 flex flex-col justify-between hover:border-[#292929] transition-all">
              <div>
                <span className="font-serif text-xl font-normal text-[#292929] block">
                  Cadenas & Franquicias
                </span>
                <p className="text-xs text-[#72726E] mt-1 mb-5">
                  Para redes con múltiples sedes y sistemas POS.
                </p>

                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#D5D5D2]/60">
                  <span className="font-serif text-4xl font-normal text-[#292929]">
                    $99
                  </span>
                  <span className="text-xs text-[#72726E]">USD / mes</span>
                </div>

                <ul className="space-y-3 font-sans text-xs text-[#292929]">
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Sedes ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Dominio propio personalizado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Integración con software de caja</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#E5EACD] flex items-center justify-center text-[#5B6F00] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>Soporte prioritario por WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D5D5D2]/60">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full h-11 rounded-full bg-[#F7F7F2] hover:bg-[#EAEBE5] text-[#292929] border border-[#D5D5D2] text-xs font-medium transition-colors cursor-pointer"
                >
                  Hablar con nosotros
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. FAQ SECTION (EDITORIAL ACCORDION)
        ───────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#F7F7F2] border-t border-[#D5D5D2]">
          <div className="max-w-[768px] mx-auto text-left mb-12 sm:mb-16">
            <span className="font-serif text-sm tracking-wider uppercase text-[#5B6F00] block mb-2">
              Dudas Frecuentes
            </span>
            <h2 className="font-serif text-[36px] sm:text-[48px] font-normal leading-[1.05] tracking-[-0.015em] text-[#292929]">
              Preguntas de comercios antes de empezar.
            </h2>
          </div>

          <GranolaAccordion items={faqItems} />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            9. CLOSING INVITATION (PAPER-WINDOW OVER PRINT COLLAGE)
        ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-0 bg-white overflow-hidden border-t border-[#D5D5D2]">
          {/* Collage Texture Background */}
          <GranolaCollage variant="closing" />

          {/* Rising Paper Window */}
          <div className="relative z-10 max-w-[768px] mx-auto bg-[#F7F7F2] rounded-t-[28px] border-t border-x border-[#D5D5D2] p-8 sm:p-14 pb-20 shadow-[0px_4px_50px_0px_rgba(54,54,53,0.18)] text-center">
            {/* 3 Window Dots */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]/60" />
            </div>

            <h2 className="font-serif text-[42px] sm:text-[64px] lg:text-[76px] font-normal leading-[0.98] tracking-[-0.02em] text-[#292929] max-w-[620px] mx-auto">
              Comienza a sellar fidelidad hoy.
            </h2>

            <p className="font-sans text-[17px] sm:text-[19px] leading-[1.5] text-[#72726E] mt-5 max-w-[500px] mx-auto">
              Crea tu primera tarjeta de sellos en 3 minutos. Sorprende a tus clientes en su próxima visita.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="w-full sm:w-auto h-13 px-8 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-sm font-sans font-medium inline-flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Crear mi tarjeta demo gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/style/granola/scanner"
                className="w-full sm:w-auto h-13 px-7 rounded-full bg-transparent border border-[#292929] hover:bg-[#292929]/5 text-[#292929] text-sm font-sans font-medium inline-flex items-center justify-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4 text-[#5B6F00]" />
                <span>Probar escáner</span>
              </Link>
            </div>

            <p className="text-[12px] text-[#72726E] mt-4">
              Sin tarjeta de crédito requerida · Activación inmediata
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            10. MONUMENTAL IDENTITY FOOTER
        ───────────────────────────────────────────────────────────── */}
        <footer className="bg-white border-t border-[#D5D5D2] pt-16 pb-8">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
            {/* 4 Navigation Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-[#D5D5D2]/60 text-sm font-sans">
              <div>
                <span className="font-serif text-base text-[#292929] block mb-3 font-normal">
                  Producto
                </span>
                <ul className="space-y-2 text-[#72726E] text-xs">
                  <li><a href="#producto" className="hover:text-[#292929]">Tarjetas Digitales</a></li>
                  <li><a href="#como-funciona" className="hover:text-[#292929]">Google Wallet Passes</a></li>
                  <li><Link href="/style/granola/scanner" className="hover:text-[#292929]">Escáner de Mostrador</Link></li>
                  <li><a href="#planes" className="hover:text-[#292929]">Planes y Precios</a></li>
                </ul>
              </div>

              <div>
                <span className="font-serif text-base text-[#292929] block mb-3 font-normal">
                  Versiones de Diseño
                </span>
                <ul className="space-y-2 text-[#72726E] text-xs">
                  <li><Link href="/style/granola" className="text-[#5B6F00] font-semibold">🌾 Granola (Actual)</Link></li>
                  <li><Link href="/style/airbnb" className="hover:text-[#292929]">🌸 Airbnb</Link></li>
                  <li><Link href="/" className="hover:text-[#292929]">⬛ Base (Carbón Grafito)</Link></li>
                </ul>
              </div>

              <div>
                <span className="font-serif text-base text-[#292929] block mb-3 font-normal">
                  Comercios
                </span>
                <ul className="space-y-2 text-[#72726E] text-xs">
                  <li><span className="text-[#292929]">Cafés de Especialidad</span></li>
                  <li><span className="text-[#292929]">Estudios de Yoga & Pilates</span></li>
                  <li><span className="text-[#292929]">Barberías & Salones</span></li>
                  <li><span className="text-[#292929]">Librerías & Boutiques</span></li>
                </ul>
              </div>

              <div>
                <span className="font-serif text-base text-[#292929] block mb-3 font-normal">
                  Legal & Contacto
                </span>
                <ul className="space-y-2 text-[#72726E] text-xs">
                  <li><span className="text-[#72726E]">Términos de Servicio</span></li>
                  <li><span className="text-[#72726E]">Privacidad de Datos</span></li>
                  <li><span className="text-[#72726E]">soporte@loyal.jhojan.cloud</span></li>
                  <li><span className="text-[#72726E]">Bogotá, Colombia</span></li>
                </ul>
              </div>
            </div>

            {/* Monumental Vector Wordmark & Green Terminus */}
            <GranolaWordmark />

            {/* Low Social & Copyright Row */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#72726E] font-sans gap-3">
              <p>© {new Date().getFullYear()} Loyal. Inspirado en el sistema de diseño editorial Granola.</p>
              <p className="flex items-center gap-1.5">
                <span>Construido para comercios con alma</span>
                <Heart className="w-3.5 h-3.5 text-[#5B6F00] fill-[#5B6F00]" />
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
