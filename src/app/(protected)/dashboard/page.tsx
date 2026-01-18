import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { GenerationCard } from "@/components/generation-card";
import { Plus, ImageIcon } from "lucide-react";
import type { Generation } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false });

  const generations = (data || []) as unknown as Generation[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Diseños</h1>
          <p className="text-muted-foreground mt-1">
            Tus transformaciones de espacios con IA
          </p>
        </div>
        <Link href="/editor">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Diseño
          </Button>
        </Link>
      </div>

      {generations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generations.map((generation) => (
            <GenerationCard key={generation.id} generation={generation} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No hay diseños todavía</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Sube una foto de una habitación y transforma su estilo con inteligencia
        artificial.
      </p>
      <Link href="/editor">
        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Crear primer diseño
        </Button>
      </Link>
    </div>
  );
}
