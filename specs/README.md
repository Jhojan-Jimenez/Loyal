# Spec-Driven Development (SDD) — Loyal Platform

Bienvenido al sistema de desarrollo guiado por especificaciones (**Spec-Driven Development**) de **Loyal**.

---

## 📜 Los 4 Mandamientos de SDD en este Proyecto

1. **Ninguna línea de código se escribe sin una SPEC aprobada:**  
   Antes de modificar un componente, endpoint o modelo, debe existir o actualizarse un archivo `.md` en este directorio `specs/`.
2. **La SPEC es el Contrato Sagrado:**  
   Define interfaces TypeScript, endpoints HTTP, estados de UI, errores esperados y criterios de aceptación. Si el código diverge de la SPEC, el código está mal.
3. **Separación de Responsabilidades por Agentes:**  
   - **Frontend Artisan Agent:** Lee las especificaciones de UI/UX, estados visuales y contratos de props.
   - **Backend & Systems Agent:** Lee los contratos de API, schemas de base de datos, seguridad criptográfica y servicios externos (Google Wallet).
4. **Verificación Estricta:**  
   Cada SPEC incluye una matriz de pruebas que debe cumplirse al 100% antes de desplegar a producción.

---

## 🗂️ Índice de Especificaciones

| Código | Título | Estado | Agente Principal |
| :--- | :--- | :--- | :--- |
| **[SPEC-001](file:///home/claude/Workspace/Portafolio/CV/Projects/loyal/specs/001-core-system.md)** | Arquitectura Base, Google Wallet & Sincronización Realtime | **Aprobado / Producción** | Backend & Frontend |
| **[SPEC-TEMPLATE](file:///home/claude/Workspace/Portafolio/CV/Projects/loyal/specs/SPEC-TEMPLATE.md)** | Plantilla Oficial para Nuevas Especificaciones | **Estándar** | Todos |

---

## 🔄 Flujo de Trabajo para Nuevas Funcionalidades

```
[Idea / Requerimiento]
       │
       ▼
1. Crear specs/00X-<nombre>.md (usando SPEC-TEMPLATE.md)
       │
       ▼
2. Revisar y validar contratos (Frontend & Backend)
       │
       ▼
3. Implementación guiada por agentes especializados
   ├─► Backend Agent: Endpoints, persistencia, validaciones
   └─► Frontend Agent: UI pixel-perfect, feedback táctil, componentes
       │
       ▼
4. Verificación local (npm run build)
       │
       ▼
5. Commit + Push ➔ Despliegue automático en Coolify
```
