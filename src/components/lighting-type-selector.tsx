"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIGHTING_OPTIONS } from "@/types/database";
import { Sun } from "lucide-react";

interface LightingTypeSelectorProps {
  selectedLighting: string;
  onLightingChange: (lighting: string) => void;
  disabled?: boolean;
}

export function LightingTypeSelector({
  selectedLighting,
  onLightingChange,
  disabled = false,
}: LightingTypeSelectorProps) {
  const selectedOption = LIGHTING_OPTIONS.find((l) => l.id === selectedLighting);

  return (
    <div className="space-y-3">
      <label className="text-[14px] font-medium text-neutral-900 flex items-center gap-2">
        <Sun className="h-4 w-4 text-neutral-500" />
        Tipo de iluminación
      </label>
      <Select
        value={selectedLighting}
        onValueChange={onLightingChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-11">
          <SelectValue placeholder="Selecciona el tipo de iluminación" />
        </SelectTrigger>
        <SelectContent>
          {LIGHTING_OPTIONS.map((lighting) => (
            <SelectItem key={lighting.id} value={lighting.id}>
              <div className="flex flex-col items-start">
                <span>{lighting.name}</span>
                <span className="text-[12px] text-neutral-500">{lighting.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption && (
        <p className="text-[13px] text-neutral-500">{selectedOption.description}</p>
      )}
    </div>
  );
}
