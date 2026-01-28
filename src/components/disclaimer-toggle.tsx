"use client";

import { cn } from "@/lib/utils";
import { FileWarning } from "lucide-react";

interface DisclaimerToggleProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function DisclaimerToggle({
  enabled,
  onEnabledChange,
  disabled = false,
}: DisclaimerToggleProps) {
  return (
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
        <FileWarning className={cn("h-4 w-4", enabled ? "text-neutral-900" : "text-neutral-500")} />
        <div className="text-left">
          <p className="text-[14px] font-medium text-neutral-900">Disclaimer legal</p>
          <p className="text-[12px] text-neutral-500">
            "Virtual staging - solo con fines ilustrativos"
          </p>
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
  );
}
