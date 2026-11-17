'use client';

import React, { useState, useEffect } from 'react';
import { TenantBusiness, TenantStatus, TenantPlan } from '@/lib/types';
import {
  Building2,
  DollarSign,
  Users,
  ShieldAlert,
  Search,
  Plus,
  ExternalLink,
  Power,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ArrowUpRight,
  RefreshCw,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  LogOut,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<TenantBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TenantStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Activation Invitation Modal State
  const [newTenantInvite, setNewTenantInvite] = useState<{
    tenantName: string;
    tenantSlug: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    activationUrl: string;
  } | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Fitness & Yoga');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formOwnerEmail, setFormOwnerEmail] = useState('');
  const [formOwnerPhone, setFormOwnerPhone] = useState('');
  const [formPlan, setFormPlan] = useState<TenantPlan>('pro');
  const [formMonthlyFee, setFormMonthlyFee] = useState(129000);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/superadmin/tenants', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.tenants)) {
        setTenants(data.tenants);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Update status (active, trial, suspended)
  const handleToggleStatus = async (slug: string, currentStatus: TenantStatus) => {
    const nextStatus: TenantStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmMsg =
      nextStatus === 'suspended'
        ? `¿Deseas suspender a "${slug}"? Sus empleados no podrán registrar sellos hasta reactivarlo.`
        : `¿Reactivar el servicio para "${slug}"?`;

    if (!confirm(confirmMsg)) return;

    setActionLoading(slug);
    try {
      const res = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', slug, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) =>
          prev.map((t) => (t.slug === slug ? { ...t, status: nextStatus } : t))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Delete business permanently
  const handleDeleteTenant = async (slug: string, name: string) => {
    if (
      !confirm(
        `⚠️ ATENCIÓN: ¿Estás seguro de eliminar permanentemente a "${name}" (${slug}) de tu plataforma SaaS? Esta acción borrará la empresa y no se puede deshacer.`
      )
    ) {
      return;
    }

    setActionLoading(slug);
    try {
      const res = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', slug }),
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) => prev.filter((t) => t.slug !== slug));
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Fetch or regenerate invitation link for any business
  const handleFetchInvite = async (
    slug: string,
    name: string,
    ownerPhone: string,
    ownerName: string,
    ownerEmail?: string
  ) => {
    setActionLoading(`invite_${slug}`);
    try {
      const res = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invite', slug }),
      });
      const data = await res.json();
      if (data.success && data.activationUrl) {
        setNewTenantInvite({
          tenantName: name,
          tenantSlug: slug,
          ownerName,
          ownerPhone,
          ownerEmail,
          activationUrl: data.activationUrl,
        });
      } else {
        alert(data.error || 'No se pudo obtener el enlace de activación');
      }
    } catch {
      alert('Error de red al consultar invitación');
    } finally {
      setActionLoading(null);
    }
  };

  // Create new tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formOwnerName.trim() || !formOwnerPhone.trim()) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setActionLoading('create');
    try {
      const res = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: formName,
          slug: formSlug.trim() || undefined,
          category: formCategory,
          ownerName: formOwnerName,
          ownerEmail: formOwnerEmail,
          ownerPhone: formOwnerPhone,
          plan: formPlan,
          monthlyFeeCop: Number(formMonthlyFee),
        }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setTenants((prev) => [data.tenant, ...prev]);
        setShowAddModal(false);
        if (data.activationUrl) {
          setNewTenantInvite({
            tenantName: data.tenant.name,
            tenantSlug: data.tenant.slug,
            ownerName: data.tenant.ownerName,
            ownerPhone: data.tenant.ownerPhone,
            ownerEmail: data.tenant.ownerEmail,
            activationUrl: data.activationUrl,
          });
        }
        // Reset form
        setFormName('');
        setFormSlug('');
        setFormOwnerName('');
        setFormOwnerEmail('');
        setFormOwnerPhone('');
      } else {
        alert(data.error || 'No se pudo crear el comercio');
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered tenants
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Financial & Platform Metrics
  const activeTenants = tenants.filter((t) => t.status === 'active');
  const trialTenants = tenants.filter((t) => t.status === 'trial');
  const suspendedTenants = tenants.filter((t) => t.status === 'suspended');

  // Total MRR in COP
  const totalMrrCop = activeTenants.reduce((acc, t) => acc + (t.monthlyFeeCop || 0), 0);
  const totalStudentsInSaaS = tenants.reduce((acc, t) => acc + (t.totalStudentsCount || 0), 0);
  const totalStampsInSaaS = tenants.reduce((acc, t) => acc + (t.totalStampsCount || 0), 0);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navbar: Warm Dark Ink Hero with Granola Olive Accents */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#1C1917] p-6 sm:p-8 text-white shadow-xl border border-[#292524]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#292524] border border-[#3E3832] flex items-center justify-center text-[#B2C248] shadow-inner shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#B2C248]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#B2C248] uppercase">
                    LOYAL SAAS // MASTER CONSOLE
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#292524] text-white/90 border border-[#3E3832]">
                    SUPERADMIN
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-white mt-1">
                  Panel Maestro de Empresas & Suscripciones
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={fetchTenants}
                className="w-11 h-11 rounded-full bg-[#292524] border border-[#3E3832] hover:bg-[#3E3832] text-white/90 flex items-center justify-center transition-colors cursor-pointer"
                title="Refrescar datos"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <Link
                href="/"
                className="h-11 px-5 rounded-full bg-[#292524] border border-[#3E3832] text-xs font-semibold text-white/90 hover:bg-[#3E3832] transition-all flex items-center"
              >
                Ver App Pública
              </Link>

              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/login?role=superadmin';
                }}
                className="h-11 px-4 rounded-full bg-[#292524] border border-[#3E3832] text-xs font-semibold text-[#F5C7C0] hover:bg-[#3E3832] hover:text-[#C2410C] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Cerrar sesión de SuperAdmin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 h-11 px-6 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3] text-[#B2C248]" />
                <span>+ Alta Nueva Empresa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global SaaS KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* MRR */}
          <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)] relative overflow-hidden">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">Facturación Mensual (MRR)</span>
              <DollarSign className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
              {formatCOP(totalMrrCop)}
            </p>
            <p className="text-[11px] text-[#5B6F00] font-semibold mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-[#5B6F00]" />
              <span>{activeTenants.length} empresas facturando activo</span>
            </p>
          </div>

          {/* Tenants Count */}
          <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">Empresas Clientes</span>
              <Building2 className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
              {tenants.length}
            </p>
            <p className="text-[11px] text-[#78716C] mt-1">
              {activeTenants.length} activas · {trialTenants.length} en prueba · {suspendedTenants.length} pausadas
            </p>
          </div>

          {/* Total End-users */}
          <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">Usuarios Finales (Red)</span>
              <Users className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
              {totalStudentsInSaaS}
            </p>
            <p className="text-[11px] text-[#78716C] mt-1">Tarjetas digitales activas</p>
          </div>

          {/* Total Stamps */}
          <div className="bg-[#FFFDF9] rounded-[28px] p-5 sm:p-6 border border-[#EAE4D5] shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
            <div className="flex items-center justify-between text-[#78716C] mb-2">
              <span className="text-xs font-medium">Sellos del Mes</span>
              <Sparkles className="w-4 h-4 text-[#5B6F00]" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1917] tracking-tight">
              {totalStampsInSaaS}
            </p>
            <p className="text-[11px] text-[#78716C] mt-1">Visitas auditadas con QR</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-2.5 rounded-full border border-[#EAE4D5]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-4 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre de negocio, slug o dueño..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white border border-[#EAE4D5] text-[#1C1917] placeholder-[#A89F91] focus:outline-hidden focus:border-[#5B6F00]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-2">
            {(['all', 'active', 'trial', 'suspended'] as const).map((status) => {
              const label =
                status === 'all'
                  ? `Todos (${tenants.length})`
                  : status === 'active'
                  ? `Activos (${activeTenants.length})`
                  : status === 'trial'
                  ? `Trial (${trialTenants.length})`
                  : `Suspendidos (${suspendedTenants.length})`;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#5B6F00] text-white shadow-xs font-bold'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-[#FFFDF9] rounded-[32px] border border-[#EAE4D5] overflow-hidden shadow-[0_8px_24px_rgba(40,30,10,0.04)]">
          <div className="p-6 border-b border-[#EAE4D5] flex items-center justify-between">
            <h2 className="text-base font-serif font-normal text-[#1C1917] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5B6F00]" />
              <span>Empresas Registradas ({filteredTenants.length})</span>
            </h2>
            <span className="text-xs text-[#78716C]">Plataforma Multi-Tenant Activa</span>
          </div>

          <div className="overflow-x-auto">
            {filteredTenants.length === 0 ? (
              <div className="p-12 text-center text-[#78716C] text-xs">
                No hay comercios asociados que coincidan con la búsqueda.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#EAE4D5]">
                  <tr>
                    <th className="py-3.5 px-5">Empresa / Comercio</th>
                    <th className="py-3.5 px-4">Contacto Dueño</th>
                    <th className="py-3.5 px-4">Plan SaaS</th>
                    <th className="py-3.5 px-4">Uso (Alumnos / Sellos)</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D5]">
                  {filteredTenants.map((tenant) => {
                    return (
                      <tr key={tenant.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        {/* Company Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-[#F1F5DC] border border-[#D9E2B3] flex items-center justify-center font-serif font-normal text-[#5B6F00] shrink-0 text-sm">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-[#1C1917] text-sm">{tenant.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-mono text-[#5B6F00]">/{tenant.slug}</span>
                                <span className="text-[#A89F91]">·</span>
                                <span className="text-[11px] text-[#78716C]">{tenant.category}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Owner Contact */}
                        <td className="py-4 px-4 text-[#57534E]">
                          <div className="font-semibold text-[#1C1917]">{tenant.ownerName}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716C]">
                            <a
                              href={`https://wa.me/${tenant.ownerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#5B6F00] hover:underline"
                            >
                              <Phone className="w-3 h-3 text-[#5B6F00]" />
                              <span>{tenant.ownerPhone}</span>
                            </a>
                            {tenant.ownerEmail && (
                              <span className="truncate max-w-[140px]" title={tenant.ownerEmail}>
                                · {tenant.ownerEmail}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                tenant.plan === 'enterprise'
                                  ? 'bg-[#EAE4D5] text-[#1C1917] border border-[#D5D0C2]'
                                  : tenant.plan === 'pro'
                                  ? 'bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3]'
                                  : 'bg-[#FAF7F2] text-[#78716C] border border-[#EAE4D5]'
                              }`}
                            >
                              Plan {tenant.plan}
                            </span>
                            <div className="text-[11px] text-[#78716C] font-mono">
                              {formatCOP(tenant.monthlyFeeCop)}/mes
                            </div>
                          </div>
                        </td>

                        {/* Usage Metrics */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-[#1C1917]">
                              {tenant.totalStudentsCount ?? 0} clientes
                            </div>
                            <div className="text-[11px] text-[#78716C]">
                              {tenant.totalStampsCount ?? 0} sellos estampados
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                              tenant.status === 'active'
                                ? 'bg-[#F1F5DC] text-[#5B6F00] border border-[#D9E2B3]'
                                : tenant.status === 'trial'
                                ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                                : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECDD3]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tenant.status === 'active'
                                  ? 'bg-[#5B6F00] animate-pulse'
                                  : tenant.status === 'trial'
                                  ? 'bg-[#B45309]'
                                  : 'bg-[#B91C1C]'
                              }`}
                            />
                            <span>
                              {tenant.status === 'active'
                                ? 'Activo'
                                : tenant.status === 'trial'
                                ? 'En Prueba'
                                : 'Suspendido'}
                            </span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Impersonate button (Entrar como comercio) */}
                            <Link
                              href={`/${tenant.slug}/admin`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F1F5DC] hover:text-[#5B6F00] border border-[#EAE4D5] text-[#1C1917] text-xs font-semibold transition-colors"
                              title={`Entrar a administrar ${tenant.name}`}
                            >
                              <span>Admin</span>
                              <ExternalLink className="w-3 h-3 text-[#78716C]" />
                            </Link>

                            {/* Counter Scanner Terminal */}
                            <Link
                              href={`/${tenant.slug}/scanner`}
                              target="_blank"
                              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F1F5DC] hover:text-[#5B6F00] border border-[#EAE4D5] text-[#78716C] transition-colors"
                              title="Abrir terminal de mostrador para cajeros"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </Link>

                            {/* Enlace de Activación / Invitación */}
                            <button
                              onClick={() =>
                                handleFetchInvite(
                                  tenant.slug,
                                  tenant.name,
                                  tenant.ownerPhone,
                                  tenant.ownerName,
                                  tenant.ownerEmail
                                )
                              }
                              disabled={actionLoading === `invite_${tenant.slug}`}
                              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F1F5DC] hover:text-[#5B6F00] border border-[#EAE4D5] text-[#78716C] transition-colors cursor-pointer"
                              title="Obtener/Copiar enlace de invitación para el dueño"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            {/* Suspend / Resume toggle button */}
                            <button
                              onClick={() => handleToggleStatus(tenant.slug, tenant.status)}
                              disabled={actionLoading === tenant.slug}
                              className={`p-2 rounded-full transition-colors cursor-pointer ${
                                tenant.status === 'active'
                                  ? 'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] border border-[#FDE68A]'
                                  : 'bg-[#F1F5DC] text-[#5B6F00] hover:bg-[#E5EACD] border border-[#D9E2B3]'
                              }`}
                              title={tenant.status === 'active' ? 'Pausar servicio (por no pago)' : 'Reactivar servicio'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete business */}
                            <button
                              onClick={() => handleDeleteTenant(tenant.slug, tenant.name)}
                              disabled={actionLoading === tenant.slug}
                              className="p-2 rounded-full bg-[#FBF4EE] border border-[#F1DED1] text-[#C26748] hover:bg-[#F8EAE1] transition-colors cursor-pointer"
                              title="Eliminar comercio definitivamente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create New Tenant Business */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-[#EAE4D5] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F1F5DC] border border-[#D9E2B3] flex items-center justify-center text-[#5B6F00]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-normal text-[#1C1917]">Dar de Alta Nueva Empresa Cliente</h3>
                  <p className="text-xs text-[#78716C]">Habilita un nuevo espacio SaaS multi-tenant</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Nombre Comercial de la Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Café Pergamino 93"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!formSlug) {
                      setFormSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                  className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Slug URL (Identificador) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cafe-pergamino"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#5B6F00] font-mono focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] cursor-pointer transition-colors"
                  >
                    <option value="Fitness & Yoga">Fitness & Yoga</option>
                    <option value="Cafetería & Pastelería">Cafetería & Pastelería</option>
                    <option value="Belleza & Barbería">Belleza & Barbería</option>
                    <option value="Restaurante & Gastro">Restaurante & Gastro</option>
                    <option value="Retail & Tienda">Retail & Tienda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EAE4D5]">
                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Nombre del Dueño / Gerente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Duque"
                    value={formOwnerName}
                    onChange={(e) => setFormOwnerName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 310 123 4567"
                    value={formOwnerPhone}
                    onChange={(e) => setFormOwnerPhone(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] font-mono focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Correo Electrónico del Dueño
                </label>
                <input
                  type="email"
                  placeholder="gerencia@cafe.com"
                  value={formOwnerEmail}
                  onChange={(e) => setFormOwnerEmail(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EAE4D5]">
                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Plan SaaS
                  </label>
                  <select
                    value={formPlan}
                    onChange={(e) => {
                      const p = e.target.value as TenantPlan;
                      setFormPlan(p);
                      setFormMonthlyFee(p === 'starter' ? 79000 : p === 'pro' ? 129000 : 249000);
                    }}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] focus:outline-hidden focus:bg-white focus:border-[#5B6F00] cursor-pointer transition-colors"
                  >
                    <option value="starter">Starter (1 sede)</option>
                    <option value="pro">Pro (Sellos Ilimitados)</option>
                    <option value="enterprise">Enterprise (Multi-Sede)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Precio Mensual (COP)
                  </label>
                  <input
                    type="number"
                    value={formMonthlyFee}
                    onChange={(e) => setFormMonthlyFee(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] font-mono focus:outline-hidden focus:bg-white focus:border-[#5B6F00] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full font-semibold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="px-6 py-2.5 rounded-full bg-[#5B6F00] hover:bg-[#4D5E00] text-white font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {actionLoading === 'create' ? 'Creando...' : 'Dar de Alta Comercio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Activation Invite Details & WhatsApp Dispatch */}
      {newTenantInvite && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-[36px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#EAE4D5] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D5]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F1F5DC] text-[#5B6F00] flex items-center justify-center border border-[#D9E2B3]">
                  <Sparkles className="w-5 h-5 text-[#5B6F00]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#1C1917]">
                    Enlace de Activación
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Para el dueño de {newTenantInvite.tenantName} (/{newTenantInvite.tenantSlug})
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewTenantInvite(null);
                  setCopiedInvite(false);
                }}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-xs text-[#57534E] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1C1917]">Dueño asignado:</span>
                <span>{newTenantInvite.ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1C1917]">WhatsApp:</span>
                <span className="font-mono">{newTenantInvite.ownerPhone}</span>
              </div>
              {newTenantInvite.ownerEmail && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1C1917]">Correo:</span>
                  <span className="font-mono">{newTenantInvite.ownerEmail}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                URL de Activación Segura (Válida por 7 días)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={newTenantInvite.activationUrl}
                  className="w-full text-xs font-mono p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D5] text-[#1C1917] select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(newTenantInvite.activationUrl);
                    setCopiedInvite(true);
                    setTimeout(() => setCopiedInvite(false), 2500);
                  }}
                  className="h-11 px-4 rounded-2xl bg-[#5B6F00] hover:bg-[#4D5E00] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  {copiedInvite ? (
                    <>
                      <Check className="w-4 h-4 text-[#B2C248]" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <span>Copiar</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#78716C] mt-1.5">
                El dueño abrirá este enlace, definirá su contraseña personal e ingresará de inmediato a su panel exclusivo.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`https://wa.me/${newTenantInvite.ownerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `¡Hola ${newTenantInvite.ownerName}! 👋 Bienvenido a Loyal. Para activar tu cuenta de administrador de "${newTenantInvite.tenantName}" y configurar tu programa de fidelización, abre este enlace seguro:\n\n${newTenantInvite.activationUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-bold shadow-md transition-all"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Enviar por WhatsApp</span>
              </a>

              <Link
                href={`/${newTenantInvite.tenantSlug}/admin`}
                target="_blank"
                className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-full bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-bold transition-all"
              >
                <span>Entrar como Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B2C248]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
