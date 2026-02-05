/**
 * Series utility functions
 * Helper functions for transforming and formatting series data
 */

import type {
  BackendSeries,
  LatestUpdateItem,
  Series,
  SeriesLanguage,
} from "@/lib/interface/series.interface";

/**
 * Extract title from backend series title object
 */
function extractTitle(backendSeries: BackendSeries): string {
  if (!backendSeries.title) {
    return "Untitled";
  }
  return (
    backendSeries.title.userPreferred ||
    backendSeries.title.romaji ||
    backendSeries.title.english ||
    backendSeries.title.native ||
    "Untitled"
  );
}

/**
 * Get the best cover image URL from coverImageUrls object
 * Handles both AniList format (large, medium, extraLarge) and MAL format (jpg, webp, jpg_large, etc.)
 *
 * @param coverImageUrls - The coverImageUrls object from API response
 * @returns The best available image URL or undefined
 */
export function getBestCoverImageUrl(
  coverImageUrls: Record<string, string> | undefined,
): string | undefined {
  if (!coverImageUrls) return undefined;

  // AniList format priority: extraLarge > large > medium
  if (coverImageUrls.extraLarge) return coverImageUrls.extraLarge;
  if (coverImageUrls.large) return coverImageUrls.large;
  if (coverImageUrls.medium) return coverImageUrls.medium;

  // MAL format priority: webp_large > jpg_large > webp > jpg > webp_small > jpg_small
  if (coverImageUrls.webp_large) return coverImageUrls.webp_large;
  if (coverImageUrls.jpg_large) return coverImageUrls.jpg_large;
  if (coverImageUrls.webp) return coverImageUrls.webp;
  if (coverImageUrls.jpg) return coverImageUrls.jpg;
  if (coverImageUrls.webp_small) return coverImageUrls.webp_small;
  if (coverImageUrls.jpg_small) return coverImageUrls.jpg_small;

  // Fallback: get first valid URL (skip non-URL values like 'color')
  for (const value of Object.values(coverImageUrls)) {
    if (value && typeof value === "string" && value.startsWith("http")) {
      return value;
    }
  }

  return undefined;
}

/**
 * Extract cover URL from backend series
 * Priority: coverImage.url > coverImageUrls (best size) > metadata.coverImage > default
 */
function extractCoverUrl(backendSeries: BackendSeries): string {
  // First priority: coverImage relation (Media entity)
  if (backendSeries.coverImage?.url) {
    return backendSeries.coverImage.url;
  }

  // Second priority: coverImageUrls object (handles both AniList and MAL formats)
  const bestCoverUrl = getBestCoverImageUrl(backendSeries.coverImageUrls);
  if (bestCoverUrl) {
    return bestCoverUrl;
  }

  // Third priority: metadata.coverImage
  if (backendSeries.metadata) {
    const metadata = backendSeries.metadata as Record<string, unknown>;
    const coverImage = metadata["coverImage"] as Record<string, unknown>;
    if (coverImage) {
      const extraLarge = coverImage["extraLarge"] as string;
      if (extraLarge) return extraLarge;
      const large = coverImage["large"] as string;
      if (large) return large;
    }
  }

  // Default placeholder
  return "/default-article-cover.jpg";
}

/**
 * Extract banner URL from backend series
 * Priority: bannerImage.url > bannerImageUrl > default
 */
function extractBannerUrl(backendSeries: BackendSeries): string | undefined {
  // First priority: bannerImage relation (Media entity)
  if (backendSeries.bannerImage?.url) {
    return backendSeries.bannerImage.url;
  }

  // Second priority: bannerImageUrl field
  if (backendSeries.bannerImageUrl) {
    return backendSeries.bannerImageUrl;
  }

  // Return undefined if no banner available
  return undefined;
}

/**
 * Extract language from backend series
 */
function extractLanguage(backendSeries: BackendSeries): SeriesLanguage {
  // Map country codes to language codes
  const countryToLanguage: Record<string, SeriesLanguage> = {
    JP: "ja",
    US: "en",
    GB: "en",
    VN: "vi",
    CN: "zh",
    KR: "ko",
    PT: "pt",
    BR: "pt",
    FR: "fr",
  };

  if (backendSeries.countryOfOrigin) {
    const lang = countryToLanguage[backendSeries.countryOfOrigin];
    if (lang) return lang;
  }

  // Default to Japanese for anime/manga
  return "ja";
}

/**
 * Extract tags from backend series
 */
function extractTags(backendSeries: BackendSeries): string[] {
  if (!backendSeries.tags || backendSeries.tags.length === 0) {
    return [];
  }
  return backendSeries.tags.map((tag) => tag.name);
}

/**
 * Extract genres from backend series
 * Genres are different from tags - they are more structured categories
 */
function extractGenres(backendSeries: BackendSeries): string[] {
  if (!backendSeries.genres || backendSeries.genres.length === 0) {
    return [];
  }
  return backendSeries.genres
    .map((genreItem) => genreItem.genre?.name)
    .filter((name): name is string => !!name);
}

/**
 * Extract author from backend series
 */
function extractAuthor(backendSeries: BackendSeries): string {
  if (!backendSeries.authorRoles || backendSeries.authorRoles.length === 0) {
    return "Unknown";
  }

  // Get main author first, or first author
  const mainAuthor = backendSeries.authorRoles.find((ar) => ar.isMain);
  const author = mainAuthor || backendSeries.authorRoles[0];

  return author.author?.name || "Unknown";
}

/**
 * Extract additional links from backend series
 */
function extractAdditionalLinks(
  backendSeries: BackendSeries,
): Array<{ label: string; url: string }> {
  if (!backendSeries.externalLinks) {
    return [];
  }

  return Object.entries(backendSeries.externalLinks).map(([label, url]) => ({
    label,
    url,
  }));
}

/**
 * Transform backend series to frontend series format
 */
export function transformBackendSeries(backendSeries: BackendSeries): Series {
  return {
    id: backendSeries.id,
    title: extractTitle(backendSeries),
    coverUrl: extractCoverUrl(backendSeries),
    bannerUrl: extractBannerUrl(backendSeries),
    language: extractLanguage(backendSeries),
    tags: extractTags(backendSeries),
    description: backendSeries.description || "",
    author: extractAuthor(backendSeries),
    additionalLinks: extractAdditionalLinks(backendSeries),
    timestamp: backendSeries.updatedAt || backendSeries.createdAt,
    // Additional fields
    type: backendSeries.type,
    format: backendSeries.format,
    status: backendSeries.status || backendSeries.releasingStatus,
    source: backendSeries.source,
    startDate: backendSeries.startDate,
    episodes: backendSeries.episodes,
    genres: extractGenres(backendSeries),
    averageScore: backendSeries.averageScore,
    popularity: backendSeries.popularity,
    trending: backendSeries.trending,
    isNsfw: backendSeries.isNsfw,
    isLicensed: backendSeries.isLicensed,
    season: backendSeries.season,
    seasonYear: backendSeries.seasonYear,
  };
}

/**
 * Transform array of backend series to frontend series format
 */
export function transformBackendSeriesList(
  backendSeriesList: BackendSeries[],
): Series[] {
  return backendSeriesList.map(transformBackendSeries);
}

/**
 * Transform backend series to popular series format
 */
export function transformToPopularSeries(
  backendSeries: BackendSeries,
): Series & {
  views?: number;
  likes?: number;
  rating?: number;
} {
  const base = transformBackendSeries(backendSeries);
  return {
    ...base,
    views: backendSeries.popularity
      ? Math.floor(backendSeries.popularity)
      : undefined,
    likes: backendSeries.favoriteCount,
    rating: backendSeries.averageScore,
  };
}

/**
 * Map frontend Series to LatestUpdateItem for latest-updates list/card display.
 * Uses series timestamp (updatedAt/createdAt) and a placeholder chapter for the full latest page.
 */
export function seriesToLatestUpdateItem(series: Series): LatestUpdateItem {
  return {
    id: series.id,
    title: series.title,
    coverUrl: series.coverUrl,
    chapter: {
      number: "-",
      title: "",
      language: "en",
      url: `/series/${series.id}`,
    },
    groups: [],
    timestamp: series.timestamp ?? new Date(),
    commentCount: 0,
    isNsfw: series.isNsfw,
    genres: series.genres,
    tags: series.tags,
  };
}
