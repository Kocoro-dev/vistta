"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateWithGemini,
  buildGeminiPrompt,
  STYLE_PROMPTS,
} from "@/lib/gemini";
import { STYLE_PRESETS, type GenerationInsert, type Generation } from "@/types/database";
import { redirect } from "next/navigation";
import { ALPHA_LIMIT } from "@/lib/constants";

interface GenerateImageInput {
  originalImageUrl: string;
  originalImagePath: string;
  styleId: string;
  customPrompt?: string;
}

export async function generateImage(input: GenerateImageInput) {
  console.log("=== generateImage called (Gemini) ===");
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

  // Check generation limit (5 images for alpha)
  const { count, error: countError } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    console.error("Count error:", countError);
  }

  const generationCount = count || 0;

  console.log("Generation count:", generationCount, "/", ALPHA_LIMIT);

  if (generationCount >= ALPHA_LIMIT) {
    return {
      error: `Has alcanzado el límite de ${ALPHA_LIMIT} imágenes en la versión alpha. ¡Gracias por probar VISTTA!`,
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

  // Build the full prompt using Gemini-specific prompts
  const stylePrompt = STYLE_PROMPTS[input.styleId] || STYLE_PROMPTS.modern;
  const fullPrompt = buildGeminiPrompt(stylePrompt, input.customPrompt);

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

    // Call Gemini via fal.ai - this is synchronous, no webhook needed
    console.log("Calling Gemini API via fal.ai...");
    console.log("Image URL:", input.originalImageUrl);

    const result = await generateWithGemini({
      imageUrl: input.originalImageUrl,
      prompt: fullPrompt,
      resolution: "1K",
      outputFormat: "webp",
    });

    if (!result.images || result.images.length === 0) {
      console.error("Gemini returned no images");
      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: "No se generó ninguna imagen",
        } as never)
        .eq("id", gen.id);

      return { error: "La generación no produjo ninguna imagen" };
    }

    const generatedImageUrl = result.images[0].url;
    console.log("Gemini generation completed:", generatedImageUrl);

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
    console.error("Gemini error:", error);
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
    return { count: 0, limit: ALPHA_LIMIT, remaining: ALPHA_LIMIT };
  }

  const { count, error } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Stats error:", error);
    return { count: 0, limit: ALPHA_LIMIT, remaining: ALPHA_LIMIT };
  }

  const generationCount = count || 0;
  return {
    count: generationCount,
    limit: ALPHA_LIMIT,
    remaining: Math.max(0, ALPHA_LIMIT - generationCount),
  };
}
