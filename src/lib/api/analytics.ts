import { http } from "@/lib/http";
import type { ApiResponse } from "@/lib/types";

/**
 * Dashboard Query Parameters
 * Matches backend DashboardQueryDto structure
 */
export interface DashboardQueryParams {
  fromDate?: Date | string;
  toDate?: Date | string;
  granularity?: "hour" | "day" | "week" | "month";
  eventTypes?: string[];
  eventCategories?: string[];
  subjectTypes?: string[];
  userIds?: string[];
  includeAnonymous?: boolean;
  groupBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Analytics Query Parameters
 * Matches backend AnalyticsQueryDto structure
 */
export interface AnalyticsQueryParams {
  fromDate?: Date | string;
  toDate?: Date | string;
  eventType?: string;
  eventCategory?: string;
  subjectType?: string;
  granularity?: "hour" | "day" | "week" | "month";
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  userId?: string;
}

/**
 * Dashboard Overview Response
 * Matches backend DashboardOverviewResponseDto
 */
export interface DashboardOverviewResponse {
  totalEvents: number;
  uniqueUsers: number;
  eventTypes: Record<string, number>;
  eventCategories: Record<string, number>;
  subjectTypes: Record<string, number>;
  contentInteractions: number;
  socialInteractions: number;
  systemInteractions: number;
  engagementInteractions: number;
  timeSeries: Array<{ date: string; count: number }>;
  topUsers: Record<string, number>;
  topContent: Record<string, number>;
}

/**
 * Analytics Trends Response
 * Matches backend AnalyticsTrendsResponseDto
 */
export interface AnalyticsTrendsResponse {
  timeSeries: Array<{ date: string; count: number }>;
  totalEvents: number;
  uniqueUsers: number;
  granularity: string;
}

/**
 * Top Content Response
 * Matches backend TopContentResponseDto
 */
export interface TopContentResponse {
  topContent: Record<string, number>;
  contentInteractions: number;
  subjectTypes: Record<string, number>;
}

/**
 * User Engagement Response
 * Matches backend UserEngagementResponseDto
 */
export interface UserEngagementResponse {
  topUsers: Record<string, number>;
  uniqueUsers: number;
  socialInteractions: number;
  engagementInteractions: number;
  eventTypes: Record<string, number>;
}

/**
 * Platform Overview Response
 * Matches backend PlatformOverviewResponseDto
 */
export interface PlatformOverviewResponse {
  totalEvents: number;
  totalUsers: number;
  lastUpdated: Date | string;
}

/**
 * Analytics Event
 */
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventType: string;
  eventCategory: string;
  subjectType?: string;
  subjectId?: string;
  eventData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Analytics Events Response
 * Matches backend AnalyticsEventsResponseDto
 */
export interface AnalyticsEventsResponse {
  events: AnalyticsEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Analytics API wrapper
 * Handles all analytics-related API calls
 */
export class AnalyticsAPI {
  private static readonly BASE_URL = "/analytics";

  /**
   * Get dashboard overview analytics
   */
  static async getDashboardOverview(
    params?: DashboardQueryParams,
  ): Promise<DashboardOverviewResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.fromDate) {
        queryParams.fromDate =
          typeof params.fromDate === "string"
            ? params.fromDate
            : params.fromDate.toISOString();
      }
      if (params?.toDate) {
        queryParams.toDate =
          typeof params.toDate === "string"
            ? params.toDate
            : params.toDate.toISOString();
      }
      if (params?.granularity) {
        queryParams.granularity = params.granularity;
      }
      if (params?.eventTypes && params.eventTypes.length > 0) {
        queryParams.eventTypes = params.eventTypes;
      }
      if (params?.eventCategories && params.eventCategories.length > 0) {
        queryParams.eventCategories = params.eventCategories;
      }
      if (params?.subjectTypes && params.subjectTypes.length > 0) {
        queryParams.subjectTypes = params.subjectTypes;
      }
      if (params?.userIds && params.userIds.length > 0) {
        queryParams.userIds = params.userIds;
      }
      if (params?.includeAnonymous !== undefined) {
        queryParams.includeAnonymous = params.includeAnonymous;
      }
      if (params?.groupBy) {
        queryParams.groupBy = params.groupBy;
      }

      const response = await http.get<ApiResponse<DashboardOverviewResponse>>(
        `${this.BASE_URL}/dashboard/overview`,
        { params: queryParams },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch dashboard overview",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  }

  /**
   * Get analytics trends (time series data)
   */
  static async getAnalyticsTrends(
    params?: DashboardQueryParams,
  ): Promise<AnalyticsTrendsResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.fromDate) {
        queryParams.fromDate =
          typeof params.fromDate === "string"
            ? params.fromDate
            : params.fromDate.toISOString();
      }
      if (params?.toDate) {
        queryParams.toDate =
          typeof params.toDate === "string"
            ? params.toDate
            : params.toDate.toISOString();
      }
      if (params?.granularity) {
        queryParams.granularity = params.granularity;
      }
      if (params?.eventTypes && params.eventTypes.length > 0) {
        queryParams.eventTypes = params.eventTypes;
      }
      if (params?.eventCategories && params.eventCategories.length > 0) {
        queryParams.eventCategories = params.eventCategories;
      }
      if (params?.subjectTypes && params.subjectTypes.length > 0) {
        queryParams.subjectTypes = params.subjectTypes;
      }
      if (params?.userIds && params.userIds.length > 0) {
        queryParams.userIds = params.userIds;
      }

      const response = await http.get<ApiResponse<AnalyticsTrendsResponse>>(
        `${this.BASE_URL}/dashboard/trends`,
        { params: queryParams },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch analytics trends",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching analytics trends:", error);
      throw error;
    }
  }

  /**
   * Get top performing content
   */
  static async getTopContent(
    params?: DashboardQueryParams,
  ): Promise<TopContentResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.fromDate) {
        queryParams.fromDate =
          typeof params.fromDate === "string"
            ? params.fromDate
            : params.fromDate.toISOString();
      }
      if (params?.toDate) {
        queryParams.toDate =
          typeof params.toDate === "string"
            ? params.toDate
            : params.toDate.toISOString();
      }
      if (params?.eventTypes && params.eventTypes.length > 0) {
        queryParams.eventTypes = params.eventTypes;
      }
      if (params?.eventCategories && params.eventCategories.length > 0) {
        queryParams.eventCategories = params.eventCategories;
      }
      if (params?.subjectTypes && params.subjectTypes.length > 0) {
        queryParams.subjectTypes = params.subjectTypes;
      }

      const response = await http.get<ApiResponse<TopContentResponse>>(
        `${this.BASE_URL}/dashboard/top-content`,
        { params: queryParams },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch top content");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching top content:", error);
      throw error;
    }
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagement(
    params?: DashboardQueryParams,
  ): Promise<UserEngagementResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.fromDate) {
        queryParams.fromDate =
          typeof params.fromDate === "string"
            ? params.fromDate
            : params.fromDate.toISOString();
      }
      if (params?.toDate) {
        queryParams.toDate =
          typeof params.toDate === "string"
            ? params.toDate
            : params.toDate.toISOString();
      }
      if (params?.eventTypes && params.eventTypes.length > 0) {
        queryParams.eventTypes = params.eventTypes;
      }
      if (params?.eventCategories && params.eventCategories.length > 0) {
        queryParams.eventCategories = params.eventCategories;
      }
      if (params?.subjectTypes && params.subjectTypes.length > 0) {
        queryParams.subjectTypes = params.subjectTypes;
      }
      if (params?.userIds && params.userIds.length > 0) {
        queryParams.userIds = params.userIds;
      }

      const response = await http.get<ApiResponse<UserEngagementResponse>>(
        `${this.BASE_URL}/dashboard/user-engagement`,
        { params: queryParams },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch user engagement",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user engagement:", error);
      throw error;
    }
  }

  /**
   * Get platform overview statistics
   */
  static async getPlatformOverview(): Promise<PlatformOverviewResponse> {
    try {
      const response = await http.get<ApiResponse<PlatformOverviewResponse>>(
        `${this.BASE_URL}/platform/overview`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch platform overview",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching platform overview:", error);
      throw error;
    }
  }

  /**
   * Get analytics events with pagination
   */
  static async getAnalyticsEvents(
    params?: AnalyticsQueryParams,
  ): Promise<AnalyticsEventsResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.fromDate) {
        queryParams.fromDate =
          typeof params.fromDate === "string"
            ? params.fromDate
            : params.fromDate.toISOString();
      }
      if (params?.toDate) {
        queryParams.toDate =
          typeof params.toDate === "string"
            ? params.toDate
            : params.toDate.toISOString();
      }
      if (params?.eventType) {
        queryParams.eventType = params.eventType;
      }
      if (params?.eventCategory) {
        queryParams.eventCategory = params.eventCategory;
      }
      if (params?.subjectType) {
        queryParams.subjectType = params.subjectType;
      }
      if (params?.granularity) {
        queryParams.granularity = params.granularity;
      }
      if (params?.page) {
        queryParams.page = params.page;
      }
      if (params?.limit) {
        queryParams.limit = params.limit;
      }
      if (params?.sortBy) {
        queryParams.sortBy = params.sortBy;
      }
      if (params?.order) {
        queryParams.order = params.order;
      }
      if (params?.userId) {
        queryParams.userId = params.userId;
      }

      const response = await http.get<ApiResponse<AnalyticsEventsResponse>>(
        `${this.BASE_URL}/events`,
        { params: queryParams },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch analytics events",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching analytics events:", error);
      throw error;
    }
  }
}
