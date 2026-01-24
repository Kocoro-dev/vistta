"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FAQItem } from "@/lib/content";

// Default FAQs fallback
const defaultFaqs: FAQItem[] = [
  {
    question: "¿Es legal usar estas fotos en Idealista/Airbnb?",
    answer:
      'Sí, siempre que indiques que es una "Recreación Virtual" o "Propuesta de Decoración". Vistta incluye una pequeña marca de agua opcional que dice "Virtual Staging" para que seas transparente con los compradores.',
  },
  {
    question: "¿La IA cambia la estructura de la casa?",
    answer:
      "No. Nuestra tecnología respeta las paredes, ventanas, suelos y techos. Solo cambiamos el mobiliario y la decoración. El comprador reconocerá el espacio al visitarlo.",
  },
  {
    question: "¿Qué calidad tienen las imágenes?",
    answer:
      "Las imágenes se generan en alta resolución (hasta 4K) con calidad fotorrealista. Son perfectas para publicar en portales inmobiliarios o redes sociales.",
  },
  {
    question: "¿Cuánto tiempo tarda en generarse?",
    answer:
      "Normalmente entre 10 y 20 segundos. Sube tu foto, elige el estilo, y en menos de medio minuto tienes tu render listo para publicar.",
  },
  {
    question: "¿Cómo funciona la facturación?",
    answer:
      "Utilizamos una pasarela de pago segura que emite facturas válidas para tu contabilidad. Puedes cancelar tu suscripción en cualquier momento.",
  },
];

interface FAQProps {
  items?: FAQItem[];
}

export function FAQ({ items = defaultFaqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-neutral-200 border-t border-neutral-200">
      {items.map((faq, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-start justify-between py-6 text-left group"
          >
            <span className="font-medium text-neutral-900 pr-8 text-[15px] group-hover:text-neutral-600 transition-colors">
              {faq.question}
            </span>
            <div
              className={cn(
                "h-6 w-6 border flex items-center justify-center flex-shrink-0 transition-all mt-0.5",
                openIndex === index
                  ? "bg-neutral-900 border-neutral-900 rotate-45"
                  : "border-neutral-300"
              )}
            >
              <svg
                className={cn(
                  "w-3 h-3 transition-colors",
                  openIndex === index ? "text-white" : "text-neutral-400"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96 pb-6" : "max-h-0"
            )}
          >
            <p className="text-neutral-500 leading-relaxed text-[15px] pr-12">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
