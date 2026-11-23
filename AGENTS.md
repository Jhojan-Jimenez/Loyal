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

---

## 🧪 Pruebas Automatizadas (Vitest Gate en Build)

El proyecto cuenta con una suite de pruebas de *corner cases* y seguridad multi-tenant con **Vitest** (`vitest.config.mts`).

* **Ejecución manual en local:** `pnpm test`
* **Gate automático en producción:** El script `"build"` en `package.json` ejecuta **`vitest run && next build`**. Tanto en local como en la etapa `builder` del `Dockerfile` en Coolify, si alguna prueba falla, el despliegue se aborta automáticamente antes de reemplazar el contenedor en producción.
* **Aislamiento de BD:** Las pruebas crean un directorio temporal en `/tmp` y asignan `process.env.DATA_DIR` antes de importar `server-db.ts`, por lo que **nunca modifican** `data/loyal-db.json` ni la base de producción.

### Cómo agregar nuevos tests en el futuro
1. Crea un archivo `tests/<modulo>.test.ts` (o agrega casos `it(...)` dentro de `tests/corner-cases.test.ts`).
2. **Importante:** Define `process.env.DATA_DIR = fs.mkdtempSync(...)` **antes** de hacer `await import('@/lib/server-db')` o importar los Route Handlers (`/api/...`), y limpia la carpeta temporal en `afterAll(...)`.
3. Para probar rutas de API directamente sin levantar servidor HTTP, construye peticiones con `new NextRequest('http://localhost:3000/api/...', { method: 'POST', body: ..., headers: ... })` y firma cookies de prueba con `signSessionToken` de `@/lib/auth`.
4. Verifica ejecutando `pnpm test && pnpm build`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
