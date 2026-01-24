"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Style } from "@/lib/content";

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

  return (
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
            "aspect-[16/9] overflow-hidden",
            "border border-neutral-200/50",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.03)]"
          )}
        >
          <img
            ref={imageRef}
            src={activeStyle.image}
            alt={activeStyle.name}
            className="w-full h-full object-cover will-change-transform"
          />
        </div>

        {/* Info overlay - refined positioning */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent p-8 pt-32">
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
  );
}
