import { Student, StampTransaction, StudioConfig, YogaClass } from './types';

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  studioName: 'Yoga Shala & Wellness',
  tagline: 'Estudio de yoga, meditación y bienestar consciente',
  totalStampsRequired: 10,
  currentRewardTitle: 'Clase Magistral o Taller Especial Gratis (10 Sellos)',
  currentRewardDescription: '¡Completaste tu ciclo de 10 clases de yoga! Muestra este pase en recepción para disfrutar de tu clase especial de cortesía.',
  intermediateRewardTitle: '20% de Descuento en tu próxima mensualidad',
  intermediateRewardStamps: 5,
  address: 'Calle 72 # 10-34, Zona Financiera, Bogotá',
  googleMapsUrl: 'https://maps.google.com',
  wifiSsid: 'YogaShala_Alumnos',
  wifiPassword: 'namaste_bogota',
  whatsappNumber: '+57 320 328 2014',
  instagramHandle: '@yogashala.co',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_01',
    token: 'camila-restrepo-yoga',
    name: 'Camila Restrepo',
    phone: '+57 312 458 9012',
    email: 'camila.restrepo@gmail.com',
    registeredAt: '2026-10-12T09:30:00Z',
    stamps: 3,
    totalCompletedCycles: 0,
    totalVisits: 3,
    lastVisitAt: '2026-11-16T15:00:00Z',
    notes: 'Alumna de Yoga Vinyasa',
  },
];

export const INITIAL_TRANSACTIONS: StampTransaction[] = [
  {
    id: 'tx_01',
    studentId: 'std_01',
    studentName: 'Camila Restrepo',
    timestamp: '2026-11-16T15:00:00Z',
    cashierName: 'Recepción Yoga Shala',
    type: 'ADD_STAMP',
    stampsAdded: 1,
    resultingStamps: 3,
    note: 'Clase Vinyasa Flow',
  },
];

export const INITIAL_CLASSES: YogaClass[] = [
  {
    id: 'cls_01',
    title: 'Despertar Consciente: Vinyasa Flow',
    instructor: 'Maestra Andrea Salgar',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '06:45 AM - 08:00 AM',
    style: 'Vinyasa Flow',
    level: 'Todos los niveles',
    intensity: 'Dinámica',
    description: 'Secuencia fluida y enérgica coordinada con la respiración ujjayi para activar el prana y la claridad mental.',
  },
  {
    id: 'cls_02',
    title: 'Hatha Tradicional & Pranayama',
    instructor: 'Guru Felipe Osorio',
    days: ['Martes', 'Jueves'],
    time: '07:30 AM - 08:45 AM',
    style: 'Hatha Yoga',
    level: 'Todos los niveles',
    intensity: 'Media',
    description: 'Alineación precisa, permanencia consciente en asana y técnicas profundas de respiración para calmar el sistema nervioso.',
  },
  {
    id: 'cls_03',
    title: 'Yin Yoga & Liberación Fascial',
    instructor: 'Valentina Restrepo',
    days: ['Lunes', 'Miércoles'],
    time: '06:15 PM - 07:30 PM',
    style: 'Yin Yoga',
    level: 'Restaurativo suave',
    intensity: 'Suave',
    description: 'Posturas pasivas sostenidas en el suelo durante 3 a 5 minutos para nutrir tejido conectivo, articulaciones y soltar el estrés del día.',
  },
  {
    id: 'cls_04',
    title: 'Kundalini & Despertar de Energía',
    instructor: 'Anand Kaur',
    days: ['Sábados'],
    time: '09:00 AM - 10:30 AM',
    style: 'Kundalini',
    level: 'Intermedio',
    intensity: 'Dinámica',
    description: 'Kriyas potentes, mantras sagrados y meditación activa para elevar la vitalidad y expandir la presencia.',
  },
  {
    id: 'cls_05',
    title: 'Meditación con Cuencos Tibetanos',
    instructor: 'Mateo Cárdenas',
    days: ['Viernes'],
    time: '07:00 PM - 08:15 PM',
    style: 'Meditación & Cuencos',
    level: 'Restaurativo suave',
    intensity: 'Suave',
    description: 'Baño de sonido inmersivo y vibracional para inducir estados de profunda relajación cerebral theta y regeneración celular.',
  },
];

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
