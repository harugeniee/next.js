"use client";

import { useAtom } from "jotai";
import { LogOut, Menu, Settings, User as UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeSelector,
} from "@/components/ui";
import { Button } from "@/components/ui/core/button";
import { Separator } from "@/components/ui/layout/separator";
import { LanguageSwitcher } from "@/components/ui/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { authLoadingAtom, currentUserAtom } from "@/lib/auth";

interface BottomNavProps {
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

/**
 * Mobile Bottom Menu Button (FAB)
 * Floating Action Button that opens a Sheet with navigation and settings
 * Only visible on mobile devices
 */
export default function BottomNav({ onLogout, isLoggingOut }: BottomNavProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle navigation and close popover
  const handleNavigate = (path: string) => {
    router.push(path);
    setIsPopoverOpen(false);
  };

  const handleLoginClick = () => {
    // Get current path to redirect back after login
    const currentPath = window.location.pathname;
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    router.push(loginUrl);
    setIsPopoverOpen(false);
  };

  const handleLogout = async () => {
    await onLogout();
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      {/* FAB Menu Button with animated icon toggle */}
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="h-14 w-14 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label={isPopoverOpen ? "Close menu" : "Open menu"}
        >
          {/* Icon transition with rotation animation - properly centered */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Menu
              className={`absolute transition-all duration-200 ease-in-out ${
                isPopoverOpen
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              size={24}
              strokeWidth={2.5}
            />
            <X
              className={`absolute transition-all duration-200 ease-in-out ${
                isPopoverOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
              size={24}
              strokeWidth={2.5}
            />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="w-80 max-w-[calc(100vw-2rem)] p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-base font-semibold text-foreground">
            {t("nav.menu", "common") || "Menu"}
          </h3>
        </div>

        <Separator />

        {/* Scrollable content area */}
        <div className="max-h-[70vh] overflow-y-auto overscroll-contain p-4 space-y-4">
          {/* Language Switcher Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("nav.language", "common")}
            </label>
            <LanguageSwitcher
              variant="full"
              size="sm"
              className="w-full justify-start h-9"
            />
          </div>

          {/* Theme Selector Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("nav.theme", "common")}
            </label>
            <ThemeSelector
              variant="full"
              size="sm"
              className="w-full justify-start h-9"
            />
          </div>

          <Separator />

          {/* Auth Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("nav.account", "common")}
            </label>
            {authLoading ? (
              <div className="h-9 w-full animate-pulse bg-muted rounded-lg" />
            ) : user?.id ? (
              <div className="space-y-2">
                {/* User summary card */}
                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card/50 px-3 py-2.5 backdrop-blur-sm">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                    {user.avatar?.url && (
                      <AvatarImage
                        src={user.avatar.url}
                        alt={`${user.name || user.username || user.email || "User"} avatar`}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {(
                        user.name ||
                        user.username ||
                        user.email?.split("@")[0] ||
                        "US"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {user.name ||
                        user.username ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons - compact for popover */}
                <div className="space-y-1">
                  {/* Temporarily hidden: Write button */}
                  {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 h-9 text-sm px-2"
                    onClick={() => handleNavigate("/write")}
                  >
                    <PenTool className="h-4 w-4" />
                    <span>{t("userDropdownWrite", "user")}</span>
                  </Button> */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 h-9 text-sm px-2"
                    onClick={() => handleNavigate(`/user/${user.id}`)}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>{t("userDropdownProfile", "user")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 h-9 text-sm px-2"
                    onClick={() => handleNavigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>{t("userDropdownSettings", "user")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 h-9 text-sm px-2 text-red-600 hover:text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:text-red-400"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>
                      {isLoggingOut
                        ? t("userDropdownLoggingOut", "user")
                        : t("userDropdownLogout", "user")}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full h-9 text-sm font-medium"
                onClick={handleLoginClick}
              >
                {t("login.button", "auth") || "Login"}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
