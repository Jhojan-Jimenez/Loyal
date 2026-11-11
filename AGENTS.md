# AGENTS.md — Loyal Platform Architecture & Operating Manual

Este documento es la **Memoria Maestra y Guía Operativa** para Antigravity y cualquier agente de IA que trabaje sobre este repositorio.

---

## 🎯 Perfil y Misión del Proyecto

* **Proyecto:** **Loyal** (Plataforma de Fidelización PWA + Google Wallet Pass)
* **Caso de Estudio / Cliente Piloto:** *Samyama Yoga & Wellness* (Bogotá, Colombia).
* **Stack Tecnológico:**
  - **Framework:** Next.js 16+ (Turbopack, App Router, React 19, TypeScript).
  - **Estilos:** Tailwind CSS v4 + Variables HSL (Estética Zen orgánica, fondo blanco puro, morado `#7E22CE`).
  - **Cámara & QR:** `html5-qrcode` + `qrcode.react`.
  - **Wallet Nativo:** Google Wallet API (Issuer ID: `3388000000023224674`, Service Account, JWT RS256, REST API over-the-air updates).
  - **Persistencia:** Base de datos central en servidor (`src/lib/server-db.ts`) con sincronización en tiempo real cliente-servidor.
  - **Despliegue:** Coolify v4 sobre Oracle Cloud ARM64 (`157.151.203.203`) en subdominio **`https://loyal.jhojan.cloud`**.
  - **Repositorio:** `git@github.com:Jhojan-Jimenez/Loyal.git` (rama `main`).

---

## 📜 Metodología Obligatoria: Spec-Driven Development (SDD)

En este repositorio **NO SE PROGRAMA NADA SIN UNA ESPECIFICACIÓN**:

1. Toda nueva funcionalidad debe iniciar creando o editando un archivo en `specs/00X-<nombre>.md` siguiendo la plantilla `specs/SPEC-TEMPLATE.md`.
2. Las especificaciones definen los contratos TypeScript, rutas de API, esquemas de payload, estados de UI y matriz de pruebas.
3. Antes de dar por terminado cualquier cambio, el agente debe verificar que `npm run build` compile con 0 errores y que los criterios de aceptación se cumplan.

---

## 🤖 Los Dos Agentes Especializados

Para mantener el código limpio y sin contaminación de responsabilidades, el trabajo se divide en dos roles estrictos:

### 1. `loyal-backend-engineer` (Backend, Datos y Sistemas)
* **Jurisdicción:** `src/lib/server-db.ts`, `src/lib/google-wallet.ts`, `src/app/api/**`, `src/lib/types.ts`.
* **Responsabilidad:** Lógica de negocio, base de datos en servidor, emisión de pases firmados, llamadas REST a Google Wallet, autenticación OAuth2 y seguridad.

### 2. `loyal-frontend-artisan` (Frontend, UI/UX y PWA)
* **Jurisdicción:** `src/components/**`, `src/app/**/page.tsx`, `src/context/LoyalContext.tsx`, estilos Tailwind, animaciones, sonidos Web Audio API y vibración.
* **Responsabilidad:** Diseño anti-slop, experiencia táctil móvil, escáner de cámara, feedback visual y consistencia estética zen.

---

## ⚡ Comandos Clave en Terminal

```bash
# Compilación limpia y verificación de tipos (Turbopack)
npm run build

# Servidor de desarrollo local
npm run dev

# Despliegue a producción (se ejecuta automáticamente al hacer push a main en Coolify)
git add .
git commit -m "feat(scope): descripción siguiendo la spec"
git push origin main
```
