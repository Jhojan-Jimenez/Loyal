# SPEC-00X: [Título Corto de la Funcionalidad]

* **Autor:** [Nombre / Agente]
* **Fecha:** [YYYY-MM-DD]
* **Estado:** [Borrador | En Revisión | Aprobado | En Implementación | Completado]
* **Agentes Responsables:** [Frontend Artisan | Backend Engineer | Ambos]

---

## 1. 🎯 Objetivo y Contexto de Negocio
> ¿Qué problema resuelve esta funcionalidad y cuál es el beneficio para el dueño del negocio (estudio) y para el alumno?

---

## 2. 👤 Historias de Usuario (User Stories)
* **Como** [tipo de usuario: alumno | recepcionista | dueño],
* **Quiero** [acción específica],
* **Para** [beneficio obtenido].

---

## 3. 📐 Contratos de Datos & Arquitectura (Backend Agent)

### 3.1 Modelos de Datos (TypeScript)
```typescript
export interface ExampleModel {
  id: string;
  // Campos con tipos estrictos
}
```

### 3.2 Endpoints HTTP (API Contracts)
* **Método y Ruta:** `POST /api/example`
* **Request Body:**
  ```json
  {
    "field": "value"
  }
  ```
* **Response Success (200 OK):**
  ```json
  {
    "success": true,
    "data": {}
  }
  ```
* **Response Error (4xx/5xx):**
  ```json
  {
    "success": false,
    "error": "Mensaje legible"
  }
  ```

### 3.3 Integración con Google Wallet (si aplica)
* Cambios en la clase o en el objeto (Claims, Barcode, TextModulesData).

---

## 4. 🎨 Diseño Visual & Interacción (Frontend Artisan Agent)

### 4.1 Pantallas & Componentes Afectados
* Componente `X` en `src/components/...`
* Ruta de página `src/app/...`

### 4.2 Estados de la Interfaz (UI States)
* **Estado Inicial / Vacío (Empty):**
* **Estado de Carga (Loading / Skeleton):**
* **Estado de Éxito (Success / Micro-animación):**
* **Estado de Error (Error / Toast):**

### 4.3 Directrices de Estilo (Anti-Slop)
* Colores HSL / Tailwind (paleta orgánica del estudio).
* Tipografía y espaciado (móvil primero).
* Feedback háptico (`navigator.vibrate`) y sonidos sintetizados (Web Audio API).

---

## 5. 🛡️ Casos Borde y Seguridad
* ¿Qué pasa si no hay conexión a internet?
* ¿Qué pasa si el código QR está deteriorado o no coincide?
* ¿Cómo se previenen accesos no autorizados o inyecciones?

---

## 6. ✅ Matriz de Verificación y Criterios de Aceptación
- [ ] El comando `npm run build` compila con 0 errores y 0 warnings de Turbopack.
- [ ] Caso de uso A probado en dispositivo móvil.
- [ ] Caso de uso B probado en laptop/escáner.
- [ ] Base de datos persistida correctamente.
