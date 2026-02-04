import type { MetadataRoute } from "next";
import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";
import { fetchSeriesListForSitemap } from "@/lib/seo/server-fetch";

/**
 * Dynamic Sitemap Generation
 *
 * This file generates a sitemap.xml for search engines.
 * It includes:
 * - Static pages (homepage, latest series)
 * - Dynamic series pages (fetched from API)
 *
 * The sitemap is regenerated based on the revalidate settings
 * in the server-fetch utility (default: 24 hours).
 *
 * Access at: /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONSTANTS.SITE_URL;

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/series/latest`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // Dynamic series pages
  let seriesPages: MetadataRoute.Sitemap = [];

  try {
    const seriesResponse = await fetchSeriesListForSitemap(1000);

    if (seriesResponse?.result) {
      seriesPages = seriesResponse.result.map((series) => ({
        url: `${baseUrl}/series/${series.id}`,
        lastModified: series.updatedAt
          ? new Date(series.updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching series for sitemap:", error);
    // Continue with static pages only if API fails
  }

  return [...staticPages, ...seriesPages];
}
