import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { GenerationCard } from "@/components/generation-card";
import { Plus, ImageIcon, Sparkles, AlertCircle, Infinity } from "lucide-react";
import type { Generation } from "@/types/database";
import { ALPHA_LIMIT, UNLIMITED_USERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alpha Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">
                  Versión Alpha
                </h3>
                <p className="text-[14px] text-gray-600 mt-0.5">
                  Estás probando VISTTA en acceso anticipado. Limitado a{" "}
                  <span className="font-semibold">{ALPHA_LIMIT} imágenes</span> gratuitas.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl px-4 py-2 border border-amber-200/50">
                <div className="text-[13px] text-gray-500">
                  {isUnlimited ? "Imágenes generadas" : "Imágenes restantes"}
                </div>
                <div className="text-[20px] font-semibold text-gray-900">
                  {isUnlimited ? (
                    <>{generationCount} <Infinity className="inline h-5 w-5 text-gray-400" /></>
                  ) : (
                    <>{remaining} <span className="text-[14px] text-gray-400 font-normal">/ {ALPHA_LIMIT}</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">
              Mis Diseños
            </h1>
            <p className="text-[15px] text-gray-500 mt-1">
              Tus transformaciones de espacios con IA
            </p>
          </div>
          {!limitReached ? (
            <Link href="/editor">
              <Button className="bg-gray-900 hover:bg-gray-800 rounded-xl h-11 px-5">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Diseño
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <span className="text-[14px] font-medium">Límite alcanzado</span>
            </div>
          )}
        </div>

        {generations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
        <ImageIcon className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-[20px] font-semibold text-gray-900 mb-2">
        No hay diseños todavía
      </h2>
      <p className="text-[15px] text-gray-500 mb-6 max-w-sm">
        Sube una foto de una habitación y transforma su estilo con inteligencia
        artificial.
      </p>
      <Link href="/editor">
        <Button size="lg" className="bg-gray-900 hover:bg-gray-800 rounded-xl h-12 px-6">
          <Plus className="h-4 w-4 mr-2" />
          Crear primer diseño
        </Button>
      </Link>
    </div>
  );
}
