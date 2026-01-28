"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StylePreset } from "@/types/database";

interface StyleGalleryModalProps {
  open: boolean;
  onClose: () => void;
  style: StylePreset;
}

export function StyleGalleryModal({ open, onClose, style }: StyleGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const examplesCount = style.examplesCount || 4;

  // Reset index when style changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [style.id]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? examplesCount - 1 : prev - 1));
  }, [examplesCount]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === examplesCount - 1 ? 0 : prev + 1));
  }, [examplesCount]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrevious, handleNext]);

  const getImagePath = (index: number) => {
    return `/examples/styles/${style.id}/${index + 1}.webp`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-medium">
            Estilo {style.name}
          </DialogTitle>
          <p className="text-sm text-neutral-500 mt-1">{style.description}</p>
        </DialogHeader>

        <div className="relative">
          {/* Main Image */}
          <div className="relative aspect-[4/3] bg-neutral-100">
            <Image
              src={getImagePath(currentIndex)}
              alt={`${style.name} ejemplo ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5 text-neutral-700" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: examplesCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  idx === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex gap-2 justify-center">
            {Array.from({ length: examplesCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "relative w-20 h-14 overflow-hidden transition-all",
                  idx === currentIndex
                    ? "ring-2 ring-neutral-900 ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={getImagePath(idx)}
                  alt={`${style.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
