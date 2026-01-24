"use client";

import { Shield, Zap, MousePointer, Sparkles } from "lucide-react";
import { BentoContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  content: BentoContent;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  mouse: MousePointer,
  sparkles: Sparkles,
};

export function BentoGrid({ content, className }: BentoGridProps) {
  return (
    <section className={cn("py-32 px-6 lg:px-12 bg-neutral-50", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <span className="text-label text-neutral-400 mb-6 block">
            {content.label}
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
            {content.title}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-neutral-200">
          {content.items.map((item, index) => {
            const Icon = iconMap[item.icon] || Sparkles;

            return (
              <div
                key={item.id}
                className={cn(
                  "bento-item group bg-neutral-50 p-8 lg:p-12",
                  "transition-all duration-500",
                  "hover:bg-white"
                )}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={cn(
                      "flex-shrink-0 h-12 w-12 flex items-center justify-center",
                      "bg-neutral-900 text-white",
                      "transition-all duration-300",
                      "group-hover:bg-orange-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-[18px] font-medium text-neutral-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
