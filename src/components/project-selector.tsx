"use client";

import { useState } from "react";
import { FolderOpen, Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types/database";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null; // null = no project filter, "none" = without project
  onProjectChange: (projectId: string | null) => void;
  onCreateProject: () => void;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectChange,
  onCreateProject,
}: ProjectSelectorProps) {
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getDisplayText = () => {
    if (selectedProjectId === null) return "Todos";
    if (selectedProjectId === "none") return "Sin carpeta";
    return selectedProject?.name || "Seleccionar";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => onProjectChange(null)}
          className={`
            px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors
            ${
              selectedProjectId === null
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }
          `}
        >
          Todos
        </button>
        <button
          onClick={() => onProjectChange("none")}
          className={`
            px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors
            ${
              selectedProjectId === "none"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }
          `}
        >
          Sin carpeta
        </button>

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectChange(project.id)}
            className={`
              px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1.5
              ${
                selectedProjectId === project.id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            {project.name}
          </button>
        ))}

        <button
          onClick={onCreateProject}
          className="px-3 py-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-700 whitespace-nowrap transition-colors inline-flex items-center gap-1.5 border border-dashed border-neutral-300 hover:border-neutral-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva carpeta
        </button>
      </div>
    </div>
  );
}

// Compact version for mobile or dropdown use
export function ProjectSelectorCompact({
  projects,
  selectedProjectId,
  onProjectChange,
  onCreateProject,
}: ProjectSelectorProps) {
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getDisplayText = () => {
    if (selectedProjectId === null) return "Todos";
    if (selectedProjectId === "none") return "Sin carpeta";
    return selectedProject?.name || "Seleccionar";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
          <FolderOpen className="h-4 w-4 text-neutral-400" />
          {getDisplayText()}
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => onProjectChange(null)}>
          <span className={selectedProjectId === null ? "font-medium" : ""}>
            Todos
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onProjectChange("none")}>
          <span className={selectedProjectId === "none" ? "font-medium" : ""}>
            Sin carpeta
          </span>
        </DropdownMenuItem>

        {projects.length > 0 && <DropdownMenuSeparator />}

        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => onProjectChange(project.id)}
          >
            <FolderOpen className="h-4 w-4 mr-2 text-neutral-400" />
            <span className={selectedProjectId === project.id ? "font-medium" : ""}>
              {project.name}
            </span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-2 text-neutral-400" />
          Nueva carpeta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
