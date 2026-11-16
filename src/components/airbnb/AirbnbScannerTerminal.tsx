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
  Phone,
  Heart,
  Zap,
} from 'lucide-react';
import { validateQrTotp } from '@/lib/totp';

export function AirbnbScannerTerminal() {
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
  const scannerContainerId = 'airbnb-qr-reader-container';

  const currentStudent = getStudentByToken(selectedToken) || students[0];
  const maxStamps = config.totalStampsRequired || 10;
  const currentStamps = currentStudent ? currentStudent.stamps : 0;
  const isRewardReady = currentStamps >= maxStamps;
  const progressPercent = Math.min(100, Math.round((currentStamps / maxStamps) * 100));

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e61e4d', '#ff385c', '#d70466', '#ffb300', '#222222'],
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
          text: `🎁 ¡${studentName} ya tiene sus ${maxStamps}/${maxStamps} sellos completos y listos para canjear premio!`,
        });
      } else {
        const res = addStamp(cleanToken, `Auto-registro QR TOTP (${sourceLabel})`, 'Caja Airbnb');
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
              text: `⚡ ¡Sello sumado automáticamente! ${studentName} ahora tiene ${res.student?.stamps}/${maxStamps} sellos acumulados. (QR Verificado)`,
            });
          }
        } else {
          playChime(false);
          setMessage({ type: 'error', text: res.error || 'No se pudo registrar el sello' });
        }
      }
    } else {
      setMessage({ type: 'info', text: `¡Pase detectado (${sourceLabel})! Cliente identificado: ${studentName}` });
      playChime(true);
      triggerCelebration();
    }
  };

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
    const res = addStamp(currentStudent.token, 'Visita registrada en caja / mostrador', 'Caja Airbnb');
    if (res.success) {
      playChime(true);
      if (res.rewardUnlocked) {
        triggerCelebration();
        setMessage({
          type: 'success',
          text: `🎉 ¡Meta alcanzada! ${currentStudent.name} acaba de completar sus ${maxStamps} sellos. Recompensa desbloqueada.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: `✅ Sello registrado para ${currentStudent.name}. Tiene ${res.student?.stamps}/${maxStamps} sellos acumulados.`,
        });
      }
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'No se pudo registrar el sello' });
    }
  };

  const handleRedeem = () => {
    if (!currentStudent) return;
    const res = redeemReward(currentStudent.token, 'Caja Airbnb');
    if (res.success) {
      playChime(true);
      triggerCelebration();
      setMessage({
        type: 'success',
        text: `🎁 ¡Recompensa entregada! La tarjeta de ${currentStudent.name} se reinició para su próximo ciclo.`,
      });
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'Error al canjear' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-[#222222]">
      {/* ── Top Navigation Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EBEBEB]">
        <Link
          href="/style/airbnb"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#717171] hover:text-[#222222] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#E61E4D]" />
          <span>Volver a la portada Airbnb</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#717171] px-3 py-1 rounded-full bg-white border border-[#EBEBEB] flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E61E4D] animate-pulse" />
            Mostrador Conectado · Airbnb Style
          </span>
          {currentStudent && (
            <Link
              href={`/style/airbnb/card/${currentStudent.token}`}
              className="text-[11px] font-semibold text-[#E61E4D] hover:text-[#D70466] px-3 py-1 rounded-full bg-[#FFF8F8] border border-[#FDE8EB] flex items-center gap-1 transition-colors"
            >
              <span>Ver Pase del Cliente</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Airbnb Header Card ── */}
      <div className="relative overflow-hidden rounded-[28px] bg-white p-6 sm:p-8 border border-[#EBEBEB] shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFF8F8] text-[#E61E4D] border border-[#FDE8EB]">
              <QrCode className="w-3.5 h-3.5 text-[#E61E4D]" />
              <span>Escáner de Mostrador · Edición Hospitalidad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight mt-2.5">
              Escáner de Recepción & Sellos
            </h1>
            <p className="text-xs text-[#717171] mt-1 max-w-xl">
              Registra visitas en 0.8 segundos con cualquier cámara o busca clientes por nombre para sumar sellos al instante.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setAutoStamp(!autoStamp)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  autoStamp
                    ? 'bg-[#FFF8F8] border-[#E61E4D]/40 text-[#E61E4D] shadow-2xs'
                    : 'bg-white border-[#EBEBEB] text-[#717171]'
                }`}
                title="Haz clic para alternar el estampado automático"
              >
                <Zap className={`w-3.5 h-3.5 ${autoStamp ? 'text-[#E61E4D] fill-[#E61E4D]' : 'text-[#717171]'}`} />
                <span>{autoStamp ? '⚡ Auto-sumar sello al leer QR: ACTIVADO' : 'Modo consulta (Sin auto-sumar)'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#E61E4D] hover:bg-[#D70466] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Activar Cámara</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-2 h-11 px-5 rounded-full bg-white hover:bg-[#F7F7F7] text-[#222222] border border-[#EBEBEB] text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#E61E4D]" />
                <span>Detener Cámara</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Camera Viewport (Permanently in DOM to prevent race conditions) ── */}
      <div className={`bg-white rounded-[28px] p-5 border border-[#EBEBEB] shadow-[0_12px_32px_rgba(0,0,0,0.08)] text-center transition-all ${isCameraActive ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2]">
          <span className="text-xs font-bold text-[#222222] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#E61E4D] animate-pulse" />
            <span>Cámara en Vivo: Apunta al pase QR del cliente</span>
          </span>
          <button
            onClick={stopCamera}
            className="text-xs font-medium text-[#717171] hover:text-[#222222] cursor-pointer"
          >
            Cerrar visor
          </button>
        </div>
        <div id={scannerContainerId} className="w-full max-w-xs mx-auto my-4 overflow-hidden rounded-2xl border border-[#EBEBEB]" />
        <p className="text-[11px] text-[#717171]">
          El código se detecta y sincroniza automáticamente
        </p>
      </div>

      {cameraError && (
        <div className="bg-white border border-rose-300 text-[#222222] rounded-2xl p-4 text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#E61E4D] shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* ── Status Message Alert ── */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border transition-all ${
            message.type === 'success'
              ? 'bg-[#FFF8F8] border-[#FDE8EB] text-[#222222]'
              : message.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-white border-[#EBEBEB] text-[#222222]'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-[#E61E4D] shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#E61E4D] shrink-0" />
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            Entendido
          </button>
        </div>
      )}

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-[28px] p-5 border border-[#EBEBEB] shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-bold text-[#222222] mb-1 flex items-center justify-between">
              <span>Directorio de Huéspedes / Clientes</span>
              <span className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                {students.length} Miembros
              </span>
            </h3>
            <p className="text-[11px] text-[#717171] mb-3">
              Selecciona para abrir su pase y registrar visitas
            </p>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#717171] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o teléfono..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] text-xs text-[#222222] placeholder-[#717171] focus:outline-hidden focus:border-[#E61E4D] transition-colors"
              />
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#717171]">
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
                          ? 'bg-[#FFF8F8] border-[#E61E4D] shadow-2xs'
                          : 'bg-white border-[#EBEBEB]/80 hover:border-[#EBEBEB] hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#E61E4D] text-white'
                              : 'bg-[#F7F7F7] text-[#222222] border border-[#EBEBEB]'
                          }`}
                        >
                          {st.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#222222] truncate">{st.name}</p>
                          <p className="text-[10px] text-[#717171] truncate">{st.phone}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isFinished
                              ? 'bg-[#E61E4D] text-white'
                              : 'bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222]'
                          }`}
                        >
                          {st.stamps}/{maxStamps} sellos
                        </span>
                        {st.totalCompletedCycles > 0 && (
                          <span className="block text-[9px] text-[#717171] mt-0.5">
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

          <div className="p-4 rounded-[24px] bg-white border border-[#EBEBEB] text-xs flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider block">
                Recompensa del Negocio
              </span>
              <span className="font-bold text-sm text-[#222222]">
                {config.currentRewardTitle}
              </span>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-[#FFF8F8] border border-[#FDE8EB] flex items-center justify-center text-[#E61E4D]">
              <Gift className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right Column: Customer Card Inspector & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentStudent ? (
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#EBEBEB] shadow-[0_6px_20px_rgba(0,0,0,0.04)] space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-[#F2F2F2]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#717171]">
                    Cliente Seleccionado en Caja
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight mt-0.5">
                    {currentStudent.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-[#717171] mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#E61E4D]" />
                      {currentStudent.phone}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-[#717171]">
                      {currentStudent.token}
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#FFF8F8] border border-[#FDE8EB] flex items-center justify-center text-[#E61E4D]">
                  <ShieldCheck className="w-5 h-5 text-[#E61E4D]" />
                </div>
              </div>

              {/* Progress Summary */}
              <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#222222]">
                    {currentStamps} de {maxStamps} Sellos Acumulados
                  </span>
                  <span className="font-bold text-[#E61E4D]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-white border border-[#EBEBEB] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-[#E61E4D]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#717171] mt-2">
                  <span>
                    {isRewardReady
                      ? '🎯 Meta alcanzada: Recompensa lista para entregar'
                      : `Faltan ${maxStamps - currentStamps} visitas para la recompensa`}
                  </span>
                  <span>{currentStudent.totalCompletedCycles} ciclos anteriores</span>
                </div>
              </div>

              {/* 10-Slot Airbnb Grid */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider block mb-2">
                  Cuadrícula de Visitas
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
                            ? 'bg-[#E61E4D] text-white shadow-xs font-bold'
                            : isNext
                            ? 'bg-white border-2 border-dashed border-[#E61E4D] text-[#222222]'
                            : 'bg-[#F7F7F7] border border-dashed border-[#DDDDDD] text-[#717171]'
                        }`}
                      >
                        {isFilled ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3] text-white" />
                            <span className="text-[9px] font-bold text-white/90 mt-0.5">#{num}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-xs">{num}</span>
                            <span className="text-[8px] uppercase tracking-tighter text-[#717171]">
                              {isNext ? 'Próx' : 'Sello'}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddStamp}
                  className="flex-1 h-13 px-6 rounded-full bg-[#E61E4D] hover:bg-[#D70466] text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+ Sumar 1 Sello (Visita)</span>
                </button>

                {isRewardReady && (
                  <button
                    type="button"
                    onClick={handleRedeem}
                    className="flex-1 h-13 px-6 rounded-full bg-[#222222] hover:bg-black text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Canjear Premio & Reiniciar</span>
                  </button>
                )}

                <Link
                  href={`/style/airbnb/card/${currentStudent.token}`}
                  target="_blank"
                  className="h-13 px-5 rounded-full bg-white hover:bg-[#F7F7F7] text-[#222222] border border-[#EBEBEB] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Ver Pase Digital</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E61E4D]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[28px] p-8 border border-[#EBEBEB] text-center text-xs text-[#717171]">
              Selecciona un cliente del directorio para comenzar.
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white rounded-[28px] p-5 border border-[#EBEBEB] shadow-2xs">
            <h3 className="text-sm font-bold text-[#222222] mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-[#E61E4D]" />
              <span>Actividad Reciente en Caja</span>
            </h3>

            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB]/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        tx.type === 'REDEEM_REWARD'
                          ? 'bg-[#222222] text-white'
                          : 'bg-[#FFF8F8] text-[#E61E4D] border border-[#FDE8EB]'
                      }`}
                    >
                      {tx.type === 'REDEEM_REWARD' ? '🎁' : '✓'}
                    </div>
                    <div>
                      <p className="font-bold text-[#222222]">{tx.studentName}</p>
                      <p className="text-[10px] text-[#717171]">{tx.note || 'Sello en mostrador'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#717171]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="block text-[10px] font-bold text-[#E61E4D]">
                      {tx.type === 'REDEEM_REWARD' ? 'Premio Canjeado' : '+1 Sello'}
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
