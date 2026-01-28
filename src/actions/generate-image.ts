"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateWithFlux,
  buildFluxPrompt,
} from "@/lib/flux";
import { STYLE_PRESETS, ROOM_TYPES, LIGHTING_OPTIONS, type GenerationInsert, type Generation, type GenerationModule, type Profile } from "@/types/database";
import { redirect } from "next/navigation";
import { FREE_CREDITS, UNLIMITED_USERS } from "@/lib/constants";
import { applyWatermark, applyCustomWatermark, applyDisclaimer, bufferToDataUrl } from "@/lib/watermark";

// AI Provider configuration - change this to switch between providers
type AIProvider = "flux" | "google-ai" | "gemini-fal";
const AI_PROVIDER: AIProvider = "google-ai";

interface GenerateImageInput {
  originalImageUrl: string;
  originalImagePath: string;
  styleId: string;
  module: GenerationModule;
  customPrompt?: string;
  roomTypeId?: string;
  lightingTypeId?: string;
  customWatermarkText?: string;
  addDisclaimer?: boolean;
}

// Prompts específicos para cada módulo
const ENHANCE_BASE_PROMPT = `**Role:** Professional Real Estate Photographer and Digital Retoucher.
**Task:** Enhance this existing photograph to magazine quality standards (Architectural Digest).

**PRIMARY DIRECTIVE: "THE INVISIBLE HAND"**
Improve the image quality without the viewer realizing it has been altered. The room must remain the exact same room, just perfected.

**CRITICAL CONSTRAINTS - NEVER VIOLATE:**
1. CAMERA ANGLE: The output image MUST preserve the EXACT camera angle, perspective, and field of view of the input image. Do not rotate, tilt, or shift the viewpoint.
2. WINDOW VIEWS: Any windows, glass doors, or openings showing exterior views MUST remain EXACTLY as in the original. Do not change, add, remove, or alter what is visible through windows.
3. ARCHITECTURAL STRUCTURE: Preserve ALL architectural elements exactly as shown - walls, ceiling, floor, doors, windows, built-ins, stairs, columns. Even if the user-selected room type differs from the actual room, DO NOT alter the physical structure. Only change furniture and decor.

**STRICT GEOMETRY & FURNITURE RULES (DO NOT CHANGE):**
- DO NOT move, remove, or add any furniture.
- DO NOT change the style, color, or position of existing furniture.
- DO NOT change flooring material, wall structure, or architectural elements.
- DO NOT alter the room layout, perspective, or dimensions.

**REQUIRED IMPROVEMENTS:**

1. **DECLUTTERING & CLEANING:**
   - Remove visual noise: cables, wires, power strips, remote controls, chargers.
   - Remove personal items: shoes, clothes, toiletries, bottles, papers, magazines.
   - Clear surfaces: Remove clutter from counters, tables, and shelves, leaving only tasteful decorative objects.

2. **DIGITAL RESTORATION:**
   - Fix wall imperfections: smooth out peeling paint, cracks, scuffs, or marks.
   - Clean surfaces: remove stains from rugs, scratches from floors, mold/dirt from corners and grouts.
   - Straighten crooked items: pictures, curtains, lampshades, rugs.
   - "Fresh coat of paint" effect: make walls look freshly painted in their original color.

3. **LIGHTING & COLOR:**
   - White balance: correct yellow or blue color casts for neutral, natural tones.
   - Exposure: brighten dark corners, fix overexposed windows (HDR balancing effect).
   - Shadows: soften harsh shadows for a warm, welcoming feel.
   {{LIGHTING_INSTRUCTION}}

4. **PHOTO QUALITY:**
   - Sharpness: crisp, clear details throughout the image.
   - Color vibrancy: slightly enhanced but realistic colors.
   - Professional finish: magazine-ready, high-end real estate photography quality.

**OUTPUT GOAL:**
A pristine, polished, and perfectly lit version of the original photo. The viewer should feel the space looks "move-in ready" and professionally photographed, without detecting any digital manipulation.

**NEGATIVE PROMPT:**
AVOID: changing furniture, adding objects, altering room structure, oversaturated colors, artificial look, HDR overdone, cartoonish, blurry, visible editing artifacts.`;

const VISION_BASE_PROMPT = `**Role:** Senior Interior Design Architect specialized in Virtual Staging.
**Task:** Furnish this empty room to create a high-end, photorealistic listing image.

**CRITICAL CONSTRAINTS - NEVER VIOLATE:**
1. CAMERA ANGLE: The output image MUST preserve the EXACT camera angle, perspective, and field of view of the input image. Do not rotate, tilt, or shift the viewpoint.
2. WINDOW VIEWS: Any windows, glass doors, or openings showing exterior views MUST remain EXACTLY as in the original. Do not change, add, remove, or alter what is visible through windows.
3. ARCHITECTURAL STRUCTURE: Preserve ALL architectural elements exactly as shown - walls, ceiling, floor, doors, windows, built-ins, stairs, columns. Even if the user-selected room type differs from the actual room, DO NOT alter the physical structure. Only change furniture and decor.

**TARGET ROOM FUNCTION:**
{{ROOM_TYPE_INSTRUCTION}}

**CRITICAL GEOMETRY CONSTRAINTS:**
- PRESERVE EXACTLY: All walls, windows, doors, ceiling, and flooring material.
- DO NOT change the room's perspective, depth, or the view outside windows.
- DO NOT add structural elements (columns, beams) that don't exist.
- **Furniture Scale:** Ensure furniture fits realistically within the visible space. Do not overcrowd.

**POLISH & ENHANCEMENT (apply subtly):**
- Clean up any wall imperfections, stains, or marks.
- Enhance lighting: brighter, more natural light, reduce harsh shadows.
- Improve overall photo quality: sharper, clearer, magazine-ready.
- Ensure colors are vibrant but realistic.

**DESIGN STYLE: {{STYLE_NAME}}**
{{STYLE_PROMPT}}

**ATMOSPHERE:**
{{STYLE_ATMOSPHERE}}

**LIGHTING:**
{{LIGHTING_INSTRUCTION}}

**QUALITY SETTINGS:**
Photorealistic, 8k resolution, Architectural Digest quality, sharp focus, cinematic lighting, professional interior photography.

**NEGATIVE PROMPT:**
AVOID: cartoonish, low resolution, blurry, distorted perspective, flying furniture, bad anatomy, impossible geometry, neon lights, cluttered, messy, oversaturated colors, watermark, text, signature.`;

// Build Vision prompt with placeholders replaced
function buildVisionPrompt(styleId: string, roomTypeId?: string, lightingTypeId?: string): string {
  const style = STYLE_PRESETS.find((s) => s.id === styleId) || STYLE_PRESETS[0];
  const roomType = ROOM_TYPES.find((r) => r.id === roomTypeId) || ROOM_TYPES.find((r) => r.id === "empty_room")!;
  const lighting = LIGHTING_OPTIONS.find((l) => l.id === lightingTypeId) || LIGHTING_OPTIONS[0];

  const lightingInstruction = `Apply ${lighting.nameEn} lighting: ${lighting.prompt}`;

  return VISION_BASE_PROMPT
    .replace("{{ROOM_TYPE_INSTRUCTION}}", roomType.instruction)
    .replace("{{STYLE_NAME}}", style.nameEn)
    .replace("{{STYLE_PROMPT}}", style.prompt)
    .replace("{{STYLE_ATMOSPHERE}}", style.atmosphere)
    .replace("{{LIGHTING_INSTRUCTION}}", lightingInstruction);
}

// Build Enhance prompt with lighting
function buildEnhancePrompt(lightingTypeId?: string): string {
  const lighting = LIGHTING_OPTIONS.find((l) => l.id === lightingTypeId) || LIGHTING_OPTIONS[0];
  const lightingInstruction = `- Atmosphere: Apply ${lighting.nameEn} lighting effect: ${lighting.prompt}`;

  return ENHANCE_BASE_PROMPT.replace("{{LIGHTING_INSTRUCTION}}", lightingInstruction);
}

export async function generateImage(input: GenerateImageInput) {
  console.log(`=== generateImage called (${AI_PROVIDER}) ===`);
  console.log("Input:", JSON.stringify(input, null, 2));

  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/login");
  }

  console.log("User ID:", user.id);
  console.log("User email:", user.email);

  // Get user profile for credits
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) {
    console.error("Profile error:", profileError);
    return { error: "Error al obtener el perfil del usuario" };
  }

  const profile = profileData as unknown as Profile;

  // Check if user has unlimited access
  const isUnlimited = user.email && UNLIMITED_USERS.includes(user.email);
  const hasPurchased = profile.has_purchased;
  const credits = profile.credits;

  console.log("Credits:", credits, "Has purchased:", hasPurchased, isUnlimited ? "(unlimited)" : "");

  // Check credits (skip for unlimited users or users with purchase)
  if (!isUnlimited && !hasPurchased && credits <= 0) {
    return {
      error: "No tienes créditos disponibles. Adquiere un plan para seguir usando Vistta.",
      noCredits: true,
    };
  }

  // For Vision module, style is required
  if (input.module === "vision") {
    const style = STYLE_PRESETS.find((s) => s.id === input.styleId);
    if (!style) {
      console.log("Invalid style for Vision:", input.styleId);
      return { error: "Por favor selecciona un estilo de diseño" };
    }
    console.log("Style found:", style.name);
  }

  // Build the full prompt based on module
  let fullPrompt: string;

  if (input.module === "enhance") {
    fullPrompt = buildEnhancePrompt(input.lightingTypeId);
  } else {
    // Vision module - use the new prompt builder
    fullPrompt = buildVisionPrompt(input.styleId, input.roomTypeId, input.lightingTypeId);
  }

  if (input.customPrompt) {
    fullPrompt += `\n\nAdditional instructions: ${input.customPrompt}`;
  }

  // Determine if watermark is needed (always for free users, never for purchased)
  const needsWatermark = !hasPurchased && !isUnlimited;

  try {
    // Create generation record in database
    const insertData: GenerationInsert = {
      user_id: user.id,
      original_image_url: input.originalImageUrl,
      original_image_path: input.originalImagePath,
      prompt: fullPrompt,
      style: input.module === "vision" ? input.styleId : "enhance",
      module: input.module,
      has_watermark: needsWatermark,
      status: "processing",
    };

    const { data: generation, error: dbError } = await supabase
      .from("generations")
      .insert(insertData as never)
      .select()
      .single();

    if (dbError || !generation) {
      console.error("Database error:", dbError);
      return { error: "Failed to create generation record" };
    }

    const gen = generation as unknown as Generation;
    console.log("Generation record created:", gen.id);
    console.log("Module:", input.module, "Needs watermark:", needsWatermark);

    // Generate image using the configured provider
    console.log(`Calling ${AI_PROVIDER} API...`);
    console.log("Image URL:", input.originalImageUrl);

    let generatedImageUrl: string;

    if (AI_PROVIDER === "flux") {
      // Flux Dev via Replicate
      const result = await generateWithFlux({
        image: input.originalImageUrl,
        prompt: fullPrompt,
        promptStrength: 0.6,
        outputFormat: "webp",
        outputQuality: 90,
      });
      generatedImageUrl = result.output;
    } else if (AI_PROVIDER === "google-ai") {
      // Gemini via Google AI Studio (direct) - use our module-specific prompt
      const { generateWithGoogleAI } = await import("@/lib/google-ai");

      const result = await generateWithGoogleAI({
        imageUrl: input.originalImageUrl,
        prompt: fullPrompt,
      });
      generatedImageUrl = result.imageUrl;
    } else {
      // Gemini via fal.ai (alternative) - use our module-specific prompt
      const { generateWithGemini } = await import("@/lib/gemini");

      const result = await generateWithGemini({
        imageUrl: input.originalImageUrl,
        prompt: fullPrompt,
        resolution: "1K",
        outputFormat: "webp",
      });

      if (!result.images || result.images.length === 0) {
        throw new Error("No images generated");
      }
      generatedImageUrl = result.images[0].url;
    }

    console.log("Generation completed:", generatedImageUrl);

    // Apply watermark/disclaimer processing
    let finalImageUrl = generatedImageUrl;
    let imageBuffer: Buffer = Buffer.from(generatedImageUrl.split(",")[1], "base64");

    // Apply free user watermark if needed
    if (needsWatermark) {
      console.log("Applying watermark for free user...");
      try {
        imageBuffer = Buffer.from(await applyWatermark(imageBuffer));
        console.log("Watermark applied successfully");
      } catch (watermarkError) {
        console.error("Watermark error (continuing without):", watermarkError);
      }
    }

    // Apply custom watermark if requested
    if (input.customWatermarkText) {
      console.log("Applying custom watermark:", input.customWatermarkText);
      try {
        imageBuffer = Buffer.from(await applyCustomWatermark(imageBuffer, input.customWatermarkText));
        console.log("Custom watermark applied successfully");
      } catch (watermarkError) {
        console.error("Custom watermark error (continuing without):", watermarkError);
      }
    }

    // Apply disclaimer if requested
    if (input.addDisclaimer) {
      console.log("Applying disclaimer...");
      try {
        imageBuffer = Buffer.from(await applyDisclaimer(imageBuffer));
        console.log("Disclaimer applied successfully");
      } catch (disclaimerError) {
        console.error("Disclaimer error (continuing without):", disclaimerError);
      }
    }

    // Convert final buffer to data URL
    finalImageUrl = bufferToDataUrl(imageBuffer);

    // Deduct credit if user is not unlimited and hasn't purchased
    if (!isUnlimited && !hasPurchased && credits > 0) {
      const newCredits = credits - 1;
      const { error: creditError } = await supabase
        .from("profiles")
        .update({ credits: newCredits } as never)
        .eq("id", user.id);

      if (creditError) {
        console.error("Credit deduction error:", creditError);
      } else {
        console.log("Credit deducted. Remaining:", newCredits);
      }
    }

    // Update generation with result
    const { error: updateError } = await supabase
      .from("generations")
      .update({
        status: "completed",
        generated_image_url: finalImageUrl,
        completed_at: new Date().toISOString(),
      } as never)
      .eq("id", gen.id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return {
      success: true,
      generationId: gen.id,
      generatedImageUrl: finalImageUrl,
    };
  } catch (error) {
    console.error(`${AI_PROVIDER} error:`, error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return { error: "Error al generar la imagen. Por favor, inténtalo de nuevo." };
  }
}

export async function getGenerationStatus(generationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return { error: "Generation not found" };
  }

  const generation = data as unknown as Generation;

  return { generation };
}

// Get user credits and stats
export async function getUserCreditsStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { credits: 0, hasPurchased: false, unlimited: false };
  }

  const isUnlimited = user.email && UNLIMITED_USERS.includes(user.email);

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("credits, has_purchased, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error || !profileData) {
    console.error("Stats error:", error);
    return { credits: FREE_CREDITS, hasPurchased: false, onboardingCompleted: false, unlimited: isUnlimited };
  }

  const profile = profileData as unknown as Pick<Profile, "credits" | "has_purchased" | "onboarding_completed">;

  return {
    credits: profile.credits,
    hasPurchased: profile.has_purchased,
    onboardingCompleted: profile.onboarding_completed,
    unlimited: isUnlimited,
  };
}

// Mark onboarding as completed
export async function completeOnboarding() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true } as never)
    .eq("id", user.id);

  if (error) {
    console.error("Onboarding update error:", error);
    return { error: "Failed to update onboarding status" };
  }

  return { success: true };
}
