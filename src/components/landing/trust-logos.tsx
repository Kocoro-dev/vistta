"use client";

import { cn } from "@/lib/utils";

interface TrustLogosProps {
  label: string;
  logos: string[];
  className?: string;
}

export function TrustLogos({ label, logos, className }: TrustLogosProps) {
  return (
    <section className={cn("py-16 px-6 lg:px-12 border-y border-neutral-100", className)}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-6">
          <span className="text-label text-neutral-400">{label}</span>
          {logos.map((logo) => (
            <span
              key={logo}
              className={cn(
                "text-[24px] lg:text-[28px] font-medium tracking-tight",
                "text-neutral-300 grayscale-hover cursor-default",
                "hover:text-neutral-900"
              )}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
