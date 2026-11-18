'use client';

import React, { useState, useEffect } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { Student, StudioConfig, StampTransaction } from '@/lib/types';
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
  LogOut,
  Copy,
  Palette,
  Smartphone,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { isLightHexColor } from '@/lib/color-utils';

export function AdminDashboard({ tenantSlug }: { tenantSlug?: string } = {}) {
  const {
    students: globalStudents,
    transactions: globalTransactions,
    config: globalConfig,
    updateConfig,
    resetDemoData,
    deleteStudent,
    registerStudent,
    refreshFromServer,
  } = useLoyal();

  const [activeTab, setActiveTab] = useState<'overview' | 'counter_qr' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Tenant-scoped states
  const [tenantInfo, setTenantInfo] = useState<{
    id: string;
    slug: string;
    name: string;
    category?: string;
    ownerName?: string;
    ownerPhone?: string;
    cashierPin?: string;
  } | null>(null);
  const [isSuperAdminViewing, setIsSuperAdminViewing] = useState(false);
  const [tenantConfig, setTenantConfig] = useState<StudioConfig>(globalConfig);
  const [tenantStudents, setTenantStudents] = useState<Student[]>([]);
  const [tenantTransactions, setTenantTransactions] = useState<StampTransaction[]>([]);
  const [savingConfig, setSavingConfig] = useState(false);

  const [formData, setFormData] = useState({
    studioName: globalConfig.studioName,
    tagline: globalConfig.tagline,
    totalStampsRequired: globalConfig.totalStampsRequired,
    currentRewardTitle: globalConfig.currentRewardTitle,
    currentRewardDescription: globalConfig.currentRewardDescription,
    wifiSsid: globalConfig.wifiSsid,
    wifiPassword: globalConfig.wifiPassword,
    whatsappNumber: globalConfig.whatsappNumber,
    walletBgMode: (globalConfig.walletBgMode || 'color') as 'color' | 'image',
    walletBgColor: globalConfig.walletBgColor || '#FAF7F2',
    walletBgImageUrl: globalConfig.walletBgImageUrl || '',
    walletProgramName: globalConfig.walletProgramName || 'Pase Digital de Fidelización',
    walletLogoUrl: globalConfig.walletLogoUrl || '',
    walletHeroImageUrl: globalConfig.walletHeroImageUrl || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleImageUpload = async (
    file: File,
    field: 'walletBgImageUrl' | 'walletLogoUrl' | 'walletHeroImageUrl'
  ) => {
    setUploadingField(field);
    try {
      const body = new FormData();
      body.append('file', file);
      if (tenantSlug) body.append('tenantSlug', tenantSlug);

      const res = await fetch('/api/uploads', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'No se pudo subir la imagen');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: data.url,
        ...(field === 'walletBgImageUrl' ? { walletBgMode: 'image' as const } : {}),
      }));
    } catch {
      alert('Error de conexión al subir imagen');
    } finally {
      setUploadingField(null);
    }
  };

  // Pull tenant-specific data if tenantSlug is provided
  useEffect(() => {
    async function loadTenantData() {
      if (!tenantSlug) return;
      try {
        const res = await fetch(`/api/db?tenantSlug=${encodeURIComponent(tenantSlug)}`);
        const data = await res.json();
        if (data.success) {
          if (data.tenant) {
            setTenantInfo(data.tenant);
          }
          if (data.config) {
            setTenantConfig(data.config);
            setFormData({
              studioName: data.config.studioName || data.tenant?.name || 'Mi Comercio',
              tagline: data.config.tagline || 'Programa de Fidelidad',
              totalStampsRequired: data.config.totalStampsRequired || 10,
              currentRewardTitle: data.config.currentRewardTitle || 'Recompensa Especial',
              currentRewardDescription: data.config.currentRewardDescription || '',
              wifiSsid: data.config.wifiSsid || '',
              wifiPassword: data.config.wifiPassword || '',
              whatsappNumber: data.config.whatsappNumber || '',
              walletBgMode: data.config.walletBgMode || (data.config.walletBgImageUrl ? 'image' : 'color'),
              walletBgColor: data.config.walletBgColor || '#FAF7F2',
              walletBgImageUrl: data.config.walletBgImageUrl || '',
              walletProgramName: data.config.walletProgramName || 'Pase Digital de Fidelización',
              walletLogoUrl: data.config.walletLogoUrl || '',
              walletHeroImageUrl: data.config.walletHeroImageUrl || '',
            });
          }
          if (Array.isArray(data.students)) {
            setTenantStudents(data.students);
          }
          if (Array.isArray(data.transactions)) {
            setTenantTransactions(data.transactions);
          }
        }
      } catch (err) {
        console.warn('Error fetching scoped tenant data:', err);
      }
    }

    loadTenantData();

    // Check if current session is platform superadmin
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.session?.isPlatformSuperAdmin) {
          setIsSuperAdminViewing(true);
        }
      })
      .catch(() => {});
  }, [tenantSlug]);

  // Resolve active data source (scoped vs global)
  const students = tenantSlug ? tenantStudents : globalStudents;
  const transactions = tenantSlug ? tenantTransactions : globalTransactions;
  const config = tenantSlug ? tenantConfig : globalConfig;

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
    link.setAttribute('download', `clientes_${tenantSlug || 'loyal'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const updatedConfig = {
        ...formData,
        totalStampsRequired: Number(formData.totalStampsRequired),
      };

      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          config: updatedConfig,
        }),
      });

      const data = await res.json();
      if (data.success) {
        updateConfig(updatedConfig);
        if (tenantSlug) {
          setTenantConfig((prev: StudioConfig) => ({ ...prev, ...updatedConfig }));
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert(data.error || 'No se pudo guardar la configuración');
      }
    } catch {
      alert('Error de conexión al guardar configuración');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDeleteStudent = async (token: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente a "${name}" y todo su historial de sellos? Esta acción no se puede deshacer.`)) {
      setDeleteLoading(token);
      await deleteStudent(token);
      if (tenantSlug) {
        setTenantStudents((prev) => prev.filter((s) => s.token.toLowerCase() !== token.toLowerCase()));
      }
      setDeleteLoading(null);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) return;

    const newStudent = registerStudent(
      newStudentName.trim(),
      newStudentPhone.trim(),
      newStudentEmail.trim() || undefined,
      tenantSlug
    );

    if (tenantSlug) {
      setTenantStudents((prev) => [newStudent, ...prev]);
    }

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

  // Printable Counter Poster URL (Direct client registration for this specific tenant)
  const [copiedLink, setCopiedLink] = useState(false);

  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${tenantSlug ? `${tenantSlug}/join` : ''}`
      : `https://loyal.jhojan.cloud/${tenantSlug ? `${tenantSlug}/join` : ''}`;

  const handleCopyJoinLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-[#1C1917]">
      {/* Header: Warm Dark Ink Hero with Granola Olive Accents */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#1C1917] p-6 sm:p-8 text-white shadow-xl border border-[#292524]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#292524] text-[#B2C248] border border-[#3E3832]">
                <Settings className="w-3.5 h-3.5" />
                Panel de Control de Comercio
              </span>
              {tenantSlug && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3E3832] text-[#B2C248] border border-[#524B43]">
                  /{tenantSlug}
                </span>
              )}
              {isSuperAdminViewing && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B45309]/30 text-[#FDE68A] border border-[#B45309]">
                  Modo SuperAdmin
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal mt-2 tracking-tight text-white">
              {tenantInfo?.name || config.studioName || 'Gestión del Comercio & Clientes'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A89F91] mt-1 font-normal">
              Administra tus miembros frecuentes, descarga el QR de mostrador y ajusta las reglas de tu programa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isSuperAdminViewing && (
              <Link
                href="/superadmin"
                className="flex items-center gap-1.5 h-11 px-4 rounded-full bg-[#292524] border border-[#3E3832] text-xs font-semibold text-[#B2C248] hover:bg-[#3E3832] transition-all"
              >
                <span>← SuperAdmin</span>
              </Link>
            )}

            <Link
              href={`/${tenantSlug || 'demo'}/scanner`}
              target="_blank"
              className="flex items-center gap-1.5 h-11 px-4 rounded-full bg-[#292524] border border-[#3E3832] text-xs font-semibold text-white/90 hover:bg-[#3E3832] transition-all"
              title="Abrir terminal de escaneo de mostrador para cajeros"
            >
              <QrCode className="w-4 h-4 text-[#B2C248]" />
              <span className="hidden sm:inline">Escáner Mostrador</span>
              <ExternalLink className="w-3 h-3 text-[#A89F91]" />
            </Link>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#5B6F00] text-white text-xs font-bold shadow-md hover:bg-[#4D5E00] active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#B2C248]" />
              <span>+ Registrar Cliente</span>
            </button>

            <button
              onClick={handleExportStudents}
              className="flex items-center gap-2 h-11 px-4 rounded-full bg-[#292524] border border-[#3E3832] text-white/90 text-xs font-semibold hover:bg-[#3E3832] active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#A89F91]" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 h-11 px-4 rounded-full bg-[#292524] border border-[#3E3832] text-xs font-semibold text-[#F5C7C0] hover:bg-[#3E3832] hover:text-[#C2410C] active:scale-95 transition-all cursor-pointer"
              title="Cerrar Sesión de Comercio"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
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
                Cartel y Código QR de Auto-Registro
              </h2>
              <p className="text-xs text-[#57534E] mt-1 max-w-xl">
                Tus clientes escanean este QR en caja o en sus mesas con la cámara del celular. Los dirige directamente a la página de registro de tu negocio para crear su usuario y añadir su tarjeta de sellos a Google Wallet.
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

          {/* Quick Link bar */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE4D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider shrink-0 font-mono">
                Enlace directo:
              </span>
              <code className="text-xs text-[#1C1917] font-mono bg-white px-3 py-1.5 rounded-lg border border-[#EAE4D5] truncate select-all">
                {joinUrl}
              </code>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyJoinLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] text-[#1C1917] border border-[#EAE4D5] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5B6F00]" />
                    <span className="text-[#5B6F00]">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] text-[#1C1917] border border-[#EAE4D5] text-xs font-semibold shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                <span>Probar Enlace</span>
              </a>
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
          <form onSubmit={handleSaveConfig} className="space-y-8">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#5B6F00]" />
                <span>Configuración actualizada con éxito. Tu tarjeta en Google Wallet y página de registro ya reflejan los cambios.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Program & Wallet Styling Controls */}
              <div className="lg:col-span-7 space-y-6">
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
                    rows={2}
                    value={formData.currentRewardDescription}
                    onChange={(e) => setFormData({ ...formData, currentRewardDescription: e.target.value })}
                    className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                  />
                </div>

                {/* Google Wallet Styling Section */}
                <div className="pt-6 border-t border-[#EAE4D5] space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3] flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-normal text-[#1C1917]">
                        Estilización de Tarjeta &amp; Google Wallet
                      </h4>
                      <p className="text-[11px] text-[#78716C]">
                        Plantilla base estilo Granola. Elige color sólido o sube una imagen de fondo personalizada.
                      </p>
                    </div>
                  </div>

                  {/* Background Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                      Estilo de Fondo
                    </label>
                    <div className="inline-flex p-1 bg-[#FAF7F2] rounded-2xl border border-[#EAE4D5] gap-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, walletBgMode: 'color' })}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.walletBgMode === 'color'
                            ? 'bg-white text-[#1C1917] shadow-xs border border-[#EAE4D5]'
                            : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        <Palette className="w-3.5 h-3.5 text-[#5B6F00]" />
                        <span>Color Sólido</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, walletBgMode: 'image' })}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.walletBgMode === 'image'
                            ? 'bg-white text-[#1C1917] shadow-xs border border-[#EAE4D5]'
                            : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#5B6F00]" />
                        <span>Imagen de Fondo</span>
                      </button>
                    </div>
                  </div>

                  {/* Color Picker & Granola Presets */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                      {formData.walletBgMode === 'image'
                        ? 'Color Base de Respaldo (Google Wallet)'
                        : 'Color de Fondo de la Tarjeta'}
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {[
                        { name: 'Granola Cream', hex: '#FAF7F2' },
                        { name: 'Granola Olive', hex: '#5B6F00' },
                        { name: 'Sage Leaf', hex: '#E5EACD' },
                        { name: 'Warm Ink', hex: '#1C1917' },
                        { name: 'Espresso', hex: '#3F2E26' },
                        { name: 'Terracotta', hex: '#9A3412' },
                      ].map((swatch) => (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => setFormData({ ...formData, walletBgColor: swatch.hex })}
                          title={swatch.name}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            formData.walletBgColor?.toLowerCase() === swatch.hex.toLowerCase()
                              ? 'border-[#5B6F00] scale-110 ring-2 ring-[#5B6F00]/30'
                              : 'border-[#EAE4D5] hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}

                      <div className="flex items-center gap-2 ml-1 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#EAE4D5]">
                        <input
                          type="color"
                          value={formData.walletBgColor}
                          onChange={(e) => setFormData({ ...formData, walletBgColor: e.target.value })}
                          className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={formData.walletBgColor}
                          onChange={(e) => setFormData({ ...formData, walletBgColor: e.target.value })}
                          placeholder="#FAF7F2"
                          className="w-18 text-xs font-mono text-[#1C1917] bg-transparent focus:outline-hidden uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Background Image Upload / URL (when in Image Mode) */}
                  {formData.walletBgMode === 'image' && (
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                          Imagen de Fondo de la Tarjeta
                        </label>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-[11px] font-bold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#B2C248]" />
                          <span>
                            {uploadingField === 'walletBgImageUrl' ? 'Subiendo...' : 'Subir Imagen'}
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            disabled={uploadingField === 'walletBgImageUrl'}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'walletBgImageUrl');
                            }}
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        value={formData.walletBgImageUrl}
                        onChange={(e) => setFormData({ ...formData, walletBgImageUrl: e.target.value })}
                        placeholder="https://... o sube una imagen PNG/JPG/WebP"
                        className="w-full text-xs p-3 rounded-2xl bg-white border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:border-[#5B6F00] transition-colors"
                      />
                      <p className="text-[11px] text-[#78716C]">
                        En la tarjeta web se muestra como fondo completo con contraste automático; en Google Wallet se integra como imagen principal del pase.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Nombre / Subtítulo del Programa
                    </label>
                    <input
                      type="text"
                      value={formData.walletProgramName}
                      onChange={(e) => setFormData({ ...formData, walletProgramName: e.target.value })}
                      placeholder="Ej. Club VIP · Tarjeta de Sellos"
                      className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                          Logo Cuadrado
                        </label>
                        <label className="text-[11px] font-bold text-[#5B6F00] hover:underline cursor-pointer">
                          {uploadingField === 'walletLogoUrl' ? 'Subiendo...' : 'Subir'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'walletLogoUrl');
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="url"
                        value={formData.walletLogoUrl}
                        onChange={(e) => setFormData({ ...formData, walletLogoUrl: e.target.value })}
                        placeholder="https://.../logo.png"
                        className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                          Banner Opcional
                        </label>
                        <label className="text-[11px] font-bold text-[#5B6F00] hover:underline cursor-pointer">
                          {uploadingField === 'walletHeroImageUrl' ? 'Subiendo...' : 'Subir'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'walletHeroImageUrl');
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="url"
                        value={formData.walletHeroImageUrl}
                        onChange={(e) => setFormData({ ...formData, walletHeroImageUrl: e.target.value })}
                        placeholder="https://.../banner.jpg"
                        className="w-full text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                      />
                    </div>
                  </div>
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
              </div>

              {/* Right Column: Live Granola + Google Wallet Card Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#5B6F00]" />
                    Vista Previa Plantilla Granola
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F1F5DC] border border-[#D9E2B3] text-[#5B6F00] font-bold">
                    En vivo
                  </span>
                </div>

                {(() => {
                  const useImage =
                    formData.walletBgMode === 'image' && Boolean(formData.walletBgImageUrl?.trim());
                  const bgHex = formData.walletBgColor || '#FAF7F2';
                  const isLight = !useImage && isLightHexColor(bgHex);

                  return (
                    <div
                      className={`relative rounded-[28px] p-5 shadow-[0_16px_36px_-6px_rgba(40,30,10,0.12)] border transition-all duration-300 overflow-hidden bg-cover bg-center ${
                        isLight
                          ? 'text-[#1C1917] border-[#EAE4D5]'
                          : 'text-white border-white/15'
                      }`}
                      style={{
                        backgroundColor: bgHex,
                        ...(useImage ? { backgroundImage: `url(${formData.walletBgImageUrl})` } : {}),
                      }}
                    >
                      {useImage && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/75 via-[#1C1917]/60 to-[#1C1917]/85 pointer-events-none" />
                      )}

                      <div className="relative z-10 space-y-5">
                        {/* Top Header */}
                        <div
                          className={`flex items-center gap-3 pb-3.5 border-b ${
                            isLight ? 'border-[#EAE4D5]' : 'border-white/15'
                          }`}
                        >
                          {formData.walletLogoUrl ? (
                            <img
                              src={formData.walletLogoUrl}
                              alt="Logo"
                              className={`w-10 h-10 rounded-2xl object-cover shrink-0 border ${
                                isLight ? 'bg-white border-[#EAE4D5]' : 'bg-white/10 border-white/20'
                              }`}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-serif text-base font-bold shrink-0 border ${
                                isLight
                                  ? 'bg-[#F1F5DC] text-[#5B6F00] border-[#D9E2B3]'
                                  : 'bg-white/15 text-white border-white/25'
                              }`}
                            >
                              {(formData.studioName || 'L').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-serif font-normal truncate">
                              {formData.studioName || 'Mi Comercio'}
                            </p>
                            <p
                              className={`text-[11px] font-mono truncate ${
                                isLight ? 'text-[#5B6F00]' : 'text-[#E2F099]'
                              }`}
                            >
                              {formData.walletProgramName || 'Pase Digital de Fidelización'}
                            </p>
                          </div>
                        </div>

                        {/* Holder & Points */}
                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <span
                              className={`text-[10px] font-mono uppercase tracking-wider block ${
                                isLight ? 'text-[#78716C]' : 'text-white/70'
                              }`}
                            >
                              Sellos Acumulados
                            </span>
                            <p className="text-2xl font-serif font-normal mt-0.5">
                              3 de {formData.totalStampsRequired || 10} sellos
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-[10px] font-mono uppercase tracking-wider block ${
                                isLight ? 'text-[#78716C]' : 'text-white/70'
                              }`}
                            >
                              Titular
                            </span>
                            <p className="text-xs font-semibold">Camila Morales</p>
                          </div>
                        </div>

                        {/* Simulated Barcode Box */}
                        <div
                          className={`rounded-2xl p-4 flex flex-col items-center justify-center text-[#1C1917] border ${
                            isLight
                              ? 'bg-[#FFFDF9] border-[#EAE4D5]'
                              : 'bg-white/95 border-white/20'
                          }`}
                        >
                          <QrCode className="w-24 h-24 text-[#1C1917]" strokeWidth={1.5} />
                          <span className="text-[10px] font-mono text-[#78716C] mt-1">
                            camila-morales-7x2q
                          </span>
                        </div>

                        {/* Optional Hero Banner */}
                        {formData.walletHeroImageUrl && (
                          <div
                            className={`rounded-xl overflow-hidden border max-h-24 ${
                              isLight ? 'border-[#EAE4D5]' : 'border-white/15'
                            }`}
                          >
                            <img
                              src={formData.walletHeroImageUrl}
                              alt="Hero Banner"
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* Reward footer */}
                        <div
                          className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
                            isLight
                              ? 'bg-[#FFFDF9] border-[#EAE4D5] text-[#1C1917]'
                              : 'bg-black/30 border-white/15 text-white backdrop-blur-xs'
                          }`}
                        >
                          <Gift
                            className={`w-4 h-4 shrink-0 ${
                              isLight ? 'text-[#5B6F00]' : 'text-[#E2F099]'
                            }`}
                          />
                          <span className="truncate font-serif">
                            {formData.currentRewardTitle || 'Recompensa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE4D5]">
              <button
                type="submit"
                disabled={savingConfig}
                className="flex items-center gap-2 h-12 px-7 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#B2C248]" />
                <span>{savingConfig ? 'Guardando...' : 'Guardar Cambios'}</span>
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
