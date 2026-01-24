"use client";

import { Zap, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValuePropositionProps {
  id?: string;
  className?: string;
}

const benefits = [
  {
    icon: Zap,
    number: "01",
    title: "Resultados instantáneos",
    description: "Transforma tus imágenes en segundos, no en días. Sube una foto y obtén resultados profesionales al instante.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Sin experiencia necesaria",
    description: "No necesitas conocimientos técnicos ni de diseño. Sube tu foto y Vistta hace el resto.",
  },
  {
    icon: Brain,
    number: "03",
    title: "IA de última generación",
    description: "Tecnología de inteligencia artificial entrenada específicamente para el sector inmobiliario.",
  },
];

// Sample images for the carousel (these would be real property images)
const carouselImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
];

export function ValueProposition({ id, className }: ValuePropositionProps) {
  return (
    <section id={id} className={cn("py-32 overflow-hidden", className)}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header - Editorial left aligned */}
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <span className="text-label text-orange-500 mb-6 block">
              La plataforma
            </span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
              Mejora en segundos las imágenes de tus anuncios
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-[17px] text-neutral-500 leading-relaxed">
              Vistta es la herramienta que permite a propietarios y agencias crear imágenes con resultados profesionales, aumentando visitas y acelerando ventas y reservas.
            </p>
          </div>
        </div>

        {/* Benefits - Elegant cards */}
        <div className="grid md:grid-cols-3 gap-px bg-neutral-200 mb-24">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white p-10 hover:bg-neutral-50 transition-colors duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-[11px] font-medium text-neutral-300 tracking-wider">
                  {benefit.number}
                </span>
                <div className="h-10 w-10 border border-neutral-200 group-hover:border-neutral-900 group-hover:bg-neutral-900 flex items-center justify-center transition-all duration-500">
                  <benefit.icon className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <h3 className="text-[20px] font-medium text-neutral-900 mb-4 text-editorial">
                {benefit.title}
              </h3>
              <p className="text-[15px] text-neutral-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite scrolling carousel */}
      <div className="relative">
        <div className="flex animate-scroll-left">
          {/* First set */}
          {carouselImages.map((src, index) => (
            <div
              key={`a-${index}`}
              className="flex-shrink-0 w-[300px] h-[200px] mx-2 overflow-hidden"
            >
              <img
                src={src}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {carouselImages.map((src, index) => (
            <div
              key={`b-${index}`}
              className="flex-shrink-0 w-[300px] h-[200px] mx-2 overflow-hidden"
            >
              <img
                src={src}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
