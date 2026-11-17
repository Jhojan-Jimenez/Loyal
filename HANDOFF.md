# 📋 HANDOFF — Loyal Multi-Tenant SaaS Platform

> **Documento de Entrega y Continuidad Técnica**  
> **Fecha:** 17 de Noviembre de 2026  
> **Para:** Siguiente sesión de desarrollo con Antigravity / Claude  
> **Repositorio:** `/home/claude/Workspace/Portafolio/CV/Projects/loyal`  
> **Despliegue Producción:** `https://loyal.jhojan.cloud` (Coolify en Oracle Cloud ARM64)

---

## 🧭 1. Resumen Ejecutivo & Contexto

Loyal nació como un MVP de tarjeta de sellos digitales para un estudio de yoga (*Samyama Yoga*). En las sesiones más recientes, el proyecto se transformó en una **plataforma SaaS Multi-Tenant pura**, donde cualquier comercio local (cafeterías, gimnasios, panaderías, bares saludables, peluquerías) puede tener su propio programa de fidelización con tarjetas PWA y pases para Google Wallet.

En la última sesión se resolvieron dos bloqueadores críticos de infraestructura y persistencia:
1. **Invalidación de caché en memoria:** `server-db.ts` ahora detecta en tiempo real cambios en disco mediante `fs.statSync(dbPath).mtimeMs`.
2. **Persistencia Docker en Coolify:** Se montó el volumen `ipnl7ythcgw7llxvqazgfqvk-loyal-data` en `/app/data/`, garantizando que la base de datos `loyal-db.json` sobreviva a cualquier reinicio o redepliegue.

Sin embargo, **el flujo operativo tiene fallas de arquitectura de navegación y experiencia de usuario que deben ser pulidas en la próxima sesión**. Este documento detalla con exactitud qué se hizo, qué fallas existen y la hoja de ruta para resolverlas.

---

## ✅ 2. Estado Actual: Lo que ya funciona y está verificado

* **Temática Unificada Fusion:**
  - Estética minimalista con tonos Warm Stone (`#FDFBF7`), verde oliva artesanal (`#5B6F00`) y tipografía editorial (`Libre Baskerville` + `DM Sans`).
  - Se eliminaron selectores de diseño obsoletos de `main`.
* **Consola SuperAdmin (`/superadmin`):**
  - Acceso restringido al SuperAdmin de la plataforma (`jhojanjimene@gmail.com` / `loyal2026`).
  - Formulario para dar de alta nuevos comercios con nombre, slug, categoría, datos del dueño y tarifa mensual COP.
  - Generación de **Magic Activation Links** con token criptográfico válido por 7 días (`/invite/activate?token=...`).
* **Activación de Comercios (`/invite/activate`):**
  - El dueño del negocio abre el link, define su contraseña y nombre.
  - El sistema crea su cuenta de usuario, lo asigna con rol `OWNER` de su tenant y lo redirige automáticamente a su panel.
* **Comercio Piloto Activo en Producción:**
  - **Negocio:** *Fit Bar*
  - **Slug:** `fit-bar`
  - **Dueña:** *Juliana* (`test@gmail.com` / `loyal2026`)
  - **Panel Admin:** `https://loyal.jhojan.cloud/fit-bar/admin` (HTTP 200 OK)
  - **Escáner Mostrador:** `https://loyal.jhojan.cloud/fit-bar/scanner` (HTTP 200 OK)

---

## ⚠️ 3. Diagnóstico de Errores y Fallas en el Flujo Actual

A pesar de que el backend y la base de datos están operativos, **el flujo de usuario tiene las siguientes inconsistencias críticas**:

### 🔴 Falla 1: Colisión de Navegación y Doble Header (Layout Global)
* **El Problema:** En `src/app/layout.tsx`, el componente `<Navigation />` está montado a nivel global en el `RootLayout`. Al mismo tiempo, `src/app/page.tsx` monta su propio `<FusionNavigation />`.
* **Impacto:**
  - En la página principal (`/`) o en rutas como `/[slug]/admin` y `/superadmin`, se muestran barras de navegación superpuestas o enlaces genéricos que no corresponden a la sesión activa.
  - Un cajero en `/[slug]/scanner` o un administrador en `/[slug]/admin` ve botones de la landing pública ("Precios", "Comercios", "Pase Digital"), distrayendo de la operativa diaria.
* **Solución requerida:**
  - Separar layouts o aplicar un guard estricto: la landing pública `/` usa su navbar de marketing, mientras que `/[slug]/admin`, `/[slug]/scanner` y `/superadmin` usan un **App Shell limpio y sin distracciones**, con logo del comercio, estado de conexión y botón de salir.

---

### 🔴 Falla 2: Flujo de Incorporación de Clientes por Comercio (`/[slug]` o `/[slug]/join`)
* **El Problema:** Actualmente, la landing principal `/` tiene un modal de "Crear Tarjeta Demo", pero **no existe un flujo para que un cliente real de Fit Bar se registre en Fit Bar**.
* **Impacto:** Si un cliente escanea un código QR en la barra de Fit Bar, no tiene una página donde ingresar su nombre y teléfono para obtener su tarjeta vinculada a Fit Bar.
* **Solución requerida:**
  - Implementar la ruta pública `/[slug]` (o `/[slug]/join`):
    - Muestra la marca del negocio (ej. *Fit Bar*), su logo o inicial, y su promesa de valor ("Acumula 10 visitas y recibe un batido de proteína gratis").
    - Formulario ultra simple: Nombre y Teléfono (WhatsApp).
    - Botón: "Obtener mi Tarjeta de Sellos".
    - Genera la tarjeta con token personal y la abre de inmediato en `/card/[token]`, con botón listo para "Guardar en Google Wallet".

---

### 🔴 Falla 3: Aislamiento Estricto de Clientes y Sellos por Tenant (`tenantId`)
* **El Problema:** En `src/lib/server-db.ts`, los arreglos de `students` y `transactions` contienen registros históricos que en algunos métodos no validan estrictamente el `tenantId`.
* **Impacto:** Riesgo de que los clientes o sellos de un comercio se listen en el panel de otro comercio si no se filtra explícitamente por `tenantId`.
* **Solución requerida:**
  - Asegurar que todas las funciones de consulta y mutación (`getStudentsServer`, `addStampServer`, `redeemRewardServer`, `getStatsServer`) requieran y filtren obligatoriamente por `tenantId`.

---

### 🔴 Falla 4: Experiencia del Escáner en Mostrador (`/[slug]/scanner`)
* **El Problema:** El escáner actual fue diseñado para Samyama Yoga y aún conserva textos o estados del flujo anterior.
* **Impacto:** En un mostrador con clientes en fila, el cajero necesita:
  - Desbloqueo rápido por PIN de 4 dígitos (`0000` por defecto).
  - Escaneo instantáneo por cámara frontal/trasera con sonido de confirmación (Web Audio API) y vibración háptica.
  - Opción de búsqueda manual por número de teléfono cuando el cliente tiene la pantalla rota o sin batería.
  - Botón grande de "+1 Sello" y alerta clara si el cliente completó la recompensa intermedia (5 sellos) o final (10 sellos).

---

### 🔴 Falla 5: Personalización y Descarga del QR de Mostrador (`/[slug]/admin`)
* **El Problema:** El dueño del comercio no tiene una forma sencilla de imprimir su código QR para colocarlo en la barra o mostrador.
* **Impacto:** El dueño tiene que pedirle al desarrollador que le envíe el QR.
* **Solución requerida:**
  - En `/[slug]/admin`, crear una pestaña o tarjeta destacada: **"Tu QR de Mostrador"**.
  - Muestra el QR que apunta a `https://loyal.jhojan.cloud/[slug]/join`.
  - Botón: "Descargar Cartel para Mostrador (PDF/PNG)", listo para imprimir con diseño elegante Fusion y el nombre del comercio.

---

### 🔴 Falla 6: Gestión de Comercios desde SuperAdmin
* **El Problema:** Si un dueño pierde el enlace de invitación, el SuperAdmin no tiene botón para regenerar o copiar el enlace de nuevo. Tampoco hay visualización del total de clientes activos por comercio.
* **Solución requerida:**
  - Agregar botón "Reenviar / Copiar Enlace Mágico" en la tabla de comercios de `/superadmin`.
  - Mostrar métricas agregadas reales: Comercios activos, total sellos emitidos en la plataforma, total clientes registrados.

---

## 🗺️ 4. Hoja de Ruta Paso a Paso para la Próxima Conversación

| Fase | Tarea Principal | Archivos Clave |
| :--- | :--- | :--- |
| **Fase 1** | **Limpieza de Layouts y Navegación:** Suprimir el navbar de marketing en `/superadmin`, `/[slug]/admin` y `/[slug]/scanner`. Crear un layout limpio para apps internas. | `src/app/layout.tsx`, `src/components/Navigation.tsx`, `src/components/fusion/FusionNavigation.tsx` |
| **Fase 2** | **Página de Registro Público del Cliente:** Crear `src/app/[slug]/join/page.tsx` para que los clientes se registren en el negocio específico y obtengan su pase digital al instante. | `src/app/[slug]/join/page.tsx`, `src/lib/server-db.ts` |
| **Fase 3** | **Blindaje de Aislamiento Multi-Tenant:** Auditar todos los endpoints de `api/students/**` para que reciban y filtren por `tenantId` estricto. | `src/lib/server-db.ts`, `src/app/api/students/**` |
| **Fase 4** | **Pulido del Escáner de Mostrador:** Revalidar el flujo de escaneo rápido, feedback sonoro, búsqueda por teléfono y PIN de cajero. | `src/app/[slug]/scanner/page.tsx`, `src/components/fusion/FusionScannerTerminal.tsx` |
| **Fase 5** | **Kit Imprimible de Mostrador en Admin:** Generador de cartel QR descargable en el panel de administración. | `src/app/[slug]/admin/page.tsx`, `src/components/fusion/FusionAdminDashboard.tsx` |

---

## 🔑 5. Datos y Credenciales de Referencia Rápida

* **Servidor OCI:** `157.151.203.203` (SSH: `ssh -i ~/.ssh/oracle-key ubuntu@157.151.203.203`)
* **Coolify App UUID:** `ipnl7ythcgw7llxvqazgfqvk`
* **Volumen Persistente:** `ipnl7ythcgw7llxvqazgfqvk-loyal-data` en `/app/data/loyal-db.json`
* **SuperAdmin:** `jhojanjimene@gmail.com` / `loyal2026` -> `/superadmin`
* **Comercio Piloto (Fit Bar):** `test@gmail.com` / `loyal2026` -> `/fit-bar/admin`
* **Escáner Mostrador Fit Bar:** `/fit-bar/scanner` (PIN: `0000`)
* **Comando para compilar localmente:** `pnpm build`
* **Comando para desplegar:** `git push origin main` (Coolify detecta el push y despliega automáticamente vía rolling update con cero tiempo de inactividad).
