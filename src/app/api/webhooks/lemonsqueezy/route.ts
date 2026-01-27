import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendDiscordNotification } from "@/lib/discord";
import { PLAN_CONFIG } from "@/lib/lemonsqueezy";

// LemonSqueezy webhook event types we handle
type WebhookEventName =
  | "order_created"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_payment_success"
  | "subscription_payment_failed";

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: WebhookEventName;
    custom_data?: {
      user_id?: string;
      plan_type?: string;
      credits?: string;
      visitor_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      // Order attributes
      identifier?: string;
      order_number?: number;
      user_name?: string;
      user_email?: string;
      status?: string;
      total?: number;
      total_formatted?: string;
      currency?: string;
      first_order_item?: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
      };
      urls?: {
        receipt?: string;
      };
      // Subscription attributes
      product_id?: number;
      variant_id?: number;
      product_name?: string;
      variant_name?: string;
      ends_at?: string | null;
      renews_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    console.warn("Missing signature or secret, skipping verification in development");
    return process.env.NODE_ENV === "development";
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const payload = await request.text();
    const signature = request.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, secret)) {
      console.error("Invalid LemonSqueezy webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: LemonSqueezyWebhookPayload = JSON.parse(payload);
    const eventName = data.meta.event_name;
    const customData = data.meta.custom_data;

    console.log(`LemonSqueezy webhook received: ${eventName}`);
    console.log("Custom data:", customData);

    // Get user_id from custom data
    const userId = customData?.user_id;
    if (!userId) {
      console.error("No user_id in webhook custom_data");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    switch (eventName) {
      case "order_created": {
        // One-time purchase (Pack Ocasional)
        await handleOrderCreated(supabase, data, userId);
        break;
      }

      case "subscription_created": {
        // New subscription (Plan Agencia)
        await handleSubscriptionCreated(supabase, data, userId);
        break;
      }

      case "subscription_updated": {
        // Subscription updated (renewal, plan change)
        await handleSubscriptionUpdated(supabase, data, userId);
        break;
      }

      case "subscription_cancelled": {
        // Subscription cancelled
        await handleSubscriptionCancelled(supabase, data, userId);
        break;
      }

      case "subscription_payment_success": {
        // Recurring payment successful
        await handleSubscriptionPaymentSuccess(supabase, data, userId);
        break;
      }

      case "subscription_payment_failed": {
        // Payment failed
        await handleSubscriptionPaymentFailed(supabase, data, userId);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LemonSqueezy webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  const attributes = data.data.attributes;
  const customData = data.meta.custom_data;
  const orderId = data.data.id;
  const credits = parseInt(customData?.credits || "10", 10);
  const amount = attributes.total || 1900; // cents
  const invoiceUrl = attributes.urls?.receipt || null;
  const visitorId = customData?.visitor_id;
  const planType = (customData?.plan_type || "ocasional") as keyof typeof PLAN_CONFIG;
  const userEmail = attributes.user_email || "";

  console.log(`Processing order ${orderId} for user ${userId}, adding ${credits} credits`);

  // Create payment record
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: userId,
    amount: amount,
    plan_type: "ocasional",
    status: "completed",
    stripe_session_id: orderId, // Using this field for LemonSqueezy order ID
    invoice_url: invoiceUrl,
    completed_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error("Error creating payment record:", paymentError);
    throw paymentError;
  }

  // Update user profile: add credits and mark as purchased
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  const currentCredits = profile?.credits || 0;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      credits: currentCredits + credits,
      has_purchased: true,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  // Fetch attribution data from sessions table using visitor_id
  let attribution: Record<string, unknown> = { utm_source: "direct" };
  if (visitorId) {
    const { data: sessionData } = await supabase
      .from("sessions")
      .select("*")
      .eq("visitor_id", visitorId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sessionData) {
      attribution = {
        visitor_id: visitorId,
        session_number: sessionData.session_number,
        utm_source: sessionData.utm_source || "direct",
        utm_medium: sessionData.utm_medium,
        utm_campaign: sessionData.utm_campaign,
        country: sessionData.country,
        city: sessionData.city,
        device_type: sessionData.device_type,
        browser: sessionData.browser,
      };
    }
  }

  // Send Discord notification
  await sendDiscordNotification({
    event_type: "new_sale",
    user_email: userEmail,
    user_id: userId,
    attribution,
    metadata: {
      plan: PLAN_CONFIG[planType]?.name || planType,
      importe: `${(amount / 100).toFixed(2)}€`,
      creditos: credits.toString(),
      order_id: orderId,
    },
  });

  console.log(`Order ${orderId} processed: +${credits} credits for user ${userId}`);
}

async function handleSubscriptionCreated(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  const attributes = data.data.attributes;
  const customData = data.meta.custom_data;
  const subscriptionId = data.data.id;
  const renewsAt = attributes.renews_at;
  const visitorId = customData?.visitor_id;
  const userEmail = attributes.user_email || "";
  const amount = 5900; // 59€ in cents

  console.log(`Processing subscription ${subscriptionId} for user ${userId}`);

  // Create payment record
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: userId,
    amount: amount,
    plan_type: "agencia",
    status: "completed",
    stripe_session_id: subscriptionId,
    completed_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error("Error creating payment record:", paymentError);
    throw paymentError;
  }

  // Update user profile with subscription info
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      has_purchased: true,
      subscription_status: "active",
      subscription_plan: "agencia",
      subscription_expires_at: renewsAt,
      stripe_customer_id: subscriptionId, // Using for LemonSqueezy subscription ID
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  // Fetch attribution data from sessions table using visitor_id
  let attribution: Record<string, unknown> = { utm_source: "direct" };
  if (visitorId) {
    const { data: sessionData } = await supabase
      .from("sessions")
      .select("*")
      .eq("visitor_id", visitorId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sessionData) {
      attribution = {
        visitor_id: visitorId,
        session_number: sessionData.session_number,
        utm_source: sessionData.utm_source || "direct",
        utm_medium: sessionData.utm_medium,
        utm_campaign: sessionData.utm_campaign,
        country: sessionData.country,
        city: sessionData.city,
        device_type: sessionData.device_type,
        browser: sessionData.browser,
      };
    }
  }

  // Send Discord notification
  await sendDiscordNotification({
    event_type: "new_sale",
    user_email: userEmail,
    user_id: userId,
    attribution,
    metadata: {
      plan: PLAN_CONFIG.agencia.name,
      importe: `${(amount / 100).toFixed(2)}€/mes`,
      tipo: "Suscripción",
      subscription_id: subscriptionId,
    },
  });

  console.log(`Subscription ${subscriptionId} created for user ${userId}`);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  const attributes = data.data.attributes;
  const status = attributes.status;
  const renewsAt = attributes.renews_at;
  const endsAt = attributes.ends_at;

  console.log(`Updating subscription for user ${userId}, status: ${status}`);

  // Map LemonSqueezy status to our status
  let subscriptionStatus: string;
  if (status === "active") {
    subscriptionStatus = "active";
  } else if (status === "cancelled" || status === "expired") {
    subscriptionStatus = "cancelled";
  } else if (status === "past_due") {
    subscriptionStatus = "past_due";
  } else {
    subscriptionStatus = "active";
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      subscription_status: subscriptionStatus,
      subscription_expires_at: endsAt || renewsAt,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  console.log(`Subscription updated for user ${userId}`);
}

async function handleSubscriptionCancelled(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  const attributes = data.data.attributes;
  const endsAt = attributes.ends_at;

  console.log(`Cancelling subscription for user ${userId}`);

  // User keeps access until ends_at
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      subscription_status: "cancelled",
      subscription_expires_at: endsAt,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  console.log(`Subscription cancelled for user ${userId}, access until ${endsAt}`);
}

async function handleSubscriptionPaymentSuccess(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  const attributes = data.data.attributes;
  const renewsAt = attributes.renews_at;

  console.log(`Subscription payment success for user ${userId}`);

  // Create payment record for the renewal
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: userId,
    amount: 5900,
    plan_type: "agencia",
    status: "completed",
    stripe_session_id: `renewal_${Date.now()}`,
    completed_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error("Error creating payment record:", paymentError);
  }

  // Update subscription expiry
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      subscription_status: "active",
      subscription_expires_at: renewsAt,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  console.log(`Subscription renewed for user ${userId}`);
}

async function handleSubscriptionPaymentFailed(
  supabase: ReturnType<typeof getSupabaseClient>,
  data: LemonSqueezyWebhookPayload,
  userId: string
) {
  console.log(`Subscription payment failed for user ${userId}`);

  // Mark subscription as past_due
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      subscription_status: "past_due",
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  // Create failed payment record
  await supabase.from("payments").insert({
    user_id: userId,
    amount: 5900,
    plan_type: "agencia",
    status: "failed",
    stripe_session_id: `failed_${Date.now()}`,
  });

  console.log(`Payment marked as failed for user ${userId}`);
}

// LemonSqueezy may send GET to verify endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "lemonsqueezy" });
}
