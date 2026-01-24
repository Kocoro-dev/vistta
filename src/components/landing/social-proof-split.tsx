"use client";

import { TrendingUp } from "lucide-react";
import { SocialProofContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface SocialProofSplitProps {
  content: SocialProofContent;
  className?: string;
}

export function SocialProofSplit({ content, className }: SocialProofSplitProps) {
  return (
    <section
      className={cn(
        "py-32 px-6 lg:px-12 relative overflow-hidden",
        className
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/clientes usan vistta.png')" }}
      />
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quote Side */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl">
            <span className="text-label text-white/60 mb-8 block">
              Testimonial
            </span>

            <blockquote className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium text-white leading-[1.4] text-editorial mb-8">
              &quot;{content.quote}&quot;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden flex items-center justify-center border border-white/30">
                {content.author_image ? (
                  <img
                    src={content.author_image}
                    alt={content.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[14px] font-medium text-white">
                    {content.author_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-[15px] text-white">
                  {content.author_name}
                </p>
                <p className="text-[14px] text-white/70">
                  {content.author_role}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Side */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 lg:p-12 flex flex-col justify-center shadow-2xl">
            <span className="text-label text-white/60 mb-8 block">
              {content.stats_title}
            </span>

            <div className="mb-8">
              <span className="text-[clamp(3rem,8vw,5rem)] font-medium text-white text-display block">
                {content.stats_count}
              </span>
              <p className="text-[17px] text-white/70 mt-2">
                usuarios activos
              </p>
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-[15px] font-medium">
                {content.stats_trend}
              </span>
            </div>

            {/* Activity indicators */}
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="text-[13px] text-white/60">
                Usuarios activos ahora mismo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
