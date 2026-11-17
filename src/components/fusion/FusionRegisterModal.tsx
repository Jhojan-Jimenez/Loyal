'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { useLoyal } from '@/context/LoyalContext';

interface FusionRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FusionRegisterModal({ isOpen, onClose }: FusionRegisterModalProps) {
  const router = useRouter();
  const { registerStudent } = useLoyal();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Cafetería / Bakery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const newStudent = registerStudent(name, phone, email);
      onClose();
      router.push(`/style/fusion/card/${newStudent.token}`);
    } catch (err) {
      console.error('Error registrando demo:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
      {/* Dim Backdrop with warm blur */}
      <div
        className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-[32px] p-7 sm:p-9 shadow-2xl border border-[#EAE4D5] z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 24px 48px -10px rgba(40,30,10,0.22)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-[#1C1917] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-left mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5DC] text-[#5B6F00] text-xs font-bold mb-3 border border-[#D9E2B3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generador de Pase Demo</span>
          </div>
          <h3 className="text-[26px] leading-[32px] font-serif font-normal text-[#1C1917] tracking-tight">
            Crea tu primera tarjeta de sellos
          </h3>
          <p className="text-[14px] leading-[22px] text-[#57534E] mt-1.5">
            Configura un pase digital personalizado en 30 segundos con estética editorial. Podrás guardarlo en Google Wallet y probarlo en el escáner de caja.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
              Nombre de tu Negocio o Cliente
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Café & Panadería Magnolia"
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
              WhatsApp Móvil
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
              Tipo de Negocio
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] focus:outline-hidden focus:border-[#5B6F00] focus:bg-white transition-all"
            >
              <option value="Cafetería / Bakery">Cafetería & Panadería Artesanal</option>
              <option value="Estudio de Yoga / Fitness">Estudio de Yoga, Pilates o Fitness</option>
              <option value="Barbería / Salón de Belleza">Barbería & Salón de Belleza</option>
              <option value="Restaurante / Bar">Restaurante / Gastrobar</option>
              <option value="Comercio Minorista / Tienda">Comercio Minorista / Boutique</option>
            </select>
          </div>

          {/* Submit Action (Granola Olive Capsule) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full text-white text-[15px] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:shadow-[0_6px_20px_rgba(91,111,0,0.35)] hover:bg-[#4D5E00] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
              }}
            >
              <Smartphone className="w-4 h-4 text-[#B2C248]" />
              <span>{isSubmitting ? 'Generando pase...' : 'Abrir Mi Tarjeta Demo'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-[#78716C] pt-1">
            ✨ Sin tarjeta de crédito ni registro obligatorio. Se abre de inmediato en tu navegador.
          </p>
        </form>
      </div>
    </div>
  );
}
