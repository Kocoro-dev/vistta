import { notFound } from "next/navigation";
import Link from "next/link";
import { getSectionContent } from "@/actions/admin";
import { ContentEditor } from "@/components/admin/content-editor";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

// Define field configurations for each user panel section
const sectionConfigs: Record<string, {
  page: string;
  title: string;
  description: string;
  fields: any[];
}> = {
  dashboard: {
    page: "dashboard",
    title: "Dashboard del Usuario",
    description: "Galería de generaciones y panel principal",
    fields: [
      { key: "title", label: "Título de la Página", type: "text", placeholder: "ej: Mis Proyectos" },
      { key: "subtitle", label: "Subtítulo", type: "text", placeholder: "ej: Gestiona tus staging virtuales" },
      { key: "emptyStateTitle", label: "Título Estado Vacío", type: "text", placeholder: "ej: No tienes proyectos" },
      { key: "emptyStateText", label: "Texto Estado Vacío", type: "textarea" },
      { key: "emptyStateButtonText", label: "Texto Botón Estado Vacío", type: "text" },
      { key: "newProjectText", label: "Texto Nuevo Proyecto", type: "text" },
      { key: "filterAllText", label: "Texto Filtro Todos", type: "text" },
      { key: "filterCompletedText", label: "Texto Filtro Completados", type: "text" },
      { key: "filterPendingText", label: "Texto Filtro Pendientes", type: "text" },
      { key: "deleteConfirmTitle", label: "Título Confirmar Eliminación", type: "text" },
      { key: "deleteConfirmText", label: "Texto Confirmar Eliminación", type: "textarea" },
    ],
  },
  editor: {
    page: "editor",
    title: "Editor de Staging",
    description: "Interfaz de edición y generación de imágenes",
    fields: [
      { key: "title", label: "Título de la Página", type: "text", placeholder: "ej: Nuevo Staging Virtual" },
      { key: "uploadTitle", label: "Título Zona de Upload", type: "text" },
      { key: "uploadSubtitle", label: "Subtítulo Zona de Upload", type: "text" },
      { key: "uploadDragText", label: "Texto Arrastrar Archivo", type: "text" },
      { key: "uploadButtonText", label: "Texto Botón Upload", type: "text" },
      { key: "uploadFormats", label: "Texto Formatos Permitidos", type: "text" },
      { key: "styleSelectTitle", label: "Título Selección Estilo", type: "text" },
      { key: "styleSelectSubtitle", label: "Subtítulo Selección Estilo", type: "text" },
      { key: "generateButtonText", label: "Texto Botón Generar", type: "text" },
      { key: "generatingText", label: "Texto Generando", type: "text" },
      { key: "resultTitle", label: "Título Resultado", type: "text" },
      { key: "downloadButtonText", label: "Texto Botón Descargar", type: "text" },
      { key: "newGenerationText", label: "Texto Nueva Generación", type: "text" },
      { key: "errorTitle", label: "Título de Error", type: "text" },
      { key: "errorRetryText", label: "Texto Reintentar", type: "text" },
    ],
  },
  login: {
    page: "login",
    title: "Página de Login",
    description: "Página de inicio de sesión con OAuth",
    fields: [
      { key: "title", label: "Título", type: "text", placeholder: "ej: Iniciar Sesión" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "googleButtonText", label: "Texto Botón Google", type: "text" },
      { key: "termsText", label: "Texto de Términos", type: "textarea" },
      { key: "termsLinkText", label: "Texto Enlace Términos", type: "text" },
      { key: "privacyLinkText", label: "Texto Enlace Privacidad", type: "text" },
      { key: "redirectingText", label: "Texto Redirigiendo", type: "text" },
      { key: "errorText", label: "Texto de Error", type: "text" },
    ],
  },
};

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function UserPanelSectionPage({ params }: PageProps) {
  const { section } = await params;

  const config = sectionConfigs[section];

  if (!config) {
    notFound();
  }

  const content = await getSectionContent(config.page, section);

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/admin/user-panel"
        className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Panel Usuario
      </Link>

      <ContentEditor
        page={config.page}
        section={section}
        initialContent={content || {}}
        fields={config.fields}
        title={config.title}
        description={config.description}
      />
    </div>
  );
}
