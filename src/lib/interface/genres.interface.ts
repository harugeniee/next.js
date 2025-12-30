import type { BaseEntityCustom } from "@/lib/interface/base.interface";
import type { PaginationOffset } from "@/lib/types/response";

/**
 * BackendGenre Interface
 * Represents a genre entity received from the backend.
 * Matches the Genre entity structure in the backend.
 */
export interface BackendGenre extends BaseEntityCustom {
  /** URL-friendly unique identifier */
  slug: string;

  /** Display name of the genre */
  name: string;

  /** Detailed description of the genre */
  description?: string;

  /** Icon identifier or URL for the genre */
  icon?: string;

  /** Color code for the genre (hex, RGB, or color name) */
  color?: string;

  /** Sort order for displaying genres in lists */
  sortOrder?: number;

  /** NSFW content flag */
  isNsfw?: boolean;

  /** Additional metadata for the genre */
  metadata?: Record<string, unknown>;

  /** Number of series associated with this genre */
  seriesCount?: number;
}

/**
 * CreateGenreDto Interface
 * Data transfer object for creating a new genre.
 * Matches the CreateGenreDto from the backend.
 */
export interface CreateGenreDto {
  /** URL-friendly unique identifier (required) */
  slug: string;

  /** Display name of the genre (required) */
  name: string;

  /** Detailed description of the genre (optional) */
  description?: string;

  /** Icon identifier or URL for the genre (optional) */
  icon?: string;

  /** Color code for the genre (optional) */
  color?: string;

  /** Sort order for displaying genres (optional) */
  sortOrder?: number;

  /** NSFW content flag (optional) */
  isNsfw?: boolean;

  /** Additional metadata (optional) */
  metadata?: Record<string, unknown>;
}

/**
 * UpdateGenreDto Interface
 * Data transfer object for updating an existing genre.
 * All fields are optional since updates can be partial.
 * Matches the UpdateGenreDto from the backend.
 */
export interface UpdateGenreDto {
  /** URL-friendly unique identifier (optional) */
  slug?: string;

  /** Display name of the genre (optional) */
  name?: string;

  /** Detailed description of the genre (optional) */
  description?: string;

  /** Icon identifier or URL for the genre (optional) */
  icon?: string;

  /** Color code for the genre (optional) */
  color?: string;

  /** Sort order for displaying genres (optional) */
  sortOrder?: number;

  /** NSFW content flag (optional) */
  isNsfw?: boolean;

  /** Additional metadata (optional) */
  metadata?: Record<string, unknown>;
}

/**
 * QueryGenreDto Interface
 * Data transfer object for querying genres with filters and pagination.
 * Extends the base pagination interface with genre-specific filters.
 * Matches the QueryGenreDto from the backend.
 */
export interface QueryGenreDto {
  /** Page number for offset pagination (default: 1) */
  page?: number;

  /** Number of items per page (default: 20) */
  limit?: number;

  /** Sort field (default: 'createdAt') */
  sortBy?: string;

  /** Sort order (default: 'DESC') */
  order?: "ASC" | "DESC";

  /** Filter by genre slug (exact match) */
  slug?: string;

  /** Filter by genre name (partial match) */
  name?: string;

  /** Filter by NSFW flag */
  isNsfw?: boolean;

  /** Filter by icon presence */
  hasIcon?: boolean;

  /** Filter by color presence */
  hasColor?: boolean;
}

/**
 * Genres API Response Types
 * Type aliases for API responses using the backend pagination structure.
 */
export type GenresListResponse = PaginationOffset<BackendGenre>;
export type GenreResponse = BackendGenre;
