'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, Loader2 } from 'lucide-react';

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  confirmOnly?: boolean;
  onConfirm?: () => void | Promise<void>;
}

interface ConfirmModalProps {
  state: ConfirmModalState | null;
  loading?: boolean;
  onClose: () => void;
}

export function ConfirmModal({ state, loading = false, onClose }: ConfirmModalProps) {
  useEffect(() => {
    if (!state?.isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state?.isOpen, loading, onClose]);

  if (!state || !state.isOpen) return null;

  const variant = state.variant || 'danger';

  const iconStyles = {
    danger: 'bg-[#FDF2F0] text-[#C2410C] border-[#F5C7C0]',
    warning: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    info: 'bg-[#FAF7F2] text-[#5B6F00] border-[#EAE4D5]',
    success: 'bg-[#F1F5DC] text-[#5B6F00] border-[#D9E2B3]',
  }[variant];

  const confirmBtnStyles = {
    danger: 'bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-md',
    warning: 'bg-[#B45309] hover:bg-[#92400E] text-white shadow-md',
    info: 'bg-[#5B6F00] hover:bg-[#4D5E00] text-white shadow-md',
    success: 'bg-[#5B6F00] hover:bg-[#4D5E00] text-white shadow-md',
  }[variant];

  const Icon =
    variant === 'success'
      ? CheckCircle2
      : variant === 'info'
        ? Info
        : AlertTriangle;

  const handleConfirm = async () => {
    if (state.onConfirm) {
      await state.onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1C1917]/55 backdrop-blur-xs font-sans animate-in fade-in duration-150"
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFDF9] rounded-[32px] p-6 sm:p-7 border border-[#EAE4D5] shadow-[0_24px_48px_-12px_rgba(40,30,10,0.28)] space-y-5 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${iconStyles}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="pt-0.5">
              <h3 className="text-lg font-serif font-normal text-[#1C1917] leading-snug">
                {state.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#57534E] mt-1.5 leading-relaxed">
                {state.message}
              </p>
            </div>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#78716C] transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EAE4D5]">
          {!state.confirmOnly && (
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="h-11 px-5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {state.cancelLabel || 'Cancelar'}
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={`h-11 px-6 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${confirmBtnStyles}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{state.confirmLabel || (state.confirmOnly ? 'Entendido' : 'Confirmar')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
