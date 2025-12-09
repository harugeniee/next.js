import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import type { BreadcrumbItem } from "@/lib/utils/breadcrumb";
import { generateBreadcrumbs, BreadcrumbRoutes } from "@/lib/utils/breadcrumb";

/**
 * Hook for generating breadcrumb items
 * Provides i18n support and automatic route detection
 */
export function useBreadcrumb(
  items?: BreadcrumbItem[],
  dynamicParams?: Record<string, string | undefined>,
) {
  const pathname = usePathname();
  const { t } = useI18n();

  const breadcrumbItems = useMemo(() => {
    // Helper function to translate label if it's a translation key
    // Translation keys typically contain dots (e.g., "nav.breadcrumb.home")
    // Plain text (like seriesTitle, articleTitle) should not be translated
    const translateLabel = (label: string): string => {
      // Empty or whitespace-only labels should not be translated
      if (!label || !label.trim()) {
        return label;
      }

      // If label contains dots, it's likely a translation key
      if (label.includes(".")) {
        const translated = t(label, "common");
        // If translation returns the same as key, it means translation not found
        // Return the key as fallback (better than showing nothing)
        return translated !== label ? translated : label;
      }
      // Plain text - return as is
      return label;
    };

    // If items are provided, use them directly
    if (items) {
      return items.map((item) => ({
        ...item,
        label: translateLabel(item.label),
      }));
    }

    // Try to match known routes first
    const routeMatch = matchRoute(pathname, dynamicParams);
    if (routeMatch) {
      return routeMatch.map((item) => ({
        ...item,
        label: translateLabel(item.label),
      }));
    }

    // Fallback to auto-generation
    const autoItems = generateBreadcrumbs(pathname, dynamicParams, {
      home:
        t("nav.home", "common") || t("nav.breadcrumb.home", "common") || "Home",
    });

    return autoItems.map((item) => ({
      ...item,
      label: translateLabel(item.label),
    }));
  }, [pathname, items, dynamicParams, t]);

  return breadcrumbItems;
}

/**
 * Match pathname to known route patterns and return breadcrumb items
 */
function matchRoute(
  pathname: string,
  dynamicParams?: Record<string, string | undefined>,
): BreadcrumbItem[] | null {
  // Organizations routes
  if (pathname === "/organizations/register") {
    return BreadcrumbRoutes.organizations.register();
  }

  if (pathname.match(/^\/organizations\/([^/]+)$/)) {
    const organizationId = pathname.split("/")[2];
    return BreadcrumbRoutes.organizations.detail(
      organizationId,
      dynamicParams?.organization_name,
    );
  }

  // Series routes
  if (pathname.match(/^\/series\/([^/]+)\/upload-segment$/)) {
    const seriesId = pathname.split("/")[2];
    return BreadcrumbRoutes.series.uploadSegment(
      seriesId,
      dynamicParams?.series_title,
    );
  }

  if (pathname.match(/^\/series\/([^/]+)$/)) {
    const seriesId = pathname.split("/")[2];
    return BreadcrumbRoutes.series.detail(
      seriesId,
      dynamicParams?.series_title,
    );
  }

  // Segments routes
  if (pathname.match(/^\/segments\/([^/]+)$/)) {
    const segmentId = pathname.split("/")[2];
    return BreadcrumbRoutes.segments.detail(
      segmentId,
      dynamicParams?.series_id || "",
      dynamicParams?.segment_number,
      dynamicParams?.series_title,
    );
  }

  // Articles routes
  if (pathname.match(/^\/article\/([^/]+)\/([^/]+)$/)) {
    const articleId = pathname.split("/")[2];
    return BreadcrumbRoutes.articles.detail(
      articleId,
      dynamicParams?.article_title,
    );
  }

  // User routes
  if (pathname.match(/^\/user\/([^/]+)\/settings$/)) {
    const userId = pathname.split("/")[2];
    return BreadcrumbRoutes.user.settings(userId, dynamicParams?.username);
  }

  if (pathname.match(/^\/user\/([^/]+)$/)) {
    const userId = pathname.split("/")[2];
    return BreadcrumbRoutes.user.profile(userId, dynamicParams?.username);
  }

  return null;
}
