"use server";

import { createClient } from "@/lib/supabase/server";
import {
  replicate,
  INTERIOR_DESIGN_VERSION,
  buildPrompt,
  DEFAULT_NEGATIVE_PROMPT,
} from "@/lib/replicate";
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
  console.log("=== generateImage called ===");
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
  const ALPHA_LIMIT = 5;

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

  // Build the full prompt
  const fullPrompt = buildPrompt(style.prompt, input.customPrompt);

  try {
    // Create generation record in database
    const insertData: GenerationInsert = {
      user_id: user.id,
      original_image_url: input.originalImageUrl,
      original_image_path: input.originalImagePath,
      prompt: fullPrompt,
      style: input.styleId,
      status: "pending",
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

    // Get the webhook URL (only use if HTTPS - Replicate requires HTTPS)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const useWebhook = appUrl.startsWith("https://");
    const webhookUrl = useWebhook ? `${appUrl}/api/webhooks/replicate` : undefined;

    // Start Replicate prediction
    console.log("Calling Replicate API...");
    console.log("Image URL:", input.originalImageUrl);

    const prediction = await replicate.predictions.create({
      version: INTERIOR_DESIGN_VERSION,
      input: {
        image: input.originalImageUrl,
        prompt: fullPrompt,
        negative_prompt: DEFAULT_NEGATIVE_PROMPT,
        num_inference_steps: 50,
        guidance_scale: 15,
        prompt_strength: 0.8,
      },
      ...(webhookUrl && {
        webhook: webhookUrl,
        webhook_events_filter: ["completed"],
      }),
    });

    console.log("Replicate prediction created:", prediction.id);

    // Update generation with prediction ID
    const { error: updateError } = await supabase
      .from("generations")
      .update({
        replicate_prediction_id: prediction.id,
        status: "processing",
      } as never)
      .eq("id", gen.id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return {
      success: true,
      generationId: gen.id,
      predictionId: prediction.id,
    };
  } catch (error) {
    console.error("Replicate error:", error);
    // Show more details
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return { error: "Failed to start image generation" };
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

// Poll Replicate for prediction status (used when webhooks aren't available)
export async function pollPredictionStatus(generationId: string) {
  console.log("=== pollPredictionStatus called ===");
  console.log("Generation ID:", generationId);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("Poll: No user found");
    return { error: "Unauthorized" };
  }

  // Get the generation record
  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.log("Poll: Generation not found", error);
    return { error: "Generation not found" };
  }

  const generation = data as unknown as Generation;
  console.log("Poll: Generation status from DB:", generation.status);
  console.log("Poll: Prediction ID:", generation.replicate_prediction_id);

  // If already completed or failed, return current status
  if (generation.status === "completed" || generation.status === "failed") {
    console.log("Poll: Already finished with status:", generation.status);
    return { generation };
  }

  // If no prediction ID, something went wrong
  if (!generation.replicate_prediction_id) {
    console.log("Poll: No prediction ID found");
    return { error: "No prediction ID found" };
  }

  try {
    // Get prediction status from Replicate
    console.log("Poll: Checking Replicate status...");
    const prediction = await replicate.predictions.get(generation.replicate_prediction_id);
    console.log("Poll: Replicate status:", prediction.status);
    console.log("Poll: Replicate output:", prediction.output);

    if (prediction.status === "succeeded") {
      // Get the output URL
      const outputUrl = Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output;

      // Update generation in database
      const { error: updateError } = await supabase
        .from("generations")
        .update({
          status: "completed",
          generated_image_url: outputUrl,
        } as never)
        .eq("id", generationId);

      if (updateError) {
        console.error("Update error:", updateError);
      }

      return {
        generation: {
          ...generation,
          status: "completed" as const,
          generated_image_url: outputUrl,
        },
      };
    } else if (prediction.status === "failed" || prediction.status === "canceled") {
      console.log("Poll: Prediction failed or canceled");
      console.log("Poll: Error:", prediction.error);

      const errorMessage = typeof prediction.error === "string"
        ? prediction.error
        : "Error en la generación";

      // Update generation as failed
      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: errorMessage,
        } as never)
        .eq("id", generationId);

      return {
        generation: {
          ...generation,
          status: "failed" as const,
          error_message: errorMessage,
        },
      };
    }

    // Still processing
    return {
      generation: {
        ...generation,
        status: "processing" as const,
      },
    };
  } catch (error) {
    console.error("Poll error:", error);
    return { error: "Failed to check prediction status" };
  }
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
