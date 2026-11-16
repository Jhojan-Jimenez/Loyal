'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useLoyal } from '@/context/LoyalContext';
import {
  Sparkles,
  Gift,
  Share,
  Info,
  MapPin,
  Wifi,
  ExternalLink,
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

interface GranolaStudentCardViewProps {
  token: string;
}

export function GranolaStudentCardView({ token }: GranolaStudentCardViewProps) {
  const { getStudentByToken, config, isLoaded, refreshFromServer } = useLoyal();

  const [activeTab, setActiveTab] = useState<'card' | 'details' | 'install'>('card');
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const student = getStudentByToken(token);

  useEffect(() => {
    if (!student) {
      refreshFromServer();
    }
  }, [student, refreshFromServer]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#5B6F00] animate-spin" />
        <p className="text-xs text-[#72726E] mt-3 font-medium">Cargando pase digital Granola...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#D5D5D2] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F7F2] text-[#72726E] flex items-center justify-center mx-auto mb-4 border border-[#D5D5D2]">
            <UserX className="w-6 h-6 text-[#72726E]" />
          </div>
          <h2 className="font-serif text-xl font-normal text-[#292929]">Tarjeta no encontrada</h2>
          <p className="text-xs text-[#72726E] mt-2 mb-6">
            El código <code className="bg-[#F7F7F2] px-2 py-0.5 rounded text-[#292929] font-mono">{token}</code> no corresponde a ningún cliente registrado.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/style/granola"
              className="py-3 rounded-full bg-[#5B6F00] text-[#FCFCF8] text-xs font-medium hover:bg-[#4D5E00] transition-all"
            >
              Crear una Nueva Tarjeta
            </Link>
            <Link
              href="/style/granola/card/camila-restrepo-yoga"
              className="py-3 rounded-full bg-white text-[#292929] text-xs font-medium hover:bg-[#F7F7F2] transition-all border border-[#D5D5D2]"
            >
              Ver Tarjeta Demo de Camila
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
    <div className="w-full max-w-md mx-auto space-y-4 font-sans text-[#292929]">
      {/* ── Top Breadcrumb Header ── */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href="/style/granola"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#72726E] hover:text-[#292929] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#5B6F00]" />
          <span>Volver al inicio</span>
        </Link>

        <span className="text-[11px] font-medium text-[#5B6F00] flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5EACD] border border-[#5B6F00]/30 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B6F00]" />
          <span>Pase Oficial Verificado</span>
        </span>
      </div>

      {/* ── Granola Tab Selector ── */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#D5D5D2] shadow-2xs">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'card'
              ? 'bg-[#5B6F00] text-[#FCFCF8] shadow-2xs'
              : 'text-[#72726E] hover:text-[#292929]'
          }`}
        >
          Pase Digital
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'details'
              ? 'bg-[#5B6F00] text-[#FCFCF8] shadow-2xs'
              : 'text-[#72726E] hover:text-[#292929]'
          }`}
        >
          <Info className="w-3 h-3" />
          <span>Local & Wi-Fi</span>
        </button>
        <button
          onClick={() => setActiveTab('install')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'install'
              ? 'bg-[#5B6F00] text-[#FCFCF8] shadow-2xs'
              : 'text-[#72726E] hover:text-[#292929]'
          }`}
        >
          <Wallet className="w-3 h-3" />
          <span>Guardar</span>
        </button>
      </div>

      {/* ── Tab 1: Pase Digital ── */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          {/* Main Granola Tactile Punch Card */}
          <div
            className="relative overflow-hidden rounded-3xl bg-[#F7F7F2] p-6 sm:p-7 border border-[#D5D5D2] transition-all"
            style={{
              boxShadow: '0 20px 30px -10px rgba(41,41,41,0.08), 0 8px 16px -6px rgba(41,41,41,0.05)',
            }}
          >
            {/* Header inside ticket */}
            <div className="flex items-start justify-between border-b border-[#D5D5D2]/80 pb-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#72726E]">
                  Pase Digital
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#292929] tracking-tight mt-0.5">
                  {config.studioName}
                </h2>
                <p className="text-[11px] text-[#72726E]">
                  {config.tagline || 'Club de Fidelización & Sellos'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00] shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#5B6F00]" />
              </div>
            </div>

            {/* Member Info */}
            <div className="py-3 flex items-center justify-between border-b border-[#D5D5D2]/60">
              <div>
                <span className="text-[10px] text-[#72726E] uppercase font-bold tracking-wider block">
                  Titular del Pase
                </span>
                <p className="font-serif text-base font-normal text-[#292929]">{student.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#72726E] uppercase font-bold tracking-wider block">
                  Ciclos Ganados
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5B6F00] bg-[#E5EACD] border border-[#5B6F00]/30 px-2 py-0.5 rounded-full">
                  <Gift className="w-3 h-3 text-[#5B6F00]" />
                  {student.totalCompletedCycles} {student.totalCompletedCycles === 1 ? 'premio' : 'premios'}
                </span>
              </div>
            </div>

            {/* Progress Bar Banner */}
            <div className="py-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#292929]">
                  {currentStamps} de {totalRequired} Sellos Acumulados
                </span>
                <span className="font-bold text-[#5B6F00]">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-white border border-[#D5D5D2]/80 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-[#5B6F00]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#72726E] mt-1.5">
                {isComplete
                  ? '🎉 ¡Completaste tu tarjeta! Preséntala en mostrador para tu premio.'
                  : `Te faltan solo ${remaining} ${remaining === 1 ? 'sello' : 'sellos'} para tu próximo premio.`}
              </p>
            </div>

            {/* 10-Stamp Grid (2 rows of 5) */}
            <div className="grid grid-cols-5 gap-2 my-2">
              {slots.map((num) => {
                const isFilled = num <= currentStamps;
                const isNext = num === currentStamps + 1;

                return (
                  <div
                    key={num}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
                      isFilled
                        ? 'bg-[#E5EACD] border border-[#5B6F00] text-[#5B6F00] shadow-2xs'
                        : isNext
                        ? 'bg-white border-2 border-dashed border-[#5B6F00] text-[#292929]'
                        : 'bg-white border border-dashed border-[#D5D5D2] text-[#72726E]/70'
                    }`}
                  >
                    {isFilled ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#5B6F00]" />
                        <span className="text-[8px] font-bold text-[#5B6F00]">#{num}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-sans font-medium text-[11px] text-[#72726E]">{num}</span>
                        <span className="text-[7px] text-[#72726E]/70 uppercase tracking-tighter">
                          {isNext ? 'Próx' : 'Sello'}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reward Preview Box */}
            <div className="mt-3 p-3 rounded-xl bg-white border border-[#D5D5D2] flex items-center gap-2.5 text-xs text-[#292929]">
              <Gift className="w-4 h-4 text-[#5B6F00] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#72726E] uppercase font-bold tracking-wider block">
                  Premio al completar 10 sellos
                </span>
                <span className="truncate font-sans text-xs text-[#292929] font-medium block">
                  {config.currentRewardTitle}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#D5D5D2] shadow-sm text-center">
            <h3 className="font-serif text-base font-normal text-[#292929]">
              Muestra este código al visitar
            </h3>
            <p className="text-xs text-[#72726E] mt-0.5">
              El encargado de mostrador lo escaneará en 0.8s para sumar tu visita
            </p>

            <div className="my-4 inline-block p-4 rounded-3xl bg-[#F7F7F2] border border-[#D5D5D2]">
              <QRCodeSVG
                value={student.token}
                size={165}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono bg-[#F7F7F2] text-[#292929] px-3 py-1 rounded-full border border-[#D5D5D2]">
                ID: {student.token}
              </span>
            </div>

            {/* Google Wallet Native Button */}
            <div className="mt-5 pt-4 border-t border-[#D5D5D2]">
              <button
                type="button"
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full h-12 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-xs font-medium shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                {isGeneratingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FCFCF8]" />
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
            <div className="mt-4 pt-3 flex items-center justify-around text-xs text-[#72726E]">
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20pase%20digital%20de%20cliente`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-medium hover:text-[#292929] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#5B6F00]" />
                <span>WhatsApp Local</span>
              </a>
              <span className="text-[#D5D5D2]">|</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 font-medium hover:text-[#292929] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#5B6F00]" /> : <Share className="w-4 h-4" />}
                <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir mi Pase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Local & Wi-Fi ── */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D5D5D2] shadow-sm space-y-5">
          <div className="border-b border-[#D5D5D2] pb-3">
            <span className="text-[10px] text-[#72726E] uppercase font-bold tracking-wider">
              Información del Establecimiento
            </span>
            <h3 className="font-serif text-lg font-normal text-[#292929] mt-0.5">
              {config.studioName}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#292929]">Dirección</p>
                <p className="text-[#72726E] mt-0.5">{config.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#292929]">Horario de Atención</p>
                <p className="text-[#72726E] mt-0.5">Lunes a Sábado: 8:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#5B6F00] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#292929]">Contacto WhatsApp</p>
                <p className="text-[#72726E] mt-0.5">{config.whatsappNumber}</p>
              </div>
            </div>

            {/* Wi-Fi Details */}
            <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#292929] flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#5B6F00]" />
                  <span>Wi-Fi Gratuito para Clientes</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-[#5B6F00] bg-[#E5EACD] px-2 py-0.5 rounded-full">
                  Exclusivo
                </span>
              </div>
              <div className="text-[11px] text-[#72726E]">
                <p>
                  <strong>Red:</strong> {config.wifiSsid}
                </p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#D5D5D2]">
                  <p>
                    <strong>Clave:</strong> <code className="font-mono text-[#292929]">{config.wifiPassword}</code>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyWifi}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5B6F00] hover:underline cursor-pointer"
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

      {/* ── Tab 3: Guardar en Móvil (Instrucciones) ── */}
      {activeTab === 'install' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D5D5D2] shadow-sm space-y-5">
          <div className="border-b border-[#D5D5D2] pb-3">
            <span className="text-[10px] text-[#72726E] uppercase font-bold tracking-wider">
              Acceso Rápido desde tu Pantalla
            </span>
            <h3 className="font-serif text-lg font-normal text-[#292929] mt-0.5">
              Cómo guardar tu pase en tu celular
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Android Google Wallet */}
            <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2]">
              <div className="flex items-center gap-2 font-bold text-[#292929] mb-1">
                <Wallet className="w-4 h-4 text-[#5B6F00]" />
                <span>Usuarios de Android (Google Wallet)</span>
              </div>
              <p className="text-[11px] text-[#72726E] mb-3">
                Agrega tu pase directamente a la app nativa de Google Wallet con notificaciones automáticas por cercanía.
              </p>
              <button
                type="button"
                onClick={handleSaveToGoogleWallet}
                disabled={isGeneratingWallet}
                className="w-full py-2.5 px-4 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Descargar Pase Google Wallet</span>
              </button>
            </div>

            {/* iPhone Safari Bookmark */}
            <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2]">
              <div className="flex items-center gap-2 font-bold text-[#292929] mb-1">
                <Smartphone className="w-4 h-4 text-[#5B6F00]" />
                <span>Usuarios de iPhone (Apple iOS)</span>
              </div>
              <ol className="text-[11px] text-[#72726E] space-y-1.5 list-decimal list-inside mt-2">
                <li>Abre este enlace en el navegador <strong>Safari</strong>.</li>
                <li>Toca el botón <strong>Compartir</strong> (ícono de caja con flecha arriba en la barra inferior).</li>
                <li>Selecciona <strong>&quot;Agregar a inicio&quot;</strong>.</li>
                <li>¡Listo! Tu pase quedará como un ícono de app en tu pantalla principal.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
