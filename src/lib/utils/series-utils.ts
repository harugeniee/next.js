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
 * Extract cover URL from backend series
 * Priority: coverImage.url > coverImageUrls.large > coverImageUrls.medium > coverImageUrls.small > default
 */
function extractCoverUrl(backendSeries: BackendSeries): string {
  // First priority: coverImage relation (Media entity)
  if (backendSeries.coverImage?.url) {
    return backendSeries.coverImage.url;
  }

  // Second priority: coverImageUrls object (from AniList API)
  if (backendSeries.coverImageUrls) {
    // Try different sizes in order of preference
    if (backendSeries.coverImageUrls.large) {
      return backendSeries.coverImageUrls.large;
    }
    if (backendSeries.coverImageUrls.medium) {
      return backendSeries.coverImageUrls.medium;
    }
    if (backendSeries.coverImageUrls.small) {
      return backendSeries.coverImageUrls.small;
    }
    // If there's any URL in the object, use the first one
    const firstUrl = Object.values(backendSeries.coverImageUrls)[0];
    if (firstUrl) {
      return firstUrl;
    }
  }

  if (backendSeries.metadata) {
    const metadata = backendSeries.metadata as Record<string, unknown>;
    const coverImage = metadata["coverImage"] as Record<string, unknown>;
    const extraLarge = coverImage["extraLarge"] as string;
    if (extraLarge) {
      return extraLarge;
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
