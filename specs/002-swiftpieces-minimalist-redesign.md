# SPEC-002: Minimalist Zen Redesign & SwiftPieces Micro-interactions

* **Autor:** loyal-frontend-artisan & loyal-backend-engineer
* **Fecha:** 2026-11-11
* **Estado:** Aprobado para Implementación
* **Agentes Responsables:**
  - `loyal-frontend-artisan` (Maquetación 1:1, paleta, SVG orgánicos, SwiftPieces pills & navbar).
  - `loyal-backend-engineer` (Garantía de integridad de contratos y endpoints API).

---

## 1. 🎯 Objetivo y Contexto de Negocio
Rediseñar la interfaz de usuario de Loyal para adoptar una estética editorial minimalista, limpia y espaciosa inspirada en:
1. **Referencia Visual:** Ilustración orgánica Zen con pose *King Pigeon*, curvas onduladas lilas y estrellas geométricas multicolores (dorado, fucsia, rosa pastel) sobre fondo crema suave (`#FFF5F5`).
2. **Filosofía SwiftPieces (swiftpieces.com):** Componentes táctiles estilo iOS, botones redondeados en píldora (`rounded-full`), micro-animaciones con física de resorte, navbar flotante minimalista y eliminación total de "AI-slop" (textos genéricos sobrecargados).

---

## 2. 🎨 Especificación de Diseño & Paleta de Color (Frontend Artisan)

### 2.1 Tokens de Color Oficiales
* **Fondo Principal:** `#FFF5F5` / `#FAF4F0` (Crema rubor cálido y relajante).
* **Tipografía Primaria:** `#18181B` / `#111827` (Negro carbón profundo).
* **Tipografía Secundaria / Subtítulo:** `#71717A` / `#6B7280` (Gris neutro elegante).
* **Botón Principal (Pill):** `#C084FC` / `#A855F7` (Lavanda suave con texto blanco y hover sutil `#B46BF5`).
* **Líneas Orgánicas Onduladas (SVG):** `#C4B5FD` (Lila periwinkle con grosor de 2px y cuentas decorativas circulares).
* **Estrellas / Starbursts de 8 puntas:**
  - Estrella Dorada: `#F59E0B`
  - Estrella Fucsia / Magenta: `#C026D3`
  - Estrella Rosa Pastel: `#FBCFE8`

### 2.2 Componente Navbar Minimalista
* **Izquierda:** Logo Zen con estrella dorada/lotus + Tipografía elegante `Samyama` o `Loyal`.
* **Derecha:** Enlaces limpios y espaciados:
  - `Inicio`
  - `Horarios` (`/schedule`)
  - `Escaner` (`/scanner`)
  - `Admin` (`/admin`)
* **Botón Acción (CTA):** Píldora lavanda `"Crear Pase"` que abre el modal de registro rápido.

### 2.3 Estructura del Hero (Inspirada 1:1 en la imagen de referencia)
* **Columna Izquierda:**
  - Título Gigante con contraste tipográfico:
    ```
    YOGA
    PASES & BIENESTAR
    ```
  - Texto breve (2 a 3 líneas):
    *"Tu espacio sagrado de respiración y presencia. Acumula sellos en tus clases y canjea talleres exclusivos directo en tu Google Wallet."*
  - Botón Píldora: `"Comenzar ahora"` / `"Crear mi pase gratis"`.
* **Columna Derecha:**
  - Ilustración orgánica de gran escala de la yogi en postura *King Pigeon*.
  - Curvas onduladas SVG envolventes y estrellas geométricas flotantes.

---

## 3. 📐 Contratos de Datos & Backend (Backend Engineer)

El backend confirma que **NO HAY CAMBIOS DESTRUCTIVOS** en los endpoints:
* `GET /api/db`: Sigue proveyendo los datos de alumnos, transacciones y configuración.
* `POST /api/students/register`: Recibe `{ name, phone, email, token }` y retorna el nuevo alumno.
* `POST /api/students/stamp`: Suma sello y ejecuta el PATCH en tiempo real a Google Wallet.
* `POST /api/wallet/google`: Genera el enlace firmado de Google Wallet para Android.

---

## 4. ✅ Matriz de Verificación y Criterios de Aceptación
- [ ] Navbar limpio y minimalista según referencia visual.
- [ ] Fondo crema `#FFF5F5` uniforme en toda la aplicación.
- [ ] Curvas SVG orgánicas y estrellas geométricas decorativas.
- [ ] Tipografía ultra-bold para "YOGA" y ligera para el subtítulo.
- [ ] Botones píldora estilo SwiftPieces con feedback táctil `active:scale-95`.
- [ ] Todo el flujo de registro, pase web y Google Wallet sigue funcionando al 100%.
- [ ] `npm run build` compila con 0 errores de TypeScript y 0 warnings.
