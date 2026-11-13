'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoyal } from '@/context/LoyalContext';
import { LoyaltyCard } from '@/components/LoyaltyCard';
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  ArrowRight,
  Smartphone,
  Zap,
  TrendingUp,
  Layers,
  Store,
  Coffee,
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Dumbbell,
  Check,
  Building2,
  Gift,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { students, config, registerStudent } = useLoyal();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo student for the live preview card
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
    <div className="bg-white text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (100% Viewport below header h-20)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden w-full h-[calc(100vh-5rem)] supports-[height:100dvh]:h-[calc(100dvh-5rem)] max-h-[calc(100vh-5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-5rem)] flex items-center justify-center bg-white border-b border-neutral-200/80">
        {/* Subtle Technical Architectural Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none select-none opacity-40 z-0"
          style={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Hero Content Grid (Strictly fits inside viewport) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center justify-between lg:justify-center py-4 sm:py-6 lg:py-0">
          
          {/* Left Column: Direct B2B Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 max-w-2xl w-full">
            {/* Sober Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-semibold text-neutral-800 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SaaS B2B · Fidelización Digital en Google Wallet & Web
            </div>

            {/* Powerful Typography */}
            <div className="space-y-0.5">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-950 tracking-tight leading-none uppercase">
                TARJETAS DE SELLOS
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-neutral-600 tracking-tight uppercase">
                DIGITALES PARA TU NEGOCIO
              </h2>
            </div>

            {/* Value Proposition */}
            <p className="text-neutral-600 text-xs sm:text-base leading-relaxed pr-2 max-w-xl">
              Reemplaza las tarjetas de cartón con pases inteligentes en Google Wallet. Fideliza a tus clientes habituales, escanea visitas en 1 segundo con cualquier celular y premia la recurrencia sin apps pesadas.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 sm:px-8 py-3 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Crear Tarjeta Demo</span>
                <ArrowRight className="w-4 h-4 text-neutral-300" />
              </button>

              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-neutral-700" />
                <span>Abrir Escáner de Mostrador</span>
              </Link>
            </div>

            {/* Trust Pillars */}
            <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                100% Sin descargas de apps
              </span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                Google Wallet Oficial (Android)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                Compatible con iPhone (PWA/NFC)
              </span>
            </div>
          </div>

          {/* Right Column: Live Mockup / Digital Membership Card */}
          <div className="lg:col-span-5 relative flex-1 lg:flex-none min-h-0 w-full flex items-center justify-center my-auto lg:my-0">
            <div className="relative w-full max-w-[420px] p-5 sm:p-6 rounded-3xl bg-neutral-950 text-white shadow-2xl border border-neutral-800">
              {/* Header inside card */}
              <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Pase Digital</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">Tu Negocio / Marca</h3>
                  <p className="text-[11px] text-neutral-400">Club de Fidelización & Sellos</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4 text-neutral-200" />
                </div>
              </div>

              {/* Progress bar inside card */}
              <div className="py-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-neutral-200">7 de 10 Sellos Acumulados</span>
                  <span className="font-bold text-white">70%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[70%] rounded-full" />
                </div>
              </div>

              {/* Grid of 10 stamps */}
              <div className="grid grid-cols-5 gap-2 my-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isFilled = num <= 7;
                  return (
                    <div
                      key={num}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold ${
                        isFilled
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
                      }`}
                    >
                      {isFilled ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : num}
                    </div>
                  );
                })}
              </div>

              {/* Reward preview */}
              <div className="mt-3 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2.5 text-xs">
                <Gift className="w-4 h-4 text-neutral-300 shrink-0" />
                <span className="text-neutral-300 truncate">Premio: Producto gratis al 10º sello</span>
              </div>

              {/* Floating High-Conversion Metric Badge */}
              <div className="absolute -bottom-3 -right-3 sm:-right-4 bg-white text-neutral-950 px-3.5 py-1.5 rounded-xl border border-neutral-200 shadow-xl flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-neutral-900" />
                <span className="text-xs font-bold">+38% Retorno de clientes</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. DEMO EN VIVO: INTERACTIVE CARD SHOWCASE (#producto)
      ───────────────────────────────────────────────────────────── */}
      <section id="producto" className="py-20 px-6 sm:px-10 lg:px-16 bg-neutral-50 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase bg-neutral-200/60 px-3 py-1 rounded-full border border-neutral-300/80">
              Experiencia Interactiva
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Así lo Ven tus Clientes en su Celular
            </h3>
            <p className="text-sm text-neutral-600">
              Sin papel, sin pérdidas y siempre disponible. Prueba la tarjeta interactiva: acumula sellos, revisa las pestañas y guárdala directamente en Google Wallet.
            </p>
          </div>

          {/* Interactive Card Component */}
          <div className="flex justify-center">
            <LoyaltyCard student={demoStudent} config={config} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CÓMO FUNCIONA EN 3 PASOS (#como-funciona)
      ───────────────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
            Simplicidad Extrema
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            Cómo Funciona en 3 Pasos
          </h3>
          <p className="text-sm text-neutral-600">
            Todo el sistema opera en la web y en billeteras digitales nativas. Cero fricción técnica para tu negocio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Paso 1 */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-lg mb-6">
              1
            </div>
            <h4 className="text-lg font-bold text-neutral-950 mb-2">Configura tu Recompensa</h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Elige cuántos sellos se requieren (ej. 10 visitas) y cuál es el beneficio exclusivo que recibirán tus clientes frecuentes al completar el ciclo.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-lg mb-6">
              2
            </div>
            <h4 className="text-lg font-bold text-neutral-950 mb-2">El Cliente Guarda su Pase</h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Tus clientes guardan la tarjeta en su Google Wallet oficial en Android o en la pantalla de inicio de su iPhone con solo escanear un código QR o por NFC.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-lg mb-6">
              3
            </div>
            <h4 className="text-lg font-bold text-neutral-950 mb-2">Escanea y Premia en Caja</h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              En cada visita, el encargado abre el escáner web en recepción o mostrador. Un clic y el sello se estampa y sincroniza en la nube al instante.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CASOS DE USO / VERTICALES B2B
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Diseñado Para Todo Tipo de Comercio
            </h3>
            <p className="text-sm text-neutral-600">
              Adaptable a cualquier industria que premie la recurrencia de sus clientes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <Coffee className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Cafeterías</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Cada 8 cafés, 1 gratis.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <Scissors className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Barberías & Spas</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Cortes y tratamientos.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <UtensilsCrossed className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Restaurantes</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Postres o entradas.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <ShoppingBag className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Boutiques & Retail</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Descuento al 5º sello.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <Dumbbell className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Gimnasios & Fitness</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Sellos por asistencia.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-center">
              <Store className="w-7 h-7 mx-auto text-neutral-900 mb-2" />
              <h5 className="font-bold text-xs text-neutral-950">Comercio Local</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Cualquier punto de venta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. PLANES DE SUSCRIPCIÓN SAAS (#planes)
      ───────────────────────────────────────────────────────────── */}
      <section id="planes" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
            Suscripción Flexible
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            Planes Transparentes para Tu Empresa
          </h3>
          <p className="text-sm text-neutral-600">
            Comienza gratis y escala a medida que crece tu base de clientes recurrentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan Starter */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Starter</span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-black text-neutral-950">$0</span>
                <span className="text-xs text-neutral-500">/ mes (Prueba)</span>
              </div>
              <p className="text-xs text-neutral-600 mb-6">
                Para negocios individuales que quieren digitalizar su primera tarjeta de sellos.
              </p>
              <ul className="space-y-3 text-xs text-neutral-700 border-t border-neutral-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  1 Local / Mostrador
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Hasta 100 clientes activos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Pases en Google Wallet & Web
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Escáner QR web ilimitado
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full mt-8 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-all cursor-pointer"
            >
              Empezar Gratis
            </button>
          </div>

          {/* Plan Pro (Destacado) */}
          <div className="p-8 rounded-3xl bg-neutral-950 text-white border-2 border-neutral-900 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-neutral-950 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-neutral-200">
              Más Recomendado
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pro Business</span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-xs text-neutral-400">USD / mes (o $79.000 COP)</span>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Para comercios establecidos que buscan fidelizar sin límites y con métricas.
              </p>
              <ul className="space-y-3 text-xs text-neutral-300 border-t border-neutral-800 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Clientes y sellos ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Múltiples mostradores y cajeros
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Branding personalizado (logo y colores)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Soporte para lectura NFC Contactless
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Reporte de retención y analítica
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Soporte prioritario por WhatsApp
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Quiero%20suscribirme%20al%20plan%20Pro%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 py-3 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-all text-center block cursor-pointer"
            >
              Suscribirme al Plan Pro
            </a>
          </div>

          {/* Plan Enterprise */}
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Enterprise</span>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-black text-neutral-950">A Medida</span>
              </div>
              <p className="text-xs text-neutral-600 mb-6">
                Para cadenas comerciales, franquicias y marcas con sistemas POS propios.
              </p>
              <ul className="space-y-3 text-xs text-neutral-700 border-t border-neutral-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Integración API / Webhook con tu TPV/POS
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Dominio propio (ej. pass.tumarca.com)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Hardware NFC de mostrador incluido
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neutral-950" />
                  Acuerdo de Nivel de Servicio (SLA 99.9%)
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/573203282014?text=Hola!%20Deseo%20información%20del%20plan%20Enterprise%20de%20Loyal"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-8 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-all text-center block cursor-pointer"
            >
              Contactar Ventas
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL DE REGISTRO RÁPIDO
      ───────────────────────────────────────────────────────────── */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-900 mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950">Crear Tarjeta de Sellos</h3>
              <p className="text-xs text-neutral-500">
                Genera tu pase digital al instante para sumar sellos y guardarlo en Google Wallet.
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
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-950"
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
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-950"
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
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all text-neutral-950"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-black text-white text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                {isSubmitting ? 'Generando pase digital...' : 'Emitir Mi Tarjeta de Sellos'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. FOOTER SOBRIO B2B (#contacto)
      ───────────────────────────────────────────────────────────── */}
      <footer id="contacto" className="border-t border-neutral-200 bg-white py-12 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950">Loyal Cloud Platform</span>
            <span>·</span>
            <span>Tarjetas de Sellos Digitales & Google Wallet para Comercios</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/573203282014"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-950 transition-colors font-semibold"
            >
              WhatsApp: +57 320 328 2014
            </a>
            <Link href="/scanner" className="hover:text-neutral-950 transition-colors">
              Escáner
            </Link>
            <Link href="/admin" className="hover:text-neutral-950 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
