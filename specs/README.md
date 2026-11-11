# Spec-Driven Development (SDD) — Loyal Platform

Bienvenido al sistema de desarrollo guiado por especificaciones (**Spec-Driven Development**) y **Orquestación Autónoma Multi-Agente** de **Loyal**.

---

## 🎯 ¿Cómo Funciona la Autonomía Multi-Agente?

Tú eres el **Director / Product Owner**. Solo tienes que describir tu idea o requerimiento:

```
                          [ USUARIO (Tú) ]
                                 │
                   "Quiero que los alumnos puedan
                    ver su ranking de clases y..."
                                 │
                                 ▼
                     [ COORDINADOR AUTÓNOMO ]
                                 │
               1. Redacta la SPEC (specs/00X.md)
               2. Divide el trabajo sin colisiones
               3. Despliega a los agentes especializados
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ loyal-backend-engineer ]     [ loyal-frontend-artisan ]
                 │                               │
                 │   ◄─── Diálogo Inter-Agente ──►│
                 │   "@backend: necesito este     │
                 │    campo en la respuesta"     │
                 │   "@frontend: listo, añadido   │
                 │    a src/lib/types.ts"        │
                 ▼                               ▼
       - Endpoints & DB                - Componentes & UI
       - Google Wallet APIs            - Micro-interacciones
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                     [ VERIFICACIÓN & ENTREGA ]
                     - npm run build (0 errores)
                     - Git commit + Push automático
                     - Desplegado en loyal.jhojan.cloud
```

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
