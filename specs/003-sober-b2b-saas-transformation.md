# SPEC-003: Universal B2B SaaS Transformation & Ultra-Sober Minimalist UI

* **Autor:** loyal-frontend-artisan & loyal-backend-engineer
* **Fecha:** 2026-11-13
* **Estado:** Aprobado para Implementación
* **Agentes Responsables:**
  - `loyal-frontend-artisan`: Rediseño visual completo a estética B2B sobria monocromática (blanco, negro, grises), eliminación total del tema yoga/mandalas/loto, maquetación de hero SaaS, tarjeta digital ejecutiva y sección de planes por suscripción.
  - `loyal-backend-engineer`: Preservación de toda la infraestructura técnica: Google Wallet API, almacenamiento en servidor, sincronización en tiempo real y endpoints de escaneo.

---

## 1. 🎯 Objetivo y Contexto de Negocio
Transformar **Loyal** de un prototipo enfocado exclusivamente en un estudio de yoga a una **plataforma SaaS B2B universal de fidelización digital**.

### 1.1 Premisas Clave
1. **Público Objetivo:** Cualquier comercio o negocio de servicios (Cafés, Barberías, Boutiques, Restaurantes, Spas, Gimnasios, Estudios, Retail).
2. **Modelo de Negocio:** Suscripción mensual / anual (SaaS multi-negocio con planes Starter, Pro y Enterprise).
3. **Estética Visual:** **100% Sobria, Minimalista y Monocromática**. Inspirada en la sobriedad ejecutiva de Vercel, Linear y Stripe: fondos blancos limpios, negros profundos, escala de grises sutil, bordes nítidos (`border-neutral-200` / `border-neutral-800`), sin colores pastel ni elementos lúdicos.
4. **Preservación Funcional:** Conservar intacta la lógica de emisión de tarjetas, acumulación de sellos (0 a 10), ciclos de recompensa, escáner QR, soporte NFC y generación de pases nativos para **Google Wallet**.

---

## 2. 🎨 Sistema de Diseño Sobrio Monocromático (Frontend Artisan)

### 2.1 Paleta de Color
* **Fondo Principal:** `#FFFFFF` (Blanco puro) con secciones alternadas en `#F8FAFC` o `#FAFAFA` (Gris frío levísimo).
* **Fondo Tarjeta / Acentos:** `#09090B` / `#18181B` (Negro carbón mate de alta gama) y `#FFFFFF`.
* **Texto Primario:** `#09090B` (Negro casi puro, alto contraste).
* **Texto Secundario:** `#71717A` / `#52525B` (Zinc / Slate neutro balanceado).
* **Bordes y Divisores:** `#E4E4E7` (Borde sutil en modo claro) y `#27272A` (Borde en superficies oscuras).
* **Eliminación Total:** Desaparecen todos los tonos lilas, fucsias, morados (`#FFF5F5`, `#C084FC`, `#7e22ce`), iconos de flor de loto, mandalas y figuras de yoga.

### 2.2 Componentes Clave a Rediseñar

1. **Header / Navbar:**
   - Marca: `Loyal` con isotipo geométrico minimalista en negro.
   - Tagline: `Digital Loyalty Cards & Passes for Business`.
   - Navegación: `Producto`, `Cómo Funciona`, `Planes`, `Escáner`, `Demo`.
   - CTAs: `Panel Admin` (outline sobrio) y `Empezar Gratis` (botón negro con texto blanco).

2. **Hero Section (100% Viewport):**
   - Headline B2B directo:
     ```
     TARJETAS DE SELLOS DIGITALES
     PARA TU NEGOCIO
     ```
   - Subtítulo:
     *"Reemplaza las tarjetas de cartón con pases inteligentes en Google Wallet. Fideliza a tus clientes, escanea con cualquier celular y premia la recurrencia sin apps pesadas."*
   - CTAs: `Crear Tarjeta Demo` (abre modal de emisión) y `Abrir Escáner de Mostrador` (`/scanner`).
   - Métricas B2B / Badges: `100% Sin descargas de apps`, `Google Wallet Certificado`, `Listo para Mostradores`.
   - Mockup Visual: Demostración interactiva en código de un pase digital moderno con sellos táctiles.

3. **Tarjeta de Sellos Digital (`LoyaltyCard.tsx`):**
   - Acabado "Black Card" / Membresía Ejecutiva: fondo negro mate degradado (`#121214` a `#09090B`), bordes de precisión milimétrica, logotipo de tienda customizable, ranuras de sellos con números sobrios y estrellas/checks minimalistas al marcar asistencia.
   - Pestañas sobrias: `Pase Digital`, `Información del Local`, `Google Wallet & PWA`.

4. **Sección de Planes y Suscripción (SaaS):**
   - Presentación de 3 niveles de suscripción:
     - **Starter:** $0 / mes (Hasta 100 miembros, 1 mostrador, Google Wallet).
     - **Pro (Recomendado):** $29 USD / mes o $79.000 COP / mes (Miembros ilimitados, analíticas, múltiples mostradores, logo de negocio personalizado, soporte prioritario).
     - **Enterprise:** Personalizado (API REST, integración con TPV/POS, soporte SLA, NFC dedicado).

5. **Modal de Registro & Vistas de Soporte:**
   - Adaptación a estilos monocromáticos sobrios (inputs neutrales, botones negros, tipografía sans limpia).

---

## 3. ⚙️ Integridad Técnica del Backend (Backend Engineer)
* Endpoints intactos:
  - `GET /api/db`
  - `POST /api/students/register`
  - `POST /api/students/stamp`
  - `POST /api/students/redeem`
  - `POST /api/wallet/google`
* Sincronización multi-dispositivo con polling en `LoyalContext.tsx`.
* Compatibilidad total con escáner QR de recepción (`/scanner`).

---

## 4. ✅ Criterios de Aceptación
- [ ] Cero menciones a "Yoga", "Samyama", "Mandalas" o posturas en la UI pública.
- [ ] Paleta estrictamente sobria en blanco, negro y escala de grises.
- [ ] Hero mantiene la regla del 100% del viewport visible restando el header.
- [ ] La tarjeta de sellos luce profesional para cualquier tipo de negocio.
- [ ] Sección de planes de suscripción visible y clara.
- [ ] Google Wallet y escáner funcionan al 100%.
- [ ] Compilación limpia con `npm run build` sin errores.
