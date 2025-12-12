"use client";

import type { User } from "@/lib/interface";
import { useAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { LoginDialog } from "@/components/features/auth";
import MobileMenuDock from "@/components/features/navigation/mobile-menu-dock";
import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import { ThemeSelector, UserDropdown } from "@/components/ui";
import { LanguageSwitcher } from "@/components/ui/navigation";
import {
  authLoadingAtom,
  clearUserState,
  currentUserAtom,
  logoutAction,
} from "@/lib/auth";

/**
 * Internationalized Site Navigation Component
 * Desktop navigation bar with language switcher, theme toggle, and user authentication
 * Mobile navigation is handled by MobileMenuDock component
 */
export default function SiteNav() {
  const { t } = useI18n();
  const [user, setUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      // Clear user state after successful logout
      setUser(null);
      clearUserState(); // Ensure all tokens are cleared
      toast.success(t("toastLogoutSuccess", "toast"));
    } catch {
      toast.error(t("toastLogoutError", "toast"));
      // Even if logout API fails, clear local state
      setUser(null);
      clearUserState();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Main Navigation Bar - Always visible */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="font-semibold text-base sm:text-lg md:text-xl text-foreground shrink-0"
            >
              {t("appName", "common")}
            </Link>

            {/* Search Bar - Center (Desktop only) */}
            <div className="flex-1 max-w-xl lg:max-w-2xl hidden md:block mx-4">
              <SearchBar className="w-full" />
            </div>

            {/* Desktop actions - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
              <LanguageSwitcher />
              <ThemeSelector variant="compact" />
              {(() => {
                if (authLoading)
                  return (
                    <div className="h-8 w-20 animate-pulse bg-muted rounded" />
                  );
                if (user?.id)
                  return (
                    <UserDropdown
                      user={user as User & { id: string }}
                      onLogout={handleLogout}
                      isLoggingOut={isLoggingOut}
                    />
                  );
                return <LoginDialog />;
              })()}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: Fixed Bottom Menu Dock - show on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
        <MobileMenuDock onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </div>
    </>
  );
}
