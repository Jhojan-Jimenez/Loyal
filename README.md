# 🪷 Loyal — PWA de Fidelización y Pase de Clases para Estudios de Yoga

Sistema moderno, mobile-first y sin fricción de fidelización y sellos de clases diseñado para estudios de Yoga y centros de bienestar (**Samyama Yoga**). 

Inspirado en la simplicidad de pases digitales como Loopy Loyalty, pero **eliminando el vendor lock-in** (exportación libre de datos en CSV/Excel) y **sin costos de suscripción de tiendas de apps ni pagos obligatorios a Apple** ($0 USD de costo operativo en PWA).

---

## 🎨 Guía de Estilo Visual
Basado fielmente en la paleta y composición del concepto de arte Zen:
* **Colores Primarios:** Lavanda (`#FAF5FF`), Amatista (`#7E22CE`), Violeta Imperial (`#4A154B`) y Fucsia Floral (`#C026D3`).
* **Elementos:** Ilustraciones y geometrías de Mandalas y Flores de Loto 🪷, bordes orgánicos suaves, tarjetas con efecto cristal (*glassmorphism*) y feedback háptico/sonoro.

---

## 🚀 Arquitectura y Módulos

1. **📱 Tarjeta Digital del Alumno (`/card/[token]`):**
   * Vista de tarjeta física virtual con 10 casillas de clases.
   * Iconos de loto iluminados con halo de luz para asistencias completadas.
   * Código QR dinámico de alta resolución para mostrar en recepción.
   * Información del estudio: Red y clave de Wi-Fi, ubicación en Google Maps y contacto por WhatsApp.
   * Instalable como PWA en iPhone (Safari) y Android (Chrome) sin App Store.

2. **📷 Terminal de Recepción / Escáner (`/scanner`):**
   * Lector de códigos QR en tiempo real con la cámara del dispositivo móvil o tablet de recepción (`html5-qrcode`).
   * Búsqueda manual por nombre o WhatsApp en caso de que el alumno no tenga el celular a mano.
   * Botón táctil grande `[ +1 Clase Asistida ]` con campanada zen y vibración háptica.
   * Al alcanzar las 10 clases: ¡Efecto de confeti festivo y botón de `[ Canjear Taller / Mat de Regalo ]`!
   * Registro de auditoría con las últimas asistencias de la jornada.

3. **🧘 Menú de Clases & Horario Semanal (`/schedule`):**
   * Catálogo interactivo de prácticas: *Vinyasa Flow, Hatha Yoga, Yin Yoga, Kundalini y Meditación con Cuencos*.
   * Nivel, intensidad, horarios, instructor y botón directo para reservar mat por WhatsApp.

4. **⚙️ Panel de Control & Exportación Libre (`/admin`):**
   * Métricas en tiempo real: Alumnos inscritos, asistencias totales, premios entregados y porcentaje de retención.
   * **Superpoder frente a Loopy Loyalty:** Botones de descarga directa en un clic de **Base de Alumnos (CSV)** y **Auditoría de Asistencias (CSV)** sin planes caros de $95 USD.
   * Configuración flexible de la meta de sellos, títulos de recompensas y datos del estudio.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js 16 (App Router, Turbopack, React 19, TypeScript).
* **Estilos:** Tailwind CSS v4 + variables HSL con soporte PWA.
* **Iconos & Animaciones:** Lucide React + Canvas Confetti + SVGs de Geometría Sagrada (Mandala).
* **Escaneo QR & Renderizado:** `html5-qrcode` + `qrcode.react`.
* **Despliegue:** Dockerfile multi-stage optimizado para Coolify (ARM64 / x86_64) o Vercel.

---

## 💻 Ejecución Local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Servidor de desarrollo
pnpm dev

# 3. Compilación de producción
pnpm build
pnpm start
```

---

## ☁️ Despliegue con Docker / Coolify

El proyecto incluye un `Dockerfile` standalone de producción y `docker-compose.yml`:
1. En **Coolify**, crea una nueva aplicación seleccionando **Git Repository**: `https://github.com/Jhojan-Jimenez/Loyal.git`.
2. Tipo de compilación: **Dockerfile**.
3. Puerto expuesto: `3000`.
4. Asigna tu subdominio (ej: `https://yoga.jhojan.cloud`) con SSL automático vía Let's Encrypt.
