"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastMessage {
  id: number;
  name: string;
  location: string;
  action: string;
  timeAgo: string;
  isLeaving: boolean;
}

interface ActivityResponse {
  name: string;
  location: string;
  action: string;
  emoji: string;
  timeAgo: string;
}

function getRandomInterval(min: number = 15000, max: number = 45000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveActivityToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  const fetchActivity = useCallback(async (): Promise<ActivityResponse | null> => {
    try {
      const response = await fetch("/api/activity");
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error fetching activity:", error);
      return null;
    }
  }, []);

  const showToast = useCallback(async () => {
    if (!isEnabled) return;

    const message = await fetchActivity();
    if (!message) return;

    const newToast: ToastMessage = {
      id: Date.now(),
      name: message.name,
      location: message.location,
      action: message.action,
      timeAgo: message.timeAgo,
      isLeaving: false,
    };

    setToast(newToast);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      setToast((current) => {
        if (current?.id === newToast.id) {
          return { ...current, isLeaving: true };
        }
        return current;
      });

      // Remove after animation
      setTimeout(() => {
        setToast((current) => {
          if (current?.id === newToast.id) {
            return null;
          }
          return current;
        });
      }, 300);
    }, 8000);
  }, [isEnabled, fetchActivity]);

  const dismissToast = useCallback(() => {
    setToast((current) => {
      if (current) {
        return { ...current, isLeaving: true };
      }
      return current;
    });

    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []);

  useEffect(() => {
    // Initial delay before first toast
    const initialDelay = setTimeout(() => {
      showToast();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, [showToast]);

  useEffect(() => {
    if (!toast && isEnabled) {
      const interval = getRandomInterval(15000, 45000);
      const timer = setTimeout(showToast, interval);
      return () => clearTimeout(timer);
    }
  }, [toast, isEnabled, showToast]);

  if (!toast) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-sm",
        toast.isLeaving ? "animate-toast-out" : "animate-toast-in"
      )}
    >
      <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-xl">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-200 overflow-hidden">
          <div
            className="h-full bg-orange-500 animate-toast-progress"
            style={{ animationDuration: "8s" }}
          />
        </div>

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0 h-10 w-10 bg-neutral-900 rounded-full flex items-center justify-center">
            <span className="text-[12px] font-medium text-white">
              {toast.name.split(" ")[0].charAt(0)}
              {toast.name.split(" ")[1]?.charAt(0) || ""}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-neutral-900">
              <span className="font-medium">{toast.name}</span>{" "}
              <span className="text-neutral-600">{toast.action}</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3 text-neutral-400" />
              <span className="text-[12px] text-neutral-500">
                {toast.location}
              </span>
              <span className="text-[12px] text-neutral-400">
                · {toast.timeAgo}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissToast}
            className="flex-shrink-0 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
