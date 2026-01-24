"use client";

import { cn } from "@/lib/utils";

interface FacePileProps {
  count: string;
  suffix: string;
  className?: string;
}

const avatars = [
  { initials: "MG", bg: "bg-orange-500" },
  { initials: "CR", bg: "bg-neutral-700" },
  { initials: "AM", bg: "bg-neutral-500" },
  { initials: "PS", bg: "bg-orange-600" },
  { initials: "LT", bg: "bg-neutral-600" },
];

export function FacePile({ count, suffix, className }: FacePileProps) {
  const currentYear = new Date().getFullYear();
  const displaySuffix = suffix.replace("{year}", currentYear.toString());

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Stacked avatars */}
      <div className="flex -space-x-3">
        {avatars.map((avatar, i) => (
          <div
            key={i}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center",
              "text-[11px] font-medium text-white",
              "border-2 border-white",
              "transition-transform duration-300 hover:scale-110 hover:z-10",
              avatar.bg
            )}
            style={{ zIndex: avatars.length - i }}
          >
            {avatar.initials}
          </div>
        ))}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-[14px] font-medium text-neutral-900">
          {count}
        </span>
        <span className="text-[12px] text-neutral-500">
          {displaySuffix}
        </span>
      </div>
    </div>
  );
}
