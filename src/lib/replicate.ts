import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Flux Depth Dev - Maintains structure while allowing creative changes
export const FLUX_DEPTH_VERSION =
  "fc4f1401056237174d207056c49cd2afd44ede232ba286a3d40eb6376b726600";

export interface GenerationInput {
  control_image: string;
  prompt: string;
  guidance?: number;
  num_inference_steps?: number;
  output_format?: "webp" | "jpg" | "png";
  output_quality?: number;
  megapixels?: "1" | "0.25" | "match_input";
}

// Base prompt for all generations - focused on real estate photography
const BASE_PROMPT = `Professional real estate photography for Airbnb listing.
High-quality interior photograph with excellent lighting.
CRITICAL: Maintain exact room structure - same walls, windows, doors, floor plan.
Only improve: furniture arrangement, decor, lighting quality, cleanliness.
Photorealistic result, magazine quality.`;

// Negative aspects to avoid (embedded in prompt since model doesn't have negative_prompt)
const AVOID_PROMPT = `Do NOT change: wall positions, window locations, door placements, room dimensions, architectural features.
Avoid: structural changes, distorted walls, moved windows, altered floor plan, unrealistic proportions.`;

export function buildPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Style: ${stylePrompt}

${AVOID_PROMPT}`;

  if (customPrompt) {
    fullPrompt += `\n\nAdditional requests: ${customPrompt}`;
  }

  return fullPrompt;
}

// Style presets optimized for the new model
export const STYLE_PROMPTS: Record<string, string> = {
  modern: "Modern contemporary style. Clean lines, neutral colors, minimalist furniture, natural light emphasis.",
  minimalist: "Minimalist Scandinavian design. White walls, light wood tones, simple functional furniture, plants.",
  luxury: "Luxury high-end interior. Premium materials, elegant furniture, sophisticated color palette, ambient lighting.",
  coastal: "Mediterranean coastal style. Light blues and whites, natural textures, airy and bright atmosphere.",
  industrial: "Industrial loft aesthetic. Exposed elements, metal accents, warm wood tones, urban character.",
  traditional: "Classic traditional style. Warm colors, comfortable furniture, timeless elegance.",
};
