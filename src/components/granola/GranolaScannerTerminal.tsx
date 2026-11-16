'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLoyal } from '@/context/LoyalContext';
import confetti from 'canvas-confetti';
import {
  Camera,
  Search,
  Sparkles,
  Gift,
  AlertCircle,
  RefreshCw,
  History,
  QrCode,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  User,
  Phone,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { validateQrTotp } from '@/lib/totp';

export function GranolaScannerTerminal() {
  const {
    students,
    config,
    getStudentByToken,
    addStamp,
    redeemReward,
    transactions,
    refreshFromServer,
  } = useLoyal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>('camila-restrepo-yoga');
  const [autoStamp, setAutoStamp] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const isProcessingScan = useRef(false);
  const scannerContainerId = 'granola-qr-reader-container';

  const currentStudent = getStudentByToken(selectedToken) || students[0];
  const maxStamps = config.totalStampsRequired || 10;
  const currentStamps = currentStudent ? currentStudent.stamps : 0;
  const isRewardReady = currentStamps >= maxStamps;
  const progressPercent = Math.min(100, Math.round((currentStamps / maxStamps) * 100));

  // Filter students for search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Play audio chime
  const playChime = (success: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (success) {
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15);
          osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3);
        } else {
          osc.frequency.setValueAtTime(300, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.2);
        }
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch {}
  };

  // Launch Granola-palette celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#5B6F00', '#B2C248', '#E5EACD', '#292929', '#E4D5B7'],
      });
    } catch {}
  };

  // Process decoded token from QR (supports dynamic TOTP validation)
  const processDecodedToken = async (decodedText: string, sourceLabel: string) => {
    let cleanToken = decodedText.trim();
    let totpCode: string | null = null;

    try {
      if (cleanToken.includes('?')) {
        const urlObj = new URL(cleanToken.startsWith('http') ? cleanToken : `https://loyal.jhojan.cloud/${cleanToken}`);
        totpCode = urlObj.searchParams.get('totp');
      }
    } catch {}

    const cardUrlMatch = cleanToken.match(/\/card\/([a-zA-Z0-9_-]+)/);
    if (cardUrlMatch && cardUrlMatch[1]) {
      cleanToken = cardUrlMatch[1];
    } else {
      cleanToken = cleanToken.replace(/^https?:\/\/[^\/]+\/(?:style\/[^\/]+\/)?card\//, '').replace(/[?#].*$/, '');
    }

    // Verify TOTP if provided
    if (totpCode) {
      const totpCheck = validateQrTotp(cleanToken, totpCode);
      if (!totpCheck.valid) {
        playChime(false);
        setMessage({
          type: 'error',
          text: `🛡️ ${totpCheck.reason || 'Código QR expirado o reenviado. Pide al cliente abrir su tarjeta en vivo.'}`,
        });
        return;
      }
    }

    setSelectedToken(cleanToken);
    let student = getStudentByToken(cleanToken);
    if (!student) {
      await refreshFromServer();
      student = getStudentByToken(cleanToken);
    }

    const studentName = student ? student.name : cleanToken;

    if (autoStamp && student) {
      if (student.stamps >= maxStamps) {
        playChime(true);
        triggerCelebration();
        setMessage({
          type: 'info',
          text: `🎁 ¡${studentName} ya tiene sus ${maxStamps}/${maxStamps} sellos completos y listos para su regalo!`,
        });
      } else {
        const res = addStamp(cleanToken, `Auto-registro QR TOTP (${sourceLabel})`, 'Caja Granola');
        if (res.success) {
          playChime(true);
          triggerCelebration();
          if (res.rewardUnlocked) {
            setMessage({
              type: 'success',
              text: `🎉 ¡Sello sumado automáticamente! ${studentName} completó sus ${maxStamps} sellos. Recompensa desbloqueada.`,
            });
          } else {
            setMessage({
              type: 'success',
              text: `⚡ ¡Sello sumado automáticamente! ${studentName} ahora tiene ${res.student?.stamps}/${maxStamps} sellos. (QR Verificado)`,
            });
          }
        } else {
          playChime(false);
          setMessage({ type: 'error', text: res.error || 'No se pudo sumar el sello' });
        }
      }
    } else {
      setMessage({ type: 'info', text: `¡Pase detectado (${sourceLabel})! Cliente identificado: ${studentName}` });
      playChime(true);
      triggerCelebration();
    }
  };

  // Start html5-qrcode scanner
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    isProcessingScan.current = false;

    // Small delay to ensure container element is mounted and styled in DOM
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const containerEl = document.getElementById(scannerContainerId);
      if (!containerEl) {
        throw new Error('Contenedor visual de la cámara no encontrado.');
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      // Select camera: prioritize back/environment camera
      let cameraConfig: any = { facingMode: 'environment' };
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const backCam = devices.find((d: any) => /back|rear|environment|trasera|posterior/i.test(d.label));
          cameraConfig = backCam ? backCam.id : devices[devices.length - 1].id;
        }
      } catch (camErr) {
        console.log('Using default camera facingMode: environment', camErr);
      }

      await html5QrCode.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight);
            const boxSize = Math.max(160, Math.min(Math.floor(edge * 0.75), 250));
            return { width: boxSize, height: boxSize };
          },
        },
        async (decodedText) => {
          if (isProcessingScan.current) return;
          isProcessingScan.current = true;

          await processDecodedToken(decodedText, 'Cámara en vivo');

          // Pause and close camera after successful scan for seamless POS UX
          setTimeout(async () => {
            await stopCamera();
            isProcessingScan.current = false;
          }, 700);
        },
        () => {}
      );
    } catch (err: any) {
      console.warn('Camera failed:', err);
      setCameraError('No se pudo acceder a la cámara o no hay permisos en tu navegador. Puedes subir una captura del QR o elegir el cliente del listado.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch {}
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleAddStamp = () => {
    if (!currentStudent) return;
    const res = addStamp(currentStudent.token, 'Visita registrada en caja / mostrador', 'Caja Granola');
    if (res.success) {
      playChime(true);
      if (res.rewardUnlocked) {
        triggerCelebration();
        setMessage({
          type: 'success',
          text: `🎉 ¡Felicitaciones! ${currentStudent.name} acaba de completar sus ${maxStamps} sellos. Recompensa desbloqueada.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: `✅ Sello registrado para ${currentStudent.name}. Ahora tiene ${res.student?.stamps}/${maxStamps} sellos.`,
        });
      }
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'No se pudo agregar sello' });
    }
  };

  const handleRedeem = () => {
    if (!currentStudent) return;
    const res = redeemReward(currentStudent.token, 'Caja Granola');
    if (res.success) {
      playChime(true);
      triggerCelebration();
      setMessage({
        type: 'success',
        text: `🎁 ¡Recompensa entregada con éxito! La tarjeta de ${currentStudent.name} se reinició para su próximo ciclo.`,
      });
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'Error al canjear' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-[#292929]">
      {/* ── Top Navigation & Back Link ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D5D5D2]">
        <Link
          href="/style/granola"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#72726E] hover:text-[#292929] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#5B6F00]" />
          <span>Volver a la portada Granola</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-medium text-[#72726E] px-2.5 py-1 rounded-full bg-white border border-[#D5D5D2] flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#5B6F00] animate-pulse" />
            Caja Conectada · Granola POS
          </span>
          {currentStudent && (
            <Link
              href={`/style/granola/card/${currentStudent.token}`}
              className="text-[11px] font-medium text-[#5B6F00] hover:text-[#4D5E00] px-2.5 py-1 rounded-full bg-[#E5EACD] border border-[#5B6F00]/30 flex items-center gap-1 transition-colors"
            >
              <span>Ver Pase del Cliente</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Editorial Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-[#D5D5D2] shadow-sm">
        {/* Halftone texture element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5EACD]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F7F7F2] text-[#5B6F00] border border-[#D5D5D2]">
              <QrCode className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span>Terminal de Mostrador · Edición Papel</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#292929] tracking-tight mt-2.5">
              Escáner de Recepción & Sellos
            </h1>
            <p className="text-xs text-[#72726E] mt-1 max-w-xl">
              Escanea el código QR de tus clientes desde cualquier cámara o busca manualmente por nombre/teléfono para sumar sellos al instante.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setAutoStamp(!autoStamp)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                  autoStamp
                    ? 'bg-[#E5EACD] border-[#5B6F00]/50 text-[#292929] shadow-2xs'
                    : 'bg-[#F7F7F2] border-[#D5D5D2] text-[#72726E]'
                }`}
                title="Haz clic para alternar el estampado automático"
              >
                <Zap className={`w-3.5 h-3.5 ${autoStamp ? 'text-[#5B6F00] fill-[#5B6F00]' : 'text-[#72726E]'}`} />
                <span>{autoStamp ? '⚡ Auto-sumar sello al leer QR: ACTIVADO' : 'Modo consulta (Sin auto-sumar)'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-xs font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Activar Cámara</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-2 h-11 px-5 rounded-full bg-white hover:bg-[#F7F7F2] text-[#292929] border border-[#D5D5D2] text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#5B6F00]" />
                <span>Detener Cámara</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Camera Viewport (Permanently in DOM to avoid mounting race conditions) ── */}
      <div className={`bg-white rounded-3xl p-5 border border-[#D5D5D2] shadow-md text-center transition-all ${isCameraActive ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#D5D5D2]">
          <span className="text-xs font-bold text-[#292929] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#5B6F00] animate-pulse" />
            <span>Cámara en Vivo: Apunta al código QR del cliente</span>
          </span>
          <button
            onClick={stopCamera}
            className="text-xs font-medium text-[#72726E] hover:text-[#292929] cursor-pointer"
          >
            Cerrar visor
          </button>
        </div>
        <div id={scannerContainerId} className="w-full max-w-xs mx-auto my-4 overflow-hidden rounded-2xl border border-[#D5D5D2]" />
        <p className="text-[11px] text-[#72726E]">
          Mantén la tarjeta digital dentro del marco para detección automática en 0.8s
        </p>
      </div>

      {cameraError && (
        <div className="bg-white border border-amber-300 text-[#292929] rounded-2xl p-4 text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* ── Status Message Alert ── */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border transition-all ${
            message.type === 'success'
              ? 'bg-[#E5EACD] border-[#5B6F00]/50 text-[#292929]'
              : message.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-white border-[#D5D5D2] text-[#292929]'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-[#5B6F00] shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#5B6F00] shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            Entendido
          </button>
        </div>
      )}

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Search & Quick Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#D5D5D2] shadow-2xs">
            <h3 className="font-serif text-base font-normal text-[#292929] mb-1 flex items-center justify-between">
              <span>Directorio de Clientes</span>
              <span className="font-sans text-[11px] font-bold text-[#72726E] uppercase tracking-wider">
                {students.length} Registrados
              </span>
            </h3>
            <p className="text-[11px] text-[#72726E] mb-3">
              Selecciona un cliente para ver su tarjeta y sumar visitas
            </p>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#72726E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, teléfono o ID..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#D5D5D2] text-xs text-[#292929] placeholder-[#72726E] focus:outline-hidden focus:border-[#5B6F00] transition-colors"
              />
            </div>

            {/* Students List */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#72726E]">
                  No se encontraron clientes con esa búsqueda.
                </div>
              ) : (
                filteredStudents.map((st) => {
                  const isSelected = currentStudent?.token === st.token;
                  const isFinished = st.stamps >= maxStamps;

                  return (
                    <button
                      key={st.token}
                      onClick={() => {
                        setSelectedToken(st.token);
                        setMessage(null);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F7F2] border-[#5B6F00] shadow-2xs'
                          : 'bg-white border-[#D5D5D2]/70 hover:border-[#D5D5D2] hover:bg-[#F7F7F2]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-xs shrink-0 ${
                            isSelected
                              ? 'bg-[#5B6F00] text-[#FCFCF8]'
                              : 'bg-[#E5EACD] text-[#5B6F00]'
                          }`}
                        >
                          {st.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#292929] truncate">{st.name}</p>
                          <p className="text-[10px] text-[#72726E] truncate">{st.phone}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFinished
                              ? 'bg-[#B2C248] text-[#292929]'
                              : 'bg-[#F7F7F2] border border-[#D5D5D2] text-[#292929]'
                          }`}
                        >
                          {st.stamps}/{maxStamps} sellos
                        </span>
                        {st.totalCompletedCycles > 0 && (
                          <span className="block text-[9px] text-[#72726E] mt-0.5">
                            {st.totalCompletedCycles} {st.totalCompletedCycles === 1 ? 'premio' : 'premios'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="p-4 rounded-3xl bg-white border border-[#D5D5D2] text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#72726E] tracking-wider block">
                Premio Vigente
              </span>
              <span className="font-serif text-sm text-[#292929]">
                {config.currentRewardTitle}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#E5EACD] border border-[#5B6F00]/30 flex items-center justify-center text-[#5B6F00]">
              <Gift className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right Column: Active Card Inspector & Quick Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentStudent ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5D5D2] shadow-sm space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#D5D5D2]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#72726E]">
                    Cliente Activo en Caja
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#292929] tracking-tight mt-0.5">
                    {currentStudent.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-[#72726E] mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#5B6F00]" />
                      {currentStudent.phone}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-[#72726E]">
                      {currentStudent.token}
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2] flex items-center justify-center text-[#5B6F00]">
                  <ShieldCheck className="w-5 h-5 text-[#5B6F00]" />
                </div>
              </div>

              {/* Progress Summary in Granola paper style */}
              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-[#292929]">
                    {currentStamps} de {maxStamps} Sellos Acumulados
                  </span>
                  <span className="font-bold text-[#5B6F00]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-white border border-[#D5D5D2] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-[#5B6F00]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#72726E] mt-2">
                  <span>
                    {isRewardReady
                      ? '🎯 Meta completada: ¡Recompensa lista para canjear!'
                      : `Faltan ${maxStamps - currentStamps} visitas para la recompensa`}
                  </span>
                  <span>{currentStudent.totalCompletedCycles} ciclos anteriores</span>
                </div>
              </div>

              {/* 10-Slot Granola Stamp Visual Grid */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#72726E] tracking-wider block mb-2">
                  Cuadrícula de Sellos (10 Visitas)
                </span>
                <div className="grid grid-cols-5 gap-2.5">
                  {Array.from({ length: maxStamps }, (_, i) => i + 1).map((num) => {
                    const isFilled = num <= currentStamps;
                    const isNext = num === currentStamps + 1;

                    return (
                      <div
                        key={num}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs transition-all ${
                          isFilled
                            ? 'bg-[#E5EACD] border border-[#5B6F00] text-[#5B6F00] shadow-2xs font-bold'
                            : isNext
                            ? 'bg-white border-2 border-dashed border-[#5B6F00] text-[#292929]'
                            : 'bg-[#F7F7F2] border border-dashed border-[#D5D5D2] text-[#72726E]'
                        }`}
                      >
                        {isFilled ? (
                          <>
                            <Check className="w-4 h-4 stroke-[2.5] text-[#5B6F00]" />
                            <span className="text-[9px] font-bold text-[#5B6F00] mt-0.5">#{num}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-sans font-medium text-xs">{num}</span>
                            <span className="text-[8px] uppercase tracking-tighter text-[#72726E]">
                              {isNext ? 'Siguiente' : 'Libre'}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddStamp}
                  className="flex-1 h-13 px-6 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-[#FCFCF8] text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 opacity-90" />
                  <span>+ Sumar 1 Sello (Visita)</span>
                </button>

                {isRewardReady && (
                  <button
                    type="button"
                    onClick={handleRedeem}
                    className="flex-1 h-13 px-6 rounded-full bg-[#B2C248] hover:bg-[#9EA03D] text-[#292929] text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-[#292929]" />
                    <span>Canjear Premio & Reiniciar</span>
                  </button>
                )}

                <Link
                  href={`/style/granola/card/${currentStudent.token}`}
                  target="_blank"
                  className="h-13 px-5 rounded-full bg-white hover:bg-[#F7F7F2] text-[#292929] border border-[#D5D5D2] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Abrir Pase Digital</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5B6F00]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#D5D5D2] text-center text-xs text-[#72726E]">
              Selecciona un cliente del directorio para comenzar.
            </div>
          )}

          {/* Recent Activity Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#D5D5D2] shadow-2xs">
            <h3 className="font-serif text-sm font-normal text-[#292929] mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-[#5B6F00]" />
              <span>Registro de Actividad Reciente</span>
            </h3>

            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-[#F7F7F2] border border-[#D5D5D2]/70 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        tx.type === 'REDEEM_REWARD'
                          ? 'bg-[#B2C248] text-[#292929]'
                          : 'bg-[#E5EACD] text-[#5B6F00]'
                      }`}
                    >
                      {tx.type === 'REDEEM_REWARD' ? '🎁' : '✓'}
                    </div>
                    <div>
                      <p className="font-medium text-[#292929]">{tx.studentName}</p>
                      <p className="text-[10px] text-[#72726E]">{tx.note || 'Sello en mostrador'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#72726E]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="block text-[10px] font-medium text-[#5B6F00]">
                      {tx.type === 'REDEEM_REWARD' ? 'Canje completado' : '+1 Sello'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
