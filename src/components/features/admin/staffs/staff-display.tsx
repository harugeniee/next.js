"use client";

import { User } from "lucide-react";
import Image from "next/image";

import type { Staff } from "@/lib/interface/staff.interface";
import { cn } from "@/lib/utils";

interface StaffDisplayProps {
  readonly staff: Staff;
  readonly size?: "sm" | "md" | "lg";
  readonly showName?: boolean;
  readonly className?: string;
}

/**
 * Staff Display Component
 * Reusable component to display a staff member with image and name
 */
export function StaffDisplay({
  staff,
  size = "md",
  showName = true,
  className,
}: StaffDisplayProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Get staff display name
  const displayName =
    staff.name?.full ||
    staff.name?.userPreferred ||
    `${staff.name?.first || ""} ${staff.name?.last || ""}`.trim() ||
    staff.name?.native ||
    "Unknown Staff";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center overflow-hidden bg-muted",
          sizeClasses[size],
        )}
      >
        {staff.image?.url ? (
          <Image
            src={staff.image.url}
            alt={displayName}
            width={size === "sm" ? 24 : size === "md" ? 32 : 48}
            height={size === "sm" ? 24 : size === "md" ? 32 : 48}
            className="rounded-full object-cover"
          />
        ) : (
          <User
            className={cn(
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6",
              "text-muted-foreground",
            )}
          />
        )}
      </div>
      {showName && (
        <span className={cn("font-medium truncate", textSizeClasses[size])}>
          {displayName}
        </span>
      )}
    </div>
  );
}
