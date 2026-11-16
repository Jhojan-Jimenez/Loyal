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

interface AirbnbLoyaltyCardProps {
  initialStamps?: number;
  totalStamps?: number;
  businessName?: string;
  customerName?: string;
  rewardText?: string;
  showSimulateButton?: boolean;
}

export function AirbnbLoyaltyCard({
  initialStamps = 7,
  totalStamps = 10,
  businessName = 'Café & Panadería Magnolia',
  customerName = 'Camila Restrepo',
  rewardText = '1 Café de Especialidad o Postre de la Casa',
  showSimulateButton = true,
}: AirbnbLoyaltyCardProps) {
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
        colors: ['#e61e4d', '#e31c5f', '#d70466', '#ffb300', '#222222'],
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
    <div className="w-full max-w-[420px] mx-auto select-none">
      {/* ── Main Tactile Card ── */}
      <div
        className="relative bg-white rounded-[28px] border border-[#ebebeb] p-6 sm:p-7 text-[#222222] transition-all duration-300"
        style={{
          boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 16px 36px -4px rgba(34,34,34,0.08), 0 4px 12px rgba(34,34,34,0.03)',
        }}
      >
        {/* Top Header: Business identity & verified badge */}
        <div className="flex items-start justify-between border-b border-[#f2f2f2] pb-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Stamp logo seal */}
            <div className="w-11 h-11 rounded-2xl bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center text-[#e61e4d] shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6a6a6a]">
                Pase de Fidelización
              </span>
              <h3 className="text-[17px] font-semibold text-[#222222] tracking-tight leading-snug">
                {businessName}
              </h3>
            </div>
          </div>

          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-[#ebebeb] text-[11px] font-medium text-[#6a6a6a]"
            title="Pase Verificado y Encriptado"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#e61e4d]" />
            <span>Oficial</span>
          </div>
        </div>

        {/* Customer Mini Line */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6a6a6a]">Titular:</span>
            <span className="font-semibold text-[#222222]">{customerName}</span>
          </div>
          <button
            onClick={() => setShowQr(!showQr)}
            className="text-[11px] font-medium text-[#e61e4d] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{showQr ? 'Ver Sellos' : 'Ver QR'}</span>
          </button>
        </div>

        {/* QR or Stamps View */}
        {showQr ? (
          <div className="py-6 flex flex-col items-center justify-center bg-[#f7f7f7] rounded-2xl border border-[#ebebeb] my-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-[#ebebeb]">
              <QRCodeSVG
                value={`https://loyal.jhojan.cloud/card/camila-restrepo-yoga?stamp=${stamps}`}
                size={160}
                level="M"
                fgColor="#222222"
              />
            </div>
            <p className="text-xs text-[#6a6a6a] mt-3 font-medium">
              Muestra este código en el mostrador para sumar tu visita
            </p>
          </div>
        ) : (
          <>
            {/* Progress Bar & Counter */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#222222]">
                  {stamps} de {totalStamps} sellos acumulados
                </span>
                <span className="font-semibold text-[#e61e4d]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
                  }}
                />
              </div>
            </div>

            {/* Stamp Slots Grid (2 rows of 5) */}
            <div className="grid grid-cols-5 gap-2.5 my-3">
              {Array.from({ length: totalStamps }, (_, i) => i + 1).map((num) => {
                const isStamped = num <= stamps;
                const isFinal = num === totalStamps;
                const isNext = num === stamps + 1;

                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => !isStamped && handleAddStamp(num)}
                    disabled={isStamped}
                    title={isStamped ? `Sello ${num} completado` : isNext ? `Haz clic para sumar sello ${num}` : `Sello ${num}`}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                      isStamped
                        ? 'text-white shadow-sm scale-100 cursor-default'
                        : isNext
                        ? 'bg-[#ffffff] border-2 border-dashed border-[#e61e4d]/60 text-[#e61e4d] hover:bg-[#fff0f3] hover:scale-105 cursor-pointer shadow-2xs'
                        : 'bg-[#f7f7f7] border border-dashed border-[#dddddd] text-[#9a9a9a] cursor-pointer hover:border-[#b0b0b0]'
                    } ${justStamped === num ? 'animate-bounce' : ''}`}
                    style={
                      isStamped
                        ? {
                            background: 'linear-gradient(135deg, #e61e4d 0%, #d70466 100%)',
                            boxShadow: '0 3px 10px rgba(230, 30, 77, 0.28)',
                          }
                        : undefined
                    }
                  >
                    {isStamped ? (
                      <Check className="w-5 h-5 stroke-[2.8]" />
                    ) : isFinal ? (
                      <div className="flex flex-col items-center">
                        <Gift className="w-4 h-4 text-[#e61e4d]" />
                        <span className="text-[9px] font-bold mt-0.5">10</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold">{num}</span>
                    )}

                    {/* Next action hint dot */}
                    {isNext && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#e61e4d] ring-2 ring-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Reward Status Banner */}
        <div
          className={`mt-4 p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
            isCompleted
              ? 'bg-[#fff0f3] border-[#e61e4d]/30 text-[#e61e4d]'
              : 'bg-[#f7f7f7] border-[#ebebeb] text-[#222222]'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isCompleted ? 'bg-[#e61e4d] text-white' : 'bg-white border border-[#ebebeb] text-[#6a6a6a]'
            }`}
          >
            <Gift className="w-4 h-4" />
          </div>
          <div className="text-xs flex-1 min-w-0">
            <span className="font-semibold block truncate">
              {isCompleted ? '¡Tarjeta Completa! Canjea tu premio:' : 'Premio al completar 10 sellos:'}
            </span>
            <span className="text-[11px] text-[#6a6a6a] truncate block">
              {rewardText}
            </span>
          </div>
        </div>

        {/* Google Wallet & Apple Pass actions */}
        <div className="mt-4 pt-4 border-t border-[#f2f2f2] flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              window.open('/card/camila-restrepo-yoga', '_blank');
            }}
            className="w-full flex-1 py-2.5 px-4 rounded-full bg-[#222222] hover:bg-black text-white text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {/* Google Wallet Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2" />
              <path d="M17 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" fill="currentColor" />
            </svg>
            <span>Guardar en Google Wallet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] border border-[#dddddd] text-[#222222] text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#6a6a6a]" />
            <span>PWA Móvil</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls outside card */}
      {showSimulateButton && (
        <div className="mt-3.5 flex items-center justify-between px-2 text-xs text-[#6a6a6a]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span className="font-medium text-[#222222]">Tarjeta interactiva en vivo</span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                type="button"
                onClick={() => handleAddStamp()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fff0f3] hover:bg-[#ffe3e9] text-[#e61e4d] font-semibold text-xs border border-[#e61e4d]/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simular Sello (+1)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] text-[#222222] font-semibold text-xs border border-[#dddddd] transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Demo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
