'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useLoyal } from '@/context/LoyalContext';

interface GranolaRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GranolaRegisterModal({ isOpen, onClose }: GranolaRegisterModalProps) {
  const router = useRouter();
  const { registerStudent } = useLoyal();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const student = registerStudent(name.trim(), phone.trim(), email.trim() || undefined);
      onClose();
      router.push(`/card/${student.token}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0F0C]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[460px] bg-[#F7F7F2] rounded-[24px] border border-[#D5D5D2] p-7 sm:p-9 text-[#292929] shadow-[0px_20px_25px_-5px_rgba(41,41,41,0.2),0px_8px_10px_-6px_rgba(41,41,41,0.15)] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#72726E] hover:text-[#292929] hover:bg-white/80 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EACD] text-[11px] font-sans font-medium text-[#5B6F00] border border-[#5B6F00]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pase de fidelidad instantáneo</span>
          </div>

          <h3 className="font-serif text-[28px] sm:text-[32px] font-normal leading-[1.05] text-[#292929] tracking-[-0.015em]">
            Crea tu tarjeta demo
          </h3>

          <p className="font-sans text-[15px] leading-[1.45] text-[#72726E]">
            Genera un pase digital real en 3 segundos. Puedes sellarlo en vivo desde tu teléfono o computadora.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#72726E] mb-1.5">
              Nombre de tu cliente o de prueba
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Sofia Andrade"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#D5D5D2] text-sm text-[#292929] placeholder:text-[#72726E]/50 focus:outline-hidden focus:border-[#5B6F00] focus:ring-1 focus:ring-[#5B6F00]/20 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#72726E] mb-1.5">
              WhatsApp / Teléfono
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. +57 310 456 7890"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#D5D5D2] text-sm text-[#292929] placeholder:text-[#72726E]/50 focus:outline-hidden focus:border-[#5B6F00] focus:ring-1 focus:ring-[#5B6F00]/20 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#72726E] mb-1.5">
              Correo Electrónico (Opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sofia@ejemplo.com"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#D5D5D2] text-sm text-[#292929] placeholder:text-[#72726E]/50 focus:outline-hidden focus:border-[#5B6F00] focus:ring-1 focus:ring-[#5B6F00]/20 transition-all font-sans"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-sm font-sans font-medium flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generando Tarjeta...</span>
                </>
              ) : (
                <>
                  <span>Crear Tarjeta y Ver en Vivo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-[11px] text-[#72726E] text-center font-sans">
          Sin registro de tarjeta de crédito. Guardado directo en Google Wallet.
        </p>
      </div>
    </div>
  );
}
