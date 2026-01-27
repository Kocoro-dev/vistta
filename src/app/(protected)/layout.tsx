import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OnboardingWrapper } from "@/components/onboarding-wrapper";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as unknown as Profile | null;
  const showOnboarding = profile ? !profile.onboarding_completed : false;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header profile={profile} />
      <OnboardingWrapper showOnboarding={showOnboarding}>
        <main className="flex-1">{children}</main>
      </OnboardingWrapper>
      <Footer />
    </div>
  );
}
