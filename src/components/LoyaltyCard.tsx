'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkles,
  Wallet,
  CheckCircle2,
  Gift,
  Share,
  Info,
  MapPin,
  Wifi,
  ExternalLink,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Student, StudioConfig } from '@/lib/types';

interface LoyaltyCardProps {
  student: Student;
  config: StudioConfig;
}

export function LoyaltyCard({ student, config }: LoyaltyCardProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'details' | 'install'>('card');
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const totalRequired = config.totalStampsRequired || 10;
  const currentStamps = student.stamps;
  const isComplete = currentStamps >= totalRequired;
  const remaining = Math.max(0, totalRequired - currentStamps);
  const progressPercent = Math.min(100, Math.round((currentStamps / totalRequired) * 100));

  const slots = Array.from({ length: totalRequired }, (_, i) => i + 1);

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
        throw new Error(data.error || 'No se pudo generar el enlace de Google Wallet');
      }

      window.open(data.saveUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Error al guardar en Google Wallet:', err);
      setWalletError(err.message || 'Error al conectar con Google Wallet');
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-sans">
      {/* Sober Tab Navigation */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'card'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Pase Digital
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'details'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-neutral-600" />
          <span>Local & Wi-Fi</span>
        </button>
        <button
          onClick={() => setActiveTab('install')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'install'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-neutral-600" />
          <span>Google Wallet</span>
        </button>
      </div>

      {/* Main View: Digital Punch Card */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          {/* Executive Black Membership Stamp Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 sm:p-7 shadow-2xl border border-neutral-800">
            {/* Subtle Minimalist Geometry in Background */}
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-neutral-800/40 pointer-events-none select-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full border border-neutral-800/30 pointer-events-none select-none" />

            {/* Business Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {config.studioName}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">{config.tagline}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-neutral-200" />
              </div>
            </div>

            {/* Member Info Bar */}
            <div className="relative z-10 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                  Miembro / Titular
                </p>
                <p className="text-base font-semibold text-white">{student.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                  Premios Ganados
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-200 bg-neutral-800/90 border border-neutral-700 px-2.5 py-0.5 rounded-full">
                  <Gift className="w-3 h-3 text-neutral-300" />
                  {student.totalCompletedCycles} {student.totalCompletedCycles === 1 ? 'ciclo' : 'ciclos'}
                </span>
              </div>
            </div>

            {/* Progress Status Banner */}
            <div className="relative z-10 rounded-2xl p-3.5 my-2 bg-neutral-900/90 border border-neutral-800 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  {isComplete ? (
                    <>
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      ¡Meta de 10 Sellos Alcanzada!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-neutral-300" />
                      {currentStamps} de {totalRequired} Sellos Acumulados
                    </>
                  )}
                </span>
                <span className="text-xs font-semibold text-neutral-300">{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-neutral-400 mt-2 font-medium">
                {isComplete
                  ? 'Acércate al mostrador para canjear tu recompensa exclusiva.'
                  : `Te faltan solo ${remaining} ${remaining === 1 ? 'sello' : 'sellos'} para desbloquear tu recompensa.`}
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
                          ? 'bg-white text-neutral-950 shadow-md font-bold'
                          : 'bg-neutral-900/80 border border-dashed border-neutral-700 text-neutral-500'
                      } ${isCurrent ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-neutral-950' : ''}`}
                    >
                      {isFilled ? (
                        <div className="flex flex-col items-center">
                          <Check className="w-5 h-5 text-neutral-950 stroke-[3]" />
                          <span className="text-[9px] font-bold text-neutral-900 mt-0.5">#{num}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-semibold text-neutral-400">{num}</span>
                          <span className="text-[8px] text-neutral-500 uppercase tracking-tighter">
                            Sello
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Card Highlight */}
            <div className="relative z-10 bg-neutral-900/90 rounded-2xl p-3 border border-neutral-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Gift className="w-4 h-4 text-neutral-200" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  Premio al completar
                </p>
                <p className="text-xs font-semibold text-white truncate">
                  {config.currentRewardTitle}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Presentation Box (To show at store check-in) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 text-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-neutral-950">Muestra este código al visitar</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              El encargado lo escaneará en 1 segundo para sumar tu visita
            </p>

            <div className="my-4 inline-block p-4 rounded-3xl bg-neutral-50 shadow-inner border border-neutral-200">
              <QRCodeSVG
                value={student.token}
                size={175}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full border border-neutral-200">
                ID: {student.token}
              </span>
            </div>

            {/* Google Wallet Native Button */}
            <div className="mt-5 pt-4 border-t border-neutral-200">
              <button
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                {isGeneratingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    <span>Firmando pase de Google Wallet...</span>
                  </>
                ) : (
                  <>
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

            <div className="mt-4 pt-3 flex items-center justify-around text-xs text-neutral-600">
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20pase%20de%20cliente`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-medium hover:text-neutral-950 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp Local
              </a>
              <span className="text-neutral-300">|</span>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 font-medium hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <Share className="w-4 h-4 text-neutral-600" />
                Compartir Mi Pase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Business Details & Wi-Fi */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950">Información del Establecimiento</h3>
              <p className="text-xs text-neutral-500">Servicios y comodidades para clientes</p>
            </div>
          </div>

          {/* Wi-Fi Box */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-1">
              <Wifi className="w-4 h-4 text-neutral-700" />
              Wi-Fi de Alta Velocidad para Clientes
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-medium">Red</span>
                <span className="font-semibold text-neutral-900">{config.wifiSsid}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-medium">Clave</span>
                <span className="font-mono font-bold text-neutral-950 bg-white border border-neutral-200 px-2 py-0.5 rounded-md inline-block">
                  {config.wifiPassword}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-1">
              <MapPin className="w-4 h-4 text-neutral-700" />
              Ubicación
            </div>
            <p className="text-xs text-neutral-800 mt-1">{config.address}</p>
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-950 hover:underline mt-2"
            >
              Ver en Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Reward Terms */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-xs mb-1">
              <Gift className="w-4 h-4 text-neutral-700" />
              Términos del Programa de Fidelización
            </div>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              {config.currentRewardDescription}
            </p>
          </div>
        </div>
      )}

      {/* Tab: How to Install PWA / Wallet */}
      {activeTab === 'install' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950">Guarda tu Pase en tu Móvil</h3>
              <p className="text-xs text-neutral-500">En Google Wallet o Pantalla de Inicio</p>
            </div>
          </div>

          {/* Option 1: Native Google Wallet (Android) */}
          <div className="bg-neutral-950 text-white rounded-2xl p-4 shadow-md border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Opción 1: Google Wallet (Android Oficial)
              </span>
              <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                1 Clic
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-3">
              Guarda tu pase oficial directamente en la aplicación Google Wallet de tu teléfono junto a tus tarjetas.
            </p>
            <button
              onClick={handleSaveToGoogleWallet}
              disabled={isGeneratingWallet}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingWallet ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-950" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-neutral-950" />
              )}
              <span>Añadir a Google Wallet Ahora</span>
            </button>
          </div>

          {/* Option 2: iOS Instructions */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
            <div className="flex items-center gap-2 font-bold text-xs text-neutral-950">
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              En iPhone (Safari) — Pantalla de Inicio
            </div>
            <ol className="text-xs text-neutral-600 space-y-1.5 mt-2 pl-2">
              <li className="flex items-start gap-2">
                <span>1.</span>
                <span>
                  Toca el botón <strong>Compartir</strong> <Share className="w-3 h-3 inline mx-0.5 text-neutral-800" /> en Safari.
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
        <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-neutral-950">Enlace directo a tu pase</h4>
            <p className="text-xs text-neutral-600 mt-1">
              Guarda este enlace en tus favoritos o envíatelo por WhatsApp para no perderlo nunca:
            </p>
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 mt-3 text-neutral-900"
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
                className="flex-1 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
              >
                Copiar Enlace
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
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
