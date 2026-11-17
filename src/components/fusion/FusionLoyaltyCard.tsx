'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  Gift,
  QrCode,
  ShieldCheck,
  Sparkles,
  Smartphone,
  RotateCcw,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FusionLoyaltyCardProps {
  initialStamps?: number;
  totalStamps?: number;
  businessName?: string;
  customerName?: string;
  rewardText?: string;
  showSimulateButton?: boolean;
}

export function FusionLoyaltyCard({
  initialStamps = 7,
  totalStamps = 10,
  businessName = 'Yoga Shala & Wellness',
  customerName = 'Camila Restrepo',
  rewardText = '1 Clase Magistral o Taller Especial Gratis',
  showSimulateButton = true,
}: FusionLoyaltyCardProps) {
  const [stamps, setStamps] = useState(initialStamps);
  const [showQr, setShowQr] = useState(false);
  const [justStamped, setJustStamped] = useState<number | null>(null);

  const isCompleted = stamps >= totalStamps;
  const progressPercent = Math.min(100, Math.round((stamps / totalStamps) * 100));

  const handleAddStamp = (index?: number) => {
    if (stamps >= totalStamps) return;
    const nextStamps = index !== undefined ? Math.max(stamps + 1, index) : stamps + 1;
    setStamps(nextStamps);
    setJustStamped(nextStamps);

    if (nextStamps === totalStamps) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5B6F00', '#B2C248', '#C26748', '#E5EACD', '#1C1917'],
      });
    }

    setTimeout(() => {
      setJustStamped(null);
    }, 600);
  };

  const handleReset = () => {
    setStamps(initialStamps);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto select-none font-sans">
      {/* ── Main Tactile Card (Airbnb Structure + Granola Warm Paper & Olive Aesthetic) ── */}
      <div
        className="relative bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-6 sm:p-7 text-[#1C1917] transition-all duration-300 shadow-[0_16px_36px_-6px_rgba(40,30,10,0.08),0_4px_12px_rgba(40,30,10,0.03)]"
      >
        {/* Top Header: Business identity & verified badge */}
        <div className="flex items-start justify-between border-b border-[#EAE4D5] pb-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Stamp logo seal */}
            <div className="w-11 h-11 rounded-2xl bg-[#F1F5DC] border border-[#D9E2B3] flex items-center justify-center text-[#5B6F00] shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6F00] font-bold">
                Pase de Fidelización
              </span>
              <h3 className="text-[17px] font-serif font-normal text-[#1C1917] tracking-tight leading-snug">
                {businessName}
              </h3>
            </div>
          </div>

          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F1E8] border border-[#EAE4D5] text-[11px] font-medium text-[#57534E]"
            title="Pase Verificado y Encriptado"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B6F00]" />
            <span className="hidden sm:inline font-mono text-[10px]">VERIFICADO</span>
          </div>
        </div>

        {/* Member Name and Cycle Counter */}
        <div className="flex items-center justify-between mb-5 bg-[#FAF7F2] rounded-2xl p-3 border border-[#EAE4D5]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C] block">
              Titular del Pase
            </span>
            <span className="text-[14px] font-bold text-[#1C1917]">
              {customerName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C] block">
              Ciclo Activo
            </span>
            <span className="text-[12px] font-mono font-bold text-[#5B6F00] bg-[#F1F5DC] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
              1° Recompensa
            </span>
          </div>
        </div>

        {/* Dynamic Visual Content: Stamp Grid or QR Code */}
        {!showQr ? (
          <div>
            {/* Stamp Progress Indicator */}
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-[#57534E] font-medium">
                Progreso:{' '}
                <strong className="text-[#1C1917] font-serif font-normal text-sm">
                  {stamps} de {totalStamps}
                </strong>{' '}
                sellos
              </span>
              <span className="text-[#5B6F00] font-bold text-xs">
                {isCompleted ? '¡Premio Desbloqueado!' : `Faltan ${totalStamps - stamps} visitas`}
              </span>
            </div>

            {/* Tactile Progress Track */}
            <div className="w-full h-2 rounded-full bg-[#EAE4D5] overflow-hidden mb-5">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #5B6F00 0%, #B2C248 100%)',
                }}
              />
            </div>

            {/* 10-Slot Stamp Grid (2 rows of 5) with Tactile Granola Olive Seals */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3 mb-6">
              {Array.from({ length: totalStamps }).map((_, i) => {
                const slotIndex = i + 1;
                const isStamped = slotIndex <= stamps;
                const isJustStamped = slotIndex === justStamped;

                return (
                  <button
                    key={slotIndex}
                    type="button"
                    onClick={() => handleAddStamp(slotIndex)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isStamped
                        ? 'bg-[#5B6F00] text-white shadow-xs scale-100'
                        : 'bg-[#F5F1E8] text-[#78716C] border border-dashed border-[#DDD5C3] hover:border-[#5B6F00] hover:bg-[#FAF7F2]'
                    } ${isJustStamped ? 'animate-bounce scale-110' : ''}`}
                    title={isStamped ? `Sello #${slotIndex} registrado` : `Clic para simular sello #${slotIndex}`}
                  >
                    {isStamped ? (
                      <div className="flex flex-col items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                        <span className="text-[9px] font-mono font-bold text-[#E5EACD] leading-none mt-0.5">
                          #{slotIndex}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-serif font-normal text-[#78716C]">
                          {slotIndex}
                        </span>
                        {slotIndex === stamps + 1 && (
                          <span className="text-[8px] font-bold text-[#5B6F00] uppercase tracking-tighter">
                            Sig.
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* QR Code Capability View */
          <div className="flex flex-col items-center justify-center py-4 mb-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE4D5] animate-in fade-in duration-200">
            <div className="p-3 bg-white rounded-2xl border border-[#EAE4D5] shadow-xs">
              <QRCodeSVG
                value={`https://loyal.jhojan.cloud/card/${customerName.toLowerCase().replace(/\s+/g, '-')}`}
                size={170}
                level="M"
                fgColor="#1C1917"
              />
            </div>
            <p className="text-xs font-semibold text-[#1C1917] mt-3">
              Muestra este código en el mostrador
            </p>
            <p className="text-[11px] text-[#78716C]">
              El lector de caja sumará tu visita al instante
            </p>
          </div>
        )}

        {/* Reward Callout Box in Warm Paper Tone */}
        <div className="p-3.5 rounded-2xl bg-[#F5F1E8] border border-[#EAE4D5] flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#FFFDF9] border border-[#EAE4D5] flex items-center justify-center text-[#5B6F00] shrink-0 shadow-2xs">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
              Premio al completar 10 sellos
            </span>
            <p className="text-xs font-serif font-normal text-[#1C1917] truncate">
              {rewardText}
            </p>
          </div>
        </div>

        {/* Dual Actions: Toggle QR & Google Wallet */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="h-11 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-xs font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#5B6F00]" />
            <span>{showQr ? 'Ver Sellos' : 'Ver Código QR'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.open('/api/wallet/google', '_blank');
            }}
            className="h-11 px-3 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-[#B2C248]" />
            <span>Google Wallet</span>
          </button>
        </div>

        {/* Simulation Controls for Demo Experience */}
        {showSimulateButton && (
          <div className="mt-4 pt-3.5 border-t border-[#EAE4D5] flex items-center justify-between text-[11px] text-[#78716C]">
            <span className="italic font-serif">Simulación interactiva en vivo</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddStamp()}
                disabled={isCompleted}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] font-semibold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3 h-3 text-[#5B6F00]" />
                <span>+1 Sello</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#78716C] hover:text-[#1C1917] font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                title="Reiniciar a 7 sellos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
