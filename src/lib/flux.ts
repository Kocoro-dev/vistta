import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Flux Dev - Image to image with prompt_strength control
export const FLUX_DEV_VERSION =
  "6e4a938f85952bdabcc15aa329178c4d681c52bf25a0342403287dc26944661d";

export interface FluxGenerationInput {
  image: string;
  prompt: string;
  promptStrength?: number; // 0-1, default 0.8. Lower = more faithful to original
  guidance?: number;
  numInferenceSteps?: number;
  outputFormat?: "webp" | "jpg" | "png";
  outputQuality?: number;
}

// Conservative base prompt for real estate - focused on subtle improvements
const BASE_PROMPT = `Professional real estate photograph enhancement.

CRITICAL - PRESERVE EXACTLY:
- All walls, doors, windows in exact positions
- Floor material, color, pattern unchanged
- Ceiling height and features unchanged
- Room dimensions and layout identical
- All architectural elements preserved

SUBTLE IMPROVEMENTS ONLY:
- Better lighting: brighter, natural, reduce harsh shadows
- Cleanliness: remove small clutter, personal items
- Color enhancement: slightly more vibrant tones
- Sharpness: professional photo quality

FURNITURE:
- Keep all furniture in same positions
- Do not add or remove furniture
- Do not change furniture styles

Result must look like the SAME room with better photography.`;

export function buildFluxPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Style: ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `

Note: ${customPrompt}`;
  }

  return fullPrompt;
}

// Style presets - subtle enhancements only
export const FLUX_STYLE_PROMPTS: Record<string, string> = {
  modern: "Clean, bright natural lighting. Fresh and contemporary atmosphere.",
  minimalist: "Bright space, clean look. Everything in place but cleaner.",
  luxury: "Premium lighting, richer colors, better shadows. Elevated atmosphere.",
  coastal: "Bright, airy natural light feeling. Fresh atmosphere.",
  industrial: "Enhanced contrast, warm lighting. Raw elements visible.",
  traditional: "Warm, inviting lighting. Cozy atmosphere.",
  scandinavian: "Light, airy Scandinavian feel. Natural brightness.",
  mediterranean: "Warm Mediterranean light. Earth tones enhanced.",
};

export async function generateWithFlux(
  input: FluxGenerationInput
): Promise<{ output: string }> {
  console.log("=== Flux generation starting ===");
  console.log("Image URL:", input.image);
  console.log("Prompt strength:", input.promptStrength || 0.4);

  const prediction = await replicate.predictions.create({
    version: FLUX_DEV_VERSION,
    input: {
      image: input.image,
      prompt: input.prompt,
      prompt_strength: input.promptStrength ?? 0.4, // Default to 0.4 for subtle changes
      guidance: input.guidance ?? 3.5,
      num_inference_steps: input.numInferenceSteps ?? 28,
      output_format: input.outputFormat || "webp",
      output_quality: input.outputQuality ?? 90,
      go_fast: false, // Better quality
    },
  });

  console.log("Flux prediction created:", prediction.id);

  // Wait for the prediction to complete
  const result = await replicate.wait(prediction);

  console.log("Flux result:", result.output);

  // Flux Dev returns a single URL string or array
  const outputUrl = Array.isArray(result.output)
    ? result.output[0]
    : result.output;

  if (!outputUrl) {
    throw new Error("No output URL received from Flux");
  }

  return { output: outputUrl };
}
