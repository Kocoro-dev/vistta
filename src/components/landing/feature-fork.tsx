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
  // Override content for specific cards
  const getCardContent = (card: typeof content.cards[0]) => {
    if (card.id === "enhance" || card.title.toLowerCase().includes("enhance")) {
      return {
        tagline: "Mejora tus fotos para el alquiler vacacional, manteniendo el realismo.",
        description: "Optimiza la iluminación, limpia imperfecciones y realza los espacios. Ideal para propiedades vacacionales donde el cliente verá exactamente lo que reserva.",
      };
    }
    return { tagline: card.tagline, description: card.description };
  };

  return (
    <section className={cn("py-32 px-6 lg:px-12", className)}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {content.cards.map((card) => {
            const cardContent = getCardContent(card);
            return (
              <div
                key={card.id}
                className={cn(
                  "group relative overflow-hidden",
                  "bg-white border border-neutral-200",
                  "hover:bg-neutral-900 hover:border-neutral-800",
                  "transition-all duration-500"
                )}
              >
                {/* Header */}
                <div className="p-8 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-label text-neutral-400 group-hover:text-orange-500 transition-colors duration-500">
                      {card.target}
                    </span>
                  </div>

                  <h3 className="text-[24px] lg:text-[28px] font-medium mb-3 text-editorial text-neutral-900 group-hover:text-white transition-colors duration-500">
                    {card.title}
                  </h3>

                  <p className="text-[15px] leading-relaxed mb-2 text-neutral-500 group-hover:text-neutral-300 transition-colors duration-500">
                    {cardContent.tagline}
                  </p>

                  <p className="text-[14px] leading-relaxed mb-6 text-neutral-400 group-hover:text-neutral-400 transition-colors duration-500">
                    {cardContent.description}
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
                    href="/registro"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-900 group-hover:text-white transition-all duration-500"
                  >
                    {card.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <p className="text-[12px] text-neutral-400 group-hover:text-neutral-400 mt-4 transition-colors duration-500">
                    Tanto Vistta Enhance como Vistta Vision están incluidos para todos nuestros clientes.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
