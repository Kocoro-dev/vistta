"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GenerationCard } from "@/components/generation-card";
import { ProjectSelector } from "@/components/project-selector";
import { ProjectDialog } from "@/components/project-dialog";
import { getProjects, getProjectGenerations } from "@/actions/projects";
import { Plus, ImageIcon, Loader2 } from "lucide-react";
import type { Generation, Project } from "@/types/database";

interface DashboardContentProps {
  initialGenerations: Generation[];
  initialProjects: Project[];
  canCreate: boolean;
}

export function DashboardContent({
  initialGenerations,
  initialProjects,
  canCreate,
}: DashboardContentProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [generations, setGenerations] = useState<Generation[]>(initialGenerations);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleProjectChange = async (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setIsLoading(true);

    try {
      // Map "none" to null for API, and null to "all"
      const apiProjectId = projectId === "none" ? null : projectId === null ? "all" : projectId;
      const result = await getProjectGenerations(apiProjectId);

      if (result.generations) {
        setGenerations(result.generations);
      }
    } catch (error) {
      console.error("Error loading generations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectDialog(true);
  };

  const handleProjectSuccess = (project: Project) => {
    if (editingProject) {
      // Update existing project in list
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      // Add new project to list
      setProjects((prev) => [project, ...prev]);
    }
    router.refresh();
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setGenerations(initialGenerations);
    }
    router.refresh();
  };

  return (
    <>
      {/* Project Filter */}
      <div className="mb-8">
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={handleProjectChange}
          onCreateProject={handleCreateProject}
        />
      </div>

      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-label text-neutral-400 mb-4 block">Galería</span>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
            {selectedProjectId === null
              ? "Todos los Diseños"
              : selectedProjectId === "none"
              ? "Sin Carpeta"
              : projects.find((p) => p.id === selectedProjectId)?.name || "Mis Diseños"}
          </h1>
        </div>
        {canCreate && (
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-3 text-[14px] font-medium transition-all"
          >
            <Plus className="h-4 w-4" />
            Nuevo Diseño
          </Link>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : generations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {generations.map((generation) => (
            <GenerationCard
              key={generation.id}
              generation={generation}
              projects={projects}
              onProjectAssigned={() => {
                // Refresh if filtering by project
                if (selectedProjectId !== null) {
                  handleProjectChange(selectedProjectId);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState selectedProjectId={selectedProjectId} />
      )}

      {/* Project Dialog */}
      <ProjectDialog
        open={showProjectDialog}
        onClose={() => {
          setShowProjectDialog(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSuccess={handleProjectSuccess}
        onDelete={handleProjectDelete}
      />
    </>
  );
}

function EmptyState({ selectedProjectId }: { selectedProjectId: string | null }) {
  const message =
    selectedProjectId === "none"
      ? "No hay diseños sin carpeta asignada."
      : selectedProjectId
      ? "Esta carpeta está vacía."
      : "Sube una foto de una habitación y transforma su estilo con inteligencia artificial.";

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="h-16 w-16 border border-neutral-200 flex items-center justify-center mb-8">
        <ImageIcon className="h-6 w-6 text-neutral-400" />
      </div>
      <h2 className="text-[20px] font-medium text-neutral-900 mb-3">
        {selectedProjectId ? "Sin diseños" : "Sin diseños todavía"}
      </h2>
      <p className="text-[15px] text-neutral-500 mb-8 max-w-sm">{message}</p>
      {!selectedProjectId && (
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 text-[14px] font-medium transition-all"
        >
          <Plus className="h-4 w-4" />
          Crear primer diseño
        </Link>
      )}
    </div>
  );
}
