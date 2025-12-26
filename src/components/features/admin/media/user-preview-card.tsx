"use client";

import { Badge } from "@/components/ui/core/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useI18n } from "@/components/providers/i18n-provider";
import type { User } from "@/lib/interface/user.interface";
import { cn } from "@/lib/utils";

interface UserPreviewCardProps {
  readonly user: User | null | undefined;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * User Preview Card Component
 * Shows user information in a hover card when hovering over user link
 */
export function UserPreviewCard({
  user,
  children,
  className,
}: UserPreviewCardProps) {
  // If no user, just render children without hover card
  if (!user) {
    return <>{children}</>;
  }

  const displayName = user.name || user.username || user.email || user.id;
  const userRole = user.role || "user";
  const userStatus = user.status || "inactive";

  return (
    <HoverCard>
      <HoverCardTrigger asChild className={cn("cursor-pointer", className)}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-4">
          {/* User Header */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">{displayName}</h4>
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge
                variant={userRole === "admin" ? "default" : "secondary"}
                className="text-xs"
              >
                {userRole}
              </Badge>
              <Badge
                variant={userStatus === "active" ? "default" : "outline"}
                className="text-xs"
              >
                {userStatus}
              </Badge>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2 text-sm">
            {user.username && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
            )}
            {user.id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
