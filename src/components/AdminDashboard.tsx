'use client';

import React, { useState } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { generateStudentsCSV, generateTransactionsCSV } from '@/lib/store';
import { MandalaBackground } from './MandalaBackground';
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
  MessageSquare,
  Gift,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const { students, transactions, config, updateConfig, resetDemoData } = useLoyal();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'students'>('overview');
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

  // Export handlers
  const handleExportStudents = () => {
    const csvContent = generateStudentsCSV(students, config);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alumnos_samyama_yoga_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTransactions = () => {
    const csvContent = generateTransactionsCSV(transactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asistencias_samyama_yoga_${new Date().toISOString().split('T')[0]}.csv`);
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-fuchsia-950 p-8 text-white shadow-xl">
        <MandalaBackground className="right-[-40px] top-[-40px] w-80 h-80 text-purple-300" opacity="opacity-15" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/15">
              <Settings className="w-3.5 h-3.5" />
              Panel de Control del Dueño
            </span>
            <h1 className="text-3xl font-extrabold mt-3 tracking-tight">Gestión del Estudio & Métricas</h1>
            <p className="text-sm text-purple-200/80 mt-1">
              Controla las reglas de fidelización, exporta tu base de datos y supervisa asistencias
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStudents}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-950 text-xs font-bold shadow-lg hover:bg-purple-50 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Exportar Alumnos (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loopy Loyalty Comparison Callout */}
      <div className="bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-50 rounded-3xl p-5 border border-purple-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
              Tus Datos Te Pertenecen al 100%
            </h4>
            <p className="text-xs text-purple-800/80 mt-0.5">
              A diferencia de Loopy Loyalty (que bloquea la exportación en planes de $25 y $69 USD), aquí puedes
              descargar tus datos en Excel/CSV en cualquier momento sin pagar ningún extra.
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportStudents}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Alumnos CSV
          </button>
          <button
            onClick={handleExportTransactions}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white text-purple-800 border border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Asistencias CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
              Comunidad
            </span>
          </div>
          <p className="text-2xl font-extrabold text-purple-950">{totalStudents}</p>
          <p className="text-xs text-purple-600 mt-1">Alumnos Registrados</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-fuchsia-600 mb-2">
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded-md">
              Asistencias
            </span>
          </div>
          <p className="text-2xl font-extrabold text-purple-950">{totalClassesRecorded}</p>
          <p className="text-xs text-purple-600 mt-1">Clases Impartidas</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
              Premios
            </span>
          </div>
          <p className="text-2xl font-extrabold text-purple-950">{totalRewardsRedeemed}</p>
          <p className="text-xs text-purple-600 mt-1">Talleres & Mats Canjeados</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
              Retención
            </span>
          </div>
          <p className="text-2xl font-extrabold text-purple-950">{retentionRate}%</p>
          <p className="text-xs text-purple-600 mt-1">Alumnos Activos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-purple-100/70 p-1 rounded-2xl border border-purple-200/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-purple-900/60 hover:text-purple-950'
          }`}
        >
          Directorio de Alumnos ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-purple-900/60 hover:text-purple-950'
          }`}
        >
          Reglas del Programa & Estudio
        </button>
      </div>

      {/* Tab: Directory of Students */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-md shadow-purple-900/5 overflow-hidden">
          <div className="p-5 border-b border-purple-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-950">Alumnos Inscritos y Balance de Clases</h3>
            <span className="text-xs text-purple-600">Mostrando {students.length} miembros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/70 text-purple-900/80 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Alumno</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Progreso Actual</th>
                  <th className="py-3 px-4">Premios</th>
                  <th className="py-3 px-4">Última Visita</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {students.map((s) => {
                  const isReady = s.stamps >= config.totalStampsRequired;
                  return (
                    <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-purple-950">{s.name}</div>
                        <span className="text-[11px] text-purple-500 font-mono">ID: {s.token}</span>
                      </td>
                      <td className="py-3.5 px-4 text-purple-800">
                        <div>{s.phone}</div>
                        {s.email && <div className="text-[11px] text-purple-500">{s.email}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-xs ${
                            isReady
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-purple-100 text-purple-900'
                          }`}
                        >
                          {isReady ? '🎁 ' : '🪷 '}
                          {s.stamps} / {config.totalStampsRequired} clases
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-purple-900">{s.totalCompletedCycles} canjeados</span>
                      </td>
                      <td className="py-3.5 px-4 text-purple-700">
                        {s.lastVisitAt
                          ? new Date(s.lastVisitAt).toLocaleDateString('es-CO')
                          : 'Sin visitas aún'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/card/${s.token}`}
                          className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-950 font-semibold"
                        >
                          Ver Tarjeta <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-md shadow-purple-900/5">
          <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Configuración actualizada con éxito. Todos los alumnos verán los cambios.</span>
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-purple-950">Ajustes del Programa de Fidelización</h3>
              <p className="text-xs text-purple-600 mt-0.5">
                Modifica la meta de clases y las recompensas sin necesidad de tocar código
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">Nombre del Estudio</label>
                <input
                  type="text"
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  Meta de Clases para Recompensa
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={formData.totalStampsRequired}
                  onChange={(e) => setFormData({ ...formData, totalStampsRequired: Number(e.target.value) })}
                  className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">
                Título de la Recompensa Activa
              </label>
              <input
                type="text"
                value={formData.currentRewardTitle}
                onChange={(e) => setFormData({ ...formData, currentRewardTitle: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">
                Descripción / Condiciones del Premio
              </label>
              <textarea
                rows={3}
                value={formData.currentRewardDescription}
                onChange={(e) => setFormData({ ...formData, currentRewardDescription: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-100">
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">Nombre Red Wi-Fi (SSID)</label>
                <input
                  type="text"
                  value={formData.wifiSsid}
                  onChange={(e) => setFormData({ ...formData, wifiSsid: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">Contraseña del Wi-Fi</label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/25 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
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
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Datos Demo</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
