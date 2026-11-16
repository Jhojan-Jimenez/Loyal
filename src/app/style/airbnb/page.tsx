'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { AirbnbNavigation } from '@/components/airbnb/AirbnbNavigation';
import { AirbnbLoyaltyCard } from '@/components/airbnb/AirbnbLoyaltyCard';
import { AirbnbMiniature } from '@/components/airbnb/AirbnbMiniature';
import { AirbnbAccordion, AccordionItem } from '@/components/airbnb/AirbnbAccordion';
import { AirbnbRegisterModal } from '@/components/airbnb/AirbnbRegisterModal';

export default function AirbnbStylePage() {
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
        'Cada sello requiere una firma criptográfica única generada por el escáner del comercio autorizado. Los clientes no pueden añadir sellos por su cuenta: el código QR del cliente solo identifica su cuenta, y únicamente tu escáner autenticado tiene el permiso de emitir sellos.',
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
    <div className="relative min-h-screen bg-[#ffffff] text-[#222222] font-sans selection:bg-[#e61e4d] selection:text-white antialiased">
      {/* ── Fixed Airbnb Frosted Conversion Navigation ── */}
      <AirbnbNavigation onOpenDemo={() => setIsRegisterModalOpen(true)} />

      {/* ─────────────────────────────────────────────────────────────
          1. TWO-OBJECT OPENING (HERO CHAPTER ON WHITE STAGE) - 100VH VIEWPORT
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen min-h-[100dvh] pt-24 pb-12 sm:pt-28 sm:pb-16 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full py-2">
          
          {/* Left Column: 476px compact centered copy block */}
          <div className="lg:col-span-6 max-w-[500px] mx-auto lg:mx-0 text-left space-y-6">

            {/* Display Headline (60px/64px, weight 600, -0.04em tracking) */}
            <h1 className="text-[40px] sm:text-[54px] lg:text-[60px] leading-[44px] sm:leading-[58px] lg:leading-[64px] font-semibold text-[#222222] tracking-[-0.04em]">
              Fideliza clientes con tarjetas de sellos en su celular.
            </h1>

            {/* Hero Support Copy (24px, weight 400, muted color #6a6a6a) */}
            <p className="text-[19px] sm:text-[22px] lg:text-[24px] leading-[28px] sm:leading-[32px] lg:leading-[36px] text-[#6a6a6a] font-normal">
              Pases inteligentes en Google Wallet y web. Sin tarjetas de cartón que se pierden y con escaneo en 1 segundo en tu mostrador.
            </p>

            {/* Actions: Primary Berry Capsule & Pill Secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="h-12 px-7 rounded-full text-white text-[16px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                style={{
                  background: 'linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
                }}
              >
                <span>Crear tarjeta demo gratis</span>
                <ArrowRight className="w-4 h-4 text-white/90" />
              </button>

              <Link
                href="/style/airbnb/scanner"
                className="h-12 px-6 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] border border-[#dddddd] text-[#222222] text-[15px] font-medium transition-all active:scale-[0.96] flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#222222]" />
                <span>Ver escáner en mostrador</span>
              </Link>
            </div>

            {/* Discreet Trust Qualifiers */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-[13px] text-[#6a6a6a]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#e61e4d]" />
                Cero descargas de apps
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#e61e4d]" />
                Google Wallet oficial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#e61e4d]" />
                Listo en 15 minutos
              </span>
            </div>
          </div>

          {/* Right Column: 756px media stage with subtle ground radial shadow */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ground radial shadow */}
            <div
              className="absolute -bottom-8 w-[80%] h-20 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(34,34,34,0.12) 0%, rgba(34,34,34,0) 70%)',
              }}
            />

            {/* Interactive Tactile Loyalty Card */}
            <div id="experiencia" className="relative z-10 w-full max-w-[440px]">
              <AirbnbLoyaltyCard
                initialStamps={7}
                totalStamps={10}
                businessName="Café & Panadería Magnolia"
                customerName="Camila Restrepo"
                rewardText="1 Café de Especialidad o Croissant Gratis"
              />

              {/* Floating Social Proof Badge */}
              <div
                className="absolute -bottom-4 -left-2 sm:-left-6 bg-white rounded-2xl px-4 py-2.5 border border-[#ebebeb] flex items-center gap-2.5 z-20 animate-in fade-in duration-300"
                style={{
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                }}
              >
                <div className="w-7 h-7 rounded-full bg-[#fff0f3] flex items-center justify-center text-[#e61e4d]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#222222]">
                    +38% Visitas Recurrentes
                  </span>
                  <span className="block text-[11px] text-[#6a6a6a]">
                    En cafeterías y tiendas locales
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Subtle scroll cue at bottom of 100vh hero */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 opacity-40 hover:opacity-80 transition-opacity pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#717171]">Explorar</span>
          <div className="w-5 h-8 rounded-full border border-[#dddddd] flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#717171] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TACTILE MINIATURES CAPABILITY FIELD
      ───────────────────────────────────────────────────────────── */}
      <section id="beneficios" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#f2f2f2]">
        {/* Centered Chapter Heading (54px/58px, weight 600, -0.03em) */}
        <div className="max-w-[620px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] leading-[40px] sm:leading-[50px] lg:leading-[58px] font-semibold text-[#222222] tracking-[-0.03em]">
            Todo lo que necesitas para fidelizar sin esfuerzo.
          </h2>
          <p className="text-[19px] sm:text-[22px] leading-[28px] sm:leading-[32px] text-[#6a6a6a] font-normal">
            Tecnología ligera pensada para la cercanía y calidez de tu mostrador diario.
          </p>
        </div>

        {/* 5 Miniature Capability Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-[1100px] mx-auto">
          {/* Item 1: Sello Digital */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="stamp" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Un toque en mostrador
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Tu cliente muestra su QR o acerca su teléfono y el sello se estampa al instante con un sonido agradable.
              </p>
            </div>
          </div>

          {/* Item 2: Google Wallet */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="wallet" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Siempre en su billetera
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Sin descargas en tiendas de apps. Se guarda nativamente en Google Wallet y en la pantalla de inicio de iPhone.
              </p>
            </div>
          </div>

          {/* Item 3: Notificaciones */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="bell" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Alertas amigables
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Recuerda con cariño a tus clientes cuando están a 1 o 2 sellos de reclamar su premio para que vuelvan esta semana.
              </p>
            </div>
          </div>

          {/* Item 4: Escáner Mostrador */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="scanner" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Cero hardware caro
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Funciona desde cualquier teléfono, tableta o laptop con cámara web que ya tengas en recepción o caja.
              </p>
            </div>
          </div>

          {/* Item 5: Métricas Claras */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="analytics" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Métricas de recurrencia
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Descubre qué días vuelven más clientes, qué premios motivan más visitas y quiénes son tus clientes más fieles.
              </p>
            </div>
          </div>

          {/* Item 6: Premio Personalizado */}
          <div className="flex items-start gap-5 p-6 rounded-3xl hover:bg-[#f7f7f7] transition-colors">
            <AirbnbMiniature type="gift" size={88} />
            <div className="space-y-1.5 pt-1 text-left">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Reglas a tu medida
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
                Tú decides si son 6, 8 o 10 sellos, y si premias con un café gratis, un descuento porcentual o un tratamiento especial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. HUMAN STORY TRIPTYCH (REAL LOCAL BUSINESS OUTCOMES)
      ───────────────────────────────────────────────────────────── */}
      <section id="historias" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#f2f2f2]">
        <div className="max-w-[620px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] leading-[40px] sm:leading-[50px] lg:leading-[58px] font-semibold text-[#222222] tracking-[-0.03em]">
            Comercios reales que dijeron adiós al cartón.
          </h2>
          <p className="text-[19px] sm:text-[22px] leading-[28px] sm:leading-[32px] text-[#6a6a6a] font-normal">
            Desde cafeterías de especialidad hasta barberías y estudios, así cuidan la relación con sus clientes.
          </p>
        </div>

        {/* 3 Photo Story Cards (300px each in 3 columns with 24px gap) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[948px] mx-auto">
          {/* Card 1 */}
          <div
            className="w-full bg-white rounded-2xl overflow-hidden border border-[#ebebeb] transition-all hover:-translate-y-1"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div className="relative h-[280px] bg-[#f7f7f7] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                alt="Café de especialidad y barista"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#222222]">
                Café Varietale · Bogotá
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#222222] font-normal max-w-[220px] mx-auto">
                Elena reemplazó 2,000 tarjetas impresas con 84% de adopción en su primera semana.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#e61e4d]">
                +42% cafés recurrentes
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="w-full bg-white rounded-2xl overflow-hidden border border-[#ebebeb] transition-all hover:-translate-y-1"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div className="relative h-[280px] bg-[#f7f7f7] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
                alt="Barbería artesanal"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#222222]">
                Grooming 93 · Medellín
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#222222] font-normal max-w-[220px] mx-auto">
                Mateo acortó el ciclo de visitas de 28 a 18 días premiando el 5º corte de barba.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#e61e4d]">
                Clientes vuelven cada 18 días
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="w-full bg-white rounded-2xl overflow-hidden border border-[#ebebeb] transition-all hover:-translate-y-1"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div className="relative h-[280px] bg-[#f7f7f7] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                alt="Estudio de Yoga y bienestar"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#222222]">
                Magnolia Yoga · Chía
              </div>
            </div>
            <div className="p-5 text-center">
              <p className="text-[14px] leading-[20px] text-[#222222] font-normal max-w-[220px] mx-auto">
                Sofía eliminó las libretas de papel y gestiona 120 alumnas frecuentes sin perder un pase.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#e61e4d]">
                120 pases activos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PORTRAITS CLUSTER & STACKED QUANTIFIED PROOF
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#f2f2f2]">
        <div className="max-w-[700px] mx-auto text-center space-y-12">
          
          {/* Overlapping circular portraits (central 194px, flanking 146px and 132px) */}
          <div className="flex items-center justify-center -space-x-4 sm:-space-x-6 py-4">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Central Largest Face (194px) */}
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl z-30 shrink-0 ring-4 ring-[#fff0f3]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt="Líder de negocio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md z-20 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md z-10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                alt="Comerciante"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stacked Proof Statements (36px/44px, weight 600, -0.04em tracking) */}
          <div className="space-y-8 max-w-[580px] mx-auto text-center divide-y divide-[#ebebeb]">
            <div className="pt-2">
              <div className="text-[32px] sm:text-[40px] leading-[38px] sm:leading-[46px] font-semibold text-[#222222] tracking-[-0.04em]">
                +38% más visitas repetidas
              </div>
              <p className="text-[16px] text-[#6a6a6a] mt-2">
                Los clientes que guardan su pase digital regresan un promedio de 1.4 semanas antes a su próxima compra.
              </p>
            </div>

            <div className="pt-8">
              <div className="text-[32px] sm:text-[40px] leading-[38px] sm:leading-[46px] font-semibold text-[#222222] tracking-[-0.04em]">
                Menos de 1 segundo por sello
              </div>
              <p className="text-[16px] text-[#6a6a6a] mt-2">
                El escaneo óptico desde el celular o mostrador es instantáneo y no genera demoras en horas pico.
              </p>
            </div>

            <div className="pt-8">
              <div className="text-[32px] sm:text-[40px] leading-[38px] sm:leading-[46px] font-semibold text-[#222222] tracking-[-0.04em]">
                94% de adopción frente al papel
              </div>
              <p className="text-[16px] text-[#6a6a6a] mt-2">
                Nueve de cada diez clientes prefieren tener su tarjeta en Google Wallet en lugar de llenar su cartera de cartones.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. PAIRED CAPABILITY EXHIBITS (DEMONSTRATIONS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#f2f2f2]">
        <div className="max-w-[620px] mx-auto text-center mb-16 space-y-4">
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] leading-[40px] sm:leading-[50px] lg:leading-[58px] font-semibold text-[#222222] tracking-[-0.03em]">
            Dos lados de una experiencia impecable.
          </h2>
          <p className="text-[19px] sm:text-[22px] leading-[28px] sm:leading-[32px] text-[#6a6a6a] font-normal">
            Hecho para deleitar al cliente en su teléfono y facilitar el trabajo de tu equipo en mostrador.
          </p>
        </div>

        {/* Feature Grid: 848px two-column grid with 48px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[848px] mx-auto">
          {/* Exhibit 1: Para el Cliente */}
          <div className="flex flex-col items-center text-center">
            {/* Phone Mockup Frame */}
            <div
              className="w-[320px] sm:w-[360px] h-[460px] bg-[#f7f7f7] rounded-[36px] p-6 border border-[#ebebeb] flex flex-col justify-between overflow-hidden relative shadow-sm"
            >
              {/* Phone Speaker Notch */}
              <div className="w-20 h-4 bg-[#222222] rounded-full mx-auto mb-4" />

              {/* In-device interface preview */}
              <div className="bg-white rounded-2xl p-5 border border-[#ebebeb] text-left shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6a6a6a]">Google Wallet</span>
                    <h4 className="text-sm font-bold text-[#222222]">Café Varietale</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#fff0f3] text-[10px] font-semibold text-[#e61e4d]">
                    7 / 10 Sellos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <div
                      key={n}
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        n <= 7 ? 'bg-[#e61e4d] text-white' : 'bg-[#f7f7f7] text-[#9a9a9a]'
                      }`}
                    >
                      {n <= 7 ? '✓' : n}
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7f7f7] text-[11px] text-[#6a6a6a] flex items-center gap-2">
                  <Gift className="w-3.5 h-3.5 text-[#e61e4d]" />
                  <span>Próximo sello desbloquea café gratis</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="text-center py-2 text-[11px] text-[#6a6a6a]">
                Disponible sin conexión · Notificaciones de cercanía
              </div>
            </div>

            {/* Centered Caption */}
            <div className="mt-6 max-w-[320px]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Para tus clientes
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a] mt-1.5">
                Su tarjeta siempre a mano en la pantalla de bloqueo. Sin contraseñas ni apps que actualizar.
              </p>
            </div>
          </div>

          {/* Exhibit 2: Para el Mostrador */}
          <div className="flex flex-col items-center text-center">
            {/* Tablet / Scanner Mockup Frame */}
            <div
              className="w-[320px] sm:w-[360px] h-[460px] bg-[#f7f7f7] rounded-[36px] p-6 border border-[#ebebeb] flex flex-col justify-between overflow-hidden relative shadow-sm"
            >
              {/* Camera Lens */}
              <div className="w-3 h-3 bg-[#222222] rounded-full mx-auto mb-4" />

              {/* Scanner Screen */}
              <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#ebebeb] text-left shadow-xs space-y-3 flex-1 flex flex-col justify-center items-center">
                <div className="w-36 h-36 border-2 border-dashed border-[#10b981] rounded-2xl flex items-center justify-center bg-[#f0fdf4] relative">
                  <QrCode className="w-20 h-20 text-[#10b981] opacity-75" />
                  <div className="absolute inset-x-3 top-1/2 h-0.5 bg-[#10b981] shadow-xs" />
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981] text-white text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    ¡Sello Estampado!
                  </span>
                  <p className="text-[11px] text-[#6a6a6a] mt-1">
                    Cliente: Camila Restrepo (Visita #8)
                  </p>
                </div>
              </div>

              <div className="text-center py-2 text-[11px] text-[#6a6a6a]">
                Compatible con Chrome, Safari y cualquier cámara web
              </div>
            </div>

            {/* Centered Caption */}
            <div className="mt-6 max-w-[320px]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#222222]">
                Para tu mostrador
              </h3>
              <p className="text-[15px] leading-[22px] text-[#6a6a6a] mt-1.5">
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
          className="max-w-[848px] mx-auto bg-[#f4f2ec] rounded-[28px] p-8 sm:p-10 border border-[#ebe8df] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-left max-w-[500px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6a6a6a]">
              Acompañamiento personalizado
            </span>
            <h3 className="text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-semibold text-[#222222] tracking-[-0.02em]">
              ¿Quieres que configuremos tu tarjeta juntos?
            </h3>
            <p className="text-[15px] leading-[22px] text-[#6a6a6a]">
              Te ayudamos a diseñar tu pase con tu logo, definir la recompensa ideal para tu margen y capacitar a tu equipo en 15 minutos.
            </p>
          </div>

          <a
            href="https://wa.me/573203282014?text=Hola!%20Quiero%20asesoría%20para%20crear%20mi%20tarjeta%20de%20sellos%20con%20Loyal"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-7 rounded-full bg-[#222222] hover:bg-black text-white text-[15px] font-medium transition-all active:scale-[0.96] flex items-center gap-2.5 shrink-0 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#10b981]" />
            <span>Hablar con un especialista</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PRICING PLANS (AIRBNB STYLE SOBER SUBSCRIPTION)
      ───────────────────────────────────────────────────────────── */}
      <section id="precios" className="py-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full border-t border-[#f2f2f2]">
        <div className="max-w-[620px] mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#f7f7f7] border border-[#ebebeb] text-[#6a6a6a]">
            Precios Claros
          </span>
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] leading-[40px] sm:leading-[50px] lg:leading-[58px] font-semibold text-[#222222] tracking-[-0.03em]">
            Planes transparentes, sin ataduras.
          </h2>
          <p className="text-[19px] sm:text-[22px] leading-[28px] sm:leading-[32px] text-[#6a6a6a] font-normal">
            Comienza gratis hoy mismo y escala a medida que crece tu comunidad de clientes recurrentes.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1080px] mx-auto items-stretch">
          
          {/* Plan 1: Starter */}
          <div
            className="bg-white rounded-[28px] p-8 border border-[#ebebeb] flex flex-col justify-between transition-all hover:border-[#dddddd]"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6a6a6a]">
                Starter
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-semibold text-[#222222] tracking-tight">$0</span>
                <span className="text-sm text-[#6a6a6a]">/ mes</span>
              </div>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-6">
                Para negocios que quieren digitalizar su primera tarjeta de sellos sin costo fijo.
              </p>

              <ul className="space-y-3 text-sm text-[#222222] border-t border-[#f2f2f2] pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>1 punto de venta / mostrador</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Hasta 100 clientes activos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Pases Google Wallet & Web</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Escáner QR ilimitado</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full mt-8 h-12 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] border border-[#dddddd] text-[#222222] text-[15px] font-medium transition-all active:scale-[0.96] cursor-pointer"
            >
              Empezar Gratis
            </button>
          </div>

          {/* Plan 2: Pro (Destacado con Berry Gradient Capsule) */}
          <div
            className="bg-white rounded-[28px] p-8 border-2 border-[#e61e4d] flex flex-col justify-between relative transition-all hover:shadow-lg"
            style={{
              boxShadow: '0 0 0 1px rgba(230,30,77,0.1), 0 12px 30px rgba(230,30,77,0.12)',
            }}
          >
            {/* Berry Recommendation Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs" style={{ background: 'linear-gradient(to right, #e61e4d, #d70466)' }}>
              Más Popular
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#e61e4d]">
                Pro Negocios
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-semibold text-[#222222] tracking-tight">$29</span>
                <span className="text-xs text-[#6a6a6a]">USD / mes (o $79.000 COP)</span>
              </div>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-6">
                Para comercios en crecimiento que buscan fidelizar sin límites y con analítica.
              </p>

              <ul className="space-y-3 text-sm text-[#222222] border-t border-[#f2f2f2] pt-6">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Clientes y sellos ilimitados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Múltiples cajeros y terminales</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Logo y colores personalizados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Métricas de retención y visitas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Soporte prioritario por WhatsApp</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Quiero%20suscribirme%20al%20plan%20Pro%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 h-12 rounded-full text-white text-[15px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
              }}
            >
              <span>Elegir Plan Pro</span>
              <ArrowRight className="w-4 h-4 text-white/90" />
            </a>
          </div>

          {/* Plan 3: Enterprise */}
          <div
            className="bg-white rounded-[28px] p-8 border border-[#ebebeb] flex flex-col justify-between transition-all hover:border-[#dddddd]"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6a6a6a]">
                Enterprise
              </span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-[44px] font-semibold text-[#222222] tracking-tight">A Medida</span>
              </div>
              <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-6">
                Para cadenas comerciales, franquicias y marcas con sistemas de caja propios.
              </p>

              <ul className="space-y-3 text-sm text-[#222222] border-t border-[#f2f2f2] pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Integración API / Webhook con tu POS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Dominio propio (pass.tumarca.com)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Hardware NFC de mostrador incluido</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#e61e4d] shrink-0" />
                  <span>Acuerdo de nivel de servicio (SLA 99.9%)</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Quiero%20información%20del%20plan%20Enterprise%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 h-12 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] border border-[#dddddd] text-[#222222] text-[15px] font-medium transition-all active:scale-[0.96] text-center flex items-center justify-center cursor-pointer"
            >
              Contactar Ventas
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. QUESTION BAND (CLOSING OBJECTION-HANDLING REGION IN #F7F7F7)
      ───────────────────────────────────────────────────────────── */}
      <section id="preguntas" className="bg-[#f7f7f7] pt-28 pb-20 px-6 sm:px-12 lg:px-20 border-t border-[#ebebeb] w-full">
        <div className="max-w-[1440px] mx-auto">
          {/* Centered Heading (54px/58px, weight 600, -0.03em) */}
          <div className="max-w-[632px] mx-auto text-left mb-14 space-y-3">
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] leading-[40px] sm:leading-[50px] lg:leading-[58px] font-semibold text-[#222222] tracking-[-0.03em]">
              Preguntas frecuentes
            </h2>
            <p className="text-[17px] sm:text-[19px] leading-[26px] sm:leading-[28px] text-[#6a6a6a]">
              Todo lo que necesitas saber para empezar a premiar a tus clientes habituales.
            </p>
          </div>

          {/* 632px Ruled Accordion */}
          <AirbnbAccordion items={faqItems} defaultOpenId="faq-1" />

          {/* Assistance invitation below accordion */}
          <div className="max-w-[632px] mx-auto mt-16 pt-8 border-t border-[#dddddd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-[16px] font-semibold text-[#222222]">
                ¿Tienes alguna otra duda técnica?
              </h4>
              <p className="text-[14px] text-[#6a6a6a]">
                Nuestro equipo responde en minutos por WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/573203282014"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#222222] underline hover:text-[#e61e4d] transition-colors"
            >
              Escríbenos directamente
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. RESTRAINED LEGAL & LOCALIZATION FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#f7f7f7] border-t border-[#ebebeb] py-12 px-6 sm:px-12 lg:px-20 text-[14px] text-[#6a6a6a]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#222222]">Loyal Cloud Platform</span>
            <span>·</span>
            <span>Pases Digitales & Google Wallet para Comercios Locales</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[#222222] font-medium">
              Español (CO) · $ COP
            </span>
            <Link href="/style/airbnb/scanner" className="hover:text-[#222222] transition-colors">
              Escáner
            </Link>
            <Link href="/admin" className="hover:text-[#222222] transition-colors">
              Admin
            </Link>
            <a
              href="https://wa.me/573203282014"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#222222] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto mt-6 pt-6 border-t border-[#ebebeb] text-[12px] text-[#9a9a9a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Loyal. Inspirado en la calidez, claridad y hospitalidad del diseño humano.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacidad</span>
            <span className="hover:underline cursor-pointer">Términos</span>
            <span className="hover:underline cursor-pointer">Seguridad</span>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          10. DEMO REGISTRATION MODAL
      ───────────────────────────────────────────────────────────── */}
      <AirbnbRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
