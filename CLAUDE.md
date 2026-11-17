# CLAUDE.md — Loyal Multi-Tenant SaaS Platform

Operating guide, architecture memory, and development standards for Claude and AI agents working on Loyal.

---

## 🎯 Project Overview & Mission

* **Product:** **Loyal** — Multi-Tenant Loyalty & Digital Stamp Card SaaS for Local Businesses (Cafes, Bakeries, Fitness, Wellness, Salons).
* **Live Production URL:** `https://loyal.jhojan.cloud`
* **Infrastructure:** Oracle Cloud Always Free (ARM64 Ampere Altra 4 OCPU, 24 GB RAM, Ubuntu 24.04).
* **Host / Reverse Proxy:** Coolify v4 + Traefik with automatic Let's Encrypt TLS.
* **Persistent Storage:** Docker named volume `ipnl7ythcgw7llxvqazgfqvk-loyal-data` mounted at `/app/data`.
* **Repository:** `git@github.com:Jhojan-Jimenez/Loyal.git` (Branch: `main`).
* **Active Pilot Business:** *Fit Bar* (Slug: `fit-bar`, Owner: `test@gmail.com`).

---

## 🛠️ Tech Stack & Tooling

* **Framework:** Next.js 16+ (App Router, Turbopack, React 19, TypeScript).
* **Styling & Design System:** Tailwind CSS v4 with **Fusion Aesthetic**:
  - Primary Accent: Olive Green (`#5B6F00`, dark `#4D5E00`, light tint `#F1F5DC`).
  - Canvas: Warm Stone (`#FDFBF7`), Card Surfaces (`#FFFFFF`), Borders (`#EAE4D5`).
  - Typography: Serif headers (`Libre Baskerville`), crisp sans body (`DM Sans`), mono for badges (`JetBrains Mono`).
* **Digital Pass & Camera:** `html5-qrcode` + `qrcode.react` + Google Wallet API (Issuer ID: `3388000000023224674`).
* **Session Security:** WebCrypto HMAC SHA-256 signed cookie (`loyal_session`), HTTP-Only, SameSite Lax.
* **Package Manager:** `pnpm` (Node v24).

---

## 🏛️ Multi-Tenant Architecture & URL Scheme

The platform is strictly multi-tenant. Each business is identified by a unique URL-friendly `slug` (e.g. `fit-bar`).

| Route | Audience | Purpose | Security Gate |
| :--- | :--- | :--- | :--- |
| `/` | Public Visitors | SaaS Marketing Landing Page (Fusion style, features, pricing, demo card generator). | None (Public). |
| `/login` | Platform & Tenant Users | Unified login portal. Detects role and redirects to `/superadmin` or `/[slug]/admin`. | None (Public). |
| `/superadmin` | Platform SuperAdmin | Master SaaS console: register businesses, issue magic links, view MRR, suspend tenants. | `isPlatformSuperAdmin === true` in `loyal_session`. |
| `/invite/activate` | New Merchant Owner | Magic invitation link landing. Merchant sets password, joins tenant as `OWNER`. | Valid, unexpired crypto token in query param. |
| `/[slug]/admin` | Merchant Owner / Admin | Tenant dashboard: customer list, stamp rules, rewards catalog, export data, counter QR. | `isPlatformSuperAdmin` OR `session.activeTenant.slug === slug`. |
| `/[slug]/scanner` | Counter Cashier / Barista | Rapid stamp terminal: QR camera scan, manual phone lookup, stamp adding, reward redemption. | Authenticated tenant session OR Cashier PIN (`0000`). |
| `/[slug]` / `/[slug]/join` | Customer / End-User | Customer self-onboarding: enter name/phone, get personal digital stamp card pass. | None (Public). |
| `/card/[token]` | Customer / End-User | Digital stamp card PWA + "Add to Google Wallet" button. Real-time stamps count. | Valid student/card token. |

---

## 💾 Database & Persistence Engine (`src/lib/server-db.ts`)

* **Storage Path:** `/app/data/loyal-db.json` inside persistent Docker volume.
* **Cache Architecture:** In-memory `cachedDb` with **`fs.statSync(dbPath).mtimeMs`** change detection. Any write by any process immediately invalidates the cache across Next.js workers.
* **Atomic Writes:** Written to temporary file (`.tmp`) and atomically renamed via `fs.renameSync` to prevent file corruption during concurrent operations.
* **Data Schemas:**
  - `tenants`: Businesses (`id`, `slug`, `name`, `category`, `plan`, `status`, `config`, `adminPin`, `cashierPin`).
  - `users`: User accounts (`id`, `email`, `fullName`, `passwordHash`, `isPlatformSuperAdmin`).
  - `memberships`: User-Tenant relationships (`userId`, `tenantId`, `role`: `OWNER` | `ADMIN` | `CASHIER`).
  - `invitations`: Magic links (`token`, `tenantId`, `email`, `role`, `expiresAt`, `status`).
  - `students`: Customers registered for a stamp card (`id`, `tenantId`, `name`, `phone`, `stamps`, `token`).
  - `transactions`: Stamp history log (`id`, `tenantId`, `studentId`, `type`, `count`, `notes`, `createdAt`).

---

## ⚡ Development & Deployment Loop

```bash
# Verify types and build locally
pnpm build

# Run local dev server (port 3000)
pnpm dev

# Deploy to Production (Coolify automatically builds and updates container upon git push)
git add .
git commit -m "feat: description"
git push origin main
```

---

## ⚠️ Non-Negotiable Engineering Rules

1. **Strict Slug & Data Isolation:** All database reads for students, stamps, config, and stats MUST be partitioned by `tenantId` / `tenantSlug`. Never leak Tenant A's customer records to Tenant B!
2. **URL Decoding:** Always sanitize slugs using `decodeURIComponent(slug).toLowerCase().trim()`.
3. **No Mock Data in Main:** The `main` branch is production. Do not introduce hardcoded fake stores or mock users.
4. **Header / Shell Cleanliness:** Dedicated layouts for dashboards. Never render marketing navbars inside `/[slug]/admin` or `/[slug]/scanner`.
