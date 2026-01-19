"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminLogin, adminLogout, isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/types/admin";

// ============================================
// Authentication Actions
// ============================================

export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña requeridos" };
  }

  const result = await adminLogin(username, password);

  if (result.success) {
    redirect("/admin");
  }

  return result;
}

export async function logoutAction(): Promise<void> {
  await adminLogout();
  redirect("/admin/login");
}

export async function checkAdminAuth(): Promise<boolean> {
  return await isAdminAuthenticated();
}

// ============================================
// Content Management Actions
// ============================================

export async function getPageContent(page: string): Promise<Record<string, any>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page", page);

  if (error) {
    console.error("Error fetching content:", error);
    return {};
  }

  // Transform array to object keyed by section
  const content: Record<string, any> = {};
  (data as SiteContent[]).forEach((item) => {
    content[item.section] = item.content;
  });

  return content;
}

export async function getSectionContent(page: string, section: string): Promise<any | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("page", page)
    .eq("section", section)
    .single();

  if (error) {
    console.error("Error fetching section content:", error);
    return null;
  }

  const result = data as unknown as { content: any } | null;
  return result?.content || null;
}

export async function updateSectionContent(
  page: string,
  section: string,
  content: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  // Verify admin authentication
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      {
        page,
        section,
        content,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "page,section",
      }
    );

  if (error) {
    console.error("Error updating content:", error);
    return { success: false, error: "Error al guardar el contenido" };
  }

  // Revalidate affected pages
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/editor");
  revalidatePath("/login");
  revalidatePath("/admin");

  return { success: true };
}

export async function getAllContent(): Promise<SiteContent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("page")
    .order("section");

  if (error) {
    console.error("Error fetching all content:", error);
    return [];
  }

  return data as SiteContent[];
}

// ============================================
// Image Upload Action
// ============================================

export async function uploadAdminImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  // Verify admin authentication
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No se ha proporcionado ningún archivo" };
  }

  const supabase = await createClient();

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `admin/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from("generations")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Error al subir la imagen" };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("generations")
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl };
}
