/**
 * Metadata Generators for SEO
 *
 * These functions generate Next.js Metadata objects for different page types.
 * Used by generateMetadata functions in server components.
 */

import type { Metadata } from "next";
import type { BackendSeries } from "@/lib/interface/series.interface";
import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";
import { getBestCoverImageUrl } from "@/lib/utils/series-utils";

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replaceAll(/<[^>]*>/g, "");
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
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
    "Untitled Series"
  );
}

/**
 * Get cover image URL from series
 * Handles both AniList format (large, medium, extraLarge) and MAL format (jpg, webp, jpg_large, etc.)
 */
function getSeriesCoverUrl(series: BackendSeries): string | undefined {
  return series.coverImage?.url || getBestCoverImageUrl(series.coverImageUrls);
}

/**
 * Generate metadata for series detail page
 */
export function generateSeriesMetadata(
  series: BackendSeries | null,
  seriesId: string,
): Metadata {
  // Fallback metadata if series not found
  if (!series) {
    return {
      title: "Series Not Found",
      description: "The requested series could not be found.",
    };
  }

  const title = getSeriesTitle(series);
  const coverUrl = getSeriesCoverUrl(series);
  const canonicalUrl = `${SEO_CONSTANTS.SITE_URL}/series/${seriesId}`;

  // Clean and truncate description
  const rawDescription = series.description || "";
  const cleanDescription = stripHtml(rawDescription);
  const description = cleanDescription
    ? truncate(cleanDescription, 160)
    : `Read ${title} on ${SEO_CONSTANTS.SITE_NAME}`;

  // Extract genres and tags for keywords
  const genres = series.genres?.map((g) => g.genre?.name).filter(Boolean) || [];
  const tags = series.tags?.map((t) => t.name).filter(Boolean) || [];
  const keywords = [...genres, ...tags, title, series.type || "manga"].join(
    ", ",
  );

  // Extract authors
  const authors =
    series.authorRoles
      ?.filter((ar) => ar.author?.name)
      .map((ar) => ({ name: ar.author!.name })) || [];

  return {
    title,
    description,
    keywords,
    authors: authors.length > 0 ? authors : undefined,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      images: coverUrl
        ? [
            {
              url: coverUrl,
              width: 460,
              height: 690,
              alt: title,
            },
          ]
        : [],
      type: "website",
      locale: SEO_CONSTANTS.DEFAULT_LOCALE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
      site: SEO_CONSTANTS.TWITTER_HANDLE,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for series list/latest page
 */
export function generateSeriesListMetadata(
  pageTitle: string,
  pageDescription: string,
  path: string,
): Metadata {
  const canonicalUrl = `${SEO_CONSTANTS.SITE_URL}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: "website",
      locale: SEO_CONSTANTS.DEFAULT_LOCALE,
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription,
      site: SEO_CONSTANTS.TWITTER_HANDLE,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
