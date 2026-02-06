import { http } from "@/lib/http";
import type { ApiResponse, QueryParamsWithCursor } from "@/lib/types";

/**
 * Follow interfaces based on backend DTOs
 */
export interface FollowUser {
  userId: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  score?: number;
  reason?: string;
  isVerified?: boolean;
  mutualCount?: number;
  /** Whether the current user is following this user (when in list context) */
  isFollowing?: boolean;
}

export interface FollowingListDto {
  users: FollowUser[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}

export interface FollowersListDto {
  users: FollowUser[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}

export interface MutualFriendsListDto {
  users: FollowUser[];
  hasMore: boolean;
  total: number;
}

export interface FollowSuggestionsListDto {
  suggestions: FollowUser[];
  hasMore: boolean;
  algorithm: string;
}

export interface FollowStatusDto {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isMutual: boolean;
}

export interface FollowCountersDto {
  following: number;
  followers: number;
  mutual: number;
}

export interface BitsetExportDto {
  data: string; // Base64 encoded bitset
  count: number;
  type: "following" | "followers";
}

export interface BitsetImportDto {
  data: string; // Base64 encoded bitset
  type: "following" | "followers";
  replace?: boolean;
}

export interface RebuildDto {
  force?: boolean;
}

export interface PaginationDto extends Omit<QueryParamsWithCursor, "limit"> {
  limit?: number;
}

export interface FollowSuggestionsDto {
  limit?: number;
  algorithm?: string;
  includeMutualCount?: boolean;
}

export interface MutualFriendsDto {
  userA: string;
  userB: string;
  limit?: number;
}

export interface NewsFeedItem {
  id: string;
  type: string;
  content: unknown;
  createdAt: string;
}

export interface NewsFeedResponse {
  items: NewsFeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Follow API wrapper
 * Handles all follow-related API calls
 */
export class FollowAPI {
  private static readonly BASE_URL = "/follow";

  /**
   * Follow a user
   */
  static async followUser(
    targetUserId: string,
  ): Promise<
    ApiResponse<{ success: boolean; status: string; message: string }>
  > {
    const response = await http.post<
      ApiResponse<{ success: boolean; status: string; message: string }>
    >(`${this.BASE_URL}/${targetUserId}`);
    return response.data;
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(
    targetUserId: string,
  ): Promise<
    ApiResponse<{ success: boolean; status: string; message: string }>
  > {
    const response = await http.delete<
      ApiResponse<{ success: boolean; status: string; message: string }>
    >(`${this.BASE_URL}/${targetUserId}`);
    return response.data;
  }

  /**
   * Get following list for a user
   */
  static async getFollowing(
    userId: string,
    params?: PaginationDto,
  ): Promise<ApiResponse<FollowingListDto>> {
    const response = await http.get<ApiResponse<FollowingListDto>>(
      `${this.BASE_URL}/${userId}/following`,
      { params },
    );
    return response.data;
  }

  /**
   * Get followers list for a user
   */
  static async getFollowers(
    userId: string,
    params?: PaginationDto,
  ): Promise<ApiResponse<FollowersListDto>> {
    const response = await http.get<ApiResponse<FollowersListDto>>(
      `${this.BASE_URL}/${userId}/followers`,
      { params },
    );
    return response.data;
  }

  /**
   * Get mutual friends between two users
   */
  static async getMutualFriends(
    params: MutualFriendsDto,
  ): Promise<ApiResponse<MutualFriendsListDto>> {
    const response = await http.get<ApiResponse<MutualFriendsListDto>>(
      `${this.BASE_URL}/mutuals`,
      { params },
    );
    return response.data;
  }

  /**
   * Get follow suggestions for a user
   */
  static async getSuggestions(
    userId: string,
    params?: FollowSuggestionsDto,
  ): Promise<ApiResponse<FollowSuggestionsListDto>> {
    const response = await http.get<ApiResponse<FollowSuggestionsListDto>>(
      `${this.BASE_URL}/${userId}/suggestions`,
      { params },
    );
    return response.data;
  }

  /**
   * Get follow status between two users
   */
  static async getFollowStatus(
    followerId: string,
    followeeId: string,
  ): Promise<ApiResponse<FollowStatusDto>> {
    const response = await http.get<ApiResponse<FollowStatusDto>>(
      `${this.BASE_URL}/status`,
      {
        params: { followerId, followeeId },
      },
    );
    return response.data;
  }

  /**
   * Get follow counters for a user
   */
  static async getCounters(
    userId: string,
  ): Promise<ApiResponse<FollowCountersDto>> {
    const response = await http.get<ApiResponse<FollowCountersDto>>(
      `${this.BASE_URL}/${userId}/counters`,
    );
    return response.data;
  }

  /**
   * Export bitset data
   */
  static async exportBitset(
    userId: string,
    type: "following" | "followers",
  ): Promise<ApiResponse<BitsetExportDto>> {
    const response = await http.post<ApiResponse<BitsetExportDto>>(
      `${this.BASE_URL}/${userId}/export`,
      null,
      {
        params: { type },
      },
    );
    return response.data;
  }

  /**
   * Import bitset data
   */
  static async importBitset(
    userId: string,
    data: BitsetImportDto,
  ): Promise<
    ApiResponse<{ success: boolean; count: number; message: string }>
  > {
    const response = await http.post<
      ApiResponse<{ success: boolean; count: number; message: string }>
    >(`${this.BASE_URL}/${userId}/import`, data);
    return response.data;
  }

  /**
   * Rebuild bitset from edges
   */
  static async rebuildBitset(
    userId: string,
    data?: RebuildDto,
  ): Promise<
    ApiResponse<{ success: boolean; count: number; message: string }>
  > {
    const response = await http.post<
      ApiResponse<{ success: boolean; count: number; message: string }>
    >(`${this.BASE_URL}/${userId}/rebuild`, data);
    return response.data;
  }

  /**
   * Get news feed for a user
   */
  static async getNewsFeed(
    userId: string,
    params?: PaginationDto,
  ): Promise<ApiResponse<NewsFeedResponse>> {
    const response = await http.get<ApiResponse<NewsFeedResponse>>(
      `${this.BASE_URL}/${userId}/feed`,
      { params },
    );
    return response.data;
  }

  /**
   * Get trending content
   */
  static async getTrendingContent(
    limit?: number,
  ): Promise<ApiResponse<NewsFeedItem[]>> {
    const response = await http.get<ApiResponse<NewsFeedItem[]>>(
      `${this.BASE_URL}/trending`,
      {
        params: limit ? { limit } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get content recommendations
   */
  static async getContentRecommendations(
    userId: string,
    limit?: number,
  ): Promise<ApiResponse<NewsFeedItem[]>> {
    const response = await http.get<ApiResponse<NewsFeedItem[]>>(
      `${this.BASE_URL}/${userId}/recommendations`,
      {
        params: limit ? { limit } : undefined,
      },
    );
    return response.data;
  }

  /**
   * Get feed statistics
   */
  static async getFeedStats(
    userId: string,
  ): Promise<ApiResponse<{ totalItems: number; unreadItems: number }>> {
    const response = await http.get<
      ApiResponse<{ totalItems: number; unreadItems: number }>
    >(`${this.BASE_URL}/${userId}/feed/stats`);
    return response.data;
  }
}
