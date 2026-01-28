import { GoogleGenAI } from "@google/genai";

// Initialize Google AI client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY || "" });

// Model for image generation/editing
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export interface GoogleAIGenerationInput {
  imageUrl: string;
  prompt: string;
}

export interface GoogleAIGenerationOutput {
  imageUrl: string;
}

// Conservative base prompt for real estate
const BASE_PROMPT = `You are enhancing a real estate photograph. Make ONLY VERY SUBTLE improvements.

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

The result MUST look like the SAME exact room, just with better photography quality and lighting.`;

export function buildGoogleAIPrompt(stylePrompt: string, customPrompt?: string): string {
  let fullPrompt = `${BASE_PROMPT}

Style direction: ${stylePrompt}`;

  if (customPrompt) {
    fullPrompt += `

Additional note: ${customPrompt}`;
  }

  return fullPrompt;
}

// Fetch image and convert to base64
async function imageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Detect mime type from URL or response
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const mimeType = contentType.split(";")[0].trim();

  return { base64, mimeType };
}

export async function generateWithGoogleAI(
  input: GoogleAIGenerationInput
): Promise<GoogleAIGenerationOutput> {
  console.log("=== Google AI generation starting ===");
  console.log("Image URL:", input.imageUrl);

  // Convert image URL to base64
  const { base64, mimeType } = await imageUrlToBase64(input.imageUrl);
  console.log("Image converted to base64, mimeType:", mimeType);

  // Call Gemini API
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: input.prompt },
          {
            inlineData: {
              mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  console.log("Google AI response received");
  console.log("Response candidates:", response.candidates?.length || 0);

  // Check if response was blocked
  const candidate = response.candidates?.[0];
  if (!candidate) {
    console.log("Full response:", JSON.stringify(response, null, 2));
    throw new Error("No candidates in Google AI response - content may have been blocked");
  }

  // Log finish reason but don't fail immediately - try to extract image first
  if (candidate.finishReason) {
    console.log("Finish reason:", candidate.finishReason);
  }

  // Extract the generated image from response
  const parts = candidate.content?.parts;

  if (!parts || parts.length === 0) {
    console.log("Candidate content:", JSON.stringify(candidate.content, null, 2));
    throw new Error("No response parts from Google AI");
  }

  console.log("Parts found:", parts.length);

  // Find the image part in the response
  for (const part of parts) {
    if (part.inlineData?.data) {
      // Convert base64 back to data URL
      const outputMimeType = part.inlineData.mimeType || "image/png";
      const dataUrl = `data:${outputMimeType};base64,${part.inlineData.data}`;

      console.log("Google AI generation completed, mimeType:", outputMimeType);
      return { imageUrl: dataUrl };
    }
    if (part.text) {
      console.log("Text response:", part.text);
    }
  }

  console.log("Parts content:", JSON.stringify(parts, null, 2));

  // Provide specific error for IMAGE_RECITATION
  if (candidate.finishReason === "IMAGE_RECITATION") {
    throw new Error("La imagen no pudo generarse por restricciones de copyright. Prueba con otra imagen.");
  }

  throw new Error("No image in Google AI response - only text returned");
}
