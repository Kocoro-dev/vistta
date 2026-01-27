/**
 * LemonSqueezy Integration
 *
 * Environment variables required:
 * - LEMONSQUEEZY_API_KEY: API key from LemonSqueezy dashboard
 * - LEMONSQUEEZY_STORE_ID: Your store ID
 * - LEMONSQUEEZY_WEBHOOK_SECRET: Webhook signing secret
 *
 * Product Variant IDs (configure after creating products):
 * - LEMONSQUEEZY_OCASIONAL_VARIANT_ID: Pack Ocasional variant ID
 * - LEMONSQUEEZY_AGENCIA_VARIANT_ID: Plan Agencia variant ID
 */

const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";

interface CreateCheckoutOptions {
  variantId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  customData?: Record<string, string>;
  redirectUrl?: string;
}

interface CheckoutResponse {
  data: {
    id: string;
    type: "checkouts";
    attributes: {
      url: string;
    };
  };
}

/**
 * Creates a LemonSqueezy checkout URL
 */
export async function createCheckout(
  options: CreateCheckoutOptions
): Promise<{ checkoutUrl: string } | { error: string }> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    console.error("Missing LemonSqueezy configuration");
    return { error: "Configuración de pagos no disponible" };
  }

  try {
    const redirectUrl = options.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`;

    const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: options.userEmail,
              name: options.userName || undefined,
              custom: {
                user_id: options.userId,
                ...options.customData,
              },
            },
            product_options: {
              redirect_url: redirectUrl,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: options.variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LemonSqueezy checkout error:", errorData);
      return { error: "Error al crear el checkout" };
    }

    const data: CheckoutResponse = await response.json();
    return { checkoutUrl: data.data.attributes.url };
  } catch (error) {
    console.error("LemonSqueezy API error:", error);
    return { error: "Error de conexión con el servicio de pagos" };
  }
}

/**
 * Get variant IDs from environment
 */
export function getVariantId(planType: "ocasional" | "agencia"): string | null {
  if (planType === "ocasional") {
    return process.env.LEMONSQUEEZY_OCASIONAL_VARIANT_ID || null;
  }
  if (planType === "agencia") {
    return process.env.LEMONSQUEEZY_AGENCIA_VARIANT_ID || null;
  }
  return null;
}

/**
 * Plan configuration
 */
export const PLAN_CONFIG = {
  ocasional: {
    name: "Pack Ocasional",
    price: 1900, // cents
    priceFormatted: "19€",
    credits: 10,
    description: "10 créditos sin caducidad",
  },
  agencia: {
    name: "Plan Agencia",
    price: 5900, // cents
    priceFormatted: "59€/mes",
    credits: null, // unlimited
    description: "Imágenes ilimitadas cada mes",
  },
} as const;

/**
 * Format amount from cents to EUR string
 */
export function formatAmount(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")}€`;
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(planType: "ocasional" | "agencia"): string {
  return PLAN_CONFIG[planType]?.name || planType;
}

/**
 * Get plan config
 */
export function getPlanConfig(planType: "ocasional" | "agencia") {
  return PLAN_CONFIG[planType];
}
