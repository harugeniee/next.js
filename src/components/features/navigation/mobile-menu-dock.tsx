"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useAtom } from "jotai";
import {
  ArrowLeft,
  Home,
  LogIn,
  LogOut,
  Search,
  Settings,
  User as UserIcon,
  XIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeSelector,
} from "@/components/ui";
import { Button } from "@/components/ui/core/button";
import { Separator } from "@/components/ui/layout/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/layout/sheet";
import { LanguageSwitcher } from "@/components/ui/navigation";
import {
  MenuDock,
  type MenuDockItem,
} from "@/components/ui/shadcn-io/menu-dock";
import { authLoadingAtom, currentUserAtom } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { fadeVariants } from "@/lib/utils/animations";

interface MobileMenuDockProps {
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

/**
 * Avatar Icon Component for MenuDock
 * Renders user avatar instead of a generic icon
 * Best UX practice: Personalizes the navigation and creates visual identity
 * Used as a replacement for UserIcon in the dock when user is authenticated
 */
function UserAvatarIcon({
  user,
  className,
}: {
  user: { avatar?: { url?: string }; name?: string; username?: string; email?: string };
  className?: string;
}) {
  // Generate initials from user data for fallback
  const initials = (
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "US"
  )
    .slice(0, 2)
    .toUpperCase();

  const avatarUrl = user.avatar?.url;

  // Avatar size: h-6 w-6 (slightly larger than default icon h-4 w-4 for better visibility)
  // This ensures the avatar is clearly visible in the compact dock variant
  return (
    <Avatar className={cn("h-6 w-6 ring-1 ring-border", className)}>
      {avatarUrl && (
        <AvatarImage
          src={avatarUrl}
          alt={`${user.name || user.username || user.email || "User"} avatar`}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[0.625rem] leading-none">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * Mobile Menu Dock Navigation
 * Horizontal navigation bar at the bottom of mobile screens
 * Replaces the FAB button with a dock-style navigation
 */
export default function MobileMenuDock({
  onLogout,
  isLoggingOut,
}: MobileMenuDockProps) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(
    null,
  );

  // Check if current route is a detail/nested page (not in dock menu)
  const isDetailPage = useMemo(() => {
    // Routes that are in dock menu
    const dockRoutes = [
      "/",
      "/auth/login",
      "/settings",
      user?.id ? `/user/${user.id}` : null,
    ].filter(Boolean) as string[];

    // Check if current pathname matches any dock route
    const matchesDockRoute = dockRoutes.some((route) => {
      if (route === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(route);
    });

    // If doesn't match dock routes, it's a detail page
    return !matchesDockRoute;
  }, [pathname, user?.id]);

  // Calculate menu items based on auth state
  const menuItems = useMemo<MenuDockItem[]>(() => {
    const items: MenuDockItem[] = [];

    // Add Back button if on detail page
    if (isDetailPage) {
      items.push({
        label: t("actions.back", "common") || "Back",
        icon: ArrowLeft,
        onClick: () => {
          router.back();
        },
      });
    }

    // Always add Home
    items.push({
      label: t("nav.home", "common") || "Home",
      icon: Home,
      onClick: () => {
        router.push("/");
      },
    });

    // Always add Search
    items.push({
      label: t("actions.search", "common") || "Search",
      icon: Search,
      onClick: () => {
        setIsSearchOpen(true);
      },
    });

    // Add Profile item if user is authenticated, otherwise add Login button
    // Write button is hidden per requirements
    // Only show Login button when auth is not loading and user is not authenticated
    // This prevents showing Login button when user is actually authenticated (cookie exists but client state not synced yet)
    if (authLoading) {
      // Don't add anything while auth is loading to avoid flickering
      // The button will appear once auth state is determined
    } else if (user?.id) {
      // Create Avatar icon component wrapper for personalized UX
      // Best practice: Use Avatar instead of generic icon for better user recognition
      const AvatarIcon = ({ className }: { className?: string }) => (
        <UserAvatarIcon user={user} className={className} />
      );
      
      items.push({
        label: t("nav.profile", "common") || "Profile",
        icon: AvatarIcon, // Avatar provides better UX than generic UserIcon
        onClick: () => {
          setIsSettingsOpen(true);
        },
      });
    } else {
      // Add Login button when user is not authenticated (and auth loading is complete)
      // Find the index where Login will be inserted
      const loginIndex = items.length;
      items.push({
        label: t("login.button", "auth") || "Login",
        icon: LogIn,
        onClick: () => {
          // Set active index immediately before navigation
          setUserSelectedIndex(loginIndex);
          // Get current path to redirect back after login
          // Use pathname from hook instead of window.location for Next.js App Router compatibility
          const currentPath = pathname;
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
          router.push(loginUrl);
        },
      });
    }

    // Always add Settings as last item
    items.push({
      label: t("nav.settings", "common") || "Settings",
      icon: Settings,
      onClick: () => {
        router.push("/settings");
      },
    });

    return items;
  }, [user, authLoading, t, router, isDetailPage, pathname, setUserSelectedIndex]);

  // Calculate active index based on current pathname
  const pathnameBasedIndex = useMemo(() => {
    // If on detail page, Back button should be active (index 0)
    if (isDetailPage) {
      return 0;
    }

    if (pathname === "/") {
      // Home is at index 0 if no Back button, otherwise index 1
      return isDetailPage ? 1 : 0;
    }
    // Check for Search - this is index 1 (or 2 if Back button exists)
    // So we'll handle it via user click only

    // Check for Login route (when not authenticated)
    if (pathname.startsWith("/auth/login") && !user?.id) {
      const loginIndex = menuItems.findIndex(
        (item) => item.label === (t("login.button", "auth") || "Login"),
      );
      if (loginIndex !== -1) {
        return loginIndex;
      }
    }

    if (pathname.startsWith("/user/") && user?.id) {
      // Find Profile item by checking if onClick navigates to user profile
      const profileIndex = menuItems.findIndex(
        (item) => item.label === (t("nav.profile", "common") || "Profile"),
      );
      if (profileIndex !== -1) {
        return profileIndex;
      }
    }
    if (pathname.startsWith("/settings")) {
      // Settings is always the last item
      return menuItems.length - 1;
    }
    // For other routes, default to home (or back if on detail page)
    return isDetailPage ? 0 : 0;
  }, [pathname, menuItems, user?.id, t, isDetailPage]);

  // Determine final active index: use user selection if available and valid, otherwise use pathname-based
  const finalActiveIndex = useMemo(() => {
    // If user has selected an index and it's valid, use it
    if (
      userSelectedIndex !== null &&
      userSelectedIndex >= 0 &&
      userSelectedIndex < menuItems.length
    ) {
      return userSelectedIndex;
    }
    // Otherwise, use pathname-based index
    // Ensure it's within bounds
    if (
      pathnameBasedIndex >= 0 &&
      pathnameBasedIndex < menuItems.length &&
      menuItems.length > 0
    ) {
      return pathnameBasedIndex;
    }
    // Fallback to 0
    return 0;
  }, [userSelectedIndex, pathnameBasedIndex, menuItems.length]);

  // Track previous pathname to detect changes
  const prevPathnameRef = useRef(pathname);

  // Reset user selection when pathname changes (navigation happened)
  // This allows pathname to take precedence after navigation
  // This is a legitimate use of useEffect to sync with router (external system)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Pathname changed, so clear user selection to use pathname-based index
      // eslint-disable-next-line -- Syncing with router state (external system)
      setUserSelectedIndex(null);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  // Handle navigation and close sheet
  const handleNavigate = (path: string) => {
    router.push(path);
    setIsSettingsOpen(false);
  };

  const handleLoginClick = () => {
    // Get current path to redirect back after login
    const currentPath = window.location.pathname;
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    router.push(loginUrl);
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    await onLogout();
    setIsSettingsOpen(false);
  };

  // Slide down animation variant for search container
  const slideDownVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        mass: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.15,
      },
    },
  };

  // Prevent body scroll when search overlay is open
  useEffect(() => {
    if (isSearchOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isSearchOpen]);

  // Handle ESC key to close search overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Menu Dock Navigation */}
      <div className="w-full flex justify-center">
        <MenuDock
          items={menuItems}
          variant="compact"
          orientation="horizontal"
          showLabels={true}
          animated={true}
          activeIndex={finalActiveIndex}
          onActiveIndexChange={setUserSelectedIndex}
          // className="w-full max-w-md"
        />
      </div>

      {/* Settings Bottom Sheet - Best UX for mobile */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto p-0"
        >
          <SheetHeader className="px-4 pt-4 pb-3 border-b border-border">
            <SheetTitle>{t("nav.menu", "common") || "Menu"}</SheetTitle>
          </SheetHeader>

          <div className="p-4 space-y-6">
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

                  {/* Action buttons */}
                  <div className="space-y-1">
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
        </SheetContent>
      </Sheet>

      {/* Search Overlay - Fixed at top on mobile */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Blurred background overlay */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              className="absolute inset-0 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
              onClick={() => setIsSearchOpen(false)}
              aria-hidden="true"
            />

            {/* Search container positioned below header */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideDownVariants}
              className="relative top-[0px] px-4 pt-4 pb-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-title"
            >
              {/* Header with title and close button */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="search-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {t("actions.search", "common") || "Search"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label={t("actions.close", "common") || "Close search"}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Bar */}
              <SearchBar
                className="w-full"
                showKeyboardShortcut={false}
                onSearch={(query) => {
                  // Handle search if needed
                  console.log("Search query:", query);
                }}
                onResultClick={() => {
                  // Close search overlay when a result is clicked
                  setIsSearchOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
