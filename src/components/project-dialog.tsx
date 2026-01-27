"use client";

import { useState, useEffect } from "react";
import { createProject, updateProject, deleteProject } from "@/actions/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import type { Project } from "@/types/database";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null; // If provided, editing mode
  onSuccess?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectDialog({
  open,
  onClose,
  project,
  onSuccess,
  onDelete,
}: ProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!project;

  // Reset form when dialog opens/closes or project changes
  useEffect(() => {
    if (open) {
      setName(project?.name || "");
      setDescription(project?.description || "");
      setShowDeleteConfirm(false);
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && project) {
        const result = await updateProject(project.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });

        if (result.error) {
          toast.error(result.error);
        } else if (result.project) {
          toast.success("Carpeta actualizada");
          onSuccess?.(result.project);
          onClose();
        }
      } else {
        const result = await createProject({
          name: name.trim(),
          description: description.trim() || undefined,
        });

        if (result.error) {
          toast.error(result.error);
        } else if (result.project) {
          toast.success("Carpeta creada");
          onSuccess?.(result.project);
          onClose();
        }
      }
    } catch (error) {
      toast.error("Error al guardar la carpeta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    setIsDeleting(true);

    try {
      const result = await deleteProject(project.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Carpeta eliminada");
        onDelete?.(project.id);
        onClose();
      }
    } catch (error) {
      toast.error("Error al eliminar la carpeta");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[18px]">
            {isEditing ? "Editar carpeta" : "Nueva carpeta"}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-neutral-600">
            {isEditing
              ? "Modifica los detalles de tu carpeta."
              : "Crea una carpeta para organizar tus diseños."}
          </DialogDescription>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="py-4">
            <p className="text-[14px] text-neutral-600 mb-4">
              ¿Estás seguro de que quieres eliminar la carpeta{" "}
              <span className="font-medium text-neutral-900">{project?.name}</span>?
            </p>
            <p className="text-[13px] text-neutral-500 mb-6">
              Los diseños de esta carpeta no se eliminarán, solo se desasignarán.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[14px] font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Apartamento Madrid"
                  maxLength={100}
                  className="w-full px-3 py-2 border border-neutral-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                  Descripción{" "}
                  <span className="font-normal text-neutral-400">(opcional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade una descripción..."
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mr-auto text-[14px] font-medium text-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[14px] font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  "Guardar cambios"
                ) : (
                  "Crear carpeta"
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
