import Link from "next/link";
import { getSectionContent } from "@/actions/admin";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const sections = [
  { id: "hero", name: "Hero", description: "Título principal y slider de comparación" },
  { id: "trust", name: "Trust", description: "Logos de plataformas asociadas" },
  { id: "problem", name: "Problema", description: "Sección de problema y solución" },
  { id: "steps", name: "Pasos", description: "Los 3 pasos del proceso" },
  { id: "styles", name: "Estilos", description: "Galería de estilos de diseño" },
  { id: "testimonial", name: "Testimonios", description: "Cita de cliente destacado" },
  { id: "pricing", name: "Precios", description: "Planes y precios" },
  { id: "faq", name: "FAQ", description: "Preguntas frecuentes" },
  { id: "cta", name: "CTA", description: "Llamada a la acción final" },
  { id: "footer", name: "Footer", description: "Pie de página y enlaces" },
];

export default async function AdminLandingPage() {
  // Check which sections have content
  const sectionStatus = await Promise.all(
    sections.map(async (section) => {
      const content = await getSectionContent("landing", section.id);
      return { ...section, hasContent: !!content };
    })
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[28px] font-medium text-white mb-2">
          Landing Page
        </h1>
        <p className="text-[15px] text-neutral-500">
          Edita el contenido de la página principal
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionStatus.map((section) => (
          <Link
            key={section.id}
            href={`/admin/landing/${section.id}`}
            className="group bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[16px] font-medium text-white">
                {section.name}
              </h3>
              <div className="flex items-center gap-2">
                {section.hasContent ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
            <p className="text-[13px] text-neutral-500">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Preview Link */}
      <div className="mt-10 p-6 bg-neutral-900 border border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-medium text-white mb-1">
              Vista previa
            </h3>
            <p className="text-[13px] text-neutral-500">
              Los cambios se reflejan inmediatamente en la página
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 h-9 text-[13px] font-medium transition-colors"
          >
            Ver Landing
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
