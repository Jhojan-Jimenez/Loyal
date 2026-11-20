'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  User,
} from 'lucide-react';

function OnboardContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loadingToken, setLoadingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<{ plan: string; monthlyFeeCop: number } | null>(null);

  // Form fields (NO slug — auto-generated transparently)
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Cafetería & Panadería');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setTokenError('No se proporcionó un enlace de registro válido.');
        setLoadingToken(false);
        return;
      }
      try {
        const res = await fetch(`/api/onboard/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (data.valid) {
          setTokenValid(true);
          setPlanInfo({ plan: data.plan, monthlyFeeCop: data.monthlyFeeCop });
        } else {
          setTokenError(data.error || 'Este enlace no es válido o ya expiró.');
        }
      } catch {
        setTokenError('Error de conexión al verificar tu enlace.');
      } finally {
        setLoadingToken(false);
      }
    }
    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 6) {
      setSubmitError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/onboard/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          businessName: businessName.trim(),
          category,
          ownerName: ownerName.trim(),
          ownerPhone: ownerPhone.trim(),
          ownerEmail: ownerEmail.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setSubmitError(data.error || 'No se pudo crear tu negocio. Intenta de nuevo.');
        setSubmitting(false);
      }
    } catch {
      setSubmitError('Error de red al crear tu cuenta.');
      setSubmitting(false);
    }
  };

  if (loadingToken) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-sans">
        <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
        <p className="text-xs text-[#78716C] mt-3 font-semibold">Verificando tu invitación...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] p-8 text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-normal text-[#1C1917]">Enlace no disponible</h1>
          <p className="text-xs text-[#78716C] mt-2 mb-6 leading-relaxed">{tokenError}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-colors"
          >
            <span>Volver a Loyal</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 py-10 font-sans text-[#1C1917]">
      <div className="w-full max-w-lg space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5">
            <img
              src="/logo-loyal.png"
              alt="Loyal"
              className="w-9 h-9 rounded-xl object-cover shadow-xs"
            />
            <span className="text-2xl font-serif font-normal text-[#1C1917]">Loyal</span>
          </div>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Plan {planInfo?.plan || 'Pro'} Activo</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
            Configura tu negocio en 1 minuto
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-md mx-auto">
            Crea tu programa de sellos digitales y tu contraseña de administrador para empezar hoy mismo.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-8 border border-[#EAE4D5] shadow-[0_12px_36px_rgba(40,30,10,0.06)] space-y-4"
        >
          {submitError && (
            <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] flex items-start gap-2.5 text-[#C2410C] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Business Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                Nombre de tu Negocio *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej. Café Varietale"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
              >
                <option value="Cafetería & Panadería">Cafetería &amp; Panadería</option>
                <option value="Barbería & Estética">Barbería &amp; Estética</option>
                <option value="Fitness & Yoga">Fitness &amp; Yoga</option>
                <option value="Restaurante & Bar">Restaurante &amp; Bar</option>
                <option value="Salud & Bienestar">Salud &amp; Bienestar</option>
                <option value="Comercio Local">Otro Comercio</option>
              </select>
            </div>
          </div>

          {/* Owner Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                Tu Nombre Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ej. Elena Gómez"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                WhatsApp del Negocio *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Ej. +57 300 123 4567"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="pt-3 border-t border-[#EAE4D5] space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                Correo de Acceso (Admin) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="tu@negocio.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1C1917] uppercase tracking-wider mb-1.5 font-mono">
                Crea tu Contraseña de Admin *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 mt-2 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando tu panel...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#B2C248]" />
                <span>Crear mi Negocio y Entrar</span>
                <ArrowRight className="w-4 h-4 text-[#B2C248]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
        </div>
      }
    >
      <OnboardContent />
    </Suspense>
  );
}
