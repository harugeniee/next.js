"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui";
import { ArrowLeft, Home, Lock, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Permission Denied Page Component
 * Displays when a user doesn't have permission to access a resource
 * Includes navigation options and helpful information
 */
export default function PermissionDeniedPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Permission Denied Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 403 Text */}
            <h1 className="text-8xl sm:text-9xl font-bold text-destructive/20 select-none">
              403
            </h1>

            {/* Shield Icon Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ShieldAlert className="h-16 w-16 sm:h-20 sm:w-20 text-destructive/40" />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-destructive/30 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-orange-500/40 rounded-full animate-pulse delay-100"></div>
            <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-pulse delay-200"></div>
            <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-destructive/30 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-6 w-6 sm:h-7 sm:w-7 text-destructive" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("permissionDenied.title", "common") || "Access Denied"}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t("permissionDenied.description", "common") ||
              "You don't have permission to access this resource. Please contact an administrator if you believe this is an error."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          {returnPath ? (
            <Link href={returnPath}>
              <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8">
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t("permissionDenied.goBack", "common") || "Go Back"}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t("permissionDenied.goBack", "common") || "Go Back"}
            </Button>
          )}

          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8">
              <Home className="mr-2 h-5 w-5" />
              {t("permissionDenied.goHome", "common") || "Go Home"}
            </Button>
          </Link>
        </div>

        {/* Helpful Information */}
        <div className="bg-card border border-border rounded-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("permissionDenied.info", "common") || "Why am I seeing this?"}
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="h-3 w-3 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("permissionDenied.reason1", "common") ||
                    "Insufficient permissions"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("permissionDenied.reason1Desc", "common") ||
                    "You may need a specific role or permission to access this page"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="h-3 w-3 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("permissionDenied.reason2", "common") ||
                    "Account restrictions"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("permissionDenied.reason2Desc", "common") ||
                    "Your account may have restrictions that prevent access to certain features"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Home className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("permissionDenied.reason3", "common") || "Need help?"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("permissionDenied.reason3Desc", "common") ||
                    "Contact support or an administrator if you believe you should have access"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
