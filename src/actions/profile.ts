"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/types/database";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return { error: "Error al obtener el perfil" };
  }

  return { profile: data as unknown as Profile };
}

export async function updateProfile(input: {
  full_name?: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const updateData: Record<string, unknown> = {};
  if (input.full_name !== undefined) {
    updateData.full_name = input.full_name;
  }
  if (input.avatar_url !== undefined) {
    updateData.avatar_url = input.avatar_url;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData as never)
    .eq("id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    return { error: "Error al actualizar el perfil" };
  }

  return { success: true };
}

export async function requestEmailChange(newEmail: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return { error: "Formato de email inválido" };
  }

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    console.error("Email change error:", error);
    if (error.message.includes("email already")) {
      return { error: "Este email ya está en uso" };
    }
    return { error: "Error al solicitar el cambio de email" };
  }

  return {
    success: true,
    message: "Se ha enviado un enlace de verificación a tu nuevo email"
  };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No se proporcionó ningún archivo" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "El archivo es demasiado grande. Máximo 5MB" };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    return { error: "Error al subir la imagen" };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl } as never)
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update error:", updateError);
    return { error: "Error al actualizar el perfil" };
  }

  return { success: true, avatarUrl: urlData.publicUrl };
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  try {
    // Delete user's storage files (avatars)
    const { data: avatarFiles } = await supabase.storage
      .from("avatars")
      .list(user.id);

    if (avatarFiles && avatarFiles.length > 0) {
      const filesToDelete = avatarFiles.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from("avatars").remove(filesToDelete);
    }

    // Delete user's generations storage
    const { data: originalFiles } = await supabase.storage
      .from("originals")
      .list(user.id);

    if (originalFiles && originalFiles.length > 0) {
      const filesToDelete = originalFiles.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from("originals").remove(filesToDelete);
    }

    // Sign out the user first
    await supabase.auth.signOut();

    // Note: The actual user deletion should be handled by a Supabase Edge Function
    // or an admin API endpoint since client-side deletion is not supported
    // For now, we'll just sign out and the cascade delete will handle related data

    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Error al eliminar la cuenta" };
  }
}
