/**
 * Attribution & Session Tracking Types
 */

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

export interface DeviceInfo {
  device_type: "desktop" | "tablet" | "mobile" | "unknown";
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  screen_resolution: string;
}

export interface GeoInfo {
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  isp: string | null;
}

export interface Attribution {
  // UTM parameters
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;

  // Session info
  visitor_id: string;
  session_number: number;
  first_visit: string; // ISO date
  last_visit: string; // ISO date

  // Referrer & landing
  referrer: string | null;
  landing_page: string | null;

  // Device info
  device_type: DeviceInfo["device_type"];
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  screen_resolution: string;

  // Geo info (populated server-side)
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string;

  // Language
  language: string;
}

export interface SessionRecord {
  id?: string;
  user_id: string | null;
  visitor_id: string;
  session_number: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_page: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  language: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  screen_resolution: string | null;
  created_at?: string;
}

export type NotifyEventType =
  | "new_visit"
  | "new_registration"
  | "new_lead"
  | "new_sale"
  | "generation_created";

export interface NotifyPayload {
  event_type: NotifyEventType;
  user_email?: string;
  user_id?: string;
  attribution: Partial<Attribution>;
  metadata?: Record<string, unknown>;
}
