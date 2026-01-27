"use client";

import { useEffect, useState, useCallback } from "react";
import type { Attribution } from "@/types/attribution";
import {
  initAttribution,
  getAttribution,
  enrichAttributionWithGeo,
} from "@/lib/attribution";

interface UseAttributionOptions {
  /** Fetch geo info on mount (default: true for first session) */
  fetchGeo?: boolean;
}

interface UseAttributionReturn {
  attribution: Attribution | null;
  isLoading: boolean;
  isFirstSession: boolean;
  refresh: () => void;
}

/**
 * Hook to access and manage attribution data.
 *
 * Usage:
 * ```tsx
 * const { attribution, isFirstSession } = useAttribution();
 *
 * if (attribution) {
 *   console.log(attribution.utm_source);
 *   console.log(attribution.country);
 * }
 * ```
 */
export function useAttribution(
  options: UseAttributionOptions = {}
): UseAttributionReturn {
  const { fetchGeo = true } = options;

  const [attribution, setAttribution] = useState<Attribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstSession, setIsFirstSession] = useState(false);

  const initialize = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if this is a new visitor (no existing cookie)
      const existing = getAttribution();
      const isNew = !existing;

      // Initialize or update attribution
      const attr = initAttribution();
      setIsFirstSession(isNew);

      // Fetch geo info for first session or if not populated
      if (fetchGeo && (!attr.country || isNew)) {
        const enriched = await enrichAttributionWithGeo(attr);
        setAttribution(enriched);
      } else {
        setAttribution(attr);
      }
    } catch (error) {
      console.error("Error initializing attribution:", error);
      // Return whatever we have
      setAttribution(getAttribution());
    } finally {
      setIsLoading(false);
    }
  }, [fetchGeo]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const refresh = useCallback(() => {
    initialize();
  }, [initialize]);

  return {
    attribution,
    isLoading,
    isFirstSession,
    refresh,
  };
}

/**
 * Get attribution data synchronously (may return null if not yet initialized).
 * Prefer using the hook when possible.
 */
export function getAttributionSync(): Attribution | null {
  return getAttribution();
}
