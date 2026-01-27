import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PaymentHistory } from "@/components/payment-history";
import { Crown, Zap, ArrowRight } from "lucide-react";
import type { Profile, Payment } from "@/types/database";
import { UNLIMITED_USERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PagosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isUnlimited = Boolean(user.email && UNLIMITED_USERS.includes(user.email));

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as unknown as Profile | null;

  if (!profile) {
    redirect("/login");
  }

  const { data: paymentsData } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const payments = (paymentsData || []) as unknown as Payment[];

  const hasPurchased = profile.has_purchased || isUnlimited;
  const subscriptionPlan = profile.subscription_plan;
  const subscriptionStatus = profile.subscription_status || "free";

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <div className="mb-12">
        <span className="text-label text-neutral-400 mb-4 block">Cuenta</span>
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
          Pagos y Suscripción
        </h1>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Subscription Status Banner */}
        <section
          className={`border p-6 ${
            hasPurchased
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`h-12 w-12 flex items-center justify-center ${
                  hasPurchased ? "bg-green-100" : "bg-amber-100"
                }`}
              >
                {hasPurchased ? (
                  <Crown className="h-6 w-6 text-green-600" />
                ) : (
                  <Zap className="h-6 w-6 text-amber-600" />
                )}
              </div>
              <div>
                <h2
                  className={`text-[16px] font-medium ${
                    hasPurchased ? "text-green-900" : "text-amber-900"
                  }`}
                >
                  {hasPurchased
                    ? subscriptionPlan === "agencia"
                      ? "Plan Agencia"
                      : isUnlimited
                      ? "Acceso Ilimitado"
                      : "Pack Ocasional"
                    : "Plan Gratuito"}
                </h2>
                <p
                  className={`text-[14px] mt-1 ${
                    hasPurchased ? "text-green-700" : "text-amber-700"
                  }`}
                >
                  {hasPurchased ? (
                    <>
                      Acceso completo a todas las funciones sin marca de agua.
                      {subscriptionPlan === "agencia" && profile.subscription_expires_at && (
                        <span className="block mt-1 text-[13px]">
                          Renovación: {new Date(profile.subscription_expires_at).toLocaleDateString("es-ES")}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Tienes <span className="font-medium">{profile.credits} créditos</span> disponibles.
                      Las imágenes incluyen marca de agua.
                    </>
                  )}
                </p>
              </div>
            </div>

            {!hasPurchased && (
              <Link
                href="/planes"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 text-[14px] font-medium transition-all whitespace-nowrap"
              >
                Ver planes
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>

        {/* Plan Details */}
        {hasPurchased && (
          <section className="border border-neutral-200 bg-white p-6">
            <h2 className="text-[16px] font-medium text-neutral-900 mb-4">
              Detalles del plan
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[13px] text-neutral-500 mb-1">Plan actual</p>
                <p className="text-[15px] font-medium text-neutral-900">
                  {subscriptionPlan === "agencia"
                    ? "Plan Agencia (59€/mes)"
                    : isUnlimited
                    ? "Acceso Ilimitado"
                    : "Pack Ocasional (19€)"}
                </p>
              </div>
              <div>
                <p className="text-[13px] text-neutral-500 mb-1">Estado</p>
                <p className="text-[15px] font-medium text-green-600">
                  Activo
                </p>
              </div>
              {subscriptionPlan === "agencia" && profile.subscription_expires_at && (
                <>
                  <div>
                    <p className="text-[13px] text-neutral-500 mb-1">Próxima facturación</p>
                    <p className="text-[15px] font-medium text-neutral-900">
                      {new Date(profile.subscription_expires_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-neutral-500 mb-1">Imágenes este mes</p>
                    <p className="text-[15px] font-medium text-neutral-900">
                      Ilimitadas
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Payment History */}
        <section>
          <h2 className="text-[16px] font-medium text-neutral-900 mb-4">
            Historial de pagos
          </h2>
          <PaymentHistory payments={payments} />
        </section>

        {/* Help section */}
        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-[16px] font-medium text-neutral-900 mb-2">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-[14px] text-neutral-600 mb-4">
            Si tienes alguna pregunta sobre tu suscripción o pagos, no dudes en contactarnos.
          </p>
          <a
            href="mailto:legal@visttahome.com"
            className="text-[14px] font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            legal@visttahome.com
          </a>
        </section>
      </div>
    </div>
  );
}
