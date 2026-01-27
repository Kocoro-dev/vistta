"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelcomeModal } from "@/components/welcome-modal";
import { completeOnboarding } from "@/actions/generate-image";

interface OnboardingWrapperProps {
  children: React.ReactNode;
  showOnboarding: boolean;
}

export function OnboardingWrapper({ children, showOnboarding }: OnboardingWrapperProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(showOnboarding);

  const handleComplete = async (option: "free" | "plans") => {
    // Mark onboarding as completed
    await completeOnboarding();

    setShowModal(false);

    if (option === "plans") {
      router.push("/planes");
    } else {
      router.refresh();
    }
  };

  return (
    <>
      {children}
      <WelcomeModal open={showModal} onComplete={handleComplete} />
    </>
  );
}
