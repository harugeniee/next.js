import { http } from "../http";
import type { ApiResponse, ApiResponseOffset } from "../types";
import type { Media } from "../interface/media.interface";
import type { MediaListResponse } from "../types/media";

export type UploadedMedia = {
  id: string;
  url: string;
  name?: string;
  originalName?: string;
  mimeType: string;
  size: number;
  type?: string;
  metadata?: string; // JSON string for scramble metadata
};

/**
 * Scramble key response type for image unscrambling
 */
export type ScrambleKeyResponse = {
  permutationSeed: string; // base64url encoded seed
  tileRows: number;
  tileCols: number;
  version: number;
};

/**
 * Media API wrapper
 * All media must be uploaded via /v1/media with form-data field "files"
 * The API supports up to 3 files per request.
 */
export class MediaAPI {
  private static readonly BASE_URL = "/media";
  private static readonly MAX_FILES_PER_UPLOAD = 50;

  static async upload(
    files: File[],
    options?: {
      folder?: string;
      scramble?: boolean;
    },
  ): Promise<ApiResponse<UploadedMedia[]>> {
    if (!files || files.length === 0) {
      return {
        success: false,
        data: [] as UploadedMedia[],
        message: "No files provided",
        metadata: { messageKey: "no_files_provided", messageArgs: {} },
      };
    }
    if (files.length > this.MAX_FILES_PER_UPLOAD) {
      throw new Error(
        `You can upload at most ${this.MAX_FILES_PER_UPLOAD} files per request.`,
      );
    }

    const form = new FormData();
    // Backend expects field name "files" (plural) and can accept multiple files
    files.forEach((file) => {
      form.append("files", file);
    });

    // Build query parameters
    const params: Record<string, string> = {};
    if (options?.folder) {
      params.folder = options.folder;
    }
    if (options?.scramble !== undefined) {
      params.scramble = options.scramble.toString();
    }

    const response = await http.post<ApiResponse<UploadedMedia[]>>(
      this.BASE_URL,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params,
      },
    );
    return response.data;
  }

  /**
   * Get media list with query parameters
   * Supports admin query parameters for filtering and pagination
   */
  static async getMedia(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    type?: string;
    query?: string;
    sortBy?: string;
    order?: "ASC" | "DESC";
    mimeType?: string;
    status?: string;
    isPublic?: boolean;
  }): Promise<MediaListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.userId) queryParams.userId = params.userId;
      if (params?.type) queryParams.type = params.type;
      if (params?.query) queryParams.query = params.query;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.mimeType) queryParams.mimeType = params.mimeType;
      if (params?.status) queryParams.status = params.status;
      if (params?.isPublic !== undefined)
        queryParams.isPublic = params.isPublic;

      const response = await http.get<ApiResponseOffset<Media>>(
        this.BASE_URL,
        { params: queryParams },
      );

      const paginationData = response.data.data;
      return {
        result: paginationData.result,
        metaData: {
          total: paginationData.metaData.totalRecords ?? 0,
          page: paginationData.metaData.currentPage ?? 1,
          limit: paginationData.metaData.pageSize,
          totalPages: paginationData.metaData.totalPages ?? 1,
        },
      };
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  }

  /**
   * Get media by ID
   */
  static async getMediaById(
    mediaId: string,
  ): Promise<ApiResponse<UploadedMedia>> {
    const response = await http.get<ApiResponse<UploadedMedia>>(
      `${this.BASE_URL}/${mediaId}`,
    );
    return response.data;
  }

  /**
   * Update media
   * Supports updating name, description, altText, isPublic, tags, and metadata
   */
  static async updateMedia(
    mediaId: string,
    data: {
      name?: string;
      description?: string;
      altText?: string;
      isPublic?: boolean;
      tags?: string[] | string;
      metadata?: string | Record<string, unknown>;
    },
  ): Promise<ApiResponse<UploadedMedia>> {
    // Convert tags array to JSON string if needed
    const payload: Record<string, unknown> = { ...data };
    if (Array.isArray(data.tags)) {
      payload.tags = JSON.stringify(data.tags);
    }
    if (typeof data.metadata === "object" && data.metadata !== null) {
      payload.metadata = JSON.stringify(data.metadata);
    }

    const response = await http.put<ApiResponse<UploadedMedia>>(
      `${this.BASE_URL}/${mediaId}`,
      payload,
    );
    return response.data;
  }

  /**
   * Delete media
   */
  static async delete(mediaId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${mediaId}`,
    );
    return response.data;
  }

  /**
   * Activate media
   */
  static async activateMedia(
    mediaId: string,
  ): Promise<ApiResponse<UploadedMedia>> {
    const response = await http.post<ApiResponse<UploadedMedia>>(
      `${this.BASE_URL}/${mediaId}/activate`,
    );
    return response.data;
  }

  /**
   * Deactivate media
   */
  static async deactivateMedia(
    mediaId: string,
  ): Promise<ApiResponse<UploadedMedia>> {
    const response = await http.post<ApiResponse<UploadedMedia>>(
      `${this.BASE_URL}/${mediaId}/deactivate`,
    );
    return response.data;
  }

  /**
   * Generate presigned upload URL
   */
  static async generatePresignedUploadUrl(data: {
    filename: string;
    contentType: string;
    contentLength?: number;
  }): Promise<ApiResponse<{ uploadUrl: string; key: string }>> {
    const response = await http.post<
      ApiResponse<{ uploadUrl: string; key: string }>
    >(`${this.BASE_URL}/presigned-upload`, data);
    return response.data;
  }

  /**
   * Generate presigned download URL
   */
  static async generatePresignedDownloadUrl(
    mediaId: string,
    expiresIn?: number,
  ): Promise<ApiResponse<{ presignedUrl: string; expiresIn: number }>> {
    const params = expiresIn ? { expiresIn } : {};
    const response = await http.get<
      ApiResponse<{ presignedUrl: string; expiresIn: number }>
    >(`${this.BASE_URL}/${mediaId}/presigned-download`, { params });
    return response.data;
  }

  /**
   * Get media file metadata
   */
  static async getMediaMetadata(
    mediaId: string,
  ): Promise<ApiResponse<Record<string, unknown>>> {
    const response = await http.get<ApiResponse<Record<string, unknown>>>(
      `${this.BASE_URL}/${mediaId}/metadata`,
    );
    return response.data;
  }

  /**
   * Check if media file exists
   */
  static async checkMediaExists(
    mediaId: string,
  ): Promise<ApiResponse<{ exists: boolean }>> {
    const response = await http.get<ApiResponse<{ exists: boolean }>>(
      `${this.BASE_URL}/${mediaId}/exists`,
    );
    return response.data;
  }

  /**
   * Get user media (legacy endpoint)
   */
  static async getUserMedia(
    userId: string,
  ): Promise<ApiResponse<UploadedMedia[]>> {
    return this.getMedia({ userId });
  }

  /**
   * Fetch scramble key for unscrambling an image
   * Used for image scrambler feature to reconstruct original image from scrambled tiles
   */
  static async getScrambleKey(
    mediaId: string,
  ): Promise<ApiResponse<ScrambleKeyResponse>> {
    const response = await http.get<ApiResponse<ScrambleKeyResponse>>(
      `${this.BASE_URL}/${mediaId}/scramble-key`,
    );
    return response.data;
  }

  /**
   * Get media statistics for admin dashboard
   * Returns aggregated statistics about media files
   * Endpoint: /v1/media/stats/overview
   */
  static async getMediaStatistics(): Promise<
    ApiResponse<{
      totalMedia: number;
      totalActiveMedia: number;
      mediaByType: Record<string, number>;
      mediaByStatus: Record<string, number>;
      mediaByStorageProvider: Record<string, number>;
      publicMedia: number;
      privateMedia: number;
      totalStorageSize: number;
      averageFileSize: number;
      totalViews: number;
      totalDownloads: number;
      recentUploads: number;
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
      mostViewedMedia: Array<unknown>;
      mostDownloadedMedia: Array<unknown>;
    }>
  > {
    const response = await http.get<
      ApiResponse<{
        totalMedia: number;
        totalActiveMedia: number;
        mediaByType: Record<string, number>;
        mediaByStatus: Record<string, number>;
        mediaByStorageProvider: Record<string, number>;
        publicMedia: number;
        privateMedia: number;
        totalStorageSize: number;
        averageFileSize: number;
        totalViews: number;
        totalDownloads: number;
        recentUploads: number;
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
        mostViewedMedia: Array<unknown>;
        mostDownloadedMedia: Array<unknown>;
      }>
    >(`${this.BASE_URL}/stats/overview`);
    return response.data;
  }
}
