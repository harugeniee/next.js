import { http } from "@/lib/http";
import type { ApiResponse, ApiResponseOffset } from "@/lib/types";
import type {
  AssignBadgeDto,
  Badge,
  BadgeAssignment,
  BadgeAssignmentListResponse,
  BadgeListResponse,
  BadgeStatistics,
  CreateBadgeDto,
  GetBadgeAssignmentDto,
  GetBadgeDto,
  RevokeBadgeDto,
  UpdateBadgeDto,
} from "@/lib/types/badges";

/**
 * Badges API wrapper
 * Handles all badge-related API calls
 */
export class BadgesAPI {
  private static readonly BASE_URL = "/badges";

  /**
   * Create a new badge
   */
  static async createBadge(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    try {
      const response = await http.post<ApiResponse<Badge>>(
        this.BASE_URL,
        createBadgeDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create badge");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating badge:", error);
      throw error;
    }
  }

  /**
   * Get all badges with optional filters
   */
  static async getBadges(params?: GetBadgeDto): Promise<BadgeListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.fields && params.fields.length > 0) {
        queryParams.fields = params.fields;
      }
      if (params?.types && params.types.length > 0) {
        queryParams.types = params.types;
      }
      if (params?.categories && params.categories.length > 0) {
        queryParams.categories = params.categories;
      }
      if (params?.rarities && params.rarities.length > 0) {
        queryParams.rarities = params.rarities;
      }
      if (params?.statuses && params.statuses.length > 0) {
        queryParams.statuses = params.statuses;
      }
      if (params?.isVisible !== undefined) {
        queryParams.isVisible = params.isVisible;
      }
      if (params?.isObtainable !== undefined) {
        queryParams.isObtainable = params.isObtainable;
      }
      if (params?.isAutoAssigned !== undefined) {
        queryParams.isAutoAssigned = params.isAutoAssigned;
      }
      if (params?.isManuallyAssignable !== undefined) {
        queryParams.isManuallyAssignable = params.isManuallyAssignable;
      }

      const response = await http.get<ApiResponseOffset<Badge>>(this.BASE_URL, {
        params: queryParams,
      });

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
      console.error("Error fetching badges:", error);
      throw error;
    }
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(id: string): Promise<Badge> {
    try {
      const response = await http.get<ApiResponse<Badge>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch badge");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badge:", error);
      throw error;
    }
  }

  /**
   * Get badge by type
   */
  static async getBadgeByType(type: string): Promise<Badge | null> {
    try {
      const response = await http.get<ApiResponse<Badge>>(
        `${this.BASE_URL}/type/${type}`,
      );

      if (!response.data.success || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badge by type:", error);
      throw error;
    }
  }

  /**
   * Get badges by category
   */
  static async getBadgesByCategory(category: string): Promise<Badge[]> {
    try {
      const response = await http.get<ApiResponse<Badge[]>>(
        `${this.BASE_URL}/category/${category}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch badges by category",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badges by category:", error);
      throw error;
    }
  }

  /**
   * Get badges by rarity
   */
  static async getBadgesByRarity(rarity: string): Promise<Badge[]> {
    try {
      const response = await http.get<ApiResponse<Badge[]>>(
        `${this.BASE_URL}/rarity/${rarity}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch badges by rarity",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badges by rarity:", error);
      throw error;
    }
  }

  /**
   * Get visible badges only
   */
  static async getVisibleBadges(): Promise<Badge[]> {
    try {
      const response = await http.get<ApiResponse<Badge[]>>(
        `${this.BASE_URL}/visible/all`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch visible badges",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching visible badges:", error);
      throw error;
    }
  }

  /**
   * Get obtainable badges only
   */
  static async getObtainableBadges(): Promise<Badge[]> {
    try {
      const response = await http.get<ApiResponse<Badge[]>>(
        `${this.BASE_URL}/obtainable/all`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch obtainable badges",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching obtainable badges:", error);
      throw error;
    }
  }

  /**
   * Update badge
   */
  static async updateBadge(
    id: string,
    updateBadgeDto: UpdateBadgeDto,
  ): Promise<Badge> {
    try {
      const response = await http.patch<ApiResponse<Badge>>(
        `${this.BASE_URL}/${id}`,
        updateBadgeDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update badge");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating badge:", error);
      throw error;
    }
  }

  /**
   * Delete badge
   */
  static async deleteBadge(id: string): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete badge");
      }
    } catch (error) {
      console.error("Error deleting badge:", error);
      throw error;
    }
  }

  /**
   * Assign badge to entity
   */
  static async assignBadge(
    assignBadgeDto: AssignBadgeDto,
  ): Promise<BadgeAssignment> {
    try {
      const response = await http.post<ApiResponse<BadgeAssignment>>(
        `${this.BASE_URL}/assign`,
        assignBadgeDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to assign badge");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error assigning badge:", error);
      throw error;
    }
  }

  /**
   * Revoke badge assignment
   */
  static async revokeBadge(
    assignmentId: string,
    revokeBadgeDto: RevokeBadgeDto,
  ): Promise<BadgeAssignment> {
    try {
      const response = await http.patch<ApiResponse<BadgeAssignment>>(
        `${this.BASE_URL}/assign/${assignmentId}/revoke`,
        revokeBadgeDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to revoke badge");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error revoking badge:", error);
      throw error;
    }
  }

  /**
   * Get badge assignments with filters
   */
  static async getBadgeAssignments(
    params?: GetBadgeAssignmentDto,
  ): Promise<BadgeAssignmentListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.fields && params.fields.length > 0) {
        queryParams.fields = params.fields;
      }
      if (params?.badgeId) queryParams.badgeId = params.badgeId;
      if (params?.entityType) queryParams.entityType = params.entityType;
      if (params?.entityId) queryParams.entityId = params.entityId;
      if (params?.statuses && params.statuses.length > 0) {
        queryParams.statuses = params.statuses;
      }
      if (params?.isVisible !== undefined) {
        queryParams.isVisible = params.isVisible;
      }
      if (params?.isManuallyRevokable !== undefined) {
        queryParams.isManuallyRevokable = params.isManuallyRevokable;
      }
      if (params?.assignedBy) queryParams.assignedBy = params.assignedBy;
      if (params?.revokedBy) queryParams.revokedBy = params.revokedBy;
      if (params?.assignedFrom) queryParams.assignedFrom = params.assignedFrom;
      if (params?.assignedTo) queryParams.assignedTo = params.assignedTo;
      if (params?.expiresFrom) queryParams.expiresFrom = params.expiresFrom;
      if (params?.expiresTo) queryParams.expiresTo = params.expiresTo;
      if (params?.revokedFrom) queryParams.revokedFrom = params.revokedFrom;
      if (params?.revokedTo) queryParams.revokedTo = params.revokedTo;

      const response = await http.get<ApiResponseOffset<BadgeAssignment>>(
        `${this.BASE_URL}/assignments`,
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
      console.error("Error fetching badge assignments:", error);
      throw error;
    }
  }

  /**
   * Get badges assigned to a specific entity
   */
  static async getEntityBadges(
    entityType: string,
    entityId: string,
  ): Promise<BadgeAssignment[]> {
    try {
      const response = await http.get<ApiResponse<BadgeAssignment[]>>(
        `${this.BASE_URL}/entity/${entityType}/${entityId}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch entity badges",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching entity badges:", error);
      throw error;
    }
  }

  /**
   * Get badge assignment by ID
   */
  static async getBadgeAssignment(
    assignmentId: string,
  ): Promise<BadgeAssignment | null> {
    try {
      const response = await http.get<ApiResponse<BadgeAssignment>>(
        `${this.BASE_URL}/assignments/${assignmentId}`,
      );

      if (!response.data.success || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badge assignment:", error);
      throw error;
    }
  }

  /**
   * Check if an entity has a specific badge
   */
  static async hasBadge(
    entityType: string,
    entityId: string,
    badgeType: string,
  ): Promise<boolean> {
    try {
      const response = await http.get<ApiResponse<boolean>>(
        `${this.BASE_URL}/entity/${entityType}/${entityId}/has/${badgeType}`,
      );

      if (!response.data.success) {
        return false;
      }

      return response.data.data ?? false;
    } catch (error) {
      console.error("Error checking badge:", error);
      return false;
    }
  }

  /**
   * Get badge statistics
   */
  static async getBadgeStatistics(): Promise<BadgeStatistics> {
    try {
      const response = await http.get<ApiResponse<BadgeStatistics>>(
        `${this.BASE_URL}/stats/overview`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch badge statistics",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching badge statistics:", error);
      throw error;
    }
  }

  /**
   * Clean up expired badge assignments
   */
  static async cleanupExpiredAssignments(): Promise<{ cleanedCount: number }> {
    try {
      const response = await http.post<ApiResponse<{ cleanedCount: number }>>(
        `${this.BASE_URL}/cleanup/expired`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to cleanup expired assignments",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error cleaning up expired assignments:", error);
      throw error;
    }
  }
}
