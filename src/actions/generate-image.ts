"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateWithFlux,
  buildFluxPrompt,
  FLUX_STYLE_PROMPTS,
} from "@/lib/flux";
import { STYLE_PRESETS, type GenerationInsert, type Generation, type GenerationModule, type Profile } from "@/types/database";
import { redirect } from "next/navigation";
import { FREE_CREDITS, UNLIMITED_USERS } from "@/lib/constants";
import { applyWatermark, bufferToDataUrl } from "@/lib/watermark";

// AI Provider configuration - change this to switch between providers
type AIProvider = "flux" | "google-ai" | "gemini-fal";
const AI_PROVIDER: AIProvider = "google-ai";

interface GenerateImageInput {
  originalImageUrl: string;
  originalImagePath: string;
  styleId: string;
  module: GenerationModule;
  customPrompt?: string;
}

// Prompts específicos para cada módulo
const ENHANCE_BASE_PROMPT = `You are enhancing an existing furnished real estate photograph. Make ONLY SUBTLE improvements.

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

The result MUST look like the SAME exact room, just with better photography quality and lighting.`;

const VISION_BASE_PROMPT = `You are a virtual home staging expert. Transform this EMPTY room into a beautifully furnished living space.

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
- Match the furniture style to the requested design style`;

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
  const basePrompt = input.module === "enhance" ? ENHANCE_BASE_PROMPT : VISION_BASE_PROMPT;
  let fullPrompt = basePrompt;

  if (input.module === "vision") {
    const stylePrompt = FLUX_STYLE_PROMPTS[input.styleId] || FLUX_STYLE_PROMPTS.modern;
    fullPrompt = `${basePrompt}\n\nDesign style: ${stylePrompt}`;
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

    // Apply watermark if needed (free users)
    let finalImageUrl = generatedImageUrl;
    if (needsWatermark) {
      console.log("Applying watermark for free user...");
      try {
        const watermarkedBuffer = await applyWatermark(
          Buffer.from(generatedImageUrl.split(",")[1], "base64")
        );
        finalImageUrl = bufferToDataUrl(watermarkedBuffer);
        console.log("Watermark applied successfully");
      } catch (watermarkError) {
        console.error("Watermark error (continuing without):", watermarkError);
        // Continue without watermark if it fails
      }
    }

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
