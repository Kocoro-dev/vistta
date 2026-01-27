"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/payments";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import type { PlanType } from "@/types/database";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

interface PricingCardCheckoutProps {
  plan: Plan;
  disabled?: boolean;
  disabledText?: string;
}

export function PricingCardCheckout({
  plan,
  disabled = false,
  disabledText = "Plan activo",
}: PricingCardCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled) return;

    setIsLoading(true);

    try {
      const result = await createCheckoutSession(plan.id as PlanType);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.checkoutUrl) {
        // Redirect to LemonSqueezy checkout
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`border p-6 ${
        plan.highlighted
          ? "border-neutral-900 bg-white"
          : "border-neutral-200 bg-white"
      }`}
    >
      {plan.highlighted && (
        <span className="inline-block text-label text-orange-600 mb-4">
          Más popular
        </span>
      )}

      <h2 className="text-[20px] font-medium text-neutral-900 mb-2">
        {plan.name}
      </h2>
      <p className="text-[14px] text-neutral-500 mb-4">{plan.description}</p>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-[32px] font-medium text-neutral-900 text-display">
          {plan.price}
        </span>
        <span className="text-[14px] text-neutral-500">{plan.period}</span>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-[14px] text-neutral-600"
          >
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={disabled || isLoading}
        className={`w-full h-12 text-[14px] font-medium transition-all inline-flex items-center justify-center gap-2 ${
          plan.highlighted
            ? "bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            : "border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : disabled ? (
          disabledText
        ) : (
          "Comprar ahora"
        )}
      </button>
    </div>
  );
}
