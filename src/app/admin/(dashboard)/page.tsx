import Link from "next/link";
import { getAllContent } from "@/actions/admin";
import { Globe, Users, FileText, ArrowRight, Clock, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const content = await getAllContent();

  // Group content by page
  const contentByPage = content.reduce((acc, item) => {
    if (!acc[item.page]) {
      acc[item.page] = [];
    }
    acc[item.page].push(item);
    return acc;
  }, {} as Record<string, typeof content>);

  const stats = [
    {
      name: "Landing Page",
      icon: Globe,
      sections: contentByPage["landing"]?.length || 0,
      href: "/admin/landing",
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      name: "Panel Usuario",
      icon: Users,
      sections: (contentByPage["dashboard"]?.length || 0) +
                (contentByPage["editor"]?.length || 0) +
                (contentByPage["login"]?.length || 0),
      href: "/admin/user-panel",
      color: "bg-green-500/10 text-green-400",
    },
    {
      name: "Componentes",
      icon: FileText,
      sections: contentByPage["components"]?.length || 0,
      href: "/admin/components",
      color: "bg-purple-500/10 text-purple-400",
    },
  ];

  // Get recent updates
  const recentUpdates = content
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[28px] font-medium text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-[15px] text-neutral-500">
          Gestiona el contenido de tu sitio web
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group bg-neutral-900 border border-neutral-800 p-6 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-10 w-10 ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-[16px] font-medium text-white mb-1">
                {stat.name}
              </h3>
              <p className="text-[13px] text-neutral-500">
                {stat.sections} secciones editables
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <div className="bg-neutral-900 border border-neutral-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-neutral-500" />
            <h2 className="text-[15px] font-medium text-white">
              Actualizaciones Recientes
            </h2>
          </div>

          {recentUpdates.length > 0 ? (
            <ul className="space-y-3">
              {recentUpdates.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0"
                >
                  <div>
                    <p className="text-[13px] text-white">
                      {item.page} / {item.section}
                    </p>
                    <p className="text-[12px] text-neutral-500">
                      {new Date(item.updated_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-600 bg-neutral-800 px-2 py-1">
                    {item.page}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-neutral-500">
              No hay contenido guardado. Ejecuta el script SQL para inicializar.
            </p>
          )}
        </div>

        {/* Quick Edit */}
        <div className="bg-neutral-900 border border-neutral-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Edit className="h-4 w-4 text-neutral-500" />
            <h2 className="text-[15px] font-medium text-white">
              Edición Rápida
            </h2>
          </div>

          <div className="space-y-2">
            <Link
              href="/admin/landing/hero"
              className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            >
              <span className="text-[13px] text-neutral-300">Hero de la Landing</span>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
            </Link>
            <Link
              href="/admin/landing/pricing"
              className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            >
              <span className="text-[13px] text-neutral-300">Precios</span>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
            </Link>
            <Link
              href="/admin/landing/testimonial"
              className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            >
              <span className="text-[13px] text-neutral-300">Testimonios</span>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
            </Link>
            <Link
              href="/admin/user-panel/dashboard"
              className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            >
              <span className="text-[13px] text-neutral-300">Dashboard Usuario</span>
              <ArrowRight className="h-4 w-4 text-neutral-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-10 bg-orange-500/10 border border-orange-500/20 p-6">
        <h3 className="text-[14px] font-medium text-orange-400 mb-2">
          Configuración Inicial
        </h3>
        <p className="text-[13px] text-orange-300/70 mb-4">
          Para inicializar el contenido editable, ejecuta el script SQL en Supabase:
        </p>
        <code className="block bg-neutral-900 p-4 text-[12px] text-neutral-300 overflow-x-auto">
          supabase/admin-schema.sql
        </code>
      </div>
    </div>
  );
}
