"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { assignGenerationToProject } from "@/actions/projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Wand2,
  MoreVertical,
  FolderOpen,
  FolderMinus,
} from "lucide-react";
import type { Generation, Project } from "@/types/database";
import { STYLE_PRESETS } from "@/types/database";

interface GenerationCardProps {
  generation: Generation;
  projects?: Project[];
  onProjectAssigned?: () => void;
}

export function GenerationCard({
  generation,
  projects = [],
  onProjectAssigned,
}: GenerationCardProps) {
  const [isAssigning, setIsAssigning] = useState(false);

  const style = STYLE_PRESETS.find((s) => s.id === generation.style);
  const isCompleted = generation.status === "completed";
  const isFailed = generation.status === "failed";
  const isProcessing =
    generation.status === "pending" || generation.status === "processing";
  const isEnhance = generation.module === "enhance";

  const currentProject = projects.find((p) => p.id === generation.project_id);

  const imageUrl = isCompleted
    ? generation.generated_image_url
    : generation.original_image_url;

  const handleAssignToProject = async (projectId: string | null) => {
    setIsAssigning(true);
    try {
      const result = await assignGenerationToProject(generation.id, projectId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          projectId
            ? "Diseño movido a la carpeta"
            : "Diseño removido de la carpeta"
        );
        onProjectAssigned?.();
      }
    } catch (error) {
      toast.error("Error al mover el diseño");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="group border border-neutral-200 bg-white hover:border-neutral-300 transition-all relative">
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={style?.name || "Generation"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}

        {/* Status overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mx-auto mb-2" />
              <p className="text-[13px] font-medium text-neutral-600">Generando...</p>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center text-red-600">
              <AlertCircle className="h-5 w-5 mx-auto mb-2" />
              <p className="text-[13px] font-medium">Error</p>
            </div>
          </div>
        )}

        {/* Hover overlay for completed */}
        {isCompleted && (
          <Link
            href={`/editor?id=${generation.id}`}
            className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="text-white text-center">
              <ArrowUpRight className="h-5 w-5 mx-auto mb-1" />
              <span className="text-[13px] font-medium">Ver detalles</span>
            </div>
          </Link>
        )}

        {/* Module and style badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/90 text-neutral-900 px-2 py-1 text-[11px] font-medium tracking-wide border border-neutral-200 flex items-center gap-1">
            {isEnhance ? (
              <>
                <Sparkles className="h-3 w-3" />
                Enhance
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3" />
                {style?.name || generation.style}
              </>
            )}
          </span>
          {generation.has_watermark && (
            <span className="bg-amber-100/90 text-amber-700 px-2 py-1 text-[10px] font-medium tracking-wide border border-amber-200">
              Watermark
            </span>
          )}
        </div>

        {/* Project menu - only show if projects are available */}
        {projects.length > 0 && isCompleted && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 w-8 flex items-center justify-center bg-white/90 hover:bg-white border border-neutral-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                  ) : (
                    <MoreVertical className="h-4 w-4 text-neutral-600" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Mover a carpeta
                </div>
                {currentProject && (
                  <>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignToProject(null);
                      }}
                      className="cursor-pointer"
                    >
                      <FolderMinus className="h-4 w-4 mr-2 text-neutral-400" />
                      Quitar de carpeta
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {projects
                  .filter((p) => p.id !== generation.project_id)
                  .map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignToProject(project.id);
                      }}
                      className="cursor-pointer"
                    >
                      <FolderOpen className="h-4 w-4 mr-2 text-neutral-400" />
                      {project.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-neutral-500">
            {formatDistanceToNow(new Date(generation.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </p>
          {currentProject && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <FolderOpen className="h-3 w-3" />
              {currentProject.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
