"use server";

import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const MAX_DIMENSION = 1024;
const WEBP_QUALITY = 80;

export async function uploadImage(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { error: "Invalid file type. Please upload JPG, PNG, or WebP." };
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return { error: "File too large. Maximum size is 10MB." };
  }

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Calculate new dimensions maintaining aspect ratio
    let width = metadata.width || MAX_DIMENSION;
    let height = metadata.height || MAX_DIMENSION;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
    }

    // Resize and convert to WebP
    const processedBuffer = await image
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${user.id}/${timestamp}.webp`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("originals")
      .upload(filename, processedBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload image. Please try again." };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("originals").getPublicUrl(filename);

    return {
      success: true,
      path: filename,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Image processing error:", error);
    return { error: "Failed to process image. Please try again." };
  }
}
