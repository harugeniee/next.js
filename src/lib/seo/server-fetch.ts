/**
 * Server-side fetch utility for SEO metadata generation
 *
 * This module provides fetch functions that run on the server during
 * generateMetadata execution. It uses native fetch() instead of the
 * client-side axios instance because:
 * 1. Server components cannot use client-side interceptors
 * 2. No authentication is needed for public SEO data
 * 3. Next.js fetch has built-in caching and revalidation
 */

import type { BackendSeries } from "@/lib/interface/series.interface";
import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions {
  /** Cache revalidation time in seconds. Use `false` for no caching */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation */
  tags?: string[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

interface PaginatedResponse<T> {
  result: T[];
  metaData: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Server-side fetch with error handling
 * Returns null on error instead of throwing (safe for metadata generation)
 */
export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T | null> {
  // Skip fetch if API URL is not configured (e.g., during build)
  if (!API_BASE_URL) {
    console.warn(
      `[SEO Fetch] NEXT_PUBLIC_API_URL not configured, skipping fetch for ${endpoint}`,
    );
    return null;
  }

  const { revalidate = SEO_CONSTANTS.CACHE.METADATA, tags } = options;

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      next: {
        revalidate,
        tags,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `[SEO Fetch] Failed to fetch ${endpoint}: ${response.status}`,
      );
      return null;
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    console.warn(`[SEO Fetch] Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch series data for SEO metadata generation
 * Used by generateMetadata in series detail page
 */
export async function fetchSeriesForSEO(
  seriesId: string,
): Promise<BackendSeries | null> {
  return serverFetch<BackendSeries>(`/series/${seriesId}`, {
    revalidate: SEO_CONSTANTS.CACHE.METADATA,
    tags: [`series-${seriesId}`, "series"],
  });
}

/**
 * Fetch series list for sitemap generation
 * Returns up to `limit` series sorted by updatedAt
 */
export async function fetchSeriesListForSitemap(
  limit: number = 1000,
): Promise<PaginatedResponse<BackendSeries> | null> {
  return serverFetch<PaginatedResponse<BackendSeries>>(
    `/series?limit=${limit}&sortBy=updatedAt&order=DESC`,
    {
      revalidate: SEO_CONSTANTS.CACHE.SITEMAP,
      tags: ["sitemap", "series-list"],
    },
  );
}
