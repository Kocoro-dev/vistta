"use client";

import { cn } from "@/lib/utils";
import { STYLE_PRESETS, type StylePreset } from "@/types/database";

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
    <div className="space-y-4">
      <label className="text-[14px] font-medium text-neutral-900">Estilo de diseño</label>
      <div className="grid grid-cols-1 gap-2">
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
        "relative flex items-center gap-3 border p-4 text-left transition-all",
        isSelected
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex-1">
        <p className="font-medium text-[14px] text-neutral-900">{style.name}</p>
      </div>
      <div
        className={cn(
          "h-4 w-4 border flex items-center justify-center transition-all",
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
