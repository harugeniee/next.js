/**
 * JSON-LD Schema Generator for Series
 *
 * Generates structured data for search engines to display rich results.
 * Uses schema.org vocabulary for anime (TVSeries) and manga (ComicSeries).
 */

import type { BackendSeries } from "@/lib/interface/series.interface";
import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replaceAll(/<[^>]*>/g, "");
}

/**
 * Get the preferred title from a series
 */
function getSeriesTitle(series: BackendSeries): string {
  return (
    series.title?.userPreferred ||
    series.title?.english ||
    series.title?.romaji ||
    series.title?.native ||
    "Untitled"
  );
}

/**
 * Get cover image URL from series
 */
function getSeriesCoverUrl(series: BackendSeries): string | undefined {
  return (
    series.coverImage?.url ||
    series.coverImageUrls?.large ||
    series.coverImageUrls?.medium
  );
}

/**
 * Get alternative names for the series
 */
function getAlternativeNames(series: BackendSeries, title: string): string[] {
  return [
    series.title?.romaji,
    series.title?.english,
    series.title?.native,
    ...(series.synonyms || []),
  ]
    .filter(Boolean)
    .filter((n) => n !== title) as string[];
}

/**
 * Get authors from series author roles
 */
function getAuthors(
  series: BackendSeries,
): Array<{ "@type": string; name: string }> {
  if (!series.authorRoles || series.authorRoles.length === 0) {
    return [];
  }
  return series.authorRoles
    .filter((ar) => ar.author?.name)
    .map((ar) => ({
      "@type": "Person",
      name: ar.author!.name,
    }));
}

/**
 * Get genre names from series
 */
function getGenreNames(series: BackendSeries): string[] {
  if (!series.genres || series.genres.length === 0) {
    return [];
  }
  return series.genres.map((g) => g.genre?.name).filter(Boolean) as string[];
}

/**
 * Get aggregate rating object if score is available
 */
function getAggregateRating(
  series: BackendSeries,
): Record<string, unknown> | null {
  if (!series.averageScore || series.averageScore <= 0) {
    return null;
  }
  return {
    "@type": "AggregateRating",
    ratingValue: (series.averageScore / 10).toFixed(1),
    bestRating: "10",
    worstRating: "0",
    ratingCount: series.popularity || 1,
  };
}

/**
 * Get formatted publication date from series start date
 */
function getDatePublished(series: BackendSeries): string | null {
  if (!series.startDate) {
    return null;
  }
  const startDate = new Date(series.startDate);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }
  return startDate.toISOString().split("T")[0];
}

/**
 * Generate JSON-LD structured data for a series
 *
 * @param series - The series data from the backend
 * @param seriesId - The series ID for canonical URL
 * @returns JSON-LD object ready for injection
 */
export function generateSeriesJsonLd(
  series: BackendSeries,
  seriesId: string,
): Record<string, unknown> {
  const title = getSeriesTitle(series);
  const coverUrl = getSeriesCoverUrl(series);
  const canonicalUrl = `${SEO_CONSTANTS.SITE_URL}/series/${seriesId}`;
  const schemaType = series.type === "ANIME" ? "TVSeries" : "ComicSeries";

  // Base JSON-LD object
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    url: canonicalUrl,
    inLanguage: series.countryOfOrigin === "JP" ? "ja" : "en",
  };

  // Add optional fields using helper functions
  if (series.description) {
    jsonLd.description = stripHtml(series.description).substring(0, 500);
  }

  if (coverUrl) {
    jsonLd.image = coverUrl;
  }

  const alternativeNames = getAlternativeNames(series, title);
  if (alternativeNames.length > 0) {
    jsonLd.alternateName = alternativeNames;
  }

  const authors = getAuthors(series);
  if (authors.length > 0) {
    jsonLd.author = authors;
  }

  const genreNames = getGenreNames(series);
  if (genreNames.length > 0) {
    jsonLd.genre = genreNames;
  }

  const aggregateRating = getAggregateRating(series);
  if (aggregateRating) {
    jsonLd.aggregateRating = aggregateRating;
  }

  const datePublished = getDatePublished(series);
  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  // Add type-specific fields
  if (series.type === "ANIME" && series.episodes) {
    jsonLd.numberOfEpisodes = series.episodes;
  }

  if (series.type === "MANGA" && series.chapters) {
    jsonLd.numberOfIssues = series.chapters;
  }

  if (series.isNsfw) {
    jsonLd.contentRating = "Mature";
  }

  return jsonLd;
}
