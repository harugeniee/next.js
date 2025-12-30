/**
 * Breadcrumb utility functions
 * Provides helpers for generating breadcrumb items from routes and data
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

/**
 * Generate breadcrumb items from pathname
 * @param pathname - Current pathname (e.g., "/organizations/register")
 * @param dynamicParams - Object with dynamic route params (e.g., { series_id: "123" })
 * @param labels - Custom labels for specific routes
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
  pathname: string,
  dynamicParams?: Record<string, string | undefined>,
  labels?: Record<string, string>,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // Always start with Home
  items.push({
    label: labels?.home || "Home",
    href: "/",
  });

  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items from segments
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip numeric IDs (they're dynamic params)
    if (/^\d+$/.test(segment)) {
      continue;
    }

    // Check if this segment has a dynamic param replacement
    const paramKey = Object.keys(dynamicParams || {}).find(
      (key) => segments[i - 1] === key.replace("_id", "").replace("_slug", ""),
    );
    const dynamicLabel =
      paramKey && dynamicParams?.[paramKey]
        ? dynamicParams[paramKey]
        : undefined;

    // Get label from custom labels, dynamic params, or generate from segment
    const label =
      dynamicLabel ||
      labels?.[currentPath] ||
      labels?.[segment] ||
      formatSegmentLabel(segment);

    // Last item is active (no href)
    const isLast = i === segments.length - 1;
    items.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast,
    });
  }

  return items;
}

/**
 * Format segment name to readable label
 * @param segment - URL segment (e.g., "upload-segment")
 * @returns Formatted label (e.g., "Upload Segment")
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate breadcrumb items for specific routes with custom logic
 */
export const BreadcrumbRoutes = {
  /**
   * Organizations routes
   */
  organizations: {
    register: (): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.organizations", href: "/organizations" },
      { label: "nav.breadcrumb.register", isActive: true },
    ],
    detail: (
      organizationId: string,
      organizationName?: string,
    ): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.organizations", href: "/organizations" },
      {
        label:
          organizationName && organizationName.trim()
            ? organizationName
            : "nav.breadcrumb.organizations",
        isActive: true,
      },
    ],
  },

  /**
   * Series routes
   */
  series: {
    uploadSegment: (
      seriesId: string,
      seriesTitle?: string,
    ): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.series", href: "/series" },
      {
        // Use seriesTitle if provided and not empty, otherwise use translation key
        label:
          seriesTitle && seriesTitle.trim()
            ? seriesTitle
            : "nav.breadcrumb.series",
        href: `/series/${seriesId}`,
      },
      { label: "nav.breadcrumb.uploadSegment", isActive: true },
    ],
    detail: (seriesId: string, seriesTitle?: string): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.series", href: "/series" },
      {
        // Use seriesTitle if provided and not empty, otherwise use translation key
        label:
          seriesTitle && seriesTitle.trim()
            ? seriesTitle
            : "nav.breadcrumb.series",
        isActive: true,
      },
    ],
  },

  /**
   * Segments routes
   */
  segments: {
    detail: (
      segmentId: string,
      seriesId: string,
      segmentNumber?: string,
      seriesTitle?: string,
    ): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      {
        // Use seriesTitle if provided and not empty, otherwise use translation key
        label:
          seriesTitle && seriesTitle.trim()
            ? seriesTitle
            : "nav.breadcrumb.series",
        // Use seriesId if provided, otherwise fallback to /series to prevent invalid href
        href: seriesId ? `/series/${seriesId}` : "/series",
      },
      {
        // Use segmentNumber if provided, otherwise use translation key
        label:
          segmentNumber && segmentNumber.trim()
            ? `${segmentNumber}`
            : "nav.breadcrumb.segment",
        isActive: true,
      },
    ],
  },

  /**
   * Articles routes
   */
  articles: {
    detail: (articleId: string, articleTitle?: string): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.articles", href: "/articles" },
      {
        // Use articleTitle if provided and not empty, otherwise use translation key
        label:
          articleTitle && articleTitle.trim()
            ? articleTitle
            : "nav.breadcrumb.articles",
        isActive: true,
      },
    ],
  },

  /**
   * User routes
   */
  user: {
    settings: (userId: string, username?: string): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      {
        // Use username if provided and not empty, otherwise use translation key
        label: username && username.trim() ? username : "nav.breadcrumb.users",
        href: `/user/${userId}`,
      },
      { label: "nav.breadcrumb.settings", isActive: true },
    ],
    profile: (userId: string, username?: string): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      {
        // Use username if provided and not empty, otherwise use translation key
        label: username && username.trim() ? username : "nav.breadcrumb.users",
        isActive: true,
      },
    ],
  },

  /**
   * Admin routes
   */
  admin: {
    genres: (): BreadcrumbItem[] => [
      { label: "nav.breadcrumb.home", href: "/" },
      { label: "nav.breadcrumb.admin", href: "/admin" },
      { label: "nav.breadcrumb.genres", isActive: true },
    ],
  },
};
