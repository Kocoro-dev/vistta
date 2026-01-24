"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateWithFlux,
  buildFluxPrompt,
  FLUX_STYLE_PROMPTS,
} from "@/lib/flux";
import { STYLE_PRESETS, type GenerationInsert, type Generation } from "@/types/database";
import { redirect } from "next/navigation";
import { ALPHA_LIMIT, UNLIMITED_USERS } from "@/lib/constants";

// AI Provider configuration - change this to switch between providers
type AIProvider = "flux" | "google-ai" | "gemini-fal";
const AI_PROVIDER: AIProvider = "google-ai";

interface GenerateImageInput {
  originalImageUrl: string;
  originalImagePath: string;
  styleId: string;
  customPrompt?: string;
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

  // Check if user has unlimited access
  const isUnlimited = user.email && UNLIMITED_USERS.includes(user.email);

  // Check generation limit (5 images for alpha) - skip for unlimited users
  const { count, error: countError } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    console.error("Count error:", countError);
  }

  const generationCount = count || 0;

  console.log("Generation count:", generationCount, "/", ALPHA_LIMIT, isUnlimited ? "(unlimited)" : "");

  if (!isUnlimited && generationCount >= ALPHA_LIMIT) {
    return {
      error: `Has alcanzado el límite de ${ALPHA_LIMIT} imágenes en la versión alpha. ¡Gracias por probar Vistta!`,
      limitReached: true,
    };
  }

  // Find style preset
  const style = STYLE_PRESETS.find((s) => s.id === input.styleId);
  if (!style) {
    console.log("Invalid style:", input.styleId);
    return { error: "Invalid style selected" };
  }

  console.log("Style found:", style.name);

  // Build the full prompt
  const stylePrompt = FLUX_STYLE_PROMPTS[input.styleId] || FLUX_STYLE_PROMPTS.modern;
  const fullPrompt = buildFluxPrompt(stylePrompt, input.customPrompt);

  try {
    // Create generation record in database
    const insertData: GenerationInsert = {
      user_id: user.id,
      original_image_url: input.originalImageUrl,
      original_image_path: input.originalImagePath,
      prompt: fullPrompt,
      style: input.styleId,
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
      // Gemini via Google AI Studio (direct)
      const { generateWithGoogleAI, buildGoogleAIPrompt, GOOGLE_AI_STYLE_PROMPTS } = await import("@/lib/google-ai");
      const googleStylePrompt = GOOGLE_AI_STYLE_PROMPTS[input.styleId] || GOOGLE_AI_STYLE_PROMPTS.modern;
      const googlePrompt = buildGoogleAIPrompt(googleStylePrompt, input.customPrompt);

      const result = await generateWithGoogleAI({
        imageUrl: input.originalImageUrl,
        prompt: googlePrompt,
      });
      generatedImageUrl = result.imageUrl;
    } else {
      // Gemini via fal.ai (alternative)
      const { generateWithGemini, buildGeminiPrompt, STYLE_PROMPTS } = await import("@/lib/gemini");
      const geminiStylePrompt = STYLE_PROMPTS[input.styleId] || STYLE_PROMPTS.modern;
      const geminiPrompt = buildGeminiPrompt(geminiStylePrompt, input.customPrompt);

      const result = await generateWithGemini({
        imageUrl: input.originalImageUrl,
        prompt: geminiPrompt,
        resolution: "1K",
        outputFormat: "webp",
      });

      if (!result.images || result.images.length === 0) {
        throw new Error("No images generated");
      }
      generatedImageUrl = result.images[0].url;
    }

    console.log("Generation completed:", generatedImageUrl);

    // Update generation with result
    const { error: updateError } = await supabase
      .from("generations")
      .update({
        status: "completed",
        generated_image_url: generatedImageUrl,
        completed_at: new Date().toISOString(),
      } as never)
      .eq("id", gen.id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return {
      success: true,
      generationId: gen.id,
      generatedImageUrl,
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

// Get user generation stats
export async function getUserGenerationStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, limit: ALPHA_LIMIT, remaining: ALPHA_LIMIT, unlimited: false };
  }

  const isUnlimited = user.email && UNLIMITED_USERS.includes(user.email);

  const { count, error } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Stats error:", error);
    return { count: 0, limit: ALPHA_LIMIT, remaining: ALPHA_LIMIT, unlimited: isUnlimited };
  }

  const generationCount = count || 0;
  return {
    count: generationCount,
    limit: ALPHA_LIMIT,
    remaining: isUnlimited ? Infinity : Math.max(0, ALPHA_LIMIT - generationCount),
    unlimited: isUnlimited,
  };
}
