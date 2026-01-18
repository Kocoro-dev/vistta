"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "¿Es legal usar estas fotos en Idealista/Airbnb?",
    answer:
      'Sí, siempre que indiques que es una "Recreación Virtual" o "Propuesta de Decoración". VISTTA incluye una pequeña marca de agua opcional que dice "Virtual Staging" para que seas transparente con los compradores.',
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

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={cn(
            "rounded-2xl overflow-hidden transition-all duration-300",
            openIndex === index
              ? "bg-white shadow-sm border border-gray-200"
              : "bg-gray-100 hover:bg-gray-200/70"
          )}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <span className="font-semibold text-gray-900 pr-8 text-[16px]">
              {faq.question}
            </span>
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                openIndex === index
                  ? "bg-gray-900 text-white rotate-180"
                  : "bg-white text-gray-400"
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96" : "max-h-0"
            )}
          >
            <p className="px-6 pb-6 text-gray-500 leading-relaxed text-[15px]">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
