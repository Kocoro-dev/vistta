import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Interior design model (adirik/interior-design or similar)
export const INTERIOR_DESIGN_MODEL =
  "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705571c687d2615a";

export interface GenerationInput {
  image: string;
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export function buildPrompt(stylePrompt: string, customPrompt?: string): string {
  const basePrompt = "interior design photograph, professional real estate photography, high quality, realistic, detailed";

  let fullPrompt = `${basePrompt}, ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `, ${customPrompt}`;
  }

  return fullPrompt;
}

export const DEFAULT_NEGATIVE_PROMPT =
  "blurry, low quality, distorted, unrealistic, cartoon, illustration, painting, drawing, art, sketch, watermark, text, logo, people, humans, animals";
