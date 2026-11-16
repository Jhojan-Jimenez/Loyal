'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { useLoyal } from '@/context/LoyalContext';

interface AirbnbRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AirbnbRegisterModal({ isOpen, onClose }: AirbnbRegisterModalProps) {
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
      router.push(`/card/${newStudent.token}`);
    } catch (err) {
      console.error('Error registrando demo:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Dim Backdrop with light blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-white rounded-[32px] p-7 sm:p-9 shadow-2xl border border-[#ebebeb] z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 20px 40px -8px rgba(0,0,0,0.18)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#f7f7f7] hover:bg-[#ebebeb] text-[#222222] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-left mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0f3] text-[#e61e4d] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generador de Pase Demo</span>
          </div>
          <h3 className="text-[26px] leading-[32px] font-semibold text-[#222222] tracking-[-0.03em]">
            Crea tu primera tarjeta de sellos
          </h3>
          <p className="text-[15px] leading-[22px] text-[#6a6a6a] mt-1.5">
            Configura un pase digital personalizado en 30 segundos. Podrás guardarlo en Google Wallet y probarlo en el escáner de caja.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1.5">
              Nombre de tu Negocio o Cliente
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Café & Panadería Magnolia"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#f7f7f7] border border-[#dddddd] text-sm text-[#222222] placeholder:text-[#9a9a9a] focus:outline-hidden focus:border-[#222222] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1.5">
              WhatsApp Móvil
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 320 328 2014"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#f7f7f7] border border-[#dddddd] text-sm text-[#222222] placeholder:text-[#9a9a9a] focus:outline-hidden focus:border-[#222222] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1.5">
              Tipo de Comercio
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#f7f7f7] border border-[#dddddd] text-sm text-[#222222] focus:outline-hidden focus:border-[#222222] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Cafetería / Bakery">Cafetería / Panadería de Especialidad</option>
              <option value="Barbería / Salón">Barbería / Salón de Belleza / Spa</option>
              <option value="Restaurante">Restaurante / Gastrobar</option>
              <option value="Yoga / Fitness">Estudio de Yoga / Gimnasio</option>
              <option value="Boutique / Tienda">Boutique de Ropa / Retail</option>
              <option value="Otro">Otro Comercio Local</option>
            </select>
          </div>

          {/* Value Props Inside Modal */}
          <div className="pt-2 flex flex-col gap-1.5 text-xs text-[#6a6a6a]">
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#e61e4d]" />
              Pase generado compatible con Google Wallet y Safari iOS
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#e61e4d]" />
              Sincronizado en tiempo real con el escáner web de mostrador
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full text-white text-[16px] font-medium transition-all active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              style={{
                background: 'linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
              }}
            >
              <span>{isSubmitting ? 'Generando tu Pase...' : 'Generar Pase Digital Gratis'}</span>
              <Smartphone className="w-4 h-4 text-white/90" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
