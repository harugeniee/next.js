/**
 * Media Admin TypeScript Types
 * Matches backend DTOs and entities for admin media management
 */

import type { Media } from "@/lib/interface/media.interface";

/**
 * Get Media DTO (Query Parameters)
 * Matches backend GetMediaDto for filtering and pagination
 */
export interface GetMediaDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  query?: string;
  userId?: string;
  type?: string;
  mimeType?: string;
  status?: string;
  isPublic?: boolean;
}

/**
 * Update Media DTO
 * Matches backend UpdateMediaDto (all fields optional)
 */
export interface UpdateMediaDto {
  name?: string;
  description?: string;
  altText?: string;
  isPublic?: boolean;
  tags?: string[] | string; // Can be array or JSON string
  metadata?: string | Record<string, unknown>;
}

/**
 * Media List Response with Pagination
 */
export interface MediaListResponse {
  result: Media[];
  metaData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Media Statistics Response
 * Matches backend /v1/media/stats/overview response
 */
export interface MediaStatistics {
  totalMedia: number;
  totalActiveMedia: number;
  mediaByType: Record<string, number>;
  mediaByStatus: Record<string, number>;
  mediaByStorageProvider: Record<string, number>;
  publicMedia: number;
  privateMedia: number;
  totalStorageSize: number; // Total size in bytes
  averageFileSize: number; // Average file size in bytes
  totalViews: number;
  totalDownloads: number;
  recentUploads: number; // Uploads in last 24 hours
  scrambledImages: number;
  mediaByMimeType: Array<{
    mimeType: string;
    count: number;
  }>;
  topUploaders: Array<{
    userId: string;
    username: string;
    count: number;
  }>;
  mostViewedMedia: Array<unknown>; // Array of media items
  mostDownloadedMedia: Array<unknown>; // Array of media items
}

