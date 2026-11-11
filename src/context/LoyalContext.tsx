'use client';

import React, { createContext, useContext, useEffect, useState, useTransition, useCallback } from 'react';
import { Student, StampTransaction, StudioConfig, YogaClass } from '@/lib/types';
import {
  DEFAULT_STUDIO_CONFIG,
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLASSES,
} from '@/lib/store';

interface LoyalContextType {
  students: Student[];
  transactions: StampTransaction[];
  config: StudioConfig;
  classes: YogaClass[];
  isLoaded: boolean;
  getStudentByToken: (token: string) => Student | undefined;
  getStudentById: (id: string) => Student | undefined;
  registerStudent: (name: string, phone: string, email?: string) => Student;
  addStamp: (token: string, note?: string, cashierName?: string) => { success: boolean; student?: Student; rewardUnlocked: boolean; error?: string };
  redeemReward: (token: string, cashierName?: string) => { success: boolean; student?: Student; error?: string };
  updateConfig: (newConfig: Partial<StudioConfig>) => void;
  resetDemoData: () => void;
  refreshFromServer: () => Promise<void>;
}

const LoyalContext = createContext<LoyalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'loyal_yoga_students_v1',
  TRANSACTIONS: 'loyal_yoga_txs_v1',
  CONFIG: 'loyal_yoga_config_v1',
  CLASSES: 'loyal_yoga_classes_v1',
};

export function LoyalProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<StampTransaction[]>(INITIAL_TRANSACTIONS);
  const [config, setConfig] = useState<StudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [classes, setClasses] = useState<YogaClass[]>(INITIAL_CLASSES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, startTransition] = useTransition();

  // Function to pull latest state from central server DB
  const refreshFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/db', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.students)) {
            setStudents(data.students);
          }
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }
          if (data.config) {
            setConfig(data.config);
          }
          if (Array.isArray(data.classes)) {
            setClasses(data.classes);
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }, []);

  // 1. Initial Load: Read from localStorage first (for instant paint), then sync with server
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      const savedClasses = localStorage.getItem(STORAGE_KEYS.CLASSES);

      if (savedStudents) setStudents(JSON.parse(savedStudents));
      if (savedTxs) setTransactions(JSON.parse(savedTxs));
      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedClasses) setClasses(JSON.parse(savedClasses));
    } catch (e) {
      console.warn('Could not read from localStorage, using initial values:', e);
    } finally {
      setIsLoaded(true);
    }

    // Immediately fetch fresh truth from server
    refreshFromServer();

    // 2. Poll server every 3.5s for real-time multi-device sync (e.g. phone registers, laptop sees it)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshFromServer();
      }
    }, 3500);

    const onFocus = () => refreshFromServer();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refreshFromServer]);

  // Save changes to localStorage as local cache
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [students, transactions, config, classes, isLoaded]);

  const getStudentByToken = (token: string) => {
    return students.find((s) => s.token.toLowerCase() === token.toLowerCase().trim());
  };

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id);
  };

  const registerStudent = (name: string, phone: string, email?: string): Student => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const token = `${slug}-${randomSuffix}`;

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

    startTransition(() => {
      setStudents((prev) => [newStudent, ...prev]);
    });

    // Send to server DB to persist across all devices
    fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newStudent.name,
        phone: newStudent.phone,
        email: newStudent.email,
        token: newStudent.token,
      }),
    }).catch((err) => console.warn('[LoyalContext] Server register sync error:', err));

    return newStudent;
  };

  const addStamp = (
    token: string,
    note: string = 'Asistencia a clase regular',
    cashierName: string = 'Recepción Estudio'
  ) => {
    const student = getStudentByToken(token);
    if (!student) {
      return { success: false, rewardUnlocked: false, error: 'Alumno no encontrado con este código' };
    }

    const currentStamps = student.stamps;
    const maxStamps = config.totalStampsRequired;

    if (currentStamps >= maxStamps) {
      return {
        success: false,
        student,
        rewardUnlocked: true,
        error: 'El alumno ya tiene su tarjeta completa lista para canjear.',
      };
    }

    const newStamps = currentStamps + 1;
    const isUnlocked = newStamps >= maxStamps;
    const now = new Date().toISOString();

    const updatedStudent: Student = {
      ...student,
      stamps: newStamps,
      totalVisits: student.totalVisits + 1,
      lastVisitAt: now,
    };

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      timestamp: now,
      cashierName,
      type: 'ADD_STAMP',
      stampsAdded: 1,
      resultingStamps: newStamps,
      note,
    };

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setTransactions((prev) => [newTx, ...prev]);

    // Haptic vibration feedback if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 40, 80]);
      } catch {}
    }

    // Sync with server DB AND update Google Wallet over-the-air in real-time
    fetch('/api/students/stamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, note, cashierName }),
    }).catch((err) => console.warn('[LoyalContext] Server stamp sync warning:', err));

    return {
      success: true,
      student: updatedStudent,
      rewardUnlocked: isUnlocked,
    };
  };

  const redeemReward = (token: string, cashierName: string = 'Recepción Estudio') => {
    const student = getStudentByToken(token);
    if (!student) {
      return { success: false, error: 'Alumno no encontrado' };
    }

    if (student.stamps < config.totalStampsRequired) {
      return {
        success: false,
        error: `Faltan ${config.totalStampsRequired - student.stamps} clases para completar la recompensa`,
      };
    }

    const now = new Date().toISOString();
    const updatedStudent: Student = {
      ...student,
      stamps: 0,
      totalCompletedCycles: student.totalCompletedCycles + 1,
      lastVisitAt: now,
    };

    const newTx: StampTransaction = {
      id: `tx_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      timestamp: now,
      cashierName,
      type: 'REDEEM_REWARD',
      resultingStamps: 0,
      note: `Recompensa canjeada: ${config.currentRewardTitle}`,
    };

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setTransactions((prev) => [newTx, ...prev]);

    // Sync with server DB AND reset Google Wallet over-the-air
    fetch('/api/students/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        notes: `Recompensa canjeada: ${config.currentRewardTitle}`,
        cashierName,
      }),
    }).catch((err) => console.warn('[LoyalContext] Server redeem sync warning:', err));

    return { success: true, student: updatedStudent };
  };

  const updateConfig = (newConfig: Partial<StudioConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setConfig(DEFAULT_STUDIO_CONFIG);
    setClasses(INITIAL_CLASSES);
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      localStorage.removeItem(STORAGE_KEYS.CLASSES);
    } catch {}
  };

  return (
    <LoyalContext.Provider
      value={{
        students,
        transactions,
        config,
        classes,
        isLoaded,
        getStudentByToken,
        getStudentById,
        registerStudent,
        addStamp,
        redeemReward,
        updateConfig,
        resetDemoData,
        refreshFromServer,
      }}
    >
      {children}
    </LoyalContext.Provider>
  );
}

export function useLoyal() {
  const context = useContext(LoyalContext);
  if (!context) {
    throw new Error('useLoyal must be used within a LoyalProvider');
  }
  return context;
}
