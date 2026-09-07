# QIVENTRA — Local Commerce & Delivery Platform

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-lockup-light-transparent-4k.png">
    <source media="(prefers-color-scheme: light)" srcset="https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-lockup-dark-transparent-4k.png">
    <img alt="QIVENTRA — Local Commerce & Delivery Platform" src="https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-lockup-dark-transparent-4k.png" width="380" style="max-width: 100%; height: auto;">
  </picture>
</p>

<p align="center">
  <strong>Responsive local commerce and delivery platform for Israel with multilingual UX (EN/RU/HE + RTL), product discovery, ordering, delivery tracking and role-based experiences.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Supabase-Storage%20%26%20DB-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vitest-5.0.0-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8" alt="PWA Ready" />
</p>

---

## Overview

**QIVENTRA** is a multi-category local commerce and rapid delivery web platform built specifically for the Israeli market (Tel Aviv metropolitan area). The platform connects end customers with artisan grocery stores, local markets, specialty bakeries, delicatessens, floral boutiques, and neighborhood pharmacies.

Designed with a mobile-first, desktop-optimized architecture, QIVENTRA delivers localized user experiences across Hebrew (with complete native Right-to-Left orientation), English, and Russian. It features rich catalog exploration, interactive cart mechanics with dynamic delivery tier calculations, simulated real-time order lifecycle tracking, an in-app customer support chat backed by IndexedDB, and dedicated portal interfaces for customers, merchants, couriers, and administrators.

---

## Core Features

The following matrix distinguishes between features running in active client-side implementation and architectural modules currently staged as prototypes or planned for full cloud deployment:

| Feature Area | Implementation Status | Description |
| :--- | :--- | :--- |
| **Catalog & Discovery** | **Production-Ready UI / Client Logic** | Multi-category filtering, real-time query search, dietary badges (Organic, Farm, Eco, Kosher), price and rating sorting, and structured store detail pages. |
| **Localization & RTL** | **Production-Ready UI / Client Logic** | Full trilingual translation engine (English, Russian, Hebrew), automatic bidirectional layout adaptation (`dir="rtl"`), and localized currency formatting. |
| **Cart & Delivery Math** | **Client Implementation** | Dynamic free delivery calculation threshold (₪100 SLA), delivery fee calculation (₪15), localStorage state persistence, and corrupt state auto-recovery. |
| **Checkout & Payments** | **Prototype / Simulation** | Multi-step simulated checkout (address selection, delivery time slots, payment method choice). *Payment gateways (e.g., Tranzila, Stripe) are planned.* |
| **Order Lifecycle** | **Prototype / Simulation** | Step-by-step state machine (`placed` &rarr; `confirmed` &rarr; `preparing` &rarr; `on_the_way` &rarr; `delivered`) with dynamic ETA countdown and vector radar animation. |
| **Customer Support Chat** | **Client-Side Engine (IndexedDB)** | Persistent conversation history, store/courier/support channels, photo attachment previews, audio recording simulation, and auto-reply simulation. |
| **Role Portals** | **Interactive Prototype** | Dedicated views for Customer, Merchant / Vendor (`VendorPortalPage`), Courier (`CourierPortalPage`), and Platform Admin (`AdminPortalPage`). |
| **Brand Assets Management**| **Integrated (Supabase Storage)** | Official brand assets hosting, client SHA-256 integrity checks, dimension validation, versioning, and rollback within the Admin portal. |
| **Progressive Web App (PWA)**| **Client Implementation** | Service worker caching via `vite-plugin-pwa`, install banner prompt (`usePWAInstall`), and offline status indicator (`useOnlineStatus`). |

---

## User Roles

QIVENTRA is engineered around a four-tier Role-Based Access model:

1. **Customer (Shopper)**
   - Browse neighborhood stores and curated local products.
   - Filter by delivery time, minimum order, dietary preferences, and distance.
   - Manage multiple delivery addresses and active cart items.
   - Track order progress with dynamic ETA updates.
   - Communicate directly with merchants and couriers via in-app chat.

2. **Vendor (Merchant)**
   - Dashboard with incoming order notifications and status transitions.
   - Inventory catalog control: toggle item availability, stock limits, and prices.
   - Store settings: opening hours, minimum order thresholds, and operational alerts.

3. **Courier (Delivery Partner)**
   - Active delivery cockpit with route waypoints and navigation handoffs.
   - Real-time milestone confirmations: pickup confirmation, transit updates, and proof-of-delivery checklists.
   - Daily performance metrics, completed drop-offs, and estimated earnings.

4. **Administrator (Platform Management)**
   - High-level marketplace telemetry: active orders, gross merchandise volume, and delivery SLAs.
   - Merchant onboarding, verification queues, and system audits.
   - Official brand asset governance: view metadata, upload new variants, calculate cryptographic hashes, and revert versions.

---

## Technology Stack

### Frontend Core
- **Framework:** [React 19](https://react.dev/) (`19.0.1`)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (`~5.8.2`)
- **Build Tool:** [Vite](https://vitejs.dev/) (`6.2.3`)
- **Styling & CSS:** [Tailwind CSS](https://tailwindcss.com/) (`4.1.14`) via `@tailwindcss/vite`
- **Component Motion:** [Motion](https://motion.dev/) (`12.23.24`)
- **Iconography:** [Lucide React](https://lucide.dev/) (`0.546.0`)

### Client Data & Offline Storage
- **Local Database:** Browser [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for persistent in-browser chat threads.
- **Cart Storage:** `localStorage` with automated JSON schema validation and error fallback.
- **Offline / PWA:** [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) (`1.3.0`) with Workbox background caching.

### Backend & Cloud Infrastructure (Staged)
- **BaaS Platform:** [Supabase](https://supabase.com/) (`@supabase/supabase-js` `2.115.0`)
- **Object Storage:** Supabase Storage (`brand-assets` bucket)
- **Database:** PostgreSQL with Row Level Security (RLS)
- **AI Integrations:** Google GenAI SDK (`@google/genai` `2.4.0`) staged for semantic product search and catalog assistance.

### Testing & Quality Assurance
- **Test Runner:** [Vitest](https://vitest.dev/) (`5.0.0`)
- **Static Analysis:** TypeScript strict type checking (`tsc --noEmit`)

---

## Application Architecture

```
qiventra-local-commerce/
├── public/                     # Static assets, PWA icons, local fallback brand files
├── src/
│   ├── components/             # Reusable UI component library
│   │   ├── admin/              # Brand asset management and admin consoles
│   │   ├── chat/               # IndexedDB-backed chat drawer and message bubbles
│   │   ├── home/               # Hero banner and dynamic delivery vector animation
│   │   ├── layout/             # DesktopHeader, Navbar, MobileBottomNav, Footer
│   │   ├── media/              # Photo upload modal and client image handling
│   │   ├── modals/             # Address selection, Auth modal, Cart drawer
│   │   ├── pwa/                # PWA install trigger and offline indicator banner
│   │   └── ui/                 # Atomic design elements (BrandLogo, ProductCard, StoreCard, Badges)
│   ├── context/                # Global state providers (App, Language, Theme, Toast)
│   ├── data/                   # Realistic seed catalogs, stores, and order records
│   ├── hooks/                  # Custom React hooks (useOnlineStatus, usePWAInstall)
│   ├── i18n/                   # Dictionary files (ru, en, he) and RTL configuration
│   ├── pages/                  # Top-level view controllers (Home, Catalog, Store, Portals)
│   ├── services/               # Supabase client, IndexedDB ChatService, MediaService
│   ├── tests/                  # Vitest test suite for localization, math, and layout specs
│   ├── types.ts                # TypeScript domain models and interface contracts
│   ├── main.tsx                # Application bootstrap entry point
│   └── App.tsx                 # View router, modal orchestration, and shell layout
├── supabase/                   # Supabase migrations, storage policies, and architecture docs
├── index.html                  # HTML entry point with font preconnects and meta tags
├── vite.config.ts              # Vite 6 config with Tailwind CSS 4 and PWA plugins
└── package.json                # Project dependencies and operational scripts
```

---

## Localization and RTL

QIVENTRA features a first-class internationalization layer built specifically for the linguistic landscape of Israel:

- **Supported Languages:**
  - **Hebrew (`he`)** — Complete Right-to-Left (RTL) layout rendering (`dir="rtl"`), paired with Hebrew display typography (`Rubik` & `Heebo`).
  - **English (`en`)** — Left-to-Right (LTR) default business orientation.
  - **Russian (`ru`)** — Left-to-Right (LTR) localization tailored for Russian-speaking residents.
- **RTL Integrity Rules:**
  - Official brand logos and logomarks are preserved with strict LTR geometry and are never mirrored.
  - Directional icons (chevrons, back arrows) intelligently flip based on active reading direction.
  - Currency formatting adheres to Israeli convention: `₪ 45` in Hebrew and `45 ₪` in English/Russian, using non-breaking spaces (`\u00A0`) to prevent awkward line breaks.
  - Translation keys are verified via automated Vitest suites (`src/tests/app.test.ts`) to prevent missing string regressions.

---

## Responsive Experience

The interface is engineered across an 8-point spatial grid and supports viewport widths from **320px** to **2560px**:

- **Mobile Viewports (< 640px):**
  - Compact single-column product feed with isolated media slots.
  - Persistent 5-button bottom navigation bar (`MobileBottomNav`) with safe-area insets (`env(safe-area-inset-bottom)`).
  - Full-screen slide-over drawers for cart, chat, and address selection.
- **Tablet Viewports (640px – 1023px):**
  - 2-column balanced grid for stores and product cards.
  - Floating action controls and collapsible utility menus.
- **Desktop Viewports (1024px – 1440px+):**
  - Fixed 76px three-zone header (`DesktopHeader`): Brand identity & address selector (start), navigation & search (center), language, theme, chat, cart, and profile utilities (end).
  - 3-to-4 column responsive catalog grids.
  - Slide-out panels fixed to standard 400px–420px widths with darkened backdrop blur.

---

## Getting Started

### Prerequisites

- **Node.js:** `Node.js >= 18.0.0` (v20+ LTS recommended)
- **Package Manager:** `npm` (v9+) or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonikstyle/qiventra-local-commerce.git
   cd qiventra-local-commerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` with your configuration details (see [Environment Variables](#environment-variables)).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The local application will be available at `http://localhost:3000`.

---

## Environment Variables

All client-facing configuration variables must be declared in `.env` (or `.env.local`) using the `VITE_` prefix:

| Variable | Required | Scope | Description |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Optional | Client | The unique Supabase Project URL (e.g., `https://xyz.supabase.co`). If omitted, the app falls back to local verified brand assets. |
| `VITE_SUPABASE_ANON_KEY` | Optional | Client | The public Supabase anonymous (`anon`) key. Safe for browser exposure. |
| `GEMINI_API_KEY` | Optional | Server | Google Gemini API key for server-side AI catalog and search enhancements. |
| `APP_URL` | Optional | Server | Canonical hosted URL used for callback routing and metadata generation. |

> **Security Warning:** Never expose or declare the Supabase `service_role` key in `.env.example`, client-side code, or public repositories. The `service_role` secret bypasses Row Level Security and must remain strictly inside secure server environments.

---

## Available Scripts

The following npm scripts are defined in `package.json`:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port `3000` (`0.0.0.0`). |
| `npm run build` | Compiles production assets into the `dist/` directory. |
| `npm run preview` | Locally serves the compiled production build for verification. |
| `npm run lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`). |
| `npm run test` | Executes the Vitest automated test suite once (`vitest run`). |
| `npm run clean` | Removes build artifacts (`rm -rf dist server.js`). |

---

## Project Structure

A high-level view of module organization:

```
├── .env.example              # Template for environment configuration
├── index.html                # Application root HTML document
├── metadata.json             # AI Studio and platform permission metadata
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite, Tailwind 4, and PWA configurations
├── supabase/
│   ├── migrations/           # Versioned SQL migration files
│   └── schema-architecture.md# Full backend schema design and security model
└── src/
    ├── App.tsx               # View router and layout coordinator
    ├── main.tsx              # React DOM mounting root
    ├── types.ts              # Core domain TypeScript models
    ├── components/           # Modular component hierarchy
    ├── context/              # Context providers for app state
    ├── data/                 # Seed data for stores, items, and initial order
    ├── hooks/                # Reusable state hooks
    ├── i18n/                 # Translation dictionaries and RTL helpers
    ├── pages/                # Individual page layouts and role portals
    ├── services/             # Supabase client, IndexedDB chat engine
    └── tests/                # Automated test specifications
```

---

## Supabase Integration

QIVENTRA integrates with Supabase for cloud persistence and asset management:

### Stage 1: Brand Assets Infrastructure (Implemented)
- **Storage Bucket:** `brand-assets` (Public Read, Admin Write only).
- **Canonical Asset Paths:**
  - `qiventra/v1/qiventra-mark-transparent-2k.png` (2048×2048 logomark)
  - `qiventra/v1/qiventra-lockup-light-transparent-4k.png` (4096×1120 light text for dark backgrounds)
  - `qiventra/v1/qiventra-lockup-dark-transparent-4k.png` (4096×1120 dark text for light backgrounds)
- **Database Table (`brand_assets`):** Stores cryptographic SHA-256 hashes, pixel dimensions, MIME types, version numbers, and active flags.
- **Client Fallback:** If Supabase credentials are not supplied, `src/services/supabase.ts` gracefully degrades to local static brand assets located in `/public/brand/`.

### Planned Backend Migrations
A comprehensive SQL schema design is documented in `supabase/schema-architecture.md`, encompassing:
- `profiles` and `addresses` tables linked to `auth.users`.
- `stores` and `products` tables with merchant ownership policies.
- `orders` and `order_items` tables with state machine integrity checks.
- Real-time courier telematics via Supabase Realtime channels.

---

## Security Considerations

The application architecture adheres to modern web application security practices:

1. **Row Level Security (RLS)**
   - *Current Implementation:* Supabase Storage and `brand_assets` tables enforce public read access for active records, restricting all write, update, and delete actions to verified administrators.
   - *Production Requirement:* RLS policies will enforce strict isolation across user profiles, merchant order queues, and courier assignments.

2. **Role-Based Access Control (RBAC)**
   - Portals strictly segment UI permissions by role (`customer`, `vendor`, `courier`, `admin`).
   - *Production Requirement:* Token-based JWT claims validation on all mutations.

3. **Secure Environment Management**
   - No secret keys are embedded in source code or client bundles.
   - `.gitignore` explicitly excludes all `.env*` files except `.env.example`.

4. **File Upload Security & Verification**
   - Media uploads in the Admin and Chat modules validate MIME types (`image/png`, `image/webp`, `image/svg+xml`, `image/jpeg`).
   - Strict file size constraints (max 10 MB for brand assets, 5 MB for chat media).
   - In-browser SHA-256 calculation via the native Web Crypto API prior to upload.
   - *Production Requirement:* Antivirus scanning and cloud image transformation pipelines.

5. **Server-Side Validation (Production Requirement)**
   - All cart pricing, discount vouchers, and delivery thresholds must be re-calculated and verified server-side prior to payment authorization.

6. **Rate Limiting & Abuse Prevention (Production Requirement)**
   - Edge rate-limiting on authentication endpoints, chat message dispatches, and search query endpoints.

7. **Dependency Auditing**
   - Routine dependency scans via `npm audit` to detect and mitigate third-party vulnerabilities.

---

## Accessibility

- **Keyboard Navigation:** Focus management and visible focus rings across buttons, inputs, category selectors, and modal overlays.
- **Color Contrast:** Strict adherence to WCAG AA contrast standards (> 4.5:1 for body copy) across both Light (`#F3F1EA` background with `#151817` text) and Dark modes (`#0D1514` background with `#F3F1EA` text).
- **Semantics:** HTML5 landmarks (`<nav>`, `<header>`, `<main>`, `<footer>`), ARIA role declarations, and descriptive `aria-label` attributes on icon-only buttons.
- **Screen Reader Support:** Explicit `dir="rtl"` and `lang="he"` document declarations for screen readers in Hebrew mode.

---

## Performance

- **Zero Layout Shift Logo:** Preloaded high-resolution brand assets in `index.html` with explicit width/height dimensions.
- **Asset Optimization:** WebP image support, lazy loading via `SafeImage.tsx` with error fallback handling, and responsive `srcset` resolutions.
- **Bundle Optimization:** Tree-shaken icons from `lucide-react`, modular chunk splitting via Vite, and lightweight Tailwind CSS v4 processing.
- **Cache Strategy:** Workbox service worker caching for static fonts, styles, and scripts.

---

## Screenshots

> Visual previews of QIVENTRA across key viewports and user roles. Place captured screenshots in the `docs/screenshots/` directory using the filenames specified below:

| Screenshot | Description | Suggested Path |
| :--- | :--- | :--- |
| **Storefront & Hero (Hebrew RTL)** | Desktop view showcasing localized Hebrew typography, hero delivery animation, and category pills. | `docs/screenshots/01-desktop-home-he.png` |
| **Product Discovery & Badges** | Multi-category grid with dietary, eco, and top-seller badges. | `docs/screenshots/02-catalog-grid-en.png` |
| **Interactive Cart & Delivery SLA** | Cart drawer illustrating dynamic free delivery progress bar and price calculation. | `docs/screenshots/03-cart-drawer-ru.png` |
| **Courier Portal Cockpit** | Mobile courier dispatch view with route checkpoints and delivery proof. | `docs/screenshots/04-courier-portal.png` |
| **Brand Assets Admin Console** | Admin asset management console with SHA-256 hash validation and version rollback. | `docs/screenshots/05-admin-brand-manager.png` |

*To populate screenshots: Create the folder `docs/screenshots/` in the project root, capture 1920×1080 (desktop) or 750×1334 (mobile) PNG images, and commit them to the repository.*

---

## Roadmap

- [x] **Milestone 1 — Frontend Foundation:** Responsive design system, Tailwind v4 integration, 8-point spatial grid, and dark/light themes.
- [x] **Milestone 2 — Localization & RTL:** Hebrew, English, and Russian translation system with full bidirectional layout support.
- [x] **Milestone 3 — Discovery & Commerce Engine:** Category catalogs, store menus, localized pricing, dynamic delivery tiers, and localStorage cart.
- [x] **Milestone 4 — Brand Governance & Supabase Storage:** Official brand asset hosting, Web Crypto SHA-256 integrity auditing, and administrative versioning.
- [x] **Milestone 5 — Client Messaging & Portals:** IndexedDB persistent chat system and interactive role portals for Customers, Merchants, Couriers, and Admins.
- [ ] **Milestone 6 — Cloud Database Migration:** Deploy complete PostgreSQL schema to Supabase with comprehensive Row Level Security (RLS) policies.
- [ ] **Milestone 7 — Supabase Auth & RBAC:** Implement phone-based OTP and OAuth login with secure server-side JWT claims verification.
- [ ] **Milestone 8 — Payment Gateway Integration:** Connect certified payment processors (Tranzila / Stripe) with 3D Secure verification.
- [ ] **Milestone 9 — Real-time Courier Telematics:** Integrate Supabase Realtime and geolocation webhooks for live driver map updates.

---

## Project Status

- **Phase:** Advanced Functional Prototype / Portfolio Showcase
- **Test Coverage:** Core localization strings, financial calculations, responsive grid math, and brand integrity tests verified via Vitest.
- **Build Status:** Compiles clean with zero TypeScript diagnostics (`tsc --noEmit`).

---

## Credits

Designed and developed by **JonikStyle Production**.

---

## Copyright

© 2026 JonikStyle Production. All rights reserved.

*This repository is a proprietary portfolio project. Unauthorized copying, modification, distribution, or commercial exploitation of this software or its associated brand assets without prior written consent from the author is strictly prohibited.*
