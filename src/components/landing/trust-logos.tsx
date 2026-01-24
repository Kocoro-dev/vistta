"use client";

import { cn } from "@/lib/utils";

interface TrustLogosProps {
  label: string;
  logos: string[];
  className?: string;
}

export function TrustLogos({ label, logos, className }: TrustLogosProps) {
  return (
    <section className={cn("py-24 mt-8 px-6 lg:px-12 border-y border-neutral-100", className)}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center gap-8">
          <span className="text-[14px] text-neutral-500 font-medium">Nuestros clientes publican en:</span>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
            {logos.map((logo) => (
              <span
                key={logo}
                className={cn(
                  "text-[28px] lg:text-[36px] font-semibold tracking-tight",
                  "text-neutral-900/60 cursor-default",
                  "hover:text-neutral-900 transition-colors"
                )}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
