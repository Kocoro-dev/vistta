"use client";

import { cn } from "@/lib/utils";
import { Stamp } from "lucide-react";

interface CustomWatermarkToggleProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  watermarkText: string;
  onWatermarkTextChange: (text: string) => void;
  disabled?: boolean;
}

export function CustomWatermarkToggle({
  enabled,
  onEnabledChange,
  watermarkText,
  onWatermarkTextChange,
  disabled = false,
}: CustomWatermarkToggleProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onEnabledChange(!enabled)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between border p-3 transition-all",
          enabled
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-3">
          <Stamp className={cn("h-4 w-4", enabled ? "text-neutral-900" : "text-neutral-500")} />
          <div className="text-left">
            <p className="text-[14px] font-medium text-neutral-900">Marca de agua</p>
            <p className="text-[12px] text-neutral-500">Texto personalizado en la imagen</p>
          </div>
        </div>
        <div
          className={cn(
            "h-5 w-9 rounded-full transition-colors relative",
            enabled ? "bg-neutral-900" : "bg-neutral-300"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
              enabled ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </div>
      </button>

      {enabled && (
        <div className="pl-7">
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => onWatermarkTextChange(e.target.value)}
            placeholder="Ej: Inmobiliaria García · Tel: 900 123 456"
            disabled={disabled}
            maxLength={60}
            className={cn(
              "w-full h-10 px-3 border border-neutral-200 text-[14px] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <p className="text-[12px] text-neutral-400 mt-1">
            Máximo 60 caracteres
          </p>
        </div>
      )}
    </div>
  );
}
