import fs from 'fs';
import path from 'path';
import { Student, StampTransaction, StudioConfig, YogaClass, TenantBusiness } from './types';
import {
  DEFAULT_STUDIO_CONFIG,
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLASSES,
} from './store';
import { updateGoogleWalletPass } from './google-wallet';

export const INITIAL_TENANTS: TenantBusiness[] = [];

export interface DatabaseData {
  students: Student[];
  transactions: StampTransaction[];
  config: StudioConfig;
  classes: YogaClass[];
  tenants: TenantBusiness[];
}

let cachedDb: DatabaseData | null = null;

function getDbPath(): string {
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
      return path.join(dir, 'loyal-db.json');
    } catch {
      // try next candidate
    }
  }

  return path.join(process.cwd(), 'loyal-db.json');
}

function loadDb(): DatabaseData {
  if (cachedDb) return cachedDb;

  const dbPath = getDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students)) {
        cachedDb = {
          students: parsed.students,
          transactions: parsed.transactions || [],
          config: parsed.config || DEFAULT_STUDIO_CONFIG,
          classes: parsed.classes || [],
          tenants: Array.isArray(parsed.tenants) ? parsed.tenants : [],
        };
        return cachedDb;
      }
    }
  } catch (err) {
    console.warn('[ServerDB] Failed to load DB file, reinitializing with empty data:', err);
  }

  // Initialize with clean data
  cachedDb = {
    students: [],
    transactions: [],
    config: { ...DEFAULT_STUDIO_CONFIG },
    classes: [],
    tenants: [],
  };

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
  } catch (err) {
    console.error('[ServerDB] Error saving DB to disk:', err);
  }
}

export function getDbData(): DatabaseData {
  return loadDb();
}

export function getStudentByToken(token: string): Student | undefined {
  const db = loadDb();
  return db.students.find(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );
}

export function registerStudentServer(
  name: string,
  phone: string,
  email?: string,
  customToken?: string
): Student {
  const db = loadDb();

  let token = customToken;
  if (!token) {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    token = `${slug}-${randomSuffix}`;
  }

  // Check if student already exists by token
  const existing = db.students.find(s => s.token.toLowerCase() === token?.toLowerCase().trim());
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
    notes: 'Alumno nuevo registrado',
  };

  db.students = [newStudent, ...db.students];
  saveDb(db);

  return newStudent;
}

export function addStampServer(
  token: string,
  note: string = 'Asistencia a clase regular',
  cashierName: string = 'Recepción Estudio'
): { success: boolean; student?: Student; transaction?: StampTransaction; error?: string } {
  const db = loadDb();
  const studentIndex = db.students.findIndex(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );

  if (studentIndex === -1) {
    return { success: false, error: 'Alumno no encontrado en el sistema' };
  }

  const student = db.students[studentIndex];
  const totalRequired = db.config.totalStampsRequired || 10;
  const newStamps = student.stamps + 1;

  const updatedStudent: Student = {
    ...student,
    stamps: newStamps,
    totalVisits: student.totalVisits + 1,
    lastVisitAt: new Date().toISOString(),
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
  };

  db.students[studentIndex] = updatedStudent;
  db.transactions = [newTx, ...db.transactions];
  saveDb(db);

  // Background update to Google Wallet over-the-air (fire & forget)
  updateGoogleWalletPass(
    updatedStudent.token,
    updatedStudent.stamps,
    totalRequired,
    updatedStudent.name
  ).catch((err) => {
    console.warn('[ServerDB] Google Wallet background update warning:', err);
  });

  return { success: true, student: updatedStudent, transaction: newTx };
}

export function redeemRewardServer(
  token: string,
  notes: string = 'Recompensa de 10 clases canjeada',
  cashierName: string = 'Recepción Estudio'
): { success: boolean; student?: Student; transaction?: StampTransaction; error?: string } {
  const db = loadDb();
  const studentIndex = db.students.findIndex(
    (s) => s.token.toLowerCase().trim() === token.toLowerCase().trim()
  );

  if (studentIndex === -1) {
    return { success: false, error: 'Alumno no encontrado' };
  }

  const student = db.students[studentIndex];
  const totalRequired = db.config.totalStampsRequired || 10;

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
  };

  db.students[studentIndex] = updatedStudent;
  db.transactions = [newTx, ...db.transactions];
  saveDb(db);

  // Background update to Google Wallet reset over-the-air
  updateGoogleWalletPass(
    updatedStudent.token,
    0,
    totalRequired,
    updatedStudent.name
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
// SUPERADMIN: Multi-Tenant Business Management
// ─────────────────────────────────────────────────────────────

export function getTenantsServer(): TenantBusiness[] {
  const db = loadDb();
  const totalStudents = db.students.length;
  const totalStamps = db.students.reduce((acc, s) => acc + s.totalVisits, 0);

  return (db.tenants || []).map((t) => {
    // Si solo hay un negocio registrado o coincide con el actual, reflejar las estadísticas reales
    return {
      ...t,
      totalStudentsCount: t.totalStudentsCount ?? totalStudents,
      totalStampsCount: t.totalStampsCount ?? totalStamps,
    };
  });
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
}): TenantBusiness {
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

  // Verificar si ya existe
  const existing = (db.tenants || []).find((t) => t.slug === slug);
  if (existing) {
    return existing;
  }

  const plan = data.plan || 'pro';
  const defaultFee = plan === 'starter' ? 79000 : plan === 'pro' ? 129000 : 249000;

  const newTenant: TenantBusiness = {
    id: `ten_${Date.now()}`,
    slug,
    name: data.name.trim(),
    category: data.category?.trim() || 'Comercio Local',
    ownerName: data.ownerName.trim(),
    ownerEmail: data.ownerEmail.trim(),
    ownerPhone: data.ownerPhone.trim(),
    plan,
    status: 'active',
    monthlyFeeCop: data.monthlyFeeCop || defaultFee,
    createdAt: new Date().toISOString(),
    totalStudentsCount: 0,
    totalStampsCount: 0,
  };

  db.tenants = [newTenant, ...(db.tenants || [])];
  saveDb(db);
  return newTenant;
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
