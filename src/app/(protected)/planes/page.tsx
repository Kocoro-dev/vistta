import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PricingCardCheckout } from "@/components/pricing-card-checkout";
import { ArrowLeft, Zap, Crown } from "lucide-react";
import type { Profile } from "@/types/database";
import { UNLIMITED_USERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const plans = [
  {
    id: "ocasional",
    name: "Pack Ocasional",
    price: "19€",
    period: "pago único",
    description: "Perfecto para proyectos puntuales",
    features: [
      "10 créditos (sin caducidad)",
      "Vistta Enhance + Vision",
      "Todos los estilos de diseño",
      "Resolución HD",
      "Sin marca de agua",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    id: "agencia",
    name: "Plan Agencia",
    price: "59€",
    period: "/mes",
    description: "Para profesionales y agencias",
    features: [
      "Imágenes ilimitadas",
      "Vistta Enhance + Vision",
      "Todos los estilos de diseño",
      "Resolución HD",
      "Sin marca de agua",
      "Soporte prioritario",
      "Gestión de múltiples proyectos",
    ],
    highlighted: true,
  },
];

export default async function PlanesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const isUnlimited = Boolean(user?.email && UNLIMITED_USERS.includes(user.email));

  const { data: profileData } = user?.id
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    : { data: null };

  const profile = profileData as unknown as Profile | null;
  const hasPurchased = profile?.has_purchased ?? false;
  const credits = profile?.credits ?? 0;
  const subscriptionPlan = profile?.subscription_plan;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="text-center">
            <span className="text-label text-neutral-400 mb-4 block">Planes</span>
            <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1] mb-4">
              Elige tu plan
            </h1>
            <p className="text-[15px] text-neutral-500 max-w-lg mx-auto">
              Desbloquea todo el potencial de Vistta sin marca de agua y con acceso ilimitado a todas las funciones.
            </p>
          </div>
        </div>

        {/* Current status */}
        {!hasPurchased && !isUnlimited && (
          <div className="border border-amber-200 bg-amber-50 p-4 mb-8 flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-[14px] text-neutral-700">
              Tienes <span className="font-medium">{credits} {credits === 1 ? "crédito" : "créditos"}</span> gratuitos restantes.
              Las imágenes generadas con créditos gratuitos incluyen marca de agua.
            </p>
          </div>
        )}

        {(hasPurchased || isUnlimited) && (
          <div className="border border-green-200 bg-green-50 p-4 mb-8 flex items-center gap-3">
            <Crown className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-[14px] text-neutral-700">
              {subscriptionPlan === "agencia"
                ? "Tienes el Plan Agencia activo con imágenes ilimitadas."
                : isUnlimited
                ? "Tienes acceso ilimitado a todas las funciones."
                : "Ya tienes créditos comprados. Puedes generar imágenes sin marca de agua."
              }
            </p>
          </div>
        )}

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            // Determine if this plan should be disabled
            const isPlanActive =
              (plan.id === "agencia" && subscriptionPlan === "agencia") ||
              isUnlimited;

            // For ocasional, allow buying more credits even if already purchased
            const isDisabled =
              plan.id === "agencia"
                ? isPlanActive
                : false;

            const disabledText =
              plan.id === "agencia" && subscriptionPlan === "agencia"
                ? "Plan activo"
                : isUnlimited
                ? "Acceso ilimitado"
                : "Plan activo";

            return (
              <PricingCardCheckout
                key={plan.id}
                plan={plan}
                disabled={isDisabled}
                disabledText={disabledText}
              />
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-12 text-center text-[13px] text-neutral-500 space-y-2">
          <p>
            Todos los pagos son procesados de forma segura por{" "}
            <span className="text-neutral-700">LemonSqueezy</span>.
          </p>
          <p>
            ¿Tienes preguntas? Escríbenos a{" "}
            <a href="mailto:info@visttahome.com" className="text-neutral-900 hover:underline">
              info@visttahome.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
