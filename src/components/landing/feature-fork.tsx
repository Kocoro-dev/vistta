"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MiniCompareSlider } from "./mini-compare-slider";
import { ForkContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface FeatureForkProps {
  content: ForkContent;
  className?: string;
}

export function FeatureFork({ content, className }: FeatureForkProps) {
  return (
    <section className={cn("py-32 px-6 lg:px-12", className)}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {content.cards.map((card, index) => (
            <div
              key={card.id}
              className={cn(
                "group relative overflow-hidden",
                "border border-neutral-200 hover:border-neutral-300",
                "transition-all duration-500 hover:-translate-y-1",
                index === 1 && "bg-neutral-900 text-white border-neutral-800 hover:border-neutral-700"
              )}
            >
              {/* Header */}
              <div className="p-8 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={cn(
                      "text-label",
                      index === 1 ? "text-orange-500" : "text-neutral-400"
                    )}
                  >
                    {card.target}
                  </span>
                </div>

                <h3
                  className={cn(
                    "text-[24px] lg:text-[28px] font-medium mb-3 text-editorial",
                    index === 1 ? "text-white" : "text-neutral-900"
                  )}
                >
                  {card.title}
                </h3>

                <p
                  className={cn(
                    "text-[15px] leading-relaxed mb-2",
                    index === 1 ? "text-neutral-400" : "text-neutral-500"
                  )}
                >
                  {card.tagline}
                </p>

                <p
                  className={cn(
                    "text-[14px] leading-relaxed mb-6",
                    index === 1 ? "text-neutral-500" : "text-neutral-400"
                  )}
                >
                  {card.description}
                </p>
              </div>

              {/* Mini Compare Slider */}
              <div className="px-8">
                <MiniCompareSlider
                  beforeImage={card.before_image}
                  afterImage={card.after_image}
                />
              </div>

              {/* CTA */}
              <div className="p-8 pt-6">
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex items-center gap-2 text-[14px] font-medium",
                    "transition-all duration-300",
                    index === 1
                      ? "text-white hover:text-orange-400"
                      : "text-neutral-900 hover:text-orange-600"
                  )}
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
