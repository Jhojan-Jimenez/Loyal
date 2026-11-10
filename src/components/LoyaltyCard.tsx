'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, StudioConfig } from '@/lib/types';
import { MandalaBackground, LotusIcon } from './MandalaBackground';
import {
  Sparkles,
  Wifi,
  MapPin,
  MessageCircle,
  Share,
  Smartphone,
  Info,
  CheckCircle2,
  Gift,
  ExternalLink,
  Wallet,
  Loader2,
} from 'lucide-react';

interface LoyaltyCardProps {
  student: Student;
  config: StudioConfig;
}

export function LoyaltyCard({ student, config }: LoyaltyCardProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'details' | 'install'>('card');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const totalRequired = config.totalStampsRequired;
  const currentStamps = Math.min(student.stamps, totalRequired);
  const remaining = Math.max(0, totalRequired - currentStamps);
  const isComplete = currentStamps >= totalRequired;
  const progressPercent = Math.round((currentStamps / totalRequired) * 100);

  // Generate slots array (1 to totalRequired)
  const slots = Array.from({ length: totalRequired }, (_, i) => i + 1);

  const handleSaveToGoogleWallet = async () => {
    setIsGeneratingWallet(true);
    setWalletError(null);

    try {
      const res = await fetch('/api/wallet/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, config }),
      });

      const data = await res.json();
      if (data.success && data.saveUrl) {
        // Open Google Wallet save link
        window.open(data.saveUrl, '_blank');
      } else {
        setWalletError(data.error || 'No se pudo generar el enlace de Google Wallet');
      }
    } catch (err: any) {
      console.error('Error saving to Google Wallet:', err);
      setWalletError('Error de conexión al generar el pase de Google Wallet');
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Switcher */}
      <div className="flex bg-purple-100/70 p-1 rounded-2xl mb-4 border border-purple-200/50">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'card'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-purple-900/60 hover:text-purple-950'
          }`}
        >
          <LotusIcon className="w-4 h-4 text-purple-600" />
          <span>Tarjeta Digital</span>
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'details'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-purple-900/60 hover:text-purple-950'
          }`}
        >
          <Info className="w-4 h-4 text-purple-600" />
          <span>Estudio & Wi-Fi</span>
        </button>
        <button
          onClick={() => setActiveTab('install')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'install'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-purple-900/60 hover:text-purple-950'
          }`}
        >
          <Wallet className="w-4 h-4 text-purple-600" />
          <span>Google Wallet & PWA</span>
        </button>
      </div>

      {/* Main View: Digital Punch Card */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          {/* Physical Style Punch Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30 p-6 shadow-xl shadow-purple-900/10 border border-purple-200/80">
            {/* Background Decorative Mandala */}
            <MandalaBackground className="right-[-40px] top-[-40px] w-64 h-64" opacity="opacity-15" />
            <MandalaBackground className="left-[-60px] bottom-[-60px] w-72 h-72" opacity="opacity-10" />

            {/* Studio Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-purple-100/80 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Pase Oficial de Clases
                </span>
                <h2 className="text-xl font-bold text-purple-950 mt-1 tracking-tight">
                  {config.studioName}
                </h2>
                <p className="text-xs text-purple-600/80 italic">{config.tagline}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 p-0.5 shadow-md shadow-purple-600/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <LotusIcon className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Student Info Bar */}
            <div className="relative z-10 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-purple-900/60 font-medium uppercase tracking-wider">
                  Alumno(a)
                </p>
                <p className="text-base font-semibold text-purple-950">{student.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-purple-900/60 font-medium uppercase tracking-wider">
                  Premios Ganados
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-fuchsia-700 bg-fuchsia-100/80 px-2.5 py-0.5 rounded-full">
                  <Gift className="w-3 h-3" />
                  {student.totalCompletedCycles} {student.totalCompletedCycles === 1 ? 'ciclo' : 'ciclos'}
                </span>
              </div>
            </div>

            {/* Progress Notification Banner */}
            <div
              className={`relative z-10 rounded-2xl p-3.5 my-2 transition-all ${
                isComplete
                  ? 'bg-gradient-to-r from-amber-500/15 via-fuchsia-500/15 to-purple-500/15 border border-amber-300 text-amber-950'
                  : 'bg-purple-100/60 border border-purple-200/60 text-purple-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  {isComplete ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-600 animate-bounce" />
                      ¡Meta de 10 Clases Alcanzada!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      {currentStamps} de {totalRequired} Clases Asistidas
                    </>
                  )}
                </span>
                <span className="text-xs font-semibold text-purple-700">{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-purple-200/60 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-purple-800/80 mt-2 font-medium">
                {isComplete
                  ? 'Acércate a recepción para canjear tu taller o mat de cortesía.'
                  : `Te faltan solo ${remaining} ${remaining === 1 ? 'clase' : 'clases'} para desbloquear tu recompensa.`}
              </p>
            </div>

            {/* 10-Slot Visual Punch Card Grid */}
            <div className="relative z-10 my-4">
              <div className="grid grid-cols-5 gap-2.5">
                {slots.map((num) => {
                  const isFilled = num <= currentStamps;
                  const isCurrent = num === currentStamps;

                  return (
                    <div
                      key={num}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isFilled
                          ? 'bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-md shadow-purple-600/30 scale-100'
                          : 'bg-white/80 border-2 border-dashed border-purple-200 text-purple-300'
                      } ${isCurrent ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
                    >
                      {isFilled ? (
                        <div className="flex flex-col items-center">
                          <LotusIcon className="w-5 h-5 text-white drop-shadow-sm" />
                          <span className="text-[9px] font-bold text-white/90 mt-0.5">#{num}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-semibold text-purple-400/80">{num}</span>
                          <span className="text-[8px] text-purple-300 uppercase tracking-tighter">
                            Clase
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Card Highlight */}
            <div className="relative z-10 bg-white/90 rounded-2xl p-3 border border-purple-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-purple-600 uppercase font-bold tracking-wider">
                  Premio al completar
                </p>
                <p className="text-xs font-semibold text-purple-950 truncate">
                  {config.currentRewardTitle}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Presentation Box (To show at studio check-in) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-900/5 border border-purple-100 text-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-purple-950">Muestra este código al entrar</h3>
            <p className="text-xs text-purple-600/80 mt-0.5">
              La recepcionista lo escaneará en 2 segundos para sumar tu clase
            </p>

            <div className="my-4 inline-block p-4 rounded-3xl bg-white shadow-inner border border-purple-100/80">
              <QRCodeSVG
                value={student.token}
                size={175}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                ID: {student.token}
              </span>
            </div>

            {/* Google Wallet Native Button */}
            <div className="mt-5 pt-4 border-t border-purple-100">
              <button
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98"
              >
                {isGeneratingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Firmando pase de Google Wallet...</span>
                  </>
                ) : (
                  <>
                    {/* Google Wallet Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z" stroke="white" strokeWidth="1.5" />
                      <path d="M3 10H21" stroke="#4285F4" strokeWidth="1.5" />
                      <circle cx="16.5" cy="15" r="1.5" fill="#34A853" />
                    </svg>
                    <span>Guardar en Google Wallet (Android)</span>
                  </>
                )}
              </button>

              {walletError && (
                <p className="text-[11px] text-rose-600 mt-2 font-medium">{walletError}</p>
              )}
            </div>

            <div className="mt-4 pt-3 flex items-center justify-around text-xs text-purple-700">
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20pase%20de%20clases`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-medium hover:text-purple-950"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp Estudio
              </a>
              <span className="text-purple-200">|</span>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 font-medium hover:text-purple-950"
              >
                <Share className="w-4 h-4 text-purple-600" />
                Compartir Mi Pase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Studio Details & Wi-Fi */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-900/5 border border-purple-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-purple-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-950">Información del Estudio</h3>
              <p className="text-xs text-purple-600">Servicios y comodidades para tu práctica</p>
            </div>
          </div>

          {/* Wi-Fi Zen Box */}
          <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/60">
            <div className="flex items-center gap-2 text-purple-900 font-semibold text-xs mb-1">
              <Wifi className="w-4 h-4 text-purple-600" />
              Wi-Fi de Alta Velocidad para Alumnos
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-200/40 text-xs">
              <div>
                <span className="text-[10px] text-purple-600/70 block uppercase font-medium">Red</span>
                <span className="font-semibold text-purple-950">{config.wifiSsid}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-600/70 block uppercase font-medium">Clave</span>
                <span className="font-mono font-bold text-purple-950 bg-white/80 px-2 py-0.5 rounded-md inline-block">
                  {config.wifiPassword}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/60">
            <div className="flex items-center gap-2 text-purple-900 font-semibold text-xs mb-1">
              <MapPin className="w-4 h-4 text-purple-600" />
              Ubicación del Estudio
            </div>
            <p className="text-xs text-purple-950 mt-1">{config.address}</p>
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 mt-2"
            >
              Ver en Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Reward Details */}
          <div className="bg-fuchsia-50/70 rounded-2xl p-4 border border-fuchsia-200/60">
            <div className="flex items-center gap-2 text-fuchsia-950 font-semibold text-xs mb-1">
              <Gift className="w-4 h-4 text-fuchsia-600" />
              Términos del Programa de Fidelización
            </div>
            <p className="text-xs text-fuchsia-900/80 mt-1 leading-relaxed">
              {config.currentRewardDescription}
            </p>
          </div>
        </div>
      )}

      {/* Tab: How to Install PWA / Wallet */}
      {activeTab === 'install' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-900/5 border border-purple-100 space-y-4">
          <div className="flex items-center gap-3 border-b border-purple-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-950">Guarda tu Pase en tu Móvil</h3>
              <p className="text-xs text-purple-600">En Google Wallet o Pantalla de Inicio</p>
            </div>
          </div>

          {/* Option 1: Native Google Wallet (Android) */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Opción 1: Google Wallet (Android Oficial)
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                1 Clic
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 mb-3">
              Guarda tu pase oficial directamente en la aplicación Google Wallet de tu teléfono junto a tus tarjetas.
            </p>
            <button
              onClick={handleSaveToGoogleWallet}
              disabled={isGeneratingWallet}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingWallet ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
              )}
              <span>Añadir a Google Wallet Ahora</span>
            </button>
          </div>

          {/* Option 2: iOS Instructions */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl p-4 border border-purple-200/60">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-950">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              En iPhone (Safari) — Pantalla de Inicio
            </div>
            <ol className="text-xs text-purple-900/80 space-y-1.5 mt-2 pl-2">
              <li className="flex items-start gap-2">
                <span>1.</span>
                <span>
                  Toca el botón <strong>Compartir</strong> <Share className="w-3 h-3 inline mx-0.5 text-purple-600" /> en Safari.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>2.</span>
                <span>
                  Baja y toca <strong>"Añadir a la pantalla de inicio"</strong>.
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-purple-950">Enlace directo a tu pase</h4>
            <p className="text-xs text-purple-600/80 mt-1">
              Guarda este enlace en tus favoritos o envíatelo por WhatsApp para no perderlo nunca:
            </p>
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="w-full text-xs font-mono bg-purple-50 border border-purple-200 rounded-xl p-2.5 mt-3 text-purple-900"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('¡Enlace copiado al portapapeles!');
                  }
                  setShowShareModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
              >
                Copiar Enlace
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-xs font-semibold hover:bg-purple-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
