/**
 * Series-related TypeScript interfaces
 * Defines types for series data structures used throughout the application
 */

/**
 * Supported language codes for series
 */
export type SeriesLanguage = "ja" | "en" | "vi" | "zh" | "ko" | "pt" | "fr";

/**
 * Series title structure from backend
 * Based on AniList API MediaTitle object
 */
export interface SeriesTitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

/**
 * Series chapter information
 */
export interface SeriesChapter {
  number: string;
  title: string;
  language: string;
  url: string;
}

/**
 * Scanlation group information
 */
export interface ScanlationGroup {
  id: string;
  name: string;
  url: string;
}

/**
 * Additional link for series (e.g., official website, social media)
 */
export interface SeriesLink {
  label: string;
  url: string;
}

/**
 * Media entity (for cover/banner images)
 */
export interface SeriesMedia {
  id: string;
  url: string;
  type?: string;
}

/**
 * Genre information
 */
export interface SeriesGenre {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Author information
 */
export interface SeriesAuthor {
  id: string;
  name: string;
}

/**
 * Tag information
 */
export interface SeriesTag {
  id: string;
  name: string;
  slug: string;
}

/**
 * Backend Series Entity (full structure from API)
 * Matches backend/src/series/entities/series.entity.ts
 */
export interface BackendSeries {
  id: string;
  myAnimeListId?: string;
  aniListId?: string;
  title?: SeriesTitle;
  type: string; // ANIME or MANGA
  format?: string;
  status?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  season?: string;
  seasonYear?: number;
  seasonInt?: number;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  countryOfOrigin?: string;
  isLicensed?: boolean;
  source?: string;
  coverImageUrls?: Record<string, string>;
  coverImageId?: string;
  coverImage?: SeriesMedia;
  bannerImageUrl?: string;
  bannerImageId?: string;
  bannerImage?: SeriesMedia;
  genres?: Array<{
    id: string;
    sortOrder?: number;
    isPrimary?: boolean;
    genre?: SeriesGenre;
  }>;
  tags?: SeriesTag[];
  synonyms?: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favoriteCount?: number;
  isLocked?: boolean;
  trending?: number;
  isNsfw?: boolean;
  autoCreateForumThread?: boolean;
  isRecommendationBlocked?: boolean;
  isReviewBlocked?: boolean;
  notes?: string;
  releasingStatus?: string;
  externalLinks?: Record<string, string>;
  streamingEpisodes?: Record<string, string>;
  metadata?: Record<string, unknown>;
  authorRoles?: Array<{
    id: string;
    role?: string;
    isMain?: boolean;
    author?: SeriesAuthor;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Frontend Series interface (simplified for UI)
 * Used in components and homepage
 */
export interface Series {
  id: string;
  title: string; // Extracted from title.userPreferred or title.romaji
  coverUrl: string; // Extracted from coverImage.url or coverImageUrls
  bannerUrl?: string; // Extracted from bannerImage.url or bannerImageUrl
  language: SeriesLanguage; // Extracted from countryOfOrigin or default
  tags: string[]; // Extracted from tags array
  description: string;
  author: string; // Extracted from authorRoles
  additionalLinks?: SeriesLink[]; // Extracted from externalLinks
  chapter?: SeriesChapter;
  groups?: ScanlationGroup[];
  timestamp?: Date;
  // Additional fields from backend
  type?: string; // ANIME or MANGA
  format?: string;
  status?: string;
  source?: string; // Source material (Manga, Light Novel, etc.)
  startDate?: Date | string; // Start date of the series
  episodes?: number; // Number of episodes (for anime)
  genres?: string[]; // Genres extracted from genres array
  averageScore?: number;
  popularity?: number;
  trending?: number;
  isNsfw?: boolean;
  isLicensed?: boolean;
  season?: string;
  seasonYear?: number;
}

/**
 * Latest update item interface
 * Used for the "Latest Updates" section
 * timestamp can be Date object or ISO date string
 */
export interface LatestUpdateItem {
  id: string;
  title: string;
  coverUrl: string;
  chapter: SeriesChapter;
  groups: ScanlationGroup[];
  timestamp: Date | string;
  commentCount?: number;
  isNsfw?: boolean;
  genres?: string[];
  tags?: string[];
}

/**
 * Popular series interface
 * Extends base Series with popularity metrics
 */
export interface PopularSeries extends Series {
  views?: number;
  likes?: number;
  rating?: number;
}

/**
 * Series Segment (Chapter/Episode) interface
 * Based on backend/src/series/entities/segments.entity.ts
 */
export interface SeriesSegment {
  id: string;
  seriesId: string;
  type: "trailer" | "episode" | "chapter";
  number: number;
  subNumber?: number;
  title?: string;
  description?: string;
  slug?: string;
  summary?: string;
  durationSec?: number;
  pageCount?: number;
  startPage?: number;
  endPage?: number;
  status: "active" | "inactive" | "pending" | "archived";
  publishedAt?: Date | string;
  originalReleaseDate?: Date | string;
  accessType: "free" | "paid" | "subscription" | "membership";
  languageCode?: string;
  isNsfw: boolean;
  metadata?: Record<string, unknown>;
  media?: Array<{
    id: string;
    url: string;
    type?: string;
    mimeType?: string;
    name?: string;
  }>;
  attachments?: Array<{
    id: string;
    url: string;
    type?: string;
    mimeType?: string;
    name?: string;
  }>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: {
    id: string;
    name?: string;
    username?: string;
    email?: string;
  };
  /**
   * Series information included in segment response
   * This is populated when fetching user segments to avoid additional API calls
   */
  series?: Partial<BackendSeries>;
}

/**
 * Create Segment DTO
 * Based on backend/src/series/dto/create-segment.dto.ts
 * Note: seriesId is passed via URL param, but can also be included in body
 * Note: userId is optional and will be set automatically from authenticated user
 */
export interface CreateSegmentDto {
  seriesId?: string; // Optional - can be set from URL param
  attachments?: Record<string, unknown>[]; // Array of media IDs to attach to the segment
  userId?: string; // Optional - set automatically from authenticated user
  organizationId?: string; // Optional - for organization-owned content
  type: "trailer" | "episode" | "chapter";
  number: number;
  subNumber?: number;
  title?: string;
  description?: string;
  slug?: string;
  summary?: string;
  durationSec?: number;
  pageCount?: number;
  startPage?: number;
  endPage?: number;
  status?: "active" | "inactive" | "pending" | "archived";
  publishedAt?: Date | string;
  originalReleaseDate?: Date | string;
  accessType?: "free" | "paid" | "subscription" | "membership";
  languageCode?: string;
  isNsfw?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Update Segment DTO
 */
export type UpdateSegmentDto = Partial<Omit<CreateSegmentDto, "seriesId">>;
