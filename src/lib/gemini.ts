import { fal } from "@fal-ai/client";

// Configure fal.ai client for server-side use
fal.config({
  credentials: process.env.FAL_KEY,
});

export const GEMINI_MODEL = "fal-ai/gemini-3-pro-image-preview/edit";

export interface GeminiGenerationInput {
  imageUrl: string;
  prompt: string;
  resolution?: "1K" | "2K" | "4K";
  outputFormat?: "webp" | "jpeg" | "png";
}

export interface GeminiGenerationOutput {
  images: Array<{
    url: string;
    content_type: string;
    width: number;
    height: number;
  }>;
}

// Conservative base prompt - focused on real estate photography enhancement
// Since Gemini has no strength parameter, we control intensity via prompt language
const BASE_PROMPT = `You are enhancing a real estate photograph. Your task is to make ONLY VERY SUBTLE improvements.

CRITICAL RULES - NEVER VIOLATE:
- KEEP the exact same room structure: walls, doors, windows, floor, ceiling
- KEEP all furniture in the EXACT same positions
- KEEP the same furniture styles - do not replace with different furniture
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

The result MUST look like the SAME exact room, just with better photography quality and lighting. A person visiting this room should recognize it immediately.`;

export function buildGeminiPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Style direction: ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `

Additional note: ${customPrompt}`;
  }

  return fullPrompt;
}

// Style presets - focused on subtle enhancements only
export const STYLE_PROMPTS: Record<string, string> = {
  modern: "Enhance with clean, bright natural lighting. Make it feel fresh and contemporary without changing anything in the room.",
  minimalist: "Brighten the space subtly. Remove visual clutter if any. Keep everything exactly as placed but make it look cleaner.",
  luxury: "Enhance lighting to feel more premium and welcoming. Slightly richer colors, better shadow balance. Same furniture, elevated atmosphere.",
  coastal: "Add a subtle bright, airy feeling through lighting enhancement. Fresh atmosphere. No changes to furniture or layout.",
  industrial: "Enhance contrast slightly and add warmth to the lighting. Keep all raw elements visible. Better lighting only.",
  traditional: "Warm, inviting lighting enhancement. Create a cozy atmosphere without changing any furniture or layout.",
};

export async function generateWithGemini(
  input: GeminiGenerationInput
): Promise<GeminiGenerationOutput> {
  console.log("=== Gemini generation starting ===");
  console.log("Image URL:", input.imageUrl);
  console.log("Prompt:", input.prompt);

  const result = await fal.subscribe(GEMINI_MODEL, {
    input: {
      prompt: input.prompt,
      image_urls: [input.imageUrl],
      resolution: input.resolution || "1K",
      output_format: input.outputFormat || "webp",
      num_images: 1,
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log(`Gemini queue status: ${update.status}`);
    },
  });

  console.log("Gemini result:", JSON.stringify(result.data, null, 2));

  return result.data as GeminiGenerationOutput;
}
