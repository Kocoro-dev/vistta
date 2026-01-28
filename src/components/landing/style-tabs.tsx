"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Style } from "@/lib/content";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Updated default styles with Linear-style names
const defaultStyles: Style[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Líneas limpias y acabados contemporáneos. El favorito del mercado premium.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },
  {
    id: "nordic",
    name: "Nórdico",
    description: "Funcionalidad escandinava. Maderas claras, textiles naturales, luz difusa.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Ladrillo visto, metal negro, hormigón pulido. Para lofts y espacios diáfanos.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    id: "mediterranean",
    name: "Mediterráneo",
    description: "Blancos cálidos, tonos tierra, cerámica artesanal. Perfecto para costa y zonas turísticas.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
  },
];

interface StyleTabsProps {
  styles?: Style[];
}

export function StyleTabs({ styles = defaultStyles }: StyleTabsProps) {
  const [activeStyle, setActiveStyle] = useState(styles[0]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on the image
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Re-trigger animation on style change
  useEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1.15, duration: 0.6, ease: "power2.out" }
    );
  }, [activeStyle]);

  const handleImageClick = () => {
    const currentIndex = styles.findIndex(s => s.id === activeStyle.id);
    setGalleryIndex(currentIndex);
    setIsGalleryOpen(true);
  };

  const handlePrevious = () => {
    setGalleryIndex((prev) => (prev === 0 ? styles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setGalleryIndex((prev) => (prev === styles.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsGalleryOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);

  const currentGalleryStyle = styles[galleryIndex];

  return (
    <>
      <div className="space-y-8">
        {/* Tabs - pill style */}
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style)}
              className={cn(
                "px-6 py-3 text-[13px] font-medium transition-all duration-300",
                activeStyle.id === style.id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Image and description */}
        <div ref={containerRef} className="relative">
          <div
            className={cn(
              "aspect-[16/9] overflow-hidden cursor-pointer group",
              "border border-neutral-200/50",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.03)]"
            )}
            onClick={handleImageClick}
          >
            <img
              ref={imageRef}
              src={activeStyle.image}
              alt={activeStyle.name}
              className="w-full h-full object-cover will-change-transform"
            />
            {/* Zoom hint overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-neutral-700" />
                <span className="text-[13px] font-medium text-neutral-700">Ver galería</span>
              </div>
            </div>
          </div>

          {/* Info overlay - refined positioning */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent p-8 pt-32 pointer-events-none">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h4 className="text-white text-[22px] font-medium mb-2 text-editorial">
                  Estilo {activeStyle.name}
                </h4>
                <p className="text-white/70 text-[14px] max-w-md">
                  {activeStyle.description}
                </p>
              </div>
              <span className="text-label text-white/40">
                Generado con IA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent
          className="max-w-6xl p-0 overflow-hidden bg-neutral-950 border-neutral-800"
          showCloseButton={false}
        >
          {/* Custom close button */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 z-50 h-10 w-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Main image */}
          <div className="relative aspect-[16/10] bg-neutral-900">
            <img
              src={currentGalleryStyle.image}
              alt={currentGalleryStyle.name}
              className="w-full h-full object-contain"
            />

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {styles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setGalleryIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    idx === galleryIndex
                      ? "bg-white w-6"
                      : "bg-white/40 hover:bg-white/60 w-2"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Info bar */}
          <div className="p-6 bg-neutral-900 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-[18px] font-medium mb-1">
                  Estilo {currentGalleryStyle.name}
                </h3>
                <p className="text-neutral-400 text-[14px]">
                  {currentGalleryStyle.description}
                </p>
              </div>
              <span className="text-[12px] text-neutral-500 uppercase tracking-wider">
                {galleryIndex + 1} / {styles.length}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {styles.map((style, idx) => (
                <button
                  key={style.id}
                  onClick={() => setGalleryIndex(idx)}
                  className={cn(
                    "relative w-24 h-16 overflow-hidden flex-shrink-0 transition-all",
                    idx === galleryIndex
                      ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-950"
                      : "opacity-50 hover:opacity-80"
                  )}
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
