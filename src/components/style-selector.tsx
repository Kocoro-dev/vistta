"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { STYLE_PRESETS, type StylePreset } from "@/types/database";
import { StyleGalleryModal } from "@/components/style-gallery-modal";
import { Eye, Check } from "lucide-react";
import Image from "next/image";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

// Map style IDs to placeholder colors for when images are missing
const STYLE_COLORS: Record<string, string> = {
  modern: "from-slate-600 to-slate-800",
  minimalist: "from-stone-400 to-stone-600",
  industrial: "from-zinc-700 to-zinc-900",
  scandinavian: "from-sky-200 to-sky-400",
  mediterranean: "from-amber-300 to-amber-500",
  boho: "from-orange-400 to-orange-600",
};

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STYLE_PRESETS.map((style) => (
            <StyleCard
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

function StyleCard({
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
  const [imageError, setImageError] = useState(false);
  const imagePath = `/examples/styles/${style.id}/1.webp`;
  const gradientColor = STYLE_COLORS[style.id] || "from-neutral-400 to-neutral-600";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex flex-col border transition-all overflow-hidden group",
        isSelected
          ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-1"
          : "border-neutral-200 hover:border-neutral-400",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {!imageError ? (
          <Image
            src={imagePath}
            alt={style.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", gradientColor)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/80 text-[11px] font-medium uppercase tracking-wider">
                {style.name}
              </span>
            </div>
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 h-6 w-6 bg-neutral-900 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* View examples button */}
        <button
          type="button"
          onClick={onOpenGallery}
          disabled={disabled}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-white/90 hover:bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 transition-all opacity-0 group-hover:opacity-100"
          title="Ver ejemplos"
        >
          <Eye className="h-3 w-3" />
          <span>Ver</span>
        </button>
      </div>

      {/* Text content */}
      <div className="p-3 text-left">
        <p className="font-medium text-[13px] text-neutral-900 leading-tight">{style.name}</p>
        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-snug">
          {style.description}
        </p>
      </div>
    </button>
  );
}
