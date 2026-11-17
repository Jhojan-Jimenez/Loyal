'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface InvitationData {
  email: string;
  tenantName: string;
  tenantSlug: string;
  role: string;
  ownerName: string;
}

function ActivationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteData, setInviteData] = useState<InvitationData | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteError('No se proporcionó ningún token de invitación.');
      setLoadingInvite(false);
      return;
    }

    fetch(`/api/invite/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setInviteError(data.error || 'La invitación es inválida o ha expirado.');
        } else {
          setInviteData(data.invitation);
          if (data.invitation.ownerName) {
            setFullName(data.invitation.ownerName);
          }
        }
      })
      .catch(() => {
        setInviteError('Error al contactar el servidor. Intenta de nuevo.');
      })
      .finally(() => {
        setLoadingInvite(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (password.length < 6) {
      setSubmitError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/invite/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          fullName: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo activar la cuenta');
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = data.redirectUrl || '/';
      }, 500);
    } catch (err: any) {
      setSubmitError(err.message || 'Error en la activación');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInvite) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#78716C] font-semibold">Validando invitación comercial...</p>
      </div>
    );
  }

  if (inviteError || !inviteData) {
    return (
      <div className="w-full max-w-md mx-auto text-center bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-8 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#C2410C] flex items-center justify-center mx-auto mb-4 border border-[#F5C7C0]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-normal text-[#1C1917]">Invitación no disponible</h2>
        <p className="text-xs text-[#78716C] mt-2 mb-6">
          {inviteError || 'El enlace de activación no es válido.'}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B6F00] text-white text-xs font-bold hover:bg-[#4D5E00] transition-all"
        >
          <span>Ir a Iniciar Sesión</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] mb-4">
          <Store className="w-3.5 h-3.5" />
          <span>{inviteData.tenantName}</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
          Activa tu Cuenta de Administrador
        </h1>
        <p className="text-xs text-[#78716C] mt-2 font-medium">
          Define tu contraseña para gestionar el programa de fidelización de tu negocio
        </p>
      </div>

      {/* Activation Card */}
      <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-7 sm:p-8 shadow-[0_12px_32px_rgba(40,30,10,0.05)]">
        {submitError && (
          <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] text-[#C2410C] text-xs flex items-center gap-2.5 mb-5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-[#F4F9E8] border border-[#D9EBB3] text-[#5B6F00] text-xs flex items-center gap-2.5 mb-5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-bold">¡Cuenta activada con éxito! Entrando a tu panel...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Correo Electrónico (Registrado)
            </label>
            <input
              type="text"
              value={inviteData.email}
              disabled
              className="w-full px-4 py-3 rounded-2xl bg-[#F5F1E8] border border-[#EAE4D5] text-xs text-[#78716C] cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Tu Nombre Completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre del propietario o gerente"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all"
              />
              <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Crear Contraseña (mínimo 6 caracteres)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea tu clave segura..."
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all"
              />
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu clave..."
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all"
              />
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full py-3.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-6 bg-[#5B6F00] text-white hover:bg-[#4D5E00]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activando cuenta...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Cuenta Activada!</span>
              </>
            ) : (
              <>
                <span>Activar Cuenta & Entrar al Panel</span>
                <Sparkles className="w-3.5 h-3.5 text-[#B2C248]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ActivateInvitePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col justify-center px-4 py-12 font-sans selection:bg-[#5B6F00] selection:text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
            <p className="text-xs text-[#78716C] mt-3 font-semibold">Cargando activación de comercio...</p>
          </div>
        }
      >
        <ActivationForm />
      </Suspense>
    </div>
  );
}
