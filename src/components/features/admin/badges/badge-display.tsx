"use client";

import { Award } from "lucide-react";
import Image from "next/image";

import type {
  Badge,
  BadgeRarity,
} from "@/lib/types/badges";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  readonly badge: Badge;
  readonly size?: "sm" | "md" | "lg";
  readonly showName?: boolean;
  readonly className?: string;
}

/**
 * Badge Display Component
 * Reusable component to display a badge with icon, name, and rarity color
 */
export function BadgeDisplay({
  badge,
  size = "md",
  showName = true,
  className,
}: BadgeDisplayProps) {
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

  // Get rarity color
  const getRarityColor = (rarity: BadgeRarity): string => {
    if (badge.color) {
      return badge.color;
    }

    const rarityColors: Record<BadgeRarity, string> = {
      common: "#9CA3AF", // Gray
      uncommon: "#10B981", // Green
      rare: "#3B82F6", // Blue
      epic: "#8B5CF6", // Purple
      legendary: "#F59E0B", // Orange
      mythic: "#EF4444", // Red
    };

    return rarityColors[rarity] || "#9CA3AF";
  };

  const rarityColor = getRarityColor(badge.rarity);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizeClasses[size],
        )}
        style={{
          backgroundColor: `${rarityColor}20`,
          border: `2px solid ${rarityColor}`,
        }}
      >
        {badge.iconUrl ? (
          <Image
            src={badge.iconUrl}
            alt={badge.name}
            width={size === "sm" ? 16 : size === "md" ? 24 : 32}
            height={size === "sm" ? 16 : size === "md" ? 24 : 32}
            className="rounded-full"
          />
        ) : (
          <Award
            className={cn(
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6",
            )}
            style={{ color: rarityColor }}
          />
        )}
      </div>
      {showName && (
        <span className={cn("font-medium", textSizeClasses[size])}>
          {badge.name}
        </span>
      )}
    </div>
  );
}

