"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HeroSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function HeroSlider({
  beforeImage,
  afterImage,
  className,
}: HeroSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const afterImageRef = useRef<HTMLImageElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Parallax effect on images
  useEffect(() => {
    if (!containerRef.current || !beforeImageRef.current || !afterImageRef.current) return;

    const ctx = gsap.context(() => {
      const images = [beforeImageRef.current, afterImageRef.current];

      images.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.1 },
          {
            yPercent: 5,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden select-none border border-neutral-200",
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After image (background) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={afterImageRef}
          src={afterImage}
          alt="Después"
          className="w-full h-full object-cover will-change-transform"
          draggable={false}
        />
        <span className="absolute bottom-5 right-5 bg-neutral-900 text-white px-4 py-2 text-[12px] font-medium tracking-wide z-10">
          Después
        </span>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          ref={beforeImageRef}
          src={beforeImage}
          alt="Antes"
          className="w-full h-full object-cover will-change-transform"
          draggable={false}
        />
        <span className="absolute bottom-5 left-5 bg-white text-neutral-900 px-4 py-2 text-[12px] font-medium tracking-wide border border-neutral-200 z-10">
          Antes
        </span>
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-white border border-neutral-200 flex items-center justify-center cursor-ew-resize shadow-lg">
          <svg
            className="w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Floating instruction */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white text-neutral-600 text-[12px] px-4 py-2 font-medium border border-neutral-200 pointer-events-none z-20">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Arrastra para comparar
        </span>
      </div>
    </div>
  );
}
