import { http } from "@/lib/http";
import type { ApiResponse, ApiResponseOffset } from "@/lib/types";
import type {
  Contribution,
  ContributionListResponse,
  CreateContributionDto,
  QueryContributionDto,
  ReviewContributionDto,
} from "@/lib/types/contributions";

/**
 * Contributions API wrapper
 * Handles all contribution-related API calls
 */
export class ContributionsAPI {
  private static readonly BASE_URL = "/contributions";

  /**
   * Get all contributions with optional filters
   */
  static async getContributions(
    params?: QueryContributionDto,
  ): Promise<ContributionListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.entityType) queryParams.entityType = params.entityType;
      if (params?.action) queryParams.action = params.action;
      if (params?.contributorId)
        queryParams.contributorId = params.contributorId;
      if (params?.entityId) queryParams.entityId = params.entityId;
      if (params?.status) queryParams.status = params.status;

      const response = await http.get<ApiResponseOffset<Contribution>>(
        this.BASE_URL,
        {
          params: queryParams,
        },
      );

      const paginationData = response.data.data;
      return {
        result: paginationData.result,
        metaData: {
          currentPage: paginationData.metaData.currentPage ?? 1,
          pageSize: paginationData.metaData.pageSize,
          totalRecords: paginationData.metaData.totalRecords ?? 0,
          totalPages: paginationData.metaData.totalPages ?? 1,
          hasNextPage: paginationData.metaData.hasNextPage ?? false,
        },
      };
    } catch (error) {
      console.error("Error fetching contributions:", error);
      throw error;
    }
  }

  /**
   * Get pending contributions (for admin review)
   */
  static async getPendingContributions(
    params?: QueryContributionDto,
  ): Promise<ContributionListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.entityType) queryParams.entityType = params.entityType;
      if (params?.action) queryParams.action = params.action;
      if (params?.contributorId)
        queryParams.contributorId = params.contributorId;
      if (params?.entityId) queryParams.entityId = params.entityId;

      const response = await http.get<ApiResponseOffset<Contribution>>(
        `${this.BASE_URL}/pending`,
        {
          params: queryParams,
        },
      );

      const paginationData = response.data.data;
      return {
        result: paginationData.result,
        metaData: {
          currentPage: paginationData.metaData.currentPage ?? 1,
          pageSize: paginationData.metaData.pageSize,
          totalRecords: paginationData.metaData.totalRecords ?? 0,
          totalPages: paginationData.metaData.totalPages ?? 1,
          hasNextPage: paginationData.metaData.hasNextPage ?? false,
        },
      };
    } catch (error) {
      console.error("Error fetching pending contributions:", error);
      throw error;
    }
  }

  /**
   * Get current user's contributions
   */
  static async getMyContributions(
    params?: QueryContributionDto,
  ): Promise<ContributionListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.entityType) queryParams.entityType = params.entityType;
      if (params?.action) queryParams.action = params.action;
      if (params?.entityId) queryParams.entityId = params.entityId;
      if (params?.status) queryParams.status = params.status;

      const response = await http.get<ApiResponseOffset<Contribution>>(
        `${this.BASE_URL}/my`,
        {
          params: queryParams,
        },
      );

      const paginationData = response.data.data;
      return {
        result: paginationData.result,
        metaData: {
          currentPage: paginationData.metaData.currentPage ?? 1,
          pageSize: paginationData.metaData.pageSize,
          totalRecords: paginationData.metaData.totalRecords ?? 0,
          totalPages: paginationData.metaData.totalPages ?? 1,
          hasNextPage: paginationData.metaData.hasNextPage ?? false,
        },
      };
    } catch (error) {
      console.error("Error fetching my contributions:", error);
      throw error;
    }
  }

  /**
   * Get contribution by ID
   */
  static async getContributionById(id: string): Promise<Contribution> {
    try {
      const response = await http.get<ApiResponse<Contribution>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch contribution",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching contribution:", error);
      throw error;
    }
  }

  /**
   * Create a new contribution
   */
  static async createContribution(
    data: CreateContributionDto,
  ): Promise<Contribution> {
    try {
      const response = await http.post<ApiResponse<Contribution>>(
        this.BASE_URL,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create contribution",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating contribution:", error);
      throw error;
    }
  }

  /**
   * Approve a contribution (admin only)
   */
  static async approveContribution(
    id: string,
    data?: ReviewContributionDto,
  ): Promise<Contribution> {
    try {
      const response = await http.patch<ApiResponse<Contribution>>(
        `${this.BASE_URL}/${id}/approve`,
        data || {},
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to approve contribution",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error approving contribution:", error);
      throw error;
    }
  }

  /**
   * Reject a contribution (admin only)
   */
  static async rejectContribution(
    id: string,
    data: ReviewContributionDto,
  ): Promise<Contribution> {
    try {
      if (!data.rejectionReason) {
        throw new Error("Rejection reason is required");
      }

      const response = await http.patch<ApiResponse<Contribution>>(
        `${this.BASE_URL}/${id}/reject`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to reject contribution",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error rejecting contribution:", error);
      throw error;
    }
  }
}
