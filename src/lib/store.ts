import { Student, StampTransaction, StudioConfig, YogaClass } from './types';

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  studioName: 'Tu Negocio',
  tagline: 'Programa oficial de fidelización y recompensas',
  totalStampsRequired: 10,
  currentRewardTitle: 'Recompensa Exclusiva de Fidelidad (10 Sellos)',
  currentRewardDescription: '¡Completaste tu ciclo de 10 visitas! Muestra este pase en caja para redimir tu premio de cortesía.',
  intermediateRewardTitle: 'Beneficio Especial Intermedio',
  intermediateRewardStamps: 5,
  address: 'Sede Principal',
  googleMapsUrl: 'https://maps.google.com',
  wifiSsid: 'WiFi_Clientes',
  wifiPassword: 'clave_de_acceso',
  whatsappNumber: '+57 300 000 0000',
  instagramHandle: '@tu_negocio',
};

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_TRANSACTIONS: StampTransaction[] = [];

export const INITIAL_CLASSES: YogaClass[] = [];

// Helper to export CSV
export function generateStudentsCSV(students: Student[], config: StudioConfig): string {
  const headers = [
    'ID Alumno',
    'Nombre',
    'Telefono',
    'Email',
    'Sellos Actuales',
    'Meta Sellos',
    'Ciclos Completados (Premios Ganados)',
    'Total Visitas Historicas',
    'Fecha de Registro',
    'Ultima Asistencia',
    'Notas',
  ];

  const rows = students.map((s) => [
    `"${s.id}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.phone}"`,
    `"${s.email || ''}"`,
    s.stamps,
    config.totalStampsRequired,
    s.totalCompletedCycles,
    s.totalVisits,
    `"${new Date(s.registeredAt).toLocaleDateString('es-CO')}"`,
    s.lastVisitAt ? `"${new Date(s.lastVisitAt).toLocaleDateString('es-CO')}"` : '"Sin visitas"',
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateTransactionsCSV(txs: StampTransaction[]): string {
  const headers = [
    'ID Transaccion',
    'Alumno',
    'Fecha y Hora',
    'Recepcionista / Empleado',
    'Tipo de Operacion',
    'Sellos Resultantes',
    'Detalle',
  ];

  const rows = txs.map((t) => [
    `"${t.id}"`,
    `"${t.studentName.replace(/"/g, '""')}"`,
    `"${new Date(t.timestamp).toLocaleString('es-CO')}"`,
    `"${t.cashierName.replace(/"/g, '""')}"`,
    `"${t.type}"`,
    t.resultingStamps,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
