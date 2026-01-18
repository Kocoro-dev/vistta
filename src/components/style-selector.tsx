"use client";

import { cn } from "@/lib/utils";
import { STYLE_PRESETS, type StylePreset } from "@/types/database";
import { Check } from "lucide-react";

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
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Estilo de diseño</label>
      <div className="grid grid-cols-1 gap-3">
        {STYLE_PRESETS.map((style) => (
          <StyleOption
            key={style.id}
            style={style}
            isSelected={selectedStyle === style.id}
            onSelect={() => onStyleChange(style.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function StyleOption({
  style,
  isSelected,
  onSelect,
  disabled,
}: {
  style: StylePreset;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex-1">
        <p className="font-medium">{style.name}</p>
      </div>
      {isSelected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
}
