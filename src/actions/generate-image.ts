"use server";

import { createClient } from "@/lib/supabase/server";
import {
  replicate,
  INTERIOR_DESIGN_MODEL,
  buildPrompt,
  DEFAULT_NEGATIVE_PROMPT,
} from "@/lib/replicate";
import { STYLE_PRESETS, type GenerationInsert, type Generation } from "@/types/database";
import { redirect } from "next/navigation";

interface GenerateImageInput {
  originalImageUrl: string;
  originalImagePath: string;
  styleId: string;
  customPrompt?: string;
}

export async function generateImage(input: GenerateImageInput) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Find style preset
  const style = STYLE_PRESETS.find((s) => s.id === input.styleId);
  if (!style) {
    return { error: "Invalid style selected" };
  }

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

    // Get the webhook URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${appUrl}/api/webhooks/replicate`;

    // Start Replicate prediction
    const prediction = await replicate.predictions.create({
      model: INTERIOR_DESIGN_MODEL,
      input: {
        image: input.originalImageUrl,
        prompt: fullPrompt,
        negative_prompt: DEFAULT_NEGATIVE_PROMPT,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
      webhook: webhookUrl,
      webhook_events_filter: ["completed"],
    });

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
