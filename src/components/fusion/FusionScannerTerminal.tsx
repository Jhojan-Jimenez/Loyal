'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLoyal } from '@/context/LoyalContext';
import { Student, StudioConfig, StampTransaction } from '@/lib/types';
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
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import { validateQrTotp } from '@/lib/totp';

export function FusionScannerTerminal({ tenantSlug }: { tenantSlug?: string } = {}) {
  const {
    students: globalStudents,
    config: globalConfig,
    getStudentByToken: globalGetStudent,
    addStamp,
    redeemReward,
    transactions: globalTransactions,
    refreshFromServer,
  } = useLoyal();

  // Tenant-scoped state
  const [tenantInfo, setTenantInfo] = useState<{
    id: string;
    slug: string;
    name: string;
    category?: string;
  } | null>(null);
  const [tenantStudents, setTenantStudents] = useState<Student[]>([]);
  const [tenantConfig, setTenantConfig] = useState<StudioConfig>(globalConfig);
  const [tenantTransactions, setTenantTransactions] = useState<StampTransaction[]>([]);

  // Rapid PIN Lock State (Square POS model for cashier isolation)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!tenantSlug);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [validatingPin, setValidatingPin] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [autoStamp, setAutoStamp] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const isProcessingScan = useRef(false);
  const scannerContainerId = 'fusion-qr-reader-container';

  // Check PIN unlock state and load tenant data
  useEffect(() => {
    if (!tenantSlug) {
      setIsUnlocked(true);
      return;
    }

    const saved = sessionStorage.getItem(`loyal_cashier_${tenantSlug}`);
    if (saved === 'unlocked') {
      setIsUnlocked(true);
    }

    // Check if current user is an admin or superadmin
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (
          d.authenticated &&
          (d.session?.isPlatformSuperAdmin || d.session?.activeTenant?.slug === tenantSlug)
        ) {
          sessionStorage.setItem(`loyal_cashier_${tenantSlug}`, 'unlocked');
          setIsUnlocked(true);
        }
      })
      .catch(() => {});

    // Fetch scoped tenant data
    async function loadTenantData() {
      try {
        const res = await fetch(`/api/db?tenantSlug=${encodeURIComponent(tenantSlug!)}`);
        const data = await res.json();
        if (data.success) {
          if (data.tenant) setTenantInfo(data.tenant);
          if (data.config) setTenantConfig(data.config);
          if (Array.isArray(data.students)) setTenantStudents(data.students);
          if (Array.isArray(data.transactions)) setTenantTransactions(data.transactions);
        }
      } catch (e) {
        console.warn('Error loading tenant scanner data:', e);
      }
    }

    loadTenantData();
  }, [tenantSlug]);

  const students = tenantSlug ? tenantStudents : globalStudents;
  const config = tenantSlug ? tenantConfig : globalConfig;
  const transactions = tenantSlug ? tenantTransactions : globalTransactions;

  const getStudentByToken = (token: string) => {
    return students.find((s) => s.token.toLowerCase().trim() === token.toLowerCase().trim());
  };

  const currentStudent = selectedToken
    ? getStudentByToken(selectedToken)
    : (students.length > 0 ? students[0] : undefined);
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
        colors: ['#5B6F00', '#B2C248', '#C26748', '#E5EACD', '#1C1917'],
      });
    } catch {}
  };

  // Process decoded token from QR (supports dynamic TOTP validation)
  const processDecodedToken = async (decodedText: string, sourceLabel: string) => {
    let cleanToken = decodedText.trim();
    let totpCode: string | null = null;

    if (cleanToken.includes('?')) {
      const parts = cleanToken.split('?');
      cleanToken = parts[0];
      const params = new URLSearchParams(parts[1]);
      totpCode = params.get('totp');
    }

    if (cleanToken.includes('/card/')) {
      const match = cleanToken.match(/\/card\/([a-zA-Z0-9_-]+)/);
      if (match) cleanToken = match[1];
    }

    if (totpCode) {
      const isValid = validateQrTotp(cleanToken, totpCode);
      if (!isValid) {
        playChime(false);
        setMessage({
          type: 'error',
          text: '⚠️ Código QR caducado o inválido. El cliente debe mostrar el pase actualizado.',
        });
        return;
      }
    }

    const found = getStudentByToken(cleanToken);
    if (found) {
      setSelectedToken(cleanToken);
      if (autoStamp) {
        try {
          const res = addStamp(found.token, `Auto-scan (${sourceLabel})`, 'Caja Mostrador', tenantSlug);
          if (res.success) {
            playChime(true);
            triggerCelebration();
            if (res.student && tenantSlug) {
              setTenantStudents((prev) =>
                prev.map((s) => (s.id === res.student!.id ? res.student! : s))
              );
            }
            setMessage({
              type: 'success',
              text: `✨ ¡Sello registrado con éxito a ${found.name}! (${found.stamps + 1}/${maxStamps})`,
            });
          } else {
            playChime(false);
            setMessage({ type: 'error', text: res.error || 'Error al estampar.' });
          }
        } catch {
          playChime(false);
          setMessage({ type: 'error', text: 'Error al estampar automáticamente.' });
        }
      } else {
        playChime(true);
        setMessage({
          type: 'info',
          text: `Tarjeta de ${found.name} detectada. Pulsa "+1 Sello" para confirmar.`,
        });
      }
    } else {
      playChime(false);
      setMessage({
        type: 'error',
        text: '❌ Este pase digital pertenece a otro establecimiento comercial.',
      });
    }
  };

  // Start live HTML5 QR camera scanner
  const startCameraScanner = async () => {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          aspectRatio: 1.0,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.max(160, Math.floor(minEdge * 0.72));
            return { width: size, height: size };
          },
        },
        (decodedText: string) => {
          if (isProcessingScan.current) return;
          isProcessingScan.current = true;
          processDecodedToken(decodedText, 'Cámara en vivo');
          setTimeout(() => {
            isProcessingScan.current = false;
          }, 2500);
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Error iniciando cámara:', err);
      setCameraError('No se pudo acceder a la cámara. Revisa los permisos del navegador.');
      setIsCameraActive(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.error('Error deteniendo cámara:', e);
      }
      scannerRef.current = null;
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

  const handleManualAddStamp = async () => {
    if (!currentStudent) return;
    try {
      const res = addStamp(currentStudent.token, 'Manual mostrador', 'Caja Mostrador', tenantSlug);
      if (res.success) {
        playChime(true);
        triggerCelebration();
        if (res.student && tenantSlug) {
          setTenantStudents((prev) =>
            prev.map((s) => (s.id === res.student!.id ? res.student! : s))
          );
        }
        setMessage({
          type: 'success',
          text: `✨ Sello sumado a ${currentStudent.name}.`,
        });
      } else {
        playChime(false);
        setMessage({ type: 'error', text: res.error || 'No se pudo añadir el sello.' });
      }
    } catch {
      playChime(false);
      setMessage({ type: 'error', text: 'No se pudo añadir el sello.' });
    }
  };

  const handleRedeemReward = async () => {
    if (!currentStudent || !isRewardReady) return;
    try {
      const res = redeemReward(currentStudent.token, 'Caja Mostrador', tenantSlug);
      if (res.success) {
        playChime(true);
        triggerCelebration();
        if (res.student && tenantSlug) {
          setTenantStudents((prev) =>
            prev.map((s) => (s.id === res.student!.id ? res.student! : s))
          );
        }
        setMessage({
          type: 'success',
          text: `🎉 ¡Premio redimido con éxito para ${currentStudent.name}! Se reinició el ciclo.`,
        });
      } else {
        playChime(false);
        setMessage({ type: 'error', text: res.error || 'Error al redimir la recompensa.' });
      }
    } catch {
      playChime(false);
      setMessage({ type: 'error', text: 'Error al redimir la recompensa.' });
    }
  };

  const handlePinDigit = async (digit: string) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setPinError(null);

    if (nextPin.length === 4) {
      setValidatingPin(true);
      try {
        const res = await fetch('/api/auth/pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: tenantSlug, pin: nextPin }),
        });
        const data = await res.json();
        if (data.success) {
          if (tenantSlug) {
            sessionStorage.setItem(`loyal_cashier_${tenantSlug}`, 'unlocked');
            // Reload scoped tenant students/transactions now that cashier cookie is set
            fetch(`/api/db?tenantSlug=${encodeURIComponent(tenantSlug)}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.success) {
                  if (Array.isArray(d.students)) setTenantStudents(d.students);
                  if (Array.isArray(d.transactions)) setTenantTransactions(d.transactions);
                }
              })
              .catch(() => {});
          }
          setIsUnlocked(true);
          playChime(true);
          setPinInput('');
        } else {
          setPinError(data.error || 'PIN incorrecto');
          playChime(false);
          setPinInput('');
        }
      } catch {
        setPinError('Error de red al validar PIN');
        setPinInput('');
      } finally {
        setValidatingPin(false);
      }
    }
  };

  const handleClearPin = () => {
    setPinInput('');
    setPinError(null);
  };

  const handleBackspacePin = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleLockTerminal = () => {
    if (tenantSlug) {
      sessionStorage.removeItem(`loyal_cashier_${tenantSlug}`);
    }
    setIsUnlocked(false);
    setPinInput('');
    setPinError(null);
  };

  // ── PIN LOCK SCREEN (Square POS Model) ──
  if (!isUnlocked && tenantSlug) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 selection:bg-[#5B6F00] selection:text-white">
        <div className="w-full max-w-sm bg-[#FFFDF9] rounded-[36px] border border-[#EAE4D5] p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-[#F1F5DC] text-[#5B6F00] flex items-center justify-center mx-auto border border-[#D9E2B3] shadow-inner">
            <Lock className="w-6 h-6 text-[#5B6F00]" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#5B6F00] bg-[#F1F5DC] px-3 py-1 rounded-full border border-[#D9E2B3]">
              TERMINAL DE CAJA
            </span>
            <h2 className="text-xl font-serif text-[#1C1917] mt-3">
              {tenantInfo?.name || tenantSlug}
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              Ingresa tu PIN de 4 dígitos para operar el escáner
            </p>
          </div>

          {/* 4 PIN Dots */}
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  pinInput.length > idx
                    ? 'bg-[#5B6F00] border-[#5B6F00] scale-110 shadow-sm'
                    : 'border-[#D9E2B3] bg-white'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs text-[#C2410C] font-semibold bg-[#FDF2F0] py-2 px-3 rounded-xl border border-[#F5C7C0]">
              {pinError}
            </p>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handlePinDigit(digit)}
                disabled={validatingPin}
                className="w-16 h-16 rounded-full bg-[#FAF7F2] hover:bg-[#F1F5DC] hover:text-[#5B6F00] border border-[#EAE4D5] text-lg font-serif font-bold text-[#1C1917] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearPin}
              disabled={validatingPin}
              className="w-16 h-16 rounded-full bg-[#FAF7F2] hover:bg-[#FDF2F0] text-xs font-bold text-[#78716C] hover:text-[#C2410C] border border-[#EAE4D5] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handlePinDigit('0')}
              disabled={validatingPin}
              className="w-16 h-16 rounded-full bg-[#FAF7F2] hover:bg-[#F1F5DC] hover:text-[#5B6F00] border border-[#EAE4D5] text-lg font-serif font-bold text-[#1C1917] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspacePin}
              disabled={validatingPin}
              className="w-16 h-16 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-sm font-bold text-[#78716C] border border-[#EAE4D5] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              ⌫
            </button>
          </div>

          <div className="pt-2 border-t border-[#EAE4D5] space-y-2">
            <Link
              href={`/login?redirect=/${tenantSlug}/scanner`}
              className="text-[11px] text-[#5B6F00] font-semibold hover:underline block"
            >
              Soy administrador · Entrar con correo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#5B6F00] selection:text-white antialiased pb-20">
      {/* ── Top Bar with Back Link & Title ── */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D5] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={tenantSlug ? `/${tenantSlug}/admin` : '/'}
            className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] flex items-center justify-center text-[#1C1917] transition-colors"
            title={tenantSlug ? 'Volver a Panel Admin' : 'Inicio'}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-normal text-[#1C1917] flex items-center gap-1.5 font-serif">
              <span>{tenantInfo?.name || config.studioName || 'Terminal de Mostrador'}</span>
              {tenantSlug && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B6F00] bg-[#F1F5DC] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
                  /{tenantSlug}
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#57534E] cursor-pointer">
            <span className="hidden sm:inline">Auto-sello zero-click:</span>
            <input
              type="checkbox"
              checked={autoStamp}
              onChange={(e) => setAutoStamp(e.target.checked)}
              className="w-4 h-4 rounded text-[#5B6F00] focus:ring-[#5B6F00] cursor-pointer accent-[#5B6F00]"
            />
          </label>

          {tenantSlug && (
            <button
              onClick={handleLockTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EAE4D5] text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
              title="Bloquear terminal de caja con PIN"
            >
              <Lock className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span className="hidden sm:inline">Bloquear Caja</span>
            </button>
          )}

          <button
            onClick={() => refreshFromServer(tenantSlug)}
            className="p-2 rounded-full hover:bg-[#F3EFE6] text-[#78716C] transition-colors cursor-pointer"
            title="Refrescar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Layout: 2 Columns (Scanner Viewport + Member Pass Sheet) ── */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Optical Camera & Search (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border animate-in fade-in duration-200 ${
                message.type === 'success'
                  ? 'bg-[#F1F5DC] border-[#D9E2B3] text-[#5B6F00]'
                  : message.type === 'error'
                  ? 'bg-[#FBF4EE] border-[#F1DED1] text-[#C26748]'
                  : 'bg-[#FAF7F2] border-[#EAE4D5] text-[#1C1917]'
              }`}
            >
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="text-xs opacity-60 hover:opacity-100 font-mono"
              >
                ✕
              </button>
            </div>
          )}

          {/* Camera Viewfinder Box */}
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-6 shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-normal text-[#1C1917]">
                  Escaneo QR de Mostrador
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[11px] font-medium text-[#57534E]">
                <Zap className="w-3.5 h-3.5 text-[#5B6F00]" />
                <span>{autoStamp ? 'Zero-Click Activo' : 'Confirmación Manual'}</span>
              </span>
            </div>

            {/* Container for HTML5 QR Reader */}
            <div className="relative aspect-square sm:aspect-4/3 rounded-2xl bg-[#1C1917] overflow-hidden flex items-center justify-center border border-[#EAE4D5]">
              <div
                id={scannerContainerId}
                className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
              />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/90 bg-gradient-to-b from-[#292524] to-[#1C1917]">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-xs">
                    <Camera className="w-7 h-7 text-[#B2C248]" />
                  </div>
                  <h4 className="text-base font-serif font-normal mb-1">
                    Cámara en Espera
                  </h4>
                  <p className="text-xs text-white/70 max-w-xs mb-5">
                    Activa la cámara de tu dispositivo para escanear el QR del cliente en menos de un segundo.
                  </p>
                  <button
                    type="button"
                    onClick={startCameraScanner}
                    className="px-6 py-2.5 rounded-full text-white text-xs font-bold transition-all active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
                    }}
                  >
                    <Camera className="w-4 h-4 text-[#B2C248]" />
                    <span>Activar Cámara</span>
                  </button>
                </div>
              )}

              {isCameraActive && (
                <div className="absolute top-4 right-4 z-20">
                  <button
                    type="button"
                    onClick={stopCameraScanner}
                    className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 transition-colors"
                  >
                    Detener Cámara
                  </button>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-xs text-[#C26748] mt-3 font-semibold text-center">
                {cameraError}
              </p>
            )}

            <p className="text-[11px] text-[#78716C] mt-4 text-center">
              🛡️ Protección criptográfica TOTP: Los códigos rotan cada 30 segundos para impedir el uso de capturas de pantalla viejas.
            </p>
          </div>

          {/* Quick Manual Search & Client Selector */}
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-6 shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-serif font-normal text-[#1C1917]">
                Buscar Cliente Registrado
              </h4>
              <span className="text-[11px] font-mono text-[#78716C]">
                {students.length} Miembros
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, teléfono o token..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4D5] text-xs text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:border-[#5B6F00] transition-colors"
              />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 px-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#EAE4D5]">
                  <p className="text-xs text-[#57534E] font-medium">No hay clientes registrados aún</p>
                  <p className="text-[11px] text-[#A89F91] mt-0.5">
                    Escanea un QR nuevo con la cámara o añade el primero desde el panel Admin.
                  </p>
                </div>
              ) : (
                filteredStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedToken(st.token)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      st.token === selectedToken
                        ? 'bg-[#F1F5DC] border border-[#D9E2B3] text-[#5B6F00] font-bold'
                        : 'hover:bg-[#FAF7F2] text-[#57534E]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#5B6F00]" />
                      <span className="font-semibold text-[#1C1917]">{st.name}</span>
                      <span className="text-[10px] text-[#78716C] font-mono">{st.phone}</span>
                    </div>
                    <span className="font-serif font-normal text-xs text-[#1C1917]">
                      {st.stamps}/{maxStamps} sellos
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Member Pass & Direct Counter Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {currentStudent ? (
            <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-6 shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
              {/* Member Card Header */}
              <div className="flex items-start justify-between border-b border-[#EAE4D5] pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B6F00] font-bold">
                    Cliente Seleccionado
                  </span>
                  <h3 className="text-xl font-serif font-normal text-[#1C1917] leading-tight mt-0.5">
                    {currentStudent.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#78716C] mt-1 font-mono">
                    <Phone className="w-3 h-3 text-[#5B6F00]" />
                    <span>{currentStudent.phone}</span>
                  </div>
                </div>

                <Link
                  href={`/card/${currentStudent.token}`}
                  target="_blank"
                  className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition-colors"
                  title="Ver tarjeta digital pública"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Stamp Progress */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#57534E] font-medium">Progreso acumulado:</span>
                  <span className="font-serif font-normal text-sm text-[#1C1917]">
                    {currentStamps} de {maxStamps} sellos
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#EAE4D5] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #5B6F00 0%, #B2C248 100%)',
                    }}
                  />
                </div>
              </div>

              {/* 10-Slot Preview Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: maxStamps }).map((_, i) => {
                  const num = i + 1;
                  const isDone = num <= currentStamps;
                  return (
                    <div
                      key={num}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-[#5B6F00] text-white shadow-2xs'
                          : 'bg-[#FAF7F2] text-[#78716C] border border-dashed border-[#DDD5C3]'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : num}
                    </div>
                  );
                })}
              </div>

              {/* Counter Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleManualAddStamp}
                  className="w-full h-12 rounded-full text-white text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(91,111,0,0.25)] hover:bg-[#4D5E00]"
                  style={{
                    background: 'linear-gradient(135deg, #5B6F00 0%, #4D5E00 100%)',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#B2C248]" />
                  <span>+1 Sello en Mostrador</span>
                </button>

                {isRewardReady && (
                  <button
                    type="button"
                    onClick={handleRedeemReward}
                    className="w-full h-12 rounded-full bg-[#1C1917] hover:bg-black text-white text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Gift className="w-4 h-4 text-[#B2C248]" />
                    <span>Canjear Premio y Reiniciar Ciclo</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-8 text-center text-[#78716C]">
              <QrCode className="w-10 h-10 mx-auto text-[#A89F91] mb-3" />
              <p className="text-sm font-serif font-normal text-[#1C1917]">Sin cliente seleccionado</p>
              <p className="text-xs text-[#57534E] mt-1">
                Escanea un código QR con la cámara o busca un alumno en la lista.
              </p>
            </div>
          )}

          {/* Recent Operations Log */}
          <div className="bg-[#FFFDF9] rounded-[28px] border border-[#EAE4D5] p-5 shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <h4 className="text-xs font-serif font-normal text-[#1C1917] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#5B6F00]" />
              <span>Últimos Movimientos de Caja</span>
            </h4>

            <div className="space-y-2 text-xs">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4D5] flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[#1C1917] block">
                      {tx.studentName}
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {tx.note || 'Sello en mostrador'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#5B6F00] bg-[#F1F5DC] px-2 py-0.5 rounded-md border border-[#D9E2B3]">
                    +{tx.stampsAdded || 1} Sello
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
