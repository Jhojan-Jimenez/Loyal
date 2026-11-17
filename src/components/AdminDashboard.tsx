'use client';

import React, { useState } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { generateStudentsCSV, generateTransactionsCSV } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  Award,
  CalendarCheck,
  Download,
  Settings,
  TrendingUp,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Gift,
  ShieldCheck,
  Building2,
  Check,
  Trash2,
  UserPlus,
  QrCode,
  Printer,
  Search,
  Sparkles,
  AlertTriangle,
  X,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const { students, transactions, config, updateConfig, resetDemoData, deleteStudent, registerStudent } = useLoyal();

  const [activeTab, setActiveTab] = useState<'overview' | 'counter_qr' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studioName: config.studioName,
    tagline: config.tagline,
    totalStampsRequired: config.totalStampsRequired,
    currentRewardTitle: config.currentRewardTitle,
    currentRewardDescription: config.currentRewardDescription,
    wifiSsid: config.wifiSsid,
    wifiPassword: config.wifiPassword,
    whatsappNumber: config.whatsappNumber,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stats calculation
  const totalStudents = students.length;
  const totalClassesRecorded = students.reduce((acc, s) => acc + s.totalVisits, 0);
  const totalRewardsRedeemed = students.reduce((acc, s) => acc + s.totalCompletedCycles, 0);
  const activeStudentsWithStamps = students.filter((s) => s.stamps > 0).length;
  const retentionRate = totalStudents > 0 ? Math.round((activeStudentsWithStamps / totalStudents) * 100) : 0;

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export handlers
  const handleExportStudents = () => {
    const csvContent = generateStudentsCSV(students, config);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clientes_loyal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      ...formData,
      totalStampsRequired: Number(formData.totalStampsRequired),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteStudent = async (token: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente a "${name}" y todo su historial de sellos? Esta acción no se puede deshacer.`)) {
      setDeleteLoading(token);
      await deleteStudent(token);
      setDeleteLoading(null);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) return;

    registerStudent(newStudentName.trim(), newStudentPhone.trim(), newStudentEmail.trim() || undefined);
    setNewStudentName('');
    setNewStudentPhone('');
    setNewStudentEmail('');
    setShowAddModal(false);
  };

  // Download QR Code as PNG image
  const handleDownloadQrPng = () => {
    const svg = document.getElementById('counter-qr-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 1000, 1000);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR_Mostrador_${config.studioName.replace(/\s+/g, '_')}.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Printable Counter Poster URL
  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://loyal.jhojan.cloud/';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-[#1C1917]">
      {/* Header: Warm Dark Ink Hero with Granola Olive Accents */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#1C1917] p-6 sm:p-8 text-white shadow-xl border border-[#292524]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#292524] text-[#B2C248] border border-[#3E3832]">
              <Settings className="w-3.5 h-3.5" />
              Panel de Control Administrativo
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal mt-2 tracking-tight text-white">
              Gestión del Comercio & Clientes
            </h1>
            <p className="text-xs sm:text-sm text-[#A89F91] mt-1 font-normal">
              Administra tus miembros frecuentes, descarga el QR de mostrador y ajusta las reglas de tu programa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#5B6F00] text-white text-xs font-bold shadow-md hover:bg-[#4D5E00] active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#B2C248]" />
              <span>+ Registrar Cliente</span>
            </button>

            <button
              onClick={handleExportStudents}
              className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#292524] border border-[#3E3832] text-white/90 text-xs font-semibold hover:bg-[#3E3832] active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#A89F91]" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row: Warm Paper & Serif Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <div className="flex items-center justify-between text-[#78716C] mb-2">
            <Users className="w-5 h-5 text-[#5B6F00]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F1F5DC] text-[#5B6F00] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
              Clientes
            </span>
          </div>
          <p className="text-3xl font-serif font-normal text-[#1C1917]">{totalStudents}</p>
          <p className="text-xs text-[#78716C] mt-1">Total Registrados</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <div className="flex items-center justify-between text-[#78716C] mb-2">
            <CalendarCheck className="w-5 h-5 text-[#5B6F00]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F1F5DC] text-[#5B6F00] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
              Visitas
            </span>
          </div>
          <p className="text-3xl font-serif font-normal text-[#1C1917]">{totalClassesRecorded}</p>
          <p className="text-xs text-[#78716C] mt-1">Sellos Estampados</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <div className="flex items-center justify-between text-[#78716C] mb-2">
            <Gift className="w-5 h-5 text-[#5B6F00]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F1F5DC] text-[#5B6F00] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
              Premios
            </span>
          </div>
          <p className="text-3xl font-serif font-normal text-[#1C1917]">{totalRewardsRedeemed}</p>
          <p className="text-xs text-[#78716C] mt-1">Beneficios Canjeados</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <div className="flex items-center justify-between text-[#78716C] mb-2">
            <TrendingUp className="w-5 h-5 text-[#5B6F00]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F1F5DC] text-[#5B6F00] px-2 py-0.5 rounded-full border border-[#D9E2B3]">
              Retención
            </span>
          </div>
          <p className="text-3xl font-serif font-normal text-[#1C1917]">{retentionRate}%</p>
          <p className="text-xs text-[#78716C] mt-1">Clientes Frecuentes</p>
        </div>
      </div>

      {/* Tabs: Warm Paper Segmented Pills */}
      <div className="flex bg-[#FAF7F2] p-1.5 rounded-full border border-[#EAE4D5]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
              : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          Directorio de Clientes ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('counter_qr')}
          className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'counter_qr'
              ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
              : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          QR & Cartel de Mostrador
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
              : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          Reglas del Programa & Marca
        </button>
      </div>

      {/* Tab 1: Directory of Students */}
      {activeTab === 'overview' && (
        <div className="bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)] overflow-hidden">
          <div className="p-6 border-b border-[#EAE4D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-normal text-[#1C1917]">
                Clientes Inscritos ({filteredStudents.length})
              </h3>
              <p className="text-xs text-[#78716C]">
                Supervisa sellos, revisa tarjetas o elimina clientes del sistema
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] placeholder:text-[#A89F91] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-[#78716C] text-xs">
                No se encontraron clientes registrados con esa búsqueda.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#EAE4D5]">
                  <tr>
                    <th className="py-3 px-5">Cliente</th>
                    <th className="py-3 px-5">Contacto</th>
                    <th className="py-3 px-5">Progreso de Sellos</th>
                    <th className="py-3 px-5">Premios Canjeados</th>
                    <th className="py-3 px-5">Última Visita</th>
                    <th className="py-3 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D5]">
                  {filteredStudents.map((s) => {
                    const isReady = s.stamps >= config.totalStampsRequired;
                    return (
                      <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-[#1C1917]">{s.name}</div>
                          <span className="text-[11px] text-[#78716C] font-mono">ID: {s.token}</span>
                        </td>
                        <td className="py-4 px-5 text-[#57534E]">
                          <div className="font-mono text-xs">{s.phone}</div>
                          {s.email && <div className="text-[11px] text-[#78716C]">{s.email}</div>}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-xs ${
                              isReady
                                ? 'bg-[#5B6F00] text-white shadow-xs'
                                : 'bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3]'
                            }`}
                          >
                            {isReady ? '🎁 ' : '✦ '}
                            {s.stamps} / {config.totalStampsRequired} sellos
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-serif font-normal text-sm text-[#1C1917]">
                            {s.totalCompletedCycles} ciclo(s)
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[#78716C]">
                          {s.lastVisitAt
                            ? new Date(s.lastVisitAt).toLocaleDateString('es-CO')
                            : 'Sin visitas aún'}
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <Link
                            href={`/card/${s.token}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[#5B6F00] hover:text-[#4D5E00] font-semibold hover:underline"
                          >
                            Ver Pase <ExternalLink className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={() => handleDeleteStudent(s.token, s.name)}
                            disabled={deleteLoading === s.token}
                            className="inline-flex items-center gap-1 text-[#C26748] hover:text-[#A34F33] font-semibold p-1.5 rounded-full hover:bg-[#FBF4EE] transition-colors cursor-pointer"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Counter QR Poster */}
      {activeTab === 'counter_qr' && (
        <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-8 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE4D5]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B6F00] bg-[#F1F5DC] px-3 py-1 rounded-full border border-[#D9E2B3]">
                Material de Mostrador / Recepción
              </span>
              <h2 className="text-xl font-serif font-normal text-[#1C1917] mt-2">
                Cartel de Auto-Registro en Mostrador
              </h2>
              <p className="text-xs text-[#57534E] mt-1 max-w-xl">
                Coloca este código QR en un cartel o soporte de acrílico en tu caja. Los clientes lo escanean mientras esperan y obtienen su pase digital en 10 segundos sin que tengas que teclear nada.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadQrPng}
                className="flex items-center gap-2 h-12 px-6 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#B2C248]" />
                <span>Descargar QR (Imagen PNG)</span>
              </button>
            </div>
          </div>

          {/* Printable Preview Card */}
          <div className="max-w-md mx-auto bg-[#FAF7F2] p-8 rounded-[32px] border border-[#EAE4D5] text-center shadow-lg">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-widest block mb-2 font-mono">
              {config.studioName}
            </span>
            <h3 className="text-2xl font-serif font-normal text-[#1C1917] tracking-tight">
              ¡Gana tu recompensa exclusiva!
            </h3>
            <p className="text-xs text-[#57534E] mt-1 mb-5">
              Escanea con la cámara de tu celular y obtén tu tarjeta digital de sellos en 5 segundos.
            </p>

            <div className="p-6 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs inline-block my-2">
              <QRCodeSVG
                id="counter-qr-svg"
                value={joinUrl}
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#1C1917"
                className="mx-auto"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-[#EAE4D5] space-y-1">
              <p className="text-xs font-serif font-normal text-[#1C1917]">
                🎁 {config.currentRewardTitle}
              </p>
              <p className="text-[11px] text-[#78716C]">
                Completa tus {config.totalStampsRequired} sellos y canjea tu beneficio
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-8 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#5B6F00]" />
                <span>Configuración actualizada con éxito. Todos los clientes verán los cambios.</span>
              </div>
            )}

            <div>
              <h3 className="text-lg font-serif font-normal text-[#1C1917]">
                Ajustes del Programa de Fidelización
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Modifica la meta de visitas y las recompensas sin necesidad de tocar código
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Nombre del Comercio / Marca
                </label>
                <input
                  type="text"
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Meta de Sellos para Recompensa
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={formData.totalStampsRequired}
                  onChange={(e) => setFormData({ ...formData, totalStampsRequired: Number(e.target.value) })}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] font-bold focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                Título de la Recompensa Activa
              </label>
              <input
                type="text"
                value={formData.currentRewardTitle}
                onChange={(e) => setFormData({ ...formData, currentRewardTitle: e.target.value })}
                className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                Descripción / Condiciones del Premio
              </label>
              <textarea
                rows={3}
                value={formData.currentRewardDescription}
                onChange={(e) => setFormData({ ...formData, currentRewardDescription: e.target.value })}
                className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EAE4D5]">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Nombre Red Wi-Fi (SSID)
                </label>
                <input
                  type="text"
                  value={formData.wifiSsid}
                  onChange={(e) => setFormData({ ...formData, wifiSsid: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Contraseña del Wi-Fi
                </label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] font-mono focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 h-12 px-7 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#B2C248]" />
                <span>Guardar Cambios</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Deseas restablecer los datos de demostración a su estado inicial?')) {
                    resetDemoData();
                    alert('Datos restablecidos.');
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-[#C26748] hover:text-[#A34F33] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Datos Iniciales</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add New Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EAE4D5]">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D5]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#F1F5DC] text-[#5B6F00] flex items-center justify-center border border-[#D9E2B3]">
                  <UserPlus className="w-5 h-5 text-[#5B6F00]" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-normal text-[#1C1917]">Inscribir Nuevo Alumno</h3>
                  <p className="text-xs text-[#78716C]">Genera su pase digital de inmediato</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Gómez"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                  WhatsApp / Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +57 310 123 4567"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] font-mono focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="Ej: laura@gmail.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#5B6F00] text-white text-xs font-bold shadow-md hover:bg-[#4D5E00] active:scale-95 transition-all cursor-pointer"
                >
                  Crear Tarjeta Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
