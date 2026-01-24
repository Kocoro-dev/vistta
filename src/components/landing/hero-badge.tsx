"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroBadgeProps {
  text: string;
  className?: string;
}

export function HeroBadge({ text, className }: HeroBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white",
        "text-[12px] font-medium tracking-wide",
        "border border-neutral-800",
        "transition-all duration-300 hover:bg-neutral-800",
        className
      )}
    >
      <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
      <span>{text}</span>
    </div>
  );
}
