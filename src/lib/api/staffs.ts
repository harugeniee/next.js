import { http } from "@/lib/http";
import type { Staff } from "@/lib/interface/staff.interface";
import type {
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  QueryParamsWithCursor,
} from "@/lib/types";
import type {
  CreateStaffDto,
  GetStaffDto,
  LinkCharactersDto,
  StaffListResponse,
  StaffStatistics,
  UpdateCharacterRoleDto,
  UpdateStaffDto,
} from "@/lib/types/staffs";

/**
 * Query Staff Cursor DTO
 * For cursor-based pagination
 */
export interface QueryStaffCursorDto extends QueryParamsWithCursor {
  seriesId?: string;
  characterId?: string;
}

/**
 * Staffs API wrapper
 * Handles all staff-related API calls
 */
export class StaffsAPI {
  private static readonly BASE_URL = "/staffs";

  /**
   * Get all staffs with cursor pagination
   * Better for real-time feeds and infinite scroll
   * Supports filtering by seriesId and characterId via query parameters
   * @param params Cursor pagination parameters
   */
  static async getStaffsCursor(
    params?: QueryStaffCursorDto,
  ): Promise<ApiResponseCursor<Staff>> {
    const response = await http.get<ApiResponseCursor<Staff>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Create a new staff member
   */
  static async createStaff(createStaffDto: CreateStaffDto): Promise<Staff> {
    try {
      const response = await http.post<ApiResponse<Staff>>(
        this.BASE_URL,
        createStaffDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create staff");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  }

  /**
   * Get all staffs with optional filters (admin)
   */
  static async getStaffs(params?: GetStaffDto): Promise<StaffListResponse> {
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
      if (params?.gender) queryParams.gender = params.gender;
      if (params?.language) queryParams.language = params.language;
      if (params?.occupation) queryParams.occupation = params.occupation;
      if (params?.characterIds && params.characterIds.length > 0) {
        queryParams.characterIds = params.characterIds;
      }
      if (params?.seriesId) queryParams.seriesId = params.seriesId;
      if (params?.myAnimeListId) queryParams.myAnimeListId = params.myAnimeListId;
      if (params?.aniListId) queryParams.aniListId = params.aniListId;

      const response = await http.get<ApiResponseOffset<Staff>>(this.BASE_URL, {
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
      console.error("Error fetching staffs:", error);
      throw error;
    }
  }

  /**
   * Get staff by ID
   */
  static async getStaffById(id: string): Promise<Staff> {
    try {
      const response = await http.get<ApiResponse<Staff>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch staff");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  }

  /**
   * Update staff
   */
  static async updateStaff(
    id: string,
    updateStaffDto: UpdateStaffDto,
  ): Promise<Staff> {
    try {
      const response = await http.patch<ApiResponse<Staff>>(
        `${this.BASE_URL}/${id}`,
        updateStaffDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update staff");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  }

  /**
   * Delete staff
   */
  static async deleteStaff(id: string): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  }

  /**
   * Link characters to a staff member
   */
  static async linkCharacters(
    id: string,
    linkCharactersDto: LinkCharactersDto,
  ): Promise<void> {
    try {
      const response = await http.post<ApiResponse<{ message: string }>>(
        `${this.BASE_URL}/${id}/characters`,
        linkCharactersDto,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to link characters to staff",
        );
      }
    } catch (error) {
      console.error("Error linking characters to staff:", error);
      throw error;
    }
  }

  /**
   * Update a character role for a staff member
   */
  static async updateCharacterRole(
    staffId: string,
    characterStaffId: string,
    data: UpdateCharacterRoleDto,
  ): Promise<void> {
    try {
      const response = await http.patch<ApiResponse<{ message: string }>>(
        `${this.BASE_URL}/${staffId}/characters/${characterStaffId}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update character role",
        );
      }
    } catch (error) {
      console.error("Error updating character role:", error);
      throw error;
    }
  }

  /**
   * Remove a character role from a staff member
   */
  static async removeCharacterRole(
    staffId: string,
    characterStaffId: string,
  ): Promise<void> {
    try {
      await http.delete(
        `${this.BASE_URL}/${staffId}/characters/${characterStaffId}`,
      );
    } catch (error) {
      console.error("Error removing character role:", error);
      throw error;
    }
  }

  /**
   * Get staff with reactions
   * Fetches staff details along with reaction counts
   */
  static async getStaffWithReactions(
    id: string,
    kinds?: string[],
  ): Promise<Staff> {
    try {
      const params: Record<string, unknown> = {};
      if (kinds && kinds.length > 0) {
        params.kinds = kinds.join(",");
      }

      const response = await http.get<ApiResponse<Staff>>(
        `${this.BASE_URL}/${id}/reactions`,
        { params },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch staff with reactions",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching staff with reactions:", error);
      throw error;
    }
  }

  /**
   * Get staff statistics (if endpoint exists)
   * Note: This endpoint might not exist on backend yet
   */
  static async getStaffStatistics(): Promise<StaffStatistics> {
    try {
      const response = await http.get<ApiResponse<StaffStatistics>>(
        `${this.BASE_URL}/stats/overview`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch staff statistics",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching staff statistics:", error);
      throw error;
    }
  }
}

