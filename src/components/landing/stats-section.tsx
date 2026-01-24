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
      className={cn("py-32 px-6 lg:px-12 bg-neutral-900 text-white", className)}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="text-label text-neutral-500 mb-6 block">
            {content.label}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          {content.items.map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="stat-value flex items-baseline justify-center md:justify-start gap-2 mb-3">
                <span className="text-[clamp(3rem,8vw,6rem)] font-medium text-display text-white">
                  {stat.value}
                </span>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-orange-500" />
                )}
              </div>
              <p className="stat-label text-[17px] text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="max-w-2xl">
          <p className="text-[20px] lg:text-[24px] text-neutral-300 leading-relaxed text-editorial">
            {content.copy}
          </p>
        </div>
      </div>
    </section>
  );
}
