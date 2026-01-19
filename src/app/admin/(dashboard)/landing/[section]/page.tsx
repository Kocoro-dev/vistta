import { notFound } from "next/navigation";
import Link from "next/link";
import { getSectionContent } from "@/actions/admin";
import { ContentEditor } from "@/components/admin/content-editor";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

// Define field configurations for each section
// Keys must match the database schema in admin-schema.sql
const sectionConfigs: Record<string, {
  title: string;
  description: string;
  fields: any[];
}> = {
  hero: {
    title: "Hero Section",
    description: "Título principal y slider de comparación antes/después",
    fields: [
      { key: "label", label: "Etiqueta Superior", type: "text", placeholder: "ej: Virtual Home Staging" },
      { key: "title_line1", label: "Título Línea 1", type: "text", placeholder: "ej: Transforma espacios." },
      { key: "title_line2", label: "Título Línea 2 (color gris)", type: "text", placeholder: "ej: Vende visiones." },
      { key: "description", label: "Descripción", type: "textarea", placeholder: "Descripción breve del servicio" },
      { key: "cta_primary", label: "Texto Botón Principal", type: "text", placeholder: "ej: Probar gratis" },
      { key: "cta_secondary", label: "Texto Botón Secundario", type: "text", placeholder: "ej: Ver demo" },
      { key: "slider_before_image", label: "Imagen Antes (Slider)", type: "image" },
      { key: "slider_after_image", label: "Imagen Después (Slider)", type: "image" },
    ],
  },
  trust: {
    title: "Trust Section",
    description: "Logos de plataformas asociadas y texto de confianza",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Publican en" },
      { key: "logos", label: "Plataformas", type: "string-array", placeholder: "Nombre de la plataforma" },
    ],
  },
  problem: {
    title: "Problema y Solución",
    description: "Sección que presenta el problema y cómo lo resolvemos",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: El problema" },
      { key: "title", label: "Título Principal", type: "text" },
      { key: "description", label: "Descripción del Problema", type: "textarea" },
      {
        key: "cards",
        label: "Tarjetas del Problema",
        type: "array",
        fields: [
          { key: "number", label: "Número", type: "text", placeholder: "ej: 01" },
          { key: "title", label: "Título", type: "text" },
          { key: "description", label: "Descripción", type: "textarea" },
        ],
      },
      {
        key: "solution",
        label: "Solución",
        type: "object",
        fields: [
          { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Solución" },
          { key: "title", label: "Título", type: "text" },
          { key: "description", label: "Descripción", type: "textarea" },
        ],
      },
    ],
  },
  steps: {
    title: "Pasos del Proceso",
    description: "Los 3 pasos del proceso de staging virtual",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Proceso" },
      { key: "title_line1", label: "Título Línea 1", type: "text", placeholder: "ej: Tres pasos." },
      { key: "title_line2", label: "Título Línea 2", type: "text", placeholder: "ej: Menos de un minuto." },
      {
        key: "steps",
        label: "Pasos",
        type: "array",
        fields: [
          { key: "number", label: "Número", type: "text", placeholder: "ej: 01" },
          { key: "title", label: "Título del Paso", type: "text" },
          { key: "description", label: "Descripción", type: "textarea" },
        ],
      },
    ],
  },
  styles: {
    title: "Estilos de Diseño",
    description: "Galería de estilos disponibles",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Estilos" },
      { key: "title", label: "Título de la Sección", type: "text" },
      { key: "description", label: "Descripción", type: "textarea" },
      {
        key: "styles",
        label: "Estilos",
        type: "array",
        fields: [
          { key: "id", label: "ID (único)", type: "text", placeholder: "ej: nordic" },
          { key: "name", label: "Nombre del Estilo", type: "text" },
          { key: "description", label: "Descripción", type: "text" },
          { key: "image", label: "Imagen de Ejemplo", type: "image" },
        ],
      },
    ],
  },
  testimonial: {
    title: "Testimonios",
    description: "Citas de clientes destacados",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Testimonios" },
      { key: "quote", label: "Cita Principal", type: "textarea" },
      { key: "highlight", label: "Texto Destacado (naranja)", type: "text", placeholder: "ej: Mis reservas subieron un 30%." },
      { key: "author_name", label: "Nombre del Autor", type: "text" },
      { key: "author_role", label: "Cargo/Ubicación", type: "text" },
      { key: "author_image", label: "Foto del Autor", type: "image" },
    ],
  },
  pricing: {
    title: "Precios",
    description: "Planes y precios del servicio",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: Precios" },
      { key: "title", label: "Título de la Sección", type: "text" },
      {
        key: "plans",
        label: "Planes",
        type: "array",
        fields: [
          { key: "name", label: "Nombre del Plan", type: "text" },
          { key: "price", label: "Precio", type: "text", placeholder: "ej: 19€" },
          { key: "period", label: "Período", type: "text", placeholder: "ej: /mes (vacío si es pago único)" },
          { key: "description", label: "Descripción", type: "text" },
          { key: "features", label: "Características (separadas por comas)", type: "textarea" },
          { key: "cta", label: "Texto del Botón", type: "text" },
          { key: "highlighted", label: "¿Destacado? (true/false)", type: "text" },
          { key: "badge", label: "Badge (ej: Popular)", type: "text" },
        ],
      },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes",
    description: "FAQ de la landing page",
    fields: [
      { key: "label", label: "Etiqueta", type: "text", placeholder: "ej: FAQ" },
      { key: "title", label: "Título de la Sección", type: "text" },
      {
        key: "items",
        label: "Preguntas",
        type: "array",
        fields: [
          { key: "question", label: "Pregunta", type: "text" },
          { key: "answer", label: "Respuesta", type: "textarea" },
        ],
      },
    ],
  },
  cta: {
    title: "Call to Action",
    description: "Llamada a la acción final",
    fields: [
      { key: "title_line1", label: "Título Línea 1", type: "text" },
      { key: "title_line2", label: "Título Línea 2", type: "text" },
      { key: "description", label: "Descripción", type: "text" },
      { key: "cta", label: "Texto del Botón", type: "text" },
    ],
  },
  footer: {
    title: "Footer",
    description: "Pie de página y enlaces",
    fields: [
      { key: "brand_description", label: "Descripción de la Marca", type: "textarea" },
      { key: "copyright", label: "Texto de Copyright", type: "text" },
      {
        key: "columns",
        label: "Columnas de Enlaces",
        type: "array",
        fields: [
          { key: "title", label: "Título de la Columna", type: "text" },
          { key: "links", label: "Enlaces (formato JSON)", type: "textarea" },
        ],
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function LandingSectionPage({ params }: PageProps) {
  const { section } = await params;

  const config = sectionConfigs[section];

  if (!config) {
    notFound();
  }

  const content = await getSectionContent("landing", section);

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/admin/landing"
        className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Landing Page
      </Link>

      <ContentEditor
        page="landing"
        section={section}
        initialContent={content || {}}
        fields={config.fields}
        title={config.title}
        description={config.description}
      />
    </div>
  );
}
