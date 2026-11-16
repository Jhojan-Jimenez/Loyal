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
} from 'lucide-react';
import Link from 'next/link';

export function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<TenantBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TenantStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  // Create new tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formOwnerName.trim() || !formOwnerPhone.trim()) return;

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
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  LOYAL SAAS // MASTER CONSOLE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                  SUPERADMIN
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Panel Maestro de Empresas & Suscripciones
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchTenants}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
            >
              Ver App Pública
            </Link>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Alta Nueva Empresa</span>
            </button>
          </div>
        </div>

        {/* Global SaaS KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* MRR */}
          <div className="bg-neutral-900/60 rounded-3xl p-5 border border-neutral-800 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Facturación Mensual (MRR)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{formatCOP(totalMrrCop)}</p>
            <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-400" />
              <span>{activeTenants.length} empresas facturando activo</span>
            </p>
          </div>

          {/* Tenants Count */}
          <div className="bg-neutral-900/60 rounded-3xl p-5 border border-neutral-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Empresas Clientes</span>
              <Building2 className="w-4 h-4 text-neutral-300" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{tenants.length}</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              {activeTenants.length} activas · {trialTenants.length} en prueba · {suspendedTenants.length} pausadas
            </p>
          </div>

          {/* Total End-users */}
          <div className="bg-neutral-900/60 rounded-3xl p-5 border border-neutral-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Usuarios Finales (Red)</span>
              <Users className="w-4 h-4 text-neutral-300" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{totalStudentsInSaaS}</p>
            <p className="text-[11px] text-neutral-400 mt-1">Tarjetas digitales activas</p>
          </div>

          {/* Total Stamps */}
          <div className="bg-neutral-900/60 rounded-3xl p-5 border border-neutral-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Sellos del Mes</span>
              <Sparkles className="w-4 h-4 text-neutral-300" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{totalStampsInSaaS}</p>
            <p className="text-[11px] text-neutral-400 mt-1">Visitas auditadas con QR</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre de negocio, slug o dueño..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500/50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Empresas Registradas ({filteredTenants.length})</span>
            </h2>
            <span className="text-xs text-neutral-400">Plataforma Multi-Tenant Activa</span>
          </div>

          <div className="overflow-x-auto">
            {filteredTenants.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 text-xs">
                No hay comercios asociados que coincidan con la búsqueda.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-5">Empresa / Comercio</th>
                    <th className="py-3.5 px-4">Contacto Dueño</th>
                    <th className="py-3.5 px-4">Plan SaaS</th>
                    <th className="py-3.5 px-4">Uso (Alumnos / Sellos)</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredTenants.map((tenant) => {
                    return (
                      <tr key={tenant.id} className="hover:bg-neutral-800/30 transition-colors">
                        {/* Company Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-200 shrink-0">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{tenant.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-mono text-emerald-400">/{tenant.slug}</span>
                                <span className="text-neutral-500">·</span>
                                <span className="text-[11px] text-neutral-400">{tenant.category}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Owner Contact */}
                        <td className="py-4 px-4 text-neutral-300">
                          <div className="font-medium text-white">{tenant.ownerName}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                            <a
                              href={`https://wa.me/${tenant.ownerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                            >
                              <Phone className="w-3 h-3" />
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
                              className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                tenant.plan === 'enterprise'
                                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                                  : tenant.plan === 'pro'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                              }`}
                            >
                              Plan {tenant.plan}
                            </span>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              {formatCOP(tenant.monthlyFeeCop)}/mes
                            </div>
                          </div>
                        </td>

                        {/* Usage Metrics */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-white">
                              {tenant.totalStudentsCount ?? 0} clientes
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              {tenant.totalStampsCount ?? 0} sellos estampados
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                              tenant.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                : tenant.status === 'trial'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tenant.status === 'active'
                                  ? 'bg-emerald-400 animate-pulse'
                                  : tenant.status === 'trial'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
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
                          <div className="flex items-center justify-end gap-2">
                            {/* Impersonate button (Entrar como comercio) */}
                            <Link
                              href="/admin"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                              title="Entrar a administrar este comercio"
                            >
                              <span>Entrar</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>

                            {/* Suspend / Resume toggle button */}
                            <button
                              onClick={() => handleToggleStatus(tenant.slug, tenant.status)}
                              disabled={actionLoading === tenant.slug}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                tenant.status === 'active'
                                  ? 'bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                                  : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
                              }`}
                              title={tenant.status === 'active' ? 'Pausar servicio (por no pago)' : 'Reactivar servicio'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete business */}
                            <button
                              onClick={() => handleDeleteTenant(tenant.slug, tenant.name)}
                              disabled={actionLoading === tenant.slug}
                              className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Dar de Alta Nueva Empresa Cliente</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Nombre Comercial de la Empresa *</label>
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
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Slug URL (Identificador) *</label>
                  <input
                    type="text"
                    required
                    placeholder="cafe-pergamino"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Fitness & Yoga">Fitness & Yoga</option>
                    <option value="Cafetería & Pastelería">Cafetería & Pastelería</option>
                    <option value="Belleza & Barbería">Belleza & Barbería</option>
                    <option value="Restaurante & Gastro">Restaurante & Gastro</option>
                    <option value="Retail & Tienda">Retail & Tienda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Nombre del Dueño / Gerente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Duque"
                    value={formOwnerName}
                    onChange={(e) => setFormOwnerName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">WhatsApp de Contacto *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 310 123 4567"
                    value={formOwnerPhone}
                    onChange={(e) => setFormOwnerPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Correo Electrónico del Dueño</label>
                <input
                  type="email"
                  placeholder="gerencia@cafe.com"
                  value={formOwnerEmail}
                  onChange={(e) => setFormOwnerEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Plan SaaS</label>
                  <select
                    value={formPlan}
                    onChange={(e) => {
                      const p = e.target.value as TenantPlan;
                      setFormPlan(p);
                      setFormMonthlyFee(p === 'starter' ? 79000 : p === 'pro' ? 129000 : 249000);
                    }}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="starter">Starter (1 sede)</option>
                    <option value="pro">Pro (Sellos Ilimitados)</option>
                    <option value="enterprise">Enterprise (Multi-Sede)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Precio Mensual (COP)</label>
                  <input
                    type="number"
                    value={formMonthlyFee}
                    onChange={(e) => setFormMonthlyFee(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {actionLoading === 'create' ? 'Creando...' : 'Dar de Alta Comercio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
