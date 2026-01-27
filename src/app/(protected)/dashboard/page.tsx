import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard-content";
import { RegistrationTracker } from "@/components/registration-tracker";
import { Zap, Crown } from "lucide-react";
import type { Generation, Profile, Project } from "@/types/database";
import { UNLIMITED_USERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const isUnlimited = Boolean(user?.email && UNLIMITED_USERS.includes(user.email));

  // Get profile with credits
  const { data: profileData } = user?.id
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    : { data: null };

  const profile = profileData as unknown as Profile | null;
  const credits = profile?.credits ?? 0;
  const hasPurchased = profile?.has_purchased ?? false;

  // Get generations with pagination (first page)
  const PAGE_SIZE = 12;

  const { count: totalGenerations } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true });

  const { data: generationsData } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const generations = (generationsData || []) as unknown as Generation[];
  const generationCount = totalGenerations ?? generations.length;
  const hasMore = generations.length < (totalGenerations ?? 0);
  const canCreate = isUnlimited || hasPurchased || credits > 0;

  // Get projects
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = (projectsData || []) as unknown as Project[];

  return (
    <div className="min-h-screen">
      {/* Track new registrations */}
      <Suspense fallback={null}>
        <RegistrationTracker userEmail={user?.email} />
      </Suspense>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Credits Banner */}
        <div className={`border p-6 mb-12 ${hasPurchased || isUnlimited ? "border-green-200 bg-green-50" : credits <= 1 ? "border-amber-200 bg-amber-50" : "border-neutral-200 bg-white"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {hasPurchased || isUnlimited ? (
                  <>
                    <Crown className="h-4 w-4 text-green-600" />
                    <span className="text-label text-green-600">Plan Activo</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span className="text-label text-amber-600">Plan Gratuito</span>
                  </>
                )}
              </div>
              <p className="text-[14px] text-neutral-600">
                {hasPurchased || isUnlimited ? (
                  "Acceso ilimitado a todas las funciones sin marca de agua."
                ) : credits > 0 ? (
                  <>Tienes <span className="font-medium text-neutral-900">{credits} {credits === 1 ? "crédito" : "créditos"}</span> disponibles. Las imágenes incluyen marca de agua.</>
                ) : (
                  "Has agotado tus créditos gratuitos. Adquiere un plan para continuar."
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!(hasPurchased || isUnlimited) && (
                <Link
                  href="/planes"
                  className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 text-[13px] font-medium transition-all"
                >
                  Ver planes
                </Link>
              )}
              <div className="text-right">
                <div className="text-[13px] text-neutral-500">
                  {hasPurchased || isUnlimited ? "Total generadas" : "Créditos"}
                </div>
                <div className="text-[24px] font-medium text-neutral-900 text-display">
                  {hasPurchased || isUnlimited ? (
                    <>{generationCount}<span className="text-[14px] text-neutral-400 font-normal ml-1">imágenes</span></>
                  ) : (
                    <>{credits}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content with Project Filtering */}
        <DashboardContent
          initialGenerations={generations}
          initialProjects={projects}
          initialHasMore={hasMore}
          initialTotalCount={generationCount}
          canCreate={canCreate}
        />
      </div>
    </div>
  );
}
