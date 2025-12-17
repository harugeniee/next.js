"use client";

import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { useCheckRole } from "@/hooks/permissions";
import { currentUserAtom } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";

/**
 * Invite-Only Overlay Component
 * Displays a full-page blur overlay on homepage to inform users that the site is invite-only
 * - Full-page blur overlay: Always visible when on homepage
 * - Dialog modal: Shows on first visit, can be dismissed but blur remains
 * Uses localStorage to remember if user has dismissed the dialog
 */
export function InviteOnlyOverlay() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [currentUser] = useAtom(currentUserAtom);

  // Check if current user has uploader role using shared permissions hook
  // This hook uses the same role-check API that is used on the series detail page
  const { data: roleCheckData, isLoading: isCheckingRole } = useCheckRole(
    "uploader",
    !!currentUser,
  );
  const hasUploaderRole = roleCheckData?.hasRole ?? false;

  // Compute whether blur overlay should be visible without extra state
  const isHomepage = pathname === "/" || pathname === "";
  const shouldShowBlurOverlay =
    isHomepage && (!currentUser || isCheckingRole || !hasUploaderRole);

  // Compute dialog visibility based on localStorage and current overlay rules
  let shouldShowDialog = false;
  if (typeof window !== "undefined" && shouldShowBlurOverlay) {
    const hasDismissed = localStorage.getItem(
      "invite-only-overlay-dismissed",
    );
    shouldShowDialog = !hasDismissed;
  }

  const handleDismiss = () => {
    // Store dismissal in localStorage so dialog does not show again
    if (typeof window !== "undefined") {
      localStorage.setItem("invite-only-overlay-dismissed", "true");
    }
  };

  // Do not render when overlay should be hidden or when user is uploader
  if (!shouldShowBlurOverlay || hasUploaderRole) {
    return null;
  }

  return (
    <>
      {/* Full-page blur overlay - Always visible when on homepage */}
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60" />

      {/* Custom Dialog modal - Only shows on first visit */}
      {shouldShowDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleDismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-only-title"
          aria-describedby="invite-only-description"
        >
          {/* Modal content */}
          <div
            className={cn(
              "bg-background animate-in fade-in-0 zoom-in-95 zoom-out-95 duration-200",
              "w-full max-w-md rounded-lg border border-border p-6 shadow-lg",
              "sm:p-8",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2
                id="invite-only-title"
                className="text-xl font-semibold leading-none sm:text-2xl"
              >
                {t("inviteOnly.title", "common")}
              </h2>
              <p
                id="invite-only-description"
                className="mt-2 text-base text-muted-foreground sm:text-lg"
              >
                {t("inviteOnly.description", "common")}
              </p>
            </div>

            {/* Message */}
            <div className="mt-4 space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                {t("inviteOnly.message", "common")}
              </p>
            </div>

            {/* Action button */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleDismiss}
                size="lg"
                className="min-w-[120px]"
              >
                {t("inviteOnly.understand", "common")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
