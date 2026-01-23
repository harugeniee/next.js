"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Site Footer Component
 * Global footer displayed on all pages
 * Includes community links, policies, legal info, and version
 */
export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Social Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("community", "series")}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://discord.gg/mangadex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("discord", "series")}
              </Link>
              <Link
                href="https://twitter.com/mangadex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("twitter", "series")}
              </Link>
              <Link
                href="https://reddit.com/r/mangadex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("reddit", "series")}
              </Link>
              <Link
                href="/status"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("systemStatus", "series")}
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("mangadex", "series")}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/guidelines"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("communityGuidelines", "series")}
              </Link>
              <Link
                href="/announcements"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("announcements", "series")}
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("aboutUs", "series")}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("contact", "series")}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("termsAndPolicies", "series")}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/legal/terms-of-service"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("legal.termsOfService", "common")}
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("legal.privacyPolicy", "common")}
              </Link>
              <Link
                href="/legal/community-guidelines"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("legal.communityGuidelines", "common")}
              </Link>
            </div>
          </div>

          {/* Version Info */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("version", "series")}
            </h3>
            <p className="text-sm text-muted-foreground">v2025.11.26</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
