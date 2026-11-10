'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoyal } from '@/context/LoyalContext';
import { MandalaBackground, LotusIcon } from '@/components/MandalaBackground';
import {
  Sparkles,
  QrCode,
  Smartphone,
  ShieldCheck,
  Calendar,
  Gift,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { registerStudent, students, config } = useLoyal();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const newStudent = registerStudent(name, phone, email);
    router.push(`/card/${newStudent.token}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8FF] via-[#FAF5FF] to-[#F3E8FF] text-purple-950 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4">
        {/* Soft Background Mandalas */}
        <MandalaBackground className="left-[-80px] top-[-50px] w-96 h-96 text-purple-300" opacity="opacity-20" />
        <MandalaBackground className="right-[-100px] top-[40px] w-[500px] h-[500px] text-fuchsia-300" opacity="opacity-15" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-xs mb-6 backdrop-blur-xs">
            <LotusIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-900 tracking-wide">
              {config.studioName} · Programa Oficial de Lealtad
            </span>
          </div>

          {/* Main Title inspired by style reference */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-purple-950 max-w-3xl mx-auto leading-[1.15]">
            Comienza tu viaje con <br />
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              YOGA & BIENESTAR
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-purple-800/80 max-w-xl mx-auto leading-relaxed">
            Tu tarjeta de clases digital siempre en tu celular. Asiste a tus sesiones de yoga, acumula
            sellos y desbloquea talleres sonoros y mats eco-friendly.
          </p>

          {/* Registration Box & Quick Demo Dual Card */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto text-left">
            {/* Quick Registration Form (7 cols) */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-purple-200/80 shadow-xl shadow-purple-900/10">
              <div className="flex items-center gap-3 border-b border-purple-100 pb-4 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-purple-950">Obtén tu Pase Digital</h2>
                  <p className="text-xs text-purple-600">Registro en 15 segundos sin descargar apps</p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariana Cadavid"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-950 placeholder:text-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1.5">
                    WhatsApp / Teléfono Móvil *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +57 312 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-950 placeholder:text-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1.5">
                    Correo Electrónico <span className="text-purple-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="mariana.yoga@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-950 placeholder:text-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <LotusIcon className="w-4 h-4 text-white" />
                  <span>Crear Mi Tarjeta de Clases</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-purple-500/80">
                  🔒 Funciona en iPhone y Android sin instalar nada de la App Store.
                </p>
              </form>
            </div>

            {/* Demo Quick Pickers & Features (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Existing Demo Cards */}
              <div className="bg-white/80 rounded-3xl p-5 border border-purple-200/70 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    Tarjetas Demo Pre-cargadas
                  </h3>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xs text-purple-700/80 mb-3">
                  Prueba la experiencia de un alumno activo con un solo clic:
                </p>

                <div className="space-y-2">
                  {students.slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      href={`/card/${s.token}`}
                      className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 flex items-center justify-between transition-all group"
                    >
                      <div>
                        <p className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-purple-500">{s.phone}</p>
                      </div>
                      <span className="text-xs font-bold text-white bg-purple-600 px-2.5 py-0.5 rounded-full">
                        {s.stamps}/10 🪷
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Link to Reception Scanner */}
              <div className="bg-gradient-to-br from-purple-900 to-fuchsia-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <MandalaBackground className="right-[-20px] top-[-20px] w-48 h-48 text-purple-400" opacity="opacity-20" />
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold">¿Eres el personal de caja?</h3>
                  <p className="text-xs text-purple-200/80 mt-1 mb-4">
                    Abre el escáner de recepción para sumar asistencias en 2 segundos con tu cámara.
                  </p>
                  <Link
                    href="/scanner"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-purple-950 text-xs font-bold hover:bg-purple-50 shadow-md active:scale-95 transition-all"
                  >
                    <span>Abrir Escáner Recepción</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Value Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-purple-200/50">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Por qué elegir esta solución
          </span>
          <h2 className="text-2xl font-bold text-purple-950 mt-1">Diseñado para Estudios de Yoga Modernos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-purple-950">Cero Fricción para el Alumno</h3>
            <p className="text-xs text-purple-700/80 mt-2 leading-relaxed">
              No requiere descargar nada de la App Store ni crear contraseñas. Se guarda como un icono
              en Safari o Chrome y abre al instante.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-purple-950">Datos 100% Tuyos en Excel</h3>
            <p className="text-xs text-purple-700/80 mt-2 leading-relaxed">
              A diferencia de Loopy Loyalty que bloquea tus datos si no pagas $95 USD/mes, aquí descargas
              tu base de alumnos en CSV cuando quieras con un solo clic.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-purple-950">Retención y Comunidad</h3>
            <p className="text-xs text-purple-700/80 mt-2 leading-relaxed">
              Recompensa la constancia de tus yoguis con talleres especiales, mats y pases de amigos,
              elevando la asistencia semanal más de un 40%.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-200/60 bg-white/60 py-6 text-center text-xs text-purple-700">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{config.studioName} © 2026 · Sistema PWA de Fidelización y Clases</span>
          <div className="flex gap-4">
            <Link href="/schedule" className="hover:text-purple-950 font-medium">
              Horario de Clases
            </Link>
            <Link href="/admin" className="hover:text-purple-950 font-medium">
              Panel Administrativo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
