"use client";

import * as React from "react";

import { LanguageSwitcher } from "@/components/ui/navigation/language-switcher";
import { ThemeSelector } from "@/components/ui/theme/theme-selector";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * SidebarSettings Component
 * Wraps ThemeSelector and LanguageSwitcher for use in admin sidebar
 * Handles both collapsed (icon) and expanded states
 */
export function SidebarSettings() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Use compact variant for both collapsed and expanded states
  // Compact variant shows icon-only in collapsed, and can show more in expanded
  const variant = "compact";
  const size = "sm";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        // Horizontal layout when expanded, vertical when collapsed
        isCollapsed ? "flex-col" : "flex-row",
      )}
    >
      <LanguageSwitcher
        variant={variant}
        size={size}
        className={cn(
          // Ensure consistent sizing
          isCollapsed ? "w-full" : "flex-1",
        )}
      />
      <ThemeSelector
        variant={variant}
        size={size}
        className={cn(
          // Ensure consistent sizing
          isCollapsed ? "w-full" : "flex-1",
        )}
      />
    </div>
  );
}
