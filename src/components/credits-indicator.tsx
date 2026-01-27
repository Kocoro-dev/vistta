"use client";

import { cn } from "@/lib/utils";
import { Zap, Infinity } from "lucide-react";
import Link from "next/link";

interface CreditsIndicatorProps {
  credits: number;
  hasPurchased: boolean;
  className?: string;
}

export function CreditsIndicator({
  credits,
  hasPurchased,
  className,
}: CreditsIndicatorProps) {
  const isUnlimited = hasPurchased;
  const isLow = !isUnlimited && credits <= 1;
  const isEmpty = !isUnlimited && credits === 0;

  return (
    <Link
      href="/planes"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-all rounded-full",
        isEmpty
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : isLow
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
        className
      )}
    >
      {isUnlimited ? (
        <>
          <Infinity className="h-3.5 w-3.5" />
          <span>Plan activo</span>
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5" />
          <span>
            {credits} {credits === 1 ? "crédito" : "créditos"}
          </span>
        </>
      )}
    </Link>
  );
}
