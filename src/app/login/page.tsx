'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

function UniversalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Si ya tiene sesión activa, redirigir automáticamente
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          const s = data.session;
          let target = requestedRedirect;
          if (!target) {
            if (s.isPlatformSuperAdmin) {
              target = '/superadmin';
            } else if (s.activeTenant?.slug) {
              target = `/${s.activeTenant.slug}/admin`;
            } else {
              target = '/';
            }
          }
          window.location.href = target;
        }
      })
      .catch(() => {});
  }, [requestedRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      setSuccess(true);

      const target = requestedRedirect || data.redirectUrl || '/';
      setTimeout(() => {
        window.location.href = target;
      }, 250);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </Link>

        {/* Artisanal Olive Seal Stamp */}
        <div className="w-14 h-14 rounded-2xl bg-[#5B6F00] text-white flex items-center justify-center mx-auto mb-4 shadow-[0_4px_16px_rgba(91,111,0,0.25)]">
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="4" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-xs text-[#78716C] mt-2 font-medium">
          Accede al panel de tu comercio o consola de administración
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-7 sm:p-8 shadow-[0_12px_32px_rgba(40,30,10,0.05)]">
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] text-[#C2410C] text-xs flex items-center gap-2.5 mb-5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-[#F4F9E8] border border-[#D9EBB3] text-[#5B6F00] text-xs flex items-center gap-2.5 mb-5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-bold">¡Bienvenido! Entrando a tu espacio...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@negocio.com o admin"
                required
                autoFocus
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all font-sans"
              />
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1C1917]">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all font-sans"
              />
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-6 bg-[#5B6F00] text-white hover:bg-[#4D5E00]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando cuenta...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Ingreso exitoso!</span>
              </>
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <Sparkles className="w-3.5 h-3.5 text-[#B2C248]" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[11px] text-[#A89F91] mt-6">
        ¿Eres un nuevo comercio? Solicita tu invitación al administrador de la plataforma.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col justify-center px-4 py-12 font-sans selection:bg-[#5B6F00] selection:text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
            <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando acceso seguro...</p>
          </div>
        }
      >
        <UniversalLoginForm />
      </Suspense>
    </div>
  );
}
