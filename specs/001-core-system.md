# SPEC-001: Core Architecture, Google Wallet & Real-time State Synchronization

* **Estado:** Aprobado & Desplegado en Producción (`https://loyal.jhojan.cloud`)
* **Versión:** 1.0.0
* **Fecha:** 2026-11-10
* **Dominio:** Producción en OCI ARM64 (`157.151.203.203`) vía Coolify v4 & Traefik v3.6

---

## 1. 🎯 Objetivo del Sistema
Loyal es una plataforma PWA de fidelización y control de asistencias para estudios de yoga y bienestar boutique (*Samyama Yoga*). Provee emisión de tarjetas digitales web y pases nativos para **Google Wallet (Android)**, escáner de recepción en tiempo real con cámara web, y exportación de datos sin suscripciones abusivas (derrotando el paywall de $95 USD/mes de Loopy Loyalty).

---

## 2. 🏛️ Arquitectura General

```
[ Celular Alumno (Android) ]                 [ Laptop Recepción (Cámara) ]
       │                                                   │
       ├─► Google Wallet Nativo (JWT)                      ├─► Escáner QR (/scanner)
       └─► PWA Web Card (/card/[token])                    └─► Consola Admin (/admin)
                   │                                               │
                   └───────────────────┬───────────────────────────┘
                                       │ HTTPS (JSON / REST API)
                                       ▼
                       [ Servidor Next.js 16 (Coolify) ]
                                       │
                       ┌───────────────┴───────────────┐
                       ▼                               ▼
             [ Server DB (loyal-db.json) ]    [ Google Wallet Cloud API ]
             - Students (Alumnos)             - Issuer ID: 3388000000023224674
             - Transactions (Historial)       - Class: samyama_yoga_pass_v1
             - Studio Config (Reglas)         - Over-the-air PATCH updates
             - Classes (Horario)
```

---

## 3. 📐 Contratos de Datos & Endpoints (Backend)

### 3.1 Modelos Principales (`src/lib/types.ts`)
* **Student:**
  ```typescript
  export interface Student {
    id: string;                    // std_timestamp o std_01
    token: string;                 // slug-único (ej: test-carlitos-6yzi)
    name: string;
    phone: string;
    email?: string;
    registeredAt: string;          // ISO 8601
    stamps: number;                // 0 a 10
    totalCompletedCycles: number;  // Veces que ha completado 10 sellos
    totalVisits: number;
    lastVisitAt: string | null;
    notes?: string;
  }
  ```
* **StampTransaction:**
  ```typescript
  export interface StampTransaction {
    id: string;                    // tx_timestamp
    studentId: string;
    studentName: string;
    timestamp: string;
    cashierName: string;
    type: 'ADD_STAMP' | 'REDEEM_REWARD' | 'ADJUSTMENT';
    stampsAdded: number;
    resultingStamps: number;
    note?: string;
  }
  ```

### 3.2 Endpoints REST API
* `GET /api/db`: Retorna `{ success: true, students, transactions, config, classes }`. Polling cada 3.5s.
* `POST /api/students/register`:
  - Body: `{ name: string, phone: string, email?: string, token?: string }`
  - Response: `{ success: true, student: Student }`
* `POST /api/students/stamp`:
  - Body: `{ token: string, note?: string, cashierName?: string }`
  - Efectos colaterales: Suma +1 sello, registra transacción, y ejecuta PATCH a la API de Google Wallet.
  - Response: `{ success: true, student: Student, transaction: StampTransaction }`
* `POST /api/students/redeem`:
  - Body: `{ token: string, notes?: string, cashierName?: string }`
  - Efectos colaterales: Reinicia sellos a 0, incrementa `totalCompletedCycles`, ejecuta PATCH a Google Wallet.
* `POST /api/wallet/google`:
  - Body: `{ student: Student, config: StudioConfig }`
  - Response: `{ success: true, saveUrl: string }` (Enlace `https://pay.google.com/gp/v/save/<JWT>`)

### 3.3 Credenciales y Seguridad
* **Issuer ID:** `3388000000023224674`
* **Service Account:** `loyalapp@gen-lang-client-0692657115.iam.gserviceaccount.com`
* **Private Key:** RSA 2048-bit (Guardada en ENV de Coolify, NUNCA en Git).

---

## 4. 🎨 Especificación de UI/UX (Frontend)

* **Paleta de Color:**
  - Primario: Morado Zen `#7E22CE` / `#4A154B`
  - Fondo: Blanco puro `#FFFFFF` y lavanda orgánica `#FAF5FF`
  - Acentos: Fucsia `#C026D3` y Esmeralda `#059669`
* **Anti-Slop Design System:**
  - Sin gradientes genéricos de IA morado-azul.
  - Ilustraciones zen auténticas (`/images/yoga/`).
  - Ondas SVG orgánicas y mandalas geométricas decorativas.
  - Sonido auditivo sintetizado con Web Audio API (`playChime(true)` frecuencia C5 ➔ E5 ➔ G5) y vibración háptica (`navigator.vibrate([80, 40, 80])`).
* **Escáner QR:**
  - Motor: `html5-qrcode` con `facingMode: "environment"`, fps 10, y caja de 220x220 px.
  - Auto-limpieza de URLs para extraer el token limpio si el usuario escanea un link web.

---

## 5. ✅ Criterios de Aceptación Cumplidos
- [x] Registro instantáneo desde móvil con redirección automática a `/card/[token]`.
- [x] Emisión de pase firmado para Google Wallet nativo (Android).
- [x] Sincronización en tiempo real multi-dispositivo sin recargar la página.
- [x] Reconocimiento instantáneo de QR en laptop de recepción.
- [x] Actualización over-the-air de Google Wallet al estampar en la recepción.
- [x] Descarga de reportes CSV sin suscripciones.
