import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Student,
  StampTransaction,
  StudioConfig,
  YogaClass,
  TenantBusiness,
  User,
  TenantMembership,
  TenantInvitation,
  TenantRole,
  OnboardingToken,
  TenantPlan,
} from './types';
import {
  DEFAULT_STUDIO_CONFIG,
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLASSES,
} from './store';
import { updateGoogleWalletPass } from './google-wallet';

export const INITIAL_TENANTS: TenantBusiness[] = [];

export interface DatabaseData {
  users: User[];
  tenants: TenantBusiness[];
  memberships: TenantMembership[];
  invitations: TenantInvitation[];
  onboardingTokens?: OnboardingToken[];
  students: Student[];
  transactions: StampTransaction[];
  config: StudioConfig;
  classes: YogaClass[];
}

let cachedDb: DatabaseData | null = null;
let lastDbMtime = 0;

// ─────────────────────────────────────────────────────────────
// PASSWORD SECURITY & HASHING
// ─────────────────────────────────────────────────────────────

const SALT = 'loyal_secure_salt_2026';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim() + SALT).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  return hashPassword(password) === hash;
}

// ─────────────────────────────────────────────────────────────
// DATABASE PERSISTENCE (DISK / VOLUME)
// ─────────────────────────────────────────────────────────────

export function getDataDir(): string {
  const candidates = [
    process.env.DATA_DIR,
    path.join(process.cwd(), 'data'),
    '/tmp/loyal-data',
  ].filter(Boolean) as string[];

  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const testFile = path.join(dir, `.test-write-${Date.now()}`);
      fs.writeFileSync(testFile, '1', 'utf8');
      fs.unlinkSync(testFile);
      return dir;
    } catch {
      // try next candidate
    }
  }

  return process.cwd();
}

function getDbPath(): string {
  return path.join(getDataDir(), 'loyal-db.json');
}

function ensureDefaultSuperAdmin(db: DatabaseData) {
  if (!db.users) db.users = [];

  const hasSuperAdmin = db.users.some((u) => u.isPlatformSuperAdmin);
  if (!hasSuperAdmin) {
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'loyal2026';
    const superAdminUser: User = {
      id: 'usr_superadmin',
      email: 'jhojanjimene@gmail.com',
      fullName: 'Jhojan Jimenez (SuperAdmin)',
      passwordHash: hashPassword(superAdminPassword),
      isPlatformSuperAdmin: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(superAdminUser);
  }
}

function loadDb(): DatabaseData {
  const dbPath = getDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const stat = fs.statSync(dbPath);
      if (cachedDb && stat.mtimeMs === lastDbMtime) {
        return cachedDb;
      }
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        cachedDb = {
          users: Array.isArray(parsed.users) ? parsed.users : [],
          tenants: Array.isArray(parsed.tenants) ? parsed.tenants : [],
          memberships: Array.isArray(parsed.memberships) ? parsed.memberships : [],
          invitations: Array.isArray(parsed.invitations) ? parsed.invitations : [],
          students: Array.isArray(parsed.students) ? parsed.students : [],
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          config: parsed.config || DEFAULT_STUDIO_CONFIG,
          classes: Array.isArray(parsed.classes) ? parsed.classes : [],
        };
        lastDbMtime = stat.mtimeMs;
        ensureDefaultSuperAdmin(cachedDb);
        return cachedDb;
      }
    }
  } catch (err) {
    console.warn('[ServerDB] Failed to load DB file, initializing fresh:', err);
  }

  // Initialize clean database
  cachedDb = {
    users: [],
    tenants: [],
    memberships: [],
    invitations: [],
    students: [],
    transactions: [],
    config: { ...DEFAULT_STUDIO_CONFIG },
    classes: [],
  };

  ensureDefaultSuperAdmin(cachedDb);
  saveDb(cachedDb);
  return cachedDb;
}

function saveDb(data: DatabaseData) {
  cachedDb = data;
  const dbPath = getDbPath();
  const tmpPath = `${dbPath}.tmp`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, dbPath);
    try {
      const stat = fs.statSync(dbPath);
      lastDbMtime = stat.mtimeMs;
    } catch {}
  } catch (err) {
    console.error('[ServerDB] Error saving DB to disk:', err);
  }
}

export function getDbData(slug?: string): DatabaseData & { tenant?: TenantBusiness } {
  const db = loadDb();
  if (!slug) return db;
  const tenant = (db.tenants || []).find((t) => t.slug === slug);
  const students = getTenantStudents(slug);
  const transactions = getTenantTransactions(slug);
  const config = tenant?.config || db.config;
  return {
    ...db,
    students,
    transactions,
    config,
    tenant,
  };
}

// ─────────────────────────────────────────────────────────────
// USERS & MULTI-TENANT MEMBERSHIP MANAGEMENT
// ─────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  const db = loadDb();
  const cleanEmail = email.toLowerCase().trim();
  // Allow login with email or shorthand 'admin'
  return db.users.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail ||
      (cleanEmail === 'admin' && u.isPlatformSuperAdmin)
  );
}

export function findUserById(id: string): User | undefined {
  const db = loadDb();
  return db.users.find((u) => u.id === id);
}

export function getUserMemberships(
  userId: string
): { membership: TenantMembership; tenant: TenantBusiness }[] {
  const db = loadDb();
  const userMemberships = (db.memberships || []).filter((m) => m.userId === userId);

  const results: { membership: TenantMembership; tenant: TenantBusiness }[] = [];
  for (const m of userMemberships) {
    const tenant = (db.tenants || []).find((t) => t.id === m.tenantId);
    if (tenant && tenant.status !== 'suspended') {
      results.push({ membership: m, tenant });
    }
  }
  return results;
}

// ─────────────────────────────────────────────────────────────
// TENANTS & INVITATIONS
// ─────────────────────────────────────────────────────────────

export function getTenantsServer(): TenantBusiness[] {
  const db = loadDb();
  return (db.tenants || []).map((t) => {
    // Calcular estudiantes de este tenant específico
    const tenantStudents = (db.students || []).filter(
      (s) => s.tenantSlug === t.slug || (!s.tenantSlug && db.tenants.length === 1)
    );
    const tenantTxs = (db.transactions || []).filter(
      (tx) => tx.tenantSlug === t.slug || (!tx.tenantSlug && db.tenants.length === 1)
    );

    return {
      ...t,
      totalStudentsCount: tenantStudents.length,
      totalStampsCount: tenantTxs.length,
    };
  });
}

export function getTenantBySlug(slug: string): TenantBusiness | undefined {
  if (!slug) return undefined;
  const db = loadDb();
  let cleanSlug = slug;
  try {
    cleanSlug = decodeURIComponent(slug);
  } catch {}
  cleanSlug = cleanSlug.toLowerCase().trim();
  return (db.tenants || []).find(
    (t) => t.slug.toLowerCase().trim() === cleanSlug
  );
}

export function createTenantServer(data: {
  name: string;
  slug?: string;
  category?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  plan?: 'starter' | 'pro' | 'enterprise';
  monthlyFeeCop?: number;
  adminPin?: string;
  cashierPin?: string;
}): { tenant: TenantBusiness; invitation: TenantInvitation; activationUrl: string } {
  const db = loadDb();

  let slug = data.slug;
  if (!slug) {
    slug = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Verificar si ya existe tenant por slug
  let tenant = (db.tenants || []).find((t) => t.slug === slug);
  const plan = data.plan || 'pro';
  const defaultFee = plan === 'starter' ? 79000 : plan === 'pro' ? 129000 : 249000;

  if (!tenant) {
    const defaultTenantConfig: StudioConfig = {
      ...DEFAULT_STUDIO_CONFIG,
      studioName: data.name.trim(),
      whatsappNumber: data.ownerPhone.trim(),
      currentRewardTitle: `Recompensa Exclusiva ${data.name.trim()} (10 Sellos)`,
      currentRewardDescription: `¡Completaste tus 10 sellos en ${data.name.trim()}! Muestra este pase en caja para redimir tu premio.`,
      cashierPin: data.cashierPin || '0000',
    };

    tenant = {
      id: `ten_${Date.now()}`,
      slug,
      name: data.name.trim(),
      category: data.category?.trim() || 'Comercio Local',
      ownerName: data.ownerName.trim(),
      ownerEmail: data.ownerEmail.toLowerCase().trim(),
      ownerPhone: data.ownerPhone.trim(),
      plan,
      status: 'active',
      monthlyFeeCop: data.monthlyFeeCop || defaultFee,
      createdAt: new Date().toISOString(),
      totalStudentsCount: 0,
      totalStampsCount: 0,
      adminPin: data.adminPin || '1234',
      cashierPin: data.cashierPin || '0000',
      config: defaultTenantConfig,
    };

    db.tenants = [tenant, ...(db.tenants || [])];
  }

  // Generar Token Criptográfico de Invitación (válido por 7 días)
  const inviteToken = crypto.randomBytes(24).toString('hex');
  const invitation: TenantInvitation = {
    id: `inv_${Date.now()}`,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    email: data.ownerEmail.toLowerCase().trim(),
    role: 'OWNER',
    token: inviteToken,
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.invitations = [invitation, ...(db.invitations || [])];
  saveDb(db);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
  const activationUrl = `${baseUrl}/invite/activate?token=${inviteToken}`;

  return { tenant, invitation, activationUrl };
}

export function getInvitationByToken(token: string): TenantInvitation | undefined {
  const db = loadDb();
  const cleanToken = token.trim();
  return (db.invitations || []).find(
    (inv) => inv.token === cleanToken && inv.status === 'PENDING'
  );
}

export function acceptInvitationServer(
  token: string,
  password: string,
  fullName?: string
): { success: boolean; user?: User; tenant?: TenantBusiness; error?: string } {
  const db = loadDb();
  const invitation = getInvitationByToken(token);

  if (!invitation) {
    return { success: false, error: 'Enlace de invitación inválido o expirado' };
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    invitation.status = 'EXPIRED';
    saveDb(db);
    return { success: false, error: 'La invitación ha expirado. Solicita un nuevo enlace al administrador.' };
  }

  const tenant = (db.tenants || []).find((t) => t.id === invitation.tenantId);
  if (!tenant) {
    return { success: false, error: 'El comercio asociado a esta invitación ya no existe' };
  }

  // Buscar o crear usuario
  let user = db.users.find((u) => u.email.toLowerCase() === invitation.email.toLowerCase());
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      email: invitation.email.toLowerCase(),
      fullName: fullName?.trim() || tenant.ownerName,
      passwordHash: hashPassword(password),
      isPlatformSuperAdmin: false,
      lastActiveTenantSlug: tenant.slug,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    // Actualizar contraseña y nombre si ya existía
    user.passwordHash = hashPassword(password);
    if (fullName) user.fullName = fullName.trim();
    user.lastActiveTenantSlug = tenant.slug;
  }

  // Crear membresía OWNER si no existe
  const existingMembership = (db.memberships || []).find(
    (m) => m.userId === user!.id && m.tenantId === tenant!.id
  );
  if (!existingMembership) {
    const membership: TenantMembership = {
      id: `mem_${Date.now()}`,
      userId: user.id,
      tenantId: tenant.id,
      role: invitation.role,
      createdAt: new Date().toISOString(),
    };
    db.memberships.push(membership);
  }

  // Marcar invitación como aceptada
  invitation.status = 'ACCEPTED';
  saveDb(db);

  return { success: true, user, tenant };
}

export function updateTenantStatusServer(
  slug: string,
  status: 'active' | 'trial' | 'suspended'
): boolean {
  const db = loadDb();
  const index = (db.tenants || []).findIndex((t) => t.slug === slug);
  if (index === -1) return false;

  db.tenants[index].status = status;
  saveDb(db);
  return true;
}

export function updateTenantConfigServer(
  slug: string,
  configUpdate: Partial<StudioConfig>
): TenantBusiness | undefined {
  const db = loadDb();
  const tenant = (db.tenants || []).find((t) => t.slug === slug);
  if (!tenant) return undefined;

  tenant.config = {
    ...(tenant.config || DEFAULT_STUDIO_CONFIG),
    ...configUpdate,
  };

  saveDb(db);
  return tenant;
}

export function deleteTenantServer(slug: string): boolean {
  const db = loadDb();
  const initialLen = (db.tenants || []).length;
  db.tenants = (db.tenants || []).filter((t) => t.slug !== slug);

  if (db.tenants.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getOrCreateInvitationForTenant(
  tenantSlug: string
): { invitation: TenantInvitation; activationUrl: string } | null {
  const db = loadDb();
  const tenant = (db.tenants || []).find((t) => t.slug === tenantSlug);
  if (!tenant) return null;

  // Buscar si ya existe una invitación PENDING no expirada
  let invitation = (db.invitations || []).find(
    (inv) =>
      inv.tenantSlug === tenantSlug &&
      inv.status === 'PENDING' &&
      new Date(inv.expiresAt) > new Date()
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';

  if (invitation) {
    return {
      invitation,
      activationUrl: `${baseUrl}/invite/activate?token=${invitation.token}`,
    };
  }

  // Generar nueva invitación si no hay una activa
  const inviteToken = crypto.randomBytes(24).toString('hex');
  invitation = {
    id: `inv_${Date.now()}`,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    email: tenant.ownerEmail ? tenant.ownerEmail.toLowerCase().trim() : `admin@${tenant.slug}.loyal.cloud`,
    role: 'OWNER',
    token: inviteToken,
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.invitations = [invitation, ...(db.invitations || [])];
  saveDb(db);

  return {
    invitation,
    activationUrl: `${baseUrl}/invite/activate?token=${inviteToken}`,
  };
}

export function verifyCashierPinServer(slug: string, pin: string): boolean {
  const db = loadDb();
  const tenant = (db.tenants || []).find((t) => t.slug === slug);
  if (!tenant) return false;
  const expectedPin = tenant.cashierPin || '0000';
  return pin.trim() === expectedPin.trim();
}

// ─────────────────────────────────────────────────────────────
// STUDENTS & TRANSACTIONS (SCOPED POR TENANT)
// ─────────────────────────────────────────────────────────────

export function getTenantStudents(slug?: string): Student[] {
  const db = loadDb();
  if (!slug) return db.students || [];
  return (db.students || []).filter(
    (s) => s.tenantSlug === slug || (!s.tenantSlug && (db.tenants || []).length <= 1)
  );
}

export function getTenantTransactions(slug?: string): StampTransaction[] {
  const db = loadDb();
  if (!slug) return db.transactions || [];
  return (db.transactions || []).filter(
    (t) => t.tenantSlug === slug || (!t.tenantSlug && (db.tenants || []).length <= 1)
  );
}

export function getStudentByToken(token: string): Student | undefined {
  const db = loadDb();
  return (db.students || []).find(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );
}

export function findStudentByPhoneServer(phone: string, tenantSlug?: string): Student | undefined {
  if (!phone || !phone.trim()) return undefined;
  const db = loadDb();
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return undefined;

  return (db.students || []).find((s) => {
    const matchTenant = tenantSlug ? s.tenantSlug?.toLowerCase().trim() === tenantSlug.toLowerCase().trim() : true;
    const sPhone = (s.phone || '').replace(/[^0-9]/g, '');
    return matchTenant && sPhone && (sPhone === cleanPhone || sPhone.endsWith(cleanPhone) || cleanPhone.endsWith(sPhone));
  });
}

export function registerStudentServer(
  name: string,
  phone: string,
  email?: string,
  customToken?: string,
  tenantSlug?: string
): Student {
  const db = loadDb();

  // If a student already exists with this phone at this tenant, return the existing student
  if (phone && phone.trim()) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 7) {
      const existingByPhone = (db.students || []).find((s) => {
        const matchTenant = tenantSlug ? s.tenantSlug?.toLowerCase().trim() === tenantSlug.toLowerCase().trim() : true;
        const sPhone = (s.phone || '').replace(/[^0-9]/g, '');
        return matchTenant && sPhone && (sPhone === cleanPhone || sPhone.endsWith(cleanPhone) || cleanPhone.endsWith(sPhone));
      });
      if (existingByPhone) {
        return existingByPhone;
      }
    }
  }

  let token = customToken;
  if (!token) {
    const slugPrefix = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    token = `${slugPrefix}-${randomSuffix}`;
  }

  const existing = (db.students || []).find(
    (s) => s.token.toLowerCase() === token?.toLowerCase().trim()
  );
  if (existing) {
    return existing;
  }

  const newStudent: Student = {
    id: `std_${Date.now()}`,
    token,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    registeredAt: new Date().toISOString(),
    stamps: 0,
    totalCompletedCycles: 0,
    totalVisits: 0,
    lastVisitAt: null,
    notes: 'Nuevo cliente registrado',
    tenantSlug: tenantSlug || (db.tenants && db.tenants.length === 1 ? db.tenants[0].slug : undefined),
  };

  db.students = [newStudent, ...(db.students || [])];
  saveDb(db);

  return newStudent;
}

export function addStampServer(
  token: string,
  note: string = 'Visita al local',
  cashierName: string = 'Caja de Mostrador',
  tenantSlug?: string
): { success: boolean; student?: Student; transaction?: StampTransaction; error?: string } {
  const db = loadDb();
  const studentIndex = (db.students || []).findIndex(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );

  if (studentIndex === -1) {
    return { success: false, error: 'Cliente no encontrado' };
  }

  const student = db.students[studentIndex];
  
  // Buscar configuración del tenant correspondiente o fallback
  const tenant = (db.tenants || []).find(
    (t) => t.slug === (tenantSlug || student.tenantSlug)
  );
  const totalRequired =
    tenant?.config?.totalStampsRequired || db.config.totalStampsRequired || 10;
  const newStamps = student.stamps + 1;

  const updatedStudent: Student = {
    ...student,
    stamps: newStamps,
    totalVisits: student.totalVisits + 1,
    lastVisitAt: new Date().toISOString(),
    tenantSlug: tenant?.slug || student.tenantSlug,
  };

  const newTx: StampTransaction = {
    id: `tx_${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    timestamp: new Date().toISOString(),
    cashierName,
    type: 'ADD_STAMP',
    stampsAdded: 1,
    resultingStamps: newStamps,
    note,
    tenantSlug: tenant?.slug || student.tenantSlug,
  };

  db.students[studentIndex] = updatedStudent;
  db.transactions = [newTx, ...(db.transactions || [])];
  saveDb(db);

  // Background Google Wallet update
  updateGoogleWalletPass(
    updatedStudent.token,
    updatedStudent.stamps,
    totalRequired,
    updatedStudent.name,
    tenant?.slug || student.tenantSlug
  ).catch((err) => {
    console.warn('[ServerDB] Google Wallet background update warning:', err);
  });

  return { success: true, student: updatedStudent, transaction: newTx };
}

export function redeemRewardServer(
  token: string,
  notes: string = 'Premio de fidelidad canjeado',
  cashierName: string = 'Caja de Mostrador',
  tenantSlug?: string
): { success: boolean; student?: Student; transaction?: StampTransaction; error?: string } {
  const db = loadDb();
  const studentIndex = (db.students || []).findIndex(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );

  if (studentIndex === -1) {
    return { success: false, error: 'Cliente no encontrado' };
  }

  const student = db.students[studentIndex];
  const tenant = (db.tenants || []).find(
    (t) => t.slug === (tenantSlug || student.tenantSlug)
  );
  const totalRequired =
    tenant?.config?.totalStampsRequired || db.config.totalStampsRequired || 10;

  const updatedStudent: Student = {
    ...student,
    stamps: 0,
    totalCompletedCycles: student.totalCompletedCycles + 1,
  };

  const newTx: StampTransaction = {
    id: `tx_${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    timestamp: new Date().toISOString(),
    cashierName,
    type: 'REDEEM_REWARD',
    stampsAdded: 0,
    resultingStamps: 0,
    note: notes,
    tenantSlug: tenant?.slug || student.tenantSlug,
  };

  db.students[studentIndex] = updatedStudent;
  db.transactions = [newTx, ...(db.transactions || [])];
  saveDb(db);

  updateGoogleWalletPass(
    updatedStudent.token,
    0,
    totalRequired,
    updatedStudent.name,
    tenant?.slug || student.tenantSlug
  ).catch((err) => {
    console.warn('[ServerDB] Google Wallet background update warning:', err);
  });

  return { success: true, student: updatedStudent, transaction: newTx };
}

export function updateStudioConfigServer(configUpdate: Partial<StudioConfig>): StudioConfig {
  const db = loadDb();
  db.config = { ...db.config, ...configUpdate };
  saveDb(db);
  return db.config;
}

export function deleteStudentServer(token: string): boolean {
  const db = loadDb();
  const clean = token.toLowerCase().trim();
  const initialLen = db.students.length;

  db.students = db.students.filter((s) => s.token.toLowerCase().trim() !== clean);
  db.transactions = db.transactions.filter(
    (t) => t.studentId !== clean && !t.note?.includes(clean)
  );

  if (db.students.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// BLANK SELF-ONBOARDING MAGIC LINKS (NO SLUG REQUIRED FROM USER)
// ─────────────────────────────────────────────────────────────

const RESERVED_SLUGS = new Set([
  'admin',
  'superadmin',
  'login',
  'onboard',
  'invite',
  'scanner',
  'card',
  'api',
  'style',
]);

function generateUniqueTenantSlug(businessName: string, existingTenants: TenantBusiness[]): string {
  const base =
    businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'comercio';

  let candidate = RESERVED_SLUGS.has(base) ? `${base}-club` : base;
  const taken = new Set(existingTenants.map((t) => t.slug.toLowerCase()));
  if (!taken.has(candidate)) return candidate;

  let counter = 2;
  while (taken.has(`${candidate}-${counter}`)) {
    counter++;
  }
  return `${candidate}-${counter}`;
}

export function createBlankOnboardingLinkServer(data?: {
  plan?: TenantPlan;
  monthlyFeeCop?: number;
}): { onboardingToken: OnboardingToken; onboardUrl: string } {
  const db = loadDb();
  if (!db.onboardingTokens) db.onboardingTokens = [];

  const plan: TenantPlan = data?.plan || 'pro';
  const defaultFees: Record<TenantPlan, number> = {
    starter: 0,
    pro: 79000,
    enterprise: 249000,
  };
  const monthlyFeeCop =
    data?.monthlyFeeCop !== undefined ? data.monthlyFeeCop : defaultFees[plan];

  const token = crypto.randomBytes(20).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();

  const onboardingToken: OnboardingToken = {
    id: `onb_${Date.now()}`,
    token,
    plan,
    monthlyFeeCop,
    status: 'PENDING',
    expiresAt,
    createdAt: now.toISOString(),
  };

  db.onboardingTokens = [onboardingToken, ...db.onboardingTokens];
  saveDb(db);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
  const onboardUrl = `${appUrl.replace(/\/$/, '')}/onboard?token=${token}`;

  return { onboardingToken, onboardUrl };
}

export function verifyOnboardingTokenServer(token: string): {
  valid: boolean;
  onboardingToken?: OnboardingToken;
  error?: string;
} {
  if (!token) return { valid: false, error: 'Enlace de registro inválido' };
  const db = loadDb();
  const record = (db.onboardingTokens || []).find((t) => t.token === token.trim());

  if (!record) {
    return { valid: false, error: 'Este enlace de registro no existe o fue eliminado' };
  }
  if (record.status === 'USED') {
    return { valid: false, error: 'Este enlace ya fue utilizado para crear un comercio' };
  }
  if (new Date(record.expiresAt).getTime() < Date.now() || record.status === 'EXPIRED') {
    return { valid: false, error: 'Este enlace ha expirado. Solicita uno nuevo.' };
  }

  return { valid: true, onboardingToken: record };
}

export function completeSelfOnboardingServer(data: {
  token: string;
  businessName: string;
  category?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  password: string;
}): {
  success: boolean;
  tenant?: TenantBusiness;
  user?: User;
  error?: string;
} {
  const check = verifyOnboardingTokenServer(data.token);
  if (!check.valid || !check.onboardingToken) {
    return { success: false, error: check.error || 'Enlace inválido' };
  }

  const db = loadDb();
  if (!db.tenants) db.tenants = [];
  if (!db.users) db.users = [];
  if (!db.memberships) db.memberships = [];
  if (!db.onboardingTokens) db.onboardingTokens = [];

  const cleanEmail = data.ownerEmail.toLowerCase().trim();
  const slug = generateUniqueTenantSlug(data.businessName, db.tenants);
  const now = new Date().toISOString();

  const tenant: TenantBusiness = {
    id: `ten_${Date.now()}`,
    slug,
    name: data.businessName.trim(),
    category: data.category?.trim() || 'Comercio Local',
    ownerName: data.ownerName.trim(),
    ownerEmail: cleanEmail,
    ownerPhone: data.ownerPhone.trim(),
    plan: check.onboardingToken.plan,
    status: 'active',
    monthlyFeeCop: check.onboardingToken.monthlyFeeCop,
    createdAt: now,
    totalStudentsCount: 0,
    totalStampsCount: 0,
    adminPin: '1234',
    cashierPin: '0000',
    config: {
      ...DEFAULT_STUDIO_CONFIG,
      studioName: data.businessName.trim(),
      tagline: 'Programa de Fidelidad & Sellos',
      whatsappNumber: data.ownerPhone.trim(),
      walletBgMode: 'color',
      walletBgColor: '#FAF7F2',
      walletProgramName: 'Pase Digital de Fidelización',
    },
  };

  db.tenants = [tenant, ...db.tenants];

  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  const passwordHash = hashPassword(data.password);

  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      fullName: data.ownerName.trim(),
      passwordHash,
      isPlatformSuperAdmin: false,
      lastActiveTenantSlug: slug,
      createdAt: now,
    };
    db.users.push(user);
  } else {
    user.passwordHash = passwordHash;
    user.fullName = data.ownerName.trim();
    user.lastActiveTenantSlug = slug;
  }

  const membership: TenantMembership = {
    id: `mem_${Date.now()}`,
    userId: user.id,
    tenantId: tenant.id,
    role: 'OWNER',
    createdAt: now,
  };
  db.memberships.push(membership);

  const tokenIdx = db.onboardingTokens.findIndex((t) => t.token === data.token.trim());
  if (tokenIdx !== -1) {
    db.onboardingTokens[tokenIdx] = {
      ...db.onboardingTokens[tokenIdx],
      status: 'USED',
      usedAt: now,
      createdTenantSlug: slug,
    };
  }

  saveDb(db);
  return { success: true, tenant, user };
}
