import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GenerationCard } from "@/components/generation-card";
import { Plus, ImageIcon } from "lucide-react";
import type { Generation } from "@/types/database";
import { ALPHA_LIMIT, UNLIMITED_USERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const isUnlimited = user?.email && UNLIMITED_USERS.includes(user.email);

  const { data } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false });

  const generations = (data || []) as unknown as Generation[];
  const generationCount = generations.length;
  const remaining = isUnlimited ? Infinity : Math.max(0, ALPHA_LIMIT - generationCount);
  const limitReached = !isUnlimited && remaining === 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Alpha Banner */}
        <div className="border border-neutral-200 bg-white p-6 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-label text-orange-600">Alpha</span>
              </div>
              <p className="text-[14px] text-neutral-600">
                Versión de acceso anticipado. Limitado a{" "}
                <span className="font-medium text-neutral-900">{ALPHA_LIMIT} imágenes</span> gratuitas.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[13px] text-neutral-500">
                  {isUnlimited ? "Generadas" : "Restantes"}
                </div>
                <div className="text-[24px] font-medium text-neutral-900 text-display">
                  {isUnlimited ? (
                    <>{generationCount}<span className="text-[14px] text-neutral-400 font-normal ml-1">∞</span></>
                  ) : (
                    <>{remaining}<span className="text-[14px] text-neutral-400 font-normal ml-1">/ {ALPHA_LIMIT}</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-label text-neutral-400 mb-4 block">Galería</span>
            <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
              Mis Diseños
            </h1>
          </div>
          {!limitReached && (
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-3 text-[14px] font-medium transition-all"
            >
              <Plus className="h-4 w-4" />
              Nuevo Diseño
            </Link>
          )}
        </div>

        {generations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {generations.map((generation) => (
              <GenerationCard key={generation.id} generation={generation} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="h-16 w-16 border border-neutral-200 flex items-center justify-center mb-8">
        <ImageIcon className="h-6 w-6 text-neutral-400" />
      </div>
      <h2 className="text-[20px] font-medium text-neutral-900 mb-3">
        Sin diseños todavía
      </h2>
      <p className="text-[15px] text-neutral-500 mb-8 max-w-sm">
        Sube una foto de una habitación y transforma su estilo con inteligencia artificial.
      </p>
      <Link
        href="/editor"
        className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 text-[14px] font-medium transition-all"
      >
        <Plus className="h-4 w-4" />
        Crear primer diseño
      </Link>
    </div>
  );
}
