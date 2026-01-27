"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-16 w-16 text-[18px]",
  xl: "h-24 w-24 text-[24px]",
};

export function UserAvatar({ src, name, email, size = "sm", className }: UserAvatarProps) {
  const initials = getInitials(name, email);

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Usuario"}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-neutral-900 flex items-center justify-center font-semibold text-orange-500",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.substring(0, 2).toUpperCase() || "U";
  }

  if (email) {
    return email.substring(0, 2).toUpperCase();
  }

  return "U";
}
