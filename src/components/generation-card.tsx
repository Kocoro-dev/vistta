"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, AlertCircle, ArrowUpRight } from "lucide-react";
import type { Generation } from "@/types/database";
import { STYLE_PRESETS } from "@/types/database";

interface GenerationCardProps {
  generation: Generation;
}

export function GenerationCard({ generation }: GenerationCardProps) {
  const style = STYLE_PRESETS.find((s) => s.id === generation.style);
  const isCompleted = generation.status === "completed";
  const isFailed = generation.status === "failed";
  const isProcessing =
    generation.status === "pending" || generation.status === "processing";

  const imageUrl = isCompleted
    ? generation.generated_image_url
    : generation.original_image_url;

  return (
    <div className="group border border-neutral-200 bg-white hover:border-neutral-300 transition-all">
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={style?.name || "Generation"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}

        {/* Status overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mx-auto mb-2" />
              <p className="text-[13px] font-medium text-neutral-600">Generando...</p>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center text-red-600">
              <AlertCircle className="h-5 w-5 mx-auto mb-2" />
              <p className="text-[13px] font-medium">Error</p>
            </div>
          </div>
        )}

        {/* Hover overlay for completed */}
        {isCompleted && (
          <Link
            href={`/editor?id=${generation.id}`}
            className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="text-white text-center">
              <ArrowUpRight className="h-5 w-5 mx-auto mb-1" />
              <span className="text-[13px] font-medium">Ver detalles</span>
            </div>
          </Link>
        )}

        {/* Style badge */}
        <span className="absolute top-3 left-3 bg-white/90 text-neutral-900 px-2.5 py-1 text-[11px] font-medium tracking-wide border border-neutral-200">
          {style?.name || generation.style}
        </span>
      </div>

      <div className="p-4 border-t border-neutral-100">
        <p className="text-[13px] text-neutral-500">
          {formatDistanceToNow(new Date(generation.created_at), {
            addSuffix: true,
            locale: es,
          })}
        </p>
      </div>
    </div>
  );
}
