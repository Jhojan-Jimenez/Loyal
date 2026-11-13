'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLoyal } from '@/context/LoyalContext';
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
  Check,
  ShieldCheck,
  Store,
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

  // Launch celebratory confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#09090b', '#27272a', '#71717a', '#10b981', '#ffffff'],
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
          const cleanToken = decodedText.trim().replace(/^https?:\/\/[^\/]+\/card\//, '');
          setSelectedToken(cleanToken);
          if (!getStudentByToken(cleanToken)) {
            await refreshFromServer();
          }
          setMessage({ type: 'info', text: `¡Código detectado! Cliente identificado.` });
          playChime(true);
        },
        () => {}
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
    const res = addStamp(currentStudent.token, 'Visita registrada en caja / mostrador', 'Caja Principal');
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
    const res = redeemReward(currentStudent.token, 'Caja Principal');
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
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-6 sm:p-8 text-white shadow-xl border border-neutral-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
              <QrCode className="w-3.5 h-3.5" />
              Terminal de Mostrador / Caja (POS)
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">Escáner de Recepción & Caja</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Escanea códigos QR de clientes, estampa sellos en 1 segundo y redime beneficios
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-neutral-950 text-xs font-bold shadow-md hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-neutral-950" />
                <span>Activar Cámara</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 transition-all cursor-pointer"
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
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xl text-center">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="text-xs font-bold text-neutral-950 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-neutral-950 animate-pulse" />
              Cámara en Vivo: Apunta al QR del Cliente
            </span>
            <button onClick={stopCamera} className="text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer">
              Cerrar Cámara
            </button>
          </div>
          <div id={scannerContainerId} className="w-full max-w-sm mx-auto my-3 overflow-hidden rounded-2xl" />
        </div>
      )}

      {cameraError && (
        <div className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-2xl p-4 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Grid: Left Search - Right Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fast Search (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm">
            <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Búsqueda Rápida de Clientes</span>
              <Search className="w-3.5 h-3.5 text-neutral-500" />
            </h3>

            {/* Search Input */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 focus:outline-hidden focus:border-neutral-950 focus:bg-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
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
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-950'}`}>
                          {s.name}
                        </span>
                        {isFull && (
                          <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded-md">
                            ¡Premio!
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] block ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {s.phone}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-neutral-800 text-white'
                            : isFull
                            ? 'bg-neutral-950 text-white'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {s.stamps}/{config.totalStampsRequired}
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="text-center py-6 text-xs text-neutral-400">
                  No se encontraron clientes con esa búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Card Action Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentStudent ? (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xl relative overflow-hidden">
              {/* Status Message Alert */}
              {message && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium mb-4 flex items-center gap-2 border animate-in fade-in ${
                    message.type === 'success'
                      ? 'bg-neutral-950 text-white border-neutral-900'
                      : message.type === 'error'
                      ? 'bg-rose-50 text-rose-950 border-rose-200'
                      : 'bg-neutral-100 text-neutral-900 border-neutral-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-white" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* Active Customer Header */}
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-950 flex items-center justify-center text-white shadow-xs">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-950">{currentStudent.name}</h2>
                    <p className="text-xs text-neutral-500">{currentStudent.phone} · ID: {currentStudent.token}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase block">
                    Visitas Históricas
                  </span>
                  <span className="text-sm font-bold text-neutral-950">
                    {currentStudent.totalVisits} visitas
                  </span>
                </div>
              </div>

              {/* Punch Card Progress in Reception */}
              <div className="my-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-950">
                    Progreso del Ciclo Actual
                  </span>
                  <span className="text-xs font-bold text-neutral-950">
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
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'bg-white border border-dashed border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : num}
                      </div>
                    );
                  })}
                </div>

                {isRewardReady ? (
                  <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-semibold flex items-center gap-2">
                    <Gift className="w-4 h-4 text-white shrink-0" />
                    <span>¡Tarjeta completa! El cliente califica para reclamar su recompensa.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 mt-2">
                    Faltan {maxStamps - currentStudent.stamps} visitas para completar la meta.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {!isRewardReady ? (
                  <button
                    onClick={handleAddStamp}
                    className="w-full py-4 rounded-xl bg-neutral-950 text-white text-sm font-bold shadow-md hover:bg-black active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>Registrar Visita (+1 Sello)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRedeem}
                    className="w-full py-4 rounded-xl bg-neutral-950 text-white text-sm font-bold shadow-md hover:bg-black active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Canjear Recompensa & Reiniciar Ciclo</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 px-1">
                  <span>Operador: Caja Principal</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-neutral-400" />
                    Sonido y vibración activos
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-neutral-200 text-center text-neutral-400">
              Selecciona o escanea un cliente a la izquierda para empezar a sellar.
            </div>
          )}

          {/* Shift Transaction Audit Log */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
            <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-700" />
              Últimas Visitas Registradas en Este Turno
            </h4>
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-[11px]">
                      {tx.type === 'ADD_STAMP' ? '+1' : '🎁'}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-950">{tx.studentName}</span>
                      <span className="text-[11px] text-neutral-500 block">{tx.note}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
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
