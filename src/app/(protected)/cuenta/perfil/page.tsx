import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as unknown as Profile | null;

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <div className="mb-12">
        <span className="text-label text-neutral-400 mb-4 block">Cuenta</span>
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
          Mi Perfil
        </h1>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
