import { http } from "../http";
import type { ApiResponse } from "../types";

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
   */
  static async getMedia(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    type?: string;
  }): Promise<ApiResponse<UploadedMedia[]>> {
    const response = await http.get<ApiResponse<UploadedMedia[]>>(
      this.BASE_URL,
      { params },
    );
    return response.data;
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
   */
  static async updateMedia(
    mediaId: string,
    data: {
      name?: string;
      metadata?: string;
    },
  ): Promise<ApiResponse<UploadedMedia>> {
    const response = await http.put<ApiResponse<UploadedMedia>>(
      `${this.BASE_URL}/${mediaId}`,
      data,
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
}
