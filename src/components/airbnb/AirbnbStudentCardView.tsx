'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useLoyal } from '@/context/LoyalContext';
import { generateQrTotp, getTotpSecondsRemaining } from '@/lib/totp';
import {
  Gift,
  Share,
  Info,
  MapPin,
  Wifi,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Check,
  ArrowLeft,
  UserX,
  Copy,
  Clock,
  Phone,
  Wallet,
  Smartphone,
} from 'lucide-react';

interface AirbnbStudentCardViewProps {
  token: string;
}

export function AirbnbStudentCardView({ token }: AirbnbStudentCardViewProps) {
  const { getStudentByToken, config, isLoaded, refreshFromServer } = useLoyal();

  const [activeTab, setActiveTab] = useState<'card' | 'details' | 'install'>('card');
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Dynamic TOTP for anti-screenshot protection
  const [totp, setTotp] = useState(() => generateQrTotp(token));
  const [secondsLeft, setSecondsLeft] = useState(() => getTotpSecondsRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTotpSecondsRemaining();
      setSecondsLeft(remaining);
      setTotp(generateQrTotp(token));
    }, 1000);
    return () => clearInterval(timer);
  }, [token]);

  const student = getStudentByToken(token);

  useEffect(() => {
    if (!student) {
      refreshFromServer();
    }
  }, [student, refreshFromServer]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#E61E4D] animate-spin" />
        <p className="text-xs text-[#717171] mt-3 font-semibold">Cargando pase Airbnb...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-[28px] p-8 max-w-md w-full text-center border border-[#EBEBEB] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F8] text-[#E61E4D] flex items-center justify-center mx-auto mb-4 border border-[#FDE8EB]">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Tarjeta no encontrada</h2>
          <p className="text-xs text-[#717171] mt-2 mb-6">
            El código <code className="bg-[#F7F7F7] px-2 py-0.5 rounded text-[#222222] font-mono">{token}</code> no corresponde a ningún miembro registrado.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/style/airbnb"
              className="py-3 rounded-full bg-[#E61E4D] text-white text-xs font-bold hover:bg-[#D70466] transition-all"
            >
              Crear una Nueva Tarjeta
            </Link>
            <Link
              href="/style/airbnb/card/camila-restrepo-yoga"
              className="py-3 rounded-full bg-white text-[#222222] text-xs font-bold hover:bg-[#F7F7F7] transition-all border border-[#EBEBEB]"
            >
              Ver Pase Demo de Camila
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRequired = config.totalStampsRequired || 10;
  const currentStamps = student.stamps;
  const isComplete = currentStamps >= totalRequired;
  const remaining = Math.max(0, totalRequired - currentStamps);
  const progressPercent = Math.min(100, Math.round((currentStamps / totalRequired) * 100));
  const slots = Array.from({ length: totalRequired }, (_, i) => i + 1);

  const handleSaveToGoogleWallet = async () => {
    try {
      setIsGeneratingWallet(true);
      setWalletError(null);

      const res = await fetch('/api/wallet/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentToken: student.token,
          studentName: student.name,
          currentStamps: student.stamps,
          totalCycles: student.totalCompletedCycles,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.saveUrl) {
        throw new Error(data.error || 'No se pudo generar el pase de Google Wallet');
      }

      window.open(data.saveUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Error al guardar en Google Wallet:', err);
      setWalletError(err.message || 'Error al conectar con Google Wallet');
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyWifi = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(config.wifiPassword);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-sans text-[#222222]">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href="/style/airbnb"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#E61E4D]" />
          <span>Volver al inicio</span>
        </Link>

        <span className="text-[11px] font-semibold text-[#E61E4D] flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF8F8] border border-[#FDE8EB] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E61E4D]" />
          <span>Pase Oficial Activo</span>
        </span>
      </div>

      {/* ── Airbnb Pill Tab Navigation ── */}
      <div className="flex bg-white p-1 rounded-full border border-[#EBEBEB] shadow-2xs">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'card'
              ? 'bg-[#E61E4D] text-white shadow-2xs'
              : 'text-[#717171] hover:text-[#222222]'
          }`}
        >
          Pase Digital
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'details'
              ? 'bg-[#E61E4D] text-white shadow-2xs'
              : 'text-[#717171] hover:text-[#222222]'
          }`}
        >
          <Info className="w-3 h-3" />
          <span>Local & Wi-Fi</span>
        </button>
        <button
          onClick={() => setActiveTab('install')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'install'
              ? 'bg-[#E61E4D] text-white shadow-2xs'
              : 'text-[#717171] hover:text-[#222222]'
          }`}
        >
          <Wallet className="w-3 h-3" />
          <span>Guardar</span>
        </button>
      </div>

      {/* ── Tab 1: Pase Digital ── */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          {/* Main Airbnb Friendly Punch Card */}
          <div
            className="relative overflow-hidden rounded-[28px] bg-white p-6 sm:p-7 border border-[#EBEBEB] transition-all"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 16px 36px -4px rgba(34,34,34,0.08), 0 4px 12px rgba(34,34,34,0.03)',
            }}
          >
            {/* Top header */}
            <div className="flex items-start justify-between border-b border-[#F2F2F2] pb-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#717171]">
                  Pase de Fidelización
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight mt-0.5">
                  {config.studioName}
                </h2>
                <p className="text-[11px] text-[#717171]">
                  {config.tagline || 'Club de Recompensas para Clientes'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8F8] border border-[#FDE8EB] flex items-center justify-center text-[#E61E4D] shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#E61E4D]" />
              </div>
            </div>

            {/* Member Details */}
            <div className="py-3 flex items-center justify-between border-b border-[#F2F2F2]">
              <div>
                <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider block">
                  Miembro / Titular
                </span>
                <p className="text-base font-bold text-[#222222]">{student.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider block">
                  Premios Ganados
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E61E4D] bg-[#FFF8F8] border border-[#FDE8EB] px-2.5 py-0.5 rounded-full">
                  <Gift className="w-3 h-3 text-[#E61E4D]" />
                  {student.totalCompletedCycles} {student.totalCompletedCycles === 1 ? 'premio' : 'premios'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="py-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[#222222]">
                  {currentStamps} de {totalRequired} Sellos Acumulados
                </span>
                <span className="font-bold text-[#E61E4D]">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-[#F7F7F7] border border-[#EBEBEB] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-[#E61E4D]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#717171] mt-1.5">
                {isComplete
                  ? '🎉 ¡Completaste tus sellos! Muéstrala en mostrador para redimir tu premio.'
                  : `Te faltan solo ${remaining} ${remaining === 1 ? 'visita' : 'visitas'} para tu recompensa.`}
              </p>
            </div>

            {/* 10-Stamp Grid */}
            <div className="grid grid-cols-5 gap-2 my-2">
              {slots.map((num) => {
                const isFilled = num <= currentStamps;
                const isNext = num === currentStamps + 1;

                return (
                  <div
                    key={num}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
                      isFilled
                        ? 'bg-[#E61E4D] text-white shadow-2xs'
                        : isNext
                        ? 'bg-white border-2 border-dashed border-[#E61E4D] text-[#222222]'
                        : 'bg-[#F7F7F7] border border-dashed border-[#DDDDDD] text-[#717171]'
                    }`}
                  >
                    {isFilled ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3] text-white" />
                        <span className="text-[8px] font-bold text-white/90">#{num}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-xs">{num}</span>
                        <span className="text-[7px] text-[#717171] uppercase tracking-tighter">
                          {isNext ? 'Próx' : 'Sello'}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reward Box */}
            <div className="mt-3 p-3 rounded-2xl bg-[#FFF8F8] border border-[#FDE8EB] flex items-center gap-2.5 text-xs text-[#222222]">
              <Gift className="w-4 h-4 text-[#E61E4D] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider block">
                  Recompensa al completar 10 sellos
                </span>
                <span className="truncate text-xs font-bold text-[#222222] block">
                  {config.currentRewardTitle}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-white rounded-[28px] p-6 border border-[#EBEBEB] shadow-sm text-center">
            <h3 className="text-base font-bold text-[#222222]">
              Presenta este código en caja
            </h3>
            <p className="text-xs text-[#717171] mt-0.5">
              El personal de mostrador lo escaneará en 0.8s para registrar tu visita
            </p>

            <div className="my-4 inline-block p-4 rounded-3xl bg-[#F7F7F7] border border-[#EBEBEB]">
              <QRCodeSVG
                value={`https://loyal.jhojan.cloud/style/airbnb/card/${student.token}?totp=${totp}`}
                size={165}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E61E4D] bg-[#FFF8F8] px-3.5 py-1 rounded-full border border-[#FDE8EB] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#E61E4D] animate-pulse" />
                <span>QR Seguro · Se actualiza en <b className="font-mono font-bold text-[#E61E4D]">{secondsLeft}s</b></span>
              </div>
              <span className="text-[10px] text-[#717171] font-mono">
                Token: {totp}
              </span>
            </div>

            {/* Google Wallet Native Button */}
            <div className="mt-5 pt-4 border-t border-[#EBEBEB]">
              <button
                type="button"
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full h-12 rounded-full bg-[#222222] hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                {isGeneratingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Firmando pase de Google Wallet...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Guardar en Google Wallet (Android)</span>
                  </>
                )}
              </button>

              {walletError && (
                <p className="text-[11px] text-rose-600 mt-2 font-medium">{walletError}</p>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-4 pt-3 flex items-center justify-around text-xs text-[#717171]">
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20pase%20digital`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-semibold hover:text-[#222222] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#E61E4D]" />
                <span>WhatsApp Local</span>
              </a>
              <span className="text-[#EBEBEB]">|</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 font-semibold hover:text-[#222222] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#E61E4D]" /> : <Share className="w-4 h-4" />}
                <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir Pase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Host Details & Wi-Fi ── */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-[28px] p-6 border border-[#EBEBEB] shadow-sm space-y-5">
          <div className="border-b border-[#F2F2F2] pb-3">
            <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider">
              Información de Hospitalidad
            </span>
            <h3 className="text-lg font-bold text-[#222222] mt-0.5">
              {config.studioName}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#E61E4D] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#222222]">Ubicación</p>
                <p className="text-[#717171] mt-0.5">{config.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#E61E4D] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#222222]">Horarios de Atención</p>
                <p className="text-[#717171] mt-0.5">Lunes a Sábado: 8:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#E61E4D] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#222222]">Línea de Atención</p>
                <p className="text-[#717171] mt-0.5">{config.whatsappNumber}</p>
              </div>
            </div>

            {/* Wi-Fi Details */}
            <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#FDE8EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#222222] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#E61E4D]" />
                  <span>Wi-Fi de Alta Velocidad para Clientes</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-[#E61E4D] bg-white px-2 py-0.5 rounded-full border border-[#FDE8EB]">
                  Libre
                </span>
              </div>
              <div className="text-[11px] text-[#717171]">
                <p>
                  <strong>Red:</strong> {config.wifiSsid}
                </p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#FDE8EB]">
                  <p>
                    <strong>Clave:</strong> <code className="font-mono text-[#222222]">{config.wifiPassword}</code>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyWifi}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E61E4D] hover:underline cursor-pointer"
                  >
                    {copiedWifi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWifi ? 'Copiada' : 'Copiar clave'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Instructions ── */}
      {activeTab === 'install' && (
        <div className="bg-white rounded-[28px] p-6 border border-[#EBEBEB] shadow-sm space-y-5">
          <div className="border-b border-[#F2F2F2] pb-3">
            <span className="text-[10px] text-[#717171] uppercase font-bold tracking-wider">
              Acceso Directo
            </span>
            <h3 className="text-lg font-bold text-[#222222] mt-0.5">
              Cómo guardar tu pase en tu celular
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Android Google Wallet */}
            <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB]">
              <div className="flex items-center gap-2 font-bold text-[#222222] mb-1">
                <Wallet className="w-4 h-4 text-[#E61E4D]" />
                <span>En teléfonos Android (Google Wallet)</span>
              </div>
              <p className="text-[11px] text-[#717171] mb-3">
                Guarda tu tarjeta en la app oficial de Google Wallet para llevarla siempre contigo sin conexión.
              </p>
              <button
                type="button"
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full py-2.5 px-4 rounded-full bg-[#E61E4D] hover:bg-[#D70466] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Agregar a Google Wallet</span>
              </button>
            </div>

            {/* iPhone Safari Bookmark */}
            <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB]">
              <div className="flex items-center gap-2 font-bold text-[#222222] mb-1">
                <Smartphone className="w-4 h-4 text-[#E61E4D]" />
                <span>En teléfonos iPhone (Apple iOS)</span>
              </div>
              <ol className="text-[11px] text-[#717171] space-y-1.5 list-decimal list-inside mt-2">
                <li>Abre esta página en <strong>Safari</strong>.</li>
                <li>Toca el botón <strong>Compartir</strong> (ícono cuadrado con flecha hacia arriba).</li>
                <li>Selecciona <strong>&quot;Agregar al inicio&quot;</strong>.</li>
                <li>Quedará guardada como una aplicación lista en tu pantalla principal.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
