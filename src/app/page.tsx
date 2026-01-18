import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Upload, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">VISTTA</span>
          <Link href="/login">
            <Button>Comenzar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Transforma espacios
            <span className="block text-primary">con IA</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sube una foto de cualquier habitación y visualiza cómo quedaría con
            diferentes estilos de diseño interior. Moderno, minimalista,
            industrial y más.
          </p>
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 text-lg">
              Empezar gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="Sube tu imagen"
            description="Arrastra y suelta cualquier foto de una habitación. Soportamos JPG, PNG y WebP."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Elige un estilo"
            description="Selecciona entre estilos como moderno, minimalista, industrial o escandinavo."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Genera en segundos"
            description="Nuestra IA transforma la habitación manteniendo la estructura original."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-32">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VISTTA. Transformación visual con IA.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-card">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
