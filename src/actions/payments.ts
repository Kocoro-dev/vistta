"use server";

import { createClient } from "@/lib/supabase/server";
import { createCheckout, getVariantId, PLAN_CONFIG } from "@/lib/lemonsqueezy";
import type { Payment, Profile, PlanType } from "@/types/database";

export async function getPaymentHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Payment history error:", error);
    return { error: "Error al obtener el historial de pagos" };
  }

  return { payments: (data || []) as unknown as Payment[] };
}

export async function getSubscriptionStatus() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_plan, subscription_expires_at, has_purchased, credits")
    .eq("id", user.id)
    .single();

  if (error || !profileData) {
    console.error("Subscription status error:", error);
    return { error: "Error al obtener el estado de la suscripción" };
  }

  const profile = profileData as unknown as Pick<Profile, "subscription_status" | "subscription_plan" | "subscription_expires_at" | "has_purchased" | "credits">;

  return {
    status: profile.subscription_status || "free",
    plan: profile.subscription_plan,
    expiresAt: profile.subscription_expires_at,
    hasPurchased: profile.has_purchased,
    credits: profile.credits,
  };
}

/**
 * Creates a LemonSqueezy checkout session and returns the checkout URL
 */
export async function createCheckoutSession(planType: PlanType) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Get user profile for email and name
  const { data: profileData } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  const profile = profileData as { email: string | null; full_name: string | null } | null;

  // Get variant ID for the plan
  const variantId = getVariantId(planType);
  if (!variantId) {
    console.error(`No variant ID configured for plan: ${planType}`);
    return { error: "Plan no disponible en este momento" };
  }

  // Get plan config
  const planConfig = PLAN_CONFIG[planType];

  // Create LemonSqueezy checkout
  const result = await createCheckout({
    variantId,
    userId: user.id,
    userEmail: profile?.email || user.email || "",
    userName: profile?.full_name || undefined,
    customData: {
      plan_type: planType,
      credits: planConfig.credits?.toString() || "unlimited",
    },
  });

  if ("error" in result) {
    return { error: result.error };
  }

  return {
    success: true,
    checkoutUrl: result.checkoutUrl,
  };
}

