"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatsContent } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface StatsSectionProps {
  content: StatsContent;
  className?: string;
}

export function StatsSection({ content, className }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          setHasAnimated(true);

          // Animate stat numbers
          gsap.fromTo(
            ".stat-value",
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
            }
          );

          // Animate stat labels
          gsap.fromTo(
            ".stat-label",
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              delay: 0.2,
              ease: "power2.out",
            }
          );
        },
      });
    });

    return () => ctx.revert();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className={cn("py-32 px-6 lg:px-12 relative overflow-hidden", className)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/examples/estilo-nordico.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <span className="text-label text-orange-500 mb-6 block">
            Resultados profesionales
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {content.items.map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="stat-value flex items-baseline justify-center gap-2 mb-3">
                <span className="text-[clamp(2.5rem,6vw,4rem)] font-medium text-display text-white">
                  {stat.value}
                </span>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-orange-400" />
                )}
              </div>
              <p className="stat-label text-[15px] text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="max-w-2xl">
          <p className="text-[18px] lg:text-[22px] text-white/90 leading-relaxed text-editorial">
            No es magia, son datos. Las fotos profesionales venden más, a mejor precio y más rápido.
          </p>
        </div>
      </div>
    </section>
  );
}
