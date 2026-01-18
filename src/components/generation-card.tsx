"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Eye } from "lucide-react";
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
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={style?.name || "Generation"}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}

          {/* Status overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Generando...</p>
              </div>
            </div>
          )}

          {isFailed && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center text-destructive">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Error</p>
              </div>
            </div>
          )}

          {/* Hover overlay for completed */}
          {isCompleted && (
            <Link
              href={`/editor?id=${generation.id}`}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="text-white text-center">
                <Eye className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Ver detalles</span>
              </div>
            </Link>
          )}

          {/* Style badge */}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-background/90"
          >
            {style?.name || generation.style}
          </Badge>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(generation.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
