"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { CreditsIndicator } from "@/components/credits-indicator";
import { LogOut, User, Plus, CreditCard } from "lucide-react";
import type { Profile } from "@/types/database";
import { UNLIMITED_USERS } from "@/lib/constants";

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo-negro-Vistta.svg" alt="Vistta" className="h-6" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
            >
              Mis Diseños
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <CreditsIndicator
              credits={profile.credits}
              hasPurchased={profile.has_purchased || (profile.email ? UNLIMITED_USERS.includes(profile.email) : false)}
            />
          )}

          <Link
            href="/editor"
            className="hidden sm:inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-[13px] font-medium transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
                <UserAvatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  email={profile?.email}
                  size="sm"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-3 py-3 border-b border-neutral-100">
                {profile?.full_name && (
                  <p className="font-medium text-[14px] text-neutral-900">{profile.full_name}</p>
                )}
                {profile?.email && (
                  <p className="text-[13px] text-neutral-500 mt-0.5">
                    {profile.email}
                  </p>
                )}
              </div>
              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link href="/cuenta/perfil" className="cursor-pointer flex items-center gap-2 px-3 py-2">
                    <User className="h-4 w-4 text-neutral-400" />
                    <span className="text-[14px]">Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cuenta/pagos" className="cursor-pointer flex items-center gap-2 px-3 py-2">
                    <CreditCard className="h-4 w-4 text-neutral-400" />
                    <span className="text-[14px]">Pagos</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="py-1">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-[14px]">Cerrar Sesión</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
