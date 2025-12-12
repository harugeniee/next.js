import { http } from "@/lib/http";
import type {
  CreateSegmentDto,
  SeriesSegment,
  UpdateSegmentDto,
} from "@/lib/interface/series.interface";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  QueryParamsWithCursor,
} from "@/lib/types";

/**
 * Query Segment DTO
 * Based on backend QuerySegmentDto
 */
export interface QuerySegmentDto extends AdvancedQueryParams {
  seriesId?: string;
  type?: string;
  userId?: string;
}

/**
 * Query Segment Cursor DTO
 * Based on backend QuerySegmentCursorDto
 */
export interface QuerySegmentCursorDto extends QueryParamsWithCursor {
  seriesId?: string;
  languageCode?: string;
  userId?: string;
}

/**
 * Segments API wrapper
 * Handles all segment-related API calls
 * All routes are at the top-level /segments path (not nested under /series)
 */
export class SegmentsAPI {
  private static readonly BASE_URL = "/segments";

  /**
   * Create a new segment for a series
   * Requires authentication
   * @param data Segment creation data (must include seriesId in body)
   */
  static async createSegment(data: CreateSegmentDto): Promise<SeriesSegment> {
    const response = await http.post<ApiResponse<SeriesSegment>>(
      this.BASE_URL,
      data,
    );
    return response.data.data;
  }

  /**
   * Get all segments with offset pagination
   * Supports filtering by seriesId and userId via query parameters
   * @param params Query parameters with filters and pagination
   */
  static async getSegments(
    params?: Partial<QuerySegmentDto>,
  ): Promise<ApiResponseOffset<SeriesSegment>> {
    const response = await http.get<ApiResponseOffset<SeriesSegment>>(
      this.BASE_URL,
      { params },
    );
    return response.data;
  }

  /**
   * Get all segments with cursor pagination
   * Better for real-time feeds and infinite scroll
   * Supports filtering by seriesId and userId via query parameters
   * @param params Cursor pagination parameters
   */
  static async getSegmentsCursor(
    params?: QuerySegmentCursorDto,
  ): Promise<ApiResponseCursor<SeriesSegment>> {
    const response = await http.get<ApiResponseCursor<SeriesSegment>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Get a segment by ID
   * @param segmentId Segment ID (Snowflake ID)
   */
  static async getSegmentById(segmentId: string): Promise<SeriesSegment> {
    const response = await http.get<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/${segmentId}`,
    );
    return response.data.data;
  }

  /**
   * Get a segment by number in a series
   * Useful for finding a specific episode/chapter in a series
   * @param number Segment number
   * @param seriesId Series ID (required query parameter)
   * @param subNumber Optional sub-number for .5 episodes/chapters
   */
  static async getSegmentByNumber(
    number: number,
    seriesId: string,
    subNumber?: number,
  ): Promise<SeriesSegment> {
    const params: Record<string, string> = {
      seriesId,
    };
    if (subNumber !== undefined) {
      params.subNumber = subNumber.toString();
    }
    const response = await http.get<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/number/${number}`,
      { params },
    );
    return response.data.data;
  }

  /**
   * Get the next segment in a series
   * Returns the segment that comes after the specified segment
   * @param number Current segment number
   * @param seriesId Series ID (required query parameter)
   * @param subNumber Optional current sub-number
   */
  static async getNextSegment(
    number: number,
    seriesId: string,
    subNumber?: number,
  ): Promise<SeriesSegment | null> {
    const params: Record<string, string> = {
      seriesId,
    };
    if (subNumber !== undefined) {
      params.subNumber = subNumber.toString();
    }
    const response = await http.get<ApiResponse<SeriesSegment | null>>(
      `${this.BASE_URL}/number/${number}/next`,
      { params },
    );
    return response.data.data;
  }

  /**
   * Get the previous segment in a series
   * Returns the segment that comes before the specified segment
   * @param number Current segment number
   * @param seriesId Series ID (required query parameter)
   * @param subNumber Optional current sub-number
   */
  static async getPreviousSegment(
    number: number,
    seriesId: string,
    subNumber?: number,
  ): Promise<SeriesSegment | null> {
    const params: Record<string, string> = {
      seriesId,
    };
    if (subNumber !== undefined) {
      params.subNumber = subNumber.toString();
    }
    const response = await http.get<ApiResponse<SeriesSegment | null>>(
      `${this.BASE_URL}/number/${number}/previous`,
      { params },
    );
    return response.data.data;
  }

  /**
   * Update a segment
   * Requires authentication
   * @param segmentId Segment ID (Snowflake ID)
   * @param data Segment update data
   */
  static async updateSegment(
    segmentId: string,
    data: UpdateSegmentDto,
  ): Promise<SeriesSegment> {
    const response = await http.patch<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/${segmentId}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete a segment (soft delete)
   * Requires authentication
   * @param segmentId Segment ID (Snowflake ID)
   */
  static async deleteSegment(segmentId: string): Promise<void> {
    await http.delete<ApiResponse<void>>(`${this.BASE_URL}/${segmentId}`);
  }
}
