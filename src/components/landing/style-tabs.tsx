"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Style } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

// Default styles fallback
const defaultStyles: Style[] = [
  {
    id: "nordic",
    name: "Nórdico",
    description: "Limpio y funcional. Ideal para el comprador europeo.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  },
  {
    id: "boho",
    name: "Boho-Chic",
    description: "Cálido y acogedor. Perfecto para Airbnb.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Espacioso y moderno. Para pisos urbanos.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
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
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style)}
            className={cn(
              "px-5 py-2.5 text-[13px] font-medium transition-all border",
              activeStyle.id === style.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            )}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Image and description */}
      <div ref={containerRef} className="relative">
        <div className="aspect-[16/9] overflow-hidden border border-neutral-200">
          <img
            ref={imageRef}
            src={activeStyle.image}
            alt={activeStyle.name}
            className="w-full h-full object-cover will-change-transform"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-transparent p-8 pt-24">
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-white text-[20px] font-medium mb-2">
                Estilo {activeStyle.name}
              </h4>
              <p className="text-white/70 text-[14px]">{activeStyle.description}</p>
            </div>
            <span className="text-label text-white/50">
              Generado con IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
