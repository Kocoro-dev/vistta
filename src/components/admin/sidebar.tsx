"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/admin";
import {
  LayoutDashboard,
  Globe,
  Users,
  LogOut,
  Settings,
  FileText,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Landing Page",
    href: "/admin/landing",
    icon: Globe,
    children: [
      { name: "Hero", href: "/admin/landing/hero" },
      { name: "Problema", href: "/admin/landing/problem" },
      { name: "Pasos", href: "/admin/landing/steps" },
      { name: "Estilos", href: "/admin/landing/styles" },
      { name: "Testimonios", href: "/admin/landing/testimonial" },
      { name: "Precios", href: "/admin/landing/pricing" },
      { name: "FAQ", href: "/admin/landing/faq" },
      { name: "CTA", href: "/admin/landing/cta" },
      { name: "Footer", href: "/admin/landing/footer" },
    ],
  },
  {
    name: "Panel Usuario",
    href: "/admin/user-panel",
    icon: Users,
    children: [
      { name: "Dashboard", href: "/admin/user-panel/dashboard" },
      { name: "Editor", href: "/admin/user-panel/editor" },
      { name: "Login", href: "/admin/user-panel/login" },
    ],
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: Image,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white flex items-center justify-center">
            <span className="text-[11px] font-bold text-neutral-900">V</span>
          </div>
          <div>
            <span className="text-[14px] font-medium text-white">VISTTA</span>
            <span className="text-[11px] text-neutral-500 block -mt-0.5">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded transition-colors",
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>

                {/* Submenu */}
                {item.children && isActive && (
                  <ul className="mt-1 ml-7 space-y-1 border-l border-neutral-800 pl-3">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-3 py-1.5 text-[12px] rounded transition-colors",
                              isChildActive
                                ? "text-white bg-neutral-800"
                                : "text-neutral-500 hover:text-white"
                            )}
                          >
                            {child.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-800">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
