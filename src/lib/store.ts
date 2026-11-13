import { Student, StampTransaction, StudioConfig, YogaClass } from './types';

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  studioName: 'Loyal Club & Retail',
  tagline: 'Pase digital de fidelización y beneficios exclusivos',
  totalStampsRequired: 10,
  currentRewardTitle: 'Producto o Servicio Gratis (10 Sellos)',
  currentRewardDescription: '¡Completaste tu ciclo de 10 visitas! Muestra este pase en caja para canjear tu beneficio exclusivo de cliente frecuente.',
  intermediateRewardTitle: '20% de Descuento en tu próxima visita',
  intermediateRewardStamps: 5,
  address: 'Calle 72 # 10-34, Zona Financiera, Bogotá',
  googleMapsUrl: 'https://maps.google.com',
  wifiSsid: 'Loyal_Guest_WiFi',
  wifiPassword: 'cliente_frecuente',
  whatsappNumber: '+57 320 328 2014',
  instagramHandle: '@loyalpass.cloud',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_01',
    token: 'camila-restrepo-yoga',
    name: 'Camila Restrepo',
    phone: '+57 312 458 9012',
    email: 'camila.restrepo@gmail.com',
    registeredAt: '2026-10-12T09:30:00Z',
    stamps: 7,
    totalCompletedCycles: 1,
    totalVisits: 17,
    lastVisitAt: '2026-11-08T18:30:00Z',
    notes: 'Cliente frecuente VIP',
  },
  {
    id: 'std_02',
    token: 'david-echeverry-yoga',
    name: 'David Echeverry',
    phone: '+57 310 987 6543',
    email: 'david.ech@outlook.com',
    registeredAt: '2026-10-20T14:15:00Z',
    stamps: 9,
    totalCompletedCycles: 0,
    totalVisits: 9,
    lastVisitAt: '2026-11-07T07:15:00Z',
    notes: '¡A solo 1 sello de su recompensa!',
  },
  {
    id: 'std_03',
    token: 'sofia-morales-yoga',
    name: 'Sofía Morales',
    phone: '+57 315 223 8899',
    email: 'sofia.morales@gmail.com',
    registeredAt: '2026-11-01T10:00:00Z',
    stamps: 3,
    totalCompletedCycles: 0,
    totalVisits: 3,
    lastVisitAt: '2026-11-09T19:00:00Z',
    notes: 'Miembro nuevo',
  },
  {
    id: 'std_04',
    token: 'alejandro-vega-yoga',
    name: 'Alejandro Vega',
    phone: '+57 318 445 1122',
    registeredAt: '2026-09-15T08:00:00Z',
    stamps: 10,
    totalCompletedCycles: 2,
    totalVisits: 30,
    lastVisitAt: '2026-11-10T08:00:00Z',
    notes: '¡Listo para canjear premio de 10 sellos!',
  },
];

export const INITIAL_TRANSACTIONS: StampTransaction[] = [
  {
    id: 'tx_01',
    studentId: 'std_01',
    studentName: 'Camila Restrepo',
    timestamp: '2026-11-08T18:30:00Z',
    cashierName: 'Recepción - Valentina',
    type: 'ADD_STAMP',
    stampsAdded: 1,
    resultingStamps: 7,
    note: 'Clase Vinyasa Flow 6:30 PM',
  },
  {
    id: 'tx_02',
    studentId: 'std_02',
    studentName: 'David Echeverry',
    timestamp: '2026-11-07T07:15:00Z',
    cashierName: 'Recepción - Valentina',
    type: 'ADD_STAMP',
    stampsAdded: 1,
    resultingStamps: 9,
    note: 'Clase Hatha Pranayama 7:00 AM',
  },
  {
    id: 'tx_03',
    studentId: 'std_04',
    studentName: 'Alejandro Vega',
    timestamp: '2026-11-10T08:00:00Z',
    cashierName: 'Recepción - Mateo',
    type: 'ADD_STAMP',
    stampsAdded: 1,
    resultingStamps: 10,
    note: 'Clase Ashtanga vigorosa',
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
