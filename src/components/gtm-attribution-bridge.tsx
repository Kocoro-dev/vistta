"use client";

import { useEffect, useRef } from "react";
import { useAttribution } from "@/hooks/use-attribution";

/**
 * GTM Attribution Bridge
 *
 * Pushes attribution data to the dataLayer for Google Tag Manager.
 * This allows GTM to access UTM parameters, visitor info, and device data.
 *
 * Events pushed to dataLayer:
 * - `attribution_ready`: When attribution data is first available
 * - `attribution_updated`: On subsequent page loads with existing attribution
 *
 * Usage in GTM:
 * 1. Create a Trigger for Custom Event "attribution_ready"
 * 2. Create Data Layer Variables:
 *    - attribution.visitor_id
 *    - attribution.utm_source
 *    - attribution.utm_medium
 *    - attribution.utm_campaign
 *    - attribution.country
 *    - attribution.device_type
 *    - etc.
 * 3. Use these variables in your GA4, Meta Pixel, or other tags
 */
export function GTMAttributionBridge() {
  const { attribution, isFirstSession, isLoading } = useAttribution();
  const hasPushed = useRef(false);

  useEffect(() => {
    // Only push once per page load, and only after attribution is loaded
    if (isLoading || hasPushed.current || !attribution) return;

    hasPushed.current = true;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push attribution data to dataLayer
    window.dataLayer.push({
      event: isFirstSession ? "attribution_ready" : "attribution_updated",
      attribution: {
        // Visitor identification
        visitor_id: attribution.visitor_id,
        session_number: attribution.session_number,
        is_first_session: isFirstSession,
        first_visit: attribution.first_visit,
        last_visit: attribution.last_visit,

        // UTM Parameters
        utm_source: attribution.utm_source || "direct",
        utm_medium: attribution.utm_medium || "(none)",
        utm_campaign: attribution.utm_campaign || "(none)",
        utm_term: attribution.utm_term || "(none)",
        utm_content: attribution.utm_content || "(none)",

        // Traffic source
        referrer: attribution.referrer || "(direct)",
        landing_page: attribution.landing_page || "/",

        // Geolocation
        country: attribution.country || "(not set)",
        country_code: attribution.country_code || "(not set)",
        region: attribution.region || "(not set)",
        city: attribution.city || "(not set)",
        timezone: attribution.timezone || "(not set)",

        // Device info
        device_type: attribution.device_type || "unknown",
        browser: attribution.browser || "unknown",
        browser_version: attribution.browser_version || "unknown",
        os: attribution.os || "unknown",
        os_version: attribution.os_version || "unknown",
        screen_resolution: attribution.screen_resolution || "unknown",

        // Language
        language: attribution.language || "es-ES",
      },
    });

    // Also push individual variables for easier access in GTM
    window.dataLayer.push({
      visitor_id: attribution.visitor_id,
      session_number: attribution.session_number,
      utm_source: attribution.utm_source || "direct",
      utm_medium: attribution.utm_medium || "(none)",
      utm_campaign: attribution.utm_campaign || "(none)",
      user_country: attribution.country || "(not set)",
      user_city: attribution.city || "(not set)",
      user_device: attribution.device_type || "unknown",
      user_browser: attribution.browser || "unknown",
      user_os: attribution.os || "unknown",
      user_language: attribution.language || "es-ES",
    });
  }, [attribution, isFirstSession, isLoading]);

  // This component renders nothing
  return null;
}

// Type declaration for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
