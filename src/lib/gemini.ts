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

// Virtual staging prompt - focused on decluttering and professional presentation
// Aggressive about removing clutter while preserving room structure
const BASE_PROMPT = `You are a professional virtual home stager enhancing a real estate photograph for listing.

PRESERVE (do not change):
- Room structure: walls, doors, windows, floor, ceiling
- All furniture pieces and their exact positions
- Furniture styles - do not replace with different furniture
- Wall colors and architectural elements

CLEAN AND REMOVE (be thorough):
- Remove ALL cables, wires, chargers, power strips
- Remove ALL personal items: clothes, shoes, bags, toiletries
- Remove ALL clutter from surfaces: papers, mail, random objects
- Empty shelves, tables, and furniture tops of non-decorative items
- Remove items on floors that don't belong (boxes, bags, toys)
- Clean and improve all surfaces - make them look pristine

ENHANCE:
- Improve lighting: brighter, natural, professional real estate photography quality
- Reduce harsh shadows, create inviting atmosphere
- Clean up stains, marks, or imperfections on surfaces
- Straighten any crooked elements

DECORATIVE STYLING (allowed):
- You MAY add or change tasteful decorative items on shelves, tables, and surfaces
- Examples: books, vases, plants, candles, art objects, decorative bowls
- Keep decorations minimal, elegant, and appropriate for the style
- Decorations should enhance, not overwhelm the space

The result should look like a professionally staged home ready for a real estate listing - clean, bright, decluttered, with tasteful minimal decoration.`;

export function buildGeminiPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Style direction: ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `

Additional note: ${customPrompt}`;
  }

  return fullPrompt;
}

// Style presets - define the aesthetic direction for staging
export const STYLE_PROMPTS: Record<string, string> = {
  modern: "Style direction: Clean, contemporary aesthetic. Use minimal geometric decorations, a single plant or succulent, neutral-toned books or objects. Bright, crisp lighting with clean whites.",
  minimalist: "Style direction: Extreme simplicity. Almost no decorations - perhaps one single object per surface maximum. Lots of empty space. Very bright, airy, zen-like atmosphere.",
  luxury: "Style direction: Premium, sophisticated staging. Use elegant decorative objects like art books, sculptural vases, fresh flowers, high-end candles. Rich warm lighting with golden undertones.",
  coastal: "Style direction: Light and breezy beach aesthetic. Use natural textures, light woods, white/blue accents, coral or shell decorations, coastal plants. Bright natural daylight feeling.",
  industrial: "Style direction: Urban loft aesthetic. Use metal accents, exposed elements, dark leather, vintage books, industrial plants like succulents. Warm contrast lighting.",
  traditional: "Style direction: Classic elegance. Use traditional decorative pieces, elegant vases, classic books, fresh flowers, refined objects. Warm, inviting golden-hour lighting.",
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
