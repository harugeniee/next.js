"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo } from "react";

import { BreadcrumbNav } from "@/components/features/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useKeyValueByKey } from "@/hooks/admin/useKeyValue";
import { useBreadcrumb, usePageMetadata } from "@/hooks/ui";
import { markdownToHtml } from "@/lib/utils";

/**
 * Legal page key mapping
 * Maps URL slugs to key-value store keys
 */
const LEGAL_PAGE_KEYS: Record<string, string> = {
  "privacy-policy": "privacy-policy",
  "community-guidelines": "community-guidelines",
  "content-policy-for-moderators": "content-policy-for-moderators",
  "terms-of-service": "terms-of-service",
} as const;

/**
 * Legal page title mapping for translations
 */
const LEGAL_PAGE_TITLES: Record<string, string> = {
  "privacy-policy": "legal.privacyPolicy",
  "community-guidelines": "legal.communityGuidelines",
  "content-policy-for-moderators": "legal.contentPolicyForModerators",
  "terms-of-service": "legal.termsOfService",
} as const;

/**
 * Legal Page Component
 * Displays legal content (privacy policy, terms of service, etc.) from key-value store
 * URL pattern: /legal/[slug]
 * Layout inspired by article page design
 */
export default function LegalPage() {
  const params = useParams();
  const { t } = useI18n();
  const slug = params.slug as string;

  // Get key-value key from slug
  const keyValueKey = LEGAL_PAGE_KEYS[slug];
  const titleKey = LEGAL_PAGE_TITLES[slug];

  // Fetch key-value data
  const {
    data: keyValue,
    isLoading,
    error,
  } = useKeyValueByKey(keyValueKey || "");

  // Convert markdown value to HTML
  const value = keyValue?.value;
  const htmlContent = useMemo(() => {
    if (!value) return "";

    // Value from API can be string or object, handle both cases
    const markdownContent =
      typeof value === "string" ? value : JSON.stringify(value);

    return markdownToHtml(markdownContent);
  }, [value]);

  // Page title
  const pageTitle = titleKey ? t(titleKey, "common") : slug;

  // Breadcrumb items
  const breadcrumbItems = useBreadcrumb(undefined, {
    legal_slug: slug,
    legal_title: pageTitle,
  });

  // Update page metadata
  usePageMetadata({
    title: pageTitle,
    description: t("legal.description", "common", {}, "Legal document"),
  });

  // Show 404 if slug is invalid or key-value not found
  if (!keyValueKey || (!isLoading && !error && !keyValue)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto px-4">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {t("legal.error", "common", {}, "Failed to load content")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {error.message ||
                    "Something went wrong while loading the content."}
                </p>
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    {t("nav.breadcrumb.home", "common") || "Back to Home"}
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {!error && keyValue && (
            <article className="max-w-4xl mx-auto">
              {/* Breadcrumb Navigation */}
              <div className="mb-4 sm:mb-6">
                <BreadcrumbNav items={breadcrumbItems} />
              </div>

              {/* Page Header */}
              <header className="mb-6 sm:mb-8">
                {/* Title - Clean typography matching article page */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
                  {pageTitle}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("legal.description", "common", {}, "Legal document")}
                </p>
              </header>

              {/* Content - Clean typography matching article page */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-p:leading-relaxed">
                <ContentRenderer
                  content={htmlContent}
                  className="legal-content"
                  enableSyntaxHighlighting={true}
                  useTipTapStyling={true}
                  variant="default"
                />
              </div>
            </article>
          )}
        </Skeletonize>
      </div>
    </div>
  );
}
