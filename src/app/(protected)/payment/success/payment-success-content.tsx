"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAttribution } from "@/hooks/use-attribution";
import { PLAN_CONFIG } from "@/lib/lemonsqueezy";

interface PaymentSuccessContentProps {
  payment: {
    id: string;
    amount: number;
    plan_type: string;
    stripe_session_id: string;
    created_at: string;
  } | null;
  userEmail: string;
}

export function PaymentSuccessContent({
  payment,
  userEmail,
}: PaymentSuccessContentProps) {
  const { attribution } = useAttribution({ fetchGeo: false });
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once
    if (hasTracked.current || !payment) return;
    hasTracked.current = true;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    const planType = payment.plan_type as keyof typeof PLAN_CONFIG;
    const planConfig = PLAN_CONFIG[planType];

    // Push purchase event to dataLayer (GA4 Ecommerce)
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: payment.stripe_session_id,
        value: payment.amount / 100, // Convert cents to euros
        currency: "EUR",
        items: [
          {
            item_id: payment.plan_type,
            item_name: planConfig?.name || payment.plan_type,
            price: payment.amount / 100,
            quantity: 1,
            item_category: payment.plan_type === "agencia" ? "subscription" : "one_time",
          },
        ],
      },
      // Attribution data for cross-referencing
      attribution: {
        visitor_id: attribution?.visitor_id || "(not set)",
        session_number: attribution?.session_number || 1,
        utm_source: attribution?.utm_source || "direct",
        utm_medium: attribution?.utm_medium || "(none)",
        utm_campaign: attribution?.utm_campaign || "(none)",
      },
      user_data: {
        email: userEmail,
      },
    });

    // Also push a custom event for GTM flexibility
    window.dataLayer.push({
      event: "vistta_purchase",
      plan_type: payment.plan_type,
      plan_name: planConfig?.name || payment.plan_type,
      purchase_value: payment.amount / 100,
      purchase_currency: "EUR",
      visitor_id: attribution?.visitor_id || "(not set)",
      utm_source: attribution?.utm_source || "direct",
    });

    console.log("Purchase tracked:", {
      transaction_id: payment.stripe_session_id,
      value: payment.amount / 100,
      plan: payment.plan_type,
    });
  }, [payment, attribution, userEmail]);

  if (!payment) {
    return (
      <div className="max-w-md mx-auto text-center px-6">
        <div className="h-16 w-16 border border-amber-200 bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-[24px] font-medium text-neutral-900 mb-3">
          Procesando tu pago
        </h1>
        <p className="text-[15px] text-neutral-500 mb-8">
          Tu pago está siendo procesado. Serás redirigido automáticamente en unos segundos.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Ir al dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const planType = payment.plan_type as keyof typeof PLAN_CONFIG;
  const planConfig = PLAN_CONFIG[planType];

  return (
    <div className="max-w-md mx-auto text-center px-6">
      <div className="h-16 w-16 border border-green-200 bg-green-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>

      <h1 className="text-[28px] font-medium text-neutral-900 mb-3">
        Pago completado
      </h1>

      <p className="text-[15px] text-neutral-500 mb-8">
        Gracias por tu compra. Tu {planConfig?.name || "plan"} ya está activo.
      </p>

      <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] text-neutral-500">Plan</span>
          <span className="text-[14px] font-medium text-neutral-900">
            {planConfig?.name || payment.plan_type}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] text-neutral-500">Importe</span>
          <span className="text-[14px] font-medium text-neutral-900">
            {(payment.amount / 100).toFixed(2).replace(".", ",")}€
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-neutral-500">ID de transacción</span>
          <span className="text-[12px] font-mono text-neutral-500">
            {payment.stripe_session_id.slice(0, 12)}...
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/editor"
          className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 text-[14px] font-medium transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Crear diseño
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 px-6 py-3 text-[14px] font-medium transition-all"
        >
          Ver galería
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
