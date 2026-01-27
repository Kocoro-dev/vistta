"use client";

import { useEffect, useRef } from "react";
import { useAttribution } from "@/hooks/use-attribution";
import { saveSession } from "@/actions/sessions";

interface AttributionTrackerProps {
  /** Whether to save session to database on first visit */
  trackSessions?: boolean;
}

/**
 * Attribution Tracker Component
 *
 * Add this to your layout to automatically:
 * - Capture UTM parameters from URL
 * - Store attribution data in cookies
 * - Fetch geolocation info
 * - Optionally save sessions to database
 *
 * Usage:
 * ```tsx
 * // In layout.tsx
 * <AttributionTracker trackSessions />
 * ```
 */
export function AttributionTracker({
  trackSessions = false,
}: AttributionTrackerProps) {
  const { attribution, isFirstSession, isLoading } = useAttribution();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load, and only after attribution is loaded
    if (isLoading || hasTracked.current || !attribution) return;

    // Save session to database if enabled and this is a new session
    if (trackSessions && isFirstSession) {
      hasTracked.current = true;
      saveSession(attribution).catch((err) => {
        console.warn("Failed to save session:", err);
      });
    }
  }, [attribution, isFirstSession, isLoading, trackSessions]);

  // This component renders nothing
  return null;
}
