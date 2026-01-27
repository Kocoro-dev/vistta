"use client";

import { cn } from "@/lib/utils";
import type { GenerationModule } from "@/types/database";
import { Sparkles, Wand2 } from "lucide-react";

interface ModuleSelectorProps {
  selectedModule: GenerationModule;
  onModuleChange: (module: GenerationModule) => void;
  disabled?: boolean;
}

const modules: {
  id: GenerationModule;
  name: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "enhance",
    name: "Enhance",
    description: "Mejora fotos existentes: luz, nitidez, orden",
    icon: Sparkles,
  },
  {
    id: "vision",
    name: "Vision",
    description: "Amuebla espacios vacíos con decoración virtual",
    icon: Wand2,
  },
];

export function ModuleSelector({
  selectedModule,
  onModuleChange,
  disabled = false,
}: ModuleSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-[14px] font-medium text-neutral-900">
        Tipo de transformación
      </label>
      <div className="grid grid-cols-2 gap-3">
        {modules.map((module) => {
          const Icon = module.icon;
          const isSelected = selectedModule === module.id;

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onModuleChange(module.id)}
              disabled={disabled}
              className={cn(
                "relative flex flex-col items-center gap-2 border p-4 text-center transition-all",
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  isSelected ? "text-neutral-900" : "text-neutral-500"
                )}
              />
              <div>
                <p className="font-medium text-[14px] text-neutral-900">
                  {module.name}
                </p>
                <p className="text-[12px] text-neutral-500 mt-1">
                  {module.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 h-4 w-4 border border-neutral-900 bg-neutral-900 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
