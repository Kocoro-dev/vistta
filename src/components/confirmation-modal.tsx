"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { STYLE_PRESETS, ROOM_TYPES, LIGHTING_OPTIONS, type GenerationModule } from "@/types/database";
import { Sparkles, Wand2, Sun, Stamp, FileWarning, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  imageUrl: string | null;
  module: GenerationModule;
  styleId?: string;
  roomTypeId?: string;
  lightingId: string;
  enableWatermark: boolean;
  watermarkText: string;
  enableDisclaimer: boolean;
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  isGenerating,
  imageUrl,
  module,
  styleId,
  roomTypeId,
  lightingId,
  enableWatermark,
  watermarkText,
  enableDisclaimer,
}: ConfirmationModalProps) {
  const style = STYLE_PRESETS.find((s) => s.id === styleId);
  const roomType = ROOM_TYPES.find((r) => r.id === roomTypeId);
  const lighting = LIGHTING_OPTIONS.find((l) => l.id === lightingId) || LIGHTING_OPTIONS[0];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-neutral-900">
            Confirmar generación
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image thumbnail */}
          {imageUrl && (
            <div className="aspect-video bg-neutral-100 rounded overflow-hidden">
              <img
                src={imageUrl}
                alt="Imagen original"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Configuration summary */}
          <div className="space-y-3 border border-neutral-200 p-4 bg-neutral-50">
            {/* Module */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-neutral-500 flex items-center gap-2">
                {module === "enhance" ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5" />
                )}
                Módulo
              </span>
              <span className="text-[14px] font-medium text-neutral-900">
                {module === "enhance" ? "Enhance" : "Vision"}
              </span>
            </div>

            {/* Style (Vision only) */}
            {module === "vision" && style && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500">Estilo</span>
                <span className="text-[14px] font-medium text-neutral-900">
                  {style.name}
                </span>
              </div>
            )}

            {/* Room type (Vision only) */}
            {module === "vision" && roomType && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500">Tipo de estancia</span>
                <span className="text-[14px] font-medium text-neutral-900">
                  {roomType.name}
                </span>
              </div>
            )}

            {/* Lighting */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-neutral-500 flex items-center gap-2">
                <Sun className="h-3.5 w-3.5" />
                Iluminación
              </span>
              <span className="text-[14px] font-medium text-neutral-900">
                {lighting.name}
              </span>
            </div>

            {/* Watermark */}
            {enableWatermark && watermarkText && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500 flex items-center gap-2">
                  <Stamp className="h-3.5 w-3.5" />
                  Marca de agua
                </span>
                <span className="text-[14px] font-medium text-neutral-900 truncate max-w-[200px]">
                  "{watermarkText}"
                </span>
              </div>
            )}

            {/* Disclaimer */}
            {enableDisclaimer && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500 flex items-center gap-2">
                  <FileWarning className="h-3.5 w-3.5" />
                  Disclaimer
                </span>
                <span className="text-[14px] font-medium text-green-600">
                  Activado
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1 inline-flex items-center justify-center border border-neutral-200 hover:border-neutral-300 text-neutral-700 h-11 text-[14px] font-medium transition-all hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isGenerating}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-11 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar imagen
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
