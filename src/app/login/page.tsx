'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Store,
  QrCode,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'superadmin';
  const redirectUrl = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState<'superadmin' | 'admin' | 'cashier'>(
    initialRole === 'admin' ? 'admin' : initialRole === 'cashier' ? 'cashier' : 'superadmin'
  );

  // Form states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [slug, setSlug] = useState('');
  const [cashierName, setCashierName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let body: any = { role: activeTab };

      if (activeTab === 'superadmin') {
        body.password = password;
      } else if (activeTab === 'admin') {
        body.pin = pin;
        body.slug = slug.trim() || undefined;
      } else if (activeTab === 'cashier') {
        body.pin = pin;
        body.slug = slug.trim() || undefined;
        body.cashierName = cashierName.trim() || undefined;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      setSuccess(true);

      // Redirect destination
      const target =
        redirectUrl ||
        (activeTab === 'superadmin' ? '/superadmin' : activeTab === 'admin' ? '/admin' : '/scanner');

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Error al autenticar');
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

        <div className="w-14 h-14 rounded-2xl bg-[#1C1917] text-[#B2C248] flex items-center justify-center mx-auto mb-4 border border-[#292524] shadow-md">
          <ShieldCheck className="w-7 h-7 text-[#B2C248]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
          Acceso Seguro Loyal
        </h1>
        <p className="text-xs text-[#78716C] mt-2 font-medium">
          Selecciona tu rol para ingresar al panel de control
        </p>
      </div>

      {/* Role Tabs */}
      <div className="bg-[#FFFDF9] rounded-2xl p-1.5 border border-[#EAE4D5] flex items-center gap-1 mb-6 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('superadmin');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'superadmin'
              ? 'bg-[#1C1917] text-[#B2C248] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>SuperAdmin</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('admin');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-[#5B6F00] text-white shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Comercio</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('cashier');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'cashier'
              ? 'bg-[#5B6F00] text-white shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Cajero</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-7 shadow-[0_12px_32px_rgba(40,30,10,0.05)]">
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C0] text-[#C2410C] text-xs flex items-center gap-2 mb-5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-[#F4F9E8] border border-[#D9EBB3] text-[#5B6F00] text-xs flex items-center gap-2 mb-5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-bold">¡Autenticado con éxito! Redirigiendo...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SUPERADMIN FORM */}
          {activeTab === 'superadmin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Contraseña Maestra SuperAdmin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe la clave maestra..."
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#1C1917] transition-all pr-11 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A89F91] mt-1.5">
                  Acceso exclusivo para el administrador de la infraestructura Loyal.
                </p>
              </div>
            </div>
          )}

          {/* ADMIN FORM */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Identificador del Comercio (Slug opcional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej: cafe-la-cabana (vacío para tienda activa)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-xs text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  PIN de Administrador
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN de 4 dígitos (default: 1234)"
                  required
                  autoFocus
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all font-mono text-center tracking-widest text-lg font-bold"
                />
                <p className="text-[11px] text-[#A89F91] mt-1.5 text-center">
                  Permite modificar reglas de sellos, catálogo y métricas de clientes.
                </p>
              </div>
            </div>
          )}

          {/* CASHIER FORM */}
          {activeTab === 'cashier' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Nombre del Cajero / Encargado
                </label>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  placeholder="ej: Carlos (Caja 1)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-xs text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  PIN de Caja de Mostrador
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN de caja (default: 0000)"
                  required
                  autoFocus
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-sm text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-all font-mono text-center tracking-widest text-lg font-bold"
                />
                <p className="text-[11px] text-[#A89F91] mt-1.5 text-center">
                  PIN rápido de punto de venta para estampar sellos en caja.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-6 ${
              activeTab === 'superadmin'
                ? 'bg-[#1C1917] text-[#B2C248] hover:bg-black'
                : 'bg-[#5B6F00] text-white hover:bg-[#4D5E00]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credencial...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Ingreso exitoso!</span>
              </>
            ) : (
              <>
                <span>Ingresar a la Plataforma</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
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
        <LoginForm />
      </Suspense>
    </div>
  );
}
