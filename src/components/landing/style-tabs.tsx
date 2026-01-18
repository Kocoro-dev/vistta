"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const styles = [
  {
    id: "nordic",
    name: "Nórdico",
    description: "Limpio y funcional. Ideal para el comprador europeo.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  },
  {
    id: "boho",
    name: "Boho-Chic",
    description: "Cálido y acogedor. Perfecto para Airbnb.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Espacioso y moderno. Para pisos urbanos.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
];

export function StyleTabs() {
  const [activeStyle, setActiveStyle] = useState(styles[0]);

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style)}
            className={cn(
              "px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-300",
              activeStyle.id === style.id
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Image and description */}
      <div className="relative">
        <div className="aspect-[16/9] rounded-[24px] overflow-hidden shadow-2xl shadow-black/10 border border-black/5">
          <img
            src={activeStyle.image}
            alt={activeStyle.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-8 pt-24 rounded-b-[24px]">
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-white text-[24px] font-semibold mb-2">
                Estilo {activeStyle.name}
              </h4>
              <p className="text-white/80 text-[15px]">{activeStyle.description}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-[13px] font-medium">
              Generado con IA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
