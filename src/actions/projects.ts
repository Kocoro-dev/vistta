"use server";

import { createClient } from "@/lib/supabase/server";
import type { Project, Generation } from "@/types/database";

export async function getProjects() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get projects error:", error);
    return { error: "Error al obtener los proyectos" };
  }

  return { projects: (data || []) as unknown as Project[] };
}

export async function createProject(input: {
  name: string;
  description?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  if (!input.name || input.name.trim().length === 0) {
    return { error: "El nombre del proyecto es obligatorio" };
  }

  if (input.name.length > 100) {
    return { error: "El nombre del proyecto es demasiado largo" };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
    } as never)
    .select()
    .single();

  if (error) {
    console.error("Create project error:", error);
    return { error: "Error al crear el proyecto" };
  }

  return { project: data as unknown as Project };
}

export async function updateProject(
  projectId: string,
  input: { name?: string; description?: string }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return { error: "Proyecto no encontrado" };
  }

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) {
    if (input.name.trim().length === 0) {
      return { error: "El nombre del proyecto es obligatorio" };
    }
    updateData.name = input.name.trim();
  }
  if (input.description !== undefined) {
    updateData.description = input.description?.trim() || null;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updateData as never)
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Update project error:", error);
    return { error: "Error al actualizar el proyecto" };
  }

  return { project: data as unknown as Project };
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return { error: "Proyecto no encontrado" };
  }

  // Delete the project (generations will have project_id set to null via ON DELETE SET NULL)
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Delete project error:", error);
    return { error: "Error al eliminar el proyecto" };
  }

  return { success: true };
}

export async function assignGenerationToProject(
  generationId: string,
  projectId: string | null
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verify generation ownership
  const { data: generation } = await supabase
    .from("generations")
    .select("id")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (!generation) {
    return { error: "Generación no encontrada" };
  }

  // If projectId is provided, verify project ownership
  if (projectId) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return { error: "Proyecto no encontrado" };
    }
  }

  const { error } = await supabase
    .from("generations")
    .update({ project_id: projectId } as never)
    .eq("id", generationId);

  if (error) {
    console.error("Assign generation error:", error);
    return { error: "Error al asignar la generación al proyecto" };
  }

  return { success: true };
}

const GENERATIONS_PAGE_SIZE = 12;

export async function getProjectGenerations(
  projectId: string | null,
  options?: { limit?: number; offset?: number }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const limit = options?.limit ?? GENERATIONS_PAGE_SIZE;
  const offset = options?.offset ?? 0;

  // First, get total count for pagination info
  let countQuery = supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (projectId === null) {
    countQuery = countQuery.is("project_id", null);
  } else if (projectId !== "all") {
    countQuery = countQuery.eq("project_id", projectId);
  }

  const { count } = await countQuery;

  // Then get paginated data
  let query = supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (projectId === null) {
    // Get generations without a project
    query = query.is("project_id", null);
  } else if (projectId === "all") {
    // Get all generations (no filter on project_id)
  } else {
    // Get generations for a specific project
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Get project generations error:", error);
    return { error: "Error al obtener las generaciones" };
  }

  const generations = (data || []) as unknown as Generation[];
  const totalCount = count ?? 0;
  const hasMore = offset + generations.length < totalCount;

  return {
    generations,
    totalCount,
    hasMore,
    nextOffset: offset + limit,
  };
}
