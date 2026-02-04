/**
 * SEO Configuration Constants
 * Centralized SEO-related configuration for metadata generation
 */

export const SEO_CONSTANTS = {
  // Site information
  SITE_NAME: "MangaSBS",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://manga.discords.sbs",
  DEFAULT_LOCALE: "en_US",

  // Default descriptions
  DEFAULT_DESCRIPTION:
    "Discover and read manga, anime, and light novels. Your ultimate destination for Japanese entertainment content.",

  // Default images
  DEFAULT_OG_IMAGE: "/og-default.png",
  SERIES_OG_IMAGE_FALLBACK: "/og-series-fallback.png",

  // Twitter
  TWITTER_HANDLE: "@mangasbs",

  // JSON-LD Organization schema
  ORGANIZATION: {
    "@type": "Organization" as const,
    name: "MangaSBS",
    url: "https://manga.discords.sbs",
    logo: "https://manga.discords.sbs/logo.png",
  },

  // Cache durations (in seconds)
  CACHE: {
    METADATA: 3600, // 1 hour for page metadata
    SITEMAP: 86400, // 24 hours for sitemap
  },
} as const;

export type SEOConstants = typeof SEO_CONSTANTS;
