"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { STYLE_PRESETS, type StylePreset } from "@/types/database";
import { StyleGalleryModal } from "@/components/style-gallery-modal";
import { Eye } from "lucide-react";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

export function StyleSelector({
  selectedStyle,
  onStyleChange,
  disabled = false,
}: StyleSelectorProps) {
  const [galleryStyle, setGalleryStyle] = useState<StylePreset | null>(null);

  const handleOpenGallery = (style: StylePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryStyle(style);
  };

  return (
    <>
      <div className="space-y-4">
        <label className="text-[14px] font-medium text-neutral-900">Estilo de diseño</label>
        <div className="grid grid-cols-1 gap-2">
          {STYLE_PRESETS.map((style) => (
            <StyleOption
              key={style.id}
              style={style}
              isSelected={selectedStyle === style.id}
              onSelect={() => onStyleChange(style.id)}
              onOpenGallery={(e) => handleOpenGallery(style, e)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {galleryStyle && (
        <StyleGalleryModal
          open={!!galleryStyle}
          onClose={() => setGalleryStyle(null)}
          style={galleryStyle}
        />
      )}
    </>
  );
}

function StyleOption({
  style,
  isSelected,
  onSelect,
  onOpenGallery,
  disabled,
}: {
  style: StylePreset;
  isSelected: boolean;
  onSelect: () => void;
  onOpenGallery: (e: React.MouseEvent) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex items-start gap-3 border p-4 text-left transition-all",
        isSelected
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-[14px] text-neutral-900">{style.name}</p>
          <button
            type="button"
            onClick={onOpenGallery}
            disabled={disabled}
            className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-900 transition-colors"
            title="Ver ejemplos"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Ver ejemplos</span>
          </button>
        </div>
        <p className="text-[13px] text-neutral-500 mt-1 line-clamp-2">{style.description}</p>
      </div>
      <div
        className={cn(
          "h-4 w-4 border flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
          isSelected
            ? "border-neutral-900 bg-neutral-900"
            : "border-neutral-300"
        )}
      >
        {isSelected && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
