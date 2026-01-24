# VISTTA Style Guide

Sistema de diseño basado en minimalismo editorial, inspirado en General Catalyst y Pentagram.

## Tipografía

### Familias tipográficas

| Uso | Fuente | Variable CSS |
|-----|--------|--------------|
| Títulos (h1-h6) | **Space Grotesk** | `--font-heading` |
| Párrafos y texto | **Manrope** | `--font-sans` |
| Código | Geist Mono | `--font-mono` |

### Escala tipográfica

```
Display:     clamp(2rem, 4vw, 3.5rem)  - Títulos hero
H1:          text-[28px] - text-[32px]
H2:          text-[24px]
H3:          text-[18px] - text-[20px]
Body:        text-[15px] - text-[17px]
Small:       text-[13px] - text-[14px]
Label:       text-[11px] (0.6875rem) uppercase, tracking: 0.1em
```

### Clases de texto

| Clase | Uso | Propiedades |
|-------|-----|-------------|
| `.text-display` | Títulos hero grandes | letter-spacing: -0.04em, line-height: 0.95 |
| `.text-editorial` | Títulos secundarios | letter-spacing: -0.02em |
| `.text-label` | Etiquetas, badges | 11px, uppercase, tracking: 0.1em, font-weight: 500 |

## Colores

### Paleta principal

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `#ffffff` | Fondo principal |
| `--foreground` | `#0a0a0a` | Texto principal |
| `--primary` | `#0a0a0a` | Botones principales, CTAs |
| `--accent` | `#c2410c` | Color de acento (terracotta) |

### Neutrales

| Token | Valor | Uso |
|-------|-------|-----|
| `--card` | `#fafafa` | Fondos de tarjetas |
| `--secondary` | `#f5f5f4` | Fondos secundarios |
| `--muted` | `#f5f5f4` | Elementos desactivados |
| `--muted-foreground` | `#737373` | Texto secundario |
| `--border` | `#e5e5e5` | Bordes |

### Naranjas (acentos)

| Clase Tailwind | Hex | Uso |
|----------------|-----|-----|
| `orange-500` | `#f97316` | Acentos principales, highlights |
| `orange-600` | `#ea580c` | Hover states |
| `orange-400` | `#fb923c` | Textos de acento claros |

### Estados

| Token | Valor | Uso |
|-------|-------|-----|
| `--destructive` | `#dc2626` | Errores, acciones destructivas |
| `--ring` | `#c2410c` | Focus rings |

## Espaciado

### Sistema de espaciado (basado en 4px)

```
0.5: 2px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
20:  80px
24:  96px
```

### Contenedores

| Elemento | Max-width | Padding horizontal |
|----------|-----------|-------------------|
| Layout principal | `1400px` | `px-6 lg:px-12` |
| Cards | - | `px-6 py-6` |
| Header/Footer | `1400px` | `px-6 lg:px-12` |

## Componentes

### Botones

**Variantes:**
- `default`: bg-neutral-900, text-white
- `outline`: border border-neutral-200, bg-white
- `secondary`: bg-neutral-100, text-neutral-900
- `ghost`: transparent, text-neutral-600
- `destructive`: bg-red-600, text-white
- `link`: underline on hover

**Tamaños:**
- `sm`: h-8, px-3, text-[13px]
- `default`: h-10, px-5, text-[14px]
- `lg`: h-12, px-6

**Ejemplo de uso:**
```tsx
<Button variant="default" size="default">Crear</Button>
<Button variant="outline" size="sm">Cancelar</Button>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Acciones</CardFooter>
</Card>
```

Estilos: `rounded-xl border shadow-sm bg-card`

### Inputs

- Height: `h-10` (default), `h-8` (sm), `h-12` (lg)
- Border: `border-neutral-200`
- Focus: `ring-2 ring-neutral-900`
- Placeholder: `text-neutral-400`

### Labels

```tsx
<span className="text-label text-orange-500">NUEVO</span>
<span className="text-label text-neutral-400">Categoría</span>
```

## Efectos y animaciones

### Transiciones

| Clase | Duración | Easing |
|-------|----------|--------|
| `transition-all` | 150ms | ease |
| `transition-editorial` | 400ms | cubic-bezier(0.16, 1, 0.3, 1) |

### Hover effects

```css
.hover-lift:hover {
  transform: translateY(-2px);
}
```

### Animaciones

| Clase | Efecto |
|-------|--------|
| `.animate-fade-in` | Fade in 600ms |
| `.animate-fade-in-up` | Fade in + slide up 600ms |
| `.animate-slide-in` | Slide from left 800ms |

### Stagger delays

```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
```

## Bordes y radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius` | `0.25rem` (4px) | Base |
| `rounded-sm` | 2px | Elementos pequeños |
| `rounded-md` | 4px | Inputs, botones pequeños |
| `rounded-lg` | 6px | Botones, cards pequeñas |
| `rounded-xl` | 12px | Cards principales |

### Bordes especiales

```css
.border-hairline { border-width: 0.5px; }
```

## Backgrounds especiales

### Grid pattern

```css
.bg-grid {
  background-image:
    linear-gradient(to right, #e5e5e5 1px, transparent 1px),
    linear-gradient(to bottom, #e5e5e5 1px, transparent 1px);
  background-size: 64px 64px;
}
```

### Noise overlay

```tsx
<div className="noise-overlay relative">
  {/* Añade textura de ruido sutil */}
</div>
```

## Iconos

Usar **Lucide React** para iconos.

Tamaños estándar:
- Small: `h-3.5 w-3.5`
- Default: `h-4 w-4`
- Large: `h-5 w-5`

```tsx
import { Plus, FileDown, User } from "lucide-react";

<Plus className="h-4 w-4" />
```

## Responsive breakpoints

| Breakpoint | Min-width |
|------------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Patrones de código

### Texto con acento

```tsx
<p className="text-[17px] text-neutral-600">
  Texto normal con <span className="text-orange-500">acento</span>
</p>
```

### Secciones con label

```tsx
<div>
  <span className="text-label text-neutral-400 mb-4 block">Sección</span>
  <h2 className="text-[28px] font-medium text-neutral-900 text-editorial">
    Título de sección
  </h2>
</div>
```

### Card con hover

```tsx
<div className="border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all p-6">
  Contenido
</div>
```

## Dark Mode

Variables dark mode definidas en `.dark` class. Principales cambios:
- `--background`: `#0a0a0a`
- `--foreground`: `#fafafa`
- `--accent`: `#ea580c` (más brillante)
- Bordes más sutiles: `#262626`

## Selection

```css
::selection {
  background-color: #c2410c;
  color: #ffffff;
}
```
