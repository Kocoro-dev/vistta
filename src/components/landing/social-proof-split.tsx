"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SocialProofContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface SocialProofSplitProps {
  content: SocialProofContent;
  className?: string;
}

export function SocialProofSplit({ content, className }: SocialProofSplitProps) {
  const [activeUsers, setActiveUsers] = useState(14);

  // Simulate random active users (credible proportion of 750)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 8) + 11); // 11-18 users
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
            <span className="text-label text-orange-500 mb-8 block">
              Resultados reales
            </span>

            <blockquote className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium text-white leading-[1.4] text-editorial mb-8">
              &quot;Antes tardaba días en preparar un piso para las fotos. Ahora subo las fotos y en minutos tengo el anuncio con una estética perfecta. <span className="text-orange-400">Mis reservas han subido un 30%.</span>&quot;
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
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-0 md:divide-x md:divide-white/10">
              {/* Stats Column */}
              <div className="md:pr-8">
                <span className="text-label text-white/60 mb-6 block">
                  Nuestra comunidad
                </span>

                <div className="mb-6">
                  <span className="text-[clamp(2.5rem,6vw,4rem)] font-medium text-white text-display block">
                    +750
                  </span>
                  <p className="text-[17px] text-white/70 mt-2">
                    clientes activos
                  </p>
                </div>

                <div className="flex items-center gap-2 text-emerald-400 mb-6">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-[15px] font-medium">
                    +17% crecimiento este mes
                  </span>
                </div>

                {/* Activity indicators */}
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[13px] text-white/60">
                    {activeUsers} usuarios activos ahora mismo
                  </span>
                </div>
              </div>

              {/* CTA Column */}
              <div className="md:pl-8 flex flex-col justify-center">
                <p className="text-[17px] text-white leading-relaxed mb-6">
                  Únete a Vistta y empieza a sacar más rendimiento a tus propiedades.
                </p>
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 px-6 py-3 text-[14px] font-medium transition-all hover:scale-[1.02]"
                >
                  Empezar ahora
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
