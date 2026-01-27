"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard } from "lucide-react";

const navItems = [
  {
    label: "Perfil",
    href: "/cuenta/perfil",
    icon: User,
  },
  {
    label: "Pagos",
    href: "/cuenta/pagos",
    icon: CreditCard,
  },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-8 -mb-px">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  inline-flex items-center gap-2 py-4 border-b-2 text-[14px] font-medium transition-colors
                  ${
                    isActive
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
