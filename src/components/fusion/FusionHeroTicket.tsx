'use client';

import React, { useState } from 'react';
import { ShieldCheck, Gift, TrendingUp, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FusionHeroTicketProps {
  onOpenRegister?: () => void;
  size?: 'default' | 'lg';
  className?: string;
}

export function FusionHeroTicket({ onOpenRegister, size = 'default', className = '' }: FusionHeroTicketProps) {
  const isLg = size === 'lg';
  const [stamps, setStamps] = useState<number>(7);
  const totalRequired = 10;
  const isComplete = stamps >= totalRequired;
  const progressPercent = Math.min(100, Math.round((stamps / totalRequired) * 100));

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5B6F00', '#B2C248', '#E5EACD', '#292929', '#E4D5B7'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSlotClick = (num: number) => {
    if (num <= stamps) return;
    setStamps((prev) => Math.min(totalRequired, prev + 1));
    triggerCelebration();
  };

  return (
    <div
      className={`relative w-full ${isLg ? 'max-w-[480px]' : 'max-w-[400px]'} select-none font-sans ${className}`}
    >
      {/* ── Main Compact Ticket / Stamp Card ── */}
      <div
        className={`relative w-full ${isLg ? 'p-3.5 sm:p-6 lg:p-7 rounded-[22px] sm:rounded-[28px]' : 'p-4 sm:p-6 rounded-3xl'} bg-[#F7F7F2] text-[#292929] border border-[#D5D5D2] transition-all duration-300`}
        style={{
          boxShadow: isLg
            ? '0 25px 35px -10px rgba(41,41,41,0.09), 0 10px 20px -6px rgba(41,41,41,0.06)'
            : '0 20px 30px -10px rgba(41,41,41,0.08), 0 8px 16px -6px rgba(41,41,41,0.05)',
        }}
      >
        {/* Header inside ticket */}
        <div className={`flex items-start justify-between border-b border-[#D5D5D2]/80 ${isLg ? 'pb-2 sm:pb-4' : 'pb-2.5 sm:pb-3'}`}>
          <div>
            <span className={`${isLg ? 'text-[9px] sm:text-[11px]' : 'text-[10px]'} uppercase font-bold tracking-widest text-[#72726E]`}>
              Pase Digital
            </span>
            <h3 className={`font-serif ${isLg ? 'text-[16px] sm:text-[21px] lg:text-[23px]' : 'text-base sm:text-lg'} font-normal text-[#292929] tracking-tight mt-0.5`}>
              Tu Negocio / Marca
            </h3>
            <p className={`hidden sm:block ${isLg ? 'text-xs' : 'text-[11px]'} text-[#72726E]`}>
              Club de Fidelización &amp; Sellos
            </p>
          </div>
          <div className={`${isLg ? 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl' : 'w-8 h-8 rounded-xl'} bg-white border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00] shadow-2xs`}>
            <ShieldCheck className={`${isLg ? 'w-4 h-4 sm:w-4.5 sm:h-4.5' : 'w-4 h-4'} text-[#5B6F00]`} />
          </div>
        </div>

        {/* Progress bar inside ticket */}
        <div className={isLg ? 'py-2 sm:py-4' : 'py-2.5 sm:py-3'}>
          <div className={`flex items-center justify-between ${isLg ? 'text-[11px] sm:text-[13px] mb-1.5 sm:mb-2' : 'text-xs mb-1.5'}`}>
            <span className="font-medium text-[#292929]">
              {stamps} de {totalRequired} Sellos Acumulados
            </span>
            <span className={`font-bold text-[#5B6F00] font-sans ${isLg ? 'text-xs sm:text-sm' : ''}`}>
              {progressPercent}%
            </span>
          </div>
          <div className={`w-full bg-white border border-[#D5D5D2]/80 ${isLg ? 'h-2 sm:h-2.5' : 'h-2'} rounded-full overflow-hidden`}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#5B6F00]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Grid of 10 stamps (2 rows of 5) */}
        <div className={`grid grid-cols-5 ${isLg ? 'gap-1.5 sm:gap-2.5 lg:gap-3 my-1.5 sm:my-3' : 'gap-1.5 sm:gap-2 my-2'}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isFilled = num <= stamps;
            const isNext = num === stamps + 1;

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSlotClick(num)}
                disabled={isFilled}
                className={`aspect-square ${isLg ? 'rounded-xl sm:rounded-2xl' : 'rounded-xl'} flex flex-col items-center justify-center ${isLg ? 'text-[11px] sm:text-[13px]' : 'text-[10px]'} font-bold transition-all duration-200 cursor-pointer ${
                  isFilled
                    ? 'bg-[#E5EACD] border border-[#5B6F00] text-[#5B6F00] shadow-2xs'
                    : isNext
                    ? 'bg-white border-2 border-dashed border-[#5B6F00] text-[#72726E] hover:bg-[#F7F7F2]'
                    : 'bg-white border border-dashed border-[#D5D5D2] text-[#72726E]/70 hover:border-[#5B6F00]/50'
                }`}
                title={isFilled ? `Sello ${num} completado` : `Toca para sumar el sello ${num}`}
              >
                {isFilled ? (
                  <Check className={`${isLg ? 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5' : 'w-3.5 h-3.5'} stroke-[2.5] text-[#5B6F00]`} />
                ) : (
                  <span className={`font-sans font-medium ${isLg ? 'text-[11px] sm:text-[13px]' : 'text-[11px]'} text-[#72726E]`}>
                    {num}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reward preview box */}
        <div className={`${isLg ? 'mt-2 sm:mt-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl' : 'mt-2.5 sm:mt-3 p-2.5 rounded-xl'} bg-white border border-[#D5D5D2] flex items-center gap-2 ${isLg ? 'text-[11px] sm:text-[13px]' : 'text-xs'} text-[#292929]`}>
          <Gift className={`${isLg ? 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5' : 'w-4 h-4'} text-[#5B6F00] shrink-0`} />
          <span className={`truncate font-sans ${isLg ? 'text-[11px] sm:text-[12px]' : 'text-[11px]'} text-[#292929]`}>
            Premio: Producto gratis al 10º sello
          </span>
        </div>

        {/* Floating High-Conversion Metric Badge */}
        <div
          className={`hidden sm:flex absolute -bottom-3 -right-3 sm:-right-4 bg-white text-[#292929] ${isLg ? 'px-4 py-2 rounded-2xl shadow-lg text-[13px]' : 'px-3.5 py-1.5 rounded-xl shadow-md text-xs'} border border-[#D5D5D2] items-center gap-2`}
        >
          <TrendingUp className={`${isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-[#5B6F00]`} />
          <span className="font-bold text-[#292929]">
            +38% Retorno de clientes
          </span>
        </div>
      </div>
    </div>
  );
}
export { FusionHeroTicket as GranolaHeroTicket };
