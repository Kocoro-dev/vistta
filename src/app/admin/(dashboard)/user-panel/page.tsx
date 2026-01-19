import Link from "next/link";
import { getSectionContent } from "@/actions/admin";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const sections = [
  { id: "dashboard", page: "dashboard", name: "Dashboard", description: "Galería de generaciones del usuario" },
  { id: "editor", page: "editor", name: "Editor", description: "Interfaz de edición y generación" },
  { id: "login", page: "login", name: "Login", description: "Página de inicio de sesión" },
];

export default async function AdminUserPanelPage() {
  // Check which sections have content
  const sectionStatus = await Promise.all(
    sections.map(async (section) => {
      const content = await getSectionContent(section.page, section.id);
      return { ...section, hasContent: !!content };
    })
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[28px] font-medium text-white mb-2">
          Panel de Usuario
        </h1>
        <p className="text-[15px] text-neutral-500">
          Edita el contenido del panel de usuario
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionStatus.map((section) => (
          <Link
            key={section.id}
            href={`/admin/user-panel/${section.id}`}
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

      {/* Info */}
      <div className="mt-10 p-6 bg-neutral-900 border border-neutral-800">
        <h3 className="text-[15px] font-medium text-white mb-2">
          Nota
        </h3>
        <p className="text-[13px] text-neutral-500">
          El panel de usuario incluye las páginas protegidas que ven los usuarios después de iniciar sesión.
          Puedes personalizar textos, etiquetas y mensajes de cada sección.
        </p>
      </div>
    </div>
  );
}
