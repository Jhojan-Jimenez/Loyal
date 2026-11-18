'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantBusiness, StudioConfig } from '@/lib/types';
import { isLightHexColor } from '@/lib/color-utils';
import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  Check,
  ArrowRight,
  Gift,
  Search,
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface FusionCustomerJoinViewProps {
  tenant: TenantBusiness;
  config: StudioConfig;
}

export function FusionCustomerJoinView({ tenant, config }: FusionCustomerJoinViewProps) {
  const router = useRouter();

  // Mode: 'register' for new customer, 'lookup' for returning customer
  const [mode, setMode] = useState<'register' | 'lookup'>('register');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lookup states
  const [lookupPhone, setLookupPhone] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const businessName = config.studioName || tenant.name || 'Comercio Local';
  const totalStamps = config.totalStampsRequired || 10;
  const rewardTitle = config.currentRewardTitle || 'Recompensa Exclusiva';
  const rewardDesc = config.currentRewardDescription;

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Por favor completa tu nombre y número de WhatsApp');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          tenantSlug: tenant.slug,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.student?.token) {
        throw new Error(data.error || 'No se pudo crear tu tarjeta. Intenta de nuevo.');
      }

      // Redirect directly to the student's loyalty card
      router.push(`/card/${data.student.token}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error de conexión. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  // Handle returning customer lookup
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) {
      setLookupError('Ingresa tu número de WhatsApp');
      return;
    }

    setIsLookingUp(true);
    setLookupError(null);

    try {
      const res = await fetch(
        `/api/students/find?phone=${encodeURIComponent(lookupPhone.trim())}&tenantSlug=${encodeURIComponent(tenant.slug)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success || !data.student?.token) {
        setLookupError('No encontramos ninguna tarjeta registrada con este número. ¡Puedes crear una nueva en segundos!');
        setIsLookingUp(false);
        return;
      }

      // Redirect directly to existing card
      router.push(`/card/${data.student.token}`);
    } catch (err: any) {
      console.error('Lookup error:', err);
      setLookupError('Error al consultar. Verifica tu conexión.');
      setIsLookingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans flex flex-col justify-between selection:bg-[#5B6F00] selection:text-white">
      {/* Top Brand Banner */}
      <header className="w-full border-b border-[#EAE4D5]/80 bg-[#FFFDF9]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#5B6F00] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-base font-serif font-normal text-[#1C1917] block leading-tight">
                {businessName}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C]">
                {tenant.category || 'Pase de Clientes'}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] text-[10px] font-mono font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Pase Oficial</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-6">
        {/* Hero Card Preview (Granola Warm Paper & Olive or Custom Background) */}
        {(() => {
          const useImage = config.walletBgMode === 'image' && Boolean(config.walletBgImageUrl?.trim());
          const bgHex = config.walletBgColor || '#FAF7F2';
          const isLight = !useImage && isLightHexColor(bgHex);

          return (
            <div
              className={`rounded-[32px] p-6 shadow-[0_16px_36px_-6px_rgba(40,30,10,0.08)] border relative overflow-hidden bg-cover bg-center ${
                isLight ? 'text-[#1C1917] border-[#EAE4D5]' : 'text-white border-white/15'
              }`}
              style={{
                backgroundColor: bgHex,
                ...(useImage ? { backgroundImage: `url(${config.walletBgImageUrl})` } : {}),
              }}
            >
              {/* Legibility scrim when using custom background image */}
              {useImage && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/75 via-[#1C1917]/65 to-[#1C1917]/85 pointer-events-none" />
              )}

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
                      isLight ? 'text-[#5B6F00]' : 'text-[#E2F099]'
                    }`}
                  >
                    {config.walletProgramName || 'Tarjeta Digital de Sellos'}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                      isLight
                        ? 'bg-[#F1F5DC] text-[#5B6F00] border-[#D9E2B3]'
                        : 'bg-white/15 text-white border-white/25 backdrop-blur-xs'
                    }`}
                  >
                    {totalStamps} Visitas
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl font-serif font-normal tracking-tight leading-snug">
                    {businessName}
                  </h1>
                  <p className={`text-xs mt-1 ${isLight ? 'text-[#57534E]' : 'text-white/80'}`}>
                    {config.tagline || 'Colecciona tus sellos en cada visita y canjea premios.'}
                  </p>
                </div>

                {/* Reward Highlight Box */}
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                    isLight
                      ? 'bg-[#FFFDF9] border-[#EAE4D5]'
                      : 'bg-black/30 border-white/15 backdrop-blur-xs'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#5B6F00] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-4 h-4 text-[#E2F099]" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                        isLight ? 'text-[#5B6F00]' : 'text-[#E2F099]'
                      }`}
                    >
                      Tu Premio al completar {totalStamps} visitas
                    </span>
                    <p className="text-sm font-semibold truncate mt-0.5">{rewardTitle}</p>
                    {rewardDesc && (
                      <p
                        className={`text-[11px] mt-0.5 line-clamp-2 ${
                          isLight ? 'text-[#57534E]' : 'text-white/75'
                        }`}
                      >
                        {rewardDesc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stamp preview dots */}
                <div className="pt-1 flex items-center justify-between gap-1.5">
                  {Array.from({ length: totalStamps }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                        i === totalStamps - 1
                          ? 'bg-[#5B6F00] text-white border-[#5B6F00]'
                          : isLight
                            ? 'bg-[#FFFDF9] text-[#78716C] border-[#EAE4D5]'
                            : 'bg-white/15 text-white/80 border-white/20 backdrop-blur-xs'
                      }`}
                    >
                      {i === totalStamps - 1 ? '🎁' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mode Toggle Pills */}
        <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EAE4D5] flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Nuevo Cliente
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('lookup');
              setLookupError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'lookup'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Ya Tengo Tarjeta
          </button>
        </div>

        {/* Mode 1: Register Form */}
        {mode === 'register' ? (
          <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-7 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)] space-y-5">
            <div>
              <h2 className="text-lg font-serif font-normal text-[#1C1917]">
                Activa tu pase digital
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Completa tus datos en 10 segundos. Podrás guardarlo en Google Wallet y empezar a sumar sellos hoy mismo.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] flex items-start gap-2.5 text-[#C2410C] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Camila Morales"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                  WhatsApp Móvil *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. 300 123 4567"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
                />
                <span className="text-[11px] text-[#78716C] mt-1 block">
                  Permite identificarte en caja cuando no lleves tu celular a mano.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                  Correo Electrónico <span className="text-[#78716C] lowercase font-normal">(opcional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-sm font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creando tu tarjeta digital...</span>
                  </>
                ) : (
                  <>
                    <span>Obtener mi Tarjeta de Sellos</span>
                    <ArrowRight className="w-4 h-4 text-[#B2C248]" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Mode 2: Returning Customer Lookup */
          <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-7 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)] space-y-5">
            <div>
              <h2 className="text-lg font-serif font-normal text-[#1C1917]">
                Consulta tu tarjeta
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Ingresa el número de WhatsApp con el que te registraste en {businessName} para abrir tus sellos acumulados.
              </p>
            </div>

            {lookupError && (
              <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] flex items-start gap-2.5 text-[#C2410C] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{lookupError}</span>
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                  Tu número de WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="Ej. 300 123 4567"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLookingUp}
                className="w-full h-13 rounded-full bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLookingUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Buscando tu pase...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#B2C248]" />
                    <span>Ver mi Tarjeta y Sellos</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Feature Benefits List */}
        <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-[#EAE4D5] space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold block">
            Ventajas de tu Pase Digital
          </span>

          <div className="space-y-2 text-xs text-[#57534E]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <span>
                <strong>Google Wallet integrado:</strong> Guárdala en tu celular con un solo toque y accede sin conexión.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <span>
                <strong>Cero descargas:</strong> Funciona directo en tu navegador web o agregada como app ligera (PWA).
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <span>
                <strong>Privacidad garantizada:</strong> Tus sellos y datos solo son compartidos con {businessName}.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-[#A89F91] border-t border-[#EAE4D5]/60 mt-6">
        <p>
          Programa de fidelización digital operado con{' '}
          <span className="font-serif font-bold text-[#1C1917]">loyal</span>
        </p>
      </footer>
    </div>
  );
}
