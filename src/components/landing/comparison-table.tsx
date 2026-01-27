"use client";

import { useEffect, useRef } from "react";
import { Check, Minus, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ComparisonTableProps {
  className?: string;
}

const columns = [
  {
    id: "physical",
    title: "Home Staging Físico",
    subtitle: "The old way",
    highlighted: false,
  },
  {
    id: "3d",
    title: "Render 3D Tradicional",
    subtitle: "The slow way",
    highlighted: false,
  },
  {
    id: "vistta",
    title: "Vistta AI",
    subtitle: "The smart way",
    highlighted: true,
  },
];

interface CellValue {
  text: string;
  type: string;
  icon?: string;
  bold?: boolean;
}

interface RowData {
  id: string;
  label: string;
  values: {
    physical: CellValue;
    "3d": CellValue;
    vistta: CellValue;
  };
}

const rows: RowData[] = [
  {
    id: "cost",
    label: "Coste",
    values: {
      physical: { text: "300€ - 2.000€", type: "negative" },
      "3d": { text: "150€ / imagen", type: "negative" },
      vistta: { text: "~1,90€ / imagen", type: "highlight", bold: true },
    },
  },
  {
    id: "time",
    label: "Tiempo de Entrega",
    values: {
      physical: { text: "7 - 15 días", type: "negative" },
      "3d": { text: "3 - 5 días", type: "neutral" },
      vistta: { text: "< 30 segundos", type: "highlight", bold: true },
    },
  },
  {
    id: "logistics",
    label: "Logística",
    values: {
      physical: { text: "Muebles físicos, transporte", type: "negative" },
      "3d": { text: "Requiere planos CAD", type: "neutral" },
      vistta: { text: "100% Digital (Solo foto)", type: "positive" },
    },
  },
  {
    id: "scalability",
    label: "Escalabilidad",
    values: {
      physical: { text: "Muy Baja", icon: "x", type: "negative" },
      "3d": { text: "Baja", icon: "minus", type: "neutral" },
      vistta: { text: "Ilimitada", icon: "check", type: "positive" },
    },
  },
];

export function ComparisonTable({ className }: ComparisonTableProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        ".comparison-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate table rows
      gsap.fromTo(
        ".comparison-row",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".comparison-table",
            start: "top 75%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const renderIcon = (icon: string | undefined, type: string) => {
    if (!icon) return null;

    const iconClass = cn(
      "h-4 w-4 inline-block mr-2",
      type === "positive" && "text-green-600",
      type === "negative" && "text-neutral-400",
      type === "neutral" && "text-neutral-400"
    );

    switch (icon) {
      case "check":
        return <Check className={iconClass} />;
      case "x":
        return <X className={iconClass} />;
      case "minus":
        return <Minus className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      className={cn("py-32 px-6 lg:px-12 bg-neutral-50", className)}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="comparison-header max-w-2xl mb-16">
          <span className="text-label text-neutral-400 mb-6 block">
            Reality Check
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium text-neutral-900 text-editorial leading-[1.1] mb-4">
            Compara antes de decidir
          </h2>
          <p className="text-[17px] text-neutral-500 leading-relaxed">
            El home staging tradicional fue revolucionario en su momento. Hoy, la IA lo hace obsoleto.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Column Headers */}
            <div className="comparison-row grid grid-cols-4 gap-px bg-neutral-200 mb-px">
              {/* Empty cell for row labels */}
              <div className="bg-neutral-50 p-6" />

              {/* Column headers */}
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={cn(
                    "p-6 text-center",
                    col.highlighted
                      ? "bg-neutral-900 text-white"
                      : "bg-white"
                  )}
                >
                  {col.highlighted ? (
                    <>
                      <div className="flex justify-center mb-2">
                        <img
                          src="/logo-blanco-Vistta.svg"
                          alt="Vistta"
                          className="h-5"
                        />
                      </div>
                      <p className="text-[12px] text-neutral-400">
                        {col.subtitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-[15px] font-medium mb-1 text-neutral-900">
                        {col.title}
                      </h3>
                      <p className="text-[12px] text-neutral-500">
                        {col.subtitle}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {rows.map((row) => (
              <div
                key={row.id}
                className="comparison-row grid grid-cols-4 gap-px bg-neutral-200 mb-px"
              >
                {/* Row label */}
                <div className="bg-neutral-50 p-6 flex items-center">
                  <span className="text-[14px] font-medium text-neutral-700">
                    {row.label}
                  </span>
                </div>

                {/* Values */}
                {columns.map((col) => {
                  const value = row.values[col.id as keyof typeof row.values];
                  const isHighlightedCell = col.highlighted;
                  const isHighlightedValue = value.type === "highlight";

                  return (
                    <div
                      key={col.id}
                      className={cn(
                        "p-6 flex items-center justify-center text-center",
                        isHighlightedCell
                          ? "bg-indigo-50/50"
                          : "bg-white"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[14px]",
                          value.bold && "font-semibold",
                          isHighlightedValue && "text-neutral-900 font-semibold",
                          value.type === "positive" && "text-green-700",
                          value.type === "negative" && "text-neutral-500",
                          value.type === "neutral" && "text-neutral-600"
                        )}
                      >
                        {renderIcon(value.icon, value.type)}
                        {value.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Bottom row - Subtle CTA hint */}
            <div className="comparison-row grid grid-cols-4 gap-px bg-neutral-200">
              <div className="bg-neutral-50 p-4" />
              <div className="bg-white p-4" />
              <div className="bg-white p-4" />
              <div className="bg-indigo-50/50 p-4 text-center">
                <span className="text-[12px] font-medium text-orange-600">
                  La elección inteligente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly summary */}
        <div className="mt-12 lg:hidden">
          <div className="bg-neutral-900 text-white p-6">
            <h4 className="text-[15px] font-medium mb-4">Vistta AI vs. Alternativas</h4>
            <ul className="space-y-3 text-[14px]">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span><strong className="text-white">100x más barato</strong> que staging físico</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span><strong className="text-white">1000x más rápido</strong> que render 3D</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span><strong className="text-white">Sin logística</strong> ni requisitos técnicos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
