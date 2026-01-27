# Prompting Guide - Vistta AI

Este archivo contiene los prompts utilizados para la generación de imágenes con Gemini.
Modifica estos prompts aquí y luego actualiza `src/actions/generate-image.ts`.

---

## Vistta Enhance

**Propósito:** Mejorar fotos existentes de espacios ya amueblados. Mejoras sutiles de iluminación, limpieza visual y calidad fotográfica.

```
You are enhancing an existing furnished real estate photograph. Make ONLY SUBTLE improvements.

CRITICAL RULES - NEVER VIOLATE:
- KEEP the exact same room structure: walls, doors, windows, floor, ceiling
- KEEP ALL furniture in the EXACT same positions
- KEEP the same furniture styles - DO NOT replace with different furniture
- KEEP the same color palette of walls and major elements
- DO NOT add any new furniture or decorative items
- DO NOT remove any major furniture pieces
- DO NOT change the room layout or dimensions

ALLOWED IMPROVEMENTS (subtle only):
- Enhance lighting: brighter, more natural light, reduce harsh shadows
- Clean up: remove small clutter, personal items, mess
- Color enhancement: slightly more vibrant, appealing tones
- Sharpness: clearer, more professional photo quality
- Minor straightening: align objects that look crooked

The result MUST look like the SAME exact room, just with better photography quality and lighting.
```

---

## Vistta Vision

**Propósito:** Amueblar virtualmente espacios vacíos o semi-vacíos con decoración profesional.

### Prompt Base

```
You are a virtual home staging expert. Transform this EMPTY room into a beautifully furnished living space.

CRITICAL RULES:
- KEEP the exact same room structure: walls, doors, windows, floor, ceiling
- ADD appropriate furniture and decoration for the space
- CREATE a cohesive, professionally staged look
- MAINTAIN realistic lighting and proportions
- DO NOT change architectural elements

INSTRUCTIONS:
- Add furniture that fits the room's size and layout
- Include appropriate decor items (plants, art, rugs, etc.)
- Create a welcoming, lived-in but clean aesthetic
- Match the furniture style to the requested design style
```

### Estilos de Diseño

Cada estilo añade su prompt específico al prompt base de Vision.

#### Moderno
```
modern interior design, clean lines, neutral colors, minimalist furniture, large windows, natural light, contemporary style, high-end finishes
```

#### Minimalista
```
minimalist interior design, white walls, simple furniture, decluttered space, zen aesthetic, subtle textures, monochromatic palette, serene atmosphere
```

#### Industrial
```
industrial interior design, exposed brick, metal fixtures, wooden beams, concrete floors, vintage furniture, edison bulbs, loft style
```

#### Escandinavo
```
scandinavian interior design, hygge style, light wood, cozy textiles, white and gray palette, functional furniture, plants, natural materials
```

#### Mediterráneo
```
mediterranean interior design, terracotta tiles, arched doorways, warm earth tones, rustic wood, wrought iron details, coastal vibes
```

---

## Notas Técnicas

- **Proveedor actual:** Google Gemini (`google-ai`)
- **Modelo:** `gemini-2.0-flash-exp-image-generation`
- **Archivo de implementación:** `src/actions/generate-image.ts`
- **Estilos definidos en:** `src/types/database.ts` (STYLE_PRESETS)

## Cómo Actualizar Prompts

1. Edita el prompt deseado en este archivo
2. Copia el texto actualizado a `src/actions/generate-image.ts`:
   - `ENHANCE_BASE_PROMPT` para Enhance
   - `VISION_BASE_PROMPT` para Vision
3. Para estilos, actualiza `STYLE_PRESETS` en `src/types/database.ts`
4. Reinicia el servidor de desarrollo
5. Prueba con una imagen de test

## Historial de Cambios

| Fecha | Cambio | Resultado |
|-------|--------|-----------|
| 2025-01-26 | Versión inicial | - |
