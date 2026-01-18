import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Flux Depth Dev - Maintains structure while allowing subtle improvements
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

// Very conservative base prompt - minimal changes, maximum fidelity
const BASE_PROMPT = `Professional real estate photograph enhancement.

ABSOLUTE RULES - NEVER CHANGE:
- Doors: exact same position, size, style, color
- Windows: exact same position, size, frame, glass
- Walls: exact same position, color, texture
- Floor: exact same material, color, pattern
- Ceiling: exact same height, features
- Room dimensions: identical to original
- Architectural features: all preserved exactly

ALLOWED SUBTLE IMPROVEMENTS ONLY:
- Lighting: enhance natural light, reduce shadows, brighter atmosphere
- Cleanliness: remove clutter, mess, personal items
- Minor styling: straighten objects, better arrangement of EXISTING items
- Color enhancement: more vibrant, appealing colors
- Sharpness: clearer, more professional photo quality

FURNITURE RULES:
- Keep ALL existing furniture in SAME positions
- If furniture must change, use VERY similar style and EXACT same placement
- Do NOT add new furniture
- Do NOT remove major furniture pieces
- Do NOT change furniture layout

Result must look like the SAME room with better photography and lighting.`;

export function buildPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Subtle style direction: ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `\n\nUser note: ${customPrompt}`;
  }

  return fullPrompt;
}

// Style presets - now much more subtle, focused on lighting and atmosphere
export const STYLE_PROMPTS: Record<string, string> = {
  modern: "Enhance with clean, bright lighting. Crisp and contemporary feel without changing anything.",
  minimalist: "Brighten the space, reduce visual clutter. Keep everything in place but cleaner looking.",
  luxury: "Enhance lighting to feel premium. Richer colors, better shadows. Same furniture, elevated feel.",
  coastal: "Brighten with natural light feeling. Fresh, airy atmosphere. No furniture changes.",
  industrial: "Enhance contrast and warmth. Keep raw elements visible. Better lighting only.",
  traditional: "Warm, inviting lighting enhancement. Cozy atmosphere without changing layout.",
};
