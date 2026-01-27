/**
 * Attribution & UTM Tracking Utilities
 *
 * Handles UTM parameter capture, cookie persistence, and device/geo detection.
 */

import type { Attribution, DeviceInfo, UTMParams } from "@/types/attribution";

const COOKIE_NAME = "app_attribution";
const COOKIE_DAYS = 30;

// ============================================
// Cookie Management
// ============================================

export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

// ============================================
// UTM Parameter Extraction
// ============================================

export function extractUTMParams(url?: string): UTMParams {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(url || window.location.search)
      : new URLSearchParams(url || "");

  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  };
}

export function hasUTMParams(params: UTMParams): boolean {
  return !!(params.utm_source || params.utm_medium || params.utm_campaign);
}

// ============================================
// Device Detection
// ============================================

export function detectDevice(): DeviceInfo {
  if (typeof navigator === "undefined") {
    return {
      device_type: "unknown",
      browser: "unknown",
      browser_version: "unknown",
      os: "unknown",
      os_version: "unknown",
      screen_resolution: "unknown",
    };
  }

  const ua = navigator.userAgent;

  // Device type
  let device_type: DeviceInfo["device_type"] = "desktop";
  if (/Mobi|Android/i.test(ua)) {
    device_type = /Tablet|iPad/i.test(ua) ? "tablet" : "mobile";
  }

  // Browser detection
  let browser = "unknown";
  let browser_version = "unknown";

  if (ua.includes("Firefox/")) {
    browser = "Firefox";
    browser_version = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || "unknown";
  } else if (ua.includes("Edg/")) {
    browser = "Edge";
    browser_version = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || "unknown";
  } else if (ua.includes("Chrome/")) {
    browser = "Chrome";
    browser_version = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || "unknown";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    browser = "Safari";
    browser_version = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || "unknown";
  } else if (ua.includes("Opera") || ua.includes("OPR/")) {
    browser = "Opera";
    browser_version = ua.match(/(?:Opera|OPR)\/(\d+(\.\d+)?)/)?.[1] || "unknown";
  }

  // OS detection
  let os = "unknown";
  let os_version = "unknown";

  if (ua.includes("Windows")) {
    os = "Windows";
    if (ua.includes("Windows NT 10.0")) os_version = "10/11";
    else if (ua.includes("Windows NT 6.3")) os_version = "8.1";
    else if (ua.includes("Windows NT 6.2")) os_version = "8";
    else if (ua.includes("Windows NT 6.1")) os_version = "7";
  } else if (ua.includes("Mac OS X")) {
    os = "macOS";
    os_version =
      ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace("_", ".") || "unknown";
  } else if (ua.includes("Android")) {
    os = "Android";
    os_version = ua.match(/Android (\d+(\.\d+)?)/)?.[1] || "unknown";
  } else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS";
    os_version =
      ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace("_", ".") || "unknown";
  } else if (ua.includes("Linux")) {
    os = "Linux";
  }

  // Screen resolution
  const screen_resolution =
    typeof screen !== "undefined"
      ? `${screen.width}x${screen.height}`
      : "unknown";

  return {
    device_type,
    browser,
    browser_version,
    os,
    os_version,
    screen_resolution,
  };
}

// ============================================
// Visitor ID Generation
// ============================================

function generateVisitorId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `v_${timestamp}_${randomPart}`;
}

// ============================================
// Attribution Management
// ============================================

export function getAttribution(): Attribution | null {
  const cookieValue = getCookie(COOKIE_NAME);
  if (!cookieValue) return null;

  try {
    return JSON.parse(cookieValue) as Attribution;
  } catch {
    return null;
  }
}

export function saveAttribution(attribution: Attribution): void {
  setCookie(COOKIE_NAME, JSON.stringify(attribution), COOKIE_DAYS);
}

export function initAttribution(): Attribution {
  const existingAttribution = getAttribution();
  const utmParams = extractUTMParams();
  const hasNewUTMs = hasUTMParams(utmParams);
  const device = detectDevice();
  const now = new Date().toISOString();

  // Get referrer and landing page
  const referrer =
    typeof document !== "undefined" && document.referrer
      ? document.referrer
      : null;
  const landing_page =
    typeof window !== "undefined" ? window.location.pathname : null;

  // Get language and timezone
  const language =
    typeof navigator !== "undefined" ? navigator.language : "es-ES";
  const timezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "Europe/Madrid";

  if (existingAttribution) {
    // Update existing attribution
    const updated: Attribution = {
      ...existingAttribution,
      // Update UTMs only if new ones are present
      ...(hasNewUTMs && {
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        referrer,
        landing_page,
      }),
      // Always update session info
      session_number: existingAttribution.session_number + 1,
      last_visit: now,
      // Update device info (might have changed)
      ...device,
      language,
      timezone,
    };

    saveAttribution(updated);
    return updated;
  }

  // Create new attribution
  const newAttribution: Attribution = {
    // UTMs or direct
    utm_source: utmParams.utm_source || "direct",
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    utm_term: utmParams.utm_term,
    utm_content: utmParams.utm_content,

    // Session
    visitor_id: generateVisitorId(),
    session_number: 1,
    first_visit: now,
    last_visit: now,

    // Referrer & landing
    referrer,
    landing_page,

    // Device
    ...device,

    // Geo (will be populated by server)
    country: null,
    country_code: null,
    region: null,
    city: null,
    timezone,

    // Language
    language,
  };

  saveAttribution(newAttribution);
  return newAttribution;
}

// ============================================
// Geo Info Fetching (via server-side API)
// ============================================

export async function fetchGeoInfo(): Promise<{
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  isp: string | null;
}> {
  try {
    // Use our server-side API to avoid Mixed Content issues
    const response = await fetch("/api/geo");

    if (!response.ok) {
      throw new Error("Geo API request failed");
    }

    return await response.json();
  } catch (error) {
    console.warn("Failed to fetch geo info:", error);
    return {
      country: null,
      country_code: null,
      region: null,
      city: null,
      timezone: null,
      isp: null,
    };
  }
}

export async function enrichAttributionWithGeo(
  attribution: Attribution
): Promise<Attribution> {
  // Only fetch geo if not already populated
  if (attribution.country) {
    return attribution;
  }

  const geoInfo = await fetchGeoInfo();

  const enriched: Attribution = {
    ...attribution,
    country: geoInfo.country,
    country_code: geoInfo.country_code,
    region: geoInfo.region,
    city: geoInfo.city,
    timezone: geoInfo.timezone || attribution.timezone,
  };

  saveAttribution(enriched);
  return enriched;
}
