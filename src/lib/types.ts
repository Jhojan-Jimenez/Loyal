export interface Student {
  id: string;
  token: string;
  name: string;
  phone: string;
  email?: string;
  registeredAt: string;
  stamps: number; // Current cycle stamps (0 to totalStampsRequired)
  totalCompletedCycles: number; // How many rewards earned
  totalVisits: number;
  lastVisitAt: string | null;
  notes?: string;
  tenantSlug?: string;
}

export type TransactionType = 'ADD_STAMP' | 'REDEEM_REWARD' | 'CYCLE_RESET';

export interface StampTransaction {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  cashierName: string;
  type: TransactionType;
  stampsAdded?: number;
  resultingStamps: number;
  note?: string;
  tenantSlug?: string;
}

export interface StudioConfig {
  studioName: string;
  tagline: string;
  totalStampsRequired: number;
  currentRewardTitle: string;
  currentRewardDescription: string;
  intermediateRewardTitle?: string;
  intermediateRewardStamps?: number;
  address: string;
  googleMapsUrl: string;
  wifiSsid: string;
  wifiPassword: string;
  whatsappNumber: string;
  instagramHandle: string;
  adminPin?: string; // PIN para ingresar a /admin (default: '1234')
  cashierPin?: string; // PIN para ingresar al escáner de caja (default: '0000')
  walletBgColor?: string; // Color hexadecimal de fondo en Google Wallet (ej. '#FAF7F2')
  walletProgramName?: string; // Subtítulo del programa en Google Wallet
  walletLogoUrl?: string; // URL pública de logo cuadrado para Google Wallet
}

export interface YogaClass {
  id: string;
  title: string;
  instructor: string;
  days: string[];
  time: string;
  style: 'Vinyasa Flow' | 'Hatha Yoga' | 'Yin Yoga' | 'Kundalini' | 'Meditación & Cuencos';
  level: 'Todos los niveles' | 'Intermedio' | 'Restaurativo suave';
  intensity: 'Suave' | 'Media' | 'Dinámica';
  description: string;
}

export type TenantPlan = 'starter' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'trial' | 'suspended';
export type TenantRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF';

export interface CashierProfile {
  id: string;
  name: string;
  pin: string; // PIN de 4 dígitos único dentro del comercio
  active: boolean;
  createdAt: string;
}

export interface TenantBusiness {
  id: string;
  slug: string;
  name: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  plan: TenantPlan;
  status: TenantStatus;
  monthlyFeeCop: number;
  createdAt: string;
  totalStudentsCount?: number;
  totalStampsCount?: number;
  adminPin?: string;
  cashierPin?: string;
  cashiers?: CashierProfile[];
  config?: StudioConfig;
}

// ─────────────────────────────────────────────────────────────
// MULTI-TENANT RBAC ENTITIES (SaaS Standards)
// ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  isPlatformSuperAdmin: boolean;
  lastActiveTenantSlug?: string;
  createdAt: string;
}

export interface TenantMembership {
  id: string;
  userId: string;
  tenantId: string;
  role: TenantRole;
  createdAt: string;
}

export interface TenantInvitation {
  id: string;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  email: string;
  role: TenantRole;
  token: string; // Crypto hash
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  createdAt: string;
}

export interface OnboardingToken {
  id: string;
  token: string;
  plan: TenantPlan;
  monthlyFeeCop: number;
  status: 'PENDING' | 'USED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  usedAt?: string;
  createdTenantSlug?: string;
}

export type AuthRole = 'superadmin' | 'admin' | 'cashier';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  isPlatformSuperAdmin: boolean;
  activeTenant?: {
    id: string;
    slug: string;
    name: string;
    role: TenantRole;
  };
  // Compatibilidad legacy
  role?: AuthRole;
  tenantSlug?: string;
  name?: string;
  expiresAt: number;
}
