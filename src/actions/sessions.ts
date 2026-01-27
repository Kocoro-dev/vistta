"use server";

import { createClient } from "@/lib/supabase/server";
import { sendDiscordNotification } from "@/lib/discord";
import type { SessionRecord, Attribution, NotifyPayload } from "@/types/attribution";

/**
 * Save a session record to the database.
 * Call this when you want to persist attribution data.
 */
export async function saveSession(
  attribution: Partial<Attribution>,
  userId?: string
): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  try {
    const supabase = await createClient();

    // If no userId provided, try to get from auth
    let effectiveUserId: string | null = userId ?? null;
    if (!effectiveUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      effectiveUserId = user?.id ?? null;
    }

    const sessionData: SessionRecord = {
      user_id: effectiveUserId || null,
      visitor_id: attribution.visitor_id || "unknown",
      session_number: attribution.session_number || 1,
      utm_source: attribution.utm_source || null,
      utm_medium: attribution.utm_medium || null,
      utm_campaign: attribution.utm_campaign || null,
      utm_term: attribution.utm_term || null,
      utm_content: attribution.utm_content || null,
      referrer: attribution.referrer || null,
      landing_page: attribution.landing_page || null,
      country: attribution.country || null,
      country_code: attribution.country_code || null,
      region: attribution.region || null,
      city: attribution.city || null,
      timezone: attribution.timezone || null,
      language: attribution.language || null,
      device_type: attribution.device_type || null,
      browser: attribution.browser || null,
      os: attribution.os || null,
      screen_resolution: attribution.screen_resolution || null,
    };

    const { data, error } = await supabase
      .from("sessions")
      .insert(sessionData as never)
      .select("id")
      .single();

    if (error) {
      console.error("Error saving session:", error);
      return { success: false, error: error.message };
    }

    const result = data as { id: string } | null;
    return { success: true, sessionId: result?.id };
  } catch (error) {
    console.error("Session save error:", error);
    return { success: false, error: "Failed to save session" };
  }
}

/**
 * Link a visitor to a user after registration/login.
 * Updates all sessions with this visitor_id to include the user_id.
 */
export async function linkVisitorToUser(
  visitorId: string,
  userId: string
): Promise<{ success: boolean; error?: string; updated?: number }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sessions")
      .update({ user_id: userId } as never)
      .eq("visitor_id", visitorId)
      .is("user_id", null)
      .select("id");

    if (error) {
      console.error("Error linking visitor to user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, updated: data?.length || 0 };
  } catch (error) {
    console.error("Link visitor error:", error);
    return { success: false, error: "Failed to link visitor" };
  }
}

/**
 * Get session history for a user or visitor.
 */
export async function getSessionHistory(
  identifier: { userId?: string; visitorId?: string },
  limit: number = 50
): Promise<{ sessions: SessionRecord[]; error?: string }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (identifier.userId) {
      query = query.eq("user_id", identifier.userId);
    } else if (identifier.visitorId) {
      query = query.eq("visitor_id", identifier.visitorId);
    } else {
      return { sessions: [], error: "No identifier provided" };
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching sessions:", error);
      return { sessions: [], error: error.message };
    }

    return { sessions: (data || []) as SessionRecord[] };
  } catch (error) {
    console.error("Get sessions error:", error);
    return { sessions: [], error: "Failed to fetch sessions" };
  }
}

/**
 * Send a notification to Discord.
 * Calls Discord webhook directly from server action.
 */
export async function sendNotification(
  payload: NotifyPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    return await sendDiscordNotification(payload);
  } catch (error) {
    console.error("Send notification error:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

/**
 * Record a new registration event.
 * Saves session, links visitor, and sends Discord notification.
 */
export async function recordRegistration(
  attribution: Partial<Attribution>,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Save session with user ID
    await saveSession(attribution, userId);

    // Link any previous anonymous sessions
    if (attribution.visitor_id) {
      await linkVisitorToUser(attribution.visitor_id, userId);
    }

    // Send Discord notification
    await sendNotification({
      event_type: "new_registration",
      user_email: userEmail,
      user_id: userId,
      attribution,
    });

    return { success: true };
  } catch (error) {
    console.error("Record registration error:", error);
    return { success: false, error: "Failed to record registration" };
  }
}

/**
 * Record a generation created event.
 */
export async function recordGeneration(
  attribution: Partial<Attribution>,
  userId: string,
  userEmail: string,
  generationType: "enhance" | "vision",
  style?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendNotification({
      event_type: "generation_created",
      user_email: userEmail,
      user_id: userId,
      attribution,
      metadata: {
        tipo: generationType,
        ...(style && { estilo: style }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Record generation error:", error);
    return { success: false, error: "Failed to record generation" };
  }
}

/**
 * Record a sale event.
 */
export async function recordSale(
  attribution: Partial<Attribution>,
  userId: string,
  userEmail: string,
  planType: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendNotification({
      event_type: "new_sale",
      user_email: userEmail,
      user_id: userId,
      attribution,
      metadata: {
        plan: planType,
        importe: `${(amount / 100).toFixed(2)}€`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Record sale error:", error);
    return { success: false, error: "Failed to record sale" };
  }
}
