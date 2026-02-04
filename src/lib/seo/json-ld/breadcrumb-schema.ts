/**
 * BreadcrumbList JSON-LD Schema Generator
 *
 * Generates structured data for breadcrumb navigation.
 * This helps search engines understand site hierarchy and can
 * display breadcrumb trails in search results.
 *
 * @see https://schema.org/BreadcrumbList
 */

import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";

export interface BreadcrumbItem {
  /** Display name for the breadcrumb */
  name: string;
  /** URL path (relative or absolute) */
  url?: string;
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 *
 * @param items - Array of breadcrumb items in order (home → current page)
 * @returns JSON-LD object for BreadcrumbList
 *
 * @example
 * ```ts
 * generateBreadcrumbJsonLd([
 *   { name: "Home", url: "/" },
 *   { name: "Series", url: "/series/latest" },
 *   { name: "Naruto" } // Current page (no url)
 * ])
 * ```
 */
export function generateBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  const baseUrl = SEO_CONSTANTS.SITE_URL;

  const itemListElement = items.map((item, index) => {
    const position = index + 1;
    
    // Determine the full URL for the breadcrumb item
    let itemUrl: string | undefined;
    if (!item.url) {
      itemUrl = undefined;
    } else if (item.url.startsWith("http")) {
      // Already an absolute URL, use as-is
      itemUrl = item.url;
    } else {
      // Relative URL, prepend base URL
      itemUrl = `${baseUrl}${item.url}`;
    }

    const listItem: Record<string, unknown> = {
      "@type": "ListItem",
      position,
      name: item.name,
    };

    // Only add item URL if it's not the current page
    if (itemUrl) {
      listItem.item = itemUrl;
    }

    return listItem;
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Generate breadcrumb items for a series detail page
 *
 * @param seriesTitle - The title of the series
 * @returns Array of breadcrumb items
 */
export function getSeriesBreadcrumbItems(
  seriesTitle: string,
): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Series", url: "/series/latest" },
    { name: seriesTitle }, // Current page - no URL
  ];
}

/**
 * Generate breadcrumb items for an article page
 *
 * @param articleTitle - The title of the article
 * @returns Array of breadcrumb items
 */
export function getArticleBreadcrumbItems(
  articleTitle: string,
): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Articles", url: "/write" },
    { name: articleTitle }, // Current page - no URL
  ];
}
