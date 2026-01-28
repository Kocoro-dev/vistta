"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAttribution } from "@/hooks/use-attribution";

interface RegistrationTrackerProps {
  userEmail?: string;
}

export function RegistrationTracker({ userEmail }: RegistrationTrackerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { attribution } = useAttribution({ fetchGeo: false });
  const hasTracked = useRef(false);

  useEffect(() => {
    // Check both URL param (from callback) and localStorage flag (from registration page)
    const isRegisteredFromUrl = searchParams.get("registered") === "true";
    const isRegisteredFromStorage = localStorage.getItem("vistta_pending_registration") === "true";
    const isRegistered = isRegisteredFromUrl || isRegisteredFromStorage;

    if (!isRegistered || hasTracked.current) return;
    hasTracked.current = true;

    // Clear the localStorage flag
    localStorage.removeItem("vistta_pending_registration");

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push sign_up event for GTM (GA4 + Facebook)
    window.dataLayer.push({
      event: "sign_up",
      method: isRegisteredFromStorage ? "registration_flow" : "email",
      user_data: {
        email: userEmail || "",
      },
      attribution: {
        visitor_id: attribution?.visitor_id || "(not set)",
        utm_source: attribution?.utm_source || "direct",
        utm_medium: attribution?.utm_medium || "(none)",
        utm_campaign: attribution?.utm_campaign || "(none)",
      },
    });

    console.log("Registration tracked:", { email: userEmail, source: isRegisteredFromStorage ? "localStorage" : "url" });

    // Clean up URL if it has the registered param
    if (isRegisteredFromUrl) {
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, attribution, userEmail, router]);

  return null;
}
