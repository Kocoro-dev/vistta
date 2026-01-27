# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vistta** - Virtual Home Staging con IA para el mercado inmobiliario español.

- **URL**: https://www.visttahome.com
- **Contacto**: legal@visttahome.com
- **Ubicación**: Santa Cruz de Tenerife, España

### Dos Productos Principales

1. **Vistta Enhance** - Mejora fotos existentes (luz, eliminar desorden, pequeños ajustes). Para alquiler vacacional.
2. **Vistta Vision** - Amuebla espacios vacíos con decoración virtual. Para venta inmobiliaria.

### Planes de Precios

- **Pack Ocasional**: 19€ (10 créditos, sin caducidad)
- **Plan Agencia**: 59€/mes (100 imágenes mensuales)
- Ambos incluyen: Vistta Enhance + Vision, todos los estilos, resolución HD

## Style Guide

**IMPORTANT:** Before creating any UI element, consult `styleguide.md` for design tokens, typography, colors, spacing, and component patterns.

### Typography
- **Títulos (h1-h6):** Bricolage Grotesque
- **Párrafos y texto:** Manrope
- **Código:** Geist Mono

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Setup

Create `.env.local` and configure:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for webhooks)

### AI Providers
- `GOOGLE_AI_API_KEY` - Google AI API key (Gemini - proveedor principal)
- `REPLICATE_API_TOKEN` - Replicate API token (proveedor alternativo)
- `REPLICATE_WEBHOOK_SECRET` - Secret for webhook verification
- `FAL_KEY` - FAL.ai API key (proveedor alternativo)

### LemonSqueezy (Pagos)
- `LEMONSQUEEZY_API_KEY` - API key from LemonSqueezy dashboard
- `LEMONSQUEEZY_STORE_ID` - Your store ID (visible in URL)
- `LEMONSQUEEZY_WEBHOOK_SECRET` - Webhook signing secret
- `LEMONSQUEEZY_OCASIONAL_VARIANT_ID` - Variant ID for Pack Ocasional
- `LEMONSQUEEZY_AGENCIA_VARIANT_ID` - Variant ID for Plan Agencia

### App
- `NEXT_PUBLIC_APP_URL` - Public URL (https://www.visttahome.com)

## Architecture

### Tech Stack
- Next.js 16 (App Router) + TypeScript
- React 19 + Tailwind CSS v4 + shadcn/ui
- Supabase (Auth OAuth, PostgreSQL, Storage)
- GSAP + Lenis (animaciones y smooth scroll)
- sharp (procesamiento de imágenes server-side)

### AI Providers (configurable en `src/actions/generate-image.ts`)
- **Google Gemini** (principal) - `gemini-3-pro-image-preview` model, respuesta síncrona
- **Flux via Replicate** (alternativo) - `flux-dev` model, async con webhooks
- **Gemini via FAL.ai** (alternativo) - async API

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/           # Magic Link + Google OAuth login
│   ├── (auth)/callback/        # Auth callback handler
│   ├── terminos/               # Términos de servicio
│   ├── privacidad/             # Política de privacidad
│   ├── (protected)/dashboard/  # Galería de generaciones del usuario
│   ├── (protected)/editor/     # Editor principal de imágenes
│   ├── admin/                  # Panel de administración
│   │   ├── login/              # Login admin (credenciales hardcoded)
│   │   ├── (dashboard)/        # Dashboard admin
│   │   ├── (dashboard)/landing/[section]/ # Editor de secciones landing
│   │   ├── (dashboard)/media/  # Gestión de media
│   │   └── (dashboard)/user-panel/ # Gestión de usuarios
│   ├── api/webhooks/replicate/ # Webhook para Replicate
│   ├── api/fal/proxy/          # Proxy para FAL.ai
│   └── page.tsx                # Landing page (contenido por defecto aquí)
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── landing/                # Componentes de landing page
│   ├── admin/                  # Componentes del admin panel
│   ├── features/               # Features modulares (pdf-export)
│   └── *.tsx                   # Componentes core (header, footer, upload-zone, etc.)
├── actions/                    # Server actions
│   ├── generate-image.ts       # Orquestación de generación de imágenes
│   ├── upload-image.ts         # Upload y procesamiento de imágenes
│   └── admin.ts                # Acciones del admin (CRUD contenido, auth)
├── lib/
│   ├── supabase/               # Clientes Supabase (server.ts, client.ts, middleware.ts)
│   ├── google-ai.ts            # Integración Google Gemini
│   ├── flux.ts                 # Integración Flux/Replicate
│   ├── gemini.ts               # Integración Gemini via FAL.ai
│   ├── admin-auth.ts           # Autenticación admin (session cookies)
│   ├── constants.ts            # Límites y whitelist de usuarios
│   └── content.ts              # Helpers para CMS (getContent, getPageContent)
└── types/
    ├── database.ts             # Types: Profile, Generation, StylePreset
    └── admin.ts                # Types del admin panel
```

## Database Schema

Run migrations in order in Supabase SQL Editor:
1. `supabase/schema.sql` - Estructura base
2. `supabase/admin-schema.sql` - Panel admin
3. `supabase/credits-modules-migration.sql` - Sistema de créditos
4. `supabase/projects-payments-migration.sql` - Proyectos y pagos

### Tables

**`profiles`** - Perfiles de usuario (auto-creados via trigger)
- id, email, full_name, avatar_url, credits, has_purchased
- subscription_status, subscription_plan, subscription_expires_at
- onboarding_completed, created_at, updated_at
- RLS: usuarios solo ven/editan su propio perfil

**`generations`** - Historial de generaciones
- id, user_id, original_image_url/path, generated_image_url/path
- prompt, style, module (enhance/vision), has_watermark
- project_id (FK a projects), status, error_message
- replicate_prediction_id, created_at, completed_at
- RLS: usuarios solo acceden a sus propias generaciones

**`projects`** - Carpetas para organizar diseños
- id, user_id, name, description, created_at, updated_at
- RLS: usuarios CRUD solo sus propios proyectos

**`payments`** - Historial de pagos (LemonSqueezy)
- id, user_id, amount (cents), plan_type (ocasional/agencia)
- status (pending/completed/failed/refunded)
- stripe_session_id (usado para LemonSqueezy order/subscription ID)
- invoice_url, created_at, completed_at
- RLS: usuarios solo ven sus propios pagos

**`site_content`** - CMS para contenido editable
- id, page (landing/dashboard/editor/login), section, content (JSONB)
- Contenido de landing page editable desde admin panel
- RLS: lectura pública, escritura solo service_role

### Storage Buckets

- **`originals`** (privado) - Imágenes subidas por usuarios
- **`generations`** (público) - Imágenes generadas
- **`avatars`** (público) - Fotos de perfil de usuarios
- **`admin-media`** (público) - Media del admin panel

## Key Patterns

### Supabase Client Usage
- Server components: `import { createClient } from "@/lib/supabase/server"`
- Client components: Dynamic import to avoid build-time issues:
  ```ts
  const { createClient } = await import("@/lib/supabase/client");
  ```

### Type Assertions
Due to Supabase type inference limitations, use explicit casting:
```ts
const { data } = await supabase.from("generations").select("*");
const generations = data as unknown as Generation[];
```

### Dynamic Routes
Protected pages require `export const dynamic = "force-dynamic"` to avoid static generation errors.

### Content Management
El contenido de la landing page viene de `site_content` en DB, con fallback en `src/app/page.tsx` (defaultContent).
Para editar contenido por defecto, modificar `defaultContent` en `page.tsx`.

## Generation Flow

1. User uploads image → `uploadImage` server action processes with sharp (resize to 1024px, convert to WebP)
2. User selects style → `generateImage` creates DB record, calls AI provider
3. **Google Gemini (default)**: respuesta síncrona en 10-30 segundos
4. **Replicate**: async, webhook a `/api/webhooks/replicate` actualiza DB
5. Editor polls `getGenerationStatus` until completed, then shows CompareSlider

## Authentication

### User Auth (Supabase)
- **Magic Link** (principal): Email sin contraseña, enlace mágico
- **Google OAuth** (alternativo): Login con cuenta de Google
- Flow: `/login` → Magic Link/OAuth → `/callback` → `/dashboard`
- Session via cookies (Supabase SSR)
- Checkbox obligatorio para aceptar términos y privacidad (GDPR)

### Admin Auth
- Credenciales en `lib/admin-auth.ts`: Admin / admin4321
- Session cookie: `vistta_admin_session` (24h expiry)
- Panel: `/admin`

## User Limits (Alpha Phase)

Definidos en `src/lib/constants.ts`:
- `ALPHA_LIMIT = 5` generaciones gratis por usuario
- `UNLIMITED_USERS` whitelist para usuarios sin límite

## Component Organization

- `src/components/ui/` - shadcn/ui primitives
- `src/components/landing/` - Secciones de landing page
- `src/components/admin/` - Sidebar y editor del admin
- `src/components/features/` - Features modulares (removibles)
- `src/components/` - Core: header, footer, upload-zone, compare-slider, style-selector, generation-card, user-avatar

### Modular Features

Features in `src/components/features/` are self-contained and can be removed without affecting core functionality.

**PDF Export** (`src/components/features/pdf-export/`)
- `PdfExportButton` - Button component to export current page as PDF
- `usePdfExport` - Hook with export logic (uses html2canvas + jspdf)
- Used in: `Footer` component
- To remove: Delete the folder, remove import from `footer.tsx`, uninstall `html2canvas` and `jspdf`

## Landing Page Sections

Componentes en `src/components/landing/`:
- `landing-page.tsx` - Container principal con animaciones GSAP
- `hero-slider.tsx`, `hero-badge.tsx` - Hero section
- `face-pile.tsx` - Social proof (contador de usuarios)
- `trust-logos.tsx` - Logos de clientes
- `feature-fork.tsx` - Comparación Enhance vs Vision
- `value-proposition.tsx` - Propuesta de valor
- `bento-grid.tsx` - Grid de features
- `stats-section.tsx` - Métricas clave
- `style-tabs.tsx` - Showcase de estilos
- `social-proof-split.tsx` - Testimonios
- `comparison-table.tsx` - Tabla comparativa
- `pricing-cards.tsx` - Planes de precios
- `faq.tsx` - Preguntas frecuentes
- `live-activity-toast.tsx` - Notificaciones de actividad

## API Endpoints

- `POST /api/webhooks/replicate` - Webhook de Replicate (verifica signature HMAC-SHA256)
- `GET /api/webhooks/replicate` - Health check
- `POST /api/webhooks/lemonsqueezy` - Webhook de LemonSqueezy para pagos
- `GET /api/webhooks/lemonsqueezy` - Health check
- `/api/fal/proxy` - Proxy server-side para FAL.ai

## Notes

- Idioma: Español (es) - todo el UI en español
- Responsive: mobile-first con breakpoints sm/md/lg/xl/2xl
- Animaciones: GSAP + ScrollTrigger para landing page
- Sin tests automatizados actualmente
