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
    const isRegistered = searchParams.get("registered") === "true";

    if (!isRegistered || hasTracked.current) return;
    hasTracked.current = true;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push sign_up event for GTM (GA4 + Facebook)
    window.dataLayer.push({
      event: "sign_up",
      method: "email", // or could detect google vs magic link
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

    console.log("Registration tracked:", { email: userEmail });

    // Clean up URL (remove ?registered=true)
    const newUrl = window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, attribution, userEmail, router]);

  return null;
}
