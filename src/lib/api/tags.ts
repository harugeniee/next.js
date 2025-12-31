import { http } from "@/lib/http";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseOffset,
} from "@/lib/types";

/**
 * Tag interfaces based on backend DTOs
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  usageCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metadata?: Record<string, unknown>;
}

export interface QueryTagsDto extends AdvancedQueryParams {
  isActive?: boolean;
  isFeatured?: boolean;
  category?: string;
  color?: string;
  minUsageCount?: number;
  maxUsageCount?: number;
  includeInactive?: boolean;
  includeUnused?: boolean;
}

export interface TagStatsDto {
  totalTags: number;
  activeTags: number;
  inactiveTags: number;
  featuredTags: number;
  popularTags: number;
  trendingTags: number;
  totalUsageCount: number;
  averageUsageCount: number;
  mostUsedTag: string;
  mostUsedTagCount: number;
  tagsByCategory: Record<string, number>;
  tagsByColor: Record<string, number>;
  recentTrends: Array<{ date: string; count: number }>;
}

/**
 * Tags API wrapper
 * Handles all tag-related API calls
 */
export class TagsAPI {
  private static readonly BASE_URL = "/tags";

  /**
   * Create a new tag
   */
  static async createTag(data: CreateTagDto): Promise<ApiResponse<Tag>> {
    const response = await http.post<ApiResponse<Tag>>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Get all tags with pagination and filtering
   */
  static async getTags(params?: QueryTagsDto): Promise<ApiResponseOffset<Tag>> {
    const response = await http.get<ApiResponseOffset<Tag>>(this.BASE_URL, {
      params,
    });
    return response.data;
  }

  /**
   * Get popular tags
   */
  static async getPopularTags(limit?: number): Promise<ApiResponse<Tag[]>> {
    const response = await http.get<ApiResponse<Tag[]>>(
      `${this.BASE_URL}/popular`,
      {
        params: limit ? { limit } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get trending tags
   */
  static async getTrendingTags(limit?: number): Promise<ApiResponse<Tag[]>> {
    const response = await http.get<ApiResponse<Tag[]>>(
      `${this.BASE_URL}/trending`,
      {
        params: limit ? { limit } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get featured tags
   */
  static async getFeaturedTags(limit?: number): Promise<ApiResponse<Tag[]>> {
    const response = await http.get<ApiResponse<Tag[]>>(
      `${this.BASE_URL}/featured`,
      {
        params: limit ? { limit } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get tag statistics
   */
  static async getTagStats(): Promise<ApiResponse<TagStatsDto>> {
    const response = await http.get<ApiResponse<TagStatsDto>>(
      `${this.BASE_URL}/stats`,
    );
    return response.data;
  }

  /**
   * Get tag suggestions based on content
   */
  static async getContentSuggestions(
    content: string,
  ): Promise<ApiResponse<Tag[]>> {
    const response = await http.get<ApiResponse<Tag[]>>(
      `${this.BASE_URL}/suggestions`,
      {
        params: { content },
      },
    );
    return response.data;
  }

  /**
   * Bulk create tags
   */
  static async bulkCreateTags(names: string[]): Promise<ApiResponse<Tag[]>> {
    const response = await http.get<ApiResponse<Tag[]>>(
      `${this.BASE_URL}/bulk-create`,
      {
        params: { names: names.join(",") },
      },
    );
    return response.data;
  }

  /**
   * Get a tag by ID
   */
  static async getTagById(tagId: string): Promise<ApiResponse<Tag>> {
    const response = await http.get<ApiResponse<Tag>>(
      `${this.BASE_URL}/${tagId}`,
    );
    return response.data;
  }

  /**
   * Get a tag by slug
   */
  static async getTagBySlug(slug: string): Promise<ApiResponse<Tag>> {
    const response = await http.get<ApiResponse<Tag>>(
      `${this.BASE_URL}/slug/${slug}`,
    );
    return response.data;
  }

  /**
   * Update a tag
   */
  static async updateTag(
    tagId: string,
    data: UpdateTagDto,
  ): Promise<ApiResponse<Tag>> {
    const response = await http.patch<ApiResponse<Tag>>(
      `${this.BASE_URL}/${tagId}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete a tag
   */
  static async deleteTag(tagId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${tagId}`,
    );
    return response.data;
  }

  /**
   * Update tag usage count
   */
  static async updateUsageCount(
    tagId: string,
    increment: number = 1,
  ): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>(
      `${this.BASE_URL}/${tagId}/usage`,
      { increment },
    );
    return response.data;
  }
}
