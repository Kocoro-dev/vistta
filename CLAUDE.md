# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Style Guide

**IMPORTANT:** Before creating any UI element, consult `styleguide.md` for design tokens, typography, colors, spacing, and component patterns.

### Typography
- **Títulos (h1-h6):** Space Grotesk
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
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for webhooks)
- `REPLICATE_API_TOKEN` - Replicate API token
- `REPLICATE_WEBHOOK_SECRET` - Secret for webhook verification
- `NEXT_PUBLIC_APP_URL` - Public URL for webhooks
- `GOOGLE_AI_API_KEY` - Google AI API key (for Gemini)

## Architecture

### Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- Supabase (Auth, PostgreSQL, Storage)
- Replicate API for AI image generation
- sharp for image processing

### Database Schema

Run `supabase/schema.sql` in Supabase SQL Editor to set up:
- `profiles` - User profiles (auto-created on signup via trigger)
- `generations` - Image generation history with status tracking
- RLS policies enforcing user-only access
- Storage buckets: `originals` (private), `generations` (public)

### Key Patterns

**Supabase Client Usage:**
- Server components: `import { createClient } from "@/lib/supabase/server"`
- Client components: Dynamic import to avoid build-time issues:
  ```ts
  const { createClient } = await import("@/lib/supabase/client");
  ```

**Type Assertions:**
Due to Supabase type inference limitations, use explicit casting:
```ts
const { data } = await supabase.from("generations").select("*");
const generations = data as unknown as Generation[];
```

**Dynamic Routes:**
Protected pages require `export const dynamic = "force-dynamic"` to avoid static generation errors.

### Generation Flow

1. User uploads image → `uploadImage` server action processes with sharp (resize to 1024px, convert to WebP)
2. User selects style → `generateImage` creates DB record, calls Replicate API with webhook URL
3. Replicate completes → POST to `/api/webhooks/replicate` updates DB and stores result
4. Editor polls `getGenerationStatus` until completed, then shows CompareSlider

### Component Organization

- `src/components/ui/` - shadcn/ui primitives
- `src/components/` - App components (header, footer, upload-zone, compare-slider, etc.)
- `src/components/features/` - Modular features (easily removable)
- `src/actions/` - Server actions (upload-image, generate-image)
- `src/lib/supabase/` - Supabase client utilities
- `src/types/database.ts` - TypeScript types and style presets

### Modular Features

Features in `src/components/features/` are self-contained and can be removed without affecting core functionality.

**PDF Export** (`src/components/features/pdf-export/`)
- `PdfExportButton` - Button component to export current page as PDF
- `usePdfExport` - Hook with export logic (uses html2canvas + jspdf)
- Used in: `Footer` component
- To remove: Delete the folder, remove import from `footer.tsx`, uninstall `html2canvas` and `jspdf`
