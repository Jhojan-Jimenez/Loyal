'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useLoyal } from '@/context/LoyalContext';
import { generateQrTotp, getTotpSecondsRemaining } from '@/lib/totp';
import {
  Gift,
  Share,
  Info,
  MapPin,
  Wifi,
  Loader2,
  ShieldCheck,
  Check,
  ArrowLeft,
  UserX,
  Copy,
  Clock,
  Phone,
  Smartphone,
} from 'lucide-react';

interface FusionStudentCardViewProps {
  token: string;
}

export function FusionStudentCardView({ token }: FusionStudentCardViewProps) {
  const { getStudentByToken, config, isLoaded, refreshFromServer } = useLoyal();

  const [activeTab, setActiveTab] = useState<'card' | 'details' | 'install'>('card');
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Dynamic TOTP for anti-screenshot protection
  const [totp, setTotp] = useState(() => generateQrTotp(token));
  const [secondsLeft, setSecondsLeft] = useState(() => getTotpSecondsRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTotpSecondsRemaining();
      setSecondsLeft(remaining);
      setTotp(generateQrTotp(token));
    }, 1000);
    return () => clearInterval(timer);
  }, [token]);

  const student = getStudentByToken(token);

  useEffect(() => {
    if (!student) {
      refreshFromServer();
    }
  }, [student, refreshFromServer]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#FDFBF7] font-sans">
        <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
        <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando pase editorial...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FDFBF7] font-sans">
        <div className="bg-[#FFFDF9] rounded-[28px] p-8 max-w-md w-full text-center border border-[#EAE4D5] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF4EE] text-[#C26748] flex items-center justify-center mx-auto mb-4 border border-[#F1DED1]">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Tarjeta no encontrada</h2>
          <p className="text-xs text-[#78716C] mt-2 mb-6">
            El código <code className="bg-[#FAF7F2] px-2 py-0.5 rounded text-[#1C1917] font-mono">{token}</code> no corresponde a ningún miembro registrado.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/style/fusion"
              className="py-3 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-all shadow-xs"
            >
              Crear una Nueva Tarjeta
            </Link>
            <Link
              href="/style/fusion/card/camila-restrepo-yoga"
              className="py-3 rounded-full bg-white text-[#1C1917] text-xs font-bold hover:bg-[#FAF7F2] transition-all border border-[#EAE4D5]"
            >
              Ver Pase Demo de Camila
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRequired = config.totalStampsRequired || 10;
  const currentStamps = student.stamps || 0;
  const isComplete = currentStamps >= totalRequired;
  const progressPercent = Math.min(100, Math.round((currentStamps / totalRequired) * 100));

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Tarjeta de Sellos - ${student.name}`,
          text: `Mi pase de sellos en ${config.studioName || 'Yoga Shala'}`,
          url: window.location.href,
        });
      } catch {}
    } else if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyWifi = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText('yogashala2026');
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const handleSaveToGoogleWallet = async () => {
    try {
      setIsGeneratingWallet(true);
      setWalletError(null);

      const res = await fetch('/api/wallet/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentToken: student.token,
          studentName: student.name,
          currentStamps: student.stamps,
          totalCycles: student.totalCompletedCycles,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.saveUrl) {
        throw new Error(data.error || 'No se pudo generar el pase de Google Wallet');
      }

      window.open(data.saveUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Wallet error:', err);
      setWalletError(err.message || 'Error de conexión');
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans antialiased pb-20 selection:bg-[#5B6F00] selection:text-white">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D5] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/style/fusion"
            className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] flex items-center justify-center text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block leading-none">
              Pase de Fidelización
            </span>
            <h1 className="text-sm font-serif font-bold text-[#1C1917]">
              {config.studioName || 'Yoga Shala & Wellness'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#1C1917] transition-colors cursor-pointer"
        >
          <Share className="w-3.5 h-3.5 text-[#5B6F00]" />
          <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir'}</span>
        </button>
      </header>

      {/* ── Main View Container (Airbnb Structure) ── */}
      <div className="max-w-[480px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Segmented Tab Pill Selector */}
        <div className="flex items-center p-1 bg-[#FAF7F2] rounded-full border border-[#EAE4D5] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Mi Pase
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Beneficios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'install'
                ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Guardar
          </button>
        </div>

        {/* ── TAB 1: CARD & TOTP QR VIEW ── */}
        {activeTab === 'card' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* The Tactile Card */}
            <div className="bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] p-6 sm:p-7 shadow-[0_16px_36px_-6px_rgba(40,30,10,0.08)]">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-[#EAE4D5] pb-4 mb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6F00] font-bold">
                    Pase de Alumno
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1C1917] mt-0.5">
                    {student.name}
                  </h2>
                  <span className="text-xs text-[#78716C] font-mono">{student.phone}</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[11px] font-bold text-[#5B6F00] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Activo</span>
                </div>
              </div>

              {/* Dynamic QR Code Card Surface */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] flex flex-col items-center mb-6">
                <div className="p-3.5 bg-white rounded-2xl border border-[#EAE4D5] shadow-xs relative">
                  <QRCodeSVG
                    value={`https://loyal.jhojan.cloud/card/${student.token}?totp=${totp}`}
                    size={180}
                    level="H"
                    fgColor="#1C1917"
                  />
                  {/* Center Brand Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-[#5B6F00] border-2 border-white flex items-center justify-center text-white shadow-xs">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* TOTP Countdown Bar */}
                <div className="w-full max-w-[200px] mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5B6F00]" />
                      <span>Código Dinámico</span>
                    </span>
                    <span className="font-bold text-[#5B6F00]">{secondsLeft}s</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#EAE4D5] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5B6F00] transition-all duration-1000 linear"
                      style={{ width: `${(secondsLeft / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#78716C] text-center mt-3">
                  Presenta este QR al llegar a recepción para sumar tu sello.
                </p>
              </div>

              {/* Progress Summary */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#57534E] font-medium">Progreso del ciclo:</span>
                  <span className="font-serif font-bold text-sm text-[#1C1917]">
                    {currentStamps} de {totalRequired} sellos
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EAE4D5] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #5B6F00 0%, #B2C248 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Stamp Grid (2x5) */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: totalRequired }).map((_, i) => {
                  const num = i + 1;
                  const isDone = num <= currentStamps;
                  return (
                    <div
                      key={num}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-[#5B6F00] text-white shadow-2xs'
                          : 'bg-[#FAF7F2] text-[#78716C] border border-dashed border-[#DDD5C3]'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : num}
                    </div>
                  );
                })}
              </div>

              {/* Reward Preview */}
              <div className="p-3.5 rounded-2xl bg-[#F5F1E8] border border-[#EAE4D5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFFDF9] border border-[#EAE4D5] flex items-center justify-center text-[#5B6F00] shrink-0 shadow-2xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] block">
                    {isComplete ? '¡Premio listo!' : 'Próxima Recompensa'}
                  </span>
                  <p className="text-xs font-serif font-bold text-[#1C1917] truncate">
                    {config.currentRewardTitle || 'Clase Magistral o Taller Especial Gratis'}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Wallet Button */}
            <button
              type="button"
              onClick={handleSaveToGoogleWallet}
              disabled={isGeneratingWallet}
              className="w-full h-12 rounded-full bg-[#1C1917] hover:bg-black text-white text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isGeneratingWallet ? (
                <Loader2 className="w-4 h-4 text-[#B2C248] animate-spin" />
              ) : (
                <Smartphone className="w-4 h-4 text-[#B2C248]" />
              )}
              <span>
                {isGeneratingWallet ? 'Generando pase...' : 'Guardar en Google Wallet'}
              </span>
            </button>

            {walletError && (
              <p className="text-xs text-center text-[#C26748] font-semibold">
                {walletError}
              </p>
            )}
          </div>
        )}

        {/* ── TAB 2: STUDIO BENEFITS & PERKS ── */}
        {activeTab === 'details' && (
          <div className="bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-serif font-bold text-[#1C1917]">
              Beneficios para Miembros
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] flex items-start gap-3">
                <Gift className="w-5 h-5 text-[#5B6F00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#1C1917]">
                    Recompensa de 10 Visitas
                  </h4>
                  <p className="text-xs text-[#57534E] mt-0.5">
                    Al completar 10 sellos en tu pase digital, obtienes una clase magistral gratuita o un taller de meditación de fin de semana.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#5B6F00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#1C1917]">Ubicación</h4>
                  <p className="text-xs text-[#57534E] mt-0.5">
                    Calle 93 # 14-20, Chicó Norte, Bogotá D.C.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-[#5B6F00]" />
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#1C1917]">WiFi del Estudio</h4>
                    <p className="text-xs text-[#57534E] font-mono">yogashala2026</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWifi}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE4D5] text-xs font-bold text-[#1C1917] hover:bg-[#FAF7F2]"
                >
                  {copiedWifi ? '¡Copiado!' : 'Copiar Clave'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: INSTALL INSTRUCTIONS ── */}
        {activeTab === 'install' && (
          <div className="bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-serif font-bold text-[#1C1917]">
              ¿Cómo guardar tu pase digital?
            </h3>

            <div className="space-y-4 text-xs text-[#57534E]">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5]">
                <h4 className="font-serif font-bold text-[#1C1917] text-sm mb-1.5">
                  📱 En Android (Google Wallet)
                </h4>
                <p>
                  1. Pulsa el botón <strong>"Guardar en Google Wallet"</strong> en la pestaña principal.
                </p>
                <p className="mt-1">
                  2. Tu pase se archivará automáticamente en tu aplicación de Google Wallet y se actualizará en cada visita.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5]">
                <h4 className="font-serif font-bold text-[#1C1917] text-sm mb-1.5">
                  🍎 En iPhone (Safari)
                </h4>
                <p>
                  1. Pulsa el icono de <strong>Compartir</strong> (cuadrado con flecha hacia arriba) en Safari.
                </p>
                <p className="mt-1">
                  2. Selecciona <strong>"Agregar a Inicio"</strong>. Tendrás un icono directo con tu tarjeta sin ocupar espacio.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
