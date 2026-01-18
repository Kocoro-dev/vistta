import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

interface ReplicateWebhookPayload {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    // In development, skip verification if no secret is set
    return process.env.NODE_ENV === "development";
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    const payload = await request.text();
    const signature = request.headers.get("webhook-signature");
    const secret = process.env.REPLICATE_WEBHOOK_SECRET || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, secret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: ReplicateWebhookPayload = JSON.parse(payload);
    const { id: predictionId, status, output, error } = data;

    console.log(`Webhook received: ${predictionId} - ${status}`);

    // Find the generation by prediction ID
    const { data: generation, error: findError } = await supabase
      .from("generations")
      .select("*")
      .eq("replicate_prediction_id", predictionId)
      .single();

    if (findError || !generation) {
      console.error("Generation not found:", findError);
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    if (status === "succeeded" && output) {
      // Get the output URL (could be string or array)
      const outputUrl = Array.isArray(output) ? output[0] : output;

      if (!outputUrl) {
        console.error("No output URL in webhook payload");
        return NextResponse.json(
          { error: "No output URL" },
          { status: 400 }
        );
      }

      // Download the generated image
      const imageResponse = await fetch(outputUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to download generated image");
      }

      const imageBuffer = await imageResponse.arrayBuffer();

      // Upload to Supabase Storage
      const timestamp = Date.now();
      const filename = `${generation.user_id}/${timestamp}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("generations")
        .upload(filename, imageBuffer, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload generated image");
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("generations").getPublicUrl(filename);

      // Update generation record
      const { error: updateError } = await supabase
        .from("generations")
        .update({
          status: "completed",
          generated_image_url: publicUrl,
          generated_image_path: filename,
          completed_at: new Date().toISOString(),
        })
        .eq("id", generation.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error("Failed to update generation record");
      }

      console.log(`Generation ${generation.id} completed successfully`);
    } else if (status === "failed" || status === "canceled") {
      // Update generation as failed
      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: error || "Generation failed",
        })
        .eq("id", generation.id);

      console.log(`Generation ${generation.id} failed: ${error}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Replicate may send GET to verify endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
