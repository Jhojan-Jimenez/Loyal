'use client';

import React, { useState } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { generateStudentsCSV, generateTransactionsCSV } from '@/lib/store';
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
} from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const { students, transactions, config, updateConfig, resetDemoData } = useLoyal();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
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
    link.setAttribute('download', `clientes_loyal_${new Date().toISOString().split('T')[0]}.csv`);
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
    link.setAttribute('download', `visitas_loyal_${new Date().toISOString().split('T')[0]}.csv`);
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
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-6 sm:p-8 text-white shadow-xl border border-neutral-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
              <Settings className="w-3.5 h-3.5" />
              Panel de Control Administrativo
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">Gestión del Comercio & Métricas</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Controla las reglas de fidelización, exporta tu base de clientes y audita visitas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStudents}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold shadow-md hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-950" />
              <span>Exportar Clientes (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <Users className="w-5 h-5 text-neutral-900" />
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
              Comunidad
            </span>
          </div>
          <p className="text-2xl font-black text-neutral-950">{totalStudents}</p>
          <p className="text-xs text-neutral-500 mt-1">Clientes Registrados</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <CalendarCheck className="w-5 h-5 text-neutral-900" />
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
              Visitas
            </span>
          </div>
          <p className="text-2xl font-black text-neutral-950">{totalClassesRecorded}</p>
          <p className="text-xs text-neutral-500 mt-1">Sellos Estampados</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <Gift className="w-5 h-5 text-neutral-900" />
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
              Premios
            </span>
          </div>
          <p className="text-2xl font-black text-neutral-950">{totalRewardsRedeemed}</p>
          <p className="text-xs text-neutral-500 mt-1">Beneficios Canjeados</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <TrendingUp className="w-5 h-5 text-neutral-900" />
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
              Retención
            </span>
          </div>
          <p className="text-2xl font-black text-neutral-950">{retentionRate}%</p>
          <p className="text-xs text-neutral-500 mt-1">Clientes Frecuentes Activos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Directorio de Clientes ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Reglas del Programa & Comercio
        </button>
      </div>

      {/* Tab: Directory of Students */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-950">Clientes Inscritos y Balance de Sellos</h3>
            <span className="text-xs text-neutral-500">Mostrando {students.length} miembros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-700 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Progreso de Sellos</th>
                  <th className="py-3 px-4">Premios</th>
                  <th className="py-3 px-4">Última Visita</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {students.map((s) => {
                  const isReady = s.stamps >= config.totalStampsRequired;
                  return (
                    <tr key={s.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-950">{s.name}</div>
                        <span className="text-[11px] text-neutral-400 font-mono">ID: {s.token}</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">
                        <div>{s.phone}</div>
                        {s.email && <div className="text-[11px] text-neutral-400">{s.email}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-xs ${
                            isReady
                              ? 'bg-neutral-950 text-white'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {isReady ? '🎁 ' : '✦ '}
                          {s.stamps} / {config.totalStampsRequired} sellos
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-900">{s.totalCompletedCycles} canjeados</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600">
                        {s.lastVisitAt
                          ? new Date(s.lastVisitAt).toLocaleDateString('es-CO')
                          : 'Sin visitas aún'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/card/${s.token}`}
                          className="inline-flex items-center gap-1 text-neutral-950 hover:underline font-semibold"
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
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
          <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
            {saveSuccess && (
              <div className="p-4 rounded-xl bg-neutral-950 text-white text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Configuración actualizada con éxito. Todos los clientes verán los cambios.</span>
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-neutral-950">Ajustes del Programa de Fidelización</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Modifica la meta de visitas y las recompensas sin necesidad de tocar código
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Nombre del Comercio / Marca</label>
                <input
                  type="text"
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 focus:outline-hidden focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Meta de Sellos para Recompensa
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={formData.totalStampsRequired}
                  onChange={(e) => setFormData({ ...formData, totalStampsRequired: Number(e.target.value) })}
                  className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 font-bold focus:outline-hidden focus:border-neutral-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Título de la Recompensa Activa
              </label>
              <input
                type="text"
                value={formData.currentRewardTitle}
                onChange={(e) => setFormData({ ...formData, currentRewardTitle: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 focus:outline-hidden focus:border-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Descripción / Condiciones del Premio
              </label>
              <textarea
                rows={3}
                value={formData.currentRewardDescription}
                onChange={(e) => setFormData({ ...formData, currentRewardDescription: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 focus:outline-hidden focus:border-neutral-950"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Nombre Red Wi-Fi (SSID)</label>
                <input
                  type="text"
                  value={formData.wifiSsid}
                  onChange={(e) => setFormData({ ...formData, wifiSsid: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 focus:outline-hidden focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Contraseña del Wi-Fi</label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 font-mono focus:outline-hidden focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
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
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
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
