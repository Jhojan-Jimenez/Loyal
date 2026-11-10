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
}

export interface YogaClass {
  id: string;
  title: string;
  instructor: string;
  days: string[]; // e.g. ["Lunes", "Miércoles", "Viernes"]
  time: string;   // e.g. "07:00 AM - 08:15 AM"
  style: 'Vinyasa Flow' | 'Hatha Yoga' | 'Yin Yoga' | 'Kundalini' | 'Meditación & Cuencos';
  level: 'Todos los niveles' | 'Intermedio' | 'Restaurativo suave';
  intensity: 'Suave' | 'Media' | 'Dinámica';
  description: string;
}
