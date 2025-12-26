"use client";

import { User } from "lucide-react";
import Image from "next/image";

import type { Character } from "@/lib/interface/character.interface";
import { cn } from "@/lib/utils";

interface CharacterDisplayProps {
  readonly character: Character;
  readonly size?: "sm" | "md" | "lg";
  readonly showName?: boolean;
  readonly className?: string;
}

/**
 * Character Display Component
 * Reusable component to display a character with image and name
 */
export function CharacterDisplay({
  character,
  size = "md",
  showName = true,
  className,
}: CharacterDisplayProps) {
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

  // Get character display name
  const displayName =
    character.name?.full ||
    character.name?.userPreferred ||
    character.name?.first ||
    character.name?.native ||
    "Unknown Character";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center overflow-hidden bg-muted",
          sizeClasses[size],
        )}
      >
        {character.image?.url ? (
          <Image
            src={character.image.url}
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
