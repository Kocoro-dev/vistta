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
    <section className={cn("py-32 px-6 lg:px-12", className)}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-px bg-neutral-200">
          {/* Quote Side */}
          <div className="bg-white p-8 lg:p-16">
            <span className="text-label text-neutral-400 mb-8 block">
              Testimonial
            </span>

            <blockquote className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium text-neutral-900 leading-[1.4] text-editorial mb-8">
              &quot;{content.quote}&quot;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center">
                {content.author_image ? (
                  <img
                    src={content.author_image}
                    alt={content.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[14px] font-medium text-neutral-500">
                    {content.author_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-[15px] text-neutral-900">
                  {content.author_name}
                </p>
                <p className="text-[14px] text-neutral-500">
                  {content.author_role}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Side */}
          <div className="bg-neutral-50 p-8 lg:p-16 flex flex-col justify-center">
            <span className="text-label text-neutral-400 mb-8 block">
              {content.stats_title}
            </span>

            <div className="mb-8">
              <span className="text-[clamp(3rem,8vw,5rem)] font-medium text-neutral-900 text-display block">
                {content.stats_count}
              </span>
              <p className="text-[17px] text-neutral-500 mt-2">
                usuarios activos
              </p>
            </div>

            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-[15px] font-medium">
                {content.stats_trend}
              </span>
            </div>

            {/* Activity indicators */}
            <div className="mt-8 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="text-[13px] text-neutral-500">
                Usuarios activos ahora mismo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
