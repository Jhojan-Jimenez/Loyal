'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkles,
  Gift,
  QrCode,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, StudioConfig } from '@/lib/types';

interface GranolaCardProps {
  student?: Student;
  config?: StudioConfig;
  onOpenRegister?: () => void;
}

export function GranolaCard({ student, config, onOpenRegister }: GranolaCardProps) {
  const [stamps, setStamps] = useState<number>(student?.stamps ?? 7);
  const [showQR, setShowQR] = useState(false);
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [recentlyStamped, setRecentlyStamped] = useState<number | null>(null);

  const totalRequired = config?.totalStampsRequired || 10;
  const isComplete = stamps >= totalRequired;
  const remaining = Math.max(0, totalRequired - stamps);
  const progressPercent = Math.min(100, Math.round((stamps / totalRequired) * 100));

  const slots = Array.from({ length: totalRequired }, (_, i) => i + 1);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#5B6F00', '#B2C248', '#E5EACD', '#292929', '#E4D5B7'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSlotClick = (slotNum: number) => {
    if (slotNum <= stamps) return; // already stamped
    const nextVal = stamps + 1;
    setStamps(nextVal);
    setRecentlyStamped(nextVal);
    triggerCelebration();

    setTimeout(() => {
      setRecentlyStamped(null);
    }, 1200);
  };

  const handleAddStampButton = () => {
    if (stamps >= totalRequired) return;
    const nextVal = stamps + 1;
    setStamps(nextVal);
    setRecentlyStamped(nextVal);
    triggerCelebration();

    setTimeout(() => {
      setRecentlyStamped(null);
    }, 1200);
  };

  const handleReset = () => {
    setStamps(7);
    setRecentlyStamped(null);
  };

  const handleSaveToGoogleWallet = async () => {
    try {
      setIsGeneratingWallet(true);
      setWalletError(null);

      const res = await fetch('/api/wallet/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentToken: student?.token || 'camila-restrepo-yoga',
          studentName: student?.name || 'Camila Restrepo',
          currentStamps: stamps,
          totalCycles: student?.totalCompletedCycles || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.saveUrl) {
        throw new Error(data.error || 'No se pudo generar el pase de Google Wallet');
      }

      window.open(data.saveUrl, '_blank', 'noopener,noreferrer');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al conectar con Google Wallet';
      setWalletError(message);
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none font-sans">
      {/* ── Granola Application Window ── */}
      <div
        className="relative bg-[#F7F7F2] rounded-[24px] border border-[#D5D5D2] p-6 sm:p-8 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.08),0px_8px_10px_-6px_rgba(0,0,0,0.06)] transition-all duration-300"
        style={{
          boxShadow: '0px 20px 25px -5px rgba(41,41,41,0.08), 0px 8px 10px -6px rgba(41,41,41,0.06)',
        }}
      >
        {/* Window Chrome Header (3 subtle dots) */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#D5D5D2]/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5D5D2]/60" />
            <span className="ml-2 font-serif text-xs text-[#72726E] italic">
              Pase Digital Nº 0842 · Bogotá
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5EACD] text-[11px] font-sans font-medium text-[#5B6F00] border border-[#5B6F00]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B6F00]" />
              Activo en Google Wallet
            </span>
          </div>
        </div>

        {/* Card Title & Holder Name */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#72726E]">
              {config?.studioName || 'Estudio Yoga & Café de Origen'}
            </span>
            <h3 className="font-serif text-2xl sm:text-[28px] font-normal leading-[1.1] text-[#292929] mt-1 tracking-[-0.015em]">
              {student?.name || 'Camila Restrepo'}
            </h3>
            <p className="text-xs text-[#72726E] mt-1">
              Coleccionando visitas para su 10ª clase gratis
            </p>
          </div>

          {/* QR Code Quick Toggle */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2.5 rounded-xl bg-white border border-[#D5D5D2] hover:border-[#292929] text-[#292929] transition-all shadow-2xs hover:bg-[#F7F7F2] cursor-pointer"
            title={showQR ? 'Ver Sellos' : 'Ver Código QR'}
            aria-label="Alternar vista QR"
          >
            <QrCode className="w-5 h-5 text-[#5B6F00]" />
          </button>
        </div>

        {/* ── Flip: QR Scanner View or 10-Stamp Grid ── */}
        {showQR ? (
          <div className="py-6 px-4 bg-white rounded-2xl border border-[#D5D5D2] flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <div className="p-3 bg-white rounded-xl border border-[#D5D5D2] shadow-xs mb-3">
              <QRCodeSVG
                value={`https://loyal.jhojan.cloud/card/${student?.token || 'camila-restrepo-yoga'}`}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#292929"
                level="M"
              />
            </div>
            <span className="font-mono text-xs text-[#292929] font-medium tracking-wider">
              {student?.token || 'camila-restrepo-yoga'}
            </span>
            <span className="text-[11px] text-[#72726E] mt-1">
              Escanea este código en el mostrador del comercio para estampar.
            </span>
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 text-xs font-medium text-[#5B6F00] hover:underline"
            >
              ← Volver a los sellos
            </button>
          </div>
        ) : (
          <div>
            {/* 10 Stamp Grid */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 mb-6">
              {slots.map((num) => {
                const isStamped = num <= stamps;
                const isReward = num === totalRequired;
                const isJustStamped = recentlyStamped === num;

                return (
                  <button
                    key={num}
                    onClick={() => handleSlotClick(num)}
                    disabled={isStamped}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isStamped
                        ? 'bg-[#E5EACD] border-2 border-[#5B6F00] text-[#5B6F00] shadow-xs'
                        : isReward
                        ? 'bg-white border-2 border-dashed border-[#B2C248] text-[#72726E] hover:border-[#5B6F00]'
                        : 'bg-white border border-[#D5D5D2] text-[#72726E] hover:border-[#5B6F00]/60 hover:bg-[#F7F7F2]'
                    } ${isJustStamped ? 'scale-110 rotate-2' : ''}`}
                    title={
                      isStamped
                        ? `Sello ${num} completado`
                        : isReward
                        ? 'Sello 10: Recompensa final'
                        : `Toca para simular el sello ${num}`
                    }
                  >
                    {isStamped ? (
                      /* Artisanal Ink Stamp Motif */
                      <div className="flex flex-col items-center justify-center transform -rotate-3">
                        {isReward ? (
                          <Gift className="w-5 h-5 text-[#5B6F00]" />
                        ) : (
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B6F00]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
                            <polyline points="9 12 11 14 15 10" />
                          </svg>
                        )}
                        <span className="text-[9px] font-sans font-bold tracking-tighter text-[#5B6F00] mt-0.5">
                          #{num}
                        </span>
                      </div>
                    ) : (
                      /* Empty Slot */
                      <div className="flex flex-col items-center justify-center">
                        {isReward ? (
                          <>
                            <Gift className="w-4 h-4 text-[#B2C248]" />
                            <span className="text-[8px] font-sans font-semibold uppercase tracking-wider text-[#5B6F00] mt-0.5">
                              Premio
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-serif text-sm font-normal text-[#72726E]">
                              {num}
                            </span>
                            <span className="text-[8px] text-[#72726E]/60 uppercase tracking-tight">
                              Vacío
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Stamped Ink Ring Overlay */}
                    {isStamped && (
                      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#5B6F00]/20" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Notice & Quick Actions */}
            <div className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-xl border border-[#D5D5D2]/70 mb-5">
              <span className="flex items-center gap-1.5 text-[#292929]">
                <Sparkles className="w-3.5 h-3.5 text-[#5B6F00]" />
                <span className="text-[11px] font-medium">
                  {isComplete
                    ? '¡Tarjeta completa! Canjea tu premio en caja.'
                    : `Toca un casillero vacío o añade visita (${stamps}/10)`}
                </span>
              </span>

              <div className="flex items-center gap-2">
                {!isComplete ? (
                  <button
                    onClick={handleAddStampButton}
                    className="px-2.5 py-1 rounded-lg bg-[#5B6F00] text-[#FCFCF8] text-[11px] font-medium hover:bg-[#4D5E00] transition-colors cursor-pointer"
                  >
                    +1 Sello
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7F7F2] text-[#292929] border border-[#D5D5D2] text-[11px] font-medium hover:bg-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reiniciar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Progress Bar ── */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[#72726E]">
              {isComplete
                ? 'Premio desbloqueado'
                : `Faltan ${remaining} visitas para tu recompensa`}
            </span>
            <span className="font-medium text-[#292929]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white border border-[#D5D5D2]/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5B6F00] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── Conversion Actions ── */}
        <div className="space-y-2.5 pt-2 border-t border-[#D5D5D2]/60">
          {/* Save to Google Wallet Button */}
          <button
            onClick={handleSaveToGoogleWallet}
            disabled={isGeneratingWallet}
            className="w-full h-12 rounded-full bg-[#292929] hover:bg-[#0E0F0C] text-[#FCFCF8] text-xs sm:text-sm font-sans font-medium flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
          >
            {isGeneratingWallet ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generando Pase Oficial...</span>
              </>
            ) : (
              <>
                {/* Official Google Wallet Emblem SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.99 1-1.72V9c0-.73-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"
                    fill="#FCFCF8"
                  />
                  <circle cx="16" cy="12" r="1.5" fill="#B2C248" />
                </svg>
                <span>Guardar en Google Wallet</span>
              </>
            )}
          </button>

          {walletError && (
            <p className="text-[11px] text-red-600 text-center">{walletError}</p>
          )}

          {/* Subtext info & demo creation */}
          <div className="flex flex-col items-center gap-1 text-[11px] text-[#72726E] text-center">
            <p>Pase digital oficial con actualizaciones en tiempo real y notificaciones por ubicación.</p>
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="text-[11px] font-medium text-[#5B6F00] hover:underline cursor-pointer"
              >
                ¿Quieres un pase para tu negocio? Crea tu tarjeta demo aquí →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
