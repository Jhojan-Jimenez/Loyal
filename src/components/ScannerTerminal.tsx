'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { LotusIcon, MandalaBackground } from './MandalaBackground';
import confetti from 'canvas-confetti';
import {
  Camera,
  Search,
  Sparkles,
  Gift,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  History,
  QrCode,
  Volume2,
} from 'lucide-react';

export function ScannerTerminal() {
  const { students, config, getStudentByToken, addStamp, redeemReward, transactions, refreshFromServer } = useLoyal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>('camila-restrepo-yoga');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const scannerContainerId = 'qr-reader-container';

  const currentStudent = getStudentByToken(selectedToken);
  const maxStamps = config.totalStampsRequired;
  const isRewardReady = currentStudent ? currentStudent.stamps >= maxStamps : false;

  // Filter students for manual search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Play audio chime if available
  const playChime = (success: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (success) {
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
          osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
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

  // Launch celebratory confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#c026d3', '#db2777', '#f59e0b', '#8b5cf6'],
    });
  };

  // Initialize html5-qrcode camera scanner
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          // Scanned successfully!
          const cleanToken = decodedText.trim().replace(/^https?:\/\/[^\/]+\/card\//, '');
          setSelectedToken(cleanToken);
          // If not in local list, refresh from server
          if (!getStudentByToken(cleanToken)) {
            await refreshFromServer();
          }
          setMessage({ type: 'info', text: `¡Código detectado! Alumno identificado.` });
          playChime(true);
        },
        () => {
          // Frame error (ignore scanning frames)
        }
      );
    } catch (err: any) {
      console.warn('Camera failed:', err);
      setCameraError('No se pudo acceder a la cámara o no hay permisos. Usa el selector o búsqueda manual.');
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
    const res = addStamp(currentStudent.token, 'Asistencia registrada en recepción', 'Recepción Principal');
    if (res.success) {
      playChime(true);
      if (res.rewardUnlocked) {
        triggerCelebration();
        setMessage({
          type: 'success',
          text: `🎉 ¡Felicitaciones! ${currentStudent.name} acaba de completar sus ${maxStamps} clases. Recompensa desbloqueada.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: `✅ Sello registrado para ${currentStudent.name}. Ahora tiene ${res.student?.stamps}/${maxStamps} clases.`,
        });
      }
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'No se pudo agregar sello' });
    }
  };

  const handleRedeem = () => {
    if (!currentStudent) return;
    const res = redeemReward(currentStudent.token, 'Recepción Principal');
    if (res.success) {
      playChime(true);
      triggerCelebration();
      setMessage({
        type: 'success',
        text: `🎁 ¡Recompensa canjeada con éxito! La tarjeta de ${currentStudent.name} se reinició para su próximo ciclo.`,
      });
    } else {
      playChime(false);
      setMessage({ type: 'error', text: res.error || 'Error al canjear' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-fuchsia-950 to-purple-950 p-6 text-white shadow-xl">
        <MandalaBackground className="right-[-40px] top-[-40px] w-80 h-80 text-purple-300" opacity="opacity-15" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/15">
              <QrCode className="w-3.5 h-3.5" />
              Terminal de Punto de Venta (POS)
            </span>
            <h1 className="text-2xl font-bold mt-2 tracking-tight">Escáner de Recepción</h1>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Registra asistencias y canjea talleres para los alumnos en segundos
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Activar Cámara</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Detener Cámara</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Camera Live View Box (If Active) */}
      {isCameraActive && (
        <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xl text-center">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600 animate-pulse" />
              Cámara en Vivo: Apunta al QR del Alumno
            </span>
            <button onClick={stopCamera} className="text-xs font-medium text-purple-600 hover:text-purple-950">
              Cerrar Cámara
            </button>
          </div>
          <div id={scannerContainerId} className="w-full max-w-sm mx-auto my-3 overflow-hidden rounded-2xl" />
        </div>
      )}

      {cameraError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Grid: Left Scanner Simulator / Search - Right Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fast Search & Demo Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-lg shadow-purple-900/5">
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Búsqueda Rápida de Alumno</span>
              <Search className="w-3.5 h-3.5 text-purple-500" />
            </h3>

            {/* Search Input */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            </div>

            {/* Student List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.token === selectedToken;
                const isFull = s.stamps >= config.totalStampsRequired;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedToken(s.token);
                      setMessage(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-purple-100/80 border-purple-400 shadow-xs'
                        : 'bg-white hover:bg-purple-50/50 border-purple-100/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-purple-950 truncate">{s.name}</span>
                        {isFull && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                            ¡Premio!
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-purple-600 block">{s.phone}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isFull
                            ? 'bg-amber-500 text-white'
                            : 'bg-purple-200 text-purple-900'
                        }`}
                      >
                        {s.stamps}/{config.totalStampsRequired}
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="text-center py-6 text-xs text-purple-400">
                  No se encontraron alumnos con esa búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Card Action Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentStudent ? (
            <div className="bg-white rounded-3xl p-6 border border-purple-200/90 shadow-xl shadow-purple-900/10 relative overflow-hidden">
              <MandalaBackground className="right-[-50px] bottom-[-50px] w-64 h-64" opacity="opacity-15" />

              {/* Status Message Alert */}
              {message && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium mb-4 flex items-center gap-2 border animate-in fade-in ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : message.type === 'error'
                      ? 'bg-rose-50 text-rose-950 border-rose-200'
                      : 'bg-purple-50 text-purple-950 border-purple-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* Active Student Header */}
              <div className="flex items-start justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-purple-950">{currentStudent.name}</h2>
                    <p className="text-xs text-purple-600">{currentStudent.phone} · ID: {currentStudent.token}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-purple-500 font-semibold uppercase block">
                    Total Clases de por vida
                  </span>
                  <span className="text-sm font-bold text-purple-950">
                    {currentStudent.totalVisits} visitas
                  </span>
                </div>
              </div>

              {/* Punch Card Progress in Reception */}
              <div className="my-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-950">
                    Progreso del Ciclo Actual
                  </span>
                  <span className="text-xs font-bold text-purple-700">
                    {currentStudent.stamps} de {maxStamps} sellos
                  </span>
                </div>

                {/* Grid Visualizer */}
                <div className="grid grid-cols-5 gap-2 my-3">
                  {Array.from({ length: maxStamps }, (_, i) => i + 1).map((num) => {
                    const isDone = num <= currentStudent.stamps;
                    return (
                      <div
                        key={num}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border-2 border-dashed border-purple-200 text-purple-300'
                        }`}
                      >
                        {isDone ? <LotusIcon className="w-4 h-4 text-white" /> : num}
                      </div>
                    );
                  })}
                </div>

                {isRewardReady ? (
                  <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/20 to-fuchsia-500/20 border border-amber-300 rounded-xl text-amber-950 text-xs font-semibold flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>¡Tarjeta completa! El alumno califica para reclamar su taller o mat de yoga.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-purple-700 mt-2">
                    Faltan {maxStamps - currentStudent.stamps} clases para completar la meta.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {!isRewardReady ? (
                  <button
                    onClick={handleAddStamp}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <LotusIcon className="w-5 h-5 text-white" />
                    <span>Registrar Asistencia (+1 Clase)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRedeem}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Gift className="w-5 h-5 text-white" />
                    <span>Canjear Recompensa (Taller / Mat)</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] text-purple-600 pt-2 px-1">
                  <span>Operador: Recepción Principal</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-purple-400" />
                    Sonido y vibración activos
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-purple-100 text-center text-purple-400">
              Selecciona o escanea un alumno a la izquierda para empezar a sellar.
            </div>
          )}

          {/* Shift Transaction Audit Log */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              Últimas Asistencias Registradas en Este Turno
            </h4>
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      {tx.type === 'ADD_STAMP' ? '+1' : '🎁'}
                    </div>
                    <div>
                      <span className="font-semibold text-purple-950">{tx.studentName}</span>
                      <span className="text-[11px] text-purple-500 block">{tx.note}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
