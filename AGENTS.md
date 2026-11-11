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

## 🧠 Orquestación Autónoma Multi-Agente (Swarm & Subagents)

En este proyecto, **el usuario actúa como Product Owner / Director** y NO tiene que microgestionar a cada agente manualmente. 

Cuando el usuario pide una funcionalidad o cambio en lenguaje natural:
1. **El Coordinador (Antigravity)** asume la dirección técnica y redacta/actualiza la especificación en `specs/00X-<nombre>.md`.
2. **Despliegue Autónomo de Agentes:** El coordinador convoca y activa a los agentes especializados en paralelo o secuencia.
3. **Diálogo y Negociación Inter-Agente (Swarm Board / Messages):**
   - El agente de **Frontend** y el de **Backend** se comunican entre sí.
   - **Frontend** solicita contratos de datos: *"@backend necesito que el endpoint `/api/students/stamp` me retorne también si este sello desbloqueó el premio intermedio"*.
   - **Backend** responde con la firma de tipos: *"@frontend listo, he actualizado `src/lib/types.ts` con `intermediateRewardUnlocked: boolean` y el endpoint ya lo calcula"*.
   - Ambos agentes ajustan la SPEC colaborativamente si surgen casos borde.
4. **Verificación y Entrega:** El coordinador ejecuta `npm run build`, valida que ambos agentes hayan terminado sus tareas sin colisiones, hace commit + push y reporta el resultado en vivo al usuario.

---

## 🤖 Los Dos Agentes Especializados y sus Límites Estrictos

| Agente | Nombre | Jurisdicción Exclusiva | Qué NO puede tocar |
| :--- | :--- | :--- | :--- |
| **Backend & Sistemas** | `loyal-backend-engineer` | `src/lib/server-db.ts`, `src/lib/google-wallet.ts`, `src/app/api/**`, contratos TypeScript en `src/lib/types.ts`. Seguridad, criptografía, OAuth2 y llamadas REST a Google Wallet. | Componentes visuales (`src/components/**`), estilos CSS, animaciones. |
| **Frontend & UI/UX** | `loyal-frontend-artisan` | `src/components/**`, `src/app/**/page.tsx`, `src/context/LoyalContext.tsx`, Tailwind CSS, animaciones, sonidos Web Audio API y vibración. | Base de datos en disco (`server-db.ts`), claves privadas ni secrets. |

---

## 📜 Metodología: Spec-Driven Development (SDD)

1. Toda funcionalidad se diseña primero en `specs/` antes de escribir código ejecutable.
2. Las especificaciones definen contratos TypeScript, rutas de API, esquemas de payload, estados de UI y criterios de aceptación.
3. Antes de dar por terminado cualquier cambio, se verifica que `npm run build` compile con 0 errores y 0 warnings.

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
